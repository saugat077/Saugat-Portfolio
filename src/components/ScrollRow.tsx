'use client'

import { useEffect, useRef, useState, type ReactNode } from 'react'

const THRESHOLD = 4

export default function ScrollRow({
  className = '',
  children,
  ...rest
}: { className?: string; children: ReactNode } & React.HTMLAttributes<HTMLDivElement>) {
  const ref = useRef<HTMLDivElement>(null)
  const [edges, setEdges] = useState({ start: false, end: false })

  useEffect(() => {
    const el = ref.current
    if (!el) return

    const update = () => {
      const max = el.scrollWidth - el.clientWidth
      setEdges({
        start: el.scrollLeft > THRESHOLD,
        end: max > THRESHOLD && el.scrollLeft < max - THRESHOLD,
      })
    }

    update()
    el.addEventListener('scroll', update, { passive: true })

    const observer = new ResizeObserver(update)
    observer.observe(el)
    for (const child of Array.from(el.children)) observer.observe(child)

    return () => {
      el.removeEventListener('scroll', update)
      observer.disconnect()
    }
  }, [])

  return (
    <div
      ref={ref}
      className={`scroll-row ${className}`}
      data-start={edges.start}
      data-end={edges.end}
      {...rest}
    >
      {children}
    </div>
  )
}
