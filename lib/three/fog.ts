/** Fog of War: CSS radial-gradient vignette 제어 */

const VAR = '--fog-radius'

export function initFog(element: HTMLElement) {
  element.style.setProperty(VAR, '12%')
}

/**
 * @param radiusM  가시거리(미터). 20m = 무료, 최대 500m = 최상위 라이선스
 */
export function setFogRadius(element: HTMLElement, radiusM: number) {
  // 20m → 12%, 500m → 70% 선형 보간
  const pct = 12 + Math.min((radiusM - 20) / 480, 1) * 58
  element.style.setProperty(VAR, `${Math.round(pct)}%`)
}
