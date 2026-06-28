import Link from 'next/link'

interface BookCardProps {
  title: string
  author: string
  coverUrl?: string | null
  slug: string
}

export default function BookCard({ title, author, coverUrl, slug }: BookCardProps) {
  return (
    <Link
      href={`/books/${slug}`}
      className="group relative block w-[140px] h-[224px] sm:w-[179px] sm:h-[287px] shrink-0 overflow-hidden rounded-lg bg-zinc-900 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/40"
      title={title}
    >
      {coverUrl ? (
        // eslint-disable-next-line @next/next/no-img-element
        <img
          src={coverUrl}
          alt={`${title} cover`}
          className="w-full h-full object-cover transition-transform duration-300 ease-out group-hover:scale-105"
          loading="lazy"
          decoding="async"
        />
      ) : (
        <div className="w-full h-full flex items-end p-3 border border-zinc-800 rounded-lg">
          <span className="t-display text-zinc-400 line-clamp-3 leading-tight">{title}</span>
        </div>
      )}

      {/* Hover overlay: fades in, anchored to bottom */}
      <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 ease-out flex flex-col justify-end p-3">
        <p className="t-display text-white leading-snug line-clamp-2">{title}</p>
        <p className="t-caption text-zinc-400 mt-0.5 line-clamp-1">{author}</p>
      </div>
    </Link>
  )
}
