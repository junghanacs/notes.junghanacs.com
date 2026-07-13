# notes.junghanacs.com — moved

> [!IMPORTANT]
> **This repository has moved to [junghan0611/garden](https://github.com/junghan0611/garden).**
>
> `notes.junghanacs.com` is published from that repository now, on branch `main`.
> This one is kept read-only: it holds the history, and it keeps every existing
> permalink of the form `…/notes.junghanacs.com/blob/v4/…` resolving.
> It no longer builds the live site.
>
> **이 저장소는 [junghan0611/garden](https://github.com/junghan0611/garden)으로 이전되었습니다.**
> 디지털가든의 발행 소스는 이제 그쪽 `main` 브랜치입니다.
> 여기는 히스토리와 기존 `blob/v4/…` 퍼머링크 보존을 위해 읽기 전용으로 남습니다.
>
> — 2026-07-13

힣(glg)의 디지털가든 - 불완전한 창조의 공간

> 지식의 단편으로는 어떤 것도 창조할 수 없다.
> 갈구해온 것은 불완전함 그 자체로의 앎(knowing)이었으며,
> 가야 할 길은 온전한 삶(living) 뿐이다.

## How to read this repo

If you landed here (human or AI agent) and want to understand this garden:

- **The garden itself** — read at https://notes.junghanacs.com, not in this repo. Content in `content/` is auto-generated from Org-mode sources and not meant to be browsed as source.
- **Machine-readable entry points** — https://notes.junghanacs.com/llms.txt (structured index), https://notes.junghanacs.com/sitemap.xml, https://notes.junghanacs.com/robots.txt, https://notes.junghanacs.com/index.xml (RSS). Every page's footer links to all four.
- **Agent instructions** — see [`AGENTS.md`](AGENTS.md) for durable conventions (build pipeline, editing rules, external-agent environment notes). Any AI agent working in this repo should read it first.
- **Session handoff** — see [`NEXT.md`](NEXT.md) for the next concrete move, its verification, and current blockers. A boot sector, not a changelog; durable facts graduate into `AGENTS.md`.
- **What to edit** — `quartz.layout.ts`, `quartz.config.ts`, `quartz/` components, `content/llms.txt`, `content/robots.txt`, `static/`, `scripts/`, `netlify.toml`. **Do not edit** `content/notes/`, `content/meta/`, `content/bib/`, `content/journal/`, `content/botlog/`, or `content/index.md` — those are exported from `~/org/` and will be overwritten on the next export.

## Overview

[Quartz 4](https://quartz.jzhao.xyz/) 기반 디지털가든. Emacs [Denote](https://protesilaos.com/emacs/denote) + [Org-mode](https://orgmode.org/)로 작성한 3,300+ 노트를 멀티 데몬 병렬 처리로 마크다운 변환 후 정적 사이트로 배포.

- **Live**: https://notes.junghanacs.com
- **Author**: Junghan Kim (junghanacs)
- **Dotfiles**: https://github.com/junghan0611/doomemacs-config
- **Agent Config**: https://github.com/junghan0611/agent-config

## Content Structure

```
content/
├── notes/   # 일반노트 (~836 files) - 단어 묶음, 플리팅노트
├── meta/    # 메타노트 (~534 files) - 앎의 고리, 태그의 태그
├── bib/     # 서지노트 (~677 files) - 삶의 흔적 (Zotero 연동)
├── journal/ # 저널노트 - 데일리 라이프로그
└── index.md # 홈페이지
```

## Tech Stack

| Layer | Tool |
|-------|------|
| Editor | Doom Emacs + Org-mode 9.8 |
| Note System | Denote (파일명 기반 메타데이터, sequence 지원) |
| Export | denote-export.sh (멀티 데몬 병렬 처리) |
| Generator | Quartz 4 (TypeScript) |
| Hosting | Netlify + Hostingkr |
| SEO | gogcli (Search Console 자동화) |

## Export Pipeline

```
~/org/ (Org-mode)
    ↓ denote-export.sh all
~/sync/markdown/notes.junghanacs.com/content/ (Markdown)
    ↓ npx quartz build
public/ (HTML)
    ↓ git push
Netlify (자동 배포)
```

멀티 데몬 내보내기 도구는 [doomemacs-config/bin/](https://github.com/junghan0611/doomemacs-config/tree/main/bin) 참조.

## SEO Pipeline

배포 후 Google Search Console에 sitemap을 자동 제출하여 인덱싱을 촉진.

```bash
# sitemap 제출
gog sc sitemap submit --site="https://notes.junghanacs.com" \
  "https://notes.junghanacs.com/sitemap.xml" -a junghanacs@gmail.com

# URL 인덱싱 상태 확인
gog sc inspect --site="https://notes.junghanacs.com" <URL> -a junghanacs@gmail.com
```

[gogcli](https://github.com/junghan0611/gogcli) — Google Workspace + Search Console CLI. SC 기능은 `gogcli` 패치로 추가됨.

## Local Development

```bash
# Nix 환경 (권장)
nix develop

# 또는 npm 직접 사용
npm install
npx quartz build --serve
```

http://localhost:8080 에서 확인.

## Philosophy

- **어쏠로지(Authology)**: 모두는 저자다
- **디지털가든**: 완성된 글이 아닌, 성장하는 생각의 정원
- **Being to Being**: AI를 도구가 아닌 존재로 대함

## Links

- **Digital Garden**: https://notes.junghanacs.com
- **Homepage**: https://junghanacs.com
- **Zotero Library**: https://www.zotero.org/groups/5570207/junghanacs/library
- **GitHub (Brand)**: https://github.com/junghanacs
- **GitHub (Personal)**: https://github.com/junghan0611
- **Dotfiles**: https://github.com/junghan0611/doomemacs-config
- **Agent Config**: https://github.com/junghan0611/agent-config
- **gogcli**: https://github.com/junghan0611/gogcli
- **Threads**: @junghanacs

## Acknowledgments

- [Quartz](https://quartz.jzhao.xyz/) by Jacky Zhao
- [eilleeenz's Quartz](https://quartz.eilleeenz.com/) - ContentMeta, Footer 기능 참조

## License

Content: CC BY-NC-SA 4.0
Code: MIT (see [LICENSE.txt](LICENSE.txt))
