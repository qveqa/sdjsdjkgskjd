import { Crosshair, Target, Gauge, HeartPulse, Eye, Tag } from 'lucide-react'
import type { Dict } from '@/lib/content'
import { SectionHeading } from '@/components/section-heading'
import { Reveal } from '@/components/reveal'
import { TiltCard } from '@/components/tilt-card'

const icons = [Crosshair, Target, Gauge, HeartPulse, Eye, Tag]

export function FeaturesSection({ t }: { t: Dict }) {
  return (
    <section id="features">
      <div className="mx-auto w-full max-w-6xl px-5 py-20 lg:py-24">
        <SectionHeading
          eyebrow={t.features.eyebrow}
          title={t.features.title}
          lead={t.features.lead}
        />

        <ul className="mt-12 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {t.features.items.map((item, index) => {
            const Icon = icons[index] ?? Crosshair
            return (
              <Reveal as="li" key={item.title} className="h-full" delay={index * 90}>
                <TiltCard
                  maxTilt={7}
                  className="group flex h-full flex-col gap-4 rounded-2xl border border-border bg-card p-6 hover:border-primary/50 hover:bg-accent/50"
                >
                  <span className="flex h-10 w-10 items-center justify-center rounded-full border border-border text-primary transition-colors group-hover:border-primary">
                    <Icon className="h-4 w-4" aria-hidden="true" />
                  </span>
                  <h3 className="font-display text-xl tracking-wide uppercase">{item.title}</h3>
                  <p className="text-sm leading-relaxed text-muted-foreground">{item.text}</p>
                </TiltCard>
              </Reveal>
            )
          })}
        </ul>
      </div>
    </section>
  )
}
