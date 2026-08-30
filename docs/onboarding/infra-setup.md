# 클라우드 인프라 초기 셋업

Phase 0에서 1회 실행하는 클라우드 서비스 초기 설정 절차.

---

## 1. Supabase Cloud 프로젝트 생성

1. [supabase.com](https://supabase.com) → "New project"
2. Organization 선택 (없으면 생성)
3. 프로젝트 이름, DB 비밀번호 설정
4. 지역: **ap-northeast-1 (서울)** 선택
5. Plan: **Free tier**로 시작 → Phase 6 직전 **Pro ($25/월)** 업그레이드
6. "Create new project" → 완료 대기 (~2분)

### Reference ID 확인

```
Settings → General → Reference ID
예: abcdefghijklmnop
```

`supabase link --project-ref <reference-id>` 명령에 사용한다.

### API 키 확인

```
Settings → API → Project URL / anon key / service_role key
```

→ `.env.local`의 `NEXT_PUBLIC_SUPABASE_URL`, `NEXT_PUBLIC_SUPABASE_ANON_KEY`, `SUPABASE_SERVICE_ROLE_KEY`에 등록.

---

## 2. Vercel 프로젝트 생성

1. [vercel.com](https://vercel.com) → "Add New Project"
2. GitHub 저장소 Import
3. Framework Preset: **Next.js** (자동 감지)
4. Root Directory: `.` (루트)
5. Environment Variables 등록 (클라이언트 공개 변수만):

| 변수 | 값 출처 |
|---|---|
| `NEXT_PUBLIC_SUPABASE_URL` | Supabase Settings → API |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Supabase Settings → API |
| `NEXT_PUBLIC_MAPBOX_TOKEN` | Mapbox account.mapbox.com → Tokens |
| `NEXT_PUBLIC_LIVEKIT_URL` | LiveKit Settings → Keys |
| `NEXT_PUBLIC_APP_URL` | Vercel 배포 후 생성되는 도메인 |

서버 전용 시크릿(`SUPABASE_SERVICE_ROLE_KEY`, `LIVEKIT_API_KEY`, `LIVEKIT_API_SECRET`, `TOSS_SECRET_KEY`, `KAKAO_PAY_SECRET`)은 **Supabase Secrets**에서 관리하며 Vercel에 등록하지 않는다.

6. "Deploy" → 첫 빌드 실행

---

## 3. LiveKit Cloud 프로젝트 생성

1. [cloud.livekit.io](https://cloud.livekit.io) → "Create a project"
2. 프로젝트 이름 설정
3. 지역: **ap-northeast** (한국 최근접)
4. "Settings" → "Keys" → API Key + API Secret 발급
5. WebSocket URL 확인: `wss://your-project.livekit.cloud`

→ 세 값 모두 `.env.local`에 등록. Edge Functions에서 사용하는 `LIVEKIT_API_KEY`, `LIVEKIT_API_SECRET`은 Supabase Secrets에도 등록.

---

## 4. Supabase CLI 프로젝트 연결

```bash
supabase link --project-ref <reference-id>
```

연결 확인:

```bash
supabase status
```

---

## 5. Supabase Secrets 등록

Edge Functions에서 참조하는 서버 전용 시크릿을 등록한다.

```bash
supabase secrets set SUPABASE_SERVICE_ROLE_KEY=...
supabase secrets set LIVEKIT_API_KEY=...
supabase secrets set LIVEKIT_API_SECRET=...
supabase secrets set TOSS_SECRET_KEY=...
supabase secrets set KAKAO_PAY_SECRET=...
```

---

## 완료 체크리스트

- [ ] Supabase Cloud 프로젝트 생성 (지역: ap-northeast-1)
- [ ] Vercel 프로젝트 생성 + GitHub 연결 + 클라이언트 환경변수 등록
- [ ] LiveKit Cloud 프로젝트 생성 (지역: ap-northeast)
- [ ] `.env.local` 전체 항목 채움
- [ ] `supabase link` 연결 확인
- [ ] Supabase Secrets 등록 완료

---

## 관련 문서

- [API 키 설정](./api-keys.md)
- [환경변수 레퍼런스](./env-vars.md)
- [배포 절차](../operations/runbook/deploy.md)
