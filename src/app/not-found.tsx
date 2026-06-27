import Link from 'next/link'
import Nav from '@/components/Nav'

export default function NotFound() {
  return (
    <>
      <Nav />
      <main className="max-w-[760px] mx-auto px-6 xl:px-0 pt-[120px] sm:pt-[160px] pb-24 flex flex-col items-start gap-4">
        <h1 className="font-display text-[64px] sm:text-[96px] text-white leading-none">404</h1>
        <p className="font-body text-[16px] sm:text-[19px] text-[#a1a1aa]">
          This page wandered off. Let&apos;s get you back home.
        </p>
        <Link
          href="/"
          className="inline-flex items-center gap-1.5 font-body text-[14px] text-[#71717a] hover:text-white transition-colors mt-2"
        >
          <svg
            className="w-3.5 h-3.5"
            viewBox="0 0 16 16"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            aria-hidden="true"
          >
            <path d="M10 12L6 8l4-4" />
          </svg>
          Back to home
        </Link>
      </main>
    </>
  )
}
