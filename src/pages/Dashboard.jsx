import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import {
  FileText, IndianRupee, Clock, PenLine,
  TrendingUp, TrendingDown, Plus, ArrowRight,
  AlertCircle, Activity
} from 'lucide-react';
import {
  BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid
} from 'recharts';
import { useState } from 'react';
import { Button } from '../components/ui/Button';
import { Badge } from '../components/ui/Badge';
import { Card } from '../components/ui/Card';
import { EmptyState } from '../components/ui/EmptyState';
import { Skeleton, SkeletonCard } from '../components/ui/Skeleton';
import { formatCurrency, formatDate, formatRelativeTime } from '../utils/formatters';
import { useAuthStore } from '../store/authStore';

const pageVariants = {
  initial: { opacity: 0, y: 8 },
  animate: { opacity: 1, y: 0, transition: { duration: 0.25 } },
};

const stagger = {
  animate: { transition: { staggerChildren: 0.06 } }
};

const cardVariant = {
  initial: { opacity: 0, y: 16 },
  animate: { opacity: 1, y: 0, transition: { duration: 0.3 } }
};

// Mock data (replaced with real API data when backend is ready)
const MOCK_STATS = [
  { label: 'Active Contracts', value: '12', icon: FileText,    color: 'text-brand-500',  bg: 'bg-brand-50',  trend: '+2 this month',  up: true },
  { label: 'Revenue Locked In',value: '₹4,20,000', icon: IndianRupee, color: 'text-green-600',  bg: 'bg-green-50',  trend: '+12% vs last month', up: true },
  { label: 'Expiring Soon',    value: '3',  icon: Clock,        color: 'text-amber-600',  bg: 'bg-amber-50',  trend: 'This 30 days',   up: false },
  { label: 'Awaiting Signature',value: '5', icon: PenLine,      color: 'text-violet-600', bg: 'bg-violet-50', trend: '2 overdue',       up: false },
];

const MOCK_CONTRACTS = [
  { id: '1', title: 'Website Redesign', client: 'Priya Sharma',  amount: 85000,  status: 'signed',  createdAt: '2025-05-28' },
  { id: '2', title: 'Brand Identity',   client: 'Karan Mehta',   amount: 45000,  status: 'sent',    createdAt: '2025-05-30' },
  { id: '3', title: 'SEO Package',      client: 'Meera Iyer',    amount: 18000,  status: 'viewed',  createdAt: '2025-05-31' },
  { id: '4', title: 'App Development',  client: 'Rahul Verma',   amount: 200000, status: 'draft',   createdAt: '2025-06-01' },
  { id: '5', title: 'Logo Design',      client: 'Sneha Patel',   amount: 12000,  status: 'expired', createdAt: '2025-04-10' },
];

const MOCK_EXPIRING = [
  { id: '2', title: 'Brand Identity',  client: 'Karan Mehta', daysLeft: 6,  amount: 35000 },
  { id: '3', title: 'SEO Package',     client: 'Meera Iyer',  daysLeft: 12, amount: 18000 },
];

const MOCK_ACTIVITY = [
  { text: 'Rahul signed "App Development"',   time: '2h ago',  icon: '✍️' },
  { text: 'You sent "SEO Package" to Meera',  time: '5h ago',  icon: '📤' },
  { text: '"Logo Design" expired',            time: '1d ago',  icon: '⚠️' },
  { text: 'Priya viewed "Website Redesign"',  time: '2d ago',  icon: '👁' },
];

const MOCK_CHART = [
  { month: 'Jan', revenue: 42000 },
  { month: 'Feb', revenue: 68000 },
  { month: 'Mar', revenue: 55000 },
  { month: 'Apr', revenue: 90000 },
  { month: 'May', revenue: 78000 },
  { month: 'Jun', revenue: 115000 },
];

const CustomTooltip = ({ active, payload, label }) => {
  if (active && payload?.length) {
    return (
      <div className="bg-white border border-gray-200 rounded-xl shadow-lg p-3 text-sm">
        <div className="font-semibold text-gray-900">{label}</div>
        <div className="text-brand-600 font-medium">{formatCurrency(payload[0].value)}</div>
      </div>
    );
  }
  return null;
};

export default function Dashboard() {
  const { user } = useAuthStore();
  const navigate = useNavigate();
  const [chartRange, setChartRange] = useState('6M');
  const hasContracts = MOCK_CONTRACTS.length > 0;

  return (
    <motion.div
      variants={pageVariants}
      initial="initial"
      animate="animate"
      className="p-6 lg:p-8 max-w-[1600px] mx-auto"
    >
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-semibold text-gray-900">
            Good morning, {user?.name?.split(' ')[0] || 'there'} 👋
          </h1>
          <p className="text-sm text-gray-500 mt-0.5">Here's what's happening with your contracts</p>
        </div>
        <Button
          variant="primary"
          icon={<Plus size={16} />}
          onClick={() => navigate('/contracts/new')}
          className="hidden sm:inline-flex"
        >
          New Contract
        </Button>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-[1fr_320px] gap-6">
        {/* Main column */}
        <div className="space-y-6">
          {/* Stats strip */}
          <motion.div variants={stagger} animate="animate" className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            {MOCK_STATS.map((stat) => {
              const Icon = stat.icon;
              return (
                <motion.div key={stat.label} variants={cardVariant}>
                  <Card hover className="group">
                    <div className={`w-10 h-10 rounded-xl ${stat.bg} flex items-center justify-center mb-3`}>
                      <Icon size={20} className={stat.color} />
                    </div>
                    <div className="text-serif text-3xl font-medium text-gray-900 mb-1 group-hover:text-brand-600 transition-colors">
                      {stat.value}
                    </div>
                    <div className="text-sm text-gray-500 mb-2">{stat.label}</div>
                    <div className={`text-xs flex items-center gap-1 font-medium ${stat.up ? 'text-green-600' : 'text-amber-600'}`}>
                      {stat.up ? <TrendingUp size={12} /> : <TrendingDown size={12} />}
                      {stat.trend}
                    </div>
                  </Card>
                </motion.div>
              );
            })}
          </motion.div>

          {/* Contracts Table */}
          <Card padding="none">
            <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100">
              <h2 className="font-semibold text-gray-900">Recent Contracts</h2>
              <Button variant="ghost" size="sm" onClick={() => navigate('/contracts')}>
                View all <ArrowRight size={14} />
              </Button>
            </div>
            {!hasContracts ? (
              <EmptyState
                title="No contracts yet"
                description="Create your first contract to get started"
                action={{ label: '+ New Contract', onClick: () => navigate('/contracts/new') }}
              />
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-gray-100 bg-gray-50/50">
                      {['Contract Name', 'Client', 'Value', 'Status', 'Created', ''].map((h) => (
                        <th key={h} className="px-5 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wide whitespace-nowrap">
                          {h}
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {MOCK_CONTRACTS.map((c, i) => (
                      <motion.tr
                        key={c.id}
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1, transition: { delay: i * 0.05 } }}
                        className="border-b border-gray-50 hover:bg-gray-50/80 transition-colors group cursor-pointer"
                        onClick={() => navigate(`/contracts/${c.id}`)}
                      >
                        <td className="px-5 py-3.5 text-sm font-medium text-gray-900">{c.title}</td>
                        <td className="px-5 py-3.5 text-sm text-gray-600">{c.client}</td>
                        <td className="px-5 py-3.5 text-sm font-medium text-gray-800">{formatCurrency(c.amount)}</td>
                        <td className="px-5 py-3.5"><Badge status={c.status} /></td>
                        <td className="px-5 py-3.5 text-sm text-gray-500">{formatDate(c.createdAt)}</td>
                        <td className="px-5 py-3.5">
                          <span className="text-xs text-brand-500 font-medium opacity-0 group-hover:opacity-100 transition-opacity flex items-center gap-1">
                            View <ArrowRight size={12} />
                          </span>
                        </td>
                      </motion.tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </Card>

          {/* Revenue Chart */}
          <Card>
            <div className="flex items-center justify-between mb-6">
              <div>
                <h2 className="font-semibold text-gray-900">Revenue Overview</h2>
                <p className="text-sm text-gray-500">From signed contracts</p>
              </div>
              <div className="flex gap-1 bg-gray-100 rounded-lg p-1">
                {['3M', '6M', '12M'].map((r) => (
                  <button
                    key={r}
                    onClick={() => setChartRange(r)}
                    className={`px-3 py-1 rounded-md text-xs font-medium transition-all ${
                      chartRange === r ? 'bg-white text-gray-900 shadow-sm' : 'text-gray-500 hover:text-gray-700'
                    }`}
                  >
                    {r}
                  </button>
                ))}
              </div>
            </div>
            <ResponsiveContainer width="100%" height={220}>
              <BarChart data={MOCK_CHART} barSize={28} barCategoryGap="35%">
                <CartesianGrid strokeDasharray="3 3" stroke="#f3f4f6" vertical={false} />
                <XAxis dataKey="month" axisLine={false} tickLine={false} tick={{ fill: '#9ca3af', fontSize: 12 }} />
                <YAxis axisLine={false} tickLine={false} tick={{ fill: '#9ca3af', fontSize: 12 }} tickFormatter={(v) => `₹${v/1000}k`} />
                <Tooltip content={<CustomTooltip />} cursor={{ fill: '#f3f4f6', radius: 4 }} />
                <Bar dataKey="revenue" fill="#4f46e5" radius={[6, 6, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </Card>
        </div>

        {/* Right sidebar */}
        <div className="space-y-5">
          {/* Expiring Soon */}
          <Card padding="none">
            <div className="px-5 py-4 border-b border-gray-100 flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-amber-400 animate-pulse" />
              <h3 className="font-semibold text-gray-900 text-sm">Expiring Soon</h3>
            </div>
            <div className="p-4 space-y-3">
              {MOCK_EXPIRING.map((c) => (
                <div key={c.id} className="p-3 rounded-lg bg-amber-50 border border-amber-100">
                  <div className="text-sm font-medium text-gray-900">{c.title}</div>
                  <div className="text-xs text-gray-500 mt-0.5">{c.client}</div>
                  <div className="text-xs text-amber-600 font-medium mt-1">
                    Expires in {c.daysLeft} days · {formatCurrency(c.amount)}
                  </div>
                  <div className="flex gap-2 mt-2.5">
                    <Button variant="secondary" size="xs" fullWidth onClick={() => navigate(`/contracts/${c.id}`)}>
                      Renew
                    </Button>
                    <Button variant="ghost" size="xs" fullWidth>
                      Remind
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </Card>

          {/* Activity Feed */}
          <Card padding="none">
            <div className="px-5 py-4 border-b border-gray-100 flex items-center gap-2">
              <Activity size={14} className="text-gray-400" />
              <h3 className="font-semibold text-gray-900 text-sm">Recent Activity</h3>
            </div>
            <div className="p-4 space-y-3">
              {MOCK_ACTIVITY.map((a, i) => (
                <div key={i} className="flex items-start gap-3">
                  <span className="text-base leading-none mt-0.5">{a.icon}</span>
                  <div className="flex-1 min-w-0">
                    <p className="text-xs text-gray-700 leading-relaxed">{a.text}</p>
                    <p className="text-xs text-gray-400 mt-0.5">{a.time}</p>
                  </div>
                </div>
              ))}
            </div>
          </Card>
        </div>
      </div>
    </motion.div>
  );
}
