export function sanitizeDashes(text: string): string {
  return text
    .replace(/\s*—\s*/g, ", ")
    .replace(/\s+–\s+/g, " - ")
    .replace(/(\d)–(\d)/g, "$1-$2")
}
