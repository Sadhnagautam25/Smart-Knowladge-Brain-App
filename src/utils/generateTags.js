export function generateTags(text) {
  if (!text || text.trim().length < 10) {
    return ["general"];
  }

  const stopWords = [
    "the",
    "is",
    "in",
    "and",
    "of",
    "to",
    "a",
    "for",
    "on",
    "with",
    "this",
    "that",
  ];

  const words = text
    .toLowerCase()
    .replace(/[^\w\s]/g, "")
    .split(/\s+/);

  const filtered = words.filter((w) => w.length > 3 && !stopWords.includes(w));

  return [...new Set(filtered)].slice(0, 5);
}
