export const PROJECT_CATEGORIES = ['ALL', 'AI', 'WEB', 'APP', 'OTHER']

const projectDefaults = {
  category: ['OTHER'],
  githubUrl: 'https://github.com/roshancodestorm',
  liveUrl: '',
}

export const defaultProjects = [
  {
    id: 'p-cyber-cafe',
    title: 'Cyber Cafe SaaS',
    description:
      'A subscription-based cyber cafe management SaaS with real-time session tracking, billing automation, and an AI-powered usage insights dashboard.',
    tech: ['FastAPI', 'PostgreSQL', 'Redis', 'Next.js', 'AI'],
    category: ['WEB'],
    image: '/projects/cyber-cafe-saas.svg',
    githubUrl: 'https://github.com/roshancodestorm/Cyber-Cafe-SaaS',
    liveUrl: '',
  },
  {
    ...projectDefaults,
    id: 'p-jarvis',
    title: 'Jarvis to CodeStorm',
    description:
      'A voice-first AI assistant evolved from Jarvis to CodeStorm — NLP command parsing, API orchestration, and voice interaction for real-world automation.',
    tech: ['Python', 'NLP', 'API', 'AI'],
    category: ['AI'],
    image: '/projects/jarvis-to-codestorm.svg',
  },
  {
    ...projectDefaults,
    id: 'p-voice-verify',
    title: 'Voice Integrity Verification Framework',
    description:
      'Framework for verifying voice recording integrity using machine learning and audio signal processing to detect tampering and ensure authenticity.',
    tech: ['AI', 'ML', 'Audio Processing', 'FastAPI'],
    category: ['AI'],
    image: '/projects/voice-integrity.svg',
  },
  {
    ...projectDefaults,
    id: 'p-portfolio',
    title: 'Portfolio Website',
    description:
      'This neo-brutalist portfolio — hand-crafted layout, hard shadows, micro animations, AI assistant, and a fully equipped admin dashboard.',
    tech: ['HTML', 'CSS', 'JavaScript'],
    category: ['WEB', 'OTHER'],
    image: '/projects/portfolio-website.svg',
    liveUrl: '/',
  },
]