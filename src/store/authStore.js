import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { useDataStore } from './dataStore';

/* ── Mock auth helpers ──────────────────────────────────────
   No backend required. Stores user in localStorage.
   Swap these out with real API calls when backend is ready.
─────────────────────────────────────────────────────────── */

const MOCK_DELAY = 600; // ms — simulates network latency

function makeMockToken(email) {
  return `mock_${btoa(email)}_${Date.now()}`;
}

export const useAuthStore = create(
  persist(
    (set, get) => ({
      user:            null,
      token:           null,
      isAuthenticated: false,

      /* ── register({ name, email, password, role }) ── */
      register: async ({ name, email, password, role = 'freelancer' }) => {
        await new Promise((r) => setTimeout(r, MOCK_DELAY));
        if (!name?.trim())  throw new Error('Full name is required');
        if (!email?.trim()) throw new Error('Email is required');
        if (!password || password.length < 6) throw new Error('Password must be at least 6 characters');

        const user  = { id: `user_${Date.now()}`, name: name.trim(), email: email.trim().toLowerCase(), role };
        const token = makeMockToken(email);
        set({ user, token, isAuthenticated: true });

        // Seed demo data for yashi account on first register
        useDataStore.getState().seedDemoIfNeeded(user.id, user.email);
      },

      /* ── login({ email, password }) ── */
      login: async ({ email, password }) => {
        await new Promise((r) => setTimeout(r, MOCK_DELAY));
        if (!email?.trim())   throw new Error('Email is required');
        if (!password?.trim()) throw new Error('Password is required');

        // Check for previously registered user in persisted state
        const stored = get().user;
        if (stored && stored.email === email.trim().toLowerCase()) {
          // Re-authenticate existing user
          const token = makeMockToken(email);
          set({ token, isAuthenticated: true });
          // Seed demo data if needed (e.g. after data was cleared)
          useDataStore.getState().seedDemoIfNeeded(stored.id, stored.email);
          return;
        }

        // Demo fallback: accept any email/password and create a session
        const user  = { id: `user_${Date.now()}`, name: email.split('@')[0], email: email.trim().toLowerCase(), role: 'freelancer' };
        const token = makeMockToken(email);
        set({ user, token, isAuthenticated: true });

        // Seed demo data for yashi account
        useDataStore.getState().seedDemoIfNeeded(user.id, user.email);
      },

      /* ── logout ── */
      logout: () => set({ token: null, user: null, isAuthenticated: false }),

      /* ── updateUser ── */
      updateUser: (updates) =>
        set((state) => ({ user: { ...state.user, ...updates } })),

      /* ── setAuth (legacy — for any existing callers passing token+user directly) ── */
      setAuth: (token, user) => set({ token, user, isAuthenticated: true }),
    }),
    {
      name: 'contractly-auth',
      version: 1,
      partialize: (state) => ({
        token:           state.token,
        user:            state.user,
        isAuthenticated: state.isAuthenticated,
      }),
    }
  )
);
