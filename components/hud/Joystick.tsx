'use client'

import { useRef, useCallback } from 'react'

const RADIUS = 50
const KNOB_RADIUS = 20

type Props = { onMove: (x: number, y: number) => void }

export function Joystick({ onMove }: Props) {
  const baseRef = useRef<HTMLDivElement>(null)
  const knobRef = useRef<HTMLDivElement>(null)
  const touchId = useRef<number | null>(null)

  const computeOffset = useCallback((touch: React.Touch) => {
    const rect = baseRef.current!.getBoundingClientRect()
    const cx = rect.left + rect.width / 2
    const cy = rect.top + rect.height / 2
    const dx = touch.clientX - cx
    const dy = touch.clientY - cy
    const len = Math.sqrt(dx * dx + dy * dy) || 1
    const clamped = Math.min(len, RADIUS)
    return {
      x: (dx / len) * clamped,
      y: (dy / len) * clamped,
      nx: dx / len,
      ny: dy / len,
    }
  }, [])

  const onTouchStart = useCallback((e: React.TouchEvent) => {
    if (touchId.current !== null) return
    touchId.current = e.changedTouches[0].identifier
  }, [])

  const onTouchMove = useCallback(
    (e: React.TouchEvent) => {
      const touch = Array.from(e.changedTouches).find(
        (t) => t.identifier === touchId.current,
      )
      if (!touch || !knobRef.current) return
      const { x, y, nx, ny } = computeOffset(touch)
      knobRef.current.style.transform = `translate(${x}px, ${y}px)`
      onMove(nx, ny)
    },
    [computeOffset, onMove],
  )

  const onTouchEnd = useCallback(
    (e: React.TouchEvent) => {
      const touch = Array.from(e.changedTouches).find(
        (t) => t.identifier === touchId.current,
      )
      if (!touch) return
      touchId.current = null
      if (knobRef.current) knobRef.current.style.transform = 'translate(0px, 0px)'
      onMove(0, 0)
    },
    [onMove],
  )

  return (
    <div
      ref={baseRef}
      onTouchStart={onTouchStart}
      onTouchMove={onTouchMove}
      onTouchEnd={onTouchEnd}
      style={{
        width: RADIUS * 2,
        height: RADIUS * 2,
        borderRadius: '50%',
        background: 'rgba(255,255,255,0.15)',
        backdropFilter: 'blur(4px)',
        border: '1px solid rgba(255,255,255,0.2)',
        position: 'relative',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        touchAction: 'none',
      }}
    >
      <div
        ref={knobRef}
        style={{
          width: KNOB_RADIUS * 2,
          height: KNOB_RADIUS * 2,
          borderRadius: '50%',
          background: 'rgba(255,255,255,0.6)',
          pointerEvents: 'none',
          transition: 'transform 0.05s ease-out',
        }}
      />
    </div>
  )
}
