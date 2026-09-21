import React, { useState } from 'react';
import { Search, MapPin, Building2, Car, Wrench, Hammer, ArrowRight, CheckCircle2 } from 'lucide-react';
import { MarketplaceVertical } from '../types';
import { NIGERIAN_STATES } from '../data/locations';

interface HeroProps {
  onSearch: (query: string, category: string, location: string) => void;
  selectedState: string;
  onSelectState: (state: string) => void;
  onSelectVertical: (vertical: MarketplaceVertical) => void;
}

export const Hero: React.FC<HeroProps> = ({
  onSearch,
  selectedState,
  onSelectState,
  onSelectVertical,
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('all');

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSearch(searchTerm, categoryFilter, selectedState);
  };

  return (
    <section className="relative overflow-hidden bg-gradient-to-b from-slate-900 via-slate-850 to-slate-900 text-white pt-6 sm:pt-10 pb-10 sm:pb-16 px-3 sm:px-6">
      {/* Subtle structural pattern background */}
      <div className="absolute inset-0 opacity-5 pointer-events-none bg-[radial-gradient(#ffffff_1px,transparent_1px)] [background-size:16px_16px]" />
      
      <div className="relative max-w-5xl mx-auto text-center">
        {/* Value badge */}
        <div className="inline-flex items-center gap-1.5 sm:gap-2 px-2.5 sm:px-3 py-1 rounded-full bg-slate-800/80 border border-slate-700 text-emerald-400 text-[11px] sm:text-xs font-semibold uppercase tracking-wider mb-3 sm:mb-5">
          <span className="w-1.5 h-1.5 sm:w-2 sm:h-2 rounded-full bg-emerald-400 animate-pulse" />
          The Focused Nigerian Marketplace
        </div>

        {/* Hero headline */}
        <h1 className="text-2xl sm:text-4xl md:text-5xl lg:text-6xl font-extrabold tracking-tight font-display text-white mb-2 sm:mb-4 leading-tight">
          Find Property, Cars & <br className="hidden sm:inline" />
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 via-teal-300 to-amber-300">
            Construction Solutions
          </span>
        </h1>

        <p className="text-xs sm:text-base md:text-lg text-slate-300 max-w-2xl mx-auto mb-5 sm:mb-8 font-normal leading-relaxed">
          Buy, sell, rent and find trusted professionals, heavy machinery, and construction materials across Nigeria.
        </p>

        {/* Integrated Search Console */}
        <form 
          onSubmit={handleSearchSubmit}
          className="bg-white p-2 sm:p-3 rounded-2xl shadow-2xl border border-slate-200/20 max-w-4xl mx-auto text-slate-900 text-left grid grid-cols-1 md:grid-cols-12 gap-2 sm:gap-3"
        >
          {/* Keyword Input */}
          <div className="md:col-span-5 relative flex items-center">
            <Search className="w-4 h-4 sm:w-5 sm:h-5 text-slate-400 absolute left-3 pointer-events-none" />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="e.g. Lekki Duplex, CAT 320, Camry, Cement..."
              className="w-full pl-9 sm:pl-10 pr-3 py-2.5 sm:py-2.5 text-base sm:text-sm rounded-xl bg-slate-50 focus:bg-white focus:ring-2 focus:ring-emerald-500/20 outline-none transition text-slate-900 placeholder:text-slate-400 font-medium min-h-[44px]"
            />
          </div>

          {/* Category Dropdown */}
          <div className="md:col-span-3">
            <select
              value={categoryFilter}
              onChange={(e) => setCategoryFilter(e.target.value)}
              className="w-full py-2.5 px-3 text-base sm:text-sm rounded-xl bg-slate-50 border border-slate-200 focus:bg-white focus:ring-2 focus:ring-emerald-500/20 outline-none text-slate-800 font-medium cursor-pointer min-h-[44px]"
            >
              <option value="all">All Categories</option>
              <option value="property">🏠 Real Estate (Property)</option>
              <option value="cars">🚗 Cars & Vehicles</option>
              <option value="equipment">🚜 Heavy Equipment (Buy/Rent)</option>
              <option value="construction">🏗 Construction (Materials/Services)</option>
            </select>
          </div>

          {/* Location Dropdown */}
          <div className="md:col-span-2 relative flex items-center">
            <MapPin className="w-4 h-4 text-emerald-600 absolute left-3 pointer-events-none" />
            <select
              value={selectedState}
              onChange={(e) => onSelectState(e.target.value)}
              className="w-full py-2.5 pl-8 pr-2 text-base sm:text-sm rounded-xl bg-slate-50 border border-slate-200 focus:bg-white focus:ring-2 focus:ring-emerald-500/20 outline-none text-slate-800 font-medium cursor-pointer min-h-[44px]"
            >
              {NIGERIAN_STATES.map((s) => (
                <option key={s.name} value={s.name}>{s.name}</option>
              ))}
            </select>
          </div>

          {/* Search CTA button */}
          <div className="md:col-span-2">
            <button
              type="submit"
              className="w-full h-full py-2.5 sm:py-2.5 px-4 bg-emerald-600 hover:bg-emerald-500 active:bg-emerald-700 text-white rounded-xl font-bold text-sm sm:text-sm transition flex items-center justify-center gap-1.5 shadow-md shadow-emerald-900/20 cursor-pointer min-h-[44px]"
            >
              <Search className="w-4 h-4" />
              <span>Search</span>
            </button>
          </div>
        </form>

        {/* Quick Category Chips for Fast 1-Tap Filter on Mobile */}
        <div className="mt-3 flex items-center justify-center gap-1.5 overflow-x-auto pb-1 scrollbar-none sm:hidden">
          {[
            { id: 'all', label: 'All' },
            { id: 'property', label: 'Property' },
            { id: 'cars', label: 'Vehicles' },
            { id: 'equipment', label: 'Machinery' },
            { id: 'construction', label: 'Materials' },
          ].map((chip) => (
            <button
              key={chip.id}
              type="button"
              onClick={() => {
                setCategoryFilter(chip.id);
                if (chip.id !== 'all') {
                  onSelectVertical(chip.id as MarketplaceVertical);
                }
              }}
              className={`px-2.5 py-1 rounded-full text-xs font-semibold whitespace-nowrap transition cursor-pointer ${
                categoryFilter === chip.id
                  ? 'bg-emerald-500 text-slate-950 font-bold'
                  : 'bg-slate-800/90 text-slate-300 hover:bg-slate-700'
              }`}
            >
              {chip.label}
            </button>
          ))}
        </div>

        {/* Trust Badges */}
        <div className="mt-6 sm:mt-8 flex flex-wrap items-center justify-center gap-3 sm:gap-8 text-[11px] sm:text-xs text-slate-400 font-medium">
          <div className="flex items-center gap-1.5">
            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
            <span>Title Document Validation (C of O / Gov. Consent)</span>
          </div>
          <div className="flex items-center gap-1.5">
            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
            <span>Customs Duty Verified Vehicles</span>
          </div>
          <div className="flex items-center gap-1.5">
            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
            <span>Certified Equipment Operators</span>
          </div>
        </div>
      </div>
    </section>
  );
};
