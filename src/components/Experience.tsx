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
  return `${formatMonthYear(startDate)} - ${endDate ? formatMonthYear(endDate) : 'Present'}`
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
        <span className="t-caption text-zinc-400 leading-tight">So Far</span>
        <h2 className="t-display text-white">Career</h2>
      </div>

      <div className="flex flex-col">
        {careers.map((career, index) => (
          <ExperienceItem
            key={career._id}
            role={career.role}
            company={career.company}
            website={career.website}
            dateLabel={formatRange(career.startDate, career.endDate)}
            defaultOpen={index === 0}
          >
            {career.description && (
              <p className="t-caption text-zinc-400 leading-relaxed whitespace-pre-line">
                {career.description}
              </p>
            )}
          </ExperienceItem>
        ))}
      </div>
    </section>
  )
}
