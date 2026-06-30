// Wraps a home section with vertical "rails" that are bright at the top and
// bottom (the divider crossings) and fade toward the middle, mirroring how the
// horizontal dividers fade — so every divider×rail intersection reads as a "+".
// The rails are dotted (a repeating mask over the gradient) to match the
// dotted divider lines.
//
// fadeTop / fadeBottom ease the rail in/out at the page ends (first/last section)
// so the rails don't start/stop abruptly where there's no crossing.

type SectionProps = {
  children: React.ReactNode
  className?: string
  fadeTop?: boolean
  fadeBottom?: boolean
  /** First section (hero) — drop the top padding so the banner stays flush to the nav. */
  noTopPad?: boolean
}

const BRIGHT = 'var(--color-rail-bright)'
const dotV = 'repeating-linear-gradient(to bottom, black 0 2px, transparent 2px 5px)'

export default function Section({
  children,
  className = '',
  fadeTop = false,
  fadeBottom = false,
  noTopPad = false,
}: SectionProps) {
  const top = fadeTop ? 'transparent' : BRIGHT
  const bottom = fadeBottom ? 'transparent' : BRIGHT
  const rail = {
    background: `linear-gradient(to bottom, ${top}, transparent 35%, transparent 65%, ${bottom})`,
    WebkitMaskImage: dotV,
    maskImage: dotV,
  } as const

  return (
    <div className={`relative px-[13.5px] ${noTopPad ? 'pt-0' : 'pt-6 sm:pt-10'} pb-4 sm:pb-4 ${className}`}>
      <div className="absolute inset-y-0 left-0 w-px" style={rail} aria-hidden="true" />
      <div className="absolute inset-y-0 right-0 w-px" style={rail} aria-hidden="true" />
      {children}
    </div>
  )
}
