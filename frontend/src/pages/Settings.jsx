import { useState } from 'react';
import { User, Building2, Bell, PenLine, CreditCard, Key, Save, Check } from 'lucide-react';
import { PageTransition } from '../components/ui/PageTransition';
import { Button } from '../components/ui/Button';
import { Input } from '../components/ui/Input';
import { Card } from '../components/ui/Card';
import { Divider } from '../components/ui/Divider';
import { Avatar } from '../components/ui/Avatar';
import { useAuthStore } from '../store/authStore';
import { cn } from '../utils/cn';
import { toast } from 'react-hot-toast';

const TABS = [
  { id: 'profile',       label: 'Profile',      icon: User },
  { id: 'business',      label: 'Business',      icon: Building2 },
  { id: 'notifications', label: 'Notifications', icon: Bell },
  { id: 'signature',     label: 'Signature',     icon: PenLine },
  { id: 'billing',       label: 'Billing',       icon: CreditCard },
  { id: 'api',           label: 'API',           icon: Key },
];

const NOTIFICATION_OPTS = [
  { key: 'signed',   label: 'Contract signed',   desc: 'Get notified when a client signs your contract' },
  { key: 'viewed',   label: 'Contract viewed',   desc: 'Know when your client opens the contract' },
  { key: 'expiring', label: 'Contract expiring', desc: 'Alert 7 days before a contract expires' },
  { key: 'overdue',  label: 'Payment overdue',   desc: 'Remind clients about overdue payments' },
];

export default function Settings() {
  const { user } = useAuthStore();
  const [activeTab, setActiveTab] = useState('profile');
  const [notifs, setNotifs] = useState({ signed: true, viewed: true, expiring: true, overdue: false });
  const [saving, setSaving] = useState(false);

  const handleSave = async () => {
    setSaving(true);
    await new Promise((r) => setTimeout(r, 800));
    setSaving(false);
    toast.success('Settings saved!');
  };

  return (
    <PageTransition>
      <div className="p-6 lg:p-8 max-w-[1100px] mx-auto">
        <h1 className="text-2xl font-semibold text-fg-primary mb-6">Settings</h1>

        <div className="flex gap-6">
          {/* Sidebar tabs (desktop) */}
          <div className="hidden lg:block w-48 shrink-0">
            <nav className="space-y-0.5">
              {TABS.map(({ id, label, icon: Icon }) => (
                <button key={id} onClick={() => setActiveTab(id)}
                  className={cn('w-full flex items-center gap-2.5 px-3 py-2.5 rounded-lg text-sm font-medium transition-all',
                    activeTab === id ? 'font-semibold' : 'text-fg-secondary hover:bg-bg-secondary hover:text-fg-primary'
                  )}
                  style={activeTab === id ? { background: 'var(--accent-gold-lt)', color: 'var(--accent-gold)' } : {}}
                >
                  <Icon size={16} /> {label}
                </button>
              ))}
            </nav>
          </div>

          {/* Mobile tabs */}
          <div className="lg:hidden w-full mb-4 -mt-2 overflow-x-auto">
            <div className="flex gap-2 pb-2">
              {TABS.map(({ id, label, icon: Icon }) => (
                <button key={id} onClick={() => setActiveTab(id)}
                  className="flex items-center gap-1.5 px-3 py-2 rounded-lg text-xs font-medium whitespace-nowrap transition-all"
                  style={activeTab === id
                    ? { background: 'var(--accent-gold)', color: '#0F1A2E' }
                    : { background: 'var(--bg-secondary)', color: 'var(--fg-secondary)' }}
                >
                  <Icon size={13} />{label}
                </button>
              ))}
            </div>
          </div>

          {/* Content */}
          <div className="flex-1 min-w-0">
            {activeTab === 'profile' && (
              <Card>
                <h2 className="text-lg font-semibold text-fg-primary mb-5">Profile Information</h2>
                <div className="flex items-center gap-4 mb-6">
                  <Avatar name={user?.name || user?.fullName || 'User'} size="xl" />
                  <div>
                    <Button variant="secondary" size="sm">Change Photo</Button>
                    <p className="text-xs text-fg-secondary mt-1">JPG, PNG up to 5MB</p>
                  </div>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <Input label="Full Name" defaultValue={user?.name || user?.fullName || ''} placeholder="Priya Sharma" />
                  <Input label="Email Address" type="email" defaultValue={user?.email || ''} placeholder="you@example.com" />
                  <Input label="Phone Number" type="tel" placeholder="+91 98765 43210" />
                  <Input label="GST Number" placeholder="27AAAAA0000A1Z5" hint="Optional — for invoice compliance" />
                </div>
                <Divider className="my-5" />
                <Button variant="primary" loading={saving} icon={<Save size={14} />} onClick={handleSave}>Save Changes</Button>
              </Card>
            )}

            {activeTab === 'business' && (
              <Card>
                <h2 className="text-lg font-semibold text-fg-primary mb-5">Business Details</h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <Input label="Business Name" placeholder="My Creative Studio" />
                  <Input label="Website" placeholder="https://myportfolio.in" />
                  <Input label="Business Address" placeholder="123 MG Road, Bengaluru" className="sm:col-span-2" />
                  <Input label="UPI ID" placeholder="business@okaxis" hint="Used in payment references on contracts" />
                  <Input label="Bank Account (last 4 digits)" placeholder="5678" />
                </div>
                <Divider className="my-5" />
                <Button variant="primary" loading={saving} icon={<Save size={14} />} onClick={handleSave}>Save Business Info</Button>
              </Card>
            )}

            {activeTab === 'notifications' && (
              <Card>
                <h2 className="text-lg font-semibold text-fg-primary mb-5">Email Notifications</h2>
                <div className="space-y-4">
                  {NOTIFICATION_OPTS.map(({ key, label, desc }) => (
                    <div key={key} className="flex items-center justify-between py-3 border-b border-border-col last:border-0">
                      <div>
                        <p className="text-sm font-medium text-fg-primary">{label}</p>
                        <p className="text-xs text-fg-secondary mt-0.5">{desc}</p>
                      </div>
                      <button
                        onClick={() => setNotifs((n) => ({ ...n, [key]: !n[key] }))}
                        className="relative w-10 h-5 rounded-full transition-colors duration-200 shrink-0"
                        style={{ background: notifs[key] ? 'var(--accent-emerald)' : 'var(--bg-tertiary)' }}
                      >
                        <span className={cn('absolute top-0.5 left-0.5 w-4 h-4 rounded-full bg-white shadow-sm transition-transform duration-200', notifs[key] && 'translate-x-5')} />
                      </button>
                    </div>
                  ))}
                </div>
                <Button variant="primary" loading={saving} icon={<Save size={14} />} onClick={handleSave} className="mt-5">Save Preferences</Button>
              </Card>
            )}

            {activeTab === 'billing' && (
              <Card>
                <h2 className="text-lg font-semibold text-fg-primary mb-2">Billing & Plan</h2>
                <div className="rounded-xl p-5 text-white mb-5" style={{ background: 'linear-gradient(135deg, #162338 0%, #0F1A2E 100%)', border: '1px solid var(--accent-gold)', boxShadow: '0 4px 14px rgba(201,168,76,0.15)' }}>
                  <div className="text-xs font-medium text-white/60 mb-1 uppercase tracking-wide">Current Plan</div>
                  <div className="text-2xl font-bold mb-0.5" style={{ color: 'var(--accent-gold)' }}>Freelancer Free</div>
                  <div className="text-sm text-white/70">5 contracts / month · 1 user</div>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {[
                    { plan: 'Freelancer Pro', price: '₹499/mo', features: ['Unlimited contracts', 'Custom branding', 'WhatsApp share'] },
                    { plan: 'Agency', price: '₹1,499/mo', features: ['Everything in Pro', '5 team members', 'Priority support', 'API access'] },
                  ].map((p) => (
                    <div key={p.plan} className="border-2 border-border-col rounded-xl p-4 hover:border-[var(--accent-gold)] transition-colors">
                      <h3 className="font-semibold text-fg-primary">{p.plan}</h3>
                      <div className="text-2xl font-bold my-1" style={{ color: 'var(--accent-gold)' }}>{p.price}</div>
                      <ul className="space-y-1 mb-4">
                        {p.features.map((f) => (
                          <li key={f} className="text-xs text-fg-secondary flex items-center gap-1.5">
                            <Check size={11} className="text-brand-emerald-500 shrink-0" /> {f}
                          </li>
                        ))}
                      </ul>
                      <button className="w-full py-2 text-sm font-semibold rounded-lg btn-gold">Upgrade</button>
                    </div>
                  ))}
                </div>
              </Card>
            )}

            {activeTab === 'api' && (
              <Card>
                <h2 className="text-lg font-semibold text-fg-primary mb-2">API Access</h2>
                <p className="text-sm text-fg-secondary mb-5">Use the Contractly API to integrate with your apps.</p>
                <div className="rounded-xl p-4 font-mono text-sm text-green-400 mb-4 flex items-center justify-between gap-4" style={{ background: '#0A1222' }}>
                  <span className="truncate">cl_live_sk_••••••••••••••••••••••••••••••••</span>
                  <Button variant="secondary" size="xs">Reveal</Button>
                </div>
                <div className="flex gap-2">
                  <Button variant="secondary" size="sm">Regenerate Key</Button>
                  <Button variant="ghost" size="sm">View Docs →</Button>
                </div>
              </Card>
            )}

            {activeTab === 'signature' && (
              <Card>
                <h2 className="text-lg font-semibold text-fg-primary mb-2">Default Signature</h2>
                <p className="text-sm text-fg-secondary mb-5">Save your signature for quick insertion into contracts.</p>
                <div className="border-2 border-dashed border-border-col rounded-xl p-8 flex items-center justify-center bg-bg-secondary mb-4">
                  <p className="text-fg-secondary text-sm">No saved signature yet</p>
                </div>
                <Button variant="primary" icon={<PenLine size={14} />}>Draw Signature</Button>
              </Card>
            )}
          </div>
        </div>
      </div>
    </PageTransition>
  );
}
