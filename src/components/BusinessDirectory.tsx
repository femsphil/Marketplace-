import React, { useState } from 'react';
import { Store, ShieldCheck, MapPin, Phone, MessageSquare, Star, ArrowRight, ExternalLink } from 'lucide-react';
import { BusinessStorefront, MarketplaceItem } from '../types';

interface BusinessDirectoryProps {
  businesses: BusinessStorefront[];
  items: MarketplaceItem[];
  onSelectBusinessFilter: (businessName: string) => void;
}

export const BusinessDirectory: React.FC<BusinessDirectoryProps> = ({
  businesses,
  items,
  onSelectBusinessFilter,
}) => {
  const [filterType, setFilterType] = useState<string>('all');

  const filteredBusinesses = businesses.filter((b) => {
    if (filterType === 'all') return true;
    return b.type.toLowerCase().includes(filterType.toLowerCase());
  });

  return (
    <div className="space-y-6">
      <div className="bg-slate-900 text-white rounded-2xl p-6 shadow-xs flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-xs font-semibold text-emerald-400 uppercase tracking-wider mb-1">
            <ShieldCheck className="w-4 h-4 text-emerald-400" />
            <span>Verified Corporate Storefronts</span>
          </div>
          <h2 className="text-xl sm:text-2xl font-bold font-display">
            Corporate Agencies, Dealerships & Fleet Partners
          </h2>
          <p className="text-xs sm:text-sm text-slate-300 mt-1 max-w-2xl">
            Browse authenticated Nigerian business storefronts with verified Corporate Affairs Commission (CAC) registrations and complete active inventories.
          </p>
        </div>

        <div className="flex items-center gap-1.5 bg-slate-800 p-1.5 rounded-xl border border-slate-700">
          {['all', 'Real Estate', 'Dealership', 'Equipment', 'Construction'].map((t) => (
            <button
              key={t}
              onClick={() => setFilterType(t)}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition cursor-pointer ${
                filterType === t ? 'bg-emerald-600 text-white' : 'text-slate-300 hover:text-white'
              }`}
            >
              {t === 'all' ? 'All Businesses' : t}
            </button>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {filteredBusinesses.map((biz) => {
          return (
            <div
              key={biz.id}
              className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-xs hover:shadow-md transition flex flex-col justify-between"
            >
              <div>
                {/* Cover & Logo banner */}
                <div className="relative h-32 bg-slate-100 overflow-hidden">
                  <img
                    src={biz.coverImage}
                    alt={biz.name}
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                  <div className="absolute top-3 right-3 bg-emerald-600 text-white text-[10px] font-bold px-2 py-0.5 rounded-md flex items-center gap-1">
                    <ShieldCheck className="w-3 h-3" />
                    <span>{biz.cacNumber || 'CAC Verified'}</span>
                  </div>
                </div>

                <div className="px-5 pt-0 pb-4 relative">
                  {/* Overlapping Logo */}
                  <div className="-mt-9 mb-3 flex items-end justify-between">
                    <img
                      src={biz.logo}
                      alt={biz.name}
                      className="w-16 h-16 rounded-2xl object-cover border-4 border-white shadow-md"
                    />
                    <span className="text-xs font-bold text-slate-700 bg-slate-100 px-2.5 py-1 rounded-full">
                      {biz.totalInventory} Active Assets
                    </span>
                  </div>

                  <h3 className="font-extrabold text-slate-900 text-lg font-display">
                    {biz.name}
                  </h3>
                  <div className="flex items-center gap-2 text-xs text-slate-500 mb-2">
                    <span className="font-semibold text-emerald-700">{biz.type}</span>
                    <span>•</span>
                    <span className="flex items-center text-amber-500 font-bold">
                      <Star className="w-3.5 h-3.5 fill-amber-500 text-amber-500 mr-0.5" />
                      {biz.rating} ({biz.reviewsCount})
                    </span>
                  </div>

                  <p className="text-xs text-slate-600 line-clamp-2 mb-3">
                    {biz.description}
                  </p>

                  <div className="flex items-center gap-1.5 text-xs text-slate-500 mb-4">
                    <MapPin className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                    <span className="truncate">{biz.address}</span>
                  </div>
                </div>
              </div>

              <div className="px-5 pb-5 pt-3 border-t border-slate-100 grid grid-cols-2 gap-2">
                <a
                  href={`https://wa.me/${biz.whatsapp.replace(/[^0-9]/g, '')}?text=Hello%20${encodeURIComponent(biz.name)},%20I%20contacted%20your%20storefront%20via%20StrucTrade%20NG.`}
                  target="_blank"
                  rel="noreferrer"
                  className="flex items-center justify-center gap-1.5 py-2 px-3 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-semibold transition"
                >
                  <MessageSquare className="w-3.5 h-3.5" />
                  <span>WhatsApp Business</span>
                </a>

                <button
                  onClick={() => onSelectBusinessFilter(biz.name)}
                  className="flex items-center justify-center gap-1.5 py-2 px-3 rounded-lg bg-slate-900 hover:bg-slate-800 text-white text-xs font-semibold transition cursor-pointer"
                >
                  <span>View Inventory</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
