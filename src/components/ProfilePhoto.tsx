'use client'

import { useEffect, useRef, useState } from 'react'

const CIRCUMFERENCE = 314.16 // 2π × r=50
const FILL_DURATION = 2500
const DRAIN_DURATION = 500

export default function ProfilePhoto() {
  const ringRef = useRef<SVGCircleElement | null>(null)
  const ringAnim = useRef<Animation | null>(null)
  const fillTimer = useRef<ReturnType<typeof setTimeout> | null>(null)
  const [unlocked, setUnlocked] = useState(false)

  useEffect(
    () => () => {
      if (fillTimer.current) clearTimeout(fillTimer.current)
      ringAnim.current?.cancel()
      document.body.classList.remove('easter-unlocked')
    },
    []
  )

  function currentOffset() {
    const ring = ringRef.current
    if (!ring) return CIRCUMFERENCE
    const raw = parseFloat(getComputedStyle(ring).strokeDashoffset)
    return Number.isFinite(raw) ? raw : CIRCUMFERENCE
  }

  function animateRing(to: number, duration: number) {
    const ring = ringRef.current
    if (!ring) return

    const from = currentOffset()
    ringAnim.current?.cancel()
    ring.style.strokeDashoffset = String(to)

    if (duration <= 0 || from === to) return
    ringAnim.current = ring.animate(
      [{ strokeDashoffset: String(from) }, { strokeDashoffset: String(to) }],
      { duration, easing: to === 0 ? 'linear' : 'ease-out', fill: 'none' }
    )
  }

  function unlock() {
    fillTimer.current = null
    setUnlocked(true)
    document.body.classList.add('easter-unlocked')
    navigator.vibrate?.(12)
  }

  function handleEnter() {
    if (unlocked || fillTimer.current) return

    const remaining = currentOffset() / CIRCUMFERENCE
    const hold = Math.max(200, FILL_DURATION * remaining)

    animateRing(0, hold)
    fillTimer.current = setTimeout(unlock, hold)
  }

  function handleLeave() {
    if (unlocked) {
      document.body.classList.remove('easter-unlocked')
      setUnlocked(false)
    }
    if (fillTimer.current) {
      clearTimeout(fillTimer.current)
      fillTimer.current = null
    }

    const filled = (CIRCUMFERENCE - currentOffset()) / CIRCUMFERENCE
    animateRing(CIRCUMFERENCE, Math.max(150, filled * DRAIN_DURATION))
  }

  return (
    <div
      id="profile-photo-wrapper"
      onPointerEnter={handleEnter}
      onPointerLeave={handleLeave}
      onPointerCancel={handleLeave}
      className="relative shrink-0 w-[100px] h-[100px] sm:w-[205px] sm:h-[205px] select-none [-webkit-touch-callout:none]"
    >
      <div className="w-full h-full rounded-full border-2 border-ink bg-zinc-900 overflow-hidden">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src="/images/profile.png"
          alt="Saugat KC"
          className="w-full h-full object-cover pointer-events-none"
          draggable={false}
        />
      </div>
      {/* SVG progress ring   sits outside the photo edge via overflow="visible" */}
      <svg
        className="absolute inset-0 w-full h-full -rotate-90 pointer-events-none"
        viewBox="0 0 100 100"
        overflow="visible"
        aria-hidden="true"
      >
        <circle
          ref={ringRef}
          id="profile-ring-circle"
          cx="50"
          cy="50"
          r="50"
          fill="none"
          stroke="var(--color-green-500)"
          strokeWidth="1.5"
          strokeLinecap="round"
          style={{ strokeDasharray: 314.16, strokeDashoffset: 314.16 }}
        />
      </svg>
    </div>
  )
}
