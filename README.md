# Roshan Kannaujiya — Neo-Brutalist Portfolio   

Link https://ledekh.netlify.app/

Premium, characterful portfolio for **Roshan Kannaujiya** — AI & ML Student, Software Developer.
Built with React 19, Vite 8, Tailwind CSS 4, framer-motion visuals, jsPDF and an optional
Firebase backend. Inspired by a neo-brutalist / hand-drawn visual language: cream background,
thick `#111827` outlines, hard offset shadows, playful accents.

## Stack

- **Build:** Vite + React + Tailwind v4
- **Animations:** CSS transforms + IntersectionObserver + Web Animations (lightweight, reduced-motion aware)
- **Icons:** react-icons
- **Resume PDF:** jsPDF (ATS-friendly, code-split)
- **Data:** localStorage by default → Firestore when configured
- **Auth:** Firebase Auth when configured; dev-demo login otherwise
- **Assistant:** Web Speech API (SpeechRecognition + SpeechSynthesis) with a secure `/api/chat` hook

## Run locally

```bash
npm install
npm run dev        # http://localhost:5173
npm run build      # production build → dist/
npm run lint       # eslint
```

## Routes (hash-based — works on any static host)

| Route | Page |
|-------|------|
| `#/` | Main portfolio (Home, Projects, Skills, About, Connect) |
| `#/admin` | Admin login |
| `#/dashboard` | Admin dashboard (Projects · Messages · Resume · Profile) |

Dashboard dev login (shown on the login screen when Firebase is off):
`admin@roshan.dev` / `admin123`. Passwords are never stored in `localStorage` — only a
`sessionStorage` session flag is set after authentication.

## Configuration

Copy `.env.example` → `.env` and fill what you want:

| Variable | Purpose |
|----------|---------|
| `VITE_FIREBASE_*` | Firebase client config (Auth / Firestore / Storage) |
| `VITE_GOOGLE_FORM_URL` | Google Form embed URL for "Quick Work Request" |
| `VITE_AI_CHAT_ENDPOINT` | Secure chat proxy (default `/api/chat`) |
| `VITE_REMOVE_BG_ENDPOINT` | Secure background-removal proxy (default `/api/remove-background`) |
| `AI_API_KEY` / `REMOVE_BG_API_KEY` | **Server-side only** — used by Netlify Functions, never shipped |

### Firebase

Enable `pb-use-firebase=1` in localStorage to route data through Firestore once your env vars
are set (projects → `projects`, messages → `messages`). Implement `src/config/firebase.js` —
it lazy-imports the SDK only when configured, so the main site stays light.

### AI assistant

The Jarvis panel answers locally (no API key in the browser). For real AI, call your
`/api/chat` endpoint — a secure Netlify Function example lives in `netlify/functions/chat.js`.
Point `VITE_AI_CHAT_ENDPOINT` at it and set `AI_API_KEY` on the server.

### Background removal

Admin → Profile → upload a photo → "Remove Background". It calls `VITE_REMOVE_BG_ENDPOINT`
with your image; `netlify/functions/remove-background.js` is a working proxy example for
remove.bg (`REMOVE_BG_API_KEY` stays server-side). Result is previewed, then saved.

## Deployment

### Netlify

- `netlify.toml` ships ready: `npm run build`, publish `dist`, SPA redirects, and `/api/*` rewrites.
- Deploy the functions with `netlify deploy` (Netlify auto-detects `netlify/functions`).
- Set env vars in the Netlify dashboard; never commit `.env`.

### GitHub Pages / other static hosts

Hash routing means no server rewrites are needed — publish `dist/` as-is.

## Project structure

```
├── index.html                 # SEO + OG meta
├── netlify.toml               # build, redirects, caching
├── netlify/functions/         # secure serverless proxies (chat, remove-background)
├── public/
│   ├── favicon.svg
│   ├── profile.png            # default profile image (drop a transparent PNG here)
│   └── projects/*.svg         # project cover art
└── src/
    ├── config/                # site.js (links/forms) · firebase.js (lazy init)
    ├── data/                  # projectsData.js · resumeData.js
    ├── utils/                 # db.js (data layer) · resumePdf.js · chat.js
    ├── hooks/                 # useTilt.js
    ├── components/
    │   ├── ui/                # Button, Card, Reveal, ProfileImage, TypeWriter…
    │   ├── sections/          # Home, Projects, Skills, About, Contact, Jarvis
    │   └── admin/             # AdminLogin · Dashboard · Tab{Projects,Messages,Resume,Profile}
    └── App.jsx                # hash router + shell
```
