import { VehicleSearchItem } from '../../types/search.types';
import { parseHtml, selectAll, selectText } from '../../utils/xpathHelpers';
import { extractUrl } from '../../utils/stringUtils';

export function parseSearchPage(html: string): VehicleSearchItem[] {
  const doc = parseHtml(html);

  const listings = selectAll(
    doc,
    "//div[contains(@class,'box-product')]"
  );

  const vehicles = listings.map((listing: Node) => {
    const title = selectText(listing, ".//h3") ?? '';
    const onclick = selectText(listing, ".//div[contains(@class,'more-info')]/@onclick") ?? '';
    const relativeUrl = extractUrl(onclick);
    const priceText = selectText(listing, ".//div[contains(@class,'default-price')]//h4");

    return {
      title,
      url: relativeUrl
        ? new URL(relativeUrl, 'http://autohousemotors.com.au').href
        : '',
      price: priceText
        ? Number(priceText.replace(/[^\d]/g, ''))
        : undefined
    };
  });

  return vehicles.filter(vehicle => vehicle.title);
}

