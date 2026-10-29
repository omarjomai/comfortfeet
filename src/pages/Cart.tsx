import { Link } from 'react-router-dom';
import { useCart } from '../state/CartContext';
import { findProduct, FREE_DELIVERY_FROM } from '../data/products';
import { lineKey } from '../lib/cart';
import { SockArt } from '../components/SockArt';
import { dt } from '../lib/money';

export function Cart() {
  const { cart, totals, update } = useCart();
  if (cart.length === 0) {
    return (
      <div className="container section center empty">
        <div className="empty-icon">🧦</div>
        <h1>Votre panier est vide</h1>
        <p className="muted">Découvrez notre collection et ajoutez vos paires préférées.</p>
        <Link to="/produits" className="btn-primary">Découvrir nos produits</Link>
      </div>
    );
  }
  const missing = FREE_DELIVERY_FROM - totals.subtotal;
  return (
    <div className="container section">
      <nav className="crumbs"><Link to="/">Accueil</Link> › Panier</nav>
      <h1>Mon panier</h1>
      <div className="cart-layout">
        <div className="cart-lines">
          {cart.map((l) => {
            const p = findProduct(l.slug)!;
            const hex = p.colors.find((c) => c.name === l.color)?.hex ?? p.colors[0].hex;
            const k = lineKey(l);
            return (
              <div key={k} className="line">
                <div className="line-img"><SockArt color={hex} pattern={p.pattern} height={p.height} size={84} /></div>
                <div className="line-info">
                  <Link to={`/produit/${p.slug}`}><strong>{p.name}</strong></Link>
                  <span className="muted">Taille {l.size} · {l.color}</span>
                  <span>{dt(p.price)}</span>
                </div>
                <div className="qty small">
                  <button onClick={() => update(k, l.qty - 1)} aria-label="Moins">−</button>
                  <span>{l.qty}</span>
                  <button onClick={() => update(k, l.qty + 1)} aria-label="Plus">+</button>
                </div>
                <div className="line-total">{dt(p.price * l.qty)}</div>
                <button className="link-btn" onClick={() => update(k, 0)}>Retirer</button>
              </div>
            );
          })}
        </div>
        <aside className="summary-box sticky">
          <h3>Récapitulatif</h3>
          <div><span>Sous-total ({totals.count} paires)</span><span>{dt(totals.subtotal)}</span></div>
          <div><span>Livraison</span><span>{totals.delivery === 0 ? 'Offerte' : dt(totals.delivery)}</span></div>
          {missing > 0 && <p className="hint">Plus que {dt(missing)} pour la livraison offerte</p>}
          <div className="total"><span>Total</span><span>{dt(totals.total)}</span></div>
          <Link to="/commande" className="btn-primary wide">Passer la commande</Link>
          <p className="stock">💵 Paiement à la livraison · sans compte</p>
        </aside>
      </div>
    </div>
  );
}
