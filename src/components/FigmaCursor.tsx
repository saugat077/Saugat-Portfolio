'use client'

import { useEffect, useRef, type ReactNode } from 'react'

type Point = { x: number; y: number }

/** Minimum-jerk profile: the speed curve of a real hand reaching for a spot. */
const minJerk = (t: number) => t * t * t * (10 + t * (-15 + 6 * t))
const rand = (min: number, max: number) => min + Math.random() * (max - min)

/**
 * A collaborator's cursor wandering near its resting spot. Keyframes can only
 * run point to point, so the motion is driven per frame instead: each move
 * arcs along a quadratic curve, eases like a hand, overshoots its target a
 * little and settles back, then rests for an uneven beat with a faint tremor.
 * Targets are random, so the pattern never loops.
 *
 * `rangeX`/`rangeY` bound the wander in px around the resting spot.
 */
export default function FigmaCursor({
  left,
  top,
  rangeX,
  rangeY,
  startDelay,
  children,
}: {
  left: string
  top: string
  rangeX: number
  rangeY: number
  startDelay: number
  children: ReactNode
}) {
  const ref = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const el = ref.current
    if (!el || window.matchMedia('(prefers-reduced-motion: reduce)').matches) return

    let raf = 0
    let pos: Point = { x: 0, y: 0 }
    let move: { from: Point; bend: Point; to: Point; start: number; duration: number } | null = null
    let settleTo: Point | null = null
    let restUntil = performance.now() + startDelay

    const plan = (now: number, to: Point, duration: number) => {
      const dx = to.x - pos.x
      const dy = to.y - pos.y
      // Control point pushed off the straight line: wrists swing, they don't slide.
      const curve = rand(-0.35, 0.35)
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
            restUntil = now + rand(250, 1400)
          }
        }
      } else if (now >= restUntil) {
        const to = { x: rand(-rangeX, rangeX), y: rand(-rangeY, rangeY) }
        const distance = Math.hypot(to.x - pos.x, to.y - pos.y)
        const overshoot = rand(0.04, 0.1)
        settleTo = to
        plan(
          now,
          { x: to.x + (to.x - pos.x) * overshoot, y: to.y + (to.y - pos.y) * overshoot },
          300 + distance * 7,
        )
      }

      // The hand never holds perfectly still.
      const tremorX = Math.sin(now / 730) * 0.8 + Math.sin(now / 310 + 1) * 0.4
      const tremorY = Math.cos(now / 650) * 0.8 + Math.sin(now / 270 + 2) * 0.4
      el.style.translate = `${(pos.x + tremorX).toFixed(2)}px ${(pos.y + tremorY).toFixed(2)}px`
      raf = requestAnimationFrame(tick)
    }

    raf = requestAnimationFrame(tick)
    return () => cancelAnimationFrame(raf)
  }, [rangeX, rangeY, startDelay])

  return (
    <div
      ref={ref}
      aria-hidden="true"
      className="cursor-in absolute w-[91px] h-[38px] pointer-events-none select-none"
      style={{ left, top }}
    >
      {children}
    </div>
  )
}
