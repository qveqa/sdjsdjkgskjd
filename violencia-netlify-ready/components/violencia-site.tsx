'use client'

import { useEffect, useState } from 'react'
import { content, type Lang } from '@/lib/content'
import { SiteNav } from '@/components/site-nav'
import { HeroSection } from '@/components/hero-section'
import { FeaturesSection } from '@/components/features-section'
import { WeaponsSection } from '@/components/weapons-section'
import { PredictionSection } from '@/components/prediction-section'
import { TechSection } from '@/components/tech-section'
import { VisualsSection } from '@/components/visuals-section'
import { ClantagSection } from '@/components/clantag-section'
import { CtaSection } from '@/components/cta-section'
import { SiteFooter } from '@/components/site-footer'

export function ViolenciaSite() {
  const [lang, setLang] = useState<Lang>('ru')
  const t = content[lang]

  useEffect(() => {
    document.documentElement.lang = lang
  }, [lang])

  useEffect(() => {
    if ('scrollRestoration' in history) {
      history.scrollRestoration = 'manual'
    }

    if (window.location.hash) {
      history.replaceState(null, '', window.location.pathname + window.location.search)
    }

    // The browser applies the hash offset (and restores scroll) across a few
    // frames after hydration, so keep forcing the top until the page settles.
    let frames = 0
    let raf = 0

    const pin = () => {
      window.scrollTo(0, 0)
      if (++frames < 20) {
        raf = requestAnimationFrame(pin)
      }
    }

    raf = requestAnimationFrame(pin)

    return () => cancelAnimationFrame(raf)
  }, [])

  return (
    <div>
      <SiteNav t={t} lang={lang} onLangChange={setLang} />
      <main>
        <HeroSection t={t} />
        <FeaturesSection t={t} />
        <WeaponsSection t={t} />
        <PredictionSection t={t} />
        <TechSection t={t} />
        <VisualsSection t={t} />
        <ClantagSection t={t} />
        <CtaSection t={t} />
      </main>
      <SiteFooter t={t} />
    </div>
  )
}
