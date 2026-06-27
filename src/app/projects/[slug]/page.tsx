import type { Metadata } from 'next'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import Nav from '@/components/Nav'
import { client, urlFor } from '@/lib/sanity'
import { renderPortableText, type BodyBlock } from '@/lib/portableText'
import { safeUrl } from '@/lib/url'

export const dynamicParams = false

interface Project {
  title: string
  shortDescription: string
  tags: string[]
  screenshot: { _type: 'image'; asset: { _ref: string; _type: 'reference' } }
  liveUrl: string | null
  githubUrl: string | null
  body: BodyBlock[]
}

export async function generateStaticParams() {
  const projects = await client.fetch<{ slug: string }[]>(
    `*[_type == "project" && status == "published"]{ "slug": slug.current }`
  )
  return projects.map((project) => ({ slug: project.slug }))
}

async function getProject(slug: string): Promise<Project | null> {
  return client.fetch<Project | null>(
    `*[_type == "project" && slug.current == $slug][0] {
      title,
      shortDescription,
      tags,
      screenshot,
      liveUrl,
      githubUrl,
      body
    }`,
    { slug }
  )
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>
}): Promise<Metadata> {
  const { slug } = await params
  const project = await getProject(slug)
  if (!project) return {}
  return {
    title: `${project.title} | Saugat K.C.`,
    description: project.shortDescription,
  }
}

export default async function ProjectPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
  const project = await getProject(slug)

  if (!project) notFound()

  const bodyHtml = project.body ? renderPortableText(project.body) : ''
  const screenshotUrl = project.screenshot?.asset ? urlFor(project.screenshot).width(760).url() : null
  const githubUrl = safeUrl(project.githubUrl)
  const liveUrl = safeUrl(project.liveUrl)

  return (
    <>
      <Nav />

      <main className="max-w-[760px] mx-auto px-6 xl:px-0 pt-[88px] sm:pt-[112px] pb-24">
        {/* Breadcrumb */}
        <nav className="flex items-center gap-2 mb-6 font-body text-[13px]" aria-label="Breadcrumb">
          <Link href="/" className="text-[#52525b] hover:text-[#a1a1aa] transition-colors">
            Home
          </Link>
          <span className="text-[#3f3f46]">/</span>
          <Link href="/projects" className="text-[#52525b] hover:text-[#a1a1aa] transition-colors">
            Projects
          </Link>
          <span className="text-[#3f3f46]">/</span>
          <span className="text-[#a1a1aa] truncate">{project.title}</span>
        </nav>

        {/* Two-column hero */}
        <div className="flex flex-col md:flex-row gap-8 mb-8">
          {/* Left: screenshot (60%) */}
          {screenshotUrl && (
            <div className="md:w-[60%] shrink-0 rounded-[16px] overflow-hidden bg-[#18181b] self-start">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={screenshotUrl}
                alt={`${project.title} screenshot`}
                className="w-full h-full object-cover"
                loading="eager"
                decoding="async"
              />
            </div>
          )}

          {/* Right: metadata (40%) */}
          <div className="flex flex-col gap-4 md:w-[40%]">
            <h1 className="font-display text-[28px] sm:text-[34px] text-white leading-tight">{project.title}</h1>

            <p className="font-body text-[14px] text-[#a1a1aa] leading-relaxed">{project.shortDescription}</p>

            {/* GitHub + Live buttons */}
            {(githubUrl || liveUrl) && (
              <div className="flex items-center gap-2">
                {githubUrl && (
                  <a
                    href={githubUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1.5 font-body text-[12px] text-[#71717a] border border-[#3f3f46] rounded-full px-3 py-1 hover:border-[#52525b] hover:text-[#a1a1aa] transition-colors"
                  >
                    <svg className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
                      <path d="M12 2C6.477 2 2 6.477 2 12c0 4.418 2.865 8.166 6.839 9.489.5.092.682-.217.682-.482 0-.237-.009-.868-.013-1.703-2.782.604-3.369-1.342-3.369-1.342-.454-1.154-1.11-1.462-1.11-1.462-.908-.62.069-.608.069-.608 1.003.07 1.531 1.03 1.531 1.03.892 1.529 2.341 1.087 2.91.831.092-.646.35-1.086.636-1.336-2.22-.253-4.555-1.11-4.555-4.943 0-1.091.39-1.984 1.029-2.683-.103-.253-.446-1.27.098-2.647 0 0 .84-.269 2.75 1.025A9.578 9.578 0 0 1 12 6.836c.85.004 1.705.114 2.504.336 1.909-1.294 2.747-1.025 2.747-1.025.546 1.377.202 2.394.1 2.647.64.699 1.028 1.592 1.028 2.683 0 3.842-2.339 4.687-4.566 4.935.359.309.678.919.678 1.852 0 1.336-.012 2.415-.012 2.743 0 .267.18.578.688.48C19.138 20.163 22 16.418 22 12c0-5.523-4.477-10-10-10z" />
                    </svg>
                    GitHub
                  </a>
                )}
                {liveUrl && (
                  <a
                    href={liveUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1.5 font-body text-[12px] text-[#71717a] border border-[#3f3f46] rounded-full px-3 py-1 hover:border-[#52525b] hover:text-[#a1a1aa] transition-colors"
                  >
                    <svg
                      className="w-3.5 h-3.5"
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
            )}

            {/* Tags */}
            {project.tags?.length > 0 && (
              <div className="flex flex-wrap gap-1.5">
                {project.tags.map((tag) => (
                  <span
                    key={tag}
                    className="bg-[#18181b] border border-[#27272a] rounded px-2 py-0.5 font-body text-[11px] text-[#71717a] whitespace-nowrap leading-[16px]"
                  >
                    {tag}
                  </span>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Divider */}
        <hr className="border-[#27272a] mb-8" />

        {/* Body */}
        {bodyHtml ? (
          <div dangerouslySetInnerHTML={{ __html: bodyHtml }} />
        ) : (
          <p className="font-body text-[16px] text-[#71717a] italic">Write-up coming soon.</p>
        )}

        {/* Back link */}
        <div className="mt-12">
          <Link
            href="/projects"
            className="inline-flex items-center gap-1.5 font-body text-[13px] text-[#71717a] hover:text-white transition-colors"
          >
            <svg
              className="w-3.5 h-3.5"
              viewBox="0 0 16 16"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              aria-hidden="true"
            >
              <path d="M10 12L6 8l4-4" />
            </svg>
            Back to projects
          </Link>
        </div>
      </main>
    </>
  )
}
