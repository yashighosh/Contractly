# Contractly 🖋️

**Contractly** is a premium, full-stack contract management platform designed for freelancers and small agencies. It streamlines the entire lifecycle of a contract—from creation using dynamic templates to automated signature tracking and revenue analytics.

![Dashboard Preview](https://img.shields.io/badge/Status-Beta-gold?style=for-the-badge)
![Tech Stack](https://img.shields.io/badge/Stack-Spring_Boot_%7C_React_%7C_MySQL-blue?style=for-the-badge)

---

## ✨ Key Features

-   **📊 Intelligent Dashboard**: Real-time overview of revenue, active contracts, and pending signatures.
-   **📄 Dynamic Templates**: Create reusable contract templates with variables for lightning-fast document generation.
-   **📑 Clause Library**: Store and manage common legal clauses to drag-and-drop into any contract.
-   **🤝 Client Management**: Integrated CRM to track client history and contact details.
-   **🔐 Secure Signatures**: Status tracking (Sent, Viewed, Signed) to keep you informed of every step.
-   **🌑 Modern UI/UX**: A stunning, responsive interface with Dark Mode support and smooth animations.

---

## 🛠️ Tech Stack

### **Backend**
-   **Framework**: Spring Boot 3.4.5 (Java 21)
-   **Database**: MySQL 8.0 (Raw JDBC for high performance)
-   **Security**: JWT (JSON Web Tokens) with 24-hour sessions
-   **Cache**: Redis (for session and rate limiting)
-   **Migrations**: Custom SQL-based schema initialization

### **Frontend**
-   **Framework**: React (Vite)
-   **State Management**: Zustand
-   **Data Fetching**: TanStack Query (React Query)
-   **Styling**: TailwindCSS & Vanilla CSS
-   **Icons**: Lucide React
-   **Animations**: Framer Motion

---

## 🚀 Getting Started

### **Prerequisites**
-   [Docker & Docker Compose](https://www.docker.com/products/docker-desktop)
-   [Node.js 20+](https://nodejs.org/) (for local frontend dev)
-   [JDK 21+](https://openjdk.org/projects/jdk/21/) (for local backend dev)

### **One-Command Setup (Recommended)**
The easiest way to get Contractly running is via Docker:

```bash
# Clone the repository
git clone https://github.com/yashighosh/Contractly.git
cd Contractly

# Start all services (MySQL, Redis, Backend, Frontend)
docker compose up -d
```

Your app will be available at:
-   **Frontend**: `http://localhost:5173`
-   **Backend API**: `http://localhost:8082/api`

---

## 🔧 Development Configuration

### **Frontend Environment Variables**
Create a `.env` file in the `frontend/` directory:
```env
VITE_API_URL=http://localhost:8082/api
```

### **Backend Configuration**
The backend configuration is managed via `application.properties`. Key settings:
-   `app.jwt.access-token-expiry-ms=86400000` (24 Hours)
-   `spring.sql.init.mode=never` (Prevent schema conflicts on restart)

---

## 👤 Default User Credentials
For the initial setup and demo data, use:
-   **Email**: `anikdas210605@gmail.com`
-   **Password**: `password`

---

## 📂 Project Structure

```text
contractly/
├── backend/            # Spring Boot Application
│   ├── src/            # Java source files
│   └── docker-compose.yml
├── frontend/           # React Application
│   ├── src/            # Components, Pages, Stores
│   └── tailwind.config.js
└── readme.md           # You are here
```

---

## 📝 License
This project is licensed under the MIT License.

---
