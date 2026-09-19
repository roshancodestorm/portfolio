import SectionHeader from '../ui/SectionHeader'
import Reveal from '../ui/Reveal'
import ProfileImage from '../ui/ProfileImage'

const TIMELINE = [
  {
    tag: 'Education',
    accent: 'bg-coral',
    title: 'B.Tech in AI & ML',
    meta: 'GCRG Group of Institutions, Lucknow · Expected 2028',
    detail: 'Building a strong foundation in machine learning, data structures, algorithms and modern software engineering.',
  },
  {
    tag: 'Projects',
    accent: 'bg-mint',
    title: 'AI Assistants & SaaS Builds',
    meta: '2024 – Present',
    detail: 'Jarvis → CodeStorm AI assistant, a Cyber Cafe SaaS, a voice-integrity verification framework, and this portfolio.',
  },
  {
    tag: 'Hackathons',
    accent: 'bg-peach',
    title: 'Team Builder & Innovator',
    meta: 'Ongoing',
    detail: 'Active competitor focused on shipping AI features fast — brainstorming, prototyping and presenting under pressure.',
  },
  {
    tag: 'Certifications',
    accent: 'bg-cyan',
    title: 'AI / Full-Stack Certification',
    meta: 'Online courses',
    detail: 'Machine Learning & AI fundamentals plus full-stack web development — applying them to real builds daily.',
  },
  {
    tag: 'Achievements',
    accent: 'bg-sun',
    title: 'Best Mentor Award',
    meta: 'GCRG Group of Institutions',
    detail: 'Recognized for leadership, guidance and peer support; contributed to an extended AI & ML research paper.',
  },
]

export default function About({ sectionId, profileImage }) {
  return (
    <section id={sectionId} className="relative scroll-section border-b-3 border-ink py-24 max-md:py-16">
      <div className="section-shell">
        <Reveal>
          <SectionHeader eyebrow="The Human" title="About" accent="Roshan" />
        </Reveal>

        <div className="grid grid-cols-1 items-center gap-14 lg:grid-cols-[0.85fr_1.15fr]">
          <Reveal direction="left">
            <ProfileImage src={profileImage} />
          </Reveal>

          <div>
            <Reveal direction="right" delay={80}>
              <p className="font-display text-[26px] font-bold leading-snug tracking-tight text-ink">
                I turn ideas into software that actually ships.
              </p>
              <p className="mt-5 text-[15.5px] leading-relaxed text-inkmuted">
                I&apos;m Roshan Kannaujiya, an AI &amp; Machine Learning student at GCRG Group of
                Institutions, Lucknow (B.Tech, expected 2028). I love the intersection of machine
                learning and product engineering — from voice assistants and NLP tools to
                full-stack web applications with clean, characterful interfaces.
              </p>
            </Reveal>

            <Reveal direction="right" delay={140}>
              <div className="mt-6 grid grid-cols-1 gap-3 sm:grid-cols-2">
                <div className="bl-card-soft flex items-center gap-3 p-4">
                  <span className="flex h-9 w-9 items-center justify-center rounded-md border-2 border-ink bg-sun text-[15px] font-black">
                    🎓
                  </span>
                  <div>
                    <p className="text-[13px] font-bold">B.Tech in AI &amp; ML</p>
                    <p className="text-[12px] text-inkmuted">GCRG, Lucknow · 2028</p>
                  </div>
                </div>
                <div className="bl-card-soft flex items-center gap-3 p-4">
                  <span className="flex h-9 w-9 items-center justify-center rounded-md border-2 border-ink bg-mint text-[15px] font-black">
                    ⚡
                  </span>
                  <div>
                    <p className="text-[13px] font-bold">Always Building</p>
                    <p className="text-[12px] text-inkmuted">AI · ML · Web · Software</p>
                  </div>
                </div>
              </div>
            </Reveal>

            <Reveal direction="right" delay={200}>
              <div className="mt-6">
                <p className="field-label">Focus areas</p>
                <div className="flex flex-wrap gap-2.5">
                  {['AI', 'Machine Learning', 'Software Development', 'Web Development'].map((f) => (
                    <span key={f} className="bl-tag bg-white">
                      <span className="h-2 w-2 rounded-full bg-coral" aria-hidden="true" />
                      {f}
                    </span>
                  ))}
                </div>
              </div>
            </Reveal>
          </div>
        </div>

        {/* vertical timeline */}
        <div className="mt-24 grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-3">
          {TIMELINE.map((item, i) => (
            <Reveal key={item.title} delay={i * 70}>
              <article className="tl-item bl-card flex h-full flex-col p-6">
                <span className={`mb-3 self-start rounded-md border-2 border-ink px-2.5 py-1 text-[11px] font-bold uppercase ${item.accent}`}>
                  {item.tag}
                </span>
                <h3 className="font-display text-[19px] font-bold leading-tight text-ink">
                  {item.title}
                </h3>
                <p className="mt-1 text-[12px] font-bold text-coral">{item.meta}</p>
                <p className="mt-3 text-[13.5px] leading-relaxed text-inkmuted">{item.detail}</p>
              </article>
            </Reveal>
          ))}

          <Reveal delay={350}>
            <div className="bl-card-soft flex h-full flex-col justify-center gap-3 p-6" style={{ background: 'var(--color-ink)' }}>
              <p className="font-display text-lg font-bold text-cream">
                Want the full story — education, skills, projects and achievements in one PDF?
              </p>
              <p className="text-[13px] text-cream/80">
                Use the RESUME button in the navbar or manage everything from the admin dashboard.
              </p>
            </div>
          </Reveal>
        </div>
      </div>
    </section>
  )
}