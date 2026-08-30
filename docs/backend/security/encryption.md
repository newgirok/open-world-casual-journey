# 보안 규격

---

## JWT 구조 및 가시거리 라이선스 인코딩

### 토큰 이중 구조

| 토큰 | 수명 | 용도 |
|---|---|---|
| Access Token | 15분 | API 인증, DB 조회 없이 서명만 검증 |
| Refresh Token | 14일 | Access Token 만료 시 Supabase Auth에서 갱신 |

Access Token은 자가 검증(Self-Contained)으로, 모든 요청에서 DB를 거치지 않고 서명 검증만으로 인증이 완료된다.

### 가시거리 등급 Stateless 인코딩

가시거리 라이선스 등급은 JWT Payload에 직접 인코딩하여 Stateless 검증한다. 이동할 때마다 DB를 조회하지 않고 토큰 디코딩만으로 가시거리를 즉시 판별한다.

```json
// JWT Payload 예시
{
  "sub": "user-uuid-here",
  "email": "user@example.com",
  "visibility_radius_m": 100,
  "iat": 1720000000,
  "exp": 1720000900
}
```

라이선스 구매 완료 시 Refresh Token으로 토큰을 즉시 재발급하여 새 등급을 반영한다.

---

## 토큰 보안 규칙

- Access Token은 `httpOnly` 쿠키 또는 메모리에만 저장 (localStorage 저장 금지)
- Refresh Token은 Supabase Auth 내장 테이블에서 관리, 클라이언트 직접 접근 불가
- 토큰 만료 또는 변조 감지 시 즉시 세션 파기 후 로그인 화면으로 강제 리다이렉트

---

## RLS (Row Level Security)

Supabase의 RLS 정책으로 유저 간 데이터 접근을 격리한다.

```sql
-- characters: 본인 캐릭터만 조회 가능
CREATE POLICY "own characters only" ON characters
  FOR SELECT USING (auth.uid() = owner_id);

-- orders: 본인 주문만 조회 가능
CREATE POLICY "own orders only" ON orders
  FOR SELECT USING (auth.uid() = user_id);

-- sponsor_buildings: 모든 인증 유저가 읽기 가능 (광고 렌더링 목적)
CREATE POLICY "read active buildings" ON sponsor_buildings
  FOR SELECT USING (is_active = true);
```

---

## Mapbox API 토큰 보안

- 웹 토큰: 허가된 도메인(`https://*.서비스주소.com`)으로만 작동하도록 Allowed URLs 락
- 모바일 토큰: 앱 Bundle ID / Package Name 매칭 제한 (무단 도용 차단)
- 토큰 노출 시: Mapbox 대시보드에서 즉시 Revoke 후 재발급

---

## Supabase Storage 보안

```sql
-- GLB 에셋 버킷: 인증 유저만 읽기 가능, 서버만 쓰기 가능
CREATE POLICY "authenticated read" ON storage.objects
  FOR SELECT TO authenticated USING (bucket_id = 'characters');

-- 광고주 텍스처 버킷: 서비스 롤만 업로드 가능
CREATE POLICY "service write only" ON storage.objects
  FOR INSERT TO service_role USING (bucket_id = 'ad-textures');
```

---

## 결제 보안

- PG 웹훅 수신 시 PG사 IP 화이트리스트 검증 + 서명(HMAC) 검증 필수
- 주문 UUID(멱등성 키) 기반 중복 웹훅 방어
- `SELECT FOR UPDATE` 락으로 동일 `owner_id`의 동시 캐릭터 발급 레이스 컨디션 차단

```typescript
// Race Condition 방어 예시
await db.query('BEGIN');
await db.query('SELECT id FROM orders WHERE id = $1 FOR UPDATE', [orderId]);
// ... 캐릭터 발급 로직
await db.query('COMMIT');
```

---

## 관련 문서

- [개발 컨벤션](../conventions.md)
- [ADR 004 — 결제 구조](../../adr/004-direct-krw-payment.md)
- [비즈니스 규칙 — 결제 규칙](../../product/business-rules.md)
