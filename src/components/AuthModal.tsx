import React, { useState } from 'react';
import { 
  X, 
  Mail, 
  Lock, 
  User, 
  Phone, 
  Eye, 
  EyeOff, 
  Sparkles, 
  ShieldCheck, 
  CheckCircle2, 
  AlertCircle, 
  Zap, 
  ArrowRight,
  Gift
} from 'lucide-react';
import { CustomerUser, DEMO_USERS, saveStoredCustomer } from '../data/userAuth';

export interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  onLoginSuccess: (user: CustomerUser) => void;
  initialMode?: 'signin' | 'signup';
}

export const AuthModal: React.FC<AuthModalProps> = ({
  isOpen,
  onClose,
  onLoginSuccess,
  initialMode = 'signin',
}) => {
  if (!isOpen) return null;

  const [mode, setMode] = useState<'signin' | 'signup' | 'forgot'>(initialMode);
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [successNotice, setSuccessNotice] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Sign In Form State
  const [signInIdentifier, setSignInIdentifier] = useState('kamran@apparellex.com');
  const [signInPassword, setSignInPassword] = useState('kamran123');

  // Sign Up Form State
  const [signUpName, setSignUpName] = useState('');
  const [signUpEmail, setSignUpEmail] = useState('');
  const [signUpPhone, setSignUpPhone] = useState('');
  const [signUpGender, setSignUpGender] = useState<'men' | 'women' | 'unisex'>('men');
  const [signUpPassword, setSignUpPassword] = useState('');

  // Forgot Password State
  const [forgotEmail, setForgotEmail] = useState('');
  const [resetSent, setResetSent] = useState(false);

  const handleSignIn = (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setIsSubmitting(true);

    setTimeout(() => {
      setIsSubmitting(false);
      // Check if identifier matches one of demo users or standard valid login
      const matchedUser = DEMO_USERS.find(
        (u) =>
          u.email.toLowerCase() === signInIdentifier.trim().toLowerCase() ||
          u.phone.replace(/\D/g, '') === signInIdentifier.replace(/\D/g, '')
      );

      if (matchedUser) {
        saveStoredCustomer(matchedUser);
        onLoginSuccess(matchedUser);
        onClose();
        return;
      }

      // Allow any well-formed email/password as a successful login session
      if (signInIdentifier.includes('@') && signInPassword.length >= 4) {
        const customUser: CustomerUser = {
          id: `usr-${Date.now()}`,
          name: signInIdentifier.split('@')[0].replace(/[._]/g, ' ').toUpperCase(),
          email: signInIdentifier.trim(),
          phone: '+1 (555) 234-5678',
          gender: 'unisex',
          isVip: false,
          vipTier: 'Silver Member',
          memberSince: 'October 2026',
          coinsBalance: 200,
          savedAddresses: [
            {
              id: `addr-${Date.now()}`,
              name: signInIdentifier.split('@')[0],
              phone: '+1 (555) 234-5678',
              addressLine: '350 5th Ave, Floor 14',
              city: 'New York, NY',
              postalCode: '10118',
              addressType: 'Home',
              isDefault: true,
            },
          ],
          measurements: {
            topSize: 'M',
            bottomSize: '32',
            shoeSize: '9',
          },
        };
        saveStoredCustomer(customUser);
        onLoginSuccess(customUser);
        onClose();
      } else {
        setError('Please enter a valid email address and password (minimum 4 characters).');
      }
    }, 400);
  };

  const handleSignUp = (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!signUpName.trim()) {
      setError('Please enter your full name.');
      return;
    }
    if (!signUpEmail.includes('@')) {
      setError('Please provide a valid email address.');
      return;
    }
    if (signUpPassword.length < 6) {
      setError('Password must contain at least 6 characters.');
      return;
    }

    setIsSubmitting(true);
    setTimeout(() => {
      setIsSubmitting(false);
      const newUser: CustomerUser = {
        id: `usr-${Date.now()}`,
        name: signUpName.trim(),
        email: signUpEmail.trim(),
        phone: signUpPhone.trim() || '+1 (555) 000-1122',
        gender: signUpGender,
        isVip: true,
        vipTier: 'Gold VIP',
        memberSince: 'Today, Oct 2026',
        coinsBalance: 500, // 500 welcome bonus coins!
        savedAddresses: [
          {
            id: `addr-${Date.now()}`,
            name: `${signUpName.trim()} (Primary)`,
            phone: signUpPhone.trim() || '+1 (555) 000-1122',
            addressLine: '120 Broadway, Suite 400',
            city: 'Downtown Manhattan, NY',
            postalCode: '10271',
            addressType: 'Home',
            isDefault: true,
          },
        ],
        measurements: {
          topSize: signUpGender === 'women' ? 'S' : 'M',
          bottomSize: signUpGender === 'women' ? '28' : '32',
          shoeSize: signUpGender === 'women' ? '8' : '10',
        },
      };

      saveStoredCustomer(newUser);
      onLoginSuccess(newUser);
      onClose();
    }, 450);
  };

  const handleQuickDemoLogin = (user: CustomerUser) => {
    saveStoredCustomer(user);
    onLoginSuccess(user);
    onClose();
  };

  const handleForgotPassword = (e: React.FormEvent) => {
    e.preventDefault();
    if (!forgotEmail.includes('@')) {
      setError('Please enter a valid email to receive your password reset token.');
      return;
    }
    setError(null);
    setResetSent(true);
    setTimeout(() => {
      setResetSent(false);
      setMode('signin');
      setSuccessNotice(`Password reset instructions sent to ${forgotEmail}.`);
    }, 2500);
  };

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="auth-modal-title"
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-sm animate-fadeIn"
      onClick={onClose}
    >
      <div
        className="bg-white max-w-md w-full rounded-sm overflow-hidden shadow-2xl relative border border-black/10 flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header Bar */}
        <div className="bg-[#111111] text-white p-5 flex items-center justify-between border-b border-white/10">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-full bg-[#FF5757] text-white flex items-center justify-center font-bold">
              <Zap className="w-4 h-4 fill-white" />
            </div>
            <div>
              <h2 id="auth-modal-title" className="text-sm font-black font-fashion tracking-widest uppercase text-white">
                APPARELLEX ACCOUNT
              </h2>
              <p className="text-[10px] text-white/60 tracking-wider uppercase">
                10-Minute Wardrobe & Fashion Club
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="text-white/60 hover:text-white transition p-1 cursor-pointer"
            aria-label="Close modal"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tab Switcher (Sign In vs Sign Up) */}
        {mode !== 'forgot' && (
          <div className="flex border-b border-black/10 bg-[#FAF8F2]">
            <button
              onClick={() => {
                setMode('signin');
                setError(null);
              }}
              className={`flex-1 py-3 text-xs font-bold uppercase tracking-wider transition-colors cursor-pointer text-center ${
                mode === 'signin'
                  ? 'bg-white text-black border-b-2 border-[#FF5757]'
                  : 'text-black/60 hover:text-black hover:bg-black/5'
              }`}
            >
              Sign In
            </button>
            <button
              onClick={() => {
                setMode('signup');
                setError(null);
              }}
              className={`flex-1 py-3 text-xs font-bold uppercase tracking-wider transition-colors cursor-pointer text-center flex items-center justify-center gap-1.5 ${
                mode === 'signup'
                  ? 'bg-white text-black border-b-2 border-[#FF5757]'
                  : 'text-black/60 hover:text-black hover:bg-black/5'
              }`}
            >
              <span>Create Account</span>
              <span className="text-[9px] bg-[#FF5757] text-white px-1.5 py-0.2 rounded font-bold">
                +500 Coins
              </span>
            </button>
          </div>
        )}

        {/* Body Content */}
        <div className="p-6 overflow-y-auto max-h-[80vh] space-y-4">
          {error && (
            <div className="p-3 bg-red-50 border border-red-200 rounded-sm text-red-700 text-xs flex items-start gap-2 animate-fadeIn">
              <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
              <span>{error}</span>
            </div>
          )}

          {successNotice && (
            <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-sm text-emerald-800 text-xs flex items-start gap-2 animate-fadeIn">
              <CheckCircle2 className="w-4 h-4 shrink-0 mt-0.5 text-emerald-600" />
              <span>{successNotice}</span>
            </div>
          )}

          {/* ========================================================= */}
          {/* 1. SIGN IN MODE */}
          {/* ========================================================= */}
          {mode === 'signin' && (
            <form onSubmit={handleSignIn} className="space-y-4">
              <div>
                <label className="block text-[11px] uppercase tracking-wider font-bold text-black/70 mb-1">
                  Email or Registered Phone
                </label>
                <div className="relative">
                  <Mail className="w-4 h-4 text-black/40 absolute left-3 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    value={signInIdentifier}
                    onChange={(e) => setSignInIdentifier(e.target.value)}
                    required
                    placeholder="kamran@apparellex.com or +1 555-019-2834"
                    className="w-full bg-[#FAF8F2] border border-black/15 rounded-sm pl-9 pr-3 py-2 text-xs text-black focus:outline-none focus:border-[#FF5757] transition"
                  />
                </div>
              </div>

              <div>
                <div className="flex items-center justify-between mb-1">
                  <label className="block text-[11px] uppercase tracking-wider font-bold text-black/70">
                    Password
                  </label>
                  <button
                    type="button"
                    onClick={() => setMode('forgot')}
                    className="text-[11px] text-[#FF5757] font-semibold hover:underline cursor-pointer"
                  >
                    Forgot Password?
                  </button>
                </div>
                <div className="relative">
                  <Lock className="w-4 h-4 text-black/40 absolute left-3 top-1/2 -translate-y-1/2" />
                  <input
                    type={showPassword ? 'text' : 'password'}
                    value={signInPassword}
                    onChange={(e) => setSignInPassword(e.target.value)}
                    required
                    placeholder="••••••••"
                    className="w-full bg-[#FAF8F2] border border-black/15 rounded-sm pl-9 pr-9 py-2 text-xs text-black focus:outline-none focus:border-[#FF5757] transition"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-black/40 hover:text-black cursor-pointer"
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full bg-[#111111] hover:bg-[#FF5757] text-white py-2.5 rounded-sm text-xs font-bold uppercase tracking-wider transition-colors flex items-center justify-center gap-2 cursor-pointer shadow-sm disabled:opacity-50"
              >
                {isSubmitting ? (
                  <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                ) : (
                  <>
                    <span>Sign In to Apparellex</span>
                    <ArrowRight className="w-4 h-4" />
                  </>
                )}
              </button>

              {/* 1-Click Fast Demo Logins (Myntra/Ajio Instant Persona Testing) */}
              <div className="pt-3 border-t border-black/10">
                <span className="text-[10px] uppercase font-bold tracking-wider text-black/40 block mb-2 text-center">
                  Or One-Click Demo Member Access:
                </span>
                <div className="space-y-1.5">
                  {DEMO_USERS.map((demo) => (
                    <button
                      key={demo.id}
                      type="button"
                      onClick={() => handleQuickDemoLogin(demo)}
                      className="w-full p-2.5 bg-[#FAF8F2] hover:bg-black/5 border border-black/10 rounded-sm text-left flex items-center justify-between transition cursor-pointer group"
                    >
                      <div className="flex items-center gap-2.5">
                        <div className="w-7 h-7 rounded-full bg-[#111111] text-white flex items-center justify-center text-xs font-bold font-fashion group-hover:bg-[#FF5757] transition-colors">
                          {demo.name.split(' ').map((n) => n[0]).join('')}
                        </div>
                        <div>
                          <p className="text-xs font-bold text-black">{demo.name}</p>
                          <p className="text-[10px] text-black/50">{demo.vipTier} · {demo.coinsBalance} Coins</p>
                        </div>
                      </div>
                      <span className="text-[10px] font-bold text-[#FF5757] uppercase tracking-wider">
                        1-Click Login →
                      </span>
                    </button>
                  ))}
                </div>
              </div>
            </form>
          )}

          {/* ========================================================= */}
          {/* 2. CREATE ACCOUNT MODE (SIGN UP) */}
          {/* ========================================================= */}
          {mode === 'signup' && (
            <form onSubmit={handleSignUp} className="space-y-3.5">
              {/* Member Perk Highlight */}
              <div className="p-3 bg-gradient-to-r from-amber-50 to-orange-50 border border-amber-200 rounded-sm flex items-center gap-2.5 text-xs text-amber-900">
                <Gift className="w-5 h-5 text-amber-600 shrink-0" />
                <div>
                  <strong className="block font-bold">New Member Welcome Perk</strong>
                  <span className="text-[11px] text-amber-800">
                    Get 500 Apparellex Coins + Free 10-Minute Delivery on your first drop!
                  </span>
                </div>
              </div>

              <div>
                <label className="block text-[11px] uppercase tracking-wider font-bold text-black/70 mb-1">
                  Full Name
                </label>
                <div className="relative">
                  <User className="w-4 h-4 text-black/40 absolute left-3 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    value={signUpName}
                    onChange={(e) => setSignUpName(e.target.value)}
                    required
                    placeholder="e.g. Liam Sterling"
                    className="w-full bg-[#FAF8F2] border border-black/15 rounded-sm pl-9 pr-3 py-2 text-xs text-black focus:outline-none focus:border-[#FF5757] transition"
                  />
                </div>
              </div>

              <div>
                <label className="block text-[11px] uppercase tracking-wider font-bold text-black/70 mb-1">
                  Email Address
                </label>
                <div className="relative">
                  <Mail className="w-4 h-4 text-black/40 absolute left-3 top-1/2 -translate-y-1/2" />
                  <input
                    type="email"
                    value={signUpEmail}
                    onChange={(e) => setSignUpEmail(e.target.value)}
                    required
                    placeholder="liam@example.com"
                    className="w-full bg-[#FAF8F2] border border-black/15 rounded-sm pl-9 pr-3 py-2 text-xs text-black focus:outline-none focus:border-[#FF5757] transition"
                  />
                </div>
              </div>

              <div>
                <label className="block text-[11px] uppercase tracking-wider font-bold text-black/70 mb-1">
                  Mobile Number (For Courier SMS & Live Tracking)
                </label>
                <div className="relative">
                  <Phone className="w-4 h-4 text-black/40 absolute left-3 top-1/2 -translate-y-1/2" />
                  <input
                    type="tel"
                    value={signUpPhone}
                    onChange={(e) => setSignUpPhone(e.target.value)}
                    placeholder="+1 (555) 987-6543"
                    className="w-full bg-[#FAF8F2] border border-black/15 rounded-sm pl-9 pr-3 py-2 text-xs text-black focus:outline-none focus:border-[#FF5757] transition"
                  />
                </div>
              </div>

              <div>
                <label className="block text-[11px] uppercase tracking-wider font-bold text-black/70 mb-1">
                  Primary Shopping Preference
                </label>
                <div className="grid grid-cols-3 gap-2">
                  {[
                    { id: 'men', label: "Men's Wear" },
                    { id: 'women', label: "Women's Wear" },
                    { id: 'unisex', label: 'All Curations' },
                  ].map((g) => (
                    <button
                      key={g.id}
                      type="button"
                      onClick={() => setSignUpGender(g.id as any)}
                      className={`py-1.5 px-2 rounded-sm text-xs font-bold border transition cursor-pointer text-center ${
                        signUpGender === g.id
                          ? 'bg-[#111111] text-white border-black'
                          : 'bg-[#FAF8F2] text-black/70 border-black/15 hover:border-black'
                      }`}
                    >
                      {g.label}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-[11px] uppercase tracking-wider font-bold text-black/70 mb-1">
                  Create Password (Min 6 Characters)
                </label>
                <div className="relative">
                  <Lock className="w-4 h-4 text-black/40 absolute left-3 top-1/2 -translate-y-1/2" />
                  <input
                    type={showPassword ? 'text' : 'password'}
                    value={signUpPassword}
                    onChange={(e) => setSignUpPassword(e.target.value)}
                    required
                    placeholder="••••••••"
                    className="w-full bg-[#FAF8F2] border border-black/15 rounded-sm pl-9 pr-9 py-2 text-xs text-black focus:outline-none focus:border-[#FF5757] transition"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-black/40 hover:text-black cursor-pointer"
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              <div className="text-[11px] text-black/50 leading-tight">
                By creating an account, you agree to Apparellex's 10-Minute Delivery Terms, Privacy Policy, and doorstep try-on policy.
              </div>

              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full bg-[#FF5757] hover:bg-[#e04848] text-white py-2.5 rounded-sm text-xs font-bold uppercase tracking-wider transition-colors flex items-center justify-center gap-2 cursor-pointer shadow-sm disabled:opacity-50"
              >
                {isSubmitting ? (
                  <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                ) : (
                  <>
                    <span>Complete Registration & Claim 500 Coins</span>
                    <Sparkles className="w-4 h-4" />
                  </>
                )}
              </button>
            </form>
          )}

          {/* ========================================================= */}
          {/* 3. FORGOT PASSWORD MODE */}
          {/* ========================================================= */}
          {mode === 'forgot' && (
            <form onSubmit={handleForgotPassword} className="space-y-4">
              <div>
                <h3 className="text-sm font-bold text-black uppercase tracking-wider">
                  Reset Account Password
                </h3>
                <p className="text-xs text-black/60 mt-1">
                  Enter your registered email address and we will dispatch a secure one-time passcode for your account.
                </p>
              </div>

              <div>
                <label className="block text-[11px] uppercase tracking-wider font-bold text-black/70 mb-1">
                  Email Address
                </label>
                <div className="relative">
                  <Mail className="w-4 h-4 text-black/40 absolute left-3 top-1/2 -translate-y-1/2" />
                  <input
                    type="email"
                    value={forgotEmail}
                    onChange={(e) => setForgotEmail(e.target.value)}
                    required
                    placeholder="kamran@apparellex.com"
                    className="w-full bg-[#FAF8F2] border border-black/15 rounded-sm pl-9 pr-3 py-2 text-xs text-black focus:outline-none focus:border-[#FF5757] transition"
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={resetSent}
                className="w-full bg-[#111111] hover:bg-[#FF5757] text-white py-2.5 rounded-sm text-xs font-bold uppercase tracking-wider transition flex items-center justify-center gap-2 cursor-pointer"
              >
                {resetSent ? 'Passcode Dispatched...' : 'Send Reset Passcode'}
              </button>

              <div className="text-center pt-2">
                <button
                  type="button"
                  onClick={() => setMode('signin')}
                  className="text-xs font-bold text-black/60 hover:text-black hover:underline cursor-pointer"
                >
                  ← Return to Sign In
                </button>
              </div>
            </form>
          )}
        </div>

        {/* Footer Guarantee */}
        <div className="p-3 bg-[#FAF8F2] border-t border-black/10 flex items-center justify-between text-[11px] text-black/60 px-6">
          <span className="flex items-center gap-1">
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
            256-Bit SSL Encrypted
          </span>
          <span className="flex items-center gap-1 font-semibold text-black">
            ⚡ 10-Minute Hyperlocal Network
          </span>
        </div>
      </div>
    </div>
  );
};
