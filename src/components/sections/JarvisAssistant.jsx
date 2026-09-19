import { useEffect, useRef, useState } from 'react'
import { FiSend, FiMic, FiMicOff } from 'react-icons/fi'
import { RiRobot2Line } from 'react-icons/ri'
import { getAssistantReply, QUICK_COMMANDS } from '../../utils/chat'

function speak(text) {
  if (!('speechSynthesis' in window)) return
  window.speechSynthesis.cancel()
  const u = new SpeechSynthesisUtterance(text)
  u.rate = 1.02
  u.pitch = 1.05
  window.speechSynthesis.speak(u)
}

export default function JarvisAssistant() {
  const [open, setOpen] = useState(false)
  const [messages, setMessages] = useState([
    {
      role: 'bot',
      text: 'Hey, I\'m CodeVora / Jarvis 🤖 — Roshan\'s AI assistant. Ask me anything or tap a quick command. Voice input works if you let me listen!',
    },
  ])
  const [input, setInput] = useState('')
  const [speaking, setSpeaking] = useState(true)
  const [listening, setListening] = useState(false)
  const [busy, setBusy] = useState(false)

  const inputRef = useRef(null)
  const scrollRef = useRef(null)
  const recRef = useRef(null)

  useEffect(() => {
    if (open) inputRef.current?.focus()
  }, [open])

  useEffect(() => {
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: 'smooth' })
  }, [messages, open])

  const push = (role, text) => setMessages((m) => [...m, { role, text }])

  const handleSend = async (raw) => {
    const text = String(raw ?? input).trim()
    if (!text || busy) return
    setInput('')
    push('user', text)
    setBusy(true)
    try {
      const reply = await getAssistantReply(text)
      push('bot', reply)
      if (speaking && 'speechSynthesis' in window) speak(reply.replace(/\n/g, '. '))
    } catch {
      push('bot', 'Something went wrong on my end — try another command or check the network.')
    } finally {
      setBusy(false)
    }
  }

  const toggleVoice = () => {
    const SR = window.SpeechRecognition || window.webkitSpeechRecognition
    if (!SR) {
      push('bot', 'Voice input isn\'t supported in this browser. Try Chrome or Edge, or just type below.')
      return
    }
    if (listening) {
      recRef.current?.stop()
      setListening(false)
      return
    }
    const rec = new SR()
    rec.lang = 'en-IN'
    rec.interimResults = false
    rec.maxAlternatives = 1
    rec.onstart = () => setListening(true)
    rec.onerror = () => setListening(false)
    rec.onend = () => setListening(false)
    rec.onresult = (e) => {
      const transcript = e.results?.[0]?.[0]?.transcript || ''
      setInput(transcript)
      handleSend(transcript)
    }
    recRef.current = rec
    rec.start()
  }

  const runCommand = (cmd) => {
    setInput(cmd)
    handleSend(cmd)
  }

  return (
    <>
      {/* floating trigger */}
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        aria-label={open ? 'Close CodeVora assistant' : 'Open CodeVora assistant'}
        aria-expanded={open}
        className="anim-pulse-glow fixed right-5 bottom-5 z-50 flex h-16 w-16 items-center justify-center rounded-full border-3 border-cyan bg-ink text-cream"
        style={{ boxShadow: '0 0 25px rgba(85,230,255,0.4)' }}
      >
        {open ? (
          <span className="text-2xl leading-none" aria-hidden="true">✕</span>
        ) : (
          <RiRobot2Line className="text-2xl" aria-hidden="true" />
        )}
      </button>

      {/* panel */}
      {open && (
        <div
          role="dialog"
          aria-label="CodeVora / Jarvis AI assistant"
          className="fixed right-5 bottom-24 z-50 flex w-[min(92vw,384px)] flex-col overflow-hidden rounded-xl border-3 border-ink bg-cream shadow-[10px_10px_0_#111827]"
          style={{ height: 'min(560px, 70vh)' }}
        >
          {/* header */}
          <div className="flex items-center justify-between border-b-3 border-ink bg-ink px-4 py-3">
            <div className="flex items-center gap-2.5">
              <span className="flex h-9 w-9 items-center justify-center rounded-lg border-2 border-cyan bg-ink text-cyan">
                <RiRobot2Line aria-hidden="true" />
              </span>
              <div>
                <p className="font-display text-[14px] font-bold text-cream">CODEVORA / JARVIS</p>
                <p className="flex items-center gap-1.5 text-[11px] text-cyan">
                  <span className="h-2 w-2 rounded-full bg-cyan anim-blink" /> Online · voice ready
                </p>
              </div>
            </div>
            <button
              type="button"
              onClick={() => setSpeaking((v) => !v)}
              aria-pressed={speaking}
              aria-label={speaking ? 'Mute voice replies' : 'Enable voice replies'}
              className="rounded-md border-2 border-cyan px-2 py-1 text-[11px] font-bold text-cyan transition-colors hover:bg-cyan hover:text-ink"
            >
              {speaking ? '🔊 ON' : '🔇 OFF'}
            </button>
          </div>

          {/* messages */}
          <div ref={scrollRef} className="flex-1 space-y-3 overflow-y-auto p-4">
            {messages.map((m, i) => (
              <div key={i} className={`chat-bubble ${m.role === 'user' ? 'chat-user' : 'chat-bot'}`}>
                <p className="whitespace-pre-line">{m.text}</p>
              </div>
            ))}
            {busy && (
              <div className="chat-bubble chat-bot inline-block">
                <span className="inline-block h-2 w-2 animate-pulse rounded-full bg-ink" />
                <span className="inline-block h-2 w-2 animate-pulse rounded-full bg-ink" style={{ animationDelay: '120ms' }} />
                <span className="inline-block h-2 w-2 animate-pulse rounded-full bg-ink" style={{ animationDelay: '240ms' }} />
              </div>
            )}
          </div>

          {/* quick commands */}
          <div className="border-t-3 border-ink bg-softblue px-3 py-2">
            <div className="flex gap-2 overflow-x-auto pb-1" style={{ scrollbarWidth: 'none' }}>
              {QUICK_COMMANDS.map((c) => (
                <button
                  key={c}
                  type="button"
                  onClick={() => runCommand(c)}
                  className="shrink-0 rounded-full border-2 border-ink bg-white px-3 py-1 text-[11px] font-bold text-ink shadow-[2px_2px_0_#111827] transition-transform hover:-translate-y-[1px] hover:bg-sun"
                >
                  {c}
                </button>
              ))}
            </div>
          </div>

          {/* input */}
          <div className="flex items-center gap-2 border-t-3 border-ink bg-cream p-3">
            <textarea
              ref={inputRef}
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter' && !e.shiftKey) {
                  e.preventDefault()
                  handleSend()
                }
              }}
              rows={1}
              placeholder="Ask me anything…"
              aria-label="Message for assistant"
              className="bl-input h-11 min-h-[44px] flex-1 resize-none py-2 text-[13.5px]"
            />
            <button
              type="button"
              onClick={toggleVoice}
              aria-label={listening ? 'Stop voice input' : 'Start voice input'}
              className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-lg border-3 border-ink shadow-[3px_3px_0_#111827] transition-all hover:-translate-y-[1px] ${
                listening ? 'bg-coral text-white' : 'bg-white text-ink'
              }`}
            >
              {listening ? <FiMicOff aria-hidden="true" /> : <FiMic aria-hidden="true" />}
            </button>
            <button
              type="button"
              onClick={() => handleSend()}
              aria-label="Send message"
              className="flex h-11 w-11 shrink-0 items-center justify-center rounded-lg border-3 border-ink bg-ink text-cream shadow-[3px_3px_0_#111827] transition-all hover:-translate-y-[1px] hover:bg-coral hover:text-ink"
            >
              <FiSend aria-hidden="true" />
            </button>
          </div>
        </div>
      )}
    </>
  )
}