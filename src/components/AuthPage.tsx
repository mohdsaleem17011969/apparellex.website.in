import React, { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import {
  ArrowLeft,
  Eye,
  EyeOff,
  Check,
  AlertCircle,
  Loader2,
  Sparkles,
  ShieldCheck,
  Smartphone,
  Mail,
  Lock,
  User as UserIcon,
  ChevronDown,
  RefreshCw,
  Gift,
  HelpCircle,
  Clock,
  Zap,
} from 'lucide-react';
import {
  AuthUser,
  COUNTRY_CODES,
  loginSchema,
  LoginFormData,
  registerSchema,
  RegisterFormData,
  otpRequestSchema,
  OtpRequestFormData,
  otpVerifySchema,
  OtpVerifyFormData,
  forgotPasswordSchema,
  ForgotPasswordFormData,
} from '../types/auth';

export interface AuthPageProps {
  onBackToStore: () => void;
  onAuthSuccess: (user: AuthUser, promoApplied?: string) => void;
  initialMode?: 'signin' | 'register' | 'otp';
  brandName?: string;
}

type AuthMode = 'signin' | 'register' | 'otp-request' | 'otp-verify' | 'forgot-password';

const CAMPAIGN_HEROES = [
  {
    id: 'campaign-1',
    season: 'A/W 2026 CAPSULE',
    headline: 'Curated collections for modern living.',
    subquote: 'High-end fabrics, structured silhouettes, delivered in 10 minutes flat.',
    image: 'https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?auto=format&fit=crop&w=1600&q=85',
    tag: 'EDITORIAL DROP',
  },
  {
    id: 'campaign-2',
    season: 'MONOCHROME ATELIER',
    headline: 'Brutalist cuts. Pure tactile cotton.',
    subquote: 'Quiet luxury crafted for effortless daily elevation.',
    image: 'https://images.unsplash.com/photo-1509631179647-0177331693ae?auto=format&fit=crop&w=1600&q=85',
    tag: 'LIMITED RUN',
  },
  {
    id: 'campaign-3',
    season: 'RUNWAY EDIT',
    headline: 'The new standard in instant fashion.',
    subquote: 'Doorstep try-on and immediate courier return in one seamless drop.',
    image: 'https://images.unsplash.com/photo-1490481651871-ab68de25d43d?auto=format&fit=crop&w=1600&q=85',
    tag: 'VIP PRIVILEGE',
  },
];

export const AuthPage: React.FC<AuthPageProps> = ({
  onBackToStore,
  onAuthSuccess,
  initialMode = 'signin',
  brandName = 'APPARELLEX',
}) => {
  const [mode, setMode] = useState<AuthMode>(
    initialMode === 'register' ? 'register' : initialMode === 'otp' ? 'otp-request' : 'signin'
  );
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isSubmittingSocial, setIsSubmittingSocial] = useState<'google' | 'apple' | null>(null);
  const [activeHeroIndex, setActiveHeroIndex] = useState(0);
  const [otpPhoneData, setOtpPhoneData] = useState<{ countryCode: string; phone: string }>({
    countryCode: '+1',
    phone: '',
  });
  const [otpTimer, setOtpTimer] = useState(45);
  const [isOtpTimerActive, setIsOtpTimerActive] = useState(false);
  const [forgotSuccessNotice, setForgotSuccessNotice] = useState<string | null>(null);
  const [authBannerNotice, setAuthBannerNotice] = useState<string | null>(null);

  // Form instances with zod validation
  const {
    register: registerLogin,
    handleSubmit: handleLoginSubmit,
    formState: { errors: loginErrors, isSubmitting: isLoggingIn },
  } = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      identifier: '',
      password: '',
      rememberMe: true,
    },
    mode: 'onTouched',
  });

  const {
    register: registerSignup,
    handleSubmit: handleRegisterSubmit,
    formState: { errors: registerErrors, isSubmitting: isRegistering },
  } = useForm<RegisterFormData>({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      fullName: '',
      email: '',
      phone: '',
      password: '',
      agreeTerms: true,
      vipPerksConsent: true,
    },
    mode: 'onTouched',
  });

  const {
    register: registerOtpReq,
    handleSubmit: handleOtpReqSubmit,
    formState: { errors: otpReqErrors, isSubmitting: isSendingOtp },
  } = useForm<OtpRequestFormData>({
    resolver: zodResolver(otpRequestSchema),
    defaultValues: {
      countryCode: '+1',
      phone: '',
    },
    mode: 'onTouched',
  });

  const {
    register: registerOtpVerify,
    handleSubmit: handleOtpVerifySubmit,
    setValue: setOtpCodeValue,
    watch: watchOtpVerify,
    formState: { errors: otpVerifyErrors, isSubmitting: isVerifyingOtp },
  } = useForm<OtpVerifyFormData>({
    resolver: zodResolver(otpVerifySchema),
    defaultValues: {
      code: '',
    },
    mode: 'onChange',
  });

  const {
    register: registerForgot,
    handleSubmit: handleForgotSubmit,
    formState: { errors: forgotErrors, isSubmitting: isSendingForgot },
  } = useForm<ForgotPasswordFormData>({
    resolver: zodResolver(forgotPasswordSchema),
    defaultValues: {
      identifier: '',
    },
    mode: 'onTouched',
  });

  // Cycle background hero slides gently every 8 seconds
  useEffect(() => {
    const timer = setInterval(() => {
      setActiveHeroIndex((prev) => (prev + 1) % CAMPAIGN_HEROES.length);
    }, 8000);
    return () => clearInterval(timer);
  }, []);

  // OTP countdown timer
  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (isOtpTimerActive && otpTimer > 0) {
      interval = setInterval(() => {
        setOtpTimer((prev) => prev - 1);
      }, 1000);
    } else if (otpTimer === 0) {
      setIsOtpTimerActive(false);
    }
    return () => clearInterval(interval);
  }, [isOtpTimerActive, otpTimer]);

  // Handle standard Login Submit
  const onLogin = async (data: LoginFormData) => {
    // Simulate real auth network call
    await new Promise((resolve) => setTimeout(resolve, 850));

    const isEmail = data.identifier.includes('@');
    const user: AuthUser = {
      id: `usr-${Date.now()}`,
      name: isEmail ? data.identifier.split('@')[0].replace('.', ' ') : 'Verified VIP Customer',
      email: isEmail ? data.identifier : `${data.identifier.replace(/\D/g, '')}@apparellex.vip`,
      phone: !isEmail ? data.identifier : '+1 (555) 019-2834',
      avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=400&q=80',
      isVip: true,
      joinedDate: 'Joined Oct 2026',
      tier: 'VIP Vault Member',
      token: `apx_tok_${Date.now()}`,
    };

    onAuthSuccess(user);
  };

  // Handle Register Submit
  const onRegister = async (data: RegisterFormData) => {
    await new Promise((resolve) => setTimeout(resolve, 950));

    const user: AuthUser = {
      id: `usr-${Date.now()}`,
      name: data.fullName.trim(),
      email: data.email.trim(),
      phone: data.phone || '',
      avatar: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&w=400&q=80',
      isVip: true,
      joinedDate: 'Joined Today',
      tier: 'VIP Vault Member',
      token: `apx_tok_${Date.now()}`,
    };

    onAuthSuccess(user, 'WELCOME10');
  };

  // Handle OTP Request
  const onOtpRequest = async (data: OtpRequestFormData) => {
    await new Promise((resolve) => setTimeout(resolve, 750));
    setOtpPhoneData({
      countryCode: data.countryCode,
      phone: data.phone,
    });
    setOtpTimer(45);
    setIsOtpTimerActive(true);
    setMode('otp-verify');
    setAuthBannerNotice(`Verification code sent to ${data.countryCode} ${data.phone}. Use demo code: 820419`);
  };

  // Handle OTP Verification
  const onOtpVerify = async (data: OtpVerifyFormData) => {
    await new Promise((resolve) => setTimeout(resolve, 800));

    const user: AuthUser = {
      id: `usr-${Date.now()}`,
      name: `Member ${otpPhoneData.phone.slice(-4)}`,
      email: `user.${otpPhoneData.phone.slice(-4)}@apparellex.com`,
      phone: `${otpPhoneData.countryCode} ${otpPhoneData.phone}`,
      avatar: 'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?auto=format&fit=crop&w=400&q=80',
      isVip: true,
      joinedDate: 'Joined Today via SMS',
      tier: 'VIP Vault Member',
      token: `apx_tok_sms_${Date.now()}`,
    };

    onAuthSuccess(user);
  };

  // Handle Social Login (Google / Apple)
  const handleSocialLogin = async (provider: 'google' | 'apple') => {
    setIsSubmittingSocial(provider);
    await new Promise((resolve) => setTimeout(resolve, 900));

    const user: AuthUser = {
      id: `usr-${provider}-${Date.now()}`,
      name: provider === 'google' ? 'Elena Rostova' : 'Amelia Vance',
      email: provider === 'google' ? 'elena.rostova@gmail.com' : 'amelia.vance@icloud.com',
      avatar:
        provider === 'google'
          ? 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=400&q=80'
          : 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=400&q=80',
      isVip: true,
      joinedDate: 'Member since 2025',
      tier: 'VIP Vault Member',
      token: `apx_social_${provider}_${Date.now()}`,
    };

    setIsSubmittingSocial(null);
    onAuthSuccess(user);
  };

  // Handle Forgot Password
  const onForgotSubmit = async (data: ForgotPasswordFormData) => {
    await new Promise((resolve) => setTimeout(resolve, 750));
    setForgotSuccessNotice(
      `Password reset instructions have been dispatched to ${data.identifier}. Please check your inbox or SMS.`
    );
  };

  const currentHero = CAMPAIGN_HEROES[activeHeroIndex];

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-[#FEFCF5] text-[#1a1a1a] flex flex-col lg:flex-row antialiased selection:bg-[#FF5757] selection:text-white">
      {/* ========================================================= */}
      {/* DESKTOP LEFT / EDITORIAL IMAGERY SIDE (50%–55% width)     */}
      {/* Transitions to compact mobile banner on small screens     */}
      {/* ========================================================= */}
      <aside
        aria-label="Campaign Editorial"
        className="relative w-full lg:w-[52%] xl:w-[54%] h-64 sm:h-80 lg:h-full min-h-0 lg:min-h-screen shrink-0 overflow-hidden bg-[#111111] flex flex-col justify-between"
      >
        {/* Background Editorial Campaign Image with smooth fade */}
        <div className="absolute inset-0">
          <img
            key={currentHero.image}
            src={currentHero.image}
            alt={currentHero.headline}
            className="w-full h-full object-cover object-center transform scale-100 transition-all duration-1000 ease-out filter brightness-90 contrast-105"
            referrerPolicy="no-referrer"
          />
          {/* Subtle multi-layer cinematic vignette & gradient overlay */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/35 to-black/50" />
          <div className="absolute inset-0 bg-radial from-transparent via-black/20 to-black/60 mix-blend-multiply" />
        </div>

        {/* Top Floating Editorial Meta */}
        <div className="relative z-10 p-6 sm:p-8 lg:p-12 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-full bg-white/10 backdrop-blur-md border border-white/20 flex items-center justify-center text-white">
              <Zap className="w-4 h-4 fill-white" />
            </div>
            <div>
              <span className="text-white font-fashion font-black tracking-[0.25em] text-sm uppercase">
                {brandName}
              </span>
              <span className="block text-[9px] text-white/70 font-mono tracking-widest uppercase">
                Atelier & Studio
              </span>
            </div>
          </div>

          <div className="hidden sm:inline-flex items-center gap-2 px-3 py-1 rounded-full bg-black/40 backdrop-blur-md border border-white/15 text-white/90 text-[10px] font-mono tracking-wider">
            <span className="w-1.5 h-1.5 rounded-full bg-[#FF5757] animate-pulse" />
            <span>{currentHero.season}</span>
          </div>
        </div>

        {/* Bottom Campaign Quote & Perks Callout */}
        <div className="relative z-10 p-6 sm:p-8 lg:p-12 space-y-4">
          <div className="inline-block px-2.5 py-0.5 rounded-sm bg-[#FF5757] text-white text-[10px] font-black uppercase tracking-widest font-mono">
            {currentHero.tag}
          </div>

          <div className="space-y-2 max-w-lg">
            <h2 className="text-2xl sm:text-3xl lg:text-4xl font-fashion font-bold text-white tracking-tight leading-tight">
              {currentHero.headline}
            </h2>
            <p className="text-xs sm:text-sm text-stone-200/90 font-light leading-relaxed max-w-md hidden sm:block">
              {currentHero.subquote}
            </p>
          </div>

          {/* Campaign Pagination Dots & Trust Metric */}
          <div className="pt-2 flex items-center justify-between border-t border-white/15">
            <div className="flex items-center gap-2">
              {CAMPAIGN_HEROES.map((h, i) => (
                <button
                  key={h.id}
                  onClick={() => setActiveHeroIndex(i)}
                  aria-label={`View campaign slide ${i + 1}`}
                  className={`h-1.5 rounded-full transition-all duration-300 cursor-pointer ${
                    activeHeroIndex === i ? 'w-8 bg-[#FF5757]' : 'w-2 bg-white/40 hover:bg-white/70'
                  }`}
                />
              ))}
            </div>

            <div className="flex items-center gap-2 text-white/80 text-[11px] font-medium">
              <Clock className="w-3.5 h-3.5 text-[#FF5757]" />
              <span className="font-mono">10-Min Doorstep Try-On</span>
            </div>
          </div>
        </div>
      </aside>

      {/* ========================================================= */}
      {/* RIGHT / AUTHENTICATION FORM SIDE (Off-White Luxury Feel)   */}
      {/* ========================================================= */}
      <main className="flex-1 flex flex-col justify-between p-6 sm:p-10 lg:p-14 xl:p-16 bg-[#FEFCF5] max-w-2xl mx-auto w-full min-h-screen">
        {/* Top Header Navigation */}
        <header className="flex items-center justify-between pb-8">
          <button
            onClick={onBackToStore}
            className="group inline-flex items-center gap-2 text-xs font-semibold text-stone-600 hover:text-black transition-colors cursor-pointer py-1.5 px-2 -ml-2 rounded-lg hover:bg-black/5"
            aria-label="Return to store catalog"
          >
            <ArrowLeft className="w-4 h-4 text-stone-400 group-hover:text-black group-hover:-translate-x-0.5 transition-transform" />
            <span>Back to store</span>
          </button>

          <div className="flex items-center gap-1.5 text-[11px] text-stone-500 font-mono">
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
            <span>Encrypted 256-Bit SSL</span>
          </div>
        </header>

        {/* Content Card Body */}
        <div className="my-auto space-y-6 w-full">
          {/* Brand Welcome Title & Subtitle */}
          <div className="space-y-1.5">
            <div className="flex items-center justify-between">
              <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-[#FF5757] font-mono">
                {mode === 'register'
                  ? 'VIP Membership Onboarding'
                  : mode === 'otp-request' || mode === 'otp-verify'
                  ? 'Passwordless Instant Login'
                  : mode === 'forgot-password'
                  ? 'Account Security Recovery'
                  : 'Client Portal'}
              </span>

              {/* Mode quick switch button */}
              {mode !== 'forgot-password' && (
                <div className="inline-flex p-0.5 rounded-lg bg-stone-100 border border-stone-200 text-[11px]">
                  <button
                    type="button"
                    onClick={() => {
                      setMode('signin');
                      setAuthBannerNotice(null);
                    }}
                    className={`px-3 py-1 rounded-md font-medium transition cursor-pointer ${
                      mode === 'signin' ? 'bg-white text-black shadow-xs font-semibold' : 'text-stone-500 hover:text-black'
                    }`}
                  >
                    Password
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setMode('otp-request');
                      setAuthBannerNotice(null);
                    }}
                    className={`px-3 py-1 rounded-md font-medium transition cursor-pointer ${
                      mode === 'otp-request' || mode === 'otp-verify'
                        ? 'bg-white text-black shadow-xs font-semibold'
                        : 'text-stone-500 hover:text-black'
                    }`}
                  >
                    SMS OTP
                  </button>
                </div>
              )}
            </div>

            <h1 className="text-2xl sm:text-3xl font-fashion font-bold text-stone-900 tracking-tight">
              {mode === 'register'
                ? 'Create your customer account'
                : mode === 'otp-request'
                ? 'Sign in via Mobile OTP'
                : mode === 'otp-verify'
                ? 'Enter 6-digit verification code'
                : mode === 'forgot-password'
                ? 'Reset your password'
                : 'Welcome back to Apparellex'}
            </h1>

            <p className="text-xs sm:text-sm text-stone-500 leading-relaxed">
              {mode === 'register'
                ? 'Unlock member pricing, private vault drops, and personalized fit recommendations.'
                : mode === 'otp-request'
                ? 'Enter your mobile number to receive a secure one-time passcode.'
                : mode === 'otp-verify'
                ? `We sent an SMS passcode to ${otpPhoneData.countryCode} ${otpPhoneData.phone}.`
                : mode === 'forgot-password'
                ? 'Enter your email or phone number and we will send a secure recovery link.'
                : 'Sign in to access your orders, saved addresses, and VIP drop privileges.'}
            </p>
          </div>

          {/* Incentive Banner for Register Mode or Alerts */}
          {mode === 'register' && (
            <div className="p-3.5 rounded-xl bg-gradient-to-r from-red-500/10 via-[#FF5757]/5 to-amber-500/10 border border-[#FF5757]/25 flex items-center gap-3">
              <div className="w-9 h-9 rounded-full bg-[#FF5757] text-white flex items-center justify-center shrink-0 shadow-xs">
                <Gift className="w-4 h-4" />
              </div>
              <div className="text-xs">
                <p className="font-bold text-stone-900">
                  New Customer Incentive: <span className="text-[#FF5757]">10% Off First Drop</span>
                </p>
                <p className="text-stone-600 text-[11px]">
                  Use promo code <span className="font-mono font-bold text-stone-900">WELCOME10</span> at checkout upon joining.
                </p>
              </div>
            </div>
          )}

          {authBannerNotice && (
            <div className="p-3 rounded-lg bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs flex items-center gap-2">
              <Check className="w-4 h-4 text-emerald-600 shrink-0" />
              <span>{authBannerNotice}</span>
            </div>
          )}

          {/* Social Logins (Google & Apple) - shown in standard Signin and Register */}
          {(mode === 'signin' || mode === 'register') && (
            <div className="space-y-3">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {/* Google Single Click Login */}
                <button
                  type="button"
                  onClick={() => handleSocialLogin('google')}
                  disabled={isSubmittingSocial !== null}
                  className="w-full flex items-center justify-center gap-2.5 px-4 py-2.5 rounded-xl border border-stone-200 hover:border-stone-400 bg-white hover:bg-stone-50 text-xs font-semibold text-stone-700 transition shadow-2xs cursor-pointer focus-visible:outline-2 focus-visible:outline-[#FF5757] disabled:opacity-60"
                  aria-label="Continue with Google account"
                >
                  {isSubmittingSocial === 'google' ? (
                    <Loader2 className="w-4 h-4 animate-spin text-stone-600" />
                  ) : (
                    <svg className="w-4 h-4" viewBox="0 0 24 24" aria-hidden="true">
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
                  )}
                  <span>Continue with Google</span>
                </button>

                {/* Apple Single Click Login */}
                <button
                  type="button"
                  onClick={() => handleSocialLogin('apple')}
                  disabled={isSubmittingSocial !== null}
                  className="w-full flex items-center justify-center gap-2.5 px-4 py-2.5 rounded-xl border border-stone-200 hover:border-stone-400 bg-white hover:bg-stone-50 text-xs font-semibold text-stone-700 transition shadow-2xs cursor-pointer focus-visible:outline-2 focus-visible:outline-[#FF5757] disabled:opacity-60"
                  aria-label="Continue with Apple account"
                >
                  {isSubmittingSocial === 'apple' ? (
                    <Loader2 className="w-4 h-4 animate-spin text-stone-600" />
                  ) : (
                    <svg className="w-4 h-4 fill-black" viewBox="0 0 24 24" aria-hidden="true">
                      <path d="M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.3-1.32-3.14-2.53C4.25 17 2.94 12.45 4.7 9.39c.87-1.52 2.43-2.48 4.12-2.51 1.28-.02 2.5.87 3.29.87.78 0 2.26-1.07 3.81-.91.65.03 2.47.26 3.64 1.98-.09.06-2.17 1.28-2.15 3.81.03 3.02 2.65 4.03 2.68 4.04-.03.07-.42 1.44-1.38 2.83M15.97 6.37c.62-.75 1.04-1.8 0.93-2.85-.9.04-1.99.6-2.63 1.35-.57.65-.99 1.71-.85 2.73 1 .08 2.03-.51 2.55-1.23z" />
                    </svg>
                  )}
                  <span>Continue with Apple</span>
                </button>
              </div>

              {/* Subtle divider line with 'Or continue with email / mobile' */}
              <div className="relative flex items-center justify-center py-2">
                <div className="w-full border-t border-stone-200" />
                <span className="absolute px-3 bg-[#FEFCF5] text-[11px] uppercase tracking-wider text-stone-400 font-mono">
                  Or continue with email / mobile
                </span>
              </div>
            </div>
          )}

          {/* ========================================================= */}
          {/* MODE 1: STANDARD SIGN IN (EMAIL OR MOBILE + PASSWORD)     */}
          {/* ========================================================= */}
          {mode === 'signin' && (
            <form onSubmit={handleLoginSubmit(onLogin)} className="space-y-4" noValidate>
              {/* Identifier Field */}
              <div className="space-y-1">
                <label
                  htmlFor="identifier"
                  className="block text-xs font-semibold text-stone-700 tracking-wide"
                >
                  Email Address or Mobile Number
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-stone-400">
                    <Mail className="w-4 h-4" />
                  </div>
                  <input
                    id="identifier"
                    type="text"
                    autoComplete="username"
                    placeholder="e.g. shaikh@apparellex.com or +1 (555) 019-2834"
                    {...registerLogin('identifier')}
                    className={`w-full pl-10 pr-3.5 py-2.5 bg-white border text-xs text-stone-900 rounded-xl transition shadow-2xs focus-visible:outline-2 ${
                      loginErrors.identifier
                        ? 'border-red-400 focus-visible:outline-red-500 bg-red-50/20'
                        : 'border-stone-200 hover:border-stone-300 focus-visible:outline-[#FF5757]'
                    }`}
                    aria-invalid={Boolean(loginErrors.identifier)}
                    aria-describedby={loginErrors.identifier ? 'identifier-error' : undefined}
                  />
                </div>
                {loginErrors.identifier && (
                  <p id="identifier-error" className="text-red-500 text-[11px] flex items-center gap-1 mt-1">
                    <AlertCircle className="w-3 h-3 shrink-0" />
                    <span>{loginErrors.identifier.message}</span>
                  </p>
                )}
              </div>

              {/* Password Field with Show/Hide Toggle */}
              <div className="space-y-1">
                <div className="flex items-center justify-between">
                  <label
                    htmlFor="password"
                    className="block text-xs font-semibold text-stone-700 tracking-wide"
                  >
                    Password
                  </label>
                  <button
                    type="button"
                    onClick={() => {
                      setForgotSuccessNotice(null);
                      setMode('forgot-password');
                    }}
                    className="text-xs text-[#FF5757] hover:underline font-medium transition cursor-pointer"
                  >
                    Forgot password?
                  </button>
                </div>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-stone-400">
                    <Lock className="w-4 h-4" />
                  </div>
                  <input
                    id="password"
                    type={showPassword ? 'text' : 'password'}
                    autoComplete="current-password"
                    placeholder="Enter your confidential password"
                    {...registerLogin('password')}
                    className={`w-full pl-10 pr-10 py-2.5 bg-white border text-xs text-stone-900 rounded-xl transition shadow-2xs focus-visible:outline-2 ${
                      loginErrors.password
                        ? 'border-red-400 focus-visible:outline-red-500 bg-red-50/20'
                        : 'border-stone-200 hover:border-stone-300 focus-visible:outline-[#FF5757]'
                    }`}
                    aria-invalid={Boolean(loginErrors.password)}
                    aria-describedby={loginErrors.password ? 'password-error' : undefined}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute inset-y-0 right-0 pr-3.5 flex items-center text-stone-400 hover:text-stone-700 transition cursor-pointer"
                    aria-label={showPassword ? 'Hide password' : 'Show password'}
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
                {loginErrors.password && (
                  <p id="password-error" className="text-red-500 text-[11px] flex items-center gap-1 mt-1">
                    <AlertCircle className="w-3 h-3 shrink-0" />
                    <span>{loginErrors.password.message}</span>
                  </p>
                )}
              </div>

              {/* Controls & Actions: Remember Me */}
              <div className="flex items-center justify-between pt-1">
                <label className="flex items-center gap-2 text-xs text-stone-600 cursor-pointer select-none">
                  <input
                    type="checkbox"
                    {...registerLogin('rememberMe')}
                    className="w-4 h-4 rounded border-stone-300 text-[#FF5757] accent-[#FF5757] focus:ring-[#FF5757] cursor-pointer"
                  />
                  <span>Remember me for 30 days</span>
                </label>
              </div>

              {/* Primary Sign In Button */}
              <button
                type="submit"
                disabled={isLoggingIn}
                className="w-full mt-2 py-3 px-4 bg-[#111111] hover:bg-black active:scale-[0.99] text-white text-xs font-bold uppercase tracking-widest rounded-xl shadow-md hover:shadow-lg transition flex items-center justify-center gap-2 cursor-pointer focus-visible:outline-2 focus-visible:outline-[#FF5757] disabled:opacity-60"
              >
                {isLoggingIn ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin text-[#FF5757]" />
                    <span>Authenticating Client...</span>
                  </>
                ) : (
                  <>
                    <span>Sign In</span>
                    <Sparkles className="w-3.5 h-3.5 text-[#FF5757]" />
                  </>
                )}
              </button>
            </form>
          )}

          {/* ========================================================= */}
          {/* MODE 2: REGISTRATION / CREATE AN ACCOUNT                  */}
          {/* ========================================================= */}
          {mode === 'register' && (
            <form onSubmit={handleRegisterSubmit(onRegister)} className="space-y-3.5" noValidate>
              {/* Full Name */}
              <div className="space-y-1">
                <label htmlFor="fullName" className="block text-xs font-semibold text-stone-700">
                  Full Name
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-stone-400">
                    <UserIcon className="w-4 h-4" />
                  </div>
                  <input
                    id="fullName"
                    type="text"
                    autoComplete="name"
                    placeholder="e.g. Shaikh Kamran"
                    {...registerSignup('fullName')}
                    className={`w-full pl-10 pr-3.5 py-2.5 bg-white border text-xs text-stone-900 rounded-xl transition shadow-2xs focus-visible:outline-2 ${
                      registerErrors.fullName
                        ? 'border-red-400 focus-visible:outline-red-500 bg-red-50/20'
                        : 'border-stone-200 hover:border-stone-300 focus-visible:outline-[#FF5757]'
                    }`}
                  />
                </div>
                {registerErrors.fullName && (
                  <p className="text-red-500 text-[11px] flex items-center gap-1 mt-1">
                    <AlertCircle className="w-3 h-3 shrink-0" />
                    <span>{registerErrors.fullName.message}</span>
                  </p>
                )}
              </div>

              {/* Email Address */}
              <div className="space-y-1">
                <label htmlFor="regEmail" className="block text-xs font-semibold text-stone-700">
                  Email Address
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-stone-400">
                    <Mail className="w-4 h-4" />
                  </div>
                  <input
                    id="regEmail"
                    type="email"
                    autoComplete="email"
                    placeholder="e.g. shaikh@apparellex.com"
                    {...registerSignup('email')}
                    className={`w-full pl-10 pr-3.5 py-2.5 bg-white border text-xs text-stone-900 rounded-xl transition shadow-2xs focus-visible:outline-2 ${
                      registerErrors.email
                        ? 'border-red-400 focus-visible:outline-red-500 bg-red-50/20'
                        : 'border-stone-200 hover:border-stone-300 focus-visible:outline-[#FF5757]'
                    }`}
                  />
                </div>
                {registerErrors.email && (
                  <p className="text-red-500 text-[11px] flex items-center gap-1 mt-1">
                    <AlertCircle className="w-3 h-3 shrink-0" />
                    <span>{registerErrors.email.message}</span>
                  </p>
                )}
              </div>

              {/* Optional Phone Number */}
              <div className="space-y-1">
                <div className="flex items-center justify-between">
                  <label htmlFor="regPhone" className="block text-xs font-semibold text-stone-700">
                    Mobile Phone (Optional for 10-Min Live Courier SMS)
                  </label>
                  <span className="text-[10px] text-stone-400">Optional</span>
                </div>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-stone-400">
                    <Smartphone className="w-4 h-4" />
                  </div>
                  <input
                    id="regPhone"
                    type="tel"
                    autoComplete="tel"
                    placeholder="+1 (555) 019-2834"
                    {...registerSignup('phone')}
                    className="w-full pl-10 pr-3.5 py-2.5 bg-white border border-stone-200 hover:border-stone-300 text-xs text-stone-900 rounded-xl transition shadow-2xs focus-visible:outline-2 focus-visible:outline-[#FF5757]"
                  />
                </div>
              </div>

              {/* Password */}
              <div className="space-y-1">
                <label htmlFor="regPassword" className="block text-xs font-semibold text-stone-700">
                  Create Password (8+ characters with letter & number)
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-stone-400">
                    <Lock className="w-4 h-4" />
                  </div>
                  <input
                    id="regPassword"
                    type={showConfirmPassword ? 'text' : 'password'}
                    autoComplete="new-password"
                    placeholder="Min 8 characters"
                    {...registerSignup('password')}
                    className={`w-full pl-10 pr-10 py-2.5 bg-white border text-xs text-stone-900 rounded-xl transition shadow-2xs focus-visible:outline-2 ${
                      registerErrors.password
                        ? 'border-red-400 focus-visible:outline-red-500 bg-red-50/20'
                        : 'border-stone-200 hover:border-stone-300 focus-visible:outline-[#FF5757]'
                    }`}
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    className="absolute inset-y-0 right-0 pr-3.5 flex items-center text-stone-400 hover:text-stone-700 transition cursor-pointer"
                  >
                    {showConfirmPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
                {registerErrors.password && (
                  <p className="text-red-500 text-[11px] flex items-center gap-1 mt-1">
                    <AlertCircle className="w-3 h-3 shrink-0" />
                    <span>{registerErrors.password.message}</span>
                  </p>
                )}
              </div>

              {/* Terms Checkbox */}
              <div className="space-y-2 pt-1">
                <label className="flex items-start gap-2 text-xs text-stone-600 cursor-pointer select-none">
                  <input
                    type="checkbox"
                    {...registerSignup('agreeTerms')}
                    className="w-4 h-4 mt-0.5 rounded border-stone-300 text-[#FF5757] accent-[#FF5757] focus:ring-[#FF5757] cursor-pointer"
                  />
                  <span className="leading-tight">
                    I agree to the Terms of Service & Privacy Policy, and confirm I am 18+ years of age.
                  </span>
                </label>
                {registerErrors.agreeTerms && (
                  <p className="text-red-500 text-[11px] flex items-center gap-1">
                    <AlertCircle className="w-3 h-3 shrink-0" />
                    <span>{registerErrors.agreeTerms.message}</span>
                  </p>
                )}
              </div>

              {/* Submit Registration Button */}
              <button
                type="submit"
                disabled={isRegistering}
                className="w-full mt-2 py-3 px-4 bg-[#FF5757] hover:bg-[#ff4242] active:scale-[0.99] text-white text-xs font-bold uppercase tracking-widest rounded-xl shadow-md hover:shadow-lg transition flex items-center justify-center gap-2 cursor-pointer focus-visible:outline-2 focus-visible:outline-black disabled:opacity-60"
              >
                {isRegistering ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin text-white" />
                    <span>Creating Client Vault...</span>
                  </>
                ) : (
                  <>
                    <span>Create Account & Unlock 10% Off</span>
                    <Sparkles className="w-3.5 h-3.5 text-white" />
                  </>
                )}
              </button>
            </form>
          )}

          {/* ========================================================= */}
          {/* MODE 3: MOBILE & OTP LOGIN - PHONE ENTRY                  */}
          {/* ========================================================= */}
          {mode === 'otp-request' && (
            <form onSubmit={handleOtpReqSubmit(onOtpRequest)} className="space-y-4" noValidate>
              <div className="space-y-1">
                <label className="block text-xs font-semibold text-stone-700 tracking-wide">
                  Mobile Number with Country Code
                </label>
                <div className="grid grid-cols-12 gap-2">
                  <div className="col-span-4 sm:col-span-4">
                    <select
                      {...registerOtpReq('countryCode')}
                      className="w-full py-2.5 px-2 bg-white border border-stone-200 text-xs text-stone-800 rounded-xl focus-visible:outline-[#FF5757] cursor-pointer"
                    >
                      {COUNTRY_CODES.map((c) => (
                        <option key={`${c.country}-${c.code}`} value={c.code}>
                          {c.flag} {c.code}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div className="col-span-8 sm:col-span-8 relative">
                    <input
                      type="tel"
                      placeholder="e.g. 555 019 2834"
                      {...registerOtpReq('phone')}
                      className={`w-full py-2.5 px-3 bg-white border text-xs text-stone-900 rounded-xl transition shadow-2xs focus-visible:outline-2 ${
                        otpReqErrors.phone
                          ? 'border-red-400 focus-visible:outline-red-500 bg-red-50/20'
                          : 'border-stone-200 hover:border-stone-300 focus-visible:outline-[#FF5757]'
                      }`}
                    />
                  </div>
                </div>
                {otpReqErrors.phone && (
                  <p className="text-red-500 text-[11px] flex items-center gap-1 mt-1">
                    <AlertCircle className="w-3 h-3 shrink-0" />
                    <span>{otpReqErrors.phone.message}</span>
                  </p>
                )}
                <p className="text-[11px] text-stone-500">
                  Standard carrier message and data rates may apply. A 6-digit code will arrive via SMS.
                </p>
              </div>

              <button
                type="submit"
                disabled={isSendingOtp}
                className="w-full mt-2 py-3 px-4 bg-[#111111] hover:bg-black text-white text-xs font-bold uppercase tracking-widest rounded-xl shadow-md transition flex items-center justify-center gap-2 cursor-pointer disabled:opacity-60"
              >
                {isSendingOtp ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin text-[#FF5757]" />
                    <span>Dispatching Passcode...</span>
                  </>
                ) : (
                  <>
                    <span>Send 6-Digit Passcode</span>
                    <Smartphone className="w-3.5 h-3.5 text-[#FF5757]" />
                  </>
                )}
              </button>
            </form>
          )}

          {/* ========================================================= */}
          {/* MODE 4: MOBILE & OTP LOGIN - VERIFICATION CODE ENTRY      */}
          {/* ========================================================= */}
          {mode === 'otp-verify' && (
            <form onSubmit={handleOtpVerifySubmit(onOtpVerify)} className="space-y-4" noValidate>
              <div className="p-3.5 rounded-xl bg-stone-100 border border-stone-200 flex items-center justify-between text-xs">
                <div>
                  <span className="text-stone-500 block text-[10px] uppercase font-mono">Sent To</span>
                  <span className="font-bold text-stone-900 font-mono">
                    {otpPhoneData.countryCode} {otpPhoneData.phone}
                  </span>
                </div>
                <button
                  type="button"
                  onClick={() => setMode('otp-request')}
                  className="text-xs text-[#FF5757] font-semibold hover:underline cursor-pointer"
                >
                  Change
                </button>
              </div>

              <div className="space-y-2">
                <label htmlFor="otpCode" className="block text-xs font-semibold text-stone-700 tracking-wide">
                  6-Digit Verification Code
                </label>
                <div className="relative">
                  <input
                    id="otpCode"
                    type="text"
                    maxLength={6}
                    placeholder="••••••"
                    autoComplete="one-time-code"
                    {...registerOtpVerify('code')}
                    className={`w-full py-3 px-4 bg-white border text-center text-xl font-mono tracking-[0.5em] text-stone-900 rounded-xl transition shadow-2xs focus-visible:outline-2 ${
                      otpVerifyErrors.code
                        ? 'border-red-400 focus-visible:outline-red-500 bg-red-50/20'
                        : 'border-stone-200 hover:border-stone-300 focus-visible:outline-[#FF5757]'
                    }`}
                  />
                </div>
                {otpVerifyErrors.code && (
                  <p className="text-red-500 text-[11px] flex items-center gap-1 mt-1">
                    <AlertCircle className="w-3 h-3 shrink-0" />
                    <span>{otpVerifyErrors.code.message}</span>
                  </p>
                )}

                {/* Quick Auto-Fill Demo Code Helper */}
                <div className="flex items-center justify-between text-[11px] text-stone-500 pt-1">
                  <span>
                    Auto-Fill Demo Code:{' '}
                    <button
                      type="button"
                      onClick={() => setOtpCodeValue('code', '820419', { shouldValidate: true })}
                      className="font-mono font-bold text-[#FF5757] hover:underline cursor-pointer"
                    >
                      820419
                    </button>
                  </span>

                  {isOtpTimerActive ? (
                    <span className="text-stone-400 font-mono">Resend in {otpTimer}s</span>
                  ) : (
                    <button
                      type="button"
                      onClick={() => {
                        setOtpTimer(45);
                        setIsOtpTimerActive(true);
                        setAuthBannerNotice('New SMS passcode dispatched.');
                      }}
                      className="text-[#FF5757] font-semibold hover:underline flex items-center gap-1 cursor-pointer"
                    >
                      <RefreshCw className="w-3 h-3" />
                      <span>Resend Code</span>
                    </button>
                  )}
                </div>
              </div>

              <button
                type="submit"
                disabled={isVerifyingOtp}
                className="w-full mt-2 py-3 px-4 bg-[#111111] hover:bg-black text-white text-xs font-bold uppercase tracking-widest rounded-xl shadow-md transition flex items-center justify-center gap-2 cursor-pointer disabled:opacity-60"
              >
                {isVerifyingOtp ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin text-[#FF5757]" />
                    <span>Verifying Credentials...</span>
                  </>
                ) : (
                  <>
                    <span>Verify Passcode & Enter Vault</span>
                    <Check className="w-4 h-4 text-emerald-400" />
                  </>
                )}
              </button>
            </form>
          )}

          {/* ========================================================= */}
          {/* MODE 5: FORGOT PASSWORD RECOVERY FLOW                     */}
          {/* ========================================================= */}
          {mode === 'forgot-password' && (
            <div className="space-y-4">
              {forgotSuccessNotice ? (
                <div className="p-4 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-900 space-y-3">
                  <div className="flex items-center gap-2 font-bold text-xs text-emerald-800">
                    <Check className="w-4 h-4 text-emerald-600" />
                    <span>Reset Link Dispatched</span>
                  </div>
                  <p className="text-xs text-emerald-700 leading-relaxed">{forgotSuccessNotice}</p>
                  <button
                    type="button"
                    onClick={() => {
                      setForgotSuccessNotice(null);
                      setMode('signin');
                    }}
                    className="w-full py-2 px-3 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs rounded-lg transition"
                  >
                    Return to Sign In
                  </button>
                </div>
              ) : (
                <form onSubmit={handleForgotSubmit(onForgotSubmit)} className="space-y-4" noValidate>
                  <div className="space-y-1">
                    <label htmlFor="forgotIdentifier" className="block text-xs font-semibold text-stone-700">
                      Your Registered Email Address or Mobile Number
                    </label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-stone-400">
                        <Mail className="w-4 h-4" />
                      </div>
                      <input
                        id="forgotIdentifier"
                        type="text"
                        placeholder="e.g. shaikh@apparellex.com"
                        {...registerForgot('identifier')}
                        className={`w-full pl-10 pr-3.5 py-2.5 bg-white border text-xs text-stone-900 rounded-xl transition shadow-2xs focus-visible:outline-2 ${
                          forgotErrors.identifier
                            ? 'border-red-400 focus-visible:outline-red-500 bg-red-50/20'
                            : 'border-stone-200 hover:border-stone-300 focus-visible:outline-[#FF5757]'
                        }`}
                      />
                    </div>
                    {forgotErrors.identifier && (
                      <p className="text-red-500 text-[11px] flex items-center gap-1 mt-1">
                        <AlertCircle className="w-3 h-3 shrink-0" />
                        <span>{forgotErrors.identifier.message}</span>
                      </p>
                    )}
                  </div>

                  <div className="flex items-center gap-3">
                    <button
                      type="button"
                      onClick={() => setMode('signin')}
                      className="w-1/3 py-2.5 px-3 bg-stone-100 hover:bg-stone-200 text-stone-700 text-xs font-semibold rounded-xl transition"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      disabled={isSendingForgot}
                      className="w-2/3 py-2.5 px-4 bg-[#111111] hover:bg-black text-white text-xs font-bold uppercase tracking-wider rounded-xl shadow-md transition flex items-center justify-center gap-2 cursor-pointer disabled:opacity-60"
                    >
                      {isSendingForgot ? (
                        <Loader2 className="w-4 h-4 animate-spin text-[#FF5757]" />
                      ) : (
                        <span>Send Reset Link</span>
                      )}
                    </button>
                  </div>
                </form>
              )}
            </div>
          )}

          {/* New Customer / Existing Customer Callout */}
          <div className="pt-4 border-t border-stone-200 text-center">
            {mode === 'register' ? (
              <p className="text-xs text-stone-600">
                Already have an account?{' '}
                <button
                  type="button"
                  onClick={() => setMode('signin')}
                  className="font-bold text-stone-900 hover:text-[#FF5757] underline ml-1 cursor-pointer transition-colors"
                >
                  Sign in here
                </button>
              </p>
            ) : mode === 'forgot-password' ? (
              <p className="text-xs text-stone-600">
                Remembered your credentials?{' '}
                <button
                  type="button"
                  onClick={() => setMode('signin')}
                  className="font-bold text-stone-900 hover:text-[#FF5757] underline ml-1 cursor-pointer transition-colors"
                >
                  Return to sign in
                </button>
              </p>
            ) : (
              <p className="text-xs text-stone-600">
                New to {brandName}?{' '}
                <button
                  type="button"
                  onClick={() => setMode('register')}
                  className="font-bold text-[#FF5757] hover:underline ml-1 cursor-pointer transition-colors"
                >
                  Create an account (Get 10% off)
                </button>
              </p>
            )}
          </div>
        </div>

        {/* Footer / Legal Disclaimer */}
        <footer className="pt-8 border-t border-stone-100 flex flex-col sm:flex-row items-center justify-between gap-3 text-[11px] text-stone-400">
          <p>
            By continuing, you agree to our{' '}
            <span className="text-stone-600 underline hover:text-black cursor-pointer">Terms of Service</span> &amp;{' '}
            <span className="text-stone-600 underline hover:text-black cursor-pointer">Privacy Policy</span>.
          </p>
          <div className="flex items-center gap-3">
            <span>© 2026 {brandName} Inc.</span>
            <span>·</span>
            <span>All rights reserved</span>
          </div>
        </footer>
      </main>
    </div>
  );
};
