import React, { useState, useMemo } from 'react';
import { 
  Building2, 
  MapPin, 
  Bed, 
  Bath, 
  Car, 
  Maximize2, 
  ShieldCheck, 
  Filter, 
  Calendar, 
  Phone, 
  MessageSquare,
  Sparkles,
  FileCheck
} from 'lucide-react';
import { MarketplaceItem, PropertyPurpose, PropertyType, TitleDocumentType } from '../types';
import { formatFullNaira } from '../lib/formatters';

interface PropertyMarketplaceProps {
  items: MarketplaceItem[];
  onSelectItem: (item: MarketplaceItem) => void;
  onRequestViewing: (item: MarketplaceItem) => void;
  selectedState: string;
}

export const PropertyMarketplace: React.FC<PropertyMarketplaceProps> = ({
  items,
  onSelectItem,
  onRequestViewing,
  selectedState,
}) => {
  const [selectedPurpose, setSelectedPurpose] = useState<PropertyPurpose | 'all'>('all');
  const [selectedType, setSelectedType] = useState<string>('all');
  const [maxPrice, setMaxPrice] = useState<number>(500000000);
  const [minBedrooms, setMinBedrooms] = useState<number>(0);
  const [selectedDocFilter, setSelectedDocFilter] = useState<string>('all');
  const [filterServiced, setFilterServiced] = useState<boolean>(false);
  const [filterGated, setFilterGated] = useState<boolean>(false);
  const [showMobileFilters, setShowMobileFilters] = useState<boolean>(false);

  const propertyItems = useMemo(() => {
    return items.filter((item) => {
      if (item.vertical !== 'property' || !item.property) return false;
      if (selectedPurpose !== 'all' && item.property.purpose !== selectedPurpose) return false;
      if (selectedType !== 'all' && item.property.propertyType !== selectedType) return false;
      if (item.price > maxPrice) return false;
      if (minBedrooms > 0 && (item.property.bedrooms || 0) < minBedrooms) return false;
      if (selectedDocFilter !== 'all' && !item.property.titleDocuments.includes(selectedDocFilter as TitleDocumentType)) return false;
      if (filterServiced && !item.property.serviced) return false;
      if (filterGated && !item.property.gatedEstate) return false;
      return true;
    });
  }, [items, selectedPurpose, selectedType, maxPrice, minBedrooms, selectedDocFilter, filterServiced, filterGated]);

  return (
    <div className="space-y-6">
      {/* Property Sub-navigation (Buy / Rent / Short-let) */}
      <div className="bg-white rounded-2xl p-3 sm:p-4 border border-slate-200 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-3 sm:gap-4">
        <div className="flex items-center gap-1.5 sm:gap-2 overflow-x-auto pb-1 sm:pb-0 scrollbar-none" style={{ WebkitOverflowScrolling: 'touch' }}>
          <button
            onClick={() => setSelectedPurpose('all')}
            className={`px-3 sm:px-4 py-2 rounded-xl text-xs sm:text-sm font-semibold transition whitespace-nowrap cursor-pointer ${
              selectedPurpose === 'all'
                ? 'bg-emerald-600 text-white shadow-xs'
                : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
            }`}
          >
            All Properties
          </button>
          <button
            onClick={() => setSelectedPurpose('buy')}
            className={`px-3 sm:px-4 py-2 rounded-xl text-xs sm:text-sm font-semibold transition whitespace-nowrap cursor-pointer ${
              selectedPurpose === 'buy'
                ? 'bg-emerald-600 text-white shadow-xs'
                : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
            }`}
          >
            Buy (Houses & Land)
          </button>
          <button
            onClick={() => setSelectedPurpose('rent')}
            className={`px-3 sm:px-4 py-2 rounded-xl text-xs sm:text-sm font-semibold transition whitespace-nowrap cursor-pointer ${
              selectedPurpose === 'rent'
                ? 'bg-emerald-600 text-white shadow-xs'
                : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
            }`}
          >
            Rent (Flats & Offices)
          </button>
          <button
            onClick={() => setSelectedPurpose('short_let')}
            className={`px-3 sm:px-4 py-2 rounded-xl text-xs sm:text-sm font-semibold transition whitespace-nowrap cursor-pointer ${
              selectedPurpose === 'short_let'
                ? 'bg-emerald-600 text-white shadow-xs'
                : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
            }`}
          >
            Short-let Holiday Homes
          </button>
        </div>

        <div className="flex items-center justify-between text-xs text-slate-500 font-medium">
          <span>Showing <strong className="text-slate-900">{propertyItems.length}</strong> properties in {selectedState}</span>
          <button
            type="button"
            onClick={() => setShowMobileFilters(!showMobileFilters)}
            className="sm:hidden flex items-center gap-1.5 px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-800 rounded-lg text-xs font-bold transition ml-2 shrink-0 min-h-[36px]"
          >
            <Filter className="w-3.5 h-3.5 text-emerald-600" />
            <span>{showMobileFilters ? 'Hide Filters' : 'Refine Specs'}</span>
          </button>
        </div>
      </div>

      {/* Property Filters Bar (Collapsible on mobile) */}
      <div className={`bg-slate-100/80 rounded-2xl p-3.5 sm:p-4 border border-slate-200 text-xs sm:text-sm space-y-3 ${showMobileFilters ? 'block animate-in fade-in' : 'hidden sm:block'}`}>
        <div className="flex items-center justify-between font-bold text-slate-800 uppercase text-xs tracking-wider">
          <div className="flex items-center gap-2">
            <Filter className="w-4 h-4 text-emerald-600" />
            <span>Refine Property Specifications</span>
          </div>
          <button
            type="button"
            onClick={() => setShowMobileFilters(false)}
            className="sm:hidden text-[11px] text-slate-500 hover:text-slate-800 font-semibold"
          >
            Done
          </button>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
          {/* Property Type */}
          <div>
            <label className="block text-[11px] font-semibold text-slate-500 mb-1">Type</label>
            <select
              value={selectedType}
              onChange={(e) => setSelectedType(e.target.value)}
              className="w-full p-2 rounded-lg bg-white border border-slate-200 text-slate-800 text-base sm:text-xs font-medium outline-none min-h-[40px] sm:min-h-auto"
            >
              <option value="all">All Types</option>
              <option value="detached_house">Detached Duplex</option>
              <option value="apartment">Apartment / Flat</option>
              <option value="land">Land & Plots</option>
              <option value="office">Commercial Office</option>
              <option value="warehouse">Warehouse</option>
            </select>
          </div>

          {/* Min Bedrooms */}
          <div>
            <label className="block text-[11px] font-semibold text-slate-500 mb-1">Bedrooms</label>
            <select
              value={minBedrooms}
              onChange={(e) => setMinBedrooms(Number(e.target.value))}
              className="w-full p-2 rounded-lg bg-white border border-slate-200 text-slate-800 text-base sm:text-xs font-medium outline-none min-h-[40px] sm:min-h-auto"
            >
              <option value={0}>Any Bedrooms</option>
              <option value={1}>1+ Bedrooms</option>
              <option value={2}>2+ Bedrooms</option>
              <option value={3}>3+ Bedrooms</option>
              <option value={4}>4+ Bedrooms</option>
              <option value={5}>5+ Bedrooms</option>
            </select>
          </div>

          {/* Title Document Filter */}
          <div>
            <label className="block text-[11px] font-semibold text-slate-500 mb-1">Title Document</label>
            <select
              value={selectedDocFilter}
              onChange={(e) => setSelectedDocFilter(e.target.value)}
              className="w-full p-2 rounded-lg bg-white border border-slate-200 text-slate-800 text-base sm:text-xs font-medium outline-none min-h-[40px] sm:min-h-auto"
            >
              <option value="all">Any Document</option>
              <option value="C of O">Certificate of Occupancy (C of O)</option>
              <option value="Governor's Consent">Governor's Consent</option>
              <option value="Deed of Assignment">Deed of Assignment</option>
              <option value="Survey Plan">Registered Survey Plan</option>
              <option value="Gazette">Gazette / Excision</option>
            </select>
          </div>

          {/* Max Price Range */}
          <div>
            <label className="block text-[11px] font-semibold text-slate-500 mb-1 truncate">
              Max: {formatFullNaira(maxPrice)}
            </label>
            <input
              type="range"
              min={5000000}
              max={500000000}
              step={5000000}
              value={maxPrice}
              onChange={(e) => setMaxPrice(Number(e.target.value))}
              className="w-full accent-emerald-600 mt-2"
            />
          </div>

          {/* Serviced Toggle */}
          <div className="flex items-end pb-1">
            <label className="flex items-center gap-2 text-xs font-medium text-slate-700 cursor-pointer min-h-[36px]">
              <input
                type="checkbox"
                checked={filterServiced}
                onChange={(e) => setFilterServiced(e.target.checked)}
                className="w-4 h-4 rounded text-emerald-600 focus:ring-emerald-500"
              />
              <span>Serviced Estate</span>
            </label>
          </div>

          {/* Gated Estate Toggle */}
          <div className="flex items-end pb-1">
            <label className="flex items-center gap-2 text-xs font-medium text-slate-700 cursor-pointer min-h-[36px]">
              <input
                type="checkbox"
                checked={filterGated}
                onChange={(e) => setFilterGated(e.target.checked)}
                className="w-4 h-4 rounded text-emerald-600 focus:ring-emerald-500"
              />
              <span>Gated Estate</span>
            </label>
          </div>
        </div>
      </div>

      {/* Property Listings Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {propertyItems.map((item) => {
          const prop = item.property!;

          return (
            <div
              key={item.id}
              className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-xs hover:shadow-md transition group flex flex-col justify-between"
            >
              {/* Image with Purpose Tag */}
              <div 
                onClick={() => onSelectItem(item)}
                className="relative aspect-16/10 overflow-hidden cursor-pointer bg-slate-100"
              >
                <img
                  src={item.images[0]}
                  alt={item.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition duration-300"
                />
                <div className="absolute top-3 left-3 flex flex-wrap gap-1.5">
                  <span className="px-2.5 py-1 rounded-md text-[11px] font-bold uppercase tracking-wider bg-slate-900/90 text-white backdrop-blur-xs">
                    {prop.purpose === 'buy' ? 'For Sale' : prop.purpose === 'rent' ? 'For Rent' : 'Short-let'}
                  </span>
                  {prop.newlyBuilt && (
                    <span className="px-2 py-0.5 rounded-md text-[10px] font-semibold bg-emerald-600 text-white">
                      Newly Built
                    </span>
                  )}
                  {prop.waterfront && (
                    <span className="px-2 py-0.5 rounded-md text-[10px] font-semibold bg-blue-600 text-white">
                      Waterfront
                    </span>
                  )}
                </div>

                <div className="absolute bottom-3 left-3 right-3 flex items-center justify-between text-white drop-shadow-md">
                  <span className="text-xl font-extrabold font-display">
                    {formatFullNaira(item.price)}
                    {prop.purpose === 'rent' && <span className="text-xs font-normal"> / year</span>}
                    {prop.purpose === 'short_let' && <span className="text-xs font-normal"> / night</span>}
                  </span>
                </div>
              </div>

              {/* Body */}
              <div className="p-4 flex-1 flex flex-col justify-between">
                <div>
                  <div className="flex items-center gap-1.5 text-xs text-slate-500 mb-1.5">
                    <MapPin className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                    <span className="font-medium text-slate-700">{item.location.area}, {item.location.state}</span>
                  </div>

                  <h3 
                    onClick={() => onSelectItem(item)}
                    className="font-bold text-slate-900 text-base line-clamp-2 hover:text-emerald-700 transition cursor-pointer mb-3"
                  >
                    {item.title}
                  </h3>

                  {/* Key Specifications (Bedrooms, Bathrooms, Toilets, SQM, Parking) */}
                  <div className="grid grid-cols-3 gap-2 py-2.5 px-3 rounded-xl bg-slate-50 border border-slate-100 text-xs text-slate-700 mb-3 font-medium">
                    {prop.bedrooms !== undefined && (
                      <div className="flex items-center gap-1.5">
                        <Bed className="w-3.5 h-3.5 text-slate-400" />
                        <span>{prop.bedrooms} Beds</span>
                      </div>
                    )}
                    {prop.bathrooms !== undefined && (
                      <div className="flex items-center gap-1.5">
                        <Bath className="w-3.5 h-3.5 text-slate-400" />
                        <span>{prop.bathrooms} Baths</span>
                      </div>
                    )}
                    {prop.landSizeSqm !== undefined ? (
                      <div className="flex items-center gap-1.5">
                        <Maximize2 className="w-3.5 h-3.5 text-slate-400" />
                        <span>{prop.landSizeSqm} sqm</span>
                      </div>
                    ) : prop.buildingSizeSqm !== undefined ? (
                      <div className="flex items-center gap-1.5">
                        <Maximize2 className="w-3.5 h-3.5 text-slate-400" />
                        <span>{prop.buildingSizeSqm} sqm</span>
                      </div>
                    ) : null}
                  </div>

                  {/* Title Documents Tag List */}
                  {prop.titleDocuments && prop.titleDocuments.length > 0 && (
                    <div className="mb-3">
                      <div className="text-[10px] uppercase font-bold text-slate-400 mb-1 flex items-center gap-1">
                        <FileCheck className="w-3 h-3 text-emerald-600" />
                        <span>Declared Title Documents:</span>
                      </div>
                      <div className="flex flex-wrap gap-1">
                        {prop.titleDocuments.slice(0, 3).map((doc) => (
                          <span
                            key={doc}
                            className="px-2 py-0.5 rounded text-[10px] font-semibold bg-emerald-50 text-emerald-800 border border-emerald-200"
                          >
                            {doc}
                          </span>
                        ))}
                        {prop.titleDocuments.length > 3 && (
                          <span className="text-[10px] text-slate-500 font-semibold self-center">
                            +{prop.titleDocuments.length - 3} more
                          </span>
                        )}
                      </div>
                    </div>
                  )}

                  {/* Seller / Agent snippet */}
                  <div className="flex items-center gap-2 pt-2 border-t border-slate-100 mb-3">
                    <img
                      src={item.seller.avatarUrl}
                      alt={item.seller.name}
                      className="w-6 h-6 rounded-full object-cover"
                    />
                    <div className="text-xs">
                      <span className="font-semibold text-slate-800">{item.seller.name}</span>
                      <span className="text-slate-400 text-[10px] ml-1.5">({item.seller.role})</span>
                    </div>
                  </div>
                </div>

                {/* Direct Action Buttons */}
                <div className="grid grid-cols-2 gap-2 pt-2 border-t border-slate-100">
                  <button
                    onClick={() => onRequestViewing(item)}
                    className="flex items-center justify-center gap-1.5 py-2.5 px-2.5 sm:px-3 rounded-xl bg-emerald-600 hover:bg-emerald-700 active:bg-emerald-800 text-white text-xs font-semibold transition cursor-pointer min-h-[44px]"
                  >
                    <Calendar className="w-3.5 h-3.5 shrink-0" />
                    <span className="truncate">Schedule Viewing</span>
                  </button>

                  <button
                    onClick={() => onSelectItem(item)}
                    className="flex items-center justify-center gap-1.5 py-2.5 px-2.5 sm:px-3 rounded-xl bg-slate-100 hover:bg-slate-200 active:bg-slate-300 text-slate-800 text-xs font-semibold transition cursor-pointer min-h-[44px]"
                  >
                    <MessageSquare className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                    <span className="truncate">Contact Agent</span>
                  </button>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
