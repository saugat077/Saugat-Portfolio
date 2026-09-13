import type { ReactNode } from 'react'
import Nav from '@/components/Nav'
import Hero from '@/components/Hero'
import About from '@/components/About'
import Projects from '@/components/Projects'
import Blogs from '@/components/Blogs'
import BeyondWork from '@/components/BeyondWork'
import Books from '@/components/Books'
import Footer from '@/components/Footer'
import { SITE_URL } from '@/lib/site'

const personSchema = {
  '@context': 'https://schema.org',
  '@type': 'Person',
  name: 'Saugat KC',
  alternateName: ['saugatkc', 'Saugat KC77'],
  url: SITE_URL,
  image: `${SITE_URL}/images/profile.png`,
  jobTitle: 'QA Engineer',
  description:
    'Saugat works at Qniverse',
  address: {
    '@type': 'PostalAddress',
    addressLocality: 'Kathmandu',
    addressCountry: 'NP',
  },
  sameAs: [
    'https://www.linkedin.com/in/saugat-kc77/',
    'https://github.com/saugat077',
    'https://www.chess.com/member/brainbrainboom',
  ],
}

/**
 * The 951px reading column the design centres inside the 1440px canvas. The
 * About statement and the footer deliberately sit outside it — both bleed
 * wider than the text — so the column is applied per section rather than once
 * around the whole page.
 */
function Column({ children }: { children: ReactNode }) {
  return (
    <div className="px-gutter">
      <div className="max-w-[951px] mx-auto">{children}</div>
    </div>
  )
}

export default function Home() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(personSchema) }}
      />

      <Nav />

      {/* Full-bleed: no max-width and no auto margins, so the decorative layers
          that run past the reading column — the hero wash, the icon orbit, the
          footer blossoms — reach the viewport edge on wide displays instead of
          being cut off at a 1440px box. overflow-x-clip still contains them. */}
      <main className="w-full overflow-x-clip pt-[144px] lg:pt-[151px]">
        <div className="flex flex-col gap-[135px] lg:gap-[168px]">
          <Column>
            <Hero />
          </Column>

          <About />

          <Column>
            <Projects />
          </Column>

          <Column>
            <Blogs />
          </Column>

          <Column>
            <BeyondWork />
          </Column>

          <Column>
            <Books />
          </Column>

          <Footer />
        </div>
      </main>
    </>
  )
}
