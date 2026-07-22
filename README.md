# PayFlow — Payment Gateway Demo

A portfolio showcase project built with Vue.js to demonstrate payment gateway integration, checkout flows, and secure payment UX patterns.

> **Demo only** — Stripe runs in **test mode**. bKash uses the **official sandbox**. No real charges are made.

---

## Project Purpose

This project is designed for **portfolio and interview demonstrations**. It integrates **Stripe test mode** for card payments and **bKash Tokenized Checkout sandbox** for mobile wallet payments.

**Goals:**

- Showcase how a modern checkout and payment flow works end to end  
- Demonstrate real Stripe PaymentIntent + Payment Element integration  
- Show server-side secret key handling (never exposed to the browser)  
- Provide a minimal e-commerce shell so the **payment gateway remains the main focus**  

**What you can explore in the demo:**

1. **Shop** — browse products and add items to cart  
2. **Cart** — review quantities and order total  
3. **Checkout** — enter basic billing details  
4. **Payment** — pay with **Stripe** (test mode) or **bKash** (sandbox redirect)  
5. **Result** — view a success receipt or retry after a failure  

---

## Technologies Used

| Technology | Purpose |
|------------|---------|
| [Vue 3.5](https://vuejs.org/) | Frontend framework (Composition API) |
| [TypeScript](https://www.typescriptlang.org/) | Type-safe application code |
| [Vite](https://vitejs.dev/) | Build tool and dev server |
| [Stripe.js](https://stripe.com/docs/stripe-js) | Payment Element & test-mode checkout |
| [Express](https://expressjs.com/) | Local dev API server |
| [Vercel Serverless](https://vercel.com/docs/functions) | Production API (Stripe + bKash) |
| [Vue Router 4](https://router.vuejs.org/) | Client-side routing |
| [Pinia](https://pinia.vuejs.org/) | State management (cart & checkout) |
| [Tailwind CSS v4](https://tailwindcss.com/) | Utility-first styling |
| [Zod](https://zod.dev/) | Form validation |

---

## How to Run the Project

### Prerequisites

- [Node.js](https://nodejs.org/) **v18+** (v20 recommended)  
- npm (comes with Node.js)  
- A [Stripe account](https://dashboard.stripe.com/register) (free) for test API keys  

### 1. Clone and install

```bash
git clone <your-repo-url>
cd payment_geteway_demo
npm install
```

### 2. Configure environment variables

Copy the example env file and add your keys:

```bash
cp .env.example .env
```

Edit `.env`:

```env
# Stripe (test mode)
STRIPE_SECRET_KEY=sk_test_...
VITE_STRIPE_PUBLISHABLE_KEY=pk_test_...

# bKash sandbox
BKASH_BASE_URL=https://tokenized.sandbox.bka.sh/v1.2.0-beta
BKASH_USERNAME=your_sandbox_username
BKASH_PASSWORD=your_sandbox_password
BKASH_APP_KEY=your_app_key
BKASH_APP_SECRET=your_app_secret
BKASH_USD_TO_BDT_RATE=110
```

> Never commit `.env`. Use test/sandbox keys only — never expose `STRIPE_SECRET_KEY` or `BKASH_APP_SECRET` to the frontend.

### 3. Start the app (frontend + API)

```bash
npm run dev
```

This runs:

- **Vue app** at http://localhost:5173  
- **Payment API** at http://localhost:4242  

### 4. Build for production

```bash
npm run build
npm run preview
```

### Available scripts

| Command | Description |
|---------|-------------|
| `npm run dev` | Start Vue app + payment API together |
| `npm run dev:client` | Start Vue app only |
| `npm run dev:server` | Start Stripe API only |
| `npm run build` | Type-check and build for production |
| `npm run preview` | Serve the production build locally |

---

## Stripe test cards

Use these in the Stripe Payment Element (any future expiry, any CVC):

| Card number | Outcome |
|-------------|---------|
| `4242 4242 4242 4242` | Success |
| `4000 0000 0000 0002` | Declined — insufficient funds |
| `4000 0000 0000 3220` | Requires 3D Secure |

More test cards: [Stripe testing docs](https://docs.stripe.com/testing)

**bKash sandbox:** select **bKash** on the payment page and click the glowing **light bulb** for test wallets, PIN, and OTP. You will be redirected to the bKash sandbox checkout page.

| Test wallets | PIN | OTP |
|--------------|-----|-----|
| `01770618575`, `01929918378`, `01770618576`, `01877722345`, `01619777282`, `01619777283` | `12121` | `123456` |

Cart totals are in USD; the API converts to BDT for bKash using `BKASH_USD_TO_BDT_RATE`.

---

## Deploy to Vercel

The project is configured for **full-stack Vercel deployment** — Vue frontend + Stripe/bKash serverless APIs on the same domain.

### 1. Push to GitHub

Commit and push your code to a GitHub repository.

### 2. Import on Vercel

1. Go to [vercel.com/new](https://vercel.com/new)  
2. Import your repository  
3. Vercel auto-detects **Vite** — no build settings changes needed  

### 3. Add environment variables

In **Project Settings → Environment Variables**, add:

| Name | Value |
|------|--------|
| `VITE_STRIPE_PUBLISHABLE_KEY` | `pk_test_...` from Stripe Dashboard |
| `STRIPE_SECRET_KEY` | `sk_test_...` from Stripe Dashboard |
| `BKASH_BASE_URL` | `https://tokenized.sandbox.bka.sh/v1.2.0-beta` |
| `BKASH_USERNAME` | Sandbox merchant username |
| `BKASH_PASSWORD` | Sandbox merchant password |
| `BKASH_APP_KEY` | Sandbox app key |
| `BKASH_APP_SECRET` | Sandbox app secret |
| `BKASH_USD_TO_BDT_RATE` | `110` (optional demo conversion rate) |

Apply to **Production**, **Preview**, and **Development**.

> Use **test mode** keys only. Never expose `STRIPE_SECRET_KEY` as a `VITE_` variable.

### 4. Deploy

Click **Deploy**. Vercel will:

- Build the Vue app to `dist/`  
- Deploy `/api/*` serverless functions (Stripe + bKash)  
- Route all other paths to `index.html` for Vue Router  

### Local vs production

| Environment | API |
|-------------|-----|
| **Local** (`npm run dev`) | Express on port 4242 (proxied via Vite) |
| **Vercel** | Serverless functions in `/api` |

Both use shared logic in `lib/stripe.js` and `lib/bkash.js`.

---

## Project Structure

```
api/                # Vercel serverless functions (production)
lib/                # Shared Stripe + bKash logic
server/             # Express API (local development)
src/
├── components/     # UI, cart, and payment components
├── composables/    # Payment flow logic
├── services/       # Stripe + bKash API clients
├── stores/         # Pinia stores (cart & checkout)
└── views/          # Route pages (incl. bKash callback)
vercel.json         # Vercel build + SPA routing config
```

---

## License

MIT — portfolio demo project.
