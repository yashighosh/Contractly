import { useEffect } from 'react';
import { useUIStore } from '../store/uiStore';

export function useTheme() {
  const { theme, initTheme, toggleTheme, setTheme } = useUIStore();

  // Init on mount — read localStorage + system preference
  useEffect(() => {
    initTheme();

    // Listen for system preference changes (handles 'system' mode)
    const mq = window.matchMedia('(prefers-color-scheme: dark)');
    const handleChange = (e) => {
      const stored = localStorage.getItem('contractly-theme');
      if (!stored || stored === 'system') {
        document.documentElement.classList.toggle('dark', e.matches);
      }
    };
    mq.addEventListener('change', handleChange);
    return () => mq.removeEventListener('change', handleChange);
  }, []);

  return { theme, toggleTheme, setTheme, isDark: theme === 'dark' };
}
