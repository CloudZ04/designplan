const loadedFamilies = new Set<string>()

function encodeFamily(family: string): string {
  return family.trim().replace(/\s+/g, "+")
}

/** Use first segment before a comma as the font family (e.g. "Inter, 16px" → "Inter"). */
export function fontFamilyFromValue(value: string): string {
  return value.split(",")[0].trim()
}

export function loadGoogleFont(family: string): void {
  const trimmed = fontFamilyFromValue(family).trim()
  if (!trimmed || loadedFamilies.has(trimmed)) return

  loadedFamilies.add(trimmed)
  const encoded = encodeFamily(trimmed)
  const url = `https://fonts.googleapis.com/css2?family=${encoded}:wght@400;500;600;700&display=swap`

  const link = document.createElement("link")
  link.rel = "stylesheet"
  link.href = url
  document.head.appendChild(link)
}
