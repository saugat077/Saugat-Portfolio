'use client'

import { useState, type ReactNode } from 'react'
import { useReducedMotion } from '@/lib/useReducedMotion'

// Use the PNG as a mask so the arrow can be tinted with the accent colour.
// The source art points up-right (↗); we rotate it 45° to point right (→).
const arrowMask = {
  WebkitMaskImage: 'url(/icons/Arrow.png)',
  maskImage: 'url(/icons/Arrow.png)',
  WebkitMaskSize: 'contain',
  maskSize: 'contain',
  WebkitMaskRepeat: 'no-repeat',
  maskRepeat: 'no-repeat',
  WebkitMaskPosition: 'center',
  maskPosition: 'center',
} as const

/** Chain-link icon shown after the company name, links to the site. */
function LinkIcon() {
  return (
    <svg
      aria-hidden="true"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={2.25}
      strokeLinecap="round"
      strokeLinejoin="round"
      className="w-3.5 h-3.5 shrink-0"
    >
      <path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71" />
      <path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71" />
    </svg>
  )
}

/** Accent arrow: up-right (↗) when closed, rotated to point right (→) when open. */
function ArrowIcon({ open }: { open: boolean }) {
  return (
    <span
      aria-hidden="true"
      style={arrowMask}
      className={`block w-[17px] h-[17px] sm:w-[18px] sm:h-[18px] shrink-0 bg-accent transition-transform duration-300 ${
        open ? 'rotate-45' : ''
      }`}
    />
  )
}

interface ExperienceItemProps {
  role: string
  company: string
  website?: string
  dateLabel: string
  defaultOpen?: boolean
  children: ReactNode
}

/**
 * One role in the Career timeline: the date sits on the left, the role title
 * (linked to the company site) and company name on the right, with an accent
 * arrow that toggles the description when clicked.
 */
export default function ExperienceItem({
  role,
  company,
  website,
  dateLabel,
  defaultOpen = false,
  children,
}: ExperienceItemProps) {
  const [open, setOpen] = useState(defaultOpen)
  const reducedMotion = useReducedMotion()

  const roleTitle = (
    <h3 className="text-title text-white transition-colors duration-200 group-hover:text-accent-soft">
      {role}
    </h3>
  )

  return (
    <div className="py-1 sm:py-1">
      <div className="flex flex-col sm:flex-row items-start gap-1 sm:gap-6">
        {/* Date range   fixed column on desktop */}
        <div className="sm:w-44 shrink-0 sm:pt-0.5">
          <p className="text-meta text-zinc-400 tabular-nums">{dateLabel}</p>
        </div>

        {/* Role + arrow on one row, company below, then description when open */}
        <div className="flex-1 min-w-0 self-stretch">
          {/* Role row   arrow is absolutely pinned to the right so it never shifts */}
          <div className="relative pr-8 sm:pr-9">
            {website ? (
              <a
                href={website}
                target="_blank"
                rel="noopener noreferrer"
                tabIndex={-1}
                aria-hidden="true"
                className="press-inline group"
              >
                {roleTitle}
              </a>
            ) : (
              roleTitle
            )}

            {/* Accent arrow toggle, sized to match the role, pinned to the right */}
            <button
              type="button"
              onClick={() => setOpen((prev) => !prev)}
              aria-expanded={open}
              aria-label={open ? `Hide ${role} details` : `Show ${role} details`}
              className="press focusable absolute -right-3 -top-2.5 cursor-pointer flex items-center justify-center w-11 h-11"
            >
              <ArrowIcon open={open} />
            </button>
          </div>

          {website ? (
            <a
              href={website}
              target="_blank"
              rel="noopener noreferrer"
              className="press focusable tap mt-1 gap-1.5 text-body font-bold text-accent-soft hover:text-white"
            >
              {company}
              <LinkIcon />
            </a>
          ) : (
            <p className="mt-1 text-body font-bold text-accent-soft">{company}</p>
          )}

          <div
            className="grid transition-[grid-template-rows] duration-300 ease-out"
            style={{ gridTemplateRows: open ? '1fr' : '0fr' }}
          >
            <div
              inert={!open}
              className={`overflow-hidden ${
                reducedMotion
                  ? ''
                  : `transition-opacity duration-200 ease-out ${open ? 'opacity-100' : 'opacity-0'}`
              }`}
            >
              <div className="mt-4">{children}</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
