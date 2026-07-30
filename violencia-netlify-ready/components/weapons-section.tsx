import { Check, Signal } from 'lucide-react'
import type { Dict } from '@/lib/content'
import { SectionHeading } from '@/components/section-heading'
import { Reveal } from '@/components/reveal'

export function WeaponsSection({ t }: { t: Dict }) {
  return (
    <section id="weapons" className="bg-card/40">
      <div className="mx-auto w-full max-w-6xl px-5 py-20 lg:py-24">
        <SectionHeading
          eyebrow={t.weapons.eyebrow}
          title={t.weapons.title}
          lead={t.weapons.lead}
        />

        <ol className="mt-12 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {t.weapons.list.map((weapon, index) => (
            <Reveal
              as="li"
              key={weapon.name}
              delay={index * 80}
              className="flex items-baseline gap-4 rounded-2xl border border-border bg-background p-6 hover:border-primary/50"
            >
              <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-primary/15 font-mono text-xs text-primary">
                {String(index + 1).padStart(2, '0')}
              </span>
              <span>
                <span className="block font-display text-2xl leading-tight tracking-wide uppercase">
                  {weapon.name}
                </span>
                <span className="mt-1 block font-mono text-xs text-muted-foreground">
                  {weapon.role}
                </span>
              </span>
            </Reveal>
          ))}
        </ol>

        <div className="mt-8 grid gap-4 lg:grid-cols-2">
          <Reveal className="rounded-2xl border border-border bg-background p-6">
            <h3 className="font-display text-xl tracking-wide uppercase">
              {t.weapons.hitboxTitle}
            </h3>
            <ul className="mt-5 flex flex-wrap gap-2">
              {t.weapons.hitboxes.map((box) => (
                <li
                  key={box}
                  className="flex items-center gap-1.5 rounded-full border border-border px-3 py-1.5 font-mono text-xs text-muted-foreground"
                >
                  <Check className="h-3 w-3 text-primary" aria-hidden="true" />
                  {box}
                </li>
              ))}
            </ul>
          </Reveal>

          <Reveal delay={120} className="rounded-2xl border border-border bg-background p-6">
            <h3 className="font-display text-xl tracking-wide uppercase">
              {t.weapons.pingTitle}
            </h3>
            <ul className="mt-5 flex flex-col gap-2.5">
              {t.weapons.pings.map((ping) => (
                <li
                  key={ping}
                  className="flex items-center gap-3 rounded-xl bg-muted/40 px-4 py-2.5 font-mono text-xs text-muted-foreground"
                >
                  <Signal className="h-3.5 w-3.5 shrink-0 text-primary" aria-hidden="true" />
                  {ping}
                </li>
              ))}
            </ul>
          </Reveal>
        </div>
      </div>
    </section>
  )
}
