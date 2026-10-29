import { Link, useLocation, useParams } from 'react-router-dom';
import { orderRef, type Order } from '../lib/order';
import { dt } from '../lib/money';

export function ThankYou() {
  const { id = '' } = useParams();
  const order = (useLocation().state as { order?: Order } | null)?.order;
  return (
    <div className="container section center thanks">
      <div className="check">✓</div>
      <h1>Merci pour votre commande !</h1>
      <p className="ref">Référence <strong>{orderRef(id)}</strong></p>
      {order && (
        <div className="summary-box left">
          <div><span>Nom</span><span>{order.customer.fullName}</span></div>
          <div><span>Téléphone</span><span>{order.customer.phone}</span></div>
          <div><span>Adresse</span><span>{order.customer.address}, {order.customer.city}, {order.customer.gouvernorat}</span></div>
          <div className="total"><span>À payer à la livraison</span><span>{dt(order.total)}</span></div>
        </div>
      )}
      <p className="muted">Nous vous appelons dans les 24 h pour confirmer. Livraison en 24 à 72 h.</p>
      <Link to="/produits" className="btn-primary">Continuer mes achats</Link>
    </div>
  );
}
