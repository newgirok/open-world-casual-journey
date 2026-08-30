'use client'

import { Hud } from '@/components/hud'

export default function WorldPage() {
  return (
    <div style={{ position: 'relative', width: '100vw', height: '100vh', background: '#1a1a2e', overflow: 'hidden' }}>
      {/* Phase 2에서 Mapbox + Three.js 캔버스 마운트 */}
      <canvas
        id="world-canvas"
        style={{ position: 'absolute', inset: 0, width: '100%', height: '100%' }}
      />
      <Hud />
    </div>
  )
}
