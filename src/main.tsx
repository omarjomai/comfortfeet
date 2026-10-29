import { StrictMode, Suspense, lazy } from 'react';
import { createRoot } from 'react-dom/client';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import { CartProvider } from './state/CartContext';
import { ErrorBoundary } from './components/ErrorBoundary';
import { Layout } from './components/Layout';
import { Home } from './pages/Home';
import { Products } from './pages/Products';
import { ProductPage } from './pages/ProductPage';
import { Cart } from './pages/Cart';
import { Checkout } from './pages/Checkout';
import { ThankYou } from './pages/ThankYou';
import './styles.css';

const Admin = lazy(() => import('./pages/Admin').then((m) => ({ default: m.Admin })));

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <ErrorBoundary>
    <BrowserRouter basename={import.meta.env.BASE_URL.replace(/\/$/, '')}>
      <CartProvider>
        <Routes>
          <Route element={<Layout />}>
            <Route index element={<Home />} />
            <Route path="produits" element={<Products />} />
            <Route path="produit/:slug" element={<ProductPage />} />
            <Route path="panier" element={<Cart />} />
            <Route path="commande" element={<Checkout />} />
            <Route path="merci/:id" element={<ThankYou />} />
            <Route path="admin" element={<Suspense fallback={<div className="container section">Chargement…</div>}><Admin /></Suspense>} />
            <Route path="*" element={<Products />} />
          </Route>
        </Routes>
      </CartProvider>
    </BrowserRouter>
    </ErrorBoundary>
  </StrictMode>,
);
