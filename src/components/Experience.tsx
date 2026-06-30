import { client } from '@/lib/sanity'
import ExperienceItem from './ExperienceItem'

interface Career {
  _id: string
  company: string
  website?: string
  role: string
  description?: string
  startDate: string
  endDate?: string
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

  return (
    <section className="flex flex-col gap-4">
      <div className="flex flex-col">
        <span className="t-body text-zinc-400 leading-tight">So Far</span>
        <h2 className="t-display text-white">Career</h2>
      </div>

      <div className="flex flex-col">
        {careers.map((career, index) => {
          const bullets = toBullets(career.description)
          return (
            <ExperienceItem
              key={career._id}
              role={career.role}
              company={career.company}
              website={career.website}
              dateLabel={formatRange(career.startDate, career.endDate)}
              defaultOpen={index === 0}
            >
              {bullets.length > 0 && (
                <ul className="flex flex-col gap-1">
                  {bullets.map((bullet, i) => (
                    <li
                      key={i}
                      className="flex gap-2 t-body text-zinc-400 leading-relaxed"
                    >
                      <span className="select-none" aria-hidden="true">
                        •
                      </span>
                      <span>{bullet}</span>
                    </li>
                  ))}
                </ul>
              )}
            </ExperienceItem>
          )
        })}
      </div>
    </section>
  )
}
