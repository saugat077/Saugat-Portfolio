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
  const [entering, setEntering] = useState<Set<string>>(new Set())

  const visibleFor = (tag: string) =>
    new Set(
      books
        .filter((b) => tag === 'all' || (b.tags ?? []).includes(tag))
        .map((b) => b.slug.current)
    )

  function selectTag(tag: string) {
    if (tag === active) return
    const before = visibleFor(active)
    setEntering(new Set([...visibleFor(tag)].filter((slug) => !before.has(slug))))
    setActive(tag)
  }

  const shownCount = active === 'all' ? books.length : tagCounts[active]

  const pillClass = (isActive: boolean) =>
    `press focusable tap inline-flex items-center gap-1.5 text-label px-4 rounded-full border cursor-pointer ${
      isActive
        ? 'border-purple-500 bg-purple-500/10 text-white'
        : 'border-zinc-500 text-zinc-400 hover:border-accent-soft/40 hover:text-accent-soft'
    }`

  const countClass = (isActive: boolean) =>
    `tabular-nums text-zinc-400 transition-opacity duration-150 ${
      isActive ? 'opacity-100' : 'opacity-0'
    }`

  return (
    <>
      {/* Filter row */}
      {books.length > 0 && (
        <div
          className="flex items-center gap-2 flex-wrap mb-8"
          id="filter-row"
          role="group"
          aria-label="Filter books by tag"
        >
          {/* All pill */}
          <button
            type="button"
            onClick={() => selectTag('all')}
            className={pillClass(active === 'all')}
            aria-pressed={active === 'all'}
          >
            All
            <span className={countClass(active === 'all')} aria-hidden={active !== 'all'}>
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
                onClick={() => selectTag(tag)}
                className={pillClass(isActive)}
                aria-pressed={isActive}
              >
                {tag}
                <span className={countClass(isActive)} aria-hidden={!isActive}>
                  {tagCounts[tag]}
                </span>
              </button>
            )
          })}
        </div>
      )}

      <p aria-live="polite" className="sr-only">
        Showing {shownCount} of {books.length} books
        {active === 'all' ? '' : `, filtered by ${active}`}
      </p>

      {/* Grid */}
      {books.length === 0 ? (
        <p className="text-body-sm text-quiet italic">No books yet</p>
      ) : (
        <div className="flex flex-wrap gap-[10px] sm:gap-[14px]" id="books-grid">
          {books.map((book) => {
            const tags = book.tags ?? []
            const show = active === 'all' || tags.includes(active)
            return (
              <div
                key={book.slug.current}
                style={{ display: show ? undefined : 'none' }}
                className={
                  show && entering.has(book.slug.current)
                    ? 'animate-[filter-in_220ms_ease-out]'
                    : undefined
                }
              >
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
