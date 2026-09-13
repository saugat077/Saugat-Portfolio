import type { Metadata, Viewport } from 'next'
import { Geist } from 'next/font/google'
import { SITE_URL } from '@/lib/site'
import './globals.css'

// Fonts are loaded here rather than with `@import url(...)` in globals.css: the
// CSS pipeline strips remote imports, so that stylesheet never reached the
// browser. next/font self-hosts the files and exposes them as CSS variables
// that globals.css maps onto the --font-* theme tokens.
const geist = Geist({
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-geist',
})

const description =
  'Portfolio of Saugat KC.'

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: 'Saugat KC',
  description,
  alternates: { canonical: '/' },
  icons: {
    icon: [
      { url: '/favicon.svg', type: 'image/svg+xml' },
      { url: '/favicon.ico', sizes: 'any' },
    ],
  },
  openGraph: {
    title: 'Saugat KC | Portfolio',
    description,
    url: SITE_URL,
    type: 'website',
    images: [`${SITE_URL}/images/og-preview.png`],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Saugat KC | Portfolio',
    images: [`${SITE_URL}/images/og-preview.png`],
  },
}

export const viewport: Viewport = {
  themeColor: '#0a0a0a',
  colorScheme: 'dark',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={geist.variable}>
      <body className="bg-base min-h-screen text-white antialiased overflow-x-hidden">
        <a
          href="#page-content"
          className="focusable sr-only focus:not-sr-only focus:fixed focus:top-3 focus:left-3 focus:z-60 focus:rounded-md focus:bg-panel focus:px-4 focus:py-2.5 focus:text-ui focus:text-white"
        >
          Skip to content
        </a>
        <div id="page-content" tabIndex={-1} className="relative z-10">
          {children}
        </div>
      </body>
    </html>
  )
}
