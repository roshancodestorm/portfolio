# Roshan Kannaujiya — Neo-Brutalist Portfolio   

Link https://ledekh.netlify.app/

<img width="1366" height="768" alt="image" src="https://github.com/user-attachments/assets/66944d46-f400-4d7d-a15e-296ef8c02236" />

## Stack

- **Build:** Vite + React + Tailwind v4
- **Animations:** CSS transforms + IntersectionObserver + Web Animations (lightweight, reduced-motion aware)
- **Icons:** react-icons
- **Resume PDF:** jsPDF (ATS-friendly, code-split)
- **Data:** localStorage by default → Firestore when configured
- **Auth:** Firebase Auth when configured; dev-demo login otherwise
- **Assistant:** Web Speech API (SpeechRecognition + SpeechSynthesis) with a secure `/api/chat` hook
- **GitHub activity:** live REST + GraphQL data through secure Netlify Functions

<img width="1366" height="768" alt="image" src="https://github.com/user-attachments/assets/0adab9de-b5d8-49d8-b37e-fba3d88b4563" />





### Firebase

Enable `pb-use-firebase=1` in localStorage to route data through Firestore once your env vars
are set (projects → `projects`, messages → `messages`). Implement `src/config/firebase.js` —
it lazy-imports the SDK only when configured, so the main site stays light.

### AI assistant

The Jarvis panel answers locally (no API key in the browser). For real AI, call your
`/api/chat` endpoint — a secure Netlify Function example lives in `netlify/functions/chat.js`.
Point `VITE_AI_CHAT_ENDPOINT` at it and set `AI_API_KEY` on the server.

### GitHub activity

The Activity section uses two server-only endpoints: `GET /api/github-rest` (profile, stats,
repositories, commits, PRs) and `GET /api/github-graphql` (`contributionsCollection` heatmap).
Set `GITHUB_TOKEN` in Netlify environment variables — **never with a `VITE_` prefix** — and
optionally `GITHUB_USERNAME`. Without a token, REST still uses anonymous public endpoints and
the heatmap shows an explicit unavailable state instead of fake data. Revoke any token that was
ever exposed.

### Background removal

Admin → Profile → upload a photo → "Remove Background". It calls `VITE_REMOVE_BG_ENDPOINT`
with your image; `netlify/functions/remove-background.js` is a working proxy example for
remove.bg (`REMOVE_BG_API_KEY` stays server-side). Result is previewed, then saved.

## Deployment

<img width="1366" height="768" alt="image" src="https://github.com/user-attachments/assets/9f6596ac-ddb2-40b6-9ad3-68f8b68edae7" />


### GitHub Pages / other static hosts

Hash routing means no server rewrites are needed — publish `dist/` as-is.

## Project structure

```
├── index.html                 # SEO + OG meta
├── netlify.toml               # build, redirects, caching
├── netlify/functions/         # secure serverless proxies (chat, remove-background, github-rest, github-graphql)
├── public/
│   ├── favicon.svg
│   ├── profile.png            # default profile image (drop a transparent PNG here)
│   └── projects/*.svg         # project cover art
└── src/
    ├── config/                # site.js (links/forms) · firebase.js (lazy init)
    ├── data/                  # projectsData.js · resumeData.js
    ├── utils/                 # db.js (data layer) · github.js · resumePdf.js · chat.js
    ├── hooks/                 # useTilt.js
    ├── components/
    │   ├── ui/                # Button, Card, Reveal, ProfileImage, TypeWriter…
    │   ├── sections/          # Home, Projects, Skills, GitHubActivity, About, Contact, Jarvis
    │   └── admin/             # AdminLogin · Dashboard · Tab{Projects,Messages,Resume,Profile}
    └── App.jsx                # hash router + shell
```
