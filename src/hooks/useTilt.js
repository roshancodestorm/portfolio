import { useEffect, useRef } from 'react'

/**
 * Lightweight 3D tilt on pointer devices.
 * Returns { ref, onMouseMove, onMouseLeave, style } to spread on an element.
 */
export function useTilt(maxDeg = 6, scale = 1.02) {
  const ref = useRef(null)
  const raf = useRef(0)

  const apply = (rx, ry, s) => {
    const el = ref.current
    if (!el) return
    el.style.transform = `rotateX(${rx}deg) rotateY(${ry}deg) scale(${s})`
  }

  const setFromPoint = (clientX, clientY) => {
    const el = ref.current
    if (!el) return
    const rect = el.getBoundingClientRect()
    const px = (clientX - rect.left) / rect.width - 0.5
    const py = (clientY - rect.top) / rect.height - 0.5
    apply(py * -maxDeg, px * maxDeg, scale)
  }

  const onMouseMove = (e) => {
    if (window.matchMedia('(pointer: coarse)').matches) return
    cancelAnimationFrame(raf.current)
    raf.current = requestAnimationFrame(() => setFromPoint(e.clientX, e.clientY))
  }

  const onMouseLeave = () => {
    cancelAnimationFrame(raf.current)
    apply(0, 0, 1)
  }

  useEffect(() => () => cancelAnimationFrame(raf.current), [])

  return {
    ref,
    style: { transformStyle: 'preserve-3d', transition: 'transform .18s ease-out' },
    onMouseMove,
    onMouseLeave,
  }
}