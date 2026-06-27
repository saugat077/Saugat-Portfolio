'use client'

import { useMemo, useState } from 'react'
import BookCard from './BookCard'

export interface FilterBook {
  title: string
  author: string
  slug: { current: string }
  coverUrl: string | null
  tags: string[] | null
}

export default function BooksFilter({ books }: { books: FilterBook[] }) {
  // Unique tags in first-seen order
  const allTags = useMemo(() => {
    const tags: string[] = []
    for (const book of books) {
      for (const tag of book.tags ?? []) {
        if (!tags.includes(tag)) tags.push(tag)
      }
    }
    return tags
  }, [books])

  // Pre-calculate count for each tag from the full dataset
  const tagCounts = useMemo(() => {
    const counts: Record<string, number> = { all: books.length }
    for (const tag of allTags) {
      counts[tag] = books.filter((b) => b.tags?.includes(tag)).length
    }
    return counts
  }, [books, allTags])

  const [active, setActive] = useState('all')

  const pillClass = (isActive: boolean) =>
    `filter-pill inline-flex items-center gap-1.5 font-body text-[13px] px-3 py-1 rounded-full border transition-colors cursor-pointer ${
      isActive
        ? 'border-[#378ADD] bg-[#378ADD]/10 text-white'
        : 'border-[#3f3f46] text-[#71717a] hover:border-[#52525b] hover:text-[#a1a1aa]'
    }`

  return (
    <>
      {/* Filter row */}
      {books.length > 0 && (
        <div className="flex items-center gap-2 flex-wrap mb-8" id="filter-row">
          {/* All pill */}
          <button
            type="button"
            onClick={() => setActive('all')}
            className={pillClass(active === 'all')}
            aria-pressed={active === 'all'}
          >
            All
            <span className={`tabular-nums text-[#a1a1aa] ${active === 'all' ? '' : 'hidden'}`}>
              {tagCounts.all}
            </span>
          </button>

          {/* Tag pills */}
          {allTags.map((tag) => {
            const isActive = active === tag
            return (
              <button
                key={tag}
                type="button"
                onClick={() => setActive(tag)}
                className={pillClass(isActive)}
                aria-pressed={isActive}
              >
                {tag}
                <span className={`tabular-nums text-[#a1a1aa] ${isActive ? '' : 'hidden'}`}>{tagCounts[tag]}</span>
              </button>
            )
          })}
        </div>
      )}

      {/* Grid */}
      {books.length === 0 ? (
        <p className="font-body text-[15px] text-[#52525b] italic">No books yet</p>
      ) : (
        <div className="flex flex-wrap gap-[10px] sm:gap-[14px]" id="books-grid">
          {books.map((book) => {
            const tags = book.tags ?? []
            const show = active === 'all' || tags.includes(active)
            return (
              <div key={book.slug.current} style={{ display: show ? undefined : 'none' }}>
                <BookCard
                  title={book.title}
                  author={book.author}
                  coverUrl={book.coverUrl}
                  slug={book.slug.current}
                />
              </div>
            )
          })}
        </div>
      )}
    </>
  )
}
