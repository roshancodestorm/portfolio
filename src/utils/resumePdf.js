import { jsPDF } from 'jspdf'
import { defaultResume, buildResumeFromForm } from '../data/resumeData'

const MARGIN = 18
const PAGE_WIDTH = 210
const CONTENT_WIDTH = PAGE_WIDTH - MARGIN * 2

function addSectionTitle(doc, title, y) {
  doc.setFont('helvetica', 'bold')
  doc.setFontSize(11)
  doc.setTextColor(20, 20, 20)
  doc.text(title.toUpperCase(), MARGIN, y)
  doc.setDrawColor(17, 24, 39)
  doc.setLineWidth(0.6)
  doc.line(MARGIN, y + 2, PAGE_WIDTH - MARGIN, y + 2)
  return y + 10
}

function addWrappedText(doc, text, y, fontSize = 10, indent = 0, color = 60) {
  doc.setFont('helvetica', 'normal')
  doc.setFontSize(fontSize)
  doc.setTextColor(color, color, color)
  const lines = doc.splitTextToSize(text, CONTENT_WIDTH - indent)
  doc.text(lines, MARGIN + indent, y)
  return y + lines.length * (fontSize * 0.46) + 4
}

function addBullets(doc, bullets, y) {
  bullets.forEach((bullet) => {
    doc.setFont('helvetica', 'normal')
    doc.setFontSize(9.5)
    doc.setTextColor(55, 55, 55)
    const lines = doc.splitTextToSize(`• ${bullet}`, CONTENT_WIDTH - 4)
    doc.text(lines, MARGIN + 2, y)
    y += lines.length * 4.6 + 2
  })
  return y + 2
}

function ensureSpace(doc, y, needed) {
  if (y + needed > 276) {
    doc.addPage()
    return 20
  }
  return y
}

export function generateResumePdf(resumeInput = {}) {
  const resume = resumeInput.projects
    ? resumeInput
    : buildResumeFromForm({
        ...defaultResume,
        ...resumeInput,
        name: resumeInput.name || defaultResume.name,
        headline: resumeInput.headline || defaultResume.title || defaultResume.headline,
      })

  const doc = new jsPDF({ unit: 'mm', format: 'a4' })
  let y = 22

  doc.setFont('helvetica', 'bold')
  doc.setFontSize(22)
  doc.setTextColor(17, 24, 39)
  doc.text(resume.name.toUpperCase(), MARGIN, y)

  y += 8
  doc.setFontSize(11)
  doc.setTextColor(80, 80, 80)
  const headline = resume.headline || resume.title
  doc.text(headline.toUpperCase(), MARGIN, y)

  y += 10
  doc.setFont('helvetica', 'normal')
  doc.setFontSize(9)
  doc.setTextColor(70, 70, 70)
  const contact = [
    resume.phone,
    resume.email,
    resume.location,
    resume.linkedin?.replace('https://www.', ''),
    resume.portfolio,
  ]
    .filter(Boolean)
    .join('  |  ')
  const contactLines = doc.splitTextToSize(contact, CONTENT_WIDTH)
  doc.text(contactLines, MARGIN, y)
  y += contactLines.length * 4.5 + 8

  y = addSectionTitle(doc, 'Professional Summary', y)
  y = addWrappedText(doc, resume.summary, y)

  y = ensureSpace(doc, y, 44)
  y = addSectionTitle(doc, 'Technical Skills', y)
  const skills = resume.skills || {}
  const groups = [
    ['Programming', skills.programming],
    ['Web', skills.web],
    ['AI / ML', skills.aiMl],
    ['Tools', skills.tools],
  ]
  groups.forEach(([label, value]) => {
    if (value) y = addWrappedText(doc, `${label}: ${value}`, y, 9.5)
  })

  y = ensureSpace(doc, y, 34)
  y = addSectionTitle(doc, 'Education', y)
  const education = Array.isArray(resume.education) ? resume.education : []
  education.forEach((edu) => {
    y = ensureSpace(doc, y, 20)
    doc.setFont('helvetica', 'bold')
    doc.setFontSize(10)
    doc.setTextColor(35, 35, 35)
    const label = `${edu.degree}${edu.institution ? ` — ${edu.institution}` : ''}`
    doc.text(label, MARGIN, y)
    y += 5
    if (edu.period) {
      doc.setFont('helvetica', 'italic')
      doc.setFontSize(9)
      doc.setTextColor(100, 100, 100)
      doc.text(edu.period, MARGIN, y)
      y += 5
    }
    y = addBullets(doc, edu.highlights || [], y)
  })

  y = ensureSpace(doc, y, 40)
  y = addSectionTitle(doc, 'Projects', y)
  ;(Array.isArray(resume.projects) ? resume.projects : []).forEach((project) => {
    y = ensureSpace(doc, y, 22)
    doc.setFont('helvetica', 'bold')
    doc.setFontSize(10)
    doc.setTextColor(35, 35, 35)
    doc.text(project.title, MARGIN, y)
    y += 6
    y = addBullets(doc, project.bullets || [], y)
  })

  if (resume.certifications?.length) {
    y = ensureSpace(doc, y, 20)
    y = addSectionTitle(doc, 'Certifications', y)
    y = addBullets(doc, resume.certifications, y)
  }

  if (resume.achievements?.length) {
    y = ensureSpace(doc, y, 20)
    y = addSectionTitle(doc, 'Achievements', y)
    y = addBullets(doc, resume.achievements, y)
  }

  return doc
}

export function downloadResumePdf(resume) {
  const doc = generateResumePdf(resume)
  const filename = `${(resume.name || 'Roshan_Kannaujiya').replace(/\s+/g, '_')}_Resume.pdf`
  doc.save(filename)
}