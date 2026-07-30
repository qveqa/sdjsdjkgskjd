import { Crosshair, Layers, Wifi, Waves, Activity, Check } from 'lucide-react'
import type { Dict } from '@/lib/content'
import { SectionHeading } from '@/components/section-heading'
import { Reveal } from '@/components/reveal'

const icons = [Crosshair, Layers, Wifi, Waves, Activity, Check]

export function TechSection({ t }: { t: Dict }) {
  return (
    <section id="tech" className="bg-card/40">
      <div className="mx-auto w-full max-w-6xl px-5 py-20 lg:py-24">
        <SectionHeading eyebrow={t.tech.eyebrow} title={t.tech.title} lead={t.tech.lead} />

        <ul className="mt-12 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {t.tech.items.map((item, index) => {
            const Icon = icons[index] ?? Crosshair
            return (
              <Reveal
                as="li"
                key={item.name}
                delay={index * 90}
                className="rounded-2xl border border-border bg-background p-6 hover:border-primary/50"
              >
                <span className="flex items-center gap-3">
                  <span className="flex h-8 w-8 items-center justify-center rounded-full bg-primary/15 text-primary">
                    <Icon className="h-4 w-4" aria-hidden="true" />
                  </span>
                  <h3 className="font-mono text-sm tracking-wider">{item.name}</h3>
                </span>
                <p className="mt-4 text-sm leading-relaxed text-muted-foreground">{item.text}</p>
              </Reveal>
            )
          })}
        </ul>

        <div className="mt-8 grid gap-4 lg:grid-cols-[0.9fr_1.1fr]">
          <Reveal x={-16} y={16} className="rounded-2xl border border-border bg-background p-6">
            <h3 className="font-display text-xl tracking-wide uppercase">{t.tech.specTitle}</h3>
            <ul className="mt-5 flex flex-col gap-2.5">
              {t.tech.specs.map((spec) => (
                <li
                  key={spec.k}
                  className="flex items-center justify-between rounded-xl bg-muted/40 px-4 py-2.5 font-mono text-xs"
                >
                  <span className="text-muted-foreground">{spec.k}</span>
                  <span className="text-primary">{spec.v}</span>
                </li>
              ))}
            </ul>
          </Reveal>

          <Reveal
            x={16}
            y={16}
            delay={120}
            className="rounded-2xl border border-border bg-background p-6"
          >
            <h3 className="font-display text-xl tracking-wide uppercase">{t.tech.formulaTitle}</h3>
            <ul className="mt-5 flex flex-col gap-2.5">
              {t.tech.formulas.map((formula) => (
                <li
                  key={formula}
                  className="rounded-xl border border-border/70 bg-muted/30 px-4 py-3 font-mono text-xs leading-5 text-foreground"
                >
                  {formula}
                </li>
              ))}
            </ul>
            <p className="mt-5 text-sm leading-relaxed text-muted-foreground">
              {t.tech.formulaNote}
            </p>
          </Reveal>
        </div>
      </div>
    </section>
  )
}
