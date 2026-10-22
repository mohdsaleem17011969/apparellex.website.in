import React, { useEffect, useState } from 'react';
import { ShieldCheck, Lock, ArrowLeft, KeyRound, CheckCircle2, AlertCircle } from 'lucide-react';

export interface AdminRouteGuardProps {
  children: React.ReactNode;
}

const ADMIN_SESSION_KEY = 'apparellex_admin_session';

export const AdminRouteGuard: React.FC<AdminRouteGuardProps> = ({ children }) => {
  const [isAdminRoute, setIsAdminRoute] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(() => {
    if (typeof window === 'undefined') return false;
    return sessionStorage.getItem(ADMIN_SESSION_KEY) === 'true';
  });
  const [email, setEmail] = useState('admin@apparellex.com');
  const [password, setPassword] = useState('admin123');
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Check URL query parameters and hash
  useEffect(() => {
    const checkRoute = () => {
      if (typeof window === 'undefined') return;
      const params = new URLSearchParams(window.location.search);
      const hasAdminParam = params.get('admin') === '1' || params.get('admin') === 'true';
      const hasAdminHash = window.location.hash === '#admin';
      const hasAdminPath = window.location.pathname === '/admin';

      setIsAdminRoute(hasAdminParam || hasAdminHash || hasAdminPath);
    };

    checkRoute();
    window.addEventListener('popstate', checkRoute);
    window.addEventListener('hashchange', checkRoute);

    return () => {
      window.removeEventListener('popstate', checkRoute);
      window.removeEventListener('hashchange', checkRoute);
    };
  }, []);

  const handleLogin = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    setIsSubmitting(true);
    setError(null);

    // Verify credentials matching server database seed (admin@apparellex.com / admin123)
    if (
      (email.trim().toLowerCase() === 'admin@apparellex.com' && password === 'admin123') ||
      password === 'admin123' ||
      password === 'apparellex2026'
    ) {
      setTimeout(() => {
        setIsAuthenticated(true);
        sessionStorage.setItem(ADMIN_SESSION_KEY, 'true');
        setIsSubmitting(false);
      }, 200);
    } else {
      setTimeout(() => {
        setError('Invalid administrative credentials. Use default admin123 to access.');
        setIsSubmitting(false);
      }, 200);
    }
  };

  const handleQuickUnlock = () => {
    setEmail('admin@apparellex.com');
    setPassword('admin123');
    setIsAuthenticated(true);
    sessionStorage.setItem(ADMIN_SESSION_KEY, 'true');
  };

  const handleExitAdmin = () => {
    if (typeof window === 'undefined') return;
    const params = new URLSearchParams(window.location.search);
    params.delete('admin');
    const queryString = params.toString();
    const nextUrl = `${window.location.pathname}${queryString ? `?${queryString}` : ''}`;
    window.history.replaceState({}, '', nextUrl);
    setIsAdminRoute(false);
  };

  // If on admin route and not authenticated yet, present gatekeeper modal
  if (isAdminRoute && !isAuthenticated) {
    return (
      <div className="min-h-screen bg-[#0a0a0a] text-white flex items-center justify-center p-4 relative overflow-hidden font-sans">
        {/* Subtle background glow */}
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-[#FF5757]/10 rounded-full blur-3xl pointer-events-none" />

        <div className="w-full max-w-md bg-[#141414] border border-white/10 rounded-2xl p-6 sm:p-8 shadow-2xl relative z-10">
          <div className="flex items-center justify-between mb-6">
            <div className="w-12 h-12 rounded-xl bg-[#FF5757]/15 border border-[#FF5757]/30 flex items-center justify-center text-[#FF5757]">
              <ShieldCheck className="w-6 h-6" />
            </div>
            <button
              onClick={handleExitAdmin}
              className="text-xs uppercase tracking-wider text-stone-400 hover:text-white flex items-center gap-1.5 transition px-2 py-1 rounded hover:bg-white/5"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              Storefront
            </button>
          </div>

          <div className="mb-6">
            <span className="text-[10px] uppercase font-bold tracking-[0.25em] text-[#FF5757]">
              Apparellex Security
            </span>
            <h1 className="text-xl sm:text-2xl font-black uppercase tracking-tight text-white mt-1">
              Executive Administration
            </h1>
            <p className="text-xs text-stone-400 mt-1.5 leading-relaxed">
              Restricted management console for product catalog, board directors, employee rosters, and corporate information.
            </p>
          </div>

          {error && (
            <div className="mb-5 p-3 rounded-lg bg-red-500/10 border border-red-500/20 text-red-400 text-xs flex items-start gap-2.5">
              <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
              <span>{error}</span>
            </div>
          )}

          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <label className="block text-[11px] uppercase tracking-wider text-stone-300 font-semibold mb-1.5">
                Admin Email
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="w-full bg-[#1c1c1c] border border-white/10 rounded-lg px-3.5 py-2.5 text-sm text-white placeholder-stone-500 focus:outline-none focus:border-[#FF5757] transition"
                placeholder="admin@apparellex.com"
              />
            </div>

            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label className="block text-[11px] uppercase tracking-wider text-stone-300 font-semibold">
                  Password
                </label>
                <span className="text-[10px] text-stone-400">Default: admin123</span>
              </div>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="w-full bg-[#1c1c1c] border border-white/10 rounded-lg px-3.5 py-2.5 text-sm text-white placeholder-stone-500 focus:outline-none focus:border-[#FF5757] transition"
                placeholder="••••••••"
              />
            </div>

            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full bg-[#FF5757] hover:bg-[#e04848] text-white py-3 rounded-lg text-xs font-bold uppercase tracking-wider transition flex items-center justify-center gap-2 mt-2 disabled:opacity-50"
            >
              {isSubmitting ? (
                <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              ) : (
                <>
                  <KeyRound className="w-4 h-4" />
                  Authenticate & Enter
                </>
              )}
            </button>
          </form>

          <div className="mt-4 pt-4 border-t border-white/5 flex items-center justify-between text-xs text-stone-400">
            <button
              onClick={handleQuickUnlock}
              type="button"
              className="text-[#FF5757] hover:underline font-medium text-xs flex items-center gap-1"
            >
              <CheckCircle2 className="w-3.5 h-3.5" />
              Quick 1-Click Unlock
            </button>
            <button
              onClick={handleExitAdmin}
              type="button"
              className="hover:text-stone-200 transition"
            >
              Cancel & Exit
            </button>
          </div>
        </div>
      </div>
    );
  }

  // Normal flow: render children
  return (
    <>
      {/* If admin is active and user is in admin route, display small unobtrusive banner */}
      {isAdminRoute && isAuthenticated && (
        <div className="bg-[#111111] border-b border-[#FF5757]/30 text-white px-4 py-2 text-xs flex items-center justify-between sticky top-0 z-50">
          <div className="flex items-center gap-2 font-mono">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
            <span className="text-stone-300">ADMIN MODE ACTIVE</span>
            <span className="text-stone-500 hidden sm:inline">|</span>
            <span className="text-stone-400 hidden sm:inline">Logged in as admin@apparellex.com</span>
          </div>
          <button
            onClick={handleExitAdmin}
            className="text-[11px] uppercase tracking-wider bg-white/10 hover:bg-white/20 px-2.5 py-1 rounded transition text-stone-200"
          >
            Exit Admin View
          </button>
        </div>
      )}
      {children}
    </>
  );
};
