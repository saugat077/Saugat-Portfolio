// Animated radial "pulse" background — filled circles grow from the centre
// outward and fade as they fill the screen, staggered so a new pulse is always
// emerging. Pure CSS (see .pulse-ring in globals.css), so it stays a Server
// Component and is compatible with static export.
//
// Dark bluish / navy shades — each ring a slightly different dark blue so the
// pulse reads as subtle expanding rings against the #0a0a0a page bg.

const RING_SHADES = [
  'rgba(10, 18, 44, 0.55)',
  'rgba(14, 24, 58, 0.50)',
  'rgba(20, 32, 72, 0.45)',
  'rgba(8, 14, 38, 0.55)',
  'rgba(26, 40, 86, 0.40)',
]

const DURATION = 30 // seconds — keep in sync with the .pulse-ring animation

export default function PulseBackground() {
  return (
    <div
      aria-hidden="true"
      className="pointer-events-none fixed inset-0 -z-10 overflow-hidden"
    >
      {RING_SHADES.map((color, i) => (
        <span
          key={i}
          className="pulse-ring"
          style={{
            backgroundColor: color,
            // Stagger each ring evenly across the cycle for a continuous pulse
            animationDelay: `${(DURATION / RING_SHADES.length) * i}s`,
          }}
        />
      ))}
    </div>
  )
}
