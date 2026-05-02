import { useEffect } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { X, LayoutDashboard, FileText, Copy, BookOpen, Users, Settings, Zap, Plus } from 'lucide-react';
import { useUIStore } from '../../store/uiStore';
import { cn } from '../../utils/cn';

const NAV_ITEMS = [
  { label: 'Dashboard',     path: '/dashboard',  icon: LayoutDashboard },
  { label: 'Contracts',     path: '/contracts',  icon: FileText },
  { label: 'Templates',     path: '/templates',  icon: Copy },
  { label: 'Clause Library',path: '/clauses',    icon: BookOpen },
  { label: 'Clients',       path: '/clients',    icon: Users },
  { label: 'Settings',      path: '/settings',   icon: Settings },
];

export function MobileNav() {
  const { isMobileNavOpen, closeMobileNav } = useUIStore();
  const navigate = useNavigate();

  useEffect(() => {
    const handler = (e) => { if (e.key === 'Escape') closeMobileNav(); };
    document.addEventListener('keydown', handler);
    return () => document.removeEventListener('keydown', handler);
  }, [closeMobileNav]);

  return (
    <AnimatePresence>
      {isMobileNavOpen && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/40 z-40 lg:hidden"
            onClick={closeMobileNav}
          />
          <motion.div
            initial={{ x: '-100%' }}
            animate={{ x: 0 }}
            exit={{ x: '-100%' }}
            transition={{ type: 'spring', damping: 30, stiffness: 300 }}
            className="fixed left-0 top-0 h-full w-72 bg-white z-50 flex flex-col shadow-xl"
          >
            <div className="h-16 flex items-center justify-between px-4 border-b border-gray-100">
              <div className="flex items-center gap-2.5">
                <img src="/logo.svg" alt="Contractly Logo" className="w-8 h-8 shrink-0" />
                <span className="text-serif text-xl text-gray-900">Contractly</span>
              </div>
              <button onClick={closeMobileNav} className="p-2 rounded-lg text-gray-400 hover:bg-gray-100">
                <X size={18} />
              </button>
            </div>

            <nav className="flex-1 px-3 py-4 space-y-0.5 overflow-y-auto">
              {NAV_ITEMS.map((item) => {
                const Icon = item.icon;
                return (
                  <NavLink
                    key={item.path}
                    to={item.path}
                    onClick={closeMobileNav}
                    className={({ isActive }) => cn(
                      'flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors',
                      isActive
                        ? 'bg-brand-50 text-brand-600'
                        : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                    )}
                  >
                    <Icon size={18} />
                    {item.label}
                  </NavLink>
                );
              })}
            </nav>

            <div className="p-4 border-t border-gray-100">
              <button
                onClick={() => { navigate('/contracts/new'); closeMobileNav(); }}
                className="w-full flex items-center justify-center gap-2 bg-brand-500 text-white px-4 py-3 rounded-lg text-sm font-medium hover:bg-brand-600 transition-colors"
              >
                <Plus size={16} />
                New Contract
              </button>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
