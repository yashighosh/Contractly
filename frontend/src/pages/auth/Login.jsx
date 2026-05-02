import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { CheckCircle2, Mail, Lock, Eye, EyeOff } from 'lucide-react';
import { useAuthStore } from '../../store/authStore';

const C = {
  navy:   '#0B1629', mid: '#111F38', card: '#172035',
  border: '#1E2D45', gold: '#C9A84C', goldLt: '#E2C87A',
  goldDim:'rgba(201,168,76,0.08)', goldBorder:'rgba(201,168,76,0.5)',
  em:     '#0E9C78', tp: '#EDF0F7', ts: '#8896AD', tm: '#4A5A72',
};

function LeftPanel() {
  return (
    <div className="hidden md:flex" style={{
      width:'45%', position:'relative', flexDirection:'column',
      background:`${C.mid} url("data:image/svg+xml,%3Csvg width='40' height='40' viewBox='0 0 40 40' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none'%3E%3Cg stroke='%231E2D45' stroke-width='0.6' stroke-opacity='0.6'%3E%3Cpath d='M0 0h40v40H0z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
      overflow:'hidden',
    }}>
      <div style={{ position:'absolute', inset:0, background:'radial-gradient(ellipse 80% 60% at 30% 0%, rgba(201,168,76,0.08), transparent 60%)', pointerEvents:'none' }} />
      <div style={{ position:'relative', zIndex:1, padding:'28px 36px' }}>
        <Link to="/" style={{ textDecoration:'none', display:'flex', alignItems:'center', gap:7 }}>
          <span style={{ width:7, height:7, borderRadius:'50%', background:C.gold, display:'inline-block' }} />
          <span style={{ fontFamily:'Lora,Georgia,serif', fontSize:20, fontWeight:600, color:C.tp }}>Contractly</span>
        </Link>
      </div>
      <motion.div
        initial={{ opacity:0, x:-20 }} animate={{ opacity:1, x:0 }} transition={{ duration:0.4, ease:'easeOut' }}
        style={{ flex:1, display:'flex', flexDirection:'column', justifyContent:'center', padding:'0 48px 48px', position:'relative', zIndex:1 }}
      >
        <h2 style={{ fontFamily:'Lora,Georgia,serif', fontSize:32, fontWeight:600, color:C.tp, lineHeight:1.25, margin:'0 0 16px' }}>
          Your contracts.<br/>Your terms.<br/><em style={{ color:C.gold, fontStyle:'italic' }}>Your protection.</em>
        </h2>
        <p style={{ fontFamily:'DM Sans,sans-serif', fontSize:14, color:C.ts, marginBottom:36, lineHeight:1.6 }}>
          Join thousands of Indian freelancers closing projects with confidence.
        </p>
        {['Legally valid e-signatures','20+ Indian-law-ready templates','Audit trail on every contract','Free for your first 3 contracts'].map((f) => (
          <div key={f} style={{ display:'flex', alignItems:'center', gap:10, marginBottom:14 }}>
            <CheckCircle2 size={17} style={{ color:C.em, flexShrink:0 }} />
            <span style={{ fontFamily:'DM Sans,sans-serif', fontSize:14, color:C.ts }}>{f}</span>
          </div>
        ))}
        <div style={{ marginTop:40, display:'flex', alignItems:'center', gap:10 }}>
          <div style={{ display:'flex' }}>
            {[['DM','#4F46E5'],['PK','#0E9470'],['SR','#C9A84C']].map(([init,bg],i) => (
              <div key={init} style={{ width:28, height:28, borderRadius:'50%', background:bg, border:`2px solid ${C.mid}`, marginLeft:i?-8:0, display:'flex', alignItems:'center', justifyContent:'center', fontFamily:'DM Sans,sans-serif', fontSize:10, fontWeight:700, color:'#0B1629' }}>{init}</div>
            ))}
          </div>
          <span style={{ fontFamily:'DM Sans,sans-serif', fontSize:12, color:C.tm }}>Already trusted by 2,000+ freelancers</span>
        </div>
      </motion.div>
    </div>
  );
}

function AuthInput({ label, type='text', placeholder, icon:Icon, right, value, onChange }) {
  return (
    <div style={{ marginBottom:16 }}>
      <label style={{ display:'block', fontFamily:'DM Sans,sans-serif', fontSize:12, fontWeight:500, color:C.ts, marginBottom:6 }}>{label}</label>
      <div style={{ position:'relative' }}>
        <Icon size={16} style={{ position:'absolute', left:12, top:'50%', transform:'translateY(-50%)', color:C.tm, pointerEvents:'none' }} />
        <input type={type} placeholder={placeholder} value={value} onChange={onChange}
          style={{ width:'100%', height:44, background:C.card, border:`0.5px solid ${C.border}`, borderRadius:10, color:C.tp, fontFamily:'DM Sans,sans-serif', fontSize:14, paddingLeft:40, paddingRight: right ? 40 : 14, outline:'none', boxSizing:'border-box', transition:'border-color 150ms' }}
          onFocus={e=>{ e.target.style.borderColor=C.goldBorder; e.target.style.boxShadow='0 0 0 3px rgba(201,168,76,0.08)'; }}
          onBlur={e=>{ e.target.style.borderColor=C.border; e.target.style.boxShadow='none'; }}
        />
        {right}
      </div>
    </div>
  );
}

export default function Login() {
  const navigate = useNavigate();
  const login    = useAuthStore((s) => s.login);
  const [form, setForm]   = useState({ email:'', password:'' });
  const [showPw, setShowPw] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError]   = useState('');

  const set = (k) => (e) => setForm((f) => ({ ...f, [k]: e.target.value }));

  const fillDemo = () => setForm({ email: 'yashi@contractly.in', password: 'demo123' });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      await login(form);
      navigate('/dashboard');
    } catch(err) {
      setError(err.message || 'Invalid email or password');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ display:'flex', height:'100vh', background:C.navy, overflow:'hidden' }}>
      <LeftPanel />
      <div style={{ flex:1, display:'flex', alignItems:'center', justifyContent:'center', background:C.navy, padding:'24px 32px', overflowY:'auto' }}>
        <motion.div
          initial={{ opacity:0, x:20 }} animate={{ opacity:1, x:0 }} transition={{ duration:0.4, ease:'easeOut' }}
          style={{ width:'100%', maxWidth:420 }}
        >
          {/* Mobile logo */}
          <div className="md:hidden" style={{ display:'flex', alignItems:'center', gap:7, marginBottom:32 }}>
            <span style={{ width:7, height:7, borderRadius:'50%', background:C.gold, display:'inline-block' }} />
            <span style={{ fontFamily:'Lora,Georgia,serif', fontSize:20, fontWeight:600, color:C.tp }}>Contractly</span>
          </div>

          <h1 style={{ fontFamily:'Lora,Georgia,serif', fontSize:28, fontWeight:600, color:C.tp, margin:'0 0 6px' }}>Welcome back</h1>
          <p style={{ fontFamily:'DM Sans,sans-serif', fontSize:14, color:C.ts, margin:'0 0 28px' }}>Sign in to your Contractly account</p>

          {error && (
            <div style={{ background:'rgba(239,68,68,0.1)', border:'0.5px solid rgba(239,68,68,0.3)', borderRadius:8, padding:'10px 14px', marginBottom:16, fontFamily:'DM Sans,sans-serif', fontSize:13, color:'#F87171' }}>{error}</div>
          )}

          {/* Demo account quick-fill */}
          <button type="button" onClick={fillDemo} style={{
            width:'100%', marginBottom:16, padding:'10px 14px',
            background:'rgba(201,168,76,0.08)', border:'0.5px solid rgba(201,168,76,0.35)',
            borderRadius:10, cursor:'pointer', textAlign:'left',
            display:'flex', alignItems:'center', justifyContent:'space-between', gap:8,
          }}>
            <span style={{ fontFamily:'DM Sans,sans-serif', fontSize:12, color:'#8896AD' }}>
              🎯 <strong style={{ color:'#C9A84C' }}>Demo account</strong> — click to fill
            </span>
            <span style={{ fontFamily:'monospace', fontSize:11, color:'#4A5A72' }}>yashi@contractly.in</span>
          </button>

          <form onSubmit={handleSubmit}>
            <AuthInput label="Email address" type="email" placeholder="you@example.com" icon={Mail} value={form.email} onChange={set('email')} />

            {/* Password + forgot */}
            <div style={{ marginBottom:20 }}>
              <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center', marginBottom:6 }}>
                <label style={{ fontFamily:'DM Sans,sans-serif', fontSize:12, fontWeight:500, color:C.ts }}>Password</label>
                <a href="#" style={{ fontFamily:'DM Sans,sans-serif', fontSize:12, color:C.gold, textDecoration:'none' }}>Forgot password?</a>
              </div>
              <div style={{ position:'relative' }}>
                <Lock size={16} style={{ position:'absolute', left:12, top:'50%', transform:'translateY(-50%)', color:C.tm, pointerEvents:'none' }} />
                <input type={showPw ? 'text' : 'password'} placeholder="••••••••" value={form.password} onChange={set('password')}
                  style={{ width:'100%', height:44, background:C.card, border:`0.5px solid ${C.border}`, borderRadius:10, color:C.tp, fontFamily:'DM Sans,sans-serif', fontSize:14, paddingLeft:40, paddingRight:40, outline:'none', boxSizing:'border-box', transition:'border-color 150ms' }}
                  onFocus={e=>{ e.target.style.borderColor=C.goldBorder; e.target.style.boxShadow='0 0 0 3px rgba(201,168,76,0.08)'; }}
                  onBlur={e=>{ e.target.style.borderColor=C.border; e.target.style.boxShadow='none'; }}
                />
                <button type="button" onClick={() => setShowPw(!showPw)}
                  style={{ position:'absolute', right:12, top:'50%', transform:'translateY(-50%)', background:'none', border:'none', cursor:'pointer', color:C.tm, display:'flex', padding:0 }}>
                  {showPw ? <EyeOff size={15} /> : <Eye size={15} />}
                </button>
              </div>
            </div>

            <button type="submit" disabled={loading}
              style={{ width:'100%', height:44, background: loading ? C.ts : C.gold, color:C.navy, fontFamily:'DM Sans,sans-serif', fontSize:15, fontWeight:600, border:'none', borderRadius:10, cursor: loading ? 'not-allowed' : 'pointer', transition:'all 150ms', marginBottom:20 }}
              onMouseEnter={e=>{ if(!loading){ e.currentTarget.style.background=C.goldLt; e.currentTarget.style.transform='translateY(-1px)'; }}}
              onMouseLeave={e=>{ e.currentTarget.style.background=loading?C.ts:C.gold; e.currentTarget.style.transform='translateY(0)'; }}
              onMouseDown={e=>e.currentTarget.style.transform='scale(0.99)'}
            >
              {loading ? 'Signing in…' : 'Sign in →'}
            </button>

            <p style={{ fontFamily:'DM Sans,sans-serif', fontSize:13, color:C.ts, textAlign:'center', margin:0 }}>
              Don't have an account?{' '}
              <Link to="/register" style={{ color:C.gold, textDecoration:'none', fontWeight:500 }}>Create one free →</Link>
            </p>
          </form>
        </motion.div>
      </div>
    </div>
  );
}
