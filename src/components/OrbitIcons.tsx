'use client'

import { useEffect, useRef, useState, type CSSProperties } from 'react'

/**
 * The tools orbiting the About statement. `x`/`y` are percentages of the
 * 1141×340 Figma frame; `size` is that frame's icon width in px. Widths are
 * clamped so the icons stay legible once the frame is narrower than a laptop,
 * instead of shrinking to specks alongside text that has its own floor.
 */
const ORBIT = [
  { src: '/icons/stack/al-extension.png', alt: 'AL', x: 8.5, y: 8.3, size: 42, rotate: -16 },
  { src: '/icons/stack/claude-code.png', alt: 'Claude Code', x: 33.3, y: 0, size: 36, rotate: 10 },
  { src: '/icons/stack/business-central.png', alt: 'Business Central', x: 69.5, y: 3.7, size: 46, rotate: 0 },
  { src: '/icons/stack/typescript.png', alt: 'TypeScript', x: 95.2, y: 27.7, size: 45, rotate: 16 },
  { src: '/icons/stack/postman.png', alt: 'Postman', x: 0, y: 52.5, size: 41, rotate: -11 },
  { src: '/icons/stack/react.png', alt: 'React', x: 87.3, y: 71.3, size: 66, rotate: -12 },
  { src: '/icons/stack/figma.png', alt: 'Figma', x: 20.8, y: 78.2, size: 29, rotate: -18 },
  { src: '/icons/stack/xls.png', alt: 'Excel', x: 57.8, y: 86, size: 37, rotate: -20 },
] as const

const FRAME_WIDTH = 1141

/**
 * Two dials over the Figma coordinates, both in the same percentage units as
 * the source numbers so they ride the frame instead of fighting it: SPREAD
 * pushes the set out from the frame's centre, DROP slides it down.
 *
 * Only `x` is clamped. A horizontal overshoot walks an icon clean off a phone
 * screen, where the frame is barely wider than the icon itself; a vertical one
 * lands in the 135px gap between sections, where nothing is looking.
 */
const SPREAD = 1.07
const DROP = 8

const place = ({ x, y }: { x: number; y: number }) => ({
  left: Math.min(100, Math.max(0, 50 + (x - 50) * SPREAD)),
  top: 50 + (y - 50) * SPREAD + DROP,
})

const FLY_MS = 2200
const STAGGER_MS = 70

/**
 * Idle drift, derived from the index rather than randomised so the server and
 * the client agree on the markup. Eight icons is too few for a pattern to
 * surface; it only has to stop them breathing in unison.
 */
const sway = (i: number) => ({
  x: (i % 2 ? 1 : -1) * (16 + (i % 4) * 4),
  y: (i % 3 ? -1 : 1) * (14 + (i % 3) * 6),
  rotate: (i % 2 ? -1 : 1) * (3 + (i % 3)),
  seconds: 11 + ((i * 1.9) % 6),
})

export default function OrbitIcons() {
  const ref = useRef<HTMLDivElement>(null)
  const [entered, setEntered] = useState(false)

  // The section sits a screen below the fold, so firing on mount would spend
  // the animation before anyone is looking. Observe once, then disconnect.
  useEffect(() => {
    const node = ref.current
    if (!node) return

    // Decorative, so a browser without the observer must still end up with the
    // icons on screen rather than a permanently empty section.
    if (typeof IntersectionObserver === 'undefined') {
      setEntered(true)
      return
    }

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (!entry.isIntersecting) return
        setEntered(true)
        observer.disconnect()
      },
      { threshold: 0.25 },
    )
    observer.observe(node)
    return () => observer.disconnect()
  }, [])

  return (
    <div ref={ref} aria-hidden="true" className="absolute inset-0 pointer-events-none">
      {ORBIT.map((icon, i) => {
        const { left, top } = place(icon)
        const drift = sway(i)

        return (
          // Each icon rides its own full-size flyer. Scaling the flyer from 0
          // sweeps the icon out from the section's centre to its resting spot:
          // radial motion from a single transform, correct at any frame size.
          <div
            key={icon.src}
            className={`absolute inset-0 ${entered ? 'orbit-fly' : 'opacity-0'}`}
            style={{ animationDelay: `${i * STAGGER_MS}ms`, animationDuration: `${FLY_MS}ms` }}
          >
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={icon.src}
              alt=""
              decoding="async"
              className={`absolute -translate-x-1/2 -translate-y-1/2 select-none ${
                entered ? 'orbit-drift' : ''
              }`}
              style={
                {
                  left: `${left}%`,
                  top: `${top}%`,
                  width: `clamp(${Math.round(icon.size * 0.73)}px, ${(
                    (icon.size / FRAME_WIDTH) *
                    100
                  ).toFixed(2)}%, ${icon.size}px)`,
                  rotate: `${icon.rotate}deg`,
                  '--drift-x': `${drift.x}px`,
                  '--drift-y': `${drift.y}px`,
                  '--drift-rotate': `${drift.rotate}deg`,
                  animationDuration: `${drift.seconds}s`,
                  animationDelay: `${FLY_MS + i * STAGGER_MS}ms`,
                } as CSSProperties
              }
            />
          </div>
        )
      })}
    </div>
  )
}
