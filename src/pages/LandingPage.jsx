import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Menu, Download, PlayCircle, Check, ArrowRight, Zap, FileText, PenLine, BarChart2, Copy, Clock, Users } from 'lucide-react';
import { useAuthStore } from '../store/authStore';

const lp = {
  navy:    'var(--lp-navy)',
  mid:     'var(--lp-navy-mid)',
  card:    'var(--lp-navy-card)',
  border:  'var(--lp-navy-border)',
  gold:    'var(--lp-gold)',
  goldLt:  'var(--lp-gold-light)',
  goldDim: 'var(--lp-gold-dim)',
  em:      'var(--lp-emerald)',
  tp:      'var(--lp-text-primary)',
  ts:      'var(--lp-text-secondary)',
  tm:      'var(--lp-text-muted)',
};

const inView = { initial:{opacity:0,y:32}, whileInView:{opacity:1,y:0}, viewport:{once:true,margin:'-80px'}, transition:{duration:0.5,ease:'easeOut'} };

/* ── Nav ── */
function LandingNav() {
  const user = useAuthStore((s) => s.user);
  const nav = useNavigate();
  return (
    <header style={{ position:'sticky', top:0, zIndex:50, height:64, backdropFilter:'blur(14px)', WebkitBackdropFilter:'blur(14px)', background:'rgba(11,22,41,0.85)', borderBottom:`0.5px solid ${lp.border}`, display:'flex', alignItems:'center', justifyContent:'space-between', padding:'0 5vw' }}>
      <div style={{ fontFamily:'Lora,Georgia,serif', fontSize:20, fontWeight:600, color:lp.tp, display:'flex', alignItems:'center', gap:6 }}>
        <span style={{ width:7, height:7, borderRadius:'50%', background:lp.gold, display:'inline-block', marginBottom:2 }} />
        Contractly
      </div>
      <nav className="hidden md:flex items-center gap-8">
        {['Features','How it works','Pricing','Templates'].map(l => (
          <a key={l} href={`#${l.toLowerCase().replace(/ /g,'-')}`}
            style={{ fontFamily:'DM Sans,sans-serif', fontSize:13.5, color:lp.ts, textDecoration:'none', transition:'color 150ms' }}
            onMouseEnter={e=>e.target.style.color=lp.tp} onMouseLeave={e=>e.target.style.color=lp.ts}>{l}</a>
        ))}
      </nav>
      <div className="flex items-center gap-3">
        {user
          ? <Link to="/dashboard" style={{ fontFamily:'DM Sans,sans-serif', fontSize:14, color:lp.tp, border:`1px solid ${lp.border}`, borderRadius:8, padding:'7px 16px', textDecoration:'none', background:'transparent' }}>Go to Dashboard</Link>
          : <Link to="/login" style={{ fontFamily:'DM Sans,sans-serif', fontSize:14, color:lp.ts, textDecoration:'none', padding:'7px 16px' }}>Log in</Link>
        }
        <Link to="/register" style={{ fontFamily:'DM Sans,sans-serif', fontSize:14, fontWeight:500, color:lp.navy, background:lp.gold, borderRadius:8, padding:'7px 16px', textDecoration:'none' }}>Get started free</Link>
        <button className="md:hidden" style={{ color:lp.ts, background:'none', border:'none', cursor:'pointer' }}><Menu size={20} /></button>
      </div>
    </header>
  );
}

/* ── Hero ── */
function HeroSection() {
  const nav = useNavigate();
  return (
    <section style={{ minHeight:'88vh', background:lp.navy, display:'flex', alignItems:'center', justifyContent:'center', position:'relative', overflow:'hidden' }}>
      <div style={{ position:'absolute', inset:0, background:'radial-gradient(ellipse 70% 50% at 50% 0%, rgba(201,168,76,0.07), transparent 60%)', pointerEvents:'none' }} />
      <div style={{ position:'absolute', inset:0, background:'radial-gradient(ellipse 40% 30% at 80% 70%, rgba(14,156,120,0.05), transparent 50%)', pointerEvents:'none' }} />
      <div style={{ position:'absolute', inset:0, backgroundImage:`linear-gradient(${lp.border} 1px, transparent 1px),linear-gradient(90deg, ${lp.border} 1px, transparent 1px)`, backgroundSize:'48px 48px', opacity:0.03, pointerEvents:'none' }} />
      <motion.div initial={{opacity:0,y:20}} animate={{opacity:1,y:0}} transition={{duration:0.6}} style={{ textAlign:'center', padding:'0 5vw', maxWidth:680, position:'relative', zIndex:1 }}>
        <motion.div initial={{opacity:0,y:10}} animate={{opacity:1,y:0}} transition={{delay:0.1}} style={{ display:'inline-flex', alignItems:'center', gap:8, border:`1px solid ${lp.gold}`, borderRadius:999, padding:'5px 14px', marginBottom:28, background:lp.goldDim }}>
          <span style={{ width:7, height:7, borderRadius:'50%', background:lp.gold, animation:'pulse 2s infinite' }} />
          <span style={{ fontFamily:'DM Sans,sans-serif', fontSize:13, color:lp.gold }}>Built for Indian freelancers & agencies</span>
        </motion.div>
        <motion.h1 initial={{opacity:0,y:10}} animate={{opacity:1,y:0}} transition={{delay:0.2}} style={{ fontFamily:'Lora,Georgia,serif', fontWeight:600, fontSize:'clamp(34px,6vw,58px)', color:lp.tp, lineHeight:1.15, margin:'0 0 20px' }}>
          Contracts that <em style={{ color:lp.gold, fontStyle:'italic' }}>close deals</em>,<br/>not conversations
        </motion.h1>
        <motion.p initial={{opacity:0,y:10}} animate={{opacity:1,y:0}} transition={{delay:0.3}} style={{ fontFamily:'DM Sans,sans-serif', fontSize:16, color:lp.ts, maxWidth:480, margin:'0 auto 32px', lineHeight:1.7 }}>
          Draft, send, and get contracts signed in minutes. Purpose-built for Indian freelancers with GST support, legally valid e-signatures, and real-time audit trails.
        </motion.p>
        <motion.div initial={{opacity:0,y:10}} animate={{opacity:1,y:0}} transition={{delay:0.4}} className="flex flex-col sm:flex-row items-center justify-center gap-3 mb-8">
          <button onClick={()=>nav('/register')} style={{ fontFamily:'DM Sans,sans-serif', fontWeight:600, fontSize:15, color:lp.navy, background:lp.gold, border:'none', borderRadius:10, padding:'12px 24px', cursor:'pointer', display:'flex', alignItems:'center', gap:8, transition:'all 150ms' }}
            onMouseEnter={e=>{e.currentTarget.style.background=lp.goldLt;e.currentTarget.style.transform='scale(1.02)'}} onMouseLeave={e=>{e.currentTarget.style.background=lp.gold;e.currentTarget.style.transform='scale(1)'}}>
            <Download size={16} /> Start for free
          </button>
          <button style={{ fontFamily:'DM Sans,sans-serif', fontWeight:500, fontSize:15, color:lp.tp, background:'transparent', border:`1px solid ${lp.border}`, borderRadius:10, padding:'12px 24px', cursor:'pointer', display:'flex', alignItems:'center', gap:8, transition:'border-color 150ms' }}
            onMouseEnter={e=>e.currentTarget.style.borderColor=lp.gold} onMouseLeave={e=>e.currentTarget.style.borderColor=lp.border}>
            <PlayCircle size={16} /> Watch demo
          </button>
        </motion.div>
        <motion.div initial={{opacity:0}} animate={{opacity:1}} transition={{delay:0.55}} className="flex flex-wrap items-center justify-center gap-x-5 gap-y-2">
          {['No credit card needed','Legally valid e-signatures','GST-ready invoices','5 minute setup'].map((t,i)=>(
            <span key={i} style={{ fontFamily:'DM Sans,sans-serif', fontSize:13, color:lp.ts, display:'flex', alignItems:'center', gap:5 }}>
              <Check size={13} style={{ color:lp.em }} />{t}
            </span>
          ))}
        </motion.div>
      </motion.div>
    </section>
  );
}

/* ── Product Preview ── */
function ProductPreview() {
  const badge = (s) => {
    const cfg = { signed:{bg:'rgba(14,156,120,0.15)',c:'#0E9C78'}, pending:{bg:'rgba(245,158,11,0.15)',c:'#F59E0B'}, draft:{bg:'rgba(100,116,139,0.15)',c:'#64748B'} };
    const {bg,c} = cfg[s];
    return <span style={{ background:bg, color:c, fontSize:10, fontWeight:600, padding:'2px 8px', borderRadius:999 }}>{s.charAt(0).toUpperCase()+s.slice(1)}</span>;
  };
  const rows = [
    {title:'Website Redesign',client:'Priya Sharma',status:'signed'},
    {title:'Brand Identity',client:'Karan Mehta',status:'pending'},
    {title:'SEO Package',client:'Meera Iyer',status:'draft'},
  ];
  return (
    <motion.section {...inView} style={{ padding:'80px 5vw', background:lp.navy }}>
      <p style={{ textAlign:'center', fontFamily:'DM Sans,sans-serif', fontSize:12, fontWeight:500, color:lp.tm, textTransform:'uppercase', letterSpacing:'0.12em', marginBottom:40 }}>What it looks like inside</p>
      <div style={{ maxWidth:900, margin:'0 auto', borderRadius:20, background:lp.card, border:`0.5px solid ${lp.border}`, boxShadow:'0 40px 80px rgba(0,0,0,0.4)', overflow:'hidden' }}>
        {/* Browser bar */}
        <div style={{ height:40, background:lp.mid, display:'flex', alignItems:'center', padding:'0 16px', gap:8, borderBottom:`0.5px solid ${lp.border}` }}>
          {['#EF4444','#F59E0B','#22C55E'].map((c,i)=><div key={i} style={{ width:10,height:10,borderRadius:'50%',background:c }} />)}
          <div style={{ flex:1, margin:'0 16px', background:lp.navy, borderRadius:6, height:22, display:'flex', alignItems:'center', justifyContent:'center' }}>
            <span style={{ fontFamily:'DM Sans,monospace', fontSize:11, color:lp.tm }}>app.contractly.in/dashboard</span>
          </div>
        </div>
        {/* App body */}
        <div style={{ display:'flex', height:320 }}>
          {/* Sidebar */}
          <div className="hidden md:flex" style={{ width:180, borderRight:`0.5px solid ${lp.border}`, flexDirection:'column', padding:'16px 0' }}>
            <div style={{ padding:'0 16px 16px', fontFamily:'Lora,serif', fontSize:14, fontWeight:600, color:lp.tp, borderBottom:`0.5px solid ${lp.border}`, marginBottom:8, display:'flex', alignItems:'center', gap:6 }}>
              <Zap size={13} style={{ color:lp.gold }} /> Contractly
            </div>
            {[{l:'Dashboard',a:true},{l:'Contracts'},{l:'Templates'},{l:'Clients'},{l:'Settings'}].map(({l,a})=>(
              <div key={l} style={{ padding:'7px 16px', margin:'1px 8px', borderRadius:6, background:a?lp.goldDim:'transparent', borderLeft:a?`2px solid ${lp.gold}`:'2px solid transparent', fontFamily:'DM Sans,sans-serif', fontSize:12, color:a?lp.gold:lp.ts, cursor:'pointer' }}>{l}</div>
            ))}
          </div>
          {/* Main */}
          <div style={{ flex:1, padding:'20px 24px', overflowY:'auto' }}>
            <p style={{ fontFamily:'DM Sans,sans-serif', fontSize:15, fontWeight:500, color:lp.tp, marginBottom:16 }}>Good morning, Yashi ☀️</p>
            <div style={{ display:'grid', gridTemplateColumns:'repeat(3,1fr)', gap:10, marginBottom:20 }}>
              {[{n:'12',l:'Active Contracts',c:lp.gold},{n:'₹4.2L',l:'Revenue Locked',c:lp.em},{n:'3',l:'Expiring Soon',c:'#F59E0B'}].map(({n,l,c})=>(
                <div key={l} style={{ background:lp.mid, borderRadius:10, padding:'10px 12px', borderTop:`2px solid ${c}` }}>
                  <div style={{ fontFamily:'DM Sans,sans-serif', fontSize:18, fontWeight:700, color:lp.tp }}>{n}</div>
                  <div style={{ fontFamily:'DM Sans,sans-serif', fontSize:11, color:lp.ts }}>{l}</div>
                </div>
              ))}
            </div>
            {rows.map(({title,client,status})=>(
              <div key={title} style={{ display:'flex', alignItems:'center', justifyContent:'space-between', padding:'9px 0', borderBottom:`0.5px solid ${lp.border}` }}>
                <div>
                  <div style={{ fontFamily:'DM Sans,sans-serif', fontSize:12, fontWeight:500, color:lp.tp }}>{title}</div>
                  <div style={{ fontFamily:'DM Sans,sans-serif', fontSize:11, color:lp.ts }}>{client}</div>
                </div>
                {badge(status)}
              </div>
            ))}
          </div>
        </div>
      </div>
    </motion.section>
  );
}

/* ── Features ── */
const FEATURES = [
  { icon:FileText,  t:'Smart contract editor',        d:'Lora-serif editor with clause library, auto-fill variables, and PDF export.' },
  { icon:PenLine,   t:'Legally valid e-signatures',   d:'Aadhaar-linked or drawn signatures with timestamp and IP audit trail.' },
  { icon:BarChart2, t:'Revenue dashboard',            d:'See locked revenue, expiring contracts, and overdue clients at a glance.' },
  { icon:Copy,      t:'Template library',             d:'30+ industry templates — design, dev, marketing, photography, and more.' },
  { icon:Clock,     t:'Audit trail & versioning',     d:'Every view, edit, and signature is logged with a tamper-evident hash.' },
  { icon:Users,     t:'Client management',            d:'Keep client history, contract count, and contact info all in one place.' },
];
function FeaturesSection() {
  return (
    <motion.section {...inView} id="features" style={{ padding:'96px 5vw', background:lp.mid }}>
      <div style={{ textAlign:'center', marginBottom:56 }}>
        <p style={{ fontFamily:'DM Sans,sans-serif', fontSize:12, fontWeight:600, color:lp.gold, textTransform:'uppercase', letterSpacing:'0.1em', marginBottom:12 }}>Why Contractly</p>
        <h2 style={{ fontFamily:'Lora,Georgia,serif', fontSize:'clamp(26px,4vw,40px)', fontWeight:600, color:lp.tp, margin:0 }}>Everything you need, nothing you don't</h2>
      </div>
      <div style={{ maxWidth:1000, margin:'0 auto', display:'grid', gap:1, gridTemplateColumns:'repeat(1,1fr)', background:lp.border }} className="sm:grid-cols-2 lg:grid-cols-3">
        {FEATURES.map(({icon:Icon,t,d},i)=>(
          <motion.div key={t} initial={{opacity:0,y:16}} whileInView={{opacity:1,y:0}} viewport={{once:true}} transition={{delay:i*0.08,duration:0.4}}
            style={{ background:lp.card, padding:'28px 24px', position:'relative', overflow:'hidden', cursor:'default', transition:'background 200ms' }}
            onMouseEnter={e=>{e.currentTarget.style.background=lp.mid;e.currentTarget.querySelector('.top-line').style.opacity='1'}}
            onMouseLeave={e=>{e.currentTarget.style.background=lp.card;e.currentTarget.querySelector('.top-line').style.opacity='0'}}
          >
            <div className="top-line" style={{ position:'absolute', top:0, left:0, right:0, height:2, background:`linear-gradient(90deg, ${lp.gold}, transparent)`, opacity:0, transition:'opacity 200ms' }} />
            <div style={{ width:36, height:36, borderRadius:8, background:lp.goldDim, display:'flex', alignItems:'center', justifyContent:'center', marginBottom:14 }}>
              <Icon size={17} style={{ color:lp.gold }} />
            </div>
            <h3 style={{ fontFamily:'DM Sans,sans-serif', fontSize:14, fontWeight:600, color:lp.tp, margin:'0 0 8px' }}>{t}</h3>
            <p style={{ fontFamily:'DM Sans,sans-serif', fontSize:13, color:lp.ts, lineHeight:1.65, margin:0 }}>{d}</p>
          </motion.div>
        ))}
      </div>
    </motion.section>
  );
}

/* ── How it Works ── */
const STEPS = [
  { n:'01', t:'Pick a template',      d:'Choose from 30+ legal templates built for Indian freelancers. Customise in seconds.' },
  { n:'02', t:'Customize & send',     d:'Fill client details, set payment terms, add clauses, and send a signing link via email or WhatsApp.' },
  { n:'03', t:'Get paid, not chased', d:'Client signs digitally. You get an alert instantly. Download the timestamped PDF.' },
];
function HowItWorks() {
  return (
    <motion.section {...inView} id="how-it-works" style={{ padding:'96px 5vw', background:lp.navy }}>
      <div style={{ textAlign:'center', marginBottom:60 }}>
        <p style={{ fontFamily:'DM Sans,sans-serif', fontSize:12, fontWeight:600, color:lp.gold, textTransform:'uppercase', letterSpacing:'0.1em', marginBottom:12 }}>How it works</p>
        <h2 style={{ fontFamily:'Lora,Georgia,serif', fontSize:'clamp(26px,4vw,40px)', fontWeight:600, color:lp.tp, margin:0 }}>
          From draft to <em style={{ color:lp.gold, fontStyle:'italic' }}>signed</em> in 3 steps
        </h2>
      </div>
      <div style={{ maxWidth:860, margin:'0 auto', position:'relative' }}>
        <div className="hidden sm:block" style={{ position:'absolute', top:28, left:'calc(16.66% + 28px)', right:'calc(16.66% + 28px)', height:1, background:`linear-gradient(90deg, ${lp.gold}, transparent, ${lp.gold})`, opacity:0.35 }} />
        <div className="flex flex-col sm:flex-row gap-10 sm:gap-4">
          {STEPS.map(({n,t,d},i)=>(
            <motion.div key={n} initial={{opacity:0,y:20}} whileInView={{opacity:1,y:0}} viewport={{once:true}} transition={{delay:i*0.12,duration:0.4}}
              style={{ flex:1, textAlign:'center', padding:'0 16px' }}>
              <div style={{ width:56, height:56, borderRadius:'50%', border:`0.5px solid ${lp.border}`, background:lp.card, display:'flex', alignItems:'center', justifyContent:'center', margin:'0 auto 18px', transition:'background 200ms', cursor:'default', fontFamily:'Lora,serif', fontSize:18, fontWeight:600, color:lp.gold }}
                onMouseEnter={e=>e.currentTarget.style.background=lp.goldDim}
                onMouseLeave={e=>e.currentTarget.style.background=lp.card}>{n}</div>
              <h3 style={{ fontFamily:'DM Sans,sans-serif', fontSize:15, fontWeight:600, color:lp.tp, margin:'0 0 8px' }}>{t}</h3>
              <p style={{ fontFamily:'DM Sans,sans-serif', fontSize:13, color:lp.ts, lineHeight:1.65, margin:0 }}>{d}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </motion.section>
  );
}

/* ── Testimonials ── */
const TESTIMONIALS = [
  { q:"Before Contractly I was chasing clients for signatures over WhatsApp for weeks. Now they sign within hours. The audit trail alone has saved me from 2 disputes.", name:'Divya Menon', role:'UI/UX Freelancer, Bangalore', init:'DM', c:'#4F46E5' },
  { q:"A client tried to claim we never agreed on 3 revisions. I pulled up the signed contract in 10 seconds. Conversation over. Worth every rupee.", name:'Arjun Khanna', role:'Brand Designer, Mumbai', init:'AK', c:'#0E9470' },
  { q:"The template library saved me hours. I used the photography contract for a wedding and the NDA for a startup — both perfectly written for Indian law.", name:'Sneha Raut', role:'Photographer, Pune', init:'SR', c:'#C9A84C' },
];
function Testimonials() {
  return (
    <motion.section {...inView} style={{ padding:'96px 5vw', background:lp.mid }}>
      <div style={{ textAlign:'center', marginBottom:56 }}>
        <p style={{ fontFamily:'DM Sans,sans-serif', fontSize:12, fontWeight:600, color:lp.gold, textTransform:'uppercase', letterSpacing:'0.1em', marginBottom:12 }}>Social proof</p>
        <h2 style={{ fontFamily:'Lora,Georgia,serif', fontSize:'clamp(26px,4vw,40px)', fontWeight:600, color:lp.tp, margin:0 }}>
          Freelancers finally feel <em style={{ color:lp.gold, fontStyle:'italic' }}>protected</em>
        </h2>
      </div>
      <div style={{ maxWidth:1000, margin:'0 auto', display:'grid', gap:20 }} className="grid-cols-1 md:grid-cols-3">
        {TESTIMONIALS.map(({q,name,role,init,c},i)=>(
          <motion.div key={name} initial={{opacity:0,y:20}} whileInView={{opacity:1,y:0}} viewport={{once:true}} transition={{delay:i*0.1,duration:0.4}}
            style={{ background:lp.card, border:`0.5px solid ${lp.border}`, borderRadius:16, padding:'24px', transition:'border-color 200ms', cursor:'default' }}
            onMouseEnter={e=>e.currentTarget.style.borderColor='rgba(201,168,76,0.25)'}
            onMouseLeave={e=>e.currentTarget.style.borderColor=lp.border}>
            <div style={{ color:lp.gold, fontSize:15, marginBottom:14 }}>★★★★★</div>
            <p style={{ fontFamily:'DM Sans,sans-serif', fontSize:13.5, color:lp.ts, lineHeight:1.7, fontStyle:'italic', margin:'0 0 20px' }}>"{q}"</p>
            <div style={{ display:'flex', alignItems:'center', gap:10 }}>
              <div style={{ width:36, height:36, borderRadius:'50%', background:c, display:'flex', alignItems:'center', justifyContent:'center', fontFamily:'DM Sans,sans-serif', fontSize:12, fontWeight:700, color:'#0B1629' }}>{init}</div>
              <div>
                <div style={{ fontFamily:'DM Sans,sans-serif', fontSize:13, fontWeight:600, color:lp.tp }}>{name}</div>
                <div style={{ fontFamily:'DM Sans,sans-serif', fontSize:12, color:lp.tm }}>{role}</div>
              </div>
            </div>
          </motion.div>
        ))}
      </div>
    </motion.section>
  );
}

/* ── CTA ── */
function CtaSection() {
  const nav = useNavigate();
  return (
    <motion.section {...inView} style={{ padding:'96px 5vw', background:lp.navy, borderTop:`0.5px solid ${lp.border}`, backgroundImage:'radial-gradient(ellipse 60% 80% at 50% 0%, rgba(201,168,76,0.05), transparent 60%)', textAlign:'center' }}>
      <h2 style={{ fontFamily:'Lora,Georgia,serif', fontSize:'clamp(26px,4vw,42px)', fontWeight:600, color:lp.tp, margin:'0 0 16px' }}>
        Stop losing money to <em style={{ color:lp.gold, fontStyle:'italic' }}>unsigned contracts</em>
      </h2>
      <p style={{ fontFamily:'DM Sans,sans-serif', fontSize:16, color:lp.ts, marginBottom:36 }}>Join thousands of Indian freelancers who get signed faster.</p>
      <button onClick={()=>nav('/register')} style={{ fontFamily:'DM Sans,sans-serif', fontWeight:600, fontSize:16, color:'#0B1629', background:lp.gold, border:'none', borderRadius:12, padding:'14px 32px', cursor:'pointer', display:'inline-flex', alignItems:'center', gap:10, transition:'all 150ms' }}
        onMouseEnter={e=>{e.currentTarget.style.background=lp.goldLt;e.currentTarget.style.transform='scale(1.02)'}}
        onMouseLeave={e=>{e.currentTarget.style.background=lp.gold;e.currentTarget.style.transform='scale(1)'}}>
        Create your first contract — free <ArrowRight size={16} />
      </button>
      <p style={{ fontFamily:'DM Sans,sans-serif', fontSize:12, color:lp.tm, marginTop:16 }}>No credit card · Free forever for first 3 contracts · Upgrade when you're ready</p>
    </motion.section>
  );
}

/* ── Footer ── */
function LandingFooter() {
  return (
    <footer style={{ background:lp.mid, borderTop:`0.5px solid ${lp.border}`, padding:'28px 5vw' }}>
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
        <div style={{ fontFamily:'Lora,Georgia,serif', fontSize:16, fontWeight:600, color:lp.tp, display:'flex', alignItems:'center', gap:6 }}>
          <span style={{ width:7, height:7, borderRadius:'50%', background:lp.gold, display:'inline-block' }} />
          Contractly
        </div>
        <div className="flex gap-6">
          {['Features','How it works','Pricing','Templates'].map(l=>(
            <a key={l} href={`#${l.toLowerCase().replace(/ /g,'-')}`} style={{ fontFamily:'DM Sans,sans-serif', fontSize:13, color:lp.tm, textDecoration:'none', transition:'color 150ms' }}
              onMouseEnter={e=>e.target.style.color=lp.ts} onMouseLeave={e=>e.target.style.color=lp.tm}>{l}</a>
          ))}
        </div>
        <p style={{ fontFamily:'DM Sans,sans-serif', fontSize:12, color:lp.tm, margin:0 }}>© 2025 Contractly. Built in India 🇮🇳</p>
      </div>
    </footer>
  );
}

/* ── Page ── */
export default function LandingPage() {
  return (
    <div style={{ background:lp.navy, minHeight:'100vh' }}>
      <title>Contractly — Contracts that close deals</title>
      <LandingNav />
      <HeroSection />
      <ProductPreview />
      <FeaturesSection />
      <HowItWorks />
      <Testimonials />
      <CtaSection />
      <LandingFooter />
    </div>
  );
}
