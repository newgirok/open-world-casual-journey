# 프론트엔드 개발 컨벤션

---

## Mapbox GL JS 레이어 관리

### 소스·레이어 네이밍 규칙

| 유형 | 패턴 | 예시 |
|---|---|---|
| 소스 | `{domain}-source` | `character-source`, `sponsor-source` |
| 레이어 | `{domain}-{type}-layer` | `sponsor-fill-layer`, `fog-fill-layer` |
| Three.js 커스텀 레이어 | `three-{name}-layer` | `three-character-layer` |

### addLayer 순서

레이어는 반드시 아래 순서대로 추가해야 한다 (z-order 충돌 방지).

1. Mapbox 기본 도로 레이어 (`road-*`) — 수정·삭제 금지
2. `sponsor-fill-layer` — 스폰서 건물 바닥 오버레이
3. `three-character-layer` — Three.js WebGL 커스텀 레이어
4. Fog of War Vignette — DOM 오버레이 (CSS, Mapbox 레이어 아님)

### 레이어 생명주기

- 레이어 추가는 `map.on('load', () => { ... })` 내부에서만 수행
- 컴포넌트 언마운트·페이지 이동 시 `map.remove()` 반드시 호출
- 커스텀 레이어는 `map.addLayer({ id, type: 'custom', render, onAdd })` 형식 준수

---

## Three.js WebGL 컨텍스트 공유 (ADR 001)

### 초기화 규칙

**`lib/map/context.ts`에서만** WebGL 컨텍스트를 초기화한다. 다른 파일에서 직접 `THREE.WebGLRenderer`를 인스턴스화 금지.

```typescript
// lib/map/context.ts — 단일 진입점
const gl = map.painter.context.gl;          // Mapbox 컨텍스트 추출
const renderer = new THREE.WebGLRenderer({
  canvas: map.getCanvas(),
  context: gl,
  antialias: true,
});
renderer.autoClear = false;                  // Mapbox가 clear 직접 제어
```

### 렌더 루프 규칙

- `map.on('render', () => { renderer.state.reset(); renderer.render(scene, camera); })` 훅에서만 렌더
- `requestAnimationFrame`을 Three.js 측에서 직접 호출 금지 (Mapbox 렌더 루프와 충돌)
- 매 프레임 `renderer.state.reset()` 호출 필수 (Mapbox WebGL 상태 복원)

### 오브젝트 생명주기

- 씬에서 제거할 때 반드시 `geometry.dispose()` + `material.dispose()` 쌍으로 호출
- `lib/three/prune.ts`의 `pruneObjects()` 를 통해서만 배치 해제 수행 (직접 dispose 호출 금지)
- GLB 로더는 `lib/three/character.ts` 에서만 인스턴스화 (중복 생성 금지)

---

## Next.js App Router 라우트 그룹

### 그룹 설계 의도

| 그룹 | 경로 | 목적 | 인증 |
|---|---|---|---|
| `(game)` | `/world` | 인게임 캔버스, Mapbox 초기화 | 필수 |
| `(auth)` | `/login`, `/verify` | OAuth 로그인·본인인증 | 비인증 진입점 |
| `store` | `/store` | 아바타·라이선스 구매 | 필수 |
| `admin` | `/admin/*` | B2B 광고주 포탈 | 필수 + `role: advertiser` |

### 미들웨어 인증 규칙 (`middleware.ts`)

- `(game)`, `store`, `admin` 경로는 JWT 유효성 검사 후 진입
- 미인증 요청은 `/login` 으로 리다이렉트
- 광고주 Role 검사(`role: 'advertiser'`)는 `admin/` 경로에서만 수행
- 인증 로직은 `lib/auth/middleware.ts` 에서 공유

### `app/api/` vs Supabase Edge Functions 경계

`app/api/` Route Handler는 **헬스체크 전용**. 비즈니스 로직은 Supabase Edge Functions에서 처리한다.

| 위치 | 허용 용도 |
|---|---|
| `app/api/health/` | 헬스체크 |
| `supabase/functions/payment-webhook/` | PG 웹훅 수신·캐릭터 발급 |
| `supabase/functions/spatial-query/` | 반경 내 스폰서 건물 탐지 |
| `supabase/functions/livekit-token/` | LiveKit 룸 토큰 발급 |
| `supabase/functions/impression-log/` | 유효 노출 기록 |

`app/api/` 에 결제·공간·음성 엔드포인트 추가 금지.

---

## React 상태 관리

### 상태 분류 원칙

| 유형 | 위치 | 예시 |
|---|---|---|
| 인증 세션 | Supabase Auth SDK (자체 관리) | 유저 ID, Access Token |
| 지도·타 유저 위치 | Supabase Realtime 채널 직접 소비 | 실시간 좌표 |
| 가시거리 등급 | JWT Payload 파싱 (`visibility_radius_m`) | 100m, 300m |
| 일시적 UI 상태 | `useState` / `useReducer` | 모달 열림, 로딩 |

### 금지 패턴

- 위치 좌표를 React state에 저장 금지 → Realtime 채널에서 직접 소비
- Supabase 세션을 `localStorage`에 직접 저장 금지 → SDK가 httpOnly 쿠키로 관리
- 전역 상태 라이브러리(Redux, Zustand 등) 도입은 팀 합의 후 진행

---

## 컴포넌트 구조

### 디렉토리

```
components/
├── hud/          ← 인게임 HUD (방향키, 조이스틱, 채팅 입력창)
├── avatar/       ← 아바타 선택·미리보기 카드
├── store/        ← 결제 모달, 상품 카드
└── ui/           ← 공통 UI (버튼, 카드, 토스트)
```

### 캔버스·DOM 이벤트 규칙

- HUD 컴포넌트는 Mapbox 캔버스 위 `pointer-events: none` 영역에 렌더
- HUD 내부 클릭 가능 요소는 `pointer-events: auto` + `stopPropagation()` 처리
- 3D 캔버스에 `click`/`touchstart` 리스너 직접 바인딩 금지 (백엔드 컨벤션 프론트엔드 하네스)

---

## 관련 문서

- [ADR 001 — WebGL 컨텍스트 공유](../adr/001-webgl-context-sharing.md)
- [ADR 007 — 쿼터뷰 카메라 잠금](../adr/007-quarter-view-camera-lock.md)
- [백엔드 컨벤션 — 4대 하네스](../backend/conventions.md)
- [보안 규격 — JWT 가시거리 인코딩](../backend/security/encryption.md)
- [프로젝트 구조](../architecture/project-structure.md)
