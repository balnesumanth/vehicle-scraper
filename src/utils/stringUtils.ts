export function extractUrl(text: string): string | null {
  const match = text.match(/'([^']*)'/);
  return match ? match[1] ?? null : null;
}