import { client, urlFor } from '@/lib/sanity'

interface Career {
  _id: string
  company: string
  companyLogo: { _type: 'image'; asset: { _ref: string; _type: 'reference' } }
  role: string
  description: string
  startDate: string
  endDate?: string
  tags: string[]
}

const MONTHS = ['JAN', 'FEB', 'MAR', 'APR', 'MAY', 'JUN', 'JUL', 'AUG', 'SEP', 'OCT', 'NOV', 'DEC'] as const

function ordinalSuffix(day: number): string {
  if (day >= 11 && day <= 13) return 'TH'
  switch (day % 10) {
    case 1:
      return 'ST'
    case 2:
      return 'ND'
    case 3:
      return 'RD'
    default:
      return 'TH'
  }
}

function formatDate(dateStr: string): string {
  const [year, month, day] = dateStr.split('-').map(Number)
  return `${day}${ordinalSuffix(day)} ${MONTHS[month - 1]}, ${year}`
}

export default async function Experience() {
  const careers = await client.fetch<Career[]>(
    `*[_type == "career"] | order(startDate desc) {
      _id,
      company,
      companyLogo,
      role,
      description,
      startDate,
      endDate,
      tags
    }`
  )

  if (careers.length === 0) return null

  return (
    <section className="flex flex-col gap-6">
      <h2 className="t-display text-white">Career So Far</h2>

      <div className="flex flex-col gap-8 sm:gap-6">
        {careers.map((career) => (
          <div key={career._id} className="flex flex-col sm:flex-row items-start w-full gap-1 sm:gap-0">
            {/* Date — full width on mobile, fixed column on desktop */}
            <div className="sm:w-[213px] shrink-0 sm:pt-1">
              <p className="t-caption text-silver uppercase tracking-[1.2px] leading-[18px] sm:leading-[24px]">
                {formatDate(career.startDate)}
                <br />— {career.endDate ? formatDate(career.endDate) : 'PRESENT'}
              </p>
            </div>

            {/* Timeline line + content */}
            <div className="flex-1 border-l border-zinc-800 pl-6 sm:pl-12 relative min-w-0 w-full">
              {/* Company logo dot */}
              <div className="absolute -left-[15px] sm:-left-[21px] top-0 w-[30px] h-[30px] sm:w-[43px] sm:h-[43px] rounded-full bg-base border border-zinc-800 flex items-center justify-center overflow-hidden shrink-0">
                {career.companyLogo?.asset ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img
                    src={urlFor(career.companyLogo).width(54).height(54).url()}
                    alt={career.company}
                    className="w-[18px] h-[18px] sm:w-[27px] sm:h-[27px] object-contain rounded-full"
                    loading="lazy"
                    decoding="async"
                  />
                ) : (
                  <div className="w-4 h-4 sm:w-5 sm:h-5 rounded-full bg-zinc-800"></div>
                )}
              </div>

              {/* Company + role */}
              <div className="flex flex-col gap-0.5 sm:gap-1 mb-2">
                <div className="flex items-center gap-2">
                  <span className="font-semibold text-[20px] sm:text-[22.5px]  leading-tight t-body text-white sm:leading-[30px]">
                    {career.company}
                  </span>
                  {!career.endDate && (
                    <span
                      className="w-2 h-2 sm:w-2.5 sm:h-2.5 rounded-full bg-green-500 shrink-0"
                      aria-label="Currently working here"
                    ></span>
                  )}
                </div>
                <span className="t-body text-white leading-[22px] sm:leading-[26px]">
                  {career.role}
                </span>
              </div>

              {/* Description */}
              {career.description && (
                <p className="t-body text-zinc-500 leading-[22px] sm:leading-[28px] mb-3">
                  {career.description}
                </p>
              )}

              {/* Tech tags */}
              {career.tags?.length > 0 && (
                <div className="flex flex-wrap gap-1.5 sm:gap-2">
                  {career.tags.map((tag) => (
                    <span
                      key={tag}
                      className="bg-zinc-900 border border-zinc-800 rounded px-2 py-1 sm:px-[9px] sm:py-[5px] t-caption text-zinc-400 whitespace-nowrap leading-[16px] sm:leading-[18px]"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              )}
            </div>
          </div>
        ))}
      </div>
    </section>
  )
}
