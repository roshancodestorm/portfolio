import { useEffect, useState } from 'react'
import { FaTrash, FaEnvelopeOpenText } from 'react-icons/fa'
import { repo } from '../../utils/db'

const STATUSES = ['New', 'In Progress', 'Completed']

export default function TabMessages() {
  const [messages, setMessages] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    repo.messages.load().then((list) => {
      setMessages(list)
      setLoading(false)
    })
  }, [])

  const setStatus = async (id, status) => {
    await repo.messages.update(id, { status })
    setMessages((m) => m.map((x) => (x.id === id ? { ...x, status } : x)))
  }

  const remove = async (id) => {
    if (!window.confirm('Delete this message?')) return
    await repo.messages.remove(id)
    setMessages((m) => m.filter((x) => x.id !== id))
  }

  const statusStyle = {
    New: 'bg-sun',
    'In Progress': 'bg-cyan',
    Completed: 'bg-mint',
  }

  return (
    <div>
      <h2 className="mb-6 flex items-center gap-2 font-display text-lg font-bold text-ink">
        <FaEnvelopeOpenText aria-hidden="true" /> Work requests &amp; messages ({messages.length})
      </h2>

      {loading && <div className="bl-card p-10 text-center text-inkmuted">Loading…</div>}
      {!loading && messages.length === 0 && (
        <div className="bl-card p-10 text-center text-inkmuted">
          No messages yet. Contact-form and work requests will appear here.
        </div>
      )}

      <div className="flex flex-col gap-5">
        {messages.map((m) => (
          <article key={m.id} className="bl-card p-5">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <div className="flex flex-wrap items-center gap-3">
                <p className="font-display text-[16px] font-bold text-ink">{m.name || 'Anonymous'}</p>
                <span className={`rounded-md border-2 border-ink px-2 py-0.5 text-[11px] font-bold ${statusStyle[m.status] || 'bg-sun'}`}>
                  {m.status || 'New'}
                </span>
                {m.workType && (
                  <span className="rounded-md border-2 border-ink bg-softblue px-2 py-0.5 text-[11px] font-bold">
                    {m.workType}
                  </span>
                )}
              </div>
              <span className="text-[12px] font-bold text-inkmuted">
                {m.createdAt ? new Date(m.createdAt).toLocaleString() : 'Recently'}
              </span>
            </div>

            <div className="mt-3 flex flex-wrap gap-x-6 gap-y-1 text-[13px] text-inkmuted">
              <span>✉ {m.email || '—'}</span>
              {m.phone && <span>☎ {m.phone}</span>}
              {m.budget && <span>₹ {m.budget}</span>}
            </div>

            {m.description && (
              <p className="mt-2 text-[13.5px] font-semibold text-ink">Project: {m.description}</p>
            )}
            <p className="mt-1 whitespace-pre-line text-[13.5px] leading-relaxed text-inkmuted">
              {m.message}
            </p>

            <div className="mt-4 flex flex-wrap items-center gap-3">
              <label className="text-[12px] font-bold text-inkmuted" htmlFor={`status-${m.id}`}>
                Status
              </label>
              <select
                id={`status-${m.id}`}
                value={m.status || 'New'}
                onChange={(e) => setStatus(m.id, e.target.value)}
                className="bl-select h-10 w-auto !py-0 text-[13px]"
              >
                {STATUSES.map((s) => (
                  <option key={s} value={s}>
                    {s}
                  </option>
                ))}
              </select>
              <button
                type="button"
                onClick={() => remove(m.id)}
                className="flex h-10 items-center gap-2 rounded-md border-2 border-ink bg-coral px-3 text-[12px] font-bold text-white shadow-[2px_2px_0_#111827] transition-transform hover:-translate-y-[1px]"
              >
                <FaTrash aria-hidden="true" /> Delete
              </button>
            </div>
          </article>
        ))}
      </div>
    </div>
  )
}