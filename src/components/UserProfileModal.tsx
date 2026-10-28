import React, { useState } from 'react';
import { OrderDetails } from './OrderTracker';
import {
  X,
  User,
  Package,
  Calendar,
  Clock,
  CheckCircle2,
  Bike,
  ArrowRight,
  ExternalLink,
  RotateCcw,
  MapPin,
  ShieldCheck,
  CreditCard,
  ShoppingBag,
  Sparkles,
  Star,
  Navigation,
  ChevronDown,
  ChevronUp,
} from 'lucide-react';
import { CartItem } from '../data/products';
import { LoyaltyTracker } from './LoyaltyTracker';
import { LiveOrderRouteMap } from './LiveOrderRouteMap';

export interface PastOrderRecord extends OrderDetails {
  statusText: string;
  statusType: 'delivered' | 'in_transit' | 'try_on_kept';
  deliveredInMinutes?: number;
  formattedDate: string;
}

interface UserProfileModalProps {
  isOpen: boolean;
  onClose: () => void;
  orders: PastOrderRecord[];
  onTrackOrder: (order: OrderDetails) => void;
  onReorder: (items: CartItem[]) => void;
  onOpenFeedback?: (order: OrderDetails) => void;
  currentUser?: {
    name: string;
    email: string;
    avatar?: string;
    isVip?: boolean;
    tier?: string;
  } | null;
  onSignOut?: () => void;
  onOpenAdmin?: () => void;
}

export const UserProfileModal: React.FC<UserProfileModalProps> = ({
  isOpen,
  onClose,
  orders,
  onTrackOrder,
  onReorder,
  onOpenFeedback,
  currentUser,
  onSignOut,
  onOpenAdmin,
}) => {
  if (!isOpen) return null;

  const [activeTab, setActiveTab] = useState<'orders' | 'addresses' | 'vip'>('orders');
  const [filterStatus, setFilterStatus] = useState<'all' | 'delivered' | 'in_transit'>('all');
  const [expandedRouteId, setExpandedRouteId] = useState<string | null>(null);

  const filteredOrders = orders.filter((ord) => {
    if (filterStatus === 'all') return true;
    if (filterStatus === 'delivered') {
      return ord.statusType === 'delivered' || ord.statusType === 'try_on_kept';
    }
    if (filterStatus === 'in_transit') return ord.statusType === 'in_transit';
    return true;
  });

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="profile-modal-title"
      className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-black/75 backdrop-blur-sm animate-fadeIn"
      onClick={onClose}
    >
      <div
        className="bg-white max-w-4xl w-full rounded-sm overflow-hidden shadow-2xl relative border border-black/10 max-h-[92vh] flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Modal Top Header */}
        <div className="p-5 sm:p-6 border-b border-black/10 flex items-center justify-between bg-[#111111] text-white">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-[#FF5757] text-white flex items-center justify-center font-bold text-base font-fashion overflow-hidden">
              {currentUser?.avatar ? (
                <img src={currentUser.avatar} alt={currentUser.name} className="w-full h-full object-cover" />
              ) : (
                (currentUser?.name || 'Shaikh Kamran')
                  .split(' ')
                  .map((n) => n[0])
                  .join('')
                  .slice(0, 2)
              )}
            </div>
            <div>
              <h2 id="profile-modal-title" className="text-base font-black font-fashion uppercase tracking-wider text-white">
                Member Profile & Order History
              </h2>
              <p className="text-[11px] text-white/60">
                {currentUser?.name || 'Shaikh Kamran'} · {currentUser?.tier || 'Apparellex Black Diamond VIP'}
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2.5">
            {currentUser?.email === 'admin@apparellex.com' && onOpenAdmin && (
              <button
                onClick={() => {
                  onClose();
                  onOpenAdmin();
                }}
                className="text-xs text-[#FF5757] hover:text-white bg-[#FF5757]/15 hover:bg-[#FF5757] border border-[#FF5757]/40 px-3 py-1.5 rounded transition cursor-pointer flex items-center gap-1.5 font-bold"
                title="Open Administration Workspace"
              >
                <ShieldCheck className="w-3.5 h-3.5" />
                <span>Admin Panel</span>
              </button>
            )}
            {onSignOut && (
              <button
                onClick={onSignOut}
                className="text-xs text-stone-300 hover:text-white bg-white/10 hover:bg-white/20 px-3 py-1.5 rounded transition cursor-pointer"
              >
                Sign Out
              </button>
            )}
            <button
              onClick={onClose}
              className="text-white/60 hover:text-white transition p-1 cursor-pointer"
              aria-label="Close modal"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Profile Stats & Navigation Tabs */}
        <div className="bg-[#FAF8F2] border-b border-black/10 px-6 py-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          {/* User Fast Stats */}
          <div className="flex items-center gap-6 text-xs text-black/70">
            <div>
              <span className="text-[10px] uppercase font-bold text-black/50 block tracking-wider">
                Total Orders
              </span>
              <span className="text-sm font-black text-black tabular-nums">
                {orders.length} Drops
              </span>
            </div>
            <div className="h-6 w-px bg-black/15" />
            <div>
              <span className="text-[10px] uppercase font-bold text-black/50 block tracking-wider">
                Avg. Delivery Speed
              </span>
              <span className="text-sm font-black text-emerald-700 tabular-nums">
                ⚡ 9.2 Mins
              </span>
            </div>
            <div className="h-6 w-px bg-black/15" />
            <div>
              <span className="text-[10px] uppercase font-bold text-black/50 block tracking-wider">
                Doorstep Fit Rate
              </span>
              <span className="text-sm font-black text-black tabular-nums">
                100% Guaranteed
              </span>
            </div>
          </div>

          {/* Navigation Segmented Tabs */}
          <div className="flex items-center gap-1 p-1 bg-white border border-black/10 rounded-sm">
            <button
              onClick={() => setActiveTab('orders')}
              className={`px-3 py-1.5 text-xs font-bold uppercase tracking-wider rounded-xs transition-colors cursor-pointer ${
                activeTab === 'orders'
                  ? 'bg-[#1a1a1a] text-white'
                  : 'text-black/60 hover:text-black hover:bg-black/5'
              }`}
            >
              Order History ({orders.length})
            </button>
            <button
              onClick={() => setActiveTab('addresses')}
              className={`px-3 py-1.5 text-xs font-bold uppercase tracking-wider rounded-xs transition-colors cursor-pointer ${
                activeTab === 'addresses'
                  ? 'bg-[#1a1a1a] text-white'
                  : 'text-black/60 hover:text-black hover:bg-black/5'
              }`}
            >
              Saved Hubs
            </button>
            <button
              onClick={() => setActiveTab('vip')}
              className={`px-3 py-1.5 text-xs font-bold uppercase tracking-wider rounded-xs transition-colors cursor-pointer ${
                activeTab === 'vip'
                  ? 'bg-[#1a1a1a] text-white'
                  : 'text-black/60 hover:text-black hover:bg-black/5'
              }`}
            >
              VIP Tier
            </button>
          </div>
        </div>

        {/* Modal Scrollable Body */}
        <div className="p-6 md:p-8 overflow-y-auto flex-1 space-y-6">
          {activeTab === 'orders' && (
            <div>
              {/* Order Filter Bar */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6 pb-4 border-b border-black/10">
                <div>
                  <h3 className="text-base font-black font-fashion text-[#1a1a1a] uppercase tracking-wider">
                    Past Drops & Dispatches
                  </h3>
                  <p className="text-xs text-black/60 mt-0.5">
                    View previous 10-minute drop deliveries, statuses, receipts, and doorstep fit checks.
                  </p>
                </div>

                {/* Filter Controls */}
                <div className="flex items-center gap-1.5 text-xs font-semibold text-black/60">
                  <span className="text-[11px] uppercase tracking-wider text-black/40 mr-1">
                    Status:
                  </span>
                  {[
                    { id: 'all', label: 'All Orders' },
                    { id: 'delivered', label: 'Delivered' },
                    { id: 'in_transit', label: 'In Transit' },
                  ].map((filter) => (
                    <button
                      key={filter.id}
                      onClick={() => setFilterStatus(filter.id as any)}
                      className={`px-2.5 py-1 rounded-sm text-xs font-bold transition cursor-pointer ${
                        filterStatus === filter.id
                          ? 'bg-[#FF5757] text-white'
                          : 'bg-black/5 hover:bg-black/10 text-black/70'
                      }`}
                    >
                      {filter.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Orders List */}
              {filteredOrders.length === 0 ? (
                <div className="py-16 text-center bg-[#FAF8F2] rounded-sm border border-black/10 p-8">
                  <Package className="w-10 h-10 text-black/30 mx-auto mb-3" />
                  <h4 className="text-base font-bold font-fashion text-[#1a1a1a]">
                    No matching orders found
                  </h4>
                  <p className="text-xs text-black/60 mt-1 max-w-sm mx-auto">
                    You haven't placed any orders in this category yet. Explore our curated collections for 10-minute dispatch!
                  </p>
                </div>
              ) : (
                <div className="space-y-6">
                  {filteredOrders.map((orderRecord) => {
                    const isDelivered =
                      orderRecord.statusType === 'delivered' ||
                      orderRecord.statusType === 'try_on_kept';
                    const isInTransit = orderRecord.statusType === 'in_transit';

                    return (
                      <article
                        key={orderRecord.orderId}
                        className="bg-white border border-black/15 rounded-sm p-5 md:p-6 shadow-xs hover:border-black/30 transition-all space-y-4"
                      >
                        {/* Order Header: ID, Date, Final Status */}
                        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-black/10">
                          <div>
                            <div className="flex items-center gap-2">
                              <span className="font-mono text-sm font-black text-black">
                                #{orderRecord.orderId}
                              </span>
                              <span className="text-black/30">·</span>
                              <span className="text-xs text-black/60 flex items-center gap-1 font-medium">
                                <Calendar className="w-3.5 h-3.5 text-black/40" />
                                {orderRecord.formattedDate}
                              </span>
                            </div>
                            <p className="text-[11px] text-black/50 mt-1">
                              Delivered to: <strong className="text-black font-semibold">{orderRecord.address}</strong>
                            </p>
                          </div>

                          {/* Final Status Badge (Clean, accessible, anti-slop) */}
                          <div className="flex items-center gap-2 self-start sm:self-auto">
                            {isDelivered && (
                              <div className="flex items-center gap-1.5 px-3 py-1 bg-emerald-50 border border-emerald-200 text-emerald-800 rounded-sm text-xs font-bold">
                                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                                <span>{orderRecord.statusText}</span>
                              </div>
                            )}

                            {isInTransit && (
                              <div className="flex items-center gap-1.5 px-3 py-1 bg-[#FF5757]/10 border border-[#FF5757]/30 text-[#FF5757] rounded-sm text-xs font-bold animate-pulse">
                                <Bike className="w-3.5 h-3.5 text-[#FF5757]" />
                                <span>In Transit · Arriving in ~8 Mins</span>
                              </div>
                            )}
                          </div>
                        </div>

                        {/* Order Items List */}
                        <div className="divide-y divide-black/5 py-1">
                          {orderRecord.items.map((item, idx) => (
                            <div
                              key={idx}
                              className="py-3 flex items-center justify-between gap-4 text-xs"
                            >
                              <div className="flex items-center gap-3">
                                <img
                                  src={item.product.image}
                                  alt={item.product.name}
                                  className="w-12 h-14 object-cover rounded-xs bg-stone-200 shrink-0"
                                  referrerPolicy="no-referrer"
                                />
                                <div>
                                  <h5 className="font-bold text-black text-xs md:text-sm">
                                    {item.product.name}
                                  </h5>
                                  <div className="flex items-center gap-2 text-[11px] text-black/60 mt-0.5">
                                    <span>{item.product.categoryLabel}</span>
                                    <span>·</span>
                                    <span>Size: <strong className="text-black">{item.selectedSize}</strong></span>
                                    <span>·</span>
                                    <span>Qty: <strong className="text-black">{item.quantity}</strong></span>
                                    <span>·</span>
                                    <span className="flex items-center gap-1">
                                      Color:
                                      <span
                                        className="w-2 h-2 rounded-full border border-black/20"
                                        style={{ backgroundColor: item.selectedColor.hex }}
                                      />
                                    </span>
                                  </div>
                                </div>
                              </div>

                              <div className="text-right shrink-0">
                                <span className="font-black text-black tabular-nums text-sm">
                                  ₹{(item.product.price * item.quantity).toLocaleString('en-IN')}
                                </span>
                              </div>
                            </div>
                          ))}
                        </div>

                        {/* Order Footer: Payment & Actions */}
                        <div className="pt-3 border-t border-black/10 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                          <div className="text-xs text-black/70 flex items-center gap-3">
                            <span className="font-medium">
                              Total Paid:{' '}
                              <strong className="text-black font-black text-sm tabular-nums">
                                ₹{orderRecord.totalAmount.toLocaleString('en-IN')}
                              </strong>
                            </span>
                            <span className="text-black/30">·</span>
                            <span className="text-[11px] text-black/60">
                              {orderRecord.paymentMethod === 'cod'
                                ? 'Cash on Delivery (Doorstep Verified)'
                                : 'Card (Contactless Charge)'}
                            </span>
                          </div>

                          {/* Action Buttons */}
                          <div className="flex flex-wrap items-center gap-2">
                            {isInTransit && (
                              <button
                                type="button"
                                onClick={() =>
                                  setExpandedRouteId((prev) =>
                                    prev === orderRecord.orderId ? null : orderRecord.orderId
                                  )
                                }
                                className={`px-3 py-2 border rounded-sm text-xs font-bold uppercase tracking-wider flex items-center gap-1.5 transition cursor-pointer ${
                                  expandedRouteId === orderRecord.orderId
                                    ? 'bg-[#111111] text-white border-[#111111]'
                                    : 'bg-[#FAF8F2] hover:bg-[#111111] hover:text-white border-black/20 text-[#1a1a1a]'
                                }`}
                                title="Toggle live Google Maps route from warehouse to address"
                              >
                                <Navigation className="w-3.5 h-3.5 text-[#FF5757]" />
                                <span>{expandedRouteId === orderRecord.orderId ? 'Hide Map Route' : 'Preview Route'}</span>
                                {expandedRouteId === orderRecord.orderId ? (
                                  <ChevronUp className="w-3.5 h-3.5" />
                                ) : (
                                  <ChevronDown className="w-3.5 h-3.5" />
                                )}
                              </button>
                            )}

                            {onOpenFeedback && (orderRecord.statusType === 'delivered' || orderRecord.statusType === 'try_on_kept') && (
                              <button
                                onClick={() => {
                                  onOpenFeedback(orderRecord);
                                  onClose();
                                }}
                                className="px-3 py-2 bg-amber-50 hover:bg-amber-100 text-amber-900 border border-amber-200 rounded-sm text-xs font-bold uppercase tracking-wider flex items-center gap-1.5 transition cursor-pointer"
                                title="Rate 10-minute delivery speed and product quality"
                              >
                                <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-500" />
                                <span>Rate Drop</span>
                              </button>
                            )}

                            <button
                              onClick={() => {
                                onTrackOrder(orderRecord);
                                onClose();
                              }}
                              className={`px-3.5 py-2 text-white rounded-sm text-xs font-bold uppercase tracking-wider flex items-center gap-1.5 transition cursor-pointer ${
                                isInTransit
                                  ? 'bg-[#FF5757] hover:bg-[#e04545] shadow-sm animate-pulse'
                                  : 'bg-[#1a1a1a] hover:bg-[#FF5757]'
                              }`}
                              title="View full tracking radar or receipt"
                            >
                              {isInTransit ? (
                                <>
                                  <Bike className="w-3.5 h-3.5" />
                                  <span>Track Live Route</span>
                                </>
                              ) : (
                                <>
                                  <Clock className="w-3.5 h-3.5" />
                                  <span>View Tracker</span>
                                </>
                              )}
                            </button>

                            <button
                              onClick={() => {
                                onReorder(orderRecord.items);
                                onClose();
                              }}
                              className="px-3 py-2 bg-white border border-black/20 hover:border-black text-black rounded-sm text-xs font-bold uppercase tracking-wider flex items-center gap-1.5 transition cursor-pointer"
                              title="Add all items back to shopping bag"
                            >
                              <RotateCcw className="w-3.5 h-3.5" />
                              <span>Reorder</span>
                            </button>
                          </div>
                        </div>

                        {/* Inline Google Maps Route Visualizer for In-Transit Orders */}
                        {isInTransit && expandedRouteId === orderRecord.orderId && (
                          <div className="pt-3 border-t border-black/10 animate-fadeIn">
                            <LiveOrderRouteMap
                              order={orderRecord}
                              secondsRemaining={380}
                            />
                          </div>
                        )}
                      </article>
                    );
                  })}
                </div>
              )}
            </div>
          )}

          {activeTab === 'addresses' && (
            <div className="space-y-6">
              <div>
                <h3 className="text-base font-black font-fashion text-[#1a1a1a] uppercase tracking-wider">
                  Saved Micro-Hub Delivery Addresses
                </h3>
                <p className="text-xs text-black/60 mt-0.5">
                  Addresses configured with 10-minute priority dispatch routes.
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="p-4 bg-[#FAF8F2] border-2 border-[#FF5757] rounded-sm relative">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-[10px] uppercase font-bold tracking-wider text-[#FF5757] flex items-center gap-1">
                      <MapPin className="w-3 h-3" />
                      Default Priority Hub
                    </span>
                    <span className="text-[11px] font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded">
                      8-Min ETA
                    </span>
                  </div>
                  <h4 className="font-bold text-sm text-black">Primary Residence</h4>
                  <p className="text-xs text-black/70 mt-1">742 Evergreen Terrace, Apt 4B</p>
                  <p className="text-xs text-black/70">Metro Center, Postal Code: 10001</p>
                  <p className="text-[11px] text-black/50 mt-2 font-mono">Contact: +1 (555) 019-2834</p>
                </div>

                <div className="p-4 bg-white border border-black/15 rounded-sm">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-[10px] uppercase font-bold tracking-wider text-black/50 flex items-center gap-1">
                      <MapPin className="w-3 h-3" />
                      Secondary Hub
                    </span>
                    <span className="text-[11px] font-bold text-black/70 bg-black/5 px-2 py-0.5 rounded">
                      10-Min ETA
                    </span>
                  </div>
                  <h4 className="font-bold text-sm text-black">Apparellex Design Studio</h4>
                  <p className="text-xs text-black/70 mt-1">108 Mercer Street, Floor 3</p>
                  <p className="text-xs text-black/70">SoHo Fashion District, 10012</p>
                  <p className="text-[11px] text-black/50 mt-2 font-mono">Contact: +1 (555) 019-2834</p>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'vip' && (
            <div className="space-y-6">
              <div className="bg-[#111111] text-white p-6 rounded-sm relative overflow-hidden">
                <div className="relative z-10">
                  <span className="text-xs uppercase font-extrabold tracking-widest text-[#FF5757] flex items-center gap-1.5 mb-2">
                    <Sparkles className="w-3.5 h-3.5" />
                    Apparellex Black Diamond Tier
                  </span>
                  <h3 className="text-2xl font-black font-fashion text-white mb-2">
                    ULTRA-PRIORITY COURIER DISPATCH
                  </h3>
                  <p className="text-xs text-white/70 max-w-lg leading-relaxed font-light">
                    As a founding member, your orders are guaranteed to be packed within 90 seconds and dispatched on priority Super73 electric cargo bikes with free instant size swaps.
                  </p>
                </div>
              </div>

              {/* Loyalty Points Tracker & Balance Widget */}
              <LoyaltyTracker cartTotal={0} mode="checkout" />

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs">
                <div className="p-4 bg-[#FAF8F2] border border-black/10 rounded-sm">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-[#FF5757] block mb-1">
                    Benefit 01
                  </span>
                  <h4 className="font-bold text-black mb-1">Free 10-Min Delivery</h4>
                  <p className="text-black/60 text-[11px]">
                    No minimum spend required for 10-minute dispatch across metropolitan hubs.
                  </p>
                </div>
                <div className="p-4 bg-[#FAF8F2] border border-black/10 rounded-sm">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-[#FF5757] block mb-1">
                    Benefit 02
                  </span>
                  <h4 className="font-bold text-black mb-1">10-Min Size Swap</h4>
                  <p className="text-black/60 text-[11px]">
                    Electric couriers carry back-up sizes for immediate doorstep exchange.
                  </p>
                </div>
                <div className="p-4 bg-[#FAF8F2] border border-black/10 rounded-sm">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-[#FF5757] block mb-1">
                    Benefit 03
                  </span>
                  <h4 className="font-bold text-black mb-1">VIP Vault Drops</h4>
                  <p className="text-black/60 text-[11px]">
                    48-hour advance access to limited-edition seasonal runway pieces.
                  </p>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Modal Footer */}
        <div className="p-4 sm:p-5 bg-[#FAF8F2] border-t border-black/10 flex items-center justify-between text-xs">
          <span className="text-black/50">
            Founder Direct Support: <strong className="text-black font-semibold">Apparellexsk@gmail.com</strong>
          </span>
          <button
            onClick={onClose}
            className="px-5 py-2.5 bg-[#1a1a1a] hover:bg-[#FF5757] text-white font-bold uppercase tracking-wider text-xs rounded-sm transition cursor-pointer"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};
