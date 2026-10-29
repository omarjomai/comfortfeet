import { useEffect, useMemo, useState, type FormEvent } from 'react';
import type { User } from 'firebase/auth';
import {
  ADMIN_EMAIL, STATUSES, adminSignIn, adminSignOut, firebaseReady, setOrderStatus, watchOrders, watchUser,
  type OrderStatus, type StoredOrder,
} from '../lib/firebase';
import { orderRef } from '../lib/order';
import { dt } from '../lib/money';

export function Admin() {
  const [user, setUser] = useState<User | null>(null);
  const [ready, setReady] = useState(!firebaseReady);
  useEffect(() => watchUser((u) => { setUser(u); setReady(true); }), []);

  if (!ready) return <div className="container section">Chargement…</div>;
  if (firebaseReady && !user) return <Login />;
  return <Orders email={user?.email ?? null} />;
}

function Login() {
  const [email, setEmail] = useState(ADMIN_EMAIL);
  const [password, setPassword] = useState('');
  const [err, setErr] = useState('');
  async function submit(e: FormEvent) {
    e.preventDefault();
    setErr('');
    try {
      await adminSignIn(email, password);
    } catch {
      setErr('Email ou mot de passe incorrect.');
    }
  }
  return (
    <div className="container section narrow">
      <h1>Espace admin</h1>
      <form className="form" onSubmit={submit}>
        <label className="field"><span>Email</span><input value={email} onChange={(e) => setEmail(e.target.value)} type="email" autoComplete="username" /></label>
        <label className="field"><span>Mot de passe</span><input value={password} onChange={(e) => setPassword(e.target.value)} type="password" autoComplete="current-password" /></label>
        {err && <p className="err-box">{err}</p>}
        <button className="btn-primary wide">Se connecter</button>
      </form>
    </div>
  );
}

function Orders({ email }: { email: string | null }) {
  const [orders, setOrders] = useState<StoredOrder[]>([]);
  const [err, setErr] = useState('');
  const [filter, setFilter] = useState<OrderStatus | 'toutes'>('toutes');
  useEffect(() => watchOrders(setOrders, (e) => setErr(e.message)), []);

  const shown = useMemo(() => orders.filter((o) => filter === 'toutes' || o.status === filter), [orders, filter]);
  const counts = useMemo(() => {
    const m: Record<string, number> = {};
    for (const o of orders) m[o.status] = (m[o.status] ?? 0) + 1;
    return m;
  }, [orders]);
  const revenue = orders.filter((o) => o.status === 'livrée').reduce((s, o) => s + o.total, 0);

  return (
    <div className="container section">
      <div className="admin-head">
        <h1>Commandes</h1>
        <div className="muted small">
          {firebaseReady ? <>Connecté : {email} · <button className="link-btn" onClick={adminSignOut}>Déconnexion</button></> : 'Mode démo : commandes de ce navigateur uniquement'}
        </div>
      </div>
      {err && <p className="err-box">Accès refusé ou erreur Firestore : {err}</p>}
      <div className="stats">
        <div><strong>{orders.length}</strong><span>Total</span></div>
        <div><strong>{counts['nouvelle'] ?? 0}</strong><span>Nouvelles</span></div>
        <div><strong>{counts['expédiée'] ?? 0}</strong><span>Expédiées</span></div>
        <div><strong>{dt(revenue)}</strong><span>Encaissé (livrées)</span></div>
      </div>
      <div className="filters">
        {(['toutes', ...STATUSES] as const).map((s) => (
          <button key={s} className={filter === s ? 'pill active' : 'pill'} onClick={() => setFilter(s)}>
            {s} {s !== 'toutes' && counts[s] ? `(${counts[s]})` : ''}
          </button>
        ))}
      </div>
      {shown.length === 0 && <p className="muted">Aucune commande.</p>}
      <div className="orders">
        {shown.map((o) => (
          <div key={o.id} className={`order st-${o.status}`}>
            <div className="order-top">
              <strong>{orderRef(o.id)}</strong>
              <span className="muted small">{o.createdAt ? o.createdAt.toLocaleString('fr-TN') : ''}</span>
              <select value={o.status} onChange={(e) => setOrderStatus(o.id, e.target.value as OrderStatus)}>
                {STATUSES.map((s) => <option key={s}>{s}</option>)}
              </select>
            </div>
            <div className="order-body">
              <div>
                <div><strong>{o.customer.fullName}</strong> · <a href={`tel:+216${o.customer.phone}`}>{o.customer.phone}</a></div>
                <div className="muted">{o.customer.address}, {o.customer.city}, {o.customer.gouvernorat}</div>
                {o.customer.note && <div className="note">« {o.customer.note} »</div>}
              </div>
              <ul>
                {o.items.map((i, k) => <li key={k}>{i.qty}× {i.name} · {i.size} · {i.color}</li>)}
              </ul>
              <div className="order-total">{dt(o.total)}<small>dont livraison {dt(o.delivery)}</small></div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
