import type { CartLine, Totals } from './cart';
import { findProduct } from '../data/products';

export const GOUVERNORATS = [
  'Ariana', 'Béja', 'Ben Arous', 'Bizerte', 'Gabès', 'Gafsa', 'Jendouba', 'Kairouan',
  'Kasserine', 'Kébili', 'Le Kef', 'Mahdia', 'La Manouba', 'Médenine', 'Monastir', 'Nabeul',
  'Sfax', 'Sidi Bouzid', 'Siliana', 'Sousse', 'Tataouine', 'Tozeur', 'Tunis', 'Zaghouan',
] as const;

export type Customer = {
  fullName: string;
  phone: string;
  gouvernorat: string;
  city: string;
  address: string;
  note: string;
};

export type OrderItem = { slug: string; name: string; size: string; color: string; qty: number; unitPrice: number };

export type Order = {
  customer: Customer;
  items: OrderItem[];
  subtotal: number;
  delivery: number;
  total: number;
  payment: 'cash_on_delivery';
  status: 'nouvelle' | 'confirmée' | 'expédiée' | 'livrée' | 'annulée';
};

export type Errors = Partial<Record<keyof Customer, string>>;

/** Tunisian mobile/landline: 8 digits, optional +216 / 00216 prefix, spaces and dashes allowed. */
export function normalizePhone(raw: string): string | null {
  let d = raw.replace(/[\s.-]/g, '');
  if (d.startsWith('+216')) d = d.slice(4);
  else if (d.startsWith('00216')) d = d.slice(5);
  if (!/^[2-9]\d{7}$/.test(d)) return null;
  return d;
}

export function validateCustomer(c: Customer): Errors {
  const e: Errors = {};
  const name = c.fullName.trim();
  if (name.length < 3) e.fullName = 'Entrez votre nom et prénom.';
  else if (name.length > 80) e.fullName = 'Nom trop long.';
  if (!normalizePhone(c.phone)) e.phone = 'Numéro tunisien à 8 chiffres, par exemple 22 123 456.';
  if (!(GOUVERNORATS as readonly string[]).includes(c.gouvernorat)) e.gouvernorat = 'Choisissez votre gouvernorat.';
  if (c.city.trim().length < 2) e.city = 'Entrez votre ville ou délégation.';
  if (c.address.trim().length < 5) e.address = 'Entrez une adresse précise (rue, numéro, repère).';
  else if (c.address.trim().length > 200) e.address = 'Adresse trop longue.';
  if (c.note.length > 300) e.note = 'Note trop longue (300 caractères max).';
  return e;
}

export function buildOrder(c: Customer, cart: CartLine[], t: Totals): Order {
  const items: OrderItem[] = cart.flatMap((l) => {
    const p = findProduct(l.slug);
    return p ? [{ slug: p.slug, name: p.name, size: l.size, color: l.color, qty: l.qty, unitPrice: p.price }] : [];
  });
  return {
    customer: {
      fullName: c.fullName.trim(),
      phone: normalizePhone(c.phone) ?? c.phone,
      gouvernorat: c.gouvernorat,
      city: c.city.trim(),
      address: c.address.trim(),
      note: c.note.trim(),
    },
    items,
    subtotal: t.subtotal,
    delivery: t.delivery,
    total: t.total,
    payment: 'cash_on_delivery',
    status: 'nouvelle' as const,
  };
}

/** Short reference shown to the customer, e.g. CF-7K2Q9M. */
export function orderRef(id: string): string {
  return 'CF-' + id.replace(/[^a-zA-Z0-9]/g, '').slice(0, 6).toUpperCase();
}
