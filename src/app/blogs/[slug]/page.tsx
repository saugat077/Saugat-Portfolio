import type { Metadata } from 'next'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import Nav from '@/components/Nav'
import { client, urlFor } from '@/lib/sanity'
import { renderPortableText, type BodyBlock } from '@/lib/portableText'

export const dynamicParams = false

interface Blog {
  title: string
  coverImage: { _type: 'image'; asset: { _ref: string; _type: 'reference' } } | null
  shortDescription: string | null
  tags: string[] | null
  publishedAt: string | null
  body: BodyBlock[] | null
}

export async function generateStaticParams() {
  const blogs = await client.fetch<{ slug: string }[]>(
    `*[_type == "blog" && status == "published"]{ "slug": slug.current }`
  )
  return blogs.map((blog) => ({ slug: blog.slug }))
}

async function getBlog(slug: string): Promise<Blog | null> {
  return client.fetch<Blog | null>(
    `*[_type == "blog" && slug.current == $slug][0] {
      title,
      coverImage,
      shortDescription,
      tags,
      publishedAt,
      body
    }`,
    { slug }
  )
}

function formatDate(iso: string): string {
  return new Date(iso).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  })
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>
}): Promise<Metadata> {
  const { slug } = await params
  const blog = await getBlog(slug)
  if (!blog) return {}
  return {
    title: `${blog.title} | Saugat KC`,
    description: blog.shortDescription ?? `${blog.title}   by Saugat KC`,
    alternates: { canonical: `/blogs/${slug}` },
  }
}

export default async function BlogPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
  const blog = await getBlog(slug)

  if (!blog) notFound()

  const bodyHtml = blog.body ? renderPortableText(blog.body) : ''
  const coverUrl = blog.coverImage?.asset ? urlFor(blog.coverImage).width(760).url() : null

  return (
    <>
      <Nav />

      <main className="max-w-[760px] mx-auto px-6 xl:px-0 pt-[88px] sm:pt-[112px] pb-24">
        {/* Breadcrumb */}
        <nav className="flex items-center gap-2 mb-6 text-label" aria-label="Breadcrumb">
          <Link href="/" className="press focusable tap text-zinc-400 hover:text-white">
            Home
          </Link>
          <span className="text-quiet" aria-hidden="true">/</span>
          <Link href="/blogs" className="press focusable tap text-zinc-400 hover:text-white">
            Blogs
          </Link>
          <span className="text-quiet" aria-hidden="true">/</span>
          <span className="text-zinc-400 truncate">{blog.title}</span>
        </nav>

        {/* Cover image */}
        {coverUrl && (
          <div className="w-full rounded-xl overflow-hidden mb-8 bg-zinc-900">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={coverUrl}
              alt={`${blog.title} cover`}
              className="w-full object-cover"
              loading="eager"
              decoding="async"
            />
          </div>
        )}

        {/* Title */}
        <h1 className="text-h1 text-white mb-3">{blog.title}</h1>

        {/* Date and tags row */}
        <div className="flex flex-wrap items-center gap-3 mb-6">
          {blog.publishedAt && (
            <span className="text-meta text-quiet">{formatDate(blog.publishedAt)}</span>
          )}
          {blog.tags && blog.tags.length > 0 && (
            <div className="flex flex-wrap gap-1.5">
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

        {/* Divider */}
        <hr className="border-zinc-800 mb-8" />

        {/* Body */}
        {bodyHtml ? (
          <div className="max-w-[68ch]" dangerouslySetInnerHTML={{ __html: bodyHtml }} />
        ) : (
          <p className="text-body text-zinc-400 italic">No content yet.</p>
        )}

        {/* Back link */}
        <div className="mt-12">
          <Link
            href="/blogs"
            className="press focusable tap inline-flex gap-1.5 text-label text-zinc-400 hover:text-white"
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
            Back to blogs
          </Link>
        </div>
      </main>
    </>
  )
}
