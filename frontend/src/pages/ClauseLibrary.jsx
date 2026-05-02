import { useState } from 'react';
import { motion } from 'framer-motion';
import { Search, Plus, Copy, Edit2, ChevronRight } from 'lucide-react';
import { PageTransition } from '../components/ui/PageTransition';
import { EmptyState } from '../components/ui/EmptyState';
import { cn } from '../utils/cn';
import { toast } from 'react-hot-toast';

const CATEGORIES = [
  'All', 'Payment Terms', 'Deliverables', 'Intellectual Property',
  'Confidentiality', 'Termination', 'Liability', 'Dispute Resolution',
];

const MOCK_CLAUSES = [
  { id: '1', title: 'Payment Terms (30 Days)', category: 'Payment Terms',
    content: 'Client agrees to pay the invoice within 30 days of receipt. Late payments will incur a 2% monthly interest charge on the outstanding balance.' },
  { id: '2', title: 'Net 15 Payment', category: 'Payment Terms',
    content: 'All invoices are due within 15 days of the invoice date. Failure to pay within this period may result in work stoppage.' },
  { id: '3', title: 'IP Transfer on Full Payment', category: 'Intellectual Property',
    content: 'Upon receipt of full payment, all intellectual property rights, title, and interest in the deliverables shall transfer exclusively to the Client.' },
  { id: '4', title: 'NDA — Standard', category: 'Confidentiality',
    content: 'Both parties agree to keep confidential any proprietary information, trade secrets, or business data disclosed during this engagement for a period of 2 years.' },
  { id: '5', title: 'Termination (14-Day Notice)', category: 'Termination',
    content: 'Either party may terminate this agreement with 14 days written notice. Work completed up to termination shall be compensated at the agreed rate.' },
  { id: '6', title: 'Limitation of Liability', category: 'Liability',
    content: "The Freelancer's total liability shall not exceed the total fees paid under this agreement. Neither party shall be liable for indirect or consequential damages." },
  { id: '7', title: '3 Revisions Policy', category: 'Deliverables',
    content: 'This agreement includes up to 3 rounds of revisions. Additional revision rounds will be billed at ₹2,000 per hour at the current rate.' },
  { id: '8', title: 'Arbitration (India)', category: 'Dispute Resolution',
    content: 'Any disputes arising out of this agreement shall be resolved through binding arbitration in accordance with the Arbitration and Conciliation Act, 1996.' },
];

export default function ClauseLibrary() {
  const [category, setCategory] = useState('All');
  const [search, setSearch]     = useState('');

  const filtered = MOCK_CLAUSES.filter((c) => {
    const matchCat = category === 'All' || c.category === category;
    const matchSearch =
      c.title.toLowerCase().includes(search.toLowerCase()) ||
      c.content.toLowerCase().includes(search.toLowerCase());
    return matchCat && matchSearch;
  });

  const copyClause = (content) => {
    navigator.clipboard.writeText(content);
    toast.success('Clause copied to clipboard!');
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
          <button className="btn-gold flex items-center gap-2 px-4 py-2 rounded-xl text-sm">
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
            {filtered.length === 0 ? (
              <EmptyState
                title="No clauses found"
                description="Try a different search or add a new clause"
                action={{ label: '+ New Clause', onClick: () => {} }}
              />
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
                      <button className="flex items-center gap-1.5 px-2.5 py-1.5 text-xs text-fg-secondary hover:text-fg-primary border border-border-col rounded-lg hover:bg-bg-secondary transition-all">
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
    </PageTransition>
  );
}
