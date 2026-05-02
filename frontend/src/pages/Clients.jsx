import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Plus, Search, Mail, Phone, Building2, FileText, MoreHorizontal, User, X } from 'lucide-react';
import { PageTransition } from '../components/ui/PageTransition';
import { Avatar } from '../components/ui/Avatar';
import { Dropdown } from '../components/ui/Dropdown';
import { formatCurrency } from '../utils/formatters';
import { useAuthStore } from '../store/authStore';
import { useDataStore } from '../store/dataStore';
import { toast } from 'react-hot-toast';

const EMPTY_ARR = [];

export default function Clients() {
  const { user }    = useAuthStore();
  const userId      = user?.id;

  // Read from per-user dataStore — returns [] for new users, real data for yashi
  const clients     = useDataStore((s) => s.users[userId]?.clients ?? EMPTY_ARR);
  const addClient   = useDataStore((s) => s.addClient);
  const deleteClient = useDataStore((s) => s.deleteClient);

  const [search, setSearch]       = useState('');
  const [showModal, setShowModal] = useState(false);
  const [form, setForm]           = useState({ name: '', email: '', phone: '', company: '' });
  const [saving, setSaving]       = useState(false);

  const filtered = clients.filter((c) =>
    c.name?.toLowerCase().includes(search.toLowerCase()) ||
    c.email?.toLowerCase().includes(search.toLowerCase()) ||
    c.company?.toLowerCase().includes(search.toLowerCase())
  );

  const handleAdd = async () => {
    if (!form.name.trim()) { toast.error('Client name is required'); return; }
    setSaving(true);
    await new Promise((r) => setTimeout(r, 300));
    addClient(userId, { ...form, contracts: 0, totalValue: 0 });
    toast.success(`${form.name} added!`);
    setForm({ name: '', email: '', phone: '', company: '' });
    setShowModal(false);
    setSaving(false);
  };

  const menuItems = (client) => [
    { label: 'Edit Client', icon: <User size={14} />, onClick: () => toast('Edit coming soon') },
    { divider: true },
    { label: 'Delete', icon: <MoreHorizontal size={14} />, onClick: () => {
      deleteClient(userId, client.id);
      toast.success('Client removed');
    }, danger: true },
  ];

  return (
    <PageTransition>
      <div className="p-6 lg:p-8 max-w-[1400px] mx-auto">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-2xl font-semibold text-fg-primary">Clients</h1>
            <p className="text-sm text-fg-secondary mt-0.5">
              {clients.length > 0 ? `${clients.length} client${clients.length !== 1 ? 's' : ''}` : 'No clients yet'}
            </p>
          </div>
          <button
            onClick={() => setShowModal(true)}
            className="btn-gold flex items-center gap-2 px-4 py-2 rounded-xl text-sm"
          >
            <Plus size={15} /> Add Client
          </button>
        </div>

        {/* Search */}
        <div className="relative mb-6 max-w-md">
          <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-fg-secondary" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search clients…"
            className="w-full pl-9 pr-3 py-2 text-sm border border-border-col rounded-xl bg-bg-secondary text-fg-primary placeholder:text-fg-secondary focus:outline-none focus:ring-2 focus:ring-[var(--accent-gold)]/20 focus:border-[var(--accent-gold)] transition-all"
          />
        </div>

        {/* Empty state — shown only when truly no data */}
        {clients.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-24 text-center">
            <div style={{
              width: 64, height: 64, borderRadius: 16,
              background: 'rgba(201,168,76,0.1)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              marginBottom: 16, fontSize: 28,
            }}>👥</div>
            <h3 className="text-lg font-medium text-fg-primary mb-2">No clients yet</h3>
            <p className="text-sm text-fg-secondary mb-6 max-w-xs">
              Add your first client to start tracking contracts and revenue by relationship.
            </p>
            <button
              onClick={() => setShowModal(true)}
              className="btn-gold px-5 py-2.5 rounded-xl text-sm font-medium"
            >
              + Add your first client
            </button>
          </div>
        ) : filtered.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20 text-center">
            <p className="text-fg-secondary text-sm">No clients match "{search}"</p>
            <button onClick={() => setSearch('')} className="mt-3 text-xs text-[var(--accent-gold)] hover:underline">Clear search</button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
            {filtered.map((client, i) => (
              <motion.div key={client.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0, transition: { delay: i * 0.05 } }}
                whileHover={{ y: -2 }} transition={{ duration: 0.15 }}
              >
                <div className="group bg-bg-primary border border-border-col rounded-xl p-5 hover:shadow-card-lg hover:border-[rgba(201,168,76,0.25)] transition-all">
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex items-center gap-3">
                      <Avatar name={client.name} size="md" />
                      <div>
                        <h3 className="text-sm font-semibold text-fg-primary">{client.name}</h3>
                        {client.company && (
                          <div className="flex items-center gap-1 text-xs text-fg-secondary mt-0.5">
                            <Building2 size={11} /> {client.company}
                          </div>
                        )}
                      </div>
                    </div>
                    <Dropdown align="right"
                      trigger={
                        <button className="p-1.5 rounded-lg text-fg-secondary hover:bg-bg-secondary opacity-0 group-hover:opacity-100 transition-all">
                          <MoreHorizontal size={15} />
                        </button>
                      }
                      items={menuItems(client)}
                    />
                  </div>
                  <div className="space-y-1.5 mb-4">
                    {client.email && (
                      <a href={`mailto:${client.email}`} className="flex items-center gap-2 text-xs text-fg-secondary hover:text-[var(--accent-gold)] transition-colors">
                        <Mail size={12} /> {client.email}
                      </a>
                    )}
                    {client.phone && (
                      <div className="flex items-center gap-2 text-xs text-fg-secondary">
                        <Phone size={12} /> {client.phone}
                      </div>
                    )}
                  </div>
                  <div className="flex items-center justify-between pt-3 border-t border-border-col">
                    <div className="text-center">
                      <div className="text-lg font-bold text-fg-primary">{client.contracts ?? 0}</div>
                      <div className="text-xs text-fg-secondary">Contracts</div>
                    </div>
                    <div className="text-center">
                      <div className="text-sm font-bold text-fg-primary">{formatCurrency(client.totalValue ?? 0)}</div>
                      <div className="text-xs text-fg-secondary">Total Value</div>
                    </div>
                    <button className="text-xs font-semibold px-3 py-1.5 rounded-lg border border-border-col hover:border-[var(--accent-gold)] text-fg-secondary hover:text-[var(--accent-gold)] transition-all">
                      View
                    </button>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </div>

      {/* Add Client Modal */}
      <AnimatePresence>
        {showModal && (
          <motion.div
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4"
            style={{ background: 'rgba(0,0,0,0.6)' }}
            onClick={(e) => e.target === e.currentTarget && setShowModal(false)}
          >
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.95, opacity: 0 }}
              className="w-full max-w-md rounded-2xl p-6"
              style={{ background: '#172035', border: '0.5px solid #1E2D45' }}
            >
              <div className="flex items-center justify-between mb-5">
                <h2 style={{ color: '#EDF0F7', fontSize: 17, fontWeight: 600 }}>Add Client</h2>
                <button onClick={() => setShowModal(false)} style={{ color: '#4A5A72', background: 'none', border: 'none', cursor: 'pointer', lineHeight: 1 }}>
                  <X size={18} />
                </button>
              </div>
              <div className="flex flex-col gap-4">
                {[
                  { label: 'Full Name *', key: 'name', placeholder: 'Priya Sharma' },
                  { label: 'Email', key: 'email', placeholder: 'priya@example.com', type: 'email' },
                  { label: 'Phone', key: 'phone', placeholder: '+91 98765 43210' },
                  { label: 'Company', key: 'company', placeholder: 'Priya Designs' },
                ].map(({ label, key, placeholder, type = 'text' }) => (
                  <div key={key}>
                    <label style={{ fontSize: 12, color: '#8896AD', display: 'block', marginBottom: 6 }}>{label}</label>
                    <input
                      type={type}
                      value={form[key]}
                      onChange={(e) => setForm((f) => ({ ...f, [key]: e.target.value }))}
                      placeholder={placeholder}
                      style={{
                        width: '100%', height: 38, background: '#0F1A2E',
                        border: '0.5px solid #1E2D45', borderRadius: 8,
                        color: '#EDF0F7', fontSize: 13, padding: '0 12px', outline: 'none',
                        fontFamily: 'DM Sans, sans-serif', boxSizing: 'border-box',
                      }}
                      onFocus={(e) => e.target.style.borderColor = 'rgba(201,168,76,0.5)'}
                      onBlur={(e) => e.target.style.borderColor = '#1E2D45'}
                    />
                  </div>
                ))}
              </div>
              <div className="flex gap-3 mt-6">
                <button
                  onClick={() => setShowModal(false)}
                  style={{ flex: 1, height: 40, background: 'none', border: '0.5px solid #1E2D45', borderRadius: 10, color: '#8896AD', cursor: 'pointer', fontSize: 13 }}
                >
                  Cancel
                </button>
                <button
                  onClick={handleAdd}
                  disabled={saving}
                  style={{ flex: 1, height: 40, background: '#C9A84C', border: 'none', borderRadius: 10, color: '#0B1629', fontWeight: 600, cursor: 'pointer', fontSize: 13, opacity: saving ? 0.7 : 1 }}
                >
                  {saving ? 'Adding…' : 'Add Client'}
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </PageTransition>
  );
}
