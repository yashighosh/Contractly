import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Menu, Zap } from 'lucide-react';
import { useAuthStore } from '../../store/authStore';
import { lp } from '../../utils/landingTheme';

export default function LandingNav() {
  const user = useAuthStore((s) => s.user);
  const [scrolled, setScrolled] = React.useState(false);

  React.useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <motion.header
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        zIndex: 100,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: scrolled ? '12px 0' : '20px 0',
        transition: 'all 0.4s cubic-bezier(0.16, 1, 0.3, 1)'
      }}
    >
      <div style={{
        width: scrolled ? '92%' : '100%',
        maxWidth: scrolled ? '1200px' : 'none',
        height: scrolled ? '64px' : '72px',
        backdropFilter: 'blur(16px)',
        WebkitBackdropFilter: 'blur(16px)',
        background: scrolled ? 'rgba(15, 23, 42, 0.7)' : 'transparent',
        border: scrolled ? `1px solid ${lp.border}` : '1px solid transparent',
        borderRadius: scrolled ? '20px' : '0',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: '0 4vw',
        transition: 'all 0.4s cubic-bezier(0.16, 1, 0.3, 1)',
        boxShadow: scrolled ? '0 20px 40px -15px rgba(0,0,0,0.3)' : 'none'
      }}>
        <Link to="/" style={{ textDecoration:'none', display: 'flex', alignItems: 'center', gap: 12, cursor: 'pointer' }}>
          <img src="/logo.svg" alt="Contractly" style={{ width: 32, height: 32 }} />
          <span style={{ fontFamily: 'Lora,Georgia,serif', fontSize: 22, fontWeight: 700, color: lp.tp, letterSpacing: '-0.02em' }}>Contractly</span>
        </Link>

        <nav className="hidden md:flex items-center gap-10">
          {[
            { label: 'Features', to: '/#features' },
            { label: 'How it works', to: '/#how-it-works' },
            { label: 'Pricing', to: '/pricing' },
            { label: 'Templates', to: '/templates-public' },
          ].map(l => (
            <Link key={l.label} to={l.to}
              style={{
                fontFamily: 'DM Sans,sans-serif',
                fontSize: 14,
                fontWeight: 500,
                color: lp.ts,
                textDecoration: 'none',
                transition: 'all 200ms',
                position: 'relative'
              }}
              onMouseEnter={e => { e.target.style.color = lp.gold; }}
              onMouseLeave={e => { e.target.style.color = lp.ts; }}
            >
              {l.label}
            </Link>
          ))}
        </nav>

        <div className="flex items-center gap-4">
          {user ? (
            <Link to="/dashboard" style={{ fontFamily: 'DM Sans,sans-serif', fontSize: 14, fontWeight: 600, color: lp.tp, textDecoration: 'none' }}>Dashboard</Link>
          ) : (
            <Link to="/login" style={{ fontFamily: 'DM Sans,sans-serif', fontSize: 14, fontWeight: 600, color: lp.ts, textDecoration: 'none', transition: 'color 0.2s' }} onMouseEnter={e => e.target.style.color = lp.tp} onMouseLeave={e => e.target.style.color = lp.ts}>Log in</Link>
          )}
          <Link to="/register" style={{
            fontFamily: 'DM Sans,sans-serif',
            fontSize: 14,
            fontWeight: 700,
            color: lp.navy,
            background: lp.gold,
            borderRadius: 12,
            padding: '10px 24px',
            textDecoration: 'none',
            boxShadow: `0 8px 20px -6px ${lp.gold}44`,
            transition: 'all 0.3s'
          }}
          onMouseEnter={e => {
            e.currentTarget.style.transform = 'translateY(-2px)';
            e.currentTarget.style.boxShadow = `0 12px 25px -6px ${lp.gold}66`;
          }}
          onMouseLeave={e => {
            e.currentTarget.style.transform = 'translateY(0)';
            e.currentTarget.style.boxShadow = `0 8px 20px -6px ${lp.gold}44`;
          }}>
            Get started
          </Link>
          <button className="md:hidden" style={{ color: lp.ts, background: 'none', border: 'none', cursor: 'pointer' }}><Menu size={24} /></button>
        </div>
      </div>
    </motion.header>
  );
}
