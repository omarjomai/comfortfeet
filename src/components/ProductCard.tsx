import { Link } from 'react-router-dom';
import type { Product } from '../data/products';
import { SockArt } from './SockArt';
import { dt } from '../lib/money';

export function ProductCard({ p }: { p: Product }) {
  return (
    <Link to={`/produit/${p.slug}`} className="card">
      <div className="card-img">
        {p.badge && <span className="badge">{p.badge}</span>}
        <SockArt color={p.colors[0].hex} pattern={p.pattern} height={p.height} size={190} />
      </div>
      <div className="card-body">
        <h3>{p.name}</h3>
        <div className="price">
          {dt(p.price)} {p.oldPrice && <s>{dt(p.oldPrice)}</s>}
        </div>
        <div className="swatches">
          {p.colors.slice(0, 4).map((c) => <span key={c.name} className="dot" style={{ background: c.hex }} title={c.name} />)}
        </div>
        <div className="sizes">{p.sizes.map((s) => <span key={s} className="chip-sm">{s}</span>)}</div>
        <span className="btn-outline">Voir plus</span>
      </div>
    </Link>
  );
}
