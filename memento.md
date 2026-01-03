# Memento: Vehicle Scraper Project Summary

## 1. Project Overview
This project is a web scraper built with Node.js and TypeScript. Its purpose is to extract vehicle data from car dealership websites. It was designed to be modular, allowing for different parsing and fetching strategies for each supported site.

## 2. Final Architecture
*   **Stack**: The project uses Node.js, TypeScript, `axios` (for simple sites), `puppeteer-extra` with `puppeteer-extra-plugin-stealth` (for complex, JavaScript-heavy sites), `@xmldom/xmldom` for DOM parsing, and `xpath` for querying.
*   **Modular Structure**: The core logic is separated from site-specific parsers. Each supported site has its own directory under `src/sites/`, containing `searchParser.ts` and `detailParser.ts`.
*   **Dynamic Fetching**: The main entry point (`src/index.ts`) acts as a router. It dynamically determines which fetching strategy to use (`axios` or Puppeteer) based on the target site, ensuring efficiency for simple sites while retaining power for complex ones.

## 3. Project Status

### `autohousemotors.com.au`
*   **Status**: **Fully Functional**.
*   **Fetcher**: Uses `axios` for fast and reliable HTML fetching.
*   **Parsers**: Both `search` and `detail` scrapers are stable and successfully extract all required data fields.

### `motorsvibes.com`
*   **Status**: **Partially Functional**.
*   **Fetcher**: Uses `puppeteer-extra` with the stealth plugin to handle JavaScript rendering and bypass basic anti-scraping measures.
*   **Search Scraper**: This scraper is working but has shown some inconsistency, likely due to the site's anti-scraping measures. It successfully extracts a list of vehicles.
*   **Detail Scraper**: This scraper is **non-functional**. The detail pages employ advanced scraper detection that causes Puppeteer to time out or fail, even with the stealth plugin. This proved to be the project's biggest technical challenge.

## 4. Key Technical Decisions & Challenges
*   **Initial `axios` Failure**: The initial `axios`-based approach failed on modern, JavaScript-rendered websites like `motorsvibes.com`, which necessitated a move to a headless browser solution.
*   **Puppeteer & Anti-Scraping**: Basic Puppeteer was also blocked, leading to the adoption of `puppeteer-extra` and the `puppeteer-extra-plugin-stealth`. This was successful for the search page of `motorsvibes.com` but not the detail page.
*   **Refactoring for Multi-Site & Multi-Fetcher**: A significant refactoring effort was undertaken to create a modular system. This involved:
    *   Creating the `src/sites` directory.
    *   Modifying `src/index.ts` to act as a router.
    *   Splitting `src/http/fetchHtml.ts` to provide both `axios` and Puppeteer fetchers.
*   **Final Outcome**: The project successfully delivers a working scraper for `autohousemotors.com.au` and a partially working one for `motorsvibes.com`. The code demonstrates a robust architecture for handling different types of target sites and provides clear documentation of the challenges faced.

## 5. Final Command-Line Usage

```bash
# General Usage
npm run scrape -- <site> <mode> <url>

# Autohouse Motors (Working)
npm run scrape -- autohousemotors search http://autohousemotors.com.au/Used-Cars-For-Sale
npm run scrape -- autohousemotors detail <vehicle-url>

# Motors Vibes (Search works, Detail fails)
npm run scrape -- motorsvibes search https://www.motorsvibes.com/used-cars/