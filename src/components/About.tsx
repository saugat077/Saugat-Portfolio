import { client } from '@/lib/sanity'
import { escapeHtml } from '@/lib/portableText'

interface PTSpan {
  _type: 'span'
  text: string
}

interface PTBlock {
  _type: string
  children?: PTSpan[]
}

interface SiteSettings {
  bioQuote?: PTBlock[] | null
}

const FALLBACK_STATEMENT =
  '<p>Experience across ERP system development, Quality Assurance &amp; Web Design. Focused on building software that is reliable, practical, and easy to use.</p>'

function ptToHtml(blocks: PTBlock[] | null | undefined): string {
  if (!blocks?.length) return FALLBACK_STATEMENT
  return blocks
    .map((block) => {
      if (block._type !== 'block') return ''
      const inner = (block.children ?? []).map((span) => escapeHtml(span.text)).join('')
      return `<p>${inner}</p>`
    })
    .join('')
}

/**
 * The tools orbiting the statement. `x`/`y` are percentages of the 1141×340
 * Figma frame; `size` is that frame's icon width in px. Widths are clamped so
 * the icons stay legible once the frame is narrower than a laptop, instead of
 * shrinking to specks alongside text that has its own floor.
 */
const ORBIT = [
  { src: '/icons/stack/al-extension.png', alt: 'AL', x: 8.5, y: 8.3, size: 42, rotate: -16 },
  { src: '/icons/stack/claude-code.png', alt: 'Claude Code', x: 33.3, y: 0, size: 36, rotate: 10 },
  { src: '/icons/stack/business-central.png', alt: 'Business Central', x: 69.5, y: 3.7, size: 46, rotate: 0 },
  { src: '/icons/stack/typescript.png', alt: 'TypeScript', x: 95.2, y: 27.7, size: 45, rotate: 16 },
  { src: '/icons/stack/postman.png', alt: 'Postman', x: 0, y: 52.5, size: 41, rotate: -11 },
  { src: '/icons/stack/react.png', alt: 'React', x: 87.3, y: 71.3, size: 66, rotate: -12 },
  { src: '/icons/stack/figma.png', alt: 'Figma', x: 20.8, y: 78.2, size: 29, rotate: -18 },
  { src: '/icons/stack/xls.png', alt: 'Excel', x: 57.8, y: 86, size: 37, rotate: -20 },
] as const

const FRAME_WIDTH = 1141

export default async function About() {
  const settings = await client.fetch<SiteSettings | null>(
    `*[_type == "siteSettings"][0] { bioQuote }`
  )

  return (
    <section className="relative mx-auto w-full max-w-[1141px] min-h-[304px] lg:min-h-[340px] flex items-center justify-center">
      {ORBIT.map((icon) => (
        // eslint-disable-next-line @next/next/no-img-element
        <img
          key={icon.src}
          src={icon.src}
          alt=""
          aria-hidden="true"
          loading="lazy"
          decoding="async"
          className="absolute -translate-x-1/2 -translate-y-1/2 pointer-events-none select-none"
          style={{
            left: `${icon.x}%`,
            top: `${icon.y}%`,
            width: `clamp(${Math.round(icon.size * 0.73)}px, ${(
              (icon.size / FRAME_WIDTH) *
              100
            ).toFixed(2)}%, ${icon.size}px)`,
            rotate: `${icon.rotate}deg`,
          }}
        />
      ))}

      {/* The gutter lives on the wrapper, not on the statement: with both on one
          element the 469px cap was measuring the padding box, leaving the text
          only 361px and breaking it a line early. */}
      <div className="relative w-full px-gutter flex justify-center">
        <div
          className="text-display sheen text-center max-w-[469px] [&>p]:m-0"
          dangerouslySetInnerHTML={{ __html: ptToHtml(settings?.bioQuote) }}
        />
      </div>
    </section>
  )
}
