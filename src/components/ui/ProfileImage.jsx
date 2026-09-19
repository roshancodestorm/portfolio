import { useTilt } from '../../hooks/useTilt'

/**
 * Profile image with:
 *  - transparent PNG/WebP support (object-fit: contain, never cropped)
 *  - soft radial glow behind the person
 *  - gentle floating + 3D tilt on desktop
 */
export default function ProfileImage({
  src,
  alt = 'Roshan Kannaujiya',
  floating = true,
  tilt = true,
  className = '',
}) {
  const tiltProps = useTilt(3, 1.02)
  const floatStyle = floating
    ? { animation: 'floaty 5.5s ease-in-out infinite' }
    : undefined

  return (
    <div
      className={`relative mx-auto ${className}`}
      style={{ width: 'min(100%, 360px)', height: 'auto', aspectRatio: '3 / 4' }}
    >
      {/* soft radial glow behind the person */}
      <div
        aria-hidden="true"
        className="absolute inset-0"
        style={{
          background:
            'radial-gradient(circle, rgba(85,230,255,0.45), transparent 65%)',
        }}
      />
      {/* accent border frame */}
      <div
        aria-hidden="true"
        className="absolute inset-0 border-3 border-ink"
        style={{ borderRadius: 14, zIndex: 1 }}
      />
      {/* hard shadow frame */}
      <div
        aria-hidden="true"
        className="absolute bg-ink left-2 top-2 bottom-[-8px] right-[-8px] border-3 border-ink"
        style={{ borderRadius: 14, zIndex: 0 }}
      />
      <div style={floatStyle} className="relative z-[2] h-full">
        <div
          {...(tilt
            ? {
                ...tiltProps,
                onMouseMove: tiltProps.onMouseMove,
                onMouseLeave: tiltProps.onMouseLeave,
              }
            : {})}
          className="tilt-wrap h-full"
        >
          <img
            src={src}
            alt={alt}
            draggable={false}
            loading="lazy"
            style={{ objectFit: 'contain', width: '100%', height: '100%' }}
            className="relative z-[3]"
          />
        </div>
      </div>
    </div>
  )
}