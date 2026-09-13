import Link from 'next/link'
import { safeUrl } from '@/lib/url'
import { ArrowUpRight } from './ArrowLink'

/**
 * Takes a ready-made `screenshotUrl` rather than a Sanity image object on
 * purpose: this card is rendered from inside the `use client` tab switcher, so
 * importing the Sanity client here would ship it to the browser — where it has
 * no projectId and throws on construction. Callers build the URL server-side.
 */
interface ProjectCardProps {
  title: string
  shortDescription: string
  screenshotUrl?: string | null
  githubUrl?: string | null
  liveUrl?: string | null
  tags?: string[]
  slug: string
  headingLevel?: 2 | 3
}

function LinkOut({
  href,
  label,
  children,
}: {
  href: string
  label: string
  children: React.ReactNode
}) {
  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      aria-label={`${label} — ${href}`}
      className="press-inline focusable inline-flex items-center gap-1.5 text-meta text-white hover:text-accent-soft"
    >
      {children}
      {label}
      <ArrowUpRight className="w-[9px] h-[9px]" />
    </a>
  )
}

export default function ProjectCard({
  title,
  shortDescription,
  screenshotUrl,
  githubUrl,
  liveUrl,
  tags,
  slug,
  headingLevel = 3,
}: ProjectCardProps) {
  const Heading = headingLevel === 2 ? 'h2' : 'h3'
  const projectHref = `/projects/${slug}`
  const safeGithubUrl = safeUrl(githubUrl)
  const safeLiveUrl = safeUrl(liveUrl)

  const hasFooter = (tags && tags.length > 0) || safeLiveUrl || safeGithubUrl

  // h-full + the mt-auto footer below are what make a row of cards read as a
  // grid: the tallest description sets the row height, and every card's tech
  // line and links sit on the same baseline instead of floating up behind it.
  return (
    <div className="flex flex-col gap-5 h-full">
      {/* Screenshot → /projects/[slug]. Hidden from assistive tech because the
          title link immediately below points at the same place. */}
      <Link
        href={projectHref}
        className="press block rounded-md overflow-hidden aspect-[293/171] bg-zinc-900"
        aria-hidden="true"
        tabIndex={-1}
      >
        {screenshotUrl ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={screenshotUrl}
            alt=""
            className="w-full h-full object-cover hover:scale-105 motion-reduce:hover:scale-100 transition-transform duration-300 ease-out"
            loading="lazy"
            decoding="async"
          />
        ) : (
          <div className="w-full h-full bg-gradient-to-br from-zinc-900 to-zinc-800"></div>
        )}
      </Link>

      <div className="flex flex-col gap-2 flex-1">
        <Link href={projectHref} className="press focusable group self-start">
          <Heading className="text-item text-white group-hover:text-accent-soft transition-colors">
            {title}
          </Heading>
        </Link>

        <p className="text-body-sm text-card">{shortDescription}</p>

        {hasFooter && (
          <div className="mt-auto flex flex-col gap-2">
            {tags && tags.length > 0 && (
              <p className="text-body-sm text-card">{tags.join(' • ')}</p>
            )}

            {(safeLiveUrl || safeGithubUrl) && (
              <div className="flex flex-wrap items-center gap-x-3.5 gap-y-2 pt-1">
                {safeLiveUrl && (
                  <LinkOut href={safeLiveUrl} label="Live">
                    <svg
                      className="w-[11px] h-[11px]"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      aria-hidden="true"
                    >
                      <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6" />
                      <polyline points="15 3 21 3 21 9" />
                      <line x1="10" y1="14" x2="21" y2="3" />
                    </svg>
                  </LinkOut>
                )}
                {safeGithubUrl && (
                  <LinkOut href={safeGithubUrl} label="Github">
                    <svg
                      className="w-[11px] h-[11px]"
                      viewBox="0 0 24 24"
                      fill="currentColor"
                      aria-hidden="true"
                    >
                      <path d="M12 2C6.477 2 2 6.477 2 12c0 4.418 2.865 8.166 6.839 9.489.5.092.682-.217.682-.482 0-.237-.009-.868-.013-1.703-2.782.604-3.369-1.342-3.369-1.342-.454-1.154-1.11-1.462-1.11-1.462-.908-.62.069-.608.069-.608 1.003.07 1.531 1.03 1.531 1.03.892 1.529 2.341 1.087 2.91.831.092-.646.35-1.086.636-1.336-2.22-.253-4.555-1.11-4.555-4.943 0-1.091.39-1.984 1.029-2.683-.103-.253-.446-1.27.098-2.647 0 0 .84-.269 2.75 1.025A9.578 9.578 0 0 1 12 6.836c.85.004 1.705.114 2.504.336 1.909-1.294 2.747-1.025 2.747-1.025.546 1.377.202 2.394.1 2.647.64.699 1.028 1.592 1.028 2.683 0 3.842-2.339 4.687-4.566 4.935.359.309.678.919.678 1.852 0 1.336-.012 2.415-.012 2.743 0 .267.18.578.688.48C19.138 20.163 22 16.418 22 12c0-5.523-4.477-10-10-10z" />
                    </svg>
                  </LinkOut>
                )}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  )
}
