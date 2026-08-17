import Nav from '@/components/Nav'
import Section from '@/components/Section'
import SectionDivider from '@/components/SectionDivider'
import Hero from '@/components/Hero'
import About from '@/components/About'
import BookReview from '@/components/BookReview'
import Experience from '@/components/Experience'
import CoreSkills from '@/components/CoreSkills'
import Affiliations from '@/components/Affiliations'
import Projects from '@/components/Projects'
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
    'QA Engineer specialising in UK payroll compliance testing, and a UI/UX designer, based in Kathmandu, Nepal.',
  address: {
    '@type': 'PostalAddress',
    addressLocality: 'Kathmandu',
    addressCountry: 'NP',
  },
  sameAs: [
    'https://www.linkedin.com/in/saugat-kc77/',
    'https://github.com/saugat077',
    'https://www.instagram.com/_alwaysaugat/',
    'https://www.chess.com/member/brainbrainboom',
  ],
}

const watermarkMask = {
  WebkitMaskImage: 'linear-gradient(to bottom, rgba(0,0,0,0.49) 25%, rgba(0,0,0,0) 80%)',
  maskImage: 'linear-gradient(to bottom, rgba(0,0,0,0.49) 25%, rgba(0,0,0,0) 80%)',
} as const

export default function Home() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(personSchema) }}
      />

      <Nav />

      <main className="max-w-[1440px] mx-auto overflow-x-clip px-4 sm:px-6 lg:px-0">
        <div className="max-w-[864px] mx-auto pt-[54px] sm:pt-[60px] flex flex-col">
          <Section fadeTop noTopPad>
            {/* Hero and About are tightly grouped */}
            <div className="flex flex-col gap-4 sm:gap-5">
              <Hero />
              <About />
            </div>
          </Section>
          <Section>
            <Experience />
          </Section>
          <SectionDivider />
          <Section>
            <CoreSkills />
          </Section>
          <SectionDivider />
          <Section>
            <Affiliations />
          </Section>
          <SectionDivider />
          <Section>
            <Projects />
          </Section>
          <SectionDivider />
          <Section>
            <BookReview />
          </Section>
        </div>

        {/* Decorative name watermark   only the top half is shown, sitting at the page edge */}
        <div
          className="text-wordmark text-center text-white pointer-events-none select-none overflow-hidden h-[0.8em] mt-6 sm:mt-8"
          style={watermarkMask}
          aria-hidden="true"
        >
          SAUGATKC
        </div>
      </main>
    </>
  )
}
