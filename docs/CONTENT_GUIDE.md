# Content guide

All content is plain Markdown files. Each file starts with a block of settings between two `---` lines (the "frontmatter"), followed by the body text. If a required setting is missing or misspelt, `npm run build` stops and names the file and field.

A browser-based editor is planned for Milestone 2. Until then, files are edited directly.

## Articles

Add a file to `src/content/articles/`. The file name becomes the web address: `my-first-post.md` is published at `/writing/my-first-post/`.

```markdown
---
title: The article title
description: One or two sentences shown under the title and on listing pages.
date: 2026-12-01
category: Product
tags:
  - delivery
featured: false
draft: false
---

The article body goes here, in Markdown.
```

Optional settings: `updated` (a date), `heroImage` (path to an image stored next to the article, for example `./my-photo.jpg`), `heroImageAlt`, `seoDescription`.

- `draft: true` hides the article from the built site. It still appears with `npm run dev`.
- `featured: true` makes it the lead item on the Writing page.
- Reading time, related articles and listing cards are generated automatically.

## Projects

Each project has its own folder in `src/content/projects/`, holding an `index.md` file and that project's images:

```
src/content/projects/
  mardles/
    index.md      the project text and settings
    hero.jpg      main image (cards and case-study header); .jpg, .jpeg, .png or .webp
    gallery-1.jpg further images for the case-study gallery
```

The folder name becomes the web address: `mardles/` is published at `/work/mardles/`. The main image needs no setting: any file named `hero.jpg`, `hero.jpeg`, `hero.png` or `hero.webp` in the project's folder is used automatically, so you can replace it with a different format at any time. Keep only one `hero` file per folder. Add `heroImageAlt: a short description` to `index.md` so the image is described for screen readers.

Organisation logos on the homepage: save each organisation's official logo in `src/assets/logos/`, named as listed in `src/site.config.ts` (for example `costa-coffee.svg`; `.png` and `.webp` also work). A logo appears as soon as its file is there, and the section stays hidden while the folder is empty. Only add a logo once you have checked you are allowed to use it.

Case-study extras, all optional: `listingSummary` (fuller description for the Work page), `kicker`, `headline`, `intro`, `highlights`, `overview`, `overviewImage`, `challengePoints`, `contributionPoints`, `evolution` (each panel takes `title`, `text` and optionally `image: ./file.jpg` with `imageAlt`), `outcomePoints` and `gallery` (each entry takes `src: ./file.jpg`, `alt` and optionally `caption`). A section only appears when its field is filled in. See `mardles/index.md` for a worked example. Notes for your own reference go in lines starting with `#`; these are never shown on the site.

Optional: `heroImageStyle: screenshot` shows an interface screenshot as a floating screen instead of cropping it, and `heroImagePosition` (for example `30% center`) chooses which part of a photo to keep when it is cropped.

To add a project, create a new folder with an `index.md`. Only `title` and `summary` are required, so a short entry is quick to publish:

```markdown
---
title: Project name
summary: One sentence describing the project.
sector: Healthcare
capabilities:
  - Learning and engagement
---
```

That creates a card on the Work page marked "Case study in preparation".

### Turning a project into a full case study

Set `caseStudyReady: true` and fill in whichever of these you have. Anything left out simply does not appear on the page.

| Setting | Purpose |
| --- | --- |
| `role`, `challenge`, `approach`, `contribution`, `outcomes` | The main sections. Leave a blank line between paragraphs |
| `outcomeEvidence` | A note explaining what the outcome figures do and do not claim |
| `stats` | Headline figures. Each needs `value`, `label` and `context`; `verification` records the source and is not shown |
| `heroImage`, `heroImageAlt`, `gallery`, `video` | Approved media only |
| `assetPermissionStatus` | `not-requested`, `requested`, `approved` or `not-required` |
| `relatedProjects` | Folder names of related projects |
| `featured`, `featuredOrder` | Show on the homepage and at the top of the Work page |
| `note` | A short qualifier on the card, for example "Earlier-career project" |
| `tone` | Colour of the placeholder panel until a real image exists: `teal`, `deep`, `coral` or `sand` |

Anything written below the frontmatter is shown as free-form text at the end of the case study.

See `src/content/projects/mardles/index.md` for a worked example.

### Marking copy that still needs confirming

Start a paragraph with `PLACEHOLDER:` and it is displayed as a clearly marked "To confirm" note instead of as finished copy:

```yaml
challenge: |
  PLACEHOLDER: The problem this project set out to solve.
```

Remove every placeholder before launch.

### Sectors and capabilities

The allowed values are listed at the top of `src/content.config.ts`. To add a new one, add it to that list first. The Work page filters update automatically.

## Site-wide text

The site name, navigation, contact links, the homepage capability strip and the "How I work" steps are in `src/site.config.ts`. The homepage headline and introduction are in `src/pages/index.astro`.
