import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { authService } from '../services/authService';
import {
  YASHI_SEED_CONTRACTS,
  YASHI_SEED_CLIENTS,
  YASHI_SEED_ACTIVITY,
  DEMO_EMAIL,
} from './seedData';

// NOTE: circular import is intentional and safe in Vite ESM —
// by the time loginWithDemo() is called, both modules are fully evaluated.
// We use a getter so the import is resolved lazily at call-time.
let _dataStore = null;
function getDataStore() {
  if (!_dataStore) {
    // eslint-disable-next-line no-use-before-define
    _dataStore = require('./dataStore');
  }
  return _dataStore;
}

const DEMO_USER_ID = 'demo-user-yashi';

const DEMO_USER = {
  id:      DEMO_USER_ID,
  name:    'Yashi Ghosh',
  email:   'yashi@contractly.in',
  role:    'freelancer',
  company: 'Contractly',
  avatar:  null,
  isDemo:  true,
};

const DEMO_SEED = {
  contracts: YASHI_SEED_CONTRACTS,
  clients:   YASHI_SEED_CLIENTS,
  clauses:   [],
  templates: [],
  activity:  YASHI_SEED_ACTIVITY,
  _seeded:   true,
};

export const useAuthStore = create(
  persist(
    (set, get) => ({
      user:            null,
      token:           null,
      isAuthenticated: false,

      /* ── loginWithDemo — NO network call, instant access ── */
      loginWithDemo: () => {
        // 1) Set auth state immediately
        set({ user: DEMO_USER, token: 'demo-token-bypass', isAuthenticated: true });

        // 2) Seed demo data into dataStore in-memory state
        //    Dynamic import avoids circular reference at module load time
        import('./dataStore').then(({ useDataStore }) => {
          const { users } = useDataStore.getState();
          if (!users?.[DEMO_USER_ID]?._seeded) {
            useDataStore.setState((s) => ({
              users: {
                ...s.users,
                [DEMO_USER_ID]: DEMO_SEED,
              },
            }));
          }
        });
      },

      /* ── register({ name, email, password, companyName }) ── */
      register: async ({ name, email, password, companyName }) => {
        if (!name?.trim())  throw new Error('Full name is required');
        if (!email?.trim()) throw new Error('Email is required');
        if (!password || password.length < 8) throw new Error('Password must be at least 8 characters');

        const data = await authService.register({
          fullName: name.trim(),
          email: email.trim().toLowerCase(),
          password,
          companyName,
        });
        set({ user: data.user, token: data.accessToken, isAuthenticated: true });
      },

      /* ── login({ email, password }) ── */
      login: async ({ email, password }) => {
        if (!email?.trim())    throw new Error('Email is required');
        if (!password?.trim()) throw new Error('Password is required');

        const data = await authService.login({
          email: email.trim().toLowerCase(),
          password,
        });
        set({ user: data.user, token: data.accessToken, isAuthenticated: true });

        // Seed demo data if logging in as demo email via real API
        if (email.trim().toLowerCase() === DEMO_EMAIL) {
          import('./dataStore').then(({ useDataStore }) => {
            useDataStore.getState().seedDemoIfNeeded(data.user.id, email);
          });
        }
      },

      /* ── logout ── */
      logout: () => {
        const { user } = get();
        if (user?.isDemo) {
          // Demo logout — no API call, no data wipe (preserve local edits)
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
