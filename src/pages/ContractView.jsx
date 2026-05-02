import { useNavigate, useParams } from 'react-router-dom';
import { motion } from 'framer-motion';
import { PageTransition } from '../components/ui/PageTransition';
import {
  ArrowLeft, Download, Send, Copy, RefreshCw, FileText,
  CheckCircle, Clock, Eye, AlertTriangle, ExternalLink, Edit2
} from 'lucide-react';
import { Button } from '../components/ui/Button';
import { Badge } from '../components/ui/Badge';
import { Card } from '../components/ui/Card';
import { StatusBadge } from '../components/ui/StatusBadge';
import { formatCurrency, formatDate, formatDateTime, formatRelativeTime } from '../utils/formatters';
import { useAuthStore } from '../store/authStore';
import { useQuery } from '@tanstack/react-query';
import { contractService } from '../services/contractService';

const pageVariants = { initial: { opacity: 0, y: 8 }, animate: { opacity: 1, y: 0, transition: { duration: 0.25 } } };

export default function ContractView() {
  const navigate     = useNavigate();
  const { id }       = useParams();
  const { user }     = useAuthStore();

  const { data: c, isLoading } = useQuery({
    queryKey: ['contract', id],
    queryFn: () => contractService.getById(id)
  });

  const { data: auditLogRaw = [] } = useQuery({
    queryKey: ['contractAudit', id],
    queryFn: () => contractService.getAuditLog(id)
  });

  if (isLoading) {
    return <div className="p-8 text-center text-fg-secondary">Loading contract details...</div>;
  }

  if (!c) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] gap-4">
        <AlertTriangle size={40} className="text-amber-500" />
        <h2 className="text-lg font-semibold text-fg-primary">Contract not found</h2>
        <p className="text-sm text-fg-secondary">This contract may have been deleted.</p>
        <Button variant="primary" onClick={() => navigate('/contracts')}>Back to Contracts</Button>
      </div>
    );
  }

  // Build timeline from real contract timestamps
  const timeline = [
    c.signedAt && { icon: CheckCircle, color: 'text-green-500', label: 'Contract Signed',  sub: c.recipientName, time: formatDateTime(c.signedAt) },
    c.viewedAt && { icon: Eye,         color: 'text-amber-500', label: 'Contract Viewed',  sub: c.recipientName, time: formatDateTime(c.viewedAt) },
    c.sentAt   && { icon: Send,        color: 'text-blue-500',  label: 'Contract Sent',    sub: user?.email || '', time: formatDateTime(c.sentAt) },
    c.createdAt && { icon: FileText,   color: 'text-gray-400',  label: 'Contract Created', sub: user?.email || '', time: formatDateTime(c.createdAt) },
  ].filter(Boolean);

  // Audit log from timeline
  const auditLog = auditLogRaw.map((a) => ({
    time: formatDateTime(a.createdAt),
    action: a.action.toUpperCase(),
    actor: a.metadata ? JSON.parse(a.metadata).actor || 'System' : 'System',
    ip: a.ipAddress || '—'
  }));

  return (
    <motion.div variants={pageVariants} initial="initial" animate="animate" className="p-6 lg:p-8 max-w-[1400px] mx-auto">
      {/* Header */}
      <div className="flex items-center gap-4 mb-6">
        <button onClick={() => navigate('/contracts')} className="flex items-center gap-1.5 text-sm text-gray-500 hover:text-gray-900 transition-colors">
          <ArrowLeft size={16} /> Contracts
        </button>
        <div className="w-px h-4 bg-gray-300" />
        <h1 className="text-xl font-semibold text-gray-900 flex-1 truncate">{c.title}</h1>
        <StatusBadge status={c.status} />
        <Button variant="secondary" size="sm" icon={<Edit2 size={14} />} onClick={() => navigate(`/contracts/${c.id}/edit`)}>Edit</Button>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-[1fr_300px] gap-6">
        {/* Contract content */}
        <div className="space-y-6">
          <Card>
            <div
              className="ProseMirror"
              dangerouslySetInnerHTML={{ __html: c.content }}
            />

            {/* Signature block */}
            <div className="mt-10 pt-6 border-t border-gray-200">
              <div className="grid grid-cols-2 gap-8">
                <div>
                  <p className="text-sm text-gray-500 mb-2">Freelancer</p>
                  <div className="h-16 border-b-2 border-gray-300 flex items-end pb-2">
                    <span className="text-serif text-2xl text-gray-700 italic">Rahul Verma</span>
                  </div>
                  <p className="text-xs text-gray-400 mt-1">Rahul Verma · Jun 1, 2025</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500 mb-2">Client</p>
                  <div className="h-16 border-b-2 border-green-400 flex items-end pb-2">
                    <span className="text-serif text-2xl text-green-700 italic">Priya Sharma</span>
                  </div>
                  <p className="text-xs text-green-600 mt-1 flex items-center gap-1">
                    <CheckCircle size={11} /> Priya Sharma · Jun 3, 2025 · 11:15 AM IST
                  </p>
                </div>
              </div>
            </div>
          </Card>

              {/* Audit Log */}
              <Card padding="none">
                <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100">
                  <h2 className="font-semibold text-gray-900 text-sm">Audit Log</h2>
                </div>
                <div className="overflow-x-auto">
                  <table className="w-full text-xs font-mono">
                    <thead>
                      <tr className="border-b border-gray-100 bg-gray-50">
                        {['Time', 'Action', 'Actor', 'IP'].map((h) => (
                          <th key={h} className="px-5 py-2.5 text-left text-gray-500 font-medium">{h}</th>
                        ))}
                      </tr>
                    </thead>
                    <tbody>
                      {auditLog.map((row, i) => (
                        <tr key={i} className="border-b border-gray-50 hover:bg-gray-50">
                          <td className="px-5 py-2.5 text-gray-500 whitespace-nowrap">{row.time}</td>
                          <td className="px-5 py-2.5">
                            <span className={`font-semibold ${
                              row.action === 'SIGNED' ? 'text-green-600' :
                              row.action === 'VIEWED' ? 'text-amber-600' :
                              row.action === 'SENT'   ? 'text-blue-600'  : 'text-gray-500'
                            }`}>{row.action}</span>
                          </td>
                          <td className="px-5 py-2.5 text-gray-700 truncate max-w-[160px]">{row.actor}</td>
                          <td className="px-5 py-2.5 text-gray-400">{row.ip}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </Card>
        </div>

        {/* Right panel */}
        <div className="space-y-5">
            <Card>
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-xs text-gray-500">Status</span>
                  <StatusBadge status={c.status} />
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-xs text-gray-500">Client</span>
                  <span className="text-sm font-medium text-gray-900">{c.recipientName || '—'}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-xs text-gray-500">Value</span>
                  <span className="text-sm font-semibold text-gray-900">{c.amount ? formatCurrency(Number(c.amount)) : '—'}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-xs text-gray-500">Created</span>
                  <span className="text-sm text-gray-700">{formatDate(c.createdAt)}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-xs text-gray-500">Last updated</span>
                  <span className="text-sm text-gray-700">{formatRelativeTime(c.updatedAt)}</span>
                </div>
              </div>
            </Card>

            {/* Timeline */}
            <Card padding="none">
              <div className="px-5 py-4 border-b border-gray-100">
                <h3 className="font-semibold text-gray-900 text-sm">Timeline</h3>
              </div>
              <div className="p-5 space-y-4">
                {timeline.length === 0 ? (
                  <p className="text-sm text-gray-400 text-center py-4">No timeline events yet</p>
                ) : timeline.map((item, i) => {
                  const Icon = item.icon;
                  return (
                    <div key={i} className="flex gap-3">
                      <div className="flex flex-col items-center">
                        <Icon size={16} className={item.color} />
                        {i < timeline.length - 1 && <div className="w-px flex-1 mt-1 bg-gray-200" />}
                      </div>
                      <div className="pb-4 min-w-0">
                        <p className="text-sm font-medium text-gray-900">{item.label}</p>
                        <p className="text-xs text-gray-500 truncate">{item.sub}</p>
                        <p className="text-xs text-gray-400 mt-0.5">{item.time}</p>
                      </div>
                    </div>
                  );
                })}
              </div>
            </Card>

          {/* Actions */}
          <Card>
            <h3 className="font-semibold text-gray-900 text-sm mb-3">Actions</h3>
            <div className="space-y-2">
              {[
                { label: 'Download PDF', icon: <Download size={14} /> },
                { label: 'Send Reminder', icon: <Send size={14} /> },
                { label: 'Duplicate', icon: <Copy size={14} /> },
                { label: 'Initiate Renewal', icon: <RefreshCw size={14} /> },
              ].map(({ label, icon }) => (
                <Button key={label} variant="secondary" size="sm" fullWidth icon={icon} className="justify-start">
                  {label}
                </Button>
              ))}
            </div>
          </Card>
        </div>
      </div>
    </motion.div>
  );
}
