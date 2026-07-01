import { client, urlFor } from '@/lib/sanity'
import { safeUrl } from '@/lib/url'

interface CoreSkill {
  _id: string
  label: string
  logo: { _type: 'image'; asset: { _ref: string; _type: 'reference' } }
  website?: string
  order: number
}

const PILL_CLASS =
  'skill-inner-shadow inline-flex items-center gap-2 rounded-md border border-dashed border-accent-soft/30 bg-accent-fill px-2.5 py-1.5'

export default async function CoreSkills() {
  const skills = await client.fetch<CoreSkill[]>(
    `*[_type == "coreSkill"] | order(order asc) {
      _id,
      label,
      logo,
      website,
      order
    }`
  )

  if (skills.length === 0) return null

  return (
    <section className="flex flex-col gap-6">
      <div className="flex flex-col">
        <span className="t-caption text-zinc-400 leading-tight">Core</span>
        <h2 className="t-display text-white">Skills</h2>
      </div>

      <div className="flex flex-wrap items-center gap-3">
        {skills.map((skill) => {
          const href = safeUrl(skill.website)
          const inner = (
            <>
              {skill.logo?.asset && (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  src={urlFor(skill.logo).width(48).height(48).fit('max').url()}
                  alt={skill.label}
                  className="h-5 w-5 object-contain"
                  loading="lazy"
                  decoding="async"
                />
              )}
              <span className="t-caption font-bold text-white leading-none">{skill.label}</span>
            </>
          )

          return href ? (
            <a
              key={skill._id}
              href={href}
              target="_blank"
              rel="noopener noreferrer"
              className={`${PILL_CLASS} focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent-soft/40`}
            >
              {inner}
            </a>
          ) : (
            <div key={skill._id} className={PILL_CLASS}>
              {inner}
            </div>
          )
        })}
      </div>
    </section>
  )
}
