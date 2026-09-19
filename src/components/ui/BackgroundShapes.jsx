/** Decorative floating shapes scattered behind content. */
export default function BackgroundShapes() {
  return (
    <div className="pointer-events-none fixed inset-0 z-0 overflow-hidden" aria-hidden="true">
      <div className="anim-float shape shape-blob left-[-40px] top-[18%] h-36 w-36 bg-peach" />
      <div
        className="shape shape-blob right-[-30px] top-[38%] h-28 w-28 bg-mint"
        style={{ animation: 'floaty 6.5s ease-in-out infinite' }}
      />
      <div
        className="shape right-[8%] top-[8%] h-16 w-16 bg-coral"
        style={{ borderRadius: 12, animation: 'spin-slow 18s linear infinite' }}
      />
      <div className="shape left-[12%] bottom-[10%] h-14 w-14 bg-sun" style={{ borderRadius: 8 }} />
      <div
        className="shape shape-blob left-[38%] bottom-[4%] h-20 w-20 bg-cyan"
        style={{ animation: 'floaty 7s ease-in-out infinite' }}
      />
    </div>
  )
}