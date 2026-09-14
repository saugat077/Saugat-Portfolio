'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'

const LINKS = [
  { href: '/', label: 'Home' },
  { href: '/blogs', label: 'Blogs' },
  { href: '/books', label: 'Books' },
] as const

// Rendered as masks rather than <img>, so a single PNG glyph can take the
// link's colour on hover instead of shipping a second, lighter file.
const SOCIALS = [
  { label: 'LinkedIn', href: 'https://www.linkedin.com/in/saugat-kc77/', icon: '/icons/linkedin.png' },
  { label: 'GitHub', href: 'https://github.com/saugat077', icon: '/icons/github.png' },
  { label: 'Email', href: 'mailto:ksaugat77@gmail.com', icon: '/icons/mail.png' },
] as const

function maskStyle(icon: string) {
  return {
    maskImage: `url(${icon})`,
    WebkitMaskImage: `url(${icon})`,
    maskSize: 'contain',
    WebkitMaskSize: 'contain',
    maskRepeat: 'no-repeat',
    WebkitMaskRepeat: 'no-repeat',
    maskPosition: 'center',
    WebkitMaskPosition: 'center',
  } as const
}

export default function Nav() {
  const pathname = usePathname()
  const [open, setOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)

  // The bar frosts over once the page has moved under it. Reading scrollY in a
  // passive listener rather than observing a sentinel: the state is a boolean,
  // so React bails out of every event but the two that flip it.
  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24)
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  useEffect(() => {
    if (!open) return

    const content = document.querySelector('main')
    document.body.style.overflow = 'hidden'
    content?.setAttribute('inert', '')

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') setOpen(false)
    }
    const wide = window.matchMedia('(min-width: 40rem)')
    const onWide = () => {
      if (wide.matches) setOpen(false)
    }

    document.addEventListener('keydown', onKeyDown)
    wide.addEventListener('change', onWide)
    onWide()

    return () => {
      document.body.style.overflow = ''
      content?.removeAttribute('inert')
      document.removeEventListener('keydown', onKeyDown)
      wide.removeEventListener('change', onWide)
    }
  }, [open])

  const isActive = (href: string) =>
    href === '/' ? pathname === '/' : pathname === href || pathname.startsWith(`${href}/`)

  return (
    <>
      {/* Transparent at rest, glass once scrolled — no edge, the blur is the
          only thing marking where the bar ends. */}
      <header
        id="site-header"
        data-scrolled={scrolled || undefined}
        className={`fixed top-0 left-0 right-0 z-50 transition-colors duration-300 ${
          scrolled ? 'bg-base/60 backdrop-blur-xs' : 'bg-transparent'
        }`}
      >
        <div className="w-full px-gutter">
          <div className="relative max-w-[951px] mx-auto h-14 sm:h-[58px] flex items-center">
            <Link
              href="/"
              className="press focusable flex items-center py-1 shrink-0"
              aria-label="Home"
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src="/images/emblem.svg" alt="" className="h-[26px] w-auto" />
            </Link>

            {/* Centred on the full bar rather than in the leftover space, so the
                links stay put no matter how wide the social cluster gets. */}
            <nav
              className="hidden sm:flex absolute left-1/2 -translate-x-1/2 items-center gap-4"
              aria-label="Primary navigation"
            >
              {LINKS.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  aria-current={isActive(link.href) ? 'page' : undefined}
                  className="focusable text-nav text-white transition-[color,transform] duration-200 hover:text-accent motion-safe:hover:scale-[1.2]"
                >
                  {link.label}
                </Link>
              ))}
            </nav>

            {/* The design's 28px box / 7px gap / 15px glyph, taken up by the same
                1.25x as the links. The negative margin cancels the box's padding
                so the last glyph still lands on the right rail. */}
            <div className="hidden sm:flex items-center gap-[9px] ml-auto -mr-[8px]">
              {SOCIALS.map((social) => (
                <a
                  key={social.label}
                  href={social.href}
                  {...(social.href.startsWith('mailto:')
                    ? {}
                    : { target: '_blank', rel: 'noopener noreferrer' })}
                  aria-label={social.label}
                  className="press focusable group flex items-center justify-center size-[35px]"
                >
                  <span
                    aria-hidden="true"
                    className="size-[19px] bg-white transition-colors duration-200 group-hover:bg-accent"
                    style={maskStyle(social.icon)}
                  />
                </a>
              ))}
            </div>

            {/* Mobile hamburger button */}
            <button
              id="mobile-menu-btn"
              type="button"
              onClick={() => setOpen((v) => !v)}
              className="press focusable sm:hidden ml-auto flex flex-col items-center justify-center gap-[6px] w-11 h-11 shrink-0 -mr-1.5"
              aria-label={open ? 'Close menu' : 'Open menu'}
              aria-expanded={open}
              aria-controls="mobile-menu"
            >
              <span
                className={`block w-[25px] h-[2px] bg-white rounded-full transition-[translate,rotate,scale,opacity] duration-200 ease-out origin-center ${
                  open ? 'translate-y-[8px] rotate-45' : ''
                }`}
              ></span>
              <span
                className={`block w-[25px] h-[2px] bg-white rounded-full transition-[translate,rotate,scale,opacity] duration-200 ease-out ${
                  open ? 'opacity-0 scale-x-0' : ''
                }`}
              ></span>
              <span
                className={`block w-[25px] h-[2px] bg-white rounded-full transition-[translate,rotate,scale,opacity] duration-200 ease-out origin-center ${
                  open ? '-translate-y-[8px] -rotate-45' : ''
                }`}
              ></span>
            </button>
          </div>
        </div>

      </header>

      {/* Mobile full-screen menu */}
      <nav
        id="mobile-menu"
        aria-label="Primary navigation"
        aria-hidden={!open}
        onClick={() => setOpen(false)}
        style={{ transformOrigin: 'calc(100% - 43px) 27px' }}
        className={`sm:hidden fixed inset-0 bg-base/80 z-40 flex flex-col items-center justify-center gap-10 transition-[opacity,scale,backdrop-filter] duration-300 ease-out ${
          open
            ? 'pointer-events-auto opacity-100 scale-100 backdrop-blur-xl'
            : 'pointer-events-none opacity-0 scale-[0.96] backdrop-blur-none'
        }`}
      >
        {LINKS.map((link) => (
          <Link
            key={link.href}
            href={link.href}
            onClick={() => setOpen(false)}
            tabIndex={open ? undefined : -1}
            aria-current={isActive(link.href) ? 'page' : undefined}
            className={`press focusable tap text-menu ${
              isActive(link.href) ? 'text-accent-soft' : 'text-white hover:text-accent-soft'
            }`}
          >
            {link.label}
          </Link>
        ))}

        <div className="flex items-center gap-6 pt-4">
          {SOCIALS.map((social) => (
            <a
              key={social.label}
              href={social.href}
              {...(social.href.startsWith('mailto:')
                ? {}
                : { target: '_blank', rel: 'noopener noreferrer' })}
              tabIndex={open ? undefined : -1}
              aria-label={social.label}
              className="press focusable group flex items-center justify-center size-11"
            >
              <span
                aria-hidden="true"
                className="size-5 bg-white transition-colors duration-200 group-hover:bg-accent"
                style={maskStyle(social.icon)}
              />
            </a>
          ))}
        </div>
      </nav>
    </>
  )
}
