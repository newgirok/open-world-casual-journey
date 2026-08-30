'use client'

import { useEffect, useState, useCallback } from 'react'
import { DirectionPad } from './DirectionPad'
import { Joystick } from './Joystick'
import { ChatInput } from './ChatInput'

export function Hud() {
  const [isMobile, setIsMobile] = useState(false)

  useEffect(() => {
    const mq = window.matchMedia('(pointer: coarse)')
    setIsMobile(mq.matches)
    const onChange = (e: MediaQueryListEvent) => setIsMobile(e.matches)
    mq.addEventListener('change', onChange)
    return () => mq.removeEventListener('change', onChange)
  }, [])

  const handleMove = useCallback((_x: number, _y: number) => {
    // Phase 2에서 캐릭터 이동 로직 연결
  }, [])

  const handleChat = useCallback((_message: string) => {
    // Phase 2에서 Supabase Realtime 채팅 연결
  }, [])

  return (
    <div style={{ position: 'absolute', inset: 0, pointerEvents: 'none' }}>
      <div style={{ position: 'absolute', bottom: 32, left: 32, pointerEvents: 'all' }}>
        {isMobile ? <Joystick onMove={handleMove} /> : <DirectionPad onMove={handleMove} />}
      </div>
      <div
        style={{
          position: 'absolute',
          bottom: 32,
          left: '50%',
          transform: 'translateX(-50%)',
          width: 320,
          pointerEvents: 'all',
        }}
      >
        <ChatInput onSend={handleChat} />
      </div>
    </div>
  )
}
