# Vehicle Scraper

This project is a modular web scraper built with Node.js and TypeScript, designed to extract vehicle data from multiple car dealership websites. It features a flexible architecture that allows for site-specific parsing logic and dynamically chooses the appropriate fetching strategy based on the target site's complexity.

## Stack

*   **Node.js**: JavaScript runtime environment.
*   **TypeScript**: Statically typed superset of JavaScript for robust, scalable code.
*   **axios**: Promise-based HTTP client for fetching content from simple, static websites.
*   **Puppeteer-Extra**: A wrapper for Puppeteer that provides additional plugins to avoid scraper detection.
*   **Puppeteer-Extra-Plugin-Stealth**: A plugin for Puppeteer-Extra that applies various evasions to prevent detection.
*   **@xmldom/xmldom**: A JavaScript implementation of the W3C DOM standard, used for parsing HTML strings.
*   **xpath**: A pure JavaScript implementation of XPath for querying the parsed HTML DOM.

## Project Structure

The project has been architected to support multiple websites, with a clear separation between the core logic and site-specific implementations.

*   `src/`: Main source code directory.
    *   `http/`:
        *   `fetchHtml.ts`: Exports two fetching functions: `fetchHtmlWithAxios` for basic HTML fetching and `fetchHtmlWithPuppeteer` for handling JavaScript-heavy sites that require a full browser environment.
    *   `sites/`: Contains the parsing logic for each supported dealership.
        *   `[site-name]/`: Each site has its own directory.
            *   `searchParser.ts`: Parses a search results page.
            *   `detailParser.ts`: Parses a vehicle detail page.
    *   `types/`: TypeScript interfaces for data structures.
        *   `search.types.ts`: Defines the `VehicleSearchItem` interface.
        *   `detail.types.ts`: Defines the `VehicleDetail` interface.
    *   `utils/`: Helper functions for string manipulation and XPath queries.
    *   `index.ts`: The main entry point. It acts as a router, processing command-line arguments to select the correct site, mode, and URL, and then executes the appropriate scraping logic.
*   `package.json`: Project dependencies and scripts.
*   `tsconfig.json`: TypeScript compiler configuration.

## Usage

The scraper is controlled via the command line and requires three arguments: `site`, `mode`, and `url`.

```bash
npm run scrape -- <site> <mode> <url>
```

*   **`site`**: The name of the dealership website to scrape (e.g., `autohousemotors`, `motorsvibes`).
*   **`mode`**: The type of page to scrape (`search` or `detail`).
*   **`url`**: The full URL of the page to scrape.

### Examples

**`autohousemotors` (Fully Supported)**

```bash
# Search for vehicles
npm run scrape -- autohousemotors search http://autohousemotors.com.au/Used-Cars-For-Sale

# Scrape a specific vehicle's details
npm run scrape -- autohousemotors detail http://autohousemotors.com.au/Used-cars-for-sale/3133798-acs.sl19-12/1/2008-mitsubishi-lancer-cj
```

**`motorsvibes` (Partially Supported)**

```bash
# Search for vehicles
npm run scrape -- motorsvibes search https://www.motorsvibes.com/used-cars/

# Scrape a specific vehicle's details (currently non-functional)
npm run scrape -- motorsvibes detail https://www.motorsvibes.com/listings/maserati-levante-2017
```

## Project Status & Challenges

### `autohousemotors.com.au`
*   **Status**: **Fully Functional**.
*   **Implementation**: This site uses simple server-side rendered HTML, so it is scraped efficiently using `axios`. Both the `search` and `detail` parsers are stable and extract all required data.

### `motorsvibes.com`
*   **Status**: **Partially Functional**.
*   **Search Scraper**: The search scraper is functional but can be inconsistent. It uses `puppeteer-extra` with the stealth plugin to bypass anti-scraping measures.
*   **Detail Scraper**: The detail scraper is **non-functional**. The site employs advanced anti-scraping techniques on its detail pages that cause Puppeteer to time out or return empty data, even with the stealth plugin enabled.
*   **Challenges**: The primary challenge with this site is its dynamic, JavaScript-dependent nature and sophisticated anti-bot detection. While the search page was successfully accessed, the detail page remains inaccessible, highlighting the cat-and-mouse game of modern web scraping.