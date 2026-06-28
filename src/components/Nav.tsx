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

  // Lock body scroll while the mobile menu is open
  useEffect(() => {
    document.body.style.overflow = open ? 'hidden' : ''
    return () => {
      document.body.style.overflow = ''
    }
  }, [open])

  const links: { href: string; label: string; active: boolean }[] = [
    { href: '/', label: 'Home', active: isHome },
    { href: '/books', label: 'Books', active: isBooks },
    { href: '/projects', label: 'Projects', active: isProjects },
    { href: '/blogs', label: 'Blogs', active: isBlogs },
  ]

  return (
    <>
      <header
        id="site-header"
        className="fixed top-0 left-0 right-0 z-50 bg-[#06030A]/50 backdrop-blur-xl backdrop-saturate-150"
      >
        <div className="max-w-[1440px] mx-auto px-[13.5px]">
          <div className="max-w-[960px] mx-auto px-[13.5px] flex items-center justify-between h-[54px] sm:h-[60px]">
            <Link
              href="/"
              className="t-display font-extrabold tracking-tighter bg-gradient-to-r from-[#a855f7] to-[#e7d2f9] bg-clip-text text-transparent leading-normal py-1"
            >
              @alwaysaugat
            </Link>

            {/* Desktop nav */}
            <nav className="hidden sm:flex items-center gap-4 sm:gap-5" aria-label="Primary navigation">
              {links.map((link) => (
                <div key={link.href} className="relative">
                  <Link
                    href={link.href}
                    className={`t-body font-bold transition-colors ${
                      link.active ? 'text-white' : 'text-white hover:text-[#a1a1aa]'
                    }`}
                  >
                    {link.label}
                  </Link>
                  <span
                    className={`absolute -bottom-2 left-1/2 -translate-x-1/2 block w-1 h-1 rounded-full transition-opacity ${
                      link.active ? 'bg-[#a855f7] opacity-100' : 'opacity-0'
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
              className="sm:hidden flex flex-col justify-center gap-[5px] w-8 h-8 shrink-0"
              aria-label="Open menu"
              aria-expanded={open}
              aria-controls="mobile-menu"
            >
              <span
                className={`block w-5 h-[2px] bg-white rounded-full transition-all duration-300 origin-center ${
                  open ? 'translate-y-[7px] rotate-45' : ''
                }`}
              ></span>
              <span
                className={`block w-5 h-[2px] bg-white rounded-full transition-all duration-300 ${
                  open ? 'opacity-0 scale-x-0' : ''
                }`}
              ></span>
              <span
                className={`block w-5 h-[2px] bg-white rounded-full transition-all duration-300 origin-center ${
                  open ? '-translate-y-[7px] -rotate-45' : ''
                }`}
              ></span>
            </button>
          </div>
        </div>

        {/* Fading bluish underline — brightest in the centre, transparent at the ends */}
        <div
          aria-hidden="true"
          className="absolute bottom-0 left-0 right-0 h-px"
          style={{
            background:
              'linear-gradient(to right, transparent, rgba(168, 85, 247, 0.5), transparent)',
          }}
        />
      </header>

      {/* Mobile full-screen menu */}
      <div
        id="mobile-menu"
        className={`sm:hidden fixed inset-0 bg-[#06030A]/80 backdrop-blur-xl z-40 flex flex-col items-center justify-center gap-10 transition-opacity duration-300 ${
          open ? 'pointer-events-auto opacity-100' : 'pointer-events-none opacity-0'
        }`}
        aria-hidden={!open}
      >
        {links.map((link) => (
          <Link
            key={link.href}
            href={link.href}
            onClick={() => setOpen(false)}
            className={`font-display text-[36px] transition-colors ${
              link.active ? 'text-[#a855f7]' : 'text-white hover:text-[#a1a1aa]'
            }`}
          >
            {link.label}
          </Link>
        ))}
      </div>
    </>
  )
}
