import { useEffect, useState } from 'react'
import { FaUpload, FaMagic, FaCheckCircle } from 'react-icons/fa'
import { repo } from '../../utils/db'
import { REMOVE_BG_ENDPOINT } from '../../config/site'
import { SOCIAL_PLATFORMS, SOCIAL_LINK_PLACEHOLDERS } from '../../config/social'

function readAsDataURL(file) {
  return new Promise((resolve, reject) => {
    const r = new FileReader()
    r.onload = () => resolve(r.result)
    r.onerror = reject
    r.readAsDataURL(file)
  })
}

export default function TabProfile({ profileImage, onProfileImageChange }) {
  const [profile, setProfile] = useState({
    name: 'Roshan Kannaujiya',
    title: 'AI & ML Student · Software Developer',
    about: '',
    phone: '',
    email: '',
    location: '',
  })
  const [pendingImage, setPendingImage] = useState(null)
  const [removing, setRemoving] = useState(false)
  const [note, setNote] = useState('')
  const [social, setSocial] = useState({})
  const [socialNote, setSocialNote] = useState('')

  useEffect(() => {
    repo.profile.load().then((p) => p && setProfile((prev) => ({ ...prev, ...p })))
    repo.social.load().then((s) => setSocial(s))
  }, [])

  const set = (key) => (e) => setProfile((f) => ({ ...f, [key]: e.target.value }))
  const setSocialLink = (key) => (e) => setSocial((f) => ({ ...f, [key]: e.target.value.trim() }))

  const saveSocial = async () => {
    await repo.social.save(social)
    setSocialNote('Social links saved ✓')
    window.setTimeout(() => setSocialNote(''), 2500)
  }

  const saveProfile = async () => {
    await repo.profile.save(profile)
    setNote('Profile saved ✓')
    window.setTimeout(() => setNote(''), 2500)
  }

  const onPick = async (e) => {
    const file = e.target.files?.[0]
    if (!file) return
    e.target.value = ''
    setPendingImage(await readAsDataURL(file))
    setNote('Image selected — preview below. Use "Remove background" if needed, then Save.')
  }

  const removeBackground = async () => {
    if (!pendingImage) {
      setNote('Choose an image first.')
      return
    }
    if (!REMOVE_BG_ENDPOINT || REMOVE_BG_ENDPOINT === '/api/remove-background') {
      setNote('Background-removal backend is not configured. Set VITE_REMOVE_BG_ENDPOINT + REMOVE_BG_API_KEY on your serverless backend.')
      return
    }
    setRemoving(true)
    try {
      const blob = await (await fetch(pendingImage)).blob()
      const fd = new FormData()
      fd.append('image', blob, 'profile.png')
      const res = await fetch(REMOVE_BG_ENDPOINT, { method: 'POST', body: fd })
      if (!res.ok) throw new Error(`HTTP ${res.status}`)
      const out = await res.blob()
      setPendingImage(URL.createObjectURL(out))
      setNote('Background removed — review and Save.')
    } catch {
      setNote('Background removal failed. Check the /api/remove-background backend.')
    } finally {
      setRemoving(false)
    }
  }

  const saveImage = async () => {
    if (!pendingImage) return
    await repo.profileImage.save(pendingImage)
    onProfileImageChange(pendingImage)
    setPendingImage(null)
    setNote('Profile image updated ✓')
    window.setTimeout(() => setNote(''), 2500)
  }

  const finalImage = pendingImage || profileImage

  return (
    <div className="grid grid-cols-1 gap-8 xl:grid-cols-[0.9fr_1.1fr]">
      {/* image manager */}
      <div className="bl-card p-6">
        <h2 className="mb-5 font-display text-lg font-bold text-ink">Profile Image</h2>
        <div className="mx-auto mb-5 flex h-64 w-full max-w-[280px] items-center justify-center overflow-hidden rounded-lg border-3 border-ink bg-softblue p-2">
          <img src={finalImage} alt="Profile preview" className="h-full w-full object-contain" />
        </div>

        <div className="flex flex-col gap-4">
          <input type="file" id="pf-img" accept="image/png,image/webp,image/jpeg" onChange={onPick} className="sr-only" />
          <label
            htmlFor="pf-img"
            className="bl-btn bl-btn-peach w-full cursor-pointer"
          >
            <FaUpload aria-hidden="true" /> Upload New Photo
          </label>
          <p className="text-center text-[12px] text-inkmuted">
            PNG / WebP recommended (transparent backgrounds are preserved).
          </p>
          <button type="button" onClick={removeBackground} disabled={removing} className="bl-btn bl-btn-dark w-full disabled:opacity-60">
            <FaMagic aria-hidden="true" /> {removing ? 'Removing background…' : 'Remove Background'}
          </button>
          <button type="button" onClick={saveImage} disabled={!pendingImage} className="bl-btn bl-btn-mint w-full disabled:opacity-50">
            <FaCheckCircle aria-hidden="true" /> Save New Image
          </button>
        </div>

        {note && <p className="mt-4 rounded-lg border-2 border-ink bg-softblue p-3 text-[12.5px] font-bold text-ink">{note}</p>}
      </div>

      {/* profile data */}
      <div className="bl-card p-6 md:p-8">
        <h2 className="mb-5 font-display text-lg font-bold text-ink">Profile Details</h2>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <div>
            <label className="field-label">Full name</label>
            <input className="bl-input" value={profile.name} onChange={set('name')} />
          </div>
          <div>
            <label className="field-label">Title</label>
            <input className="bl-input" value={profile.title} onChange={set('title')} />
          </div>
          <div className="sm:col-span-2">
            <label className="field-label">About (used by the Jarvis assistant)</label>
            <textarea className="bl-textarea" value={profile.about} onChange={set('about')} placeholder="Short professional introduction…" />
          </div>
          <div>
            <label className="field-label">Phone</label>
            <input className="bl-input" value={profile.phone} onChange={set('phone')} />
          </div>
          <div>
            <label className="field-label">Email</label>
            <input type="email" className="bl-input" value={profile.email} onChange={set('email')} />
          </div>
          <div className="sm:col-span-2">
            <label className="field-label">Location</label>
            <input className="bl-input" value={profile.location} onChange={set('location')} />
          </div>
        </div>
        <button type="button" onClick={saveProfile} className="bl-btn bl-btn-dark mt-6">
          Save Profile
        </button>
      </div>

      {/* social links */}
      <div className="bl-card p-6 xl:col-span-2">
        <div className="mb-1 flex items-center justify-between">
          <h2 className="font-display text-lg font-bold text-ink">Social Links</h2>
          {socialNote && <p className="text-[12px] font-bold text-ink">{socialNote}</p>}
        </div>
        <p className="mb-5 text-[12.5px] text-inkmuted">
          Leave a field empty to hide that platform until its link is configured.
        </p>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {SOCIAL_PLATFORMS.map((p) => (
            <div key={p.id}>
              <label className="field-label" htmlFor={`social-${p.id}`}>
                {p.name}
              </label>
              <input
                id={`social-${p.id}`}
                type="url"
                className="bl-input"
                placeholder={SOCIAL_LINK_PLACEHOLDERS[p.id]}
                value={social[p.id] || ''}
                onChange={setSocialLink(p.id)}
              />
            </div>
          ))}
        </div>
        <button type="button" onClick={saveSocial} className="bl-btn bl-btn-mint mt-6">
          <FaCheckCircle aria-hidden="true" /> Save Social Links
        </button>
      </div>
    </div>
  )
}