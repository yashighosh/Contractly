import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useEffect, useRef } from 'react';

/* Stable empty arrays — NEVER use `?? []` inline inside a Zustand selector;
   it creates a new reference every render and causes an infinite re-render loop. */
const EMPTY_ARR = [];
import {
  FileText, IndianRupee, Clock, PenLine,
  TrendingUp, TrendingDown, Plus, ArrowRight,
  Activity, Users, Copy, AlertCircle, Inbox
} from 'lucide-react';
import { AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from 'recharts';
import { animate } from 'framer-motion';
import { PageTransition } from '../components/ui/PageTransition';
import { StatusBadge } from '../components/ui/StatusBadge';
import { TimelineUI } from '../components/ui/TimelineUI';
import { formatCurrency, formatRelativeTime } from '../utils/formatters';
import { useAuthStore } from '../store/authStore';
import { useQuery } from '@tanstack/react-query';
import { contractService } from '../services/contractService';
import { dashboardService } from '../services/dashboardService';

/* ── Animated counter ── */
function useCountUp(target, duration = 700) {
  const ref = useRef(null);
  useEffect(() => {
    if (!ref.current) return;
    const node = ref.current;
    const controls = animate(0, target, {
      duration: duration / 1000,
      ease: 'easeOut',
      onUpdate: (v) => { node.textContent = Math.round(v).toLocaleString('en-IN'); },
    });
    return () => controls.stop();
  }, [target]);
  return ref;
}

/* ── Custom tooltip ── */
const CustomTooltip = ({ active, payload, label }) => {
  if (!active || !payload?.length) return null;
  return (
    <div className="bg-bg-primary border border-border-col rounded-xl shadow-lg p-3 text-sm">
      <div className="font-semibold text-fg-primary">{label}</div>
      <div className="font-medium mt-0.5" style={{ color: 'var(--accent-gold)' }}>
        {formatCurrency(payload[0].value)}
      </div>
    </div>
  );
};

/* ── Stat Card ── */
function StatCard({ label, value, icon: Icon, trend, up, delay }) {
  const numRef = useCountUp(value, 600 + delay * 100);
  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0, transition: { delay: delay * 0.08, duration: 0.3 } }}
      whileHover={{ y: -2 }} transition={{ duration: 0.15 }}
      className="bg-bg-primary rounded-xl border border-border-col overflow-hidden hover:shadow-card-lg transition-shadow"
      style={{ borderTop: '3px solid var(--accent-gold)' }}
    >
      <div className="p-5">
        <div className="flex items-center justify-between mb-3">
          <div className="w-9 h-9 rounded-xl flex items-center justify-center" style={{ background: 'var(--accent-gold-lt)' }}>
            <Icon size={16} style={{ color: 'var(--accent-gold)' }} />
          </div>
          <span className={`flex items-center gap-1 text-xs font-medium ${up ? 'text-brand-emerald-500' : 'text-amber-500'}`}>
            {up ? <TrendingUp size={11} /> : <TrendingDown size={11} />} {trend}
          </span>
        </div>
        <div ref={numRef} className="text-2xl font-bold text-fg-primary tabular-nums mb-0.5">0</div>
        <p className="text-sm text-fg-secondary">{label}</p>
      </div>
    </motion.div>
  );
}

/* ── Empty state ── */
function EmptyDashboard({ onNew }) {
  return (
    <div className="flex flex-col items-center justify-center py-20 text-center">
      <div className="w-20 h-20 rounded-2xl flex items-center justify-center mb-5" style={{ background: 'var(--accent-gold-lt)' }}>
        <Inbox size={32} style={{ color: 'var(--accent-gold)' }} />
      </div>
      <h2 className="text-xl font-semibold text-fg-primary mb-2" style={{ fontFamily: 'var(--font-serif)' }}>
        Your dashboard is ready
      </h2>
      <p className="text-sm text-fg-secondary max-w-sm mb-6 leading-relaxed">
        Create your first contract to start tracking revenue, managing clients, and getting signed faster.
      </p>
      <button
        onClick={onNew}
        className="btn-gold flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-semibold shadow-gold"
      >
        <Plus size={15} /> Create first contract
      </button>
    </div>
  );
}

/* ── Quick Actions ── */
const QUICK_ACTIONS = [
  { label: 'New Contract', icon: Plus,  path: '/contracts/new', primary: true },
  { label: 'Use Template', icon: Copy,  path: '/templates' },
  { label: 'Add Client',   icon: Users, path: '/clients' },
];

/* ── Main Dashboard ── */
export default function Dashboard() {
  const { user } = useAuthStore();
  const navigate  = useNavigate();
  const userId    = user?.id;

  const { data: contracts = [] } = useQuery({
    queryKey: ['contracts'],
    queryFn: () => contractService.getAll()
  });

  const { data: activityRaw = [] } = useQuery({
    queryKey: ['dashboardActivity'],
    queryFn: () => dashboardService.getRecent(10)
  });

  const activity = activityRaw.map(a => ({
    label: String(a.action).replace(/_/g, ' '),
    action: String(a.action).toLowerCase(),
    timestamp: a.createdAt,
    sub: `Contract ID: ${a.contractId}`
  }));

  const hour     = new Date().getHours();
  const greeting = hour < 12 ? 'Good morning' : hour < 17 ? 'Good afternoon' : 'Good evening';
  const firstName = user?.name?.split(' ')[0] || 'there';

  /* ── Derived stats ── */
  const active   = contracts.filter((c) => c.status === 'signed' || c.status === 'sent' || c.status === 'viewed').length;
  const revenue  = contracts.filter((c) => c.status === 'signed').reduce((sum, c) => sum + (Number(c.amount) || 0), 0);
  const expiring = contracts.filter((c) => c.status !== 'signed' && c.status !== 'expired' && c.status !== 'voided').length;
  const awaiting = contracts.filter((c) => c.status === 'sent' || c.status === 'viewed').length;
  const drafts   = contracts.filter((c) => c.status === 'draft');
  const recent   = [...contracts].sort((a, b) => new Date(b.updatedAt) - new Date(a.updatedAt)).slice(0, 5);

  /* ── Chart data (last 6 months from signed contracts) ── */
  const now = new Date();
  const chartData = Array.from({ length: 6 }, (_, i) => {
    const d = new Date(now.getFullYear(), now.getMonth() - (5 - i), 1);
    const month = d.toLocaleDateString('en-IN', { month: 'short' });
    const rev = contracts
      .filter((c) => c.status === 'signed' && new Date(c.updatedAt).getMonth() === d.getMonth() && new Date(c.updatedAt).getFullYear() === d.getFullYear())
      .reduce((s, c) => s + (Number(c.amount) || 0), 0);
    return { month, revenue: rev };
  });

  const isEmpty = contracts.length === 0;

  return (
    <PageTransition>
      <div className="p-6 lg:p-8 max-w-[1600px] mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-2xl font-semibold text-fg-primary">
              {greeting},{' '}
              <span style={{ fontFamily: 'var(--font-serif)', color: 'var(--accent-gold)' }}>{firstName}</span> 👋
            </h1>
            <p className="text-sm text-fg-secondary mt-0.5">
              {new Date().toLocaleDateString('en-IN', { weekday: 'long', day: 'numeric', month: 'long' })}
              {contracts.length > 0 && ` · ${contracts.length} contract${contracts.length !== 1 ? 's' : ''} total`}
            </p>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="flex flex-wrap gap-2 mb-6">
          {QUICK_ACTIONS.map(({ label, icon: Icon, path, primary }) => (
            <button key={path} onClick={() => navigate(path)}
              className={`flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-semibold transition-all hover:scale-[1.01] active:scale-[0.98] ${
                primary ? 'btn-gold shadow-gold' : 'bg-bg-primary border border-border-col text-fg-primary hover:border-[var(--accent-gold)] hover:text-[var(--accent-gold)]'
              }`}>
              <Icon size={14} /> {label}
            </button>
          ))}
        </div>

        {isEmpty ? (
          <EmptyDashboard onNew={() => navigate('/contracts/new')} />
        ) : (
          <>
            {/* Stats */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
              <StatCard label="Active Contracts" value={active}   icon={FileText}    trend={`${contracts.length} total`} up={active > 0}  delay={0} />
              <StatCard label="Revenue Locked"   value={revenue}  icon={IndianRupee} trend="from signed"                 up={revenue > 0} delay={1} />
              <StatCard label="Awaiting Sign"    value={awaiting} icon={PenLine}     trend="sent/viewed"                 up={false}       delay={2} />
              <StatCard label="Drafts"           value={drafts.length} icon={Clock}  trend="not sent yet"                up={false}       delay={3} />
            </div>

            <div className="grid grid-cols-1 xl:grid-cols-[1fr_300px] gap-6">
              <div className="space-y-5">
                {/* Contracts table */}
                <div className="bg-bg-primary rounded-xl border border-border-col overflow-hidden">
                  <div className="flex items-center justify-between px-5 py-4 border-b border-border-col">
                    <h2 className="font-semibold text-fg-primary">Recent Contracts</h2>
                    <button onClick={() => navigate('/contracts')}
                      className="flex items-center gap-1 text-xs font-medium hover:text-[var(--accent-gold)] transition-colors"
                      style={{ color: 'var(--accent-gold)' }}>
                      View all <ArrowRight size={12} />
                    </button>
                  </div>
                  <div className="overflow-x-auto">
                    <table className="w-full">
                      <thead>
                        <tr className="border-b border-border-col bg-bg-secondary/50">
                          {['Contract', 'Client', 'Value', 'Status', 'Updated'].map((h) => (
                            <th key={h} className="px-4 py-3 text-left text-xs font-semibold text-fg-secondary uppercase tracking-wide">{h}</th>
                          ))}
                        </tr>
                      </thead>
                      <tbody>
                        {recent.map((c, i) => (
                          <motion.tr key={c.id} initial={{ opacity: 0 }} animate={{ opacity: 1, transition: { delay: i * 0.04 } }}
                            className="border-b border-border-col hover:bg-bg-secondary/40 transition-colors cursor-pointer"
                            onClick={() => navigate(`/contracts/${c.id}`)}>
                            <td className="px-4 py-3 text-sm font-semibold text-fg-primary truncate max-w-[180px]">{c.title}</td>
                            <td className="px-4 py-3 text-sm text-fg-secondary">{c.client || '—'}</td>
                            <td className="px-4 py-3 text-sm font-medium text-fg-primary">{c.amount ? formatCurrency(Number(c.amount)) : '—'}</td>
                            <td className="px-4 py-3"><StatusBadge status={c.status} size="xs" /></td>
                            <td className="px-4 py-3 text-sm text-fg-secondary">{formatRelativeTime(c.updatedAt)}</td>
                          </motion.tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>

                {/* Revenue Chart */}
                <div className="bg-bg-primary rounded-xl border border-border-col p-5">
                  <div className="mb-5">
                    <h2 className="font-semibold text-fg-primary">Revenue Overview</h2>
                    <p className="text-xs text-fg-secondary mt-0.5">From signed contracts (last 6 months)</p>
                  </div>
                  <ResponsiveContainer width="100%" height={180}>
                    <AreaChart data={chartData} margin={{ top: 4, right: 4, left: -16, bottom: 0 }}>
                      <defs>
                        <linearGradient id="gold-area" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="0%" stopColor="#C9A84C" stopOpacity={0.25} />
                          <stop offset="100%" stopColor="#C9A84C" stopOpacity={0} />
                        </linearGradient>
                      </defs>
                      <CartesianGrid strokeDasharray="3 3" stroke="var(--border-default)" vertical={false} />
                      <XAxis dataKey="month" axisLine={false} tickLine={false} tick={{ fill: 'var(--fg-secondary)', fontSize: 11 }} />
                      <YAxis axisLine={false} tickLine={false} tick={{ fill: 'var(--fg-secondary)', fontSize: 11 }} tickFormatter={(v) => v ? `₹${v / 1000}k` : '0'} />
                      <Tooltip content={<CustomTooltip />} cursor={{ stroke: 'var(--accent-gold)', strokeWidth: 1, strokeDasharray: '4 4' }} />
                      <Area type="monotone" dataKey="revenue" stroke="#C9A84C" strokeWidth={2} fill="url(#gold-area)" dot={false} activeDot={{ r: 4, fill: '#C9A84C' }} />
                    </AreaChart>
                  </ResponsiveContainer>
                </div>
              </div>

              {/* Activity feed */}
              <div className="bg-bg-primary rounded-xl border border-border-col overflow-hidden">
                <div className="px-5 py-4 border-b border-border-col flex items-center gap-2">
                  <Activity size={13} className="text-fg-secondary" />
                  <h3 className="font-semibold text-fg-primary text-sm">Recent Activity</h3>
                </div>
                <div className="p-5">
                  {activity.length === 0 ? (
                    <p className="text-sm text-fg-secondary text-center py-8">No activity yet</p>
                  ) : (
                    <TimelineUI events={activity} />
                  )}
                </div>
              </div>
            </div>
          </>
        )}
      </div>
    </PageTransition>
  );
}
