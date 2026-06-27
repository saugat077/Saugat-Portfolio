# Saugat K.C. — Portfolio (Frontend)

Next.js 16 (App Router, React 19) portfolio, statically exported and backed by Sanity for content.

## 🚀 Tech Stack

- **Next.js 16** — App Router, React Server Components, static HTML export (`output: 'export'`).
- **React 19** + **TypeScript** (strict). Every page and component is `.tsx`.
- **Tailwind CSS 4** via `@tailwindcss/postcss`.
- **Sanity** (`@sanity/client`, `@sanity/image-url`) for content, queried at build time.

## 📁 Project Structure

```text
src/
├── app/                     # App Router routes
│   ├── layout.tsx           # Root layout, global <head> metadata
│   ├── page.tsx             # Home
│   ├── not-found.tsx        # 404
│   ├── books/               # /books and /books/[slug]
│   ├── projects/            # /projects and /projects/[slug]
│   └── blogs/               # /blogs and /blogs/[slug]
├── components/              # Reusable UI (Server + 'use client' components)
└── lib/
    ├── sanity.ts            # Sanity client + image URL builder
    └── portableText.ts      # Portable Text → HTML renderer
```

Data is fetched in async Server Components. Interactive pieces — `Nav`, `NepalClock`,
`NameAudio`, `ProfilePhoto`, `BooksFilter` — are client components.

## 🔑 Environment

Create `.env` (already present locally, git-ignored):

```sh
PUBLIC_SANITY_PROJECT_ID=eqojbxmb
PUBLIC_SANITY_DATASET=production
SANITY_READ_TOKEN=...
```

## 🧞 Commands

| Command           | Action                                            |
| :---------------- | :------------------------------------------------ |
| `npm install`     | Install dependencies                              |
| `npm run dev`     | Start dev server at `localhost:3000`              |
| `npm run build`   | Build static site to `./out/`                     |
| `npm run preview` | Serve the built `./out/` locally                  |

> ⚠️ This workspace lives in OneDrive. If `npm install` fails with `EPERM`/file-lock
> errors, pause OneDrive sync and reinstall.
