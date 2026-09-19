import { LINKS, CONTACT_EMAIL, CONTACT_PHONE_DISPLAY, GOOGLE_FORM_URL } from '../config/site'
import { repo } from './db'

export const QUICK_COMMANDS = [
  'Show my projects',
  'Open GitHub',
  'Contact Roshan',
  'Download resume',
  'Tell me about Roshan',
  'Show skills',
]

function scrollToSection(id) {
  const el = document.getElementById(id)
  if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' })
}

export async function getAssistantReply(message) {
  const text = String(message || '').toLowerCase().trim()

  if (text.includes('project')) {
    scrollToSection('projects')
    return 'Opening the Projects section — 4 selected builds including an AI voice framework and a Cyber Cafe SaaS. Every card has GitHub + live demo links.'
  }
  if (text.includes('github')) {
    window.open(LINKS.github, '_blank', 'noopener,noreferrer')
    return 'Opening Roshan\'s GitHub (@roshancodestorm) in a new tab.'
  }
  if (text.includes('contact') || text.includes('email') || text.includes('reach') || text.includes('connect')) {
    scrollToSection('contact')
    return `Here's how to reach Roshan:\n\nEmail — ${CONTACT_EMAIL}\nPhone — ${CONTACT_PHONE_DISPLAY}\n\nI've scrolled you to the Connect section with the request form, WhatsApp, LinkedIn and GitHub.`
  }
  if (text.includes('resume') || text.includes('cv') || text.includes('download')) {
    return 'Requesting resume download… Click the RESUME button in the navbar or use the About section to generate a fresh PDF.'
  }
  if (text.includes('about') || text.includes('roshan') || text.includes('who') || text.includes('tell')) {
    scrollToSection('about')
    return `Roshan Kannaujiya is an AI & ML student at GCRG Group of Institutions, Lucknow (B.Tech, expected 2028). He builds AI assistants, full-stack apps and this portfolio — focusing on Machine Learning, NLP, and clean software. I've scrolled to the About section for the full story.`
  }
  if (text.includes('skill')) {
    scrollToSection('skills')
    return 'Roshan\'s stack: C, C++, Java, Python, SQL · HTML, CSS, JavaScript, React, Next.js · NLP, Machine Learning, AI APIs · Git, GitHub, Firebase, Linux, REST APIs.'
  }
  if (text.includes('work') || text.includes('hire') || text.includes('job') || text.includes('intern')) {
    scrollToSection('contact')
    return 'Use the Contact / Connect section to send a work request, or open the Google Form for a quick request. I can also open WhatsApp if you want.'
  }
  if (text.includes('form')) {
    if (GOOGLE_FORM_URL) {
      window.open(GOOGLE_FORM_URL, '_blank', 'noopener,noreferrer')
      return 'Opening the Google Form in a new tab.'
    }
    return 'The Google Form link is not configured yet. Ask Roshan to set VITE_GOOGLE_FORM_URL in the site config.'
  }
  if (text.includes('hello') || text.includes('hi') || text.includes('hey')) {
    return 'Hey! I\'m CodeVora/Jarvis, Roshan\'s AI assistant. Try "Show my projects", "Contact Roshan" or "Tell me about Roshan".'
  }
  if (text.includes('help')) {
    return (
      'I can help with:\n' +
      QUICK_COMMANDS.map((c) => `• ${c}`).join('\n')
    )
  }
  if (text.includes('admin') || text.includes('dashboard')) {
    window.location.hash = '#/admin'
    return 'Opening the admin login at #/admin.'
  }

  const profile = await repo.profile.load()
  const snippet =
    profile?.about?.slice(0, 240) ||
    'Roshan Kannaujiya — AI & ML student, software developer and AI enthusiast building practical, real-world projects.'
  return `I'm a lightweight local assistant tracking this build (no API key exposed in the browser). ${snippet} For smarter answers, connect VITE_AI_CHAT_ENDPOINT to a secure backend that proxies an LLM of your choice.`
}

export { repo }