'use client'

import { useEffect, useRef, useState, type ElementType, type ReactNode } from 'react'

type RevealProps = {
  children: ReactNode
  className?: string
  /** Задержка появления в миллисекундах — для каскада внутри списков */
  delay?: number
  /** Сдвиг по вертикали до появления */
  y?: number
  /** Сдвиг по горизонтали до появления */
  x?: number
  as?: ElementType
}

export function Reveal({
  children,
  className = '',
  delay = 0,
  y = 24,
  x = 0,
  as: Tag = 'div',
}: RevealProps) {
  const ref = useRef<HTMLElement | null>(null)
  const [shown, setShown] = useState(false)

  useEffect(() => {
    const el = ref.current
    if (!el) return

    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      setShown(true)
      return
    }

    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            setShown(true)
            observer.disconnect()
          }
        }
      },
      { threshold: 0.12, rootMargin: '0px 0px -8% 0px' },
    )

    observer.observe(el)
    return () => observer.disconnect()
  }, [])

  return (
    <Tag
      ref={ref}
      className={`transition-[opacity,transform,filter] duration-700 ease-out ${className}`}
      style={{
        opacity: shown ? 1 : 0,
        filter: shown ? 'blur(0)' : 'blur(6px)',
        transform: shown ? 'none' : `translate3d(${x}px, ${y}px, 0)`,
        transitionDelay: `${delay}ms`,
      }}
    >
      {children}
    </Tag>
  )
}
