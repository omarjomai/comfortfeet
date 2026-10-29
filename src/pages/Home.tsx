import { Link } from 'react-router-dom';
import { CATEGORIES, PRODUCTS } from '../data/products';
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
            <h1>Le confort commence par les pieds</h1>
            <p className="hero-sub">Chaussettes en coton peigné et laine douce. Commandez en 1 minute, payez à la livraison.</p>
            <Link to="/produits" className="btn-primary">Découvrez la collection →</Link>
          </div>
          <div className="hero-art" aria-hidden>
            <div className="hero-sock a"><SockArt color="#0f3d33" pattern="rib" height="crew" size={240} /></div>
            <div className="hero-sock b"><SockArt color="#d9c7a7" pattern="stripes" height="ankle" size={200} /></div>
          </div>
        </div>
      </section>

      <section className="container section">
        <h2 className="section-title">Découvrez nos collections</h2>
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
        <h2 className="section-title">Produits vedettes</h2>
        <div className="grid">{featured.map((p) => <ProductCard key={p.slug} p={p} />)}</div>
        <div className="center"><Link to="/produits" className="btn-primary">Voir tous les produits</Link></div>
      </section>

      <section className="trust">
        <div className="container trust-grid">
          <div><strong>🚚 Livraison 24–72 h</strong><span>Partout en Tunisie</span></div>
          <div><strong>💵 Paiement à la livraison</strong><span>Vous payez en recevant</span></div>
          <div><strong>⏱ Commande en 1 minute</strong><span>Sans création de compte</span></div>
          <div><strong>🔁 Échange de taille</strong><span>Sous 7 jours</span></div>
        </div>
      </section>
    </>
  );
}
