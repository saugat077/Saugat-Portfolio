// Animated radial "pulse" background — filled circles grow from the centre
// outward and fade as they fill the screen, staggered so a new pulse is always
// emerging. Pure CSS (see .pulse-ring in globals.css), so it stays a Server
// Component and is compatible with static export.
//
// Dark bluish / navy shades — each ring a slightly different dark blue so the
// pulse reads as subtle expanding rings against the base page bg.

const RING_SHADES = [
  'rgba(28, 12, 48, 0.55)',
  'rgba(38, 16, 64, 0.50)',
  'rgba(50, 22, 80, 0.45)',
  'rgba(24, 10, 44, 0.55)',
  'rgba(60, 28, 96, 0.40)',
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
