'use client'

import { useState } from 'react'

type Props = { onSend: (message: string) => void }

export function ChatInput({ onSend }: Props) {
  const [value, setValue] = useState('')

  const submit = () => {
    const trimmed = value.trim()
    if (!trimmed) return
    onSend(trimmed)
    setValue('')
  }

  return (
    <div style={{ display: 'flex', gap: 8 }}>
      <input
        value={value}
        onChange={(e) => setValue(e.target.value)}
        onKeyDown={(e) => e.key === 'Enter' && submit()}
        placeholder="채팅 입력..."
        style={{
          flex: 1,
          padding: '10px 14px',
          borderRadius: 8,
          border: '1px solid rgba(255,255,255,0.15)',
          background: 'rgba(0,0,0,0.4)',
          backdropFilter: 'blur(8px)',
          color: '#fff',
          fontSize: 14,
          outline: 'none',
        }}
      />
      <button
        onClick={submit}
        style={{
          padding: '10px 16px',
          borderRadius: 8,
          border: '1px solid rgba(255,255,255,0.15)',
          background: 'rgba(0,0,0,0.4)',
          backdropFilter: 'blur(8px)',
          color: '#fff',
          cursor: 'pointer',
          fontSize: 14,
          whiteSpace: 'nowrap',
        }}
      >
        전송
      </button>
    </div>
  )
}
