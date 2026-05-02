import { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Search, FileText, Plus, LayoutDashboard, Users,
  Copy, BookOpen, Settings, ArrowRight, Hash, Command
} from 'lucide-react';
import { cn } from '../../utils/cn';

const STATIC_ACTIONS = [
  { id: 'new-contract',  label: 'New Contract',     icon: Plus,            path: '/contracts/new', group: 'Actions',    shortcut: '⌘N' },
  { id: 'dashboard',     label: 'Dashboard',         icon: LayoutDashboard, path: '/dashboard',     group: 'Navigate' },
  { id: 'contracts',     label: 'All Contracts',     icon: FileText,        path: '/contracts',     group: 'Navigate' },
  { id: 'templates',     label: 'Templates',         icon: Copy,            path: '/templates',     group: 'Navigate' },
  { id: 'clauses',       label: 'Clause Library',    icon: BookOpen,        path: '/clauses',       group: 'Navigate' },
  { id: 'clients',       label: 'Clients',           icon: Users,           path: '/clients',       group: 'Navigate' },
  { id: 'settings',      label: 'Settings',          icon: Settings,        path: '/settings',      group: 'Navigate' },
];

const MOCK_CONTRACTS = [
  { id: '1', label: 'Website Redesign — Priya Sharma',   path: '/contracts/1', group: 'Contracts' },
  { id: '2', label: 'Brand Identity — Karan Mehta',      path: '/contracts/2', group: 'Contracts' },
  { id: '3', label: 'SEO Package — Meera Iyer',          path: '/contracts/3', group: 'Contracts' },
  { id: '4', label: 'App Development — Rahul Verma',     path: '/contracts/4', group: 'Contracts' },
  { id: '5', label: 'Logo Design — Sneha Patel',         path: '/contracts/5', group: 'Contracts' },
];

function fuzzyMatch(str, query) {
  if (!query) return true;
  const s = str.toLowerCase();
  const q = query.toLowerCase();
  let si = 0;
  for (let qi = 0; qi < q.length; qi++) {
    si = s.indexOf(q[qi], si);
    if (si === -1) return false;
    si++;
  }
  return true;
}

export function CommandPalette({ isOpen, onClose }) {
  const navigate = useNavigate();
  const [query, setQuery] = useState('');
  const [activeIdx, setActiveIdx] = useState(0);
  const inputRef = useRef(null);
  const listRef = useRef(null);

  const allItems = [
    ...STATIC_ACTIONS,
    ...MOCK_CONTRACTS.map((c) => ({ ...c, icon: FileText })),
  ];

  const filtered = query
    ? allItems.filter((item) => fuzzyMatch(item.label, query))
    : allItems;

  // Group results
  const groups = filtered.reduce((acc, item) => {
    (acc[item.group] = acc[item.group] || []).push(item);
    return acc;
  }, {});

  // Flat list for keyboard nav
  const flatList = Object.values(groups).flat();

  useEffect(() => {
    if (isOpen) {
      setQuery('');
      setActiveIdx(0);
      setTimeout(() => inputRef.current?.focus(), 50);
    }
  }, [isOpen]);

  useEffect(() => {
    setActiveIdx(0);
  }, [query]);

  const handleSelect = (item) => {
    navigate(item.path);
    onClose();
    setQuery('');
  };

  const handleKeyDown = (e) => {
    if (e.key === 'ArrowDown') {
      e.preventDefault();
      setActiveIdx((i) => Math.min(i + 1, flatList.length - 1));
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      setActiveIdx((i) => Math.max(i - 1, 0));
    } else if (e.key === 'Enter') {
      e.preventDefault();
      if (flatList[activeIdx]) handleSelect(flatList[activeIdx]);
    } else if (e.key === 'Escape') {
      onClose();
    }
  };

  // Scroll active item into view
  useEffect(() => {
    const el = listRef.current?.querySelector(`[data-idx="${activeIdx}"]`);
    el?.scrollIntoView({ block: 'nearest' });
  }, [activeIdx]);

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.15 }}
            className="fixed inset-0 bg-brand-navy-900/50 backdrop-blur-sm z-50"
            onClick={onClose}
          />

          {/* Panel */}
          <motion.div
            initial={{ opacity: 0, scale: 0.96, y: -8 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.96, y: -8 }}
            transition={{ duration: 0.18, ease: 'easeOut' }}
            className="fixed top-[20%] left-1/2 -translate-x-1/2 w-full max-w-xl z-50 px-4"
          >
            <div className="glass rounded-2xl shadow-glass overflow-hidden">
              {/* Search input */}
              <div className="flex items-center gap-3 px-4 py-3.5 border-b border-white/10">
                <Search size={16} className="text-fg-secondary shrink-0" />
                <input
                  ref={inputRef}
                  type="text"
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  onKeyDown={handleKeyDown}
                  placeholder="Search contracts, navigate, actions…"
                  className="flex-1 bg-transparent text-sm text-fg-primary placeholder:text-fg-secondary outline-none"
                />
                <kbd className="flex items-center gap-0.5 px-2 py-1 text-xs text-fg-secondary bg-bg-secondary/60 rounded border border-white/10 font-mono">
                  esc
                </kbd>
              </div>

              {/* Results */}
              <div ref={listRef} className="max-h-80 overflow-y-auto p-2">
                {flatList.length === 0 ? (
                  <div className="text-center py-8 text-sm text-fg-secondary">
                    <Hash size={20} className="mx-auto mb-2 opacity-40" />
                    No results for "{query}"
                  </div>
                ) : (
                  Object.entries(groups).map(([group, items]) => (
                    <div key={group} className="mb-2">
                      <div className="px-2 py-1 text-xs font-semibold text-fg-secondary uppercase tracking-wider">
                        {group}
                      </div>
                      {items.map((item) => {
                        const globalIdx = flatList.findIndex((f) => f.id === item.id);
                        const isActive = globalIdx === activeIdx;
                        const Icon = item.icon;
                        return (
                          <button
                            key={item.id}
                            data-idx={globalIdx}
                            onClick={() => handleSelect(item)}
                            onMouseEnter={() => setActiveIdx(globalIdx)}
                            className={cn(
                              'w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm transition-colors text-left',
                              isActive
                                ? 'bg-[var(--accent-gold)]/15 text-fg-primary'
                                : 'text-fg-secondary hover:text-fg-primary'
                            )}
                          >
                            <div className={cn(
                              'w-7 h-7 rounded-lg flex items-center justify-center shrink-0 transition-colors',
                              isActive ? 'bg-[var(--accent-gold)]/20' : 'bg-bg-secondary'
                            )}>
                              <Icon size={14} className={isActive ? 'text-[var(--accent-gold)]' : 'text-fg-secondary'} />
                            </div>
                            <span className="flex-1 truncate font-medium">{item.label}</span>
                            {item.shortcut && (
                              <kbd className="text-xs text-fg-secondary font-mono">{item.shortcut}</kbd>
                            )}
                            {isActive && <ArrowRight size={13} className="text-[var(--accent-gold)] shrink-0" />}
                          </button>
                        );
                      })}
                    </div>
                  ))
                )}
              </div>

              {/* Footer hint */}
              <div className="flex items-center gap-3 px-4 py-2.5 border-t border-white/10 text-xs text-fg-secondary">
                <span className="flex items-center gap-1"><kbd className="font-mono">↑↓</kbd> navigate</span>
                <span className="flex items-center gap-1"><kbd className="font-mono">↵</kbd> open</span>
                <span className="flex items-center gap-1"><kbd className="font-mono">esc</kbd> close</span>
                <span className="ml-auto flex items-center gap-1 opacity-60">
                  <Command size={10} /> Contractly
                </span>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
