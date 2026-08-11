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
  {
    re: /\bfont-(?:display|body|caption|footer)\b/g,
    why: 'legacy font-family utility — family is inherited from --font-sans',
  },
  {
    re: /\btext-(?:xs|sm|base|lg|xl|[2-9]xl)\b/g,
    why: "Tailwind's default size scale — use a --text-* token",
  },
]

// Every token the system promises. Missing one breaks call sites silently.
const REQUIRED_TOKENS = [
  'h1',
  'display',
  'title',
  'lead',
  'body',
  'body-sm',
  'clock',
  'numeral',
  'wordmark',
  'ui',
  'label',
  'meta',
  'menu',
  'code',
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

// Blank out /* ... */ blocks while preserving line numbers, so comments that
// legitimately quote old names while explaining history do not trip the guard.
function stripBlockComments(source) {
  return source.replace(/\/\*[\s\S]*?\*\//g, (match) => match.replace(/[^\n]/g, ' '))
}

const violations = []
for (const file of files) {
  const raw = readFileSync(file, 'utf8')
  const lines = stripBlockComments(raw).split(/\r?\n/)
  lines.forEach((line, i) => {
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

console.log(
  `Typography clean — ${files.length} file(s) scanned, ${REQUIRED_TOKENS.length} tokens declared.`,
)
