import React, { useState } from 'react';
import { Star, CheckCircle2, Zap, MessageSquare, ThumbsUp, Plus, X } from 'lucide-react';
import { PRODUCTS } from '../data/products';

interface Review {
  id: string;
  author: string;
  city: string;
  rating: number;
  deliveryMinutes: number;
  productName: string;
  date: string;
  comment: string;
  likes: number;
  isLiked?: boolean;
}

const INITIAL_REVIEWS: Review[] = [
  {
    id: 'rev-1',
    author: 'Darius K.',
    city: 'SoHo, NYC',
    rating: 5,
    deliveryMinutes: 8,
    productName: 'Heavyweight Raw-Edge Hoodie',
    date: '2 days ago',
    comment: 'I honestly did not believe the 10-minute claim until the electric courier buzzed my door in exactly 8 minutes. The 480 GSM terry cotton is substantial, dense, and sits boxy without slouching.',
    likes: 24,
  },
  {
    id: 'rev-2',
    author: 'Elena R.',
    city: 'Arts District, LA',
    rating: 5,
    deliveryMinutes: 10,
    productName: 'Sculptural Asymmetric Runway Coat',
    date: '3 days ago',
    comment: 'The doorstep try-on is a game changer. The courier waited 5 minutes while I tried on size S and the backup size XS he brought. Ended up keeping the S. Never waiting 5 days for fashion again.',
    likes: 31,
  },
  {
    id: 'rev-3',
    author: 'Marcus T.',
    city: 'Tribeca',
    rating: 5,
    deliveryMinutes: 9,
    productName: 'Modular Technical Cargo Trousers',
    date: '5 days ago',
    comment: 'Hardware quality is top-tier. Magnetic ankle cinches and Cordura ripstop feel bulletproof. Shaikh Kamran and the team really cracked the code on instant luxury.',
    likes: 19,
  },
];

interface CommunityReviewsProps {
  onNotifyToast: (msg: string) => void;
}

export const CommunityReviews: React.FC<CommunityReviewsProps> = ({ onNotifyToast }) => {
  const [reviews, setReviews] = useState<Review[]>(INITIAL_REVIEWS);
  const [isAddingReview, setIsAddingReview] = useState(false);

  // New review form state
  const [authorName, setAuthorName] = useState('');
  const [cityLocation, setCityLocation] = useState('');
  const [selectedProduct, setSelectedProduct] = useState(PRODUCTS[0].name);
  const [rating, setRating] = useState(5);
  const [deliveryMins, setDeliveryMins] = useState(9);
  const [reviewComment, setReviewComment] = useState('');

  const handleToggleLike = (id: string) => {
    setReviews((prev) =>
      prev.map((r) => {
        if (r.id === id) {
          const isLiked = !r.isLiked;
          return {
            ...r,
            isLiked,
            likes: isLiked ? r.likes + 1 : r.likes - 1,
          };
        }
        return r;
      })
    );
  };

  const handleSubmitReview = (e: React.FormEvent) => {
    e.preventDefault();
    if (!authorName.trim() || !reviewComment.trim()) return;

    const newRev: Review = {
      id: `rev-${Date.now()}`,
      author: authorName.trim(),
      city: cityLocation.trim() || 'Metro District',
      rating,
      deliveryMinutes: deliveryMins,
      productName: selectedProduct,
      date: 'Just Now',
      comment: reviewComment.trim(),
      likes: 1,
      isLiked: true,
    };

    setReviews([newRev, ...reviews]);
    setIsAddingReview(false);
    setAuthorName('');
    setCityLocation('');
    setReviewComment('');
    onNotifyToast('Thank you! Your verified review and doorstep speed report was published.');
  };

  return (
    <section id="reviews" className="py-24 bg-[#FAF8F2] border-t border-black/10">
      <div className="container mx-auto px-6">
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12 pb-6 border-b border-black/10">
          <div>
            <div className="inline-flex items-center gap-2 text-[#FF5757] text-xs font-bold uppercase tracking-[0.3em] mb-2">
              <Zap className="w-3.5 h-3.5 fill-[#FF5757]" />
              <span>Doorstep Speed & Craft Verified</span>
            </div>
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-black font-fashion tracking-tight text-[#1a1a1a]">
              STREET CRED & REVIEWS
            </h2>
            <p className="text-xs text-black/60 mt-1 max-w-lg font-light leading-relaxed">
              Read uncensored feedback from metropolitan disruptors who received their drops in 10 minutes or less.
            </p>
          </div>

          {/* Aggregate Metric & Write Review CTA */}
          <div className="flex items-center gap-6">
            <div className="text-right">
              <div className="flex items-center gap-1.5 text-amber-500 justify-end">
                <div className="flex">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="w-4 h-4 fill-amber-500" />
                  ))}
                </div>
                <span className="text-sm font-black text-black tabular-nums">4.9 / 5.0</span>
              </div>
              <span className="text-[11px] text-black/50 block mt-0.5">
                Based on 480+ verified 10m drops
              </span>
            </div>

            <button
              onClick={() => setIsAddingReview(true)}
              className="bg-[#1a1a1a] hover:bg-[#FF5757] text-white px-5 py-3 rounded-sm text-xs font-bold uppercase tracking-wider flex items-center gap-1.5 transition cursor-pointer shadow-sm"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Write Review</span>
            </button>
          </div>
        </div>

        {/* Reviews Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {reviews.map((rev) => (
            <div
              key={rev.id}
              className="bg-white border border-black/10 p-6 rounded-sm flex flex-col justify-between hover:shadow-md transition-shadow"
            >
              <div>
                {/* Top Row: Stars + Verified 10m Badge */}
                <div className="flex items-center justify-between mb-3">
                  <div className="flex text-amber-500">
                    {[...Array(rev.rating)].map((_, i) => (
                      <Star key={i} className="w-3.5 h-3.5 fill-amber-500" />
                    ))}
                  </div>

                  <span className="inline-flex items-center gap-1 text-[10px] font-bold text-emerald-800 bg-emerald-50 px-2 py-0.5 rounded-sm">
                    <CheckCircle2 className="w-3 h-3 text-emerald-600" />
                    ⚡ {rev.deliveryMinutes}m Doorstep Delivery
                  </span>
                </div>

                {/* Comment Body */}
                <p className="text-xs text-black/80 leading-relaxed font-light mb-4">
                  "{rev.comment}"
                </p>

                {/* Product Tag */}
                <div className="text-[11px] font-bold text-black/60 bg-[#FAF8F2] px-2.5 py-1 rounded-xs inline-block mb-4 border border-black/5">
                  Item: {rev.productName}
                </div>
              </div>

              {/* Author & Like Footer */}
              <div className="pt-3 border-t border-black/10 flex items-center justify-between text-xs text-black/60">
                <div>
                  <span className="font-bold text-black block">{rev.author}</span>
                  <span className="text-[10px] text-black/40">
                    {rev.city} · {rev.date}
                  </span>
                </div>

                <button
                  onClick={() => handleToggleLike(rev.id)}
                  className={`flex items-center gap-1 text-xs px-2 py-1 rounded transition cursor-pointer ${
                    rev.isLiked ? 'text-[#FF5757] font-bold' : 'text-black/50 hover:text-black'
                  }`}
                  title="Helpful review"
                >
                  <ThumbsUp className="w-3.5 h-3.5" />
                  <span className="tabular-nums">{rev.likes}</span>
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* Modal: Write a Review */}
        {isAddingReview && (
          <div
            role="dialog"
            aria-modal="true"
            aria-labelledby="review-modal-title"
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fadeIn"
            onClick={() => setIsAddingReview(false)}
          >
            <div
              className="bg-white max-w-lg w-full rounded-sm overflow-hidden shadow-2xl relative border border-black/10"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="p-5 border-b border-black/10 flex items-center justify-between bg-[#111111] text-white">
                <div className="flex items-center gap-2">
                  <MessageSquare className="w-4 h-4 text-[#FF5757]" />
                  <h3 id="review-modal-title" className="text-xs font-black uppercase tracking-wider font-fashion">
                    Submit Doorstep Fit & Speed Review
                  </h3>
                </div>
                <button
                  onClick={() => setIsAddingReview(false)}
                  className="text-white/60 hover:text-white p-1 cursor-pointer"
                  aria-label="Close"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              <form onSubmit={handleSubmitReview} className="p-6 space-y-4">
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-[11px] font-bold uppercase tracking-wider text-black/70 mb-1">
                      Your Name *
                    </label>
                    <input
                      type="text"
                      required
                      value={authorName}
                      onChange={(e) => setAuthorName(e.target.value)}
                      placeholder="e.g. Jordan V."
                      className="w-full text-xs p-2.5 border border-black/20 rounded-sm bg-white outline-none focus:border-[#FF5757]"
                    />
                  </div>
                  <div>
                    <label className="block text-[11px] font-bold uppercase tracking-wider text-black/70 mb-1">
                      City / Area
                    </label>
                    <input
                      type="text"
                      value={cityLocation}
                      onChange={(e) => setCityLocation(e.target.value)}
                      placeholder="e.g. Downtown, Chicago"
                      className="w-full text-xs p-2.5 border border-black/20 rounded-sm bg-white outline-none focus:border-[#FF5757]"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-[11px] font-bold uppercase tracking-wider text-black/70 mb-1">
                      Garment Reviewed
                    </label>
                    <select
                      value={selectedProduct}
                      onChange={(e) => setSelectedProduct(e.target.value)}
                      className="w-full text-xs p-2.5 border border-black/20 rounded-sm bg-white outline-none"
                    >
                      {PRODUCTS.map((p) => (
                        <option key={p.id} value={p.name}>
                          {p.name}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="block text-[11px] font-bold uppercase tracking-wider text-black/70 mb-1">
                      Delivery Time (Mins)
                    </label>
                    <input
                      type="number"
                      min={5}
                      max={15}
                      value={deliveryMins}
                      onChange={(e) => setDeliveryMins(Number(e.target.value))}
                      className="w-full text-xs p-2.5 border border-black/20 rounded-sm bg-white outline-none"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-[11px] font-bold uppercase tracking-wider text-black/70 mb-1">
                    Rating (1 to 5 Stars)
                  </label>
                  <div className="flex items-center gap-1 text-amber-500">
                    {[1, 2, 3, 4, 5].map((s) => (
                      <button
                        type="button"
                        key={s}
                        onClick={() => setRating(s)}
                        className="p-1 cursor-pointer"
                      >
                        <Star
                          className={`w-5 h-5 ${
                            s <= rating ? 'fill-amber-500 text-amber-500' : 'text-stone-300'
                          }`}
                        />
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  <label className="block text-[11px] font-bold uppercase tracking-wider text-black/70 mb-1">
                    Your Review & Experience *
                  </label>
                  <textarea
                    required
                    rows={3}
                    value={reviewComment}
                    onChange={(e) => setReviewComment(e.target.value)}
                    placeholder="Describe the fabric weight, fit accuracy, and 10-minute doorstep handover..."
                    className="w-full text-xs p-2.5 border border-black/20 rounded-sm bg-white outline-none focus:border-[#FF5757]"
                  />
                </div>

                <div className="pt-2 flex gap-2">
                  <button
                    type="submit"
                    className="flex-1 bg-[#1a1a1a] hover:bg-[#FF5757] text-white py-3 rounded-sm text-xs font-bold uppercase tracking-wider transition cursor-pointer"
                  >
                    Publish Verified Review
                  </button>
                  <button
                    type="button"
                    onClick={() => setIsAddingReview(false)}
                    className="px-4 py-3 bg-white border border-black/20 hover:border-black text-black rounded-sm text-xs font-bold uppercase tracking-wider transition cursor-pointer"
                  >
                    Cancel
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    </section>
  );
};
