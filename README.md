# Kieran Sawyer portfolio

A static personal website built with [Astro](https://astro.build). No database, no server code, no trackers. See `BUILD_BRIEF.md` for the full brief and milestones.

**Status:** Milestone 1 (design and template slice). No CMS or hosting is configured yet.

## Running it

Requires Node.js 22.12 or newer.

```
npm install
npm run dev       # local site with live reload at http://localhost:4321
npm run build     # type-check, then build the static site into dist/
npm run preview   # serve the built dist/ folder locally
```

The contents of `dist/` are plain files that can be uploaded to any web host.

## Where things live

| Path | What it is |
| --- | --- |
| `src/content/projects/` | One Markdown file per project |
| `src/content/articles/` | One Markdown file per article |
| `src/content.config.ts` | Content schemas, plus the sector and capability lists used by the Work filters |
| `src/site.config.ts` | Site name, navigation, contact links, homepage strip and "How I work" copy |
| `src/styles/global.css` | Design tokens (colours, type, spacing) and shared styles |
| `src/components/` | Reusable building blocks (cards, stats, header, footer, placeholders) |
| `src/pages/` | Page templates. `work/[id].astro` and `writing/[id].astro` are the single reusable case-study and article routes |
| `astro.config.mjs` | Site address (currently a placeholder) and sitemap settings |

Editing content is covered in [`docs/CONTENT_GUIDE.md`](docs/CONTENT_GUIDE.md).

## Before launch

- Set the real domain in `astro.config.mjs` (`site`).
- Add approved contact details in `src/site.config.ts`.
- Replace every marked placeholder (search the built site for "placeholder", "To confirm" and "Draft copy").
- Delete the two sample articles.
- Add a default social sharing image.

Deployment, recovery and CMS instructions will be added in Milestones 2 and 4.
