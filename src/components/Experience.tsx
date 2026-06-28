import { client } from '@/lib/sanity'

interface Career {
  _id: string
  company: string
  website?: string
  role: string
  description?: string
  startDate: string
  endDate?: string
}

interface CompanyGroup {
  company: string
  website?: string
  roles: Career[]
}

const MONTHS = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'] as const

function formatMonthYear(dateStr: string): string {
  const [year, month] = dateStr.split('-').map(Number)
  return `${MONTHS[month - 1]} ${year}`
}

function formatRange(startDate: string, endDate?: string): string {
  return `${formatMonthYear(startDate)} — ${endDate ? formatMonthYear(endDate) : 'Present'}`
}

/** Split a description into bullet lines, trimming any leading bullet/dash markers. */
function toBullets(description?: string): string[] {
  if (!description) return []
  return description
    .split('\n')
    .map((line) => line.replace(/^\s*[•\-*]\s*/, '').trim())
    .filter(Boolean)
}

/** Group career entries by company, preserving the startDate-desc ordering. */
function groupByCompany(careers: Career[]): CompanyGroup[] {
  const groups: CompanyGroup[] = []
  for (const career of careers) {
    let group = groups.find((g) => g.company === career.company)
    if (!group) {
      group = { company: career.company, website: career.website, roles: [] }
      groups.push(group)
    }
    if (!group.website && career.website) group.website = career.website
    group.roles.push(career)
  }
  return groups
}

function ArrowIcon() {
  return (
    // eslint-disable-next-line @next/next/no-img-element
    <img
      src="/icons/Arrow.png"
      alt=""
      aria-hidden="true"
      className="w-4 h-4 sm:w-5 sm:h-5 shrink-0 object-contain transition-transform duration-200 group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
    />
  )
}

function CompanyHeader({ company, website }: { company: string; website?: string }) {
  const name = (
    <h3 className="font-display font-bold text-[26px] sm:text-[20px] leading-tight text-accent-soft">
      {company}
    </h3>
  )

  if (!website) {
    return (
      <div className="flex items-center justify-between gap-4">
        {name}
        <ArrowIcon />
      </div>
    )
  }

  return (
    <a
      href={website}
      target="_blank"
      rel="noopener noreferrer"
      className="group flex items-center justify-between gap-4"
      aria-label={`Visit ${company} website`}
    >
      {name}
      <ArrowIcon />
    </a>
  )
}

export default async function Experience() {
  const careers = await client.fetch<Career[]>(
    `*[_type == "career"] | order(startDate desc) {
      _id,
      company,
      website,
      role,
      description,
      startDate,
      endDate
    }`
  )

  if (careers.length === 0) return null

  const groups = groupByCompany(careers)

  return (
    <section className="flex flex-col gap-6">
      <div className="flex flex-col">
        <span className="text-[14px] text-zinc-400 leading-tight">So Far</span>
        <h2 className="t-display text-white">Career</h2>
      </div>

      <div className="flex flex-col gap-12 sm:gap-14">
        {groups.map((group) => (
          <div key={group.company} className="flex flex-col gap-2 sm:gap-0.5">
            <CompanyHeader company={group.company} website={group.website} />

            <div className="flex flex-col gap-6 sm:gap-7">
              {group.roles.map((role) => {
                const bullets = toBullets(role.description)
                return (
                  <div
                    key={role._id}
                    className="flex flex-col sm:flex-row items-start gap-1 sm:gap-6"
                  >
                    {/* Date range — fixed column on desktop */}
                    <div className="sm:w-44 shrink-0 sm:pt-0.5">
                      <p className="t-body text-zinc-400 leading-snug">
                        {formatRange(role.startDate, role.endDate)}
                      </p>
                    </div>

                    {/* Role + bullets */}
                    <div className="flex-1 min-w-0">
                      <h4 className="font-display font-semibold text-[17px] sm:text-[20px] text-white leading-snug mb-2">
                        {role.role}
                      </h4>
                      {bullets.length > 0 && (
                        <ul className="flex flex-col gap-1">
                          {bullets.map((bullet, i) => (
                            <li
                              key={i}
                              className="flex gap-2 t-body text-zinc-500 leading-relaxed"
                            >
                              <span className="select-none" aria-hidden="true">
                                •
                              </span>
                              <span>{bullet}</span>
                            </li>
                          ))}
                        </ul>
                      )}
                    </div>
                  </div>
                )
              })}
            </div>
          </div>
        ))}
      </div>
    </section>
  )
}
