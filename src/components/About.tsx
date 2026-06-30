import { client } from '@/lib/sanity'
import { escapeHtml } from '@/lib/portableText'

interface PTSpan {
  _type: 'span'
  text: string
  marks?: string[]
}

interface PTMarkDef {
  _key: string
  _type: string
}

interface PTBlock {
  _type: string
  children?: PTSpan[]
  markDefs?: PTMarkDef[]
}

interface SiteSettings {
  bioQuote?: PTBlock[] | null
}

function ptToHtml(blocks: PTBlock[] | null | undefined): string {
  if (!blocks?.length) return '<p>Be not afraid of greatness.</p>'
  return blocks
    .map((block) => {
      if (block._type !== 'block') return ''

      // Sanity custom annotations: the span's marks[] holds the markDef _key (a UUID),
      // not the annotation type name. Build a lookup set of keys whose _type is "highlight".
      const highlightKeys = new Set(
        (block.markDefs ?? []).filter((def) => def._type === 'highlight').map((def) => def._key)
      )

      const inner = (block.children ?? [])
        .map((span) => {
          const text = escapeHtml(span.text)

          // Match either a plain "highlight" decorator OR an annotation key reference
          const isHighlighted =
            span.marks?.includes('highlight') || span.marks?.some((m) => highlightKeys.has(m))

          return isHighlighted ? `<span class="easter-word">${text}</span>` : text
        })
        .join('')
      return `<p>${inner}</p>`
    })
    .join('')
}

const githubUrl = 'https://github.com/saugat077'
const linkedinUrl = 'https://www.linkedin.com/in/saugat-kc77/'
const emailUrl = 'mailto:ksaugat77@gmail.com'
const chessUrl = 'https://www.chess.com/member/brainbrainboom'
const instagramUrl = 'https://www.instagram.com/_alwaysaugat/'

// Social links   icons are PNGs in public/icons (black glyphs, rendered white
// via brightness-0 invert, matching the Affiliations logos).
const socials = [
  { label: 'Mail', href: emailUrl, icon: '/icons/mail.png', external: false },
  { label: 'LinkedIn', href: linkedinUrl, icon: '/icons/linkedin.png', external: true },
  { label: 'GitHub', href: githubUrl, icon: '/icons/github.png', external: true },
  { label: 'Instagram', href: instagramUrl, icon: '/icons/instagram.png', external: true },
  { label: 'Chess.com', href: chessUrl, icon: '/icons/pawn.png', external: true },
] as const

// Faded dotted horizontal rule   same dotted mask + lavender fade as the section
// dividers, but fading out toward both ends. Used above and below the social row.
const dotH = 'repeating-linear-gradient(to right, black 0 2px, transparent 2px 5px)'
const fadedRule = {
  background:
    'linear-gradient(to right, transparent, var(--color-rail-bright) 20%, var(--color-rail-bright) 80%, transparent)',
  WebkitMaskImage: dotH,
  maskImage: dotH,
} as const

export default async function About() {
  const settings = await client.fetch<SiteSettings | null>(`*[_type == "siteSettings"][0] { bioQuote }`)

  return (
    <section className="flex flex-col gap-4 sm:gap-5">
      {/* Bio quote (Portable Text   may contain .easter-word spans) */}
      <div
        className="t-body text-zinc-400 leading-relaxed text-left [&>p]:m-2"
        dangerouslySetInnerHTML={{ __html: ptToHtml(settings?.bioQuote) }}
      />

      {/* Social links   plain icon + label, bounded by faded dotted rules */}
      <div className="flex flex-col gap-4 sm:gap-5">
        <div className="h-px w-full" style={fadedRule} aria-hidden="true" />
        <div className="flex flex-wrap items-center justify-center gap-x-6 gap-y-3 sm:gap-x-9">
          {socials.map((s) => (
            <a
              key={s.label}
              href={s.href}
              {...(s.external ? { target: '_blank', rel: 'noopener noreferrer' } : {})}
              aria-label={s.label}
              className="group inline-flex items-center gap-2 text-white hover:text-accent-soft transition-colors"
            >
              {/* PNG used as a mask so the glyph takes the secondary-accent colour */}
              <span
                aria-hidden="true"
                className="w-6 h-6 sm:w-5 sm:h-5 shrink-0 bg-accent-soft transition-opacity"
                style={{
                  maskImage: `url(${s.icon})`,
                  WebkitMaskImage: `url(${s.icon})`,
                  maskSize: 'contain',
                  WebkitMaskSize: 'contain',
                  maskRepeat: 'no-repeat',
                  WebkitMaskRepeat: 'no-repeat',
                  maskPosition: 'center',
                  WebkitMaskPosition: 'center',
                }}
              />
              <span className="hidden sm:inline t-caption font-bold text-accent-soft leading-tight">
                {s.label}
              </span>
            </a>
          ))}
        </div>
        <div className="h-px w-full" style={fadedRule} aria-hidden="true" />
      </div>
    </section>
  )
}
