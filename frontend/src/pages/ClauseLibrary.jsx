import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, Plus, Copy, Edit2, ChevronRight, X } from 'lucide-react';
import { PageTransition } from '../components/ui/PageTransition';
import { cn } from '../utils/cn';
import { toast } from 'react-hot-toast';
import { useAuthStore } from '../store/authStore';
import { useDataStore } from '../store/dataStore';

const CATEGORIES = [
  'All', 'Payment Terms', 'Deliverables', 'Intellectual Property',
  'Confidentiality', 'Termination', 'Liability', 'Dispute Resolution',
];

const EMPTY_ARR = [];

export default function ClauseLibrary() {
  const { user }  = useAuthStore();
  const userId    = user?.id;

  // Read from per-user dataStore — [] for new users, seeded for yashi
  const clauses     = useDataStore((s) => s.users[userId]?.clauses ?? EMPTY_ARR);
  const addClause   = useDataStore((s) => s.addClause);
  const deleteClause = useDataStore((s) => s.deleteClause);

  const [category, setCategory]   = useState('All');
  const [search, setSearch]       = useState('');
  const [showModal, setShowModal] = useState(false);
  const [form, setForm]           = useState({ title: '', category: 'Payment Terms', content: '' });
  const [saving, setSaving]       = useState(false);

  const filtered = clauses.filter((c) => {
    const matchCat = category === 'All' || c.category === category;
    const matchSearch =
      c.title?.toLowerCase().includes(search.toLowerCase()) ||
      c.content?.toLowerCase().includes(search.toLowerCase());
    return matchCat && matchSearch;
  });

  const copyClause = (content) => {
    navigator.clipboard.writeText(content);
    toast.success('Clause copied to clipboard!');
  };

  const handleAdd = async () => {
    if (!form.title.trim()) { toast.error('Title is required'); return; }
    if (!form.content.trim()) { toast.error('Clause content is required'); return; }
    setSaving(true);
    await new Promise((r) => setTimeout(r, 300));
    addClause(userId, form);
    toast.success('Clause saved to library!');
    setForm({ title: '', category: 'Payment Terms', content: '' });
    setShowModal(false);
    setSaving(false);
  };

  return (
    <PageTransition>
      <div className="p-6 lg:p-8 max-w-[1400px] mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-2xl font-semibold text-fg-primary">Clause Library</h1>
            <p className="text-sm text-fg-secondary mt-0.5">Reusable legal clauses for your contracts</p>
          </div>
          <button
            onClick={() => setShowModal(true)}
            className="btn-gold flex items-center gap-2 px-4 py-2 rounded-xl text-sm"
          >
            <Plus size={15} /> New Clause
          </button>
        </div>

        {/* Search */}
        <div className="relative mb-5 max-w-md">
          <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-fg-secondary" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search clauses…"
            className="w-full pl-9 pr-3 py-2 text-sm border border-border-col rounded-xl bg-bg-secondary text-fg-primary placeholder:text-fg-secondary focus:outline-none focus:ring-2 focus:ring-[var(--accent-gold)]/20 focus:border-[var(--accent-gold)] transition-all"
          />
        </div>

        <div className="flex gap-6">
          {/* Category sidebar (desktop) */}
          <div className="hidden lg:block w-48 shrink-0">
            <p className="text-xs font-semibold text-fg-secondary uppercase tracking-wide mb-2 px-2">Categories</p>
            <nav className="space-y-0.5">
              {CATEGORIES.map((cat) => (
                <button
                  key={cat}
                  onClick={() => setCategory(cat)}
                  className={cn(
                    'w-full text-left flex items-center justify-between px-3 py-2 rounded-lg text-sm transition-all',
                    category === cat
                      ? 'font-semibold'
                      : 'text-fg-secondary hover:text-fg-primary hover:bg-bg-secondary'
                  )}
                  style={category === cat ? { background: 'var(--accent-gold-lt)', color: 'var(--accent-gold)' } : {}}
                >
                  <span className="truncate">{cat}</span>
                  {category === cat && <ChevronRight size={12} />}
                </button>
              ))}
            </nav>
          </div>

          {/* Mobile categories */}
          <div className="lg:hidden w-full mb-4 -mt-2 flex gap-2 flex-wrap">
            {CATEGORIES.map((cat) => (
              <button
                key={cat}
                onClick={() => setCategory(cat)}
                className="px-3 py-1.5 rounded-lg text-xs font-medium transition-all"
                style={category === cat
                  ? { background: 'var(--accent-gold)', color: '#0F1A2E' }
                  : { background: 'var(--bg-secondary)', color: 'var(--fg-secondary)' }
                }
              >
                {cat}
              </button>
            ))}
          </div>

          {/* Clause cards */}
          <div className="flex-1 space-y-4">
            {/* Empty state — only when truly no clauses at all */}
            {clauses.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-24 text-center">
                <div style={{
                  width: 64, height: 64, borderRadius: 16,
                  background: 'rgba(201,168,76,0.1)',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  marginBottom: 16, fontSize: 28,
                }}>📋</div>
                <h3 className="text-lg font-medium text-fg-primary mb-2">Your clause library is empty</h3>
                <p className="text-sm text-fg-secondary mb-6 max-w-xs">
                  Save reusable legal clauses here to insert into contracts with one click.
                </p>
                <button
                  onClick={() => setShowModal(true)}
                  className="btn-gold px-5 py-2.5 rounded-xl text-sm font-medium"
                >
                  + Create your first clause
                </button>
              </div>
            ) : filtered.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-16 text-center">
                <p className="text-fg-secondary text-sm">No clauses match your filter</p>
                <button
                  onClick={() => { setSearch(''); setCategory('All'); }}
                  className="mt-3 text-xs text-[var(--accent-gold)] hover:underline"
                >
                  Clear filters
                </button>
              </div>
            ) : (
              filtered.map((clause, i) => (
                <motion.div
                  key={clause.id}
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0, transition: { delay: i * 0.04 } }}
                  className="bg-bg-primary border border-border-col rounded-xl p-5"
                >
                  <div className="flex items-start justify-between gap-4 mb-2">
                    <div>
                      <h3 className="text-sm font-semibold text-fg-primary">{clause.title}</h3>
                      <span className="text-xs font-medium rounded-full px-2 py-0.5 mt-1 inline-block"
                        style={{ background: 'var(--accent-gold-lt)', color: 'var(--accent-gold)' }}>
                        {clause.category}
                      </span>
                    </div>
                    <div className="flex gap-2 shrink-0">
                      <button
                        onClick={() => copyClause(clause.content)}
                        className="flex items-center gap-1.5 px-2.5 py-1.5 text-xs text-fg-secondary hover:text-fg-primary border border-border-col rounded-lg hover:bg-bg-secondary transition-all"
                      >
                        <Copy size={12} /> Copy
                      </button>
                      <button
                        onClick={() => { deleteClause && deleteClause(userId, clause.id); toast.success('Clause removed'); }}
                        className="flex items-center gap-1.5 px-2.5 py-1.5 text-xs text-fg-secondary hover:text-red-400 border border-border-col rounded-lg hover:bg-bg-secondary transition-all"
                      >
                        <Edit2 size={12} /> Edit
                      </button>
                    </div>
                  </div>
                  <p className="text-sm text-fg-secondary leading-relaxed border-t border-border-col pt-3 mt-2">
                    {clause.content}
                  </p>
                </motion.div>
              ))
            )}
          </div>
        </div>
      </div>

      {/* New Clause Modal */}
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
              className="w-full max-w-lg rounded-2xl p-6"
              style={{ background: '#172035', border: '0.5px solid #1E2D45' }}
            >
              <div className="flex items-center justify-between mb-5">
                <h2 style={{ color: '#EDF0F7', fontSize: 17, fontWeight: 600 }}>New Clause</h2>
                <button onClick={() => setShowModal(false)} style={{ color: '#4A5A72', background: 'none', border: 'none', cursor: 'pointer' }}>
                  <X size={18} />
                </button>
              </div>
              <div className="flex flex-col gap-4">
                <div>
                  <label style={{ fontSize: 12, color: '#8896AD', display: 'block', marginBottom: 6 }}>Title *</label>
                  <input
                    value={form.title}
                    onChange={(e) => setForm((f) => ({ ...f, title: e.target.value }))}
                    placeholder="e.g. Payment Terms (30 Days)"
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
                <div>
                  <label style={{ fontSize: 12, color: '#8896AD', display: 'block', marginBottom: 6 }}>Category</label>
                  <select
                    value={form.category}
                    onChange={(e) => setForm((f) => ({ ...f, category: e.target.value }))}
                    style={{
                      width: '100%', height: 38, background: '#0F1A2E',
                      border: '0.5px solid #1E2D45', borderRadius: 8,
                      color: '#EDF0F7', fontSize: 13, padding: '0 12px', outline: 'none',
                      fontFamily: 'DM Sans, sans-serif',
                    }}
                  >
                    {CATEGORIES.filter((c) => c !== 'All').map((c) => (
                      <option key={c} value={c}>{c}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label style={{ fontSize: 12, color: '#8896AD', display: 'block', marginBottom: 6 }}>Clause Text *</label>
                  <textarea
                    value={form.content}
                    onChange={(e) => setForm((f) => ({ ...f, content: e.target.value }))}
                    placeholder="Enter the full legal text of this clause…"
                    rows={5}
                    style={{
                      width: '100%', background: '#0F1A2E',
                      border: '0.5px solid #1E2D45', borderRadius: 8,
                      color: '#EDF0F7', fontSize: 13, padding: '10px 12px', outline: 'none',
                      fontFamily: 'DM Sans, sans-serif', resize: 'vertical', boxSizing: 'border-box',
                    }}
                    onFocus={(e) => e.target.style.borderColor = 'rgba(201,168,76,0.5)'}
                    onBlur={(e) => e.target.style.borderColor = '#1E2D45'}
                  />
                </div>
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
                  {saving ? 'Saving…' : 'Save Clause'}
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </PageTransition>
  );
}
