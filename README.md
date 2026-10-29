# ComfortFeet

Online sock shop for Tunisia. Cash on delivery only, no customer account.
Orders are saved in Firebase Firestore; the owner manages them on `/admin`.

Design and buying flow inspired by asses.tn: home with hero, collections and featured products;
catalogue with filters and sort; product page with size, colour, quantity and a live total
including delivery; cart; one-page order form (name, phone, gouvernorat, city, address);
confirmation page with an order reference.

## Run

```bash
npm install
npm run dev        # http://localhost:5173
npm test           # unit tests (cart, order validation)
npm run build
```

Without Firebase settings the shop runs in **demo mode**: orders are kept in this browser
(`localStorage`) and `/admin` shows them without login. Good for trying the flow.

## Connect Firebase (owner, about 10 minutes)

1. console.firebase.google.com → Add project → name it `comfortfeet`.
2. Build → Firestore Database → Create database (production mode, region `europe-west`).
3. Build → Authentication → Get started → Email/Password → Enable.
   Users → Add user → your admin email and a strong password. Verify the email.
4. Project settings → Your apps → Web (`</>`) → register → copy the config values.
5. `cp .env.example .env.local` and fill in the 4 values plus `VITE_ADMIN_EMAIL`.
6. In `firestore.rules`, replace `ADMIN_EMAIL_HERE` with the same email, then publish the rules
   (Firestore → Rules → paste, or `npx firebase-tools deploy --only firestore:rules`).
7. `npm run dev`, place a test order, open `/admin` and sign in.

Deploy (costs nothing on the free Spark plan at this size): `npm run build` then
`npx firebase-tools deploy --only hosting`.

## Security model

- Anyone can **create** an order; the rules check its shape (cash on delivery, status `nouvelle`,
  Tunisian phone, sizes of strings, 1–30 items, server timestamp).
- Only the admin email can **read** and **change the status** of orders. Nobody can delete.
- Prices are recomputed from the catalogue in the browser. The rules cannot check them against
  the catalogue, so always read the total on `/admin` and confirm by phone before shipping.

## Products and photos

Products live in `src/data/products.ts` (name, price, sizes, colours, description).
Product visuals are drawn sock illustrations (`SockArt`) until real photos are added.
Use your own photos: product photos from other brands are protected by copyright.
