import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Users, Building2, ShieldCheck, TrendingUp, 
  ArrowUpRight, FileText, Globe, Clock, 
  Activity, MoreHorizontal, Plus, Search,
  Briefcase, BarChart3, LayoutDashboard
} from 'lucide-react';
import { useAuthStore } from '../store/authStore';
import { useQuery } from '@tanstack/react-query';
import { contractService } from '../services/contractService';
import { PageTransition } from '../components/ui/PageTransition';
import { AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer, BarChart, Bar } from 'recharts';
import { formatCurrency } from '../utils/formatters';

const C = {
  navy:   '#0B1629', mid: '#111F38', card: '#172035',
  border: '#1E2D45', gold: '#C9A84C', goldLt: '#E2C87A',
  goldDim:'rgba(201,168,76,0.08)', goldBorder:'rgba(201,168,76,0.3)',
  tp: '#EDF0F7', ts: '#8896AD', tm: '#4A5A72',
};

function AgencyStat({ label, value, icon: Icon, color }) {
  return (
    <motion.div 
      whileHover={{ y: -4 }}
      style={{ background: C.card, border: `1px solid ${C.border}`, borderRadius: 20, padding: 24, position: 'relative', overflow: 'hidden' }}
    >
      <div style={{ position: 'absolute', top: 0, right: 0, width: 80, height: 80, background: `radial-gradient(circle at top right, ${color}20, transparent)`, filter: 'blur(20px)' }} />
      <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 16 }}>
        <div style={{ width: 40, height: 40, borderRadius: 12, background: `${color}10`, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <Icon size={20} style={{ color }} />
        </div>
        <span style={{ fontSize: 14, fontWeight: 600, color: C.ts }}>{label}</span>
      </div>
      <div style={{ fontSize: 28, fontWeight: 700, color: C.tp }}>{value}</div>
    </motion.div>
  );
}

export default function AgencyDashboard() {
  const { user } = useAuthStore();
  const navigate = useNavigate();

  const { data: contracts = [] } = useQuery({
    queryKey: ['contracts'],
    queryFn: () => contractService.getAll()
  });

  const activeSessionsCount = user?.activeSessions?.length || 1;
  const revenue = contracts.filter(c => c.status === 'SIGNED').reduce((acc, c) => acc + (c.amount || 0), 0);
  const activeContracts = contracts.filter(c => ['SENT', 'VIEWED'].includes(c.status)).length;

  return (
    <PageTransition>
      <div style={{ padding: '32px 40px', maxWidth: 1600, margin: '0 auto' }}>
        {/* Header */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'between', marginBottom: 40, flexWrap: 'wrap', gap: 20 }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 8 }}>
              <div style={{ background: C.goldDim, color: C.gold, padding: '4px 12px', borderRadius: 100, fontSize: 11, fontWeight: 800, letterSpacing: 0.5, border: `1px solid ${C.goldBorder}` }}>AGENCY ELITE</div>
              <h1 style={{ fontFamily: 'Lora, serif', fontSize: 32, fontWeight: 600, color: C.tp }}>{user?.companyName || 'Agency Dashboard'}</h1>
            </div>
            <p style={{ color: C.ts, fontSize: 15 }}>Welcome back, {user?.fullName}. Here is your team's overview for today.</p>
          </div>
          <div style={{ display: 'flex', gap: 12, marginLeft: 'auto' }}>
            <button onClick={() => navigate('/contracts/new')} style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '12px 24px', background: C.gold, color: C.navy, borderRadius: 12, fontWeight: 700, fontSize: 14, border: 'none', cursor: 'pointer' }}>
              <Plus size={18} /> Create Team Contract
            </button>
          </div>
        </div>

        {/* Top Grid */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: 24, marginBottom: 40 }}>
          <AgencyStat label="Team Revenue" value={formatCurrency(revenue)} icon={TrendingUp} color={C.gold} />
          <AgencyStat label="Active Members" value={`${activeSessionsCount} / 5`} icon={Users} color="#6366f1" />
          <AgencyStat label="Open Contracts" value={activeContracts} icon={FileText} color="#0E9C78" />
          <AgencyStat label="Team Performance" value="94%" icon={BarChart3} color="#f59e0b" />
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 360px', gap: 32 }}>
          {/* Main Content */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: 32 }}>
            {/* Chart Area */}
            <div style={{ background: C.card, border: `1px solid ${C.border}`, borderRadius: 24, padding: 32 }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 24 }}>
                <h3 style={{ fontSize: 18, fontWeight: 600, color: C.tp }}>Team Revenue Performance</h3>
                <div style={{ display: 'flex', gap: 8 }}>
                  <select style={{ background: C.navy, border: `1px solid ${C.border}`, color: C.ts, padding: '6px 12px', borderRadius: 8, fontSize: 12 }}>
                    <option>Last 30 Days</option>
                    <option>Last 90 Days</option>
                  </select>
                </div>
              </div>
              <div style={{ height: 300 }}>
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={[
                    { day: 'Mon', rev: 4000 }, { day: 'Tue', rev: 3000 }, { day: 'Wed', rev: 5000 },
                    { day: 'Thu', rev: 2780 }, { day: 'Fri', rev: 1890 }, { day: 'Sat', rev: 2390 }, { day: 'Sun', rev: 3490 }
                  ]}>
                    <defs>
                      <linearGradient id="colorRev" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor={C.gold} stopOpacity={0.3}/>
                        <stop offset="95%" stopColor={C.gold} stopOpacity={0}/>
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" stroke={C.border} vertical={false} />
                    <XAxis dataKey="day" axisLine={false} tickLine={false} tick={{ fill: C.ts, fontSize: 12 }} />
                    <YAxis axisLine={false} tickLine={false} tick={{ fill: C.ts, fontSize: 12 }} />
                    <Tooltip contentStyle={{ background: C.navy, border: `1px solid ${C.border}`, borderRadius: 12 }} />
                    <Area type="monotone" dataKey="rev" stroke={C.gold} fillOpacity={1} fill="url(#colorRev)" strokeWidth={3} />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            </div>

            {/* Team Members List */}
            <div style={{ background: C.card, border: `1px solid ${C.border}`, borderRadius: 24, overflow: 'hidden' }}>
              <div style={{ padding: '24px 32px', borderBottom: `1px solid ${C.border}`, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <h3 style={{ fontSize: 18, fontWeight: 600, color: C.tp }}>Active Team Sessions</h3>
                <div style={{ color: C.gold, fontSize: 12, fontWeight: 700 }}>{activeSessionsCount} ACTIVE DEVICES</div>
              </div>
              <div style={{ padding: 16 }}>
                {[1, 2, 3].slice(0, activeSessionsCount).map((_, i) => (
                  <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 16, padding: '16px 20px', borderRadius: 16, hover: { background: 'rgba(255,255,255,0.02)' } }}>
                    <div style={{ width: 44, height: 44, borderRadius: 12, background: C.navy, display: 'flex', alignItems: 'center', justifyContent: 'center', border: `1px solid ${C.border}` }}>
                      <LayoutDashboard size={20} style={{ color: C.ts }} />
                    </div>
                    <div style={{ flex: 1 }}>
                      <div style={{ color: C.tp, fontWeight: 600, fontSize: 15 }}>Device Session #{i+1}</div>
                      <div style={{ color: C.ts, fontSize: 13 }}>Chrome on MacOS • Active now</div>
                    </div>
                    <div style={{ width: 8, height: 8, borderRadius: '50%', background: '#0E9C78', boxShadow: '0 0 10px #0E9C78' }} />
                  </div>
                ))}
                {activeSessionsCount < 5 && (
                  <div style={{ textAlign: 'center', padding: '20px 0', borderTop: `1px dashed ${C.border}`, margin: '0 20px' }}>
                    <p style={{ color: C.tm, fontSize: 13 }}>You have {5 - activeSessionsCount} available slots left.</p>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Sidebar */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: 32 }}>
            <div style={{ background: `linear-gradient(180deg, ${C.card} 0%, ${C.navy} 100%)`, border: `1px solid ${C.goldBorder}`, borderRadius: 24, padding: 32, position: 'relative' }}>
              <div style={{ position: 'absolute', top: 16, right: 16 }}>
                <ShieldCheck size={24} style={{ color: C.gold }} />
              </div>
              <h4 style={{ color: C.tp, fontWeight: 700, fontSize: 16, marginBottom: 12 }}>Team Compliance</h4>
              <p style={{ color: C.ts, fontSize: 14, lineHeight: 1.6, marginBottom: 24 }}>Your agency account is currently compliant with our security standards.</p>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                <div style={{ display: 'flex', justifyContent: 'between', fontSize: 13 }}>
                  <span style={{ color: C.ts }}>Device Limit</span>
                  <span style={{ color: C.tp, fontWeight: 600 }}>{activeSessionsCount}/5</span>
                </div>
                <div style={{ height: 6, background: C.navy, borderRadius: 3, overflow: 'hidden' }}>
                  <div style={{ height: '100%', background: C.gold, width: `${(activeSessionsCount/5)*100}%` }} />
                </div>
              </div>
            </div>

            <div style={{ background: C.card, border: `1px solid ${C.border}`, borderRadius: 24, padding: 24 }}>
              <h4 style={{ color: C.tp, fontWeight: 600, fontSize: 15, marginBottom: 20 }}>Agency Shortcuts</h4>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                {[
                  { label: 'Bulk Export', icon: FileText },
                  { label: 'Team Settings', icon: Users },
                  { label: 'Custom Domain', icon: Globe },
                  { label: 'White-labeling', icon: Briefcase },
                ].map((s) => (
                  <button key={s.label} style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '12px 16px', borderRadius: 12, background: C.navy, border: `1px solid ${C.border}`, color: C.ts, cursor: 'pointer', textAlign: 'left', fontSize: 14 }}>
                    <s.icon size={16} /> {s.label}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </PageTransition>
  );
}
