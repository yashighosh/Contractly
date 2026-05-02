import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Plus, Search, FileText, Clock, Star } from 'lucide-react';
import { Button } from '../components/ui/Button';
import { Card } from '../components/ui/Card';
import { Badge } from '../components/ui/Badge';
import { EmptyState } from '../components/ui/EmptyState';
import { cn } from '../utils/cn';

const TABS = ['All', 'My Templates', 'Contractly Templates'];

const MOCK_TEMPLATES = [
  { id: '1', name: 'Web Development Agreement',  lastUsed: '3 days ago',  type: 'my',    clauses: 8 },
  { id: '2', name: 'Design Contract',             lastUsed: '1 week ago',  type: 'my',    clauses: 6 },
  { id: '3', name: 'Consulting Retainer',         lastUsed: '2 weeks ago', type: 'my',    clauses: 7 },
  { id: '4', name: 'Freelance NDA',               lastUsed: 'Never',       type: 'system',clauses: 4 },
  { id: '5', name: 'Social Media Management',     lastUsed: 'Never',       type: 'system',clauses: 5 },
  { id: '6', name: 'Photography Contract',        lastUsed: 'Never',       type: 'system',clauses: 6 },
  { id: '7', name: 'Content Writing Agreement',   lastUsed: '5 days ago',  type: 'my',    clauses: 5 },
];

const pageVariants = { initial: { opacity: 0, y: 8 }, animate: { opacity: 1, y: 0, transition: { duration: 0.25 } } };

export default function Templates() {
  const navigate = useNavigate();
  const [tab, setTab] = useState('All');
  const [search, setSearch] = useState('');

  const filtered = MOCK_TEMPLATES.filter((t) => {
    const matchTab =
      tab === 'All' ? true :
      tab === 'My Templates' ? t.type === 'my' :
      t.type === 'system';
    return matchTab && t.name.toLowerCase().includes(search.toLowerCase());
  });

  return (
    <motion.div variants={pageVariants} initial="initial" animate="animate" className="p-6 lg:p-8 max-w-[1400px] mx-auto">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-semibold text-gray-900">Templates</h1>
          <p className="text-sm text-gray-500 mt-0.5">Reusable contract templates for faster creation</p>
        </div>
        <Button variant="primary" icon={<Plus size={16} />} onClick={() => navigate('/contracts/new')}>
          New Template
        </Button>
      </div>

      {/* Tabs + Search */}
      <div className="flex flex-col sm:flex-row gap-4 mb-6">
        <div className="flex gap-1 bg-gray-100 rounded-xl p-1">
          {TABS.map((t) => (
            <button
              key={t}
              onClick={() => setTab(t)}
              className={cn(
                'px-4 py-2 rounded-lg text-sm font-medium transition-all whitespace-nowrap',
                tab === t ? 'bg-white text-gray-900 shadow-sm' : 'text-gray-500 hover:text-gray-700'
              )}
            >
              {t}
            </button>
          ))}
        </div>
        <div className="relative flex-1 max-w-sm">
          <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search templates..."
            className="w-full pl-9 pr-3 py-2 text-sm border border-gray-200 rounded-xl bg-white focus:outline-none focus:ring-2 focus:ring-brand-500/20 focus:border-brand-400 transition-all"
          />
        </div>
      </div>

      {/* Grid */}
      {filtered.length === 0 ? (
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
            >
              <Card hover className="group relative overflow-hidden">
                {/* Type badge */}
                {t.type === 'system' && (
                  <span className="absolute top-4 right-4 flex items-center gap-1 text-xs text-amber-600 bg-amber-50 border border-amber-100 rounded-full px-2 py-0.5">
                    <Star size={10} className="fill-amber-400 text-amber-400" /> Default
                  </span>
                )}

                {/* Icon */}
                <div className="w-10 h-10 rounded-xl bg-brand-50 flex items-center justify-center mb-4">
                  <FileText size={20} className="text-brand-500" />
                </div>

                <h3 className="text-sm font-semibold text-gray-900 mb-1 pr-16">{t.name}</h3>
                <p className="text-xs text-gray-500 flex items-center gap-1 mb-1">
                  <Clock size={11} />
                  {t.lastUsed === 'Never' ? 'Never used' : `Last used ${t.lastUsed}`}
                </p>
                <p className="text-xs text-gray-400">{t.clauses} clauses</p>

                {/* Actions — visible on hover */}
                <div className="flex gap-2 mt-4 opacity-0 group-hover:opacity-100 transition-all duration-200 translate-y-1 group-hover:translate-y-0">
                  <Button
                    variant="primary"
                    size="sm"
                    fullWidth
                    onClick={() => navigate('/contracts/new')}
                  >
                    Use
                  </Button>
                  <Button
                    variant="secondary"
                    size="sm"
                    fullWidth
                    onClick={() => navigate(`/contracts/new`)}
                  >
                    Edit
                  </Button>
                </div>
              </Card>
            </motion.div>
          ))}
        </div>
      )}
    </motion.div>
  );
}
