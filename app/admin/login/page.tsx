'use client';

import { useState, useRef } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowLeft, Lock, Eye, EyeOff, ShieldCheck, Loader2, Sparkles } from 'lucide-react';
import AnimatedMascot, { MascotState } from '@/app/components/admin/AnimatedMascot';
import ThemeToggle from '@/components/ui/ThemeToggle';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [mascotState, setMascotState] = useState<MascotState>('idle');
  
  const router = useRouter();
  const passwordInputRef = useRef<HTMLInputElement>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setMascotState('submitting');

    try {
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || 'Invalid administrator credentials');
      }

      setIsSuccess(true);
      setMascotState('success');
      setTimeout(() => {
        router.push('/admin');
        router.refresh();
      }, 1200);
    } catch (err: any) {
      setError(err.message || 'Authentication failed');
      setMascotState('error');
      setTimeout(() => {
        setMascotState('idle');
      }, 2500);
    } finally {
      setLoading(false);
    }
  };

  const handleEmailFocus = () => {
    if (!loading && !isSuccess) {
      setMascotState('email-focus');
    }
  };

  const handlePasswordFocus = () => {
    if (!loading && !isSuccess) {
      setMascotState(showPassword ? 'password-peek' : 'password-focus');
    }
  };

  const handleBlur = () => {
    if (!loading && !isSuccess && mascotState !== 'error') {
      setMascotState('idle');
    }
  };

  const toggleShowPassword = () => {
    const nextVal = !showPassword;
    setShowPassword(nextVal);
    if (document.activeElement === passwordInputRef.current) {
      setMascotState(nextVal ? 'password-peek' : 'password-focus');
    }
  };

  return (
    <div className="min-h-screen w-full bg-background text-text-primary flex flex-col justify-between p-6 sm:p-10 select-none relative overflow-hidden transition-colors duration-300">
      
      {/* Top Header Navigation */}
      <header className="w-full flex items-center justify-between border-b border-border pb-4 font-mono text-xs uppercase tracking-[0.2em] text-text-muted z-20">
        <Link 
          href="/"
          className="flex items-center gap-2 hover:text-text-primary transition-colors cursor-target"
        >
          <ArrowLeft size={14} />
          <span>RETURN TO SITE</span>
        </Link>
        
        <div className="flex items-center gap-4">
          <ThemeToggle showLabel={false} />
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
            <span className="text-text-primary font-bold">TERMINAL ACCESS</span>
          </div>
        </div>
      </header>

      {/* Main 2-Grid Form Container */}
      <div className="w-full max-w-4xl mx-auto my-auto py-10 z-10">
        <div className="bg-surface border border-border rounded-3xl overflow-hidden shadow-xl grid grid-cols-1 md:grid-cols-12 divide-y md:divide-y-0 md:divide-x divide-border">
          
          {/* LEFT GRID: Full-Body Autonomous Mascot Stage */}
          <div className="md:col-span-5 p-8 sm:p-10 bg-surface-elevated/40 flex flex-col justify-between items-center relative">
            <div className="w-full flex items-center justify-between font-mono text-[11px] text-text-muted">
              <span className="font-bold text-primary">[00] AERO-BOT</span>
              <span className="uppercase tracking-widest text-[10px] font-bold text-text-primary">
                {mascotState === 'email-focus' 
                  ? 'TRACKING...' 
                  : mascotState === 'password-focus' 
                    ? 'SECURITY MASK' 
                    : mascotState === 'password-peek'
                      ? 'PEEKING'
                      : mascotState === 'submitting'
                        ? 'VERIFYING...'
                        : mascotState === 'success'
                          ? 'GRANTED'
                          : mascotState === 'error'
                            ? 'DENIED'
                            : 'AUTONOMOUS'}
              </span>
            </div>

            {/* Full-Body Mascot */}
            <div className="my-auto py-4">
              <AnimatedMascot 
                state={mascotState} 
                textLength={email.length}
              />
            </div>

            {/* Stage Telemetry Tag */}
            <div className="w-full text-center font-mono text-[10px] text-text-muted border-t border-border/50 pt-4 flex items-center justify-between">
              <span>SECURITY SENTINEL</span>
              <span className="text-primary font-bold">v2.4 ONLINE</span>
            </div>
          </div>

          {/* RIGHT GRID: Minimalist Editorial Login Form */}
          <div className="md:col-span-7 p-8 sm:p-12 flex flex-col justify-between">
            <div>
              {/* Header */}
              <div className="mb-8">
                <div className="font-mono text-xs uppercase tracking-[0.2em] text-primary font-bold mb-2">
                  01 // ADMINISTRATOR GATEWAY
                </div>
                <h1 className="font-heading font-black text-3xl sm:text-4xl text-text-primary tracking-tight">
                  Control Terminal
                </h1>
                <p className="text-sm text-text-muted mt-2 font-sans">
                  Sign in to configure portfolio data, repositories, and logs.
                </p>
              </div>

              {/* Status Notifications */}
              <AnimatePresence mode="wait">
                {error && (
                  <motion.div 
                    initial={{ opacity: 0, y: -6 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -6 }}
                    className="mb-6 p-3.5 rounded-2xl bg-rose-500/10 border border-rose-500/20 text-rose-500 text-xs font-mono flex items-center gap-2"
                  >
                    <span className="font-bold">✕</span>
                    <span>{error}</span>
                  </motion.div>
                )}

                {isSuccess && (
                  <motion.div 
                    initial={{ opacity: 0, scale: 0.96 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="mb-6 p-3.5 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-500 text-xs font-mono flex items-center gap-2"
                  >
                    <Sparkles size={14} className="animate-spin" />
                    <span>AUTHENTICATED — REDIRECTING...</span>
                  </motion.div>
                )}
              </AnimatePresence>

              {/* Form Inputs */}
              <form onSubmit={handleSubmit} className="space-y-5">
                <div className="space-y-2">
                  <label className="block text-xs font-mono uppercase tracking-wider text-text-muted font-bold">
                    Email Identifier
                  </label>
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => {
                      setEmail(e.target.value);
                      if (mascotState === 'error') setMascotState('email-focus');
                    }}
                    onFocus={handleEmailFocus}
                    onBlur={handleBlur}
                    placeholder="admin@example.com"
                    className="w-full px-4 py-3.5 rounded-2xl bg-surface-elevated border border-border text-text-primary text-sm focus:outline-none focus:border-primary transition-all font-sans placeholder:text-text-muted/50"
                    required
                  />
                </div>

                <div className="space-y-2">
                  <label className="block text-xs font-mono uppercase tracking-wider text-text-muted font-bold">
                    Security Passcode
                  </label>
                  <div className="relative">
                    <input
                      ref={passwordInputRef}
                      type={showPassword ? 'text' : 'password'}
                      value={password}
                      onChange={(e) => {
                        setPassword(e.target.value);
                        if (mascotState === 'error') setMascotState(showPassword ? 'password-peek' : 'password-focus');
                      }}
                      onFocus={handlePasswordFocus}
                      onBlur={handleBlur}
                      placeholder="••••••••••••"
                      className="w-full px-4 py-3.5 pr-11 rounded-2xl bg-surface-elevated border border-border text-text-primary text-sm focus:outline-none focus:border-primary transition-all font-mono placeholder:text-text-muted/50"
                      required
                    />
                    <button
                      type="button"
                      onClick={toggleShowPassword}
                      className="absolute right-3.5 top-1/2 -translate-y-1/2 p-1 text-text-muted hover:text-text-primary transition-colors cursor-target"
                      title={showPassword ? 'Hide password' : 'Show password'}
                    >
                      {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                    </button>
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={loading || isSuccess}
                  className="w-full py-4 mt-3 rounded-2xl bg-primary hover:bg-primary/90 text-background font-mono text-xs uppercase tracking-widest font-bold transition-all flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed cursor-target shadow-md shadow-primary/20"
                >
                  {loading ? (
                    <>
                      <Loader2 size={15} className="animate-spin" />
                      <span>AUTHENTICATING...</span>
                    </>
                  ) : isSuccess ? (
                    <>
                      <ShieldCheck size={15} />
                      <span>ACCESS GRANTED</span>
                    </>
                  ) : (
                    <>
                      <Lock size={14} />
                      <span>SIGN IN TO CONSOLE</span>
                    </>
                  )}
                </button>
              </form>
            </div>

            {/* Bottom Meta */}
            <div className="pt-8 border-t border-border flex items-center justify-between text-[11px] font-mono text-text-muted mt-8">
              <span>ENCRYPTED PROTOCOL</span>
              <span className="font-bold text-text-primary">4RK4N.DEV</span>
            </div>
          </div>

        </div>
      </div>

      {/* Bottom Page Footer */}
      <footer className="w-full flex items-center justify-between border-t border-border pt-4 font-mono text-xs uppercase tracking-[0.2em] text-text-muted z-20">
        <span>4RK4N.DEV</span>
        <span>EXECUTIVE CONTROL TERMINAL</span>
      </footer>

    </div>
  );
}
