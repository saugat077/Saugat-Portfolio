'use client'

import { useEffect, useRef, useState, type CSSProperties } from 'react'

/**
 * The tools orbiting the About statement. `x`/`y` are each icon's centre as a
 * percentage of the 1025×395 Figma frame; `size` is its width in px. Widths are
 * clamped so the icons stay legible once the frame is narrower than a laptop,
 * instead of shrinking to specks alongside text that has its own floor.
 */
// `flip` mirrors the icon horizontally — the design's Claude mark is flipped.
// `mx`/`my` are the phone layout, in the same percentages: on a narrow screen
// the statement fills the middle of the section, so the icons split into a
// row above it and a row below it instead of crowding the text.
const ORBIT = [
  { src: '/icons/stack/al-extension.png', alt: 'AL', mx: 36, my: 16, x: 31.6, y: 5.2, size: 33, rotate: -16 },
  { src: '/icons/stack/claude-code.png', alt: 'Claude Code', mx: 10, my: 8, x: 9.7, y: 15.2, size: 36, rotate: -10, flip: true },
  { src: '/icons/stack/business-central.png', alt: 'Business Central', mx: 64, my: 6, x: 74.3, y: 9.9, size: 46, rotate: 0 },
  { src: '/icons/stack/figma.png', alt: 'Figma', mx: 90, my: 14, x: 92.8, y: 28.3, size: 27, rotate: -18 },
  { src: '/icons/stack/react.png', alt: 'React', mx: 10, my: 86, x: 4.1, y: 59.1, size: 44, rotate: -12 },
  { src: '/icons/stack/typescript.png', alt: 'TypeScript', mx: 90, my: 92, x: 87.5, y: 76.9, size: 45, rotate: 16 },
  { src: '/icons/stack/xls.png', alt: 'Excel', mx: 64, my: 84, x: 65.1, y: 85, size: 37, rotate: -20 },
  { src: '/icons/stack/postman.png', alt: 'Postman', mx: 36, my: 94, x: 31.1, y: 87.7, size: 44, rotate: -11 },
] as const

const FRAME_WIDTH = 1025

/**
 * Two dials over the Figma coordinates, both in the same percentage units as
 * the source numbers so they ride the frame instead of fighting it: SPREAD
 * pushes the set out from the frame's centre, DROP slides it down.
 *
 * Only `x` is clamped. A horizontal overshoot walks an icon clean off a phone
 * screen, where the frame is barely wider than the icon itself; a vertical one
 * lands in the 135px gap between sections, where nothing is looking.
 */
const SPREAD = 1
const DROP = 0

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
    <div ref={ref} aria-hidden="true" className="absolute inset-0 pointer-events-none opacity-50">
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
              className={`absolute left-(--mx) top-(--my) sm:left-(--x) sm:top-(--y) -translate-x-1/2 -translate-y-1/2 select-none ${
                entered ? 'orbit-drift' : ''
              }`}
              style={
                {
                  '--x': `${left}%`,
                  '--y': `${top}%`,
                  '--mx': `${icon.mx}%`,
                  '--my': `${icon.my}%`,
                  width: `clamp(${(icon.size * 0.73) / 16}rem, ${(
                    (icon.size / FRAME_WIDTH) *
                    100
                  ).toFixed(2)}%, ${icon.size / 16}rem)`,
                  rotate: `${icon.rotate}deg`,
                  scale: 'flip' in icon ? '-1 1' : undefined,
                  '--drift-x': `${drift.x / 16}rem`,
                  '--drift-y': `${drift.y / 16}rem`,
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
