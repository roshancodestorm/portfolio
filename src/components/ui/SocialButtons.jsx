import { FaGithub, FaInstagram, FaLinkedinIn, FaYoutube } from 'react-icons/fa'
import { FaXTwitter } from 'react-icons/fa6'
import { SiLeetcode } from 'react-icons/si'
import { SOCIAL_PLATFORMS } from '../../config/social'

const ICONS = {
  instagram: FaInstagram,
  youtube: FaYoutube,
  leetcode: SiLeetcode,
  linkedin: FaLinkedinIn,
  x: FaXTwitter,
  github: FaGithub,
}

function isAbsUrl(value) {
  return typeof value === 'string' && /^https?:\/\/.+/.test(value.trim())
}

function Card({ platform, url }) {
  const Icon = ICONS[platform.id]
  const live = isAbsUrl(url)
  const className = `social-btn ${platform.glow}`

  if (!live) {
    return (
      <span
        title={`${platform.name} — link to be added`}
        className={`${className} cursor-not-allowed opacity-50`}
        aria-label={`${platform.name} (not yet configured)`}
      >
        <Icon aria-hidden="true" />
        <span className="social-label">{platform.name}</span>
      </span>
    )
  }

  return (
    <a
      href={url}
      target="_blank"
      rel="noopener noreferrer"
      aria-label={platform.name}
      data-tip={platform.name}
      className={className}
    >
      <Icon aria-hidden="true" />
      <span className="social-label">{platform.name}</span>
    </a>
  )
}

export function SocialGrid({ links }) {
  return (
    <div className="flex flex-wrap justify-center gap-5 sm:gap-6">
      {SOCIAL_PLATFORMS.map((platform) => (
        <Card key={platform.id} platform={platform} url={links?.[platform.id]} />
      ))}
    </div>
  )
}

export function SocialIconRow({ links, size = 'md' }) {
  const mini = size === 'sm'
  return (
    <div className="flex flex-wrap items-center justify-center gap-3">
      {SOCIAL_PLATFORMS.map((platform) => {
        const Icon = ICONS[platform.id]
        const live = isAbsUrl(links?.[platform.id])
        const cls = mini ? 'social-mini' : 'social-mini !h-12 !w-12 !text-[22px]'
        if (!live) {
          return (
            <span
              key={platform.id}
              title={`${platform.name} — link to be added`}
              aria-label={`${platform.name} (not yet configured)`}
              className={`${cls} cursor-not-allowed opacity-40`}
            >
              <Icon aria-hidden="true" />
            </span>
          )
        }
        return (
          <a
            key={platform.id}
            href={links[platform.id]}
            target="_blank"
            rel="noopener noreferrer"
            aria-label={platform.name}
            className={cls}
          >
            <Icon aria-hidden="true" />
          </a>
        )
      })}
    </div>
  )
}