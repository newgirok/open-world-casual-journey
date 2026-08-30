'use client'

type Type = 'success' | 'error' | 'info'

interface Props {
  message: string
  type?: Type
  visible: boolean
}

const typeColors: Record<Type, string> = {
  success: '#22c55e',
  error: '#ef4444',
  info: '#4f8ef7',
}

export function Toast({ message, type = 'info', visible }: Props) {
  return (
    <div
      role="status"
      aria-live="polite"
      style={{
        position: 'fixed',
        top: 24,
        left: '50%',
        transform: 'translateX(-50%)',
        padding: '12px 24px',
        borderRadius: 8,
        color: '#fff',
        fontSize: 14,
        fontWeight: 600,
        background: typeColors[type],
        transition: 'opacity 0.2s',
        opacity: visible ? 1 : 0,
        pointerEvents: 'none',
        zIndex: 9999,
        whiteSpace: 'nowrap',
      }}
    >
      {message}
    </div>
  )
}
