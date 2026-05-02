import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  Search, Plus, Filter, List, LayoutGrid,
  ArrowUpDown, MoreHorizontal, Trash2, Send, Eye, Edit2, Copy
} from 'lucide-react';
import { Button } from '../components/ui/Button';
import { Badge } from '../components/ui/Badge';
import { Card } from '../components/ui/Card';
import { EmptyState } from '../components/ui/EmptyState';
import { Dropdown } from '../components/ui/Dropdown';
import { formatCurrency, formatDate } from '../utils/formatters';

const MOCK_CONTRACTS = [
  { id: '1', title: 'Website Redesign',   client: 'Priya Sharma',  amount: 85000,  status: 'signed',  createdAt: '2025-05-28' },
  { id: '2', title: 'Brand Identity',     client: 'Karan Mehta',   amount: 45000,  status: 'sent',    createdAt: '2025-05-30' },
  { id: '3', title: 'SEO Package',        client: 'Meera Iyer',    amount: 18000,  status: 'viewed',  createdAt: '2025-05-31' },
  { id: '4', title: 'App Development',    client: 'Rahul Verma',   amount: 200000, status: 'draft',   createdAt: '2025-06-01' },
  { id: '5', title: 'Logo Design',        client: 'Sneha Patel',   amount: 12000,  status: 'expired', createdAt: '2025-04-10' },
  { id: '6', title: 'Content Strategy',   client: 'Arjun Khanna',  amount: 28000,  status: 'sent',    createdAt: '2025-06-02' },
  { id: '7', title: 'Social Media Mgmt',  client: 'Divya Nair',    amount: 15000,  status: 'draft',   createdAt: '2025-06-03' },
];

const STATUSES = ['all', 'draft', 'sent', 'viewed', 'signed', 'expired'];
const pageVariants = { initial: { opacity: 0, y: 8 }, animate: { opacity: 1, y: 0, transition: { duration: 0.25 } } };

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

  const toggleSelect = (id) => {
    setSelected((prev) => prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]);
  };

  const rowActions = (c) => [
    { label: 'View',        icon: <Eye size={14} />,    onClick: () => navigate(`/contracts/${c.id}`) },
    { label: 'Edit',        icon: <Edit2 size={14} />,  onClick: () => navigate(`/contracts/${c.id}/edit`) },
    { label: 'Copy Link',   icon: <Copy size={14} />,   onClick: () => {} },
    { divider: true },
    { label: 'Delete',      icon: <Trash2 size={14} />, onClick: () => {}, danger: true },
  ];

  return (
    <motion.div variants={pageVariants} initial="initial" animate="animate" className="p-6 lg:p-8 max-w-[1400px] mx-auto">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-semibold text-gray-900">Contracts</h1>
          <p className="text-sm text-gray-500 mt-0.5">{filtered.length} contracts</p>
        </div>
        <Button variant="primary" icon={<Plus size={16} />} onClick={() => navigate('/contracts/new')}>
          New Contract
        </Button>
      </div>

      {/* Filter Bar */}
      <Card padding="sm" className="mb-5">
        <div className="flex flex-col sm:flex-row gap-3">
          {/* Search */}
          <div className="relative flex-1">
            <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search contracts..."
              className="w-full pl-9 pr-3 py-2 text-sm border border-gray-200 rounded-lg bg-gray-50 focus:outline-none focus:ring-2 focus:ring-brand-500/20 focus:border-brand-400 focus:bg-white transition-all"
            />
          </div>

          {/* Status filter */}
          <div className="flex gap-1.5 flex-wrap">
            {STATUSES.map((s) => (
              <button
                key={s}
                onClick={() => setStatus(s)}
                className={`px-3 py-1.5 rounded-lg text-xs font-medium capitalize transition-all ${
                  status === s
                    ? 'bg-brand-500 text-white'
                    : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                }`}
              >
                {s}
              </button>
            ))}
          </div>

          {/* View toggle */}
          <div className="flex gap-1 bg-gray-100 rounded-lg p-1 self-start">
            <button onClick={() => setViewMode('list')} className={`p-1.5 rounded-md transition-all ${viewMode === 'list' ? 'bg-white shadow-sm text-gray-900' : 'text-gray-500 hover:text-gray-700'}`}>
              <List size={15} />
            </button>
            <button onClick={() => setViewMode('grid')} className={`p-1.5 rounded-md transition-all ${viewMode === 'grid' ? 'bg-white shadow-sm text-gray-900' : 'text-gray-500 hover:text-gray-700'}`}>
              <LayoutGrid size={15} />
            </button>
          </div>
        </div>

        {/* Bulk actions */}
        {selected.length > 0 && (
          <div className="flex items-center gap-3 mt-3 pt-3 border-t border-gray-100">
            <span className="text-sm text-gray-600 font-medium">{selected.length} selected</span>
            <Button variant="secondary" size="sm" icon={<Send size={13} />}>Send Reminder</Button>
            <Button variant="danger" size="sm" icon={<Trash2 size={13} />}>Delete</Button>
            <button onClick={() => setSelected([])} className="ml-auto text-xs text-gray-500 hover:text-gray-700">Clear</button>
          </div>
        )}
      </Card>

      {/* List View */}
      {viewMode === 'list' && (
        <Card padding="none">
          {filtered.length === 0 ? (
            <EmptyState
              title="No contracts found"
              description="Try adjusting your search or filters"
              action={{ label: '+ New Contract', onClick: () => navigate('/contracts/new') }}
            />
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-gray-100 bg-gray-50/50">
                    <th className="px-4 py-3 w-10">
                      <input type="checkbox" className="rounded border-gray-300 accent-brand-500"
                        onChange={(e) => setSelected(e.target.checked ? filtered.map(c => c.id) : [])}
                        checked={selected.length === filtered.length && filtered.length > 0}
                      />
                    </th>
                    {['Contract Name', 'Client', 'Value', 'Status', 'Created', ''].map((h) => (
                      <th key={h} className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wide whitespace-nowrap">
                        {h && (
                          <span className="flex items-center gap-1 cursor-pointer hover:text-gray-700 transition-colors group">
                            {h} {h !== '' && <ArrowUpDown size={11} className="opacity-0 group-hover:opacity-100 transition-opacity" />}
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
                      className="border-b border-gray-50 hover:bg-gray-50 transition-colors group cursor-pointer"
                    >
                      <td className="px-4 py-3.5" onClick={(e) => e.stopPropagation()}>
                        <input
                          type="checkbox"
                          className="rounded border-gray-300 accent-brand-500"
                          checked={selected.includes(c.id)}
                          onChange={() => toggleSelect(c.id)}
                        />
                      </td>
                      <td className="px-4 py-3.5 text-sm font-medium text-gray-900" onClick={() => navigate(`/contracts/${c.id}`)}>{c.title}</td>
                      <td className="px-4 py-3.5 text-sm text-gray-600" onClick={() => navigate(`/contracts/${c.id}`)}>{c.client}</td>
                      <td className="px-4 py-3.5 text-sm font-medium text-gray-800" onClick={() => navigate(`/contracts/${c.id}`)}>{formatCurrency(c.amount)}</td>
                      <td className="px-4 py-3.5" onClick={() => navigate(`/contracts/${c.id}`)}><Badge status={c.status} /></td>
                      <td className="px-4 py-3.5 text-sm text-gray-500" onClick={() => navigate(`/contracts/${c.id}`)}>{formatDate(c.createdAt)}</td>
                      <td className="px-4 py-3.5" onClick={(e) => e.stopPropagation()}>
                        <Dropdown
                          align="right"
                          trigger={
                            <button className="p-1.5 rounded-lg text-gray-400 hover:text-gray-700 hover:bg-gray-100 opacity-0 group-hover:opacity-100 transition-all">
                              <MoreHorizontal size={16} />
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
        </Card>
      )}

      {/* Grid View */}
      {viewMode === 'grid' && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {filtered.map((c, i) => (
            <motion.div key={c.id} initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0, transition: { delay: i * 0.05 } }}>
              <Card hover onClick={() => navigate(`/contracts/${c.id}`)}>
                <div className="flex items-start justify-between mb-3">
                  <Badge status={c.status} />
                  <Dropdown align="right"
                    trigger={<button className="p-1 rounded-lg text-gray-400 hover:bg-gray-100" onClick={(e) => e.stopPropagation()}><MoreHorizontal size={15} /></button>}
                    items={rowActions(c)}
                  />
                </div>
                <h3 className="text-sm font-semibold text-gray-900 mb-1">{c.title}</h3>
                <p className="text-sm text-gray-500 mb-3">{c.client}</p>
                <div className="flex items-center justify-between">
                  <span className="text-base font-semibold text-gray-900">{formatCurrency(c.amount)}</span>
                  <span className="text-xs text-gray-400">{formatDate(c.createdAt)}</span>
                </div>
              </Card>
            </motion.div>
          ))}
          {filtered.length === 0 && (
            <div className="col-span-full">
              <EmptyState title="No contracts found" description="Try adjusting your search or filters"
                action={{ label: '+ New Contract', onClick: () => navigate('/contracts/new') }} />
            </div>
          )}
        </div>
      )}
    </motion.div>
  );
}
