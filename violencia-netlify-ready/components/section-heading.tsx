import { Reveal } from '@/components/reveal'

type Props = {
  eyebrow: string
  title: string
  lead?: string
}

export function SectionHeading({ eyebrow, title, lead }: Props) {
  return (
    <div className="max-w-2xl">
      <Reveal>
        <p className="flex items-center gap-2 font-mono text-xs tracking-[0.2em] text-primary">
          <span className="h-px w-8 bg-primary" aria-hidden="true" />
          {eyebrow}
        </p>
      </Reveal>
      <Reveal delay={80}>
        <h2 className="mt-4 font-display text-4xl leading-none tracking-tight uppercase sm:text-5xl">
          {title}
        </h2>
      </Reveal>
      {lead ? (
        <Reveal delay={160}>
          <p className="mt-4 leading-relaxed text-pretty text-muted-foreground">{lead}</p>
        </Reveal>
      ) : null}
    </div>
  )
}
