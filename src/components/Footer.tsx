import ArrowLink from './ArrowLink'

const CONTACTS = [
  { label: 'LinkedIn', href: 'https://www.linkedin.com/in/saugat-kc77/' },
  { label: 'Email', href: 'mailto:ksaugat77@gmail.com' },
  { label: 'Github', href: 'https://github.com/saugat077' },
] as const

/**
 * Cherry blossoms. `x` and `w` stay percentages of the 1459px Figma frame
 * width, but `y` is a percentage of the wordmark's own line box, which is why
 * they hang off "SAUGATKC" rather than off the footer.
 *
 * The footer's height moves with how the paragraph wraps — four lines on a
 * phone against two on a laptop — so percentages of it landed the whole
 * arrangement high on mobile. The wordmark's height is just its font size, and
 * the blossoms hug it in both Figma frames, so it is the stable anchor.
 * Negative and >100% values are the point: most of the set sits outside it.
 */
const BLOSSOMS = [
  { src: '/images/blossoms/left-large.webp', x: 0, y: -27.9, w: 18.4 },
  { src: '/images/blossoms/center-mid.webp', x: 17.9, y: -55.9, w: 3.9 },
  { src: '/images/blossoms/center-small.webp', x: 24.1, y: -60.9, w: 2.8 },
  { src: '/images/blossoms/bottom-mid.webp', x: 29.7, y: 81, w: 3 },
  { src: '/images/blossoms/right-mid.webp', x: 67.2, y: -57, w: 4 },
  { src: '/images/blossoms/right-large.webp', x: 76.8, y: -86.6, w: 23.2 },
  { src: '/images/blossoms/bottom-right.webp', x: 76.8, y: 115.1, w: 4.2 },
] as const

export default function Footer() {
  // #contact is the hero's "Contact Me" target; scroll-mt keeps the fixed
  // header off "Let's Keep in Touch" when the jump lands.
  return (
    <footer id="contact" className="relative overflow-hidden scroll-mt-24">
      <div className="relative px-gutter">
        <div className="mx-auto flex max-w-[542px] flex-col items-center gap-8 text-center">
          <div className="flex flex-col gap-4">
            <h2 className="text-display text-chalk">Let&rsquo;s Keep in Touch</h2>
            <p className="text-lead font-normal text-muted">
              Stay updated on my latest projects, insights and offerings. Whether you have
              questions, need advice or just want to chat, don&rsquo;t hesitate to reach out!
            </p>
          </div>

          <div className="flex flex-wrap items-center justify-center gap-x-[26px] gap-y-3">
            {CONTACTS.map((contact) => (
              <ArrowLink key={contact.label} href={contact.href}>
                {contact.label}
              </ArrowLink>
            ))}
          </div>
        </div>
      </div>

      {/* The spacing sits on the outer div so the inner one measures exactly the
          wordmark, which is what the blossoms are positioned against. */}
      <div className="pt-10 lg:pt-[46px]">
        <div className="relative">
          {BLOSSOMS.map((blossom) => (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              key={blossom.src}
              src={blossom.src}
              alt=""
              aria-hidden="true"
              loading="lazy"
              decoding="async"
              className="absolute pointer-events-none select-none"
              style={{ left: `${blossom.x}%`, top: `${blossom.y}%`, width: `${blossom.w}%` }}
            />
          ))}

          {/* Decorative: the name is already the <h1> of the page and the site
              title, so repeating it here would only add noise for screen readers. */}
          <p
            aria-hidden="true"
            className="relative text-wordmark text-center select-none"
            style={{
              backgroundImage: 'linear-gradient(to bottom, #ffffff, #909090)',
              WebkitBackgroundClip: 'text',
              backgroundClip: 'text',
              color: 'transparent',
            }}
          >
            SAUGATKC
          </p>
        </div>
      </div>

      <p className="relative text-lead font-normal text-muted text-center pb-12 lg:pb-[50px]">
        Copyright &copy; {new Date().getFullYear()} - Made by Saugat
      </p>
    </footer>
  )
}
