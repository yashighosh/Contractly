import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { useEffect, useRef } from 'react';

/* Stable empty arrays — NEVER use `?? []` inline inside a Zustand selector;
   it creates a new reference every render and causes an infinite re-render loop. */
const EMPTY_ARR = [];
import {
  FileText, IndianRupee, Clock, PenLine,
  TrendingUp, TrendingDown, Plus, ArrowRight,
  Activity, Users, Copy, AlertCircle, Inbox, Sparkles
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
    <div className="bg-bg-primary border border-[rgba(201,168,76,0.3)] rounded-xl shadow-[0_8px_30px_rgba(0,0,0,0.5)] p-4 text-sm backdrop-blur-md">
      <div className="font-semibold text-fg-primary mb-1">{label}</div>
      <div className="font-bold text-lg" style={{ color: 'var(--accent-gold)' }}>
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
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0, transition: { delay: delay * 0.1, duration: 0.4, ease: [0.22, 1, 0.36, 1] } }}
      whileHover={{ y: -4, scale: 1.01 }} transition={{ duration: 0.2 }}
      className="bg-bg-primary rounded-2xl border border-border-col overflow-hidden relative shadow-sm hover:shadow-[0_12px_32px_rgba(0,0,0,0.15)] transition-all group"
    >
      <div className="absolute top-0 left-0 w-full h-[3px]" style={{ background: 'linear-gradient(90deg, var(--accent-gold), transparent)' }} />
      <div className="absolute -right-6 -top-6 w-32 h-32 rounded-full opacity-0 group-hover:opacity-10 transition-opacity duration-300" style={{ background: 'var(--accent-gold)', filter: 'blur(30px)' }} />
      
      <div className="p-6 relative z-10">
        <div className="flex items-center justify-between mb-4">
          <div className="w-11 h-11 rounded-xl flex items-center justify-center bg-[rgba(201,168,76,0.1)] border border-[rgba(201,168,76,0.2)] text-[var(--accent-gold)] group-hover:scale-110 group-hover:rotate-3 transition-transform duration-300">
            <Icon size={20} />
          </div>
          <span className={`flex items-center gap-1.5 text-xs font-bold px-2.5 py-1.5 rounded-lg bg-opacity-15 backdrop-blur-sm ${up ? 'text-brand-emerald-500 bg-brand-emerald-500' : 'text-amber-500 bg-amber-500'}`}>
            {up ? <TrendingUp size={13} strokeWidth={2.5} /> : <TrendingDown size={13} strokeWidth={2.5} />} {trend}
          </span>
        </div>
        <div ref={numRef} className="text-3xl font-bold text-fg-primary tabular-nums mb-1 tracking-tight">0</div>
        <p className="text-[15px] font-medium text-fg-secondary">{label}</p>
      </div>
    </motion.div>
  );
}

/* ── Empty state ── */
function EmptyDashboard({ onNew }) {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95, y: 20 }}
      animate={{ opacity: 1, scale: 1, y: 0 }}
      transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
      className="flex flex-col items-center justify-center py-24 text-center relative mt-8 rounded-3xl border border-[rgba(255,255,255,0.03)] bg-[rgba(255,255,255,0.01)] overflow-hidden"
    >
      {/* Add a subtle glowing background behind the icon */}
      <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
        <motion.div
          animate={{ scale: [1, 1.2, 1], opacity: [0.1, 0.15, 0.1] }}
          transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut' }}
          className="w-80 h-80 rounded-full"
          style={{ background: 'radial-gradient(circle, rgba(201,168,76,0.3) 0%, transparent 70%)', filter: 'blur(40px)' }}
        />
      </div>

      <motion.div
        whileHover={{ scale: 1.05, rotate: [0, -5, 5, 0] }}
        transition={{ duration: 0.4 }}
        className="relative z-10 w-24 h-24 rounded-3xl flex items-center justify-center mb-6 shadow-[0_12px_40px_rgba(201,168,76,0.2)]"
        style={{ background: 'linear-gradient(135deg, rgba(201,168,76,0.15) 0%, rgba(201,168,76,0.05) 100%)', border: '1px solid rgba(201,168,76,0.3)', backdropFilter: 'blur(10px)' }}
      >
        <Inbox size={44} strokeWidth={1.5} style={{ color: 'var(--accent-gold)' }} />
      </motion.div>
      
      <h2 className="relative z-10 text-3xl font-bold text-fg-primary mb-3" style={{ fontFamily: 'var(--font-serif)', letterSpacing: '-0.5px' }}>
        Your dashboard is ready
      </h2>
      <p className="relative z-10 text-[16px] text-fg-secondary max-w-md mb-10 leading-relaxed font-medium">
        Create your first contract to start tracking revenue, managing clients, and getting paid faster.
      </p>
      
      <motion.button
        whileHover={{ scale: 1.03, translateY: -2 }}
        whileTap={{ scale: 0.97 }}
        onClick={onNew}
        className="relative z-10 flex items-center gap-2.5 px-7 py-3.5 rounded-xl text-[15px] font-bold transition-all shadow-[0_8px_20px_rgba(201,168,76,0.25)] hover:shadow-[0_16px_32px_rgba(201,168,76,0.35)]"
        style={{ background: 'linear-gradient(135deg, #E2C87A, var(--accent-gold))', color: '#0B1629', border: 'none' }}
      >
        <Sparkles size={18} /> Create your first contract
      </motion.button>
    </motion.div>
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

  const { data: contracts = [], isLoading, isError } = useQuery({
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
  const firstName = (user?.name || user?.fullName)?.split(' ')[0] || 'there';

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
      <div className="p-6 lg:p-8 max-w-[1600px] mx-auto relative min-h-[calc(100vh-4rem)]">
        {/* Very subtle grid background for entire dashboard */}
        <div className="absolute inset-0 z-0 pointer-events-none opacity-20" style={{ backgroundImage: 'linear-gradient(rgba(255,255,255,0.05) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.05) 1px, transparent 1px)', backgroundSize: '60px 60px' }} />

        <div className="relative z-10">
          {/* Header */}
          <div className="flex items-center justify-between mb-8">
            <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.5 }}>
              <h1 className="text-3xl font-bold text-fg-primary tracking-tight flex items-center gap-2 mb-1">
                {greeting},{' '}
                <span style={{ fontFamily: 'var(--font-serif)', color: 'var(--accent-gold)' }}>{firstName}</span> 
                <motion.span animate={{ rotate: [0, 14, -8, 14, -4, 10, 0, 0] }} transition={{ duration: 2, repeat: Infinity, repeatDelay: 2 }} style={{ display: 'inline-block', transformOrigin: 'bottom right' }}>👋</motion.span>
              </h1>
              <p className="text-[15px] font-medium text-fg-secondary mt-1 flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-[var(--accent-gold)] animate-pulse" />
                {new Date().toLocaleDateString('en-IN', { weekday: 'long', day: 'numeric', month: 'long' })}
                {contracts.length > 0 && <span className="opacity-40 px-1">•</span>}
                {contracts.length > 0 && <span>{contracts.length} contract{contracts.length !== 1 ? 's' : ''} total</span>}
              </p>
            </motion.div>
          </div>

          {/* Quick Actions */}
          <div className="flex flex-wrap gap-3 mb-8">
            {QUICK_ACTIONS.map(({ label, icon: Icon, path, primary }, i) => (
              <motion.button
                key={path}
                initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 + i * 0.05 }}
                whileHover={{ scale: 1.02, y: -2 }} whileTap={{ scale: 0.98 }}
                onClick={() => navigate(path)}
                className={`flex items-center gap-2 px-5 py-2.5 rounded-xl text-[14px] font-bold transition-all shadow-sm ${
                  primary ? 'bg-[linear-gradient(135deg,#E2C87A,var(--accent-gold))] text-[#0B1629] border border-transparent shadow-[0_6px_16px_rgba(201,168,76,0.2)] hover:shadow-[0_8px_20px_rgba(201,168,76,0.3)]' : 'bg-bg-primary border border-border-col text-fg-primary hover:border-[rgba(201,168,76,0.5)] hover:text-[var(--accent-gold)] hover:bg-[rgba(201,168,76,0.03)]'
                }`}>
                <Icon size={16} /> {label}
              </motion.button>
            ))}
          </div>

          {isLoading ? (
            <div className="flex flex-col items-center justify-center py-32">
              <motion.div animate={{ rotate: 360 }} transition={{ repeat: Infinity, duration: 1.5, ease: 'linear' }} className="w-12 h-12 rounded-full border-4 border-[rgba(201,168,76,0.2)] border-t-[var(--accent-gold)]" />
              <p className="mt-4 text-fg-secondary font-medium animate-pulse">Loading dashboard...</p>
            </div>
          ) : isError ? (
            <div className="text-center py-20 bg-[rgba(220,38,38,0.05)] rounded-2xl border border-[rgba(220,38,38,0.2)]">
              <AlertCircle size={32} className="mx-auto text-red-500 mb-3" />
              <p className="text-red-400 font-medium mb-5">Failed to load dashboard data. Please try logging in again.</p>
              <button onClick={() => navigate('/login')} className="btn-gold px-6 py-2.5 rounded-xl text-sm font-bold shadow-lg">Go to Login</button>
            </div>
          ) : isEmpty ? (
            <EmptyDashboard onNew={() => navigate('/contracts/new')} />
          ) : (
            <AnimatePresence>
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.5 }}>
                {/* Stats */}
                <div className="grid grid-cols-2 lg:grid-cols-4 gap-5 mb-8">
                  <StatCard label="Active Contracts" value={active}   icon={FileText}    trend={`${contracts.length} total`} up={active > 0}  delay={0} />
                  <StatCard label="Revenue Locked"   value={revenue}  icon={IndianRupee} trend="from signed"                 up={revenue > 0} delay={1} />
                  <StatCard label="Awaiting Sign"    value={awaiting} icon={PenLine}     trend="sent/viewed"                 up={false}       delay={2} />
                  <StatCard label="Drafts"           value={drafts.length} icon={Clock}  trend="not sent yet"                up={false}       delay={3} />
                </div>

                <div className="grid grid-cols-1 xl:grid-cols-[1fr_340px] gap-8">
                  <div className="space-y-8">
                    {/* Contracts table */}
                    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }} className="bg-bg-primary rounded-2xl border border-border-col overflow-hidden shadow-sm">
                      <div className="flex items-center justify-between px-6 py-5 border-b border-border-col bg-[rgba(255,255,255,0.01)]">
                        <h2 className="font-bold text-lg text-fg-primary">Recent Contracts</h2>
                        <button onClick={() => navigate('/contracts')}
                          className="flex items-center gap-1.5 text-sm font-bold hover:text-[var(--accent-gold-lt)] transition-colors px-3 py-1.5 rounded-lg hover:bg-[rgba(201,168,76,0.1)]"
                          style={{ color: 'var(--accent-gold)' }}>
                          View all <ArrowRight size={14} />
                        </button>
                      </div>
                      <div className="overflow-x-auto">
                        <table className="w-full">
                          <thead>
                            <tr className="border-b border-border-col bg-[rgba(255,255,255,0.02)]">
                              {['Contract', 'Client', 'Value', 'Status', 'Updated'].map((h) => (
                                <th key={h} className="px-6 py-4 text-left text-[13px] font-bold text-fg-secondary uppercase tracking-wider">{h}</th>
                              ))}
                            </tr>
                          </thead>
                          <tbody>
                            {recent.map((c, i) => (
                              <motion.tr key={c.id} initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0, transition: { delay: 0.4 + i * 0.05 } }}
                                whileHover={{ backgroundColor: 'rgba(255,255,255,0.03)' }}
                                className="border-b border-border-col transition-colors cursor-pointer group"
                                onClick={() => navigate(`/contracts/${c.id}`)}>
                                <td className="px-6 py-4.5 text-[15px] font-bold text-fg-primary truncate max-w-[220px] group-hover:text-[var(--accent-gold)] transition-colors">{c.title}</td>
                                <td className="px-6 py-4.5 text-sm text-fg-secondary font-medium">{c.client || '—'}</td>
                                <td className="px-6 py-4.5 text-[15px] font-bold text-fg-primary">{c.amount ? formatCurrency(Number(c.amount)) : '—'}</td>
                                <td className="px-6 py-4.5"><StatusBadge status={c.status} size="sm" /></td>
                                <td className="px-6 py-4.5 text-sm text-fg-secondary font-medium">{formatRelativeTime(c.updatedAt)}</td>
                              </motion.tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    </motion.div>

                    {/* Revenue Chart */}
                    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }} className="bg-bg-primary rounded-2xl border border-border-col p-6 shadow-sm relative overflow-hidden">
                      <div className="absolute top-0 right-0 w-64 h-64 bg-[var(--accent-gold)] opacity-5 blur-[80px] rounded-full pointer-events-none" />
                      <div className="mb-6 relative z-10">
                        <h2 className="font-bold text-lg text-fg-primary mb-1">Revenue Overview</h2>
                        <p className="text-[13px] font-medium text-fg-secondary">From signed contracts (last 6 months)</p>
                      </div>
                      <div className="relative z-10">
                        <ResponsiveContainer width="100%" height={220}>
                          <AreaChart data={chartData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                            <defs>
                              <linearGradient id="gold-area" x1="0" y1="0" x2="0" y2="1">
                                <stop offset="0%" stopColor="#C9A84C" stopOpacity={0.4} />
                                <stop offset="100%" stopColor="#C9A84C" stopOpacity={0.02} />
                              </linearGradient>
                            </defs>
                            <CartesianGrid strokeDasharray="4 4" stroke="rgba(255,255,255,0.06)" vertical={false} />
                            <XAxis dataKey="month" axisLine={false} tickLine={false} tick={{ fill: 'var(--fg-secondary)', fontSize: 12, fontWeight: 500 }} dy={10} />
                            <YAxis axisLine={false} tickLine={false} tick={{ fill: 'var(--fg-secondary)', fontSize: 12, fontWeight: 500 }} tickFormatter={(v) => v ? `₹${v / 1000}k` : '0'} dx={-10} />
                            <Tooltip content={<CustomTooltip />} cursor={{ stroke: 'var(--accent-gold)', strokeWidth: 1.5, strokeDasharray: '4 4' }} />
                            <Area type="monotone" dataKey="revenue" stroke="#C9A84C" strokeWidth={3} fill="url(#gold-area)" dot={{ r: 4, fill: '#172035', stroke: '#C9A84C', strokeWidth: 2 }} activeDot={{ r: 6, fill: '#C9A84C', stroke: '#fff', strokeWidth: 2 }} />
                          </AreaChart>
                        </ResponsiveContainer>
                      </div>
                    </motion.div>
                  </div>

                  {/* Activity feed */}
                  <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.5 }} className="bg-bg-primary rounded-2xl border border-border-col overflow-hidden shadow-sm h-fit">
                    <div className="px-6 py-5 border-b border-border-col flex items-center gap-2.5 bg-[rgba(255,255,255,0.01)]">
                      <div className="p-1.5 rounded-lg bg-[rgba(201,168,76,0.1)]">
                        <Activity size={16} className="text-[var(--accent-gold)]" />
                      </div>
                      <h3 className="font-bold text-fg-primary text-base">Recent Activity</h3>
                    </div>
                    <div className="p-6">
                      {activity.length === 0 ? (
                        <div className="text-center py-12">
                          <div className="w-12 h-12 rounded-full bg-[rgba(255,255,255,0.03)] flex items-center justify-center mx-auto mb-3">
                            <Clock size={20} className="text-fg-secondary" />
                          </div>
                          <p className="text-[14px] font-medium text-fg-secondary">No activity yet</p>
                        </div>
                      ) : (
                        <TimelineUI events={activity} />
                      )}
                    </div>
                  </motion.div>
                </div>
              </motion.div>
            </AnimatePresence>
          )}
        </div>
      </div>
    </PageTransition>
  );
}
