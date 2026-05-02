import { useState, useRef } from 'react';
import { useParams } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import SignatureCanvas from 'react-signature-canvas';
import confetti from 'canvas-confetti';
import { Zap, PenLine, Type, CheckCircle, Shield, Download, Check } from 'lucide-react';
import { Button } from '../components/ui/Button';
import { cn } from '../utils/cn';

const MOCK_CONTRACT = {
  clientName: 'Priya Sharma',
  freelancerName: 'Rahul Verma',
  title: 'Website Redesign Contract',
  content: `<h1>Website Redesign Contract</h1>
<p>This agreement is between <strong>Priya Sharma</strong> (the "Client") and <strong>Rahul Verma</strong> (the "Freelancer"), effective from June 1, 2025.</p>
<h2>Scope of Work</h2>
<p>The Freelancer agrees to redesign the client's website, including homepage, about, services, and contact pages with modern design.</p>
<h2>Payment Terms</h2>
<p>The Client agrees to pay ₹85,000 for the completion of the services. 50% upfront, 50% on delivery.</p>
<h2>Timeline</h2>
<p>The project shall be completed within 30 days of contract signing.</p>
<h2>Confidentiality</h2>
<p>Both parties agree to maintain strict confidentiality regarding all proprietary information shared.</p>
<h2>Termination</h2>
<p>Either party may terminate this agreement with 14 days written notice.</p>`,
};

const fireConfetti = () => {
  confetti({ particleCount: 120, spread: 80, origin: { y: 0.6 }, colors: ['#4f46e5', '#10b981', '#f59e0b'] });
  setTimeout(() => confetti({ particleCount: 60, spread: 120, origin: { y: 0.5 }, colors: ['#4f46e5', '#a5b4fc', '#34d399'] }), 300);
};

export default function SignPage() {
  const { token } = useParams();
  const sigCanvasRef = useRef(null);
  const [signMode, setSignMode] = useState('draw'); // 'draw' | 'type'
  const [typedSig, setTypedSig] = useState('');
  const [fullName, setFullName] = useState('');
  const [agreed, setAgreed] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [signed, setSigned] = useState(false);
  const [errors, setErrors] = useState({});

  const clearCanvas = () => sigCanvasRef.current?.clear();

  const validate = () => {
    const e = {};
    if (!fullName.trim()) e.fullName = 'Full name is required';
    if (!agreed) e.agreed = 'You must agree to the terms';
    if (signMode === 'draw' && sigCanvasRef.current?.isEmpty()) e.sig = 'Please draw your signature';
    if (signMode === 'type' && !typedSig.trim()) e.sig = 'Please type your signature';
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleSign = async () => {
    if (!validate()) return;
    setSubmitting(true);
    await new Promise((r) => setTimeout(r, 1500));
    setSubmitting(false);
    setSigned(true);
    setTimeout(fireConfetti, 200);
  };

  if (signed) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-green-50 via-white to-brand-50 flex items-center justify-center p-6">
        <motion.div
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ type: 'spring', damping: 15 }}
          className="max-w-md w-full text-center"
        >
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.2, type: 'spring', damping: 12 }}
            className="w-24 h-24 rounded-full bg-green-100 border-4 border-green-200 flex items-center justify-center mx-auto mb-6"
          >
            <CheckCircle size={48} className="text-green-500" />
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="text-serif text-3xl text-gray-900 mb-2"
          >
            Contract Signed Successfully!
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
            className="text-gray-500 mb-2"
          >
            A copy has been sent to your email:
          </motion.p>
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.6 }}
            className="font-medium text-gray-800 mb-6"
          >
            priya@example.com
          </motion.p>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.65 }}
            className="text-sm text-gray-400 mb-8"
          >
            Signed on: June 3, 2025 · 11:15 AM IST
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.7 }}
          >
            <Button variant="primary" size="lg" icon={<Download size={16} />} fullWidth>
              Download My Copy
            </Button>
          </motion.div>

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.85 }}
            className="mt-8 pt-6 border-t border-gray-200"
          >
            <div className="flex items-center justify-center gap-2 text-sm text-gray-400">
              <Zap size={14} className="text-brand-400" />
              <span>Powered by <strong className="text-brand-500">Contractly</strong></span>
            </div>
            <a href="/" className="text-xs text-gray-400 hover:text-brand-500 transition-colors mt-1 block">
              Create your own contracts → contractly.in
            </a>
          </motion.div>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b border-gray-200 sticky top-0 z-10">
        <div className="max-w-4xl mx-auto px-4 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-lg bg-brand-500 flex items-center justify-center">
              <Zap size={14} className="text-white" />
            </div>
            <span className="text-serif text-lg text-gray-900">Contractly</span>
          </div>
          <span className="text-xs text-gray-400">Powered by Contractly</span>
        </div>
      </header>

      <div className="max-w-3xl mx-auto px-4 py-8">
        {/* Greeting */}
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="mb-8 text-center">
          <h1 className="text-serif text-3xl text-gray-900 mb-1">
            {MOCK_CONTRACT.clientName}, you've been sent a contract to sign
          </h1>
          <p className="text-gray-500">
            From: <strong>{MOCK_CONTRACT.freelancerName}</strong> · {MOCK_CONTRACT.title}
          </p>
        </motion.div>

        {/* Contract content */}
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0, transition: { delay: 0.1 } }}
          className="bg-white rounded-2xl border border-gray-200 shadow-sm mb-8 overflow-hidden"
        >
          <div className="px-8 py-10 max-h-[500px] overflow-y-auto">
            <div className="ProseMirror" dangerouslySetInnerHTML={{ __html: MOCK_CONTRACT.content }} />
          </div>
        </motion.div>

        {/* Signature section */}
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0, transition: { delay: 0.2 } }}
          className="bg-white rounded-2xl border border-gray-200 shadow-sm p-8 mb-6"
        >
          <h2 className="text-lg font-semibold text-gray-900 mb-5 flex items-center gap-2">
            <PenLine size={18} className="text-brand-500" />
            Sign Here
          </h2>

          {/* Mode toggle */}
          <div className="flex gap-1 bg-gray-100 rounded-xl p-1 mb-5 w-fit">
            {[
              { value: 'draw', label: 'Draw', icon: <PenLine size={14} /> },
              { value: 'type', label: 'Type', icon: <Type size={14} /> },
            ].map((m) => (
              <button
                key={m.value}
                onClick={() => setSignMode(m.value)}
                className={cn(
                  'flex items-center gap-1.5 px-4 py-2 rounded-lg text-sm font-medium transition-all',
                  signMode === m.value ? 'bg-white text-gray-900 shadow-sm' : 'text-gray-500 hover:text-gray-700'
                )}
              >
                {m.icon} {m.label}
              </button>
            ))}
          </div>

          <AnimatePresence mode="wait">
            {signMode === 'draw' ? (
              <motion.div
                key="draw"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.15 }}
              >
                <div className={cn('relative border-2 rounded-xl overflow-hidden bg-gray-50', errors.sig ? 'border-red-300' : 'border-gray-200')}>
                  <SignatureCanvas
                    ref={sigCanvasRef}
                    penColor="#1e1b4b"
                    canvasProps={{ className: 'w-full', height: 160 }}
                  />
                  <button
                    onClick={clearCanvas}
                    className="absolute bottom-3 right-3 text-xs text-gray-400 hover:text-gray-700 transition-colors bg-white border border-gray-200 px-2.5 py-1 rounded-lg"
                  >
                    Clear
                  </button>
                </div>
                <p className="text-xs text-gray-400 mt-2">Draw your signature above using mouse or touch</p>
              </motion.div>
            ) : (
              <motion.div
                key="type"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.15 }}
              >
                <div className={cn('border-2 rounded-xl p-4 bg-gray-50', errors.sig ? 'border-red-300' : 'border-gray-200')}>
                  <input
                    type="text"
                    value={typedSig}
                    onChange={(e) => setTypedSig(e.target.value)}
                    placeholder="Type your full name"
                    className={cn(
                      'w-full bg-transparent outline-none text-3xl placeholder:text-gray-300',
                      'text-gray-900'
                    )}
                    style={{ fontFamily: 'Instrument Serif, Georgia, serif', fontStyle: 'italic' }}
                  />
                </div>
                <p className="text-xs text-gray-400 mt-2">Your typed name will be used as your legal signature</p>
              </motion.div>
            )}
          </AnimatePresence>
          {errors.sig && <p className="text-xs text-red-500 mt-1">{errors.sig}</p>}

          {/* Full name */}
          <div className="mt-5">
            <label className="text-sm font-medium text-gray-700 block mb-1.5">Full Name</label>
            <input
              type="text"
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
              placeholder="As it appears on your ID"
              className={cn(
                'w-full px-3 py-2.5 text-sm border rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-500/20 focus:border-brand-400 transition-all',
                errors.fullName ? 'border-red-300' : 'border-gray-200'
              )}
            />
            {errors.fullName && <p className="text-xs text-red-500 mt-1">{errors.fullName}</p>}
          </div>

          {/* Agreement */}
          <div className="mt-4">
            <label className={cn('flex items-start gap-3 cursor-pointer group', errors.agreed && 'text-red-500')}>
              <input
                type="checkbox"
                checked={agreed}
                onChange={(e) => setAgreed(e.target.checked)}
                className="mt-0.5 w-4 h-4 rounded border-gray-300 accent-brand-500"
              />
              <span className="text-sm text-gray-600 group-hover:text-gray-900 transition-colors">
                I have read and agree to the terms of this contract. I understand that my electronic signature is legally binding.
              </span>
            </label>
            {errors.agreed && <p className="text-xs text-red-500 mt-1">{errors.agreed}</p>}
          </div>

          {/* Submit */}
          <Button
            variant="primary"
            size="lg"
            fullWidth
            loading={submitting}
            onClick={handleSign}
            className="mt-6"
            icon={<PenLine size={16} />}
          >
            Sign & Complete Contract
          </Button>

          {/* Trust badge */}
          <div className="flex items-center justify-center gap-2 mt-4 text-xs text-gray-400">
            <Shield size={13} />
            Secured & time-stamped by Contractly
          </div>
        </motion.div>
      </div>
    </div>
  );
}
