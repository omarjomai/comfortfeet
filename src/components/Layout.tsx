import { Link, NavLink, Outlet, useLocation, useNavigate } from 'react-router-dom';
import { useEffect, useState, type FormEvent } from 'react';
import { Logo } from './Logo';
import { CATEGORIES } from '../data/products';
import { useCart } from '../state/CartContext';
import { FREE_DELIVERY_FROM } from '../data/products';

export function Layout() {
  const { totals, toast } = useCart();
  const { pathname, search } = useLocation();
  const navigate = useNavigate();
  const [q, setQ] = useState('');
  const cat = new URLSearchParams(search).get('c');
  const onSearch = (e: FormEvent) => {
    e.preventDefault();
    navigate(q.trim() ? `/produits?q=${encodeURIComponent(q.trim())}` : '/produits');
  };
  // Braces matter: newer Chrome returns a Promise from scrollTo, and React would call it as a cleanup.
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);
  return (
    <>
      <div className="topbar">Livraison partout en Tunisie · Paiement à la livraison · Offerte dès {FREE_DELIVERY_FROM} DT</div>
      <header className="header">
        <div className="container header-in">
          <Link to="/" className="logo" aria-label="ComfortFeet, accueil">
            <Logo />
          </Link>
          <form className="search" role="search" onSubmit={onSearch}>
            <SearchIcon />
            <input type="search" value={q} onChange={(e) => setQ(e.target.value)} placeholder="Rechercher une chaussette, une couleur…" aria-label="Rechercher" />
          </form>
          <div className="head-icons">
            <NavLink to="/panier" className="icon-link nav-cart" aria-label="Panier">
              <CartIcon />
              <span>Panier</span>
              {totals.count > 0 && <span className="cart-count">{totals.count}</span>}
            </NavLink>
          </div>
        </div>
        <nav className="menu" aria-label="Catégories">
          <div className="container menu-in">
            <NavLink to="/" end>Accueil</NavLink>
            <Link to="/produits" className={pathname === '/produits' && !cat && !search.includes('q=') ? 'active' : ''}>Tous les produits</Link>
            {CATEGORIES.map((c) => (
              <Link key={c.id} to={`/produits?c=${c.id}`} className={cat === c.id ? 'active' : ''}>{c.label}</Link>
            ))}
            <Link to="/produits?c=packs" className="menu-promo">Promos</Link>
          </div>
        </nav>
      </header>
      <main><Outlet /></main>
      <footer className="footer">
        <div className="container footer-grid">
          <div>
            <div className="footer-logo"><Logo light /></div>
            <p>Des chaussettes confortables, solides et bien coupées, livrées chez vous partout en Tunisie.</p>
          </div>
          <div>
            <h4>Navigation</h4>
            <Link to="/">Accueil</Link>
            <Link to="/produits">Produits</Link>
            <Link to="/panier">Panier</Link>
          </div>
          <div>
            <h4>Service client</h4>
            <span>Livraison en 24 à 72 h</span>
            <span>Paiement à la livraison</span>
            <span>Échange de taille sous 7 jours</span>
          </div>
          <div>
            <h4>Guide des tailles</h4>
            <span>35-38 : pointure 35 à 38</span>
            <span>39-42 : pointure 39 à 42</span>
            <span>43-46 : pointure 43 à 46</span>
          </div>
        </div>
        <div className="container footer-bottom">© {new Date().getFullYear()} ComfortFeet. Tous droits réservés.</div>
      </footer>
      {toast && <div className="toast" role="status">✓ {toast} · <Link to="/panier">Voir le panier</Link></div>}
    </>
  );
}

function SearchIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden>
      <circle cx="11" cy="11" r="7" /><path d="m20 20-3.5-3.5" />
    </svg>
  );
}

function CartIcon() {
  return (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" aria-hidden>
      <path d="M6 7h12l-1 13H7L6 7z" /><path d="M9 7a3 3 0 0 1 6 0" />
    </svg>
  );
}
