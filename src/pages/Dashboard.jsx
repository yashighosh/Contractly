import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, useSpring, useTransform, animate } from 'framer-motion';
import { useEffect, useRef } from 'react';
import {
  FileText, IndianRupee, Clock, PenLine,
  TrendingUp, TrendingDown, Plus, ArrowRight,
  Activity, Users, Copy, AlertCircle
} from 'lucide-react';
import {
  AreaChart, Area, XAxis, YAxis,
  Tooltip, ResponsiveContainer, CartesianGrid,
} from 'recharts';
import { PageTransition } from '../components/ui/PageTransition';
import { StatusBadge } from '../components/ui/StatusBadge';
import { TimelineUI } from '../components/ui/TimelineUI';
import { formatCurrency, formatDate, formatRelativeTime } from '../utils/formatters';
import { useAuthStore } from '../store/authStore';

/* ── Animated counter hook ── */
function useCountUp(target, duration = 800) {
  const ref = useRef(null);
  useEffect(() => {
    const node = ref.current;
    if (!node) return;
    const controls = animate(0, target, {
      duration: duration / 1000,
      ease: 'easeOut',
      onUpdate: (v) => {
        node.textContent = typeof target === 'string'
          ? target
          : Number.isInteger(target)
            ? Math.round(v).toLocaleString('en-IN')
            : `₹${Math.round(v).toLocaleString('en-IN')}`;
      },
    });
    return () => controls.stop();
  }, [target]);
  return ref;
}

/* ── Mock data ── */
const STATS = [
  { label: 'Active Contracts', value: 12,      raw: 12,      icon: FileText,    trend: '+2 this month', up: true,  spark: [4,6,5,8,7,10,12] },
  { label: 'Revenue Locked',   value: 420000,  raw: 420000,  icon: IndianRupee, trend: '+12% vs last',  up: true,  spark: [30,50,45,70,60,90,105], money: true },
  { label: 'Expiring Soon',    value: 3,        raw: 3,       icon: Clock,       trend: 'This 30 days',  up: false, spark: [1,2,1,3,2,3,3] },
  { label: 'Awaiting Sign',    value: 5,        raw: 5,       icon: PenLine,     trend: '2 overdue',     up: false, spark: [2,3,4,3,5,4,5] },
];

const CONTRACTS = [
  { id: '1', title: 'Website Redesign',  client: 'Priya Sharma', amount: 85000,  status: 'signed',  createdAt: '2025-06-01', updatedAt: '2025-06-03' },
  { id: '2', title: 'Brand Identity',    client: 'Karan Mehta',  amount: 45000,  status: 'sent',    createdAt: '2025-06-02', updatedAt: '2025-06-02' },
  { id: '3', title: 'SEO Package',       client: 'Meera Iyer',   amount: 18000,  status: 'viewed',  createdAt: '2025-06-03', updatedAt: '2025-06-04' },
  { id: '4', title: 'App Development',   client: 'Rahul Verma',  amount: 200000, status: 'draft',   createdAt: '2025-06-04', updatedAt: '2025-06-04' },
  { id: '5', title: 'Logo Design',       client: 'Sneha Patel',  amount: 12000,  status: 'expired', createdAt: '2025-04-10', updatedAt: '2025-05-01' },
];

const EXPIRING = [
  { id: '2', title: 'Brand Identity', client: 'Karan Mehta', daysLeft: 6,  amount: 35000 },
  { id: '3', title: 'SEO Package',    client: 'Meera Iyer',  daysLeft: 12, amount: 18000 },
];

const CHART_DATA = [
  { month: 'Jan', revenue: 42000 },
  { month: 'Feb', revenue: 68000 },
  { month: 'Mar', revenue: 55000 },
  { month: 'Apr', revenue: 90000 },
  { month: 'May', revenue: 78000 },
  { month: 'Jun', revenue: 115000 },
];

const ACTIVITY = [
  { label: 'Rahul signed "App Development"',  timestamp: new Date(Date.now() - 2*3600000).toISOString(),  action: 'signed', sub: 'rahul@techfirm.in' },
  { label: 'Contract sent to Meera',          timestamp: new Date(Date.now() - 5*3600000).toISOString(),  action: 'sent',   sub: 'you@gmail.com' },
  { label: '"Logo Design" expired',           timestamp: new Date(Date.now() - 86400000).toISOString(),   action: 'expired', sub: '' },
  { label: 'Priya viewed the contract',       timestamp: new Date(Date.now() - 2*86400000).toISOString(), action: 'viewed', sub: 'priya@example.com' },
];

/* ── Custom tooltip ── */
const CustomTooltip = ({ active, payload, label }) => {
  if (!active || !payload?.length) return null;
  return (
    <div className="bg-bg-primary border border-border-col rounded-xl shadow-card-lg p-3 text-sm">
      <div className="font-semibold text-fg-primary">{label}</div>
      <div className="font-medium mt-0.5" style={{ color: 'var(--accent-gold)' }}>
        {formatCurrency(payload[0].value)}
      </div>
    </div>
  );
};

/* ── Stat card sparkline ── */
const MiniSparkline = ({ data, up }) => (
  <ResponsiveContainer width="100%" height={32}>
    <AreaChart data={data.map((v, i) => ({ v, i }))} margin={{ top: 2, right: 0, left: 0, bottom: 0 }}>
      <defs>
        <linearGradient id={`spark-${up}`} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor={up ? '#0E9470' : '#C9A84C'} stopOpacity={0.3} />
          <stop offset="100%" stopColor={up ? '#0E9470' : '#C9A84C'} stopOpacity={0} />
        </linearGradient>
      </defs>
      <Area type="monotone" dataKey="v" stroke={up ? '#0E9470' : '#C9A84C'} strokeWidth={1.5}
        fill={`url(#spark-${up})`} dot={false} />
    </AreaChart>
  </ResponsiveContainer>
);

/* ── Stat Card ── */
function StatCard({ stat, index }) {
  const Icon = stat.icon;
  const numRef = useCountUp(stat.raw, 600 + index * 100);

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0, transition: { delay: index * 0.08, duration: 0.3 } }}
      whileHover={{ y: -2 }}
      transition={{ duration: 0.15 }}
      className="bg-bg-primary rounded-xl border border-border-col overflow-hidden hover:shadow-card-lg transition-shadow"
      style={{ borderTop: '4px solid var(--accent-gold)' }}
    >
      <div className="p-5">
        <div className="flex items-center justify-between mb-3">
          <div className="w-10 h-10 rounded-xl flex items-center justify-center"
            style={{ background: 'var(--accent-gold-lt)' }}>
            <Icon size={18} style={{ color: 'var(--accent-gold)' }} />
          </div>
          <div className={`flex items-center gap-1 text-xs font-medium ${stat.up ? 'text-brand-emerald-500' : 'text-amber-500'}`}>
            {stat.up ? <TrendingUp size={12} /> : <TrendingDown size={12} />}
            {stat.trend}
          </div>
        </div>

        <div
          ref={numRef}
          className="text-2xl font-bold text-fg-primary mb-0.5 tabular-nums"
          style={{ fontFamily: 'var(--font-sans)' }}
        >
          0
        </div>
        <p className="text-sm text-fg-secondary mb-3">{stat.label}</p>

        <MiniSparkline data={stat.spark} up={stat.up} />
      </div>
    </motion.div>
  );
}

/* ── Quick Actions ── */
const QUICK_ACTIONS = [
  { label: 'New Contract',    icon: Plus,    path: '/contracts/new', primary: true },
  { label: 'Use Template',    icon: Copy,    path: '/templates' },
  { label: 'Add Client',      icon: Users,   path: '/clients' },
];

/* ── Main ── */
export default function Dashboard() {
  const { user } = useAuthStore();
  const navigate = useNavigate();
  const [chartRange, setChartRange] = useState('6M');

  const hour = new Date().getHours();
  const greeting = hour < 12 ? 'Good morning' : hour < 17 ? 'Good afternoon' : 'Good evening';

  return (
    <PageTransition>
      <div className="p-6 lg:p-8 max-w-[1600px] mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-2xl font-semibold text-fg-primary" style={{ fontFamily: 'var(--font-sans)' }}>
              {greeting}, <span style={{ fontFamily: 'var(--font-serif)', color: 'var(--accent-gold)' }}>
                {user?.name?.split(' ')[0] || 'there'}
              </span> 👋
            </h1>
            <p className="text-sm text-fg-secondary mt-0.5">
              {new Date().toLocaleDateString('en-IN', { weekday: 'long', day: 'numeric', month: 'long' })}
              {' · '}12 active contracts this month
            </p>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="flex flex-wrap gap-2 mb-6">
          {QUICK_ACTIONS.map(({ label, icon: Icon, path, primary }) => (
            <button
              key={path}
              onClick={() => navigate(path)}
              className={`flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-semibold transition-all hover:scale-[1.01] active:scale-[0.98] ${
                primary
                  ? 'btn-gold shadow-gold'
                  : 'bg-bg-primary border border-border-col text-fg-primary hover:border-[var(--accent-gold)] hover:text-[var(--accent-gold)]'
              }`}
            >
              <Icon size={15} />
              {label}
            </button>
          ))}
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
          {STATS.map((stat, i) => <StatCard key={stat.label} stat={stat} index={i} />)}
        </div>

        <div className="grid grid-cols-1 xl:grid-cols-[1fr_320px] gap-6">
          {/* Main column */}
          <div className="space-y-6">
            {/* Contracts Table */}
            <div className="bg-bg-primary rounded-xl border border-border-col overflow-hidden">
              <div className="flex items-center justify-between px-6 py-4 border-b border-border-col">
                <h2 className="font-semibold text-fg-primary">Recent Contracts</h2>
                <button
                  onClick={() => navigate('/contracts')}
                  className="flex items-center gap-1 text-sm font-medium hover:text-[var(--accent-gold)] transition-colors"
                  style={{ color: 'var(--accent-gold)' }}
                >
                  View all <ArrowRight size={14} />
                </button>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-border-col bg-bg-secondary/50">
                      {['Contract', 'Client', 'Value', 'Status', 'Updated'].map((h) => (
                        <th key={h} className="px-5 py-3 text-left text-xs font-semibold text-fg-secondary uppercase tracking-wide">
                          {h}
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {CONTRACTS.map((c, i) => (
                      <motion.tr
                        key={c.id}
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1, transition: { delay: i * 0.04 } }}
                        className="border-b border-border-col hover:bg-bg-secondary/50 transition-colors group cursor-pointer"
                        onClick={() => navigate(`/contracts/${c.id}`)}
                      >
                        <td className="px-5 py-3.5 text-sm font-semibold text-fg-primary">{c.title}</td>
                        <td className="px-5 py-3.5 text-sm text-fg-secondary">{c.client}</td>
                        <td className="px-5 py-3.5 text-sm font-medium text-fg-primary">{formatCurrency(c.amount)}</td>
                        <td className="px-5 py-3.5"><StatusBadge status={c.status} size="xs" /></td>
                        <td className="px-5 py-3.5 text-sm text-fg-secondary">{formatRelativeTime(c.updatedAt)}</td>
                      </motion.tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Revenue Chart */}
            <div className="bg-bg-primary rounded-xl border border-border-col p-6">
              <div className="flex items-center justify-between mb-6">
                <div>
                  <h2 className="font-semibold text-fg-primary">Revenue Overview</h2>
                  <p className="text-sm text-fg-secondary">From signed contracts</p>
                </div>
                <div className="flex gap-1 bg-bg-secondary rounded-lg p-1">
                  {['3M', '6M', '12M'].map((r) => (
                    <button
                      key={r}
                      onClick={() => setChartRange(r)}
                      className={`px-3 py-1 rounded-md text-xs font-medium transition-all ${
                        chartRange === r ? 'bg-bg-primary text-fg-primary shadow-sm' : 'text-fg-secondary hover:text-fg-primary'
                      }`}
                    >
                      {r}
                    </button>
                  ))}
                </div>
              </div>
              <ResponsiveContainer width="100%" height={220}>
                <AreaChart data={CHART_DATA} margin={{ top: 4, right: 4, left: -16, bottom: 0 }}>
                  <defs>
                    <linearGradient id="gold-grad" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor="#C9A84C" stopOpacity={0.25} />
                      <stop offset="100%" stopColor="#C9A84C" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="var(--border-default)" vertical={false} />
                  <XAxis dataKey="month" axisLine={false} tickLine={false}
                    tick={{ fill: 'var(--fg-secondary)', fontSize: 12 }} />
                  <YAxis axisLine={false} tickLine={false}
                    tick={{ fill: 'var(--fg-secondary)', fontSize: 12 }}
                    tickFormatter={(v) => `₹${v/1000}k`} />
                  <Tooltip content={<CustomTooltip />} cursor={{ stroke: 'var(--accent-gold)', strokeWidth: 1, strokeDasharray: '4 4' }} />
                  <Area type="monotone" dataKey="revenue" stroke="#C9A84C" strokeWidth={2}
                    fill="url(#gold-grad)" dot={false} activeDot={{ r: 5, fill: '#C9A84C' }} />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Right sidebar */}
          <div className="space-y-5">
            {/* Expiring Soon */}
            <div className="bg-bg-primary rounded-xl border border-border-col overflow-hidden">
              <div className="px-5 py-4 border-b border-border-col flex items-center gap-2">
                <AlertCircle size={14} style={{ color: 'var(--accent-gold)' }} />
                <h3 className="font-semibold text-fg-primary text-sm">Expiring Soon</h3>
                <span className="ml-auto text-xs font-semibold px-2 py-0.5 rounded-full" style={{ background: 'var(--accent-gold-lt)', color: 'var(--accent-gold)' }}>
                  {EXPIRING.length}
                </span>
              </div>
              <div className="p-4 space-y-3">
                {EXPIRING.map((c) => (
                  <div key={c.id} className="p-3 rounded-xl border" style={{ background: 'var(--accent-gold-lt)', borderColor: 'rgba(201,168,76,0.2)' }}>
                    <div className="text-sm font-semibold text-fg-primary">{c.title}</div>
                    <div className="text-xs text-fg-secondary mt-0.5">{c.client}</div>
                    <div className="text-xs font-semibold mt-1" style={{ color: 'var(--accent-gold)' }}>
                      {c.daysLeft} days left · {formatCurrency(c.amount)}
                    </div>
                    <button
                      onClick={() => navigate(`/contracts/${c.id}`)}
                      className="mt-2.5 w-full py-1.5 text-xs font-semibold rounded-lg transition-all btn-gold"
                    >
                      Renew Contract
                    </button>
                  </div>
                ))}
              </div>
            </div>

            {/* Activity */}
            <div className="bg-bg-primary rounded-xl border border-border-col overflow-hidden">
              <div className="px-5 py-4 border-b border-border-col flex items-center gap-2">
                <Activity size={14} className="text-fg-secondary" />
                <h3 className="font-semibold text-fg-primary text-sm">Recent Activity</h3>
              </div>
              <div className="p-5">
                <TimelineUI events={ACTIVITY} />
              </div>
            </div>
          </div>
        </div>
      </div>
    </PageTransition>
  );
}
