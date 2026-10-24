import React, { useState, useEffect } from 'react';
import { z } from 'zod';
import {
  X,
  Mail,
  Lock,
  User,
  Phone,
  Eye,
  EyeOff,
  ArrowRight,
  CheckCircle2,
  AlertCircle,
  Zap,
  ShieldCheck,
  Sparkles,
  Bike,
  Star,
  Check,
  Loader2,
} from 'lucide-react';

// =========================================================
// ZOD VALIDATION SCHEMAS
// =========================================================

export const loginSchema = z.object({
  email: z
    .string()
    .trim()
    .min(1, { message: 'Email address is required' })
    .email({ message: 'Please enter a valid email address' }),
  password: z
    .string()
    .min(1, { message: 'Password is required' })
    .min(6, { message: 'Password must be at least 6 characters' }),
  rememberMe: z.boolean().optional(),
});

export const signupSchema = z
  .object({
    name: z
      .string()
      .trim()
      .min(1, { message: 'Full name is required' })
      .min(2, { message: 'Name must be at least 2 characters' })
      .max(60, { message: 'Name cannot exceed 60 characters' }),
    email: z
      .string()
      .trim()
      .min(1, { message: 'Email address is required' })
      .email({ message: 'Please enter a valid email address' }),
    phone: z
      .string()
      .trim()
      .optional()
      .refine(
        (val) => !val || /^[+]?[(]?[0-9]{3}[)]?[-\s.]?[0-9]{3}[-\s.]?[0-9]{4,6}$/.test(val),
        { message: 'Please enter a valid phone number (e.g. +1 555-019-2834)' }
      ),
    password: z
      .string()
      .min(8, { message: 'Password must be at least 8 characters long' })
      .regex(/[A-Z]/, { message: 'Password must include at least one uppercase letter' })
      .regex(/[0-9]/, { message: 'Password must include at least one number' }),
    confirmPassword: z.string().min(1, { message: 'Please confirm your password' }),
    acceptTerms: z.boolean().refine((val) => val === true, {
      message: 'You must accept the terms of service and privacy policy',
    }),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: 'Passwords do not match',
    path: ['confirmPassword'],
  });

export const forgotPasswordSchema = z.object({
  email: z
    .string()
    .trim()
    .min(1, { message: 'Email address is required' })
    .email({ message: 'Please enter a valid email address' }),
});

export type LoginFormData = z.infer<typeof loginSchema>;
export type SignupFormData = z.infer<typeof signupSchema>;

export interface AuthUser {
  id: string;
  name: string;
  email: string;
  phone?: string;
  avatar?: string;
  isVip: boolean;
  tier: string;
  memberSince: string;
  ordersCount: number;
}

interface AuthFlowProps {
  isOpen: boolean;
  onClose: () => void;
  initialMode?: 'login' | 'signup';
  onAuthSuccess?: (user: AuthUser) => void;
}

export const AuthFlow: React.FC<AuthFlowProps> = ({
  isOpen,
  onClose,
  initialMode = 'login',
  onAuthSuccess,
}) => {
  const [mode, setMode] = useState<'login' | 'signup' | 'forgot'>(initialMode);
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [authError, setAuthError] = useState<string | null>(null);
  const [authSuccessMsg, setAuthSuccessMsg] = useState<string | null>(null);

  // Form State for Login
  const [loginData, setLoginData] = useState<LoginFormData>({
    email: '',
    password: '',
    rememberMe: true,
  });
  const [loginErrors, setLoginErrors] = useState<Partial<Record<keyof LoginFormData, string>>>({});

  // Form State for Signup
  const [signupData, setSignupData] = useState<SignupFormData>({
    name: '',
    email: '',
    phone: '',
    password: '',
    confirmPassword: '',
    acceptTerms: true,
  });
  const [signupErrors, setSignupErrors] = useState<Partial<Record<keyof SignupFormData, string>>>({});

  // Form State for Forgot Password
  const [forgotEmail, setForgotEmail] = useState('');
  const [forgotError, setForgotError] = useState<string | null>(null);
  const [forgotSubmitted, setForgotSubmitted] = useState(false);

  // Reset states on opening or mode change
  useEffect(() => {
    if (isOpen) {
      setMode(initialMode);
      setAuthError(null);
      setAuthSuccessMsg(null);
      setLoginErrors({});
      setSignupErrors({});
      setForgotSubmitted(false);
    }
  }, [isOpen, initialMode]);

  // Handle escape key listener
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  // Password strength calculation helper
  const getPasswordStrength = (pass: string) => {
    let score = 0;
    if (pass.length >= 8) score++;
    if (/[A-Z]/.test(pass)) score++;
    if (/[0-9]/.test(pass)) score++;
    if (/[^A-Za-z0-9]/.test(pass)) score++;
    return score;
  };

  const passwordScore = getPasswordStrength(signupData.password);
  const strengthLabels = ['Too weak', 'Fair', 'Good', 'Strong'];
  const strengthColors = ['bg-rose-500', 'bg-amber-500', 'bg-sky-500', 'bg-emerald-500'];

  // =========================================================
  // SUBMISSION HANDLERS
  // =========================================================

  const handleLoginSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setAuthError(null);
    setLoginErrors({});

    const result = loginSchema.safeParse(loginData);
    if (!result.success) {
      const fieldErrors: Partial<Record<keyof LoginFormData, string>> = {};
      result.error.issues.forEach((err) => {
        const field = err.path[0] as keyof LoginFormData;
        if (field && !fieldErrors[field]) {
          fieldErrors[field] = err.message;
        }
      });
      setLoginErrors(fieldErrors);
      return;
    }

    setIsLoading(true);
    // Simulate real auth network latency
    try {
      await new Promise((res) => setTimeout(res, 850));

      const authenticatedUser: AuthUser = {
        id: `usr-${Date.now()}`,
        name: loginData.email.split('@')[0].replace(/[._-]/g, ' ').replace(/\b\w/g, (c) => c.toUpperCase()) || 'VIP Member',
        email: loginData.email,
        phone: '+1 (555) 019-2834',
        avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=400&q=80',
        isVip: true,
        tier: 'Apparellex Black Diamond VIP',
        memberSince: 'Oct 2026',
        ordersCount: 4,
      };

      try {
        localStorage.setItem('apparellex_auth_user', JSON.stringify(authenticatedUser));
      } catch {
        // Ignore storage errors
      }

      setAuthSuccessMsg(`Welcome back, ${authenticatedUser.name}!`);
      setTimeout(() => {
        setIsLoading(false);
        if (onAuthSuccess) onAuthSuccess(authenticatedUser);
        onClose();
      }, 700);
    } catch {
      setIsLoading(false);
      setAuthError('Authentication failed. Please verify your credentials and try again.');
    }
  };

  const handleSignupSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setAuthError(null);
    setSignupErrors({});

    const result = signupSchema.safeParse(signupData);
    if (!result.success) {
      const fieldErrors: Partial<Record<keyof SignupFormData, string>> = {};
      result.error.issues.forEach((err) => {
        const field = err.path[0] as keyof SignupFormData;
        if (field && !fieldErrors[field]) {
          fieldErrors[field] = err.message;
        }
      });
      setSignupErrors(fieldErrors);
      return;
    }

    setIsLoading(true);
    try {
      await new Promise((res) => setTimeout(res, 950));

      const newUser: AuthUser = {
        id: `usr-${Date.now()}`,
        name: signupData.name.trim(),
        email: signupData.email.trim(),
        phone: signupData.phone?.trim() || '+1 (555) 019-0000',
        avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=400&q=80',
        isVip: true,
        tier: 'Apparellex Gold VIP Member',
        memberSince: 'Oct 2026',
        ordersCount: 0,
      };

      try {
        localStorage.setItem('apparellex_auth_user', JSON.stringify(newUser));
      } catch {
        // Ignore
      }

      setAuthSuccessMsg(`Account created! Welcome to Apparellex, ${newUser.name}. $20 Welcome Credit unlocked.`);
      setTimeout(() => {
        setIsLoading(false);
        if (onAuthSuccess) onAuthSuccess(newUser);
        onClose();
      }, 800);
    } catch {
      setIsLoading(false);
      setAuthError('Unable to complete registration. Please try again.');
    }
  };

  const handleSocialLogin = async (provider: 'Google' | 'Apple' | 'Demo') => {
    setIsLoading(true);
    setAuthError(null);

    await new Promise((res) => setTimeout(res, 750));

    let user: AuthUser;
    if (provider === 'Demo') {
      user = {
        id: 'usr-demo-shaikh',
        name: 'Shaikh Kamran',
        email: 'shaikh.kamran@apparellex.com',
        phone: '+1 (555) 019-2834',
        avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=400&q=80',
        isVip: true,
        tier: 'Apparellex Black Diamond VIP',
        memberSince: 'Aug 2025',
        ordersCount: 8,
      };
    } else {
      user = {
        id: `usr-${provider.toLowerCase()}-${Date.now()}`,
        name: provider === 'Google' ? 'Alex Jordan' : 'Taylor Brooks',
        email: provider === 'Google' ? 'alex.jordan@gmail.com' : 'taylor.brooks@icloud.com',
        phone: '+1 (555) 014-8891',
        avatar: provider === 'Google'
          ? 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=400&q=80'
          : 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=400&q=80',
        isVip: true,
        tier: 'Apparellex Black Diamond VIP',
        memberSince: 'Oct 2026',
        ordersCount: 3,
      };
    }

    try {
      localStorage.setItem('apparellex_auth_user', JSON.stringify(user));
    } catch {
      // Ignore
    }

    setAuthSuccessMsg(`Signed in with ${provider}! Welcome, ${user.name}.`);
    setTimeout(() => {
      setIsLoading(false);
      if (onAuthSuccess) onAuthSuccess(user);
      onClose();
    }, 700);
  };

  const handleForgotSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setForgotError(null);

    const result = forgotPasswordSchema.safeParse({ email: forgotEmail });
    if (!result.success) {
      setForgotError(result.error.issues[0]?.message || 'Please enter a valid email');
      return;
    }

    setIsLoading(true);
    await new Promise((res) => setTimeout(res, 800));
    setIsLoading(false);
    setForgotSubmitted(true);
  };

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="auth-modal-title"
      className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-black/80 backdrop-blur-md animate-fadeIn"
      onClick={onClose}
    >
      <div
        className="bg-[#0f0f11] text-stone-100 max-w-4xl w-full rounded-2xl overflow-hidden shadow-2xl relative border border-white/10 max-h-[94vh] flex flex-col md:flex-row"
        onClick={(e) => e.stopPropagation()}
      >
        {/* ========================================================= */}
        {/* LEFT SPLIT: HIGH-FASHION EDITORIAL VALUE PROP */}
        {/* ========================================================= */}
        <div className="hidden md:flex md:w-5/12 bg-gradient-to-br from-stone-900 via-[#18181b] to-black p-8 flex-col justify-between relative overflow-hidden border-r border-white/10">
          {/* Background fashion aesthetic styling */}
          <div className="absolute inset-0 opacity-25 pointer-events-none mix-blend-luminosity">
            <img
              src="https://images.unsplash.com/photo-1509631179647-0177331693ae?auto=format&fit=crop&w=1000&q=80"
              alt="Editorial Haute Couture"
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black via-black/60 to-transparent" />
          </div>

          {/* Top Brand Tag */}
          <div className="relative z-10 space-y-2">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#FF5757]/20 border border-[#FF5757]/40 text-[#FF5757] text-[10px] font-black uppercase tracking-widest">
              <Zap className="w-3 h-3 fill-[#FF5757]" />
              <span>Hyper-Local Couture</span>
            </div>
            <h3 className="text-2xl font-black uppercase tracking-tight text-white font-fashion leading-tight">
              Instant Wardrobe <br />
              <span className="text-[#FF5757]">In 10 Minutes.</span>
            </h3>
            <p className="text-xs text-stone-300 font-medium leading-relaxed">
              Join 40,000+ members enjoying high-fashion drops delivered to their doorsteps within 10 minutes.
            </p>
          </div>

          {/* VIP Perks List */}
          <div className="relative z-10 space-y-3.5 my-6 py-4 border-y border-white/10">
            <div className="flex items-start gap-3">
              <div className="w-7 h-7 rounded-lg bg-[#FF5757]/15 border border-[#FF5757]/30 flex items-center justify-center text-[#FF5757] shrink-0 mt-0.5">
                <Bike className="w-3.5 h-3.5" />
              </div>
              <div>
                <p className="text-xs font-bold text-white uppercase tracking-wider">10-Minute Dispatch</p>
                <p className="text-[11px] text-stone-400">Dark store micro-hubs stocked for near-instant arrival.</p>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <div className="w-7 h-7 rounded-lg bg-sky-500/15 border border-sky-500/30 flex items-center justify-center text-sky-400 shrink-0 mt-0.5">
                <Sparkles className="w-3.5 h-3.5" />
              </div>
              <div>
                <p className="text-xs font-bold text-white uppercase tracking-wider">15-Min Doorstep Try-On</p>
                <p className="text-[11px] text-stone-400">Our rider waits. Keep what fits, return the rest on the spot.</p>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <div className="w-7 h-7 rounded-lg bg-amber-500/15 border border-amber-500/30 flex items-center justify-center text-amber-400 shrink-0 mt-0.5">
                <ShieldCheck className="w-3.5 h-3.5" />
              </div>
              <div>
                <p className="text-xs font-bold text-white uppercase tracking-wider">$20 Welcome Credit</p>
                <p className="text-[11px] text-stone-400">Automatically credited on new account registration.</p>
              </div>
            </div>
          </div>

          {/* Testimonial Quote */}
          <div className="relative z-10 p-3.5 rounded-xl bg-white/5 border border-white/10 backdrop-blur-md">
            <div className="flex items-center gap-1 text-amber-400 mb-1.5">
              {[...Array(5)].map((_, i) => (
                <Star key={i} className="w-3 h-3 fill-amber-400" />
              ))}
            </div>
            <p className="text-[11px] text-stone-200 italic leading-snug">
              "Ordered a tailored blazer at 7:10 PM for an event. It was at my door by 7:19 PM. Pure magic."
            </p>
            <p className="text-[10px] text-stone-400 font-bold uppercase tracking-wider mt-2">
              — Elena Rostova · SoHo Member
            </p>
          </div>
        </div>

        {/* ========================================================= */}
        {/* RIGHT SPLIT: INTERACTIVE AUTH FORMS */}
        {/* ========================================================= */}
        <div className="flex-1 p-6 sm:p-8 flex flex-col justify-between overflow-y-auto max-h-[85vh] md:max-h-[94vh] scrollbar-thin scrollbar-thumb-stone-800">
          <div>
            {/* Top Bar with Mode Switcher & Close Button */}
            <div className="flex items-center justify-between pb-4 border-b border-white/10">
              <div className="flex items-center gap-2">
                <div className="w-7 h-7 rounded-md bg-[#FF5757] flex items-center justify-center text-white">
                  <Zap className="w-4 h-4 fill-white" />
                </div>
                <span className="text-sm font-black tracking-wider uppercase font-fashion text-white">
                  APPARELLEX
                </span>
              </div>

              <div className="flex items-center gap-3">
                {mode !== 'forgot' && (
                  <div className="flex bg-white/5 p-1 rounded-lg border border-white/10">
                    <button
                      type="button"
                      onClick={() => {
                        setMode('login');
                        setAuthError(null);
                        setAuthSuccessMsg(null);
                      }}
                      className={`px-3 py-1 text-xs font-bold rounded-md transition cursor-pointer ${
                        mode === 'login'
                          ? 'bg-[#FF5757] text-white shadow'
                          : 'text-stone-400 hover:text-white'
                      }`}
                    >
                      Sign In
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        setMode('signup');
                        setAuthError(null);
                        setAuthSuccessMsg(null);
                      }}
                      className={`px-3 py-1 text-xs font-bold rounded-md transition cursor-pointer ${
                        mode === 'signup'
                          ? 'bg-[#FF5757] text-white shadow'
                          : 'text-stone-400 hover:text-white'
                      }`}
                    >
                      Join Club
                    </button>
                  </div>
                )}

                <button
                  type="button"
                  onClick={onClose}
                  className="p-1.5 rounded-lg text-stone-400 hover:text-white hover:bg-white/10 transition cursor-pointer"
                  aria-label="Close authentication modal"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
            </div>

            {/* Header Titles */}
            <div className="mt-5 mb-6">
              <h2 id="auth-modal-title" className="text-xl sm:text-2xl font-black text-white uppercase tracking-tight font-fashion">
                {mode === 'login' && 'Welcome Back'}
                {mode === 'signup' && 'Create Your VIP Account'}
                {mode === 'forgot' && 'Reset Your Password'}
              </h2>
              <p className="text-xs text-stone-400 mt-1">
                {mode === 'login' && 'Sign in to access saved looks, ultra-fast reorders, and 10-minute dispatch.'}
                {mode === 'signup' && 'Unlock instant $20 store credit, 15-minute doorstep try-on, and private drops.'}
                {mode === 'forgot' && 'Enter your registered email and we will send a password reset token.'}
              </p>
            </div>

            {/* Notifications / Alerts */}
            {authError && (
              <div className="mb-4 p-3 rounded-lg bg-rose-500/15 border border-rose-500/30 text-rose-300 text-xs flex items-center gap-2.5 animate-fadeIn">
                <AlertCircle className="w-4 h-4 shrink-0 text-rose-400" />
                <span>{authError}</span>
              </div>
            )}

            {authSuccessMsg && (
              <div className="mb-4 p-3 rounded-lg bg-emerald-500/15 border border-emerald-500/30 text-emerald-300 text-xs flex items-center gap-2.5 animate-fadeIn">
                <CheckCircle2 className="w-4 h-4 shrink-0 text-emerald-400" />
                <span>{authSuccessMsg}</span>
              </div>
            )}

            {/* SOCIAL AUTH BUTTONS (Login & Signup modes) */}
            {mode !== 'forgot' && (
              <div className="space-y-2.5 mb-5">
                <div className="grid grid-cols-2 gap-2.5">
                  {/* Google OAuth Button */}
                  <button
                    type="button"
                    disabled={isLoading}
                    onClick={() => handleSocialLogin('Google')}
                    className="flex items-center justify-center gap-2 px-3 py-2.5 rounded-lg bg-white/5 hover:bg-white/10 border border-white/10 text-white text-xs font-semibold transition cursor-pointer disabled:opacity-50"
                  >
                    <svg className="w-4 h-4" viewBox="0 0 24 24">
                      <path
                        fill="#4285F4"
                        d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                      />
                      <path
                        fill="#34A853"
                        d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                      />
                      <path
                        fill="#FBBC05"
                        d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
                      />
                      <path
                        fill="#EA4335"
                        d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
                      />
                    </svg>
                    <span>Google</span>
                  </button>

                  {/* Apple OAuth Button */}
                  <button
                    type="button"
                    disabled={isLoading}
                    onClick={() => handleSocialLogin('Apple')}
                    className="flex items-center justify-center gap-2 px-3 py-2.5 rounded-lg bg-white/5 hover:bg-white/10 border border-white/10 text-white text-xs font-semibold transition cursor-pointer disabled:opacity-50"
                  >
                    <svg className="w-4 h-4 fill-white" viewBox="0 0 24 24">
                      <path d="M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.3-1.32-3.14-2.53C4.25 17 2.94 12.45 4.7 9.39c.87-1.52 2.43-2.48 4.12-2.51 1.28-.02 2.5.87 3.29.87.78 0 2.26-1.07 3.81-.91.65.03 2.47.26 3.64 1.98-.09.06-2.17 1.28-2.15 3.81.03 3.02 2.65 4.03 2.68 4.04-.03.07-.42 1.44-1.38 2.83M15.97 6.37c.62-.75 1.04-1.8 0.93-2.85-.9.04-1.99.6-2.63 1.35-.57.65-1.07 1.72-.94 2.74 1 .08 2.02-.49 2.64-1.24z" />
                    </svg>
                    <span>Apple</span>
                  </button>
                </div>

                {/* Instant 1-Click VIP Demo Guest Button */}
                <button
                  type="button"
                  disabled={isLoading}
                  onClick={() => handleSocialLogin('Demo')}
                  className="w-full flex items-center justify-center gap-2 px-3 py-2 rounded-lg bg-[#FF5757]/10 hover:bg-[#FF5757]/20 border border-[#FF5757]/30 text-[#FF5757] text-xs font-bold transition cursor-pointer disabled:opacity-50"
                >
                  <Sparkles className="w-3.5 h-3.5" />
                  <span>Instant 1-Click VIP Demo Login</span>
                </button>

                {/* Divider */}
                <div className="relative flex py-2 items-center">
                  <div className="flex-grow border-t border-white/10" />
                  <span className="flex-shrink mx-3 text-[10px] uppercase font-bold tracking-widest text-stone-300">
                    Or with email
                  </span>
                  <div className="flex-grow border-t border-white/10" />
                </div>
              </div>
            )}

            {/* ========================================================= */}
            {/* 1. SIGN IN FORM */}
            {/* ========================================================= */}
            {mode === 'login' && (
              <form onSubmit={handleLoginSubmit} className="space-y-4">
                {/* Email Field */}
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-stone-300 mb-1.5">
                    Email Address
                  </label>
                  <div className="relative">
                    <Mail className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-stone-300" />
                    <input
                      type="email"
                      value={loginData.email}
                      onChange={(e) => {
                        setLoginData({ ...loginData, email: e.target.value });
                        if (loginErrors.email) setLoginErrors({ ...loginErrors, email: undefined });
                      }}
                      placeholder="name@example.com"
                      className={`w-full bg-white/5 border ${
                        loginErrors.email ? 'border-rose-500' : 'border-white/10 focus:border-[#FF5757]'
                      } rounded-lg pl-9 pr-3 py-2.5 text-xs text-white placeholder-stone-400 focus:outline-none transition`}
                    />
                  </div>
                  {loginErrors.email && (
                    <p className="text-[11px] text-rose-400 mt-1 flex items-center gap-1 font-medium">
                      <AlertCircle className="w-3 h-3 shrink-0" />
                      {loginErrors.email}
                    </p>
                  )}
                </div>

                {/* Password Field */}
                <div>
                  <div className="flex items-center justify-between mb-1.5">
                    <label className="block text-xs font-bold uppercase tracking-wider text-stone-300">
                      Password
                    </label>
                    <button
                      type="button"
                      onClick={() => {
                        setMode('forgot');
                        setAuthError(null);
                      }}
                      className="text-[11px] text-[#FF5757] hover:underline cursor-pointer"
                    >
                      Forgot password?
                    </button>
                  </div>
                  <div className="relative">
                    <Lock className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-stone-300" />
                    <input
                      type={showPassword ? 'text' : 'password'}
                      value={loginData.password}
                      onChange={(e) => {
                        setLoginData({ ...loginData, password: e.target.value });
                        if (loginErrors.password) setLoginErrors({ ...loginErrors, password: undefined });
                      }}
                      placeholder="••••••••"
                      className={`w-full bg-white/5 border ${
                        loginErrors.password ? 'border-rose-500' : 'border-white/10 focus:border-[#FF5757]'
                      } rounded-lg pl-9 pr-10 py-2.5 text-xs text-white placeholder-stone-400 focus:outline-none transition font-mono`}
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-stone-300 hover:text-white transition cursor-pointer"
                    >
                      {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>
                  {loginErrors.password && (
                    <p className="text-[11px] text-rose-400 mt-1 flex items-center gap-1 font-medium">
                      <AlertCircle className="w-3 h-3 shrink-0" />
                      {loginErrors.password}
                    </p>
                  )}
                </div>

                {/* Remember Me */}
                <div className="flex items-center justify-between pt-1">
                  <label className="flex items-center gap-2 cursor-pointer select-none">
                    <input
                      type="checkbox"
                      checked={loginData.rememberMe}
                      onChange={(e) => setLoginData({ ...loginData, rememberMe: e.target.checked })}
                      className="w-4 h-4 rounded border-white/20 bg-white/5 text-[#FF5757] focus:ring-[#FF5757] cursor-pointer"
                    />
                    <span className="text-xs text-stone-300">Keep me signed in</span>
                  </label>
                  <span className="text-[11px] text-emerald-400 font-semibold flex items-center gap-1">
                    <ShieldCheck className="w-3.5 h-3.5" />
                    256-Bit SSL
                  </span>
                </div>

                {/* Submit Button */}
                <button
                  type="submit"
                  disabled={isLoading}
                  className="w-full mt-2 py-3 bg-[#FF5757] hover:bg-[#ff4242] text-white text-xs font-bold uppercase tracking-wider rounded-lg shadow-lg shadow-[#FF5757]/20 flex items-center justify-center gap-2 transition cursor-pointer disabled:opacity-50"
                >
                  {isLoading ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" />
                      <span>Authenticating Credentials...</span>
                    </>
                  ) : (
                    <>
                      <span>Sign In & Shop Now</span>
                      <ArrowRight className="w-4 h-4" />
                    </>
                  )}
                </button>
              </form>
            )}

            {/* ========================================================= */}
            {/* 2. SIGN UP / CREATE ACCOUNT FORM */}
            {/* ========================================================= */}
            {mode === 'signup' && (
              <form onSubmit={handleSignupSubmit} className="space-y-3.5">
                {/* Full Name */}
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-stone-300 mb-1">
                    Full Name
                  </label>
                  <div className="relative">
                    <User className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-stone-300" />
                    <input
                      type="text"
                      value={signupData.name}
                      onChange={(e) => {
                        setSignupData({ ...signupData, name: e.target.value });
                        if (signupErrors.name) setSignupErrors({ ...signupErrors, name: undefined });
                      }}
                      placeholder="Shaikh Kamran"
                      className={`w-full bg-white/5 border ${
                        signupErrors.name ? 'border-rose-500' : 'border-white/10 focus:border-[#FF5757]'
                      } rounded-lg pl-9 pr-3 py-2 text-xs text-white placeholder-stone-400 focus:outline-none transition`}
                    />
                  </div>
                  {signupErrors.name && (
                    <p className="text-[11px] text-rose-400 mt-1 flex items-center gap-1 font-medium">
                      <AlertCircle className="w-3 h-3 shrink-0" />
                      {signupErrors.name}
                    </p>
                  )}
                </div>

                {/* Email Address */}
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-stone-300 mb-1">
                    Email Address
                  </label>
                  <div className="relative">
                    <Mail className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-stone-300" />
                    <input
                      type="email"
                      value={signupData.email}
                      onChange={(e) => {
                        setSignupData({ ...signupData, email: e.target.value });
                        if (signupErrors.email) setSignupErrors({ ...signupErrors, email: undefined });
                      }}
                      placeholder="name@example.com"
                      className={`w-full bg-white/5 border ${
                        signupErrors.email ? 'border-rose-500' : 'border-white/10 focus:border-[#FF5757]'
                      } rounded-lg pl-9 pr-3 py-2 text-xs text-white placeholder-stone-400 focus:outline-none transition`}
                    />
                  </div>
                  {signupErrors.email && (
                    <p className="text-[11px] text-rose-400 mt-1 flex items-center gap-1 font-medium">
                      <AlertCircle className="w-3 h-3 shrink-0" />
                      {signupErrors.email}
                    </p>
                  )}
                </div>

                {/* Phone Number (Optional) */}
                <div>
                  <div className="flex items-center justify-between mb-1">
                    <label className="block text-xs font-bold uppercase tracking-wider text-stone-300">
                      Mobile Number
                    </label>
                    <span className="text-[10px] text-stone-300 uppercase">For Courier Updates</span>
                  </div>
                  <div className="relative">
                    <Phone className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-stone-300" />
                    <input
                      type="tel"
                      value={signupData.phone}
                      onChange={(e) => {
                        setSignupData({ ...signupData, phone: e.target.value });
                        if (signupErrors.phone) setSignupErrors({ ...signupErrors, phone: undefined });
                      }}
                      placeholder="+1 (555) 019-2834"
                      className={`w-full bg-white/5 border ${
                        signupErrors.phone ? 'border-rose-500' : 'border-white/10 focus:border-[#FF5757]'
                      } rounded-lg pl-9 pr-3 py-2 text-xs text-white placeholder-stone-400 focus:outline-none transition`}
                    />
                  </div>
                  {signupErrors.phone && (
                    <p className="text-[11px] text-rose-400 mt-1 flex items-center gap-1 font-medium">
                      <AlertCircle className="w-3 h-3 shrink-0" />
                      {signupErrors.phone}
                    </p>
                  )}
                </div>

                {/* Password & Live Strength Meter */}
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-stone-300 mb-1">
                    Password (Min. 8 chars, 1 uppercase, 1 number)
                  </label>
                  <div className="relative">
                    <Lock className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-stone-300" />
                    <input
                      type={showPassword ? 'text' : 'password'}
                      value={signupData.password}
                      onChange={(e) => {
                        setSignupData({ ...signupData, password: e.target.value });
                        if (signupErrors.password) setSignupErrors({ ...signupErrors, password: undefined });
                      }}
                      placeholder="••••••••"
                      className={`w-full bg-white/5 border ${
                        signupErrors.password ? 'border-rose-500' : 'border-white/10 focus:border-[#FF5757]'
                      } rounded-lg pl-9 pr-10 py-2 text-xs text-white placeholder-stone-400 focus:outline-none transition font-mono`}
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-stone-300 hover:text-white transition cursor-pointer"
                    >
                      {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>

                  {/* Dynamic Password Strength Visualizer */}
                  {signupData.password && (
                    <div className="mt-2 space-y-1">
                      <div className="flex gap-1.5 h-1">
                        {[0, 1, 2, 3].map((step) => (
                          <div
                            key={step}
                            className={`flex-1 rounded-full transition-all duration-300 ${
                              step < passwordScore ? strengthColors[passwordScore - 1] : 'bg-white/10'
                            }`}
                          />
                        ))}
                      </div>
                      <div className="flex justify-between text-[10px]">
                        <span className="text-stone-300">Security:</span>
                        <span className="font-bold text-stone-300">
                          {strengthLabels[Math.max(0, passwordScore - 1)]}
                        </span>
                      </div>
                    </div>
                  )}

                  {signupErrors.password && (
                    <p className="text-[11px] text-rose-400 mt-1 flex items-center gap-1 font-medium">
                      <AlertCircle className="w-3 h-3 shrink-0" />
                      {signupErrors.password}
                    </p>
                  )}
                </div>

                {/* Confirm Password */}
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-stone-300 mb-1">
                    Confirm Password
                  </label>
                  <div className="relative">
                    <Lock className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-stone-300" />
                    <input
                      type={showConfirmPassword ? 'text' : 'password'}
                      value={signupData.confirmPassword}
                      onChange={(e) => {
                        setSignupData({ ...signupData, confirmPassword: e.target.value });
                        if (signupErrors.confirmPassword) {
                          setSignupErrors({ ...signupErrors, confirmPassword: undefined });
                        }
                      }}
                      placeholder="••••••••"
                      className={`w-full bg-white/5 border ${
                        signupErrors.confirmPassword ? 'border-rose-500' : 'border-white/10 focus:border-[#FF5757]'
                      } rounded-lg pl-9 pr-10 py-2 text-xs text-white placeholder-stone-400 focus:outline-none transition font-mono`}
                    />
                    <button
                      type="button"
                      onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-stone-300 hover:text-white transition cursor-pointer"
                    >
                      {showConfirmPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>
                  {signupErrors.confirmPassword && (
                    <p className="text-[11px] text-rose-400 mt-1 flex items-center gap-1 font-medium">
                      <AlertCircle className="w-3 h-3 shrink-0" />
                      {signupErrors.confirmPassword}
                    </p>
                  )}
                </div>

                {/* Terms & Conditions Checkbox */}
                <div className="pt-1">
                  <label className="flex items-start gap-2 cursor-pointer select-none">
                    <input
                      type="checkbox"
                      checked={signupData.acceptTerms}
                      onChange={(e) => {
                        setSignupData({ ...signupData, acceptTerms: e.target.checked });
                        if (signupErrors.acceptTerms) {
                          setSignupErrors({ ...signupErrors, acceptTerms: undefined });
                        }
                      }}
                      className="w-4 h-4 rounded border-white/20 bg-white/5 text-[#FF5757] focus:ring-[#FF5757] cursor-pointer mt-0.5"
                    />
                    <span className="text-[11px] text-stone-300 leading-snug">
                      I agree to the Apparellex VIP Club Terms, Doorstep Try-On guidelines, and receive delivery dispatch SMS alerts.
                    </span>
                  </label>
                  {signupErrors.acceptTerms && (
                    <p className="text-[11px] text-rose-400 mt-1 flex items-center gap-1 font-medium">
                      <AlertCircle className="w-3 h-3 shrink-0" />
                      {signupErrors.acceptTerms}
                    </p>
                  )}
                </div>

                {/* Submit Button */}
                <button
                  type="submit"
                  disabled={isLoading}
                  className="w-full mt-2 py-3 bg-[#FF5757] hover:bg-[#ff4242] text-white text-xs font-bold uppercase tracking-wider rounded-lg shadow-lg shadow-[#FF5757]/20 flex items-center justify-center gap-2 transition cursor-pointer disabled:opacity-50"
                >
                  {isLoading ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" />
                      <span>Creating VIP Account & Crediting $20...</span>
                    </>
                  ) : (
                    <>
                      <span>Complete Registration</span>
                      <ArrowRight className="w-4 h-4" />
                    </>
                  )}
                </button>
              </form>
            )}

            {/* ========================================================= */}
            {/* 3. FORGOT PASSWORD RECOVERY FORM */}
            {/* ========================================================= */}
            {mode === 'forgot' && (
              <div className="space-y-4">
                {forgotSubmitted ? (
                  <div className="p-6 rounded-xl bg-white/5 border border-white/10 text-center space-y-3">
                    <div className="w-12 h-12 rounded-full bg-emerald-500/20 text-emerald-400 flex items-center justify-center mx-auto">
                      <Check className="w-6 h-6" />
                    </div>
                    <h4 className="text-sm font-bold text-white uppercase tracking-wider">
                      Reset Link Sent
                    </h4>
                    <p className="text-xs text-stone-300 leading-relaxed">
                      We have dispatched an encrypted password recovery link to{' '}
                      <span className="font-semibold text-white">{forgotEmail}</span>. Please check your inbox and spam folder.
                    </p>
                    <button
                      type="button"
                      onClick={() => {
                        setMode('login');
                        setForgotSubmitted(false);
                      }}
                      className="px-4 py-2 bg-[#FF5757] text-white text-xs font-bold rounded-lg cursor-pointer hover:bg-[#ff4242] transition"
                    >
                      Return to Sign In
                    </button>
                  </div>
                ) : (
                  <form onSubmit={handleForgotSubmit} className="space-y-4">
                    <div>
                      <label className="block text-xs font-bold uppercase tracking-wider text-stone-300 mb-1.5">
                        Your Registered Email
                      </label>
                      <div className="relative">
                        <Mail className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-stone-300" />
                        <input
                          type="email"
                          value={forgotEmail}
                          onChange={(e) => {
                            setForgotEmail(e.target.value);
                            setForgotError(null);
                          }}
                          placeholder="name@example.com"
                          className="w-full bg-white/5 border border-white/10 focus:border-[#FF5757] rounded-lg pl-9 pr-3 py-2.5 text-xs text-white placeholder-stone-400 focus:outline-none transition"
                        />
                      </div>
                      {forgotError && (
                        <p className="text-[11px] text-rose-400 mt-1 flex items-center gap-1 font-medium">
                          <AlertCircle className="w-3 h-3 shrink-0" />
                          {forgotError}
                        </p>
                      )}
                    </div>

                    <button
                      type="submit"
                      disabled={isLoading}
                      className="w-full py-3 bg-[#FF5757] hover:bg-[#ff4242] text-white text-xs font-bold uppercase tracking-wider rounded-lg shadow-lg flex items-center justify-center gap-2 transition cursor-pointer disabled:opacity-50"
                    >
                      {isLoading ? (
                        <>
                          <Loader2 className="w-4 h-4 animate-spin" />
                          <span>Generating Secure Token...</span>
                        </>
                      ) : (
                        <>
                          <span>Send Recovery Email</span>
                          <ArrowRight className="w-4 h-4" />
                        </>
                      )}
                    </button>

                    <button
                      type="button"
                      onClick={() => setMode('login')}
                      className="w-full py-2 text-xs text-stone-400 hover:text-white transition text-center cursor-pointer"
                    >
                      Remember your password? Sign in
                    </button>
                  </form>
                )}
              </div>
            )}
          </div>

          {/* Bottom Security Badges */}
          <div className="pt-4 mt-6 border-t border-white/5 flex items-center justify-between text-[11px] text-stone-400">
            <div className="flex items-center gap-1.5">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
              <span>TLS 1.3 End-to-End Encryption</span>
            </div>
            <div className="flex items-center gap-1.5">
              <Bike className="w-3.5 h-3.5 text-[#FF5757]" />
              <span>100% Electric Dispatch</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
