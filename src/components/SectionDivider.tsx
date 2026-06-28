// Horizontal divider between home sections, with a symmetric "+" at each rail
// crossing. The main line spans the column and is brightest at the rails; short
// horizontal arms cross outward past each rail, and matching vertical arms run
// up/down through each crossing. A repeating mask turns every line into a dotted
// pattern while the linear-gradient underneath keeps the fade.

// Repeating masks: 2px dot, 3px gap. The gradient supplies colour + fade.
const dotH = 'repeating-linear-gradient(to right, black 0 2px, transparent 2px 5px)'
const dotV = 'repeating-linear-gradient(to bottom, black 0 2px, transparent 2px 5px)'

// Bright at each rail, fading to transparent toward the centre.
const mainLine = {
  background:
    'linear-gradient(to right, var(--color-rail-bright), transparent 30%, transparent 70%, var(--color-rail-bright))',
  WebkitMaskImage: dotH,
  maskImage: dotH,
} as const

// Horizontal arms — extend a short way past each rail and fade out softly.
const armLeft = {
  background: 'linear-gradient(to left, var(--color-rail-soft), transparent)',
  WebkitMaskImage: dotH,
  maskImage: dotH,
} as const

const armRight = {
  background: 'linear-gradient(to right, var(--color-rail-soft), transparent)',
  WebkitMaskImage: dotH,
  maskImage: dotH,
} as const

// Vertical arms — centred on each crossing, bright in the middle and fading
// up/down so the "+" is symmetric with the horizontal arms.
const armVertical = {
  background: 'linear-gradient(to bottom, transparent, var(--color-rail-soft), transparent)',
  WebkitMaskImage: dotV,
  maskImage: dotV,
} as const

export default function SectionDivider() {
  return (
    <div aria-hidden="true" className="relative h-px pointer-events-none">
      {/* main line — its own child so its mask doesn't affect the arms */}
      <div className="absolute inset-0" style={mainLine} />
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
