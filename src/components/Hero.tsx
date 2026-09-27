import { client } from '@/lib/sanity'
import ArrowLink from './ArrowLink'
import FigmaCursor from './FigmaCursor'

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
 * The cursor tags. Read the hero as a graph with its origin at the centre:
 * Philomath roams quadrant I (top right), Product quadrant III (bottom left).
 * Regions and `start` are fractions of the hero box; `start` is the tag's spot
 * in the Figma design, where it sits until the first move.
 */
const POINTERS = [
  {
    label: 'Philomath',
    icon: '/icons/pointer1.svg',
    fill: '#907cff',
    start: { x: 0.62, y: 0.27 },
    regionX: [0.5, 1],
    regionY: [0, 0.5],
    startDelay: 300,
  },
  {
    label: 'Product',
    icon: '/icons/pointer2.svg',
    fill: '#06bc33',
    start: { x: 0.26, y: 0.49 },
    regionX: [0, 0.5],
    regionY: [0.5, 1],
    startDelay: 800,
  },
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
    // Desktop hero fills exactly one screen (minus main's 151px top padding), so
    // the next section never peeks in on tall monitors. --portrait shrinks the
    // portrait on short screens so its bottom isn't cropped; 0.62 keeps the
    // portrait (1.5× taller than wide) inside the remaining height.
    <section className="lg:min-h-[calc(100svh-151px)] lg:[--portrait:min(317px,calc((100svh-151px)*0.62))]">
      <div className="relative flex flex-col items-center gap-8 text-center lg:grid lg:grid-cols-[318px_var(--portrait)_minmax(0,1fr)] lg:items-start lg:gap-0 lg:text-left">
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
        <div className="w-[245px] lg:w-(--portrait) shrink-0">
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
        </div>

        {POINTERS.map((pointer) => (
          <FigmaCursor
            key={pointer.label}
            start={pointer.start}
            regionX={pointer.regionX}
            regionY={pointer.regionY}
            startDelay={pointer.startDelay}
          >
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={pointer.icon} alt="" width={19} height={22} className="absolute -left-0.5 -top-[3px]" />
            <span
              className="absolute left-[17px] top-[15px] flex items-center justify-center w-[74px] h-[23px] rounded-full text-label text-cream"
              style={{ backgroundColor: pointer.fill }}
            >
              {pointer.label}
            </span>
          </FigmaCursor>
        ))}

        {/* Pulled back over the portrait's faded tail on phones: the mask has
            already emptied that band. */}
        <div className="-mt-9 flex flex-col items-center gap-[30px] lg:mt-0 lg:items-start lg:justify-self-end lg:w-[250px] lg:pt-[calc(var(--portrait)*0.81)]">
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
