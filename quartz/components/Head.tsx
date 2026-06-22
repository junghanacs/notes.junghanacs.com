import { i18n } from "../i18n"
import { FullSlug, getFileExtension, joinSegments, pathToRoot } from "../util/path"
import { CSSResourceToStyleElement, JSResourceToScriptElement } from "../util/resources"
import { googleFontHref, googleFontSubsetHref } from "../util/theme"
import { QuartzComponent, QuartzComponentConstructor, QuartzComponentProps } from "./types"
import { unescapeHTML } from "../util/escape"
import { CustomOgImagesEmitterName } from "../plugins/emitters/ogImage"
export default (() => {
  const Head: QuartzComponent = ({
    cfg,
    fileData,
    externalResources,
    ctx,
  }: QuartzComponentProps) => {
    const titleSuffix = cfg.pageTitleSuffix ?? ""
    const title =
      (fileData.frontmatter?.title ?? i18n(cfg.locale).propertyDefaults.title) + titleSuffix
    const description =
      fileData.frontmatter?.socialDescription ??
      fileData.frontmatter?.description ??
      unescapeHTML(fileData.description?.trim() ?? i18n(cfg.locale).propertyDefaults.description)

    const { css, js, additionalHead } = externalResources

    const url = new URL(`https://${cfg.baseUrl ?? "example.com"}`)
    const path = url.pathname as FullSlug
    const baseDir = fileData.slug === "404" ? path : pathToRoot(fileData.slug!)
    const iconPath = joinSegments(baseDir, "static/icon.png")

    // Url of current page
    const socialUrl =
      fileData.slug === "404" ? url.toString() : joinSegments(url.toString(), fileData.slug!)

    const usesCustomOgImage = ctx.cfg.plugins.emitters.some(
      (e) => e.name === CustomOgImagesEmitterName,
    )
    const ogImageDefaultPath = `https://${cfg.baseUrl}/static/og-image.png`

    return (
      <head>
        <title>{title}</title>
        <meta charSet="utf-8" />
        {cfg.theme.cdnCaching && cfg.theme.fontOrigin === "googleFonts" && (
          <>
            <link rel="preconnect" href="https://fonts.googleapis.com" />
            <link rel="preconnect" href="https://fonts.gstatic.com" />
            <link rel="stylesheet" href={googleFontHref(cfg.theme)} />
            {cfg.theme.typography.title && (
              <link rel="stylesheet" href={googleFontSubsetHref(cfg.theme, cfg.pageTitle)} />
            )}
          </>
        )}
        <link rel="preconnect" href="https://cdnjs.cloudflare.com" crossOrigin="anonymous" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <meta name="google-site-verification" content="GiBZQcfsQXZXV7jvSAPYT6zq6ARofIZbSyddRFd8j-I" />
        <meta name="naver-site-verification" content="8d423e4a2420e4370cd8d199712fd84bf4c2967b" />

        <meta property="og:site_name" content={cfg.pageTitle} />
        <meta property="og:title" content={title} />
        <meta property="og:type" content={fileData.slug === "index" ? "website" : "article"} />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content={title} />
        <meta name="twitter:description" content={description} />
        <meta property="og:description" content={description} />
        <meta property="og:image:alt" content={description} />

        {!usesCustomOgImage && (
          <>
            <meta property="og:image" content={ogImageDefaultPath} />
            <meta property="og:image:url" content={ogImageDefaultPath} />
            <meta name="twitter:image" content={ogImageDefaultPath} />
            <meta
              property="og:image:type"
              content={`image/${(getFileExtension(ogImageDefaultPath) ?? ".png").slice(1)}`}
            />
          </>
        )}

        {cfg.baseUrl && (
          <>
            <meta property="twitter:domain" content={cfg.baseUrl}></meta>
            <meta property="og:url" content={socialUrl}></meta>
            <meta property="twitter:url" content={socialUrl}></meta>
          </>
        )}

        <link rel="icon" href={iconPath} />
        {/* IndieWeb: Webmention endpoints */}
        <link rel="webmention" href={`https://webmention.io/${cfg.baseUrl}/webmention`} />
        <link rel="pingback" href={`https://webmention.io/${cfg.baseUrl}/xmlrpc`} />
        {/* IndieWeb: rel="me" for IndieAuth */}
        <link rel="me" href="https://bsky.app/profile/junghanacs.bsky.social" />
        <link rel="me" href="https://fosstodon.org/@junghanacs" />
        <link rel="me" href="https://github.com/junghanacs" />
        <meta name="description" content={description} />
        <meta name="generator" content="Quartz" />

        {/* JSON-LD Structured Data — @graph: 안정 @id로 Person/WebSite를 전 페이지에서 병합
            (LLM 인용 축: sameAs로 인물 동일성 고정, 홈은 ProfilePage) */}
        {(() => {
          const origin = `https://${cfg.baseUrl ?? "notes.junghanacs.com"}`
          const lang = cfg.locale ?? "ko-KR"
          const slug = fileData.slug ?? ""
          const slugTail = slug.split("/").pop() ?? ""
          const isDenoteContent = /^\d{8}T\d{6}$/.test(slugTail)
          const isHome = slug === "index"
          if (!isHome && !isDenoteContent) return null

          // 전 페이지가 같은 @id를 가리켜 크롤러/LLM이 노드 속성을 병합한다.
          // sameAs = 동명이인 구분·교차 지식그래프의 핵심(LLM 인용 판단 신호).
          const person = {
            "@type": "Person",
            "@id": `${origin}/#person`,
            "name": "Junghan Kim",
            "givenName": "Junghan",
            "familyName": "Kim",
            "alternateName": ["GLG", "GLGMAN"],
            "url": origin,
            "jobTitle": "Software Engineer",
            "description":
              "Polymath engineer and digital gardener. Builds a reproducible knowledge environment with NixOS, Emacs, and Org-mode, and publishes a Korean-language digital garden of interconnected notes.",
            "knowsLanguage": ["ko", "en"],
            // 실제 태그 빈도(emacs 189·syntopicon 107·ai 109·philosophy 77…)에서 도출.
            "knowsAbout": [
              "Emacs",
              "Org-mode",
              "Denote",
              "Personal Knowledge Management",
              "Digital Gardens",
              "NixOS",
              "AI agents",
              "Large Language Models",
              "Clojure",
              "Python",
              "Philosophy",
              "Syntopical Reading",
              "Korean language",
              "Logic",
            ],
            // junghanacs = 가든/노트(이 사이트 정본), junghan0611 = 개발용.
            "sameAs": [
              "https://github.com/junghanacs",
              "https://github.com/junghan0611",
              "https://kr.linkedin.com/in/junghan-kim-1489a4306",
              "https://bsky.app/profile/junghanacs.bsky.social",
              "https://fosstodon.org/@junghanacs",
            ],
          }
          const website = {
            "@type": "WebSite",
            "@id": `${origin}/#website`,
            // 이모지(cfg.pageTitle="junghanacs🧠")는 UI용 — KG 엔티티명은 클린 텍스트.
            "name": "junghanacs digital garden",
            "url": origin,
            "inLanguage": lang,
            "description":
              "A Korean-language digital garden of interconnected notes on engineering, philosophy, and contemplative practice.",
            "publisher": { "@id": `${origin}/#person` },
          }

          const fm = fileData.frontmatter
          const graph = isHome
            ? [
                person,
                website,
                {
                  "@type": "ProfilePage",
                  "@id": `${origin}/#profilepage`,
                  "url": origin,
                  "name": title,
                  "inLanguage": lang,
                  ...(fm?.date && { "dateCreated": fm.date }),
                  ...(fm?.lastmod && { "dateModified": fm.lastmod }),
                  "isPartOf": { "@id": `${origin}/#website` },
                  "about": { "@id": `${origin}/#person` },
                  "mainEntity": { "@id": `${origin}/#person` },
                  "description": description,
                },
              ]
            : [
                person,
                website,
                {
                  "@type": "BlogPosting",
                  "@id": `${socialUrl}#article`,
                  "headline": fm?.title ?? title,
                  "name": fm?.title ?? title,
                  "url": socialUrl,
                  "mainEntityOfPage": socialUrl,
                  "author": { "@id": `${origin}/#person` },
                  "publisher": { "@id": `${origin}/#person` },
                  "isPartOf": { "@id": `${origin}/#website` },
                  "inLanguage": lang,
                  ...(Array.isArray(fm?.tags) && fm.tags.length
                    ? { "keywords": fm.tags.join(", ") }
                    : {}),
                  ...(fm?.date && { "datePublished": fm.date }),
                  ...(fm?.lastmod ? { "dateModified": fm.lastmod } : fm?.date ? { "dateModified": fm.date } : {}),
                  "description": description,
                  "image": ogImageDefaultPath,
                  "isBasedOn": `https://github.com/junghanacs/notes.junghanacs.com/blob/v4/content/${slug}.md`,
                },
              ]

          const jsonLd = { "@context": "https://schema.org", "@graph": graph }
          return (
            <script
              type="application/ld+json"
              dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
            />
          )
        })()}

        {css.map((resource) => CSSResourceToStyleElement(resource, true))}
        {js
          .filter((resource) => resource.loadTime === "beforeDOMReady")
          .map((res) => JSResourceToScriptElement(res, true))}
        {additionalHead.map((resource) => {
          if (typeof resource === "function") {
            return resource(fileData)
          } else {
            return resource
          }
        })}
      </head>
    )
  }

  return Head
}) satisfies QuartzComponentConstructor
