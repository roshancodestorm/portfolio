import { useState } from 'react'
import { FaGithub, FaExternalLinkAlt } from 'react-icons/fa'
import SectionHeader from '../ui/SectionHeader'
import Reveal from '../ui/Reveal'
import { PROJECT_CATEGORIES } from '../../data/projectsData'

export default function Projects({ projects = [] }) {
  const [filter, setFilter] = useState('ALL')

  const visible = projects.filter((p) => {
    if (filter === 'ALL') return true
    return (p.category || []).includes(filter)
  })

  return (
    <section id="projects" className="relative scroll-section border-b-3 border-ink py-24 max-md:py-16">
      <div className="section-shell">
        <Reveal>
          <SectionHeader eyebrow="Portfolio" title="Selected" accent="Projects" />
        </Reveal>

        {/* filter buttons */}
        <Reveal delay={60}>
          <div className="mb-12 flex flex-wrap gap-3" role="group" aria-label="Filter projects">
            {PROJECT_CATEGORIES.map((cat) => {
              const active = filter === cat
              return (
                <button
                  key={cat}
                  type="button"
                  onClick={() => setFilter(cat)}
                  className={`bl-btn h-11 !px-5 text-[13px] ${
                    active ? 'bl-btn-mint translate-x-[2px] translate-y-[2px] shadow-[3px_3px_0_#111827]' : ''
                  }`}
                  aria-pressed={active}
                >
                  {cat}
                </button>
              )
            })}
          </div>
        </Reveal>

        {visible.length === 0 ? (
          <div className="bl-card p-16 text-center">
            <p className="font-display text-xl font-bold text-inkmuted">
              No projects in this category yet.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-10 md:grid-cols-2">
            {visible.map((p, i) => (
              <ProjectCard key={p.id} project={p} index={i} />
            ))}
          </div>
        )}
      </div>
    </section>
  )
}

function ProjectCard({ project, index }) {
  const accent = ['bg-peach', 'bg-mint', 'bg-coral', 'bg-cyan', 'bg-sun'][index % 5]

  return (
    <article
      className="lift-card bl-card flex flex-col overflow-hidden"
      style={{ animation: 'pop-in 0.5s cubic-bezier(0.16,1,0.3,1)' }}
    >
      <div className="relative overflow-hidden border-b-3 border-ink bg-softblue">
        <img
          src={project.image}
          alt={project.title}
          loading="lazy"
          className="p-img h-52 w-full object-cover transition-transform duration-500"
        />
        <div className="absolute top-3 left-3">
          {(project.category || []).map((c) => (
            <span key={c} className={`mr-2 bl-tag ${c === 'AI' ? 'bg-coral !text-white' : accent}`}>
              {c}
            </span>
          ))}
        </div>
      </div>

      <div className="flex flex-1 flex-col gap-4 p-6">
        <h3 className="font-display text-[22px] font-bold tracking-tight text-ink">
          {project.title}
        </h3>
        <p className="text-[14.5px] leading-relaxed text-inkmuted">{project.description}</p>

        <div className="mt-auto flex flex-wrap gap-2">
          {(project.tech || []).map((t) => (
            <span key={t} className="rounded-md border-2 border-ink bg-white px-2.5 py-1 text-[11.5px] font-bold text-ink shadow-[2px_2px_0_#111827]">
              {t}
            </span>
          ))}
        </div>

        <div className="mt-2 flex flex-wrap gap-3">
          <a
            href={project.githubUrl || '#'}
            target="_blank"
            rel="noopener noreferrer"
            className="bl-btn bl-btn-dark h-10 !px-4 text-[12.5px]"
          >
            <FaGithub /> GitHub
          </a>
          <a
            href={project.liveUrl || project.githubUrl || '#'}
            target="_blank"
            rel="noopener noreferrer"
            className="bl-btn bl-btn-peach h-10 !px-4 text-[12.5px]"
          >
            <FaExternalLinkAlt /> Live Demo
          </a>
        </div>
      </div>
    </article>
  )
}