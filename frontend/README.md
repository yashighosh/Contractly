# Contractly — Frontend

> The Stripe Dashboard of contract management — beautifully minimal, ruthlessly functional, built for Indian freelancers.

## Tech Stack

| Layer | Choice |
|---|---|
| Framework | React 18 + Vite |
| Styling | Tailwind CSS v3 |
| Rich Editor | TipTap v2 |
| State | Zustand |
| Server State | TanStack Query |
| Animations | Framer Motion |
| Routing | React Router v6 |
| Forms | React Hook Form + Zod |
| Charts | Recharts |
| Signatures | react-signature-canvas |
| Icons | Lucide React |

## Getting Started

```bash
# Install dependencies
npm install

# Copy environment variables
cp .env.example .env

# Start development server
npm run dev
```

## Pages

| Route | Description |
|---|---|
| `/login` | Login page |
| `/register` | Registration page |
| `/dashboard` | Overview with stats, contracts table, revenue chart |
| `/contracts` | All contracts with list/grid view, filters |
| `/contracts/new` | TipTap-powered contract editor |
| `/contracts/:id` | Contract detail with timeline and audit log |
| `/templates` | Reusable contract templates |
| `/clauses` | Clause library with categories |
| `/clients` | Client management |
| `/settings` | Profile, business, notifications, billing |
| `/sign/:token` | Public e-signature page (no login required) |

## Folder Structure

```
src/
├── components/
│   ├── ui/          # Button, Badge, Card, Input, Modal, etc.
│   └── layout/      # AppShell, Sidebar, Topbar, MobileNav
├── pages/           # All page components
├── hooks/           # Custom React hooks
├── services/        # Axios API service layer
├── store/           # Zustand stores (auth, contract, ui)
├── utils/           # Formatters, validators, constants
└── router/          # React Router configuration
```

## Environment Variables

```env
VITE_API_URL=http://localhost:8000/api
VITE_APP_NAME=Contractly
```

---

*Contractly Frontend v1.0 — BCA/B.Tech final year project · Production MVP standard*
