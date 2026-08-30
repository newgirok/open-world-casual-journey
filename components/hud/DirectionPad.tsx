'use client'

type Props = { onMove: (dx: number, dy: number) => void }

const DIRS = [
  { label: '↑', dx: 0, dy: -1, row: 1, col: 2 },
  { label: '←', dx: -1, dy: 0, row: 2, col: 1 },
  { label: '↓', dx: 0, dy: 1, row: 2, col: 2 },
  { label: '→', dx: 1, dy: 0, row: 2, col: 3 },
] as const

export function DirectionPad({ onMove }: Props) {
  return (
    <div
      style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(3, 44px)',
        gridTemplateRows: 'repeat(2, 44px)',
        gap: 4,
      }}
    >
      {DIRS.map(({ label, dx, dy, row, col }) => (
        <button
          key={label}
          onPointerDown={() => onMove(dx, dy)}
          onPointerUp={() => onMove(0, 0)}
          style={{
            gridRow: row,
            gridColumn: col,
            background: 'rgba(255,255,255,0.15)',
            backdropFilter: 'blur(4px)',
            border: '1px solid rgba(255,255,255,0.2)',
            borderRadius: 8,
            color: '#fff',
            fontSize: 20,
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            userSelect: 'none',
          }}
        >
          {label}
        </button>
      ))}
    </div>
  )
}
