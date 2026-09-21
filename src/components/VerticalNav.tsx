import React from 'react';
import { Building2, Car, Wrench, Hammer, ArrowUpRight } from 'lucide-react';
import { MarketplaceVertical } from '../types';

interface VerticalNavProps {
  currentVertical: MarketplaceVertical;
  onSelectVertical: (vertical: MarketplaceVertical) => void;
}

export const VerticalNav: React.FC<VerticalNavProps> = ({
  currentVertical,
  onSelectVertical,
}) => {
  const verticals = [
    {
      id: 'property' as MarketplaceVertical,
      title: 'Property',
      subtitle: 'Buy • Rent • Land • Commercial',
      icon: Building2,
      color: 'emerald',
      bgGradient: 'from-emerald-950/80 via-slate-900 to-slate-900',
      activeBorder: 'border-emerald-500',
      badgeBg: 'bg-emerald-500/10 text-emerald-600 border-emerald-500/20',
      description: 'Houses, Luxury Duplexes, Serviced Apartments, Short-lets & Commercial Plots',
    },
    {
      id: 'cars' as MarketplaceVertical,
      title: 'Cars & Vehicles',
      subtitle: 'Cars • Trucks • SUVs • Motorcycles',
      icon: Car,
      color: 'blue',
      bgGradient: 'from-blue-950/80 via-slate-900 to-slate-900',
      activeBorder: 'border-blue-500',
      badgeBg: 'bg-blue-500/10 text-blue-600 border-blue-500/20',
      description: 'Tokunbo (Foreign Used), Brand New, Nigerian Used, Site Pickups & Heavy Haulers',
    },
    {
      id: 'equipment' as MarketplaceVertical,
      title: 'Construction Equipment',
      subtitle: 'Buy • Sell • Rent Fleets',
      icon: Wrench,
      color: 'amber',
      bgGradient: 'from-amber-950/80 via-slate-900 to-slate-900',
      activeBorder: 'border-amber-500',
      badgeBg: 'bg-amber-500/10 text-amber-600 border-amber-500/20',
      description: 'Hydraulic Excavators, Bulldozers, Cranes, Industrial Generators & Mixers with Operators',
    },
    {
      id: 'construction' as MarketplaceVertical,
      title: 'Construction Ecosystem',
      subtitle: 'Materials • Contractors • Services',
      icon: Hammer,
      color: 'orange',
      bgGradient: 'from-orange-950/80 via-slate-900 to-slate-900',
      activeBorder: 'border-orange-500',
      badgeBg: 'bg-orange-500/10 text-orange-600 border-orange-500/20',
      description: 'Wholesale Cement, 9" Blocks, Rebar, Roofing & COREN-Certified Structural Engineers',
    },
  ];

  return (
    <div className="max-w-7xl mx-auto px-3 sm:px-6 -mt-4 sm:-mt-8 mb-6 sm:mb-10 relative z-20">
      <div className="flex items-center justify-between mb-3 px-1">
        <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">
          Marketplace Categories
        </span>
        <button
          onClick={() => onSelectVertical('all')}
          className={`text-xs font-semibold px-3 py-1 rounded-full transition cursor-pointer ${
            currentVertical === 'all'
              ? 'bg-slate-900 text-white font-bold shadow-xs'
              : 'text-slate-600 bg-white border border-slate-200 hover:bg-slate-50'
          }`}
        >
          View All Verticals
        </button>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-2 sm:gap-4">
        {verticals.map((v) => {
          const Icon = v.icon;
          const isSelected = currentVertical === v.id;

          return (
            <button
              key={v.id}
              onClick={() => onSelectVertical(v.id)}
              className={`p-3 sm:p-4 rounded-xl sm:rounded-2xl bg-white border text-left transition-all duration-200 shadow-xs hover:shadow-md cursor-pointer group relative overflow-hidden flex flex-col justify-between ${
                isSelected
                  ? `ring-2 ring-emerald-500 border-emerald-500 bg-gradient-to-b from-white to-slate-50`
                  : 'border-slate-200 hover:border-slate-300'
              }`}
            >
              <div>
                <div className="flex items-center justify-between mb-2 sm:mb-3">
                  <div
                    className={`w-8 h-8 sm:w-11 sm:h-11 rounded-lg sm:rounded-xl flex items-center justify-center transition group-hover:scale-105 shrink-0 ${
                      v.id === 'property' ? 'bg-emerald-100 text-emerald-700' :
                      v.id === 'cars' ? 'bg-blue-100 text-blue-700' :
                      v.id === 'equipment' ? 'bg-amber-100 text-amber-800' :
                      'bg-orange-100 text-orange-700'
                    }`}
                  >
                    <Icon className="w-4 h-4 sm:w-6 sm:h-6" />
                  </div>
                  <div className="w-6 h-6 sm:w-7 sm:h-7 rounded-full bg-slate-100 group-hover:bg-slate-900 group-hover:text-white text-slate-500 flex items-center justify-center transition">
                    <ArrowUpRight className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                  </div>
                </div>

                <h3 className="font-bold text-slate-900 text-xs sm:text-base group-hover:text-emerald-700 transition font-display truncate">
                  {v.title}
                </h3>
                <p className="text-[10px] sm:text-xs font-semibold text-slate-500 mb-1 sm:mb-2 truncate">
                  {v.subtitle}
                </p>
                <p className="hidden sm:block text-[11px] text-slate-600 line-clamp-2 leading-relaxed">
                  {v.description}
                </p>
              </div>

              <div className="mt-2 sm:mt-3 pt-2 sm:pt-2.5 border-t border-slate-100 flex items-center justify-between">
                <span className="text-[10px] sm:text-[11px] font-bold text-slate-700">
                  Explore
                </span>
                <span className={`text-[9px] sm:text-[10px] uppercase font-bold px-1.5 sm:px-2 py-0.5 rounded-full border ${v.badgeBg}`}>
                  Verified
                </span>
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
};
