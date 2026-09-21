import React, { useState, useMemo } from 'react';
import { 
  Wrench, 
  MapPin, 
  Clock, 
  Weight, 
  UserCheck, 
  Truck, 
  ShieldCheck, 
  Filter, 
  CalendarClock, 
  Phone, 
  MessageSquare,
  Sparkles,
  ArrowRightLeft
} from 'lucide-react';
import { MarketplaceItem } from '../types';
import { formatFullNaira, formatNumber } from '../lib/formatters';

interface EquipmentMarketplaceProps {
  items: MarketplaceItem[];
  onSelectItem: (item: MarketplaceItem) => void;
  onRequestRental: (item: MarketplaceItem) => void;
  selectedState: string;
}

export const EquipmentMarketplace: React.FC<EquipmentMarketplaceProps> = ({
  items,
  onSelectItem,
  onRequestRental,
  selectedState,
}) => {
  const [activeTab, setActiveTab] = useState<'all' | 'rent' | 'buy'>('all');
  const [selectedType, setSelectedType] = useState<string>('all');
  const [operatorOnly, setOperatorOnly] = useState<boolean>(false);
  const [deliveryOnly, setDeliveryOnly] = useState<boolean>(false);
  const [showMobileFilters, setShowMobileFilters] = useState<boolean>(false);

  const equipmentItems = useMemo(() => {
    return items.filter((item) => {
      if (item.vertical !== 'equipment' || !item.equipment) return false;
      if (activeTab === 'rent' && item.equipment.saleType === 'sale') return false;
      if (activeTab === 'buy' && item.equipment.saleType === 'rental') return false;
      if (selectedType !== 'all' && item.equipment.equipmentType.toLowerCase() !== selectedType.toLowerCase()) return false;
      if (operatorOnly && !item.equipment.operatorIncluded) return false;
      if (deliveryOnly && !item.equipment.deliveryAvailable) return false;
      return true;
    });
  }, [items, activeTab, selectedType, operatorOnly, deliveryOnly]);

  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="bg-gradient-to-r from-amber-950 via-slate-900 to-amber-900 text-white rounded-2xl p-5 shadow-xs flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-xs font-semibold text-amber-400 uppercase tracking-wider mb-1">
            <Wrench className="w-4 h-4 text-amber-400" />
            <span>Heavy Machinery & Fleet Hub</span>
          </div>
          <h2 className="text-xl sm:text-2xl font-bold font-display">
            Construction Equipment Hire & Outright Sales
          </h2>
          <p className="text-xs sm:text-sm text-slate-300 mt-1 max-w-2xl">
            Excavators, Bulldozers, Cranes, Rollers & Industrial Diesel Generators with licensed operators and nationwide site mobilization.
          </p>
        </div>

        {/* Buy vs Rent Toggle & Mobile Filter Button */}
        <div className="flex items-center justify-between sm:justify-end gap-2 w-full sm:w-auto">
          <div className="bg-slate-800/90 p-1 sm:p-1.5 rounded-xl border border-slate-700 flex items-center gap-1 shrink-0 overflow-x-auto scrollbar-none">
            <button
              onClick={() => setActiveTab('all')}
              className={`px-2.5 sm:px-3 py-1.5 rounded-lg text-xs font-bold transition whitespace-nowrap cursor-pointer ${
                activeTab === 'all' ? 'bg-amber-500 text-slate-950' : 'text-slate-300 hover:text-white'
              }`}
            >
              All Machinery
            </button>
            <button
              onClick={() => setActiveTab('rent')}
              className={`px-2.5 sm:px-3 py-1.5 rounded-lg text-xs font-bold transition whitespace-nowrap cursor-pointer ${
                activeTab === 'rent' ? 'bg-amber-500 text-slate-950' : 'text-slate-300 hover:text-white'
              }`}
            >
              Rent Fleets
            </button>
            <button
              onClick={() => setActiveTab('buy')}
              className={`px-2.5 sm:px-3 py-1.5 rounded-lg text-xs font-bold transition whitespace-nowrap cursor-pointer ${
                activeTab === 'buy' ? 'bg-amber-500 text-slate-950' : 'text-slate-300 hover:text-white'
              }`}
            >
              Outright Buy
            </button>
          </div>

          <button
            type="button"
            onClick={() => setShowMobileFilters(!showMobileFilters)}
            className="sm:hidden flex items-center gap-1.5 px-3 py-1.5 bg-amber-600/80 hover:bg-amber-600 text-slate-950 font-bold rounded-xl text-xs transition min-h-[36px] shrink-0"
          >
            <Filter className="w-3.5 h-3.5" />
            <span>{showMobileFilters ? 'Hide' : 'Filter'}</span>
          </button>
        </div>
      </div>

      {/* Equipment Filters (Collapsible on mobile) */}
      <div className={`bg-slate-100/80 rounded-2xl p-3.5 sm:p-4 border border-slate-200 text-xs sm:text-sm space-y-3 ${showMobileFilters ? 'block animate-in fade-in' : 'hidden sm:block'}`}>
        <div className="flex items-center justify-between font-bold text-slate-800 uppercase text-xs tracking-wider">
          <div className="flex items-center gap-2">
            <Filter className="w-4 h-4 text-amber-700" />
            <span>Filter By Machine Category & Support</span>
          </div>
          <button
            type="button"
            onClick={() => setShowMobileFilters(false)}
            className="sm:hidden text-[11px] text-slate-500 hover:text-slate-800 font-semibold"
          >
            Done
          </button>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          {/* Equipment Type */}
          <div>
            <label className="block text-[11px] font-semibold text-slate-500 mb-1">Machinery Type</label>
            <select
              value={selectedType}
              onChange={(e) => setSelectedType(e.target.value)}
              className="w-full p-2 rounded-lg bg-white border border-slate-200 text-slate-800 text-base sm:text-xs font-medium outline-none min-h-[40px] sm:min-h-auto"
            >
              <option value="all">All Machinery</option>
              <option value="excavators">Excavators</option>
              <option value="bulldozers">Bulldozers</option>
              <option value="cranes">Cranes</option>
              <option value="generators">Industrial Generators</option>
              <option value="rollers">Rollers & Compactors</option>
              <option value="forklifts">Forklifts</option>
            </select>
          </div>

          {/* Operator Required */}
          <div className="flex items-end pb-1">
            <label className="flex items-center gap-2 text-xs font-medium text-slate-700 cursor-pointer min-h-[36px]">
              <input
                type="checkbox"
                checked={operatorOnly}
                onChange={(e) => setOperatorOnly(e.target.checked)}
                className="w-4 h-4 rounded text-amber-600 focus:ring-amber-500"
              />
              <span>Operator Included</span>
            </label>
          </div>

          {/* Delivery to Site */}
          <div className="flex items-end pb-1">
            <label className="flex items-center gap-2 text-xs font-medium text-slate-700 cursor-pointer min-h-[36px]">
              <input
                type="checkbox"
                checked={deliveryOnly}
                onChange={(e) => setDeliveryOnly(e.target.checked)}
                className="w-4 h-4 rounded text-amber-600 focus:ring-amber-500"
              />
              <span>Site Delivery Available</span>
            </label>
          </div>

          <div className="flex items-center justify-end text-xs text-slate-500 font-semibold">
            <span>{equipmentItems.length} machines ready for deployment</span>
          </div>
        </div>
      </div>

      {/* Equipment Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {equipmentItems.map((item) => {
          const eq = item.equipment!;

          return (
            <div
              key={item.id}
              className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-xs hover:shadow-md transition group flex flex-col justify-between"
            >
              {/* Image & Price banner */}
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
                  <span className="px-2.5 py-1 rounded-md text-[11px] font-bold uppercase tracking-wider bg-amber-600 text-white">
                    {eq.saleType === 'both' ? 'Buy / Rent' : eq.saleType === 'rental' ? 'Rent Only' : 'Buy Only'}
                  </span>
                  <span className="px-2 py-0.5 rounded-md text-[10px] font-semibold bg-slate-900/80 text-white">
                    {eq.brand} • {eq.year}
                  </span>
                </div>

                {/* Dual Price Overlay (Outright OR Daily Rate) */}
                <div className="absolute bottom-3 left-3 right-3 p-2 rounded-xl bg-slate-950/85 backdrop-blur-xs text-white border border-slate-700/50">
                  <div className="flex items-center justify-between">
                    <div>
                      <span className="block text-[10px] text-amber-400 font-semibold uppercase">Outright Purchase</span>
                      <span className="text-base font-extrabold font-display">
                        {formatFullNaira(item.price)}
                      </span>
                    </div>

                    {eq.dailyRate && (
                      <div className="text-right border-l border-slate-700 pl-3">
                        <span className="block text-[10px] text-amber-400 font-semibold uppercase">Rental Rate</span>
                        <span className="text-base font-extrabold text-amber-300 font-display">
                          {formatFullNaira(eq.dailyRate)}<span className="text-xs font-normal text-slate-300">/day</span>
                        </span>
                      </div>
                    )}
                  </div>
                </div>
              </div>

              {/* Body */}
              <div className="p-4 flex-1 flex flex-col justify-between">
                <div>
                  <div className="flex items-center gap-1.5 text-xs text-slate-500 mb-1.5">
                    <MapPin className="w-3.5 h-3.5 text-amber-700 shrink-0" />
                    <span className="font-medium text-slate-700">{item.location.area}, {item.location.state}</span>
                  </div>

                  <h3 
                    onClick={() => onSelectItem(item)}
                    className="font-bold text-slate-900 text-base line-clamp-2 hover:text-amber-800 transition cursor-pointer mb-3"
                  >
                    {item.title}
                  </h3>

                  {/* Machinery Specifications */}
                  <div className="grid grid-cols-2 gap-2 py-2 px-3 rounded-xl bg-slate-50 border border-slate-100 text-xs text-slate-700 mb-3 font-medium">
                    {eq.operatingHours !== undefined && (
                      <div className="flex items-center gap-1.5">
                        <Clock className="w-3.5 h-3.5 text-slate-400" />
                        <span>{formatNumber(eq.operatingHours)} Hours Used</span>
                      </div>
                    )}
                    {eq.operatingWeightKg !== undefined && (
                      <div className="flex items-center gap-1.5">
                        <Weight className="w-3.5 h-3.5 text-slate-400" />
                        <span>{formatNumber(eq.operatingWeightKg)} kg Weight</span>
                      </div>
                    )}
                    <div className="flex items-center gap-1.5">
                      <UserCheck className={`w-3.5 h-3.5 ${eq.operatorIncluded ? 'text-emerald-600' : 'text-slate-400'}`} />
                      <span>{eq.operatorIncluded ? 'Operator Included' : 'Operator Available'}</span>
                    </div>
                    <div className="flex items-center gap-1.5">
                      <Truck className={`w-3.5 h-3.5 ${eq.deliveryAvailable ? 'text-emerald-600' : 'text-slate-400'}`} />
                      <span>{eq.deliveryAvailable ? 'Site Delivery' : 'Self Mobilization'}</span>
                    </div>
                  </div>

                  {/* Rental Tier Breakdown Chips */}
                  {eq.weeklyRate && (
                    <div className="flex items-center justify-between text-[11px] bg-amber-50/70 border border-amber-200/60 rounded-lg px-2.5 py-1.5 mb-3 text-amber-950 font-medium">
                      <span>Weekly: <strong className="font-bold">{formatFullNaira(eq.weeklyRate)}</strong></span>
                      {eq.monthlyRate && <span>Monthly: <strong className="font-bold">{formatFullNaira(eq.monthlyRate)}</strong></span>}
                    </div>
                  )}

                  {/* Company Card */}
                  <div className="flex items-center justify-between pt-2 border-t border-slate-100 mb-3 text-xs">
                    <div className="flex items-center gap-2">
                      <img
                        src={item.seller.avatarUrl}
                        alt={item.seller.name}
                        className="w-6 h-6 rounded-full object-cover"
                      />
                      <span className="font-semibold text-slate-900">{item.seller.name}</span>
                    </div>
                    <span className="text-[10px] text-emerald-600 font-bold bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
                      Verified Fleet
                    </span>
                  </div>
                </div>

                {/* Primary Dual Actions: Buy vs Request Rental */}
                <div className="grid grid-cols-2 gap-2 pt-2 border-t border-slate-100">
                  {eq.dailyRate ? (
                    <button
                      onClick={() => onRequestRental(item)}
                      className="flex items-center justify-center gap-1.5 py-2.5 px-3 rounded-xl bg-amber-600 hover:bg-amber-700 active:bg-amber-800 text-white text-xs font-semibold transition cursor-pointer min-h-[44px]"
                    >
                      <CalendarClock className="w-3.5 h-3.5 shrink-0" />
                      <span className="truncate">Request Rental</span>
                    </button>
                  ) : (
                    <button
                      onClick={() => onSelectItem(item)}
                      className="flex items-center justify-center gap-1.5 py-2.5 px-3 rounded-xl bg-slate-900 hover:bg-slate-800 active:bg-slate-950 text-white text-xs font-semibold transition cursor-pointer min-h-[44px]"
                    >
                      <span className="truncate">Buy Machine</span>
                    </button>
                  )}

                  <a
                    href={`https://wa.me/${item.seller.whatsapp.replace(/[^0-9]/g, '')}?text=Hello%20${encodeURIComponent(item.seller.name)},%20I%20want%20to%20inquire%20about%20equipment%20${encodeURIComponent(item.title)}%20on%20StrucTrade%20NG.`}
                    target="_blank"
                    rel="noreferrer"
                    className="flex items-center justify-center gap-1.5 py-2.5 px-3 rounded-xl bg-emerald-600 hover:bg-emerald-700 active:bg-emerald-800 text-white text-xs font-semibold transition min-h-[44px]"
                  >
                    <MessageSquare className="w-3.5 h-3.5 shrink-0" />
                    <span className="truncate">WhatsApp</span>
                  </a>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
