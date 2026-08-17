import type { Metadata } from 'next'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import Nav from '@/components/Nav'
import { client, urlFor } from '@/lib/sanity'
import { renderPortableText, type BodyBlock } from '@/lib/portableText'

export const dynamicParams = false

interface Book {
  title: string
  author: string
  shortDescription: string
  tags: string[]
  coverImage: { _type: 'image'; asset: { _ref: string; _type: 'reference' } }
  body: BodyBlock[]
}

export async function generateStaticParams() {
  const books = await client.fetch<{ slug: string }[]>(
    `*[_type == "book" && status == "published"]{ "slug": slug.current }`
  )
  return books.map((book) => ({ slug: book.slug }))
}

async function getBook(slug: string): Promise<Book | null> {
  return client.fetch<Book | null>(
    `*[_type == "book" && slug.current == $slug][0] {
      title,
      author,
      shortDescription,
      coverImage,
      tags,
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
  const book = await getBook(slug)
  if (!book) return {}
  return {
    title: `${book.title} | Saugat KC`,
    description: `${book.title} by ${book.author}   reviewed by Saugat KC`,
    alternates: { canonical: `/books/${slug}` },
  }
}

export default async function BookPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
  const book = await getBook(slug)

  if (!book) notFound()

  const bodyHtml = book.body ? renderPortableText(book.body) : ''
  const coverUrl = book.coverImage?.asset ? urlFor(book.coverImage).width(400).height(600).url() : null

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
          <Link href="/books" className="press focusable tap text-zinc-400 hover:text-white">
            Books
          </Link>
          <span className="text-quiet" aria-hidden="true">/</span>
          <span className="text-zinc-400 truncate">{book.title}</span>
        </nav>

        {/* Two-column hero */}
        <div className="flex flex-col md:flex-row gap-8 mb-8">
          {/* Left: cover (25%)   portrait ratio */}
          {coverUrl && (
            <div className="md:w-[25%] shrink-0 self-start rounded-[16px] overflow-hidden bg-zinc-900">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={coverUrl}
                alt={`${book.title} cover`}
                className="w-full object-cover"
                style={{ aspectRatio: '2/3' }}
                loading="eager"
                decoding="async"
              />
            </div>
          )}

          {/* Right: metadata (75%) */}
          <div className="flex flex-col gap-4 md:w-[75%]">
            <h1 className="text-h1 text-white">{book.title}</h1>

            <p className="text-body-sm text-zinc-400">by {book.author}</p>

            {book.shortDescription && (
              <p className="text-body-sm text-zinc-400">{book.shortDescription}</p>
            )}

            {book.tags?.length > 0 && (
              <div className="flex flex-wrap gap-1.5">
                {book.tags.map((tag) => (
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
        </div>

        {/* Divider */}
        <hr className="border-zinc-800 mb-8" />

        {/* Body */}
        {bodyHtml ? (
          <div className="max-w-[68ch]" dangerouslySetInnerHTML={{ __html: bodyHtml }} />
        ) : (
          <p className="text-body text-zinc-400 italic">No review written yet.</p>
        )}

        {/* Back link */}
        <div className="mt-12">
          <Link
            href="/books"
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
            Back to books
          </Link>
        </div>
      </main>
    </>
  )
}
