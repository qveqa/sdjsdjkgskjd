'use client'

import { Download } from 'lucide-react'
import type { Dict, Lang } from '@/lib/content'
import { scrollToAnchor } from '@/lib/scroll-to-anchor'

type Props = {
  t: Dict
  lang: Lang
  onLangChange: (lang: Lang) => void
}

export function SiteNav({ t, lang, onLangChange }: Props) {
  const links = [
    { href: '#features', label: t.nav.features },
    { href: '#weapons', label: t.nav.weapons },
    { href: '#predict', label: t.nav.predict },
    { href: '#tech', label: t.nav.tech },
    { href: '#visuals', label: t.nav.visuals },
    { href: '#clantag', label: t.nav.clantag },
  ]

  return (
    <header className="sticky top-0 z-50 border-b border-border bg-background/85 backdrop-blur-md">
      <div className="mx-auto flex h-16 w-full max-w-6xl items-center justify-between gap-4 px-5">
        <a
          href="#top"
          onClick={(event) => scrollToAnchor(event, '#top')}
          className="flex items-center gap-2.5"
        >
          <span className="flex h-8 w-8 items-center justify-center rounded-full border border-primary/60 bg-primary/10">
            <span className="h-1.5 w-1.5 rounded-full bg-primary" />
          </span>
          <span className="font-display text-lg leading-none tracking-[0.14em] uppercase">
            violencia
          </span>
        </a>

        <nav aria-label="Основная навигация" className="hidden items-center gap-7 lg:flex">
          {links.map((link) => (
            <a
              key={link.href}
              href={link.href}
              onClick={(event) => scrollToAnchor(event, link.href)}
              className="font-mono text-xs tracking-wider text-muted-foreground transition-colors hover:text-foreground"
            >
              {link.label}
            </a>
          ))}
        </nav>

        <div className="flex items-center gap-3">
          <div
            role="group"
            aria-label="Language / Язык"
            className="flex items-center gap-1 rounded-full border border-border p-1"
          >
            {(['ru', 'en'] as const).map((code) => (
              <button
                key={code}
                type="button"
                onClick={() => onLangChange(code)}
                aria-pressed={lang === code}
                className={`rounded-full px-2.5 py-1 font-mono text-xs tracking-wider uppercase transition-colors ${
                  lang === code
                    ? 'bg-primary text-primary-foreground'
                    : 'text-muted-foreground hover:text-foreground'
                }`}
              >
                {code}
              </button>
            ))}
          </div>

          <a
            href="/violencianightly.lua"
            download="violencianightly.lua"
            className="hidden items-center gap-2 rounded-full border border-primary bg-primary px-4 py-2 font-mono text-xs tracking-wider text-primary-foreground transition-colors hover:bg-primary/85 sm:inline-flex"
          >
            <Download className="h-3.5 w-3.5" aria-hidden="true" />
            {t.nav.cta}
          </a>
        </div>
      </div>
    </header>
  )
}
