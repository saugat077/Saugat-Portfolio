import Nav from '@/components/Nav'
import PulseBackground from '@/components/PulseBackground'
import Section from '@/components/Section'
import SectionDivider from '@/components/SectionDivider'
import Hero from '@/components/Hero'
import About from '@/components/About'
import BookReview from '@/components/BookReview'
import Experience from '@/components/Experience'
import Affiliations from '@/components/Affiliations'
import Projects from '@/components/Projects'

const watermarkMask = {
  WebkitMaskImage: 'linear-gradient(to bottom, rgba(0,0,0,0.49) 25%, rgba(0,0,0,0) 80%)',
  maskImage: 'linear-gradient(to bottom, rgba(0,0,0,0.49) 25%, rgba(0,0,0,0) 80%)',
} as const

export default function Home() {
  return (
    <>
      <PulseBackground />
      <Nav />

      <main className="max-w-[1440px] mx-auto overflow-x-clip px-4 sm:px-6 lg:px-0">
        <div className="max-w-[864px] mx-auto pt-[60px] sm:pt-[72px] pb-12 flex flex-col">
          <Section fadeTop className="pt-0 sm:pt-0">
            {/* Hero and About are tightly grouped */}
            <div className="flex flex-col gap-4 sm:gap-5">
              <Hero />
              <About />
            </div>
          </Section>
          <SectionDivider />
          <Section>
            <BookReview />
          </Section>
          <SectionDivider />
          <Section>
            <Experience />
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
        </div>

        {/* Decorative name watermark — centered, full word visible */}
        <div
          className="font-display text-[64px] sm:text-[160px] leading-none text-center text-white pointer-events-none select-none py-6 sm:py-8"
          style={watermarkMask}
          aria-hidden="true"
        >
          SAUGATKC
        </div>
      </main>
    </>
  )
}
