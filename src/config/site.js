export const DEVELOPER_NAME = 'Roshan Kannaujiya'
export const DEVELOPER_SHORT = 'ROSHAN'
export const DEVELOPER_TITLE = 'AI & ML Student · Software Developer'
export const DEVELOPER_HANDLE = 'roshancodestorm'

export const CONTACT_EMAIL = 'roshankannaujiya@gmail.com'
export const CONTACT_PHONE_DISPLAY = '+91 8115641550'
export const CONTACT_PHONE_RAW = '918115641550'
export const CONTACT_LOCATION = 'Bakshi Ka Talab, Lucknow, India'

export const LINKS = {
  github: 'https://github.com/roshancodestorm',
  linkedin: 'https://www.linkedin.com/in/roshancodestorm',
  leetcode: 'https://leetcode.com/u/roshancodestorm',
  youtube: 'https://www.youtube.com/@rkmindcraft',
}

export const NAV_LINKS = [
  { id: 'home', label: 'Home' },
  { id: 'projects', label: 'Projects' },
  { id: 'skills', label: 'Skills' },
  { id: 'about', label: 'About' },
  { id: 'contact', label: 'Contact' },
]

export const TYPING_PHRASES = ['AI & ML Student', 'Software Developer', 'AI Enthusiast']

/* Replace with your real Google Forms embed URL (see .env VITE_GOOGLE_FORM_URL) */
export const GOOGLE_FORM_URL = import.meta.env.VITE_GOOGLE_FORM_URL || ''

export const AI_CHAT_ENDPOINT = import.meta.env.VITE_AI_CHAT_ENDPOINT || '/api/chat'
export const REMOVE_BG_ENDPOINT = import.meta.env.VITE_REMOVE_BG_ENDPOINT || '/api/remove-background'

export const BUDGETS = ['Under ₹5,000', '₹5,000–₹10,000', '₹10,000–₹25,000', '₹25,000+']
export const WORK_TYPES = [
  'Website',
  'AI Project',
  'Software Development',
  'Portfolio',
  'Form Filling',
  'Other',
]

export function buildWhatsAppUrl(message) {
  return `https://wa.me/${CONTACT_PHONE_RAW}?text=${encodeURIComponent(message)}`
}

export const WHATSAPP_DEFAULT =
  'Hi Roshan! I found your portfolio and would like to connect with you.'