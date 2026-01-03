import { fetchHtmlWithPuppeteer, fetchHtmlWithAxios } from './http/fetchHtml';
import { VehicleSearchItem } from './types/search.types';
import { VehicleDetail } from './types/detail.types';

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

async function runSearch(site: string, searchUrl: string): Promise<void> {
  console.log(`\n✔ Running search on: ${searchUrl}\n`);
  const { parseSearchPage } = await getParsers(site);

  const puppeteerSites = ['motorsvibes', 'awballarat'];
  const fetcher = puppeteerSites.includes(site) ? fetchHtmlWithPuppeteer : fetchHtmlWithAxios;

  const searchHtml = await fetcher(searchUrl);
  const vehicles = parseSearchPage(searchHtml);
  
  console.log(`Found ${vehicles.length} vehicles`);
  console.log(vehicles.slice(0, 3));
}

async function runDetail(site: string, detailUrl: string): Promise<void> {
  console.log(`\n✔ Scraping detail from: ${detailUrl}\n`);
  const { parseDetailPage } = await getParsers(site);

  // CRITICAL FIX: Add 'awballarat' here so it uses Puppeteer for the detail page
  const puppeteerSites = ['motorsvibes', 'awballarat'];
  const fetcher = puppeteerSites.includes(site) ? fetchHtmlWithPuppeteer : fetchHtmlWithAxios;

  let detailHtml: string;
  try {
    detailHtml = await fetcher(detailUrl);
  } catch (err) {
    console.log('\n❌ Failed to fetch detail page.');
    return;
  }

  const detail = parseDetailPage(detailHtml);
  console.log('\n--- Vehicle Detail ---');
  console.log(detail);
  console.log('----------------------\n');
}

async function main() {
  const [site, mode, url] = process.argv.slice(2);
  if (!site || !mode || !url) return;

  if (mode === 'search') await runSearch(site, url);
  else if (mode === 'detail') await runDetail(site, url);
}

main();


