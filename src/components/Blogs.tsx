import Link from 'next/link'
import { client } from '@/lib/sanity'

interface Blog {
  _id: string
  title: string
  slug: { current: string }
  publishedAt: string | null
}

function formatDate(iso: string): string {
  return new Date(iso).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  })
}

export default async function Blogs() {
  const blogs = await client.fetch<Blog[]>(
    `*[_type == "blog" && status == "published"] | order(publishedAt desc) [0...5] {
      _id,
      title,
      slug,
      publishedAt
    }`
  )

  if (blogs.length === 0) return null

  return (
    <section className="flex flex-col gap-[34px] lg:gap-[49px]">
      <h2 className="text-title sheen">Blogs</h2>

      <ul className="flex flex-col gap-4">
        {blogs.map((blog) => (
          <li
            key={blog._id}
            className="flex flex-col gap-1 lg:grid lg:grid-cols-[max-content_minmax(0,1fr)] lg:items-baseline lg:gap-x-[122px] lg:gap-y-0"
          >
            <span className="text-lead text-faint whitespace-nowrap">
              {blog.publishedAt ? formatDate(blog.publishedAt) : '—'}
            </span>
            <Link
              href={`/blogs/${blog.slug.current}`}
              className="press-inline focusable text-item text-white underline decoration-transparent hover:decoration-current transition-[text-decoration-color] duration-200"
            >
              {blog.title}
            </Link>
          </li>
        ))}
      </ul>

      <p className="text-ui text-dim">
        You can{' '}
        <Link href="/blogs" className="press-inline focusable underline hover:text-white">
          read more articles here
        </Link>
      </p>
    </section>
  )
}
