# 배포 절차

클라우드 인프라가 아직 구축되지 않은 경우 [클라우드 인프라 초기 셋업](../../onboarding/infra-setup.md)을 먼저 완료하라.

---

## 배포 구성

| 컴포넌트 | 호스팅 | 트리거 |
|---|---|---|
| Next.js 프론트엔드 | Vercel | main 브랜치 push 시 자동 |
| Supabase Edge Functions | Supabase Cloud | `supabase functions deploy` |
| DB 마이그레이션 | Supabase Cloud | `supabase db push --linked` |

---

## 1. 사전 준비

```bash
# Supabase CLI로 프로덕션 프로젝트에 연결
supabase link --project-ref <project-ref>

# 연결 확인
supabase status
```

---

## 2. DB 마이그레이션 배포

```bash
# 로컬 마이그레이션을 프로덕션 DB에 적용
supabase db push --linked
```

**주의**: 프로덕션 DB에 직접 영향을 준다. 반드시 로컬에서 `supabase db push`로 사전 검증 후 실행하라.

롤백이 필요한 경우 이전 마이그레이션의 역연산 SQL을 새 마이그레이션 파일로 작성하여 적용한다.

---

## 3. Edge Functions 배포

```bash
# 개별 배포
supabase functions deploy payment-webhook
supabase functions deploy spatial-query
supabase functions deploy livekit-token
supabase functions deploy impression-log

# 전체 배포
supabase functions deploy
```

---

## 4. Supabase Secrets 갱신

시크릿 값이 변경된 경우에만 재등록한다.

```bash
supabase secrets set TOSS_SECRET_KEY=...
supabase secrets set KAKAO_PAY_SECRET=...
supabase secrets set LIVEKIT_API_KEY=...
supabase secrets set LIVEKIT_API_SECRET=...
```

---

## 5. 프론트엔드 배포 (Vercel)

Vercel과 GitHub 저장소가 연결되어 있으면 `main` 브랜치 push 시 자동 배포된다.

수동 배포가 필요한 경우:

```bash
npm install -g vercel
vercel --prod
```

Vercel 대시보드 → "Environment Variables"에서 `NEXT_PUBLIC_*` 변수들이 설정되었는지 확인한다.

---

## 6. 배포 후 검증 체크리스트

- [ ] Supabase DB 응답 정상 (Studio 접속 확인)
- [ ] Edge Functions 배포 상태 정상 (`supabase functions list`)
- [ ] Vercel 빌드 성공 (Vercel 대시보드 "Deployments")
- [ ] Mapbox 토큰 도메인 락 설정 (프로덕션 도메인만 허용)
- [ ] LiveKit API 키 유효성 확인 (음성 연결 테스트)
- [ ] 결제 웹훅 URL이 프로덕션 Edge Function URL로 등록됨 (PG사 대시보드)
- [ ] `orders` 테이블 RLS 정책 적용 확인

---

## 관련 문서

- [클라우드 인프라 초기 셋업](../../onboarding/infra-setup.md)
- [모니터링](../monitoring.md)
- [과금 방어 대응](./billing-guard.md)
- [개발 명령어](../../onboarding/commands.md)
