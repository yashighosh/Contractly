import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  Search, Plus, List, LayoutGrid, MoreHorizontal,
  Trash2, Send, Eye, Edit2, Copy, ArrowUpDown, FileText
} from 'lucide-react';
import { PageTransition } from '../components/ui/PageTransition';
import { StatusBadge } from '../components/ui/StatusBadge';
import { ContractCard } from '../components/ui/ContractCard';
import { Dropdown } from '../components/ui/Dropdown';
import { formatCurrency, formatRelativeTime } from '../utils/formatters';
import { cn } from '../utils/cn';

const MOCK_CONTRACTS = [
  { id: '1', title: 'Website Redesign',   client: 'Priya Sharma',  amount: 85000,  status: 'signed',  createdAt: '2025-05-28', updatedAt: '2025-06-03' },
  { id: '2', title: 'Brand Identity',     client: 'Karan Mehta',   amount: 45000,  status: 'sent',    createdAt: '2025-05-30', updatedAt: '2025-06-02' },
  { id: '3', title: 'SEO Package',        client: 'Meera Iyer',    amount: 18000,  status: 'viewed',  createdAt: '2025-05-31', updatedAt: '2025-06-04' },
  { id: '4', title: 'App Development',    client: 'Rahul Verma',   amount: 200000, status: 'draft',   createdAt: '2025-06-01', updatedAt: '2025-06-04' },
  { id: '5', title: 'Logo Design',        client: 'Sneha Patel',   amount: 12000,  status: 'expired', createdAt: '2025-04-10', updatedAt: '2025-05-01' },
  { id: '6', title: 'Content Strategy',   client: 'Arjun Khanna',  amount: 28000,  status: 'sent',    createdAt: '2025-06-02', updatedAt: '2025-06-02' },
  { id: '7', title: 'Social Media Mgmt',  client: 'Divya Nair',    amount: 15000,  status: 'draft',   createdAt: '2025-06-03', updatedAt: '2025-06-03' },
];

const STATUSES = ['all', 'draft', 'sent', 'viewed', 'signed', 'expired'];

/* Empty state illustration */
function EmptyContracts({ onNew }) {
  return (
    <div className="flex flex-col items-center justify-center py-20 px-6 text-center">
      <svg width="120" height="120" viewBox="0 0 120 120" fill="none" className="mb-6 opacity-40">
        <rect x="20" y="10" width="80" height="100" rx="8" stroke="currentColor" strokeWidth="2" className="text-fg-secondary" />
        <line x1="35" y1="35" x2="85" y2="35" stroke="currentColor" strokeWidth="2" strokeLinecap="round" className="text-fg-secondary" />
        <line x1="35" y1="50" x2="75" y2="50" stroke="currentColor" strokeWidth="2" strokeLinecap="round" className="text-fg-secondary" />
        <line x1="35" y1="65" x2="65" y2="65" stroke="currentColor" strokeWidth="2" strokeLinecap="round" className="text-fg-secondary" />
        <circle cx="85" cy="85" r="20" fill="var(--accent-gold)" opacity="0.9" />
        <path d="M78 85L83 90L92 80" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
      <h3 className="text-lg font-semibold text-fg-primary mb-1">No contracts yet</h3>
      <p className="text-sm text-fg-secondary mb-6 max-w-xs">
        Create your first contract to start tracking, sending, and getting signed.
      </p>
      <button onClick={onNew} className="btn-gold px-6 py-2.5 rounded-xl flex items-center gap-2">
        <Plus size={15} /> Create First Contract
      </button>
    </div>
  );
}

export default function Contracts() {
  const navigate = useNavigate();
  const [search, setSearch] = useState('');
  const [status, setStatus] = useState('all');
  const [viewMode, setViewMode] = useState('list');
  const [selected, setSelected] = useState([]);

  const filtered = MOCK_CONTRACTS.filter((c) => {
    const matchSearch = c.title.toLowerCase().includes(search.toLowerCase()) ||
                        c.client.toLowerCase().includes(search.toLowerCase());
    const matchStatus = status === 'all' || c.status === status;
    return matchSearch && matchStatus;
  });

  const toggleSelect = (id) =>
    setSelected((prev) => prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]);

  const rowActions = (c) => [
    { label: 'View',      icon: <Eye size={14} />,    onClick: () => navigate(`/contracts/${c.id}`) },
    { label: 'Edit',      icon: <Edit2 size={14} />,  onClick: () => navigate(`/contracts/${c.id}/edit`) },
    { label: 'Duplicate', icon: <Copy size={14} />,   onClick: () => {} },
    { divider: true },
    { label: 'Delete',    icon: <Trash2 size={14} />, onClick: () => {}, danger: true },
  ];

  return (
    <PageTransition>
      <div className="p-6 lg:p-8 max-w-[1400px] mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-2xl font-semibold text-fg-primary">Contracts</h1>
            <p className="text-sm text-fg-secondary mt-0.5">{filtered.length} contract{filtered.length !== 1 ? 's' : ''}</p>
          </div>
          <button
            onClick={() => navigate('/contracts/new')}
            className="btn-gold flex items-center gap-2 px-4 py-2 rounded-xl text-sm shadow-gold"
          >
            <Plus size={15} /> New Contract
          </button>
        </div>

        {/* Filters */}
        <div className="bg-bg-primary border border-border-col rounded-xl p-4 mb-5">
          <div className="flex flex-col sm:flex-row gap-3">
            <div className="relative flex-1">
              <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-fg-secondary" />
              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search contracts, clients..."
                className="w-full pl-9 pr-3 py-2 text-sm border border-border-col rounded-xl bg-bg-secondary text-fg-primary placeholder:text-fg-secondary focus:outline-none focus:ring-2 focus:ring-[var(--accent-gold)]/20 focus:border-[var(--accent-gold)] transition-all"
              />
            </div>
            <div className="flex gap-1.5 flex-wrap">
              {STATUSES.map((s) => (
                <button
                  key={s}
                  onClick={() => setStatus(s)}
                  className={cn(
                    'px-3 py-1.5 rounded-lg text-xs font-medium capitalize transition-all',
                    status === s
                      ? 'text-brand-navy-900 font-semibold shadow-gold'
                      : 'bg-bg-secondary text-fg-secondary hover:text-fg-primary'
                  )}
                  style={status === s ? { background: 'var(--accent-gold)' } : {}}
                >
                  {s}
                </button>
              ))}
            </div>
            <div className="flex gap-1 bg-bg-secondary rounded-lg p-1 self-start shrink-0">
              {[['list', List], ['grid', LayoutGrid]].map(([mode, Icon]) => (
                <button
                  key={mode}
                  onClick={() => setViewMode(mode)}
                  className={cn('p-1.5 rounded-md transition-all', viewMode === mode ? 'bg-bg-primary shadow-sm text-fg-primary' : 'text-fg-secondary')}
                >
                  <Icon size={15} />
                </button>
              ))}
            </div>
          </div>
          {selected.length > 0 && (
            <div className="flex items-center gap-3 mt-3 pt-3 border-t border-border-col">
              <span className="text-sm text-fg-secondary font-medium">{selected.length} selected</span>
              <button className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold bg-bg-secondary text-fg-primary rounded-lg border border-border-col hover:border-[var(--accent-gold)] transition-all">
                <Send size={12} /> Send Reminder
              </button>
              <button className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold bg-red-50 dark:bg-red-900/20 text-red-600 rounded-lg border border-red-200 dark:border-red-800 transition-all">
                <Trash2 size={12} /> Delete
              </button>
              <button onClick={() => setSelected([])} className="ml-auto text-xs text-fg-secondary hover:text-fg-primary">Clear</button>
            </div>
          )}
        </div>

        {/* List View */}
        {viewMode === 'list' && (
          <div className="bg-bg-primary border border-border-col rounded-xl overflow-hidden">
            {filtered.length === 0 ? (
              <EmptyContracts onNew={() => navigate('/contracts/new')} />
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-border-col bg-bg-secondary/50">
                      <th className="px-4 py-3 w-10">
                        <input type="checkbox" className="rounded accent-[var(--accent-gold)]"
                          onChange={(e) => setSelected(e.target.checked ? filtered.map(c => c.id) : [])}
                          checked={selected.length === filtered.length && filtered.length > 0}
                        />
                      </th>
                      {['Contract Name', 'Client', 'Value', 'Status', 'Last Updated', ''].map((h) => (
                        <th key={h} className="px-4 py-3 text-left text-xs font-semibold text-fg-secondary uppercase tracking-wide">
                          {h && (
                            <span className="flex items-center gap-1 cursor-pointer hover:text-fg-primary group">
                              {h} {h !== '' && <ArrowUpDown size={10} className="opacity-0 group-hover:opacity-100 transition-opacity" />}
                            </span>
                          )}
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {filtered.map((c, i) => (
                      <motion.tr
                        key={c.id}
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1, transition: { delay: i * 0.04 } }}
                        className="border-b border-border-col hover:bg-bg-secondary/40 transition-colors group cursor-pointer"
                      >
                        <td className="px-4 py-3.5" onClick={(e) => e.stopPropagation()}>
                          <input type="checkbox" className="rounded accent-[var(--accent-gold)]"
                            checked={selected.includes(c.id)} onChange={() => toggleSelect(c.id)} />
                        </td>
                        <td className="px-4 py-3.5 text-sm font-semibold text-fg-primary" onClick={() => navigate(`/contracts/${c.id}`)}>
                          {c.title}
                        </td>
                        <td className="px-4 py-3.5 text-sm text-fg-secondary" onClick={() => navigate(`/contracts/${c.id}`)}>{c.client}</td>
                        <td className="px-4 py-3.5 text-sm font-semibold text-fg-primary" onClick={() => navigate(`/contracts/${c.id}`)}>{formatCurrency(c.amount)}</td>
                        <td className="px-4 py-3.5" onClick={() => navigate(`/contracts/${c.id}`)}>
                          <StatusBadge status={c.status} size="xs" />
                        </td>
                        <td className="px-4 py-3.5 text-sm text-fg-secondary" onClick={() => navigate(`/contracts/${c.id}`)}>
                          {formatRelativeTime(c.updatedAt)}
                        </td>
                        <td className="px-4 py-3.5" onClick={(e) => e.stopPropagation()}>
                          <Dropdown align="right"
                            trigger={
                              <button className="p-1.5 rounded-lg text-fg-secondary hover:text-fg-primary hover:bg-bg-secondary opacity-0 group-hover:opacity-100 transition-all">
                                <MoreHorizontal size={15} />
                              </button>
                            }
                            items={rowActions(c)}
                          />
                        </td>
                      </motion.tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        )}

        {/* Grid View */}
        {viewMode === 'grid' && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {filtered.length === 0 ? (
              <div className="col-span-full">
                <EmptyContracts onNew={() => navigate('/contracts/new')} />
              </div>
            ) : (
              filtered.map((c, i) => (
                <motion.div key={c.id} initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0, transition: { delay: i * 0.05 } }}>
                  <ContractCard
                    contract={c}
                    onClick={() => navigate(`/contracts/${c.id}`)}
                    priority={c.status === 'sent' || c.status === 'viewed'}
                  />
                </motion.div>
              ))
            )}
          </div>
        )}
      </div>
    </PageTransition>
  );
}
