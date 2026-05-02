import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Bell, Search, Plus, LogOut, User, ChevronDown, Menu, Sun, Moon, Command } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { Avatar } from '../ui/Avatar';
import { Dropdown } from '../ui/Dropdown';
import { Button } from '../ui/Button';
import { useAuthStore } from '../../store/authStore';
import { useUIStore } from '../../store/uiStore';
import { cn } from '../../utils/cn';

export function Topbar({ onOpenCommandPalette }) {
  const { user, logout } = useAuthStore();
  const { toggleMobileNav, theme, toggleTheme } = useUIStore();
  const navigate = useNavigate();
  const [searchFocus, setSearchFocus] = useState(false);
  const isDark = theme === 'dark';

  // Cmd+K shortcut hint → open palette
  useEffect(() => {
    const down = (e) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        onOpenCommandPalette?.();
      }
    };
    window.addEventListener('keydown', down);
    return () => window.removeEventListener('keydown', down);
  }, [onOpenCommandPalette]);

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const userMenuItems = [
    { label: 'Profile', icon: <User size={14} />, onClick: () => navigate('/settings') },
    { divider: true },
    { label: 'Log out', icon: <LogOut size={14} />, onClick: handleLogout, danger: true },
  ];

  return (
    <header className="h-16 bg-bg-primary border-b border-border-col flex items-center justify-between px-4 lg:px-6 shrink-0 z-10">
      {/* Left: Mobile menu + Search */}
      <div className="flex items-center gap-3 flex-1">
        <button
          onClick={toggleMobileNav}
          className="lg:hidden p-2 rounded-lg text-fg-secondary hover:bg-bg-secondary transition-colors"
        >
          <Menu size={20} />
        </button>

        {/* Search — opens command palette */}
        <button
          onClick={onOpenCommandPalette}
          className={cn(
            'hidden sm:flex items-center gap-2 px-3 py-2 rounded-xl border transition-all duration-150',
            'bg-bg-secondary border-border-col text-fg-secondary hover:border-[var(--accent-gold)] w-64',
            searchFocus && 'ring-2 ring-[var(--accent-gold)]/20 w-80 border-[var(--accent-gold)]'
          )}
          onFocus={() => setSearchFocus(true)}
          onBlur={() => setSearchFocus(false)}
        >
          <Search size={15} className="shrink-0 opacity-50" />
          <span className="text-sm flex-1 text-left opacity-60">Search contracts, clients…</span>
          <kbd className="hidden lg:inline-flex items-center gap-0.5 px-1.5 py-0.5 text-xs text-fg-secondary bg-bg-page rounded border border-border-col font-mono">
            <Command size={10} />K
          </kbd>
        </button>
      </div>

      {/* Right cluster */}
      <div className="flex items-center gap-1.5">
        {/* New Contract */}
        <Button
          variant="primary"
          size="sm"
          icon={<Plus size={15} />}
          onClick={() => navigate('/contracts/new')}
          className="hidden sm:inline-flex !bg-[var(--accent-gold)] !text-brand-navy-900 hover:!bg-brand-gold-300 font-semibold"
        >
          New Contract
        </Button>

        {/* Theme toggle */}
        <button
          onClick={toggleTheme}
          className="p-2 rounded-xl text-fg-secondary hover:bg-bg-secondary transition-colors overflow-hidden"
          title={isDark ? 'Switch to light mode' : 'Switch to dark mode'}
        >
          <AnimatePresence mode="wait" initial={false}>
            {isDark ? (
              <motion.div
                key="sun"
                initial={{ rotate: -90, opacity: 0 }}
                animate={{ rotate: 0, opacity: 1 }}
                exit={{ rotate: 90, opacity: 0 }}
                transition={{ duration: 0.2 }}
              >
                <Sun size={18} />
              </motion.div>
            ) : (
              <motion.div
                key="moon"
                initial={{ rotate: 90, opacity: 0 }}
                animate={{ rotate: 0, opacity: 1 }}
                exit={{ rotate: -90, opacity: 0 }}
                transition={{ duration: 0.2 }}
              >
                <Moon size={18} />
              </motion.div>
            )}
          </AnimatePresence>
        </button>

        {/* Notifications */}
        <button className="relative p-2 rounded-xl text-fg-secondary hover:bg-bg-secondary transition-colors">
          <Bell size={18} />
          <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-[var(--accent-gold)] rounded-full animate-pulse" />
        </button>

        {/* User menu */}
        <Dropdown
          align="right"
          trigger={
            <button className="flex items-center gap-2 pl-2 pr-1 py-1 rounded-xl hover:bg-bg-secondary transition-colors">
              <Avatar name={user?.name || 'User'} src={user?.avatar} size="sm" />
              <span className="hidden md:block text-sm font-medium text-fg-primary max-w-[100px] truncate">
                {user?.name || 'User'}
              </span>
              <ChevronDown size={14} className="text-fg-secondary" />
            </button>
          }
          items={userMenuItems}
        />
      </div>
    </header>
  );
}
