import type { ReactNode } from 'react'
import { safeUrl } from '@/lib/url'

// The diagonal arrow that trails every outbound label in the design — hero,
// footer and project cards all use it. It inherits currentColor so each call
// site only has to colour the text.
export function ArrowUpRight({ className = '' }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 10 10"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.2"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      className={`shrink-0 ${className}`}
    >
      <path d="M2 8 8 2" />
      <path d="M3.4 2H8v4.6" />
    </svg>
  )
}

type ArrowLinkProps = {
  href: string
  children: ReactNode
  /** 'cta' is the hero's Explore My Work / Contact Me / View Resume links: a
   *  a step larger. Everything else is the footer's smaller link. Both are
   *  ice-blue and accent on hover. */
  variant?: 'default' | 'cta'
}

/**
 * Label + trailing arrow. External hrefs run through safeUrl, so a malformed or
 * javascript: URL from the CMS renders as plain text rather than a live link.
 */
export default function ArrowLink({ href, children, variant = 'default' }: ArrowLinkProps) {
  const tone =
    variant === 'cta' ? 'text-ui-lg text-ice hover:text-accent' : 'text-ui text-ice hover:text-accent'
  const shared = `press-inline focusable group inline-flex items-center gap-2 ${tone}`
  const inner = (
    <>
      {children}
      <ArrowUpRight className="w-2 h-2" />
    </>
  )

  // Same-page anchors stay a plain <a>: the browser's native hash handling is
  // what we want, and safeUrl below would reject "#contact" as unparseable and
  // silently downgrade it to text.
  if (href.startsWith('#')) {
    return (
      <a href={href} className={shared}>
        {inner}
      </a>
    )
  }

  const safe = safeUrl(href)
  if (!safe)
    return (
      <span className={variant === 'cta' ? 'text-ui-lg text-ice' : 'text-ui text-ice'}>
        {children}
      </span>
    )

  return (
    <a href={safe} target="_blank" rel="noopener noreferrer" className={shared}>
      {inner}
    </a>
  )
}
