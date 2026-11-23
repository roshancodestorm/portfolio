import { useState } from 'react'
import { FaGithub, FaExternalLinkAlt, FaStar } from 'react-icons/fa'
import SectionHeader from '../ui/SectionHeader'
import Reveal from '../ui/Reveal'
import ProjectThumb from '../ui/ProjectThumb'
import { PROJECT_FILTERS, CATEGORY_LABELS } from '../../data/projectsData'

const CATEGORY_ACCENTS = {
  AI: 'bg-coral !text-white',
  WEB: 'bg-cyan',
  SAAS: 'bg-mint',
  GAME: 'bg-sun',
  PROGRAMMING: 'bg-peach',
}

function isHttpUrl(value) {
  try {
    return ['http:', 'https:'].includes(new URL(value).protocol)
  } catch {
    return false
  }
}

function getLinks(project) {
  const links = []
  if (isHttpUrl(project.liveUrl)) {
    links.push({
      href: project.liveUrl,
      label: project.liveLabel || 'Live Demo',
      Icon: FaExternalLinkAlt,
      className: 'bl-btn bl-btn-peach',
    })
  }
  if (isHttpUrl(project.githubUrl)) {
    links.push({
      href: project.githubUrl,
      label: project.githubLabel || 'GitHub',
      Icon: FaGithub,
      className: 'bl-btn bl-btn-dark',
    })
  }
  return links
}

function matchesFilter(project, filter) {
  if (filter === 'ALL') return true
  if (filter === 'FEATURED') return Boolean(project.featured)
  return (project.category || []).includes(filter)
}

export default function Projects({ projects = [] }) {
  const [filter, setFilter] = useState('ALL')

  // The curated catalogue is ordered, so "featured" is always the first four
  // flagged entries — never admin-added extras or retired demo projects.
  const featured = projects.filter((p) => p.featured).slice(0, 4)
  const visible = projects.filter((p) => matchesFilter(p, filter))

  return (
    <section id="projects" className="relative scroll-section border-b-3 border-ink py-24 max-md:py-16">
      <div className="section-shell">
        {/* ── Featured projects ─────────────────────────────── */}
        <Reveal>
          <SectionHeader eyebrow="Homepage" title="Featured" accent="Projects" />
        </Reveal>
        <Reveal delay={60}>
          <p className="mb-10 max-w-2xl text-[15px] leading-relaxed text-inkmuted">
            A handpicked set of builds where AI, game design, and practical SaaS
            tools come together. Each one solves a real problem — and ships.
          </p>
        </Reveal>

        {featured.length > 0 ? (
          <div className="grid grid-cols-1 gap-10 md:grid-cols-2">
            {featured.map((project, i) => (
              <Reveal key={project.id} delay={i * 70} className="h-full">
                <ProjectCard project={project} index={i} featured />
              </Reveal>
            ))}
          </div>
        ) : (
          <div className="bl-card p-12 text-center text-inkmuted">
            Featured projects will appear here soon.
          </div>
        )}

        {/* ── Divider ───────────────────────────────────────── */}
        <div className="my-20 flex items-center gap-4" aria-hidden="true">
          <span className="flex-1 border-t-3 border-dashed border-ink/20" />
          <span className="font-display text-2xl font-bold text-ink/25">✦</span>
          <span className="flex-1 border-t-3 border-dashed border-ink/20" />
        </div>

        {/* ── Full catalogue ────────────────────────────────── */}
        <Reveal>
          <SectionHeader eyebrow="Archive" title="All" accent="Projects" />
        </Reveal>

        <Reveal delay={60}>
          <div className="mb-7 flex flex-wrap gap-3" role="group" aria-label="Filter projects">
            {PROJECT_FILTERS.map(({ id, label }) => {
              const active = filter === id
              return (
                <button
                  key={id}
                  type="button"
                  onClick={() => setFilter(id)}
                  className={`bl-btn h-11 !px-5 text-[13px] ${
                    active
                      ? 'bl-btn-mint translate-x-[2px] translate-y-[2px] shadow-[3px_3px_0_#111827]'
                      : ''
                  }`}
                  aria-pressed={active}
                >
                  {label}
                </button>
              )
            })}
          </div>
        </Reveal>

        <p
          className="mb-8 font-display text-[13px] font-bold tracking-[0.08em] text-inkmuted uppercase"
          aria-live="polite"
        >
          Showing {visible.length} of {projects.length} projects
        </p>

        {visible.length === 0 ? (
          <div className="bl-card p-16 text-center">
            <p className="font-display text-xl font-bold text-inkmuted">
              No projects in this category yet.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-10 md:grid-cols-2">
            {visible.map((project, i) => (
              <Reveal key={project.id} delay={i * 60} className="h-full">
                <ProjectCard project={project} index={i} />
              </Reveal>
            ))}
          </div>
        )}
      </div>
    </section>
  )
}

function ProjectCard({ project, index, featured = false }) {
  const links = getLinks(project)

  return (
    <article className="lift-card bl-card flex h-full flex-col overflow-hidden">
      <div className="relative overflow-hidden border-b-3 border-ink bg-softblue">
        <ProjectThumb src={project.image} title={project.title} accentIndex={index} />

        <div className="absolute top-3 left-3 flex max-w-[70%] flex-wrap gap-2">
          {(project.category || []).map((id) => (
            <span
              key={id}
              className={`bl-tag !px-2.5 !py-1 !text-[11px] ${CATEGORY_ACCENTS[id] || 'bg-softblue'}`}
            >
              {CATEGORY_LABELS[id] || id}
            </span>
          ))}
        </div>

        {featured && (
          <div className="absolute top-3 right-3">
            <span className="bl-tag bg-ink !px-2.5 !py-1 !text-[11px] !text-cream">
              <FaStar aria-hidden="true" /> Featured
            </span>
          </div>
        )}
      </div>

      <div className="flex flex-1 flex-col gap-4 p-6">
        <h3 className="font-display text-[22px] leading-tight font-bold tracking-tight text-ink">
          {project.title}
        </h3>
        <p className="text-[14.5px] leading-relaxed text-inkmuted">
          {project.description}
        </p>

        <div className="mt-auto flex flex-wrap gap-2 pt-1">
          {(project.tech || []).map((tech) => (
            <span
              key={tech}
              className="rounded-md border-2 border-ink bg-white px-2.5 py-1 text-[11.5px] font-bold text-ink shadow-[2px_2px_0_#111827]"
            >
              {tech}
            </span>
          ))}
        </div>

        {links.length > 0 && (
          <div className="mt-2 flex flex-wrap gap-3">
            {links.map(({ href, label, Icon, className }) => (
              <a
                key={href}
                href={href}
                target="_blank"
                rel="noopener noreferrer"
                aria-label={`${label} for ${project.title} (opens in a new tab)`}
                className={`${className} h-10 !px-4 text-[12.5px]`}
              >
                <Icon aria-hidden="true" /> {label}
              </a>
            ))}
          </div>
        )}
      </div>
    </article>
  )
}
