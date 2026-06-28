import Link from 'next/link'
import { client, urlFor } from '@/lib/sanity'
import BookCard from './BookCard'

interface Book {
  _id: string
  title: string
  author: string
  coverImage?: { _type: 'image'; asset: { _ref: string; _type: 'reference' } } | null
  slug: { current: string }
}

export default async function BookReview() {
  const books = await client.fetch<Book[]>(
    `*[_type == "book" && status == "published"] | order(_createdAt desc) [0...4] {
      _id,
      title,
      author,
      coverImage,
      slug
    }`
  )

  if (books.length === 0) return null

  return (
    <section className="flex flex-col gap-6">
      {/* Section header */}
      <div className="flex items-center justify-between">
        <h2 className="t-display text-white">Book Review</h2>
        <Link href="/books" className="t-caption text-white hover:text-zinc-400 transition-colors">
          View more &gt;
        </Link>
      </div>

      {/* Book covers row — 4 fixed-size cards; scrollable on mobile */}
      <div className="flex gap-[10px] sm:gap-[14px] items-start overflow-x-auto pb-1 -mb-1">
        {books.map((book) => (
          <BookCard
            key={book._id}
            title={book.title}
            author={book.author}
            coverUrl={book.coverImage?.asset ? urlFor(book.coverImage).width(360).height(576).url() : null}
            slug={book.slug.current}
          />
        ))}
      </div>
    </section>
  )
}
