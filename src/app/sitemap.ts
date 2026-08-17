import type { MetadataRoute } from 'next'
import { client } from '@/lib/sanity'
import { SITE_URL } from '@/lib/site'

export const dynamic = 'force-static'

interface Entry {
  slug: string
  updatedAt: string
}

async function getEntries(type: string): Promise<Entry[]> {
  return client.fetch<Entry[]>(
    `*[_type == $type && status == "published" && defined(slug.current)]{
      "slug": slug.current,
      "updatedAt": _updatedAt
    }`,
    { type }
  )
}

function latest(entries: Entry[]): Date | undefined {
  if (entries.length === 0) return undefined
  return new Date(entries.reduce((a, e) => (e.updatedAt > a ? e.updatedAt : a), entries[0].updatedAt))
}

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const [blogs, books, projects] = await Promise.all([
    getEntries('blog'),
    getEntries('book'),
    getEntries('project'),
  ])

  const sections = [
    { path: 'blogs', entries: blogs },
    { path: 'books', entries: books },
    { path: 'projects', entries: projects },
  ]

  const now = new Date()

  return [
    { url: SITE_URL, lastModified: now, priority: 1 },
    ...sections.flatMap((section) => [
      {
        url: `${SITE_URL}/${section.path}`,
        lastModified: latest(section.entries) ?? now,
        priority: 0.8,
      },
      ...section.entries.map((entry) => ({
        url: `${SITE_URL}/${section.path}/${entry.slug}`,
        lastModified: new Date(entry.updatedAt),
        priority: 0.6,
      })),
    ]),
  ]
}
