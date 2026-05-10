import React, { useEffect, useState } from 'react';
import api from '../services/api';
import { Search, Mail, Building, Shield, Activity } from 'lucide-react';

interface User {
  _id: string;
  fullName: string;
  email: string;
  companyName: string;
  role: string;
  lastLogin?: string;
  createdAt: string;
}

const UsersControl: React.FC = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const res = await api.get('/admin/users');
        setUsers(res.data.data);
      } catch (err) {
        console.error('Failed to fetch users', err);
      } finally {
        setLoading(false);
      }
    };
    fetchUsers();
  }, []);

  const filteredUsers = users.filter(u => 
    u.fullName.toLowerCase().includes(search.toLowerCase()) || 
    u.email.toLowerCase().includes(search.toLowerCase())
  );

  if (loading) return <div className="flex items-center justify-center h-64">
    <div className="w-8 h-8 border-4 border-primary-500 border-t-transparent rounded-full animate-spin"></div>
  </div>;

  return (
    <div className="space-y-6 animate-in slide-in-from-bottom-4 duration-500">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-3xl font-bold text-white tracking-tight">Users Management</h2>
          <p className="text-slate-400">Total registered freelancers and businesses</p>
        </div>
        
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" size={18} />
          <input
            type="text"
            placeholder="Search by name or email..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-10 pr-4 py-2 bg-white/5 border border-white/10 rounded-xl focus:ring-2 focus:ring-primary-500 outline-none w-full md:w-80 transition-all"
          />
        </div>
      </div>

      <div className="glass-card overflow-hidden">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-white/5 text-slate-400 text-xs uppercase tracking-wider font-bold">
              <th className="px-6 py-4">User</th>
              <th className="px-6 py-4">Company</th>
              <th className="px-6 py-4">Role</th>
              <th className="px-6 py-4">Last Activity</th>
              <th className="px-6 py-4">Status</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-white/5">
            {filteredUsers.map((user) => (
              <tr key={user._id} className="hover:bg-white/[0.02] transition-colors group">
                <td className="px-6 py-5">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-slate-800 border border-white/10 flex items-center justify-center text-primary-400 font-bold group-hover:bg-primary-500/10 transition-colors">
                      {user.fullName.substring(0, 1)}
                    </div>
                    <div>
                      <p className="text-sm font-bold text-white">{user.fullName}</p>
                      <p className="text-xs text-slate-500 flex items-center gap-1">
                        <Mail size={12} /> {user.email}
                      </p>
                    </div>
                  </div>
                </td>
                <td className="px-6 py-5">
                  <div className="flex items-center gap-2 text-sm text-slate-300">
                    <Building size={16} className="text-slate-500" />
                    {user.companyName || '—'}
                  </div>
                </td>
                <td className="px-6 py-5">
                  <span className={`px-2 py-1 rounded-md text-[10px] font-bold uppercase tracking-wider border ${
                    user.role === 'ADMIN' 
                      ? 'bg-purple-500/10 text-purple-400 border-purple-500/20' 
                      : 'bg-blue-500/10 text-blue-400 border-blue-500/20'
                  }`}>
                    {user.role}
                  </span>
                </td>
                <td className="px-6 py-5">
                   <div className="text-xs text-slate-400 space-y-1">
                      <p className="flex items-center gap-1"><Shield size={12} className="text-slate-500" /> Joined: {new Date(user.createdAt).toLocaleDateString()}</p>
                      <p className="flex items-center gap-1 text-primary-400/70">
                        <Activity size={12} /> {user.lastLogin ? `Last Login: ${new Date(user.lastLogin).toLocaleString()}` : 'No login recorded'}
                      </p>
                   </div>
                </td>
                <td className="px-6 py-5">
                  <span className="flex items-center gap-2 text-green-400 text-xs font-bold bg-green-500/10 px-2 py-1 rounded-full border border-green-500/20 w-fit">
                    <span className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse"></span>
                    Active
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        
        {filteredUsers.length === 0 && (
          <div className="p-20 text-center space-y-3">
             <div className="inline-flex items-center justify-center w-16 h-16 bg-white/5 rounded-full text-slate-500 mb-2">
                <Search size={32} />
             </div>
             <h4 className="text-xl font-bold">No users found</h4>
             <p className="text-slate-500 max-w-xs mx-auto">Try adjusting your search criteria to find who you're looking for.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default UsersControl;
