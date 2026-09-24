export function sanitizeDashes(text: string): string {
  return text.replace(/—/g, ",").replace(/–/g, "-")
}
