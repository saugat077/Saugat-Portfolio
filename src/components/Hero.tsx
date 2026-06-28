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
  WebkitMaskImage: 'linear-gradient(to bottom, black 28%, transparent 80%)',
  maskImage: 'linear-gradient(to bottom, black 28%, transparent 75%)',
} as const

export default async function Hero() {
  const settings = await client.fetch<SiteSettings | null>(`*[_type == "siteSettings"][0] {
    heroBanner,
    name,
    title,
    location,
    bioQuote
  }`)

  const name = settings?.name ?? 'Saugat KC'
  const role = settings?.title ?? 'Associate QA Engineer'
  const location = settings?.location ?? 'Kathmandu, Nepal 🇳🇵'
  const bannerUrl = settings?.heroBanner ? urlFor(settings.heroBanner).width(760).url() : null

  return (
    <div className="relative h-[200px] sm:h-[348px] w-full">
      {/* Banner background: image from Sanity */}
      <div
        className="absolute -inset-x-[13.5px] top-0 h-[170px] sm:h-[294px]"
        style={maskStyle}
      >
        {bannerUrl ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={bannerUrl} alt="Background Image" className="w-full h-full object-cover" aria-hidden="true" />
        ) : (
          <div className="w-full h-full bg-violet-900"></div>
        )}
      </div>

      {/* Nepal clock badge (top-right) */}
      <div className="absolute top-[8px] right-[8px] sm:top-[9px] sm:right-[9px] bg-panel rounded-[6px] px-2 py-[3px] sm:px-3 sm:py-[5px] z-[2]">
        <NepalClock />
      </div>

      {/* Profile: photo + name/role/location */}
      <div className="absolute bottom-0 left-0 flex items-end gap-2 sm:gap-5 z-[2]">
        <ProfilePhoto />

        {/* Text info */}
        <div className="flex flex-col gap-0 pb-1 sm:pb-2">
          <div className="flex items-center gap-1.5 sm:gap-2">
            <span className="t-display font-bold text-[22px] sm:text-[36px] text-white leading-tight whitespace-nowrap">
              {name}
            </span>
            {/* Verified checkmark */}
            <img
              src="/icons/verify.png"
              alt="Verified"
              className="w-[24px] h-[24px] sm:w-[32px] sm:h-[32px] shrink-0 object-contain"
            />
          </div>
          <span className="text-[16px] sm:text-[18px] font-medium pt-0.5 pb-0.5 text-accent-soft leading-tight">{role}</span>
          <span className="t-body text-zinc-400 leading-tight">{location}</span>
        </div>
      </div>
    </div>
  )
}
