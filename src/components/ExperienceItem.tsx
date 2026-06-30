'use client'

import { useState, type ReactNode } from 'react'

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

  const roleTitle = (
    <h4 className="font-display font-semibold text-[17px] sm:text-[18px] text-white leading-snug transition-colors duration-200 group-hover:text-accent-soft">
      {role}
    </h4>
  )

  return (
    <div className="py-1 sm:py-1">
      <div className="flex flex-col sm:flex-row items-start gap-1 sm:gap-6">
        {/* Date range   fixed column on desktop */}
        <div className="sm:w-44 shrink-0 sm:pt-0.5">
          <p className="t-caption text-zinc-400 leading-tight tabular-nums">{dateLabel}</p>
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
                aria-label={`Visit ${company} website`}
                className="group inline-block"
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
              className="absolute right-0 top-0.5 cursor-pointer p-1 -m-1"
            >
              <ArrowIcon open={open} />
            </button>
          </div>

          {website ? (
            <a
              href={website}
              target="_blank"
              rel="noopener noreferrer"
              aria-label={`Visit ${company} website`}
              className="mt-1 inline-flex items-center gap-1.5 t-body font-bold text-accent-soft transition-colors duration-200 hover:text-accent"
            >
              {company}
              <LinkIcon />
            </a>
          ) : (
            <p className="mt-1 t-body font-bold text-accent-soft">{company}</p>
          )}

          {open && <div className="mt-4">{children}</div>}
        </div>
      </div>
    </div>
  )
}
