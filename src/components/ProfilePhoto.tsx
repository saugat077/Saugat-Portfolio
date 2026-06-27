'use client'

import { useRef, useState } from 'react'

const CIRCUMFERENCE = 314.16 // 2π × r=50
const FILL_DURATION = 2500

export default function ProfilePhoto() {
  const ringRef = useRef<SVGCircleElement | null>(null)
  const fillTimer = useRef<ReturnType<typeof setTimeout> | null>(null)
  const [unlocked, setUnlocked] = useState(false)

  function setRingOffset(offset: number, duration: number) {
    const ring = ringRef.current
    if (!ring) return
    ring.style.transition = `stroke-dashoffset ${duration}ms ${
      duration === FILL_DURATION ? 'linear' : 'ease-out'
    }`
    ring.style.strokeDashoffset = String(offset)
  }

  function handleMouseEnter() {
    if (unlocked) return
    setRingOffset(0, FILL_DURATION)
    fillTimer.current = setTimeout(() => {
      setUnlocked(true)
      fillTimer.current = null
      document.body.classList.add('easter-unlocked')
    }, FILL_DURATION)
  }

  function handleMouseLeave() {
    if (unlocked) {
      // Reset after unlock — hide the words and let the ring drain
      document.body.classList.remove('easter-unlocked')
      setUnlocked(false)
    }
    if (fillTimer.current) {
      clearTimeout(fillTimer.current)
      fillTimer.current = null
    }
    setRingOffset(CIRCUMFERENCE, 500)
  }

  return (
    <div
      id="profile-photo-wrapper"
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      className="relative shrink-0 w-[110px] h-[110px] sm:w-[237px] sm:h-[237px] cursor-pointer"
    >
      <div className="w-full h-full rounded-full border-2 border-[#0a0b0b] bg-[#18181b] overflow-hidden">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src="/images/profile.png" alt="Saugat K.C." className="w-full h-full object-cover" />
      </div>
      {/* SVG progress ring — sits outside the photo edge via overflow="visible" */}
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
          stroke="#22c55e"
          strokeWidth="1.5"
          strokeLinecap="round"
          style={{ strokeDasharray: 314.16, strokeDashoffset: 314.16 }}
        />
      </svg>
    </div>
  )
}
