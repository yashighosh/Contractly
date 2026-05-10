import React from 'react';
import { motion } from 'framer-motion';
import { Search, FileText, ArrowRight, Zap, Filter } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import LandingNav from '../components/landing/LandingNav';
import LandingFooter from '../components/landing/LandingFooter';
import { lp, inView } from '../utils/landingTheme';

const CATEGORIES = [
  { name: 'Development', count: 12, icon: Zap, color: '#3B82F6' },
  { name: 'Design', count: 8, icon: Zap, color: '#EC4899' },
  { name: 'Marketing', count: 10, icon: Zap, color: '#10B981' },
  { name: 'Legal', count: 6, icon: Zap, color: '#FACC15' },
  { name: 'Photography', count: 5, icon: Zap, color: '#8B5CF6' },
];

const TEMPLATES = [
  { name: 'Web Dev Agreement', cat: 'Development', desc: 'Comprehensive agreement covering IP, payment terms, and scope.' },
  { name: 'Brand Identity Design', cat: 'Design', desc: 'Perfect for logo and brand system projects with revision limits.' },
  { name: 'Social Media Management', cat: 'Marketing', desc: 'SLA-focused contract for recurring monthly management.' },
  { name: 'Freelance NDA', cat: 'Legal', desc: 'Strict non-disclosure agreement for early-stage client chats.' },
  { name: 'Wedding Photography', cat: 'Photography', desc: 'Covers event details, delivery dates, and usage rights.' },
  { name: 'SEO Audit Services', cat: 'Marketing', desc: 'Detailed scope for one-off SEO audits and reporting.' },
];

export default function TemplatesPage() {
  const navigate = useNavigate();
  const [activeCat, setActiveCat] = React.useState('All');

  const filtered = activeCat === 'All' ? TEMPLATES : TEMPLATES.filter(t => t.cat === activeCat);

  return (
    <div style={{ background: lp.navy, minHeight: '100vh', overflowX:'hidden' }}>
      <LandingNav />
      
      {/* Hero Header */}
      <section style={{ padding: '160px 5vw 60px', textAlign: 'center', position: 'relative' }}>
        <div style={{ position:'absolute', top:0, left:'50%', transform:'translateX(-50%)', width:'60%', height:'100%', background:`radial-gradient(circle, ${lp.gold}08, transparent 70%)`, pointerEvents:'none' }} />
        
        <motion.div initial={{opacity:0, y:20}} animate={{opacity:1, y:0}} transition={{duration:0.6}}>
          <p style={{ fontFamily:'DM Sans,sans-serif', fontSize:14, fontWeight:700, color:lp.gold, textTransform:'uppercase', letterSpacing:'0.15em', marginBottom:16 }}>Template Library</p>
          <h1 style={{ fontFamily:'Lora,Georgia,serif', fontSize:'clamp(40px,6vw,64px)', fontWeight:600, color:lp.tp, margin:'0 0 24px', letterSpacing:'-0.02em' }}>
            Ready-to-use <span style={{ color:lp.gold, fontStyle:'italic' }}>legal templates</span>
          </h1>
          <p style={{ fontFamily:'DM Sans,sans-serif', fontSize:18, color:lp.ts, maxWidth:600, margin:'0 auto 40px' }}>
            Start with professionally drafted contracts for every niche. Just fill in the blanks and send for signing.
          </p>
          
          <div style={{ maxWidth: 600, margin: '0 auto', position: 'relative' }}>
             <Search size={20} style={{ position: 'absolute', left: 24, top: '50%', transform: 'translateY(-50%)', color: lp.tm }} />
             <input 
               type="text" 
               placeholder="Search for a contract type (e.g. 'Web Dev')" 
               style={{ 
                 width: '100%', 
                 padding: '20px 24px 20px 60px', 
                 borderRadius: 20, 
                 background: 'rgba(255,255,255,0.03)', 
                 border: `1px solid ${lp.border}`, 
                 color: lp.tp, 
                 fontFamily: 'DM Sans,sans-serif', 
                 fontSize: 16,
                 outline: 'none',
                 transition: 'all 0.3s'
               }}
               onFocus={e => e.target.style.borderColor = lp.gold}
               onBlur={e => e.target.style.borderColor = lp.border}
             />
          </div>
        </motion.div>
      </section>

      {/* Category Chips */}
      <section style={{ padding: '0 5vw 40px' }}>
        <div className="flex flex-wrap items-center justify-center gap-3">
          {['All', ...CATEGORIES.map(c => c.name)].map(cat => (
            <button
              key={cat}
              onClick={() => setActiveCat(cat)}
              style={{
                padding: '10px 24px',
                borderRadius: 12,
                border: activeCat === cat ? `1px solid ${lp.gold}` : `1px solid ${lp.border}`,
                background: activeCat === cat ? lp.goldDim : 'rgba(255,255,255,0.02)',
                color: activeCat === cat ? lp.gold : lp.ts,
                fontFamily: 'DM Sans,sans-serif',
                fontSize: 14,
                fontWeight: 600,
                cursor: 'pointer',
                transition: 'all 0.2s'
              }}
            >
              {cat}
            </button>
          ))}
        </div>
      </section>

      {/* Templates Grid */}
      <section style={{ padding: '0 5vw 120px' }}>
        <div style={{ maxWidth: 1200, margin: '0 auto', display: 'grid', gap: 24, gridTemplateColumns: 'repeat(auto-fill, minmax(340px, 1fr))' }}>
          {filtered.map((t, i) => (
            <motion.div
              key={t.name}
              initial={{ opacity: 0, scale: 0.95 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.05, duration: 0.4 }}
              style={{
                background: lp.card,
                border: `1px solid ${lp.border}`,
                borderRadius: 24,
                padding: '32px',
                cursor: 'pointer',
                transition: 'all 0.4s cubic-bezier(0.16, 1, 0.3, 1)',
                display:'flex',
                flexDirection:'column'
              }}
              onMouseEnter={e => {
                e.currentTarget.style.transform = 'translateY(-8px)';
                e.currentTarget.style.borderColor = 'rgba(250, 204, 21, 0.3)';
                e.currentTarget.style.background = 'rgba(30, 41, 59, 0.8)';
              }}
              onMouseLeave={e => {
                e.currentTarget.style.transform = 'translateY(0)';
                e.currentTarget.style.borderColor = lp.border;
                e.currentTarget.style.background = lp.card;
              }}
              onClick={() => navigate('/register')}
            >
              <div style={{ width: 44, height: 44, borderRadius: 12, background: 'rgba(255,255,255,0.03)', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: 20 }}>
                <FileText size={20} style={{ color: lp.gold }} />
              </div>
              <div style={{ marginBottom: 20 }}>
                <span style={{ fontSize: 11, fontWeight: 800, color: lp.gold, textTransform: 'uppercase', letterSpacing: '0.1em' }}>{t.cat}</span>
                <h3 style={{ fontFamily: 'DM Sans,sans-serif', fontSize: 18, fontWeight: 700, color: lp.tp, margin: '4px 0 8px' }}>{t.name}</h3>
                <p style={{ fontFamily: 'DM Sans,sans-serif', fontSize: 14, color: lp.ts, lineHeight: 1.6 }}>{t.desc}</p>
              </div>
              <div style={{ marginTop: 'auto', display: 'flex', alignItems: 'center', gap: 6, fontSize: 14, fontWeight: 600, color: lp.tp }}>
                Use this template <ArrowRight size={14} />
              </div>
            </motion.div>
          ))}
        </div>
      </section>

      <LandingFooter />
    </div>
  );
}
