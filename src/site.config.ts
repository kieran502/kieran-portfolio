/**
 * Site-wide settings. Edit this file to change the name, navigation,
 * contact links or the homepage copy that does not live in a content collection.
 */

export const site = {
  name: 'Kieran Sawyer',
  tagline: 'Product, technology and AI leadership',
  description:
    'Kieran Sawyer is a technology and product leader with more than 15 years of experience delivering digital products across healthcare, education, consumer products, enterprise and aviation.',
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
    title: 'Product strategy and ownership',
    text: 'Deciding what to build and why, then owning it through launch and ongoing improvement.',
  },
  {
    icon: 'technical',
    title: 'Technical direction',
    text: 'Solution architecture and platform decisions for complex digital products.',
  },
  {
    icon: 'ai',
    title: 'Practical AI and automation',
    text: 'Identifying where AI and automation are genuinely useful, and where they are not.',
  },
  {
    icon: 'team',
    title: 'Teams and stakeholders',
    text: 'Leading multidisciplinary teams and working closely with clients and stakeholders.',
  },
] as const;

/**
 * Homepage "How I work" principles.
 * EDITORIAL NOTE (not shown on the site): the supporting copy was drafted for Kieran and
 * should be confirmed as an accurate description of how he works before launch.
 */
export const approach = [
  {
    title: 'Find the real problem',
    text: 'I start with the people who will use and run the product. The brief a client arrives with is often a symptom of something else.',
  },
  {
    title: 'Build the right thing',
    text: 'I agree a scope the team can deliver and the budget can support, and leave out features that do not earn their place. That includes AI.',
  },
  {
    title: 'Keep it honest',
    text: 'Clients and teams hear about progress, risk and cost as they are, early enough to act on them.',
  },
  {
    title: 'Evolve with evidence',
    text: 'After launch, real usage and feedback decide what gets built next, not the original plan.',
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
    summary: 'A practical tool to help organisations assess whether an AI idea is worth pursuing.',
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
