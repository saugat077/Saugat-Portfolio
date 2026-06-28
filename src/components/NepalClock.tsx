'use client'

import { useEffect, useState } from 'react'

function getNepalTime(): string {
  const now = new Date()
  const utcMs = now.getTime() + now.getTimezoneOffset() * 60_000
  const nepalMs = utcMs + (5 * 3600 + 45 * 60) * 1000
  const d = new Date(nepalMs)
  const h = d.getHours()
  const m = d.getMinutes()
  const h12 = h % 12 || 12
  const ampm = h < 12 ? 'AM' : 'PM'
  return `${h12}:${String(m).padStart(2, '0')} ${ampm} NPT`
}

export default function NepalClock() {
  // Render a placeholder first so server and client markup match, then tick.
  const [time, setTime] = useState('--:-- -- NPT')

  useEffect(() => {
    setTime(getNepalTime())
    const id = setInterval(() => setTime(getNepalTime()), 1000)
    return () => clearInterval(id)
  }, [])

  return (
    <span
      id="npt-clock"
      className="font-bitcount text-[11px] sm:text-[18px] text-white whitespace-nowrap tabular-nums"
      aria-label="Current time in Nepal"
    >
      {time}
    </span>
  )
}
