import type { Metadata } from 'next'
import Nav from '@/components/Nav'
import BooksFilter, { type FilterBook } from '@/components/BooksFilter'
import { client, urlFor } from '@/lib/sanity'

export const metadata: Metadata = {
  title: 'Books | Saugat KC',
  description: 'A summary and thoughts on every book Saugat KC finishes.',
  alternates: { canonical: '/books' },
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
          {/* Kept for the document outline and the screen-reader page title;
              the route is named in the header, so showing it again is noise. */}
          <h1 className="sr-only">Books</h1>

          <BooksFilter books={books} />
        </div>
      </main>
    </>
  )
}
