import type { Metadata } from 'next'
import Link from 'next/link'
import Nav from '@/components/Nav'
import BooksFilter, { type FilterBook } from '@/components/BooksFilter'
import { client, urlFor } from '@/lib/sanity'

export const metadata: Metadata = {
  title: 'Books | Saugat K.C.',
  description: 'A summary and thoughts on every book Saugat K.C. finishes.',
}

interface RawBook {
  title: string
  author: string
  slug: { current: string }
  coverImage?: { _type: 'image'; asset: { _ref: string; _type: 'reference' } } | null
  tags: string[] | null
}

export default async function BooksPage() {
  const raw = await client.fetch<RawBook[]>(
    `*[_type == "book" && status == "published"] | order(_createdAt desc) {
      title,
      author,
      slug,
      coverImage,
      tags
    }`
  )

  const books: FilterBook[] = raw.map((book) => ({
    title: book.title,
    author: book.author,
    slug: book.slug,
    tags: book.tags,
    coverUrl: book.coverImage?.asset ? urlFor(book.coverImage).width(360).height(576).url() : null,
  }))

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
            <span className="text-zinc-400">Books</span>
          </nav>

          <hr className="border-zinc-800 mb-6" />

          <BooksFilter books={books} />
        </div>
      </main>
    </>
  )
}
