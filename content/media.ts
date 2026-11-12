/**
 * Every image, video and download the site references. Files live in /public.
 * When a file is missing, the site renders a labelled copper-tint placeholder slot
 * instead (see lib/media.server.ts) — drop the real file in at the same path and rebuild.
 *
 * Alt text for each id lives in messages (`alt.<id>`) in all three languages.
 *
 * The six industry scenes (scene-cnc … scene-gift) are AI-generated stock images (Higgsfield,
 * GPT Image 2.6). They deliberately do not show the hammer, so they never misrepresent the product.
 * DO NOT USE: /images/real-case-label-TYPO-reshoot.jpg and /assets/images/field-hold/*
 * (label reads "Cooper", lid sticker mirrored) — they are deliberately not listed here.
 */
export type MediaKind = 'cutout' | 'render' | 'photo' | 'scene' | 'graphic';

export type MediaEntry = {
  src: string;
  /** width / height, measured from the files. The wide workshop scene and the map are still estimates. */
  aspect: number;
  kind: MediaKind;
};

export const media = {
  heroCutout: { src: '/images/hero-angled-cutout.png', aspect: 1712 / 1525, kind: 'cutout' },
  angledWhite: { src: '/images/angled-white.jpg', aspect: 1, kind: 'render' },
  angledLongWhite: { src: '/images/angled-long-white.jpg', aspect: 1, kind: 'render' },
  sideViewWhite: { src: '/images/side-view-white.jpg', aspect: 1, kind: 'render' },
  detailHead: { src: '/images/detail-head.jpg', aspect: 892 / 490, kind: 'render' },
  detailGrip: { src: '/images/detail-grip.jpg', aspect: 900 / 518, kind: 'render' },
  detailShaft: { src: '/images/detail-shaft.jpg', aspect: 892 / 518, kind: 'render' },
  caseOpenRender: { src: '/images/case-open-render.jpg', aspect: 3 / 4, kind: 'render' },
  realHammerOnWood: { src: '/images/real-hammer-on-wood.jpg', aspect: 3 / 4, kind: 'photo' },
  realCaseOpen: { src: '/images/real-case-open.jpg', aspect: 3 / 4, kind: 'photo' },
  realCaseClosed: { src: '/images/real-case-closed.jpg', aspect: 3 / 4, kind: 'photo' },
  dimensionsEn: { src: '/images/premium-hammer-dimensions-en.webp', aspect: 2400 / 1640, kind: 'graphic' },
  dimensionsSl: { src: '/images/premium-hammer-dimensions-sl.webp', aspect: 2400 / 1640, kind: 'graphic' },
  dimensionsDe: { src: '/images/premium-hammer-dimensions-de.webp', aspect: 2400 / 1640, kind: 'graphic' },
  comparisonVsSteel: { src: '/images/comparison-vs-steel-hammer.jpg', aspect: 1512 / 1612, kind: 'photo' },
  field01: { src: '/images/field/field-01-door-hinge.jpg', aspect: 1126 / 2000, kind: 'photo' },
  field02: { src: '/images/field/field-02-in-hand.jpg', aspect: 1126 / 2000, kind: 'photo' },
  field03: { src: '/images/field/field-03-site-brick.jpg', aspect: 1126 / 2000, kind: 'photo' },
  field04: { src: '/images/field/field-04-site-telehandler.jpg', aspect: 1126 / 2000, kind: 'photo' },
  field05: { src: '/images/field/field-05-site-telehandler-2.jpg', aspect: 1126 / 2000, kind: 'photo' },
  field06: { src: '/images/field/field-06-site-scaffold.jpg', aspect: 1126 / 2000, kind: 'photo' },
  field07: { src: '/images/field/field-07-in-motion.jpg', aspect: 1126 / 2000, kind: 'photo' },
  sceneCnc: { src: '/images/scene-cnc.jpg', aspect: 2336 / 1744, kind: 'scene' },
  sceneBearing: { src: '/images/scene-bearing.jpg', aspect: 2336 / 1744, kind: 'scene' },
  sceneAutomotive: { src: '/images/scene-automotive.jpg', aspect: 2336 / 1744, kind: 'scene' },
  sceneMaintenance: { src: '/images/scene-maintenance.jpg', aspect: 2336 / 1744, kind: 'scene' },
  sceneElectromech: { src: '/images/scene-electromech.jpg', aspect: 2336 / 1744, kind: 'scene' },
  sceneGift: { src: '/images/scene-gift.jpg', aspect: 2336 / 1744, kind: 'scene' },
  sceneWorkshopWide: { src: '/images/scene-workshop-wide.jpg', aspect: 21 / 9, kind: 'scene' },
  // TODO(owner): static map image of Podovnice 1 (e.g. an exported OpenStreetMap tile with attribution).
  contactMap: { src: '/images/map-notranje-gorice.jpg', aspect: 16 / 9, kind: 'graphic' },
  unboxingPoster: { src: '/video/unboxing-poster.jpg', aspect: 608 / 1080, kind: 'photo' },
} as const satisfies Record<string, MediaEntry>;

export type MediaId = keyof typeof media;

export const files = {
  logoWhite: '/brand/logo-tomstroj-white.png',
  logoBlack: '/brand/logo-tomstroj-black.png',
  unboxingVideo: '/video/unboxing-first-customer.mp4',
  brochureEn: '/downloads/premium-hammer-brochure-en.pdf',
  brochureSl: '/downloads/premium-hammer-brosura-sl.pdf',
  // TODO(owner): German brochure PDF.
  brochureDe: '/downloads/premium-hammer-broschuere-de.pdf',
} as const;

export function dimensionsId(locale: string): MediaId {
  return locale === 'sl' ? 'dimensionsSl' : locale === 'de' ? 'dimensionsDe' : 'dimensionsEn';
}

export const productGallery: readonly MediaId[] = [
  'heroCutout',
  'sideViewWhite',
  'angledWhite',
  'detailHead',
  'detailGrip',
  'detailShaft',
  'caseOpenRender',
  // Real field photos come right after the renders (brief §13.1).
  'field01',
  'field02',
  'field06',
  'realCaseOpen',
  'realCaseClosed',
  // The locale's dimensions graphic is appended at render time.
];

export const fieldGallery: readonly MediaId[] = ['field01', 'field02', 'field03', 'field04', 'field05', 'field06', 'field07'];

export const industries = [
  { id: 'cnc', scene: 'sceneCnc', icon: 'Cog' },
  { id: 'bearing', scene: 'sceneBearing', icon: 'CircleDot' },
  { id: 'automotive', scene: 'sceneAutomotive', icon: 'Car' },
  { id: 'maintenance', scene: 'sceneMaintenance', icon: 'Wrench' },
  { id: 'electromech', scene: 'sceneElectromech', icon: 'Cpu' },
  { id: 'gift', scene: 'sceneGift', icon: 'Gift' },
] as const satisfies readonly { id: string; scene: MediaId; icon: string }[];
