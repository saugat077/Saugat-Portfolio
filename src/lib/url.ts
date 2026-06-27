const SAFE_PROTOCOLS = new Set(['http:', 'https:', 'mailto:'])

export function safeUrl(url: string | null | undefined): string | undefined {
  if (!url) return undefined
  try {
    const parsed = new URL(url)
    return SAFE_PROTOCOLS.has(parsed.protocol) ? url : undefined
  } catch {
    return undefined
  }
}
