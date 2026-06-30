import type { Metadata } from 'next'
import './globals.css'

const description =
  'Portfolio of Saugat K.C. - QA Engineer by profession, Designer by instinct. Specialising in UK payroll compliance testing and UI/UX design. Based in Kathmandu, Nepal.'

export const metadata: Metadata = {
  metadataBase: new URL('https://saugatkc77.com.np'),
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
    url: 'https://saugatkc77.com.np',
    type: 'website',
    images: ['https://saugatkc77.com.np/images/og-preview.png'],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Saugat K.C. | Portfolio',
    images: ['https://saugatkc77.com.np/images/og-preview.png'],
  },
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className="bg-base min-h-screen text-white antialiased overflow-x-hidden">
        <div className="relative z-10">{children}</div>
      </body>
    </html>
  )
}
