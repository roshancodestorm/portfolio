import { useState } from 'react'
import { FaWhatsapp, FaLinkedin, FaGithub, FaEnvelope, FaExternalLinkAlt } from 'react-icons/fa'
import SectionHeader from '../ui/SectionHeader'
import Reveal from '../ui/Reveal'
import {
  LINKS,
  CONTACT_EMAIL,
  CONTACT_PHONE_DISPLAY,
  GOOGLE_FORM_URL,
  WORK_TYPES,
  BUDGETS,
  buildWhatsAppUrl,
} from '../../config/site'
import { repo } from '../../utils/db'

const EMPTY = {
  name: '',
  email: '',
  phone: '',
  workType: '',
  description: '',
  budget: '',
  message: '',
}

export default function Contact({ sectionId }) {
  const [form, setForm] = useState(EMPTY)
  const [submitting, setSubmitting] = useState(false)
  const [toast, setToast] = useState('')

  const set = (key) => (e) => setForm((f) => ({ ...f, [key]: e.target.value }))
  const setBudget = (value) => setForm((f) => ({ ...f, budget: value }))

  const showToast = (msg) => {
    setToast(msg)
    window.setTimeout(() => setToast(''), 3500)
  }

  const onSubmit = async (e) => {
    e.preventDefault()
    if (!form.name?.trim() || !form.email?.trim() || !form.message?.trim()) {
      showToast('Please fill Name, Email and Message.')
      return
    }
    setSubmitting(true)
    try {
      await repo.messages.add({ ...form, source: 'contact-form' })
      const waMsg = [
        `Hi Roshan! New work request from your portfolio.`,
        ``,
        `Name: ${form.name}`,
        `Email: ${form.email}`,
        `Phone: ${form.phone || '—'}`,
        `Work Type: ${form.workType || '—'}`,
        `Budget: ${form.budget || '—'}`,
        `Project: ${form.description || '—'}`,
        `Message: ${form.message}`,
      ].join('\n')
      window.open(buildWhatsAppUrl(waMsg), '_blank', 'noopener,noreferrer')
      showToast('Request sent! Check WhatsApp to confirm.')
      setForm(EMPTY)
    } catch {
      showToast('Something went wrong — please try again.')
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <section id={sectionId} className="relative scroll-section border-b-3 border-ink py-24 max-md:py-16">
      <div className="section-shell">
        <Reveal>
          <SectionHeader eyebrow="Contact" title="Let's Build" accent="Something" />
        </Reveal>

        <div className="grid grid-cols-1 gap-10 lg:grid-cols-[1.25fr_0.75fr]">
          {/* form panel */}
          <Reveal direction="left">
            <form onSubmit={onSubmit} className="bl-card relative overflow-hidden p-7 md:p-10">
              <div aria-hidden="true" className="hatch absolute inset-0 opacity-40 pointer-events-none" />
              <div className="relative grid grid-cols-1 gap-5 sm:grid-cols-2">
                <div>
                  <label htmlFor="ct-name" className="field-label">Name</label>
                  <input id="ct-name" className="bl-input" placeholder="Your name" value={form.name} onChange={set('name')} autoComplete="name" required />
                </div>
                <div>
                  <label htmlFor="ct-email" className="field-label">Email</label>
                  <input id="ct-email" type="email" className="bl-input" placeholder="you@email.com" value={form.email} onChange={set('email')} autoComplete="email" required />
                </div>
                <div>
                  <label htmlFor="ct-phone" className="field-label">Phone</label>
                  <input id="ct-phone" type="tel" className="bl-input" placeholder="+91 98765 43210" value={form.phone} onChange={set('phone')} autoComplete="tel" />
                </div>
                <div>
                  <label htmlFor="ct-type" className="field-label">Work Type</label>
                  <select id="ct-type" className="bl-select" value={form.workType} onChange={set('workType')}>
                    <option value="">Select type…</option>
                    {WORK_TYPES.map((w) => (
                      <option key={w} value={w}>{w}</option>
                    ))}
                  </select>
                </div>
                <div className="sm:col-span-2">
                  <label htmlFor="ct-desc" className="field-label">Project Description</label>
                  <input id="ct-desc" className="bl-input" placeholder="A short pitch of what you want to build" value={form.description} onChange={set('description')} />
                </div>
                <div className="sm:col-span-2">
                  <span className="field-label">Budget</span>
                  <div className="bl-radio-group" role="radiogroup" aria-label="Budget range">
                    {BUDGETS.map((b) => (
                      <label key={b} className="bl-radio">
                        <input type="radio" name="budget" checked={form.budget === b} onChange={() => setBudget(b)} />
                        <span>{b}</span>
                      </label>
                    ))}
                  </div>
                </div>
                <div className="sm:col-span-2">
                  <label htmlFor="ct-msg" className="field-label">Message</label>
                  <textarea id="ct-msg" className="bl-textarea" placeholder="Tell me about your idea…" value={form.message} onChange={set('message')} required />
                </div>
              </div>

              <div className="relative mt-7 flex flex-wrap items-center gap-4">
                <button type="submit" disabled={submitting} className="bl-btn bl-btn-coral disabled:opacity-60">
                  {submitting ? 'Sending…' : 'Send Request'}
                </button>
                <p className="text-[12.5px] text-inkmuted">
                  Requests land in the admin dashboard &amp; open WhatsApp pre-filled.
                </p>
              </div>
            </form>
          </Reveal>

          {/* social + info */}
          <div className="flex flex-col gap-6">
            {[
              { name: 'WhatsApp', detail: 'Fastest reply · pre-filled message', href: buildWhatsAppUrl(`Hi Roshan! ${CONTACT_PHONE_DISPLAY.split(' ')[0]} I found your portfolio.`), icon: FaWhatsapp, bg: 'bg-mint' },
              { name: 'LinkedIn', detail: 'roshancodestorm', href: LINKS.linkedin, icon: FaLinkedin, bg: 'bg-softblue' },
              { name: 'GitHub', detail: 'Explore my code', href: LINKS.github, icon: FaGithub, bg: 'bg-peach' },
              { name: 'Email', detail: CONTACT_EMAIL, href: `mailto:${CONTACT_EMAIL}`, icon: FaEnvelope, bg: 'bg-cyan' },
            ].map((s, i) => (
              <Reveal key={s.name} direction="right" delay={i * 70}>
                <a
                  href={s.href}
                  target={s.href.startsWith('http') ? '_blank' : undefined}
                  rel={s.href.startsWith('http') ? 'noopener noreferrer' : undefined}
                  className={`flex items-center gap-4 rounded-xl border-3 border-ink ${s.bg} p-5 shadow-[6px_6px_0_#111827] transition-all duration-200 hover:-translate-x-[2px] hover:-translate-y-[2px] hover:shadow-[8px_8px_0_#111827]`}
                >
                  <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-lg border-2 border-ink bg-white text-xl shadow-[2px_2px_0_#111827]">
                    <s.icon aria-hidden="true" />
                  </span>
                  <span>
                    <span className="flex items-center gap-2 font-display text-[16px] font-bold text-ink">
                      {s.name} <FaExternalLinkAlt className="text-[10px]" aria-hidden="true" />
                    </span>
                    <span className="block text-[12.5px] text-inkmuted">{s.detail}</span>
                  </span>
                </a>
              </Reveal>
            ))}

            <Reveal direction="right" delay={300}>
              <div className="bl-card-cream p-5">
                <p className="font-display text-sm font-bold uppercase tracking-wider text-ink">Direct contact</p>
                <p className="mt-2 text-[14px] text-inkmuted">
                  {CONTACT_PHONE_DISPLAY} · {CONTACT_EMAIL}
                </p>
              </div>
            </Reveal>
          </div>
        </div>

        {/* Google form quick request */}
        <Reveal delay={120}>
          <div className="bl-card mt-16 overflow-hidden md:flex md:items-center md:gap-10">
            <div className="p-7 md:p-9">
              <span className="bl-tag bg-sun mb-4">⚡ Instant</span>
              <h3 className="font-display text-[26px] font-bold tracking-tight text-ink">
                Quick Work Request
              </h3>
              <p className="mt-2 max-w-[46ch] text-[14px] leading-relaxed text-inkmuted">
                Prefer a form over a chat? Open the Google Form to send a structured request in
                under a minute — no account needed.
              </p>
              <div className="mt-6 flex flex-wrap items-center gap-4">
                <a
                  href={GOOGLE_FORM_URL}
                  target="_blank"
                  rel="noopener noreferrer"
                  onClick={(e) => {
                    if (!GOOGLE_FORM_URL) {
                      e.preventDefault()
                      alert('Google Form link is not configured yet. Owner: set GOOGLE_FORM_URL in src/config/site.js.')
                    }
                  }}
                  className={`bl-btn ${GOOGLE_FORM_URL ? 'bl-btn-dark' : 'bl-btn-peach'}`}
                >
                  Open Google Form
                  <FaExternalLinkAlt aria-hidden="true" />
                </a>
                <span className="text-[12px] font-bold text-inkmuted">
                  {GOOGLE_FORM_URL ? 'Configured ✓' : 'Configure GOOGLE_FORM_URL to enable'}
                </span>
              </div>
            </div>

            <div className="hidden border-l-3 border-ink bg-softblue md:block">
              <div
                className="flex items-center justify-center px-10 py-4 font-display text-[15px] font-bold text-inkmuted"
                style={{ writingMode: 'vertical-rl' }}
              >
                LET&rsquo;S CONNECT
              </div>
            </div>
          </div>
        </Reveal>

        {GOOGLE_FORM_URL && (
          <Reveal delay={160}>
            <div className="bl-card mt-8 overflow-hidden">
              <div className="border-b-3 border-ink bg-peach px-6 py-3 font-display text-sm font-bold uppercase tracking-wider">
                Embedded Google Form
              </div>
              <iframe
                src={GOOGLE_FORM_URL}
                title="Quick work request Google Form"
                className="h-[640px] w-full"
                onLoad={(el) => (el.currentTarget.dataset.loaded = '1')}
              >
                <p>Your browser does not support iframes. Use the Open Google Form button above.</p>
              </iframe>
            </div>
          </Reveal>
        )}
      </div>

      {toast && (
        <div className="bl-toast" role="status">
          <span aria-hidden="true">✓</span> {toast}
        </div>
      )}
    </section>
  )
}