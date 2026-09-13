import ArrowLink from './ArrowLink'

const CONTACTS = [
  { label: 'LinkedIn', href: 'https://www.linkedin.com/in/saugat-kc77/' },
  { label: 'Email', href: 'mailto:ksaugat77@gmail.com' },
  { label: 'Github', href: 'https://github.com/saugat077' },
] as const

/**
 * Cherry blossoms, positioned as percentages of the 1459×476 Figma frame.
 * `w` is a percentage too, so the whole arrangement scales with the footer
 * instead of drifting out of place at intermediate widths.
 */
const BLOSSOMS = [
  { src: '/images/blossoms/left-large.webp', x: 0, y: 33.2, w: 18.4 },
  { src: '/images/blossoms/center-mid.webp', x: 17.9, y: 22.7, w: 3.9 },
  { src: '/images/blossoms/center-small.webp', x: 24.1, y: 20.8, w: 2.8 },
  { src: '/images/blossoms/bottom-mid.webp', x: 29.7, y: 74.2, w: 3 },
  { src: '/images/blossoms/right-mid.webp', x: 67.2, y: 22.3, w: 4 },
  { src: '/images/blossoms/right-large.webp', x: 76.8, y: 11.1, w: 23.2 },
  { src: '/images/blossoms/bottom-right.webp', x: 76.8, y: 87.1, w: 4.2 },
] as const

export default function Footer() {
  // #contact is the hero's "Contact Me" target; scroll-mt keeps the fixed
  // header off "Let's Keep in Touch" when the jump lands.
  return (
    <footer id="contact" className="relative overflow-hidden scroll-mt-24">
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

      {/* Decorative: the name is already the <h1> of the page and the site
          title, so repeating it here would only add noise for screen readers. */}
      <p
        aria-hidden="true"
        className="relative text-wordmark text-center select-none pt-10 lg:pt-[46px]"
        style={{
          backgroundImage: 'linear-gradient(to bottom, #ffffff, #909090)',
          WebkitBackgroundClip: 'text',
          backgroundClip: 'text',
          color: 'transparent',
        }}
      >
        SAUGATKC
      </p>

      <p className="relative text-lead font-normal text-muted text-center pb-12 lg:pb-[50px]">
        Copyright &copy; {new Date().getFullYear()} - Made by Saugat
      </p>
    </footer>
  )
}
