import Link from 'next/link'
import { urlFor } from '@/lib/sanity'
import { safeUrl } from '@/lib/url'

interface ProjectCardProps {
  title: string
  shortDescription: string
  screenshot?: { _type: 'image'; asset: { _ref: string; _type: 'reference' } } | null
  githubUrl?: string | null
  liveUrl?: string | null
  tags?: string[]
  slug: string
}

export default function ProjectCard({
  title,
  shortDescription,
  screenshot,
  githubUrl,
  liveUrl,
  tags,
  slug,
}: ProjectCardProps) {
  const screenshotUrl = screenshot?.asset ? urlFor(screenshot).width(760).height(458).url() : null
  const projectHref = `/projects/${slug}`
  const safeGithubUrl = safeUrl(githubUrl)
  const safeLiveUrl = safeUrl(liveUrl)

  return (
    <div className="flex flex-col gap-[10px]">
      {/* Screenshot → /projects/[slug] */}
      <Link
        href={projectHref}
        className="block rounded-[16px] sm:rounded-[21px] overflow-hidden h-[190px] sm:h-[229px] bg-zinc-900 hover:opacity-90 transition-opacity focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/40"
        aria-label={`View ${title}`}
        tabIndex={-1}
      >
        {screenshotUrl ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={screenshotUrl}
            alt={`${title} screenshot`}
            className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
            loading="lazy"
            decoding="async"
          />
        ) : (
          <div className="w-full h-full bg-gradient-to-br from-zinc-900 to-zinc-800"></div>
        )}
      </Link>

      {/* Title → /projects/[slug] */}
      <Link href={projectHref} className="group">
        <h3 className="t-display text-white leading-tight group-hover:text-zinc-400 transition-colors">
          {title}
        </h3>
      </Link>

      {/* Description */}
      <p className="t-body text-zinc-400 leading-snug">{shortDescription}</p>

      {/* Actions row: GitHub · Live on left, Read more → on right */}
      <div className="flex items-center justify-between gap-2">
        <div className="flex items-center gap-2">
          {safeGithubUrl && (
            <a
              href={safeGithubUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 t-caption text-zinc-500 border border-zinc-700 rounded-full px-2.5 py-0.5 hover:border-zinc-600 hover:text-zinc-400 transition-colors"
            >
              <svg className="w-3 h-3" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
                <path d="M12 2C6.477 2 2 6.477 2 12c0 4.418 2.865 8.166 6.839 9.489.5.092.682-.217.682-.482 0-.237-.009-.868-.013-1.703-2.782.604-3.369-1.342-3.369-1.342-.454-1.154-1.11-1.462-1.11-1.462-.908-.62.069-.608.069-.608 1.003.07 1.531 1.03 1.531 1.03.892 1.529 2.341 1.087 2.91.831.092-.646.35-1.086.636-1.336-2.22-.253-4.555-1.11-4.555-4.943 0-1.091.39-1.984 1.029-2.683-.103-.253-.446-1.27.098-2.647 0 0 .84-.269 2.75 1.025A9.578 9.578 0 0 1 12 6.836c.85.004 1.705.114 2.504.336 1.909-1.294 2.747-1.025 2.747-1.025.546 1.377.202 2.394.1 2.647.64.699 1.028 1.592 1.028 2.683 0 3.842-2.339 4.687-4.566 4.935.359.309.678.919.678 1.852 0 1.336-.012 2.415-.012 2.743 0 .267.18.578.688.48C19.138 20.163 22 16.418 22 12c0-5.523-4.477-10-10-10z" />
              </svg>
              GitHub
            </a>
          )}
          {safeLiveUrl && (
            <a
              href={safeLiveUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 t-caption text-zinc-500 border border-zinc-700 rounded-full px-2.5 py-0.5 hover:border-zinc-600 hover:text-zinc-400 transition-colors"
            >
              <svg
                className="w-3 h-3"
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
              Live
            </a>
          )}
        </div>

        {/* Read more → pushed right */}
        <Link
          href={projectHref}
          className="t-caption text-zinc-600 hover:text-white transition-colors shrink-0"
        >
          Read more →
        </Link>
      </div>

      {/* Tags */}
      {tags && tags.length > 0 && (
        <div className="flex flex-wrap gap-1.5">
          {tags.map((tag) => (
            <span
              key={tag}
              className="bg-zinc-900 border border-zinc-800 rounded px-2 py-0.5 t-caption text-zinc-500 whitespace-nowrap leading-[16px]"
            >
              {tag}
            </span>
          ))}
        </div>
      )}
    </div>
  )
}
