# 환경변수 레퍼런스

`.env.example` 기준 전체 환경변수 목록.

---

## Supabase

| 변수 | 필수 | 설명 |
|---|---|---|
| `NEXT_PUBLIC_SUPABASE_URL` | 필수 | Supabase 프로젝트 URL (로컬: `http://localhost:54321`) |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | 필수 | Supabase Anon 공개 키 |
| `SUPABASE_SERVICE_ROLE_KEY` | 필수 (서버 전용) | Edge Functions 내부 DB 접근용 (절대 클라이언트에 노출 금지) |

---

## Mapbox

| 변수 | 필수 | 설명 |
|---|---|---|
| `NEXT_PUBLIC_MAPBOX_TOKEN` | 필수 | Mapbox GL JS 공개 토큰. 도메인 락 필수 (프로덕션) |

---

## LiveKit

| 변수 | 필수 | 설명 |
|---|---|---|
| `LIVEKIT_API_KEY` | 필수 | LiveKit Cloud API Key (서버 전용) |
| `LIVEKIT_API_SECRET` | 필수 | LiveKit Cloud API Secret (서버 전용, Git 커밋 금지) |
| `NEXT_PUBLIC_LIVEKIT_URL` | 필수 | LiveKit 서버 WebSocket URL (`wss://...livekit.cloud`) |

---

## 결제 (PG)

| 변수 | 필수 | 설명 |
|---|---|---|
| `TOSS_CLIENT_KEY` | 선택 | 토스페이먼츠 클라이언트 키 |
| `TOSS_SECRET_KEY` | 선택 | 토스페이먼츠 시크릿 키 (서버 전용, Git 커밋 금지) |
| `KAKAO_PAY_CID` | 선택 | 카카오페이 가맹점 코드 |
| `KAKAO_PAY_SECRET` | 선택 | 카카오페이 어드민 키 (서버 전용, Git 커밋 금지) |

---

## AI (아바타 외형 생성)

| 변수 | 필수 | 설명 |
|---|---|---|
| `AI_API_KEY` | 선택 | 생성형 AI 아바타 외형 조합 API 키 |
| `AI_API_URL` | 선택 | 생성형 AI 엔드포인트 URL |

---

## 앱 설정

| 변수 | 필수 | 설명 |
|---|---|---|
| `NEXT_PUBLIC_APP_URL` | 필수 | 서비스 도메인 (로컬: `http://localhost:3000`) |
| `NODE_ENV` | 자동 | `development` / `production` |

---

## 보안 주의사항

- `_SECRET_`, `_KEY` 접미사 변수는 `.gitignore`에 포함된 `.env.local`에만 저장
- 프로덕션 시크릿은 Supabase Secrets Manager 또는 Vercel Environment Variables에서 관리
- `NEXT_PUBLIC_` 접두사 변수는 브라우저에 노출되므로 시크릿 값 절대 사용 금지

---

## 관련 문서

- [로컬 환경 세팅](./local-setup.md)
- [API 키 설정](./api-keys.md)
- [보안 규격](../backend/security/encryption.md)
