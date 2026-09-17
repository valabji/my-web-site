import { readFileSync, writeFileSync, existsSync } from 'node:fs'
import path from 'node:path'
import { pathToFileURL } from 'node:url'

const SITE = 'https://valabji.com'
const HOST = new URL(SITE).host
const KEY = '8a1285ae65f0491289a1be984b355a55'
const KEY_FILE = `${KEY}.txt`
const ENDPOINT = 'https://api.indexnow.org/indexnow'
const URL_ENTRY = /<url\s*>([\s\S]*?)<\/url>/g

function readSitemap(root, required = false) {
  const file = path.join(root, 'sitemap.xml')
  if (!existsSync(file)) {
    if (required) throw new Error(`Missing sitemap: ${file}`)
    return { xml: '', entries: new Map() }
  }

  const xml = readFileSync(file, 'utf8')
  const entries = new Map()
  for (const match of xml.matchAll(URL_ENTRY)) {
    const block = match[0]
    const loc = block.match(/<loc>([^<]+)<\/loc>/)?.[1]?.replaceAll('&amp;', '&')
    if (!loc) throw new Error(`Sitemap entry without <loc>: ${file}`)
    const url = new URL(loc)
    if (url.protocol !== 'https:' || url.host !== HOST || url.search || url.hash) {
      throw new Error(`Unexpected sitemap URL: ${loc}`)
    }
    if (entries.has(url.href)) throw new Error(`Duplicate sitemap URL: ${loc}`)
    entries.set(url.href, {
      block,
      lastmod: block.match(/<lastmod>([^<]+)<\/lastmod>/)?.[1],
    })
  }
  if (entries.size === 0) throw new Error(`Sitemap has no URLs: ${file}`)
  return { xml, entries }
}

function pageFile(root, url) {
  const pathname = new URL(url).pathname
  const relative = pathname === '/' ? 'index.html' : path.join(decodeURIComponent(pathname.slice(1)), 'index.html')
  const file = path.resolve(root, relative)
  if (!file.startsWith(`${path.resolve(root)}${path.sep}`)) throw new Error(`Unsafe sitemap URL: ${url}`)
  return file
}

function indexableHtml(root, url, required) {
  const file = pageFile(root, url)
  if (!existsSync(file)) {
    if (required) throw new Error(`Sitemap URL has no rendered page: ${url} (${file})`)
    return null
  }

  // A new asset hash or CSS alone does not mean the indexed page changed.
  return readFileSync(file, 'utf8')
    .replace(/<script\b(?=[^>]*\btype=["']module["'])[^>]*>[\s\S]*?<\/script>/gi, '')
    .replace(/<style\b[^>]*>[\s\S]*?<\/style>/gi, '')
    .replace(/<link\b(?=[^>]*\brel=["'](?:stylesheet|preconnect)["'])[^>]*>/gi, '')
}

export function prepareDelta(previousRoot, currentRoot, outputFile, today = new Date().toISOString().slice(0, 10)) {
  const previous = readSitemap(previousRoot)
  const current = readSitemap(currentRoot, true)
  const changes = { added: [], changed: [], deleted: [] }
  const dates = new Map()

  for (const [url, entry] of current.entries) {
    const currentHtml = indexableHtml(currentRoot, url, true)
    const oldEntry = previous.entries.get(url)
    if (!oldEntry) {
      changes.added.push(url)
      dates.set(url, today)
      continue
    }

    const oldHtml = indexableHtml(previousRoot, url, false)
    if (oldHtml !== currentHtml) {
      changes.changed.push(url)
      dates.set(url, today)
    } else {
      dates.set(url, oldEntry.lastmod || entry.lastmod || today)
    }
  }

  for (const url of previous.entries.keys()) {
    if (!current.entries.has(url)) changes.deleted.push(url)
  }

  const updatedSitemap = current.xml.replace(URL_ENTRY, (block) => {
    const loc = block.match(/<loc>([^<]+)<\/loc>/)?.[1]?.replaceAll('&amp;', '&')
    const date = dates.get(new URL(loc).href)
    return /<lastmod>[^<]*<\/lastmod>/.test(block)
      ? block.replace(/<lastmod>[^<]*<\/lastmod>/, `<lastmod>${date}</lastmod>`)
      : block.replace('</url>', `  <lastmod>${date}</lastmod>\n  </url>`)
  })
  writeFileSync(path.join(currentRoot, 'sitemap.xml'), updatedSitemap, 'utf8')

  const urlList = Object.values(changes).flat().sort()
  writeFileSync(outputFile, `${JSON.stringify({ host: HOST, key: KEY, urlList, changes }, null, 2)}\n`, 'utf8')
  console.log(`IndexNow: ${changes.added.length} added, ${changes.changed.length} changed, ${changes.deleted.length} deleted`)
  return changes
}

async function waitForPublishedSite(currentRoot) {
  const expectedSitemap = readFileSync(path.join(currentRoot, 'sitemap.xml'), 'utf8')
  for (let attempt = 0; attempt < 30; attempt++) {
    try {
      const cacheBuster = `?indexnow=${Date.now()}`
      const [sitemap, key, wwwKey] = await Promise.all([
        fetch(`${SITE}/sitemap.xml${cacheBuster}`, { cache: 'no-store', signal: AbortSignal.timeout(10000) }),
        fetch(`${SITE}/${KEY_FILE}${cacheBuster}`, { cache: 'no-store', signal: AbortSignal.timeout(10000) }),
        fetch(`https://www.valabji.com/${KEY_FILE}${cacheBuster}`, { cache: 'no-store', signal: AbortSignal.timeout(10000) }),
      ])
      if (sitemap.ok && key.ok && wwwKey.ok &&
          await sitemap.text() === expectedSitemap &&
          (await key.text()).trim() === KEY &&
          (await wwwKey.text()).trim() === KEY) return
    } catch (error) {
      console.log(`Waiting for GitHub Pages: ${error.message}`)
    }
    if (attempt < 29) await new Promise((resolve) => setTimeout(resolve, 10000))
  }
  throw new Error('The new sitemap or IndexNow key did not become available on the live site')
}

export async function submitDelta(currentRoot, inputFile) {
  const { host, key, urlList } = JSON.parse(readFileSync(inputFile, 'utf8'))
  if (host !== HOST || key !== KEY || !Array.isArray(urlList)) throw new Error('Invalid IndexNow delta file')
  if (urlList.length === 0) {
    console.log('IndexNow: no changed URLs to submit')
    return
  }

  await waitForPublishedSite(currentRoot)
  for (let offset = 0; offset < urlList.length; offset += 10000) {
    const batch = urlList.slice(offset, offset + 10000)
    const response = await fetch(ENDPOINT, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json; charset=utf-8' },
      body: JSON.stringify({ host: HOST, key: KEY, urlList: batch }),
      signal: AbortSignal.timeout(30000),
    })
    if (response.status !== 200 && response.status !== 202) {
      throw new Error(`IndexNow rejected ${batch.length} URLs: HTTP ${response.status} ${await response.text()}`)
    }
    console.log(`IndexNow: submitted ${batch.length} URLs (HTTP ${response.status})`)
  }
}

if (process.argv[1] && pathToFileURL(path.resolve(process.argv[1])).href === import.meta.url) {
  const [, , command, ...args] = process.argv
  try {
    if (command === 'prepare' && args.length === 3) prepareDelta(...args)
    else if (command === 'submit' && args.length === 2) await submitDelta(...args)
    else throw new Error('Usage: node scripts/indexnow.mjs prepare <previous-site> <dist> <delta.json> | submit <dist> <delta.json>')
  } catch (error) {
    console.error(error)
    process.exitCode = 1
  }
}
