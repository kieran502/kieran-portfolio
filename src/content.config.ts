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

/**
 * Portfolio classification vocabularies (see `classification` below).
 * Shared across every project so the Work page can later filter by them
 * ("Product ownership", "AI adoption" and so on). Add a value here before using it.
 * Only add a value to a project when there is evidence for it.
 */
export const INDUSTRIES = ['Healthcare', 'Pharmaceuticals', 'Education and training'] as const;

export const PROJECT_TYPES = [
  'SaaS platform',
  'Enterprise software',
  'Learning management',
  'Digital training',
  'Interactive learning',
  'Applied AI experimentation',
] as const;

export const SKILLS = [
  'Product strategy',
  'Product ownership',
  'Technical leadership',
  'Team leadership',
  'Stakeholder management',
  'Commercial development',
  'Roadmap prioritisation',
  'Security and compliance',
  'AI adoption',
  'International delivery',
] as const;

export const TECHNOLOGIES = [
  'PHP',
  'Laravel',
  'MariaDB',
  'AWS',
  'Laravel Forge',
  'JavaScript',
  'Unity',
  'C#',
  'OpenAI API',
  'Amazon Polly',
] as const;

export const INVOLVEMENT = [
  'Original concept and product direction',
  'Product ownership',
  'Technical leadership',
  'Team management',
  'Commercial and client engagement',
  'Ongoing support and maintenance',
] as const;

/** How directly I was responsible for the project as a whole. */
export const INVOLVEMENT_LEVELS = ['Led', 'Core contributor', 'Contributor', 'Advisory'] as const;

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
      /**
       * Either `file` (a video saved in the project's folder, e.g. mardles.mp4, shown in a
       * player on the page) or `url` (a video hosted elsewhere, shown as a link).
       * `poster` is the still shown before the video plays.
       */
      video: z
        .object({
          title: z.string(),
          file: z.string().optional(),
          url: z.url().optional(),
          poster: image().optional(),
          caption: z.string().optional(),
        })
        .refine((video) => video.file || video.url, { message: 'A video needs a `file` or a `url`.' })
        .optional(),
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

      /**
       * Structured portfolio metadata, kept consistent across projects for future filtering.
       * Title, summary, outcomes, imagery and the case-study URL already live in the fields above.
       */
      classification: z
        .object({
          industries: z.array(z.enum(INDUSTRIES)).default([]),
          projectTypes: z.array(z.enum(PROJECT_TYPES)).default([]),
          /** Every skill needs the evidence behind it. `featured` ones are shown on the case study. */
          skills: z
            .array(
              z.object({
                skill: z.enum(SKILLS),
                evidence: z.string(),
                featured: z.boolean().default(false),
              }),
            )
            .default([]),
          /**
           * core: part of the main product. additional: used for selected parts.
           * pilot: trialled, not fully deployed.
           */
          technologies: z
            .array(
              z.object({
                name: z.enum(TECHNOLOGIES),
                usage: z.enum(['core', 'additional', 'pilot']).default('core'),
                note: z.string().optional(),
              }),
            )
            .default([]),
          involvement: z
            .object({
              level: z.enum(INVOLVEMENT_LEVELS),
              areas: z.array(z.enum(INVOLVEMENT)).default([]),
            })
            .optional(),
          /**
           * Key highlights shown at the top of a case study: scale figures and verified
           * results. Kept apart from `stats`, which also feed the homepage outcome strip.
           * `unit` sits beside the figure (e.g. "in revenue"); `label` sits beneath it.
           */
          keyFacts: z
            .array(
              z.object({
                value: z.string(),
                unit: z.string().optional(),
                label: z.string(),
                context: z.string().optional(),
                kind: z.enum(['outcome', 'scale']).default('scale'),
              }),
            )
            .default([]),
        })
        .optional(),

      /** true = the case study has its own page in src/pages/work/ instead of the shared template. */
      customCaseStudy: z.boolean().default(false),

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
