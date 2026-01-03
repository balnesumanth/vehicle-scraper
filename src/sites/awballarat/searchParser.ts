import { VehicleSearchItem } from '../../types/search.types';
import { parseHtml, selectAll, selectText } from '../../utils/xpathHelpers';

export function parseSearchPage(html: string): VehicleSearchItem[] {
  const doc = parseHtml(html);

  const listings = selectAll(doc, "//article");

  return listings.map((listing: Node) => {
    const title = selectText(listing, ".//h4/a") ?? '';
    const url = selectText(listing, ".//h4/a/@href") ?? '';
    const priceText =
      selectText(
        listing,
        ".//div[contains(@class, 'elementor-widget-text-editor')]"
      ) ?? '';

    return {
      title,
      url: url ? new URL(url, 'https://www.awballarat.com.au').href : '',
      price: priceText
        ? Number(priceText.replace(/[^\d.]/g, ''))
        : undefined
    };
  });
}