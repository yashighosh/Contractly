import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { CheckCircle2, User, Mail, Lock, Eye, EyeOff } from 'lucide-react';
import { useAuthStore } from '../../store/authStore';

/* ── shared LP tokens ── */
const C = {
  navy:   '#0B1629', mid: '#111F38', card: '#172035',
  border: '#1E2D45', gold: '#C9A84C', goldLt: '#E2C87A',
  goldDim:'rgba(201,168,76,0.08)', goldBorder:'rgba(201,168,76,0.5)',
  em:     '#0E9C78', tp: '#EDF0F7', ts: '#8896AD', tm: '#4A5A72',
};

/* ── Left Panel (shared) ── */
function LeftPanel() {
  return (
    <div className="hidden md:flex" style={{
      width:'45%', position:'relative', flexDirection:'column',
      background:`${C.mid} url("data:image/svg+xml,%3Csvg width='40' height='40' viewBox='0 0 40 40' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg stroke='%231E2D45' stroke-width='0.6' stroke-opacity='0.6'%3E%3Cpath d='M0 0h40v40H0z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
      overflow:'hidden',
    }}>
      {/* Gold radial glow */}
      <div style={{ position:'absolute', inset:0, background:'radial-gradient(ellipse 80% 60% at 30% 0%, rgba(201,168,76,0.08), transparent 60%)', pointerEvents:'none' }} />

      {/* Logo */}
      <div style={{ position:'relative', zIndex:1, padding:'28px 36px' }}>
        <Link to="/" style={{ textDecoration:'none', display:'flex', alignItems:'center', gap:7 }}>
          <span style={{ width:7, height:7, borderRadius:'50%', background:C.gold, display:'inline-block', flexShrink:0 }} />
          <span style={{ fontFamily:'Lora,Georgia,serif', fontSize:20, fontWeight:600, color:C.tp }}>Contractly</span>
        </Link>
      </div>

      {/* Center content */}
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

        {/* Feature list */}
        {['Legally valid e-signatures','20+ Indian-law-ready templates','Audit trail on every contract','Free for your first 3 contracts'].map((f) => (
          <div key={f} style={{ display:'flex', alignItems:'center', gap:10, marginBottom:14 }}>
            <CheckCircle2 size={17} style={{ color:C.em, flexShrink:0 }} />
            <span style={{ fontFamily:'DM Sans,sans-serif', fontSize:14, color:C.ts }}>{f}</span>
          </div>
        ))}

        {/* Social proof */}
        <div style={{ marginTop:40, display:'flex', alignItems:'center', gap:10 }}>
          <div style={{ display:'flex' }}>
            {[['DM','#4F46E5'],['PK','#0E9470'],['SR','#C9A84C']].map(([init,bg],i) => (
              <div key={init} style={{ width:28, height:28, borderRadius:'50%', background:bg, border:`2px solid ${C.mid}`, marginLeft: i ? -8 : 0, display:'flex', alignItems:'center', justifyContent:'center', fontFamily:'DM Sans,sans-serif', fontSize:10, fontWeight:700, color:C.navy }}>
                {init}
              </div>
            ))}
          </div>
          <span style={{ fontFamily:'DM Sans,sans-serif', fontSize:12, color:C.tm }}>Already trusted by 2,000+ freelancers</span>
        </div>
      </motion.div>
    </div>
  );
}

/* ── Input field ── */
function AuthInput({ label, type='text', placeholder, icon:Icon, right, value, onChange }) {
  return (
    <div style={{ marginBottom:16 }}>
      <label style={{ display:'block', fontFamily:'DM Sans,sans-serif', fontSize:12, fontWeight:500, color:C.ts, marginBottom:6 }}>{label}</label>
      <div style={{ position:'relative' }}>
        <Icon size={16} style={{ position:'absolute', left:12, top:'50%', transform:'translateY(-50%)', color:C.tm, pointerEvents:'none' }} />
        <input
          type={type}
          placeholder={placeholder}
          value={value}
          onChange={onChange}
          style={{ width:'100%', height:44, background:C.card, border:`0.5px solid ${C.border}`, borderRadius:10, color:C.tp, fontFamily:'DM Sans,sans-serif', fontSize:14, paddingLeft:40, paddingRight: right ? 40 : 14, outline:'none', boxSizing:'border-box', transition:'border-color 150ms' }}
          onFocus={e => { e.target.style.borderColor = C.goldBorder; e.target.style.boxShadow = '0 0 0 3px rgba(201,168,76,0.08)'; }}
          onBlur={e => { e.target.style.borderColor = C.border; e.target.style.boxShadow = 'none'; }}
        />
        {right}
      </div>
    </div>
  );
}

/* ══════════════════════════════════════════════════════════
   REGISTER
══════════════════════════════════════════════════════════ */
export default function Register() {
  const navigate  = useNavigate();
  const register  = useAuthStore((s) => s.register);
  const [form, setForm] = useState({ name:'', email:'', password:'' });
  const [role, setRole] = useState('freelancer');
  const [showPw, setShowPw] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError]   = useState('');

  const set = (k) => (e) => setForm((f) => ({ ...f, [k]: e.target.value }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      await register({ ...form, role });
      navigate('/dashboard');
    } catch(err) {
      setError(err.message || 'Registration failed');
    } finally {
      setLoading(false);
    }
  };

  const roleCards = [
    { id:'freelancer', title:'Freelancer', sub:'Solo creator, designer, or developer' },
    { id:'agency',     title:'Agency',     sub:'Team of 2+ with multiple clients' },
  ];

  return (
    <div style={{ display:'flex', height:'100vh', background:C.navy, overflow:'hidden' }}>
      <LeftPanel />

      {/* Right panel */}
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

          <h1 style={{ fontFamily:'Lora,Georgia,serif', fontSize:28, fontWeight:600, color:C.tp, margin:'0 0 6px' }}>Create your account</h1>
          <p style={{ fontFamily:'DM Sans,sans-serif', fontSize:14, color:C.ts, margin:'0 0 28px' }}>Free to start. No credit card required.</p>

          {error && (
            <div style={{ background:'rgba(239,68,68,0.1)', border:'0.5px solid rgba(239,68,68,0.3)', borderRadius:8, padding:'10px 14px', marginBottom:16, fontFamily:'DM Sans,sans-serif', fontSize:13, color:'#F87171' }}>{error}</div>
          )}

          <form onSubmit={handleSubmit}>
            <AuthInput label="Full Name" placeholder="Priya Sharma" icon={User} value={form.name} onChange={set('name')} />
            <AuthInput label="Email address" type="email" placeholder="you@example.com" icon={Mail} value={form.email} onChange={set('email')} />
            <AuthInput
              label="Password" type={showPw ? 'text' : 'password'}
              placeholder="Min. 8 characters" icon={Lock}
              value={form.password} onChange={set('password')}
              right={
                <button type="button" onClick={() => setShowPw(!showPw)}
                  style={{ position:'absolute', right:12, top:'50%', transform:'translateY(-50%)', background:'none', border:'none', cursor:'pointer', color:C.tm, display:'flex', padding:0 }}>
                  {showPw ? <EyeOff size={15} /> : <Eye size={15} />}
                </button>
              }
            />

            {/* Role selector */}
            <div style={{ marginBottom:20 }}>
              <label style={{ display:'block', fontFamily:'DM Sans,sans-serif', fontSize:12, fontWeight:500, color:C.ts, marginBottom:8 }}>I am a...</label>
              <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:10 }}>
                {roleCards.map(({ id, title, sub }) => {
                  const active = role === id;
                  return (
                    <button key={id} type="button" onClick={() => setRole(id)}
                      style={{ position:'relative', background: active ? C.goldDim : C.card, border: active ? `1.5px solid ${C.goldBorder}` : `0.5px solid ${C.border}`, borderRadius:12, padding:'14px 14px 12px', textAlign:'left', cursor:'pointer', transition:'all 150ms' }}>
                      {active && (
                        <div style={{ position:'absolute', top:8, right:8 }}>
                          <CheckCircle2 size={14} style={{ color:C.gold }} />
                        </div>
                      )}
                      <div style={{ fontFamily:'DM Sans,sans-serif', fontSize:13, fontWeight:600, color: active ? C.gold : C.tp, marginBottom:3 }}>{title}</div>
                      <div style={{ fontFamily:'DM Sans,sans-serif', fontSize:11, color:C.ts, lineHeight:1.4 }}>{sub}</div>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Submit */}
            <button type="submit" disabled={loading}
              style={{ width:'100%', height:44, background: loading ? C.ts : C.gold, color:C.navy, fontFamily:'DM Sans,sans-serif', fontSize:15, fontWeight:600, border:'none', borderRadius:10, cursor: loading ? 'not-allowed' : 'pointer', transition:'all 150ms', marginBottom:16 }}
              onMouseEnter={e => { if(!loading){ e.currentTarget.style.background=C.goldLt; e.currentTarget.style.transform='translateY(-1px)'; }}}
              onMouseLeave={e => { e.currentTarget.style.background=loading?C.ts:C.gold; e.currentTarget.style.transform='translateY(0)'; }}
              onMouseDown={e => e.currentTarget.style.transform='scale(0.99)'}
            >
              {loading ? 'Creating account…' : 'Create account →'}
            </button>

            <p style={{ fontFamily:'DM Sans,sans-serif', fontSize:12, color:C.tm, textAlign:'center', margin:'0 0 16px' }}>
              By signing up you agree to our{' '}
              <a href="#" style={{ color:C.gold, textDecoration:'underline' }}>Terms</a>
              {' & '}
              <a href="#" style={{ color:C.gold, textDecoration:'underline' }}>Privacy Policy</a>
            </p>

            <p style={{ fontFamily:'DM Sans,sans-serif', fontSize:13, color:C.ts, textAlign:'center', margin:0 }}>
              Already have an account?{' '}
              <Link to="/login" style={{ color:C.gold, textDecoration:'none', fontWeight:500 }}>Sign in →</Link>
            </p>
          </form>
        </motion.div>
      </div>
    </div>
  );
}
