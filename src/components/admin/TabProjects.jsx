import { useEffect, useState } from 'react'
import { FaEdit, FaTrash, FaPlus, FaTimes, FaGithub, FaExternalLinkAlt } from 'react-icons/fa'
import { repo } from '../../utils/db'
import { PROJECT_CATEGORIES } from '../../data/projectsData'

const CATS = PROJECT_CATEGORIES.filter((c) => c !== 'ALL')
const EMPTY = {
  title: '',
  description: '',
  tech: '',
  category: [],
  githubUrl: 'https://github.com/roshancodestorm',
  liveUrl: '',
  image: '',
}

function readAsDataURL(file) {
  return new Promise((resolve, reject) => {
    const r = new FileReader()
    r.onload = () => resolve(r.result)
    r.onerror = reject
    r.readAsDataURL(file)
  })
}

export default function TabProjects({ onProjectsChange }) {
  const [projects, setProjects] = useState([])
  const [editingId, setEditingId] = useState(null)

  useEffect(() => {
    repo.projects.load().then((list) => {
      setProjects(list)
      onProjectsChange(list)
    })
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const refresh = async () => {
    const list = await repo.projects.load()
    setProjects(list)
    onProjectsChange(list)
  }

  const [form, setForm] = useState(EMPTY)

  const startAdd = () => {
    setForm({ ...EMPTY, image: '' })
    setEditingId('__new__')
  }
  const startEdit = (p) => {
    setForm({
      id: p.id,
      title: p.title,
      description: p.description,
      tech: (p.tech || []).join(', '),
      category: p.category || [],
      githubUrl: p.githubUrl || '',
      liveUrl: p.liveUrl || '',
      image: p.image || '',
    })
    setEditingId(p.id)
  }
  const cancelEdit = () => {
    setEditingId(null)
    setForm(EMPTY)
  }

  const toggleCat = (cat) =>
    setForm((f) => ({
      ...f,
      category: f.category.includes(cat)
        ? f.category.filter((c) => c !== cat)
        : [...f.category, cat],
    }))

  const onImageFile = async (e) => {
    const file = e.target.files?.[0]
    if (!file) return
    const dataUrl = await readAsDataURL(file)
    setForm((f) => ({ ...f, image: dataUrl }))
  }

  const save = async (e) => {
    e.preventDefault()
    const payload = {
      title: form.title.trim(),
      description: form.description.trim(),
      tech: form.tech.split(',').map((t) => t.trim()).filter(Boolean),
      category: form.category.length ? form.category : ['OTHER'],
      githubUrl: form.githubUrl.trim(),
      liveUrl: form.liveUrl.trim(),
      image: form.image,
    }
    if (editingId === '__new__') {
      await repo.projects.add(payload)
    } else {
      await repo.projects.update(editingId, payload)
    }
    await refresh()
    cancelEdit()
  }

  const remove = async (id) => {
    if (!window.confirm('Delete this project?')) return
    await repo.projects.remove(id)
    await refresh()
  }

  return (
    <div className="grid grid-cols-1 gap-8 xl:grid-cols-[0.9fr_1.1fr]">
      {/* editor */}
      <div className="bl-card h-fit p-6">
        <div className="mb-5 flex items-center justify-between">
          <h2 className="flex items-center gap-2 font-display text-lg font-bold text-ink">
            <FaPlus aria-hidden="true" /> {editingId ? 'Edit Project' : 'New Project'}
          </h2>
          {editingId && (
            <button
              type="button"
              onClick={cancelEdit}
              className="flex h-9 w-9 items-center justify-center rounded-md border-2 border-ink bg-white shadow-[2px_2px_0_#111827]"
              aria-label="Cancel editing"
            >
              <FaTimes aria-hidden="true" />
            </button>
          )}
        </div>

        <button
          type="button"
          onClick={startAdd}
          disabled={Boolean(editingId)}
          className="bl-btn bl-btn-peach mb-6 h-10 w-full !px-4 text-[13px] disabled:opacity-50"
        >
          <FaPlus aria-hidden="true" /> Start new project
        </button>

        {editingId ? (
          <form onSubmit={save} className="flex flex-col gap-4">
            <div>
              <label className="field-label">Title</label>
              <input className="bl-input" value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} required />
            </div>
            <div>
              <label className="field-label">Description</label>
              <textarea className="bl-textarea min-h-[90px]" value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} />
            </div>
            <div>
              <label className="field-label">Tech stack (comma separated)</label>
              <input className="bl-input" value={form.tech} onChange={(e) => setForm({ ...form, tech: e.target.value })} placeholder="React, FastAPI, Redis" />
            </div>
            <div>
              <span className="field-label">Categories</span>
              <div className="bl-radio-group">
                {CATS.map((cat) => (
                  <label key={cat} className="bl-radio">
                    <input type="checkbox" checked={form.category.includes(cat)} onChange={() => toggleCat(cat)} />
                    <span>{cat}</span>
                  </label>
                ))}
              </div>
            </div>
            <div>
              <label className="field-label">GitHub URL</label>
              <input className="bl-input" value={form.githubUrl} onChange={(e) => setForm({ ...form, githubUrl: e.target.value })} />
            </div>
            <div>
              <label className="field-label">Live Demo URL</label>
              <input className="bl-input" value={form.liveUrl} onChange={(e) => setForm({ ...form, liveUrl: e.target.value })} />
            </div>
            <div>
              <label className="field-label">Project Image</label>
              <input type="file" accept="image/*" onChange={onImageFile} className="mb-2 text-[13px]" />
              {form.image && (
                <img src={form.image} alt="Project preview" className="mt-2 h-32 w-full rounded-lg border-3 border-ink object-cover" />
              )}
            </div>
            <button type="submit" className="bl-btn bl-btn-dark">
              Save Project
            </button>
          </form>
        ) : (
          <p className="rounded-lg border-2 border-dashed border-ink/40 p-4 text-[13px] text-inkmuted">
            Choose <strong>Start new project</strong> to create one, or click edit on any project below.
          </p>
        )}
      </div>

      {/* list */}
      <div className="flex flex-col gap-5">
        <h2 className="font-display text-lg font-bold text-ink">All projects ({projects.length})</h2>
        {projects.length === 0 && (
          <div className="bl-card p-10 text-center text-inkmuted">No projects yet.</div>
        )}
        {projects.map((p) => (
          <article key={p.id} className="bl-card flex gap-4 p-4">
            <img src={p.image} alt={p.title} className="h-24 w-32 shrink-0 rounded-lg border-3 border-ink object-cover" />
            <div className="min-w-0 flex-1">
              <h3 className="truncate font-display text-[16px] font-bold text-ink">{p.title}</h3>
              <p className="mt-0.5 text-[12px] font-bold text-coral uppercase">{(p.category || []).join(' · ') || 'OTHER'}</p>
              <p className="mt-1 line-clamp-2 text-[12.5px] text-inkmuted">{p.description}</p>
              <div className="mt-2 flex flex-wrap gap-2">
                <a
                  href={p.githubUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-1 rounded border-2 border-ink bg-ink px-2 py-1 text-[11px] font-bold text-cream"
                >
                  <FaGithub aria-hidden="true" /> GitHub
                </a>
                {p.liveUrl && (
                  <a
                    href={p.liveUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-1 rounded border-2 border-ink bg-peach px-2 py-1 text-[11px] font-bold text-ink"
                  >
                    <FaExternalLinkAlt aria-hidden="true" /> Demo
                  </a>
                )}
              </div>
            </div>
            <div className="flex shrink-0 flex-col gap-2">
              <button type="button" onClick={() => startEdit(p)} aria-label={`Edit ${p.title}`} className="flex h-9 w-9 items-center justify-center rounded-md border-2 border-ink bg-sun shadow-[2px_2px_0_#111827] transition-transform hover:-translate-y-[1px]">
                <FaEdit aria-hidden="true" />
              </button>
              <button type="button" onClick={() => remove(p.id)} aria-label={`Delete ${p.title}`} className="flex h-9 w-9 items-center justify-center rounded-md border-2 border-ink bg-coral text-white shadow-[2px_2px_0_#111827] transition-transform hover:-translate-y-[1px]">
                <FaTrash aria-hidden="true" />
              </button>
            </div>
          </article>
        ))}
      </div>
    </div>
  )
}