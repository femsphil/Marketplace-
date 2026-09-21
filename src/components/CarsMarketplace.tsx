import React, { useState, useMemo } from 'react';
import { 
  Car, 
  MapPin, 
  Gauge, 
  Fuel, 
  Cog, 
  ShieldCheck, 
  Phone, 
  MessageCircle, 
  Filter, 
  Store,
  BadgeCheck
} from 'lucide-react';
import { MarketplaceItem, VehicleCondition } from '../types';
import { formatFullNaira, formatNumber } from '../lib/formatters';

interface CarsMarketplaceProps {
  items: MarketplaceItem[];
  onSelectItem: (item: MarketplaceItem) => void;
  selectedState: string;
}

export const CarsMarketplace: React.FC<CarsMarketplaceProps> = ({
  items,
  onSelectItem,
  selectedState,
}) => {
  const [selectedMake, setSelectedMake] = useState<string>('all');
  const [selectedCondition, setSelectedCondition] = useState<string>('all');
  const [selectedTransmission, setSelectedTransmission] = useState<string>('all');
  const [maxPrice, setMaxPrice] = useState<number>(300000000);
  const [showMobileFilters, setShowMobileFilters] = useState<boolean>(false);

  const vehicleItems = useMemo(() => {
    return items.filter((item) => {
      if (item.vertical !== 'cars' || !item.vehicle) return false;
      if (selectedMake !== 'all' && item.vehicle.make.toLowerCase() !== selectedMake.toLowerCase()) return false;
      if (selectedCondition !== 'all' && item.vehicle.condition !== selectedCondition) return false;
      if (selectedTransmission !== 'all' && item.vehicle.transmission !== selectedTransmission) return false;
      if (item.price > maxPrice) return false;
      return true;
    });
  }, [items, selectedMake, selectedCondition, selectedTransmission, maxPrice]);

  return (
    <div className="space-y-6">
      {/* Top Banner / Trust Header */}
      <div className="bg-gradient-to-r from-blue-900 to-indigo-900 text-white rounded-2xl p-5 shadow-xs flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-xs font-semibold text-blue-300 uppercase tracking-wider mb-1">
            <ShieldCheck className="w-4 h-4 text-emerald-400" />
            <span>Certified Nigerian Auto Marketplace</span>
          </div>
          <h2 className="text-xl sm:text-2xl font-bold font-display">
            Tokunbo & Brand New Vehicles with Customs Clearance
          </h2>
          <p className="text-xs sm:text-sm text-blue-200 mt-1 max-w-2xl">
            Direct imports from North America, Europe & UAE. Verified VIN histories, site-ready pickup trucks, commercial buses and luxury SUVs.
          </p>
        </div>

        <div className="flex items-center justify-between sm:justify-end gap-3 w-full sm:w-auto">
          <button
            type="button"
            onClick={() => setShowMobileFilters(!showMobileFilters)}
            className="sm:hidden flex items-center gap-1.5 px-3 py-1.5 bg-blue-800/80 hover:bg-blue-700 text-white rounded-lg text-xs font-bold transition min-h-[36px]"
          >
            <Filter className="w-3.5 h-3.5 text-blue-300" />
            <span>{showMobileFilters ? 'Hide Filters' : 'Refine Specs'}</span>
          </button>
          <div className="text-right shrink-0">
            <span className="text-xl sm:text-2xl font-extrabold font-display">{vehicleItems.length}</span>
            <span className="block text-xs text-blue-300">Vehicles Available</span>
          </div>
        </div>
      </div>

      {/* Vehicle Filters Bar (Collapsible on mobile) */}
      <div className={`bg-slate-100/80 rounded-2xl p-3.5 sm:p-4 border border-slate-200 text-xs sm:text-sm space-y-3 ${showMobileFilters ? 'block animate-in fade-in' : 'hidden sm:block'}`}>
        <div className="flex items-center justify-between font-bold text-slate-800 uppercase text-xs tracking-wider">
          <div className="flex items-center gap-2">
            <Filter className="w-4 h-4 text-blue-600" />
            <span>Filter By Vehicle Specs</span>
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
          {/* Make */}
          <div>
            <label className="block text-[11px] font-semibold text-slate-500 mb-1">Brand / Make</label>
            <select
              value={selectedMake}
              onChange={(e) => setSelectedMake(e.target.value)}
              className="w-full p-2 rounded-lg bg-white border border-slate-200 text-slate-800 text-base sm:text-xs font-medium outline-none min-h-[40px] sm:min-h-auto"
            >
              <option value="all">All Makes</option>
              <option value="toyota">Toyota</option>
              <option value="mercedes-benz">Mercedes-Benz</option>
              <option value="lexus">Lexus</option>
              <option value="honda">Honda</option>
              <option value="ford">Ford</option>
              <option value="mack">Mack / Trucks</option>
            </select>
          </div>

          {/* Condition (Foreign Used / Tokunbo vs Brand New) */}
          <div>
            <label className="block text-[11px] font-semibold text-slate-500 mb-1">Condition</label>
            <select
              value={selectedCondition}
              onChange={(e) => setSelectedCondition(e.target.value)}
              className="w-full p-2 rounded-lg bg-white border border-slate-200 text-slate-800 text-base sm:text-xs font-medium outline-none min-h-[40px] sm:min-h-auto"
            >
              <option value="all">All Conditions</option>
              <option value="Foreign Used (Tokunbo)">Foreign Used (Tokunbo)</option>
              <option value="Brand New">Brand New</option>
              <option value="Nigerian Used">Nigerian Used</option>
            </select>
          </div>

          {/* Transmission */}
          <div>
            <label className="block text-[11px] font-semibold text-slate-500 mb-1">Transmission</label>
            <select
              value={selectedTransmission}
              onChange={(e) => setSelectedTransmission(e.target.value)}
              className="w-full p-2 rounded-lg bg-white border border-slate-200 text-slate-800 text-base sm:text-xs font-medium outline-none min-h-[40px] sm:min-h-auto"
            >
              <option value="all">All Transmissions</option>
              <option value="Automatic">Automatic</option>
              <option value="Manual">Manual</option>
            </select>
          </div>

          {/* Max Price */}
          <div>
            <label className="block text-[11px] font-semibold text-slate-500 mb-1 truncate">
              Max: {formatFullNaira(maxPrice)}
            </label>
            <input
              type="range"
              min={5000000}
              max={300000000}
              step={5000000}
              value={maxPrice}
              onChange={(e) => setMaxPrice(Number(e.target.value))}
              className="w-full accent-blue-600 mt-2"
            />
          </div>
        </div>
      </div>

      {/* Vehicle Listings Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {vehicleItems.map((item) => {
          const veh = item.vehicle!;

          return (
            <div
              key={item.id}
              className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-xs hover:shadow-md transition group flex flex-col justify-between"
            >
              {/* Vehicle Image with Tokunbo / Spec Overlay */}
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
                  <span className="px-2.5 py-1 rounded-md text-[11px] font-bold uppercase tracking-wider bg-blue-900/90 text-white backdrop-blur-xs">
                    {veh.condition}
                  </span>
                  <span className="px-2 py-0.5 rounded-md text-[10px] font-semibold bg-slate-900/80 text-white">
                    {veh.year}
                  </span>
                </div>

                {veh.vinVerified && (
                  <div className="absolute top-3 right-3 bg-emerald-600 text-white text-[10px] font-bold px-2 py-0.5 rounded-md flex items-center gap-1 shadow-xs">
                    <BadgeCheck className="w-3 h-3" />
                    <span>VIN Verified</span>
                  </div>
                )}

                <div className="absolute bottom-3 left-3 right-3 flex items-center justify-between text-white drop-shadow-md">
                  <span className="text-xl font-extrabold font-display">
                    {formatFullNaira(item.price)}
                  </span>
                </div>
              </div>

              {/* Vehicle Body Content */}
              <div className="p-4 flex-1 flex flex-col justify-between">
                <div>
                  <div className="flex items-center gap-1.5 text-xs text-slate-500 mb-1.5">
                    <MapPin className="w-3.5 h-3.5 text-blue-600 shrink-0" />
                    <span className="font-medium text-slate-700">{item.location.area}, {item.location.state}</span>
                  </div>

                  <h3 
                    onClick={() => onSelectItem(item)}
                    className="font-bold text-slate-900 text-base line-clamp-2 hover:text-blue-700 transition cursor-pointer mb-3"
                  >
                    {item.title}
                  </h3>

                  {/* Vehicle Spec Grid (Make, Model, Year, Mileage, Transmission, Fuel) */}
                  <div className="grid grid-cols-3 gap-2 py-2.5 px-3 rounded-xl bg-slate-50 border border-slate-100 text-xs text-slate-700 mb-3 font-medium">
                    <div className="flex items-center gap-1.5">
                      <Gauge className="w-3.5 h-3.5 text-slate-400" />
                      <span>{formatNumber(veh.mileageKm)} km</span>
                    </div>
                    <div className="flex items-center gap-1.5">
                      <Cog className="w-3.5 h-3.5 text-slate-400" />
                      <span>{veh.transmission}</span>
                    </div>
                    <div className="flex items-center gap-1.5">
                      <Fuel className="w-3.5 h-3.5 text-slate-400" />
                      <span>{veh.fuelType}</span>
                    </div>
                  </div>

                  {/* Dealership / Seller Card */}
                  <div className="flex items-center justify-between pt-2 border-t border-slate-100 mb-3 text-xs">
                    <div className="flex items-center gap-2">
                      <img
                        src={item.seller.avatarUrl}
                        alt={item.seller.name}
                        className="w-6 h-6 rounded-full object-cover"
                      />
                      <div>
                        <span className="font-semibold text-slate-900">{item.seller.name}</span>
                        {item.seller.verifiedBusiness && (
                          <span className="text-[10px] text-emerald-600 font-bold ml-1">✓ Verified</span>
                        )}
                      </div>
                    </div>
                    <span className="text-[11px] font-semibold text-slate-500">
                      {item.seller.totalListings} Cars in Stock
                    </span>
                  </div>
                </div>

                {/* Call & WhatsApp CTAs (Section 8) */}
                <div className="grid grid-cols-3 gap-2 pt-2 border-t border-slate-100">
                  <a
                    href={`tel:${item.seller.phone}`}
                    className="flex items-center justify-center gap-1 py-2.5 px-2 rounded-xl bg-slate-100 hover:bg-slate-200 active:bg-slate-300 text-slate-800 text-xs font-semibold transition min-h-[44px]"
                  >
                    <Phone className="w-3.5 h-3.5 text-slate-600" />
                    <span>Call</span>
                  </a>

                  <a
                    href={`https://wa.me/${item.seller.whatsapp.replace(/[^0-9]/g, '')}?text=Hello%20${encodeURIComponent(item.seller.name)},%20I%20am%20interested%20in%20your%20${encodeURIComponent(item.title)}%20listed%20on%20StrucTrade%20NG.`}
                    target="_blank"
                    rel="noreferrer"
                    className="flex items-center justify-center gap-1 py-2.5 px-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 active:bg-emerald-800 text-white text-xs font-semibold transition min-h-[44px]"
                  >
                    <MessageCircle className="w-3.5 h-3.5" />
                    <span>WhatsApp</span>
                  </a>

                  <button
                    onClick={() => onSelectItem(item)}
                    className="flex items-center justify-center gap-1 py-2.5 px-2 rounded-xl bg-blue-600 hover:bg-blue-700 active:bg-blue-800 text-white text-xs font-semibold transition cursor-pointer min-h-[44px]"
                  >
                    <span>Inspect</span>
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
