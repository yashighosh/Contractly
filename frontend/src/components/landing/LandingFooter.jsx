import React from 'react';
import { Link } from 'react-router-dom';
import { lp } from '../../utils/landingTheme';

export default function LandingFooter() {
  return (
    <footer style={{ background:lp.mid, borderTop:`1px solid ${lp.border}`, padding:'48px 5vw' }}>
      <div className="max-w-[1200px] mx-auto">
        <div className="flex flex-col md:flex-row items-start justify-between gap-12 mb-24">
          <div style={{ maxWidth: 300 }}>
            <div style={{ fontFamily:'Lora,Georgia,serif', fontSize:20, fontWeight:700, color:lp.tp, display:'flex', alignItems:'center', gap:10, marginBottom:16 }}>
              <img src="/logo.svg" alt="Contractly" style={{ width: 28, height: 28 }} />
              Contractly
            </div>
            <p style={{ fontFamily:'DM Sans,sans-serif', fontSize:14, color:lp.tm, lineHeight:1.6 }}>
              The most powerful contract management platform built for the modern Indian freelancer and agency.
            </p>
          </div>
          
          <div className="grid grid-cols-2 md:grid-cols-3 gap-12 md:gap-24">
            <div>
              <h4 style={{ fontFamily:'DM Sans,sans-serif', fontSize:14, fontWeight:700, color:lp.tp, marginBottom:20, textTransform:'uppercase', letterSpacing:'0.05em' }}>Product</h4>
              <div className="flex flex-col gap-4">
                {['Features','Pricing','Templates'].map(l => (
                  <Link key={l} to={l==='Templates'?'/templates-public':`/#${l.toLowerCase()}`} style={{ fontFamily:'DM Sans,sans-serif', fontSize:14, color:lp.tm, textDecoration:'none', transition:'color 150ms' }}
                    onMouseEnter={e=>e.target.style.color=lp.gold} onMouseLeave={e=>e.target.style.color=lp.tm}>{l}</Link>
                ))}
              </div>
            </div>
            <div>
              <h4 style={{ fontFamily:'DM Sans,sans-serif', fontSize:14, fontWeight:700, color:lp.tp, marginBottom:20, textTransform:'uppercase', letterSpacing:'0.05em' }}>Company</h4>
              <div className="flex flex-col gap-4">
                {['About','Careers','Contact'].map(l => (
                  <Link key={l} to="#" style={{ fontFamily:'DM Sans,sans-serif', fontSize:14, color:lp.tm, textDecoration:'none', transition:'color 150ms' }}
                    onMouseEnter={e=>e.target.style.color=lp.gold} onMouseLeave={e=>e.target.style.color=lp.tm}>{l}</Link>
                ))}
              </div>
            </div>
            <div>
              <h4 style={{ fontFamily:'DM Sans,sans-serif', fontSize:14, fontWeight:700, color:lp.tp, marginBottom:20, textTransform:'uppercase', letterSpacing:'0.05em' }}>Legal</h4>
              <div className="flex flex-col gap-4">
                {['Privacy','Terms','Compliance'].map(l => (
                  <Link key={l} to="#" style={{ fontFamily:'DM Sans,sans-serif', fontSize:14, color:lp.tm, textDecoration:'none', transition:'color 150ms' }}
                    onMouseEnter={e=>e.target.style.color=lp.gold} onMouseLeave={e=>e.target.style.color=lp.tm}>{l}</Link>
                ))}
              </div>
            </div>
          </div>
        </div>
        
        <div style={{ borderTop:`1px solid ${lp.border}`, paddingTop:24, display:'flex', flexWrap:'wrap', alignItems:'center', justifyContent:'space-between', gap:16 }}>
          <p style={{ fontFamily:'DM Sans,sans-serif', fontSize:13, color:lp.tm, margin:0 }}>© 2025 Contractly. Built with ❤️ in India 🇮🇳</p>
          <div className="flex gap-6">
             {/* Social links placeholder */}
             {['Twitter','LinkedIn','Instagram'].map(s => (
               <Link key={s} to="#" style={{ fontFamily:'DM Sans,sans-serif', fontSize:13, color:lp.tm, textDecoration:'none' }}
                 onMouseEnter={e=>e.target.style.color=lp.tp} onMouseLeave={e=>e.target.style.color=lp.tm}>{s}</Link>
             ))}
          </div>
        </div>
      </div>
    </footer>
  );
}
