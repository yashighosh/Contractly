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

        {/* Search — wide command-palette style, collapses on mobile */}
        <button
          onClick={onOpenCommandPalette}
          className={cn(
            'hidden sm:flex items-center gap-2.5 px-3 py-2 rounded-xl border transition-all duration-200',
            'text-fg-muted hover:text-fg-secondary',
            'focus:outline-none',
          )}
          style={{
            minWidth: 340,
            maxWidth: 480,
            flexGrow: 1,
            height: 38,
            background: 'rgba(255,255,255,0.06)',
            border: '0.5px solid rgba(255,255,255,0.1)',
            borderRadius: 10,
          }}
          onMouseEnter={e => e.currentTarget.style.borderColor = 'rgba(255,255,255,0.18)'}
          onMouseLeave={e => e.currentTarget.style.borderColor = 'rgba(255,255,255,0.1)'}
          onFocus={e => e.currentTarget.style.borderColor = 'rgba(201,168,76,0.4)'}
          onBlur={e => e.currentTarget.style.borderColor = 'rgba(255,255,255,0.1)'}
        >
          <Search size={15} style={{ color: '#4A5A72', flexShrink: 0 }} />
          <span className="text-sm flex-1 text-left" style={{ color: '#4A5A72' }}>
            Search contracts, clients...
          </span>
          <kbd style={{
            background: 'rgba(255,255,255,0.06)',
            border: '0.5px solid rgba(255,255,255,0.1)',
            borderRadius: 5,
            fontSize: 11,
            color: '#4A5A72',
            padding: '2px 6px',
            fontFamily: 'var(--font-mono)',
            lineHeight: 1.5,
            flexShrink: 0,
          }}>
            ⌘K
          </kbd>
        </button>

        {/* Mobile: icon-only search button */}
        <button
          onClick={onOpenCommandPalette}
          className="sm:hidden p-2 rounded-lg text-fg-secondary hover:bg-bg-secondary transition-colors"
        >
          <Search size={18} />
        </button>
      </div>

      {/* Right cluster */}
      <div className="flex items-center gap-1">
        {/* New Contract */}
        <Button
          variant="primary"
          size="sm"
          icon={<Plus size={15} />}
          onClick={() => navigate('/contracts/new')}
          className="hidden sm:inline-flex font-semibold"
        >
          New Contract
        </Button>

        {/* Theme toggle */}
        <button
          onClick={toggleTheme}
          className="p-2 rounded-xl transition-colors overflow-hidden"
          style={{ color: '#8896AD' }}
          onMouseEnter={e => { e.currentTarget.style.color='#EDF0F7'; e.currentTarget.style.background='rgba(255,255,255,0.06)'; }}
          onMouseLeave={e => { e.currentTarget.style.color='#8896AD'; e.currentTarget.style.background='transparent'; }}
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
        <button
          className="relative p-2 rounded-xl transition-colors"
          style={{ color: '#8896AD' }}
          onMouseEnter={e => { e.currentTarget.style.color='#EDF0F7'; e.currentTarget.style.background='rgba(255,255,255,0.06)'; }}
          onMouseLeave={e => { e.currentTarget.style.color='#8896AD'; e.currentTarget.style.background='transparent'; }}
        >
          <Bell size={18} />
          {/* Gold notification dot */}
          <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full" style={{ background: 'var(--accent-gold)' }} />
        </button>

        {/* User menu */}
        <Dropdown
          align="right"
          trigger={
            <button
              className="flex items-center gap-2 pl-2 pr-1 py-1 rounded-xl transition-colors"
              style={{ background: '#172035', border: '0.5px solid #1E2D45' }}
              onMouseEnter={e => e.currentTarget.style.borderColor='rgba(201,168,76,0.3)'}
              onMouseLeave={e => e.currentTarget.style.borderColor='#1E2D45'}
            >
              <Avatar name={user?.name || 'User'} src={user?.avatar} size="sm" />
              <span className="hidden md:block text-sm font-medium max-w-[100px] truncate" style={{ color: '#EDF0F7' }}>
                {user?.name || 'User'}
              </span>
              <ChevronDown size={14} style={{ color: '#8896AD' }} />
            </button>
          }
          items={userMenuItems}
        />
      </div>
    </header>
  );
}
