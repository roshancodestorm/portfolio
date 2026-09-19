import { useEffect, useState } from 'react'
import { FaSignOutAlt, FaExternalLinkAlt, FaFolderOpen, FaEnvelopeOpenText, FaFileAlt, FaUserCircle } from 'react-icons/fa'
import TabProjects from './TabProjects'
import TabMessages from './TabMessages'
import TabResume from './TabResume'
import TabProfile from './TabProfile'

const TABS = [
  { id: 'projects', label: 'Projects', icon: FaFolderOpen },
  { id: 'messages', label: 'Messages', icon: FaEnvelopeOpenText },
  { id: 'resume', label: 'Resume', icon: FaFileAlt },
  { id: 'profile', label: 'Profile', icon: FaUserCircle },
]

export default function Dashboard({
  onProjectsChange,
  profileImage,
  onProfileImageChange,
}) {
  const [tab, setTab] = useState('projects')

  useEffect(() => {
    if (sessionStorage.getItem('rk-admin-auth') !== '1') {
      window.location.hash = '#/admin'
    }
  }, [])

  const logout = () => {
    sessionStorage.removeItem('rk-admin-auth')
    window.location.hash = '#/admin'
  }

  const getTabProps = {
    projects: { onProjectsChange },
    messages: {},
    resume: {},
    profile: { profileImage, onProfileImageChange },
  }[tab]

  return (
    <div className="section-shell min-h-screen py-10">
      {/* top bar */}
      <div className="mb-10 flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <span className="flex h-11 w-11 items-center justify-center rounded-lg border-3 border-ink bg-ink text-cyan">
            <FaUserCircle className="text-xl" aria-hidden="true" />
          </span>
          <div>
            <h1 className="font-display text-xl font-bold tracking-tight text-ink">Dashboard</h1>
            <p className="text-[12px] font-bold text-inkmuted">Roshan Kannaujiya · Portfolio CMS</p>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={() => (window.location.hash = '#/')}
            className="bl-btn bl-btn-mint h-10 !px-4 text-[13px]"
          >
            <FaExternalLinkAlt aria-hidden="true" /> View Site
          </button>
          <button
            type="button"
            onClick={logout}
            className="bl-btn bl-btn-coral h-10 !px-4 text-[13px]"
          >
            <FaSignOutAlt aria-hidden="true" /> Logout
          </button>
        </div>
      </div>

      {/* tabs */}
      <div className="mb-8 flex flex-wrap gap-3">
        {TABS.map((t) => {
          const active = tab === t.id
          return (
            <button
              key={t.id}
              type="button"
              onClick={() => setTab(t.id)}
              aria-pressed={active}
              className={`bl-btn h-11 !px-5 text-[13px] ${
                active ? 'bl-btn-mint translate-x-[2px] translate-y-[2px] shadow-[3px_3px_0_#111827]' : ''
              }`}
            >
              <t.icon aria-hidden="true" /> {t.label}
            </button>
          )
        })}
      </div>

      {tab === 'projects' && <TabProjects {...getTabProps} />}
      {tab === 'messages' && <TabMessages />}
      {tab === 'resume' && <TabResume />}
      {tab === 'profile' && <TabProfile {...getTabProps} />}
    </div>
  )
}