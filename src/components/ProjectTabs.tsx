'use client'

import { useId, useState } from 'react'
import ProjectCard from './ProjectCard'

// Everything crossing this boundary is a plain value — image URLs are built on
// the server so the Sanity client never reaches the browser bundle.
export interface TabProject {
  _id: string
  title: string
  shortDescription: string
  screenshotUrl: string | null
  githubUrl: string | null
  liveUrl: string | null
  tags: string[]
  slug: string
}

export interface TabSkill {
  _id: string
  label: string
  logoUrl: string | null
  href?: string
}

const TABS = ['Projects', 'Tech Stack'] as const
type Tab = (typeof TABS)[number]

const PILL =
  'skill-inner-shadow inline-flex items-center gap-2 rounded-md border border-dashed border-accent-soft/30 bg-accent-fill px-2.5 py-1.5'

export default function ProjectTabs({
  projects,
  skills,
}: {
  projects: TabProject[]
  skills: TabSkill[]
}) {
  const [active, setActive] = useState<Tab>('Projects')
  const baseId = useId()
  const panelId = (tab: Tab) => `${baseId}-${tab.replace(/\s+/g, '-')}-panel`
  const tabId = (tab: Tab) => `${baseId}-${tab.replace(/\s+/g, '-')}-tab`

  // Left/Right arrows move between tabs, which is what the tablist role
  // promises; without it the second tab is only reachable by Tab-ing through
  // the whole project grid.
  function onKeyDown(event: React.KeyboardEvent<HTMLDivElement>) {
    if (event.key !== 'ArrowRight' && event.key !== 'ArrowLeft') return
    event.preventDefault()
    const next = TABS[(TABS.indexOf(active) + (event.key === 'ArrowRight' ? 1 : -1) + TABS.length) % TABS.length]
    setActive(next)
    document.getElementById(tabId(next))?.focus()
  }

  return (
    <section className="flex flex-col gap-[34px] lg:gap-[49px]">
      <div role="tablist" aria-label="Featured work" className="flex gap-8" onKeyDown={onKeyDown}>
        {TABS.map((tab) => (
          <button
            key={tab}
            id={tabId(tab)}
            type="button"
            role="tab"
            aria-selected={active === tab}
            aria-controls={panelId(tab)}
            tabIndex={active === tab ? 0 : -1}
            onClick={() => setActive(tab)}
            className={`press focusable text-title transition-colors ${
              active === tab ? 'sheen' : 'font-medium text-dim hover:text-white'
            }`}
          >
            {tab}
          </button>
        ))}
      </div>

      <div
        id={panelId('Projects')}
        role="tabpanel"
        aria-labelledby={tabId('Projects')}
        hidden={active !== 'Projects'}
      >
        {projects.length === 0 ? (
          <p className="text-body-sm text-muted">No projects published yet.</p>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-x-9 gap-y-12 lg:gap-y-[58px]">
            {projects.map((project) => (
              <ProjectCard
                key={project._id}
                title={project.title}
                shortDescription={project.shortDescription}
                screenshotUrl={project.screenshotUrl}
                githubUrl={project.githubUrl}
                liveUrl={project.liveUrl}
                tags={project.tags}
                slug={project.slug}
              />
            ))}
          </div>
        )}
      </div>

      <div
        id={panelId('Tech Stack')}
        role="tabpanel"
        aria-labelledby={tabId('Tech Stack')}
        hidden={active !== 'Tech Stack'}
      >
        {skills.length === 0 ? (
          <p className="text-body-sm text-muted">No skills listed yet.</p>
        ) : (
          <div className="flex flex-wrap items-center gap-3">
            {skills.map((skill) => {
              const inner = (
                <>
                  {skill.logoUrl && (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img
                      src={skill.logoUrl}
                      alt=""
                      aria-hidden="true"
                      className="h-5 w-5 object-contain"
                      loading="lazy"
                      decoding="async"
                    />
                  )}
                  <span className="text-ui text-white">{skill.label}</span>
                </>
              )

              return skill.href ? (
                <a
                  key={skill._id}
                  href={skill.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={`press focusable ${PILL} transition-colors duration-200 hover:border-accent-soft/70 hover:bg-accent-fill/70`}
                >
                  {inner}
                </a>
              ) : (
                <div key={skill._id} className={PILL}>
                  {inner}
                </div>
              )
            })}
          </div>
        )}
      </div>
    </section>
  )
}
