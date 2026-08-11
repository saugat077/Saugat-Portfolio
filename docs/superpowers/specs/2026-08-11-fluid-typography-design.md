# Fluid Typography Design System

**Date:** 2026-08-11
**Status:** Approved, ready for implementation planning
**Scope:** Typography only. Spacing/rhythm and color roles are separate specs (see Out of Scope).

## Problem

The site has no typography system. It has three competing scales:

1. **Semantic classes** — `.t-display`, `.t-body`, `.t-caption` in `@layer components`, 90 usages across 21 files, sized in px with a single `@media (min-width: 640px)` jump.
2. **Hardcoded arbitrary values** — roughly 58 `text-[Npx]` utilities using 15 distinct sizes: 11, 12, 13, 14, 15, 16, 17, 18, 19, 28, 34, 36, 64, 96, 160px. These outnumber the semantic classes, so the "system" does not govern the site.
3. **Tailwind defaults** — `portableText.ts` renders blog/project prose with `text-sm`, `text-xl`, `text-2xl`, `text-3xl`, a third scale nobody chose.

Consequences:

- **No `rem` anywhere.** Every size is px, so browser font-size preferences and zoom are ignored.
- **No 16px baseline.** Body is 14px mobile / 18px desktop; prose is a hardcoded 16px. None agree.
- **One jumpy breakpoint** rather than continuous scaling.
- **No line-height or tracking tokens.** `leading-tight` / `leading-snug` / `leading-relaxed` are applied per call site by eye.
- **`.t-caption` does two unrelated jobs** — section eyebrows and UI chrome — so neither can change without breaking the other.

## Decisions

| Decision | Choice | Rationale |
|---|---|---|
| Baseline | `1rem` = 16px | Respects user browser settings; the accessibility requirement. |
| Ratio | 1.20 at 320px easing to 1.25 at 1440px | Minor Third on mobile keeps headings practical on small screens; Major Third gives desktop hierarchy. Lands within ~1px of current `display` and `h1` sizes, making this a structural fix rather than a redesign. |
| Fluid range | 320px → 1440px viewport | Covers the real device range; below/above, the clamp bounds hold. |
| Base size | 16px → 18px | 16px mobile baseline; 18px desktop matches today's desktop body. |
| Fluid vs stable | Content fluid, chrome stable | Pills, tags, and breadcrumbs sit in fixed padding/borders; fluid text inside them makes the shapes drift. |
| Mechanism | Tailwind v4 `@theme` tokens, semantically named | Tailwind 4.3.1 supports `--text-<name>--line-height` / `--letter-spacing` / `--font-weight`, so one token carries size *and* leading *and* tracking. Verified present in the installed version. |
| Migration | Full — all 21 files | A half-migrated system is how three competing scales appeared. Leaving arbitrary px in place invites a fourth. |

### Why semantic names over numeric steps

`text-title` and `text-lead` are the same size (step 1) with different leading (1.3 vs 1.5). A numeric scale cannot express "step 1, but it's a paragraph so it needs looser leading." Semantic names also make errors visible in review: `text-meta` on a page heading reads as a mistake; `text-[34px]` does not.

## The Scale

Fluid values are computed between 320px and 1440px viewport. **Every `clamp()` keeps its intercept in `rem`, never pure `vw`** — this is what preserves scaling at 200% browser zoom and satisfies WCAG 1.4.4. A `vw`-only formula would fail it.

Formula used for each token:

```
slope    = (maxPx - minPx) / (1440 - 320)
vw       = slope × 100
intercept= (minPx - slope × 320) / 16   [in rem]
size     = clamp(minRem, intercept + vw, maxRem)
```

### Fluid tokens (9)

| Token | Step | Value | Range | Leading | Tracking | Weight | Role |
|---|---|---|---|---|---|---|---|
| `text-h1` | 3 | `clamp(1.728rem, 1.594rem + 0.671vw, 2.198rem)` | 27.7–35.2px | 1.15 | −0.02em | 700 | Page titles, prose `h1` |
| `text-display` | 2 | `clamp(1.44rem, 1.349rem + 0.454vw, 1.758rem)` | 23.0–28.1px | 1.2 | −0.01em | 700 | Section headings, prose `h2` |
| `text-title` | 1 | `clamp(1.2rem, 1.141rem + 0.295vw, 1.406rem)` | 19.2–22.5px | 1.3 | — | 600 | Card titles, prose `h3` |
| `text-lead` | 1 | `clamp(1.2rem, 1.141rem + 0.295vw, 1.406rem)` | 19.2–22.5px | 1.5 | — | 400 | Intro paragraphs (404 copy) |
| `text-body` | 0 | `clamp(1rem, 0.964rem + 0.179vw, 1.125rem)` | 16.0–18.0px | 1.6 | — | 400 | Primary prose, About bio |
| `text-body-sm` | −1 | `clamp(0.833rem, 0.814rem + 0.1vw, 0.9rem)` | 13.3–14.4px | 1.55 | — | 400 | Secondary copy, card descriptions |
| `text-clock` | — | `clamp(0.6875rem, 0.5625rem + 0.625vw, 1.125rem)` | 11–18px | 1 | — | 400 | NepalClock |
| `text-numeral` | — | `clamp(4rem, 3.429rem + 2.857vw, 6rem)` | 64–96px | 1 | −0.03em | 700 | 404 numeral |
| `text-wordmark` | — | `clamp(4rem, 2.286rem + 8.571vw, 10rem)` | 64–160px | 1 | −0.02em | 800 | Footer wordmark |

### Stable tokens (4)

Fixed `rem` — they respect browser font settings but do not track viewport width.

| Token | Value | Leading | Tracking | Role |
|---|---|---|---|---|
| `text-ui` | `0.875rem` (14px) | 1.4 | — | Nav links, section eyebrows, skill labels |
| `text-label` | `0.8125rem` (13px) | 1.4 | — | Breadcrumbs, filter pills, tech pills, back-links, "View all" |
| `text-meta` | `0.75rem` (12px) | 1.35 | 0.01em | Dates, tag pills |
| `text-menu` | `2.25rem` (36px) | 1.1 | −0.02em | Mobile full-screen menu links |

**Correction to an earlier reading:** the nav has no text wordmark. `Nav.tsx:39-46` renders the logo as an `<img src="/images/emblem.svg">`, so it is unaffected by typography. The `text-[36px]` at `Nav.tsx:122` is the **mobile full-screen menu links** (`sm:hidden`, single size, below 640px only), which is why the token is `text-menu` and why stable is the right tier for it.

### Relative token (1)

| Token | Value | Role |
|---|---|---|
| `text-code` | `0.9em` | Inline `<code>` in prose. Deliberately `em`, not `rem` — inline code must track the size of its host text, which varies by container. |

**14 tokens total.**

### Documented off-scale exceptions

`text-numeral` (64–96px), `text-wordmark` (64–160px), and `text-clock` (11–18px) are not modular-scale steps. Step 5 is only 39.8–54.9px, so forcing the wordmarks onto the scale would shrink them by more than half. Large decorative display type follows different rules from text type; these are bespoke clamps with stated bounds rather than pretend steps.

`text-clock` is the one item in the "chrome" category that is fluid. It has two designed sizes today (11px mobile, 18px desktop) and fills a fixed-width slot beside the wordmark, so a single stable size cannot express it.

## Font Family Cleanup

With Bricolage Grotesque everywhere, `--font-display`, `--font-body`, `--font-caption`, and `--font-footer` are four names for one font.

- Replace with `--font-sans: var(--font-bricolage), ui-sans-serif, system-ui, sans-serif`. No call site needs a family class: Tailwind v4's preflight already sets the document family to `var(--default-font-family)`, which resolves to `--font-sans`, so overriding that one token in `@theme` changes the inherited default site-wide. Verify this resolves rather than assuming it — if preflight does not pick it up, apply `font-sans` on `<body>` explicitly instead.
- Keep `--font-bitcount: var(--font-bitcount-single), monospace` for the clock.
- Remove the `font-display` / `font-body` / `font-caption` / `font-footer` utility usages (21 files).
- Delete the commented-out Manrope block and the `@media (min-width: 640px)` type block in `globals.css`.
- Delete the `.t-display` / `.t-body` / `.t-caption` component classes.

Fonts continue to load via `next/font` in `layout.tsx`; that mechanism is unchanged by this spec.

## Migration Mapping

### Semantic classes

**Rule for resolving class-to-role conflicts: role wins over old class name.** Two legacy classes each do more than one job, so a 1:1 class mapping is impossible.

`.t-display` does two jobs — section headings *and* card titles:

| Today | Becomes | Notes |
|---|---|---|
| `t-display` — section headings ("Career", "Skills", "Projects", "Books", "Clubs & Events") | `text-display` | |
| `t-display` — Hero name (`Hero.tsx:58`) | `text-display` | Kept at display size; promoting the hero name is a redesign, out of scope. |
| `t-display` — card titles (`BookCard.tsx:28,34`, `ProjectCard.tsx:54`, `Affiliations.tsx:52` org name) | `text-title` | Desktop 28→22.5px. Separates card titles from the section heading above them, which are the same size today. |

`.t-body` does three jobs:

| Today | Becomes | Notes |
|---|---|---|
| `t-body` — About bio, company, hero role, location | `text-body` | |
| `t-body` — desktop nav links (`Nav.tsx:54`) | `text-ui` | Chrome, so stable |
| `t-body` — card descriptions (`ProjectCard.tsx:60`) | `text-body-sm` | Matches the other card descriptions, which are hardcoded 14–15px today. |
| `t-caption` — eyebrows ("So Far", "Core", "Built with others"), skill labels | `text-ui` | Desktop 16→14px |
| `t-caption` — tech pills, "View all" links, BookCard author | `text-label` | |
| `t-caption` — dates | `text-meta` | |
| `t-caption` — career description (`Experience.tsx`) | `text-body-sm` | Prose, not a label. Desktop 16→14.4px, keeping it subordinate to the About bio. |

`.t-caption` splitting four ways is the point: one class was doing four jobs.

### Hardcoded values

| Today | Becomes |
|---|---|
| `text-[11px]` tag pills | `text-meta` (12px) |
| `text-[12px]` dates, meta | `text-meta` |
| `text-[13px]` breadcrumbs, back-links, filter pills | `text-label` |
| `text-[14px]`, `text-[15px]` descriptions, short descriptions, empty states | `text-body-sm` |
| `text-[16px]` prose paragraphs, list items, blockquotes, empty states | `text-body` |
| `text-[17px]`, `text-[18px]` card titles, experience role | `text-title` |
| `text-[19px]` 404 copy | `text-lead` |
| `text-[28px]` / `text-[34px]` page `h1` | `text-h1` |
| `text-[36px]` mobile menu links (`Nav.tsx:122`) | `text-menu` |
| `text-[64px]` / `text-[96px]` 404 numeral | `text-numeral` |
| `text-[64px]` / `text-[160px]` footer wordmark | `text-wordmark` |
| `text-[11px]` / `text-[18px]` NepalClock | `text-clock` |

### portableText.ts

| Today | Becomes |
|---|---|
| `text-3xl` (`h1`) | `text-h1` |
| `text-2xl` (`h2`) | `text-display` |
| `text-xl` (`h3`) | `text-title` |
| `text-[16px]` (`p`, `li`, blockquote) | `text-body` |
| `text-sm` (inline `code`) | `text-code` |

### Leading utilities

Drop `leading-tight` / `leading-snug` / `leading-relaxed` / `leading-none` wherever the token now supplies the same intent. Keep only where a call site deliberately overrides its token — for example `leading-[16px]` on tag pills, which exists to control pill height rather than text rhythm. Each retained override gets a brief comment explaining why.

## Visual Changes Accepted

This is a refactor with real visual consequences, not a no-op. Approved changes:

1. **Mobile body 14 → 16px.** The accessibility win and the largest readability gain.
2. **Card titles 17/18 → 19.2/22.5px.** Stronger hierarchy, since body grew underneath them.
3. **Desktop eyebrows and labels 16 → 14px** (13px for pills/links, 12px for dates and tags). Consequence of making chrome stable.
4. **Section displays on mobile 20 → 23px.**
5. **Tag pills 11 → 12px**, so pill height grows ~1px.
6. **Career description on desktop 16 → 14.4px**, keeping it subordinate to the About bio.
7. **Card titles on desktop 28 → 22.5px** (`BookCard`, `ProjectCard`, `Affiliations` org name). Consequence of the role-wins rule: card titles and the section heading above them are identical today, and separating them is the point.

### Required companion fix: the watermark crop

`page.tsx:54` renders the "SAUGATKC" watermark clipped to roughly its top half by `overflow-hidden h-[50px] sm:h-[140px]`, against a font size that jumps 64→160px at the same breakpoint. Once the font size becomes a continuous `clamp()` but the height still jumps at 640px, **the crop ratio drifts across viewport widths** — at 639px the font is ~91px inside a 50px box; one pixel wider, the box becomes 140px at the same font size.

Making the font fluid causes this, so fixing it belongs to this change: replace the two fixed heights with `h-[0.8em]`. Because `em` in a height resolves against the element's own font-size, the crop ratio then stays constant at every width. Today's ratios are 50/64 = 0.78 mobile and 140/160 = 0.875 desktop, so `0.8em` is faithful to the mobile crop and slightly tighter than the current desktop one. `leading-none` and `font-extrabold` are dropped, since `text-wordmark` carries leading 1 and weight 800.

## Out of Scope

Deliberately excluded, each to get its own spec → plan → implementation cycle:

- **Spacing and rhythm** — the ad-hoc `gap-*` / `mt-*` / `py-*` values and section rhythm. Depends on this spec, because vertical rhythm should derive from these line-height tokens.
- **Color roles** — semantic naming (surface / ink / accent tiers) replacing `--color-accent-soft` / `-pill` / `-fill`, which describe where they are used rather than what role they play. Independent of typography.
- **Font loading** — already solved via `next/font`.
- **Weight rationalization** — call sites mixing `font-bold` / `font-semibold` / `font-extrabold`. Tokens carry a default weight; auditing every override is follow-up work.

## Verification

1. `npm run build` completes clean, TypeScript included.
2. Grep guards return zero matches:
   - `text-\[\d+px\]` — no hardcoded px sizes
   - `\bt-(display|body|caption)\b` — no old semantic classes
   - `\bfont-(display|body|caption|footer)\b` — no old family utilities
   - `\btext-(xs|sm|base|lg|xl|[2-7]xl)\b` — no Tailwind default sizes
3. Computed font sizes spot-checked in a real browser at 320px, 768px, and 1440px against the ranges in the tables above.
4. A 200% browser-zoom check confirming text still scales — proves the `rem` intercepts work and no token regressed to pure `vw`.
5. Every route renders 200: `/`, `/books`, `/projects`, `/blogs`, and one detail page per collection.

## Risks

| Risk | Mitigation |
|---|---|
| A 21-file diff is hard to review as one unit | Implementation plan sequences it: tokens first, then per-file migration in reviewable batches, guards last. |
| `.t-caption`'s four-way split is judgment-based; some call site may be miscategorized | Item-by-item mapping table above; browser spot-check at three widths catches anything visibly wrong. |
| Tag pills with retained `leading-[16px]` may clip at 12px | Verify pill rendering explicitly during the browser check. |
| Fluid tokens could regress to pure `vw` in future edits, silently breaking zoom | The 200% zoom check is a stated verification step, and every token's intercept is documented in `rem` here. |
