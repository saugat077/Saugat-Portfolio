import Link from 'next/link'
import Nav from '@/components/Nav'

export default function NotFound() {
  return (
    <>
      <Nav />
      <main className="max-w-[760px] mx-auto px-6 xl:px-0 pt-[120px] sm:pt-[160px] pb-24 flex flex-col items-start gap-4">
        <h1 className="text-numeral text-white">404</h1>
        <p className="text-lead text-zinc-400">
          This page wandered off. Let&apos;s get you back home.
        </p>
        <Link
          href="/"
          className="inline-flex items-center gap-1.5 text-label text-zinc-500 hover:text-white transition-colors mt-2"
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
