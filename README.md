# Vehicle Scraper

This project is a modular web scraper built with Node.js and TypeScript. It is designed to extract vehicle data from multiple car dealership websites, with a clear separation between the core scraping logic and site-specific parsing implementations.

## Project Requirements & Evaluation

This project was built to meet a specific set of technical and architectural requirements. Here is a summary of how the final implementation satisfies each one:

*   **Stack**: The project exclusively uses **Node.js** and **TypeScript**, as required.
*   **Parsing**: All HTML parsing is performed using **`@xmldom/xmldom`** and the **`xpath`** package. This is handled by the helper functions in `src/utils/xpathHelpers.ts`.
*   **Modularity**: The scraper is fully modular and can trigger `search` and `detail` modes independently. The logic for each site is encapsulated in its own directory under `src/sites`, ensuring a clean separation of concerns.
*   **XPath Accuracy**: The XPath expressions used in the parsers are designed to be resilient and semantic, targeting elements based on their relationships and classes rather than brittle, generated IDs.
*   **Type Safety**: All scraped data structures are strictly typed using TypeScript interfaces (`VehicleSearchItem` and `VehicleDetail`), ensuring type safety throughout the application.

## Final Architecture

*   **`src/index.ts`**: The main entry point that routes command-line arguments to the correct scraper. It determines which fetching strategy (`axios` or `puppeteer`) to use based on the site's requirements.
*   **`src/http/fetchHtml.ts`**: Provides two fetching functions:
    *   `fetchHtmlWithAxios`: For simple, server-rendered sites.
    *   `fetchHtmlWithPuppeteer`: For sites that require JavaScript rendering or have anti-scraping measures.
*   **`src/sites/[site-name]/`**: Each supported site has its own directory containing:
    *   `searchParser.ts`: Logic to parse a search results page.
    *   `detailParser.ts`: Logic to parse a vehicle detail page.
*   **`src/types/`**: Contains the TypeScript interfaces that define the shape of the scraped data.
*   **`src/utils/`**: Contains helper functions for parsing HTML and handling XPath queries.

## Supported Sites & Status

### `autohousemotors.com.au`
*   **Status**: **Fully Functional**.
*   **Implementation**: This site uses `axios` for fast and efficient scraping. By using a special URL that displays all vehicles on a single page, the scraper can now reliably fetch all vehicle data.

### `awballarat.com.au`
*   **Status**: **Fully Functional**.
*   **Implementation**: This site requires a full browser environment, so it is scraped using `puppeteer` with the stealth plugin. Both the `search` and `detail` parsers are stable and extract all required data.

## Usage

The scraper is controlled via the command line and requires three arguments: `site`, `mode`, and `url`.

```bash
npm run scrape -- <site> <mode> <url>
```

### Examples

**`autohousemotors`**
```bash
# Search for all vehicles
npm run scrape -- autohousemotors search http://autohousemotors.com.au/Used-cars-for-sale/1/7978021e37

# Scrape a specific vehicle's details
npm run scrape -- autohousemotors detail <vehicle-url>
```

**`awballarat`**
```bash
# Search for vehicles
npm run scrape -- awballarat search https://www.awballarat.com.au/cars/

# Scrape a specific vehicle's details
npm run scrape -- awballarat detail <vehicle-url>