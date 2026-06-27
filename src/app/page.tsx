import Nav from '@/components/Nav'
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
      <Nav />

      <main className="max-w-[1440px] mx-auto">
        <div className="max-w-[760px] mx-auto px-6 xl:px-0 pt-[68px] sm:pt-[96px] pb-12 flex flex-col gap-16 sm:gap-28">
          {/* Hero and About are tightly grouped — use inner gap instead of the outer gap-20 */}
          <div className="flex flex-col gap-4 sm:gap-5">
            <Hero />
            <About />
          </div>
          <BookReview />
          <Experience />
          <Affiliations />
          <Projects />
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
