import { useEffect, useState } from 'react'
import { FaFileAlt, FaDownload } from 'react-icons/fa'
import { repo } from '../../utils/db'
import { defaultResume, buildResumeFromForm, resumeToForm } from '../../data/resumeData'

const FIELDS = {
  name: { label: 'Name', full: true },
  headline: { label: 'Headline', full: true },
  summary: { label: 'Summary', full: true, area: true },
  phone: { label: 'Phone', tel: true },
  email: { label: 'Email', full: true, type: 'email' },
  location: { label: 'Location' },
  skillsProgramming: { label: 'Skills — Programming' },
  skillsWeb: { label: 'Skills — Web' },
  skillsAiMl: { label: 'Skills — AI / ML' },
  skillsTools: { label: 'Skills — Tools' },
  education: { label: 'Education (one per line)', full: true, area: true, hint: 'B.Tech in AI & ML — GCRG Group of Institutions, Lucknow' },
  projects: { label: 'Projects (one per line)', full: true, area: true, hint: 'Project title' },
  achievements: { label: 'Achievements (one per line)', full: true, area: true },
  certifications: { label: 'Certifications (one per line)', full: true, area: true },
  github: { label: 'GitHub URL' },
  linkedin: { label: 'LinkedIn URL' },
  portfolio: { label: 'Portfolio URL' },
}

export default function TabResume() {
  const [form, setForm] = useState(() => resumeToForm(defaultResume))
  const [saved, setSaved] = useState(false)

  useEffect(() => {
    repo.resume.load().then((r) => setForm(resumeToForm(r)))
  }, [])

  const set = (key) => (e) => {
    setSaved(false)
    setForm((f) => ({ ...f, [key]: e.target.value }))
  }

  const save = async () => {
    await repo.resume.save(buildResumeFromForm(form))
    setSaved(true)
    window.setTimeout(() => setSaved(false), 2500)
  }

  const build = async () => {
    const resume = buildResumeFromForm(form)
    await repo.resume.save(resume)
    return resume
  }

  return (
    <div className="grid grid-cols-1 gap-8 xl:grid-cols-[1.15fr_0.85fr]">
      {/* form */}
      <div className="bl-card p-6 md:p-8">
        <div className="mb-6 flex flex-wrap items-center justify-between gap-3">
          <h2 className="flex items-center gap-2 font-display text-lg font-bold text-ink">
            <FaFileAlt aria-hidden="true" /> Resume Builder
          </h2>
          <div className="flex flex-wrap gap-3">
            <button type="button" onClick={save} className="bl-btn bl-btn-peach h-10 !px-4 text-[13px]">
              {saved ? 'Saved ✓' : 'Save Data'}
            </button>
            <button
              type="button"
              onClick={async () => {
                const resume = await build()
                const { downloadResumePdf } = await import('../../utils/resumePdf')
                downloadResumePdf(resume)
              }}
              className="bl-btn bl-btn-dark h-10 !px-4 text-[13px]"
            >
              <FaDownload aria-hidden="true" /> Download Resume
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          {Object.entries(FIELDS).map(([key, meta]) => (
            <div key={key} className={meta.full ? 'sm:col-span-2' : ''}>
              <label className="field-label" htmlFor={`rs-${key}`}>
                {meta.label}
              </label>
              {meta.area ? (
                <textarea
                  id={`rs-${key}`}
                  className="bl-textarea min-h-[80px]"
                  placeholder={meta.hint || ''}
                  value={form[key] || ''}
                  onChange={set(key)}
                />
              ) : (
                <input
                  id={`rs-${key}`}
                  type={meta.type || (meta.tel ? 'tel' : 'text')}
                  className="bl-input"
                  placeholder={meta.hint || ''}
                  value={form[key] || ''}
                  onChange={set(key)}
                />
              )}
              {meta.hint && (
                <p className="mt-1 text-[11.5px] text-inkmuted">{meta.hint}</p>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* preview / notes */}
      <div className="flex flex-col gap-6">
        <div className="bl-card-cream p-6">
          <h3 className="font-display text-base font-bold text-ink">About this generator</h3>
          <ul className="mt-3 flex flex-col gap-2 text-[13px] leading-relaxed text-inkmuted">
            <li>· ATS-friendly single-page layout</li>
            <li>· Auto sections: summary, skills, education, projects, certifications, achievements</li>
            <li>· Output is a clean PDF using jsPDF</li>
            <li>· Data is stored locally — swap to Firestore via the Firebase config for cloud sync</li>
          </ul>
        </div>
        <div className="bl-card-soft overflow-hidden">
          <div className="bg-ink px-5 py-3 font-display text-[13px] font-bold tracking-wider text-cream uppercase">
            Live preview
          </div>
          <div className="px-5 py-6">
            <p className="truncate font-display text-lg font-bold text-ink">{form.name || 'Your Name'}</p>
            <p className="truncate text-[12px] font-bold text-inkmuted uppercase">{form.headline || 'Your Headline'}</p>
            <div className="mt-3 h-2 w-2/3 rounded border border-ink/30 bg-ink/10" />
            <div className="mt-2 h-2 w-2/3 rounded border border-ink/30 bg-ink/10" />
            <div className="mt-4 flex flex-wrap gap-2">
              {['Python', 'React', 'NLP', 'SQL'].map((t) => (
                <span key={t} className="rounded border-2 border-ink bg-white px-2 py-0.5 text-[10.5px] font-bold">
                  {t}
                </span>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}