import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { CheckCircle2, Mail, Lock, Eye, EyeOff, ArrowRight, ShieldCheck, Sparkles } from 'lucide-react';
import { useAuthStore } from '../../store/authStore';

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
      width:'45%', position:'relative', flexDirection:'column',
      background:`linear-gradient(135deg, ${C.navy} 0%, ${C.mid} 100%)`,
      overflow:'hidden',
    }}>
      {/* Animated glowing orbs in background */}
      <motion.div
        animate={{ scale: [1, 1.2, 1], opacity: [0.3, 0.5, 0.3], rotate: [0, 90, 0] }}
        transition={{ duration: 20, repeat: Infinity, ease: 'linear' }}
        style={{ position: 'absolute', top: '-10%', left: '-10%', width: '70%', height: '70%', borderRadius: '50%', background: 'radial-gradient(circle, rgba(201,168,76,0.15) 0%, transparent 70%)', filter: 'blur(60px)', pointerEvents: 'none' }}
      />
      <motion.div
        animate={{ scale: [1, 1.3, 1], opacity: [0.2, 0.4, 0.2], x: [0, 50, 0], y: [0, 50, 0] }}
        transition={{ duration: 15, repeat: Infinity, ease: 'easeInOut' }}
        style={{ position: 'absolute', bottom: '-20%', right: '-20%', width: '80%', height: '80%', borderRadius: '50%', background: 'radial-gradient(circle, rgba(14,156,120,0.1) 0%, transparent 70%)', filter: 'blur(80px)', pointerEvents: 'none' }}
      />

      <div style={{ position:'relative', zIndex:1, padding:'40px 48px' }}>
        <Link to="/" style={{ textDecoration:'none', display:'flex', alignItems:'center', gap:10 }}>
          <div style={{ width: 32, height: 32, borderRadius: 8, background: `linear-gradient(135deg, ${C.goldLt}, ${C.gold})`, display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: '0 4px 12px rgba(201,168,76,0.3)' }}>
            <span style={{ fontFamily:'Lora,Georgia,serif', fontSize:18, fontWeight:700, color:C.navy }}>C</span>
          </div>
          <span style={{ fontFamily:'Lora,Georgia,serif', fontSize:22, fontWeight:700, color:C.tp, letterSpacing: '-0.5px' }}>Contractly</span>
        </Link>
      </div>
      <motion.div
        initial={{ opacity:0, y:30 }} animate={{ opacity:1, y:0 }} transition={{ duration:0.6, delay: 0.2, ease:[0.22, 1, 0.36, 1] }}
        style={{ flex:1, display:'flex', flexDirection:'column', justifyContent:'center', padding:'0 48px 64px', position:'relative', zIndex:1 }}
      >
        <div style={{ display: 'inline-flex', alignItems: 'center', gap: 6, padding: '6px 12px', background: 'rgba(255,255,255,0.05)', borderRadius: 20, border: '1px solid rgba(255,255,255,0.1)', marginBottom: 24, backdropFilter: 'blur(10px)', width: 'fit-content' }}>
          <Sparkles size={14} style={{ color: C.goldLt }} />
          <span style={{ fontFamily: 'DM Sans,sans-serif', fontSize: 12, fontWeight: 600, color: C.tp, letterSpacing: '0.5px', textTransform: 'uppercase' }}>Trusted Platform</span>
        </div>
        <h2 style={{ fontFamily:'Lora,Georgia,serif', fontSize:42, fontWeight:600, color:C.tp, lineHeight:1.15, margin:'0 0 20px', letterSpacing: '-1px' }}>
          Your contracts.<br/>Your terms.<br/>
          <span style={{ position: 'relative', display: 'inline-block' }}>
            <em style={{ color:C.gold, fontStyle:'italic', position: 'relative', zIndex: 1 }}>Your protection.</em>
            <motion.span
              initial={{ width: 0 }} animate={{ width: '100%' }} transition={{ duration: 0.8, delay: 0.8, ease: 'easeOut' }}
              style={{ position: 'absolute', bottom: 4, left: 0, height: 8, background: 'rgba(201,168,76,0.2)', zIndex: 0, borderRadius: 4 }}
            />
          </span>
        </h2>
        <p style={{ fontFamily:'DM Sans,sans-serif', fontSize:16, color:C.ts, marginBottom:40, lineHeight:1.6, maxWidth: 400 }}>
          Join thousands of modern freelancers securely closing projects and managing their business with confidence.
        </p>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 20, marginBottom: 48 }}>
          {[
            { text: 'Legally valid e-signatures', icon: ShieldCheck },
            { text: '20+ ready templates', icon: CheckCircle2 },
            { text: 'Audit trail on every contract', icon: CheckCircle2 },
            { text: 'Free for 3 contracts', icon: CheckCircle2 }
          ].map((f, i) => (
            <motion.div
              key={f.text}
              initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.4, delay: 0.4 + (i * 0.1) }}
              style={{ display:'flex', alignItems:'center', gap:12 }}
            >
              <div style={{ width: 24, height: 24, borderRadius: '50%', background: 'rgba(14,156,120,0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <f.icon size={14} style={{ color:C.em }} />
              </div>
              <span style={{ fontFamily:'DM Sans,sans-serif', fontSize:14, color:C.tp, fontWeight: 500 }}>{f.text}</span>
            </motion.div>
          ))}
        </div>

        <div style={{ display:'flex', alignItems:'center', gap:16, padding: '20px', background: 'rgba(255,255,255,0.02)', borderRadius: 16, border: '1px solid rgba(255,255,255,0.05)', backdropFilter: 'blur(10px)' }}>
          <div style={{ display:'flex' }}>
            {[['DM','#4F46E5'],['PK','#0E9470'],['SR','#C9A84C'], ['+2k', '#1E2D45']].map(([init,bg],i) => (
              <motion.div
                whileHover={{ y: -4, zIndex: 10 }}
                key={init}
                style={{ width:36, height:36, borderRadius:'50%', background:bg, border:`2px solid ${C.mid}`, marginLeft:i?-12:0, display:'flex', alignItems:'center', justifyContent:'center', fontFamily:'DM Sans,sans-serif', fontSize:12, fontWeight:700, color: init === '+2k' ? C.tp : '#fff', boxShadow: '0 4px 10px rgba(0,0,0,0.2)', position: 'relative', cursor: 'pointer', transition: 'z-index 0s' }}
              >
                {init}
              </motion.div>
            ))}
          </div>
          <div>
            <div style={{ display: 'flex', gap: 2, marginBottom: 4 }}>
              {[1,2,3,4,5].map(star => <svg key={star} width="12" height="12" viewBox="0 0 24 24" fill={C.gold}><path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/></svg>)}
            </div>
            <span style={{ fontFamily:'DM Sans,sans-serif', fontSize:13, color:C.ts, fontWeight: 500 }}>Loved by 2,000+ freelancers</span>
          </div>
        </div>
      </motion.div>
    </div>
  );
}

function AuthInput({ label, type='text', placeholder, icon:Icon, right, value, onChange }) {
  const [focused, setFocused] = useState(false);
  return (
    <div style={{ marginBottom: label ? 20 : 0 }}>
      {label && <label style={{ display:'block', fontFamily:'DM Sans,sans-serif', fontSize:13, fontWeight:500, color: focused ? C.tp : C.ts, marginBottom:8, transition: 'color 0.2s' }}>{label}</label>}
      <div style={{ position:'relative' }}>
        <Icon size={18} style={{ position:'absolute', left:14, top:'50%', transform:'translateY(-50%)', color: focused ? C.gold : C.tm, pointerEvents:'none', transition: 'color 0.2s' }} />
        <input type={type} placeholder={placeholder} value={value} onChange={onChange}
          style={{ width:'100%', height:48, background: focused ? 'rgba(23,32,53,0.8)' : C.card, border:`1px solid ${focused ? C.goldBorder : C.border}`, borderRadius:12, color:C.tp, fontFamily:'DM Sans,sans-serif', fontSize:15, paddingLeft:44, paddingRight: right ? 44 : 16, outline:'none', boxSizing:'border-box', transition:'all 0.2s', boxShadow: focused ? '0 0 0 4px rgba(201,168,76,0.1)' : 'none' }}
          onFocus={() => setFocused(true)}
          onBlur={() => setFocused(false)}
        />
        {right}
      </div>
    </div>
  );
}

export default function Login() {
  const navigate        = useNavigate();
  const login           = useAuthStore((s) => s.login);
  const [form, setForm] = useState({ email:'', password:'' });
  const [showPw, setShowPw] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError]   = useState('');

  const set = (k) => (e) => setForm((f) => ({ ...f, [k]: e.target.value }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      await login(form);
      navigate('/dashboard');
    } catch (err) {
      if (!err.response) {
        setError('Network Error');
      } else if (err.response?.status === 401) {
        setError('Incorrect email or password.');
      } else if (err.response?.status === 404) {
        setError('No account found with this email.');
      } else if (err.response?.status >= 500) {
        setError('Server error. Please try again in a moment.');
      } else {
        setError(err.response?.data?.message || err.message || 'Sign in failed.');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ display:'flex', height:'100vh', background:C.navy, overflow:'hidden' }}>
      <LeftPanel />
      <div style={{ flex:1, display:'flex', alignItems:'center', justifyContent:'center', background:`radial-gradient(circle at center, ${C.mid} 0%, ${C.navy} 100%)`, padding:'24px 32px', overflowY:'auto', position: 'relative' }}>
        {/* Subtle grid background for the right panel */}
        <div style={{ position: 'absolute', inset: 0, backgroundImage: 'linear-gradient(rgba(255,255,255,0.02) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.02) 1px, transparent 1px)', backgroundSize: '40px 40px', pointerEvents: 'none' }} />

        <motion.div
          initial={{ opacity:0, y:20 }} animate={{ opacity:1, y:0 }} transition={{ duration:0.5, ease:[0.22, 1, 0.36, 1] }}
          style={{ width:'100%', maxWidth:440, position: 'relative', zIndex: 10 }}
        >
          {/* Mobile logo */}
          <div className="md:hidden" style={{ display:'flex', alignItems:'center', gap:10, marginBottom:40, justifyContent: 'center' }}>
            <div style={{ width: 32, height: 32, borderRadius: 8, background: `linear-gradient(135deg, ${C.goldLt}, ${C.gold})`, display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: '0 4px 12px rgba(201,168,76,0.3)' }}>
              <span style={{ fontFamily:'Lora,Georgia,serif', fontSize:18, fontWeight:700, color:C.navy }}>C</span>
            </div>
            <span style={{ fontFamily:'Lora,Georgia,serif', fontSize:24, fontWeight:700, color:C.tp, letterSpacing: '-0.5px' }}>Contractly</span>
          </div>

          <div style={{ background: 'rgba(23,32,53,0.6)', border: `1px solid rgba(255,255,255,0.05)`, borderRadius: 24, padding: '48px', backdropFilter: 'blur(20px)', boxShadow: '0 24px 48px rgba(0,0,0,0.2)' }}>
            <div style={{ marginBottom: 32, textAlign: 'center' }}>
              <motion.div
                initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} transition={{ duration: 0.5, delay: 0.1 }}
                style={{ width: 56, height: 56, borderRadius: 16, background: 'rgba(201,168,76,0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 20px', border: '1px solid rgba(201,168,76,0.2)' }}
              >
                <Lock size={28} style={{ color: C.goldLt }} />
              </motion.div>
              <h1 style={{ fontFamily:'Lora,Georgia,serif', fontSize:32, fontWeight:600, color:C.tp, margin:'0 0 8px', letterSpacing: '-0.5px' }}>Welcome back</h1>
              <p style={{ fontFamily:'DM Sans,sans-serif', fontSize:15, color:C.ts, margin:0 }}>Sign in to continue to your dashboard</p>
            </div>

            <AnimatePresence>
              {error && (
                <motion.div
                  initial={{ opacity: 0, height: 0, marginBottom: 0 }} animate={{ opacity: 1, height: 'auto', marginBottom: 24 }} exit={{ opacity: 0, height: 0, marginBottom: 0 }}
                  style={{ overflow: 'hidden' }}
                >
                  <div style={{
                    background:'rgba(220,38,38,0.1)', border:'1px solid rgba(220,38,38,0.2)',
                    borderRadius:12, padding:'14px 16px',
                    display:'flex', alignItems:'flex-start', gap:12,
                  }}>
                    <span style={{ fontSize:18, flexShrink:0, marginTop: 2 }}>⚠️</span>
                    <div>
                      <p style={{ fontFamily:'DM Sans,sans-serif', fontSize:14, fontWeight:600, color:'#FCA5A5', margin:'0 0 4px' }}>
                        {error === 'Network Error' ? 'Connection Issue' : 'Authentication Failed'}
                      </p>
                      <p style={{ fontFamily:'DM Sans,sans-serif', fontSize:13, color:'#F87171', margin:0, opacity:0.9, lineHeight: 1.5 }}>
                        {error === 'Network Error' ? 'Unable to connect to the server. Please try again later.' : error}
                      </p>
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            <form onSubmit={handleSubmit}>
              <AuthInput label="Email address" type="email" placeholder="you@example.com" icon={Mail} value={form.email} onChange={set('email')} />

              <div style={{ marginBottom:32 }}>
                <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center', marginBottom:8 }}>
                  <label style={{ fontFamily:'DM Sans,sans-serif', fontSize:13, fontWeight:500, color:C.ts }}>Password</label>
                  <Link to="/forgot-password" style={{ fontFamily:'DM Sans,sans-serif', fontSize:13, fontWeight: 500, color:C.goldLt, textDecoration:'none', transition: 'color 0.2s' }} onMouseEnter={e=>e.target.style.color=C.gold} onMouseLeave={e=>e.target.style.color=C.goldLt}>Forgot password?</Link>
                </div>
                <div style={{ position:'relative' }}>
                  <AuthInput
                    label=""
                    type={showPw ? 'text' : 'password'}
                    placeholder="••••••••"
                    icon={Lock}
                    value={form.password}
                    onChange={set('password')}
                    right={
                      <button type="button" onClick={() => setShowPw(!showPw)}
                        style={{ position:'absolute', right:16, top:'50%', transform:'translateY(-50%)', background:'none', border:'none', cursor:'pointer', color:C.tm, display:'flex', padding:4, borderRadius: 6, transition: 'all 0.2s' }}
                        onMouseEnter={e=>{e.currentTarget.style.color=C.ts; e.currentTarget.style.background='rgba(255,255,255,0.05)'}}
                        onMouseLeave={e=>{e.currentTarget.style.color=C.tm; e.currentTarget.style.background='none'}}
                      >
                        {showPw ? <EyeOff size={18} /> : <Eye size={18} />}
                      </button>
                    }
                  />
                </div>
              </div>

              <motion.button
                whileHover={{ scale: 1.01 }} whileTap={{ scale: 0.98 }}
                type="submit" disabled={loading}
                style={{ width:'100%', height:48, background: loading ? C.border : `linear-gradient(135deg, ${C.goldLt}, ${C.gold})`, color: loading ? C.ts : C.navy, fontFamily:'DM Sans,sans-serif', fontSize:16, fontWeight:700, border:'none', borderRadius:12, cursor: loading ? 'not-allowed' : 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8, boxShadow: loading ? 'none' : '0 8px 16px rgba(201,168,76,0.2)', transition: 'all 0.3s' }}
              >
                {loading ? (
                  <motion.div animate={{ rotate: 360 }} transition={{ repeat: Infinity, duration: 1, ease: 'linear' }} style={{ width: 18, height: 18, border: `2px solid ${C.ts}`, borderTopColor: 'transparent', borderRadius: '50%' }} />
                ) : (
                  <>Sign in <ArrowRight size={18} /></>
                )}
              </motion.button>

              <div style={{ marginTop: 32, paddingTop: 24, borderTop: `1px solid rgba(255,255,255,0.05)`, textAlign: 'center' }}>
                <p style={{ fontFamily:'DM Sans,sans-serif', fontSize:14, color:C.ts, margin:0 }}>
                  Don't have an account?{' '}
                  <Link to="/register" style={{ color:C.goldLt, textDecoration:'none', fontWeight:600, display: 'inline-flex', alignItems: 'center', gap: 4, transition: 'color 0.2s' }} onMouseEnter={e=>e.currentTarget.style.color=C.gold} onMouseLeave={e=>e.currentTarget.style.color=C.goldLt}>
                    Create one free <ArrowRight size={14} />
                  </Link>
                </p>
              </div>
            </form>
          </div>
        </motion.div>
      </div>
    </div>
  );
}

