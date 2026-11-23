/**
 * Curated project catalogue.
 *
 * The first four entries are the featured projects shown on the homepage.
 * Every entry (including the two non-featured ones) is available in the full
 * Projects section. IDs stay stable so admin/localStorage edits merge cleanly.
 */

export const PROJECT_FILTERS = [
  { id: 'ALL', label: 'All Projects' },
  { id: 'FEATURED', label: 'Featured' },
  { id: 'AI', label: 'Artificial Intelligence' },
  { id: 'WEB', label: 'Web Development' },
  { id: 'SAAS', label: 'SaaS' },
  { id: 'GAME', label: 'Game Development' },
  { id: 'PROGRAMMING', label: 'Programming' },
]

/** Selectable categories in the admin editor (filters are not categories). */
export const PROJECT_CATEGORY_OPTIONS = PROJECT_FILTERS.filter(
  ({ id }) => id !== 'ALL' && id !== 'FEATURED',
)

/** Kept for backwards compatibility with admin code and stored data. */
export const PROJECT_CATEGORIES = PROJECT_CATEGORY_OPTIONS.map(({ id }) => id)

export const CATEGORY_LABELS = Object.fromEntries(
  PROJECT_CATEGORY_OPTIONS.map(({ id, label }) => [id, label]),
)

export const defaultProjects = [
  {
    id: 'p-codevera-ai',
    title: 'Codevera AI',
    description:
      'An AI-powered assistant designed to help developers with intelligent coding assistance and productivity workflows.',
    tech: ['AI', 'React', 'TypeScript', 'Developer Tools'],
    category: ['AI'],
    image: '/projects/codevera-ai.svg',
    githubUrl: 'https://github.com/roshancodestorm/Codevera',
    githubLabel: 'View on GitHub',
    liveUrl: '',
    liveLabel: 'Live Demo',
    featured: true,
  },
  {
    id: 'p-ai-resume-platform',
    title: 'AI Resume Platform',
    description:
      'An AI-powered resume platform that helps users create professional resumes, analyze ATS compatibility, match resumes with job descriptions, and improve their career opportunities.',
    tech: ['AI', 'Resume Builder', 'ATS', 'Job Matching', 'Web Development'],
    category: ['AI', 'WEB'],
    image: '/projects/ai-resume-platform.svg',
    githubUrl: '',
    githubLabel: 'View on GitHub',
    liveUrl: 'https://airesumecode.netlify.app/',
    liveLabel: 'Live Demo',
    featured: true,
  },
  {
    id: 'p-nasa-mission-architect',
    title: 'NASA Mission Architect',
    description:
      'An interactive space mission design and simulation game that allows users to explore spacecraft engineering, mission planning, resource management, and space exploration concepts.',
    tech: ['NASA Space Apps', 'Godot 4', 'Game Development', 'Space Exploration'],
    category: ['GAME'],
    image: '/projects/nasa-mission-architect.svg',
    githubUrl: 'https://github.com/roshancodestorm/NASA-GAME-',
    githubLabel: 'View on GitHub',
    liveUrl: '',
    liveLabel: 'Live Demo',
    featured: true,
  },
  {
    id: 'p-cyber-cafe',
    title: 'Cyber Cafe SaaS',
    description:
      'A cyber cafe management platform designed to simplify daily operations through an admin dashboard, customer management, system management, and business administration tools.',
    tech: ['SaaS', 'Admin Dashboard', 'Management System', 'Web Development'],
    category: ['SAAS', 'WEB'],
    image: '/projects/cyber-cafe-saas.svg',
    githubUrl: '',
    githubLabel: 'View on GitHub',
    liveUrl: 'https://teri-netlify-site.netlify.app/',
    liveLabel: 'Live Demo',
    featured: true,
  },
  {
    id: 'p-c-dsa',
    title: 'C-DSA',
    description:
      'A collection of C++ programming practice, data structures, algorithms, and LeetCode problem solutions focused on strengthening problem-solving skills.',
    tech: ['C++', 'DSA', 'LeetCode', 'Algorithms', 'Problem Solving'],
    category: ['PROGRAMMING'],
    image: '/projects/c-dsa.svg',
    githubUrl: 'https://github.com/roshancodestorm/C-DSA',
    githubLabel: 'View on GitHub',
    liveUrl: '',
    liveLabel: 'Live Demo',
    featured: false,
  },
  {
    id: 'p-portfolio',
    title: 'Personal Portfolio',
    description:
      'My personal developer portfolio showcasing my projects, technical skills, achievements, resume, and an interactive Jarvis AI voice assistant. Built with a modern Neo-Brutalist design.',
    tech: ['React', 'Vite', 'Tailwind CSS', 'JavaScript', 'AI Assistant'],
    category: ['WEB'],
    image: '/projects/personal-portfolio.svg',
    githubUrl: 'https://github.com/roshancodestorm/portfolio',
    githubLabel: 'GitHub',
    liveUrl: 'https://ledekh.netlify.app/',
    liveLabel: 'Live Demo',
    featured: false,
  },
]
