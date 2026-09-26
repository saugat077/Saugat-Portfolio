'use client'

import { useEffect, useRef, type ReactNode } from 'react'

type Point = { x: number; y: number }
/** A span of the container as fractions of its width/height, e.g. [0.5, 1]. */
type Span = readonly [number, number]

/** Minimum-jerk profile: the speed curve of a real hand reaching for a spot. */
const minJerk = (t: number) => t * t * t * (10 + t * (-15 + 6 * t))
const rand = (min: number, max: number) => min + Math.random() * (max - min)

// The tag's own box, so a target never lets it hang out of its region.
const TAG_W = 91
const TAG_H = 38

/**
 * A collaborator's cursor roaming a region of its positioned parent (the hero).
 * Keyframes can only run point to point, so the motion is driven per frame:
 * each move arcs along a quadratic curve, eases like a hand with a duration
 * that grows with distance, overshoots a little and settles back, then rests
 * for an uneven beat with a faint tremor. Targets are random within `regionX`
 * × `regionY`, so the pattern never loops.
 *
 * `start` is where it sits before the first move (and during SSR), as
 * fractions of the parent.
 */
export default function FigmaCursor({
  regionX,
  regionY,
  start,
  startDelay,
  children,
}: {
  regionX: Span
  regionY: Span
  start: Point
  startDelay: number
  children: ReactNode
}) {
  const ref = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const el = ref.current
    const parent = el?.offsetParent as HTMLElement | null
    if (!el || !parent || window.matchMedia('(prefers-reduced-motion: reduce)').matches) return

    // Positions are absolute px in the parent; the element is anchored at
    // `start`, so what gets applied is the offset from that anchor. Both are
    // re-read from the parent's live size, so a resize just re-scales them.
    const size = () => ({ w: parent.clientWidth, h: parent.clientHeight })
    const anchor = () => {
      const { w, h } = size()
      return { x: start.x * w, y: start.y * h }
    }

    let raf = 0
    let pos: Point = anchor()
    let move: { from: Point; bend: Point; to: Point; start: number; duration: number } | null = null
    let settleTo: Point | null = null
    let restUntil = performance.now() + startDelay

    const plan = (now: number, to: Point, duration: number) => {
      const dx = to.x - pos.x
      const dy = to.y - pos.y
      // Control point pushed off the straight line: wrists swing, they don't slide.
      const curve = rand(-0.3, 0.3)
      move = {
        from: pos,
        bend: { x: pos.x + dx / 2 - dy * curve, y: pos.y + dy / 2 + dx * curve },
        to,
        start: now,
        duration,
      }
    }

    const tick = (now: number) => {
      if (move) {
        const t = Math.min(1, (now - move.start) / move.duration)
        const s = minJerk(t)
        const u = 1 - s
        pos = {
          x: u * u * move.from.x + 2 * u * s * move.bend.x + s * s * move.to.x,
          y: u * u * move.from.y + 2 * u * s * move.bend.y + s * s * move.to.y,
        }
        if (t === 1) {
          move = null
          if (settleTo) {
            plan(now, settleTo, rand(160, 260))
            settleTo = null
          } else {
            restUntil = now + rand(300, 1800)
          }
        }
      } else if (now >= restUntil) {
        const { w, h } = size()
        const to = {
          x: rand(regionX[0] * w, Math.max(regionX[0] * w, regionX[1] * w - TAG_W)),
          y: rand(regionY[0] * h, Math.max(regionY[0] * h, regionY[1] * h - TAG_H)),
        }
        const distance = Math.hypot(to.x - pos.x, to.y - pos.y)
        const overshoot = rand(0.03, 0.07)
        settleTo = to
        plan(
          now,
          { x: to.x + (to.x - pos.x) * overshoot, y: to.y + (to.y - pos.y) * overshoot },
          // Fitts-ish: long sweeps take longer, but not linearly longer.
          350 + Math.sqrt(distance) * 45,
        )
      }

      // The hand never holds perfectly still.
      const tremorX = Math.sin(now / 730) * 0.8 + Math.sin(now / 310 + 1) * 0.4
      const tremorY = Math.cos(now / 650) * 0.8 + Math.sin(now / 270 + 2) * 0.4
      const base = anchor()
      el.style.translate = `${(pos.x - base.x + tremorX).toFixed(2)}px ${(pos.y - base.y + tremorY).toFixed(2)}px`
      raf = requestAnimationFrame(tick)
    }

    raf = requestAnimationFrame(tick)
    return () => cancelAnimationFrame(raf)
  }, [regionX, regionY, start, startDelay])

  return (
    <div
      ref={ref}
      aria-hidden="true"
      className="cursor-in absolute z-10 w-[91px] h-[38px] pointer-events-none select-none"
      style={{ left: `${start.x * 100}%`, top: `${start.y * 100}%` }}
    >
      {children}
    </div>
  )
}
