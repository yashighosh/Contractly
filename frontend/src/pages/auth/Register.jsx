import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  CheckCircle2, Mail, Lock, User, UserCheck, 
  ArrowRight, ShieldCheck, Sparkles, Building2, 
  Globe, Users, MapPin, Briefcase 
} from 'lucide-react';
import { useAuthStore } from '../../store/authStore';
import { paymentService } from '../../services/paymentService';
import { toast } from 'react-hot-toast';

const C = {
  navy:   '#0B1629', mid: '#111F38', card: '#172035',
  border: '#1E2D45', gold: '#C9A84C', goldLt: '#E2C87A',
  goldDim:'rgba(201,168,76,0.08)', goldBorder:'rgba(201,168,76,0.5)',
  em:     '#0E9C78', tp: '#EDF0F7', ts: '#8896AD', tm: '#4A5A72',
  accent: '#6366f1', accentHover: '#4f46e5',
};

function LeftPanel() {
  return (
    <div className="hidden md:flex" style={{
      width:'40%', position:'relative', flexDirection:'column',
      background:`linear-gradient(135deg, ${C.navy} 0%, ${C.mid} 100%)`,
      overflow:'hidden',
    }}>
      <motion.div
        animate={{ scale: [1, 1.2, 1], opacity: [0.3, 0.5, 0.3], rotate: [0, 90, 0] }}
        transition={{ duration: 20, repeat: Infinity, ease: 'linear' }}
        style={{ position: 'absolute', top: '-10%', left: '-10%', width: '70%', height: '70%', borderRadius: '50%', background: 'radial-gradient(circle, rgba(201,168,76,0.15) 0%, transparent 70%)', filter: 'blur(60px)', pointerEvents: 'none' }}
      />
      <div style={{ position:'relative', zIndex:1, padding:'40px 48px' }}>
        <Link to="/" style={{ textDecoration:'none', display:'flex', alignItems:'center', gap:10 }}>
          <div style={{ width: 32, height: 32, borderRadius: 8, background: `linear-gradient(135deg, ${C.goldLt}, ${C.gold})`, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <span style={{ fontFamily:'Lora,Georgia,serif', fontSize:18, fontWeight:700, color:C.navy }}>C</span>
          </div>
          <span style={{ fontFamily:'Lora,Georgia,serif', fontSize:22, fontWeight:700, color:C.tp }}>Contractly</span>
        </Link>
      </div>
      <motion.div
        initial={{ opacity:0, y:30 }} animate={{ opacity:1, y:0 }} transition={{ duration:0.6, delay: 0.2 }}
        style={{ flex:1, display:'flex', flexDirection:'column', justifyContent:'center', padding:'0 48px 64px', position:'relative', zIndex:1 }}
      >
        <h2 style={{ fontFamily:'Lora,Georgia,serif', fontSize:42, fontWeight:600, color:C.tp, lineHeight:1.15, margin:'0 0 20px' }}>
          Scale your business with <span style={{ color:C.gold }}>confidence.</span>
        </h2>
        <p style={{ fontFamily:'DM Sans,sans-serif', fontSize:16, color:C.ts, marginBottom:40, lineHeight:1.6 }}>
          Join the most trusted platform for freelancers and agencies to manage contracts, signatures, and client relationships.
        </p>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
          {[
            { text: 'Legally valid e-signatures', icon: ShieldCheck },
            { text: 'Agency-level team management', icon: Users },
            { text: 'White-labeled documents', icon: Sparkles },
          ].map((f, i) => (
            <motion.div
              key={f.text}
              initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.4 + (i * 0.1) }}
              style={{ display:'flex', alignItems:'center', gap:12 }}
            >
              <div style={{ width: 24, height: 24, borderRadius: '50%', background: 'rgba(14,156,120,0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <f.icon size={14} style={{ color:C.em }} />
              </div>
              <span style={{ fontFamily:'DM Sans,sans-serif', fontSize:14, color:C.tp, fontWeight: 500 }}>{f.text}</span>
            </motion.div>
          ))}
        </div>
      </motion.div>
    </div>
  );
}

function AuthInput({ label, type='text', placeholder, icon:Icon, value, onChange, error }) {
  const [focused, setFocused] = useState(false);
  return (
    <div style={{ marginBottom: 20 }}>
      <label style={{ display:'block', fontFamily:'DM Sans,sans-serif', fontSize:13, fontWeight:500, color: focused ? C.tp : C.ts, marginBottom:8 }}>{label}</label>
      <div style={{ position:'relative' }}>
        <Icon size={18} style={{ position:'absolute', left:14, top:'50%', transform:'translateY(-50%)', color: focused ? C.gold : C.tm, pointerEvents:'none' }} />
        <input type={type} placeholder={placeholder} value={value} onChange={onChange}
          style={{ width:'100%', height:48, background: C.card, border:`1px solid ${error ? '#ef4444' : focused ? C.goldBorder : C.border}`, borderRadius:12, color:C.tp, fontFamily:'DM Sans,sans-serif', fontSize:15, paddingLeft:44, outline:'none', boxSizing:'border-box', transition:'all 0.2s' }}
          onFocus={() => setFocused(true)} onBlur={() => setFocused(false)}
        />
      </div>
    </div>
  );
}

export default function Register() {
  const navigate = useNavigate();
  const signup = useAuthStore((s) => s.signup);
  const [step, setStep] = useState(0);
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({
    fullName: '', email: '', password: '', confirmPassword: '',
    role: 'USER', // 'USER' for Freelancer, 'AGENCY' for Agency
    companyName: '', agencyWebsite: '', teamSize: '1-5', location: '',
    planId: 'AGENCY'
  });

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

  const handleAgencyPayment = async () => {
    const loadingToast = toast.loading('Preparing Agency Elite activation...');
    try {
      await loadRazorpayScript();
      
      // Create a temporary order for registration
      // Note: We're using a special 'AGENCY_SIGNUP' flow or just 'AGENCY'
      const order = await paymentService.createRegistrationOrder('AGENCY', form.email);
      
      const options = {
        key: import.meta.env.VITE_RAZORPAY_KEY_ID,
        amount: order.amount,
        currency: order.currency,
        name: 'Contractly Agency',
        description: 'Agency Elite Plan Activation',
        order_id: order.id,
        handler: async (response) => {
          try {
            toast.loading('Verifying activation...', { id: loadingToast });
            
            // We finalize registration AFTER payment verification
            await signup({
              ...form,
              paymentResponse: response
            });
            
            toast.success('Agency activated! Welcome to the Elite tier.', { id: loadingToast });
            navigate('/dashboard');
          } catch (err) {
            toast.error('Registration failed after payment. Please contact support.', { id: loadingToast });
          }
        },
        prefill: {
          name: form.fullName,
          email: form.email,
        },
        theme: {
          color: C.gold,
        },
        modal: {
          ondismiss: () => {
            setLoading(false);
            toast.dismiss(loadingToast);
          }
        }
      };

      const rzp = new window.Razorpay(options);
      rzp.on('payment.failed', (response) => {
        toast.error('Payment failed: ' + response.error.description);
        setLoading(false);
      });
      rzp.open();
    } catch (err) {
      toast.error('Failed to initiate payment. Please try again.', { id: loadingToast });
      setLoading(false);
    }
  };

  const set = (k) => (e) => setForm((f) => ({ ...f, [k]: e.target.value }));

  const handleNext = (e) => {
    e.preventDefault();
    if (!form.fullName || !form.email || !form.password) {
      return toast.error('Please fill in all basic details.');
    }
    if (form.password !== form.confirmPassword) {
      return toast.error('Passwords do not match.');
    }
    
    if (form.role === 'AGENCY') {
      setStep(1);
    } else {
      handleSignup();
    }
  };

  const handleSignup = async () => {
    setLoading(true);
    
    if (form.role === 'AGENCY') {
      return handleAgencyPayment();
    }

    try {
      await signup(form);
      toast.success('Account created! Welcome aboard.');
      navigate('/dashboard');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Registration failed.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ display:'flex', height:'100vh', background:C.navy, overflow:'hidden' }}>
      <LeftPanel />
      <div style={{ flex:1, display:'flex', alignItems:'center', justifyContent:'center', background:`radial-gradient(circle at center, ${C.mid} 0%, ${C.navy} 100%)`, padding:'24px 32px', overflowY:'auto' }}>
        <motion.div
          initial={{ opacity:0, y:20 }} animate={{ opacity:1, y:0 }}
          style={{ width:'100%', maxWidth: step === 0 ? 460 : 540 }}
        >
          <div style={{ background: 'rgba(23,32,53,0.6)', border: `1px solid ${C.border}`, borderRadius: 24, padding: '40px', backdropFilter: 'blur(20px)', boxShadow: '0 24px 48px rgba(0,0,0,0.2)' }}>
            <AnimatePresence mode="wait">
              {step === 0 ? (
                <motion.div key="step0" initial={{ opacity:0, x:-20 }} animate={{ opacity:1, x:0 }} exit={{ opacity:0, x:20 }}>
                  <div style={{ marginBottom: 32, textAlign: 'center' }}>
                    <h1 style={{ fontFamily:'Lora,Georgia,serif', fontSize:32, fontWeight:600, color:C.tp, margin:'0 0 8px' }}>Create account</h1>
                    <p style={{ fontFamily:'DM Sans,sans-serif', fontSize:15, color:C.ts, margin:0 }}>Join Contractly to start managing contracts</p>
                  </div>

                  <form onSubmit={handleNext}>
                    <AuthInput label="Full Name" placeholder="e.g. Anik Das" icon={User} value={form.fullName} onChange={set('fullName')} />
                    <AuthInput label="Email address" type="email" placeholder="you@example.com" icon={Mail} value={form.email} onChange={set('email')} />
                    
                    <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:16 }}>
                      <AuthInput label="Password" type="password" placeholder="••••••••" icon={Lock} value={form.password} onChange={set('password')} />
                      <AuthInput label="Confirm" type="password" placeholder="••••••••" icon={Lock} value={form.confirmPassword} onChange={set('confirmPassword')} />
                    </div>

                    <div style={{ marginBottom: 32 }}>
                      <label style={{ display:'block', fontFamily:'DM Sans,sans-serif', fontSize:13, fontWeight:500, color: C.ts, marginBottom:12 }}>I am a...</label>
                      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
                        {[
                          { id: 'USER', label: 'Freelancer', desc: 'Solo creator or developer', icon: UserCheck },
                          { id: 'AGENCY', label: 'Agency', desc: 'Team of 2+ with clients', icon: Building2 },
                        ].map((opt) => (
                          <button
                            key={opt.id} type="button" onClick={() => setForm(f => ({ ...f, role: opt.id }))}
                            style={{ 
                              display:'flex', flexDirection:'column', gap:8, padding:16, textAlign:'left',
                              background: form.role === opt.id ? 'rgba(201,168,76,0.1)' : 'rgba(255,255,255,0.02)',
                              border: `1px solid ${form.role === opt.id ? C.gold : C.border}`,
                              borderRadius: 12, cursor: 'pointer', transition: 'all 0.2s'
                            }}
                          >
                            <opt.icon size={20} style={{ color: form.role === opt.id ? C.gold : C.ts }} />
                            <div>
                              <div style={{ fontSize:14, fontWeight:600, color:C.tp }}>{opt.label}</div>
                              <div style={{ fontSize:11, color:C.ts }}>{opt.desc}</div>
                            </div>
                          </button>
                        ))}
                      </div>
                    </div>

                    <motion.button
                      whileHover={{ scale: 1.01 }} whileTap={{ scale: 0.98 }}
                      type="submit" disabled={loading}
                      style={{ width:'100%', height:48, background: `linear-gradient(135deg, ${C.goldLt}, ${C.gold})`, color: C.navy, fontFamily:'DM Sans,sans-serif', fontSize:16, fontWeight:700, border:'none', borderRadius:12, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8 }}
                    >
                      {form.role === 'AGENCY' ? <>Next Step <ArrowRight size={18} /></> : <>Create Free Account <ArrowRight size={18} /></>}
                    </motion.button>
                  </form>
                </motion.div>
              ) : (
                <motion.div key="step1" initial={{ opacity:0, x:20 }} animate={{ opacity:1, x:0 }} exit={{ opacity:0, x:-20 }}>
                  <button onClick={() => setStep(0)} style={{ background:'none', border:'none', color:C.goldLt, fontSize:13, fontWeight:600, cursor:'pointer', marginBottom:20, display:'flex', alignItems:'center', gap:6 }}>
                    <ArrowRight size={14} style={{ transform: 'rotate(180deg)' }} /> Back to basic info
                  </button>
                  <div style={{ marginBottom: 32 }}>
                    <h2 style={{ fontFamily:'Lora,Georgia,serif', fontSize:28, fontWeight:600, color:C.tp, margin:'0 0 8px' }}>Agency Profile</h2>
                    <p style={{ fontFamily:'DM Sans,sans-serif', fontSize:14, color:C.ts, margin:0 }}>Tell us more about your agency to set up your team account.</p>
                  </div>

                  <form onSubmit={(e) => { e.preventDefault(); handleSignup(); }}>
                    <AuthInput label="Agency Name" placeholder="e.g. Pixel Perfect Studios" icon={Briefcase} value={form.companyName} onChange={set('companyName')} />
                    <AuthInput label="Agency Website" placeholder="www.youragency.com" icon={Globe} value={form.agencyWebsite} onChange={set('agencyWebsite')} />
                    
                    <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:16, marginBottom: 24 }}>
                      <div>
                        <label style={{ display:'block', fontFamily:'DM Sans,sans-serif', fontSize:13, fontWeight:500, color: C.ts, marginBottom:8 }}>Team Size</label>
                        <select 
                          value={form.teamSize} onChange={set('teamSize')}
                          style={{ width:'100%', height:48, background: C.card, border:`1px solid ${C.border}`, borderRadius:12, color:C.tp, fontFamily:'DM Sans,sans-serif', fontSize:15, padding:'0 16px', outline:'none' }}
                        >
                          <option value="1-5">1-5 Members</option>
                          <option value="6-20">6-20 Members</option>
                          <option value="21-50">21-50 Members</option>
                          <option value="50+">50+ Members</option>
                        </select>
                      </div>
                      <AuthInput label="Location" placeholder="e.g. London, UK" icon={MapPin} value={form.location} onChange={set('location')} />
                    </div>

                    <div style={{ background: 'rgba(201,168,76,0.05)', border: `1px solid ${C.goldBorder}`, borderRadius: 16, padding: 20, marginBottom: 32 }}>
                      <div style={{ display: 'flex', gap: 12 }}>
                        <div style={{ width: 40, height: 40, borderRadius: 12, background: C.goldDim, display: 'flex', alignItems: 'center', justifyContent: 'center', shrink: 0 }}>
                          <ShieldCheck size={20} style={{ color: C.gold }} />
                        </div>
                        <div>
                          <div style={{ fontSize:14, fontWeight:600, color:C.tp, marginBottom:4 }}>Agency Elite Plan</div>
                          <div style={{ fontSize:12, color:C.ts, lineHeight: 1.4 }}>Agencies start on our Elite tier. You'll have access to unlimited contracts and team collaboration tools.</div>
                        </div>
                      </div>
                    </div>

                    <motion.button
                      whileHover={{ scale: 1.01 }} whileTap={{ scale: 0.98 }}
                      type="submit" disabled={loading}
                      style={{ width:'100%', height:48, background: `linear-gradient(135deg, ${C.goldLt}, ${C.gold})`, color: C.navy, fontFamily:'DM Sans,sans-serif', fontSize:16, fontWeight:700, border:'none', borderRadius:12, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8 }}
                    >
                      {loading ? 'Creating Account...' : <>Complete Registration <ArrowRight size={18} /></>}
                    </motion.button>
                  </form>
                </motion.div>
              )}
            </AnimatePresence>

            <div style={{ marginTop: 32, paddingTop: 24, borderTop: `1px solid rgba(255,255,255,0.05)`, textAlign: 'center' }}>
              <p style={{ fontFamily:'DM Sans,sans-serif', fontSize:14, color:C.ts, margin:0 }}>
                Already have an account?{' '}
                <Link to="/login" style={{ color:C.goldLt, textDecoration:'none', fontWeight:600 }}>Sign in</Link>
              </p>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
