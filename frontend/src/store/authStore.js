import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { authService } from '../services/authService';

export const useAuthStore = create(
  persist(
    (set, get) => ({
      user:            null,
      token:           null,
      sessionId:       null,
      isAuthenticated: false,

      /* ── loginWithDemo removed ── */
      loginWithDemo: () => {
        throw new Error('Demo login is no longer available');
      },

      /* ── signup(formData) ── */
      signup: async (formData) => {
        const { fullName, email, password } = formData;
        if (!fullName?.trim())  throw new Error('Full name is required');
        if (!email?.trim())     throw new Error('Email is required');
        if (!password || password.length < 6) throw new Error('Password must be at least 6 characters');

        const data = await authService.register(formData);
        set({ user: data.user, token: data.accessToken, sessionId: data.sessionId, isAuthenticated: true });
      },

      /* ── login({ email, password }) ── */
      login: async ({ email, password }) => {
        if (!email?.trim())    throw new Error('Email is required');
        if (!password?.trim()) throw new Error('Password is required');

        const data = await authService.login({
          email: email.trim().toLowerCase(),
          password,
        });
        set({ user: data.user, token: data.accessToken, sessionId: data.sessionId, isAuthenticated: true });
      },

      /* ── logout ── */
      logout: () => {
        const { sessionId, token } = get();
        console.log('Logging out with sessionId:', sessionId);
        
        // Only call backend if we have a token/session
        if (token) {
          authService.logout(sessionId).catch(err => console.error('Logout service error:', err));
        }
        
        // Clear everything locally regardless of backend success
        set({ 
          token: null, 
          user: null, 
          sessionId: null, 
          isAuthenticated: false 
        });
        
        // Clear local storage explicitly to be safe
        localStorage.removeItem('auth-storage');
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
        sessionId:       state.sessionId,
        user:            state.user,
        isAuthenticated: state.isAuthenticated,
      }),
    }
  )
);
