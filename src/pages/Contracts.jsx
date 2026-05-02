import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  Search, Plus, List, LayoutGrid, MoreHorizontal,
  Trash2, Eye, Edit2, Copy, ArrowUpDown, Inbox
} from 'lucide-react';
import { PageTransition } from '../components/ui/PageTransition';
import { StatusBadge } from '../components/ui/StatusBadge';
import { ContractCard } from '../components/ui/ContractCard';
import { Dropdown } from '../components/ui/Dropdown';
import { formatCurrency, formatRelativeTime } from '../utils/formatters';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import toast from 'react-hot-toast';
import { contractService } from '../services/contractService';
import { useAuthStore } from '../store/authStore';
import { cn } from '../utils/cn';

const STATUSES = ['all', 'draft', 'sent', 'viewed', 'signed', 'expired'];

function EmptyContracts({ onNew, filtered }) {
  return (
    <div className="flex flex-col items-center justify-center py-20 px-6 text-center">
      <div className="w-16 h-16 rounded-2xl flex items-center justify-center mb-4" style={{ background: 'var(--accent-gold-lt)' }}>
        <Inbox size={26} style={{ color: 'var(--accent-gold)' }} />
      </div>
      <h3 className="text-lg font-semibold text-fg-primary mb-1">
        {filtered ? 'No matching contracts' : 'No contracts yet'}
      </h3>
      <p className="text-sm text-fg-secondary mb-6 max-w-xs">
        {filtered
          ? 'Try a different search term or status filter.'
          : 'Create your first contract to start tracking, sending, and getting signatures.'}
      </p>
      {!filtered && (
        <button onClick={onNew} className="btn-gold px-5 py-2.5 rounded-xl flex items-center gap-2 text-sm font-semibold">
          <Plus size={14} /> Create Contract
        </button>
      )}
    </div>
  );
}

export default function Contracts() {
  const navigate  = useNavigate();
  const queryClient = useQueryClient();

  const { data: contracts = [], isLoading } = useQuery({
    queryKey: ['contracts'],
    queryFn: () => contractService.getAll()
  });

  const deleteMutation = useMutation({
    mutationFn: (id) => contractService.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['contracts'] });
      toast.success('Contract deleted');
    },
    onError: () => toast.error('Failed to delete contract'),
  });

  const [search, setSearch]     = useState('');
  const [status, setStatus]     = useState('all');
  const [viewMode, setViewMode] = useState('list');
  const [selected, setSelected] = useState([]);

  const filtered = contracts.filter((c) => {
    const matchSearch =
      c.title?.toLowerCase().includes(search.toLowerCase()) ||
      c.client?.toLowerCase().includes(search.toLowerCase());
    const matchStatus = status === 'all' || c.status === status;
    return matchSearch && matchStatus;
  });

  const toggleSelect = (id) =>
    setSelected((prev) => prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]);

  const handleDelete = (id) => {
    deleteMutation.mutate(id);
    setSelected((prev) => prev.filter((x) => x !== id));
  };

  const rowActions = (c) => [
    { label: 'View',   icon: <Eye size={14} />,   onClick: () => navigate(`/contracts/${c.id}`) },
    { label: 'Edit',   icon: <Edit2 size={14} />,  onClick: () => navigate(`/contracts/${c.id}/edit`) },
    { label: 'Duplicate', icon: <Copy size={14} />, onClick: () => {} },
    { divider: true },
    { label: 'Delete', icon: <Trash2 size={14} />, onClick: () => handleDelete(c.id), danger: true },
  ];

  return (
    <PageTransition>
      <div className="p-6 lg:p-8 max-w-[1400px] mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-2xl font-semibold text-fg-primary">Contracts</h1>
            <p className="text-sm text-fg-secondary mt-0.5">{contracts.length} contract{contracts.length !== 1 ? 's' : ''}</p>
          </div>
          <button onClick={() => navigate('/contracts/new')} className="btn-gold flex items-center gap-2 px-4 py-2 rounded-xl text-sm shadow-gold">
            <Plus size={14} /> New Contract
          </button>
        </div>

        {/* Filters */}
        <div className="bg-bg-primary border border-border-col rounded-xl p-4 mb-5">
          <div className="flex flex-col sm:flex-row gap-3">
            <div className="relative flex-1">
              <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-fg-secondary" />
              <input type="text" value={search} onChange={(e) => setSearch(e.target.value)}
                placeholder="Search contracts, clients..."
                className="w-full pl-9 pr-3 py-2 text-sm border border-border-col rounded-xl bg-bg-secondary text-fg-primary placeholder:text-fg-secondary focus:outline-none focus:ring-2 focus:ring-[var(--accent-gold)]/20 focus:border-[var(--accent-gold)] transition-all" />
            </div>
            <div className="flex gap-1.5 flex-wrap">
              {STATUSES.map((s) => (
                <button key={s} onClick={() => setStatus(s)}
                  className={cn('px-3 py-1.5 rounded-lg text-xs font-medium capitalize transition-all', status === s ? 'font-semibold' : 'bg-bg-secondary text-fg-secondary hover:text-fg-primary')}
                  style={status === s ? { background: 'var(--accent-gold)', color: '#0F1A2E' } : {}}>
                  {s}
                </button>
              ))}
            </div>
            <div className="flex gap-1 bg-bg-secondary rounded-lg p-1 self-start shrink-0">
              {[['list', List], ['grid', LayoutGrid]].map(([mode, Icon]) => (
                <button key={mode} onClick={() => setViewMode(mode)}
                  className={cn('p-1.5 rounded-md transition-all', viewMode === mode ? 'bg-bg-primary shadow-sm text-fg-primary' : 'text-fg-secondary')}>
                  <Icon size={14} />
                </button>
              ))}
            </div>
          </div>

          {selected.length > 0 && (
            <div className="flex items-center gap-3 mt-3 pt-3 border-t border-border-col">
              <span className="text-sm text-fg-secondary">{selected.length} selected</span>
              <button onClick={() => { selected.forEach((id) => deleteMutation.mutate(id)); setSelected([]); }}
                className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold bg-red-50 dark:bg-red-900/20 text-red-600 rounded-lg border border-red-200 dark:border-red-800">
                <Trash2 size={12} /> Delete selected
              </button>
              <button onClick={() => setSelected([])} className="ml-auto text-xs text-fg-secondary hover:text-fg-primary">Clear</button>
            </div>
          )}
        </div>

        {/* List view */}
        {viewMode === 'list' && (
          <div className="bg-bg-primary border border-border-col rounded-xl overflow-hidden">
            {isLoading ? (
              <div className="p-8 text-center text-fg-secondary">Loading contracts...</div>
            ) : filtered.length === 0 ? (
              <EmptyContracts onNew={() => navigate('/contracts/new')} filtered={search || status !== 'all'} />
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-border-col bg-bg-secondary/50">
                      <th className="px-4 py-3 w-10">
                        <input type="checkbox" className="rounded accent-[var(--accent-gold)]"
                          onChange={(e) => setSelected(e.target.checked ? filtered.map((c) => c.id) : [])}
                          checked={selected.length === filtered.length && filtered.length > 0} />
                      </th>
                      {['Contract Name', 'Client', 'Value', 'Status', 'Updated', ''].map((h) => (
                        <th key={h} className="px-4 py-3 text-left text-xs font-semibold text-fg-secondary uppercase tracking-wide">
                          <span className="flex items-center gap-1 cursor-pointer hover:text-fg-primary group">
                            {h}{h && h !== '' && <ArrowUpDown size={9} className="opacity-0 group-hover:opacity-100 transition-opacity" />}
                          </span>
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {filtered.map((c, i) => (
                      <motion.tr key={c.id} initial={{ opacity: 0 }} animate={{ opacity: 1, transition: { delay: i * 0.04 } }}
                        className="border-b border-border-col hover:bg-bg-secondary/40 transition-colors group cursor-pointer">
                        <td className="px-4 py-3.5" onClick={(e) => e.stopPropagation()}>
                          <input type="checkbox" className="rounded accent-[var(--accent-gold)]"
                            checked={selected.includes(c.id)} onChange={() => toggleSelect(c.id)} />
                        </td>
                        <td className="px-4 py-3.5 text-sm font-semibold text-fg-primary max-w-[200px] truncate" onClick={() => navigate(`/contracts/${c.id}`)}>{c.title}</td>
                        <td className="px-4 py-3.5 text-sm text-fg-secondary" onClick={() => navigate(`/contracts/${c.id}`)}>{c.client || '—'}</td>
                        <td className="px-4 py-3.5 text-sm font-medium text-fg-primary" onClick={() => navigate(`/contracts/${c.id}`)}>{c.amount ? formatCurrency(Number(c.amount)) : '—'}</td>
                        <td className="px-4 py-3.5" onClick={() => navigate(`/contracts/${c.id}`)}><StatusBadge status={c.status} size="xs" /></td>
                        <td className="px-4 py-3.5 text-sm text-fg-secondary" onClick={() => navigate(`/contracts/${c.id}`)}>{formatRelativeTime(c.updatedAt)}</td>
                        <td className="px-4 py-3.5" onClick={(e) => e.stopPropagation()}>
                          <Dropdown align="right"
                            trigger={<button className="p-1.5 rounded-lg text-fg-secondary hover:text-fg-primary hover:bg-bg-secondary opacity-0 group-hover:opacity-100 transition-all"><MoreHorizontal size={14} /></button>}
                            items={rowActions(c)} />
                        </td>
                      </motion.tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        )}

        {/* Grid view */}
        {viewMode === 'grid' && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {isLoading ? (
              <div className="col-span-full p-8 text-center text-fg-secondary">Loading contracts...</div>
            ) : filtered.length === 0 ? (
              <div className="col-span-full">
                <EmptyContracts onNew={() => navigate('/contracts/new')} filtered={search || status !== 'all'} />
              </div>
            ) : (
              filtered.map((c, i) => (
                <motion.div key={c.id} initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0, transition: { delay: i * 0.05 } }}>
                  <ContractCard contract={c} onClick={() => navigate(`/contracts/${c.id}`)} priority={c.status === 'sent' || c.status === 'viewed'} />
                </motion.div>
              ))
            )}
          </div>
        )}
      </div>
    </PageTransition>
  );
}
