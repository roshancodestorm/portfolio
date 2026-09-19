/**
 * Lightweight data layer.
 *
 * Stores data in localStorage by default so the site works fully offline /
 * on plain static hosting. When Firebase is configured (and enabled), the same
 * calls delegate to Firestore so data is shared across devices.
 *
 * Never store admin passwords or secrets through this layer.
 */
import { isFirebaseConfigured } from '../config/firebase'
import { defaultProjects } from '../data/projectsData'
import { defaultResume } from '../data/resumeData'
import { DEFAULT_SOCIAL_LINKS } from '../config/social'

const USE_REMOTE = () => isFirebaseConfigured() && localStorage.getItem('pb-use-firebase') === '1'

const PREFIX = 'rk-portfolio:'

function lsGet(key, fallback) {
  try {
    const raw = localStorage.getItem(PREFIX + key)
    return raw ? JSON.parse(raw) : fallback
  } catch {
    return fallback
  }
}

function lsSet(key, value) {
  try {
    localStorage.setItem(PREFIX + key, JSON.stringify(value))
  } catch (error) {
    console.error('Storage save failed', error)
  }
  return value
}

/* ── Firestore helpers (lazy import keeps bundle small) ──── */
async function fsCol(name) {
  const { getFirestore, collection } = await import('firebase/firestore')
  return collection(getFirestore(), name)
}

async function fsQuery(col) {
  const { getDocs } = await import('firebase/firestore')
  const snap = await getDocs(col)
  return snap.docs.map((d) => ({ id: d.id, ...d.data() }))
}

async function fsAdd(col, data) {
  const { addDoc } = await import('firebase/firestore')
  const ref = await addDoc(col, { ...data, createdAt: Date.now() })
  return { id: ref.id, ...data }
}

async function fsUpdate(col, id, data) {
  const { doc, updateDoc } = await import('firebase/firestore')
  await updateDoc(doc(col, id), data)
}

async function fsRemove(col, id) {
  const { doc, deleteDoc } = await import('firebase/firestore')
  await deleteDoc(doc(col, id))
}

/* ── Generic collection API ───────────────────────────────── */
export async function loadCollection(name, fallback = []) {
  if (USE_REMOTE()) {
    try {
      return await fsQuery(await fsCol(name))
    } catch {
      /* fall through to local */
    }
  }
  return lsGet(name, fallback)
}

export async function saveCollection(name, items) {
  if (USE_REMOTE()) {
    try {
      const col = await fsCol(name)
      const existing = await fsQuery(col)
      for (const item of existing) await fsRemove(col, item.id)
      for (const item of items) await fsAdd(col, item)
      return items
    } catch {
      /* fall through to local */
    }
  }
  return lsSet(name, items)
}

export async function addToCollection(name, item) {
  if (USE_REMOTE()) {
    try {
      return await fsAdd(await fsCol(name), item)
    } catch {
      /* fall through */
    }
  }
  const items = lsGet(name, [])
  const next = { id: `${name}-${Date.now()}`, ...item }
  items.unshift(next)
  lsSet(name, items)
  return next
}

export async function updateInCollection(name, id, patch) {
  const current = await loadCollection(name, [])
  const next = current.map((item) =>
    item.id === id ? { ...item, ...patch } : item,
  )
  if (USE_REMOTE()) {
    try {
      await fsUpdate(await fsCol(name), id, patch)
      return
    } catch {
      /* fall through */
    }
  }
  lsSet(name, next)
}

export async function deleteFromCollection(name, id) {
  const current = await loadCollection(name, [])
  if (USE_REMOTE()) {
    try {
      await fsRemove(await fsCol(name), id)
      return
    } catch {
      /* fall through */
    }
  }
  lsSet(name, current.filter((item) => item.id !== id))
}

/* ── Domain repositories ─────────────────────────────────── */
const GENERIC_GITHUB = 'https://github.com/roshancodestorm'

export const repo = {
  projects: {
    load: async () => {
      const defaults = defaultProjects
      const stored = lsGet('projects', null)
      // Robust merge on EVERY load — no version gating, no lost entries:
      //   1. code defaults are ALWAYS present (jarvis/voice/cyber/portfolio…)
      //   2. stored user edits override default fields
      //   3. curated categories always win for default projects
      //   4. placeholder repo links get replaced with real URLs
      const knownDefaults = new Map(defaults.map((d) => [d.id, d]))
      const mergedMap = new Map(defaults.map((d) => [d.id, { ...d }]))
      if (Array.isArray(stored)) {
        for (const s of stored) {
          if (!s || typeof s !== 'object') continue
          mergedMap.set(s.id, { ...s })
        }
      }
      const normalized = [...mergedMap.values()].map((p) => {
        const d = knownDefaults.get(p.id)
        if (!d) return p
        const merged = { ...p }
        merged.category = d.category
        if (p.githubUrl === GENERIC_GITHUB && d.githubUrl !== GENERIC_GITHUB) {
          merged.githubUrl = d.githubUrl
        }
        return merged
      })
      lsSet('projects', normalized)
      return normalized
    },
    save: (items) => saveCollection('projects', items),
    add: (item) => addToCollection('projects', item),
    update: (id, patch) => updateInCollection('projects', id, patch),
    remove: (id) => deleteFromCollection('projects', id),
  },
  messages: {
    load: () => loadCollection('messages', []),
    add: (item) => addToCollection('messages', { ...item, status: 'New' }),
    update: (id, patch) => updateInCollection('messages', id, patch),
    remove: (id) => deleteFromCollection('messages', id),
  },
  profile: {
    load: () => lsGet('profile', null),
    save: (profile) => lsSet('profile', profile),
  },
  resume: {
    load: () => lsGet('resume', defaultResume),
    save: (resume) => lsSet('resume', resume),
  },
  profileImage: {
    load: () => lsGet('profileImage', '/profile.png'),
    save: (dataUrl) => lsSet('profileImage', dataUrl),
  },
  social: {
    load: () => {
      const stored = lsGet('social', null)
      if (!stored || typeof stored !== 'object') return { ...DEFAULT_SOCIAL_LINKS }
      const clean = Object.fromEntries(
        Object.entries(stored).filter(([, value]) => typeof value === 'string'),
      )
      // Empty stored values fall back to configured defaults, so links added
      // to the code always appear unless the owner explicitly removes them.
      const merged = { ...DEFAULT_SOCIAL_LINKS }
      for (const [key, value] of Object.entries(clean)) {
        if (value || !merged[key]) merged[key] = value
      }
      return merged
    },
    save: (links) => lsSet('social', links),
  },
}