import { client, urlFor } from '@/lib/sanity'
import { safeUrl } from '@/lib/url'
import ProjectTabs, { type TabProject, type TabSkill } from './ProjectTabs'

type SanityImage = { _type: 'image'; asset: { _ref: string; _type: 'reference' } }

interface Project {
  _id: string
  title: string
  shortDescription: string
  screenshot?: SanityImage | null
  githubUrl: string | null
  liveUrl: string | null
  tags: string[]
  slug: { current: string }
}

interface CoreSkill {
  _id: string
  label: string
  logo?: SanityImage | null
  website?: string
}

/**
 * Both panels behind the Projects / Tech Stack tabs. Fetching happens here so
 * the client component only ever receives plain strings — image URLs are built
 * server-side rather than shipping the Sanity URL builder to the browser.
 */
export default async function Projects() {
  const [projects, skills] = await Promise.all([
    client.fetch<Project[]>(
      `*[_type == "project" && status == "published"] | order(coalesce(order, 9999) asc, _createdAt desc) [0...6] {
        _id,
        title,
        shortDescription,
        screenshot,
        githubUrl,
        liveUrl,
        tags,
        slug
      }`
    ),
    client.fetch<CoreSkill[]>(
      `*[_type == "coreSkill"] | order(order asc) { _id, label, logo, website }`
    ),
  ])

  const tabProjects: TabProject[] = projects.map((project) => ({
    _id: project._id,
    title: project.title,
    shortDescription: project.shortDescription,
    screenshotUrl: project.screenshot?.asset
      ? urlFor(project.screenshot).width(586).height(342).url()
      : null,
    githubUrl: project.githubUrl,
    liveUrl: project.liveUrl,
    tags: project.tags,
    slug: project.slug.current,
  }))

  const tabSkills: TabSkill[] = skills.map((skill) => ({
    _id: skill._id,
    label: skill.label,
    logoUrl: skill.logo?.asset ? urlFor(skill.logo).width(48).height(48).fit('max').url() : null,
    href: safeUrl(skill.website),
  }))

  return <ProjectTabs projects={tabProjects} skills={tabSkills} />
}
