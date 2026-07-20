# PayFlow — Payment Gateway Demo

A portfolio showcase project built with Vue.js to demonstrate payment gateway integration, checkout flows, and secure payment UX patterns.

> **Demo only** — no real payments are processed.

---

## Project Purpose

This project is designed for **portfolio and interview demonstrations**. It simulates a real-world payment gateway experience without connecting to live payment processors.

**Goals:**

- Showcase how a modern checkout and payment flow works end to end  
- Demonstrate payment-specific skills: validation, state handling, 3D Secure, declines, and retries  
- Provide a minimal e-commerce shell (products → cart → checkout) so the **payment gateway remains the main focus**  
- Serve as a reference for building production-ready payment UIs with Vue 3  

**What you can explore in the demo:**

1. **Shop** — browse products and add items to cart  
2. **Cart** — review quantities and order total  
3. **Checkout** — enter basic billing details  
4. **Payment** — select a method, validate inputs, and process a simulated payment  
5. **Result** — view a success receipt or retry after a failure  

---

## Technologies Used

| Technology | Purpose |
|------------|---------|
| [Vue 3.5](https://vuejs.org/) | Frontend framework (Composition API) |
| [TypeScript](https://www.typescriptlang.org/) | Type-safe application code |
| [Vite](https://vitejs.dev/) | Build tool and dev server |
| [Vue Router 4](https://router.vuejs.org/) | Client-side routing |
| [Pinia](https://pinia.vuejs.org/) | State management (cart & checkout) |
| [Tailwind CSS v4](https://tailwindcss.com/) | Utility-first styling |
| [Zod](https://zod.dev/) | Form and payment input validation |

---

## How to Run the Project

### Prerequisites

- [Node.js](https://nodejs.org/) **v18+** (v20 recommended)  
- npm (comes with Node.js)

### 1. Clone and install

```bash
git clone <your-repo-url>
cd payment_geteway_demo
npm install
```

### 2. Start the development server

```bash
npm run dev
```

Open **http://localhost:5173** in your browser.

### 3. Build for production

```bash
npm run build
```

### 4. Preview the production build

```bash
npm run preview
```

### Available scripts

| Command | Description |
|---------|-------------|
| `npm run dev` | Start local dev server with hot reload |
| `npm run build` | Type-check and build for production |
| `npm run preview` | Serve the production build locally |
| `npm run typecheck` | Run TypeScript checks only |

---

## Test Card Numbers

Use these in the payment form to simulate different gateway outcomes:

| Card number | Outcome |
|-------------|---------|
| `4242 4242 4242 4242` | Success (may prompt 3D Secure) |
| `4000 0000 0000 0002` | Declined — insufficient funds |
| `4000 0000 0000 0069` | Gateway timeout — retry on page |
| `4000 0000 0000 3220` | Always requires 3D Secure |

**3D Secure:** enter any 6-digit code except `000000` to approve.

**Wallet demo:** use any valid email; include `decline` in the address to simulate a failure.

---

## Project Structure

```
src/
├── components/     # UI, cart, and payment components
├── composables/    # usePaymentGateway() — payment flow logic
├── services/       # Mock payment API
├── stores/         # Pinia stores (cart & checkout)
├── utils/          # Card validation, formatters, Zod schemas
└── views/          # Route pages
```

---

## License

MIT — portfolio demo project.
