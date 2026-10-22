import React, { useState } from 'react';
import { CartItem } from '../data/products';
import { X, Clock, Zap, User, Phone, Home, CreditCard, Banknote, AlertCircle } from 'lucide-react';
import { OrderTracker, OrderDetails } from './OrderTracker';
import { ConfettiCanvas } from './ConfettiCanvas';

interface CheckoutModalProps {
  isOpen: boolean;
  onClose: () => void;
  items: CartItem[];
  onOrderComplete: (order: OrderDetails) => void;
  existingOrder?: OrderDetails | null;
  onOpenFeedback?: (order: OrderDetails) => void;
}

export const CheckoutModal: React.FC<CheckoutModalProps> = ({
  isOpen,
  onClose,
  items,
  onOrderComplete,
  existingOrder,
  onOpenFeedback,
}) => {
  if (!isOpen) return null;

  const [step, setStep] = useState<'details' | 'tracking'>(existingOrder ? 'tracking' : 'details');
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [address, setAddress] = useState('');
  const [postalCode, setPostalCode] = useState('10001');
  const [paymentMethod, setPaymentMethod] = useState<'cod' | 'card' | 'upi'>('cod');
  const [confirmedOrder, setConfirmedOrder] = useState<OrderDetails | null>(existingOrder || null);
  const [showConfetti, setShowConfetti] = useState(false);
  const [formError, setFormError] = useState<string | null>(null);

  const subtotal = items.reduce((sum, item) => sum + item.product.price * item.quantity, 0);
  const deliveryFee = subtotal >= 100 || items.length === 0 ? 0 : 7;
  const total = subtotal + deliveryFee;

  const handleSubmitOrder = (e: React.FormEvent) => {
    e.preventDefault();
    setFormError(null);
    if (!name.trim() || !phone.trim() || !address.trim()) {
      setFormError('Please fill in your delivery name, phone number, and address.');
      return;
    }

    const orderData: OrderDetails = {
      orderId: `APX-${Math.floor(100000 + Math.random() * 900000)}`,
      name: name.trim(),
      phone: phone.trim(),
      address: address.trim(),
      postalCode: postalCode.trim() || '10001',
      paymentMethod,
      totalAmount: total,
      items: [...items],
      createdAt: new Date(),
    };

    setConfirmedOrder(orderData);
    setStep('tracking');
    setShowConfetti(true);
    onOrderComplete(orderData);
  };

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="checkout-modal-title"
      className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-black/75 backdrop-blur-sm animate-fadeIn"
      onClick={onClose}
    >
      <div
        className={`bg-white w-full rounded-sm overflow-hidden shadow-2xl relative border border-black/10 max-h-[94vh] flex flex-col transition-all duration-300 ${
          step === 'tracking' ? 'max-w-4xl' : 'max-w-2xl'
        }`}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Subtle Confetti Animation Effect */}
        <ConfettiCanvas
          active={showConfetti}
          onComplete={() => setShowConfetti(false)}
          durationMs={3800}
        />

        {/* Header */}
        <div className="p-5 sm:p-6 border-b border-black/10 flex items-center justify-between bg-[#111111] text-white">
          <div className="flex items-center gap-2">
            <Zap className="w-5 h-5 text-[#FF5757] fill-[#FF5757]" />
            <h2 id="checkout-modal-title" className="text-base font-black font-fashion uppercase tracking-wider">
              {step === 'details'
                ? 'Apparellex 10-Minute Express Checkout'
                : 'Live Order Radar & Dispatch Tracker'}
            </h2>
            {showConfetti && (
              <span className="hidden sm:inline-flex items-center gap-1 text-[11px] font-bold text-[#E5B869] bg-white/10 px-2.5 py-0.5 rounded-full border border-[#E5B869]/30 animate-pulse">
                ✨ Order Dispatched!
              </span>
            )}
          </div>
          <button
            onClick={onClose}
            className="text-white/60 hover:text-white transition p-1 cursor-pointer"
            aria-label="Close modal"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-5 sm:p-8 overflow-y-auto flex-1">
          {step === 'details' ? (
            <form onSubmit={handleSubmitOrder} className="space-y-6">
              {/* Form Validation Error Banner */}
              {formError && (
                <div className="bg-red-50 border border-red-200 text-red-700 p-3 rounded-sm text-xs flex items-center gap-2">
                  <AlertCircle className="w-4 h-4 text-red-600 shrink-0" />
                  <span>{formError}</span>
                </div>
              )}

              {/* Order Mini Summary */}
              <div className="bg-[#FAF8F2] p-4 rounded-sm border border-black/10 flex items-center justify-between text-xs">
                <div>
                  <span className="text-black/50 uppercase font-semibold tracking-wider block">
                    Order Items ({items.reduce((a, b) => a + b.quantity, 0)})
                  </span>
                  <span className="font-bold text-[#1a1a1a] text-sm tabular-nums">
                    Total: ${total.toFixed(0)}
                  </span>
                </div>
                <div className="text-right">
                  <span className="inline-flex items-center gap-1 font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded text-[11px]">
                    <Clock className="w-3 h-3" />
                    Target ETA: ~10 Mins
                  </span>
                </div>
              </div>

              {/* Recipient Details */}
              <div className="space-y-4">
                <h3 className="text-xs font-bold uppercase tracking-widest text-[#1a1a1a] flex items-center gap-1.5 border-b border-black/10 pb-2">
                  <User className="w-3.5 h-3.5 text-[#FF5757]" />
                  <span>1. Delivery Contact</span>
                </h3>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-[11px] font-bold uppercase tracking-wider text-black/70 mb-1">
                      Full Name *
                    </label>
                    <input
                      type="text"
                      required
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      placeholder="e.g. Alex Vance"
                      className="w-full text-xs p-3 border border-black/20 rounded-sm bg-white focus:border-[#FF5757] outline-none"
                    />
                  </div>
                  <div>
                    <label className="block text-[11px] font-bold uppercase tracking-wider text-black/70 mb-1">
                      Phone Number * (For courier SMS)
                    </label>
                    <input
                      type="tel"
                      required
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      placeholder="+1 (555) 019-2834"
                      className="w-full text-xs p-3 border border-black/20 rounded-sm bg-white focus:border-[#FF5757] outline-none"
                    />
                  </div>
                </div>
              </div>

              {/* Delivery Address */}
              <div className="space-y-4">
                <h3 className="text-xs font-bold uppercase tracking-widest text-[#1a1a1a] flex items-center gap-1.5 border-b border-black/10 pb-2">
                  <Home className="w-3.5 h-3.5 text-[#FF5757]" />
                  <span>2. Delivery Address</span>
                </h3>

                <div>
                  <label className="block text-[11px] font-bold uppercase tracking-wider text-black/70 mb-1">
                    Street Address & Apartment / Suite *
                  </label>
                  <input
                    type="text"
                    required
                    value={address}
                    onChange={(e) => setAddress(e.target.value)}
                    placeholder="e.g. 742 Evergreen Terrace, Apt 4B"
                    className="w-full text-xs p-3 border border-black/20 rounded-sm bg-white focus:border-[#FF5757] outline-none"
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-[11px] font-bold uppercase tracking-wider text-black/70 mb-1">
                      City / Area
                    </label>
                    <input
                      type="text"
                      defaultValue="Metro Center"
                      className="w-full text-xs p-3 border border-black/20 rounded-sm bg-[#F5F5F5] text-black/70 outline-none"
                      readOnly
                    />
                  </div>
                  <div>
                    <label className="block text-[11px] font-bold uppercase tracking-wider text-black/70 mb-1">
                      Postal / ZIP Code
                    </label>
                    <input
                      type="text"
                      value={postalCode}
                      onChange={(e) => setPostalCode(e.target.value)}
                      className="w-full text-xs p-3 border border-black/20 rounded-sm bg-white focus:border-[#FF5757] outline-none"
                    />
                  </div>
                </div>
              </div>

              {/* Payment Methods */}
              <div className="space-y-3">
                <h3 className="text-xs font-bold uppercase tracking-widest text-[#1a1a1a] flex items-center gap-1.5 border-b border-black/10 pb-2">
                  <CreditCard className="w-3.5 h-3.5 text-[#FF5757]" />
                  <span>3. Payment Method</span>
                </h3>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <label
                    onClick={() => setPaymentMethod('cod')}
                    className={`flex items-center gap-3 p-3 border rounded-sm cursor-pointer transition ${
                      paymentMethod === 'cod'
                        ? 'border-[#FF5757] bg-[#FF5757]/5'
                        : 'border-black/15 hover:border-black/40'
                    }`}
                  >
                    <Banknote className="w-4 h-4 text-[#FF5757]" />
                    <div className="text-left">
                      <p className="text-xs font-bold text-black">Cash on Delivery (COD)</p>
                      <p className="text-[10px] text-black/60">Pay after 5-min try-on at doorstep</p>
                    </div>
                  </label>

                  <label
                    onClick={() => setPaymentMethod('card')}
                    className={`flex items-center gap-3 p-3 border rounded-sm cursor-pointer transition ${
                      paymentMethod === 'card'
                        ? 'border-[#FF5757] bg-[#FF5757]/5'
                        : 'border-black/15 hover:border-black/40'
                    }`}
                  >
                    <CreditCard className="w-4 h-4 text-black" />
                    <div className="text-left">
                      <p className="text-xs font-bold text-black">Credit / Debit Card</p>
                      <p className="text-[10px] text-black/60">Instant contactless charge</p>
                    </div>
                  </label>
                </div>
              </div>

              {/* Submit CTA */}
              <div className="pt-4 border-t border-black/10 flex flex-col gap-2">
                <button
                  type="submit"
                  className="w-full bg-[#111111] hover:bg-[#FF5757] text-white py-4 px-6 rounded-sm text-xs font-black uppercase tracking-wider flex items-center justify-center gap-2 transition-all cursor-pointer shadow-lg active:scale-95"
                >
                  <Zap className="w-4 h-4 fill-white" />
                  <span>Confirm Order — Start 10-Minute Dispatch</span>
                </button>
                <p className="text-[11px] text-center text-black/50">
                  By confirming, a dedicated electric courier is reserved immediately at your nearest micro-hub.
                </p>
              </div>
            </form>
          ) : (
            confirmedOrder && (
              <OrderTracker
                order={confirmedOrder}
                onClose={onClose}
                onReturnToShop={() => {
                  if (confirmedOrder) onOrderComplete(confirmedOrder);
                  onClose();
                }}
                onOpenFeedback={onOpenFeedback}
              />
            )
          )}
        </div>
      </div>
    </div>
  );
};
