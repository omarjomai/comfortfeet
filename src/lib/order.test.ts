import { describe, expect, it } from 'vitest';
import { buildOrder, normalizePhone, orderRef, validateCustomer, type Customer } from './order';
import { totals } from './cart';

const ok: Customer = { fullName: 'Mohamed Ben Ali', phone: '+216 22 123 456', gouvernorat: 'Sousse', city: 'Sahloul', address: 'Rue 12, près de la pharmacie', note: '' };

describe('order', () => {
  it('normalizes Tunisian phone numbers', () => {
    expect(normalizePhone('22 123 456')).toBe('22123456');
    expect(normalizePhone('+216 98-765-432')).toBe('98765432');
    expect(normalizePhone('00216 55123456')).toBe('55123456');
    expect(normalizePhone('1234567')).toBeNull();
    expect(normalizePhone('12345678')).toBeNull();
    expect(normalizePhone('abc')).toBeNull();
  });

  it('accepts a complete customer and rejects missing fields', () => {
    expect(validateCustomer(ok)).toEqual({});
    const e = validateCustomer({ ...ok, fullName: 'A', phone: '12', gouvernorat: 'Paris', city: '', address: 'x' });
    expect(Object.keys(e).sort()).toEqual(['address', 'city', 'fullName', 'gouvernorat', 'phone']);
  });

  it('builds a cash-on-delivery order with catalogue prices', () => {
    const cart = [{ slug: 'sport-cushion', size: '39-42', color: 'Blanc', qty: 2 }];
    const o = buildOrder(ok, cart, totals(cart));
    expect(o.payment).toBe('cash_on_delivery');
    expect(o.status).toBe('nouvelle');
    expect(o.customer.phone).toBe('22123456');
    expect(o.items[0]).toMatchObject({ name: 'Sport Cushion', unitPrice: 15, qty: 2 });
    expect(o.total).toBe(30 + 7);
  });

  it('makes a short reference', () => {
    expect(orderRef('a1b2c3d4e5')).toBe('CF-A1B2C3');
  });
});
