'use client'

import { useRef, useState, type PointerEvent, type ReactNode } from 'react'

type TiltCardProps = {
  children: ReactNode
  className?: string
  maxTilt?: number
  glareRadius?: number
}

export function TiltCard({
  children,
  className = '',
  maxTilt = 14,
  glareRadius = 340,
}: TiltCardProps) {
  const frame = useRef<number | null>(null)
  const [tilt, setTilt] = useState({ x: 0, y: 0 })
  const [glare, setGlare] = useState({ x: 50, y: 50 })
  const [active, setActive] = useState(false)

  function handlePointerMove(event: PointerEvent<HTMLDivElement>) {
    if (event.pointerType !== 'mouse') return

    const rect = event.currentTarget.getBoundingClientRect()
    const px = (event.clientX - rect.left) / rect.width
    const py = (event.clientY - rect.top) / rect.height

    if (frame.current !== null) cancelAnimationFrame(frame.current)
    frame.current = requestAnimationFrame(() => {
      setTilt({
        x: (0.5 - py) * maxTilt * 2,
        y: (px - 0.5) * maxTilt * 2,
      })
      setGlare({ x: px * 100, y: py * 100 })
    })
  }

  function reset() {
    if (frame.current !== null) cancelAnimationFrame(frame.current)
    setActive(false)
    setTilt({ x: 0, y: 0 })
    setGlare({ x: 50, y: 50 })
  }

  return (
    <div style={{ perspective: '1100px' }} className="h-full">
      <div
        onPointerEnter={() => setActive(true)}
        onPointerMove={handlePointerMove}
        onPointerLeave={reset}
        className={`relative transition-transform duration-200 ease-out will-change-transform motion-reduce:transform-none ${className}`}
        style={{
          transform: `rotateX(${tilt.x}deg) rotateY(${tilt.y}deg) scale(${active ? 1.02 : 1})`,
          transformStyle: 'preserve-3d',
        }}
      >
        {children}
        <span
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 rounded-[inherit] transition-opacity duration-200"
          style={{
            opacity: active ? 1 : 0,
            background: `radial-gradient(${glareRadius}px circle at ${glare.x}% ${glare.y}%, color-mix(in oklab, var(--color-primary) 22%, transparent), transparent 60%)`,
          }}
        />
      </div>
    </div>
  )
}
