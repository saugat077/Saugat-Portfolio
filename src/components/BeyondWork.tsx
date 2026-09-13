import { client, urlFor } from '@/lib/sanity'
import { safeUrl } from '@/lib/url'

interface Affiliation {
  _id: string
  orgName: string
  logo: { _type: 'image'; asset: { _ref: string; _type: 'reference' } }
  websiteUrl: string
}

const FALLBACK_BLURB =
  'My proudest moments have been turning ideas into meaningful experiences. With 4+ years in visual design, mentorship, student leadership, and event management, every experience has shaped how I create, lead, and grow.'

interface SiteSettings {
  beyondWork?: string
}

// The logos arrive as full-colour marks on transparent backgrounds; the design
// renders them as one flat silver. brightness-0 crushes them to black, invert
// lifts them to white, and the opacity lands on #c7c7c7 against the page.
const SILVER = 'brightness-0 invert opacity-[0.78]'

export default async function BeyondWork() {
  const [affiliations, settings] = await Promise.all([
    client.fetch<Affiliation[]>(
      `*[_type == "affiliation"] | order(order asc) [0...6] { _id, orgName, logo, websiteUrl }`
    ),
    client.fetch<SiteSettings | null>(`*[_type == "siteSettings"][0] { beyondWork }`),
  ])

  return (
    <section className="flex flex-col gap-[34px] lg:gap-[49px]">
      <h2 className="text-title sheen">Beyond Work</h2>

      <div className="flex flex-col gap-12 lg:flex-row lg:items-start lg:gap-[146px]">
        <p className="text-lead text-muted lg:w-[308px] lg:shrink-0">
          {settings?.beyondWork ?? FALLBACK_BLURB}
        </p>

        {affiliations.length > 0 && (
          <ul className="grid grid-cols-3 items-center gap-x-8 gap-y-10 lg:w-[464px]">
            {affiliations.map((aff) => {
              const href = safeUrl(aff.websiteUrl)
              const logo = aff.logo?.asset ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  src={urlFor(aff.logo).width(380).url()}
                  alt={aff.orgName}
                  className={`max-h-[34px] lg:max-h-[47px] w-auto mx-auto object-contain transition-[filter,opacity] duration-300 group-hover:brightness-100 group-hover:invert-0 group-hover:opacity-100 ${SILVER}`}
                  loading="lazy"
                  decoding="async"
                />
              ) : (
                <span className="text-lead text-silver">{aff.orgName}</span>
              )

              return (
                <li key={aff._id} className="flex items-center justify-center">
                  {href ? (
                    <a
                      href={href}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="press focusable group block"
                    >
                      {logo}
                    </a>
                  ) : (
                    logo
                  )}
                </li>
              )
            })}
          </ul>
        )}
      </div>
    </section>
  )
}
