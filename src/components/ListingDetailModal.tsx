import React, { useState, useEffect } from 'react';
import { 
  X, 
  MapPin, 
  ShieldCheck, 
  Calendar, 
  Phone, 
  MessageSquare, 
  Bed, 
  Bath, 
  Car, 
  Maximize2, 
  Gauge, 
  Fuel, 
  Cog, 
  Clock, 
  Weight, 
  UserCheck, 
  Truck, 
  Award, 
  FileCheck, 
  AlertCircle,
  CalendarClock,
  Share2,
  Check,
  Scale,
  ShieldAlert,
  Star,
  User
} from 'lucide-react';
import { MarketplaceItem, SellerInfo, UserAccount } from '../types';
import { formatFullNaira, formatNumber } from '../lib/formatters';

interface ListingDetailModalProps {
  item: MarketplaceItem | null;
  onClose: () => void;
  onRequestViewing: (item: MarketplaceItem) => void;
  onRequestRental: (item: MarketplaceItem) => void;
  onOpenChat?: (item: MarketplaceItem) => void;
  onAddToCompare?: (item: MarketplaceItem) => void;
  isCompared?: boolean;
  onReportListing?: (item: MarketplaceItem) => void;
  onReviewSeller?: (seller: SellerInfo) => void;
  onTrackContact?: (type: 'call' | 'whatsapp') => void;
  onViewSellerProfile?: (seller: SellerInfo) => void;
  onInitiateContact?: (item: MarketplaceItem, type: 'call' | 'whatsapp') => void;
  currentUser?: UserAccount;
}

export const ListingDetailModal: React.FC<ListingDetailModalProps> = ({
  item,
  onClose,
  onRequestViewing,
  onRequestRental,
  onOpenChat,
  onAddToCompare,
  isCompared = false,
  onReportListing,
  onReviewSeller,
  onTrackContact,
  onViewSellerProfile,
  onInitiateContact,
  currentUser,
}) => {
  if (!item) return null;

  const [activeImageIndex, setActiveImageIndex] = useState(0);
  const [copiedLink, setCopiedLink] = useState(false);
  const [buyerContact, setBuyerContact] = useState<{ name: string; phone: string; whatsapp: string }>({
    name: '',
    phone: '',
    whatsapp: '',
  });

  useEffect(() => {
    try {
      const saved = localStorage.getItem('structrade_buyer_contact');
      if (saved) {
        const parsed = JSON.parse(saved);
        setBuyerContact({
          name: parsed.name || '',
          phone: parsed.phone || '',
          whatsapp: parsed.whatsapp || parsed.phone || '',
        });
        return;
      }
    } catch {}

    if (currentUser && currentUser.name && currentUser.name !== 'Guest User') {
      setBuyerContact({
        name: currentUser.name,
        phone: currentUser.phone || '',
        whatsapp: currentUser.whatsapp || currentUser.phone || '',
      });
    }
  }, [currentUser]);

  const handleCopyLink = () => {
    navigator.clipboard?.writeText(window.location.href);
    setCopiedLink(true);
    setTimeout(() => setCopiedLink(false), 2000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-0 sm:p-4 bg-black/70 backdrop-blur-xs animate-in fade-in duration-150 overflow-y-auto">
      <div className="bg-white rounded-none sm:rounded-2xl max-w-4xl w-full h-full sm:h-auto sm:my-auto shadow-2xl border-0 sm:border border-slate-200 overflow-hidden relative sm:max-h-[92vh] flex flex-col">
        {/* Sticky Header with Close button */}
        <div className="flex items-center justify-between p-3.5 sm:p-4 border-b border-slate-100 bg-white sticky top-0 z-10 shrink-0">
          <div className="flex items-center gap-2 min-w-0">
            <span className="px-2.5 py-1 rounded-md text-xs font-bold uppercase tracking-wider bg-slate-900 text-white shrink-0">
              {item.vertical.toUpperCase()}
            </span>
            <span className="text-xs text-slate-500 font-medium truncate">
              {item.location.area}, {item.location.state}
            </span>
          </div>

          <div className="flex items-center gap-1 sm:gap-2 shrink-0">
            <button
              onClick={handleCopyLink}
              className="p-2 text-slate-500 hover:text-slate-800 rounded-lg hover:bg-slate-100 transition text-xs font-medium flex items-center gap-1 cursor-pointer min-h-[36px]"
              title="Share listing link"
            >
              {copiedLink ? <Check className="w-4 h-4 text-emerald-600" /> : <Share2 className="w-4 h-4" />}
              <span className="hidden sm:inline">{copiedLink ? 'Copied' : 'Share'}</span>
            </button>
            <button
              onClick={onClose}
              className="p-2 text-slate-500 hover:text-slate-900 rounded-full hover:bg-slate-100 transition cursor-pointer min-w-[40px] min-h-[40px] flex items-center justify-center"
              aria-label="Close modal"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Modal Scrollable Body */}
        <div className="p-4 sm:p-6 overflow-y-auto space-y-6">
          {/* 1. Image Gallery */}
          <div>
            <div className="relative aspect-16/9 rounded-xl overflow-hidden bg-slate-100 mb-2 border border-slate-200">
              <img
                src={item.images[activeImageIndex] || item.images[0]}
                alt={item.title}
                className="w-full h-full object-cover"
              />
            </div>
            {item.images.length > 1 && (
              <div className="flex gap-2 overflow-x-auto pb-1">
                {item.images.map((img, idx) => (
                  <button
                    key={idx}
                    onClick={() => setActiveImageIndex(idx)}
                    className={`w-20 h-14 rounded-lg overflow-hidden shrink-0 border-2 transition cursor-pointer ${
                      activeImageIndex === idx ? 'border-emerald-600 ring-2 ring-emerald-500/20' : 'border-transparent opacity-70 hover:opacity-100'
                    }`}
                  >
                    <img src={img} alt="thumbnail" className="w-full h-full object-cover" />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* 2. Main Title, Price & Location */}
          <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4 pb-4 border-b border-slate-100">
            <div>
              <div className="flex items-center gap-1.5 text-xs text-slate-500 mb-1">
                <MapPin className="w-4 h-4 text-emerald-600 shrink-0" />
                <span className="font-semibold text-slate-800">
                  {item.location.area}, {item.location.city}, {item.location.state}, Nigeria
                </span>
              </div>
              <h1 className="text-xl sm:text-2xl font-bold text-slate-900 font-display">
                {item.title}
              </h1>
            </div>

            <div className="text-left sm:text-right shrink-0 bg-slate-50 sm:bg-transparent p-3 sm:p-0 rounded-xl">
              <span className="block text-xs text-slate-500 font-semibold uppercase">
                {item.property?.purpose === 'rent' ? 'Annual Rent' : item.property?.purpose === 'short_let' ? 'Nightly Rate' : 'Price'}
              </span>
              <span className="text-2xl sm:text-3xl font-extrabold text-slate-900 font-display">
                {formatFullNaira(item.price)}
              </span>
            </div>
          </div>

          {/* 3. Category-Specific Detailed Specifications Table */}
          {/* PROPERTY SPECS */}
          {item.property && (
            <div className="space-y-4">
              <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider font-display">
                Property Specifications
              </h3>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                {item.property.bedrooms !== undefined && (
                  <div className="p-3 bg-slate-50 rounded-xl border border-slate-100">
                    <span className="text-slate-400 text-xs block">Bedrooms</span>
                    <span className="text-sm font-bold text-slate-800">{item.property.bedrooms} En-suite</span>
                  </div>
                )}
                {item.property.bathrooms !== undefined && (
                  <div className="p-3 bg-slate-50 rounded-xl border border-slate-100">
                    <span className="text-slate-400 text-xs block">Bathrooms</span>
                    <span className="text-sm font-bold text-slate-800">{item.property.bathrooms} Bathrooms</span>
                  </div>
                )}
                {item.property.toilets !== undefined && (
                  <div className="p-3 bg-slate-50 rounded-xl border border-slate-100">
                    <span className="text-slate-400 text-xs block">Toilets</span>
                    <span className="text-sm font-bold text-slate-800">{item.property.toilets} Toilets</span>
                  </div>
                )}
                {item.property.parkingSpaces !== undefined && (
                  <div className="p-3 bg-slate-50 rounded-xl border border-slate-100">
                    <span className="text-slate-400 text-xs block">Parking</span>
                    <span className="text-sm font-bold text-slate-800">{item.property.parkingSpaces} Vehicles</span>
                  </div>
                )}
                {item.property.landSizeSqm !== undefined && (
                  <div className="p-3 bg-slate-50 rounded-xl border border-slate-100">
                    <span className="text-slate-400 text-xs block">Land Area</span>
                    <span className="text-sm font-bold text-slate-800">{item.property.landSizeSqm} sqm</span>
                  </div>
                )}
                <div className="p-3 bg-slate-50 rounded-xl border border-slate-100">
                  <span className="text-slate-400 text-xs block">Furnishing</span>
                  <span className="text-sm font-bold text-slate-800">{item.property.furnished ? 'Furnished' : 'Unfurnished'}</span>
                </div>
                <div className="p-3 bg-slate-50 rounded-xl border border-slate-100">
                  <span className="text-slate-400 text-xs block">Gated Estate</span>
                  <span className="text-sm font-bold text-slate-800">{item.property.gatedEstate ? 'Yes (24/7 Security)' : 'No'}</span>
                </div>
                <div className="p-3 bg-slate-50 rounded-xl border border-slate-100">
                  <span className="text-slate-400 text-xs block">Servicing</span>
                  <span className="text-sm font-bold text-slate-800">{item.property.serviced ? 'Fully Serviced' : 'Self Serviced'}</span>
                </div>
              </div>

              {/* Title Documents Checklist (Section 6) */}
              {item.property.titleDocuments && (
                <div className="p-4 bg-emerald-50/70 border border-emerald-200 rounded-xl">
                  <div className="flex items-center gap-2 mb-2">
                    <FileCheck className="w-4 h-4 text-emerald-700" />
                    <h4 className="text-xs font-bold text-emerald-950 uppercase tracking-wider">
                      Declared Property Documents
                    </h4>
                  </div>
                  <div className="flex flex-wrap gap-2 mb-3">
                    {item.property.titleDocuments.map((doc) => (
                      <span
                        key={doc}
                        className="px-3 py-1 rounded-lg text-xs font-bold bg-white text-emerald-800 border border-emerald-300 shadow-2xs"
                      >
                        ✓ {doc}
                      </span>
                    ))}
                  </div>
                  {/* Non-verification statutory disclaimer as required in Section 6 */}
                  <div className="flex items-start gap-1.5 text-[11px] text-emerald-900 bg-white/70 p-2 rounded-lg border border-emerald-200/60">
                    <AlertCircle className="w-3.5 h-3.5 text-emerald-700 shrink-0 mt-0.5" />
                    <span>
                      <strong>Notice:</strong> Declared document types are supplied by the listing agent/seller. Displaying a document does not constitute independent platform title verification until an official search at the Lagos/State Lands Bureau is conducted.
                    </span>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* CAR SPECS (Section 8) */}
          {item.vehicle && (
            <div className="space-y-4">
              <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider font-display">
                Vehicle Specifications Table
              </h3>
              <div className="border border-slate-200 rounded-xl overflow-hidden">
                <table className="w-full text-xs text-left">
                  <tbody>
                    <tr className="border-b border-slate-100 bg-slate-50/70">
                      <td className="py-2.5 px-4 font-semibold text-slate-500 w-1/3">Make / Brand</td>
                      <td className="py-2.5 px-4 font-bold text-slate-900">{item.vehicle.make}</td>
                    </tr>
                    <tr className="border-b border-slate-100">
                      <td className="py-2.5 px-4 font-semibold text-slate-500">Model</td>
                      <td className="py-2.5 px-4 font-bold text-slate-900">{item.vehicle.model}</td>
                    </tr>
                    <tr className="border-b border-slate-100 bg-slate-50/70">
                      <td className="py-2.5 px-4 font-semibold text-slate-500">Model Year</td>
                      <td className="py-2.5 px-4 font-bold text-slate-900">{item.vehicle.year}</td>
                    </tr>
                    <tr className="border-b border-slate-100">
                      <td className="py-2.5 px-4 font-semibold text-slate-500">Condition</td>
                      <td className="py-2.5 px-4 font-bold text-blue-700">{item.vehicle.condition}</td>
                    </tr>
                    <tr className="border-b border-slate-100 bg-slate-50/70">
                      <td className="py-2.5 px-4 font-semibold text-slate-500">Odometer / Mileage</td>
                      <td className="py-2.5 px-4 font-bold text-slate-900">{formatNumber(item.vehicle.mileageKm)} km</td>
                    </tr>
                    <tr className="border-b border-slate-100">
                      <td className="py-2.5 px-4 font-semibold text-slate-500">Transmission</td>
                      <td className="py-2.5 px-4 font-bold text-slate-900">{item.vehicle.transmission}</td>
                    </tr>
                    <tr className="border-b border-slate-100 bg-slate-50/70">
                      <td className="py-2.5 px-4 font-semibold text-slate-500">Fuel Type</td>
                      <td className="py-2.5 px-4 font-bold text-slate-900">{item.vehicle.fuelType}</td>
                    </tr>
                    <tr className="border-b border-slate-100">
                      <td className="py-2.5 px-4 font-semibold text-slate-500">Body Type</td>
                      <td className="py-2.5 px-4 font-bold text-slate-900">{item.vehicle.bodyType}</td>
                    </tr>
                    {item.vehicle.engineSize && (
                      <tr className="bg-slate-50/70">
                        <td className="py-2.5 px-4 font-semibold text-slate-500">Engine Size</td>
                        <td className="py-2.5 px-4 font-bold text-slate-900">{item.vehicle.engineSize}</td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* EQUIPMENT SPECS (Section 10 & 11) */}
          {item.equipment && (
            <div className="space-y-4">
              <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider font-display">
                Heavy Machinery & Rental Structure
              </h3>
              
              {/* Dual Rates Table */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                {item.equipment.dailyRate && (
                  <div className="p-3 bg-amber-50 rounded-xl border border-amber-200">
                    <span className="text-amber-800 text-xs block font-semibold">Daily Hire Rate</span>
                    <span className="text-base font-extrabold text-amber-950 font-display">
                      {formatFullNaira(item.equipment.dailyRate)} / day
                    </span>
                  </div>
                )}
                {item.equipment.weeklyRate && (
                  <div className="p-3 bg-amber-50 rounded-xl border border-amber-200">
                    <span className="text-amber-800 text-xs block font-semibold">Weekly Discount Rate</span>
                    <span className="text-base font-extrabold text-amber-950 font-display">
                      {formatFullNaira(item.equipment.weeklyRate)} / wk
                    </span>
                  </div>
                )}
                {item.equipment.monthlyRate && (
                  <div className="p-3 bg-amber-50 rounded-xl border border-amber-200">
                    <span className="text-amber-800 text-xs block font-semibold">Monthly Fleet Rate</span>
                    <span className="text-base font-extrabold text-amber-950 font-display">
                      {formatFullNaira(item.equipment.monthlyRate)} / mo
                    </span>
                  </div>
                )}
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
                <div className="p-3 bg-slate-50 rounded-xl border border-slate-100">
                  <span className="text-slate-400 block">Brand & Model</span>
                  <span className="font-bold text-slate-900">{item.equipment.brand} {item.equipment.model}</span>
                </div>
                <div className="p-3 bg-slate-50 rounded-xl border border-slate-100">
                  <span className="text-slate-400 block">Operating Hours</span>
                  <span className="font-bold text-slate-900">{formatNumber(item.equipment.operatingHours || 0)} hrs</span>
                </div>
                <div className="p-3 bg-slate-50 rounded-xl border border-slate-100">
                  <span className="text-slate-400 block">Operating Weight</span>
                  <span className="font-bold text-slate-900">{formatNumber(item.equipment.operatingWeightKg || 0)} kg</span>
                </div>
                <div className="p-3 bg-slate-50 rounded-xl border border-slate-100">
                  <span className="text-slate-400 block">Certified Operator</span>
                  <span className="font-bold text-emerald-700">{item.equipment.operatorIncluded ? 'Included' : 'Available on request'}</span>
                </div>
              </div>
            </div>
          )}

          {/* MATERIAL SPECS */}
          {item.material && (
            <div className="space-y-3">
              <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider font-display">
                Building Material Supply Terms
              </h3>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
                <div className="p-3 bg-slate-50 rounded-xl border border-slate-100">
                  <span className="text-slate-400 block">Category</span>
                  <span className="font-bold text-slate-900">{item.material.materialCategory}</span>
                </div>
                <div className="p-3 bg-slate-50 rounded-xl border border-slate-100">
                  <span className="text-slate-400 block">Unit Size</span>
                  <span className="font-bold text-slate-900">{item.material.unitOfMeasure}</span>
                </div>
                <div className="p-3 bg-slate-50 rounded-xl border border-slate-100">
                  <span className="text-slate-400 block">Min Wholesale Order</span>
                  <span className="font-bold text-slate-900">{item.material.minOrderQuantity} Units</span>
                </div>
                <div className="p-3 bg-slate-50 rounded-xl border border-slate-100">
                  <span className="text-slate-400 block">Bulk Discount</span>
                  <span className="font-bold text-emerald-700">{item.material.bulkDiscountAvailable ? 'Available' : 'Standard'}</span>
                </div>
              </div>
            </div>
          )}

          {/* SERVICE SPECS */}
          {item.service && (
            <div className="space-y-3">
              <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider font-display">
                Professional Accreditations & Experience
              </h3>
              <div className="flex flex-wrap gap-2">
                {item.service.certifications.map((c) => (
                  <span key={c} className="px-3 py-1 bg-slate-900 text-amber-300 text-xs font-bold rounded-lg flex items-center gap-1.5">
                    <Award className="w-3.5 h-3.5" />
                    {c}
                  </span>
                ))}
              </div>
              <div className="grid grid-cols-2 gap-3 text-xs pt-2">
                <div className="p-3 bg-slate-50 rounded-xl border border-slate-100">
                  <span className="text-slate-400 block">Years of Industry Practice</span>
                  <span className="font-bold text-slate-900">{item.service.experienceYears} Years</span>
                </div>
                <div className="p-3 bg-slate-50 rounded-xl border border-slate-100">
                  <span className="text-slate-400 block">Coverage Area</span>
                  <span className="font-bold text-slate-900">{item.service.serviceArea}</span>
                </div>
              </div>
            </div>
          )}

          {/* 4. Description */}
          <div>
            <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider font-display mb-2">
              Detailed Description
            </h3>
            <p className="text-xs sm:text-sm text-slate-700 leading-relaxed whitespace-pre-line bg-slate-50 p-4 rounded-xl border border-slate-100">
              {item.description}
            </p>
          </div>

          {/* 5. Seller / Dealer Profile Card */}
          <div className="p-4 rounded-2xl bg-slate-900 text-white flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <img
                src={item.seller.avatarUrl}
                alt={item.seller.name}
                className={`w-12 h-12 rounded-xl object-cover border-2 border-slate-700 ${onViewSellerProfile ? 'cursor-pointer hover:border-emerald-400 transition' : ''}`}
                onClick={() => onViewSellerProfile && onViewSellerProfile(item.seller)}
              />
              <div>
                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => onViewSellerProfile && onViewSellerProfile(item.seller)}
                    className="font-bold text-base hover:text-emerald-400 transition text-left cursor-pointer"
                  >
                    {item.seller.companyName || item.seller.name}
                  </button>
                  {item.seller.verifiedPhone && (
                    <span className="text-[10px] text-emerald-400 font-bold bg-emerald-950 px-2 py-0.5 rounded border border-emerald-800">
                      ✓ Phone Verified
                    </span>
                  )}
                </div>
                <span className="text-xs text-slate-400 block">
                  {item.seller.role} • {item.seller.totalListings} Active Listings in {item.seller.location}
                </span>
                {onViewSellerProfile && (
                  <button
                    type="button"
                    onClick={() => onViewSellerProfile(item.seller)}
                    className="text-[11px] text-emerald-400 hover:text-emerald-300 font-semibold underline mt-0.5 cursor-pointer"
                  >
                    View Merchant Storefront & Verified Reviews →
                  </button>
                )}
              </div>
            </div>

            {/* Buyer Inquiring Profile Info Bar */}
            <div className="p-3 bg-slate-800/90 rounded-xl border border-slate-700/80 flex flex-col sm:flex-row sm:items-center justify-between gap-2">
              <div className="flex items-center gap-2">
                <div className="w-6 h-6 rounded-md bg-emerald-500/20 text-emerald-400 flex items-center justify-center shrink-0">
                  <User className="w-3.5 h-3.5" />
                </div>
                <div className="text-xs">
                  <span className="text-[10px] text-slate-400 block font-semibold uppercase tracking-wider">Your Inquiry Profile:</span>
                  <span className="text-white font-bold">
                    {buyerContact.name || 'Anonymous Seeker'}
                  </span>
                  {buyerContact.phone && (
                    <span className="text-slate-300 ml-1.5 text-[11px]">
                      ({buyerContact.phone} • WA: {buyerContact.whatsapp || buyerContact.phone})
                    </span>
                  )}
                </div>
              </div>
              <button
                type="button"
                onClick={() => onInitiateContact && onInitiateContact(item, 'whatsapp')}
                className="text-emerald-400 hover:text-emerald-300 text-[11px] font-bold underline cursor-pointer self-start sm:self-auto"
              >
                {buyerContact.name ? 'Update Contact Info' : 'Set Name, Phone & WhatsApp'}
              </button>
            </div>

            <div className="flex flex-wrap sm:flex-nowrap items-center gap-2">
              <button
                type="button"
                onClick={() => {
                  if (onInitiateContact) {
                    onInitiateContact(item, 'call');
                  } else {
                    onTrackContact && onTrackContact('call');
                    window.location.href = `tel:${item.seller.phone}`;
                  }
                }}
                className="flex-1 sm:flex-initial py-2.5 px-4 bg-slate-800 hover:bg-slate-700 text-white rounded-xl text-xs font-bold flex items-center justify-center gap-1.5 transition cursor-pointer border border-slate-700 shadow-xs"
              >
                <Phone className="w-3.5 h-3.5 text-emerald-400" />
                <span>Call ({item.seller.phone})</span>
              </button>

              <button
                type="button"
                onClick={() => {
                  if (onInitiateContact) {
                    onInitiateContact(item, 'whatsapp');
                  } else {
                    onTrackContact && onTrackContact('whatsapp');
                    window.open(`https://wa.me/${item.seller.whatsapp.replace(/[^0-9]/g, '')}?text=Hello%20${encodeURIComponent(item.seller.name)},%20I%20am%20inquiring%20about%20${encodeURIComponent(item.title)}%20on%20StrucTrade%20NG.`, '_blank');
                  }
                }}
                className="flex-1 sm:flex-initial py-2.5 px-4 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl text-xs font-bold flex items-center justify-center gap-1.5 transition cursor-pointer shadow-xs"
              >
                <MessageSquare className="w-3.5 h-3.5" />
                <span>WhatsApp</span>
              </button>

              {onOpenChat && (
                <button
                  type="button"
                  onClick={() => {
                    onClose();
                    onOpenChat(item);
                  }}
                  className="w-full sm:w-auto py-2.5 px-3.5 bg-blue-600 hover:bg-blue-500 text-white rounded-xl text-xs font-bold flex items-center justify-center gap-1.5 transition cursor-pointer"
                >
                  <MessageSquare className="w-3.5 h-3.5" />
                  <span>Trade Chat</span>
                </button>
              )}
            </div>
          </div>

          {/* PRD Section 63: Trust & Safety Guidance Box */}
          <div className="p-4 rounded-xl bg-amber-50/70 border border-amber-200/80 space-y-2 text-xs">
            <div className="flex items-center gap-2 text-amber-900 font-bold">
              <AlertCircle className="w-4 h-4 text-amber-600 shrink-0" />
              <span>StrucTrade Trust & Commercial Safety Advisory (PRD Section 63)</span>
            </div>
            <p className="text-amber-900/80 leading-relaxed text-[11px]">
              Avoid sending advance inspection fees or upfront booking deposits before physical verification. For real estate, conduct an official root-of-title search at the State Lands Registry. For commercial vehicles and equipment, test operating condition with your mechanic before final bank settlement.
            </p>
            <div className="flex flex-wrap items-center gap-3 pt-1 border-t border-amber-200/60 text-[11px]">
              {onReviewSeller && (
                <button
                  type="button"
                  onClick={() => {
                    onClose();
                    onReviewSeller(item.seller);
                  }}
                  className="text-amber-900 hover:text-amber-950 font-bold flex items-center gap-1 cursor-pointer"
                >
                  <Star className="w-3 h-3 fill-amber-500 text-amber-500" />
                  <span>Rate / Review this Seller</span>
                </button>
              )}

              {onReportListing && (
                <button
                  type="button"
                  onClick={() => {
                    onClose();
                    onReportListing(item);
                  }}
                  className="text-rose-700 hover:text-rose-800 font-bold flex items-center gap-1 ml-auto cursor-pointer"
                >
                  <ShieldAlert className="w-3 h-3 text-rose-600" />
                  <span>Report Fraudulent Listing</span>
                </button>
              )}
            </div>
          </div>
        </div>

        {/* Sticky Action Footer */}
        <div className="p-3 sm:p-4 border-t border-slate-200 bg-white flex flex-col sm:flex-row sm:items-center justify-between gap-3 sticky bottom-0 z-10 shrink-0 pb-[max(0.75rem,env(safe-area-inset-bottom))]">
          <div className="flex items-center justify-between sm:justify-start gap-3">
            <div>
              <span className="block text-[10px] text-slate-400 font-medium">Reference</span>
              <span className="text-xs font-mono text-slate-700 font-bold">REF-{item.id.toUpperCase()}</span>
            </div>

            {onAddToCompare && (
              <button
                type="button"
                onClick={() => onAddToCompare(item)}
                className={`py-1.5 px-3 rounded-lg text-xs font-bold border transition flex items-center gap-1.5 cursor-pointer min-h-[36px] ${
                  isCompared
                    ? 'bg-emerald-50 text-emerald-800 border-emerald-300'
                    : 'bg-slate-50 hover:bg-slate-100 text-slate-700 border-slate-200'
                }`}
              >
                <Scale className="w-3.5 h-3.5 text-emerald-600" />
                <span>{isCompared ? 'In Compare List' : 'Compare'}</span>
              </button>
            )}
          </div>

          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2 w-full sm:w-auto">
            {item.property && (
              <button
                onClick={() => {
                  onClose();
                  onRequestViewing(item);
                }}
                className="w-full sm:w-auto py-2.5 px-5 bg-emerald-600 hover:bg-emerald-700 active:bg-emerald-800 text-white text-xs font-bold rounded-xl shadow-xs transition flex items-center justify-center gap-2 cursor-pointer min-h-[44px]"
              >
                <Calendar className="w-4 h-4" />
                <span>Request Property Viewing</span>
              </button>
            )}

            {item.equipment?.saleType !== 'sale' && item.equipment && (
              <button
                onClick={() => {
                  onClose();
                  onRequestRental(item);
                }}
                className="w-full sm:w-auto py-2.5 px-5 bg-amber-600 hover:bg-amber-700 active:bg-amber-800 text-white text-xs font-bold rounded-xl shadow-xs transition flex items-center justify-center gap-2 cursor-pointer min-h-[44px]"
              >
                <CalendarClock className="w-4 h-4" />
                <span>Request Equipment Rental</span>
              </button>
            )}

            <button
              type="button"
              onClick={() => {
                if (onInitiateContact) {
                  onInitiateContact(item, 'whatsapp');
                } else {
                  onTrackContact && onTrackContact('whatsapp');
                  window.open(`https://wa.me/${item.seller.whatsapp.replace(/[^0-9]/g, '')}?text=Hello%20${encodeURIComponent(item.seller.name)},%20I%20am%20ready%20to%20transact%20on%20${encodeURIComponent(item.title)}.`, '_blank');
                }
              }}
              className="w-full sm:w-auto py-2.5 px-4 bg-slate-900 hover:bg-slate-800 active:bg-slate-950 text-white text-xs font-bold rounded-xl transition flex items-center justify-center gap-1.5 cursor-pointer shadow-xs min-h-[44px]"
            >
              <MessageSquare className="w-4 h-4 text-emerald-400" />
              <span>Contact Seller (WhatsApp / Call)</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
