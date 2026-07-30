import { Download, FileCode, Megaphone, Send } from 'lucide-react'
import { Reveal } from '@/components/reveal'
import { TiltCard } from '@/components/tilt-card'
import type { Dict } from '@/lib/content'

export function CtaSection({ t }: { t: Dict }) {
  return (
    <section id="cta" className="relative overflow-hidden">
      <div className="relative mx-auto grid w-full max-w-6xl gap-10 px-5 py-20 lg:grid-cols-[1fr_0.85fr] lg:items-center lg:py-24">
        <div>
          <Reveal>
            <h2 className="font-display text-4xl leading-none tracking-tight uppercase sm:text-5xl">
              {t.cta.title}
            </h2>
          </Reveal>
          <Reveal delay={100}>
            <p className="mt-5 leading-relaxed text-pretty text-muted-foreground">{t.cta.text}</p>
          </Reveal>

          <Reveal delay={200} className="mt-9 flex flex-wrap gap-3">
            <a
              href="/violencianightly.lua"
              download="violencianightly.lua"
              className="inline-flex items-center gap-2 rounded-full bg-primary px-6 py-3 font-mono text-sm tracking-wider text-primary-foreground transition-colors hover:bg-primary/85"
            >
              <Download className="h-4 w-4" aria-hidden="true" />
              {t.cta.primary}
            </a>
            <a
              href="https://t.me/qirel"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 rounded-full border border-border px-6 py-3 font-mono text-sm tracking-wider transition-colors hover:border-primary hover:text-primary"
            >
              <Send className="h-4 w-4" aria-hidden="true" />
              {t.cta.secondary}
            </a>
          </Reveal>

          <div className="mt-8 grid gap-4 sm:grid-cols-2">
            <Reveal delay={80} className="rounded-2xl border border-border bg-card p-6">
              <p className="font-mono text-xs tracking-wider text-primary">{t.cta.contactTitle}</p>
              <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
                {t.cta.contactText}
              </p>
              <a
                href="https://t.me/qirel"
                target="_blank"
                rel="noopener noreferrer"
                className="mt-4 inline-flex items-center gap-2 rounded-full bg-muted/50 px-4 py-2 font-mono text-sm text-foreground transition-colors hover:text-primary"
              >
                <Send className="h-3.5 w-3.5 text-primary" aria-hidden="true" />
                {t.cta.contactHandle}
              </a>
            </Reveal>

            <Reveal delay={180} className="rounded-2xl border border-border bg-card p-6">
              <p className="font-mono text-xs tracking-wider text-primary">{t.cta.newsTitle}</p>
              <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
                {t.cta.newsText}
              </p>
              <a
                href="https://t.me/violencialua"
                target="_blank"
                rel="noopener noreferrer"
                className="mt-4 inline-flex items-center gap-2 rounded-full bg-muted/50 px-4 py-2 font-mono text-sm text-foreground transition-colors hover:text-primary"
              >
                <Megaphone className="h-3.5 w-3.5 text-primary" aria-hidden="true" />
                {t.cta.newsHandle}
              </a>
            </Reveal>
          </div>
        </div>

        <Reveal x={16} y={28} delay={120}>
          <TiltCard maxTilt={9} className="rounded-2xl border border-border bg-card p-7">
          <div className="flex items-center gap-4">
            <span className="flex h-12 w-12 items-center justify-center rounded-full bg-primary/15 text-primary">
              <FileCode className="h-5 w-5" aria-hidden="true" />
            </span>
            <div>
              <p className="font-mono text-sm text-foreground">{t.cta.fileTitle}</p>
              <p className="font-mono text-xs text-muted-foreground">{t.cta.fileMeta}</p>
            </div>
          </div>

          <ol className="mt-6 flex flex-col gap-2.5">
            {t.cta.fileSteps.map((step, index) => (
              <li
                key={step}
                className="flex gap-3 rounded-xl bg-muted/40 px-4 py-3 text-sm leading-relaxed text-muted-foreground"
              >
                <span className="font-mono text-xs text-primary">
                  {String(index + 1).padStart(2, '0')}
                </span>
                {step}
              </li>
            ))}
          </ol>

          <a
            href="/violencianightly.lua"
            download="violencianightly.lua"
            className="mt-6 inline-flex w-full items-center justify-center gap-2 rounded-full border border-primary/60 bg-primary/10 px-5 py-3 font-mono text-sm tracking-wider text-primary transition-colors hover:bg-primary/20"
          >
            <Download className="h-4 w-4" aria-hidden="true" />
            {t.cta.fileTitle}
          </a>
          </TiltCard>
        </Reveal>
      </div>
    </section>
  )
}
