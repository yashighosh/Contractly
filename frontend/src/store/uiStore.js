import { create } from 'zustand';

export const useUIStore = create((set, get) => ({
  sidebarCollapsed:  false,
  previewPanelOpen:  false,
  activeModal:       null,
  viewMode:          'list',
  isMobileNavOpen:   false,

  /* ── Theme ── */
  theme: 'light',  // 'light' | 'dark' | 'system'

  initTheme: () => {
    const stored = localStorage.getItem('contractly-theme');
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    const resolved = stored || (prefersDark ? 'dark' : 'light');
    set({ theme: resolved });
    document.documentElement.classList.toggle('dark', resolved === 'dark' || (resolved === 'system' && prefersDark));
  },

  toggleTheme: () => {
    const current = get().theme;
    const next = current === 'dark' ? 'light' : 'dark';
    localStorage.setItem('contractly-theme', next);
    document.documentElement.classList.toggle('dark', next === 'dark');
    set({ theme: next });
  },

  setTheme: (t) => {
    localStorage.setItem('contractly-theme', t);
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    const isDark = t === 'dark' || (t === 'system' && prefersDark);
    document.documentElement.classList.toggle('dark', isDark);
    set({ theme: t });
  },

  /* ── UI Actions ── */
  toggleSidebar:    () => set((s) => ({ sidebarCollapsed: !s.sidebarCollapsed })),
  setSidebar:       (v) => set({ sidebarCollapsed: v }),
  togglePreview:    () => set((s) => ({ previewPanelOpen: !s.previewPanelOpen })),
  setPreview:       (v) => set({ previewPanelOpen: v }),
  openModal:        (name) => set({ activeModal: name }),
  closeModal:       () => set({ activeModal: null }),
  setViewMode:      (mode) => set({ viewMode: mode }),
  toggleMobileNav:  () => set((s) => ({ isMobileNavOpen: !s.isMobileNavOpen })),
  closeMobileNav:   () => set({ isMobileNavOpen: false }),
}));
