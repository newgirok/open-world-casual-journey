import { type ButtonHTMLAttributes } from 'react'

type Variant = 'primary' | 'secondary' | 'ghost'

interface Props extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: Variant
}

const variantStyles: Record<Variant, React.CSSProperties> = {
  primary: { background: '#4f8ef7', color: '#fff', border: 'none' },
  secondary: { background: 'transparent', color: '#4f8ef7', border: '1px solid #4f8ef7' },
  ghost: { background: 'transparent', color: '#fff', border: 'none' },
}

export function Button({ variant = 'primary', style, children, ...props }: Props) {
  return (
    <button
      {...props}
      style={{
        padding: '10px 20px',
        borderRadius: 8,
        fontSize: 14,
        fontWeight: 600,
        cursor: 'pointer',
        transition: 'opacity 0.15s',
        display: 'inline-flex',
        alignItems: 'center',
        justifyContent: 'center',
        gap: 8,
        ...variantStyles[variant],
        ...style,
      }}
    >
      {children}
    </button>
  )
}
