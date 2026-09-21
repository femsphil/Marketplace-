import React from 'react';
import { 
  Building2, 
  Car, 
  Wrench, 
  Hammer, 
  ArrowRight, 
  ShieldCheck, 
  MapPin, 
  Bed, 
  Bath, 
  Maximize2, 
  Gauge, 
  CalendarClock, 
  CheckCircle2, 
  Phone, 
  MessageSquare,
  Sparkles,
  Store
} from 'lucide-react';
import { MarketplaceItem, MarketplaceVertical } from '../types';
import { formatFullNaira, formatNumber, formatWhatsAppUrl, FALLBACK_IMAGE } from '../lib/formatters';

interface AllMarketplacesHubProps {
  items: MarketplaceItem[];
  onSelectItem: (item: MarketplaceItem) => void;
  onRequestViewing: (item: MarketplaceItem) => void;
  onRequestRental: (item: MarketplaceItem) => void;
  onSelectVertical: (vertical: MarketplaceVertical) => void;
  selectedState: string;
  searchQuery: string;
  onClearSearch: () => void;
}

export const AllMarketplacesHub: React.FC<AllMarketplacesHubProps> = ({
  items,
  onSelectItem,
  onRequestViewing,
  onRequestRental,
  onSelectVertical,
  selectedState,
  searchQuery,
  onClearSearch,
}) => {
  const propertyItems = items.filter((i) => i.vertical === 'property');
  const carItems = items.filter((i) => i.vertical === 'cars');
  const equipmentItems = items.filter((i) => i.vertical === 'equipment');
  const constructionItems = items.filter((i) => i.vertical === 'construction');

  const hasAnyItems = items.length > 0;

  return (
    <div className="space-y-10">
      {/* 1. Category Switcher Strip for Mobile & Desktop */}
      <div className="bg-white rounded-2xl p-4 sm:p-5 border border-slate-200 shadow-xs">
        <div className="flex items-center justify-between mb-3">
          <span className="text-xs font-bold uppercase tracking-wider text-slate-500">
            Marketplace Verticals ({selectedState})
          </span>
          <span className="text-xs font-semibold text-emerald-700 bg-emerald-50 px-2.5 py-0.5 rounded-full">
            {items.length} Total Verified Assets
          </span>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 sm:gap-3">
          <button
            onClick={() => onSelectVertical('property')}
            className="p-3 rounded-xl bg-emerald-50/70 hover:bg-emerald-100 border border-emerald-200/80 text-left transition flex items-center justify-between group cursor-pointer"
          >
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-lg bg-emerald-600 text-white flex items-center justify-center shrink-0">
                <Building2 className="w-4 h-4" />
              </div>
              <div>
                <h4 className="font-bold text-emerald-950 text-xs sm:text-sm">Properties</h4>
                <span className="text-[10px] text-emerald-700 font-semibold">{propertyItems.length} Listings</span>
              </div>
            </div>
            <ArrowRight className="w-3.5 h-3.5 text-emerald-600 group-hover:translate-x-0.5 transition" />
          </button>

          <button
            onClick={() => onSelectVertical('cars')}
            className="p-3 rounded-xl bg-blue-50/70 hover:bg-blue-100 border border-blue-200/80 text-left transition flex items-center justify-between group cursor-pointer"
          >
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-lg bg-blue-600 text-white flex items-center justify-center shrink-0">
                <Car className="w-4 h-4" />
              </div>
              <div>
                <h4 className="font-bold text-blue-950 text-xs sm:text-sm">Vehicles</h4>
                <span className="text-[10px] text-blue-700 font-semibold">{carItems.length} Cars & Trucks</span>
              </div>
            </div>
            <ArrowRight className="w-3.5 h-3.5 text-blue-600 group-hover:translate-x-0.5 transition" />
          </button>

          <button
            onClick={() => onSelectVertical('equipment')}
            className="p-3 rounded-xl bg-amber-50/70 hover:bg-amber-100 border border-amber-200/80 text-left transition flex items-center justify-between group cursor-pointer"
          >
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-lg bg-amber-600 text-white flex items-center justify-center shrink-0">
                <Wrench className="w-4 h-4" />
              </div>
              <div>
                <h4 className="font-bold text-amber-950 text-xs sm:text-sm">Heavy Plant</h4>
                <span className="text-[10px] text-amber-800 font-semibold">{equipmentItems.length} Machines</span>
              </div>
            </div>
            <ArrowRight className="w-3.5 h-3.5 text-amber-600 group-hover:translate-x-0.5 transition" />
          </button>

          <button
            onClick={() => onSelectVertical('construction')}
            className="p-3 rounded-xl bg-orange-50/70 hover:bg-orange-100 border border-orange-200/80 text-left transition flex items-center justify-between group cursor-pointer"
          >
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-lg bg-orange-600 text-white flex items-center justify-center shrink-0">
                <Hammer className="w-4 h-4" />
              </div>
              <div>
                <h4 className="font-bold text-orange-950 text-xs sm:text-sm">Materials</h4>
                <span className="text-[10px] text-orange-800 font-semibold">{constructionItems.length} Suppliers</span>
              </div>
            </div>
            <ArrowRight className="w-3.5 h-3.5 text-orange-600 group-hover:translate-x-0.5 transition" />
          </button>
        </div>
      </div>

      {/* If Search Active */}
      {searchQuery.trim() && (
        <div className="bg-emerald-50 border border-emerald-200 p-4 rounded-xl flex items-center justify-between text-xs sm:text-sm">
          <div className="flex items-center gap-2 text-emerald-900 font-medium">
            <Sparkles className="w-4 h-4 text-emerald-600 shrink-0" />
            <span>Showing results matching &ldquo;<strong>{searchQuery}</strong>&rdquo; across all categories</span>
          </div>
          <button
            onClick={onClearSearch}
            className="text-xs font-bold text-emerald-700 hover:text-emerald-900 underline cursor-pointer"
          >
            Clear Search
          </button>
        </div>
      )}

      {!hasAnyItems && (
        <div className="text-center py-16 bg-white rounded-2xl border border-slate-200 p-8">
          <div className="w-16 h-16 rounded-full bg-slate-100 text-slate-400 flex items-center justify-center mx-auto mb-4">
            <Building2 className="w-8 h-8" />
          </div>
          <h3 className="text-lg font-bold text-slate-900 font-display mb-1">
            No items found matching &ldquo;{searchQuery}&rdquo;
          </h3>
          <p className="text-xs text-slate-500 max-w-md mx-auto mb-4">
            Try adjusting your search terms or clearing your current filter to browse available inventory across Nigeria.
          </p>
          <button
            onClick={onClearSearch}
            className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold transition cursor-pointer"
          >
            Show All Listings
          </button>
        </div>
      )}

      {/* SECTION 1: REAL ESTATE & PROPERTIES */}
      {propertyItems.length > 0 && (
        <section className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-emerald-100 text-emerald-700 flex items-center justify-center">
                <Building2 className="w-4 h-4" />
              </div>
              <div>
                <h3 className="text-lg font-extrabold text-slate-900 font-display">
                  Featured Properties & Real Estate
                </h3>
                <p className="text-xs text-slate-500">
                  Residential Duplexes, Luxury Apartments & Serviced Estates
                </p>
              </div>
            </div>
            <button
              onClick={() => onSelectVertical('property')}
              className="flex items-center gap-1 text-xs font-bold text-emerald-700 hover:text-emerald-800 transition cursor-pointer p-1"
            >
              <span>View All ({propertyItems.length})</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {propertyItems.slice(0, 3).map((item) => {
              const prop = item.property!;
              return (
                <div
                  key={item.id}
                  className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-xs hover:shadow-md transition flex flex-col justify-between group"
                >
                  <div 
                    onClick={() => onSelectItem(item)}
                    className="relative aspect-16/10 overflow-hidden cursor-pointer bg-slate-100"
                  >
                    <img
                      src={item.images[0] || FALLBACK_IMAGE}
                      alt={item.title}
                      onError={(e) => { e.currentTarget.src = FALLBACK_IMAGE; }}
                      className="w-full h-full object-cover group-hover:scale-105 transition duration-300"
                    />
                    <div className="absolute top-3 left-3 flex flex-wrap gap-1.5">
                      <span className="px-2.5 py-1 rounded-md text-[11px] font-bold uppercase tracking-wider bg-slate-900/90 text-white backdrop-blur-xs">
                        {prop?.purpose === 'buy' ? 'For Sale' : prop?.purpose === 'rent' ? 'For Rent' : 'Short-let'}
                      </span>
                      {prop?.newlyBuilt && (
                        <span className="px-2 py-0.5 rounded-md text-[10px] font-semibold bg-emerald-600 text-white">
                          Newly Built
                        </span>
                      )}
                    </div>
                    <div className="absolute bottom-3 right-3 bg-white/95 backdrop-blur-xs px-2.5 py-1 rounded-lg shadow-sm">
                      <span className="text-sm font-extrabold text-slate-900 font-display">
                        {formatFullNaira(item.price)}
                      </span>
                    </div>
                  </div>

                  <div className="p-4 flex-1 flex flex-col justify-between">
                    <div>
                      <div className="flex items-center gap-1.5 text-xs text-slate-500 mb-1">
                        <MapPin className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                        <span className="font-medium text-slate-700 truncate">{item.location.area}, {item.location.state}</span>
                      </div>
                      <h4
                        onClick={() => onSelectItem(item)}
                        className="font-bold text-slate-900 text-sm line-clamp-1 hover:text-emerald-700 transition cursor-pointer mb-2"
                      >
                        {item.title}
                      </h4>
                      {prop && (
                        <div className="flex items-center gap-3 text-xs text-slate-600 mb-3">
                          {prop.bedrooms !== undefined && (
                            <span className="flex items-center gap-1"><Bed className="w-3.5 h-3.5 text-slate-400" /> {prop.bedrooms} Beds</span>
                          )}
                          {prop.bathrooms !== undefined && (
                            <span className="flex items-center gap-1"><Bath className="w-3.5 h-3.5 text-slate-400" /> {prop.bathrooms} Baths</span>
                          )}
                          {prop.landSizeSqm !== undefined && (
                            <span className="flex items-center gap-1"><Maximize2 className="w-3.5 h-3.5 text-slate-400" /> {prop.landSizeSqm} sqm</span>
                          )}
                        </div>
                      )}
                    </div>

                    <div className="grid grid-cols-2 gap-2 pt-2 border-t border-slate-100">
                      <button
                        onClick={() => onRequestViewing(item)}
                        className="flex items-center justify-center gap-1 py-2 px-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-semibold transition cursor-pointer min-h-[40px]"
                      >
                        <span>Schedule Viewing</span>
                      </button>
                      <button
                        onClick={() => onSelectItem(item)}
                        className="flex items-center justify-center gap-1 py-2 px-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-800 text-xs font-semibold transition cursor-pointer min-h-[40px]"
                      >
                        <span>Inspect</span>
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </section>
      )}

      {/* SECTION 2: CARS & COMMERCIAL VEHICLES */}
      {carItems.length > 0 && (
        <section className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-blue-100 text-blue-700 flex items-center justify-center">
                <Car className="w-4 h-4" />
              </div>
              <div>
                <h3 className="text-lg font-extrabold text-slate-900 font-display">
                  Tokunbo & Verified Vehicles
                </h3>
                <p className="text-xs text-slate-500">
                  Direct Foreign Used, SUVs, Site Trucks & Work Pickups
                </p>
              </div>
            </div>
            <button
              onClick={() => onSelectVertical('cars')}
              className="flex items-center gap-1 text-xs font-bold text-blue-700 hover:text-blue-800 transition cursor-pointer p-1"
            >
              <span>View All ({carItems.length})</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {carItems.slice(0, 3).map((item) => {
              const car = item.vehicle!;
              return (
                <div
                  key={item.id}
                  className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-xs hover:shadow-md transition flex flex-col justify-between group"
                >
                  <div 
                    onClick={() => onSelectItem(item)}
                    className="relative aspect-16/10 overflow-hidden cursor-pointer bg-slate-100"
                  >
                    <img
                      src={item.images[0] || FALLBACK_IMAGE}
                      alt={item.title}
                      onError={(e) => { e.currentTarget.src = FALLBACK_IMAGE; }}
                      className="w-full h-full object-cover group-hover:scale-105 transition duration-300"
                    />
                    <div className="absolute top-3 left-3">
                      <span className="px-2.5 py-1 rounded-md text-[11px] font-bold uppercase tracking-wider bg-blue-900/90 text-white backdrop-blur-xs">
                        {car?.condition || 'Foreign Used'}
                      </span>
                    </div>
                    <div className="absolute bottom-3 right-3 bg-white/95 backdrop-blur-xs px-2.5 py-1 rounded-lg shadow-sm">
                      <span className="text-sm font-extrabold text-slate-900 font-display">
                        {formatFullNaira(item.price)}
                      </span>
                    </div>
                  </div>

                  <div className="p-4 flex-1 flex flex-col justify-between">
                    <div>
                      <div className="flex items-center gap-1.5 text-xs text-slate-500 mb-1">
                        <MapPin className="w-3.5 h-3.5 text-blue-600 shrink-0" />
                        <span className="font-medium text-slate-700 truncate">{item.location.area}, {item.location.state}</span>
                      </div>
                      <h4
                        onClick={() => onSelectItem(item)}
                        className="font-bold text-slate-900 text-sm line-clamp-1 hover:text-blue-700 transition cursor-pointer mb-2"
                      >
                        {item.title}
                      </h4>
                      {car && (
                        <div className="flex items-center gap-3 text-xs text-slate-600 mb-3">
                          <span className="flex items-center gap-1"><Gauge className="w-3.5 h-3.5 text-slate-400" /> {formatNumber(car.mileageKm)} km</span>
                          <span>•</span>
                          <span>{car.year}</span>
                          <span>•</span>
                          <span>{car.transmission}</span>
                        </div>
                      )}
                    </div>

                    <div className="grid grid-cols-2 gap-2 pt-2 border-t border-slate-100">
                      <a
                        href={formatWhatsAppUrl(item.seller.whatsapp || item.seller.phone, `Hello ${item.seller.name}, I want to inquire about ${item.title} on StrucTrade NG.`)}
                        target="_blank"
                        rel="noreferrer"
                        className="flex items-center justify-center gap-1 py-2 px-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-semibold transition min-h-[40px]"
                      >
                        <MessageSquare className="w-3.5 h-3.5 shrink-0" />
                        <span>WhatsApp</span>
                      </a>
                      <button
                        onClick={() => onSelectItem(item)}
                        className="flex items-center justify-center gap-1 py-2 px-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold transition cursor-pointer min-h-[40px]"
                      >
                        <span>Inspect</span>
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </section>
      )}

      {/* SECTION 3: HEAVY EQUIPMENT & PLANT HIRE */}
      {equipmentItems.length > 0 && (
        <section className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-amber-100 text-amber-800 flex items-center justify-center">
                <Wrench className="w-4 h-4" />
              </div>
              <div>
                <h3 className="text-lg font-extrabold text-slate-900 font-display">
                  Heavy Equipment & Fleet Mobilization
                </h3>
                <p className="text-xs text-slate-500">
                  Excavators, Bulldozers, Cranes & Industrial Generators with Operators
                </p>
              </div>
            </div>
            <button
              onClick={() => onSelectVertical('equipment')}
              className="flex items-center gap-1 text-xs font-bold text-amber-800 hover:text-amber-900 transition cursor-pointer p-1"
            >
              <span>View All ({equipmentItems.length})</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {equipmentItems.slice(0, 3).map((item) => {
              const eq = item.equipment!;
              return (
                <div
                  key={item.id}
                  className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-xs hover:shadow-md transition flex flex-col justify-between group"
                >
                  <div 
                    onClick={() => onSelectItem(item)}
                    className="relative aspect-16/10 overflow-hidden cursor-pointer bg-slate-100"
                  >
                    <img
                      src={item.images[0] || FALLBACK_IMAGE}
                      alt={item.title}
                      onError={(e) => { e.currentTarget.src = FALLBACK_IMAGE; }}
                      className="w-full h-full object-cover group-hover:scale-105 transition duration-300"
                    />
                    <div className="absolute top-3 left-3">
                      <span className="px-2.5 py-1 rounded-md text-[11px] font-bold uppercase tracking-wider bg-amber-950/90 text-amber-300 backdrop-blur-xs">
                        {eq?.dailyRate ? `₦${(eq.dailyRate / 1000).toLocaleString()}k / day` : 'Outright Sale'}
                      </span>
                    </div>
                    <div className="absolute bottom-3 right-3 bg-white/95 backdrop-blur-xs px-2.5 py-1 rounded-lg shadow-sm">
                      <span className="text-sm font-extrabold text-slate-900 font-display">
                        {formatFullNaira(item.price)}
                      </span>
                    </div>
                  </div>

                  <div className="p-4 flex-1 flex flex-col justify-between">
                    <div>
                      <div className="flex items-center gap-1.5 text-xs text-slate-500 mb-1">
                        <MapPin className="w-3.5 h-3.5 text-amber-600 shrink-0" />
                        <span className="font-medium text-slate-700 truncate">{item.location.area}, {item.location.state}</span>
                      </div>
                      <h4
                        onClick={() => onSelectItem(item)}
                        className="font-bold text-slate-900 text-sm line-clamp-1 hover:text-amber-800 transition cursor-pointer mb-2"
                      >
                        {item.title}
                      </h4>
                      {eq && (
                        <div className="flex items-center gap-2 text-xs text-slate-600 mb-3">
                          <span className="px-2 py-0.5 rounded bg-slate-100 font-medium">{eq.brand}</span>
                          <span className="px-2 py-0.5 rounded bg-slate-100 font-medium">{eq.equipmentType}</span>
                          {eq.operatorIncluded && (
                            <span className="px-2 py-0.5 rounded bg-emerald-50 text-emerald-800 font-semibold">Operator Included</span>
                          )}
                        </div>
                      )}
                    </div>

                    <div className="grid grid-cols-2 gap-2 pt-2 border-t border-slate-100">
                      {eq?.dailyRate ? (
                        <button
                          onClick={() => onRequestRental(item)}
                          className="flex items-center justify-center gap-1 py-2 px-2.5 rounded-xl bg-amber-600 hover:bg-amber-700 text-white text-xs font-semibold transition cursor-pointer min-h-[40px]"
                        >
                          <CalendarClock className="w-3.5 h-3.5 shrink-0" />
                          <span>Request Rental</span>
                        </button>
                      ) : (
                        <button
                          onClick={() => onSelectItem(item)}
                          className="flex items-center justify-center gap-1 py-2 px-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-white text-xs font-semibold transition cursor-pointer min-h-[40px]"
                        >
                          <span>Buy Machine</span>
                        </button>
                      )}
                      <button
                        onClick={() => onSelectItem(item)}
                        className="flex items-center justify-center gap-1 py-2 px-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-800 text-xs font-semibold transition cursor-pointer min-h-[40px]"
                      >
                        <span>Specifications</span>
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </section>
      )}

      {/* SECTION 4: BUILDING MATERIALS & CONTRACTORS */}
      {constructionItems.length > 0 && (
        <section className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-orange-100 text-orange-700 flex items-center justify-center">
                <Hammer className="w-4 h-4" />
              </div>
              <div>
                <h3 className="text-lg font-extrabold text-slate-900 font-display">
                  Construction Materials & Certified Professionals
                </h3>
                <p className="text-xs text-slate-500">
                  Wholesale Cement, Rebar, Roofing & COREN-Accredited Civil Engineers
                </p>
              </div>
            </div>
            <button
              onClick={() => onSelectVertical('construction')}
              className="flex items-center gap-1 text-xs font-bold text-orange-700 hover:text-orange-800 transition cursor-pointer p-1"
            >
              <span>View All ({constructionItems.length})</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {constructionItems.slice(0, 3).map((item) => {
              return (
                <div
                  key={item.id}
                  className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-xs hover:shadow-md transition flex flex-col justify-between group"
                >
                  <div 
                    onClick={() => onSelectItem(item)}
                    className="relative aspect-16/10 overflow-hidden cursor-pointer bg-slate-100"
                  >
                    <img
                      src={item.images[0] || FALLBACK_IMAGE}
                      alt={item.title}
                      onError={(e) => { e.currentTarget.src = FALLBACK_IMAGE; }}
                      className="w-full h-full object-cover group-hover:scale-105 transition duration-300"
                    />
                    <div className="absolute top-3 left-3">
                      <span className="px-2.5 py-1 rounded-md text-[11px] font-bold uppercase tracking-wider bg-orange-900/90 text-white backdrop-blur-xs">
                        {item.material ? item.material.materialCategory : item.service ? 'Consultancy' : 'Supply'}
                      </span>
                    </div>
                    <div className="absolute bottom-3 right-3 bg-white/95 backdrop-blur-xs px-2.5 py-1 rounded-lg shadow-sm">
                      <span className="text-sm font-extrabold text-slate-900 font-display">
                        {formatFullNaira(item.price)}
                      </span>
                    </div>
                  </div>

                  <div className="p-4 flex-1 flex flex-col justify-between">
                    <div>
                      <div className="flex items-center gap-1.5 text-xs text-slate-500 mb-1">
                        <MapPin className="w-3.5 h-3.5 text-orange-600 shrink-0" />
                        <span className="font-medium text-slate-700 truncate">{item.location.area}, {item.location.state}</span>
                      </div>
                      <h4
                        onClick={() => onSelectItem(item)}
                        className="font-bold text-slate-900 text-sm line-clamp-1 hover:text-orange-700 transition cursor-pointer mb-2"
                      >
                        {item.title}
                      </h4>
                      <p className="text-xs text-slate-500 line-clamp-2 mb-3">
                        {item.description}
                      </p>
                    </div>

                    <div className="grid grid-cols-2 gap-2 pt-2 border-t border-slate-100">
                      <a
                        href={formatWhatsAppUrl(item.seller.whatsapp || item.seller.phone, `Hello ${item.seller.name}, I want to inquire about ${item.title} on StrucTrade NG.`)}
                        target="_blank"
                        rel="noreferrer"
                        className="flex items-center justify-center gap-1 py-2 px-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-semibold transition min-h-[40px]"
                      >
                        <MessageSquare className="w-3.5 h-3.5 shrink-0" />
                        <span>Inquire</span>
                      </a>
                      <button
                        onClick={() => onSelectItem(item)}
                        className="flex items-center justify-center gap-1 py-2 px-2.5 rounded-xl bg-orange-600 hover:bg-orange-700 text-white text-xs font-semibold transition cursor-pointer min-h-[40px]"
                      >
                        <span>Details</span>
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </section>
      )}
    </div>
  );
};
