import type { Metadata } from 'next'
import Link from 'next/link'
import Nav from '@/components/Nav'
import { client, urlFor } from '@/lib/sanity'

export const metadata: Metadata = {
  title: 'Blogs | Saugat K.C.',
  description: 'Thoughts and writing by Saugat K.C.',
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
          <nav className="flex items-center gap-2 mb-6 font-body text-[13px]" aria-label="Breadcrumb">
            <Link href="/" className="text-zinc-600 hover:text-zinc-400 transition-colors">
              Home
            </Link>
            <span className="text-zinc-700">/</span>
            <span className="text-zinc-400">Blogs</span>
          </nav>

          <hr className="border-zinc-800 mb-6" />

          {blogs.length === 0 ? (
            <p className="font-body text-[15px] text-zinc-600 text-center py-24">No posts yet</p>
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
                        className="shrink-0"
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
                      <Link
                        href={`/blogs/${blog.slug.current}`}
                        className="font-display text-[17px] text-white leading-snug hover:text-zinc-300 transition-colors"
                      >
                        {blog.title}
                      </Link>

                      {blog.publishedAt && (
                        <p className="font-body text-[12px] text-zinc-600">{formatDate(blog.publishedAt)}</p>
                      )}

                      {blog.shortDescription && (
                        <p className="font-body text-[14px] text-zinc-500 leading-relaxed line-clamp-2">
                          {blog.shortDescription}
                        </p>
                      )}

                      {blog.tags && blog.tags.length > 0 && (
                        <div className="flex flex-wrap gap-1.5 mt-1">
                          {blog.tags.map((tag) => (
                            <span
                              key={tag}
                              className="bg-zinc-900 border border-zinc-800 rounded px-2 py-0.5 font-body text-[11px] text-zinc-500 whitespace-nowrap leading-[16px]"
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
