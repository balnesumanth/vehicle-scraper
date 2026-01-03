import { VehicleDetail } from '../../types/detail.types';
import { parseHtml, selectAll, selectText } from '../../utils/xpathHelpers';

export function parseDetailPage(html: string): VehicleDetail {
  const doc = parseHtml(html);

  /**
   * Extracts a specification value given its label.
   * Based on the provided HTML, it finds a div with the label's text
   * and assumes the value is in the immediately following sibling div.
   */
  const getSpec = (label: string): string | undefined => {
    // Example HTML for a label: <div class="elementor-heading-title elementor-size-default">Stock #</div>
    // This XPath finds the div containing the exact label text, then gets the text of the next div.
    const xpath = `//div[normalize-space()='${label}']/following-sibling::div[1]`;
    const value = selectText(doc, xpath);
    return value?.trim();
  };

  /* -----------------------------
      PRICE EXTRACTION
  ----------------------------- */
  const priceHeading = selectText(doc, "//h6[contains(text(), '$')]");
  const price = priceHeading ? Number(priceHeading.replace(/[^0-9]/g, '')) : undefined;

  /* -----------------------------
      TITLE EXTRACTION
  ----------------------------- */
  const title = selectText(doc, "//div[contains(@class, 'elementor-element-30e9b27c')]//h2") || 
                selectText(doc, "//h2[contains(@class, 'elementor-heading-title')][2]") ||
                'Unknown Vehicle';

  /* -----------------------------
      IMAGES EXTRACTION
  ----------------------------- */
  const images = selectAll(doc, "//div[contains(@class, 'slider-galeria')]//img/@src")
    .map(n => n.nodeValue ?? "")
    .filter(src => src.startsWith('http') && !src.includes('logo'))
    .filter((v, i, a) => a.indexOf(v) === i);

  /* -----------------------------
      DESCRIPTION EXTRACTION
  ----------------------------- */
  const description = selectAll(doc, "//div[contains(@class,'elementor-widget-theme-post-content')]//p")
    .map(p => p.textContent?.trim() ?? "")
    .filter(Boolean)
    .join('\n\n');

  /* -----------------------------
      SPECS EXTRACTION
  ----------------------------- */
  const odoRaw = getSpec('Kilometers');

  return {
    title: title.trim(),
    price,
    odometer: odoRaw ? Number(odoRaw.replace(/\D/g, '')) : undefined,
    transmission: getSpec('Transmission'),
    bodyType: getSpec('Body Style'),
    engine: getSpec('Engine'),
    driveType: getSpec('Drive'),
    // vin: undefined, // VIN not available on this site
    stockNumber: getSpec('Stock #'),
    registration: getSpec('Registration Plate'),
    description,
    images
  };
}
