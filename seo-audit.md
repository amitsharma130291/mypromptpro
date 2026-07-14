# MyPromptPro — SEO + Indexability Audit
**Date:** 2026-07-14  
**Scope:** BaseLayout.astro, src/pages/index.astro, src/pages/teachers/index.astro  
**Question:** Is the site ready to submit to Google Search Console?

---

## 1. Overall Verdict

**NOT READY**

Two hard blockers: no sitemap.xml and a placeholder `robots.txt` that contains no `User-agent` or `Disallow` directives (Google will not parse it correctly). The teachers page also has two unfilled template placeholders (`[TPT_LISTING_URL]`) which will appear raw on the live page. Fix all three before submitting to GSC.

Once those are fixed the site is otherwise structurally solid for a new site at this stage.

---

## 2. Technical Audit

### BaseLayout.astro

| Item | Status | Detail |
|------|--------|--------|
| `lang` on `<html>` | ✅ PASS | `lang="en"` — present |
| `<title>` | ✅ PASS | Passed in as prop; each page sets its own |
| `<meta name="description">` | ✅ PASS | Passed as prop |
| `<link rel="canonical">` | ✅ PASS | Set from `canonical` prop |
| `og:title` | ✅ PASS | Mirrors `title` prop |
| `og:description` | ✅ PASS | Mirrors `description` prop |
| `og:url` | ✅ PASS | Mirrors `canonical` prop |
| `og:type` | ✅ PASS | `website` — hardcoded |
| `og:image` | ⚠️ WARN | Conditional — only present when `ogImage` prop is passed. Both pages pass it (`/assets/cover-teachers.png`), so it will render. But it's relative path — needs to be an absolute URL (e.g. `https://mypromptpro.com/assets/cover-teachers.png`) for Facebook/WhatsApp/Slack to resolve it. |
| `<meta name="robots" noindex>` | ✅ PASS | No noindex directive anywhere — both pages are fully indexable |

### index.astro (homepage)

| Item | Status | Detail |
|------|--------|--------|
| `<title>` | ✅ PASS | "MyPromptPro — Engineered AI Prompt Systems for Professionals" — 56 chars, under 60 |
| `<meta description>` | ⚠️ WARN | 201 chars — **exceeds the 160-char cap**. Google will truncate it in search results. Needs a trim. |
| `<link rel="canonical">` | ✅ PASS | `https://mypromptpro.com/` — correct absolute URL |
| OG tags | ⚠️ WARN | `og:image` is `/assets/cover-teachers.png` — relative path. Must be absolute. |
| Heading structure | ✅ PASS | Single `<h1>` ("Engineered AI prompts for the professionals who never clock off"), logical `<h2>` sections below |
| Internal links | ✅ PASS | All links use root-relative `/teachers/` — not `./teachers/index.html` |
| `noindex` check | ✅ PASS | None |

### teachers/index.astro

| Item | Status | Detail |
|------|--------|--------|
| `<title>` | ⚠️ WARN | "75 ChatGPT Prompts for Teachers — Get Your Evenings Back \| MyPromptPro" — 72 chars. **Exceeds 60-char guideline**. Google will rewrite it. Aim for ≤60. |
| `<meta description>` | ✅ PASS | 185 chars as written, but it renders with `&amp;` HTML entities — actual text length is ~180. Still over 160. **Needs a trim.** |
| `<link rel="canonical">` | ✅ PASS | `https://mypromptpro.com/teachers/` — correct |
| OG tags | ⚠️ WARN | `og:image` relative path, same issue as homepage |
| Heading structure | ✅ PASS | Single `<h1>` ("Still grading at 9pm? Get your evenings back."), logical `<h2>` hierarchy below |
| Image alt text | ✅ PASS | `cover-teachers.png` has a proper descriptive alt: "75 ChatGPT Prompts for Elementary & Special Education Teachers — product cover" |
| `noindex` check | ✅ PASS | None |
| `[TPT_LISTING_URL]` placeholder | ❌ FAIL | **Two unfilled template placeholders** appear in the rendered HTML — one in the hero CTA and one in the final buy section. These will render as the literal text `[TPT_LISTING_URL]` on the live page, which looks broken and unprofessional. Must be replaced before launch. |

### Site-wide Technical

| Item | Status | Detail |
|------|--------|--------|
| `robots.txt` | ❌ FAIL | **Non-standard format.** The live `robots.txt` at `mypromptpro.com/robots.txt` contains only an AI content-signal comment block — no `User-agent:` directive, no `Disallow:` line. Google's crawler expects at minimum `User-agent: *` + `Disallow:` (even an empty one to allow everything). This file will not parse correctly. **Replace it.** |
| `sitemap.xml` | ❌ FAIL | **404 — does not exist.** Astro does not auto-generate a sitemap. You must install and configure `@astrojs/sitemap` (see fix list below). Without a sitemap, Googlebot must discover pages by crawling links alone — fine eventually, but submitting to GSC without one is a missed opportunity. |
| Email form | ⚠️ WARN | Both email capture forms have `action="#"` and `onsubmit="return false;"` — these are non-functional placeholders. Not an SEO blocker, but if a reviewer submits before launch it signals the site is unfinished. |
| Contact email | ⚠️ WARN | `hello@mypromptpro.com` appears in both footers with a comment "placeholder — confirm contact email". If this inbox doesn't exist and someone emails it, support fails. Not an SEO issue but a credibility one. |

---

## 3. Content Quality Assessment

### Homepage (index.astro)

**Verdict: Good. Not generic.**

The copy is specific and has a clear point of view. The hero hook ("Engineered AI prompts for the professionals who never clock off") is direct and differentiated — it positions against generic prompt packs from the first line. The "Why MyPromptPro" section names three concrete things (engineering structure, before/after proof, built by practitioners) rather than recycling "unlock your potential" language.

The profession-grid cards are lean and accurate. Each one names a specific work context ("lesson plans, grading, IEP paperwork, and parent emails" rather than just "all your tasks").

**Slop check:** No instances of "revolutionise", "seamlessly", "game-changing", "leverage", or "empower". The one borderline phrase is "built by people who do the work" — which is a common authenticity claim, but it's followed up with a specific proof point (before/after for every prompt), so it holds.

**Word count estimate:** Roughly 450–500 words of body copy (hero + profession cards + Why section + email CTA). Thin for a homepage but acceptable for a gateway page — the teachers page is the real landing destination.

**Keyword signals:** Weak on the homepage itself. "ChatGPT prompt" appears once, "AI prompt" twice. The homepage is deliberately an umbrella — fair enough — but if it's going to rank at all for anything it needs at least one sentence targeting "ChatGPT prompt library for [profession]" in the meta or a heading.

### Teachers page (teachers/index.astro)

**Verdict: Strong copy. Real keyword signals. One accuracy issue.**

This is the site's best content. The "8:40pm" story section is concrete, empathetic, and non-generic. The before/after proof (P16 report-card comment, "Maya's personal narrative about her grandmother's kitchen") is specific enough to be credible — it doesn't just describe the output, it shows it. The SPED layer description names actual IEP/PLAAFP/FBA/BIP terminology, which will resonate with the audience and with search.

**Keyword signals:**
- "ChatGPT prompts for teachers" — appears in the title and body. ✅
- "elementary teachers" — present. ✅
- "IEP paperwork" — present. ✅
- "special education" — present, prominently. ✅
- "lesson plans" — present. ✅
- "report card comments" — present in the before/after section. ✅
- "ChatGPT prompts for teachers free" — not targeted. Minor gap.

**Thin content check:** The teachers page has roughly 1,200–1,500 words of body copy. Not thin. The before/after alone is 250+ words of real, specific content.

**Slop check:**
- "Get your evenings back" — used 3 times (hero h1, section-head, final CTA). Repetitive. One of these should be varied.
- "The 8:40pm you know too well" — good, specific, non-generic.
- "AI won't replace teachers. But teachers who use AI well will replace the ones who don't" — this is a real claim and the language is sharp, but it's the kind of provocative framing that can alienate teachers who feel defensive. Worth Amit deciding if he's comfortable with it.
- No instances of "revolutionise", "game-changing", "leverage", "empower", "seamlessly". Clean.

**Stat citation:** "Teachers who use AI weekly save about 6 hours a week — roughly six school weeks a year (Gallup / Walton Family Foundation, 2025)." Good: sourced, specific. Make sure this stat is still live and accurately attributed — if this comes from a summary or secondary source, link directly to the original report.

**Duplicate copy between pages:** Minimal. The homepage's teacher card description ("75 prompts for elementary & special-education teachers — lesson plans, grading, IEP paperwork, and parent emails. Get your evenings back.") is a short teaser that echoes the teachers page hero. That's expected and fine. There's no body copy duplicated verbatim.

---

## 4. Blockers (Must Fix Before Submitting to GSC)

### B1 — No sitemap.xml (HARD BLOCKER)
Google can crawl without it, but GSC submission requires one. Astro does not auto-generate.

**Fix:**
```bash
npm install @astrojs/sitemap
```
In `astro.config.mjs`:
```js
import sitemap from '@astrojs/sitemap';

export default defineConfig({
  site: 'https://mypromptpro.com',
  integrations: [sitemap()],
});
```
This generates `/sitemap-index.xml` on build. Submit that URL to GSC.

### B2 — robots.txt is non-standard (HARD BLOCKER)
The current file has no `User-agent` or `Disallow` lines. Google's robots.txt parser will reject it.

**Fix — replace `public/robots.txt` with:**
```
User-agent: *
Disallow:

Sitemap: https://mypromptpro.com/sitemap-index.xml
```
That's the minimal correct format. It allows all crawlers and points to your sitemap.

### B3 — `[TPT_LISTING_URL]` placeholder in teachers page (HARD BLOCKER for credibility)
Two live links point to the literal string `[TPT_LISTING_URL]`. These will be clickable links to a broken/literal URL on the live page. Replace with the real TPT URL, or temporarily remove those CTAs until it's ready.

---

## 5. Warnings (Fix Soon — Will Affect Ranking or UX)

### W1 — `og:image` is a relative path
Both pages pass `/assets/cover-teachers.png` as `ogImage`. BaseLayout renders it without making it absolute. Facebook, Slack, Twitter/X, and WhatsApp all require an absolute URL for the OG image to display in link previews.

**Fix in BaseLayout.astro:**
Change:
```astro
{ogImage && <meta property="og:image" content={ogImage} />}
```
To:
```astro
{ogImage && <meta property="og:image" content={`https://mypromptpro.com${ogImage}`} />}
```
Or pass the full absolute URL from each page.

### W2 — Homepage meta description is 201 chars (limit is 160)
Google will truncate this in SERPs. The current description:
> "Profession-specific ChatGPT prompt libraries that give you your evenings back. Built by practitioners, tested on real work, with a real before & after for every prompt. Teachers available now."

**Suggested replacement (~145 chars):**
> "Profession-specific ChatGPT prompt libraries built by practitioners. Tested on real work, a real before & after for every prompt. Teacher edition available now."

### W3 — Teachers page title is 72 chars (limit is ~60)
"75 ChatGPT Prompts for Teachers — Get Your Evenings Back | MyPromptPro" will be rewritten by Google.

**Suggested replacement (59 chars):**
> "75 ChatGPT Prompts for Teachers | MyPromptPro"

Or, keeping the emotional hook at the cost of the brand name:
> "75 ChatGPT Prompts for Teachers — Get Your Evenings Back"

(57 chars — fits, but drops the brand name from title.)

### W4 — Teachers page meta description is ~180 chars (over 160)
Current: "Still grading at 9pm? 75 engineered ChatGPT prompts for elementary & special-education teachers — lesson plans, grading, IEP paperwork, parent emails. A real before & after for every prompt. Get your evenings back."

**Suggested replacement (~155 chars):**
> "Still grading at 9pm? 75 engineered ChatGPT prompts for elementary & SPED teachers — lesson plans, IEP paperwork, grading, parent emails. Before & after for all 75."

### W5 — "Get your evenings back" used 3× on teachers page
Appears in the h1, the final CTA h2, and in the trust row. The repetition dulls the phrase. Vary at least one — the final CTA h2 ("Start tonight. Use the first prompt in five minutes.") is an easy swap.

### W6 — Homepage has weak keyword density
The word "ChatGPT" appears only once in body copy (the hero paragraph). If Amit wants the homepage to rank for brand-adjacent terms ("ChatGPT prompt library", "AI prompts for professionals"), the h1 or the profession section intro should include it more explicitly. Current h1 says "Engineered AI prompts" — fine for brand positioning but not targeted.

### W7 — Email forms are non-functional placeholders
`action="#"` on both forms. Visitors who sign up get no confirmation and their email goes nowhere. This is a missed lead capture and a credibility risk if tested by a journalist or GSC reviewer. Wire these before any traffic lands.

### W8 — Contact email is a placeholder
`hello@mypromptpro.com` appears in both footers with a code comment confirming it's a placeholder. If live, ensure this inbox exists and is monitored before going public.

---

## 6. Prioritised Fix List

| Priority | Fix | Time Estimate |
|----------|-----|---------------|
| 1 | **Replace robots.txt** with valid format + sitemap pointer | 5 min |
| 2 | **Install @astrojs/sitemap**, rebuild, submit URL to GSC | 20 min |
| 3 | **Replace `[TPT_LISTING_URL]`** in teachers page (2 instances) with real URL, or remove CTAs | 5 min |
| 4 | **Fix og:image** to absolute URL in BaseLayout.astro | 5 min |
| 5 | **Trim homepage meta description** to ≤160 chars (use suggested copy above) | 5 min |
| 6 | **Shorten teachers page title** to ≤60 chars (use suggested copy above) | 5 min |
| 7 | **Trim teachers page meta description** to ≤160 chars (use suggested copy above) | 5 min |
| 8 | **Vary "Get your evenings back"** in final CTA h2 | 5 min |
| 9 | **Wire email capture forms** to real provider (ConvertKit/Beehiiv etc.) | 1–2 hrs |
| 10 | **Confirm contact email inbox** is live and monitored | 10 min |

Total for items 1–7 (the real GSC blockers): under an hour.

---

## Summary Scorecard

| Category | Score |
|----------|-------|
| Page structure / HTML validity | ✅ Solid |
| Title tags | ⚠️ Homepage OK, Teachers too long |
| Meta descriptions | ⚠️ Both over 160 chars |
| Canonical tags | ✅ Correct on both pages |
| OG tags | ⚠️ Image path relative, not absolute |
| `lang` attribute | ✅ Present |
| Heading hierarchy | ✅ Clean single H1 on both pages |
| Image alt text | ✅ Cover image alt is specific and correct |
| noindex risk | ✅ None found |
| Internal links | ✅ Root-relative, correct |
| robots.txt | ❌ Non-standard, will not parse |
| sitemap.xml | ❌ Does not exist |
| Content originality | ✅ Non-generic, human-sounding |
| Keyword signals (teachers page) | ✅ Strong |
| Keyword signals (homepage) | ⚠️ Weak — "ChatGPT" appears once |
| Thin content | ✅ Teachers page is substantive |
| Duplicate copy | ✅ None between pages |
| Unfilled placeholders | ❌ `[TPT_LISTING_URL]` × 2 live in teachers page |
