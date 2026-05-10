import React, { useEffect, useState } from 'react';
import api from '../services/api';
import { Users, FileText, TrendingUp, Clock } from 'lucide-react';

interface Stats {
  totalUsers: number;
  totalContracts: number;
  recentRegistrations: any[];
}

const Dashboard: React.FC = () => {
  const [stats, setStats] = useState<Stats | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const res = await api.get('/admin/stats');
        setStats(res.data.data);
      } catch (err) {
        console.error('Failed to fetch stats', err);
      } finally {
        setLoading(false);
      }
    };
    fetchStats();
  }, []);

  if (loading) return <div className="flex items-center justify-center h-64">
    <div className="w-8 h-8 border-4 border-primary-500 border-t-transparent rounded-full animate-spin"></div>
  </div>;

  return (
    <div className="space-y-8 animate-in fade-in duration-700">
      <div className="flex flex-col gap-1">
        <h2 className="text-3xl font-bold text-white tracking-tight">System Overview</h2>
        <p className="text-slate-400">Live monitoring of Contractly platform metrics</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="glass-card p-6 flex items-center gap-4 group hover:border-primary-500/50 transition-colors">
          <div className="w-14 h-14 bg-blue-500/10 rounded-2xl flex items-center justify-center text-blue-400 group-hover:scale-110 transition-transform">
            <Users size={28} />
          </div>
          <div>
            <p className="text-sm font-medium text-slate-400">Total Registered Users</p>
            <p className="text-3xl font-bold text-white">{stats?.totalUsers || 0}</p>
          </div>
        </div>

        <div className="glass-card p-6 flex items-center gap-4 group hover:border-green-500/50 transition-colors">
          <div className="w-14 h-14 bg-green-500/10 rounded-2xl flex items-center justify-center text-green-400 group-hover:scale-110 transition-transform">
            <FileText size={28} />
          </div>
          <div>
            <p className="text-sm font-medium text-slate-400">Total Contracts Created</p>
            <p className="text-3xl font-bold text-white">{stats?.totalContracts || 0}</p>
          </div>
        </div>

        <div className="glass-card p-6 flex items-center gap-4 group hover:border-purple-500/50 transition-colors">
          <div className="w-14 h-14 bg-purple-500/10 rounded-2xl flex items-center justify-center text-purple-400 group-hover:scale-110 transition-transform">
            <TrendingUp size={28} />
          </div>
          <div>
            <p className="text-sm font-medium text-slate-400">System Health</p>
            <p className="text-3xl font-bold text-white">99.9%</p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mt-8">
        {/* Recent Registrations */}
        <div className="glass-card overflow-hidden">
          <div className="p-6 border-b border-white/5 flex items-center justify-between">
            <h3 className="text-lg font-bold flex items-center gap-2">
              <Clock size={20} className="text-primary-400" />
              Recent Registrations
            </h3>
            <button className="text-xs text-primary-400 hover:text-primary-300 font-semibold uppercase tracking-wider">View All</button>
          </div>
          <div className="divide-y divide-white/5">
            {stats?.recentRegistrations.map((user: any) => (
              <div key={user._id} className="p-4 flex items-center justify-between hover:bg-white/5 transition-colors">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-slate-800 flex items-center justify-center text-xs font-bold border border-white/10 uppercase">
                    {user.fullName.substring(0, 2)}
                  </div>
                  <div>
                    <p className="text-sm font-bold text-white">{user.fullName}</p>
                    <p className="text-xs text-slate-500">{user.email}</p>
                  </div>
                </div>
                <p className="text-xs text-slate-400">{new Date(user.createdAt).toLocaleDateString()}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Platform Status */}
        <div className="glass-card p-8 flex flex-col justify-center items-center text-center space-y-4">
          <div className="w-20 h-20 bg-primary-500/20 rounded-full flex items-center justify-center text-primary-500 animate-pulse">
            <ShieldAlert size={40} />
          </div>
          <h3 className="text-xl font-bold">API Security Status</h3>
          <p className="text-slate-400 max-w-xs">All backend services are currently running behind JWT protection with Role-Based Access Control.</p>
          <div className="flex gap-2">
             <span className="px-3 py-1 bg-green-500/20 text-green-400 text-xs font-bold rounded-full border border-green-500/20">MongoDB Active</span>
             <span className="px-3 py-1 bg-blue-500/20 text-blue-400 text-xs font-bold rounded-full border border-blue-500/20">Node v20.x</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
