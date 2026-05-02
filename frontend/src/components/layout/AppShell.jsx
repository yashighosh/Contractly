import { useState, useEffect } from 'react';
import { Link, Outlet } from 'react-router-dom';
import { Sidebar } from './Sidebar';
import { Topbar } from './Topbar';
import { MobileNav } from './MobileNav';
import { useTheme } from '../../hooks/useTheme';
import { CommandPalette } from '../ui/CommandPalette';
import { useAuthStore } from '../../store/authStore';

export function AppShell() {
  useTheme();
  const [paletteOpen, setPaletteOpen] = useState(false);
  const isDemo = useAuthStore((s) => s.user?.isDemo);

  // Global Cmd+K listener
  useEffect(() => {
    const down = (e) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        setPaletteOpen((o) => !o);
      }
      if (e.key === 'Escape') setPaletteOpen(false);
    };
    window.addEventListener('keydown', down);
    return () => window.removeEventListener('keydown', down);
  }, []);

  return (
    <div className="flex h-screen bg-bg-page overflow-hidden">
      {/* Desktop Sidebar */}
      <div className="hidden lg:flex">
        <Sidebar />
      </div>

      {/* Mobile Nav */}
      <MobileNav />

      {/* Main Content */}
      <div className="flex flex-col flex-1 min-w-0 overflow-hidden">
        <Topbar onOpenCommandPalette={() => setPaletteOpen(true)} />

        {/* Demo mode banner */}
        {isDemo && (
          <div style={{
            background: 'rgba(201,168,76,0.08)',
            borderBottom: '0.5px solid rgba(201,168,76,0.2)',
            padding: '7px 20px',
            fontSize: 12,
            color: '#E2C87A',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: 8,
            flexShrink: 0,
          }}>
            <span>🎯</span>
            <span style={{ fontFamily: 'DM Sans, sans-serif' }}>
              Demo mode — data is local only and resets on logout
            </span>
            <Link to="/register" style={{ color: '#C9A84C', textDecoration: 'underline', marginLeft: 8, fontSize: 12 }}>
              Create a real account →
            </Link>
          </div>
        )}

        <main className="flex-1 overflow-y-auto bg-bg-page">
          <Outlet />
        </main>
      </div>

      {/* Global Command Palette */}
      <CommandPalette isOpen={paletteOpen} onClose={() => setPaletteOpen(false)} />
    </div>
  );
}
