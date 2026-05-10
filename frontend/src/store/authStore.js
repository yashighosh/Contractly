import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { authService } from '../services/authService';

export const useAuthStore = create(
  persist(
    (set, get) => ({
      user:            null,
      token:           null,
      isAuthenticated: false,

      /* ── loginWithDemo removed ── */
      loginWithDemo: () => {
        throw new Error('Demo login is no longer available');
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
      },

      /* ── logout ── */
      logout: () => {
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
