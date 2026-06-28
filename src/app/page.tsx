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
        <div className="max-w-[960px] mx-auto pt-[54px] sm:pt-[60px] flex flex-col">
          <Section fadeTop noTopPad>
            {/* Hero and About are tightly grouped */}
            <div className="flex flex-col gap-4 sm:gap-5">
              <Hero />
              <About />
            </div>
          </Section>
          <SectionDivider />
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
          <Section>
            <BookReview />
          </Section>
        </div>

        {/* Decorative name watermark — only the top half is shown, sitting at the page edge */}
        <div
          className="font-footer font-extrabold text-[64px] sm:text-[160px] leading-none text-center text-white pointer-events-none select-none overflow-hidden h-[50px] sm:h-[140px] mt-6 sm:mt-8"
          style={watermarkMask}
          aria-hidden="true"
        >
          SAUGATKC
        </div>
      </main>
    </>
  )
}
