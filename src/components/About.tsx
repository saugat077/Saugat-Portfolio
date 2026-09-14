import { client } from '@/lib/sanity'
import { escapeHtml } from '@/lib/portableText'
import OrbitIcons from './OrbitIcons'

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

export default async function About() {
  const settings = await client.fetch<SiteSettings | null>(
    `*[_type == "siteSettings"][0] { bioQuote }`
  )

  return (
    <section className="relative mx-auto w-full max-w-[1141px] min-h-[304px] lg:min-h-[340px] flex items-center justify-center">
      <OrbitIcons />

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
