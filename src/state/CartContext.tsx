import { createContext, useContext, useEffect, useMemo, useState, type ReactNode } from 'react';
import { addLine, sanitize, setQty, totals, type CartLine, type Totals } from '../lib/cart';

type Ctx = {
  cart: CartLine[];
  totals: Totals;
  add: (l: CartLine) => void;
  update: (key: string, qty: number) => void;
  clear: () => void;
  toast: string | null;
};

const CartCtx = createContext<Ctx | null>(null);
const KEY = 'cf-cart';

export function CartProvider({ children }: { children: ReactNode }) {
  const [cart, setCart] = useState<CartLine[]>(() => {
    try {
      return sanitize(JSON.parse(localStorage.getItem(KEY) ?? '[]'));
    } catch {
      return [];
    }
  });
  const [toast, setToast] = useState<string | null>(null);

  useEffect(() => {
    localStorage.setItem(KEY, JSON.stringify(cart));
  }, [cart]);

  useEffect(() => {
    if (!toast) return;
    const t = setTimeout(() => setToast(null), 2200);
    return () => clearTimeout(t);
  }, [toast]);

  const value = useMemo<Ctx>(() => ({
    cart,
    totals: totals(cart),
    add: (l) => {
      setCart((c) => addLine(c, l));
      setToast('Ajouté au panier');
    },
    update: (key, qty) => setCart((c) => setQty(c, key, qty)),
    clear: () => setCart([]),
    toast,
  }), [cart, toast]);

  return <CartCtx.Provider value={value}>{children}</CartCtx.Provider>;
}

export function useCart(): Ctx {
  const c = useContext(CartCtx);
  if (!c) throw new Error('useCart outside CartProvider');
  return c;
}
