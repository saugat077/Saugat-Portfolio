import { client, urlFor } from '@/lib/sanity'
import BookCard from './BookCard'
import ScrollRow from './ScrollRow'

interface Book {
  _id: string
  title: string
  author: string
  coverImage?: { _type: 'image'; asset: { _ref: string; _type: 'reference' } } | null
  slug: { current: string }
}

export default async function Books() {
  const books = await client.fetch<Book[]>(
    `*[_type == "book" && status == "published"] | order(_createdAt desc) [0...5] {
      _id,
      title,
      author,
      coverImage,
      slug
    }`
  )

  if (books.length === 0) return null

  return (
    <section className="flex flex-col gap-[34px] lg:gap-[49px]">
      <h2 className="text-title sheen">Books</h2>

      {/* The row overflows well before the desktop breakpoint, so it stays a
          scroller at every width rather than wrapping into a ragged grid. */}
      <ScrollRow className="flex gap-3.5 items-start overflow-x-auto pb-1 -mb-1">
        {books.map((book) => (
          <BookCard
            key={book._id}
            title={book.title}
            author={book.author}
            coverUrl={
              book.coverImage?.asset ? urlFor(book.coverImage).width(262).height(420).url() : null
            }
            slug={book.slug.current}
          />
        ))}
      </ScrollRow>
    </section>
  )
}
