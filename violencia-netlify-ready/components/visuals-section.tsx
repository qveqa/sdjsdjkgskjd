import { Eye, Move, Wifi, Palette, ScanLine } from 'lucide-react'
import type { Dict } from '@/lib/content'
import { SectionHeading } from '@/components/section-heading'
import { Reveal } from '@/components/reveal'

const icons = [Eye, Move, Wifi]
const swatches = ['bg-primary', 'bg-foreground', 'bg-primary/45']

export function VisualsSection({ t }: { t: Dict }) {
  return (
    <section id="visuals">
      <div className="mx-auto w-full max-w-6xl px-5 py-20 lg:py-24">
        <SectionHeading
          eyebrow={t.visuals.eyebrow}
          title={t.visuals.title}
          lead={t.visuals.lead}
        />

        <div className="mt-12 grid gap-4 lg:grid-cols-[1.05fr_0.95fr]">
          <ul className="grid gap-4 self-start">
            {t.visuals.items.map((item, index) => {
              const Icon = icons[index] ?? Eye
              return (
                <Reveal
                  as="li"
                  key={item.name}
                  delay={index * 100}
                  x={-16}
                  className="flex gap-4 rounded-2xl border border-border bg-background p-6 hover:border-primary/50"
                >
                  <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-primary/15 text-primary">
                    <Icon className="h-4 w-4" aria-hidden="true" />
                  </span>
                  <div>
                    <h3 className="font-mono text-sm tracking-wider">{item.name}</h3>
                    <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                      {item.text}
                    </p>
                  </div>
                </Reveal>
              )
            })}
          </ul>

          <div className="flex flex-col gap-4">
            <Reveal x={16} className="rounded-2xl border border-border bg-background p-6">
              <span className="flex items-center gap-3">
                <Palette className="h-4 w-4 text-primary" aria-hidden="true" />
                <h3 className="font-display text-xl tracking-wide uppercase">
                  {t.visuals.colorsTitle}
                </h3>
              </span>
              <ul className="mt-5 flex flex-col gap-2.5">
                {t.visuals.colors.map((item, index) => (
                  <li
                    key={item}
                    className="flex items-center justify-between rounded-xl bg-muted/40 px-4 py-2.5 font-mono text-xs text-muted-foreground"
                  >
                    {item}
                    <span
                      className={`h-3.5 w-8 rounded-full ${swatches[index] ?? 'bg-primary'}`}
                      aria-hidden="true"
                    />
                  </li>
                ))}
              </ul>
            </Reveal>

            <Reveal x={16} delay={120} className="rounded-2xl border border-border bg-background p-6">
              <span className="flex items-center gap-3">
                <ScanLine className="h-4 w-4 text-primary" aria-hidden="true" />
                <h3 className="font-display text-xl tracking-wide uppercase">
                  {t.visuals.tracerTitle}
                </h3>
              </span>
              <ul className="mt-5 flex flex-wrap gap-2">
                {t.visuals.tracers.map((item) => (
                  <li
                    key={item}
                    className="rounded-full border border-border px-3 py-1.5 font-mono text-xs text-muted-foreground"
                  >
                    {item}
                  </li>
                ))}
              </ul>
            </Reveal>
          </div>
        </div>
      </div>
    </section>
  )
}
