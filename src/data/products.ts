export type Color = { name: string; hex: string };
export type Product = {
  slug: string;
  name: string;
  category: 'quotidien' | 'sport' | 'hiver' | 'packs';
  price: number; // DT
  oldPrice?: number;
  badge?: string;
  sizes: string[];
  colors: Color[];
  short: string;
  description: string;
  details: string[];
  pattern?: 'plain' | 'stripes' | 'dots' | 'rib';
  height: 'crew' | 'ankle' | 'invisible' | 'knee';
};

export const DELIVERY_FEE = 7; // DT
export const FREE_DELIVERY_FROM = 80; // DT

export const CATEGORIES: { id: Product['category']; label: string; blurb: string }[] = [
  { id: 'quotidien', label: 'Quotidien', blurb: 'Coton doux pour tous les jours' },
  { id: 'sport', label: 'Sport', blurb: 'Amorti et respirantes' },
  { id: 'hiver', label: 'Hiver', blurb: 'Laine chaude et épaisse' },
  { id: 'packs', label: 'Packs', blurb: 'Plus de paires, moins cher' },
];

const SIZES = ['35-38', '39-42', '43-46'];
const C = {
  noir: { name: 'Noir', hex: '#1d1d1f' },
  blanc: { name: 'Blanc', hex: '#f5f3ee' },
  gris: { name: 'Gris chiné', hex: '#9a9ca1' },
  marine: { name: 'Bleu marine', hex: '#1f2f57' },
  vert: { name: 'Vert forêt', hex: '#0f3d33' },
  beige: { name: 'Beige', hex: '#d9c7a7' },
  bordeaux: { name: 'Bordeaux', hex: '#6d1f2c' },
  moutarde: { name: 'Moutarde', hex: '#c99a2e' },
};

export const PRODUCTS: Product[] = [
  {
    slug: 'classic-crew', name: 'Classic Crew', category: 'quotidien', price: 12,
    sizes: SIZES, colors: [C.noir, C.blanc, C.gris, C.marine], height: 'crew', pattern: 'rib',
    short: 'La chaussette de tous les jours',
    description: 'Mi-mollet en coton peigné, avec une bord-côte qui tient sans serrer. La paire qui va avec tout.',
    details: ['80% coton peigné, 17% polyamide, 3% élasthanne', 'Talon et pointe renforcés', 'Lavage 40°C'],
  },
  {
    slug: 'invisible-pro', name: 'Invisible Pro', category: 'quotidien', price: 9,
    sizes: SIZES, colors: [C.noir, C.blanc, C.beige], height: 'invisible', pattern: 'plain',
    short: 'Invisible dans la chaussure',
    description: 'Protège-pied avec silicone au talon pour ne jamais glisser. Idéal avec baskets basses et mocassins.',
    details: ['Silicone anti-glisse au talon', 'Coton respirant', 'Coutures plates'],
  },
  {
    slug: 'sport-cushion', name: 'Sport Cushion', category: 'sport', price: 15, badge: 'Best-seller',
    sizes: SIZES, colors: [C.blanc, C.noir, C.gris], height: 'ankle', pattern: 'stripes',
    short: 'Amorti pour courir et marcher',
    description: 'Semelle bouclette pour absorber les chocs et zone de maintien sur la voûte plantaire. Faite pour la course, la salle et les longues journées debout.',
    details: ['Semelle bouclette amortissante', 'Maintien de la voûte plantaire', 'Zones aérées sur le dessus'],
  },
  {
    slug: 'running-light', name: 'Running Light', category: 'sport', price: 14,
    sizes: SIZES, colors: [C.noir, C.marine, C.moutarde], height: 'ankle', pattern: 'plain',
    short: 'Légère et respirante',
    description: 'Une maille fine qui sèche vite, avec une languette au talon contre les frottements.',
    details: ['Séchage rapide', 'Languette anti-frottement', 'Pied gauche et droit marqués'],
  },
  {
    slug: 'wool-winter', name: 'Wool Winter', category: 'hiver', price: 22,
    sizes: SIZES, colors: [C.gris, C.bordeaux, C.vert, C.beige], height: 'crew', pattern: 'rib',
    short: 'Laine chaude pour l’hiver',
    description: 'Épaisse et douce, en laine mérinos mélangée pour garder les pieds au chaud sans gratter.',
    details: ['50% laine mérinos', 'Maille épaisse côtelée', 'Lavage 30°C, à plat'],
  },
  {
    slug: 'cozy-home', name: 'Cozy Home', category: 'hiver', price: 18,
    sizes: SIZES, colors: [C.beige, C.bordeaux, C.gris], height: 'crew', pattern: 'dots',
    short: 'Pour la maison, avec antidérapant',
    description: 'Ultra douce, avec des points antidérapants sous la semelle. Parfaite pour les soirées à la maison.',
    details: ['Points antidérapants', 'Intérieur doux', 'Taille unique par pointure'],
  },
  {
    slug: 'pack-essentials-5', name: 'Pack Essentials ×5', category: 'packs', price: 49, oldPrice: 60, badge: 'Pack',
    sizes: SIZES, colors: [{ name: 'Mix neutre', hex: '#9a9ca1' }, C.noir, C.blanc], height: 'crew', pattern: 'rib',
    short: '5 paires Classic Crew',
    description: 'Cinq paires Classic Crew pour toute la semaine. Choisissez un coloris uni ou le mix neutre (noir, blanc, gris, marine, beige).',
    details: ['5 paires', 'Économisez 11 DT', 'Mix neutre ou coloris uni'],
  },
  {
    slug: 'pack-sport-3', name: 'Pack Sport ×3', category: 'packs', price: 39, oldPrice: 45, badge: 'Pack',
    sizes: SIZES, colors: [C.blanc, C.noir], height: 'ankle', pattern: 'stripes',
    short: '3 paires Sport Cushion',
    description: 'Trois paires Sport Cushion pour vos entraînements de la semaine.',
    details: ['3 paires', 'Économisez 6 DT', 'Semelle amortissante'],
  },
];

export function findProduct(slug: string | undefined): Product | undefined {
  return PRODUCTS.find((p) => p.slug === slug);
}
