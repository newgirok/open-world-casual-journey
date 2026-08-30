# 모니터링

---

## 비용 알림 설정

### Mapbox

Mapbox 대시보드 → "Billing" → "Budget alerts"에서 3단계 알림을 설정합니다.

| 단계 | 임계치 | 조치 |
|---|---|---|
| 경고 | 무료 티어의 50% | 트래픽 패턴 확인 |
| 주의 | 무료 티어의 80% | 가짜 이동 반경 락 강화 검토 |
| 차단 | 무료 티어의 100% | Rate Limit + Billing Hard Cap 즉시 적용 |

무료 티어 초과 원인 주요 용의자:
- 무료 유저의 가짜 이동 반경 1km 락 미작동
- Mapbox 토큰 도용 (도메인 락 미설정)
- GPS 핵/텔레포트 방어 로직 미작동

### Supabase

Supabase 대시보드 → "Settings" → "Billing"에서 사용량 알림 설정.

| 지표 | 임계치 | 조치 |
|---|---|---|
| DB 스토리지 | Pro 8GB 내 80% | 오래된 `ad_impressions` 파티셔닝 검토 |
| Realtime 연결 수 | 500 concurrent | 섹터 이탈 채널 해제 로직 점검 |
| Edge Function 호출 | 월 50만 회 80% | 클라이언트 사이드 캐싱 강화 |

### LiveKit Cloud

LiveKit 콘솔 → "Usage" → "Alerts"에서 3단계 알림 설정.

| 단계 | 조치 |
|---|---|
| 무료 티어 50% | 음성 활성화 유저 분포 확인 |
| 무료 티어 80% | 세션 최대 길이 60분 락 동작 확인 |
| 무료 티어 100% | 음성 기능 일시 제한 또는 유료 전환 |

---

## 헬스체크

| 항목 | 확인 방법 | 주기 |
|---|---|---|
| Supabase DB 응답 | Supabase 대시보드 → "Database" | 일 1회 |
| Edge Functions 에러율 | Supabase 대시보드 → "Functions" → "Logs" | 이상 시 즉시 |
| LiveKit 룸 상태 | LiveKit 콘솔 → "Rooms" | 이상 시 즉시 |
| Mapbox 타일 요청 수 | Mapbox 대시보드 → "Analytics" | 주 1회 |
| Vercel 빌드 상태 | Vercel 대시보드 → "Deployments" | 배포 시마다 |

---

## 에러 모니터링

### 결제 실패 감지

`orders` 테이블에서 `status = 'FAILED'` 레코드를 주기적으로 확인합니다.

```sql
-- 최근 24시간 결제 실패 건
SELECT id, user_id, product_type, amount_krw, fail_reason, created_at
FROM orders
WHERE status = 'FAILED'
  AND created_at > now() - interval '24 hours'
ORDER BY created_at DESC;
```

### 광고 노출 이상 감지

```sql
-- 광고주별 일일 노출 수 집계 (예상치 대비 이상 저조 시 렌더링 로직 점검)
SELECT b.id, b.advertiser_id, COUNT(i.id) AS impressions_today
FROM sponsor_buildings b
LEFT JOIN ad_impressions i ON i.building_id = b.id
  AND i.impressed_at::date = CURRENT_DATE
WHERE b.is_active = true
GROUP BY b.id, b.advertiser_id
ORDER BY impressions_today;
```

---

## 관련 문서

- [과금 방어 대응](./runbook/billing-guard.md)
- [배포 절차](./runbook/deploy.md)
- [API 키 설정](../onboarding/api-keys.md)
