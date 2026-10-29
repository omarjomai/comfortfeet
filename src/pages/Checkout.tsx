import { useState, type FormEvent } from 'react';
import { Link, Navigate, useNavigate } from 'react-router-dom';
import { useCart } from '../state/CartContext';
import { findProduct } from '../data/products';
import { GOUVERNORATS, buildOrder, validateCustomer, type Customer, type Errors } from '../lib/order';
import { dt } from '../lib/money';

const EMPTY: Customer = { fullName: '', phone: '', gouvernorat: '', city: '', address: '', note: '' };

export function Checkout() {
  const { cart, totals, clear } = useCart();
  const nav = useNavigate();
  const [c, setC] = useState<Customer>(EMPTY);
  const [errors, setErrors] = useState<Errors>({});
  const [sending, setSending] = useState(false);
  const [failed, setFailed] = useState<string | null>(null);

  if (cart.length === 0 && !sending) return <Navigate to="/panier" replace />;

  const set = (k: keyof Customer) => (e: { target: { value: string } }) => setC((v) => ({ ...v, [k]: e.target.value }));

  async function submit(e: FormEvent) {
    e.preventDefault();
    const errs = validateCustomer(c);
    setErrors(errs);
    if (Object.keys(errs).length) return;
    setSending(true);
    setFailed(null);
    try {
      const order = buildOrder(c, cart, totals);
      const { placeOrder } = await import('../lib/firebase');
      const id = await placeOrder(order);
      clear();
      nav(`/merci/${id}`, { state: { order } });
    } catch (err) {
      console.error(err);
      setFailed('La commande n’a pas pu être envoyée. Vérifiez votre connexion et réessayez.');
      setSending(false);
    }
  }

  return (
    <div className="container section">
      <nav className="crumbs"><Link to="/">Accueil</Link> › <Link to="/panier">Panier</Link> › Commande</nav>
      <h1>Finaliser la commande</h1>
      <p className="muted">Pas de compte, pas de carte. Vous payez en espèces à la livraison.</p>
      <div className="cart-layout">
        <form className="form" onSubmit={submit} noValidate>
          <Field label="Nom et prénom" err={errors.fullName}>
            <input value={c.fullName} onChange={set('fullName')} autoComplete="name" placeholder="Ex. Mohamed Ben Ali" />
          </Field>
          <Field label="Téléphone" err={errors.phone}>
            <input value={c.phone} onChange={set('phone')} inputMode="tel" autoComplete="tel" placeholder="22 123 456" />
          </Field>
          <div className="row2">
            <Field label="Gouvernorat" err={errors.gouvernorat}>
              <select value={c.gouvernorat} onChange={set('gouvernorat')}>
                <option value="">Choisir…</option>
                {GOUVERNORATS.map((g) => <option key={g}>{g}</option>)}
              </select>
            </Field>
            <Field label="Ville / délégation" err={errors.city}>
              <input value={c.city} onChange={set('city')} autoComplete="address-level2" placeholder="Ex. Sahloul" />
            </Field>
          </div>
          <Field label="Adresse complète" err={errors.address}>
            <input value={c.address} onChange={set('address')} autoComplete="street-address" placeholder="Rue, numéro, repère" />
          </Field>
          <Field label="Note pour le livreur (facultatif)" err={errors.note}>
            <textarea value={c.note} onChange={set('note')} rows={2} placeholder="Ex. appeler avant de venir" />
          </Field>
          <div className="pay-box">
            <input type="radio" checked readOnly id="cod" />
            <label htmlFor="cod"><strong>Paiement à la livraison</strong><span>Espèces au livreur à la réception</span></label>
          </div>
          {failed && <p className="err-box">{failed}</p>}
          <button className="btn-primary wide" disabled={sending}>{sending ? 'Envoi…' : `Confirmer la commande · ${dt(totals.total)}`}</button>
          <p className="muted small">Nous vous appelons pour confirmer avant l’expédition.</p>
        </form>
        <aside className="summary-box sticky">
          <h3>Votre commande</h3>
          {cart.map((l) => {
            const p = findProduct(l.slug)!;
            return (
              <div key={`${l.slug}${l.size}${l.color}`}>
                <span>{l.qty}× {p.name} <small className="muted">({l.size}, {l.color})</small></span>
                <span>{dt(p.price * l.qty)}</span>
              </div>
            );
          })}
          <hr />
          <div><span>Sous-total</span><span>{dt(totals.subtotal)}</span></div>
          <div><span>Livraison</span><span>{totals.delivery === 0 ? 'Offerte' : dt(totals.delivery)}</span></div>
          <div className="total"><span>Total à payer</span><span>{dt(totals.total)}</span></div>
        </aside>
      </div>
    </div>
  );
}

function Field({ label, err, children }: { label: string; err?: string; children: React.ReactNode }) {
  return (
    <label className={err ? 'field has-err' : 'field'}>
      <span>{label}</span>
      {children}
      {err && <em>{err}</em>}
    </label>
  );
}
