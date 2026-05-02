/**
 * dataStore.js — Per-user isolated data store
 *
 * All data (contracts, clients, templates) is keyed by userId.
 * New users start with completely empty state.
 * The demo account (yashi@contractly.in) is auto-seeded with rich data on first load.
 * Persisted to localStorage under 'contractly-data'.
 */

import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import {
  YASHI_SEED_CONTRACTS,
  YASHI_SEED_CLIENTS,
  YASHI_SEED_ACTIVITY,
  DEMO_EMAIL,
} from './seedData';

/* ── empty slate for a brand-new user ── */
function emptyUserData() {
  return {
    contracts: [],
    clients:   [],
    clauses:   [],
    templates: [],
    activity:  [],
  };
}

/* ── helpers ── */
function getUserData(state, userId) {
  return state.users[userId] ?? emptyUserData();
}

function patchUser(set, userId, updater) {
  set((state) => {
    const current = state.users[userId] ?? emptyUserData();
    return {
      users: {
        ...state.users,
        [userId]: { ...current, ...updater(current) },
      },
    };
  });
}

/* ── store ── */
export const useDataStore = create(
  persist(
    (set, get) => ({
      users: {}, // { [userId]: { contracts, clients, templates, activity } }

      /* ── Seed demo data for yashi on first load ── */
      seedDemoIfNeeded: (userId, email) => {
        const state = get();
        const isDemoEmail = email?.toLowerCase() === DEMO_EMAIL;
        const isDemoId    = userId === 'demo-user-yashi';

        // Seed if: (email matches OR demo ID) AND data slot is empty/unseeded
        if ((isDemoEmail || isDemoId) && !state.users[userId]?._seeded) {
          set((s) => ({
            users: {
              ...s.users,
              [userId]: {
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
      },

      /* ── contracts ──
         NOTE: Do NOT call getContracts(userId) inside a useDataStore() selector —
         it uses get() and returns a new array reference every call, causing an
         infinite re-render loop. Select state directly instead:
           useDataStore((s) => s.users[userId]?.contracts ?? EMPTY_ARR)
      */
      getContracts: (userId) => getUserData(get(), userId).contracts,

      addContract: (userId, contract) =>
        patchUser(set, userId, (d) => ({
          contracts: [{ ...contract, id: `c_${Date.now()}`, createdAt: new Date().toISOString(), updatedAt: new Date().toISOString() }, ...d.contracts],
          activity:  [{ label: `Created "${contract.title}"`, action: 'draft', timestamp: new Date().toISOString(), sub: contract.client || '' }, ...d.activity].slice(0, 50),
        })),

      updateContract: (userId, id, updates) =>
        patchUser(set, userId, (d) => ({
          contracts: d.contracts.map((c) =>
            c.id === id ? { ...c, ...updates, updatedAt: new Date().toISOString() } : c
          ),
        })),

      deleteContract: (userId, id) =>
        patchUser(set, userId, (d) => ({
          contracts: d.contracts.filter((c) => c.id !== id),
        })),

      /* ── clients ── */
      getClients: (userId) => getUserData(get(), userId).clients,

      addClient: (userId, client) =>
        patchUser(set, userId, (d) => ({
          clients: [{ ...client, id: `cl_${Date.now()}`, createdAt: new Date().toISOString() }, ...d.clients],
        })),

      deleteClient: (userId, id) =>
        patchUser(set, userId, (d) => ({
          clients: d.clients.filter((c) => c.id !== id),
        })),

      /* ── templates ── */
      getTemplates: (userId) => getUserData(get(), userId).templates,

      addTemplate: (userId, tpl) =>
        patchUser(set, userId, (d) => ({
          templates: [{ ...tpl, id: `t_${Date.now()}`, createdAt: new Date().toISOString() }, ...d.templates],
        })),

      /* ── clauses ── */
      addClause: (userId, clause) =>
        patchUser(set, userId, (d) => ({
          clauses: [{ ...clause, id: `clause_${Date.now()}`, createdAt: new Date().toISOString() }, ...(d.clauses ?? [])],
        })),

      deleteClause: (userId, id) =>
        patchUser(set, userId, (d) => ({
          clauses: (d.clauses ?? []).filter((c) => c.id !== id),
        })),

      /* ── activity ── */
      getActivity: (userId) => getUserData(get(), userId).activity,

      addActivity: (userId, event) =>
        patchUser(set, userId, (d) => ({
          activity: [{ ...event, timestamp: new Date().toISOString() }, ...d.activity].slice(0, 50),
        })),

      /* ── nuke a user's data ── */
      clearUserData: (userId) =>
        set((state) => ({
          users: { ...state.users, [userId]: emptyUserData() },
        })),
    }),
    {
      name: 'contractly-data',
      version: 1,
    }
  )
);
