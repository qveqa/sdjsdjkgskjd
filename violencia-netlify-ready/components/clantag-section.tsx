import type { Dict } from '@/lib/content'
import { SectionHeading } from '@/components/section-heading'
import { Reveal } from '@/components/reveal'

export function ClantagSection({ t }: { t: Dict }) {
  return (
    <section id="clantag" className="bg-card/40">
      <div className="mx-auto w-full max-w-6xl px-5 py-20 lg:py-24">
        <SectionHeading eyebrow={t.clantag.eyebrow} title={t.clantag.title} />

        <div className="mt-12 grid gap-4 lg:grid-cols-2">
          <Reveal x={-16} y={16} className="rounded-2xl border border-border bg-card p-7">
            <p className="inline-flex rounded-full bg-primary/15 px-3 py-1 font-mono text-xs tracking-wider text-primary">
              {t.clantag.staticLabel}
            </p>
            <p className="mt-5 rounded-xl border border-border bg-background px-4 py-3 font-mono text-sm">
              violencia.top
            </p>
            <p className="mt-5 text-sm leading-relaxed text-muted-foreground">
              {t.clantag.staticText}
            </p>
          </Reveal>

          <Reveal x={16} y={16} delay={120} className="rounded-2xl border border-border bg-card p-7">
            <p className="inline-flex rounded-full bg-primary/15 px-3 py-1 font-mono text-xs tracking-wider text-primary">
              {t.clantag.loopLabel}
            </p>
            <div
              className="mt-5 overflow-hidden rounded-xl border border-border bg-background px-4 py-3"
              style={{
                maskImage:
                  'linear-gradient(to right, transparent, #000 12%, #000 88%, transparent)',
                WebkitMaskImage:
                  'linear-gradient(to right, transparent, #000 12%, #000 88%, transparent)',
              }}
            >
              <div className="clantag-loop flex w-max gap-6 font-mono text-sm whitespace-nowrap">
                <span aria-hidden="true">
                  violencia.top&nbsp;&nbsp;violencia.top&nbsp;&nbsp;violencia.top
                </span>
                <span aria-hidden="true">
                  violencia.top&nbsp;&nbsp;violencia.top&nbsp;&nbsp;violencia.top
                </span>
              </div>
              <span className="sr-only">violencia.top</span>
            </div>
            <p className="mt-5 text-sm leading-relaxed text-muted-foreground">
              {t.clantag.loopText}
            </p>
          </Reveal>
        </div>

        <Reveal className="mt-8 flex flex-col gap-6 rounded-3xl border border-border bg-card/60 p-7 lg:flex-row lg:items-center lg:justify-between">
          <div className="max-w-xl">
            <p className="font-mono text-xs tracking-[0.2em] text-primary">{t.ui.eyebrow}</p>
            <h3 className="mt-3 font-display text-2xl tracking-wide uppercase">{t.ui.title}</h3>
            <p className="mt-3 leading-relaxed text-muted-foreground">{t.ui.text}</p>
          </div>

          <div className="flex items-center gap-4 rounded-2xl border border-border bg-background px-5 py-4">
            <span className="toggle-sweep font-mono text-sm tracking-wider">
              {t.ui.toggleLabel}
            </span>
            <span
              className="flex h-5 w-9 items-center rounded-full border border-primary/70 bg-primary/20 px-0.5"
              aria-hidden="true"
            >
              <span className="ml-auto h-3.5 w-3.5 rounded-full bg-primary" />
            </span>
          </div>
        </Reveal>
      </div>
    </section>
  )
}
