import { useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { CATEGORIES, DELIVERY_FEE, FREE_DELIVERY_FROM, findProduct } from '../data/products';
import { SockArt } from '../components/SockArt';
import { useCart } from '../state/CartContext';
import { MAX_QTY } from '../lib/cart';
import { dt } from '../lib/money';

export function ProductPage() {
  const { slug } = useParams();
  const p = findProduct(slug);
  const { add } = useCart();
  const nav = useNavigate();
  const [size, setSize] = useState<string | null>(null);
  const [color, setColor] = useState(p?.colors[0].name ?? '');
  const [qty, setQty] = useState(1);
  const [err, setErr] = useState(false);

  if (!p) {
    return (
      <div className="container section center">
        <h1>Produit introuvable</h1>
        <Link to="/produits" className="btn-primary">Voir les produits</Link>
      </div>
    );
  }
  const hex = p.colors.find((c) => c.name === color)?.hex ?? p.colors[0].hex;
  const sub = p.price * qty;
  const delivery = sub >= FREE_DELIVERY_FROM ? 0 : DELIVERY_FEE;
  const cat = CATEGORIES.find((c) => c.id === p.category);

  function go(direct: boolean) {
    if (!size) {
      setErr(true);
      return;
    }
    add({ slug: p!.slug, size, color, qty });
    if (direct) nav('/commande');
  }

  return (
    <div className="container section">
      <nav className="crumbs"><Link to="/">Accueil</Link> › <Link to="/produits">Produits</Link> › <Link to={`/produits?c=${p.category}`}>{cat?.label}</Link></nav>
      <div className="pdp">
        <div className="pdp-gallery">
          {p.badge && <span className="badge">{p.badge}</span>}
          <SockArt color={hex} pattern={p.pattern} height={p.height} size={360} />
        </div>
        <div className="pdp-info">
          <h1>{p.name}</h1>
          <div className="pdp-price">{dt(p.price)} {p.oldPrice && <s>{dt(p.oldPrice)}</s>}<small>Prix unitaire</small></div>
          <p className="muted">{p.description}</p>

          <div className="field-label">Taille {err && !size && <span className="err-inline">Choisissez une taille</span>}</div>
          <div className="opts">
            {p.sizes.map((s) => (
              <button key={s} className={size === s ? 'opt active' : 'opt'} onClick={() => { setSize(s); setErr(false); }}>{s}</button>
            ))}
          </div>

          <div className="field-label">Couleur : <strong>{color}</strong></div>
          <div className="opts">
            {p.colors.map((c) => (
              <button key={c.name} className={color === c.name ? 'swatch active' : 'swatch'} onClick={() => setColor(c.name)} aria-label={c.name}>
                <span style={{ background: c.hex }} />
              </button>
            ))}
          </div>

          <div className="field-label">Quantité</div>
          <div className="qty">
            <button onClick={() => setQty((q) => Math.max(1, q - 1))} disabled={qty <= 1} aria-label="Moins">−</button>
            <span>{qty}</span>
            <button onClick={() => setQty((q) => Math.min(MAX_QTY, q + 1))} disabled={qty >= MAX_QTY} aria-label="Plus">+</button>
          </div>

          <div className="summary-box">
            <div><span>Sous-total ({qty}×)</span><span>{dt(sub)}</span></div>
            <div><span>Livraison</span><span>{delivery === 0 ? 'Offerte' : dt(delivery)}</span></div>
            <div className="total"><span>Total</span><span>{dt(sub + delivery)}</span></div>
          </div>

          <button className="btn-primary wide" onClick={() => go(true)}>Commander maintenant · {dt(sub + delivery)}</button>
          <button className="btn-outline wide" onClick={() => go(false)}>Ajouter au panier</button>
          <p className="stock">✓ En stock · 💵 Paiement à la livraison</p>

          <ul className="details">{p.details.map((d) => <li key={d}>{d}</li>)}</ul>
        </div>
      </div>
    </div>
  );
}
