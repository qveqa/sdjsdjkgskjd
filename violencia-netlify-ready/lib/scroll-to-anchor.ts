import type { MouseEvent } from 'react'

/**
 * Scrolls to an in-page anchor without writing the hash into the URL,
 * so a page reload never restores a deep-linked position.
 */
export function scrollToAnchor(event: MouseEvent<HTMLAnchorElement>, hash: string) {
  const id = hash.replace('#', '')
  const target = id === 'top' ? document.body : document.getElementById(id)

  if (!target) return

  event.preventDefault()

  const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches
  const behavior: ScrollBehavior = reduceMotion ? 'auto' : 'smooth'

  if (id === 'top') {
    window.scrollTo({ top: 0, left: 0, behavior })
    return
  }

  target.scrollIntoView({ behavior, block: 'start' })
}
