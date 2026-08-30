import { type HTMLAttributes } from 'react'

interface Props extends HTMLAttributes<HTMLDivElement> {
  padding?: number
}

export function Card({ padding = 24, style, ...props }: Props) {
  return (
    <div
      {...props}
      style={{
        background: '#1e1e2e',
        borderRadius: 12,
        padding,
        boxShadow: '0 4px 24px rgba(0,0,0,0.3)',
        ...style,
      }}
    />
  )
}
