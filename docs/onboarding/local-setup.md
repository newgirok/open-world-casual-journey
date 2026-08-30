# 로컬 환경 세팅

---

## 사전 요구사항

| 도구 | 버전 | 설치 방법 |
|---|---|---|
| Node.js | 20 LTS | https://nodejs.org |
| Docker Desktop | 최신 | https://docker.com |
| Supabase CLI | 최신 | `npm install -g supabase` |
| Git | 최신 | https://git-scm.com |

---

## 1. 저장소 클론 및 의존성 설치

```bash
git clone <repo-url>
cd project
npm install
```

---

## 2. 환경변수 설정

```bash
cp .env.example .env.local
```

`.env.local` 파일을 열고 각 값을 채운다. 로컬 Supabase 스택의 URL·키는 아래 3단계 완료 후 출력되는 값을 사용한다. 상세 설명은 [환경변수 레퍼런스](./env-vars.md)를 참고하라.

---

## 3. Supabase 로컬 스택 기동

`supabase/config.toml`과 마이그레이션 파일이 저장소에 포함되어 있다. `supabase start`는 Docker를 이용해 PostgreSQL(PostGIS 포함)·Auth·Realtime·Storage·Edge Functions를 한 번에 기동한다.

```bash
supabase start
```

기동 완료 후 다음 URL들이 출력된다:

```
API URL:    http://localhost:54321
GraphQL:    http://localhost:54321/graphql/v1
DB URL:     postgresql://postgres:postgres@localhost:54322/postgres
Studio:     http://localhost:54323
Inbucket:   http://localhost:54324  ← 이메일 인증 Mock
```

출력된 `API URL`과 `anon key`를 `.env.local`에 채워 넣는다.

---

## 4. DB 마이그레이션 적용

```bash
supabase db push
```

`supabase/migrations/` 내 SQL 파일 4개가 순서대로 적용된다. PostGIS 확장, GiST 인덱스, pg_cron 스케줄러가 자동 생성된다.

---

## 5. Edge Functions 로컬 실행

```bash
supabase functions serve
```

로컬에서 Edge Functions를 핫리로드로 실행한다. 결제 웹훅 테스트 시 이 명령 실행 상태를 유지해야 한다.

---

## 6. Next.js 개발 서버 시작

```bash
npm run dev
```

브라우저에서 http://localhost:3000 접속.

---

## 7. Mapbox 로컬 토큰 확인

`.env.local`의 `NEXT_PUBLIC_MAPBOX_TOKEN`이 설정되었는지 확인한다. Mapbox 계정이 없다면 [API 키 설정](./api-keys.md)을 참고하라.

---

## 로컬 Supabase Studio

http://localhost:54323 에서 DB 테이블을 GUI로 확인하고 편집할 수 있다.

---

## 개발 스택 종료

```bash
supabase stop
```

Docker 컨테이너가 중지된다. 데이터는 `supabase/volumes/`에 유지된다.

---

## 관련 문서

- [환경변수 레퍼런스](./env-vars.md)
- [API 키 설정](./api-keys.md)
- [개발 명령어](./commands.md)
