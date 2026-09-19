import { useEffect, useState } from 'react'

/** Typewriter that cycles through phrases. */
export default function TypeWriter({ phrases = [], typingSpeed = 70, pause = 1400, className = '' }) {
  const [index, setIndex] = useState(0)
  const [text, setText] = useState('')
  const [deleting, setDeleting] = useState(false)

  useEffect(() => {
    if (!phrases.length) return
    const current = phrases[index % phrases.length]
    let id

    if (!deleting && text === current) {
      id = window.setTimeout(() => setDeleting(true), pause)
    } else if (deleting && text === '') {
      id = window.setTimeout(() => {
        setDeleting(false)
        setIndex((i) => (i + 1) % phrases.length)
      }, typingSpeed)
    } else {
      id = window.setTimeout(() => {
        setText(
          deleting
            ? current.slice(0, text.length - 1)
            : current.slice(0, text.length + 1),
        )
      }, deleting ? typingSpeed / 2 : typingSpeed)
    }
    return () => clearTimeout(id)
  }, [text, deleting, index, phrases, typingSpeed, pause])

  return (
    <span className={className}>
      {text}
      <span className="anim-blink inline-block -mb-[3px] ml-1 h-[1.15em] w-[3px] bg-[#111827]" aria-hidden="true" />
    </span>
  )
}