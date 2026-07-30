import { Megaphone, Send } from 'lucide-react'
import type { Dict } from '@/lib/content'

export function SiteFooter({ t }: { t: Dict }) {
  return (
    <footer className="mx-auto flex w-full max-w-6xl flex-col gap-5 px-5 py-10 lg:flex-row lg:items-center lg:justify-between">
      <div className="flex items-center gap-2.5">
        <span className="flex h-7 w-7 items-center justify-center rounded-full border border-primary/60 bg-primary/10">
          <span className="h-1.5 w-1.5 rounded-full bg-primary" />
        </span>
        <span className="font-mono text-xs tracking-wider text-muted-foreground">
          violencia.top
        </span>
      </div>

      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:gap-6">
        <div className="flex flex-wrap items-center gap-3">
          <a
            href="https://t.me/qirel"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex w-fit items-center gap-2 rounded-full border border-border px-4 py-2 font-mono text-xs tracking-wider text-muted-foreground transition-colors hover:border-primary hover:text-primary"
          >
            <Send className="h-3.5 w-3.5" aria-hidden="true" />
            <span className="sr-only">{t.footer.contactLabel}: </span>
            t.me/qirel
          </a>
          <a
            href="https://t.me/violencialua"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex w-fit items-center gap-2 rounded-full border border-border px-4 py-2 font-mono text-xs tracking-wider text-muted-foreground transition-colors hover:border-primary hover:text-primary"
          >
            <Megaphone className="h-3.5 w-3.5" aria-hidden="true" />
            <span className="sr-only">{t.footer.newsLabel}: </span>
            t.me/violencialua
          </a>
        </div>
        <p className="font-mono text-xs leading-5 text-muted-foreground">
          {t.footer.note} {new Date().getFullYear()} {t.footer.rights}
        </p>
      </div>
    </footer>
  )
}
