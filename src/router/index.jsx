import { createBrowserRouter, Navigate } from 'react-router-dom';
import { AppShell } from '../components/layout/AppShell';
import { useAuthStore } from '../store/authStore';

// Auth pages
import Login    from '../pages/auth/Login';
import Register from '../pages/auth/Register';

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

// Protected route wrapper
function ProtectedRoute({ children }) {
  const isAuthenticated = useAuthStore((s) => s.isAuthenticated);
  if (!isAuthenticated) return <Navigate to="/login" replace />;
  return children;
}

// Public route (redirect to dashboard if already authed)
function PublicRoute({ children }) {
  const isAuthenticated = useAuthStore((s) => s.isAuthenticated);
  if (isAuthenticated) return <Navigate to="/dashboard" replace />;
  return children;
}

// 404 page
function NotFound() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="text-center">
        <div className="text-serif text-8xl font-medium text-gray-200 mb-4">404</div>
        <h1 className="text-2xl font-semibold text-gray-900 mb-2">Page not found</h1>
        <p className="text-gray-500 mb-6">The page you're looking for doesn't exist.</p>
        <a href="/dashboard" className="inline-flex items-center gap-2 px-4 py-2 bg-brand-500 text-white rounded-lg text-sm font-medium hover:bg-brand-600 transition-colors">
          Go to Dashboard
        </a>
      </div>
    </div>
  );
}

export const router = createBrowserRouter([
  // Auth routes
  {
    path: '/login',
    element: <PublicRoute><Login /></PublicRoute>,
  },
  {
    path: '/register',
    element: <PublicRoute><Register /></PublicRoute>,
  },

  // Public sign page (no login required)
  {
    path: '/sign/:token',
    element: <SignPage />,
  },

  // Protected app routes
  {
    path: '/',
    element: <ProtectedRoute><AppShell /></ProtectedRoute>,
    children: [
      { index: true,                       element: <Navigate to="/dashboard" replace /> },
      { path: 'dashboard',                 element: <Dashboard /> },
      { path: 'contracts',                 element: <Contracts /> },
      { path: 'contracts/new',             element: <ContractNew /> },
      { path: 'contracts/:id',             element: <ContractView /> },
      { path: 'contracts/:id/edit',        element: <ContractEdit /> },
      { path: 'templates',                 element: <Templates /> },
      { path: 'clauses',                   element: <ClauseLibrary /> },
      { path: 'clients',                   element: <Clients /> },
      { path: 'settings',                  element: <Settings /> },
    ],
  },

  // 404
  { path: '*', element: <NotFound /> },
]);
