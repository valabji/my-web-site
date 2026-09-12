import { useEffect, useState } from 'react';

const BOT_UA_PATTERNS = [
  /bot/i,
  /crawler/i,
  /spider/i,
  /scraper/i,
  /googlebot/i,
  /bingbot/i,
  /slurp/i,
  /duckduckbot/i,
  /baiduspider/i,
  /yandexbot/i,
  /facebot/i,
  /twitterbot/i,
  /linkedinbot/i,
  /whatsapp/i,
  /telegrambot/i,
  /slackbot/i,
  /discordbot/i,
  /redditbot/i,
  /pinterestbot/i,
  /applebot/i,
  /embedly/i,
  /quora/i,
  /vkshare/i,
  /skypeuripreview/i,
  /nuzzel/i,
  /bitlybot/i,
  /unfurl/i,
  /urlbot/i,
  /checkly/i,
  /siteaudit/i,
  /seo/i,
  /monitor/i,
  /uptime/i,
  /pingdom/i,
  /statuscake/i,
  /headless/i,
  /puppeteer/i,
  /playwright/i,
  /chromium/i,
  /electron/i,
  /phantom/i,
  /selenium/i,
  /webdriver/i,
  /prerender/i,
];

export function useIsBrowser() {
  const [isBrowser, setIsBrowser] = useState(false);

  useEffect(() => {
    const ua = navigator.userAgent;
    const isBot = BOT_UA_PATTERNS.some((pattern) => pattern.test(ua));
    setIsBrowser(!isBot);
  }, []);

  return isBrowser;
}