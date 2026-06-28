import { client, urlFor } from '@/lib/sanity'
import { safeUrl } from '@/lib/url'

interface Affiliation {
  _id: string
  orgName: string
  logo: { _type: 'image'; asset: { _ref: string; _type: 'reference' } }
  websiteUrl: string
  order: number
}

export default async function Affiliations() {
  const affiliations = await client.fetch<Affiliation[]>(
    `*[_type == "affiliation"] | order(order asc) {
      _id,
      orgName,
      logo,
      websiteUrl,
      order
    }`
  )

  if (affiliations.length === 0) return null

  return (
    <section className="flex flex-col gap-6">
      <div className="flex flex-col">
        <span className="text-[14px] text-zinc-400 leading-tight">Built with others</span>
        <h2 className="t-display text-white">Clubs & Events</h2>
      </div>

      <div className="flex flex-nowrap items-center gap-7 overflow-x-auto pb-1">
        {affiliations.map((aff) => (
          <a
            key={aff._id}
            href={safeUrl(aff.websiteUrl)}
            target="_blank"
            rel="noopener noreferrer"
            aria-label={aff.orgName}
            className="group shrink-0 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/40 rounded"
          >
            {aff.logo?.asset ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src={urlFor(aff.logo).width(312).url()}
                alt={aff.orgName}
                className="max-h-9 sm:max-h-13 max-w-27.5 sm:max-w-39 w-auto h-auto object-contain brightness-0 invert transition-[filter] duration-300 group-hover:brightness-100 group-hover:invert-0"
                loading="lazy"
                decoding="async"
              />
            ) : (
              <span className="t-display text-silver">{aff.orgName}</span>
            )}
          </a>
        ))}
      </div>
    </section>
  )
}
