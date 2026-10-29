import { Link, NavLink, Outlet, useLocation } from 'react-router-dom';
import { useEffect } from 'react';
import { useCart } from '../state/CartContext';
import { FREE_DELIVERY_FROM } from '../data/products';

export function Layout() {
  const { totals, toast } = useCart();
  const { pathname } = useLocation();
  useEffect(() => window.scrollTo(0, 0), [pathname]);
  return (
    <>
      <div className="topbar">Livraison partout en Tunisie · Paiement à la livraison · Offerte dès {FREE_DELIVERY_FROM} DT</div>
      <header className="header">
        <div className="container header-in">
          <Link to="/" className="logo" aria-label="ComfortFeet, accueil">
            <span className="logo-mark" aria-hidden>CF</span> ComfortFeet
          </Link>
          <nav className="nav">
            <NavLink to="/" end>Accueil</NavLink>
            <NavLink to="/produits">Produits</NavLink>
            <NavLink to="/panier" className="nav-cart">
              <CartIcon /> Panier
              {totals.count > 0 && <span className="cart-count">{totals.count}</span>}
            </NavLink>
          </nav>
        </div>
      </header>
      <main><Outlet /></main>
      <footer className="footer">
        <div className="container footer-grid">
          <div>
            <div className="footer-logo">ComfortFeet</div>
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

function CartIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" aria-hidden>
      <path d="M6 7h12l-1 13H7L6 7z" /><path d="M9 7a3 3 0 0 1 6 0" />
    </svg>
  );
}
