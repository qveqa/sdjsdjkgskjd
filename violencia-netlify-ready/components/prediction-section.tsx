import { Radar, Activity, Zap, HeartPulse } from 'lucide-react'
import type { Dict } from '@/lib/content'
import { SectionHeading } from '@/components/section-heading'
import { Reveal } from '@/components/reveal'

const icons = [Radar, Activity, Zap]

export function PredictionSection({ t }: { t: Dict }) {
  return (
    <section id="predict">
      <div className="mx-auto w-full max-w-6xl px-5 py-20 lg:py-24">
        <SectionHeading
          eyebrow={t.predict.eyebrow}
          title={t.predict.title}
          lead={t.predict.lead}
        />

        <ul className="mt-12 grid gap-4 lg:grid-cols-3">
          {t.predict.items.map((item, index) => {
            const Icon = icons[index] ?? Radar
            return (
              <Reveal
                as="li"
                key={item.name}
                delay={index * 100}
                className="rounded-2xl border border-border bg-card p-6 hover:border-primary/50"
              >
                <span className="flex items-center gap-3">
                  <span className="flex h-8 w-8 items-center justify-center rounded-full bg-primary/15 text-primary">
                    <Icon className="h-4 w-4" aria-hidden="true" />
                  </span>
                  <h3 className="font-mono text-sm tracking-wider text-foreground">{item.name}</h3>
                </span>
                <p className="mt-4 text-sm leading-relaxed text-muted-foreground">{item.text}</p>
              </Reveal>
            )
          })}
        </ul>

        <div className="mt-8 grid gap-4 lg:grid-cols-[0.9fr_1.1fr]">
          <Reveal x={-16} y={16} className="rounded-2xl border border-border bg-card p-7">
            <span className="flex items-center gap-3">
              <span className="flex h-8 w-8 items-center justify-center rounded-full bg-primary/15 text-primary">
                <HeartPulse className="h-4 w-4" aria-hidden="true" />
              </span>
              <h3 className="font-display text-2xl tracking-wide uppercase">
                {t.predict.baimTitle}
              </h3>
            </span>
            <p className="mt-4 leading-relaxed text-muted-foreground">{t.predict.baimText}</p>
          </Reveal>

          <Reveal x={16} y={16} delay={120} className="rounded-2xl border border-border bg-background p-7">
            <ol className="flex flex-col gap-3">
              {t.predict.baimSteps.map((step, index) => (
                <li key={step} className="flex gap-4 rounded-xl bg-muted/40 px-4 py-3.5">
                  <span className="font-mono text-xs text-primary">
                    {String(index + 1).padStart(2, '0')}
                  </span>
                  <span className="font-mono text-xs leading-5 text-muted-foreground">{step}</span>
                </li>
              ))}
            </ol>
          </Reveal>
        </div>
      </div>
    </section>
  )
}
