'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'

export default function Nav() {
  const pathname = usePathname()
  const isHome = pathname === '/'
  const isBooks = pathname === '/books' || pathname.startsWith('/books/')
  const isProjects = pathname === '/projects' || pathname.startsWith('/projects/')
  const isBlogs = pathname === '/blogs' || pathname.startsWith('/blogs/')

  const [open, setOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)

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

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8)
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  const links: { href: string; label: string; active: boolean }[] = [
    { href: '/', label: 'About', active: isHome },
    { href: '/projects', label: 'Projects', active: isProjects },
    { href: '/books', label: 'Books', active: isBooks },
    { href: '/blogs', label: 'Blogs', active: isBlogs },
  ]

  return (
    <>
      <header
        id="site-header"
        className={`fixed top-0 left-0 right-0 z-50 bg-base/70 backdrop-blur-xl backdrop-saturate-150 transition-shadow duration-300 ease-out ${
          scrolled ? 'shadow-[0_1px_24px_rgb(0_0_0/0.45)]' : 'shadow-none'
        }`}
      >
        <div className="max-w-[1440px] mx-auto px-[13.5px]">
          <div className="max-w-[864px] mx-auto px-[13.5px] flex items-center justify-between h-[54px] sm:h-[60px]">
            <Link href="/" className="press focusable flex items-center py-1" aria-label="Home">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src="/images/emblem.svg" alt="" className="h-[28px] sm:h-[34px] w-auto" />
            </Link>

            {/* Desktop nav */}
            <nav className="hidden sm:flex items-center gap-4 sm:gap-5" aria-label="Primary navigation">
              {links.map((link) => (
                <div key={link.href} className="relative">
                  <Link
                    href={link.href}
                    className={`press focusable tap text-ui ${
                      link.active
                        ? 'font-bold text-accent-soft'
                        : 'font-medium text-white hover:text-accent-soft'
                    }`}
                    aria-current={link.active ? 'page' : undefined}
                  >
                    {link.label}
                  </Link>
                  <span
                    className={`absolute bottom-1.5 left-1/2 -translate-x-1/2 block w-1 h-1 rounded-full transition-opacity ${
                      link.active ? 'bg-accent-soft opacity-100' : 'opacity-0'
                    }`}
                  ></span>
                </div>
              ))}
            </nav>

            {/* Mobile hamburger button */}
            <button
              id="mobile-menu-btn"
              type="button"
              onClick={() => setOpen((v) => !v)}
              className="press focusable sm:hidden flex flex-col items-center justify-center gap-[5px] w-11 h-11 shrink-0 -mr-1.5"
              aria-label={open ? 'Close menu' : 'Open menu'}
              aria-expanded={open}
              aria-controls="mobile-menu"
            >
              <span
                className={`block w-5 h-[2px] bg-white rounded-full transition-[translate,rotate,scale,opacity] duration-200 ease-out origin-center ${
                  open ? 'translate-y-[7px] rotate-45' : ''
                }`}
              ></span>
              <span
                className={`block w-5 h-[2px] bg-white rounded-full transition-[translate,rotate,scale,opacity] duration-200 ease-out ${
                  open ? 'opacity-0 scale-x-0' : ''
                }`}
              ></span>
              <span
                className={`block w-5 h-[2px] bg-white rounded-full transition-[translate,rotate,scale,opacity] duration-200 ease-out origin-center ${
                  open ? '-translate-y-[7px] -rotate-45' : ''
                }`}
              ></span>
            </button>
          </div>
        </div>

        {/* Fading bluish underline   brightest in the centre, transparent at the ends */}
        <div
          aria-hidden="true"
          className={`absolute bottom-0 left-0 right-0 h-px transition-opacity duration-300 ease-out ${
            scrolled ? 'opacity-100' : 'opacity-0'
          }`}
          style={{
            background:
              'linear-gradient(to right, transparent, rgba(168, 85, 247, 0.5), transparent)',
          }}
        />
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
        {links.map((link) => (
          <Link
            key={link.href}
            href={link.href}
            onClick={() => setOpen(false)}
            tabIndex={open ? undefined : -1}
            aria-current={link.active ? 'page' : undefined}
            className={`press focusable tap text-menu ${
              link.active ? 'text-accent-soft' : 'text-white hover:text-accent-soft'
            }`}
          >
            {link.label}
          </Link>
        ))}
      </nav>
    </>
  )
}
