import type { ImageMetadata } from 'astro';
import { getCollection, type CollectionEntry } from 'astro:content';

export type Project = CollectionEntry<'projects'>;
export type Article = CollectionEntry<'articles'>;

/** Drafts are visible while developing (`npm run dev`) and excluded from the built site. */
const showDrafts = import.meta.env.DEV;

/** All publishable projects: featured first (by featuredOrder), then alphabetical. */
export async function getProjects(): Promise<Project[]> {
  const all = await getCollection('projects', ({ data }) => showDrafts || !data.draft);
  return all.sort((a, b) => {
    if (a.data.featured !== b.data.featured) return a.data.featured ? -1 : 1;
    const order = (a.data.featuredOrder ?? 999) - (b.data.featuredOrder ?? 999);
    return order !== 0 ? order : a.data.title.localeCompare(b.data.title);
  });
}

/** All publishable articles, newest first. */
export async function getArticles(): Promise<Article[]> {
  const all = await getCollection('articles', ({ data }) => showDrafts || !data.draft);
  return all.sort((a, b) => b.data.date.valueOf() - a.data.date.valueOf());
}

/**
 * Hero images are picked up automatically: a file named hero.jpg, hero.jpeg, hero.png
 * or hero.webp in a project's folder is used without any setting in index.md.
 */
const heroFiles = import.meta.glob<{ default: ImageMetadata }>(
  '../content/projects/*/hero.{jpg,jpeg,png,webp,JPG,JPEG,PNG,WEBP}',
  { eager: true },
);

const heroByProject = new Map<string, ImageMetadata>(
  Object.entries(heroFiles).map(([path, module]) => [path.split('/').at(-2) ?? '', module.default]),
);

/** A project's hero image: an explicit `heroImage` in index.md wins, otherwise the hero.* file. */
export const getHeroImage = (project: Project): ImageMetadata | undefined =>
  project.data.heroImage ?? heroByProject.get(project.id);

export const projectUrl = (project: Project) => `/work/${project.id}/`;
export const articleUrl = (article: Article) => `/writing/${article.id}/`;

const PLACEHOLDER_PREFIX = /^PLACEHOLDER:\s*/i;

/** Splits copy into paragraphs and flags those marked "PLACEHOLDER:". */
export function parseCopy(text?: string): { text: string; placeholder: boolean }[] {
  if (!text) return [];
  return text
    .split(/\n\s*\n/)
    .map((p) => p.replace(/\s+/g, ' ').trim())
    .filter(Boolean)
    .map((p) => ({
      placeholder: PLACEHOLDER_PREFIX.test(p),
      text: p.replace(PLACEHOLDER_PREFIX, ''),
    }));
}

const dateFormat = new Intl.DateTimeFormat('en-GB', {
  day: 'numeric',
  month: 'long',
  year: 'numeric',
  timeZone: 'UTC',
});

export const formatDate = (date: Date) => dateFormat.format(date);

/** Rough reading time in minutes, from the Markdown source. */
export function readingTime(body?: string): number {
  const words = (body ?? '').split(/\s+/).filter(Boolean).length;
  return Math.max(1, Math.round(words / 220));
}
