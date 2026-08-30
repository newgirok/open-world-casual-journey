# 과금 방어 대응

API 과금 폭탄 발생 시 원인 진단 및 즉시 차단 절차.

---

## Mapbox 과금 폭탄

### 원인 진단 체크리스트

1. **토큰 도용 의심**: Mapbox 대시보드 → "Analytics" → 비정상적인 요청 패턴(IP, 도메인) 확인
2. **가짜 이동 반경 락 미작동**: 무료 유저가 1km 이상 이동하여 타일 요청 폭증
3. **클라이언트 속도 검증 미작동**: 텔레포트 핵으로 순간 이동하며 원거리 타일 대량 요청
4. **줌 레벨 미고정**: 유저가 줌아웃하여 넓은 지역 타일 요청

### 즉시 조치

```bash
# 1. Mapbox 대시보드에서 Billing Hard Cap 즉시 설정
# Settings → Billing → Budget alerts → Hard Cap 활성화

# 2. 의심 토큰 즉시 Revoke
# Tokens → 해당 토큰 → Revoke

# 3. 새 토큰 발급 + 도메인 락 적용
# Tokens → Create token → Allowed URLs: https://서비스도메인.com
```

---

## Supabase 과금 (Realtime 연결 초과)

### 원인 진단

```sql
-- 현재 활성 Realtime 세션 수 확인
SELECT count(*) FROM supabase_realtime.channels;
```

### 즉시 조치

1. Supabase 대시보드 → "Realtime" → 과부하 채널 강제 종료
2. 클라이언트 섹터 이탈 시 `channel.unsubscribe()` 호출 로직 점검
3. 반경 450m 외곽 Prune 로직에서 채널 해제 포함 여부 확인

---

## LiveKit Cloud 사용량 초과

### 원인 진단

1. LiveKit 콘솔 → "Usage" → 일별 분(分) 소모량 그래프 확인
2. 특정 시간대 급증 패턴 확인 (이벤트·핫스팟 구간 의심)

### 즉시 조치

```typescript
// 세션 최대 길이 강제 적용 (60분 초과 시 disconnect)
const SESSION_MAX_MS = 60 * 60 * 1000;
setTimeout(() => {
  room.disconnect();
}, SESSION_MAX_MS);

// 혼잡도 연동 반경 축소 (Edge Function에서 서버 사이드 파라미터 축소)
// 30m → 15m로 임시 축소하여 구독 총량 완화
```

---

## GPS 핵/텔레포트 방어 발동

### 증상

- 특정 유저의 좌표가 비정상적으로 빠르게 이동
- Mapbox 타일 요청이 특정 유저로부터 폭증

### 즉시 조치

```sql
-- 해당 유저의 3D 맵 렌더링 10분 강제 동결 (DB 플래그)
UPDATE users SET map_frozen_until = now() + interval '10 minutes'
WHERE id = '<user_id>';
```

백엔드 샘플링 검증에서 이상 패턴 감지 시 자동 동결 로직이 작동하는지 확인합니다.

---

## 관련 문서

- [모니터링](../monitoring.md)
- [API 키 설정](../../onboarding/api-keys.md)
- [ADR 007 — 카메라 잠금](../../adr/007-quarter-view-camera-lock.md)
