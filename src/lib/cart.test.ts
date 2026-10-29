import { describe, expect, it } from 'vitest';
import { addLine, lineKey, sanitize, setQty, totals, MAX_QTY } from './cart';
import { DELIVERY_FEE, FREE_DELIVERY_FROM } from '../data/products';

const a = { slug: 'classic-crew', size: '39-42', color: 'Noir', qty: 1 };

describe('cart', () => {
  it('merges identical lines and keeps different sizes apart', () => {
    let c = addLine([], a);
    c = addLine(c, { ...a, qty: 2 });
    c = addLine(c, { ...a, size: '43-46' });
    expect(c).toHaveLength(2);
    expect(c[0].qty).toBe(3);
  });

  it('clamps quantity and removes a line at 0', () => {
    let c = addLine([], { ...a, qty: 99 });
    expect(c[0].qty).toBe(MAX_QTY);
    c = setQty(c, lineKey(a), 0);
    expect(c).toHaveLength(0);
  });

  it('charges delivery below the threshold and offers it above', () => {
    expect(totals([a])).toEqual({ subtotal: 12, delivery: DELIVERY_FEE, total: 12 + DELIVERY_FEE, count: 1 });
    const big = totals([{ ...a, qty: Math.ceil(FREE_DELIVERY_FROM / 12) }]);
    expect(big.delivery).toBe(0);
    expect(totals([])).toEqual({ subtotal: 0, delivery: 0, total: 0, count: 0 });
  });

  it('takes prices from the catalogue and drops invalid stored lines', () => {
    const stored = [a, { slug: 'nope', size: '39-42', color: 'Noir', qty: 1 }, { ...a, size: '99' }, { ...a, color: 'Rose' }, 'junk', null];
    expect(sanitize(stored)).toEqual([a]);
    expect(sanitize('not an array')).toEqual([]);
  });
});
