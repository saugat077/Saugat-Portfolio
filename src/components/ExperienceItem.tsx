import type { ReactNode } from 'react'

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

interface ExperienceItemProps {
  role: string
  company: string
  website?: string
  dateLabel: string
  children: ReactNode
}

/**
 * One role in the Career timeline, in three columns: the date range on the
 * left, the role and its company in the middle, and the description on the
 * right. Stacks to a single column below the sm breakpoint.
 */
export default function ExperienceItem({
  role,
  company,
  website,
  dateLabel,
  children,
}: ExperienceItemProps) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-3 gap-y-1.5 sm:gap-x-7 py-3 sm:py-4">
      <p className="text-body-sm font-bold text-white tabular-nums text-balance">{dateLabel}</p>

      <div className="flex flex-col min-w-0">
        <h3 className="text-body font-bold text-white">{role}</h3>
        {website ? (
          <a
            href={website}
            target="_blank"
            rel="noopener noreferrer"
            className="press-inline focusable inline-flex items-center gap-1.5 self-start max-w-full py-2 -my-1 text-body-sm text-zinc-400 hover:text-accent-soft"
          >
            {company}
            <LinkIcon />
          </a>
        ) : (
          <p className="text-body-sm text-zinc-400">{company}</p>
        )}
      </div>

      <div className="text-body-sm text-zinc-400">{children}</div>
    </div>
  )
}
