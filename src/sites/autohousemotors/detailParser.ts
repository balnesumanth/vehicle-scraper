import { VehicleDetail } from '../../types/detail.types';
import { parseHtml, selectAll, selectText } from '../../utils/xpathHelpers';

export function parseDetailPage(html: string): VehicleDetail {
  const doc = parseHtml(html);

  // HELPER: Defined inside to have access to 'doc'
  const getTableData = (label: string): string => {
    const nodes = selectAll(doc, `//th[contains(., '${label}')]/following-sibling::td//b`);
    // Use textContent which is available on Node, and join multiple results (like for body type)
    return nodes.map(node => node.textContent || '').join(' ').trim();
  };

  const title = selectText(doc, "//h1") ?? 'Unknown Vehicle';
  const priceRaw = selectText(doc, "//span[contains(@class, 'price')]") || selectText(doc, "//div[contains(@class,'price')]//h2");
  
  const odometerRaw = getTableData('Kilometres');

  return {
    title: title.trim(),
    // Logic: Remove all non-digits, then convert to Number. Fallback to undefined if empty.
    price: priceRaw ? Number(priceRaw.replace(/\D/g, '')) : undefined,
    odometer: odometerRaw ? Number(odometerRaw.replace(/\D/g, '')) : undefined,
    
    stockNumber: getTableData('Stock Number'),
    transmission: getTableData('Transmission'),
    bodyType: getTableData('Body Type'),
    driveType: getTableData('Drive Type'),
    engine: getTableData('Engine'),
    vin: getTableData('VIN'),
    registration: getTableData('Reg. Plate'),
    
    // Description often resides in meta tags or a specific div
    description: selectText(doc, "//div[contains(@class, 'description-text')]") 
              || selectText(doc, "//meta[@name='description']/@content") 
              || '',
              
    // Standardizing image extraction
    images: selectAll(doc, "//img[contains(@src, 'show_photo.asp')]/@src")
            .map(node => 'https:' + (node.nodeValue || ''))
            .filter(src => src !== 'https:')
  };
}