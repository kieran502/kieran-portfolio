/**
 * Site-wide settings. Edit this file to change the name, navigation,
 * contact links or the homepage copy that does not live in a content collection.
 */

export const site = {
  name: 'Kieran Sawyer',
  tagline: 'Product, technology and AI leadership',
  description:
    'Kieran Sawyer: 15+ years of practical digital product and technology delivery across healthcare, education, consumer products, enterprise and aviation.',
  locale: 'en_GB',
};

/** Top navigation, in display order. Contact is rendered separately as a button. */
export const nav = [
  { label: 'Work', href: '/work/' },
  { label: 'Writing', href: '/writing/' },
  { label: 'Resources', href: '/resources/' },
  { label: 'About', href: '/about/' },
];

/**
 * Contact routes. Leave a value as null until it is approved for publication:
 * the contact section shows a clearly marked placeholder instead of a dead link.
 */
export const contact: { email: string | null; linkedin: string | null } = {
  email: null,
  linkedin: null,
};

/** Homepage capability strip. */
export const capabilities = [
  {
    icon: 'product',
    title: 'Product delivery',
    text: 'From first concept through launch and long-term operation.',
  },
  {
    icon: 'ai',
    title: 'AI in practice',
    text: 'Assessing where AI is genuinely useful, and putting it to work.',
  },
  {
    icon: 'technical',
    title: 'Technical leadership',
    text: 'Architecture, platform and integration decisions.',
  },
  {
    icon: 'team',
    title: 'Teams and stakeholders',
    text: 'Leading multidisciplinary teams; working with clients and sponsors.',
  },
] as const;

/** Homepage "How I work" steps. DRAFT COPY: written as a starting point for Kieran to rewrite. */
export const approach = [
  {
    title: 'Find the real problem',
    text: 'Start with the people involved and how the work actually happens, not with the technology.',
  },
  {
    title: 'Build the right thing',
    text: 'Shape a scope the team can genuinely deliver, then deliver it.',
  },
  {
    title: 'Keep it honest',
    text: 'Report progress, risk and results plainly, including what did not work.',
  },
  {
    title: 'Evolve with evidence',
    text: 'Let real usage, not assumptions, decide what comes next.',
  },
];

/**
 * Homepage "Practical resources" panel. These are planned, not yet published:
 * each links to the Resources page and is labelled "Planned" until it exists.
 * `format` keeps downloads and interactive tools clearly distinguished.
 */
export const plannedResources: { title: string; format: 'interactive' | 'pdf'; summary: string }[] = [
  {
    title: 'AI Opportunity Assessment',
    format: 'interactive',
    summary: 'A questionnaire that runs entirely in your browser. No visitor data is collected or stored.',
  },
  {
    title: 'Practical guides',
    format: 'pdf',
    summary: 'Downloadable guides to read offline.',
  },
];

/**
 * "Selected organisations I've worked with" (homepage).
 * A logo is shown only when its official artwork is saved as src/assets/logos/<logo>.svg
 * (or .png / .webp) AND permission to use it has been checked. Leave an organisation's
 * file out to hide it. Never substitute text or redrawn artwork for a logo.
 */
export const organisations = [
  { name: 'NHS', logo: 'nhs' },
  { name: 'Royal Air Force', logo: 'raf' },
  { name: 'Costa Coffee', logo: 'costa' },
  { name: 'Delta Air Lines', logo: 'delta' },
  { name: 'University of Oxford', logo: 'oxford' },
  { name: 'University College London (UCL)', logo: 'ucl' },
  { name: 'GSK', logo: 'gsk' },
  { name: 'Novartis', logo: 'novartis' },
  { name: 'Unilever', logo: 'unilever' },
  { name: 'Nissan', logo: 'nissan' },
  { name: 'BBC', logo: 'bbc' },
  { name: 'Royal Navy', logo: 'royal-navy' },
  // Added by Kieran alongside the original shortlist.
  { name: 'Channel 4', logo: 'channel4' },
  { name: 'HSBC', logo: 'hsbc' },
  { name: 'JLR', logo: 'jlr' },
  { name: 'Johnson & Johnson', logo: 'jnj' },
  { name: 'Lilly', logo: 'lilly' },
  { name: 'Sky', logo: 'sky' },
  { name: 'Takeda', logo: 'takeda' },
];
