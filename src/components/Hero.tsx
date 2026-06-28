import { client, urlFor } from '@/lib/sanity'
import NepalClock from './NepalClock'
import ProfilePhoto from './ProfilePhoto'

interface SiteSettings {
  heroBanner?: { _type: 'image'; asset: { _ref: string; _type: 'reference' } } | null
  name?: string
  title?: string
  location?: string
}

const maskStyle = {
  WebkitMaskImage: 'linear-gradient(to bottom, black 45%, transparent 92%)',
  maskImage: 'linear-gradient(to bottom, black 45%, transparent 92%)',
} as const

export default async function Hero() {
  const settings = await client.fetch<SiteSettings | null>(`*[_type == "siteSettings"][0] {
    heroBanner,
    name,
    title,
    location,
    bioQuote
  }`)

  const name = settings?.name ?? 'Saugat K.C.'
  const role = settings?.title ?? 'Associate QA Engineer'
  const location = settings?.location ?? 'Kathmandu, Nepal 🇳🇵'
  const bannerUrl = settings?.heroBanner ? urlFor(settings.heroBanner).width(760).url() : null

  return (
    <div className="relative h-[200px] sm:h-[348px] w-full">
      {/* Banner background: image from Sanity or fallback blue gradient.
          -inset-x-6 cancels the section's px-6 so the banner edges land on the
          rails (the "+" line); square top so it sits flush under the nav. */}
      <div
        className="absolute -inset-x-[13.5px] top-0 h-[170px] sm:h-[294px] rounded-b-[13px] overflow-hidden"
        style={maskStyle}
      >
        {bannerUrl ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={bannerUrl} alt="" className="w-full h-full object-cover" aria-hidden="true" />
        ) : (
          <div className="w-full h-full bg-[#4c1d95]"></div>
        )}
      </div>

      {/* Nepal clock badge (top-right) */}
      <div className="absolute top-[8px] right-[8px] sm:top-[9px] sm:right-[9px] bg-[#0f1317] rounded-[6px] px-2 py-[3px] sm:px-3 sm:py-[5px] z-[2]">
        <NepalClock />
      </div>

      {/* Profile: photo + name/role/location */}
      <div className="absolute bottom-0 left-0 flex items-end gap-2 sm:gap-5 z-[2]">
        <ProfilePhoto />

        {/* Text info */}
        <div className="flex flex-col gap-0 pb-1 sm:pb-2">
          <div className="flex items-center gap-1.5 sm:gap-2">
            <span className="font-display font-bold text-[22px] sm:text-[40.5px] text-white leading-tight whitespace-nowrap">
              {name}
            </span>
            {/* Verified checkmark */}
            <svg
              className="w-[16px] h-[16px] sm:w-[25px] sm:h-[25px] text-blue-400 shrink-0"
              viewBox="0 0 20 20"
              fill="currentColor"
              aria-hidden="true"
            >
              <path
                fillRule="evenodd"
                d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.857-9.809a.75.75 0 00-1.214-.882l-3.483 4.79-1.88-1.88a.75.75 0 10-1.06 1.061l2.5 2.5a.75.75 0 001.137-.089l4-5.5z"
                clipRule="evenodd"
              />
            </svg>
          </div>
          <span className="font-semibold text-[20px] sm:text-[22.5px] text-[#e7d2f9] leading-tight">{role}</span>
          <span className="t-body text-[#a1a1aa] leading-tight">{location}</span>
        </div>
      </div>
    </div>
  )
}
