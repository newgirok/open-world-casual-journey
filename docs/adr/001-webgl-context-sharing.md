# ADR 001: Mapbox + Three.js 단일 WebGL 컨텍스트 공유

**상태:** Accepted

## 결정

Mapbox GL JS가 초기화 시 브라우저에서 할당받은 `WebGLRenderingContext`를 Three.js 레이어가 그대로 넘겨받아, **단 하나의 `<canvas>` 안에서 두 엔진이 공존**하도록 렌더링 파이프라인을 구성한다.

## 배경

지도(Mapbox)와 3D 캐릭터(Three.js)를 각자 별도의 `<canvas>`에서 렌더링하면 두 가지 치명적 문제가 발생한다.

1. **VRAM 버퍼 이중 복사**: 두 WebGL 컨텍스트가 각자 GPU 버퍼를 점유하고, 매 프레임마다 서로의 픽셀 데이터를 복사·합성해야 한다. 이 복사 연산이 모바일 GPU에서 병목이 되어 30fps 이하로 떨어진다.
2. **합성 레이어 충돌**: 두 `<canvas>`를 CSS `z-index`로 겹치면 브라우저의 Compositing Layer가 분리되어 GPU 사용률이 2배로 치솟는다.

## 근거

| 항목 | 별도 캔버스 | 컨텍스트 공유 |
|---|---|---|
| VRAM 버퍼 복사 | 매 프레임 | 없음 (제로) |
| 모바일 60fps 달성 | 어렵 (30fps 하락) | 달성 가능 |
| GPU 레이어 수 | 2개 | 1개 |
| 구현 복잡도 | 낮음 | 중간 |

Mapbox GL JS v3는 `map.on('render', ...)` 이후 Three.js의 `renderer.render()`를 같은 GL 컨텍스트로 호출하는 패턴을 공식 지원한다.

## 구현 요점

```typescript
const map = new mapboxgl.Map({ ... });

map.on('style.load', () => {
  const gl = map.painter.context.gl;
  const renderer = new THREE.WebGLRenderer({ context: gl, canvas: map.getCanvas() });
  renderer.autoClear = false;

  map.on('render', () => {
    renderer.state.reset();
    renderer.render(scene, camera);
    map.triggerRepaint();
  });
});
```

## 결과

- 단일 WebGL 컨텍스트 내에서 지도 타일 + 캐릭터 메시를 동시에 렌더링
- 모바일 환경에서 수직 동기화 기반 안정적 60fps 확보
- VRAM 버퍼 복사 연산 제로화

## 관련

- [아키텍처 개요 — 렌더링 파이프라인](../architecture/overview.md)
- [ADR 007 — 쿼터뷰 카메라 잠금](./007-quarter-view-camera-lock.md)
