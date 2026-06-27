import Link from 'next/link'
import { client } from '@/lib/sanity'
import ProjectCard from './ProjectCard'

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

export default async function Projects() {
  const projects = await client.fetch<Project[]>(
    `*[_type == "project" && status == "published"] | order(_createdAt desc) [0...2] {
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

  if (projects.length === 0) return null

  return (
    <section className="flex flex-col gap-6">
      {/* Section header */}
      <div className="flex items-center justify-between">
        <h2 className="font-display text-[18px] sm:text-[23px] text-white">Projects</h2>
        <Link href="/projects" className="font-body text-[13px] text-white hover:text-[#a1a1aa] transition-colors">
          View more &gt;
        </Link>
      </div>

      {/* Project cards grid */}
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
    </section>
  )
}
