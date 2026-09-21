import React, { useState, useMemo } from 'react';
import { 
  Hammer, 
  HardHat, 
  MapPin, 
  Package, 
  ShieldCheck, 
  Award, 
  Star, 
  Phone, 
  MessageCircle, 
  CheckCircle, 
  Filter, 
  Layers,
  Truck,
  Briefcase
} from 'lucide-react';
import { MarketplaceItem } from '../types';
import { formatFullNaira, formatNumber } from '../lib/formatters';

interface ConstructionMarketplaceProps {
  items: MarketplaceItem[];
  onSelectItem: (item: MarketplaceItem) => void;
  selectedState: string;
}

export const ConstructionMarketplace: React.FC<ConstructionMarketplaceProps> = ({
  items,
  onSelectItem,
  selectedState,
}) => {
  const [activeSection, setActiveSection] = useState<'materials' | 'services'>('materials');
  const [selectedMaterialCategory, setSelectedMaterialCategory] = useState<string>('all');
  const [selectedServiceType, setSelectedServiceType] = useState<string>('all');

  const materialItems = useMemo(() => {
    return items.filter((item) => {
      if (item.vertical !== 'construction' || item.listingType !== 'LISTING' || !item.material) return false;
      if (selectedMaterialCategory !== 'all' && item.material.materialCategory !== selectedMaterialCategory) return false;
      return true;
    });
  }, [items, selectedMaterialCategory]);

  const serviceItems = useMemo(() => {
    return items.filter((item) => {
      if (item.vertical !== 'construction' || item.listingType !== 'SERVICE' || !item.service) return false;
      if (selectedServiceType !== 'all' && item.service.serviceType !== selectedServiceType) return false;
      return true;
    });
  }, [items, selectedServiceType]);

  return (
    <div className="space-y-6">
      {/* Sub-Section Toggle (Materials vs Professional Services) */}
      <div className="bg-white rounded-2xl p-3 sm:p-4 border border-slate-200 shadow-xs flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 sm:gap-4">
        <div className="grid grid-cols-1 sm:flex items-center gap-2">
          <button
            onClick={() => setActiveSection('materials')}
            className={`flex items-center justify-center gap-2 px-3 sm:px-5 py-2.5 rounded-xl text-xs sm:text-sm font-bold transition cursor-pointer min-h-[44px] ${
              activeSection === 'materials'
                ? 'bg-orange-600 text-white shadow-xs'
                : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
            }`}
          >
            <Package className="w-4 h-4 shrink-0" />
            <span className="truncate">Building Materials Supplies</span>
            <span className="text-[10px] bg-white/20 px-1.5 py-0.5 rounded-full shrink-0">
              {materialItems.length}
            </span>
          </button>

          <button
            onClick={() => setActiveSection('services')}
            className={`flex items-center justify-center gap-2 px-3 sm:px-5 py-2.5 rounded-xl text-xs sm:text-sm font-bold transition cursor-pointer min-h-[44px] ${
              activeSection === 'services'
                ? 'bg-orange-600 text-white shadow-xs'
                : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
            }`}
          >
            <HardHat className="w-4 h-4 shrink-0" />
            <span className="truncate">Certified Professionals & Artisans</span>
            <span className="text-[10px] bg-white/20 px-1.5 py-0.5 rounded-full shrink-0">
              {serviceItems.length}
            </span>
          </button>
        </div>

        <div className="text-xs text-slate-500 font-medium text-center sm:text-right">
          Direct trade connections across {selectedState}
        </div>
      </div>

      {/* 1. MATERIALS SECTION */}
      {activeSection === 'materials' && (
        <div className="space-y-6">
          {/* Material Category Filter Chips */}
          <div className="flex items-center gap-1.5 overflow-x-auto pb-2 scrollbar-none" style={{ WebkitOverflowScrolling: 'touch' }}>
            {[
              'all',
              'Cement',
              'Blocks',
              'Steel & Rebar',
              'Roofing',
              'Tiles',
              'Doors & Windows',
              'Plumbing',
              'Electrical',
              'Paint',
              'Aggregates (Sand & Granite)',
            ].map((cat) => (
              <button
                key={cat}
                onClick={() => setSelectedMaterialCategory(cat)}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition cursor-pointer ${
                  selectedMaterialCategory === cat
                    ? 'bg-slate-900 text-white'
                    : 'bg-white border border-slate-200 text-slate-700 hover:bg-slate-100'
                }`}
              >
                {cat === 'all' ? 'All Materials' : cat}
              </button>
            ))}
          </div>

          {/* Materials Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {materialItems.map((item) => {
              const mat = item.material!;

              return (
                <div
                  key={item.id}
                  className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-xs hover:shadow-md transition flex flex-col justify-between"
                >
                  <div 
                    onClick={() => onSelectItem(item)}
                    className="relative aspect-16/10 overflow-hidden cursor-pointer bg-slate-100"
                  >
                    <img
                      src={item.images[0]}
                      alt={item.title}
                      className="w-full h-full object-cover hover:scale-105 transition duration-300"
                    />
                    <div className="absolute top-3 left-3">
                      <span className="px-2.5 py-1 rounded-md text-[11px] font-bold uppercase tracking-wider bg-orange-600 text-white">
                        {mat.materialCategory}
                      </span>
                    </div>

                    <div className="absolute bottom-3 left-3 right-3 flex items-center justify-between text-white drop-shadow-md">
                      <span className="text-xl font-extrabold font-display">
                        {formatFullNaira(item.price)}
                        <span className="text-xs font-normal text-slate-200"> / {mat.unitOfMeasure}</span>
                      </span>
                    </div>
                  </div>

                  <div className="p-4 flex-1 flex flex-col justify-between">
                    <div>
                      <div className="flex items-center gap-1.5 text-xs text-slate-500 mb-1.5">
                        <MapPin className="w-3.5 h-3.5 text-orange-600 shrink-0" />
                        <span>{item.location.area}, {item.location.state}</span>
                      </div>

                      <h3 
                        onClick={() => onSelectItem(item)}
                        className="font-bold text-slate-900 text-base line-clamp-2 hover:text-orange-700 transition cursor-pointer mb-3"
                      >
                        {item.title}
                      </h3>

                      {/* Material Specs */}
                      <div className="grid grid-cols-2 gap-2 py-2 px-3 rounded-xl bg-slate-50 border border-slate-100 text-xs text-slate-700 mb-3 font-medium">
                        <div>
                          <span className="text-slate-400 block text-[10px]">Min. Order</span>
                          <span>{mat.minOrderQuantity} {mat.unitOfMeasure}</span>
                        </div>
                        <div>
                          <span className="text-slate-400 block text-[10px]">Delivery</span>
                          <span className="text-emerald-700 flex items-center gap-1">
                            <Truck className="w-3 h-3" /> Trailer / Tipper
                          </span>
                        </div>
                      </div>

                      {/* Supplier Card */}
                      <div className="flex items-center justify-between pt-2 border-t border-slate-100 mb-3 text-xs">
                        <span className="font-semibold text-slate-900">{item.seller.companyName || item.seller.name}</span>
                        <span className="text-[10px] text-emerald-600 font-bold bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
                          Direct Supplier
                        </span>
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-2 pt-2 border-t border-slate-100">
                      <a
                        href={`https://wa.me/${item.seller.whatsapp.replace(/[^0-9]/g, '')}?text=Hello%20${encodeURIComponent(item.seller.name)},%20I%20want%20to%20place%20a%20wholesale%20order%20for%20${encodeURIComponent(item.title)}.`}
                        target="_blank"
                        rel="noreferrer"
                        className="flex items-center justify-center gap-1.5 py-2.5 px-3 rounded-xl bg-emerald-600 hover:bg-emerald-700 active:bg-emerald-800 text-white text-xs font-semibold transition min-h-[44px]"
                      >
                        <MessageCircle className="w-3.5 h-3.5 shrink-0" />
                        <span className="truncate">Order Wholesale</span>
                      </a>

                      <button
                        onClick={() => onSelectItem(item)}
                        className="flex items-center justify-center gap-1.5 py-2.5 px-3 rounded-xl bg-slate-100 hover:bg-slate-200 active:bg-slate-300 text-slate-800 text-xs font-semibold transition cursor-pointer min-h-[44px]"
                      >
                        <span className="truncate">Specifications</span>
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* 2. SERVICES & PROFESSIONAL DIRECTORY SECTION (Section 13 in user prompt) */}
      {activeSection === 'services' && (
        <div className="space-y-6">
          {/* Service Type Filter Chips */}
          <div className="flex items-center gap-1.5 overflow-x-auto pb-2 scrollbar-none">
            {[
              'all',
              'Building Contractor',
              'Architect',
              'Civil / Structural Engineer',
              'Quantity Surveyor',
              'Land Surveyor',
              'Plumber',
              'Electrician',
              'Carpenter',
              'Tiler',
              'Equipment Operator',
            ].map((srv) => (
              <button
                key={srv}
                onClick={() => setSelectedServiceType(srv)}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition cursor-pointer ${
                  selectedServiceType === srv
                    ? 'bg-orange-600 text-white'
                    : 'bg-white border border-slate-200 text-slate-700 hover:bg-slate-100'
                }`}
              >
                {srv === 'all' ? 'All Professionals' : srv}
              </button>
            ))}
          </div>

          {/* Professionals Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {serviceItems.map((item) => {
              const serv = item.service!;

              return (
                <div
                  key={item.id}
                  className="bg-white rounded-2xl border border-slate-200 p-5 shadow-xs hover:shadow-md transition flex flex-col justify-between"
                >
                  <div>
                    {/* Header with Avatar & Accreditations */}
                    <div className="flex items-start justify-between gap-4 mb-3">
                      <div className="flex items-center gap-3">
                        <img
                          src={item.seller.avatarUrl}
                          alt={item.seller.name}
                          className="w-14 h-14 rounded-2xl object-cover border border-slate-200 shadow-xs"
                        />
                        <div>
                          <div className="flex items-center gap-2">
                            <h3 className="font-bold text-slate-900 text-base">
                              {item.seller.companyName || item.seller.name}
                            </h3>
                            <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-50 text-emerald-700 border border-emerald-200">
                              ✓ {serv.verifiedStatus}
                            </span>
                          </div>
                          <p className="text-xs text-orange-700 font-semibold">
                            {serv.professionalTitle}
                          </p>
                          <div className="flex items-center gap-2 text-xs text-slate-500 mt-0.5">
                            <span className="flex items-center text-amber-500 font-bold">
                              <Star className="w-3.5 h-3.5 fill-amber-500 text-amber-500 mr-1" />
                              {serv.rating}
                            </span>
                            <span>({serv.reviewCount} verified reviews)</span>
                            <span>•</span>
                            <span>{serv.experienceYears} Years Experience</span>
                          </div>
                        </div>
                      </div>
                    </div>

                    <p className="text-xs text-slate-600 line-clamp-3 mb-4 leading-relaxed">
                      {item.description}
                    </p>

                    {/* Professional Certifications Badges (e.g. COREN, NIA, QSRBN) */}
                    <div className="mb-4">
                      <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block mb-1.5">
                        Accreditations & Board Registrations
                      </span>
                      <div className="flex flex-wrap gap-1.5">
                        {serv.certifications.map((cert) => (
                          <span
                            key={cert}
                            className="px-2.5 py-1 rounded-md text-[11px] font-bold bg-slate-900 text-amber-300 flex items-center gap-1"
                          >
                            <Award className="w-3 h-3" />
                            {cert}
                          </span>
                        ))}
                      </div>
                    </div>

                    {/* Service Area & Consultation Rate */}
                    <div className="flex items-center justify-between p-3 rounded-xl bg-slate-50 border border-slate-100 text-xs mb-4">
                      <div>
                        <span className="text-slate-400 block text-[10px]">Service Area</span>
                        <span className="font-semibold text-slate-800">{serv.serviceArea}</span>
                      </div>
                      <div className="text-right">
                        <span className="text-slate-400 block text-[10px]">Starting Consultation</span>
                        <span className="font-extrabold text-slate-900 text-sm font-display">
                          {formatFullNaira(serv.startingPrice)}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="grid grid-cols-3 gap-2 pt-2 border-t border-slate-100">
                    <a
                      href={`tel:${item.seller.phone}`}
                      className="flex items-center justify-center gap-1.5 py-2.5 px-2 rounded-xl bg-slate-100 hover:bg-slate-200 active:bg-slate-300 text-slate-800 text-xs font-semibold transition min-h-[44px]"
                    >
                      <Phone className="w-3.5 h-3.5 text-slate-600" />
                      <span>Call</span>
                    </a>

                    <a
                      href={`https://wa.me/${item.seller.whatsapp.replace(/[^0-9]/g, '')}?text=Hello%20${encodeURIComponent(item.seller.name)},%20I%20found%20your%20construction%20profile%20on%20StrucTrade%20NG%20and%20want%20to%20discuss%20a%20project.`}
                      target="_blank"
                      rel="noreferrer"
                      className="flex items-center justify-center gap-1.5 py-2.5 px-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 active:bg-emerald-800 text-white text-xs font-semibold transition min-h-[44px]"
                    >
                      <MessageCircle className="w-3.5 h-3.5" />
                      <span>WhatsApp</span>
                    </a>

                    <button
                      onClick={() => onSelectItem(item)}
                      className="flex items-center justify-center gap-1.5 py-2.5 px-2 rounded-xl bg-orange-600 hover:bg-orange-700 active:bg-orange-800 text-white text-xs font-semibold transition cursor-pointer min-h-[44px]"
                    >
                      <span>Portfolio</span>
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
};
