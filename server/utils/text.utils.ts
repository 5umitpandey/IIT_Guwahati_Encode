export function normalize(text: string) {
  return text.replace(/\s+/g, " ").trim().toLowerCase()
}