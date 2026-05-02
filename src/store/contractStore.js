import { create } from 'zustand';

export const useContractStore = create((set) => ({
  contracts:        [],
  selectedContract: null,
  filters: {
    status: 'all',
    search: '',
    client: 'all',
    sortBy: 'createdAt',
    sortDir: 'desc',
  },

  setContracts:    (contracts) => set({ contracts }),
  setSelected:     (contract) => set({ selectedContract: contract }),
  clearSelected:   () => set({ selectedContract: null }),
  setFilters:      (filters) => set((state) => ({ filters: { ...state.filters, ...filters } })),
  resetFilters:    () => set({ filters: { status: 'all', search: '', client: 'all', sortBy: 'createdAt', sortDir: 'desc' } }),
}));
