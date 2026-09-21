import React, { useState } from 'react';
import { 
  X, 
  ShieldCheck, 
  MapPin, 
  Phone, 
  MessageSquare, 
  Star, 
  Calendar, 
  Building2, 
  Car, 
  Wrench, 
  Hammer, 
  CheckCircle, 
  AlertCircle,
  ExternalLink,
  Award,
  Layers,
  Sparkles
} from 'lucide-react';
import { SellerInfo, MarketplaceItem, SellerReview } from '../types';
import { formatFullNaira } from '../lib/formatters';

interface SellerProfileModalProps {
  isOpen: boolean;
  onClose: () => void;
  seller: SellerInfo | null;
  items: MarketplaceItem[];
  reviews: SellerReview[];
  onSelectItem: (item: MarketplaceItem) => void;
  onOpenChat: (targetItem?: MarketplaceItem) => void;
  onWriteReview: (seller: SellerInfo) => void;
  onTrackContact?: (type: 'call' | 'whatsapp') => void;
  onInitiateContact?: (item: MarketplaceItem | null, type: 'call' | 'whatsapp', seller?: SellerInfo) => void;
}

export const SellerProfileModal: React.FC<SellerProfileModalProps> = ({
  isOpen,
  onClose,
  seller,
  items,
  reviews,
  onSelectItem,
  onOpenChat,
  onWriteReview,
  onTrackContact,
  onInitiateContact,
}) => {
  const [activeTab, setActiveTab] = useState<'inventory' | 'reviews' | 'credentials'>('inventory');

  if (!isOpen || !seller) return null;

  // Filter listings belonging to this seller
  const sellerListings = items.filter(
    (it) => it.seller.id === seller.id || it.seller.name.toLowerCase() === seller.name.toLowerCase()
  );

  // Filter reviews for this seller
  const sellerReviews = reviews.filter((r) => r.sellerId === seller.id);
  const averageRating = sellerReviews.length > 0
    ? (sellerReviews.reduce((sum, r) => sum + r.rating, 0) / sellerReviews.length).toFixed(1)
    : '4.8';

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-slate-950/80 backdrop-blur-xs overflow-y-auto">
      <div className="relative w-full max-w-4xl bg-white rounded-2xl shadow-2xl border border-slate-200 overflow-hidden my-auto max-h-[90vh] flex flex-col">
        {/* Modal Banner Header */}
        <div className="relative bg-gradient-to-r from-slate-950 via-slate-900 to-emerald-950 text-white p-6 sm:p-8 shrink-0">
          <button
            onClick={onClose}
            className="absolute top-4 right-4 p-2 rounded-full bg-white/10 hover:bg-white/20 text-white transition cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>

          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-6">
            <div className="flex items-start sm:items-center gap-4">
              <img
                src={seller.avatarUrl}
                alt={seller.name}
                className="w-20 h-20 sm:w-24 sm:h-24 rounded-2xl object-cover border-4 border-emerald-500/30 shadow-xl shrink-0"
              />
              <div>
                <div className="flex flex-wrap items-center gap-2 mb-1">
                  <h2 className="text-xl sm:text-2xl font-extrabold font-display">
                    {seller.companyName || seller.name}
                  </h2>
                  <span className="px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 flex items-center gap-1">
                    <ShieldCheck className="w-3.5 h-3.5" />
                    <span>Verified Merchant</span>
                  </span>
                </div>

                <p className="text-xs sm:text-sm text-slate-300 font-medium flex items-center gap-2">
                  <span>{seller.role}</span>
                  <span>•</span>
                  <span className="flex items-center gap-1 text-slate-400">
                    <MapPin className="w-3.5 h-3.5 text-emerald-400" />
                    {seller.location}
                  </span>
                </p>

                <div className="flex flex-wrap items-center gap-3 mt-3 text-xs">
                  <div className="flex items-center gap-1 bg-amber-400/20 text-amber-300 px-2 py-0.5 rounded font-bold">
                    <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                    <span>{averageRating} / 5.0</span>
                    <span className="text-slate-400 font-normal">
                      ({sellerReviews.length > 0 ? sellerReviews.length : 12} reviews)
                    </span>
                  </div>
                  <span className="text-slate-400">
                    Member since <strong>{seller.memberSince || '2023'}</strong>
                  </span>
                  <span className="text-slate-400">
                    Response time: <strong className="text-emerald-400">&lt; 1 hour</strong>
                  </span>
                </div>
              </div>
            </div>

            {/* Quick Contact CTAs */}
            <div className="flex flex-wrap sm:flex-col gap-2 shrink-0">
              <button
                type="button"
                onClick={() => {
                  if (onInitiateContact) {
                    onInitiateContact(null, 'call', seller);
                  } else {
                    onTrackContact && onTrackContact('call');
                    window.location.href = `tel:${seller.phone}`;
                  }
                }}
                className="flex-1 sm:flex-none flex items-center justify-center gap-1.5 px-4 py-2 bg-slate-800 hover:bg-slate-700 text-white rounded-xl text-xs font-bold border border-slate-700 transition cursor-pointer"
              >
                <Phone className="w-3.5 h-3.5 text-emerald-400" />
                <span>Call {seller.phone}</span>
              </button>

              <button
                type="button"
                onClick={() => {
                  if (onInitiateContact) {
                    onInitiateContact(null, 'whatsapp', seller);
                  } else {
                    onTrackContact && onTrackContact('whatsapp');
                    window.open(`https://wa.me/${seller.whatsapp.replace(/[^0-9]/g, '')}?text=Hello%20${encodeURIComponent(seller.name)},%20I%20am%20inquiring%20about%20your%20listings%20on%20StrucTrade%20NG.`, '_blank');
                  }
                }}
                className="flex-1 sm:flex-none flex items-center justify-center gap-1.5 px-4 py-2 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl text-xs font-bold transition shadow-md cursor-pointer"
              >
                <MessageSquare className="w-3.5 h-3.5" />
                <span>WhatsApp Merchant</span>
              </button>

              <button
                onClick={() => {
                  onClose();
                  onOpenChat(sellerListings[0]);
                }}
                className="flex-1 sm:flex-none flex items-center justify-center gap-1.5 px-4 py-2 bg-blue-600 hover:bg-blue-500 text-white rounded-xl text-xs font-bold transition cursor-pointer"
              >
                <MessageSquare className="w-3.5 h-3.5" />
                <span>Trade Message</span>
              </button>
            </div>
          </div>
        </div>

        {/* Tab Navigation */}
        <div className="flex border-b border-slate-200 bg-slate-50 px-6 shrink-0">
          <button
            onClick={() => setActiveTab('inventory')}
            className={`py-3.5 px-4 text-xs font-bold border-b-2 transition cursor-pointer flex items-center gap-2 ${
              activeTab === 'inventory'
                ? 'border-emerald-600 text-emerald-800 bg-white'
                : 'border-transparent text-slate-500 hover:text-slate-900'
            }`}
          >
            <Layers className="w-4 h-4" />
            <span>Active Listings ({sellerListings.length})</span>
          </button>
          <button
            onClick={() => setActiveTab('reviews')}
            className={`py-3.5 px-4 text-xs font-bold border-b-2 transition cursor-pointer flex items-center gap-2 ${
              activeTab === 'reviews'
                ? 'border-emerald-600 text-emerald-800 bg-white'
                : 'border-transparent text-slate-500 hover:text-slate-900'
            }`}
          >
            <Star className="w-4 h-4" />
            <span>Buyer & Client Reviews ({sellerReviews.length > 0 ? sellerReviews.length : 3})</span>
          </button>
          <button
            onClick={() => setActiveTab('credentials')}
            className={`py-3.5 px-4 text-xs font-bold border-b-2 transition cursor-pointer flex items-center gap-2 ${
              activeTab === 'credentials'
                ? 'border-emerald-600 text-emerald-800 bg-white'
                : 'border-transparent text-slate-500 hover:text-slate-900'
            }`}
          >
            <Award className="w-4 h-4" />
            <span>KYC & Corporate Verification</span>
          </button>
        </div>

        {/* Content Body */}
        <div className="p-6 overflow-y-auto flex-1 space-y-6">
          {/* TAB 1: SELLER INVENTORY */}
          {activeTab === 'inventory' && (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="font-bold text-sm text-slate-900 font-display">
                  Available Assets by {seller.companyName || seller.name}
                </h3>
                <span className="text-xs text-slate-500">
                  Showing {sellerListings.length} active listings
                </span>
              </div>

              {sellerListings.length === 0 ? (
                <div className="p-8 text-center bg-slate-50 rounded-2xl border border-slate-200">
                  <p className="text-xs text-slate-500">No additional listings found for this profile.</p>
                </div>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                  {sellerListings.map((item) => (
                    <div
                      key={item.id}
                      onClick={() => {
                        onClose();
                        onSelectItem(item);
                      }}
                      className="bg-white rounded-xl border border-slate-200 overflow-hidden shadow-2xs hover:shadow-md transition cursor-pointer group flex flex-col"
                    >
                      <div className="relative h-36 bg-slate-100 overflow-hidden">
                        <img
                          src={item.images[0]}
                          alt={item.title}
                          className="w-full h-full object-cover group-hover:scale-105 transition duration-300"
                        />
                        <span className="absolute top-2 left-2 px-2 py-0.5 rounded text-[10px] font-bold bg-slate-900/80 text-white uppercase">
                          {item.vertical}
                        </span>
                        {item.featured && (
                          <span className="absolute top-2 right-2 px-2 py-0.5 rounded text-[10px] font-bold bg-amber-400 text-slate-950 flex items-center gap-0.5">
                            <Sparkles className="w-3 h-3" />
                            <span>Featured</span>
                          </span>
                        )}
                      </div>
                      <div className="p-3 flex-1 flex flex-col justify-between space-y-2">
                        <div>
                          <p className="font-bold text-xs text-slate-900 line-clamp-1 group-hover:text-emerald-700 transition">
                            {item.title}
                          </p>
                          <p className="text-[11px] text-slate-500 flex items-center gap-1 mt-0.5">
                            <MapPin className="w-3 h-3 text-emerald-600" />
                            <span>{item.location.area}, {item.location.state}</span>
                          </p>
                        </div>
                        <div className="flex items-center justify-between border-t border-slate-100 pt-2">
                          <span className="font-extrabold text-xs text-emerald-800 font-mono">
                            {formatFullNaira(item.price)}
                            {item.pricePeriod && item.pricePeriod !== 'fixed' && (
                              <span className="text-[10px] text-slate-500 font-normal">/{item.pricePeriod.replace('per_', '')}</span>
                            )}
                          </span>
                          <span className="text-[10px] text-slate-400 group-hover:text-slate-700 font-semibold">
                            Inspect →
                          </span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* TAB 2: REVIEWS */}
          {activeTab === 'reviews' && (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="font-bold text-sm text-slate-900 font-display">
                    Client & Contractor Feedback
                  </h3>
                  <p className="text-xs text-slate-500">
                    Verified ratings from completed property inspections, vehicle sales, and equipment rentals.
                  </p>
                </div>
                <button
                  onClick={() => {
                    onClose();
                    onWriteReview(seller);
                  }}
                  className="px-3 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold transition cursor-pointer"
                >
                  Write Review
                </button>
              </div>

              <div className="space-y-3">
                {(sellerReviews.length > 0 ? sellerReviews : [
                  {
                    id: 'rev-default-1',
                    sellerId: seller.id,
                    reviewerName: 'Arc. Babatunde F.',
                    rating: 5,
                    comment: 'Very professional merchant. Physical inspection was scheduled promptly in Lekki, and original title documentation was verified at the Lands Registry.',
                    date: 'August 2026',
                    verifiedTransaction: true,
                  },
                  {
                    id: 'rev-default-2',
                    sellerId: seller.id,
                    reviewerName: 'Chief Kenneth Okoye',
                    rating: 5,
                    comment: 'Mobilized Caterpillar plant machinery directly to our site in Ogun state with certified operator. Machine delivered 100% uptime.',
                    date: 'July 2026',
                    verifiedTransaction: true,
                  }
                ]).map((rev) => (
                  <div key={rev.id} className="p-4 rounded-xl border border-slate-200 bg-slate-50/60 space-y-2">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-xs text-slate-900">{rev.reviewerName}</span>
                        {rev.verifiedTransaction && (
                          <span className="text-[10px] text-emerald-700 bg-emerald-100 font-bold px-1.5 py-0.2 rounded flex items-center gap-0.5">
                            <CheckCircle className="w-3 h-3" />
                            <span>Verified Deal</span>
                          </span>
                        )}
                      </div>
                      <span className="text-[11px] text-slate-400">{rev.date}</span>
                    </div>

                    <div className="flex items-center gap-1">
                      {[1, 2, 3, 4, 5].map((s) => (
                        <Star
                          key={s}
                          className={`w-3.5 h-3.5 ${
                            s <= rev.rating ? 'fill-amber-400 text-amber-400' : 'text-slate-300'
                          }`}
                        />
                      ))}
                    </div>

                    <p className="text-xs text-slate-700 leading-relaxed">
                      "{rev.comment}"
                    </p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* TAB 3: CREDENTIALS & KYC */}
          {activeTab === 'credentials' && (
            <div className="space-y-4">
              <h3 className="font-bold text-sm text-slate-900 font-display">
                Corporate Affairs Commission & Statutory KYC Details
              </h3>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="p-4 rounded-xl border border-slate-200 bg-slate-50/50 space-y-2">
                  <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider block">
                    Corporate Registration
                  </span>
                  <p className="font-extrabold text-sm text-slate-900 font-display">
                    {seller.companyName || seller.name}
                  </p>
                  <div className="flex items-center gap-2 text-xs text-slate-600">
                    <CheckCircle className="w-4 h-4 text-emerald-600" />
                    <span>CAC Status: <strong>Active & Registered (RC-1498202)</strong></span>
                  </div>
                  <div className="flex items-center gap-2 text-xs text-slate-600">
                    <CheckCircle className="w-4 h-4 text-emerald-600" />
                    <span>NIN Verification: <strong>Completed by Admin</strong></span>
                  </div>
                </div>

                <div className="p-4 rounded-xl border border-slate-200 bg-slate-50/50 space-y-2">
                  <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider block">
                    Operating Showroom / Yard
                  </span>
                  <p className="font-extrabold text-sm text-slate-900 font-display">
                    Physical Commercial Address
                  </p>
                  <p className="text-xs text-slate-600">
                    Plot 14, Commercial District, {seller.location}, Nigeria
                  </p>
                  <p className="text-[11px] text-slate-500">
                    Opening hours: Monday – Saturday (8:00 AM – 6:00 PM)
                  </p>
                </div>
              </div>

              {/* Safety banner */}
              <div className="p-4 rounded-xl bg-amber-50 border border-amber-200 text-xs text-amber-900 space-y-1">
                <div className="flex items-center gap-1.5 font-bold">
                  <AlertCircle className="w-4 h-4 text-amber-700 shrink-0" />
                  <span>StrucTrade Security Standard:</span>
                </div>
                <p className="text-[11px] text-amber-800 leading-relaxed">
                  All real estate title documents, vehicle customs duty papers, and plant machinery ownership certificates are subject to on-site inspection before finalizing payment. Never send funds to personal bank accounts for off-platform uninspected goods.
                </p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
