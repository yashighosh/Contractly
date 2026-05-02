import { create } from 'zustand';

export const useUIStore = create((set) => ({
  sidebarCollapsed:  false,
  previewPanelOpen:  false,
  activeModal:       null,   // 'send' | 'delete' | 'renew' | 'auditLog' | null
  viewMode:          'list', // 'list' | 'grid'
  isMobileNavOpen:   false,

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
