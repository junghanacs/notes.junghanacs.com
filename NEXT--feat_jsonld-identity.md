# NEXT — feat/jsonld-identity

JSON-LD 구조화 데이터로 "LLM이 인용하는 Person 엔티티"를 세우는 작업.
출처: hada.io/topic?id=30729 (개인 사이트 JSON-LD @graph / Person.sameAs / LLM 인용).
대상 파일: **`quartz/components/Head.tsx`** (이 한 파일만 손댐).

> ⚠️ 이 브랜치는 **publish 안 함**. v4 머지/배포 금지. 공개 표면이라 검증 더 필요.
> ⚠️ **개인 공개면.** 회사명·고용주·기기 hostname 등 사적·직장 식별자는 일절 안 넣음. 공개 신원 연결은 **LinkedIn까지**(sameAs 5개)가 상한. worksFor/affiliation 추가 제안 금지.
> ⚠️ 공개 repo(`junghanacs/*`)라 글로벌 git hook이 사적 identity term(회사명·기기명 등)을 막음 → 의도된 공개 신원(LinkedIn·GLG)은 통과. `--no-verify`/`AGENT_ALLOW_UNSAFE_COMMIT` 쓰지 말 것.

## NOW — 노트북에서 이어서 할 것

### A. 정한님 결정 4개 (답 나오면 Head.tsx에 바로 반영)
1. **프로필 사진 URL** → `Person.image` + `ProfilePage.primaryImageOfPage`. (site icon은 뇌 이모지라 부적합 — 얼굴 사진 필요)
2. **ORCID** 있나? → `sameAs`에 추가. bib 8,208건 보유자라 학술 disambiguation 효과 큼.
3. **bio 언어** — 현재 영어. 한글/이중 원하면 교체. (`Person.description`)
4. **knowsAbout 14개** 유지 vs 핵심 8개로 축소. (현재: Emacs·Org-mode·Denote·PKM·Digital Gardens·NixOS·AI agents·LLM·Clojure·Python·Philosophy·Syntopical Reading·Korean·Logic — 실제 태그 빈도 기반)

> 결정완료: **worksFor/고용주/회사명 = 넣지 않음** (개인 공개면, sameAs는 LinkedIn까지).

### B. org export 쪽 핸드오프 (소스 수정 필요 — 코드만으론 못 함)
1. **`#+reference:` 인용키 → frontmatter `refs[]`** ← 최대 레버.
   - bib/ 679개 노트가 지금은 일반 블로그글과 동일 구조. 인용키가 export MD frontmatter에 없음.
   - `refs: ["key1","key2"]`로 내보내면 → 그 679개에 schema.org `citation` 노드 추가 가능 → "원전 X·Y를 직접 다룸" 학술 인용 신호.
2. **홈 `description` frontmatter** ← SEO 즉효.
   - 현재 홈 구글 스니펫 = "AI visitors: start here." (index.md에 `description:` 없어 본문 첫 문장이 끌려옴).
   - `content/index.md`에 1~2문장 프로필/사이트 소개 추가 → ProfilePage.description + 홈 스니펫 + og:description 동시 개선.

### C. 코드로 추가 가능한 옵션 (미적용 — GLG 승인 대기)
- `articleSection` = 폴더(notes·meta·bib)에서 도출. export 불필요, Head.tsx에서 가능.

## DONE — 이번 세션에서 적용+빌드검증 완료 (이 브랜치 커밋)
`Head.tsx` JSON-LD를 단일 노드 → `@graph`로 리팩터. 전수 검증 2,235 페이지 파싱 실패 0, Person 노드 byte-identical.
- Person: `@id` `#person`, name/given/family, **alternateName [GLG,GLGMAN]**, jobTitle, description(bio), knowsLanguage [ko,en], **knowsAbout 14**, **sameAs 5** (github/junghanacs=정본, github/junghan0611=개발, LinkedIn `kr.linkedin.com/in/junghan-kim-1489a4306`, bsky, fosstodon).
- WebSite: `@id` `#website`, name **"junghanacs digital garden"** (이모지 제거, UI는 `junghanacs🧠` 유지), inLanguage ko-KR, description, publisher→#person.
- ProfilePage(홈만): about/mainEntity→#person, dateCreated/dateModified.
- BlogPosting(글): Article→BlogPosting, author/publisher→#person, **keywords**(frontmatter 태그), isPartOf→#website.
- og:type: 홈만 `website`, 글은 `article` (기존 하드코딩 버그 수정).
- **license 필드 의도적 제외** — `LICENSE.txt`는 Quartz(jackyzha0) MIT라 콘텐츠 라이선스 아님. CC 계열 콘텐츠 라이선스 정하기 전엔 넣지 말 것 (무단 재사용 역신호).

## VERIFY — 노트북에서 재검증하는 법
```bash
npx quartz build          # ~30s, 2,237 files
cd public
# 홈 + 글 JSON-LD pretty 출력
node -e 'const fs=require("fs");const ex=f=>fs.readFileSync(f,"utf8").match(/ld\+json">([\s\S]*?)<\/script>/)[1];console.log(JSON.stringify(JSON.parse(ex("index.html")),null,1))'
# 전수: 파싱 실패 0 / Person 노드 일관성 확인 (스크립트는 세션 로그 참조)
```
배포 후 외부 확정: validator.schema.org / Google Rich Results Test에 실제 URL 넣기 (로컬 JSON 유효 ≠ 구글 승인).
sameAs 역링크(reciprocity) 확인: 링크된 프로필들이 notes.junghanacs.com을 되걸어야 disambiguation 효과. junghan0611은 rel=me엔 없고 sameAs에만 있음(비대칭).

## WHERE
- `quartz/components/Head.tsx` — JSON-LD IIFE 블록(파일 하단 head 내부) + og:type 한 줄.
- 결정 데이터 근거: 태그 빈도 `grep -rhoP '^tags:\s*\[\K[^\]]*' content/ | tr ',' '\n' | sed 's/[" ]//g' | sort | uniq -c | sort -rn`.
