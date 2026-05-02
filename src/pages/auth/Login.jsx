import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { motion } from 'framer-motion';
import { PageTransition } from '../../components/ui/PageTransition';
import { Eye, EyeOff, Mail, Lock, Zap, ArrowRight } from 'lucide-react';
import { toast } from 'react-hot-toast';
import { Button } from '../../components/ui/Button';
import { Input } from '../../components/ui/Input';
import { Divider } from '../../components/ui/Divider';
import { loginSchema } from '../../utils/validators';
import { authService } from '../../services/authService';
import { useAuthStore } from '../../store/authStore';

const stagger = {
  animate: { transition: { staggerChildren: 0.07 } }
};
const fadeUp = {
  initial: { opacity: 0, y: 16 },
  animate: { opacity: 1, y: 0, transition: { duration: 0.3 } }
};

export default function Login() {
  const navigate = useNavigate();
  const { login } = useAuthStore();
  const [showPass, setShowPass] = useState(false);
  const [shake, setShake] = useState(false);

  const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm({
    resolver: zodResolver(loginSchema),
  });

  const onSubmit = async (data) => {
    try {
      const res = await authService.login(data);
      login(res.data.token, res.data.user);
      toast.success(`Welcome back, ${res.data.user?.name || 'there'}!`);
      navigate('/dashboard');
    } catch (err) {
      // If backend is offline, fall through to mock auth for demo purposes
      const isNetworkErr = !err.response;
      if (isNetworkErr) {
        const mockUser = { id: 'demo-1', name: 'Yashi Ghosh', email: data.email, plan: 'freelancer' };
        login('mock-token-demo', mockUser);
        toast.success('Welcome back! (Demo mode — no backend connected)');
        navigate('/dashboard');
        return;
      }
      setShake(true);
      setTimeout(() => setShake(false), 600);
      toast.error(err.response?.data?.message || 'Invalid credentials. Please try again.');
    }
  };

  return (
    <div className="min-h-screen flex bg-white">
      {/* Left Panel – Branding */}
      <div className="hidden lg:flex flex-col justify-between w-[45%] bg-gradient-to-br from-brand-600 via-brand-500 to-brand-700 p-12 relative overflow-hidden">
        {/* Background decoration */}
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute -top-24 -right-24 w-96 h-96 rounded-full bg-white/5" />
          <div className="absolute bottom-0 -left-24 w-80 h-80 rounded-full bg-white/5" />
          <div className="absolute top-1/3 right-8 w-48 h-48 rounded-full bg-white/5" />
        </div>

        {/* Logo */}
        <div className="flex items-center gap-2.5 relative z-10">
          <div className="w-9 h-9 rounded-xl bg-white/20 backdrop-blur flex items-center justify-center">
            <Zap size={18} className="text-white" />
          </div>
          <span className="text-white text-serif text-2xl">Contractly</span>
        </div>

        {/* Hero text */}
        <div className="relative z-10">
          <h1 className="text-serif text-5xl text-white leading-tight mb-4">
            Contracts that
            <br />close faster.
          </h1>
          <p className="text-white/70 text-lg leading-relaxed mb-10">
            The Stripe Dashboard of contract management — beautifully minimal, ruthlessly functional.
          </p>

          {/* Social proof */}
          <div className="flex items-center gap-4">
            <div className="flex -space-x-2">
              {['P', 'R', 'M', 'A'].map((l, i) => (
                <div key={i} className="w-9 h-9 rounded-full bg-white/30 border-2 border-white/50 flex items-center justify-center text-white text-xs font-semibold">
                  {l}
                </div>
              ))}
            </div>
            <div className="text-white/80 text-sm">
              <span className="font-semibold text-white">2,400+</span> freelancers trust Contractly
            </div>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 gap-4 relative z-10">
          {[
            { label: 'Contracts Signed', value: '18,000+' },
            { label: 'Revenue Tracked', value: '₹24Cr+' },
          ].map((s) => (
            <div key={s.label} className="bg-white/10 backdrop-blur rounded-xl p-4">
              <div className="text-white text-2xl font-bold text-serif">{s.value}</div>
              <div className="text-white/60 text-sm mt-0.5">{s.label}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Right Panel – Form */}
      <div className="flex-1 flex items-center justify-center p-6 lg:p-12">
        <motion.div
          variants={stagger}
          initial="initial"
          animate="animate"
          className="w-full max-w-md"
        >
          {/* Mobile logo */}
          <motion.div variants={fadeUp} className="flex items-center gap-2 mb-8 lg:hidden">
            <div className="w-8 h-8 rounded-lg bg-brand-500 flex items-center justify-center">
              <Zap size={16} className="text-white" />
            </div>
            <span className="text-serif text-xl text-gray-900">Contractly</span>
          </motion.div>

          <motion.div variants={fadeUp}>
            <h2 className="text-3xl font-semibold text-gray-900 mb-1">Welcome back</h2>
            <p className="text-gray-500 text-sm">Sign in to manage your contracts</p>
          </motion.div>

          <motion.form
            variants={shake ? { animate: { x: [-8, 8, -8, 8, 0], transition: { duration: 0.4 } } } : stagger}
            onSubmit={handleSubmit(onSubmit)}
            className="mt-8 space-y-4"
          >
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
                placeholder="••••••••"
                icon={<Lock size={15} />}
                iconRight={
                  <button type="button" onClick={() => setShowPass((p) => !p)} className="text-gray-400 hover:text-gray-600">
                    {showPass ? <EyeOff size={15} /> : <Eye size={15} />}
                  </button>
                }
                error={errors.password?.message}
                {...register('password')}
              />
              <div className="flex justify-end mt-1">
                <button type="button" className="text-xs text-brand-500 hover:text-brand-700 transition-colors">
                  Forgot password?
                </button>
              </div>
            </motion.div>

            <motion.div variants={fadeUp}>
              <Button
                type="submit"
                variant="primary"
                size="lg"
                fullWidth
                loading={isSubmitting}
                className="mt-2 group"
              >
                Sign In
                <ArrowRight size={16} className="group-hover:translate-x-0.5 transition-transform" />
              </Button>
            </motion.div>
          </motion.form>

          <motion.div variants={fadeUp} className="mt-6 text-center text-sm text-gray-500">
            Don't have an account?{' '}
            <Link to="/register" className="text-brand-500 hover:text-brand-700 font-medium transition-colors">
              Register →
            </Link>
          </motion.div>

          <motion.div variants={fadeUp}>
            <Divider label="or" className="my-6" />
            <button
              type="button"
              className="w-full flex items-center justify-center gap-3 px-4 py-2.5 rounded-lg border border-gray-200 bg-white text-sm text-gray-700 font-medium hover:bg-gray-50 hover:border-gray-300 transition-all shadow-sm"
            >
              <svg className="w-5 h-5" viewBox="0 0 24 24">
                <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
                <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
                <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
                <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
              </svg>
              Continue with Google
            </button>
          </motion.div>
        </motion.div>
      </div>
    </div>
  );
}
