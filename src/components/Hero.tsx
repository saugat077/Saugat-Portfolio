import { client } from '@/lib/sanity'
import type { CSSProperties } from 'react'
import ArrowLink from './ArrowLink'

interface SiteSettings {
  name?: string
  title?: string
  headline?: string
  headlineLead?: string
  resumeUrl?: string
}

// Fallbacks are the Figma copy, so the page still reads correctly if the CMS
// has no siteSettings document yet.
const FALLBACK = {
  name: 'Saugat KC',
  title: 'Associate BC Developer',
  headline: 'Building enterprise software on Microsoft D365 Business Central.',
  headlineLead: 'specializing in scalable extensions, automation, integrations, and business applications.',
}

const EMPLOYERS = [
  { label: '@Qniverse', href: 'https://qniverse.co.uk' },
  { label: '@Qnipay', href: 'https://qnipay.com' },
] as const

/**
 * The cursor tags on the portrait. `x`/`y` are percentages of the 317×478
 * image box, so they ride the portrait down to its phone size; the tag itself
 * stays at its design size.
 */
const POINTERS = [
  { label: 'Philomath', icon: '/icons/pointer1.svg', fill: '#907cff', x: 85.8, y: 27.4 },
  { label: 'Product', icon: '/icons/pointer2.svg', fill: '#06bc33', x: -23.3, y: 49.4 },
] as const

/**
 * Same motion as the About stack (orbit-fly / orbit-drift in globals.css): each
 * tag rides a full-size flyer that scales out from the portrait's centre, then
 * idles. The hero is on screen at load, so it plays on mount — no observer.
 * Kept in step with FLY_MS in OrbitIcons.
 */
const FLY_MS = 2200
const POINTER_DELAY_MS = 300
const POINTER_DRIFT = [
  { x: 10, y: -8, rotate: 3, seconds: 9 },
  { x: -9, y: 7, rotate: -3, seconds: 11 },
] as const

/**
 * The design sets the headline as a small grey kicker over a large line,
 * breaking before "on". The CMS holds one string, so the break is found
 * rather than stored; a headline without " on " renders as the large line only.
 */
function splitHeadline(headline: string) {
  const at = headline.indexOf(' on ')
  return at === -1
    ? { kicker: null, main: headline }
    : { kicker: headline.slice(0, at), main: headline.slice(at + 1) }
}

export default async function Hero() {
  const settings = await client.fetch<SiteSettings | null>(
    `*[_type == "siteSettings"][0] { name, title, headline, headlineLead, resumeUrl }`
  )

  const name = settings?.name ?? FALLBACK.name
  const role = settings?.title ?? FALLBACK.title
  const { kicker, main } = splitHeadline(settings?.headline ?? FALLBACK.headline)
  const lead = settings?.headlineLead ?? FALLBACK.headlineLead

  return (
    <section>
      <div className="relative flex flex-col items-center gap-8 text-center lg:grid lg:grid-cols-[318px_317px_minmax(0,1fr)] lg:items-start lg:gap-0 lg:text-left">
        <div className="flex flex-col items-center gap-[30px] lg:items-start lg:w-[304px] lg:pt-[35px]">
          <div className="flex flex-col items-center gap-3 lg:items-start">
            <h1 className="text-display text-cream max-w-[38ch]">
              {kicker && <span className="block text-kicker text-ash pb-2">{kicker}</span>}
              {main}
            </h1>
            <p className="text-copy text-ash max-w-[313px]">{lead}</p>
          </div>
          <ArrowLink href="#projects" variant="cta">
            Explore My Work
          </ArrowLink>
        </div>

        {/* Outline and subject are baked into one asset, so the sketch can never
            drift out of register with the figure. The mask is the design's
            blurred panel over the knees, done as a fade instead. */}
        <div className="relative w-[245px] lg:w-[317px] shrink-0">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src="/images/saugat-cutout.webp"
            alt="Saugat KC"
            width={673}
            height={1011}
            fetchPriority="high"
            decoding="async"
            draggable={false}
            className="w-full h-auto select-none"
            style={{
              WebkitMaskImage: 'linear-gradient(to bottom, black 68%, transparent 97%)',
              maskImage: 'linear-gradient(to bottom, black 68%, transparent 97%)',
            }}
          />

          {POINTERS.map((pointer, i) => (
            <div
              key={pointer.label}
              aria-hidden="true"
              className="orbit-fly absolute inset-0 pointer-events-none select-none"
              style={{ animationDelay: `${POINTER_DELAY_MS + i * 150}ms`, animationDuration: `${FLY_MS}ms` }}
            >
            <div
              className="orbit-drift absolute w-[91px] h-[38px]"
              style={
                {
                  left: `${pointer.x}%`,
                  top: `${pointer.y}%`,
                  '--drift-x': `${POINTER_DRIFT[i].x}px`,
                  '--drift-y': `${POINTER_DRIFT[i].y}px`,
                  '--drift-rotate': `${POINTER_DRIFT[i].rotate}deg`,
                  animationDuration: `${POINTER_DRIFT[i].seconds}s`,
                  animationDelay: `${FLY_MS + POINTER_DELAY_MS + i * 150}ms`,
                } as CSSProperties
              }
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={pointer.icon} alt="" width={19} height={22} className="absolute -left-0.5 -top-[3px]" />
              <span
                className="absolute left-[17px] top-[15px] flex items-center justify-center w-[74px] h-[23px] rounded-full text-label text-cream"
                style={{ backgroundColor: pointer.fill }}
              >
                {pointer.label}
              </span>
            </div>
            </div>
          ))}
        </div>

        {/* Pulled back over the portrait's faded tail on phones: the mask has
            already emptied that band. */}
        <div className="-mt-9 flex flex-col items-center gap-[30px] lg:mt-0 lg:items-start lg:justify-self-end lg:w-[250px] lg:pt-[257px]">
          <div className="flex flex-col gap-3">
            <p className="text-display text-cream">{name}</p>
            <div className="text-copy text-ash">
              <p>{role}</p>
              <p>
                {EMPLOYERS.map((employer, i) => (
                  <span key={employer.label}>
                    {i > 0 && ' '}
                    <a
                      href={employer.href}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="press-inline focusable hover:text-cream"
                    >
                      {employer.label}
                    </a>
                  </span>
                ))}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-7">
            <ArrowLink href="#contact" variant="cta">
              Contact Me
            </ArrowLink>
            {settings?.resumeUrl && (
              <ArrowLink href={settings.resumeUrl} variant="cta">
                View Resume
              </ArrowLink>
            )}
          </div>
        </div>
      </div>
    </section>
  )
}
