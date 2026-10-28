import React, { useState, useEffect } from 'react';
import {
  Sparkles,
  Award,
  Zap,
  CheckCircle2,
  Gift,
  TrendingUp,
  Clock,
  ShieldCheck,
  ChevronRight,
  Info,
} from 'lucide-react';

export interface LoyaltyAccount {
  balance: number; // e.g. 350 points
  tier: 'Silver' | 'Gold VIP' | 'Black Diamond VIP';
  multiplier: number; // 1x, 1.5x, 2x
  lifetimeEarned: number;
  history: Array<{
    id: string;
    description: string;
    points: number; // positive for earned, negative for redeemed
    date: string;
  }>;
}

export const POINTS_TO_DOLLAR_RATIO = 2; // 2 points = ₹1 discount (e.g. 200 points = ₹100 discount)
export const POINTS_EARNED_PER_DOLLAR = 0.05; // 5 points per ₹100 spent (e.g. ₹2,999 order earns ~150 points * VIP multiplier)
export const POINTS_TO_RUPEE_RATIO = POINTS_TO_DOLLAR_RATIO;
export const POINTS_EARNED_PER_RUPEE = POINTS_EARNED_PER_DOLLAR;

export const DEFAULT_LOYALTY_ACCOUNT: LoyaltyAccount = {
  balance: 380,
  tier: 'Black Diamond VIP',
  multiplier: 2.0,
  lifetimeEarned: 1240,
  history: [
    {
      id: 'tx-1',
      description: 'Welcome to Apparellex VIP Club Bonus',
      points: +200,
      date: 'Sep 15, 2026',
    },
    {
      id: 'tx-2',
      description: 'Order #APX-928104 (2x VIP Multiplier)',
      points: +490,
      date: 'Sep 28, 2026',
    },
    {
      id: 'tx-3',
      description: 'Redeemed on Order #APX-814920',
      points: -310,
      date: 'Oct 02, 2026',
    },
  ],
};

const STORAGE_KEY = 'apparellex_loyalty_data_v2';

export const getSavedLoyaltyAccount = (): LoyaltyAccount => {
  if (typeof window === 'undefined') return DEFAULT_LOYALTY_ACCOUNT;
  try {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (!saved) return DEFAULT_LOYALTY_ACCOUNT;
    const parsed = JSON.parse(saved);
    return parsed && typeof parsed.balance === 'number' ? parsed : DEFAULT_LOYALTY_ACCOUNT;
  } catch {
    return DEFAULT_LOYALTY_ACCOUNT;
  }
};

export const saveLoyaltyAccount = (account: LoyaltyAccount): void => {
  if (typeof window === 'undefined') return;
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(account));
  } catch {
    // Ignore storage quota issues gracefully
  }
};

interface LoyaltyTrackerProps {
  cartTotal: number;
  onRedeemPoints?: (points: number, discountAmount: number) => void;
  appliedPoints?: number;
  mode?: 'checkout' | 'full' | 'compact';
}

export const LoyaltyTracker: React.FC<LoyaltyTrackerProps> = ({
  cartTotal,
  onRedeemPoints,
  appliedPoints = 0,
  mode = 'checkout',
}) => {
  const [account, setAccount] = useState<LoyaltyAccount>(getSavedLoyaltyAccount);
  const [redeemInput, setRedeemInput] = useState<number>(appliedPoints);
  const [isApplied, setIsApplied] = useState<boolean>(appliedPoints > 0);

  // Sync with global storage
  useEffect(() => {
    const current = getSavedLoyaltyAccount();
    setAccount(current);
  }, []);

  // Sync internal redeem input if appliedPoints prop changes
  useEffect(() => {
    setRedeemInput(appliedPoints);
    setIsApplied(appliedPoints > 0);
  }, [appliedPoints]);

  // Points to be earned on THIS cart purchase (cartTotal * multiplier * baseRate)
  const estimatedPointsEarned = Math.round(
    Math.max(0, cartTotal) * POINTS_EARNED_PER_DOLLAR * (account.multiplier || 1)
  );

  const estimatedValueEarned = (estimatedPointsEarned / POINTS_TO_DOLLAR_RATIO).toFixed(2);
  const maxRedeemablePoints = Math.min(
    account.balance,
    Math.floor(cartTotal * POINTS_TO_DOLLAR_RATIO) // Cannot redeem more than cart value
  );
  const maxDiscountValue = (maxRedeemablePoints / POINTS_TO_DOLLAR_RATIO).toFixed(2);

  const handleApplyRedemption = (pts: number) => {
    const validPts = Math.min(maxRedeemablePoints, Math.max(0, Math.floor(pts)));
    const discount = Number((validPts / POINTS_TO_DOLLAR_RATIO).toFixed(2));
    setRedeemInput(validPts);
    setIsApplied(validPts > 0);
    if (onRedeemPoints) {
      onRedeemPoints(validPts, discount);
    }
  };

  const handleRemoveRedemption = () => {
    setRedeemInput(0);
    setIsApplied(false);
    if (onRedeemPoints) {
      onRedeemPoints(0, 0);
    }
  };

  // Compact mode (for cart drawer or small widgets)
  if (mode === 'compact') {
    return (
      <div className="bg-gradient-to-r from-[#111111] to-[#1c1c1f] text-white p-3 rounded-sm border border-[#FF5757]/30 flex items-center justify-between text-xs">
        <div className="flex items-center gap-2">
          <div className="w-7 h-7 rounded-full bg-[#FF5757]/20 border border-[#FF5757]/40 flex items-center justify-center text-[#FF5757] shrink-0">
            <Sparkles className="w-3.5 h-3.5" />
          </div>
          <div>
            <div className="flex items-center gap-1.5 font-bold text-white text-[11px] uppercase tracking-wider">
              <span>Earn +{estimatedPointsEarned} Points</span>
              <span className="text-[9px] bg-[#FF5757] text-white px-1.5 py-0.2 rounded font-black">
                {account.multiplier}x VIP
              </span>
            </div>
            <p className="text-[10px] text-white/60">
              Worth ₹{estimatedValueEarned} off future 10-minute drops
            </p>
          </div>
        </div>
        <div className="text-right">
          <span className="text-[10px] text-white/50 block">Your Balance</span>
          <span className="text-xs font-black text-[#E5B869] tabular-nums">
            {account.balance} pts
          </span>
        </div>
      </div>
    );
  }

  // Checkout Mode (embedded in checkout modal)
  return (
    <div className="bg-[#FAF8F2] border border-black/10 rounded-sm p-4 sm:p-5 space-y-4">
      {/* Top Banner: Balance & Upcoming Points Earned */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-black/10">
        <div className="flex items-center gap-2.5">
          <div className="w-9 h-9 rounded-full bg-[#111111] text-[#E5B869] flex items-center justify-center shrink-0 shadow-sm border border-[#E5B869]/30">
            <Award className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h4 className="text-xs font-black uppercase tracking-wider text-[#1a1a1a]">
                Apparellex VIP Loyalty Rewards
              </h4>
              <span className="text-[9px] font-bold uppercase tracking-wider bg-black text-[#E5B869] px-2 py-0.5 rounded-sm">
                {account.tier}
              </span>
            </div>
            <p className="text-[11px] text-black/60">
              Active balance:{' '}
              <strong className="text-black tabular-nums font-black">
                {account.balance} points
              </strong>{' '}
              (₹{(account.balance / POINTS_TO_DOLLAR_RATIO).toFixed(0)} value)
            </p>
          </div>
        </div>

        {/* Real-time Calculation Badge for This Cart */}
        <div className="inline-flex items-center gap-2 bg-emerald-50 border border-emerald-200/80 px-3 py-1.5 rounded-sm text-xs text-emerald-800">
          <Zap className="w-3.5 h-3.5 text-emerald-600 fill-emerald-600 shrink-0" />
          <div>
            <span className="font-bold text-[11px] uppercase tracking-wider block">
              +{estimatedPointsEarned} Points on Checkout
            </span>
            <span className="text-[10px] text-emerald-600">
              (₹{estimatedValueEarned} cash value for future orders)
            </span>
          </div>
        </div>
      </div>

      {/* Redemption Controller */}
      {account.balance > 0 && cartTotal > 0 ? (
        <div className="space-y-3 pt-1">
          <div className="flex items-center justify-between">
            <label className="text-[11px] font-bold uppercase tracking-wider text-black/80 flex items-center gap-1.5">
              <Gift className="w-3.5 h-3.5 text-[#FF5757]" />
              <span>Redeem Points for Order Discount</span>
            </label>
            <span className="text-[10px] text-black/50">
              Max applicable: {maxRedeemablePoints} pts (-₹{maxDiscountValue})
            </span>
          </div>

          {/* Quick-Select Redemption Chips */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
            {[100, 200, 300, maxRedeemablePoints]
              .filter((pts, idx, arr) => pts <= account.balance && arr.indexOf(pts) === idx)
              .map((pts) => {
                const discount = (pts / POINTS_TO_DOLLAR_RATIO).toFixed(0);
                const isSelected = isApplied && redeemInput === pts;
                return (
                  <button
                    key={pts}
                    type="button"
                    onClick={() => handleApplyRedemption(pts)}
                    className={`px-3 py-2 rounded-sm border text-xs font-bold transition flex flex-col items-center justify-center cursor-pointer ${
                      isSelected
                        ? 'bg-[#111111] text-white border-black shadow'
                        : 'bg-white hover:border-[#FF5757] text-[#1a1a1a] border-black/15'
                    }`}
                  >
                    <span className="tabular-nums font-black text-xs">{pts} pts</span>
                    <span className="text-[10px] text-[#FF5757] font-semibold">
                      -₹{discount} Off
                    </span>
                  </button>
                );
              })}
          </div>

          {/* Applied Status or Clear Button */}
          {isApplied && redeemInput > 0 ? (
            <div className="bg-white p-3 rounded-sm border border-emerald-500/40 flex items-center justify-between text-xs animate-fadeIn">
              <div className="flex items-center gap-2 text-emerald-700">
                <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                <span className="font-bold text-xs">
                  Redeemed {redeemInput} points (-₹{(redeemInput / POINTS_TO_DOLLAR_RATIO).toFixed(0)})
                </span>
              </div>
              <button
                type="button"
                onClick={handleRemoveRedemption}
                className="text-[11px] text-red-600 hover:text-red-800 font-bold underline cursor-pointer"
              >
                Remove
              </button>
            </div>
          ) : (
            <p className="text-[10px] text-black/50 italic flex items-center gap-1">
              <Info className="w-3 h-3 text-black/40" />
              Every 2 points saves ₹1.00 directly off your instant courier order total.
            </p>
          )}
        </div>
      ) : (
        <div className="text-xs text-black/60 bg-white/60 p-3 rounded-sm border border-black/5 flex items-center justify-between">
          <span>Complete this order to start earning points toward future order discounts!</span>
          <span className="font-bold text-black uppercase text-[10px] tracking-wider">
            +{estimatedPointsEarned} PTS Pending
          </span>
        </div>
      )}

      {/* VIP Tier Milestones & Perk Bar */}
      <div className="pt-2 border-t border-black/5">
        <div className="flex items-center justify-between text-[10px] text-black/60 mb-1">
          <span className="font-semibold uppercase tracking-wider">
            VIP Tier Progress: {account.tier} ({account.multiplier}x Multiplier)
          </span>
          <span className="tabular-nums font-bold text-black">
            {account.lifetimeEarned} / 2,000 pts to Founder Club
          </span>
        </div>
        <div className="w-full bg-black/10 h-1.5 rounded-full overflow-hidden">
          <div
            className="bg-gradient-to-r from-[#E5B869] to-[#FF5757] h-full rounded-full transition-all duration-500"
            style={{ width: `${Math.min(100, (account.lifetimeEarned / 2000) * 100)}%` }}
          />
        </div>
      </div>
    </div>
  );
};
