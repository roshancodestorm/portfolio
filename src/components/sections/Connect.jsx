import Reveal from '../ui/Reveal'
import SectionHeader from '../ui/SectionHeader'
import { SocialGrid } from '../ui/SocialButtons'

export default function Connect({ sectionId, social }) {
  return (
    <section
      id={sectionId}
      className="relative scroll-section border-b-3 border-ink py-24 max-md:py-16"
    >
      <div className="section-shell">
        <Reveal>
          <SectionHeader eyebrow="Never far away" title="Connect" accent="With Me" />
        </Reveal>

        <Reveal delay={80}>
          <p className="mx-auto mb-12 max-w-xl text-center text-[15px] leading-relaxed text-inkmuted">
            Follow the work, drop a message, or just say hi — every tab below opens
            straight into my profile.
          </p>
        </Reveal>

        <Reveal delay={140} direction="scale">
          <SocialGrid links={social} />
        </Reveal>
      </div>
    </section>
  )
}