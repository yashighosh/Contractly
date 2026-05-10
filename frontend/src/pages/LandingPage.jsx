import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Menu, Download, PlayCircle, Check, ArrowRight, Zap, FileText, PenLine, BarChart2, Copy, Clock, Users } from 'lucide-react';
import { useAuthStore } from '../store/authStore';

import LandingNav from '../components/landing/LandingNav';
import LandingFooter from '../components/landing/LandingFooter';
import { lp, inView } from '../utils/landingTheme';

/* ── Hero ── */
function HeroSection() {
  const nav = useNavigate();
  return (
    <section style={{ minHeight:'92vh', background:lp.navy, display:'flex', alignItems:'center', justifyContent:'center', position:'relative', overflow:'hidden' }}>
      <div style={{ position:'absolute', inset:0, background:'radial-gradient(circle at 50% -20%, rgba(250, 204, 21, 0.12), transparent 70%)', pointerEvents:'none' }} />
      <div style={{ position:'absolute', inset:0, background:'radial-gradient(circle at 80% 80%, rgba(16, 185, 129, 0.08), transparent 50%)', pointerEvents:'none' }} />
      <div style={{ position:'absolute', inset:0, backgroundImage:`linear-gradient(${lp.border} 1px, transparent 1px),linear-gradient(90deg, ${lp.border} 1px, transparent 1px)`, backgroundSize:'64px 64px', opacity:0.1, pointerEvents:'none' }} />
      <motion.div initial={{opacity:0,y:20}} animate={{opacity:1,y:0}} transition={{duration:0.8, ease:[0.16, 1, 0.3, 1]}} style={{ textAlign:'center', padding:'0 5vw', maxWidth:850, position:'relative', zIndex:1 }}>
        <motion.div initial={{opacity:0, scale:0.9}} animate={{opacity:1, scale:1}} transition={{delay:0.1}} style={{ display:'inline-flex', alignItems:'center', gap:10, border:`1px solid rgba(250, 204, 21, 0.3)`, borderRadius:999, padding:'6px 16px', marginBottom:32, background:'rgba(250, 204, 21, 0.05)', backdropFilter:'blur(8px)' }}>
          <span style={{ width:8, height:8, borderRadius:'50%', background:lp.gold, boxShadow:`0 0 12px ${lp.gold}` }} />
          <span style={{ fontFamily:'DM Sans,sans-serif', fontSize:13, fontWeight:600, color:lp.gold, letterSpacing:'0.02em' }}>Trusted by 2,000+ Indian Freelancers</span>
        </motion.div>
        <motion.h1 initial={{opacity:0,y:10}} animate={{opacity:1,y:0}} transition={{delay:0.2}} style={{ fontFamily:'Lora,Georgia,serif', fontWeight:600, fontSize:'clamp(40px,7vw,72px)', color:lp.tp, lineHeight:1.05, margin:'0 0 24px', letterSpacing:'-0.03em' }}>
          Contracts that <span style={{ color:lp.gold, position:'relative' }}>close deals<svg style={{ position:'absolute', bottom:-10, left:0, width:'100%', height:12 }} viewBox="0 0 100 12" preserveAspectRatio="none"><path d="M0 10 Q 50 0 100 10" stroke={lp.gold} strokeWidth="3" fill="none" opacity="0.4" /></svg></span>,<br/>not conversations
        </motion.h1>
        <motion.p initial={{opacity:0,y:10}} animate={{opacity:1,y:0}} transition={{delay:0.3}} style={{ fontFamily:'DM Sans,sans-serif', fontSize:18, color:lp.ts, maxWidth:580, margin:'0 auto 40px', lineHeight:1.6 }}>
          Draft, send, and get contracts signed in minutes. Built for the modern Indian economy with GST support and legally valid e-signatures.
        </motion.p>
        <motion.div initial={{opacity:0,y:10}} animate={{opacity:1,y:0}} transition={{delay:0.4}} className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-12">
          <button onClick={()=>nav('/register')} style={{ fontFamily:'DM Sans,sans-serif', fontWeight:700, fontSize:16, color:lp.navy, background:lp.gold, border:'none', borderRadius:14, padding:'16px 32px', cursor:'pointer', display:'flex', alignItems:'center', gap:10, transition:'all 0.3s cubic-bezier(0.16, 1, 0.3, 1)', boxShadow:`0 10px 30px -10px ${lp.gold}66` }}
            onMouseEnter={e=>{e.currentTarget.style.transform='translateY(-4px) scale(1.02)';e.currentTarget.style.boxShadow=`0 20px 40px -10px ${lp.gold}88`}} onMouseLeave={e=>{e.currentTarget.style.transform='translateY(0) scale(1)';e.currentTarget.style.boxShadow=`0 10px 30px -10px ${lp.gold}66`}}>
            <Download size={20} /> Start for free
          </button>
          <button style={{ fontFamily:'DM Sans,sans-serif', fontWeight:600, fontSize:16, color:lp.tp, background:'rgba(255,255,255,0.03)', border:`1px solid ${lp.border}`, borderRadius:14, padding:'16px 32px', cursor:'pointer', display:'flex', alignItems:'center', gap:10, transition:'all 0.3s', backdropFilter:'blur(10px)' }}
            onMouseEnter={e=>{e.currentTarget.style.background='rgba(255,255,255,0.08)';e.currentTarget.style.borderColor=lp.gold}} onMouseLeave={e=>{e.currentTarget.style.background='rgba(255,255,255,0.03)';e.currentTarget.style.borderColor=lp.border}}>
            <PlayCircle size={20} /> Watch demo
          </button>
        </motion.div>
        <motion.div initial={{opacity:0}} animate={{opacity:1}} transition={{delay:0.6}} className="flex flex-wrap items-center justify-center gap-x-8 gap-y-3">
          {['No credit card','Legally valid','GST-ready','5 min setup'].map((t,i)=>(
            <span key={i} style={{ fontFamily:'DM Sans,sans-serif', fontSize:14, fontWeight:500, color:lp.tm, display:'flex', alignItems:'center', gap:6 }}>
              <div style={{ width:16, height:16, borderRadius:'50%', background:`${lp.em}22`, display:'flex', alignItems:'center', justifyContent:'center' }}>
                <Check size={10} style={{ color:lp.em }} strokeWidth={3} />
              </div>
              {t}
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
    <motion.section {...inView} id="features" style={{ padding:'120px 5vw', background:lp.mid, position:'relative' }}>
      <div style={{ position:'absolute', top:0, left:'10%', width:'30%', height:'30%', background:`radial-gradient(circle, ${lp.gold}05, transparent 70%)`, pointerEvents:'none' }} />
      <div style={{ textAlign:'center', marginBottom:72, position:'relative' }}>
        <p style={{ fontFamily:'DM Sans,sans-serif', fontSize:14, fontWeight:700, color:lp.gold, textTransform:'uppercase', letterSpacing:'0.15em', marginBottom:16 }}>The Powerhouse</p>
        <h2 style={{ fontFamily:'Lora,Georgia,serif', fontSize:'clamp(32px,5vw,48px)', fontWeight:600, color:lp.tp, margin:0, letterSpacing:'-0.02em' }}>Everything you need, <span style={{ color:lp.gold, fontStyle:'italic' }}>nothing you don't</span></h2>
      </div>
      <div style={{ maxWidth:1100, margin:'0 auto', display:'grid', gap:24 }} className="grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
        {FEATURES.map(({icon:Icon,t,d},i)=>(
          <motion.div key={t} initial={{opacity:0,y:20}} whileInView={{opacity:1,y:0}} viewport={{once:true}} transition={{delay:i*0.1,duration:0.6, ease:[0.16, 1, 0.3, 1]}}
            style={{ 
              background:lp.card, 
              border:`1px solid ${lp.border}`, 
              borderRadius:24, 
              padding:'40px 32px', 
              position:'relative', 
              overflow:'hidden', 
              cursor:'default', 
              transition:'all 0.4s cubic-bezier(0.16, 1, 0.3, 1)',
              display:'flex', 
              flexDirection:'column', 
              alignItems:'flex-start' 
            }}
            onMouseEnter={e=>{
              e.currentTarget.style.background='rgba(30, 41, 59, 0.8)';
              e.currentTarget.style.borderColor='rgba(250, 204, 21, 0.3)';
              e.currentTarget.style.transform='translateY(-8px)';
              const bg = e.currentTarget.querySelector('.icon-bg');
              if(bg) { bg.style.background=lp.gold; bg.style.transform='rotate(10deg) scale(1.1)'; }
              const icon = e.currentTarget.querySelector('.icon');
              if(icon) { icon.style.color=lp.navy; }
              const glow = e.currentTarget.querySelector('.glow');
              if(glow) { glow.style.opacity='1'; }
            }}
            onMouseLeave={e=>{
              e.currentTarget.style.background=lp.card;
              e.currentTarget.style.borderColor=lp.border;
              e.currentTarget.style.transform='translateY(0)';
              const bg = e.currentTarget.querySelector('.icon-bg');
              if(bg) { bg.style.background='rgba(255,255,255,0.03)'; bg.style.transform='rotate(0deg) scale(1)'; }
              const icon = e.currentTarget.querySelector('.icon');
              if(icon) { icon.style.color=lp.gold; }
              const glow = e.currentTarget.querySelector('.glow');
              if(glow) { glow.style.opacity='0'; }
            }}
          >
            <div className="glow" style={{ position:'absolute', inset:0, background:`radial-gradient(circle at 50% 0%, ${lp.gold}11, transparent 70%)`, opacity:0, transition:'opacity 0.4s' }} />
            <div className="icon-bg" style={{ width:52, height:52, borderRadius:16, background:'rgba(255,255,255,0.03)', border:`1px solid ${lp.border}`, display:'flex', alignItems:'center', justifyContent:'center', marginBottom:24, transition:'all 0.4s' }}>
              <Icon className="icon" size={24} style={{ color:lp.gold, transition:'color 0.4s' }} />
            </div>
            <h3 style={{ fontFamily:'DM Sans,sans-serif', fontSize:18, fontWeight:700, color:lp.tp, margin:'0 0 12px' }}>{t}</h3>
            <p style={{ fontFamily:'DM Sans,sans-serif', fontSize:15, color:lp.ts, lineHeight:1.6, margin:0 }}>{d}</p>
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
    <motion.section {...inView} style={{ padding:'120px 5vw', background:lp.mid, position:'relative' }}>
      <div style={{ textAlign:'center', marginBottom:64 }}>
        <p style={{ fontFamily:'DM Sans,sans-serif', fontSize:14, fontWeight:700, color:lp.gold, textTransform:'uppercase', letterSpacing:'0.15em', marginBottom:16 }}>Social proof</p>
        <h2 style={{ fontFamily:'Lora,Georgia,serif', fontSize:'clamp(32px,5vw,48px)', fontWeight:600, color:lp.tp, margin:0, letterSpacing:'-0.02em' }}>
          Freelancers finally feel <span style={{ color:lp.gold, fontStyle:'italic' }}>protected</span>
        </h2>
      </div>
      <div style={{ maxWidth:1100, margin:'0 auto', display:'grid', gap:24 }} className="grid-cols-1 md:grid-cols-3">
        {TESTIMONIALS.map(({q,name,role,init,c},i)=>(
          <motion.div 
            key={name} 
            initial={{opacity:0, y:30, scale:0.95}} 
            whileInView={{opacity:1, y:0, scale:1}} 
            viewport={{once:true}} 
            transition={{delay:i*0.15, duration:0.6, ease:[0.16, 1, 0.3, 1]}}
            style={{ 
              background:lp.card, 
              border:`1px solid ${lp.border}`, 
              borderRadius:24, 
              padding:'32px', 
              transition:'all 0.4s cubic-bezier(0.16, 1, 0.3, 1)', 
              cursor:'default',
              display:'flex',
              flexDirection:'column',
              justifyContent:'space-between',
              height:'100%'
            }}
            onMouseEnter={e=>{
              e.currentTarget.style.borderColor='rgba(250, 204, 21, 0.3)';
              e.currentTarget.style.transform='translateY(-10px) scale(1.02)';
              e.currentTarget.style.background='rgba(30, 41, 59, 0.8)';
            }}
            onMouseLeave={e=>{
              e.currentTarget.style.borderColor=lp.border;
              e.currentTarget.style.transform='translateY(0) scale(1)';
              e.currentTarget.style.background=lp.card;
            }}
          >
            <div>
              <div style={{ display:'flex', gap:2, marginBottom:20 }}>
                {[1,2,3,4,5].map(star=><span key={star} style={{ color:lp.gold, fontSize:16 }}>★</span>)}
              </div>
              <p style={{ fontFamily:'DM Sans,sans-serif', fontSize:15, color:lp.ts, lineHeight:1.7, fontStyle:'italic', margin:'0 0 32px' }}>"{q}"</p>
            </div>
            <div style={{ display:'flex', alignItems:'center', gap:12 }}>
              <div style={{ width:44, height:44, borderRadius:12, background:c, display:'flex', alignItems:'center', justifyContent:'center', fontFamily:'DM Sans,sans-serif', fontSize:14, fontWeight:800, color:'#020617', boxShadow:'0 8px 16px -4px rgba(0,0,0,0.4)' }}>{init}</div>
              <div>
                <div style={{ fontFamily:'DM Sans,sans-serif', fontSize:14, fontWeight:700, color:lp.tp }}>{name}</div>
                <div style={{ fontFamily:'DM Sans,sans-serif', fontSize:12, fontWeight:500, color:lp.tm }}>{role}</div>
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
    <motion.section {...inView} style={{ padding:'120px 5vw', background:lp.navy, position:'relative', overflow:'hidden' }}>
      {/* Background Orbs */}
      <div style={{ position:'absolute', top:'-10%', left:'-10%', width:'40%', height:'80%', background:`radial-gradient(circle, ${lp.gold}11, transparent 70%)`, filter:'blur(60px)', pointerEvents:'none' }} />
      <div style={{ position:'absolute', bottom:'-10%', right:'-10%', width:'40%', height:'80%', background:`radial-gradient(circle, ${lp.em}08, transparent 70%)`, filter:'blur(60px)', pointerEvents:'none' }} />
      
      <div style={{ maxWidth:1000, margin:'0 auto', background:'rgba(255,255,255,0.01)', border:`1px solid ${lp.border}`, borderRadius:40, padding:'80px 40px', position:'relative', backdropFilter:'blur(20px)', overflow:'hidden' }}>
        {/* Card Shine */}
        <div style={{ position:'absolute', top:0, left:0, right:0, height:1, background:`linear-gradient(90deg, transparent, rgba(255,255,255,0.1), transparent)` }} />
        
        <motion.div initial={{opacity:0, y:20}} whileInView={{opacity:1, y:0}} viewport={{once:true}} transition={{duration:0.6}}>
          <h2 style={{ fontFamily:'Lora,Georgia,serif', fontSize:'clamp(32px,6vw,56px)', fontWeight:600, color:lp.tp, margin:'0 0 24px', lineHeight:1.1, letterSpacing:'-0.02em' }}>
            Stop losing money to <br/>
            <span style={{ color:lp.gold, position:'relative' }}>
              unsigned contracts
              <svg style={{ position:'absolute', bottom:-12, left:0, width:'100%', height:12 }} viewBox="0 0 100 12" preserveAspectRatio="none"><path d="M0 10 Q 50 0 100 10" stroke={lp.gold} strokeWidth="3" fill="none" opacity="0.4" /></svg>
            </span>
          </h2>
          <p style={{ fontFamily:'DM Sans,sans-serif', fontSize:20, color:lp.ts, maxWidth:600, margin:'0 auto 48px', lineHeight:1.6 }}>
            Join 2,000+ Indian freelancers who save 10+ hours a month by getting signed faster.
          </p>
          
          <div className="flex flex-col items-center gap-6">
            <button onClick={()=>nav('/register')} style={{ fontFamily:'DM Sans,sans-serif', fontWeight:700, fontSize:18, color:lp.navy, background:lp.gold, border:'none', borderRadius:16, padding:'20px 48px', cursor:'pointer', display:'inline-flex', alignItems:'center', gap:12, transition:'all 0.3s cubic-bezier(0.16, 1, 0.3, 1)', boxShadow:`0 20px 40px -10px ${lp.gold}44` }}
              onMouseEnter={e=>{e.currentTarget.style.transform='translateY(-6px) scale(1.02)';e.currentTarget.style.boxShadow=`0 30px 60px -12px ${lp.gold}66`}}
              onMouseLeave={e=>{e.currentTarget.style.transform='translateY(0) scale(1)';e.currentTarget.style.boxShadow=`0 20px 40px -10px ${lp.gold}44`}}>
              Create your first contract — free <ArrowRight size={20} />
            </button>
            <div style={{ display:'flex', alignItems:'center', gap:24 }}>
              {['No credit card required', 'Legally valid in India', 'Cancel anytime'].map(t => (
                <div key={t} style={{ display:'flex', alignItems:'center', gap:8, fontFamily:'DM Sans,sans-serif', fontSize:14, fontWeight:500, color:lp.tm }}>
                  <div style={{ width:18, height:18, borderRadius:'50%', background:`${lp.em}22`, display:'flex', alignItems:'center', justifyContent:'center' }}>
                    <Check size={12} style={{ color:lp.em }} strokeWidth={3} />
                  </div>
                  {t}
                </div>
              ))}
            </div>
          </div>
        </motion.div>
      </div>
    </motion.section>
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
