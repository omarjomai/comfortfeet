import { DELIVERY_FEE, FREE_DELIVERY_FROM, findProduct } from '../data/products';

export type CartLine = { slug: string; size: string; color: string; qty: number };
export const MAX_QTY = 20;

export function lineKey(l: Pick<CartLine, 'slug' | 'size' | 'color'>): string {
  return `${l.slug}|${l.size}|${l.color}`;
}

/** Adds a line, merging with an identical slug+size+color line. Quantities are clamped to 1..MAX_QTY. */
export function addLine(cart: CartLine[], line: CartLine): CartLine[] {
  const key = lineKey(line);
  const existing = cart.find((l) => lineKey(l) === key);
  if (existing) {
    return cart.map((l) => (lineKey(l) === key ? { ...l, qty: clampQty(l.qty + line.qty) } : l));
  }
  return [...cart, { ...line, qty: clampQty(line.qty) }];
}

export function setQty(cart: CartLine[], key: string, qty: number): CartLine[] {
  if (qty <= 0) return cart.filter((l) => lineKey(l) !== key);
  return cart.map((l) => (lineKey(l) === key ? { ...l, qty: clampQty(qty) } : l));
}

export function clampQty(q: number): number {
  return Math.max(1, Math.min(MAX_QTY, Math.floor(q)));
}

export type Totals = { subtotal: number; delivery: number; total: number; count: number };

/** Prices always come from the catalogue, never from stored cart data. Unknown products are ignored. */
export function totals(cart: CartLine[]): Totals {
  let subtotal = 0;
  let count = 0;
  for (const l of cart) {
    const p = findProduct(l.slug);
    if (!p) continue;
    subtotal += p.price * l.qty;
    count += l.qty;
  }
  const delivery = count === 0 || subtotal >= FREE_DELIVERY_FROM ? 0 : DELIVERY_FEE;
  return { subtotal, delivery, total: subtotal + delivery, count };
}

/** Drops lines that no longer match the catalogue (removed product, size or colour). */
export function sanitize(cart: unknown): CartLine[] {
  if (!Array.isArray(cart)) return [];
  const out: CartLine[] = [];
  for (const raw of cart) {
    if (!raw || typeof raw !== 'object') continue;
    const l = raw as Partial<CartLine>;
    const p = findProduct(l.slug);
    if (!p || typeof l.size !== 'string' || typeof l.color !== 'string' || typeof l.qty !== 'number') continue;
    if (!p.sizes.includes(l.size) || !p.colors.some((c) => c.name === l.color)) continue;
    out.push({ slug: p.slug, size: l.size, color: l.color, qty: clampQty(l.qty) });
  }
  return out;
}
