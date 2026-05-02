import { useState } from 'react';
import { motion } from 'framer-motion';
import { Plus, Search, Mail, Phone, Building2, FileText, MoreHorizontal, User } from 'lucide-react';
import { PageTransition } from '../components/ui/PageTransition';
import { Avatar } from '../components/ui/Avatar';
import { EmptyState } from '../components/ui/EmptyState';
import { Dropdown } from '../components/ui/Dropdown';
import { formatCurrency } from '../utils/formatters';

const MOCK_CLIENTS = [
  { id: '1', name: 'Priya Sharma', email: 'priya@example.com', phone: '+91 98765 43210', company: 'Priya Designs',  contracts: 4, totalValue: 210000 },
  { id: '2', name: 'Karan Mehta',  email: 'karan@startup.io',  phone: '+91 87654 32109', company: 'StartupIO',      contracts: 2, totalValue: 90000  },
  { id: '3', name: 'Meera Iyer',   email: 'meera@brand.co',    phone: '+91 76543 21098', company: 'Brand & Co',     contracts: 3, totalValue: 54000  },
  { id: '4', name: 'Rahul Verma',  email: 'rahul@techfirm.in', phone: '+91 65432 10987', company: 'TechFirm India', contracts: 1, totalValue: 200000 },
  { id: '5', name: 'Sneha Patel',  email: 'sneha@creative.in', phone: '+91 54321 09876', company: 'Creative House', contracts: 2, totalValue: 24000  },
];

export default function Clients() {
  const [search, setSearch] = useState('');

  const filtered = MOCK_CLIENTS.filter((c) =>
    c.name.toLowerCase().includes(search.toLowerCase()) ||
    c.email.toLowerCase().includes(search.toLowerCase()) ||
    c.company.toLowerCase().includes(search.toLowerCase())
  );

  const menuItems = [
    { label: 'View Contracts', icon: <FileText size={14} />, onClick: () => {} },
    { label: 'Edit Client',    icon: <User size={14} />,     onClick: () => {} },
    { divider: true },
    { label: 'Delete', icon: <MoreHorizontal size={14} />, onClick: () => {}, danger: true },
  ];

  return (
    <PageTransition>
      <div className="p-6 lg:p-8 max-w-[1400px] mx-auto">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-2xl font-semibold text-fg-primary">Clients</h1>
            <p className="text-sm text-fg-secondary mt-0.5">{filtered.length} clients</p>
          </div>
          <button className="btn-gold flex items-center gap-2 px-4 py-2 rounded-xl text-sm">
            <Plus size={15} /> Add Client
          </button>
        </div>

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

        {filtered.length === 0 ? (
          <EmptyState title="No clients found" description="Add your first client to get started"
            action={{ label: '+ Add Client', onClick: () => {} }} />
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
            {filtered.map((client, i) => (
              <motion.div key={client.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0, transition: { delay: i * 0.05 } }}
                whileHover={{ y: -2 }} transition={{ duration: 0.15 }}
              >
                <div className="group bg-bg-primary border border-border-col rounded-xl p-5 hover:shadow-card-lg transition-shadow">
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex items-center gap-3">
                      <Avatar name={client.name} size="md" />
                      <div>
                        <h3 className="text-sm font-semibold text-fg-primary">{client.name}</h3>
                        <div className="flex items-center gap-1 text-xs text-fg-secondary mt-0.5">
                          <Building2 size={11} /> {client.company}
                        </div>
                      </div>
                    </div>
                    <Dropdown align="right"
                      trigger={
                        <button className="p-1.5 rounded-lg text-fg-secondary hover:bg-bg-secondary opacity-0 group-hover:opacity-100 transition-all">
                          <MoreHorizontal size={15} />
                        </button>
                      }
                      items={menuItems}
                    />
                  </div>
                  <div className="space-y-1.5 mb-4">
                    <a href={`mailto:${client.email}`} className="flex items-center gap-2 text-xs text-fg-secondary hover:text-[var(--accent-gold)] transition-colors">
                      <Mail size={12} /> {client.email}
                    </a>
                    <div className="flex items-center gap-2 text-xs text-fg-secondary">
                      <Phone size={12} /> {client.phone}
                    </div>
                  </div>
                  <div className="flex items-center justify-between pt-3 border-t border-border-col">
                    <div className="text-center">
                      <div className="text-lg font-bold text-fg-primary">{client.contracts}</div>
                      <div className="text-xs text-fg-secondary">Contracts</div>
                    </div>
                    <div className="text-center">
                      <div className="text-sm font-bold text-fg-primary">{formatCurrency(client.totalValue)}</div>
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
    </PageTransition>
  );
}
