import { Link } from 'react-router-dom';
import { CATEGORIES, FREE_DELIVERY_FROM, PRODUCTS } from '../data/products';
import { ProductCard } from '../components/ProductCard';
import { SockArt } from '../components/SockArt';

const CAT_ART: Record<string, { color: string; pattern: 'plain' | 'stripes' | 'dots' | 'rib'; height: 'crew' | 'ankle' | 'invisible' | 'knee' }> = {
  quotidien: { color: '#1f2f57', pattern: 'rib', height: 'crew' },
  sport: { color: '#f5f3ee', pattern: 'stripes', height: 'ankle' },
  hiver: { color: '#6d1f2c', pattern: 'rib', height: 'crew' },
  packs: { color: '#c99a2e', pattern: 'dots', height: 'crew' },
};

export function Home() {
  const featured = PRODUCTS.filter((p) => p.badge || p.category === 'quotidien').slice(0, 4);
  return (
    <>
      <section className="hero">
        <div className="container hero-in">
          <div>
            <p className="eyebrow">Nouvelle collection</p>
            <h1>Le confort commence <span>par les pieds</span></h1>
            <p className="hero-sub">Chaussettes en coton peigné et laine douce. Commandez en 1 minute, payez à la livraison.</p>
            <div className="hero-cta">
              <Link to="/produits" className="btn-primary">Shopper la collection</Link>
              <Link to="/produits?c=packs" className="btn-outline">Voir les packs</Link>
            </div>
          </div>
          <div className="hero-art" aria-hidden>
            <div className="hero-sock a"><SockArt color="#2b2b2b" pattern="rib" height="crew" size={240} /></div>
            <div className="hero-sock b"><SockArt color="#d9c7a7" pattern="stripes" height="ankle" size={200} /></div>
          </div>
        </div>
      </section>

      <section className="promo-strip">
        <div className="container promo-in">
          <strong>Livraison offerte</strong> dès {FREE_DELIVERY_FROM} DT · <span>Paiement à la livraison partout en Tunisie</span>
        </div>
      </section>

      <section className="container section">
        <h2 className="section-title">Nos collections</h2>
        <div className="cats">
          {CATEGORIES.map((c) => (
            <Link key={c.id} to={`/produits?c=${c.id}`} className="cat">
              <div className="cat-circle"><SockArt {...CAT_ART[c.id]} size={120} /></div>
              <strong>{c.label}</strong>
              <span>{c.blurb}</span>
            </Link>
          ))}
        </div>
      </section>

      <section className="container section">
        <h2 className="section-title">Les plus aimées</h2>
        <div className="grid">{featured.map((p) => <ProductCard key={p.slug} p={p} />)}</div>
        <div className="center"><Link to="/produits" className="btn-primary">Voir tous les produits</Link></div>
      </section>

      <section className="trust">
        <div className="container trust-grid">
          <div><Ico d="M3 7h11v9H3zM14 10h4l3 3v3h-7zM7 19a1.5 1.5 0 1 0 0-3 1.5 1.5 0 0 0 0 3zM17 19a1.5 1.5 0 1 0 0-3 1.5 1.5 0 0 0 0 3z" /><strong>Livraison 24–72 h</strong><span>Partout en Tunisie</span></div>
          <div><Ico d="M3 7h18v10H3zM12 15a3 3 0 1 0 0-6 3 3 0 0 0 0 6z" /><strong>Paiement à la livraison</strong><span>Vous payez en recevant</span></div>
          <div><Ico d="M12 21a9 9 0 1 0 0-18 9 9 0 0 0 0 18zM12 7v5l3 2" /><strong>Commande en 1 minute</strong><span>Sans création de compte</span></div>
          <div><Ico d="M4 9h13l-3-3M20 15H7l3 3" /><strong>Échange de taille</strong><span>Sous 7 jours</span></div>
        </div>
      </section>
    </>
  );
}

function Ico({ d }: { d: string }) {
  return (
    <svg className="trust-ico" width="30" height="30" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
      <path d={d} />
    </svg>
  );
}
