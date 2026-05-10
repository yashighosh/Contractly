import React from 'react';
import { motion } from 'framer-motion';
import { Check, ArrowRight, Zap, Star } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import LandingNav from '../components/landing/LandingNav';
import LandingFooter from '../components/landing/LandingFooter';
import { lp, inView } from '../utils/landingTheme';

const PLANS = [
  {
    name: 'Free',
    price: '0',
    desc: 'For freelancers starting out.',
    features: ['3 active contracts', '5 clauses in library', 'Standard PDF export', 'Email signatures', 'Basic audit trail'],
    cta: 'Start for free',
    popular: false
  },
  {
    name: 'Pro',
    price: '999',
    desc: 'For busy freelancers & agencies.',
    features: ['Unlimited contracts', 'Unlimited clause library', 'Custom branding', 'Aadhaar e-Signatures', 'Advanced revenue dashboard', 'Bulk contract sending', 'Priority support'],
    cta: 'Get Pro now',
    popular: true
  },
  {
    name: 'Team',
    price: '2,499',
    desc: 'For scaling agencies & teams.',
    features: ['Everything in Pro', 'Up to 5 team members', 'Shared templates', 'Role-based access', 'Approval workflows', 'API access (Beta)', 'Dedicated account manager'],
    cta: 'Contact Sales',
    popular: false
  }
];

export default function PricingPage() {
  const navigate = useNavigate();

  return (
    <div style={{ background: lp.navy, minHeight: '100vh', overflowX:'hidden' }}>
      <LandingNav />
      
      {/* Hero Header */}
      <section style={{ padding: '160px 5vw 80px', textAlign: 'center', position: 'relative' }}>
        <div style={{ position:'absolute', top:0, left:'50%', transform:'translateX(-50%)', width:'60%', height:'100%', background:`radial-gradient(circle, ${lp.gold}08, transparent 70%)`, pointerEvents:'none' }} />
        
        <motion.div initial={{opacity:0, y:20}} animate={{opacity:1, y:0}} transition={{duration:0.6}}>
          <p style={{ fontFamily:'DM Sans,sans-serif', fontSize:14, fontWeight:700, color:lp.gold, textTransform:'uppercase', letterSpacing:'0.15em', marginBottom:16 }}>Pricing Plans</p>
          <h1 style={{ fontFamily:'Lora,Georgia,serif', fontSize:'clamp(40px,6vw,64px)', fontWeight:600, color:lp.tp, margin:'0 0 24px', letterSpacing:'-0.02em' }}>
            Simple pricing for <span style={{ color:lp.gold, fontStyle:'italic' }}>complete protection</span>
          </h1>
          <p style={{ fontFamily:'DM Sans,sans-serif', fontSize:18, color:lp.ts, maxWidth:600, margin:'0 auto' }}>
            Choose the plan that fits your growth. No hidden fees, no complicated tiers. Cancel anytime.
          </p>
        </motion.div>
      </section>

      {/* Pricing Cards */}
      <section style={{ padding: '0 5vw 120px' }}>
        <div style={{ maxWidth: 1200, margin: '0 auto', display: 'grid', gap: 24, gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))' }}>
          {PLANS.map((plan, i) => (
            <motion.div
              key={plan.name}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1, duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
              style={{
                background: plan.popular ? 'rgba(30, 41, 59, 0.8)' : lp.card,
                border: plan.popular ? `2px solid ${lp.gold}44` : `1px solid ${lp.border}`,
                borderRadius: 32,
                padding: '48px 32px',
                display: 'flex',
                flexDirection: 'column',
                position: 'relative',
                transition: 'all 0.3s',
                boxShadow: plan.popular ? `0 30px 60px -12px rgba(0,0,0,0.5)` : 'none'
              }}
              onMouseEnter={e => {
                if(!plan.popular) e.currentTarget.style.borderColor = 'rgba(255,255,255,0.2)';
                e.currentTarget.style.transform = 'translateY(-12px)';
              }}
              onMouseLeave={e => {
                if(!plan.popular) e.currentTarget.style.borderColor = lp.border;
                e.currentTarget.style.transform = 'translateY(0)';
              }}
            >
              {plan.popular && (
                <div style={{ position: 'absolute', top: 20, right: 24, background: lp.gold, color: lp.navy, padding: '6px 14px', borderRadius: 999, fontSize: 12, fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                  Most Popular
                </div>
              )}
              
              <div style={{ marginBottom: 32 }}>
                <h3 style={{ fontFamily: 'DM Sans,sans-serif', fontSize: 24, fontWeight: 700, color: lp.tp, marginBottom: 8 }}>{plan.name}</h3>
                <div style={{ display: 'flex', alignItems: 'baseline', gap: 4, marginBottom: 16 }}>
                  <span style={{ fontFamily: 'DM Sans,sans-serif', fontSize: 48, fontWeight: 800, color: lp.tp }}>₹{plan.price}</span>
                  <span style={{ fontFamily: 'DM Sans,sans-serif', fontSize: 16, color: lp.tm }}>/month</span>
                </div>
                <p style={{ fontFamily: 'DM Sans,sans-serif', fontSize: 15, color: lp.ts, lineHeight: 1.5 }}>{plan.desc}</p>
              </div>

              <div style={{ flex: 1, marginBottom: 40 }}>
                <h4 style={{ fontFamily: 'DM Sans,sans-serif', fontSize: 13, fontWeight: 700, color: lp.tp, textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: 20 }}>What's included</h4>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
                  {plan.features.map(f => (
                    <div key={f} style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                      <div style={{ width: 20, height: 20, borderRadius: '50%', background: `${lp.em}22`, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                        <Check size={12} style={{ color: lp.em }} strokeWidth={3} />
                      </div>
                      <span style={{ fontFamily: 'DM Sans,sans-serif', fontSize: 15, color: lp.ts }}>{f}</span>
                    </div>
                  ))}
                </div>
              </div>

              <button
                onClick={() => navigate('/register')}
                style={{
                  width: '100%',
                  padding: '18px',
                  borderRadius: 16,
                  border: 'none',
                  background: plan.popular ? lp.gold : 'rgba(255,255,255,0.05)',
                  color: plan.popular ? lp.navy : lp.tp,
                  fontFamily: 'DM Sans,sans-serif',
                  fontSize: 16,
                  fontWeight: 700,
                  cursor: 'pointer',
                  transition: 'all 0.3s',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: 10,
                  boxShadow: plan.popular ? `0 20px 40px -10px ${lp.gold}44` : 'none'
                }}
                onMouseEnter={e => {
                  if(plan.popular) e.currentTarget.style.background = lp.goldLt;
                  else e.currentTarget.style.background = 'rgba(255,255,255,0.1)';
                }}
                onMouseLeave={e => {
                  if(plan.popular) e.currentTarget.style.background = lp.gold;
                  else e.currentTarget.style.background = 'rgba(255,255,255,0.05)';
                }}
              >
                {plan.cta} <ArrowRight size={18} />
              </button>
            </motion.div>
          ))}
        </div>
      </section>

      {/* FAQ Section Placeholder */}
      <section style={{ padding: '80px 5vw 120px', background: lp.mid, borderTop: `1px solid ${lp.border}` }}>
         <div style={{ maxWidth: 800, margin: '0 auto' }}>
            <h2 style={{ fontFamily: 'Lora,Georgia,serif', fontSize: 32, fontWeight: 600, color: lp.tp, textAlign: 'center', marginBottom: 56 }}>Frequently Asked Questions</h2>
            <div style={{ display: 'grid', gap: 32 }}>
               {[
                 { q: 'Can I switch plans later?', a: 'Yes, you can upgrade or downgrade your plan at any time from your dashboard settings. Changes are reflected instantly.' },
                 { q: 'Are these contracts legally binding?', a: 'Absolutely. Our contracts are drafted by legal experts for Indian law and utilize IT Act-compliant e-signatures.' },
                 { q: 'What happens if I cancel?', a: 'Your existing contracts will always be accessible for download. You just won\'t be able to create new ones if you exceed the free tier limit.' }
               ].map(faq => (
                 <div key={faq.q}>
                    <h4 style={{ fontFamily: 'DM Sans,sans-serif', fontSize: 18, fontWeight: 700, color: lp.tp, marginBottom: 12 }}>{faq.q}</h4>
                    <p style={{ fontFamily: 'DM Sans,sans-serif', fontSize: 16, color: lp.ts, lineHeight: 1.6 }}>{faq.a}</p>
                 </div>
               ))}
            </div>
         </div>
      </section>

      <LandingFooter />
    </div>
  );
}
