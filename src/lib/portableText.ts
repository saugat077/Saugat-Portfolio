import { urlFor } from './sanity'

// ── Portable Text types ──────────────────────────────────────────────────────

export interface PTSpan {
  _type: 'span'
  _key: string
  text: string
  marks?: string[]
}

export interface PTImageBlock {
  _type: 'image'
  _key: string
  asset: { _ref: string; _type: 'reference' }
}

export interface PTTextBlock {
  _type: 'block'
  _key: string
  style: string
  children: PTSpan[]
  listItem?: 'bullet' | 'number'
  level?: number
}

export type BodyBlock = PTTextBlock | PTImageBlock

// ── Helpers ──────────────────────────────────────────────────────────────────

export function escapeHtml(str: string): string {
  return str
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;')
}

/**
 * Renders an article body (book / project / blog) Portable Text array to an
 * HTML string for use with `dangerouslySetInnerHTML`. Behaviour is identical to
 * the original per-page `ptToHtml` implementations.
 */
export function renderPortableText(blocks: BodyBlock[]): string {
  const parts: string[] = []
  let currentList: 'bullet' | 'number' | null = null

  for (const block of blocks) {
    // ── Image block ──
    if (block._type === 'image') {
      if (currentList) {
        parts.push(currentList === 'bullet' ? '</ul>' : '</ol>')
        currentList = null
      }
      const src = urlFor(block).width(760).url()
      parts.push(
        `<img src="${escapeHtml(src)}" alt="" class="w-full rounded-lg my-6" loading="lazy" decoding="async" />`
      )
      continue
    }

    // ── Text block ──
    const b = block
    if (!b.children?.length) continue

    const inlineHtml = b.children
      .map((span) => {
        let t = escapeHtml(span.text)
        if (span.marks?.includes('strong')) t = `<strong class="font-semibold text-white">${t}</strong>`
        if (span.marks?.includes('em')) t = `<em class="italic">${t}</em>`
        if (span.marks?.includes('code')) t = `<code class="bg-zinc-900 text-zinc-400 px-1 rounded text-code">${t}</code>`
        return t
      })
      .join('')

    // ── List items ──
    if (b.listItem) {
      const listType = b.listItem
      if (currentList !== listType) {
        if (currentList) parts.push(currentList === 'bullet' ? '</ul>' : '</ol>')
        parts.push(
          listType === 'bullet'
            ? '<ul class="list-disc list-inside text-body text-zinc-400 space-y-2 my-4 ml-4">'
            : '<ol class="list-decimal list-inside text-body text-zinc-400 space-y-2 my-4 ml-4">'
        )
        currentList = listType
      }
      if (inlineHtml.trim()) parts.push(`<li>${inlineHtml}</li>`)
      continue
    }

    // Close any open list
    if (currentList) {
      parts.push(currentList === 'bullet' ? '</ul>' : '</ol>')
      currentList = null
    }

    if (!inlineHtml.trim()) continue

    // ── Block styles ──
    switch (b.style) {
      case 'h1':
        parts.push(`<h2 class="text-h1 text-white mt-10 mb-4">${inlineHtml}</h2>`)
        break
      case 'h2':
        parts.push(`<h2 class="text-display text-white mt-8 mb-3">${inlineHtml}</h2>`)
        break
      case 'h3':
        parts.push(`<h3 class="text-title text-white mt-6 mb-2">${inlineHtml}</h3>`)
        break
      case 'blockquote':
        parts.push(
          `<blockquote class="border-l-2 border-zinc-700 pl-4 my-4 text-body text-zinc-400 italic">${inlineHtml}</blockquote>`
        )
        break
      default:
        parts.push(
          `<p class="text-body text-zinc-300 mb-4">${inlineHtml}</p>`
        )
    }
  }

  if (currentList) parts.push(currentList === 'bullet' ? '</ul>' : '</ol>')
  return parts.join('\n')
}
