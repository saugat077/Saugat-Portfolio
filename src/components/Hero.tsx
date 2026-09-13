import { client } from '@/lib/sanity'
import ArrowLink from './ArrowLink'

interface SiteSettings {
  name?: string
  title?: string
  headline?: string
  headlineLead?: string
  resumeUrl?: string
}

// Fallbacks are the Figma copy, so the page still reads correctly if the CMS
// has no siteSettings document yet. The sub-line is segmented because the design
// sets three words of it in semibold; a plain CMS string renders as one
// unemphasised segment.
const FALLBACK = {
  name: 'Saugat KC',
  title: 'Associate QA Engineer',
  headline: 'Building enterprise software on Microsoft D365 Business Central.',
}

const FALLBACK_LEAD = [
  { text: 'specializing in scalable ' },
  { text: 'extensions, automation, ', strong: true },
  { text: 'integrations, and business applications.' },
]

const EMPLOYERS = [
  { label: '@Qniverse', href: 'https://qniverse.co.uk' },
  { label: '@Qnipay', href: 'https://qnipay.com' },
] as const

export default async function Hero() {
  const settings = await client.fetch<SiteSettings | null>(
    `*[_type == "siteSettings"][0] { name, title, headline, headlineLead, resumeUrl }`
  )

  const name = settings?.name ?? FALLBACK.name
  const role = settings?.title ?? FALLBACK.title
  const headline = settings?.headline ?? FALLBACK.headline
  const lead = settings?.headlineLead ? [{ text: settings.headlineLead }] : FALLBACK_LEAD

  return (
    <section className="relative">
      {/* Violet wash bleeding off the top-right corner, behind the header. A
          radial anchored past the corner rather than a rotated band: the band
          swings out of frame at viewport widths the design never covered. */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -top-[260px] left-1/2 -translate-x-1/2 w-[130vw] h-[440px] blur-[60px]"
        style={{
          background:
            'radial-gradient(115% 100% at 82% 6%, rgba(166, 63, 255, 0.85) 0%, rgba(166, 63, 255, 0.34) 42%, rgba(166, 63, 255, 0) 72%)',
        }}
      />

      <div className="relative flex flex-col items-center gap-8 text-center lg:grid lg:grid-cols-[319px_minmax(0,1fr)_233px] lg:items-start lg:gap-0 lg:text-left">
        <h1 className="text-display text-white max-w-[38ch] lg:pt-[42px]">
          {headline}
          <span className="block text-lead font-normal text-muted pt-[15px]">
            {lead.map((segment) => (
              <span key={segment.text} className={segment.strong ? 'font-semibold' : undefined}>
                {segment.text}
              </span>
            ))}
          </span>
        </h1>

        {/* Outline and subject are baked into one asset, so the sketch can never
            drift out of register with the figure. The mask is the design's
            blurred panel over the knees, done as a fade instead. */}
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src="/images/saugat-cutout.webp"
          alt="Saugat KC"
          width={673}
          height={1011}
          fetchPriority="high"
          decoding="async"
          draggable={false}
          className="w-[245px] lg:w-[336px] h-auto shrink-0 select-none lg:-mx-4 lg:-mt-2"
          style={{
            WebkitMaskImage: 'linear-gradient(to bottom, black 68%, transparent 97%)',
            maskImage: 'linear-gradient(to bottom, black 68%, transparent 97%)',
          }}
        />

        <div className="flex flex-col items-center gap-4 lg:items-end lg:pt-[185px]">
          <div className="flex flex-col lg:text-right">
            <p className="text-display text-white">{name}</p>
            <p className="text-ui font-normal text-muted pt-[15px]">{role}</p>
            <p className="text-ui font-normal text-muted">
              {EMPLOYERS.map((employer, i) => (
                <span key={employer.label}>
                  {i > 0 && ' '}
                  <a
                    href={employer.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="press-inline focusable underline hover:text-white"
                  >
                    {employer.label}
                  </a>
                </span>
              ))}
            </p>
          </div>

          <div className="flex items-center gap-4">
            <ArrowLink href="#contact">Contact Me</ArrowLink>
            {settings?.resumeUrl && <ArrowLink href={settings.resumeUrl}>View Resume</ArrowLink>}
          </div>
        </div>
      </div>
    </section>
  )
}
