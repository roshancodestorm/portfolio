import { useCallback, useEffect, useState } from 'react'
import { repo } from './utils/db'
import { SECTIONS } from './utils/sectionOrder'
import Navbar from './components/Navbar'
import ScrollToTop from './components/ScrollToTop'
import CursorGlow from './components/ui/CursorGlow'
import BackgroundShapes from './components/ui/BackgroundShapes'
import { SocialIconRow } from './components/ui/SocialButtons'
import Home from './components/sections/Home'
import Projects from './components/sections/Projects'
import Skills from './components/sections/Skills'
import About from './components/sections/About'
import Connect from './components/sections/Connect'
import Contact from './components/sections/Contact'
import JarvisAssistant from './components/sections/JarvisAssistant'
import AdminLogin from './components/admin/AdminLogin'
import Dashboard from './components/admin/Dashboard'
import { DEVELOPER_NAME, DEVELOPER_TITLE } from './config/site'

function getRoute() {
  return window.location.hash.replace(/^#\/?/, '').split('?')[0].toLowerCase()
}

export default function App() {
  const [route, setRoute] = useState(getRoute)
  const [activeSection, setActiveSection] = useState('home')
  const [projects, setProjects] = useState([])
  const [profileImage, setProfileImage] = useState('/profile.png')
  const [social, setSocial] = useState(null)
  const [ready, setReady] = useState(false)

  useEffect(() => {
    const onHash = () => setRoute(getRoute())
    window.addEventListener('hashchange', onHash)
    return () => window.removeEventListener('hashchange', onHash)
  }, [])

  useEffect(() => {
    let mounted = true
    ;(async () => {
      const [projs, img, socialLinks] = await Promise.all([
        repo.projects.load(),
        repo.profileImage.load(),
        repo.social.load(),
      ])
      if (!mounted) return
      setProjects(projs)
      setProfileImage(img)
      setSocial(socialLinks)
      setReady(true)
    })()
    return () => {
      mounted = false
    }
  }, [])

  const handleNavigate = useCallback((section) => {
    const el = document.getElementById(section)
    if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' })
    setActiveSection(section)
  }, [])

  const handleResume = useCallback(async () => {
    const resume = await repo.resume.load()
    const { downloadResumePdf } = await import('./utils/resumePdf')
    downloadResumePdf(resume)
  }, [])

  useEffect(() => {
    if (route && route !== 'projects' && route !== 'skills' && route !== 'about' && route !== 'contact') return
    const elements = SECTIONS.map((id) => document.getElementById(id)).filter(Boolean)
    if (!elements.length) return
    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries
          .filter((e) => e.isIntersecting)
          .sort((a, b) => b.intersectionRatio - a.intersectionRatio)
        if (visible[0]?.target?.id) setActiveSection(visible[0].target.id)
      },
      { rootMargin: '-25% 0px -55% 0px', threshold: [0, 0.25, 0.5] },
    )
    elements.forEach((el) => observer.observe(el))
    return () => observer.disconnect()
  }, [route, ready])

  // Admin routes
  if (route === 'admin') {
    return (
      <div className="min-h-screen">
        <BackgroundShapes />
        <AdminLogin />
      </div>
    )
  }
  if (route === 'dashboard') {
    return (
      <div className="min-h-screen">
        <BackgroundShapes />
        <Dashboard onProjectsChange={setProjects} profileImage={profileImage} onProfileImageChange={setProfileImage} />
      </div>
    )
  }

  return (
    <div className="relative min-h-screen bg-cream">
      <CursorGlow />
      <BackgroundShapes />
      <Navbar activeSection={activeSection} onNavigate={handleNavigate} onResume={handleResume} />

      <main className="relative z-10">
        <Home sectionId="home" profileImage={profileImage} social={social} onNavigate={handleNavigate} onResume={handleResume} />
        <Projects projects={projects} />
        <Skills />
        <About sectionId="about" profileImage={profileImage} />
        <Connect sectionId="connect" social={social} />
        <Contact sectionId="contact" />
      </main>

      <footer className="relative z-10 border-t-3 border-ink bg-ink py-12">
        <div className="section-shell flex flex-col items-center gap-5 text-center">
          <p className="font-display text-xl font-bold tracking-tight text-cream">
            {DEVELOPER_NAME}
          </p>
          <p className="font-display text-[13px] font-bold text-cream/70">
            {DEVELOPER_TITLE.replace(' \u00b7 ', ' | ')}
          </p>
          <SocialIconRow links={social} />
          <p className="text-[12px] text-cream/50">
            © {new Date().getFullYear()} {DEVELOPER_NAME} · All Rights Reserved
          </p>
        </div>
      </footer>

      <JarvisAssistant />
      <ScrollToTop />
    </div>
  )
}