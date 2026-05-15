import { useState, useEffect } from 'react';
import { User, Building2, Bell, PenLine, CreditCard, Save, Check, X, Shield, Zap, Globe, ArrowRight, Download, History, BarChart3, Clock, LogOut } from 'lucide-react';
import { PageTransition } from '../components/ui/PageTransition';
import { Button } from '../components/ui/Button';
import { Input } from '../components/ui/Input';
import { Card } from '../components/ui/Card';
import { Divider } from '../components/ui/Divider';
import { Avatar } from '../components/ui/Avatar';
import { useAuthStore } from '../store/authStore';
import { paymentService } from '../services/paymentService';
import { cn } from '../utils/cn';
import { toast } from 'react-hot-toast';
import { useSearchParams, useNavigate } from 'react-router-dom';

const TABS = [
  { id: 'profile',       label: 'Profile',      icon: User },
  { id: 'business',      label: 'Business',      icon: Building2 },
  { id: 'notifications', label: 'Notifications', icon: Bell },
  { id: 'signature',     label: 'Signature',     icon: PenLine },
  { id: 'billing',       label: 'Billing',       icon: CreditCard },
];

const NOTIFICATION_OPTS = [
  { key: 'signed',   label: 'Contract signed',   desc: 'Get notified when a client signs your contract' },
  { key: 'viewed',   label: 'Contract viewed',   desc: 'Know when your client opens the contract' },
  { key: 'expiring', label: 'Contract expiring', desc: 'Alert 7 days before a contract expires' },
  { key: 'overdue',  label: 'Payment overdue',   desc: 'Remind clients about overdue payments' },
];

export default function Settings() {
  const { user, updateUser, logout } = useAuthStore();
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();
  const activeTab = searchParams.get('tab') || 'profile';
  const [showPricing, setShowPricing] = useState(false);

  const loadRazorpayScript = () => {
    return new Promise((resolve, reject) => {
      if (window.Razorpay) return resolve(true);
      const script = document.createElement('script');
      script.src = 'https://checkout.razorpay.com/v1/checkout.js';
      script.onload = () => resolve(true);
      script.onerror = () => reject(new Error('Razorpay SDK failed to load'));
      document.body.appendChild(script);
    });
  };

  const handleUpgrade = async (planId) => {
    if (planId === 'FREE') return;
    
    const loadingToast = toast.loading(`Preparing ${planId} upgrade...`);
    
    try {
      await loadRazorpayScript();
      const order = await paymentService.createOrder(planId);
      
      const options = {
        key: import.meta.env.VITE_RAZORPAY_KEY_ID,
        amount: order.amount,
        currency: order.currency,
        name: 'Contractly',
        description: `${planId} Plan Subscription`,
        order_id: order.id,
        handler: async (response) => {
          try {
            toast.loading('Verifying payment...', { id: loadingToast });
            await paymentService.verifyPayment({
              ...response,
              planId
            });
            toast.success(`Welcome to ${planId}! Your plan has been updated.`, { id: loadingToast });
            updateUser({ plan: planId });
            setShowPricing(false);
          } catch (err) {
            toast.error('Payment verification failed. Please contact support.', { id: loadingToast });
          }
        },
        prefill: {
          name: user?.fullName,
          email: user?.email,
        },
        theme: {
          color: '#C9A84C',
        },
      };

      const rzp = new window.Razorpay(options);
      rzp.on('payment.failed', (response) => {
        toast.error('Payment failed: ' + response.error.description);
      });
      rzp.open();
      toast.dismiss(loadingToast);
    } catch (err) {
      toast.error('Failed to initiate payment. Please try again.', { id: loadingToast });
    }
  };
  
  const [notifs, setNotifs] = useState({ signed: true, viewed: true, expiring: true, overdue: false });
  const [saving, setSaving] = useState(false);

  const handleSave = async () => {
    setSaving(true);
    await new Promise((r) => setTimeout(r, 800));
    setSaving(false);
    toast.success('Settings saved!');
  };

  const handleLogout = () => {
    logout();
    localStorage.removeItem('auth-storage');
    window.location.href = '/login';
  };

  return (
    <PageTransition>
      <div className="p-6 lg:p-8 max-w-[1200px] mx-auto w-full">
        <div className="flex gap-6">
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
              <div className="space-y-6">
                {!showPricing ? (
                  <>
                    <Card>
                      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-6">
                        <div className="flex items-center gap-4">
                          <div className="w-12 h-12 rounded-xl bg-accent-gold/10 flex items-center justify-center text-accent-gold">
                            <Zap size={24} />
                          </div>
                          <div>
                            <h2 className="text-lg font-semibold text-fg-primary">Freelancer Free</h2>
                            <p className="text-sm text-fg-secondary">Your plan will renew on June 14, 2026</p>
                          </div>
                        </div>
                        <Button 
                          variant="primary" 
                          onClick={() => setShowPricing(true)}
                          className="sm:w-auto w-full"
                        >
                          Upgrade Plan
                        </Button>
                      </div>
                    </Card>

                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                      <Card className="lg:col-span-2">
                        <div className="flex items-center gap-2 mb-6">
                          <BarChart3 size={18} className="text-accent-gold" />
                          <h3 className="font-semibold text-fg-primary">Usage Limits</h3>
                        </div>
                        
                        <div className="space-y-6">
                          <div>
                            <div className="flex justify-between text-sm mb-2">
                              <span className="text-fg-secondary">Monthly Contracts</span>
                              <span className="font-medium text-fg-primary">3 / 5</span>
                            </div>
                            <div className="h-2 bg-bg-secondary rounded-full overflow-hidden">
                              <div className="h-full bg-accent-gold rounded-full" style={{ width: '60%' }} />
                            </div>
                          </div>

                          <div>
                            <div className="flex justify-between text-sm mb-2">
                              <span className="text-fg-secondary">Team Members</span>
                              <span className="font-medium text-fg-primary">1 / 1</span>
                            </div>
                            <div className="h-2 bg-bg-secondary rounded-full overflow-hidden">
                              <div className="h-full bg-emerald-500 rounded-full" style={{ width: '100%' }} />
                            </div>
                          </div>

                          <div className="p-4 rounded-xl bg-accent-gold/5 border border-accent-gold/10">
                            <p className="text-xs text-accent-gold leading-relaxed">
                              <strong>Pro Tip:</strong> Upgrading to Pro gives you unlimited contracts and custom branding for your documents.
                            </p>
                          </div>
                        </div>
                      </Card>

                      <Card>
                        <div className="flex items-center gap-2 mb-6">
                          <Clock size={18} className="text-accent-gold" />
                          <h3 className="font-semibold text-fg-primary">Billing Cycle</h3>
                        </div>
                        <div className="text-center py-4">
                          <div className="text-3xl font-bold text-fg-primary mb-1">28</div>
                          <div className="text-xs text-fg-secondary uppercase tracking-widest">Days Remaining</div>
                        </div>
                        <Divider className="my-4" />
                        <div className="space-y-3">
                          <div className="flex justify-between text-xs">
                            <span className="text-fg-secondary">Next Payment</span>
                            <span className="text-fg-primary font-medium">₹0.00</span>
                          </div>
                          <div className="flex justify-between text-xs">
                            <span className="text-fg-secondary">Payment Method</span>
                            <span className="text-fg-primary font-medium">None</span>
                          </div>
                        </div>
                      </Card>
                    </div>

                    <Card>
                      <div className="flex items-center justify-between mb-6">
                        <div className="flex items-center gap-2">
                          <History size={18} className="text-accent-gold" />
                          <h3 className="font-semibold text-fg-primary">Billing History</h3>
                        </div>
                        <Button variant="ghost" size="sm">View All</Button>
                      </div>
                      
                      <div className="flex flex-col items-center justify-center py-8 px-4 text-center border border-dashed border-border-col rounded-xl bg-bg-secondary/30">
                        <div className="w-12 h-12 rounded-full bg-slate-800 flex items-center justify-center mb-4">
                          <CreditCard size={20} className="text-slate-400" />
                        </div>
                        <h4 className="text-sm font-medium text-fg-primary mb-1">No billing history yet</h4>
                        <p className="text-xs text-fg-secondary max-w-[280px]">
                          You are currently on the <span className="text-accent-gold font-medium">Free Plan</span>. Invoices are generated when you upgrade to a paid subscription.
                        </p>
                      </div>
                    </Card>
                  </>
                ) : (
                  <>
                    <div className="flex items-center justify-between mb-2">
                      <div>
                        <Button variant="ghost" size="sm" onClick={() => setShowPricing(false)} className="-ml-3 mb-2">
                          ← Back to Billing
                        </Button>
                        <h2 className="text-2xl font-bold text-fg-primary">Choose Your Plan</h2>
                        <p className="text-sm text-fg-secondary">Scale your business with the right tools.</p>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-4">
                      {[
                        {
                          name: 'Freelancer Free',
                          price: '₹0',
                          period: 'forever',
                          desc: 'Perfect for getting started',
                          features: ['5 contracts / month', '1 user license', 'Standard templates', 'Basic e-Signatures'],
                          button: 'Current Plan',
                          disabled: true,
                        },
                        {
                          name: 'Freelancer Pro',
                          price: '₹499',
                          period: 'per month',
                          desc: 'For serious professionals',
                          features: ['Unlimited contracts', 'Custom branding', 'WhatsApp share', 'Cloud backups', '48h email support'],
                          button: 'Upgrade to Pro',
                          highlight: true,
                          action: () => handleUpgrade('PRO')
                        },
                        {
                          name: 'Agency Plus',
                          price: '₹1,499',
                          period: 'per month',
                          desc: 'The complete agency solution',
                          features: ['Everything in Pro', '5 team members', 'Custom domain', 'Priority support', 'Team collaboration'],
                          button: 'Upgrade to Agency',
                          action: () => handleUpgrade('AGENCY')
                        }
                      ].map((p) => (
                        <div key={p.name} className={cn(
                          "relative flex flex-col p-6 rounded-2xl border-2 transition-all duration-300",
                          p.highlight 
                            ? "bg-[#162338] border-[var(--accent-gold)] shadow-[0_8px_30px_rgb(201,168,76,0.15)]" 
                            : "bg-bg-card border-border-col hover:border-slate-700"
                        )}>
                          {p.highlight && (
                            <div className="absolute -top-3 left-1/2 -translate-x-1/2 px-3 py-1 bg-[var(--accent-gold)] text-[#0F1A2E] text-[10px] font-bold uppercase tracking-wider rounded-full">
                              Most Popular
                            </div>
                          )}
                          <h3 className="text-lg font-bold text-fg-primary mb-1">{p.name}</h3>
                          <p className="text-xs text-fg-secondary mb-4">{p.desc}</p>
                          <div className="flex items-baseline gap-1 mb-6">
                            <span className="text-3xl font-bold text-fg-primary">{p.price}</span>
                            <span className="text-sm text-fg-secondary">/{p.period}</span>
                          </div>
                          <ul className="flex-1 space-y-3 mb-8">
                            {p.features.map((f) => (
                              <li key={f} className="text-xs text-fg-secondary flex items-start gap-2.5">
                                <Check size={14} className="text-emerald-500 shrink-0 mt-0.5" />
                                <span>{f}</span>
                              </li>
                            ))}
                          </ul>
                          <button 
                            disabled={p.disabled}
                            onClick={p.action}
                            className={cn(
                              "w-full py-2.5 rounded-xl text-sm font-bold transition-all",
                              p.highlight 
                                ? "btn-gold" 
                                : "bg-bg-secondary text-fg-primary border border-border-col hover:bg-bg-tertiary"
                            )}
                          >
                            {p.button}
                          </button>
                        </div>
                      ))}
                    </div>

                    <Card className="mt-8">
                      <h3 className="text-base font-semibold text-fg-primary mb-6">Feature Comparison</h3>
                      <div className="overflow-x-auto">
                        <table className="w-full text-left text-sm">
                          <thead>
                            <tr className="border-b border-border-col">
                              <th className="py-4 font-medium text-fg-secondary">Features</th>
                              <th className="py-4 font-medium text-center text-fg-primary">Free</th>
                              <th className="py-4 font-medium text-center text-fg-primary">Pro</th>
                              <th className="py-4 font-medium text-center text-fg-primary">Agency Elite</th>
                            </tr>
                          </thead>
                          <tbody className="divide-y divide-border-col/50">
                            {[
                              { name: 'Monthly Contracts', free: '5', pro: 'Unlimited', agency: 'Unlimited' },
                              { name: 'Custom Branding', free: false, pro: true, agency: true },
                              { name: 'WhatsApp Integration', free: false, pro: true, agency: true },
                              { name: 'Team Members', free: '1', pro: '1', agency: 'Up to 5' },
                              { name: 'Priority Support', free: false, pro: false, agency: true },
                              { name: 'Custom Domain', free: false, pro: false, agency: true },
                              { name: 'API Access', free: false, pro: false, agency: true },
                            ].map((row) => (
                              <tr key={row.name} className="hover:bg-white/[0.02] transition-colors">
                                <td className="py-4 text-fg-secondary">{row.name}</td>
                                <td className="py-4 text-center">
                                  {typeof row.free === 'string' ? row.free : row.free ? <Check size={16} className="mx-auto text-emerald-500" /> : <X size={16} className="mx-auto text-slate-600" />}
                                </td>
                                <td className="py-4 text-center">
                                  {typeof row.pro === 'string' ? row.pro : row.pro ? <Check size={16} className="mx-auto text-emerald-500" /> : <X size={16} className="mx-auto text-slate-600" />}
                                </td>
                                <td className="py-4 text-center text-fg-primary font-medium">
                                  {typeof row.agency === 'string' ? row.agency : row.agency ? <Check size={16} className="mx-auto text-emerald-500" /> : <X size={16} className="mx-auto text-slate-600" />}
                                </td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    </Card>
                  </>
                )}
              </div>
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
