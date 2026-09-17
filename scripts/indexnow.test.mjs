import assert from 'node:assert/strict'
import { mkdtempSync, mkdirSync, readFileSync, rmSync, writeFileSync } from 'node:fs'
import os from 'node:os'
import path from 'node:path'
import test from 'node:test'
import { prepareDelta } from './indexnow.mjs'

const site = 'https://valabji.com'

function writeSite(root, pages) {
  mkdirSync(root, { recursive: true })
  writeFileSync(path.join(root, 'sitemap.xml'),
    `<urlset>${Object.entries(pages).map(([route, page]) =>
      `<url><loc>${site}${route}</loc><lastmod>${page.lastmod}</lastmod></url>`
    ).join('')}</urlset>`)
  for (const [route, page] of Object.entries(pages)) {
    if (!page.html) continue
    const file = path.join(root, route === '/' ? '' : route.slice(1), 'index.html')
    mkdirSync(path.dirname(file), { recursive: true })
    writeFileSync(file, page.html)
  }
}

test('submits only added, rendered-content-changed, and deleted sitemap URLs', () => {
  const temp = mkdtempSync(path.join(os.tmpdir(), 'indexnow-test-'))
  try {
    const previous = path.join(temp, 'previous')
    const current = path.join(temp, 'current')
    const output = path.join(temp, 'delta.json')
    writeSite(previous, {
      '/': { lastmod: '2026-09-01', html: '<link rel="stylesheet" href="/old.css"><script type="module" src="/old.js"></script><h1>Home</h1>' },
      '/about': { lastmod: '2026-09-02', html: '<h1>Old biography</h1>' },
      '/removed': { lastmod: '2026-09-03', html: '<h1>Removed</h1>' },
    })
    writeSite(current, {
      '/': { lastmod: '2026-09-17', html: '<link rel="stylesheet" href="/new.css"><script type="module" src="/new.js"></script><h1>Home</h1>' },
      '/about': { lastmod: '2026-09-17', html: '<h1>New biography</h1>' },
      '/added': { lastmod: '2026-09-17', html: '<h1>Added</h1>' },
    })

    const changes = prepareDelta(previous, current, output, '2026-09-17')
    assert.deepEqual(changes, {
      added: [`${site}/added`],
      changed: [`${site}/about`],
      deleted: [`${site}/removed`],
    })
    assert.deepEqual(JSON.parse(readFileSync(output, 'utf8')).urlList,
      [`${site}/about`, `${site}/added`, `${site}/removed`])
    const sitemap = readFileSync(path.join(current, 'sitemap.xml'), 'utf8')
    assert.match(sitemap, /<loc>https:\/\/valabji.com\/<\/loc><lastmod>2026-09-01<\/lastmod>/)
    assert.match(sitemap, /<loc>https:\/\/valabji.com\/about<\/loc><lastmod>2026-09-17<\/lastmod>/)
  } finally {
    rmSync(temp, { recursive: true, force: true })
  }
})
