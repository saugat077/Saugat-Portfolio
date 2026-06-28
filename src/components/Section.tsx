// Wraps a home section with vertical "rails" (left/right borders via a gradient
// border-image) that are bright at the top and bottom — the divider crossings —
// and fade toward the middle, mirroring how the horizontal dividers fade. This
// makes every divider×rail intersection read as a bright "+".
//
// fadeTop / fadeBottom ease the rail in/out at the page ends (first/last section)
// so the rails don't start/stop abruptly where there's no crossing.

type SectionProps = {
  children: React.ReactNode
  className?: string
  fadeTop?: boolean
  fadeBottom?: boolean
}

const BRIGHT = 'rgba(110,150,215,0.45)'

export default function Section({
  children,
  className = '',
  fadeTop = false,
  fadeBottom = false,
}: SectionProps) {
  const top = fadeTop ? 'transparent' : BRIGHT
  const bottom = fadeBottom ? 'transparent' : BRIGHT
  return (
    <div
      className={`px-6 py-8 sm:py-10 border-x border-solid border-transparent ${className}`}
      style={{
        borderImage: `linear-gradient(to bottom, ${top}, transparent 35%, transparent 65%, ${bottom}) 1`,
      }}
    >
      {children}
    </div>
  )
}
