import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Plus, Search, FileText, Clock, Star } from 'lucide-react';
import { PageTransition } from '../components/ui/PageTransition';
import { Button } from '../components/ui/Button';
import { Card } from '../components/ui/Card';
import { EmptyState } from '../components/ui/EmptyState';
import { cn } from '../utils/cn';
import { useQuery } from '@tanstack/react-query';
import { templateService } from '../services/templateService';

const TABS = ['All', 'My Templates', 'Contractly Templates'];

const MOCK_TEMPLATES = [
  { id: '1', name: 'Web Development Agreement', lastUsed: '3 days ago',  type: 'my',     clauses: 8 },
  { id: '2', name: 'Design Contract',            lastUsed: '1 week ago',  type: 'my',     clauses: 6 },
  { id: '3', name: 'Consulting Retainer',        lastUsed: '2 weeks ago', type: 'my',     clauses: 7 },
  { id: '4', name: 'Freelance NDA',              lastUsed: 'Never',       type: 'system', clauses: 4 },
  { id: '5', name: 'Social Media Management',    lastUsed: 'Never',       type: 'system', clauses: 5 },
  { id: '6', name: 'Photography Contract',       lastUsed: 'Never',       type: 'system', clauses: 6 },
  { id: '7', name: 'Content Writing Agreement',  lastUsed: '5 days ago',  type: 'my',     clauses: 5 },
];


export default function Templates() {
  const navigate = useNavigate();
  const [tab, setTab]     = useState('All');
  const [search, setSearch] = useState('');

  const { data: templates = [], isLoading } = useQuery({
    queryKey: ['templates'],
    queryFn: () => templateService.getAll()
  });

  const allTemplates = [...templates, ...MOCK_TEMPLATES];

  const filtered = allTemplates.filter((t) => {
    const matchTab =
      tab === 'All'                  ? true :
      tab === 'My Templates'         ? t.type === 'my' :
      t.type === 'system';
    return matchTab && t.name.toLowerCase().includes(search.toLowerCase());
  });

  return (
    <PageTransition>
      <div className="p-6 lg:p-8 max-w-[1400px] mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-2xl font-semibold text-fg-primary">Templates</h1>
            <p className="text-sm text-fg-secondary mt-0.5">Reusable contract templates for faster creation</p>
          </div>
          <button
            onClick={() => navigate('/contracts/new')}
            className="btn-gold flex items-center gap-2 px-4 py-2 rounded-xl text-sm"
          >
            <Plus size={15} /> New Template
          </button>
        </div>

        {/* Tabs + Search */}
        <div className="flex flex-col sm:flex-row gap-4 mb-6">
          <div className="flex gap-1 bg-bg-secondary rounded-xl p-1">
            {TABS.map((t) => (
              <button
                key={t}
                onClick={() => setTab(t)}
                className={cn(
                  'px-4 py-2 rounded-lg text-sm font-medium transition-all whitespace-nowrap',
                  tab === t
                    ? 'bg-bg-primary text-fg-primary shadow-sm'
                    : 'text-fg-secondary hover:text-fg-primary'
                )}
              >
                {t}
              </button>
            ))}
          </div>
          <div className="relative flex-1 max-w-sm">
            <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-fg-secondary" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search templates..."
              className="w-full pl-9 pr-3 py-2 text-sm border border-border-col rounded-xl bg-bg-secondary text-fg-primary placeholder:text-fg-secondary focus:outline-none focus:ring-2 focus:ring-[var(--accent-gold)]/20 focus:border-[var(--accent-gold)] transition-all"
            />
          </div>
        </div>

        {/* Grid */}
        {isLoading ? (
          <div className="p-8 text-center text-fg-secondary">Loading templates...</div>
        ) : filtered.length === 0 ? (
          <EmptyState
            title="No templates found"
            description="Create your first template or browse Contractly's default library"
            action={{ label: '+ New Template', onClick: () => navigate('/contracts/new') }}
          />
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {filtered.map((t, i) => (
              <motion.div
                key={t.id}
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0, transition: { delay: i * 0.05 } }}
                whileHover={{ y: -2 }}
                transition={{ duration: 0.15 }}
              >
                <div className="group relative bg-bg-primary border border-border-col rounded-xl p-5 hover:shadow-card-lg hover:border-[rgba(201,168,76,0.35)] dark:hover:border-[rgba(201,168,76,0.35)] transition-all duration-200 cursor-pointer">
                  {t.type === 'system' && (
                    <span className="absolute top-4 right-4 flex items-center gap-1 text-xs font-medium rounded-full px-2 py-0.5"
                      style={{ background: 'var(--accent-gold-lt)', color: 'var(--accent-gold)' }}>
                      <Star size={10} /> Default
                    </span>
                  )}

                  <div className="w-10 h-10 rounded-xl flex items-center justify-center mb-4"
                    style={{ background: 'var(--accent-gold-lt)' }}>
                    <FileText size={20} style={{ color: 'var(--accent-gold)' }} />
                  </div>

                  <h3 className="text-sm font-semibold text-fg-primary mb-1 pr-16">{t.name}</h3>
                  <p className="text-xs text-fg-secondary flex items-center gap-1 mb-1">
                    <Clock size={11} />
                    {t.lastUsed === 'Never' ? 'Never used' : `Last used ${t.lastUsed}`}
                  </p>
                  <p className="text-xs text-fg-secondary">{t.clauses} clauses</p>

                  <div className="flex gap-2 mt-4 opacity-0 group-hover:opacity-100 transition-all duration-200 translate-y-1 group-hover:translate-y-0">
                    <button
                      onClick={() => navigate('/contracts/new')}
                      className="flex-1 py-1.5 text-xs font-semibold rounded-lg btn-gold"
                    >
                      Use
                    </button>
                    <button
                      onClick={() => navigate('/contracts/new')}
                      className="flex-1 py-1.5 text-xs font-semibold rounded-lg bg-bg-secondary text-fg-primary border border-border-col hover:border-[var(--accent-gold)] transition-colors"
                    >
                      Edit
                    </button>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </PageTransition>
  );
}
