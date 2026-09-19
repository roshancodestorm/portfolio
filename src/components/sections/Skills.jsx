import { useEffect, useRef } from 'react'
import { FaJava, FaPython, FaHtml5, FaCss3Alt, FaReact, FaGitAlt, FaGithub, FaLinux } from 'react-icons/fa'
import { SiJavascript, SiNextdotjs, SiC, SiCplusplus, SiFirebase } from 'react-icons/si'
import { TbDatabase, TbBrain, TbApi, TbRobot, TbPlugConnected } from 'react-icons/tb'
import SectionHeader from '../ui/SectionHeader'
import Reveal from '../ui/Reveal'

const GROUPS = [
  {
    title: 'Programming',
    accent: 'bg-coral',
    iconBg: 'bg-coral',
    skills: [
      { name: 'C', level: 75, icon: SiC },
      { name: 'C++', level: 75, icon: SiCplusplus },
      { name: 'Java', level: 80, icon: FaJava },
      { name: 'Python', level: 90, icon: FaPython },
      { name: 'SQL', level: 70, icon: TbDatabase },
    ],
  },
  {
    title: 'Web',
    accent: 'bg-mint',
    iconBg: 'bg-mint',
    skills: [
      { name: 'HTML', level: 95, icon: FaHtml5 },
      { name: 'CSS', level: 90, icon: FaCss3Alt },
      { name: 'JavaScript', level: 85, icon: SiJavascript },
      { name: 'React', level: 80, icon: FaReact },
      { name: 'Next.js', level: 60, icon: SiNextdotjs },
    ],
  },
  {
    title: 'AI / ML',
    accent: 'bg-peach',
    iconBg: 'bg-peach',
    skills: [
      { name: 'Python', level: 90, icon: FaPython },
      { name: 'NLP', level: 75, icon: TbBrain },
      { name: 'AI APIs', level: 80, icon: TbApi },
      { name: 'Machine Learning', level: 70, icon: TbRobot },
    ],
  },
  {
    title: 'Tools',
    accent: 'bg-cyan',
    iconBg: 'bg-cyan',
    skills: [
      { name: 'Git', level: 75, icon: FaGitAlt },
      { name: 'GitHub', level: 80, icon: FaGithub },
      { name: 'Firebase', level: 65, icon: SiFirebase },
      { name: 'Linux', level: 70, icon: FaLinux },
      { name: 'REST API', level: 85, icon: TbPlugConnected },
    ],
  },
]

export default function Skills() {
  const gridRef = useRef(null)

  useEffect(() => {
    const el = gridRef.current
    if (!el) return
    const io = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          el.querySelectorAll('.skill-fill').forEach((fill) => {
            fill.style.setProperty('--p', fill.dataset.level)
            fill.classList.add('is-on')
          })
          io.disconnect()
        }
      },
      { threshold: 0.15 },
    )
    io.observe(el)
    return () => io.disconnect()
  }, [])

  return (
    <section id="skills" className="relative scroll-section border-b-3 border-ink py-24 max-md:py-16">
      <div className="section-shell">
        <Reveal>
          <SectionHeader eyebrow="Capabilities" title="My Tech" accent="Stack" />
        </Reveal>

        <div ref={gridRef} className="grid grid-cols-1 gap-8 md:grid-cols-2">
          {GROUPS.map((group, gi) => (
            <Reveal key={group.title} delay={gi * 70}>
              <div className="bl-card h-full p-6">
                <div className="mb-5 flex items-center gap-3">
                  <span
                    className={`flex h-10 w-10 items-center justify-center rounded-lg border-2 border-ink ${group.iconBg}`}
                    style={{ boxShadow: '2px 2px 0 #111827' }}
                  >
                    <span className="h-4 w-4 rounded-sm border-2 border-ink" aria-hidden="true" />
                  </span>
                  <h3 className="font-display text-xl font-bold tracking-tight text-ink">
                    {group.title}
                  </h3>
                  <span className={`ml-auto rounded-md border-2 border-ink px-2 py-0.5 text-[10px] font-bold uppercase ${group.accent}`}>
                    {group.skills.length} skills
                  </span>
                </div>

                <ul className="flex flex-col gap-4">
                  {group.skills.map((skill) => {
                    const Icon = skill.icon
                    return (
                      <li key={skill.name} className="group">
                        <div className="mb-1.5 flex items-center justify-between">
                          <span className="flex items-center gap-2.5 text-[14px] font-bold text-ink">
                            <Icon className={`text-[16px]`} aria-hidden="true" />
                            {skill.name}
                          </span>
                          <span className="font-display text-[12px] font-bold text-inkmuted">
                            {skill.level}%
                          </span>
                        </div>
                        <div className="skill-track">
                          <div
                            className={`skill-fill ${group.accent}`}
                            data-level={skill.level / 100}
                          />
                        </div>
                      </li>
                    )
                  })}
                </ul>
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  )
}