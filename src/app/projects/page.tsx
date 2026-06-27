import type { Metadata } from 'next'
import Link from 'next/link'
import Nav from '@/components/Nav'
import ProjectCard from '@/components/ProjectCard'
import { client } from '@/lib/sanity'

export const metadata: Metadata = {
  title: 'Projects | Saugat K.C.',
  description: 'Projects built by Saugat K.C.',
}

interface Project {
  _id: string
  title: string
  shortDescription: string
  screenshot: { _type: 'image'; asset: { _ref: string; _type: 'reference' } }
  githubUrl: string | null
  liveUrl: string | null
  tags: string[]
  slug: { current: string }
}

export default async function ProjectsPage() {
  const projects = await client.fetch<Project[]>(
    `*[_type == "project" && status == "published"] | order(_createdAt desc) {
      _id,
      title,
      shortDescription,
      screenshot,
      githubUrl,
      liveUrl,
      tags,
      slug
    }`
  )

  return (
    <>
      <Nav />

      <main className="max-w-[1440px] mx-auto">
        <div className="max-w-[760px] mx-auto px-6 xl:px-0 pt-[88px] sm:pt-[112px] pb-24">
          {/* Breadcrumb */}
          <nav className="flex items-center gap-2 mb-6 font-body text-[13px]" aria-label="Breadcrumb">
            <Link href="/" className="text-[#52525b] hover:text-[#a1a1aa] transition-colors">
              Home
            </Link>
            <span className="text-[#3f3f46]">/</span>
            <span className="text-[#a1a1aa]">Projects</span>
          </nav>

          <hr className="border-[#27272a] mb-8" />

          {projects.length === 0 ? (
            <p className="font-body text-[15px] text-[#52525b] italic">No projects yet</p>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-8 sm:gap-[74px]">
              {projects.map((project) => (
                <ProjectCard
                  key={project._id}
                  title={project.title}
                  shortDescription={project.shortDescription}
                  screenshot={project.screenshot}
                  githubUrl={project.githubUrl}
                  liveUrl={project.liveUrl}
                  tags={project.tags}
                  slug={project.slug.current}
                />
              ))}
            </div>
          )}
        </div>
      </main>
    </>
  )
}
