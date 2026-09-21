import React, { useState } from 'react';
import { 
  Building2, 
  Car, 
  Hammer, 
  Wrench, 
  MapPin, 
  Search, 
  PlusCircle, 
  LayoutDashboard, 
  FileText, 
  ChevronDown, 
  Menu, 
  X, 
  Store,
  ShieldCheck,
  Bell,
  Scale,
  MessageSquare,
  Heart,
  Shield,
  User,
  SlidersHorizontal
} from 'lucide-react';
import { MarketplaceVertical, UserAccount } from '../types';
import { NIGERIAN_STATES } from '../data/locations';

interface HeaderProps {
  currentUser: UserAccount;
  currentVertical: MarketplaceVertical;
  onSelectVertical: (vertical: MarketplaceVertical) => void;
  selectedState: string;
  onSelectState: (state: string) => void;
  selectedArea: string;
  onSelectArea: (area: string) => void;
  searchQuery: string;
  onSearchChange: (query: string) => void;
  onOpenPostModal: () => void;
  onOpenDashboard: (tab?: string) => void;
  onOpenPrdModal: () => void;
  onOpenAuthModal: () => void;
  onOpenAdminPortal: () => void;
  onOpenChat: () => void;
  unreadLeadsCount: number;
  unreadMessagesCount: number;
  unreadNotifsCount?: number;
  onToggleNotifications?: () => void;
  onOpenUserProfile?: () => void;
  favoritesCount: number;
  comparedCount: number;
  onOpenCompare: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  currentUser,
  currentVertical,
  onSelectVertical,
  selectedState,
  onSelectState,
  selectedArea,
  onSelectArea,
  searchQuery,
  onSearchChange,
  onOpenPostModal,
  onOpenDashboard,
  onOpenPrdModal,
  onOpenAuthModal,
  onOpenAdminPortal,
  onOpenChat,
  unreadLeadsCount,
  unreadMessagesCount,
  unreadNotifsCount = 0,
  onToggleNotifications,
  onOpenUserProfile,
  favoritesCount,
  comparedCount,
  onOpenCompare,
}) => {
  const [showLocationDropdown, setShowLocationDropdown] = useState(false);
  const [stateSearch, setStateSearch] = useState('');
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const activeStateObj = NIGERIAN_STATES.find((s) => s.name === selectedState) || NIGERIAN_STATES[0];

  const filteredStates = NIGERIAN_STATES.filter((s) => {
    if (!stateSearch.trim()) return true;
    const q = stateSearch.toLowerCase();
    return s.name.toLowerCase().includes(q) || s.code.toLowerCase().includes(q) || s.majorCity.toLowerCase().includes(q);
  });

  return (
    <header className="sticky top-0 z-40 bg-white border-b border-slate-200 shadow-xs">
      {/* Top utility alert bar */}
      <div className="bg-slate-900 text-slate-300 text-xs py-1.5 px-4">
        <div className="max-w-7xl mx-auto flex flex-wrap items-center justify-between gap-2">
          <div className="flex items-center gap-2">
            <span className="inline-flex items-center px-2 py-0.5 rounded text-[11px] font-semibold bg-emerald-950 text-emerald-300 border border-emerald-800">
              🇳🇬 Nigeria's Specialized Marketplace
            </span>
            <span className="hidden sm:inline text-slate-400">
              Verified Properties • Tokunbo Cars • Heavy Machinery Rental • Building Materials
            </span>
          </div>
          <div className="flex items-center gap-4 text-xs">
            <button 
              onClick={onOpenPrdModal}
              className="hover:text-white flex items-center gap-1.5 text-amber-400 font-medium transition cursor-pointer"
              title="View Complete Production PRD & System Architecture"
            >
              <FileText className="w-3.5 h-3.5" />
              <span>PRD Blueprint</span>
            </button>
            <span className="text-slate-600 hidden sm:inline">•</span>
            <span className="text-slate-400 hidden sm:inline flex items-center gap-1">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
              CAC & Title Verified Listings
            </span>
          </div>
        </div>
      </div>

      {/* Main Header Bar */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-3">
        <div className="flex items-center justify-between gap-3 md:gap-6">
          {/* Logo */}
          <button 
            onClick={() => onSelectVertical('all')}
            className="flex items-center gap-2.5 text-left group cursor-pointer shrink-0"
          >
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-emerald-600 to-teal-800 text-white flex items-center justify-center font-bold shadow-md shadow-emerald-900/10 group-hover:scale-105 transition">
              <Building2 className="w-5 h-5 text-amber-300" />
            </div>
            <div>
              <div className="flex items-center gap-1">
                <span className="text-xl font-extrabold tracking-tight text-slate-900 font-display">
                  StrucTrade
                </span>
                <span className="text-xs font-black uppercase px-1.5 py-0.5 rounded bg-amber-100 text-amber-900 border border-amber-300">
                  NG
                </span>
              </div>
              <p className="text-[10px] text-slate-500 font-medium tracking-wide uppercase">
                Property • Vehicles • Construction
              </p>
            </div>
          </button>

          {/* Location Selector (Nigeria States & Areas) - Desktop */}
          <div className="relative shrink-0 hidden lg:block">
            <button
              onClick={() => setShowLocationDropdown(!showLocationDropdown)}
              className="flex items-center gap-2 px-3 py-2 rounded-lg border border-slate-200 bg-slate-50 hover:bg-slate-100 text-slate-800 text-sm font-medium transition cursor-pointer"
            >
              <MapPin className="w-4 h-4 text-emerald-600 shrink-0" />
              <div className="text-left leading-tight">
                <span className="block text-[11px] text-slate-500 uppercase font-semibold">Location</span>
                <span className="font-semibold text-slate-900">
                  {selectedArea === 'All ' + selectedState || !selectedArea ? selectedState : selectedArea}
                </span>
              </div>
              <ChevronDown className="w-4 h-4 text-slate-400 ml-1" />
            </button>

            {showLocationDropdown && (
              <div className="absolute left-0 mt-2 w-80 sm:w-96 bg-white rounded-xl shadow-xl border border-slate-200 p-3 z-50 animate-in fade-in slide-in-from-top-2 duration-150">
                <div className="flex items-center justify-between mb-2">
                  <div className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
                    Select Nigerian State (36 States + FCT)
                  </div>
                  <span className="text-[10px] text-emerald-700 font-bold bg-emerald-50 px-1.5 py-0.5 rounded">
                    {NIGERIAN_STATES.length} States
                  </span>
                </div>

                {/* State Quick Search */}
                <div className="relative mb-2.5">
                  <Search className="w-3.5 h-3.5 text-slate-400 absolute left-2.5 top-2.5 pointer-events-none" />
                  <input
                    type="text"
                    value={stateSearch}
                    onChange={(e) => setStateSearch(e.target.value)}
                    placeholder="Search state (e.g. Kano, Rivers, Enugu, Oyo)..."
                    className="w-full pl-8 pr-2.5 py-1.5 bg-slate-50 border border-slate-200 focus:border-emerald-600 focus:bg-white rounded-lg text-xs outline-none transition"
                  />
                  {stateSearch && (
                    <button
                      onClick={() => setStateSearch('')}
                      className="absolute right-2 top-2 text-[10px] text-slate-400 hover:text-slate-600 cursor-pointer"
                    >
                      Clear
                    </button>
                  )}
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-3 gap-1 mb-3 max-h-44 overflow-y-auto pr-1">
                  {filteredStates.map((state) => (
                    <button
                      key={state.name}
                      onClick={() => {
                        onSelectState(state.name);
                        onSelectArea(state.areas[0]);
                      }}
                      className={`text-left px-2 py-1.5 text-xs rounded-md transition font-medium truncate ${
                        selectedState === state.name 
                          ? 'bg-emerald-50 text-emerald-700 font-semibold border border-emerald-200' 
                          : 'text-slate-700 hover:bg-slate-100'
                      }`}
                      title={`${state.name} (${state.majorCity})`}
                    >
                      {state.name}
                    </button>
                  ))}
                  {filteredStates.length === 0 && (
                    <div className="col-span-2 sm:col-span-3 text-center py-3 text-xs text-slate-400">
                      No matching state found for "{stateSearch}"
                    </div>
                  )}
                </div>

                <div className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2 border-t border-slate-100 pt-2 flex items-center justify-between">
                  <span>{selectedState} Commercial Hubs / Areas</span>
                  <span className="text-[10px] text-slate-500 font-normal">
                    {activeStateObj.areas.length} locations
                  </span>
                </div>
                <div className="max-h-40 overflow-y-auto space-y-1 pr-1">
                  {activeStateObj.areas.map((area) => (
                    <button
                      key={area}
                      onClick={() => {
                        onSelectArea(area);
                        setShowLocationDropdown(false);
                      }}
                      className={`w-full text-left px-2.5 py-1.5 text-xs rounded-md transition ${
                        selectedArea === area
                          ? 'bg-emerald-600 text-white font-medium'
                          : 'text-slate-700 hover:bg-slate-100'
                      }`}
                    >
                      {area}
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Quick Search Bar (Desktop) */}
          <div className="flex-1 max-w-xl relative hidden md:block">
            <div className="relative flex items-center">
              <Search className="w-4 h-4 text-slate-400 absolute left-3 pointer-events-none" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => onSearchChange(e.target.value)}
                placeholder="Search Lekki duplex, Tokunbo Camry, CAT excavator, cement..."
                className="w-full pl-9 pr-4 py-2 bg-slate-50 border border-slate-200 focus:border-emerald-600 focus:bg-white focus:ring-2 focus:ring-emerald-500/10 rounded-lg text-sm transition outline-none"
              />
            </div>
          </div>

          {/* Mobile Location Quick Pill */}
          <button
            onClick={() => setShowLocationDropdown(!showLocationDropdown)}
            className="lg:hidden flex items-center gap-1 px-2 py-1.5 rounded-lg border border-slate-200 bg-slate-50 text-slate-800 text-xs font-bold transition shrink-0 max-w-[120px] truncate"
            title="Change Nigerian State"
          >
            <MapPin className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
            <span className="truncate">{selectedState}</span>
            <ChevronDown className="w-3 h-3 text-slate-400 shrink-0" />
          </button>

          {/* Header Action CTAs */}
          <div className="flex items-center gap-1.5 sm:gap-2">
            {/* Compare items button */}
            {comparedCount > 0 && (
              <button
                onClick={onOpenCompare}
                className="hidden lg:flex items-center gap-1 px-2.5 py-1.5 rounded-lg border border-emerald-300 bg-emerald-50 text-emerald-800 text-xs font-bold transition cursor-pointer"
                title="Compare saved listings"
              >
                <Scale className="w-3.5 h-3.5 text-emerald-600" />
                <span>Compare</span>
                <span className="px-1.5 py-0.2 rounded-full bg-emerald-600 text-white text-[10px]">
                  {comparedCount}
                </span>
              </button>
            )}

            {/* Trade Chat shortcut */}
            <button
              onClick={onOpenChat}
              className="p-2 text-slate-700 hover:text-slate-900 bg-slate-100 hover:bg-slate-200 rounded-lg text-sm font-medium transition cursor-pointer relative"
              title="Open Trade Messages"
            >
              <MessageSquare className="w-4 h-4 text-slate-600" />
              {unreadMessagesCount > 0 && (
                <span className="absolute -top-1 -right-1 bg-emerald-600 text-white text-[9px] font-extrabold px-1 rounded-full">
                  {unreadMessagesCount}
                </span>
              )}
            </button>

            {/* Notification Center Bell */}
            <button
              onClick={onToggleNotifications}
              className="p-2 text-slate-700 hover:text-slate-900 bg-slate-100 hover:bg-slate-200 rounded-lg text-sm font-medium transition cursor-pointer relative"
              title="Notifications (Leads, Viewings & System Alerts)"
            >
              <Bell className="w-4 h-4 text-slate-600" />
              {unreadNotifsCount > 0 && (
                <span className="absolute -top-1 -right-1 bg-rose-500 text-white text-[9px] font-extrabold px-1 rounded-full animate-pulse">
                  {unreadNotifsCount}
                </span>
              )}
            </button>

            {/* Admin Portal link */}
            <button
              onClick={onOpenAdminPortal}
              className={`hidden sm:flex items-center gap-1 px-2.5 py-2 rounded-lg text-xs font-bold transition cursor-pointer ${
                currentUser.role === 'admin'
                  ? 'bg-purple-900 text-purple-200 border border-purple-700 shadow-xs'
                  : 'bg-slate-100 hover:bg-slate-200 text-slate-700'
              }`}
              title="StrucTrade Trust & Admin Moderation Center"
            >
              <Shield className="w-3.5 h-3.5 text-purple-400" />
              <span className="hidden xl:inline">Admin Moderation</span>
            </button>

            {/* User Profile & Persona Switcher */}
            <div className="flex items-center border border-slate-200 rounded-lg overflow-hidden bg-slate-50/50 hover:bg-slate-50 transition">
              <button
                onClick={onOpenUserProfile || onOpenAuthModal}
                className="flex items-center gap-1.5 px-2.5 py-1.5 hover:bg-slate-100 transition cursor-pointer text-left"
                title="View & Edit User Profile"
              >
                <div className="w-6 h-6 rounded-full bg-slate-900 text-white flex items-center justify-center text-[10px] font-bold shrink-0">
                  {currentUser.name.charAt(0)}
                </div>
                <div className="hidden xl:block leading-tight">
                  <span className="text-[11px] font-bold text-slate-900 block truncate max-w-[90px]">
                    {currentUser.name}
                  </span>
                  <span className="text-[9px] text-emerald-700 font-semibold block capitalize">
                    {currentUser.role}
                  </span>
                </div>
              </button>
              <button
                onClick={onOpenAuthModal}
                className="px-1.5 py-2 text-[10px] text-slate-500 hover:text-slate-900 hover:bg-slate-200 border-l border-slate-200 transition cursor-pointer"
                title="Switch Demo Persona / Login"
              >
                Switch
              </button>
            </div>

            {/* My Dashboard button with lead badge */}
            <button
              onClick={() => onOpenDashboard()}
              className="flex items-center gap-1.5 px-3 py-2 text-slate-700 hover:text-slate-900 bg-slate-100 hover:bg-slate-200 rounded-lg text-sm font-medium transition cursor-pointer relative"
              title="Open My Marketplace Dashboard"
            >
              <LayoutDashboard className="w-4 h-4 text-slate-600" />
              <span className="hidden sm:inline">Dashboard</span>
              {unreadLeadsCount > 0 && (
                <span className="bg-rose-500 text-white text-[10px] font-bold px-1.5 py-0.5 rounded-full min-w-[18px] text-center">
                  {unreadLeadsCount}
                </span>
              )}
            </button>

            {/* Post Listing CTA */}
            <button
              onClick={onOpenPostModal}
              className="flex items-center gap-1.5 px-3.5 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg text-sm font-semibold shadow-xs hover:shadow-sm transition cursor-pointer"
            >
              <PlusCircle className="w-4 h-4" />
              <span className="hidden sm:inline">Post Listing</span>
            </button>

            {/* Mobile menu toggle */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 text-slate-600 hover:bg-slate-100 rounded-lg md:hidden"
            >
              {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>

        {/* Mobile search bar if on small screens */}
        <div className="mt-2.5 md:hidden">
          <div className="relative flex items-center">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 pointer-events-none" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => onSearchChange(e.target.value)}
              placeholder="Search Lekki duplex, Tokunbo, CAT..."
              className="w-full pl-9 pr-8 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-base sm:text-sm outline-none focus:border-emerald-600 focus:bg-white transition"
            />
            {searchQuery && (
              <button
                onClick={() => onSearchChange('')}
                className="absolute right-2.5 text-xs text-slate-400 hover:text-slate-600 p-1"
                title="Clear search"
              >
                ✕
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Primary Category Navigation Bar */}
      <nav className="border-t border-slate-100 bg-slate-50/70 overflow-x-auto scrollbar-none" style={{ WebkitOverflowScrolling: 'touch' }}>
        <div className="max-w-7xl mx-auto px-3 sm:px-6 flex items-center gap-1.5 sm:gap-2 py-2">
          <button
            onClick={() => onSelectVertical('all')}
            className={`px-3 py-1.5 text-xs font-semibold rounded-md transition whitespace-nowrap cursor-pointer ${
              currentVertical === 'all'
                ? 'bg-slate-900 text-white'
                : 'text-slate-600 hover:bg-slate-200/60'
            }`}
          >
            All Verticals
          </button>

          <button
            onClick={() => onSelectVertical('property')}
            className={`flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-md transition whitespace-nowrap cursor-pointer ${
              currentVertical === 'property'
                ? 'bg-emerald-600 text-white'
                : 'text-slate-600 hover:bg-slate-200/60'
            }`}
          >
            <Building2 className="w-3.5 h-3.5" />
            <span>Property (Real Estate)</span>
          </button>

          <button
            onClick={() => onSelectVertical('cars')}
            className={`flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-md transition whitespace-nowrap cursor-pointer ${
              currentVertical === 'cars'
                ? 'bg-blue-600 text-white'
                : 'text-slate-600 hover:bg-slate-200/60'
            }`}
          >
            <Car className="w-3.5 h-3.5" />
            <span>Cars & Vehicles</span>
          </button>

          <button
            onClick={() => onSelectVertical('equipment')}
            className={`flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-md transition whitespace-nowrap cursor-pointer ${
              currentVertical === 'equipment'
                ? 'bg-amber-600 text-white'
                : 'text-slate-600 hover:bg-slate-200/60'
            }`}
          >
            <Wrench className="w-3.5 h-3.5" />
            <span>Construction Equipment</span>
          </button>

          <button
            onClick={() => onSelectVertical('construction')}
            className={`flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-md transition whitespace-nowrap cursor-pointer ${
              currentVertical === 'construction'
                ? 'bg-orange-600 text-white'
                : 'text-slate-600 hover:bg-slate-200/60'
            }`}
          >
            <Hammer className="w-3.5 h-3.5" />
            <span>Materials & Contractors</span>
          </button>

          <button
            onClick={() => onSelectVertical('businesses')}
            className={`flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-md transition whitespace-nowrap cursor-pointer ${
              currentVertical === 'businesses'
                ? 'bg-slate-800 text-white'
                : 'text-slate-600 hover:bg-slate-200/60'
            }`}
          >
            <Store className="w-3.5 h-3.5" />
            <span>Dealerships & Agencies</span>
          </button>
        </div>
      </nav>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="md:hidden border-t border-slate-200 bg-white p-4 space-y-3">
          <div className="text-xs font-semibold text-slate-400 uppercase">Select Location</div>
          <select 
            value={selectedState} 
            onChange={(e) => {
              onSelectState(e.target.value);
              const found = NIGERIAN_STATES.find(s => s.name === e.target.value);
              if (found) onSelectArea(found.areas[0]);
            }}
            className="w-full p-2 text-sm border border-slate-200 rounded-lg bg-slate-50 font-medium"
          >
            {NIGERIAN_STATES.map((s) => (
              <option key={s.name} value={s.name}>{s.name}</option>
            ))}
          </select>

          <div className="pt-2 border-t border-slate-100 flex flex-col gap-2">
            <button
              onClick={() => {
                onOpenPostModal();
                setMobileMenuOpen(false);
              }}
              className="flex items-center justify-center gap-2 p-3 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-sm font-bold shadow-xs transition"
            >
              <PlusCircle className="w-4 h-4" />
              <span>+ Post a New Listing</span>
            </button>

            <button
              onClick={() => {
                onOpenDashboard();
                setMobileMenuOpen(false);
              }}
              className="flex items-center gap-2.5 p-2.5 text-slate-800 hover:bg-slate-50 rounded-lg text-sm font-medium"
            >
              <LayoutDashboard className="w-4 h-4 text-emerald-600" />
              <span>Seller / User Dashboard</span>
              {unreadLeadsCount > 0 && (
                <span className="ml-auto bg-rose-500 text-white text-xs px-2 py-0.5 rounded-full font-bold">
                  {unreadLeadsCount} Leads
                </span>
              )}
            </button>

            <button
              onClick={() => {
                if (onOpenUserProfile) onOpenUserProfile();
                else onOpenAuthModal();
                setMobileMenuOpen(false);
              }}
              className="flex items-center gap-2.5 p-2.5 text-slate-800 hover:bg-slate-50 rounded-lg text-sm font-medium"
            >
              <div className="w-5 h-5 rounded-full bg-slate-900 text-white flex items-center justify-center text-[10px] font-bold">
                {currentUser.name.charAt(0)}
              </div>
              <div className="text-left leading-tight">
                <span className="block font-bold text-slate-900">{currentUser.name}</span>
                <span className="text-[11px] text-slate-500">{currentUser.phone || 'Tap to configure contact info'}</span>
              </div>
              <span className="ml-auto text-xs text-emerald-600 font-bold">Manage</span>
            </button>

            <button
              onClick={() => {
                if (onToggleNotifications) onToggleNotifications();
                setMobileMenuOpen(false);
              }}
              className="flex items-center gap-2.5 p-2.5 text-slate-800 hover:bg-slate-50 rounded-lg text-sm font-medium"
            >
              <Bell className="w-4 h-4 text-slate-600" />
              <span>Activity & Inquiries Notifications</span>
              {unreadNotifsCount > 0 && (
                <span className="ml-auto bg-rose-500 text-white text-xs px-2 py-0.5 rounded-full font-bold">
                  {unreadNotifsCount} New
                </span>
              )}
            </button>

            <button
              onClick={() => {
                onOpenAdminPortal();
                setMobileMenuOpen(false);
              }}
              className="flex items-center gap-2.5 p-2.5 text-purple-700 bg-purple-50 hover:bg-purple-100 rounded-lg text-sm font-semibold"
            >
              <Shield className="w-4 h-4 text-purple-600" />
              <span>Admin Moderation & KYC Center</span>
            </button>

            <button
              onClick={() => {
                onOpenPrdModal();
                setMobileMenuOpen(false);
              }}
              className="flex items-center gap-2.5 p-2.5 text-amber-700 bg-amber-50 hover:bg-amber-100 rounded-lg text-sm font-semibold"
            >
              <FileText className="w-4 h-4" />
              <span>View Full Production PRD & System Schema</span>
            </button>
          </div>
        </div>
      )}
    </header>
  );
};
