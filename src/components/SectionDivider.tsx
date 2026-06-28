// Horizontal divider between home sections, with a symmetric "+" at each rail
// crossing. The main line spans the column and is brightest at the rails; short
// horizontal arms cross outward past each rail, and matching vertical arms run
// up/down through each crossing — same length as the horizontal arms — so the
// "+" reads as four balanced, fading arms.

// Bright at each rail, fading to transparent toward the centre.
const mainLine = {
  background:
    'linear-gradient(to right, rgba(110,150,215,0.45), transparent 30%, transparent 70%, rgba(110,150,215,0.45))',
} as const

// Horizontal arms — extend a short way past each rail and fade out softly.
const armLeft = {
  background: 'linear-gradient(to left, rgba(110,150,215,0.3), transparent)',
} as const

const armRight = {
  background: 'linear-gradient(to right, rgba(110,150,215,0.3), transparent)',
} as const

// Vertical arms — centred on each crossing, bright in the middle and fading
// up/down so the "+" is symmetric with the horizontal arms.
const armVertical = {
  background: 'linear-gradient(to bottom, transparent, rgba(110,150,215,0.3), transparent)',
} as const

export default function SectionDivider() {
  return (
    <div aria-hidden="true" className="relative h-px pointer-events-none" style={mainLine}>
      {/* horizontal arms cross each rail into the margin */}
      <div className="absolute top-0 right-full h-px w-40 sm:w-56" style={armLeft} />
      <div className="absolute top-0 left-full h-px w-40 sm:w-56" style={armRight} />
      {/* vertical arms run through each crossing — same length as the horizontal arms */}
      <div
        className="absolute left-0 top-1/2 w-px h-40 sm:h-56 -translate-x-1/2 -translate-y-1/2"
        style={armVertical}
      />
      <div
        className="absolute right-0 top-1/2 w-px h-40 sm:h-56 translate-x-1/2 -translate-y-1/2"
        style={armVertical}
      />
    </div>
  )
}
