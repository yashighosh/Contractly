import { NavLink, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  LayoutDashboard, FileText, Copy, BookOpen,
  Users, Settings, ChevronLeft, ChevronRight,
  Zap, AlertCircle
} from 'lucide-react';
import { cn } from '../../utils/cn';
import { useUIStore } from '../../store/uiStore';
import { Tooltip } from '../ui/Tooltip';

const NAV_ITEMS = [
  { label: 'Dashboard',     path: '/dashboard',  icon: LayoutDashboard },
  { label: 'Contracts',     path: '/contracts',  icon: FileText },
  { label: 'Templates',     path: '/templates',  icon: Copy },
  { label: 'Clause Library',path: '/clauses',    icon: BookOpen },
  { label: 'Clients',       path: '/clients',    icon: Users },
];

const BOTTOM_ITEMS = [
  { label: 'Settings', path: '/settings', icon: Settings },
];

export function Sidebar() {
  const { sidebarCollapsed, toggleSidebar } = useUIStore();

  return (
    <motion.aside
      animate={{ width: sidebarCollapsed ? 64 : 240 }}
      transition={{ type: 'spring', damping: 30, stiffness: 300 }}
      className="relative h-full bg-white border-r border-gray-200 flex flex-col shrink-0 overflow-hidden z-20"
    >
      {/* Logo */}
      <div className="h-16 flex items-center px-4 border-b border-gray-100 shrink-0">
        <div className="flex items-center gap-2.5 overflow-hidden">
          <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-brand-500 to-brand-700 flex items-center justify-center shrink-0">
            <Zap size={16} className="text-white" />
          </div>
          <AnimatePresence>
            {!sidebarCollapsed && (
              <motion.span
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -10 }}
                transition={{ duration: 0.15 }}
                className="text-serif text-xl font-medium text-gray-900 whitespace-nowrap"
              >
                Contractly
              </motion.span>
            )}
          </AnimatePresence>
        </div>
      </div>

      {/* Nav */}
      <nav className="flex-1 px-2 py-4 space-y-0.5 overflow-y-auto">
        {NAV_ITEMS.map((item) => (
          <NavItem key={item.path} item={item} collapsed={sidebarCollapsed} />
        ))}
      </nav>

      {/* Bottom */}
      <div className="px-2 py-3 border-t border-gray-100 space-y-0.5">
        {BOTTOM_ITEMS.map((item) => (
          <NavItem key={item.path} item={item} collapsed={sidebarCollapsed} />
        ))}
      </div>

      {/* Collapse toggle */}
      <button
        onClick={toggleSidebar}
        className="absolute -right-3 top-20 w-6 h-6 bg-white border border-gray-200 rounded-full flex items-center justify-center shadow-sm hover:shadow-md transition-all hover:border-brand-300 text-gray-500 hover:text-brand-500"
      >
        {sidebarCollapsed ? <ChevronRight size={12} /> : <ChevronLeft size={12} />}
      </button>
    </motion.aside>
  );
}

function NavItem({ item, collapsed }) {
  const Icon = item.icon;
  return (
    <Tooltip content={collapsed ? item.label : null} side="right">
      <NavLink
        to={item.path}
        className={({ isActive }) =>
          cn(
            'flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all duration-150 group relative',
            isActive
              ? 'bg-brand-50 text-brand-600 border-l-2 border-brand-500 pl-[10px]'
              : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900 border-l-2 border-transparent'
          )
        }
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
