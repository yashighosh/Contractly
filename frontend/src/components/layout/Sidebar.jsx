import { NavLink } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  LayoutDashboard, FileText, Copy, BookOpen,
  Users, Settings, ChevronLeft, ChevronRight, Zap,
  User, Building2, Bell, PenLine, CreditCard, ArrowLeft
} from 'lucide-react';
import { cn } from '../../utils/cn';
import { useUIStore } from '../../store/uiStore';
import { Tooltip } from '../ui/Tooltip';
import { useLocation, useNavigate } from 'react-router-dom';
import { useAuthStore } from '../../store/authStore';
import { LogOut } from 'lucide-react';

const NAV_ITEMS = [
  { label: 'Dashboard',     path: '/dashboard', icon: LayoutDashboard },
  { label: 'Contracts',     path: '/contracts', icon: FileText },
  { label: 'Templates',     path: '/templates', icon: Copy },
  { label: 'Clause Library',path: '/clauses',   icon: BookOpen },
  { label: 'Clients',       path: '/clients',   icon: Users },
];

const SETTINGS_NAV_ITEMS = [
  { label: 'Profile',       path: '/settings?tab=profile',      icon: User },
  { label: 'Business',      path: '/settings?tab=business',     icon: Building2 },
  { label: 'Notifications', path: '/settings?tab=notifications', icon: Bell },
  { label: 'Signature',     path: '/settings?tab=signature',    icon: PenLine },
  { label: 'Billing',       path: '/settings?tab=billing',      icon: CreditCard },
];

const BOTTOM_ITEMS = [
  { label: 'Settings', path: '/settings', icon: Settings },
];

export function Sidebar() {
  const { sidebarCollapsed, toggleSidebar } = useUIStore();
  const { logout } = useAuthStore();
  const location = useLocation();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    localStorage.removeItem('auth-storage');
    window.location.href = '/login';
  };
  const isSettings = location.pathname.startsWith('/settings');

  return (
    <motion.aside
      animate={{ width: sidebarCollapsed ? 64 : 240 }}
      transition={{ type: 'spring', damping: 30, stiffness: 300 }}
      className="relative h-full shrink-0 z-20"
      style={{ backgroundColor: 'var(--sidebar-bg)' }}
    >
      <div className="flex flex-col h-full overflow-hidden">
      {/* Logo */}
      <div className="h-16 flex items-center px-4 border-b shrink-0" style={{ borderColor: 'rgba(255,255,255,0.08)' }}>
        <div className="flex items-center gap-2.5 overflow-hidden">
          <img src="/logo.svg" alt="Contractly Logo" className="w-8 h-8 shrink-0" />
          <AnimatePresence>
            {!sidebarCollapsed && (
              <motion.span
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -10 }}
                transition={{ duration: 0.15 }}
                className="font-serif text-xl font-medium whitespace-nowrap"
                style={{ color: '#F1F5F9' }}
              >
                Contractly
              </motion.span>
            )}
          </AnimatePresence>
        </div>
      </div>

      {/* Nav */}
      <nav className="flex-1 px-2 py-4 flex flex-col gap-0.5 overflow-y-auto custom-scrollbar">
        {isSettings && (
          <button
            onClick={() => navigate('/dashboard')}
            className={cn(
              "w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all duration-150 mb-4 text-slate-400 hover:text-white hover:bg-white/5",
              sidebarCollapsed && "justify-center px-0"
            )}
          >
            <ArrowLeft size={18} />
            {!sidebarCollapsed && <span>Back to Home</span>}
          </button>
        )}
        
        {(isSettings ? SETTINGS_NAV_ITEMS : NAV_ITEMS).map((item) => (
          <NavItem key={item.path} item={item} collapsed={sidebarCollapsed} />
        ))}

        {isSettings && (
          <button
            onClick={handleLogout}
            className={cn(
              "w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all duration-150 mt-auto text-red-400 hover:text-white hover:bg-red-500/10",
              sidebarCollapsed && "justify-center px-0"
            )}
          >
            <LogOut size={18} className="shrink-0" />
            {!sidebarCollapsed && <span>Log Out</span>}
          </button>
        )}
      </nav>

      {/* Bottom */}
      {!isSettings && (
        <div className="px-2 py-3 space-y-0.5" style={{ borderTop: '1px solid rgba(255,255,255,0.08)' }}>
          {BOTTOM_ITEMS.map((item) => (
            <NavItem key={item.path} item={item} collapsed={sidebarCollapsed} />
          ))}
        </div>
      )}
      </div>

      {/* Collapse toggle */}
      <button
        onClick={toggleSidebar}
        className="absolute -right-3 top-20 w-6 h-6 rounded-full flex items-center justify-center shadow-card hover:shadow-card-lg transition-all"
        style={{
          backgroundColor: 'var(--bg-primary)',
          border: '1px solid var(--border-default)',
          color: 'var(--fg-secondary)',
          zIndex: 30,
        }}
      >
        {sidebarCollapsed ? <ChevronRight size={12} /> : <ChevronLeft size={12} />}
      </button>
    </motion.aside>
  );
}

function NavItem({ item, collapsed }) {
  const Icon = item.icon;
  const location = useLocation();
  const isActive = location.pathname === item.path || (location.pathname + location.search) === item.path;

  return (
    <Tooltip content={collapsed ? item.label : null} side="right">
      <NavLink
        to={item.path}
        className={cn(
          'flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all duration-150 relative w-full',
          isActive
            ? 'border-l-2'
            : 'border-l-2 border-transparent'
        )}
        style={{
          backgroundColor: isActive
            ? 'rgba(201,168,76,0.12)'
            : 'transparent',
          color: isActive
            ? 'var(--accent-gold)'
            : 'var(--sidebar-text)',
          borderLeftColor: isActive ? 'var(--accent-gold)' : 'transparent',
          paddingLeft: isActive ? '10px' : '12px',
        }}
        onMouseEnter={(e) => {
          if (!e.currentTarget.classList.contains('active')) {
            e.currentTarget.style.backgroundColor = 'var(--sidebar-hover)';
            e.currentTarget.style.color = '#F1F5F9';
          }
        }}
        onMouseLeave={(e) => {
          if (!e.currentTarget.querySelector('[aria-current]')) {
            // Reset happens via NavLink's className
          }
        }}
      >
        <Icon size={18} className="shrink-0" />
        <AnimatePresence>
          {!collapsed && (
            <motion.span
              initial={{ opacity: 0, x: -6 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -6 }}
              transition={{ duration: 0.12 }}
              className="whitespace-nowrap overflow-hidden"
            >
              {item.label}
            </motion.span>
          )}
        </AnimatePresence>
      </NavLink>
    </Tooltip>
  );
}
