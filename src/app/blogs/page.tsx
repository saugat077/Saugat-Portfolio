import type { Metadata } from 'next'
import Link from 'next/link'
import Nav from '@/components/Nav'
import { client, urlFor } from '@/lib/sanity'

export const metadata: Metadata = {
  title: 'Blogs | Saugat KC',
  description: 'Thoughts and writing by Saugat KC',
  alternates: { canonical: '/blogs' },
}

interface Blog {
  title: string
  slug: { current: string }
  coverImage: { _type: 'image'; asset: { _ref: string; _type: 'reference' } } | null
  shortDescription: string | null
  tags: string[] | null
  publishedAt: string | null
}

function formatDate(iso: string): string {
  return new Date(iso).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  })
}

export default async function BlogsPage() {
  const blogs = await client.fetch<Blog[]>(
    `*[_type == "blog" && status == "published"] | order(publishedAt desc) {
      title,
      slug,
      coverImage,
      shortDescription,
      tags,
      publishedAt
    }`
  )

  return (
    <>
      <Nav />

      <main className="max-w-[1440px] mx-auto">
        <div className="max-w-[760px] mx-auto px-6 xl:px-0 pt-[88px] sm:pt-[112px] pb-24">
          {/* Breadcrumb */}
          <nav className="flex items-center gap-2 mb-6 text-label" aria-label="Breadcrumb">
            <Link href="/" className="press focusable tap text-zinc-400 hover:text-white">
              Home
            </Link>
            <span className="text-quiet" aria-hidden="true">/</span>
            <span className="text-zinc-400">Blogs</span>
          </nav>

          <h1 className="text-h1 text-white mb-6">Blogs</h1>

          <hr className="border-zinc-800 mb-6" />

          {blogs.length === 0 ? (
            <p className="text-body-sm text-quiet text-center py-24">No posts yet</p>
          ) : (
            <ul className="divide-y divide-zinc-800">
              {blogs.map((blog) => {
                const coverUrl = blog.coverImage?.asset
                  ? urlFor(blog.coverImage).width(240).height(160).url()
                  : null
                return (
                  <li key={blog.slug.current} className="flex gap-5 py-6">
                    {coverUrl && (
                      <Link
                        href={`/blogs/${blog.slug.current}`}
                        className="press shrink-0"
                        tabIndex={-1}
                        aria-hidden="true"
                      >
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img
                          src={coverUrl}
                          alt=""
                          width={120}
                          height={80}
                          className="w-[120px] h-[80px] rounded-md object-cover"
                          loading="lazy"
                          decoding="async"
                        />
                      </Link>
                    )}

                    <div className="flex flex-col gap-1.5 min-w-0">
                      <h2>
                        <Link
                          href={`/blogs/${blog.slug.current}`}
                          className="press focusable tap text-title text-white hover:text-accent-soft"
                        >
                          {blog.title}
                        </Link>
                      </h2>

                      {blog.publishedAt && (
                        <p className="text-meta text-quiet">{formatDate(blog.publishedAt)}</p>
                      )}

                      {blog.shortDescription && (
                        <p className="text-body-sm text-zinc-400 line-clamp-2">
                          {blog.shortDescription}
                        </p>
                      )}

                      {blog.tags && blog.tags.length > 0 && (
                        <div className="flex flex-wrap gap-1.5 mt-1">
                          {blog.tags.map((tag) => (
                            <span
                              key={tag}
                              className="bg-zinc-900 border border-zinc-800 rounded px-2 py-0.5 text-meta text-zinc-400 whitespace-nowrap"
                            >
                              {tag}
                            </span>
                          ))}
                        </div>
                      )}
                    </div>
                  </li>
                )
              })}
            </ul>
          )}
        </div>
      </main>
    </>
  )
}
