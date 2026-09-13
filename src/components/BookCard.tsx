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
      className="press focusable group block w-[118px] lg:w-[131px] shrink-0"
    >
      <div className="relative h-[189px] lg:h-[210px] overflow-hidden rounded-lg bg-zinc-900">
        {coverUrl ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={coverUrl}
            alt=""
            className="w-full h-full object-cover transition-transform duration-300 ease-out group-hover:scale-105 motion-reduce:group-hover:scale-100"
            loading="lazy"
            decoding="async"
          />
        ) : (
          <div className="w-full h-full flex items-end p-3 border border-zinc-800 rounded-lg">
            <span className="text-body-sm text-card line-clamp-3">{title}</span>
          </div>
        )}

        {/* Hover overlay: fades in, anchored to bottom. Hidden on touch, where
            the caption below takes over instead. */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/20 to-transparent opacity-0 group-hover:opacity-100 group-focus-visible:opacity-100 [@media(hover:none)]:hidden transition-opacity duration-300 ease-out flex flex-col justify-end p-3">
          <p className="text-body-sm text-white line-clamp-3">{title}</p>
          <p className="text-meta text-card mt-0.5 line-clamp-1">{author}</p>
        </div>
      </div>

      <div className="hidden [@media(hover:none)]:flex flex-col gap-0.5 pt-2">
        <p className="text-body-sm text-white line-clamp-2">{title}</p>
        <p className="text-meta text-muted line-clamp-1">{author}</p>
      </div>
    </Link>
  )
}
