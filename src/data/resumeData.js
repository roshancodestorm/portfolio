import { CONTACT_EMAIL, CONTACT_PHONE_RAW, CONTACT_LOCATION, LINKS } from '../config/site'

export const defaultResume = {
  name: 'Roshan Kannaujiya',
  headline: 'AI & ML Student · Software Developer',
  title: 'Software Developer',
  phone: CONTACT_PHONE_RAW,
  email: CONTACT_EMAIL,
  location: CONTACT_LOCATION,
  linkedin: LINKS.linkedin,
  github: LINKS.github,
  portfolio: 'https://localhost:5173',
  summary:
    'AI & ML student with a strong foundation in software engineering, algorithm design, and full-stack development. Proficient in Python, Java, and C++, with hands-on experience building scalable applications and solving complex programming problems. Passionate about developing efficient, real-world software solutions using modern development practices.',
  skills: {
    programming: 'C, C++, Java, Python, SQL',
    web: 'HTML, CSS, JavaScript, React, Next.js',
    aiMl: 'Python, NLP, AI APIs, Machine Learning',
    tools: 'Git, GitHub, Firebase, Linux, REST API',
  },
  education: [
    {
      degree: 'B.Tech in AI & ML',
      institution: 'GCRG Group of Institutions, Lucknow',
      period: '2024 – 2028 (Expected)',
      highlights: [
        'Awarded "Best Mentor" for leadership and peer support in academic projects.',
        'Contributed to an Extended Research Paper, showcasing analytical and research skills.',
      ],
    },
  ],
  projects: [
    {
      title: 'Cyber Cafe SaaS',
      bullets: [
        'Built a subscription cyber cafe management platform with real-time session tracking and billing.',
        'Integrated Redis caching, PostgreSQL storage and an AI analytics dashboard.',
      ],
    },
    {
      title: 'Jarvis to CodeStorm',
      bullets: [
        'Developed an AI-powered voice assistant using Python and NLP to automate user tasks.',
        'Integrated external APIs for real-time responses and workflow automation.',
      ],
    },
    {
      title: 'Voice Integrity Verification Framework',
      bullets: [
        'Designed a framework for detecting tampering in voice recordings using ML and audio processing.',
        'Built a FastAPI backend for analysis and reporting.',
      ],
    },
    {
      title: 'Portfolio Website',
      bullets: [
        'Designed and developed a fully responsive neo-brutalist portfolio with React and Tailwind CSS.',
        'Implemented AI assistant, resume generator, admin dashboard and Firebase-ready data layer.',
      ],
    },
  ],
  achievements: [
    'Best Mentor Award — GCRG Group of Institutions',
    'Extended Research Paper contribution (AI & ML)',
  ],
  certifications: [
    'Machine Learning & AI Fundamentals (Online)',
    'Full-Stack Web Development (React, Node.js)',
  ],
}

export function skillsToString(skills) {
  if (typeof skills === 'string') return skills
  if (!skills) return ''
  return Object.values(skills)
    .filter(Boolean)
    .join(' | ')
}

/** Map a flattened resume form object into the resume shape. */
export function buildResumeFromForm(form) {
  const { name, headline, summary, ...rest } = form

  const toLines = (value) =>
    String(value || '')
      .split('\n')
      .map((l) => l.trim())
      .filter(Boolean)

  return {
    name: name || defaultResume.name,
    headline: headline || defaultResume.headline,
    summary: summary || defaultResume.summary,
    phone: rest.phone || defaultResume.phone,
    email: rest.email || defaultResume.email,
    location: rest.location || defaultResume.location,
    linkedin: rest.linkedin || LINKS.linkedin,
    github: rest.github || LINKS.github,
    portfolio: rest.portfolio || defaultResume.portfolio,
    skills: {
      programming: rest.skillsProgramming || defaultResume.skills.programming,
      web: rest.skillsWeb || defaultResume.skills.web,
      aiMl: rest.skillsAiMl || defaultResume.skills.aiMl,
      tools: rest.skillsTools || defaultResume.skills.tools,
    },
    education: toLines(rest.education).map((line) => ({ degree: line, highlights: [] })),
    projects: toLines(rest.projects).map((line) => ({
      title: line,
      bullets: [],
    })),
    achievements: toLines(rest.achievements),
    certifications: toLines(rest.certifications),
  }
}

export function resumeToForm(resume) {
  return {
    name: resume.name,
    headline: resume.headline,
    summary: resume.summary,
    phone: resume.phone,
    email: resume.email,
    location: resume.location,
    linkedin: resume.linkedin,
    github: resume.github,
    portfolio: resume.portfolio,
    skillsProgramming: resume.skills?.programming || '',
    skillsWeb: resume.skills?.web || '',
    skillsAiMl: resume.skills?.aiMl || '',
    skillsTools: resume.skills?.tools || '',
    education: (resume.education || []).map((e) => `${e.degree} — ${e.institution || ''}`).join('\n'),
    projects: (resume.projects || []).map((p) => p.title).join('\n'),
    achievements: (resume.achievements || []).join('\n'),
    certifications: (resume.certifications || []).join('\n'),
  }
}