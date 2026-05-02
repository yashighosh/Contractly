import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { motion } from 'framer-motion';
import { Eye, EyeOff, Mail, Lock, User, Zap, ArrowRight } from 'lucide-react';
import { toast } from 'react-hot-toast';
import { Button } from '../../components/ui/Button';
import { Input } from '../../components/ui/Input';
import { registerSchema } from '../../utils/validators';
import { authService } from '../../services/authService';
import { useAuthStore } from '../../store/authStore';

const stagger = { animate: { transition: { staggerChildren: 0.06 } } };
const fadeUp = {
  initial: { opacity: 0, y: 14 },
  animate: { opacity: 1, y: 0, transition: { duration: 0.28 } }
};

const PLANS = [
  { value: 'freelancer', label: 'Freelancer', desc: 'Solo creator, designer, or developer' },
  { value: 'agency',     label: 'Agency',     desc: 'Team of 2+ with multiple clients' },
];

function PasswordStrength({ password }) {
  const getStrength = (p) => {
    if (!p) return 0;
    let s = 0;
    if (p.length >= 8) s++;
    if (/[A-Z]/.test(p)) s++;
    if (/[0-9]/.test(p)) s++;
    if (/[^A-Za-z0-9]/.test(p)) s++;
    return s;
  };
  const strength = getStrength(password);
  const colors = ['', 'bg-red-400', 'bg-amber-400', 'bg-yellow-400', 'bg-green-500'];
  const labels = ['', 'Weak', 'Fair', 'Good', 'Strong'];
  if (!password) return null;
  return (
    <div className="mt-1.5 flex items-center gap-2">
      <div className="flex gap-1 flex-1">
        {[1, 2, 3, 4].map((i) => (
          <div
            key={i}
            className={`h-1 flex-1 rounded-full transition-colors duration-300 ${i <= strength ? colors[strength] : 'bg-gray-200'}`}
          />
        ))}
      </div>
      <span className={`text-xs font-medium ${strength <= 1 ? 'text-red-500' : strength <= 2 ? 'text-amber-500' : strength <= 3 ? 'text-yellow-600' : 'text-green-600'}`}>
        {labels[strength]}
      </span>
    </div>
  );
}

export default function Register() {
  const navigate = useNavigate();
  const { login } = useAuthStore();
  const [showPass, setShowPass] = useState(false);
  const [selectedPlan, setSelectedPlan] = useState('freelancer');

  const { register, handleSubmit, watch, formState: { errors, isSubmitting } } = useForm({
    resolver: zodResolver(registerSchema),
    defaultValues: { plan: 'freelancer' },
  });

  const password = watch('password');

  const onSubmit = async (data) => {
    try {
      const res = await authService.register({ ...data, plan: selectedPlan });
      login(res.data.token, res.data.user);
      toast.success('Account created! Welcome to Contractly 🎉');
      navigate('/dashboard');
    } catch (err) {
      // Mock fallback when backend is offline
      const isNetworkErr = !err.response;
      if (isNetworkErr) {
        const mockUser = { id: 'demo-1', name: data.name, email: data.email, plan: selectedPlan };
        login('mock-token-demo', mockUser);
        toast.success(`Welcome, ${data.name}! 🎉 (Demo mode — no backend connected)`);
        navigate('/dashboard');
        return;
      }
      toast.error(err.response?.data?.message || 'Something went wrong. Please try again.');
    }
  };

  return (
    <div className="min-h-screen flex bg-white">
      {/* Left branding panel */}
      <div className="hidden lg:flex flex-col justify-between w-[45%] bg-gradient-to-br from-brand-600 via-brand-500 to-brand-700 p-12 relative overflow-hidden">
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute -top-24 -right-24 w-96 h-96 rounded-full bg-white/5" />
          <div className="absolute bottom-0 -left-24 w-80 h-80 rounded-full bg-white/5" />
        </div>
        <div className="flex items-center gap-2.5 relative z-10">
          <div className="w-9 h-9 rounded-xl bg-white/20 backdrop-blur flex items-center justify-center">
            <Zap size={18} className="text-white" />
          </div>
          <span className="text-white text-serif text-2xl">Contractly</span>
        </div>
        <div className="relative z-10">
          <h1 className="text-serif text-5xl text-white leading-tight mb-6">
            Stop losing deals
            <br />to bad contracts.
          </h1>
          {[
            'Professional contracts in 5 minutes',
            'E-signature with legal timestamp',
            'Built for Indian freelancers',
            'Clause library with Indian law templates',
          ].map((f) => (
            <div key={f} className="flex items-center gap-2.5 mb-3">
              <div className="w-5 h-5 rounded-full bg-green-400/30 flex items-center justify-center shrink-0">
                <svg width="10" height="8" viewBox="0 0 10 8" fill="none">
                  <path d="M1 4l2.5 2.5L9 1" stroke="#4ade80" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </div>
              <span className="text-white/80 text-sm">{f}</span>
            </div>
          ))}
        </div>
        <div className="bg-white/10 backdrop-blur rounded-2xl p-6 relative z-10 border border-white/20">
          <p className="text-white/90 text-sm leading-relaxed italic mb-3">
            "Contractly saved me from a ₹2 lakh dispute. The client had no argument — everything was timestamped."
          </p>
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-full bg-white/30 flex items-center justify-center text-white text-xs font-bold">P</div>
            <div>
              <div className="text-white text-sm font-medium">Priya Sharma</div>
              <div className="text-white/50 text-xs">UI/UX Freelancer, Bengaluru</div>
            </div>
          </div>
        </div>
      </div>

      {/* Right Form */}
      <div className="flex-1 flex items-center justify-center p-6 lg:p-12 overflow-y-auto">
        <motion.div variants={stagger} initial="initial" animate="animate" className="w-full max-w-md">
          <motion.div variants={fadeUp} className="flex items-center gap-2 mb-8 lg:hidden">
            <div className="w-8 h-8 rounded-lg bg-brand-500 flex items-center justify-center">
              <Zap size={16} className="text-white" />
            </div>
            <span className="text-serif text-xl text-gray-900">Contractly</span>
          </motion.div>

          <motion.div variants={fadeUp}>
            <h2 className="text-3xl font-semibold text-gray-900 mb-1">Create your account</h2>
            <p className="text-gray-500 text-sm">Free to start. No credit card required.</p>
          </motion.div>

          <form onSubmit={handleSubmit(onSubmit)} className="mt-8 space-y-4">
            <motion.div variants={fadeUp}>
              <Input
                label="Full Name"
                type="text"
                placeholder="Priya Sharma"
                icon={<User size={15} />}
                error={errors.name?.message}
                {...register('name')}
              />
            </motion.div>

            <motion.div variants={fadeUp}>
              <Input
                label="Email address"
                type="email"
                placeholder="you@example.com"
                icon={<Mail size={15} />}
                error={errors.email?.message}
                {...register('email')}
              />
            </motion.div>

            <motion.div variants={fadeUp}>
              <Input
                label="Password"
                type={showPass ? 'text' : 'password'}
                placeholder="Min. 8 characters"
                icon={<Lock size={15} />}
                iconRight={
                  <button type="button" onClick={() => setShowPass((p) => !p)} className="text-gray-400 hover:text-gray-600">
                    {showPass ? <EyeOff size={15} /> : <Eye size={15} />}
                  </button>
                }
                error={errors.password?.message}
                {...register('password')}
              />
              <PasswordStrength password={password} />
            </motion.div>

            {/* Plan selector */}
            <motion.div variants={fadeUp}>
              <label className="text-sm font-medium text-gray-700 block mb-2">I am a…</label>
              <div className="grid grid-cols-2 gap-3">
                {PLANS.map((plan) => (
                  <button
                    key={plan.value}
                    type="button"
                    onClick={() => setSelectedPlan(plan.value)}
                    className={`p-3 rounded-xl border-2 text-left transition-all ${
                      selectedPlan === plan.value
                        ? 'border-brand-500 bg-brand-50'
                        : 'border-gray-200 hover:border-gray-300 bg-white'
                    }`}
                  >
                    <div className={`text-sm font-semibold mb-0.5 ${selectedPlan === plan.value ? 'text-brand-600' : 'text-gray-800'}`}>
                      {plan.label}
                    </div>
                    <div className="text-xs text-gray-500">{plan.desc}</div>
                  </button>
                ))}
              </div>
            </motion.div>

            <motion.div variants={fadeUp}>
              <Button
                type="submit"
                variant="primary"
                size="lg"
                fullWidth
                loading={isSubmitting}
                className="group"
              >
                Create Account
                <ArrowRight size={16} className="group-hover:translate-x-0.5 transition-transform" />
              </Button>
            </motion.div>
          </form>

          <motion.p variants={fadeUp} className="mt-4 text-xs text-gray-400 text-center">
            By signing up you agree to our{' '}
            <a href="#" className="text-brand-500 hover:underline">Terms</a>
            {' & '}
            <a href="#" className="text-brand-500 hover:underline">Privacy Policy</a>
          </motion.p>

          <motion.div variants={fadeUp} className="mt-6 text-center text-sm text-gray-500">
            Already have an account?{' '}
            <Link to="/login" className="text-brand-500 hover:text-brand-700 font-medium">
              Sign in →
            </Link>
          </motion.div>
        </motion.div>
      </div>
    </div>
  );
}
