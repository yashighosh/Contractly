# Contractly 🖋️

**Contractly** is a premium, full-stack contract management platform designed for the modern Indian economy. Built specifically for freelancers and small agencies, it streamlines the entire document lifecycle—from high-end visual drafting to automated signature tracking and revenue analytics.

![Status](https://img.shields.io/badge/Status-Beta-gold?style=for-the-badge)
![Tech Stack](https://img.shields.io/badge/Stack-Node.js_%7C_React_%7C_MongoDB-green?style=for-the-badge)

---

## ✨ Key Features

-   **💎 Premium Glassmorphism UI**: A stunning, high-end interface featuring advanced Framer Motion animations and "Midnight & Gold" aesthetics.
-   **📊 Intelligent Dashboard**: Real-time overview of revenue, active contracts, and expiring documents.
-   **📄 Dynamic Templates**: A public showcase of categorized legal templates (Design, Dev, Marketing) ready to be customized.
-   **✒️ Legally Valid Signatures**: IT Act-compliant e-signatures with comprehensive IP and timestamp audit trails.
-   **🛡️ SuperAdmin Portal**: Dedicated interface for managing user registrations, API logs, and platform health.
-   **💹 Revenue Analytics**: Track locked revenue and payment milestones automatically.

---

## 🛠️ Tech Stack

### **Frontend**
-   **Framework**: React 18 (Vite)
-   **Styling**: Premium Vanilla CSS + Glassmorphism logic
-   **State Management**: Zustand
-   **Data Fetching**: TanStack Query (React Query)
-   **Animations**: Framer Motion (Staggered entries, 3D transforms)
-   **Icons**: Lucide React

### **Backend**
-   **Runtime**: Node.js (TypeScript)
-   **Framework**: Express.js
-   **Database**: MongoDB (Mongoose)
-   **Security**: JWT (JSON Web Tokens) with secure HTTP-only cookie support
-   **Architecture**: Modular Controller-Route-Model pattern

### **Admin Portal**
-   **Framework**: Vite + React + TypeScript
-   **UI**: Minimalist, high-performance monitoring dashboard

---

## 🚀 Getting Started

### **Prerequisites**
-   [Docker & Docker Compose](https://www.docker.com/products/docker-desktop)
-   [Node.js 20+](https://nodejs.org/)

### **One-Command Setup (Recommended)**
Contractly is fully containerized. To get everything running in seconds:

```bash
# Clone the repository
git clone https://github.com/yashighosh/Contractly.git
cd Contractly

# Start all services (MongoDB, Backend, Frontend, Admin)
docker compose up -d
```

Your app will be available at:
-   **Main Frontend**: `http://localhost:5173`
-   **Admin Portal**: `http://localhost:5174`
-   **API Server**: `http://localhost:8080/api`

---

## 📂 Project Structure

```text
contractly/
├── admin/              # Admin Monitoring Portal (React + TS)
├── backend/            # Express API Server (Node + TypeScript)
│   ├── src/            # Controllers, Models, Routes, Middlewares
│   └── package.json
├── frontend/           # Customer Facing Web App (React)
│   ├── src/            # Pages, Components (Landing, Dashboard, Editor)
│   └── public/         # Branding assets
└── readme.md           # You are here
```

---

## 📝 License
This project is licensed under the MIT License.

---

Built with ❤️ for the Indian Freelance Community 🇮🇳
