import { DOMParser } from '@xmldom/xmldom';
import xpath from 'xpath';

export function parseHtml(html: string): Document {
  return new DOMParser({
    errorHandler: {
      warning: () => {},
      error: () => {}
    }
  }).parseFromString(html);
}

export function selectText(node: Node, expr: string): string | null {
  const result = xpath.select1(expr, node) as Node | undefined;
  return result?.textContent?.trim() ?? null;
}

export function selectAll(node: Node, expr: string): Node[] {
  return xpath.select(expr, node) as Node[];
}
