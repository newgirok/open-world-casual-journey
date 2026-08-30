# API 키 설정 가이드

---

## Mapbox

1. https://account.mapbox.com 접속 → 계정 생성
2. "Tokens" 탭 → "Create a token"
3. **로컬 개발용**: 제한 없이 생성 후 `.env.local`에 저장
4. **프로덕션용**: "Allowed URLs" 에 서비스 도메인만 등록 (도메인 락 필수)

```
NEXT_PUBLIC_MAPBOX_TOKEN=pk.eyJ1...
```

무료 티어: 월 50,000 Map loads 무료. Mapbox 대시보드에서 사용량 알림 3단계 설정 권장.

---

## Supabase

1. https://supabase.com → "New project" 생성
2. "Project Settings" → "API" 탭 → **Publishable key / Secret key** 섹션 확인
   - Supabase는 레거시 JWT 포맷 대신 `sb_publishable_*` / `sb_secret_*` 포맷의 새 API 키를 발급한다.

```
NEXT_PUBLIC_SUPABASE_URL=https://xxxx.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=sb_publishable_xxxx    ← 공개 가능 (Publishable key)
SUPABASE_SERVICE_ROLE_KEY=sb_secret_xxxx             ← 서버 전용, 절대 노출 금지 (Secret key)
```

- **Project Reference ID**: `Settings → General → Project ID` — `supabase link --project-ref <id>` 에 사용
- Secret key는 생성 직후에만 전체 값이 표시되므로 즉시 복사해 `.env.local`과 Supabase Secrets에 저장할 것

---

## LiveKit Cloud

1. https://cloud.livekit.io 접속 → 프로젝트 생성
2. "Settings" → "Keys" 탭

```
LIVEKIT_API_KEY=APIxxxx
LIVEKIT_API_SECRET=xxxx        ← 서버 전용
NEXT_PUBLIC_LIVEKIT_URL=wss://your-project.livekit.cloud
```

무료 티어: 월 일정 분(分) 무료. 대시보드 사용량 알림 3단계 설정 권장.

---

## 토스페이먼츠

1. https://developers.tosspayments.com → 개발자 계정 등록
2. "개발 테스트" 환경의 클라이언트 키와 시크릿 키 사용 (로컬)
3. 프로덕션 전환 시 사업자 심사 후 운영 키 발급

```
TOSS_CLIENT_KEY=test_ck_...    ← 클라이언트 (테스트)
TOSS_SECRET_KEY=test_sk_...    ← 서버 전용 (테스트)
```

---

## 카카오페이

1. https://developers.kakao.com → 앱 등록
2. 카카오페이 API 사용 설정 → CID(가맹점 코드) 발급

```
KAKAO_PAY_CID=TC0ONETIME      ← 테스트용 고정값
KAKAO_PAY_SECRET=...           ← 서버 전용
```

---

## 관련 문서

- [환경변수 레퍼런스](./env-vars.md)
- [모니터링 — 과금 알림](../operations/monitoring.md)
