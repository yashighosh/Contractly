import { useState } from 'react';
import { motion } from 'framer-motion';
import { Search, Plus, Copy, Edit2, BookOpen, ChevronRight } from 'lucide-react';
import { Button } from '../components/ui/Button';
import { Card } from '../components/ui/Card';
import { EmptyState } from '../components/ui/EmptyState';
import { cn } from '../utils/cn';
import { toast } from 'react-hot-toast';

const CATEGORIES = [
  'All', 'Payment Terms', 'Deliverables', 'Intellectual Property',
  'Confidentiality', 'Termination', 'Liability', 'Dispute Resolution',
];

const MOCK_CLAUSES = [
  {
    id: '1', title: 'Payment Terms (30 Days)', category: 'Payment Terms',
    content: 'Client agrees to pay the invoice within 30 days of receipt. Late payments will incur a 2% monthly interest charge on the outstanding balance.',
  },
  {
    id: '2', title: 'Net 15 Payment', category: 'Payment Terms',
    content: 'All invoices are due within 15 days of the invoice date. Failure to pay within this period may result in work stoppage.',
  },
  {
    id: '3', title: 'IP Transfer on Full Payment', category: 'Intellectual Property',
    content: 'Upon receipt of full payment, all intellectual property rights, title, and interest in the deliverables shall transfer exclusively to the Client.',
  },
  {
    id: '4', title: 'NDA — Standard', category: 'Confidentiality',
    content: 'Both parties agree to keep confidential any proprietary information, trade secrets, or business data disclosed during this engagement for a period of 2 years.',
  },
  {
    id: '5', title: 'Termination (14-Day Notice)', category: 'Termination',
    content: 'Either party may terminate this agreement with 14 days written notice. Work completed up to termination shall be compensated at the agreed rate.',
  },
  {
    id: '6', title: 'Limitation of Liability', category: 'Liability',
    content: 'The Freelancer\'s total liability shall not exceed the total fees paid under this agreement. Neither party shall be liable for indirect or consequential damages.',
  },
  {
    id: '7', title: '3 Revisions Policy', category: 'Deliverables',
    content: 'This agreement includes up to 3 rounds of revisions. Additional revision rounds will be billed at ₹2,000 per hour at the current rate.',
  },
  {
    id: '8', title: 'Arbitration (India)', category: 'Dispute Resolution',
    content: 'Any disputes arising out of this agreement shall be resolved through binding arbitration in accordance with the Arbitration and Conciliation Act, 1996.',
  },
];

const pageVariants = { initial: { opacity: 0, y: 8 }, animate: { opacity: 1, y: 0, transition: { duration: 0.25 } } };

export default function ClauseLibrary() {
  const [category, setCategory] = useState('All');
  const [search, setSearch] = useState('');

  const filtered = MOCK_CLAUSES.filter((c) => {
    const matchCat = category === 'All' || c.category === category;
    const matchSearch = c.title.toLowerCase().includes(search.toLowerCase()) ||
                        c.content.toLowerCase().includes(search.toLowerCase());
    return matchCat && matchSearch;
  });

  const copyClause = (content) => {
    navigator.clipboard.writeText(content);
    toast.success('Clause copied to clipboard!');
  };

  return (
    <motion.div variants={pageVariants} initial="initial" animate="animate" className="p-6 lg:p-8 max-w-[1400px] mx-auto">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-semibold text-gray-900">Clause Library</h1>
          <p className="text-sm text-gray-500 mt-0.5">Reusable legal clauses for your contracts</p>
        </div>
        <Button variant="primary" icon={<Plus size={16} />}>New Clause</Button>
      </div>

      {/* Search */}
      <div className="relative mb-5 max-w-md">
        <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
        <input
          type="text"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search clauses…"
          className="w-full pl-9 pr-3 py-2 text-sm border border-gray-200 rounded-xl bg-white focus:outline-none focus:ring-2 focus:ring-brand-500/20 focus:border-brand-400 transition-all"
        />
      </div>

      <div className="flex gap-6">
        {/* Category sidebar */}
        <div className="hidden lg:block w-48 shrink-0">
          <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-2 px-2">Categories</p>
          <nav className="space-y-0.5">
            {CATEGORIES.map((cat) => (
              <button
                key={cat}
                onClick={() => setCategory(cat)}
                className={cn(
                  'w-full text-left flex items-center justify-between px-3 py-2 rounded-lg text-sm transition-all',
                  category === cat
                    ? 'bg-brand-50 text-brand-600 font-medium'
                    : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                )}
              >
                <span className="truncate">{cat}</span>
                {category === cat && <ChevronRight size={12} />}
              </button>
            ))}
          </nav>
        </div>

        {/* Mobile categories */}
        <div className="lg:hidden w-full mb-4 -mt-2">
          <div className="flex gap-2 flex-wrap">
            {CATEGORIES.map((cat) => (
              <button
                key={cat}
                onClick={() => setCategory(cat)}
                className={cn(
                  'px-3 py-1.5 rounded-lg text-xs font-medium transition-all',
                  category === cat ? 'bg-brand-500 text-white' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                )}
              >
                {cat}
              </button>
            ))}
          </div>
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
              >
                <Card>
                  <div className="flex items-start justify-between gap-4 mb-2">
                    <div>
                      <h3 className="text-sm font-semibold text-gray-900">{clause.title}</h3>
                      <span className="text-xs text-brand-500 bg-brand-50 px-2 py-0.5 rounded-full mt-1 inline-block">
                        {clause.category}
                      </span>
                    </div>
                    <div className="flex gap-2 shrink-0">
                      <button
                        onClick={() => copyClause(clause.content)}
                        className="flex items-center gap-1.5 px-2.5 py-1.5 text-xs text-gray-600 hover:text-gray-900 border border-gray-200 rounded-lg hover:bg-gray-50 transition-all"
                      >
                        <Copy size={12} /> Copy
                      </button>
                      <button className="flex items-center gap-1.5 px-2.5 py-1.5 text-xs text-gray-600 hover:text-gray-900 border border-gray-200 rounded-lg hover:bg-gray-50 transition-all">
                        <Edit2 size={12} /> Edit
                      </button>
                    </div>
                  </div>
                  <p className="text-sm text-gray-600 leading-relaxed border-t border-gray-100 pt-3 mt-2">
                    {clause.content}
                  </p>
                </Card>
              </motion.div>
            ))
          )}
        </div>
      </div>
    </motion.div>
  );
}
