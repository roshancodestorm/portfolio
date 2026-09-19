import { useRef, useState } from 'react'
import { FaLock, FaEnvelope, FaArrowLeft } from 'react-icons/fa'
import { getAuth, isFirebaseConfigured } from '../../config/firebase'

/**
 * Admin login.
 *
 * PRODUCTION: Uses Firebase Authentication when configured (see .env).
 * DEV FALLBACK (NO firebase): demo credentials below — shown only so the
 * dashboard is testable before Firebase is wired up. Passwords are NEVER saved
 * to localStorage; only an in-memory/session flag is kept after success.
 */
const DEV_EMAIL = 'admin@roshan.dev'
const DEV_PASSWORD = 'admin123'

export default function AdminLogin() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [busy, setBusy] = useState(false)
  const timerRef = useRef(null)

  const firebaseOn = isFirebaseConfigured()

  const goDashboard = () => {
    sessionStorage.setItem('rk-admin-auth', '1')
    window.location.hash = '#/dashboard'
  }

  const onSubmit = async (e) => {
    e.preventDefault()
    setError('')
    setBusy(true)
    try {
      if (firebaseOn) {
        const auth = await getAuth()
        const { signInWithEmailAndPassword } = await import('firebase/auth')
        await signInWithEmailAndPassword(auth, email, password)
        goDashboard()
      } else if (email.trim().toLowerCase() === DEV_EMAIL && password === DEV_PASSWORD) {
        goDashboard()
      } else {
        setError('Invalid credentials. In dev mode use the demo login shown below.')
      }
    } catch (err) {
      setError(
        firebaseOn
          ? `Firebase sign-in failed: ${err.code || err.message}`
          : 'Invalid credentials. In dev mode use the demo login shown below.',
      )
    } finally {
      setBusy(false)
      window.clearTimeout(timerRef.current)
      timerRef.current = window.setTimeout(() => setError(''), 4000)
    }
  }

  return (
    <div className="section-shell flex min-h-screen items-center justify-center py-16">
      <div className="w-full max-w-[440px]">
        <button
          type="button"
          onClick={() => (window.location.hash = '#/')}
          className="mb-6 flex items-center gap-2 text-sm font-bold text-inkmuted transition-colors hover:text-ink"
        >
          <FaArrowLeft aria-hidden="true" /> Back to portfolio
        </button>

        <div className="bl-card relative overflow-hidden p-8">
          <div aria-hidden="true" className="hatch absolute inset-0 opacity-40 pointer-events-none" />
          <div className="relative">
            <div className="mb-6 flex items-center gap-4">
              <span className="flex h-12 w-12 items-center justify-center rounded-xl border-3 border-ink bg-ink text-cyan">
                <FaLock aria-hidden="true" />
              </span>
              <div>
                <h1 className="font-display text-2xl font-bold tracking-tight text-ink">
                  Admin Access
                </h1>
                <p className="text-[12.5px] font-semibold text-inkmuted">
                  Roshan Kannaujiya · Portfolio CMS
                </p>
              </div>
            </div>

            <form onSubmit={onSubmit} className="flex flex-col gap-5">
              <div>
                <label htmlFor="au-email" className="field-label">
                  <FaEnvelope className="mr-1 inline" aria-hidden="true" /> Email
                </label>
                <input
                  id="au-email"
                  type="email"
                  className="bl-input"
                  placeholder="admin@roshan.dev"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  autoComplete="email"
                  required
                />
              </div>
              <div>
                <label htmlFor="au-pass" className="field-label">
                  <FaLock className="mr-1 inline" aria-hidden="true" /> Password
                </label>
                <input
                  id="au-pass"
                  type="password"
                  className="bl-input"
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  autoComplete="current-password"
                  required
                />
              </div>

              {error && (
                <p role="alert" className="rounded-lg border-2 border-coral bg-coral/15 px-3 py-2 text-[13px] font-bold text-ink">
                  {error}
                </p>
              )}

              <button type="submit" disabled={busy} className="bl-btn bl-btn-coral w-full disabled:opacity-60">
                {busy ? 'Signing in…' : 'Login → Dashboard'}
              </button>
            </form>
          </div>
        </div>

        <div className="bl-card-cream mt-6 p-5">
          {firebaseOn ? (
            <p className="text-[13px] font-semibold text-inkmuted">
              🔐 Firebase Auth enabled — sign in with your Firebase user.
            </p>
          ) : (
            <p className="text-[13px] font-semibold text-inkmuted">
              ⚠️ Firebase not configured. Dev demo login:
              <span className="mx-1 rounded border-2 border-ink bg-white px-2 py-0.5 font-mono text-[12px]">
                {DEV_EMAIL}
              </span>
              /
              <span className="ml-1 rounded border-2 border-ink bg-white px-2 py-0.5 font-mono text-[12px]">
                {DEV_PASSWORD}
              </span>
              <span className="mt-1 block text-[12px]">
                Set Firebase env vars to enable production auth (password never stored in localStorage).
              </span>
            </p>
          )}
        </div>
      </div>
    </div>
  )
}