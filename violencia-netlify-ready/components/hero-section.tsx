'use client'

import { Download } from 'lucide-react'
import { Reveal } from '@/components/reveal'
import { TiltCard } from '@/components/tilt-card'
import type { Dict } from '@/lib/content'
import { scrollToAnchor } from '@/lib/scroll-to-anchor'

export function HeroSection({ t }: { t: Dict }) {
  return (
    <section id="top" className="relative overflow-hidden">
      <div
        className="pointer-events-none absolute inset-x-0 top-0 h-px bg-primary/50"
        aria-hidden="true"
      />

      <div className="relative mx-auto grid w-full max-w-6xl gap-14 px-5 py-20 lg:grid-cols-[1.05fr_0.95fr] lg:items-center lg:py-28">
        <div>
          <Reveal y={12}>
            <p className="flex items-center gap-2 font-mono text-xs tracking-[0.2em] text-primary">
              <span className="h-px w-8 bg-primary" aria-hidden="true" />
              {t.hero.tag}
            </p>
          </Reveal>

          <Reveal delay={100} y={28}>
            <h1 className="mt-6 font-display text-6xl leading-[0.9] tracking-tight uppercase sm:text-7xl lg:text-8xl">
              {t.hero.title}
              <span className="block text-primary">{t.hero.titleAccent}</span>
            </h1>
          </Reveal>

          <Reveal delay={220}>
            <p className="mt-6 max-w-xl leading-relaxed text-pretty text-muted-foreground">
              {t.hero.lead}
            </p>
          </Reveal>

          <Reveal delay={320} className="mt-9 flex flex-wrap items-center gap-3">
            <a
              href="/violencianightly.lua"
              download="violencianightly.lua"
              className="inline-flex items-center gap-2 rounded-full bg-primary px-6 py-3 font-mono text-sm tracking-wider text-primary-foreground transition-colors hover:bg-primary/85"
            >
              <Download className="h-4 w-4" aria-hidden="true" />
              {t.hero.primary}
            </a>
            <a
              href="#features"
              onClick={(event) => scrollToAnchor(event, '#features')}
              className="inline-flex items-center rounded-full border border-border px-6 py-3 font-mono text-sm tracking-wider text-foreground transition-colors hover:border-primary hover:text-primary"
            >
              {t.hero.secondary}
            </a>
          </Reveal>

          <dl className="mt-12 flex flex-wrap gap-x-10 gap-y-6 border-t border-border pt-8">
            {t.hero.stats.map((stat, i) => (
              <Reveal as="div" key={stat.label} delay={420 + i * 110} y={16}>
                <dt className="sr-only">{stat.label}</dt>
                <dd>
                  <span className="font-display text-4xl leading-none text-primary">
                    {stat.value}
                  </span>
                  <span className="mt-2 block max-w-28 font-mono text-xs leading-5 text-muted-foreground">
                    {stat.label}
                  </span>
                </dd>
              </Reveal>
            ))}
          </dl>
        </div>

        <Reveal delay={200} y={36} className="mx-auto w-2/3">
          <TiltCard glareRadius={280}>
            <img
              src="/images/violencia-menu@3x.png"
              alt={t.hero.panelAlt}
              width={807}
              height={1212}
              className="block w-full"
            />
          </TiltCard>
        </Reveal>
      </div>
    </section>
  )
}
