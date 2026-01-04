import puppeteer from 'puppeteer-extra';
import StealthPlugin from 'puppeteer-extra-plugin-stealth';
import axios from 'axios';

puppeteer.use(StealthPlugin());

export async function fetchHtmlWithPuppeteer(url: string): Promise<string> {
  const browser = await puppeteer.launch({
    headless: true,
    args: ['--no-sandbox', '--disable-setuid-sandbox', '--window-size=1920,1080']
  });
  
  const page = await browser.newPage();
  await page.setUserAgent('Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36');

  try {
    await page.goto(url, { waitUntil: 'networkidle2', timeout: 60000 });

    if (url.includes('awballarat.com.au')) {
      // Scroll down by 1000 pixels to trigger lazy-loaded images and specs
      // Using a string avoids the Node.js TypeScript 'window' reference error
      await page.evaluate('window.scrollBy(0, 1000)');
      
      // Wait for the specific content area that contains the specs
      await page.waitForSelector('.elementor-widget-theme-post-content', { timeout: 15000 }).catch(() => null);
      
      // Give the site a moment to finish its animations and loading
      await new Promise(r => setTimeout(r, 3000));
    }

    return await page.content();
  } finally {
    await browser.close();
  }
}

export async function fetchHtmlWithAxios(url: string): Promise<string> {
  const { data } = await axios.get(url, {
    headers: { 'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36' }
  });
  return data;
}
