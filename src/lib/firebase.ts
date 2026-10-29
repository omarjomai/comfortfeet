import { initializeApp, type FirebaseApp } from 'firebase/app';
import {
  getFirestore, collection, addDoc, serverTimestamp, query, orderBy, onSnapshot, doc, updateDoc,
  type Firestore, type Timestamp,
} from 'firebase/firestore';
import { getAuth, signInWithEmailAndPassword, signOut, onAuthStateChanged, type Auth, type User } from 'firebase/auth';
import type { Order } from './order';

const cfg = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY as string | undefined,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN as string | undefined,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID as string | undefined,
  appId: import.meta.env.VITE_FIREBASE_APP_ID as string | undefined,
};

export const ADMIN_EMAIL = (import.meta.env.VITE_ADMIN_EMAIL as string | undefined) ?? '';

/** True when .env.local holds a Firebase web config. Otherwise the shop runs in demo mode (orders kept in this browser). */
export const firebaseReady = Boolean(cfg.apiKey && cfg.projectId && cfg.appId);

let app: FirebaseApp | null = null;
let db: Firestore | null = null;
let auth: Auth | null = null;
if (firebaseReady) {
  app = initializeApp(cfg);
  db = getFirestore(app);
  auth = getAuth(app);
}

export type StoredOrder = Order & { id: string; createdAt: Date | null };
export type OrderStatus = Order['status'];
export const STATUSES: OrderStatus[] = ['nouvelle', 'confirmée', 'expédiée', 'livrée', 'annulée'];

const DEMO_KEY = 'cf-demo-orders';
function demoRead(): StoredOrder[] {
  try {
    return (JSON.parse(localStorage.getItem(DEMO_KEY) ?? '[]') as (StoredOrder & { createdAt: string })[]).map((o) => ({
      ...o,
      createdAt: o.createdAt ? new Date(o.createdAt) : null,
    }));
  } catch {
    return [];
  }
}
function demoWrite(list: StoredOrder[]) {
  localStorage.setItem(DEMO_KEY, JSON.stringify(list));
  window.dispatchEvent(new Event('cf-demo-orders'));
}

/** Saves the order. Returns the document id. */
export async function placeOrder(order: Order): Promise<string> {
  if (db) {
    const ref = await addDoc(collection(db, 'orders'), { ...order, createdAt: serverTimestamp() });
    return ref.id;
  }
  const id = Math.random().toString(36).slice(2, 10) + Date.now().toString(36);
  demoWrite([{ ...order, id, createdAt: new Date() }, ...demoRead()]);
  return id;
}

/** Live list of orders, newest first. Admin only (enforced by firestore.rules). */
export function watchOrders(cb: (orders: StoredOrder[]) => void, onError: (e: Error) => void): () => void {
  if (db) {
    const q = query(collection(db, 'orders'), orderBy('createdAt', 'desc'));
    return onSnapshot(
      q,
      (snap) => cb(snap.docs.map((d) => {
        const data = d.data() as Order & { createdAt?: Timestamp };
        return { ...data, id: d.id, createdAt: data.createdAt ? data.createdAt.toDate() : null };
      })),
      onError,
    );
  }
  const push = () => cb(demoRead());
  push();
  window.addEventListener('cf-demo-orders', push);
  return () => window.removeEventListener('cf-demo-orders', push);
}

export async function setOrderStatus(id: string, status: OrderStatus): Promise<void> {
  if (db) {
    await updateDoc(doc(db, 'orders', id), { status });
    return;
  }
  demoWrite(demoRead().map((o) => (o.id === id ? { ...o, status } : o)));
}

export function watchUser(cb: (u: User | null) => void): () => void {
  if (!auth) {
    cb(null);
    return () => {};
  }
  return onAuthStateChanged(auth, cb);
}

export async function adminSignIn(email: string, password: string): Promise<void> {
  if (!auth) throw new Error('Firebase non configuré');
  await signInWithEmailAndPassword(auth, email, password);
}

export async function adminSignOut(): Promise<void> {
  if (auth) await signOut(auth);
}
