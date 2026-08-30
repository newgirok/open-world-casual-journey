export function Spinner({ size = 24 }: { size?: number }) {
  return (
    <div
      style={{
        width: size,
        height: size,
        borderRadius: '50%',
        border: `2px solid rgba(255,255,255,0.2)`,
        borderTopColor: 'currentColor',
        animation: 'spin 0.6s linear infinite',
        flexShrink: 0,
      }}
    />
  )
}
