# Fluid Typography Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Replace the site's three competing type scales with one fluid, `rem`-based typography system of 14 semantic Tailwind tokens.

**Architecture:** All sizes are declared once as `--text-*` tokens inside Tailwind v4's `@theme` block in `src/app/globals.css`, each carrying its own `--line-height`, `--letter-spacing`, and `--font-weight`. Content type uses `clamp()` between 320px and 1440px viewport; UI chrome uses fixed `rem`. Call sites then reference one semantic class (`text-h1`, `text-body`, `text-label`) instead of a size plus a leading utility. Tokens land first as an additive change, call sites migrate file-group by file-group, and the legacy layer is deleted last so the site never breaks mid-plan.

**Tech Stack:** Next.js 16.2.9 (Turbopack, static export), Tailwind CSS 4.3.1, React 19.2, TypeScript 5.8, `next/font` for Bricolage Grotesque + Bitcount Single.

**Spec:** `docs/superpowers/specs/2026-08-11-fluid-typography-design.md`

## Global Constraints

- `1rem` = 16px baseline. Never hardcode px font sizes again.
- Fluid range is exactly **320px → 1440px** viewport.
- **Every `clamp()` intercept is in `rem`, never pure `vw`.** A `vw`-only formula breaks scaling at 200% browser zoom and fails WCAG 1.4.4.
- No new dependencies. The guard script uses Node built-ins only.
- Node >= 20.9.0 (`package.json` `engines`).
- Commit messages contain only the change description — no `Co-Authored-By` trailer, no "Generated with" footer.
- There is **no test framework in this project**. "Tests" here are the guard script, the compiled-CSS assertions, `npm run build`, and HTTP route checks. Do not add a test framework.
- A dev server may already be running on `http://localhost:3000`. Reuse it; if it is not running, start it with `npm run dev`.
- Windows environment. Use the PowerShell or Bash tool syntax appropriate to the command shown.

## File Structure

| File | Responsibility | Task |
|---|---|---|
| `src/app/globals.css` | Sole home of the type scale. Declares `@theme` tokens; legacy `.t-*` classes deleted at the end. | 1, 10 |
| `scripts/check-typography.mjs` | Guard. Asserts no legacy type classes survive and all 14 tokens are declared. Zero dependencies. | 2 |
| `package.json` | Adds the `check:type` script. | 2 |
| `src/components/Nav.tsx`, `NepalClock.tsx`, `Hero.tsx`, `src/app/page.tsx` | Shell and hero call sites. | 3 |
| `src/components/About.tsx`, `CoreSkills.tsx`, `Affiliations.tsx` | About/skills/affiliations call sites. | 4 |
| `src/components/Experience.tsx`, `ExperienceItem.tsx` | Career call sites. | 5 |
| `src/components/Projects.tsx`, `ProjectCard.tsx`, `BookReview.tsx`, `BookCard.tsx` | Card call sites. | 6 |
| `src/app/blogs/page.tsx`, `books/page.tsx`, `projects/page.tsx`, `src/components/BooksFilter.tsx` | List-page call sites. | 7 |
| `src/app/blogs/[slug]/page.tsx`, `books/[slug]/page.tsx`, `projects/[slug]/page.tsx` | Detail-page call sites. | 8 |
| `src/app/not-found.tsx`, `src/lib/portableText.ts` | 404 and rendered prose. | 9 |

## Verified Mechanics

Probed against the installed Tailwind 4.3.1 before this plan was written, so these are facts, not assumptions:

- `--text-body-sm--line-height` parses correctly. A hyphenated token name does not confuse the `--` modifier split.
- `--letter-spacing` and `--font-weight` modifiers both attach to the generated utility.
- `--text-*: initial` really does remove Tailwind's defaults — `text-sm` generates nothing afterwards.
- Utilities compile to `line-height: var(--tw-leading, var(--text-h1--line-height))`, and equivalently for tracking and weight. **This is why retained `leading-tight` and existing `font-bold` still win:** the utility sets `--tw-leading` / `--tw-font-weight`, which takes precedence over the token default. Class order in the attribute does not matter.

## Leading-Utility Rule

Applies to every migration task. Do not deviate.

- **Drop** `leading-tight` / `leading-snug` / `leading-relaxed` / `leading-none` on **multi-line prose and headings** — the token's line-height is the whole point there.
- **Keep** it on **single-line labels in tight stacks** (eyebrows, hero lines, dates, clamped card titles) and on `leading-[16px]` tag pills, where the value controls stack spacing or pill height rather than text rhythm. Each retained override is called out explicitly in the task diffs below.
- **Drop** `font-semibold` / `font-extrabold` **only where a task says so** — those are cases where the token already carries that weight. Leave every other weight utility alone; weight rationalization is out of scope.

---

### Task 1: Declare the token layer

Additive only. The legacy `.t-*` classes and `--font-display`/`--font-body`/`--font-caption`/`--font-footer` stay for now, so the site looks identical after this task.

**Files:**
- Modify: `src/app/globals.css:5-33` (the `@theme` block)

**Interfaces:**
- Consumes: `--font-bricolage` and `--font-bitcount-single`, set on `<html>` by `next/font` in `src/app/layout.tsx:9-21`.
- Produces: 14 font-size tokens usable as Tailwind utilities by every later task — `text-h1`, `text-display`, `text-title`, `text-lead`, `text-body`, `text-body-sm`, `text-clock`, `text-numeral`, `text-wordmark`, `text-ui`, `text-label`, `text-meta`, `text-menu`, `text-code`. Also `--font-sans` as the inherited default family.

- [ ] **Step 1: Add the type tokens to the `@theme` block**

Insert the following immediately after the existing `--font-footer:` line in `src/app/globals.css`, before the `--color-accent:` line. Leave every existing line in place.

```css
  /* ── Font families ─────────────────────────────────────────────────────── */
  /* Tailwind preflight sets the document family from --font-sans, so no call
     site needs a family class. */
  --font-sans: var(--font-bricolage), ui-sans-serif, system-ui, sans-serif;

  /* ── Fluid content type ────────────────────────────────────────────────── */
  /* Ratio 1.20 @320px easing to 1.25 @1440px, base 16px → 18px.
     Intercepts are in rem, NEVER pure vw, so text still scales at 200% browser
     zoom (WCAG 1.4.4). Full derivation:
     docs/superpowers/specs/2026-08-11-fluid-typography-design.md */
  --text-h1: clamp(1.728rem, 1.594rem + 0.671vw, 2.198rem);   /* 27.7 → 35.2px */
  --text-h1--line-height: 1.15;
  --text-h1--letter-spacing: -0.02em;
  --text-h1--font-weight: 700;

  --text-display: clamp(1.44rem, 1.349rem + 0.454vw, 1.758rem); /* 23.0 → 28.1px */
  --text-display--line-height: 1.2;
  --text-display--letter-spacing: -0.01em;
  --text-display--font-weight: 700;

  --text-title: clamp(1.2rem, 1.141rem + 0.295vw, 1.406rem);  /* 19.2 → 22.5px */
  --text-title--line-height: 1.3;
  --text-title--font-weight: 600;

  /* Same size as --text-title; looser leading because it sets paragraphs, not
     headings. This pair is why the tokens are named by role, not by step. */
  --text-lead: clamp(1.2rem, 1.141rem + 0.295vw, 1.406rem);   /* 19.2 → 22.5px */
  --text-lead--line-height: 1.5;
  --text-lead--font-weight: 400;

  --text-body: clamp(1rem, 0.964rem + 0.179vw, 1.125rem);     /* 16.0 → 18.0px */
  --text-body--line-height: 1.6;
  --text-body--font-weight: 400;

  --text-body-sm: clamp(0.833rem, 0.814rem + 0.1vw, 0.9rem);  /* 13.3 → 14.4px */
  --text-body-sm--line-height: 1.55;
  --text-body-sm--font-weight: 400;

  /* ── Fluid decorative type ─────────────────────────────────────────────── */
  /* Deliberately off the modular scale: step 5 tops out at 54.9px, so forcing
     these onto it would more than halve them. */
  --text-clock: clamp(0.6875rem, 0.5625rem + 0.625vw, 1.125rem); /* 11 → 18px */
  --text-clock--line-height: 1;

  --text-numeral: clamp(4rem, 3.429rem + 2.857vw, 6rem);      /* 64 → 96px */
  --text-numeral--line-height: 1;
  --text-numeral--letter-spacing: -0.03em;
  --text-numeral--font-weight: 700;

  --text-wordmark: clamp(4rem, 2.286rem + 8.571vw, 10rem);    /* 64 → 160px */
  --text-wordmark--line-height: 1;
  --text-wordmark--letter-spacing: -0.02em;
  --text-wordmark--font-weight: 800;

  /* ── Stable UI type ────────────────────────────────────────────────────── */
  /* Fixed rem: respects browser font size, ignores viewport width. These sit in
     containers with fixed padding and borders, which fluid text would distort. */
  --text-ui: 0.875rem;      /* 14px — nav links, eyebrows, skill labels */
  --text-ui--line-height: 1.4;

  --text-label: 0.8125rem;  /* 13px — breadcrumbs, pills, back-links */
  --text-label--line-height: 1.4;

  --text-meta: 0.75rem;     /* 12px — dates, tag pills */
  --text-meta--line-height: 1.35;
  --text-meta--letter-spacing: 0.01em;

  --text-menu: 2.25rem;     /* 36px — mobile full-screen menu links (sm:hidden) */
  --text-menu--line-height: 1.1;
  --text-menu--letter-spacing: -0.02em;

  /* em-relative on purpose: inline code must track the size of its host text. */
  --text-code: 0.9em;
```

- [ ] **Step 2: Verify the tokens reach the browser**

The dev server hot-reloads. Fetch the compiled stylesheet and assert the tokens are present:

```powershell
$page = (Invoke-WebRequest -Uri http://localhost:3000 -UseBasicParsing -TimeoutSec 120).Content
$sheet = ([regex]::Match($page, 'href="(/_next/static/[^"\\]*\.css)"')).Groups[1].Value
$css = (Invoke-WebRequest -Uri ("http://localhost:3000" + $sheet) -UseBasicParsing).Content
foreach ($t in @('--text-h1','--text-display','--text-title','--text-lead','--text-body','--text-body-sm','--text-clock','--text-numeral','--text-wordmark','--text-ui','--text-label','--text-meta','--text-menu','--text-code','--font-sans')) {
  if ($css -match [regex]::Escape($t + ':')) { "$t OK" } else { "$t MISSING" }
}
```

Expected: 15 lines, all `OK`. Tailwind v4 emits every `@theme` custom property to `:root`, so a `MISSING` here means the token name is malformed — font-size tokens must be `--text-*` exactly.

Note: the `.text-h1` *utility* will not exist in the CSS yet. Tailwind tree-shakes utilities by usage, and no call site uses them until Task 3.

- [ ] **Step 3: Confirm nothing changed visually**

```powershell
foreach ($p in @('/','/books','/projects','/blogs')) { $r = Invoke-WebRequest -Uri "http://localhost:3000$p" -UseBasicParsing -TimeoutSec 120; "$p -> $($r.StatusCode)" }
```

Expected: four `200` lines. This task is additive — if anything looks different in the browser, the edit touched an existing line it should not have.

- [ ] **Step 4: Commit**

```bash
git add src/app/globals.css
git commit -m "Add fluid typography tokens to the Tailwind theme"
```

---

### Task 2: Add the migration guard

A script that fails while legacy type classes remain. It is the executable definition of "done" for Tasks 3–10.

**Files:**
- Create: `scripts/check-typography.mjs`
- Modify: `package.json:9-14` (scripts block)

**Interfaces:**
- Consumes: the 14 token names declared in Task 1.
- Produces: `npm run check:type` — exits 0 when clean, exits 1 and prints `file:line` for each violation. Accepts optional path arguments to scope the scan: `node scripts/check-typography.mjs src/components/Nav.tsx`.

- [ ] **Step 1: Write the guard script**

Create `scripts/check-typography.mjs`:

```js
#!/usr/bin/env node
// Guards the typography system defined in
// docs/superpowers/specs/2026-08-11-fluid-typography-design.md
// Run: npm run check:type  [optional path filters]
import { readdirSync, readFileSync, statSync } from 'node:fs'
import { join, relative, sep } from 'node:path'

const ROOT = process.cwd()
const SRC = join(ROOT, 'src')
const EXTS = ['.ts', '.tsx', '.css']

// Legacy patterns that must not survive the migration.
const FORBIDDEN = [
  { re: /text-\[\d+(?:\.\d+)?px\]/g, why: 'hardcoded px font size — use a --text-* token' },
  { re: /\bt-(?:display|body|caption)\b/g, why: 'legacy .t-* class — use a --text-* token' },
  { re: /\bfont-(?:display|body|caption|footer)\b/g, why: 'legacy font-family utility — family is inherited from --font-sans' },
  { re: /\btext-(?:xs|sm|base|lg|xl|[2-9]xl)\b/g, why: "Tailwind's default size scale — use a --text-* token" },
]

// Every token the system promises. Missing one breaks call sites silently.
const REQUIRED_TOKENS = [
  'h1', 'display', 'title', 'lead', 'body', 'body-sm', 'clock', 'numeral',
  'wordmark', 'ui', 'label', 'meta', 'menu', 'code',
]

function walk(dir) {
  const out = []
  for (const entry of readdirSync(dir)) {
    const full = join(dir, entry)
    if (statSync(full).isDirectory()) out.push(...walk(full))
    else if (EXTS.some((e) => entry.endsWith(e))) out.push(full)
  }
  return out
}

const filters = process.argv.slice(2).map((f) => f.split('/').join(sep))
const files = walk(SRC).filter(
  (f) => filters.length === 0 || filters.some((flt) => f.includes(flt)),
)

const violations = []
for (const file of files) {
  const lines = readFileSync(file, 'utf8').split(/\r?\n/)
  lines.forEach((line, i) => {
    // Skip CSS comments, which legitimately quote old names while explaining history.
    const isCssComment = file.endsWith('.css') && /^\s*(\/\*|\*|--\s*\*\/)/.test(line)
    if (isCssComment) return
    for (const { re, why } of FORBIDDEN) {
      for (const m of line.matchAll(re)) {
        violations.push(`${relative(ROOT, file)}:${i + 1}  ${m[0]}  — ${why}`)
      }
    }
  })
}

// Positive check: the token layer itself must be intact. Only when unscoped,
// since a scoped run is not looking at globals.css.
const missing = []
if (filters.length === 0) {
  const css = readFileSync(join(SRC, 'app', 'globals.css'), 'utf8')
  for (const t of REQUIRED_TOKENS) {
    if (!css.includes(`--text-${t}:`)) missing.push(`--text-${t}`)
  }
}

if (violations.length) {
  console.error(`\n${violations.length} legacy type usage(s):\n`)
  for (const v of violations) console.error('  ' + v)
}
if (missing.length) {
  console.error(`\nMissing token declaration(s): ${missing.join(', ')}\n`)
}
if (violations.length || missing.length) process.exit(1)

console.log(`Typography clean — ${files.length} file(s) scanned, ${REQUIRED_TOKENS.length} tokens declared.`)
```

- [ ] **Step 2: Register the script**

In `package.json`, add to the `scripts` block after `"preview"`:

```json
    "check:type": "node scripts/check-typography.mjs"
```

Remember the comma on the preceding line.

- [ ] **Step 3: Run it and confirm it FAILS**

Run: `npm run check:type`

Expected: exit code 1, and a report listing roughly 145 violations across ~21 files — the 90 `.t-*` usages, ~58 hardcoded px sizes, the `font-*` family utilities, and the four Tailwind defaults in `portableText.ts`. It must NOT report missing tokens; if it does, Task 1 was incomplete.

This failing run is the point: it is the checklist Tasks 3–9 work through.

- [ ] **Step 4: Confirm the scoped mode works**

Run: `node scripts/check-typography.mjs src/components/Nav.tsx`

Expected: exit 1, listing exactly 2 violations — `Nav.tsx:54` (`t-body`) and `Nav.tsx:122` (`font-display`, `text-[36px]`, so 3 matches on 2 lines).

- [ ] **Step 5: Commit**

```bash
git add scripts/check-typography.mjs package.json
git commit -m "Add typography migration guard script"
```

---

### Task 3: Migrate the shell and hero

**Files:**
- Modify: `src/components/Nav.tsx:54,122`
- Modify: `src/components/NepalClock.tsx:30`
- Modify: `src/components/Hero.tsx:58,68,69`
- Modify: `src/app/page.tsx:54`

**Interfaces:**
- Consumes: `text-ui`, `text-menu`, `text-clock`, `text-display`, `text-body`, `text-wordmark` from Task 1.
- Produces: nothing other tasks depend on.

- [ ] **Step 1: Confirm the starting violations**

Run: `node scripts/check-typography.mjs src/components/Nav.tsx src/components/NepalClock.tsx src/components/Hero.tsx src/app/page.tsx`

Expected: exit 1 with 9 matches across 7 lines.

- [ ] **Step 2: Migrate `Nav.tsx`**

```diff
@@ src/components/Nav.tsx:54 — desktop nav links (chrome, stable)
-                    className={`t-body font-bold transition-colors ${
+                    className={`text-ui font-bold transition-colors ${

@@ src/components/Nav.tsx:122 — mobile full-screen menu links (sm:hidden)
-            className={`font-display text-[36px] transition-colors ${
+            className={`text-menu transition-colors ${
```

`font-display` is dropped because the family is now inherited from `--font-sans`. The nav logo at `Nav.tsx:41-45` is an `<img>`, not text — do not touch it.

- [ ] **Step 3: Migrate `NepalClock.tsx`**

```diff
@@ src/components/NepalClock.tsx:30
-      className="font-bitcount text-[11px] sm:text-[18px] text-white whitespace-nowrap tabular-nums"
+      className="font-bitcount text-clock text-white whitespace-nowrap tabular-nums"
```

`font-bitcount` stays — the clock is the one element that is not Bricolage.

- [ ] **Step 4: Migrate `Hero.tsx`**

```diff
@@ src/components/Hero.tsx:58 — hero name
-            <span className="t-display text-white leading-tight whitespace-nowrap">
+            <span className="text-display text-white whitespace-nowrap">

@@ src/components/Hero.tsx:68-69 — role and location
-          <span className="t-body font-bold pt-1 pb-0.5 text-accent-soft leading-tight">{role}</span>
-          <span className="t-body text-zinc-400 leading-tight">{location}</span>
+          {/* leading-tight is kept: these are single-line labels in a tight
+              stack, where text-body's 1.6 leading would open visible gaps. */}
+          <span className="text-body font-bold pt-1 pb-0.5 text-accent-soft leading-tight">{role}</span>
+          <span className="text-body text-zinc-400 leading-tight">{location}</span>
```

- [ ] **Step 5: Migrate the watermark in `page.tsx`**

```diff
@@ src/app/page.tsx:54
-          className="font-footer font-extrabold text-[64px] sm:text-[160px] leading-none text-center text-white pointer-events-none select-none overflow-hidden h-[50px] sm:h-[140px] mt-6 sm:mt-8"
+          className="text-wordmark text-center text-white pointer-events-none select-none overflow-hidden h-[0.8em] mt-6 sm:mt-8"
```

Three things happen on this line, all required:

1. `font-footer font-extrabold text-[64px] sm:text-[160px] leading-none` → `text-wordmark`, which carries 800 weight and leading 1.
2. `h-[50px] sm:h-[140px]` → `h-[0.8em]`. This is mandatory, not cosmetic: the fixed heights jump at 640px while the fluid font size does not, so the half-height crop would drift across widths. `em` height resolves against the element's own font-size, holding the crop ratio constant. Today's ratios are 50/64 = 0.78 and 140/160 = 0.875, so `0.8em` matches the mobile crop and is slightly tighter than the current desktop one.
3. `mt-6 sm:mt-8` and the `style={watermarkMask}` are untouched — spacing is a separate spec.

- [ ] **Step 6: Verify**

```powershell
node scripts/check-typography.mjs src/components/Nav.tsx src/components/NepalClock.tsx src/components/Hero.tsx src/app/page.tsx
$r = Invoke-WebRequest -Uri http://localhost:3000 -UseBasicParsing -TimeoutSec 120; "home -> $($r.StatusCode)"
```

Expected: guard prints `Typography clean — 4 file(s) scanned` and exits 0; home returns `200`.

Then look at the homepage in a browser at a narrow and a wide window. The watermark must still show roughly its top half at both, and the hero stack must not have opened up.

- [ ] **Step 7: Commit**

```bash
git add src/components/Nav.tsx src/components/NepalClock.tsx src/components/Hero.tsx src/app/page.tsx
git commit -m "Migrate shell and hero to typography tokens"
```

---

### Task 4: Migrate About, Core Skills, and Affiliations

**Files:**
- Modify: `src/components/About.tsx:86,117`
- Modify: `src/components/CoreSkills.tsx:31,32,50`
- Modify: `src/components/Affiliations.tsx:28,29,52`

**Interfaces:**
- Consumes: `text-body`, `text-ui`, `text-display`, `text-title` from Task 1.
- Produces: nothing other tasks depend on.

- [ ] **Step 1: Confirm the starting violations**

Run: `node scripts/check-typography.mjs src/components/About.tsx src/components/CoreSkills.tsx src/components/Affiliations.tsx`

Expected: exit 1 with 8 matches.

- [ ] **Step 2: Migrate `About.tsx`**

```diff
@@ src/components/About.tsx:86 — bio prose
-        className="t-body text-zinc-400 leading-relaxed text-left [&>p]:m-2"
+        className="text-body text-zinc-400 text-left [&>p]:m-2"

@@ src/components/About.tsx:117 — inline accent label
-              <span className="hidden sm:inline t-caption font-bold text-accent-soft leading-tight">
+              <span className="hidden sm:inline text-ui font-bold text-accent-soft leading-tight">
```

`leading-relaxed` is dropped on the bio — `text-body` supplies 1.6, which is what that utility was approximating. `leading-tight` is kept on line 117 because it is a single-line inline label.

- [ ] **Step 3: Migrate `CoreSkills.tsx`**

```diff
@@ src/components/CoreSkills.tsx:31-32
-        <span className="t-caption text-zinc-400 leading-tight">Core</span>
-        <h2 className="t-display text-white">Skills</h2>
+        <span className="text-ui text-zinc-400 leading-tight">Core</span>
+        <h2 className="text-display text-white">Skills</h2>

@@ src/components/CoreSkills.tsx:50 — pill label
-              <span className="t-caption font-bold text-white leading-none">{skill.label}</span>
+              <span className="text-ui font-bold text-white leading-none">{skill.label}</span>
```

`leading-none` is kept on line 50 — it controls the pill's height, not text rhythm.

- [ ] **Step 4: Migrate `Affiliations.tsx`**

```diff
@@ src/components/Affiliations.tsx:28-29
-        <span className="t-caption text-zinc-400 leading-tight">Built with others</span>
-        <h2 className="t-display text-white">Clubs & Events</h2>
+        <span className="text-ui text-zinc-400 leading-tight">Built with others</span>
+        <h2 className="text-display text-white">Clubs & Events</h2>

@@ src/components/Affiliations.tsx:52 — organisation name (a card title, not a section heading)
-              <span className="t-display text-silver">{aff.orgName}</span>
+              <span className="text-title text-silver">{aff.orgName}</span>
```

Line 52 is the role-wins rule in action: it used `t-display` but it is a card title, so it becomes `text-title` and drops from 28px to 22.5px on desktop. That is the intended separation from the "Clubs & Events" heading above it.

- [ ] **Step 5: Verify**

```powershell
node scripts/check-typography.mjs src/components/About.tsx src/components/CoreSkills.tsx src/components/Affiliations.tsx
$r = Invoke-WebRequest -Uri http://localhost:3000 -UseBasicParsing -TimeoutSec 120; "home -> $($r.StatusCode)"
```

Expected: guard clean, exit 0; home `200`. In the browser, the skill pills must not have changed height.

- [ ] **Step 6: Commit**

```bash
git add src/components/About.tsx src/components/CoreSkills.tsx src/components/Affiliations.tsx
git commit -m "Migrate About, Core Skills, and Affiliations to typography tokens"
```

---

### Task 5: Migrate the career section

**Files:**
- Modify: `src/components/Experience.tsx:43,44,58`
- Modify: `src/components/ExperienceItem.tsx:75,85,124,130`

**Interfaces:**
- Consumes: `text-ui`, `text-display`, `text-body-sm`, `text-title`, `text-meta`, `text-body` from Task 1.
- Produces: nothing other tasks depend on.

- [ ] **Step 1: Confirm the starting violations**

Run: `node scripts/check-typography.mjs src/components/Experience.tsx src/components/ExperienceItem.tsx`

Expected: exit 1 with 9 matches.

- [ ] **Step 2: Migrate `Experience.tsx`**

```diff
@@ src/components/Experience.tsx:43-44
-        <span className="t-caption text-zinc-400 leading-tight">So Far</span>
-        <h2 className="t-display text-white">Career</h2>
+        <span className="text-ui text-zinc-400 leading-tight">So Far</span>
+        <h2 className="text-display text-white">Career</h2>

@@ src/components/Experience.tsx:58 — career description prose
-              <p className="t-caption text-zinc-400 leading-relaxed whitespace-pre-line">
+              <p className="text-body-sm text-zinc-400 whitespace-pre-line">
```

Line 58 is prose, not a label — the other half of `.t-caption`'s split personality. It moves to `text-body-sm`, so desktop goes 16 → 14.4px, keeping it subordinate to the About bio.

- [ ] **Step 3: Migrate `ExperienceItem.tsx`**

```diff
@@ src/components/ExperienceItem.tsx:75 — role heading
-    <h4 className="font-display font-semibold text-[17px] sm:text-[18px] text-white leading-snug transition-colors duration-200 group-hover:text-accent-soft">
+    <h4 className="text-title text-white transition-colors duration-200 group-hover:text-accent-soft">

@@ src/components/ExperienceItem.tsx:85 — date range
-          <p className="t-caption text-zinc-400 leading-tight tabular-nums">{dateLabel}</p>
+          <p className="text-meta text-zinc-400 leading-tight tabular-nums">{dateLabel}</p>

@@ src/components/ExperienceItem.tsx:124 — company link
-              className="mt-1 inline-flex items-center gap-1.5 t-body font-bold text-accent-soft transition-colors duration-200 hover:text-accent"
+              className="mt-1 inline-flex items-center gap-1.5 text-body font-bold text-accent-soft transition-colors duration-200 hover:text-accent"

@@ src/components/ExperienceItem.tsx:130 — company name
-            <p className="mt-1 t-body font-bold text-accent-soft">{company}</p>
+            <p className="mt-1 text-body font-bold text-accent-soft">{company}</p>
```

On line 75, `font-semibold` and `leading-snug` are both dropped because `text-title` carries weight 600 and leading 1.3. `tabular-nums` and `leading-tight` stay on line 85 — a single-line date.

- [ ] **Step 4: Verify**

```powershell
node scripts/check-typography.mjs src/components/Experience.tsx src/components/ExperienceItem.tsx
$r = Invoke-WebRequest -Uri http://localhost:3000 -UseBasicParsing -TimeoutSec 120; "home -> $($r.StatusCode)"
```

Expected: guard clean, exit 0; home `200`. Expand a career entry in the browser and confirm the accordion still opens and the description reads at roughly 14px.

- [ ] **Step 5: Commit**

```bash
git add src/components/Experience.tsx src/components/ExperienceItem.tsx
git commit -m "Migrate career section to typography tokens"
```

---

### Task 6: Migrate the card components

**Files:**
- Modify: `src/components/Projects.tsx:37,38,40`
- Modify: `src/components/ProjectCard.tsx:54,60,70,83,107,119`
- Modify: `src/components/BookReview.tsx:31,32,34`
- Modify: `src/components/BookCard.tsx:28,34,35`

**Interfaces:**
- Consumes: `text-ui`, `text-display`, `text-label`, `text-title`, `text-body-sm`, `text-meta` from Task 1.
- Produces: nothing other tasks depend on.

- [ ] **Step 1: Confirm the starting violations**

Run: `node scripts/check-typography.mjs src/components/Projects.tsx src/components/ProjectCard.tsx src/components/BookReview.tsx src/components/BookCard.tsx`

Expected: exit 1 with 15 matches.

- [ ] **Step 2: Migrate `Projects.tsx`**

```diff
@@ src/components/Projects.tsx:37-38
-          <span className="text-[14px] text-zinc-400 leading-tight">Featured</span>
-          <h2 className="t-display text-white">Projects</h2>
+          <span className="text-ui text-zinc-400 leading-tight">Featured</span>
+          <h2 className="text-display text-white">Projects</h2>

@@ src/components/Projects.tsx:40 — "view all" link
-        <Link href="/projects" className="t-caption text-white hover:text-zinc-400 transition-colors">
+        <Link href="/projects" className="text-label text-white hover:text-zinc-400 transition-colors">
```

- [ ] **Step 3: Migrate `ProjectCard.tsx`**

```diff
@@ src/components/ProjectCard.tsx:54 — card title
-        <h3 className="t-display text-white leading-tight group-hover:text-zinc-400 transition-colors">
+        <h3 className="text-title text-white group-hover:text-zinc-400 transition-colors">

@@ src/components/ProjectCard.tsx:60 — card description
-      <p className="t-body text-zinc-400 leading-snug">{shortDescription}</p>
+      <p className="text-body-sm text-zinc-400">{shortDescription}</p>

@@ src/components/ProjectCard.tsx:70 and :83 — tech pills (both lines, identical change)
-              className="inline-flex items-center gap-1.5 t-caption text-zinc-500 border border-zinc-700 rounded-full px-2.5 py-0.5 hover:border-zinc-600 hover:text-zinc-400 transition-colors"
+              className="inline-flex items-center gap-1.5 text-label text-zinc-500 border border-zinc-700 rounded-full px-2.5 py-0.5 hover:border-zinc-600 hover:text-zinc-400 transition-colors"

@@ src/components/ProjectCard.tsx:107 — corner link
-          className="t-caption text-zinc-600 hover:text-white transition-colors shrink-0"
+          className="text-label text-zinc-600 hover:text-white transition-colors shrink-0"

@@ src/components/ProjectCard.tsx:119 — tag chip
-              className="bg-zinc-900 border border-zinc-800 rounded px-2 py-0.5 t-caption text-zinc-500 whitespace-nowrap leading-[16px]"
+              className="bg-zinc-900 border border-zinc-800 rounded px-2 py-0.5 text-meta text-zinc-500 whitespace-nowrap leading-[16px]"
```

Lines 70 and 83 are byte-identical; change both. `leading-[16px]` stays on line 119 — it fixes the chip height.

- [ ] **Step 4: Migrate `BookReview.tsx`**

```diff
@@ src/components/BookReview.tsx:31-32
-          <span className="text-[14px] text-zinc-400 leading-tight">Summarizing</span>
-          <h2 className="t-display text-white">Books</h2>
+          <span className="text-ui text-zinc-400 leading-tight">Summarizing</span>
+          <h2 className="text-display text-white">Books</h2>

@@ src/components/BookReview.tsx:34
-        <Link href="/books" className="t-caption text-white hover:text-zinc-400 transition-colors">
+        <Link href="/books" className="text-label text-white hover:text-zinc-400 transition-colors">
```

- [ ] **Step 5: Migrate `BookCard.tsx`**

```diff
@@ src/components/BookCard.tsx:28 — cover-fallback title
-          <span className="t-display text-zinc-400 line-clamp-3 leading-tight">{title}</span>
+          <span className="text-title text-zinc-400 line-clamp-3 leading-tight">{title}</span>

@@ src/components/BookCard.tsx:34-35 — title and author
-        <p className="t-display text-white leading-snug line-clamp-2">{title}</p>
-        <p className="t-caption text-zinc-400 mt-0.5 line-clamp-1">{author}</p>
+        <p className="text-title text-white line-clamp-2">{title}</p>
+        <p className="text-label text-zinc-400 mt-0.5 line-clamp-1">{author}</p>
```

`leading-tight` is kept on line 28 only: it is a 3-line clamped block inside a fixed-size cover placeholder, where looser leading would clip differently.

- [ ] **Step 6: Verify**

```powershell
node scripts/check-typography.mjs src/components/Projects.tsx src/components/ProjectCard.tsx src/components/BookReview.tsx src/components/BookCard.tsx
foreach ($p in @('/','/books')) { $r = Invoke-WebRequest -Uri "http://localhost:3000$p" -UseBasicParsing -TimeoutSec 120; "$p -> $($r.StatusCode)" }
```

Expected: guard clean, exit 0; both routes `200`. In the browser, confirm the tag chips and tech pills kept their shape and the card titles now read smaller than their section headings.

- [ ] **Step 7: Commit**

```bash
git add src/components/Projects.tsx src/components/ProjectCard.tsx src/components/BookReview.tsx src/components/BookCard.tsx
git commit -m "Migrate card components to typography tokens"
```

---

### Task 7: Migrate the list pages

**Files:**
- Modify: `src/app/blogs/page.tsx:47,58,90,96,100,110`
- Modify: `src/app/books/page.tsx:46`
- Modify: `src/app/projects/page.tsx:44,55`
- Modify: `src/components/BooksFilter.tsx:38,83`

**Interfaces:**
- Consumes: `text-label`, `text-body-sm`, `text-title`, `text-meta` from Task 1.
- Produces: nothing other tasks depend on.

- [ ] **Step 1: Confirm the starting violations**

Run: `node scripts/check-typography.mjs src/app/blogs/page.tsx src/app/books/page.tsx src/app/projects/page.tsx src/components/BooksFilter.tsx`

Expected: exit 1 with 20 matches.

- [ ] **Step 2: Migrate `blogs/page.tsx`**

```diff
@@ src/app/blogs/page.tsx:47 — breadcrumb
-          <nav className="flex items-center gap-2 mb-6 font-body text-[13px]" aria-label="Breadcrumb">
+          <nav className="flex items-center gap-2 mb-6 text-label" aria-label="Breadcrumb">

@@ src/app/blogs/page.tsx:58 — empty state
-            <p className="font-body text-[15px] text-zinc-600 text-center py-24">No posts yet</p>
+            <p className="text-body-sm text-zinc-600 text-center py-24">No posts yet</p>

@@ src/app/blogs/page.tsx:90 — post title
-                        className="font-display text-[17px] text-white leading-snug hover:text-zinc-300 transition-colors"
+                        className="text-title text-white hover:text-zinc-300 transition-colors"

@@ src/app/blogs/page.tsx:96 — date
-                        <p className="font-body text-[12px] text-zinc-600">{formatDate(blog.publishedAt)}</p>
+                        <p className="text-meta text-zinc-600">{formatDate(blog.publishedAt)}</p>

@@ src/app/blogs/page.tsx:100 — excerpt
-                        <p className="font-body text-[14px] text-zinc-500 leading-relaxed line-clamp-2">
+                        <p className="text-body-sm text-zinc-500 line-clamp-2">

@@ src/app/blogs/page.tsx:110 — tag chip
-                              className="bg-zinc-900 border border-zinc-800 rounded px-2 py-0.5 font-body text-[11px] text-zinc-500 whitespace-nowrap leading-[16px]"
+                              className="bg-zinc-900 border border-zinc-800 rounded px-2 py-0.5 text-meta text-zinc-500 whitespace-nowrap leading-[16px]"
```

- [ ] **Step 3: Migrate `books/page.tsx` and `projects/page.tsx`**

```diff
@@ src/app/books/page.tsx:46
-          <nav className="flex items-center gap-2 mb-6 font-body text-[13px]" aria-label="Breadcrumb">
+          <nav className="flex items-center gap-2 mb-6 text-label" aria-label="Breadcrumb">

@@ src/app/projects/page.tsx:44
-          <nav className="flex items-center gap-2 mb-6 font-body text-[13px]" aria-label="Breadcrumb">
+          <nav className="flex items-center gap-2 mb-6 text-label" aria-label="Breadcrumb">

@@ src/app/projects/page.tsx:55
-            <p className="font-body text-[15px] text-zinc-600 italic">No projects yet</p>
+            <p className="text-body-sm text-zinc-600 italic">No projects yet</p>
```

- [ ] **Step 4: Migrate `BooksFilter.tsx`**

```diff
@@ src/components/BooksFilter.tsx:38 — filter pill (inside a template literal)
-    `filter-pill inline-flex items-center gap-1.5 font-body text-[13px] px-3 py-1 rounded-full border transition-colors cursor-pointer ${
+    `filter-pill inline-flex items-center gap-1.5 text-label px-3 py-1 rounded-full border transition-colors cursor-pointer ${

@@ src/components/BooksFilter.tsx:83 — empty state
-        <p className="font-body text-[15px] text-zinc-600 italic">No books yet</p>
+        <p className="text-body-sm text-zinc-600 italic">No books yet</p>
```

- [ ] **Step 5: Verify**

```powershell
node scripts/check-typography.mjs src/app/blogs/page.tsx src/app/books/page.tsx src/app/projects/page.tsx src/components/BooksFilter.tsx
foreach ($p in @('/blogs','/books','/projects')) { $r = Invoke-WebRequest -Uri "http://localhost:3000$p" -UseBasicParsing -TimeoutSec 120; "$p -> $($r.StatusCode)" }
```

Expected: guard clean, exit 0; three `200` lines. Click a filter pill on `/books` and confirm it still toggles and keeps its shape.

- [ ] **Step 6: Commit**

```bash
git add src/app/blogs/page.tsx src/app/books/page.tsx src/app/projects/page.tsx src/components/BooksFilter.tsx
git commit -m "Migrate list pages to typography tokens"
```

---

### Task 8: Migrate the detail pages

**Files:**
- Modify: `src/app/blogs/[slug]/page.tsx:77,104,109,116,132,139`
- Modify: `src/app/books/[slug]/page.tsx:69,100,102,105,113,130,137`
- Modify: `src/app/projects/[slug]/page.tsx:74,104,106,116,129,157,174,181`

**Interfaces:**
- Consumes: `text-label`, `text-h1`, `text-meta`, `text-body`, `text-body-sm` from Task 1.
- Produces: nothing other tasks depend on.

- [ ] **Step 1: Confirm the starting violations**

Run: `node scripts/check-typography.mjs "src/app/blogs/[slug]/page.tsx" "src/app/books/[slug]/page.tsx" "src/app/projects/[slug]/page.tsx"`

Expected: exit 1 with 42 matches. Quote the paths — the square brackets are shell globbing characters.

- [ ] **Step 2: Migrate `blogs/[slug]/page.tsx`**

```diff
@@ :77 breadcrumb
-        <nav className="flex items-center gap-2 mb-6 font-body text-[13px]" aria-label="Breadcrumb">
+        <nav className="flex items-center gap-2 mb-6 text-label" aria-label="Breadcrumb">

@@ :104 page title
-        <h1 className="font-display text-[28px] sm:text-[34px] text-white leading-tight mb-3">{blog.title}</h1>
+        <h1 className="text-h1 text-white mb-3">{blog.title}</h1>

@@ :109 date
-            <span className="font-body text-[13px] text-zinc-600">{formatDate(blog.publishedAt)}</span>
+            <span className="text-meta text-zinc-600">{formatDate(blog.publishedAt)}</span>

@@ :116 tag chip
-                  className="bg-zinc-900 border border-zinc-800 rounded px-2 py-0.5 font-body text-[11px] text-zinc-500 whitespace-nowrap leading-[16px]"
+                  className="bg-zinc-900 border border-zinc-800 rounded px-2 py-0.5 text-meta text-zinc-500 whitespace-nowrap leading-[16px]"

@@ :132 empty state
-          <p className="font-body text-[16px] text-zinc-500 italic">No content yet.</p>
+          <p className="text-body text-zinc-500 italic">No content yet.</p>

@@ :139 back link
-            className="inline-flex items-center gap-1.5 font-body text-[13px] text-zinc-500 hover:text-white transition-colors"
+            className="inline-flex items-center gap-1.5 text-label text-zinc-500 hover:text-white transition-colors"
```

- [ ] **Step 3: Migrate `books/[slug]/page.tsx`**

```diff
@@ :69 breadcrumb
-        <nav className="flex items-center gap-2 mb-6 font-body text-[13px]" aria-label="Breadcrumb">
+        <nav className="flex items-center gap-2 mb-6 text-label" aria-label="Breadcrumb">

@@ :100 page title
-            <h1 className="font-display text-[28px] sm:text-[34px] text-white leading-tight">{book.title}</h1>
+            <h1 className="text-h1 text-white">{book.title}</h1>

@@ :102 author
-            <p className="font-body text-[14px] text-zinc-400 leading-relaxed">by {book.author}</p>
+            <p className="text-body-sm text-zinc-400">by {book.author}</p>

@@ :105 short description
-              <p className="font-body text-[14px] text-zinc-400 leading-relaxed">{book.shortDescription}</p>
+              <p className="text-body-sm text-zinc-400">{book.shortDescription}</p>

@@ :113 tag chip
-                    className="bg-zinc-900 border border-zinc-800 rounded px-2 py-0.5 font-body text-[11px] text-zinc-500 whitespace-nowrap leading-[16px]"
+                    className="bg-zinc-900 border border-zinc-800 rounded px-2 py-0.5 text-meta text-zinc-500 whitespace-nowrap leading-[16px]"

@@ :130 empty state
-          <p className="font-body text-[16px] text-zinc-500 italic">No review written yet.</p>
+          <p className="text-body text-zinc-500 italic">No review written yet.</p>

@@ :137 back link
-            className="inline-flex items-center gap-1.5 font-body text-[13px] text-zinc-500 hover:text-white transition-colors"
+            className="inline-flex items-center gap-1.5 text-label text-zinc-500 hover:text-white transition-colors"
```

- [ ] **Step 4: Migrate `projects/[slug]/page.tsx`**

```diff
@@ :74 breadcrumb
-        <nav className="flex items-center gap-2 mb-6 font-body text-[13px]" aria-label="Breadcrumb">
+        <nav className="flex items-center gap-2 mb-6 text-label" aria-label="Breadcrumb">

@@ :104 page title
-            <h1 className="font-display text-[28px] sm:text-[34px] text-white leading-tight">{project.title}</h1>
+            <h1 className="text-h1 text-white">{project.title}</h1>

@@ :106 short description
-            <p className="font-body text-[14px] text-zinc-400 leading-relaxed">{project.shortDescription}</p>
+            <p className="text-body-sm text-zinc-400">{project.shortDescription}</p>

@@ :116 and :129 link pills (both lines, identical change)
-                    className="inline-flex items-center gap-1.5 font-body text-[12px] text-zinc-500 border border-zinc-700 rounded-full px-3 py-1 hover:border-zinc-600 hover:text-zinc-400 transition-colors"
+                    className="inline-flex items-center gap-1.5 text-label text-zinc-500 border border-zinc-700 rounded-full px-3 py-1 hover:border-zinc-600 hover:text-zinc-400 transition-colors"

@@ :157 tag chip
-                    className="bg-zinc-900 border border-zinc-800 rounded px-2 py-0.5 font-body text-[11px] text-zinc-500 whitespace-nowrap leading-[16px]"
+                    className="bg-zinc-900 border border-zinc-800 rounded px-2 py-0.5 text-meta text-zinc-500 whitespace-nowrap leading-[16px]"

@@ :174 empty state
-          <p className="font-body text-[16px] text-zinc-500 italic">Write-up coming soon.</p>
+          <p className="text-body text-zinc-500 italic">Write-up coming soon.</p>

@@ :181 back link
-            className="inline-flex items-center gap-1.5 font-body text-[13px] text-zinc-500 hover:text-white transition-colors"
+            className="inline-flex items-center gap-1.5 text-label text-zinc-500 hover:text-white transition-colors"
```

Lines 116 and 129 are byte-identical; change both. Their pills go 12px → 13px, matching every other pill on the site.

- [ ] **Step 5: Verify**

```powershell
node scripts/check-typography.mjs "src/app/blogs/[slug]/page.tsx" "src/app/books/[slug]/page.tsx" "src/app/projects/[slug]/page.tsx"
foreach ($p in @('/blogs/why-nations-fail','/books/the-psychology-of-money','/projects/nsl-player-radar-knn')) { $r = Invoke-WebRequest -Uri "http://localhost:3000$p" -UseBasicParsing -TimeoutSec 120; "$p -> $($r.StatusCode)" }
```

Expected: guard clean, exit 0; three `200` lines.

- [ ] **Step 6: Commit**

```bash
git add "src/app/blogs/[slug]/page.tsx" "src/app/books/[slug]/page.tsx" "src/app/projects/[slug]/page.tsx"
git commit -m "Migrate detail pages to typography tokens"
```

---

### Task 9: Migrate the 404 page and rendered prose

`portableText.ts` emits raw HTML strings, so its classes use `class=`, not `className=`. Otherwise the substitutions are the same.

**Files:**
- Modify: `src/app/not-found.tsx:9,10,15`
- Modify: `src/lib/portableText.ts:72,84,85,104,107,110,114,119`

**Interfaces:**
- Consumes: `text-numeral`, `text-lead`, `text-label`, `text-code`, `text-body`, `text-h1`, `text-display`, `text-title` from Task 1.
- Produces: nothing other tasks depend on.

- [ ] **Step 1: Confirm the starting violations**

Run: `node scripts/check-typography.mjs src/app/not-found.tsx src/lib/portableText.ts`

Expected: exit 1 with 15 matches.

- [ ] **Step 2: Migrate `not-found.tsx`**

```diff
@@ src/app/not-found.tsx:9 — the 404 numeral
-        <h1 className="font-display text-[64px] sm:text-[96px] text-white leading-none">404</h1>
+        <h1 className="text-numeral text-white">404</h1>

@@ src/app/not-found.tsx:10 — lead paragraph
-        <p className="font-body text-[16px] sm:text-[19px] text-zinc-400">
+        <p className="text-lead text-zinc-400">

@@ src/app/not-found.tsx:15 — back link
-          className="inline-flex items-center gap-1.5 font-body text-[14px] text-zinc-500 hover:text-white transition-colors mt-2"
+          className="inline-flex items-center gap-1.5 text-label text-zinc-500 hover:text-white transition-colors mt-2"
```

- [ ] **Step 3: Migrate `portableText.ts`**

```diff
@@ src/lib/portableText.ts:72 — inline code
-        if (span.marks?.includes('code')) t = `<code class="bg-zinc-900 text-zinc-400 px-1 rounded text-sm">${t}</code>`
+        if (span.marks?.includes('code')) t = `<code class="bg-zinc-900 text-zinc-400 px-1 rounded text-code">${t}</code>`

@@ src/lib/portableText.ts:84-85 — lists
-            ? '<ul class="list-disc list-inside font-body text-[16px] text-zinc-400 leading-relaxed space-y-2 my-4 ml-4">'
-            : '<ol class="list-decimal list-inside font-body text-[16px] text-zinc-400 leading-relaxed space-y-2 my-4 ml-4">'
+            ? '<ul class="list-disc list-inside text-body text-zinc-400 space-y-2 my-4 ml-4">'
+            : '<ol class="list-decimal list-inside text-body text-zinc-400 space-y-2 my-4 ml-4">'

@@ src/lib/portableText.ts:104,107,110 — prose headings
-        parts.push(`<h1 class="font-display text-3xl text-white mt-10 mb-4 leading-tight">${inlineHtml}</h1>`)
+        parts.push(`<h1 class="text-h1 text-white mt-10 mb-4">${inlineHtml}</h1>`)
...
-        parts.push(`<h2 class="font-display text-2xl text-white mt-8 mb-3 leading-tight">${inlineHtml}</h2>`)
+        parts.push(`<h2 class="text-display text-white mt-8 mb-3">${inlineHtml}</h2>`)
...
-        parts.push(`<h3 class="font-display text-xl text-white mt-6 mb-2 leading-tight">${inlineHtml}</h3>`)
+        parts.push(`<h3 class="text-title text-white mt-6 mb-2">${inlineHtml}</h3>`)

@@ src/lib/portableText.ts:114 — blockquote
-          `<blockquote class="border-l-2 border-zinc-700 pl-4 my-4 font-body text-[16px] text-zinc-400 italic leading-relaxed">${inlineHtml}</blockquote>`
+          `<blockquote class="border-l-2 border-zinc-700 pl-4 my-4 text-body text-zinc-400 italic">${inlineHtml}</blockquote>`

@@ src/lib/portableText.ts:119 — paragraph
-          `<p class="font-body text-[16px] text-zinc-300 leading-relaxed mb-4">${inlineHtml}</p>`
+          `<p class="text-body text-zinc-300 mb-4">${inlineHtml}</p>`
```

The `mt-*` / `mb-*` / `my-*` / `ml-*` values are untouched — spacing is a separate spec.

- [ ] **Step 4: Verify**

```powershell
node scripts/check-typography.mjs src/app/not-found.tsx src/lib/portableText.ts
foreach ($p in @('/blogs/why-nations-fail','/no-such-page')) { try { $r = Invoke-WebRequest -Uri "http://localhost:3000$p" -UseBasicParsing -TimeoutSec 120; "$p -> $($r.StatusCode)" } catch { "$p -> $($_.Exception.Response.StatusCode.value__)" } }
```

Expected: guard clean, exit 0; the blog post `200` and the missing page `404`. Open the blog post and confirm its headings and paragraphs are sized, not unstyled — this is the file where a missed class would silently fall back to browser defaults.

- [ ] **Step 5: Commit**

```bash
git add src/app/not-found.tsx src/lib/portableText.ts
git commit -m "Migrate 404 page and rendered prose to typography tokens"
```

---

### Task 10: Delete the legacy layer and verify the whole system

Every call site is migrated, so the old scale can go. Removing Tailwind's default size scale makes the old habits impossible rather than merely discouraged.

**Files:**
- Modify: `src/app/globals.css` — remove lines 8-12 (commented Manrope block), the four legacy `--font-*` tokens, and the whole `@layer components` type block with its 640px media query; add `--text-*: initial`.

**Interfaces:**
- Consumes: the fully migrated call sites from Tasks 3–9.
- Produces: a codebase where `text-sm`, `t-body`, and `font-display` do not resolve to anything.

- [ ] **Step 1: Remove the legacy family tokens and commented block**

In the `@theme` block, delete these six lines entirely:

```css
  /* --font-display: 'Manrope', sans-serif;
  --font-body: 'Manrope', sans-serif;
  --font-caption: 'Inter', sans-serif;
  --font-bitcount: 'Bitcount Single', monospace;
  --font-footer: 'Manrope', sans-serif; */

  --font-display: var(--font-bricolage), sans-serif;
  --font-body: var(--font-bricolage), sans-serif;
  --font-caption: var(--font-bricolage), sans-serif;
  --font-footer: var(--font-bricolage), sans-serif;
```

Keep `--font-bitcount: var(--font-bitcount-single), monospace;` — `NepalClock` still uses it.

- [ ] **Step 2: Clear Tailwind's default font-size scale**

Add this as the first line of the fluid-type section added in Task 1, immediately above `--text-h1:`:

```css
  /* Clears Tailwind's built-in text-xs … text-9xl so the only sizes that exist
     are the ones below. A stray `text-sm` now fails loudly instead of quietly
     introducing a fourth scale. */
  --text-*: initial;
```

This must come after every call site is migrated — doing it earlier would have stripped the sizes off `portableText.ts` mid-migration.

- [ ] **Step 3: Delete the `.t-*` component classes**

Remove the entire block, comment header included:

```css
/* Typographic scale — three roles */
@layer components {
  /* Mobile-first base sizes; scale up to the approved desktop sizes at sm (640px). */
  .t-display { ... }
  .t-body { ... }
  .t-caption { ... }

  @media (min-width: 640px) {
    .t-display { ... }
    .t-body { ... }
    .t-caption { ... }
  }
}
```

Leave `.skill-inner-shadow`, `.easter-word`, `body.easter-unlocked .easter-word`, and the `html` scrollbar rules exactly as they are.

- [ ] **Step 4: Run the full guard**

Run: `npm run check:type`

Expected: exit 0 and `Typography clean — N file(s) scanned, 14 tokens declared.` Any remaining violation means a call site was missed in Tasks 3–9.

- [ ] **Step 5: Build**

Run: `npm run build`

Expected: `✓ Compiled successfully`, TypeScript finishes, 12 static pages generate, and the route table lists `/`, `/_not-found`, `/blogs`, `/blogs/[slug]`, `/books`, `/books/[slug]`, `/projects`, `/projects/[slug]`. The only acceptable warning is the pre-existing `Failed to find font override values for font 'Bitcount Single'`. A warning about an unknown utility means a class name is misspelled.

- [ ] **Step 6: Assert the utilities compiled**

```powershell
$page = (Invoke-WebRequest -Uri http://localhost:3000 -UseBasicParsing -TimeoutSec 120).Content
$sheet = ([regex]::Match($page, 'href="(/_next/static/[^"\\]*\.css)"')).Groups[1].Value
$css = (Invoke-WebRequest -Uri ("http://localhost:3000" + $sheet) -UseBasicParsing).Content
foreach ($u in @('text-display','text-title','text-body','text-body-sm','text-ui','text-label','text-meta','text-wordmark','text-clock')) {
  if ($css -match ('\.' + [regex]::Escape($u) + '[\s{,]')) { "$u utility OK" } else { "$u utility MISSING" }
}
if ($css -match 'clamp\(1\.44rem') { 'display clamp present' } else { 'display clamp MISSING' }
```

Expected: nine `OK` lines plus `display clamp present`. These are the homepage's utilities; `text-h1`, `text-lead`, `text-numeral`, `text-menu`, and `text-code` compile on other routes and are covered by the build in Step 5.

- [ ] **Step 7: Check every route**

```powershell
foreach ($p in @('/','/books','/projects','/blogs','/blogs/why-nations-fail','/books/the-psychology-of-money','/projects/nsl-player-radar-knn')) { $r = Invoke-WebRequest -Uri "http://localhost:3000$p" -UseBasicParsing -TimeoutSec 120; "$p -> $($r.StatusCode)" }
```

Expected: seven `200` lines.

- [ ] **Step 8: Verify sizes in a real browser**

This step needs a human or a browser tool — the assertions above prove the CSS is present, not that it computes correctly.

At viewport widths 320px, 768px, and 1440px, check computed `font-size` via DevTools:

| Element | 320px | 768px | 1440px |
|---|---|---|---|
| About bio (`text-body`) | 16.0px | 16.8px | 18.0px |
| Section heading (`text-display`) | 23.0px | 25.1px | 28.1px |
| Detail page `h1` (`text-h1`) | 27.7px | 30.7px | 35.2px |
| Breadcrumb (`text-label`) | 13px | 13px | 13px |
| Tag chip (`text-meta`) | 12px | 12px | 12px |

Allow ±0.2px for sub-pixel rounding. The stable rows must not vary at all — if they do, a stable token was defined with a `vw` term.

Also confirm the "SAUGATKC" watermark still shows roughly its top 80% at all three widths, with no drift at the 640px boundary.

- [ ] **Step 9: Verify 200% zoom**

Set browser zoom to 200% at a 1440px window. All text must roughly double. If any element stays put, its token lost its `rem` intercept and became `vw`-only, which fails WCAG 1.4.4.

- [ ] **Step 10: Commit**

```bash
git add src/app/globals.css
git commit -m "Remove legacy type scale and Tailwind default font sizes"
```

---

## Self-Review

**Spec coverage:** All 14 tokens are declared in Task 1. Font-family cleanup is split across Task 1 (add `--font-sans`) and Task 10 (remove the legacy four). Every row of the spec's migration tables maps to a task: semantic classes and hardcoded values across Tasks 3–8, `portableText.ts` in Task 9, the `.t-*` deletion and 640px media block in Task 10. The watermark crop fix is Task 3 Step 5. All five spec verification items appear in Task 10 Steps 4–9. The leading-utility rule is stated once up front and applied per diff.

**Placeholder scan:** No TBDs. Every code step shows the exact before and after text. Every verification step shows the command and its expected output. The two byte-identical line pairs (`ProjectCard.tsx:70/83`, `projects/[slug]:116/129`) are called out so a reader does not change only one.

**Type consistency:** Token names are identical everywhere — `text-body-sm` (not `text-small`), `text-menu` (not `text-nav-mark`, which the spec corrected), `text-code`, `text-clock`. The guard's `REQUIRED_TOKENS` list matches the 14 tokens declared in Task 1 exactly. `npm run check:type` and `node scripts/check-typography.mjs` are the same script, used unscoped and scoped respectively.

**Known ordering constraint:** `--text-*: initial` (Task 10 Step 2) must not move earlier — it would strip sizes from unmigrated call sites. Likewise the legacy `--font-*` tokens must not be removed before Task 9, since `portableText.ts` uses `font-body` and `font-display` until then.
