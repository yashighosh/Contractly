import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { authService } from '../services/authService';
import {
  YASHI_SEED_CONTRACTS,
  YASHI_SEED_CLIENTS,
  YASHI_SEED_ACTIVITY,
} from './seedData';

const DEMO_USER = {
  id:          'demo-user-yashi',
  name:        'Yashi Ghosh',
  email:       'yashi@contractly.in',
  role:        'freelancer',
  company:     'Contractly',
  avatar:      null,
  isDemo:      true,
};

export const useAuthStore = create(
  persist(
    (set, get) => ({
      user:            null,
      token:           null,
      isAuthenticated: false,

      /* ── loginWithDemo — NO network call, instant access ── */
      loginWithDemo: () => {
        // Seed demo data into dataStore for the demo user
        // Import lazily to avoid circular dep
        import('./dataStore').then(({ useDataStore }) => {
          const store = useDataStore.getState();
          if (!store.users?.[DEMO_USER.id]) {
            useDataStore.setState((s) => ({
              users: {
                ...s.users,
                [DEMO_USER.id]: {
                  contracts: YASHI_SEED_CONTRACTS,
                  clients:   YASHI_SEED_CLIENTS,
                  clauses:   [],
                  templates: [],
                  activity:  YASHI_SEED_ACTIVITY,
                  _seeded:   true,
                },
              },
            }));
          }
        });

        set({ user: DEMO_USER, token: 'demo-token-bypass', isAuthenticated: true });
      },

      /* ── register({ name, email, password, companyName }) ── */
      register: async ({ name, email, password, companyName }) => {
        if (!name?.trim())  throw new Error('Full name is required');
        if (!email?.trim()) throw new Error('Email is required');
        if (!password || password.length < 8) throw new Error('Password must be at least 8 characters');

        const data = await authService.register({ fullName: name.trim(), email: email.trim().toLowerCase(), password, companyName });
        set({ user: data.user, token: data.accessToken, isAuthenticated: true });

        // Seed demo data if registering as demo email
        if (email.trim().toLowerCase() === 'yashi@contractly.in') {
          import('./dataStore').then(({ useDataStore }) => {
            useDataStore.getState().seedDemoIfNeeded(data.user.id, email);
          });
        }
      },

      /* ── login({ email, password }) ── */
      login: async ({ email, password }) => {
        if (!email?.trim())    throw new Error('Email is required');
        if (!password?.trim()) throw new Error('Password is required');

        const data = await authService.login({ email: email.trim().toLowerCase(), password });
        set({ user: data.user, token: data.accessToken, isAuthenticated: true });

        // Seed demo data if logging in as demo email
        import('./dataStore').then(({ useDataStore }) => {
          useDataStore.getState().seedDemoIfNeeded(data.user.id, email);
        });
      },

      /* ── logout ── */
      logout: () => {
        const { user } = get();
        if (user?.isDemo) {
          // Demo logout — no API call needed
          set({ token: null, user: null, isAuthenticated: false });
          return;
        }
        authService.logout().catch(() => {});
        set({ token: null, user: null, isAuthenticated: false });
      },

      /* ── updateUser ── */
      updateUser: (updates) =>
        set((state) => ({ user: { ...state.user, ...updates } })),

      /* ── setAuth ── */
      setAuth: (token, user) => set({ token, user, isAuthenticated: true }),
    }),
    {
      name: 'contractly-auth',
      version: 2,
      partialize: (state) => ({
        token:           state.token,
        user:            state.user,
        isAuthenticated: state.isAuthenticated,
      }),
    }
  )
);
