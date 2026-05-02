import { createBrowserRouter, Navigate } from 'react-router-dom';
import { AppShell } from '../components/layout/AppShell';
import { useAuthStore } from '../store/authStore';

// Auth pages
import Login       from '../pages/auth/Login';
import Register    from '../pages/auth/Register';

// App pages
import Dashboard    from '../pages/Dashboard';
import Contracts    from '../pages/Contracts';
import ContractNew  from '../pages/ContractNew';
import ContractEdit from '../pages/ContractEdit';
import ContractView from '../pages/ContractView';
import Templates    from '../pages/Templates';
import ClauseLibrary from '../pages/ClauseLibrary';
import Clients      from '../pages/Clients';
import Settings     from '../pages/Settings';
import SignPage     from '../pages/SignPage';
import LandingPage  from '../pages/LandingPage';

// ── Route guards ──────────────────────────────────────────

// Root: landing for guests, redirect to /dashboard for authed
function HomeRoute() {
  const isAuthenticated = useAuthStore((s) => s.isAuthenticated);
  return isAuthenticated ? <Navigate to="/dashboard" replace /> : <LandingPage />;
}

// Protected: redirect to landing if not authed
function ProtectedRoute({ children }) {
  const isAuthenticated = useAuthStore((s) => s.isAuthenticated);
  if (!isAuthenticated) return <Navigate to="/" replace />;
  return children;
}

// Public auth pages: redirect to /dashboard if already authed
function PublicRoute({ children }) {
  const isAuthenticated = useAuthStore((s) => s.isAuthenticated);
  if (isAuthenticated) return <Navigate to="/dashboard" replace />;
  return children;
}

// 404
function NotFound() {
  return (
    <div style={{ minHeight:'100vh', display:'flex', alignItems:'center', justifyContent:'center', background:'var(--bg-page)' }}>
      <div style={{ textAlign:'center' }}>
        <div style={{ fontSize:96, fontWeight:300, color:'var(--border-default)', fontFamily:'var(--font-serif)' }}>404</div>
        <h1 style={{ fontSize:22, fontWeight:600, color:'var(--fg-primary)', margin:'0 0 8px' }}>Page not found</h1>
        <p style={{ color:'var(--fg-secondary)', marginBottom:24 }}>The page you're looking for doesn't exist.</p>
        <a href="/dashboard" style={{ display:'inline-flex', alignItems:'center', gap:8, padding:'8px 18px', background:'var(--accent-gold)', color:'#0F1A2E', borderRadius:8, textDecoration:'none', fontWeight:600, fontSize:14 }}>
          Go to Dashboard
        </a>
      </div>
    </div>
  );
}

// ── Router ────────────────────────────────────────────────

export const router = createBrowserRouter([

  // Landing — public root
  { path: '/', element: <HomeRoute /> },

  // Auth routes (redirect to dashboard if already logged in)
  { path: '/login',    element: <PublicRoute><Login /></PublicRoute> },
  { path: '/register', element: <PublicRoute><Register /></PublicRoute> },

  // Public sign page (no login required)
  { path: '/sign/:token', element: <SignPage /> },

  // Protected app routes — all use AppShell as layout
  {
    element: <ProtectedRoute><AppShell /></ProtectedRoute>,
    children: [
      { path: 'dashboard',           element: <Dashboard /> },
      { path: 'contracts',           element: <Contracts /> },
      { path: 'contracts/new',       element: <ContractNew /> },
      { path: 'contracts/:id',       element: <ContractView /> },
      { path: 'contracts/:id/edit',  element: <ContractEdit /> },
      { path: 'templates',           element: <Templates /> },
      { path: 'clauses',             element: <ClauseLibrary /> },
      { path: 'clients',             element: <Clients /> },
      { path: 'settings',            element: <Settings /> },
    ],
  },

  // 404
  { path: '*', element: <NotFound /> },

], {
  future: {
    v7_startTransition:  true,
    v7_relativeSplatPath: true,
  },
});
