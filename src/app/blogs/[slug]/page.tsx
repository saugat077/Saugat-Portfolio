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
    title: `${blog.title} | Saugat K.C.`,
    description: blog.shortDescription ?? `${blog.title}   by Saugat K.C.`,
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
        <nav className="flex items-center gap-2 mb-6 font-body text-[13px]" aria-label="Breadcrumb">
          <Link href="/" className="text-zinc-600 hover:text-zinc-400 transition-colors">
            Home
          </Link>
          <span className="text-zinc-700">/</span>
          <Link href="/blogs" className="text-zinc-600 hover:text-zinc-400 transition-colors">
            Blogs
          </Link>
          <span className="text-zinc-700">/</span>
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
        <h1 className="font-display text-[28px] sm:text-[34px] text-white leading-tight mb-3">{blog.title}</h1>

        {/* Date and tags row */}
        <div className="flex flex-wrap items-center gap-3 mb-6">
          {blog.publishedAt && (
            <span className="font-body text-[13px] text-zinc-600">{formatDate(blog.publishedAt)}</span>
          )}
          {blog.tags && blog.tags.length > 0 && (
            <div className="flex flex-wrap gap-1.5">
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

        {/* Divider */}
        <hr className="border-zinc-800 mb-8" />

        {/* Body */}
        {bodyHtml ? (
          <div dangerouslySetInnerHTML={{ __html: bodyHtml }} />
        ) : (
          <p className="font-body text-[16px] text-zinc-500 italic">No content yet.</p>
        )}

        {/* Back link */}
        <div className="mt-12">
          <Link
            href="/blogs"
            className="inline-flex items-center gap-1.5 font-body text-[13px] text-zinc-500 hover:text-white transition-colors"
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
