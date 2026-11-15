import { defineCollection, reference } from 'astro:content';
import { glob } from 'astro/loaders';
import { z } from 'astro/zod';

/**
 * Controlled vocabularies. The Work page builds its filters from these,
 * so a typo in a content file fails the build instead of creating a stray filter.
 */
export const SECTORS = [
  'Consumer products',
  'Education',
  'Healthcare',
  'Enterprise',
  'E-commerce',
  'Aviation',
] as const;

export const CAPABILITIES = [
  'Product ownership',
  'Platform delivery',
  'Augmented reality',
  'Learning and engagement',
  'Systems integration',
  'Operational tools',
] as const;

const projects = defineCollection({
  loader: glob({ pattern: '**/*.md', base: './src/content/projects' }),
  schema: ({ image }) =>
    z.object({
      title: z.string(),
      summary: z.string(),
      /** Fuller description for the Work page and related-project cards. Falls back to `summary`. */
      listingSummary: z.string().optional(),
      sector: z.enum(SECTORS).optional(),
      capabilities: z.array(z.enum(CAPABILITIES)).default([]),
      featured: z.boolean().default(false),
      featuredOrder: z.number().optional(),

      /** Short qualifier shown on cards, e.g. "Earlier-career project". */
      note: z.string().optional(),
      clientDisplayName: z.string().optional(),

      /** true = a full case-study page is generated and cards link to it. */
      caseStudyReady: z.boolean().default(false),

      heroImage: image().optional(),
      heroImageAlt: z.string().optional(),
      /**
       * photo: fills its slot edge to edge (cropped to fit).
       * screenshot: shown as a floating screen so interface text stays legible.
       */
      heroImageStyle: z.enum(['photo', 'screenshot']).default('photo'),
      /** Which part of a photo to keep when it is cropped, e.g. "30% center" or "left top". */
      heroImagePosition: z.string().optional(),
      gallery: z
        .array(z.object({ src: image(), alt: z.string(), caption: z.string().optional() }))
        .default([]),
      video: z.object({ url: z.url(), title: z.string() }).optional(),
      assetPermissionStatus: z
        .enum(['not-requested', 'requested', 'approved', 'not-required'])
        .default('not-requested'),
      /** Colour of the generated placeholder panel used until a real image is approved. */
      tone: z.enum(['teal', 'deep', 'coral', 'sand']).default('teal'),

      /**
       * Case-study copy. Separate paragraphs with a blank line.
       * Start a paragraph with "PLACEHOLDER:" to render it as a marked "to confirm" note.
       */
      role: z.string().optional(),
      challenge: z.string().optional(),
      approach: z.string().optional(),
      contribution: z.string().optional(),
      outcomes: z.string().optional(),
      outcomeEvidence: z.string().optional(),

      stats: z
        .array(
          z.object({
            value: z.string(),
            label: z.string(),
            /** What the number does and does not mean. Always shown next to the figure. */
            context: z.string(),
            /** Where the figure comes from. Internal record; not rendered. */
            verification: z.string().optional(),
          }),
        )
        .default([]),

      /**
       * Case-study page extras. All optional: a section only appears when its field is filled in.
       */
      /** Small category line above the title, e.g. "Consumer products / Augmented reality". */
      kicker: z.string().optional(),
      /** One-sentence headline under the title. Falls back to `summary`. */
      headline: z.string().optional(),
      /** Short first-person introduction in the page header. */
      intro: z.string().optional(),
      /** Short supporting points shown beside the headline figure. */
      highlights: z.array(z.string()).default([]),
      overview: z.string().optional(),
      overviewImage: z.object({ src: image(), alt: z.string() }).optional(),
      challengePoints: z.array(z.string()).default([]),
      contributionPoints: z.array(z.string()).default([]),
      /** "How the platform evolved" panels, in order. Do not add dates unless verified. */
      evolution: z
        .array(
          z.object({
            title: z.string(),
            text: z.string(),
            image: image().optional(),
            imageAlt: z.string().optional(),
          }),
        )
        .default([]),
      outcomePoints: z.array(z.string()).default([]),

      relatedProjects: z.array(reference('projects')).default([]),
      draft: z.boolean().default(false),
      publishDate: z.coerce.date().optional(),
      seoDescription: z.string().optional(),
    }),
});

const articles = defineCollection({
  loader: glob({ pattern: '**/*.md', base: './src/content/articles' }),
  schema: ({ image }) =>
    z.object({
      title: z.string(),
      description: z.string(),
      date: z.coerce.date(),
      updated: z.coerce.date().optional(),
      category: z.string(),
      tags: z.array(z.string()).default([]),
      heroImage: image().optional(),
      heroImageAlt: z.string().optional(),
      draft: z.boolean().default(false),
      featured: z.boolean().default(false),
      seoDescription: z.string().optional(),
    }),
});

export const collections = { projects, articles };
