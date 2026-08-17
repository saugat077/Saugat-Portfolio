import type { Metadata } from 'next'
import { Bitcount_Single, Bricolage_Grotesque } from 'next/font/google'
import { SITE_URL } from '@/lib/site'
import './globals.css'

// Fonts are loaded here rather than with `@import url(...)` in globals.css: the
// CSS pipeline strips remote imports, so that stylesheet never reached the
// browser. next/font self-hosts the files and exposes them as CSS variables
// that globals.css maps onto the --font-* theme tokens.
const bricolage = Bricolage_Grotesque({
  subsets: ['latin'],
  axes: ['opsz'],
  display: 'swap',
  variable: '--font-bricolage',
})

const bitcount = Bitcount_Single({
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-bitcount-single',
})

const description =
  'Portfolio of Saugat K.C. - QA Engineer by profession, Designer by instinct. Specialising in UK payroll compliance testing and UI/UX design. Based in Kathmandu, Nepal.'

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: 'Saugat K.C. | Portfolio',
  description,
  icons: {
    icon: [
      { url: '/favicon.svg', type: 'image/svg+xml' },
      { url: '/favicon.ico', sizes: 'any' },
    ],
  },
  openGraph: {
    title: 'Saugat K.C. | Portfolio',
    description,
    url: SITE_URL,
    type: 'website',
    images: [`${SITE_URL}/images/og-preview.png`],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Saugat K.C. | Portfolio',
    images: [`${SITE_URL}/images/og-preview.png`],
  },
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${bricolage.variable} ${bitcount.variable}`}>
      <body className="bg-base min-h-screen text-white antialiased overflow-x-hidden">
        <div className="relative z-10">{children}</div>
      </body>
    </html>
  )
}
