import { fetchHtmlWithPuppeteer, fetchHtmlWithAxios } from './http/fetchHtml';
import { VehicleSearchItem } from './types/search.types';
import { VehicleDetail } from './types/detail.types';
import { mkdir, writeFile } from 'fs/promises';
import path from 'path';

interface SiteParsers {
  parseSearchPage: (html: string) => VehicleSearchItem[];
  parseDetailPage: (html: string) => VehicleDetail;
}

async function getParsers(site: string): Promise<SiteParsers> {
  const module = await import(`./sites/${site}/searchParser`);
  const module2 = await import(`./sites/${site}/detailParser`);
  return {
    parseSearchPage: module.parseSearchPage,
    parseDetailPage: module2.parseDetailPage
  };
}

async function saveOutput(site: string, mode: string, data: any, url?: string): Promise<void> {
  const outputDir = path.join(process.cwd(), 'output', site, mode);
  await mkdir(outputDir, { recursive: true });

  let filename: string;
  if (mode === 'search') {
    const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
    filename = `search-results-${timestamp}.json`;
  } else if (mode === 'detail' && url) {
    // Create a slug from the last part of the URL path
    const urlSlug = new URL(url).pathname.split('/').filter(Boolean).pop() || '';
    filename = `${urlSlug.replace(/[^a-zA-Z0-9-]/g, '-') || 'vehicle'}.json`;
  } else {
    // Fallback to timestamp if no URL is provided for detail
    const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
    filename = `${timestamp}.json`;
  }

  const filepath = path.join(outputDir, filename);

  await writeFile(filepath, JSON.stringify(data, null, 2));
  console.log(`\n✔ Output saved to: ${filepath}\n`);
}

async function runSearch(site: string, searchUrl: string): Promise<void> {
  console.log(`\n✔ Running search on: ${searchUrl}\n`);
  const { parseSearchPage } = await getParsers(site);

  const puppeteerSites = ['awballarat'];
  const fetcher = puppeteerSites.includes(site) ? fetchHtmlWithPuppeteer : fetchHtmlWithAxios;

  const searchHtml = await fetcher(searchUrl);
  const allVehicles = parseSearchPage(searchHtml);
  
  await saveOutput(site, 'search', allVehicles, searchUrl);
}

async function runDetail(site: string, detailUrl: string): Promise<void> {
  console.log(`\n✔ Scraping detail from: ${detailUrl}\n`);
  const { parseDetailPage } = await getParsers(site);

  // CRITICAL FIX: Add 'awballarat' here so it uses Puppeteer for the detail page
  const puppeteerSites = ['awballarat'];
  const fetcher = puppeteerSites.includes(site) ? fetchHtmlWithPuppeteer : fetchHtmlWithAxios;

  let detailHtml: string;
  try {
    detailHtml = await fetcher(detailUrl);
  } catch (err) {
    console.log('\n❌ Failed to fetch detail page.');
    return;
  }

  const detail = parseDetailPage(detailHtml);
  await saveOutput(site, 'detail', detail, detailUrl);
}

async function main() {
  const [site, mode, url] = process.argv.slice(2);
  if (!site || !mode || !url) return;

  if (mode === 'search') await runSearch(site, url);
  else if (mode === 'detail') await runDetail(site, url);
}

main();


