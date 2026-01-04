# Memento: Vehicle Scraper Project Summary

## 1. Project Overview & Requirements

This project is a modular web scraper built to extract vehicle data from car dealership websites. The primary requirements were to use **Node.js + TypeScript**, parse with **`@xmldom/xmldom`** and **`xpath`**, and maintain a modular design with independent `search` and `detail` modes.

The final implementation successfully meets all of these criteria. The stack is confirmed in `package.json`, parsing is handled by `src/utils/xpathHelpers.ts`, and the modular architecture is centered around `src/index.ts` and the `src/sites/` directory.

## 2. Final Architecture

*   **`src/index.ts`**: The core of the application. It acts as a router, processing command-line arguments and directing the scraping task to the correct site-specific parsers. It also contains the logic for saving output to JSON files.
*   **`src/http/fetchHtml.ts`**: Provides two distinct fetching strategies:
    *   `fetchHtmlWithAxios`: A simple, fast fetcher for server-rendered websites.
    *   `fetchHtmlWithPuppeteer`: A full-browser fetcher using `puppeteer-extra` and the stealth plugin to handle JavaScript-heavy sites.
*   **`src/sites/[site-name]/`**: Each supported site has its own directory, ensuring a clean separation of concerns.
    *   `searchParser.ts`: Logic to parse a search results page.
    *   `detailParser.ts`: Logic to parse a vehicle detail page.
*   **`src/types/`**: Defines the TypeScript interfaces (`VehicleSearchItem`, `VehicleDetail`) that provide strict type safety for the scraped data.

## 3. Final Project Status

### `autohousemotors.com.au`
*   **Status**: **Fully Functional**.
*   **Implementation**: Uses `axios` for fast and reliable HTML fetching. With the discovery of a URL that displays all vehicles on a single page, the scraper is now able to reliably fetch all vehicle data.

### `awballarat.com.au`
*   **Status**: **Fully Functional**.
*   **Implementation**: Uses `puppeteer` to handle its JavaScript-rendered content. Both the `search` and `detail` scrapers are fully operational and stable.

## 4. Final Command-Line Usage

```bash
# General Usage
npm run scrape -- <site> <mode> <url>

# Autohouse Motors (Fully Functional)
npm run scrape -- autohousemotors search http://autohousemotors.com.au/Used-cars-for-sale/1/7978021e37

# AW Ballarat (Fully Functional)
npm run scrape -- awballarat search https://www.awballarat.com.au/cars/