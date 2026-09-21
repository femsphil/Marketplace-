import React, { useState } from 'react';
import { 
  Building2, 
  Wrench, 
  Users, 
  Calendar, 
  Clock, 
  CheckCircle, 
  XCircle, 
  Phone, 
  Mail, 
  MapPin, 
  Eye, 
  MessageSquare, 
  TrendingUp, 
  ShieldCheck, 
  Plus, 
  FileText,
  BadgeCheck,
  Truck,
  UserCheck,
  AlertCircle,
  Pause,
  Play,
  Check,
  Trash2,
  Sparkles,
  ArrowRight,
  Heart,
  CreditCard,
  Layers,
  ChevronRight,
  RotateCw,
  BarChart3
} from 'lucide-react';
import { MarketplaceItem, ViewingRequest, RentalRequest, Lead, UserAccount, PaymentTransaction, ChatConversation } from '../types';
import { formatFullNaira } from '../lib/formatters';

interface DashboardProps {
  currentUser: UserAccount;
  myListings: MarketplaceItem[];
  viewingRequests: ViewingRequest[];
  rentalRequests: RentalRequest[];
  leads: Lead[];
  conversations: ChatConversation[];
  favorites: MarketplaceItem[];
  transactions: PaymentTransaction[];
  onOpenPostListing: () => void;
  onUpdateViewingStatus: (id: string, status: 'Confirmed' | 'Completed' | 'Cancelled') => void;
  onUpdateRentalStatus: (id: string, status: 'Approved' | 'Declined' | 'Returned') => void;
  onUpdateLeadStatus: (id: string, status: Lead['status']) => void;
  onOpenChat: (convId?: string, targetListing?: MarketplaceItem) => void;
  onRemoveFavorite: (id: string) => void;
  onOpenListingDetail: (item: MarketplaceItem) => void;
  onUpgradePlan: () => void;
  onPromoteListing: (item: MarketplaceItem) => void;
  onPauseListing: (id: string) => void;
  onRenewListing: (id: string) => void;
  onMarkSold: (id: string) => void;
  onDeleteListing: (id: string) => void;
}

export const Dashboard: React.FC<DashboardProps> = ({
  currentUser,
  myListings,
  viewingRequests,
  rentalRequests,
  leads,
  conversations,
  favorites,
  transactions,
  onOpenPostListing,
  onUpdateViewingStatus,
  onUpdateRentalStatus,
  onUpdateLeadStatus,
  onOpenChat,
  onRemoveFavorite,
  onOpenListingDetail,
  onUpgradePlan,
  onPromoteListing,
  onPauseListing,
  onRenewListing,
  onMarkSold,
  onDeleteListing,
}) => {
  const [activeTab, setActiveTab] = useState<'overview' | 'listings' | 'analytics' | 'leads' | 'viewings' | 'rentals' | 'messages' | 'favorites' | 'plans'>('overview');
  const [listingFilter, setListingFilter] = useState<'all' | 'Active' | 'Paused' | 'Sold' | 'Expired'>('all');

  const pendingViewingsCount = viewingRequests.filter((r) => r.status === 'Pending').length;
  const pendingRentalsCount = rentalRequests.filter((r) => r.status === 'Pending Review').length;
  const newLeadsCount = leads.filter((l) => l.status === 'New').length;

  const filteredListings = myListings.filter((item) => {
    if (listingFilter === 'all') return true;
    return (item.status || 'Active') === listingFilter;
  });

  return (
    <div className="space-y-6">
      {/* Top Welcome & Quick Actions Bar */}
      <div className="bg-slate-900 text-white rounded-2xl p-5 sm:p-6 shadow-xs flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-xs font-semibold text-emerald-400 uppercase tracking-wider mb-1">
            <ShieldCheck className="w-4 h-4 text-emerald-400" />
            <span>{currentUser.role === 'professional' ? 'Commercial Trade Merchant Portal' : 'User Account & Inventory Hub'}</span>
          </div>
          <h1 className="text-xl sm:text-2xl font-bold font-display">
            Welcome, {currentUser.businessName || currentUser.name}
          </h1>
          <p className="text-xs text-slate-300 mt-1">
            Active Tier: <span className="text-emerald-400 font-bold">{currentUser.plan} Plan</span> • {myListings.length} of {currentUser.maxListings} Listings Utilized
          </p>
        </div>

        <div className="grid grid-cols-2 sm:flex items-center gap-2 sm:gap-2.5 w-full sm:w-auto">
          <button
            onClick={onUpgradePlan}
            className="py-2.5 px-3 sm:px-4 bg-slate-800 hover:bg-slate-700 active:bg-slate-600 text-emerald-400 border border-slate-700 rounded-xl text-xs font-bold transition flex items-center justify-center gap-1.5 cursor-pointer min-h-[44px]"
          >
            <CreditCard className="w-4 h-4 shrink-0" />
            <span className="truncate">Upgrade Tier</span>
          </button>
          <button
            onClick={onOpenPostListing}
            className="py-2.5 px-3 sm:px-4 bg-emerald-600 hover:bg-emerald-700 active:bg-emerald-800 text-white rounded-xl text-xs font-bold transition flex items-center justify-center gap-1.5 shadow-md shadow-emerald-900/30 cursor-pointer min-h-[44px]"
          >
            <Plus className="w-4 h-4 shrink-0" />
            <span className="truncate">Post Listing</span>
          </button>
        </div>
      </div>

      {/* Navigation Sub-Tabs */}
      <div 
        className="flex items-center gap-1.5 sm:gap-2 overflow-x-auto pb-2 border-b border-slate-200 scrollbar-none -mx-4 px-4 sm:mx-0 sm:px-0"
        style={{ WebkitOverflowScrolling: 'touch' }}
      >
        {[
          { id: 'overview', label: 'Overview', badge: null },
          { id: 'listings', label: 'My Listings', badge: myListings.length },
          { id: 'analytics', label: 'Listing Analytics', badge: null },
          { id: 'leads', label: 'Lead Pipeline', badge: newLeadsCount },
          { id: 'viewings', label: 'Viewing Requests', badge: pendingViewingsCount },
          { id: 'rentals', label: 'Equipment Rentals', badge: pendingRentalsCount },
          { id: 'messages', label: 'Trade Messages', badge: conversations.length },
          { id: 'favorites', label: 'Saved Favorites', badge: favorites.length },
          { id: 'plans', label: 'Plans & Payments', badge: null },
        ].map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id as any)}
            className={`py-2 px-3 sm:px-3.5 rounded-xl text-xs font-bold transition whitespace-nowrap flex items-center gap-1.5 cursor-pointer min-h-[40px] shrink-0 ${
              activeTab === tab.id
                ? 'bg-slate-900 text-white shadow-xs'
                : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
            }`}
          >
            <span>{tab.label}</span>
            {tab.badge !== null && tab.badge > 0 && (
              <span
                className={`text-[10px] px-1.5 py-0.2 rounded-full font-extrabold ${
                  activeTab === tab.id
                    ? 'bg-emerald-500 text-slate-950'
                    : 'bg-emerald-100 text-emerald-800'
                }`}
              >
                {tab.badge}
              </span>
            )}
          </button>
        ))}
      </div>

      {/* TAB 1: OVERVIEW */}
      {activeTab === 'overview' && (
        <div className="space-y-6">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs">
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs font-semibold text-slate-500">Active Listings</span>
                <div className="w-8 h-8 rounded-lg bg-emerald-50 text-emerald-600 flex items-center justify-center">
                  <FileText className="w-4 h-4" />
                </div>
              </div>
              <p className="text-2xl font-bold font-display text-slate-900">{myListings.length}</p>
              <p className="text-[11px] text-slate-400 mt-1">Cap: {currentUser.maxListings} allowed</p>
            </div>

            <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs">
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs font-semibold text-slate-500">New Qualified Leads</span>
                <div className="w-8 h-8 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center">
                  <Users className="w-4 h-4" />
                </div>
              </div>
              <p className="text-2xl font-bold font-display text-blue-900">{newLeadsCount}</p>
              <p className="text-[11px] text-slate-400 mt-1">Pending buyer follow-ups</p>
            </div>

            <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs">
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs font-semibold text-slate-500">Pending Viewings</span>
                <div className="w-8 h-8 rounded-lg bg-purple-50 text-purple-600 flex items-center justify-center">
                  <Calendar className="w-4 h-4" />
                </div>
              </div>
              <p className="text-2xl font-bold font-display text-purple-900">{pendingViewingsCount}</p>
              <p className="text-[11px] text-slate-400 mt-1">Physical inspections scheduled</p>
            </div>

            <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs">
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs font-semibold text-slate-500">Plant Hire Orders</span>
                <div className="w-8 h-8 rounded-lg bg-amber-50 text-amber-600 flex items-center justify-center">
                  <Wrench className="w-4 h-4" />
                </div>
              </div>
              <p className="text-2xl font-bold font-display text-amber-900">{pendingRentalsCount}</p>
              <p className="text-[11px] text-slate-400 mt-1">Equipment requisition orders</p>
            </div>
          </div>

          {/* Quick Action Matrix */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Recent Leads Preview */}
            <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs space-y-3">
              <div className="flex items-center justify-between">
                <h3 className="font-bold text-sm text-slate-900 font-display">Recent Commercial Inquiries</h3>
                <button
                  onClick={() => setActiveTab('leads')}
                  className="text-xs font-bold text-emerald-700 hover:text-emerald-800"
                >
                  View Pipeline →
                </button>
              </div>
              <div className="divide-y divide-slate-100">
                {leads.slice(0, 3).map((lead) => (
                  <div key={lead.id} className="py-2.5 flex items-center justify-between gap-3 text-xs">
                    <div>
                      <span className="font-bold text-slate-900 block">{lead.clientName}</span>
                      <span className="text-slate-500 text-[11px] truncate block max-w-xs">{lead.listingTitle}</span>
                    </div>
                    <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-slate-100 text-slate-700 shrink-0">
                      {lead.status}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* Quick Inspection Schedule */}
            <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs space-y-3">
              <div className="flex items-center justify-between">
                <h3 className="font-bold text-sm text-slate-900 font-display">Upcoming Physical Viewings</h3>
                <button
                  onClick={() => setActiveTab('viewings')}
                  className="text-xs font-bold text-emerald-700 hover:text-emerald-800"
                >
                  View All ({viewingRequests.length}) →
                </button>
              </div>
              <div className="divide-y divide-slate-100">
                {viewingRequests.slice(0, 3).map((v) => (
                  <div key={v.id} className="py-2.5 flex items-center justify-between gap-3 text-xs">
                    <div>
                      <span className="font-bold text-slate-900 block">{v.seekerName}</span>
                      <span className="text-slate-500 text-[11px]">
                        {v.preferredDate} at {v.preferredTime}
                      </span>
                    </div>
                    <span className={`px-2 py-0.5 rounded text-[10px] font-bold shrink-0 ${
                      v.status === 'Pending' ? 'bg-amber-100 text-amber-800' : 'bg-emerald-100 text-emerald-800'
                    }`}>
                      {v.status}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* TAB 2: MY LISTINGS & MANAGEMENT */}
      {activeTab === 'listings' && (
        <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-xs space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div>
              <h2 className="text-base font-bold text-slate-900 font-display">
                Inventory Lifecycle & Asset Management
              </h2>
              <p className="text-xs text-slate-500">
                PRD Section 32: Edit, Pause, Renew (30-day expiration policy), Mark Sold, or Promote.
              </p>
            </div>

            <div className="flex items-center gap-2">
              {(['all', 'Active', 'Paused', 'Sold', 'Expired'] as const).map((filter) => (
                <button
                  key={filter}
                  onClick={() => setListingFilter(filter)}
                  className={`py-1.5 px-3 rounded-lg text-xs font-bold transition cursor-pointer ${
                    listingFilter === filter
                      ? 'bg-slate-900 text-white'
                      : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                  }`}
                >
                  {filter}
                </button>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredListings.map((item) => {
              const isPaused = item.status === 'Paused';
              const isSold = item.status === 'Sold';
              const isExpired = item.status === 'Expired';

              return (
                <div key={item.id} className="border border-slate-200 rounded-xl overflow-hidden bg-white shadow-2xs flex flex-col justify-between">
                  <div>
                    <div className="h-36 bg-slate-100 overflow-hidden relative">
                      <img src={item.images[0]} alt={item.title} className="w-full h-full object-cover" />
                      <span className="absolute top-2 left-2 px-2 py-0.5 rounded text-[10px] font-bold uppercase bg-slate-900/80 text-white">
                        {item.vertical}
                      </span>
                      <span className={`absolute top-2 right-2 px-2 py-0.5 rounded text-[10px] font-bold ${
                        isPaused ? 'bg-amber-500 text-white' :
                        isSold ? 'bg-blue-600 text-white' :
                        isExpired ? 'bg-rose-600 text-white' :
                        'bg-emerald-600 text-white'
                      }`}>
                        {item.status || 'Active'}
                      </span>
                    </div>

                    <div className="p-3.5 space-y-1.5">
                      <h4
                        onClick={() => onOpenListingDetail(item)}
                        className="font-bold text-slate-900 text-xs line-clamp-1 hover:text-emerald-700 cursor-pointer"
                      >
                        {item.title}
                      </h4>
                      <p className="text-sm font-extrabold text-slate-900 font-display">
                        {formatFullNaira(item.price)}
                      </p>
                      <p className="text-[11px] text-slate-500">
                        {item.location.area}, {item.location.state}
                      </p>

                      {/* Expiration warning banner (PRD Section 33) */}
                      <div className="p-2 rounded-lg bg-slate-50 border border-slate-200 flex items-center justify-between text-[10px] text-slate-600">
                        <span>Expires in 28 days</span>
                        <button
                          onClick={() => onRenewListing(item.id)}
                          className="font-bold text-emerald-700 hover:text-emerald-800 flex items-center gap-0.5 cursor-pointer"
                        >
                          <RotateCw className="w-3 h-3" />
                          <span>Renew</span>
                        </button>
                      </div>
                    </div>
                  </div>

                  {/* Seller Action Toolbar */}
                  <div className="p-3 border-t border-slate-100 bg-slate-50/50 flex flex-wrap items-center justify-between gap-2 text-xs">
                    <button
                      onClick={() => onPromoteListing(item)}
                      className="py-1 px-2.5 rounded-md bg-amber-50 hover:bg-amber-100 text-amber-800 font-bold flex items-center gap-1 border border-amber-200 cursor-pointer text-[11px]"
                    >
                      <Sparkles className="w-3 h-3" />
                      <span>Boost</span>
                    </button>

                    <div className="flex items-center gap-1.5 ml-auto">
                      <button
                        onClick={() => onPauseListing(item.id)}
                        className="p-1.5 text-slate-600 hover:text-slate-900 rounded hover:bg-slate-200 transition cursor-pointer"
                        title={isPaused ? 'Resume Listing' : 'Pause Listing'}
                      >
                        {isPaused ? <Play className="w-3.5 h-3.5" /> : <Pause className="w-3.5 h-3.5" />}
                      </button>

                      <button
                        onClick={() => onMarkSold(item.id)}
                        className="py-1 px-2 rounded-md bg-slate-200 hover:bg-slate-300 text-slate-800 font-bold text-[11px] cursor-pointer"
                        title="Mark as Sold / Off Market"
                      >
                        {isSold ? 'Sold' : 'Mark Sold'}
                      </button>

                      <button
                        onClick={() => onDeleteListing(item.id)}
                        className="p-1.5 text-rose-500 hover:text-rose-700 rounded hover:bg-rose-50 transition cursor-pointer"
                        title="Delete Listing"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* TAB: LISTING ANALYTICS (PRD Section 66 MVP Scope) */}
      {activeTab === 'analytics' && (
        <div className="space-y-6">
          {/* Header & Filter */}
          <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <div className="flex items-center gap-2">
                <BarChart3 className="w-5 h-5 text-emerald-600" />
                <h2 className="text-base font-bold text-slate-900 font-display">
                  Listing Analytics & Buyer Engagement
                </h2>
              </div>
              <p className="text-xs text-slate-500 mt-0.5">
                Real-time conversion metrics, phone reveals, WhatsApp inquiries, and impressions across Nigerian States.
              </p>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-xs text-slate-500">Period:</span>
              <span className="text-xs font-bold text-slate-800 bg-slate-100 px-3 py-1.5 rounded-lg border border-slate-200">
                Last 30 Days
              </span>
            </div>
          </div>

          {/* Aggregated Analytics KPIs */}
          <div className="grid grid-cols-2 lg:grid-cols-5 gap-3 sm:gap-4">
            <div className="bg-white rounded-2xl p-4 border border-slate-200 shadow-xs">
              <div className="flex items-center justify-between text-slate-400 text-xs mb-1">
                <span>Total Impressions</span>
                <Eye className="w-4 h-4 text-blue-500" />
              </div>
              <p className="text-2xl font-extrabold text-slate-900 font-display">18,420</p>
              <span className="text-[10px] text-emerald-700 font-semibold">↑ 24% vs last month</span>
            </div>

            <div className="bg-white rounded-2xl p-4 border border-slate-200 shadow-xs">
              <div className="flex items-center justify-between text-slate-400 text-xs mb-1">
                <span>Listing Views</span>
                <Layers className="w-4 h-4 text-indigo-500" />
              </div>
              <p className="text-2xl font-extrabold text-slate-900 font-display">4,180</p>
              <span className="text-[10px] text-emerald-700 font-semibold">22.7% click-through</span>
            </div>

            <div className="bg-white rounded-2xl p-4 border border-slate-200 shadow-xs">
              <div className="flex items-center justify-between text-slate-400 text-xs mb-1">
                <span>Phone Reveals</span>
                <Phone className="w-4 h-4 text-emerald-600" />
              </div>
              <p className="text-2xl font-extrabold text-slate-900 font-display">392</p>
              <span className="text-[10px] text-slate-500 font-semibold">Direct call clicks</span>
            </div>

            <div className="bg-white rounded-2xl p-4 border border-slate-200 shadow-xs">
              <div className="flex items-center justify-between text-slate-400 text-xs mb-1">
                <span>WhatsApp Discussions</span>
                <MessageSquare className="w-4 h-4 text-emerald-500" />
              </div>
              <p className="text-2xl font-extrabold text-slate-900 font-display">284</p>
              <span className="text-[10px] text-emerald-700 font-semibold">High-intent chats</span>
            </div>

            <div className="bg-white rounded-2xl p-4 border border-slate-200 shadow-xs col-span-2 lg:col-span-1">
              <div className="flex items-center justify-between text-slate-400 text-xs mb-1">
                <span>Lead Conversion</span>
                <TrendingUp className="w-4 h-4 text-amber-500" />
              </div>
              <p className="text-2xl font-extrabold text-slate-900 font-display">16.2%</p>
              <span className="text-[10px] text-emerald-700 font-semibold">Above avg (11.4%)</span>
            </div>
          </div>

          {/* Regional Geo Breakdown & Performance Insights */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
            <div className="lg:col-span-2 bg-white rounded-2xl p-5 border border-slate-200 shadow-xs space-y-4">
              <h3 className="font-bold text-xs text-slate-900 uppercase tracking-wider font-display">
                Buyer Geographic Demand by Nigerian State
              </h3>
              <div className="space-y-3">
                <div>
                  <div className="flex justify-between text-xs font-semibold text-slate-800 mb-1">
                    <span>Lagos State (Lekki, Ikeja, Ikoyi, Victoria Island, Epe)</span>
                    <span className="font-bold text-emerald-800">62% of inquiries</span>
                  </div>
                  <div className="w-full bg-slate-100 rounded-full h-2.5 overflow-hidden">
                    <div className="bg-emerald-600 h-2.5 rounded-full" style={{ width: '62%' }} />
                  </div>
                </div>

                <div>
                  <div className="flex justify-between text-xs font-semibold text-slate-800 mb-1">
                    <span>Abuja FCT (Maitama, Asokoro, Gwarinpa, Central Area)</span>
                    <span className="font-bold text-emerald-800">22% of inquiries</span>
                  </div>
                  <div className="w-full bg-slate-100 rounded-full h-2.5 overflow-hidden">
                    <div className="bg-emerald-500 h-2.5 rounded-full" style={{ width: '22%' }} />
                  </div>
                </div>

                <div>
                  <div className="flex justify-between text-xs font-semibold text-slate-800 mb-1">
                    <span>Rivers State (Port Harcourt, Trans-Amadi industrial zone)</span>
                    <span className="font-bold text-emerald-800">9% of inquiries</span>
                  </div>
                  <div className="w-full bg-slate-100 rounded-full h-2.5 overflow-hidden">
                    <div className="bg-blue-500 h-2.5 rounded-full" style={{ width: '9%' }} />
                  </div>
                </div>

                <div>
                  <div className="flex justify-between text-xs font-semibold text-slate-800 mb-1">
                    <span>Other States (Ogun Industrial corridor, Kano, Oyo, Delta)</span>
                    <span className="font-bold text-emerald-800">7% of inquiries</span>
                  </div>
                  <div className="w-full bg-slate-100 rounded-full h-2.5 overflow-hidden">
                    <div className="bg-amber-500 h-2.5 rounded-full" style={{ width: '7%' }} />
                  </div>
                </div>
              </div>
            </div>

            {/* Merchant Optimization Tips */}
            <div className="bg-emerald-950 text-white rounded-2xl p-5 shadow-xs flex flex-col justify-between space-y-4">
              <div>
                <div className="flex items-center gap-2 text-emerald-400 text-xs font-bold uppercase tracking-wider mb-2">
                  <Sparkles className="w-4 h-4" />
                  <span>Conversion Booster</span>
                </div>
                <h4 className="font-bold text-base font-display mb-1">
                  Boost High-Value Assets
                </h4>
                <p className="text-xs text-slate-300 leading-relaxed">
                  Listings with verified C of O documents and clear chassis VINs receive 3.8x more WhatsApp inquiries. Promote your listings with Paystack or Flutterwave to lock top search positions.
                </p>
              </div>
              <button
                onClick={onUpgradePlan}
                className="w-full py-2.5 px-4 bg-emerald-500 hover:bg-emerald-400 text-slate-950 rounded-xl text-xs font-extrabold transition text-center cursor-pointer shadow-md"
              >
                Promote Listings Now
              </button>
            </div>
          </div>

          {/* Listing-by-Listing Performance Table */}
          <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-xs space-y-4">
            <h3 className="font-bold text-xs text-slate-900 uppercase tracking-wider font-display">
              Asset-Level Conversion Performance
            </h3>
            <div className="overflow-x-auto -mx-5 px-5 sm:mx-0 sm:px-0">
              <table className="w-full text-left text-xs min-w-[540px] sm:min-w-0">
                <thead className="bg-slate-50 border-b border-slate-200 text-slate-500 text-[10px] uppercase font-bold tracking-wider">
                  <tr>
                    <th className="p-3">Listing Asset</th>
                    <th className="p-3 hidden sm:table-cell">Vertical</th>
                    <th className="p-3">Price</th>
                    <th className="p-3 hidden md:table-cell">Views</th>
                    <th className="p-3">Calls</th>
                    <th className="p-3 hidden sm:table-cell">WhatsApp</th>
                    <th className="p-3 hidden lg:table-cell">Conv. Rate</th>
                    <th className="p-3 text-right">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {myListings.map((item, idx) => {
                    const views = 240 + idx * 85;
                    const calls = 18 + idx * 7;
                    const wa = 14 + idx * 5;
                    const convRate = (((calls + wa) / views) * 100).toFixed(1);
                    return (
                      <tr key={item.id} className="hover:bg-slate-50/60">
                        <td className="p-3">
                          <div className="flex items-center gap-2.5">
                            <img
                              src={item.images[0]}
                              alt={item.title}
                              className="w-10 h-10 rounded-lg object-cover bg-slate-100 shrink-0"
                            />
                            <div className="min-w-0 max-w-[180px] sm:max-w-xs">
                              <span
                                onClick={() => onOpenListingDetail(item)}
                                className="font-bold text-slate-900 truncate block hover:text-emerald-700 cursor-pointer"
                              >
                                {item.title}
                              </span>
                              <span className="text-[10px] text-slate-400 block truncate">
                                {item.location.area}, {item.location.state}
                              </span>
                              <span className="text-[10px] text-emerald-800 font-semibold sm:hidden block truncate mt-0.5">
                                {item.vertical} • {views} views • {convRate}% conv
                              </span>
                            </div>
                          </div>
                        </td>
                        <td className="p-3 hidden sm:table-cell">
                          <span className="px-2 py-0.5 rounded bg-slate-100 text-slate-700 text-[10px] font-bold uppercase">
                            {item.vertical}
                          </span>
                        </td>
                        <td className="p-3 font-bold text-slate-900 font-mono">
                          {formatFullNaira(item.price)}
                        </td>
                        <td className="p-3 font-semibold text-slate-700 hidden md:table-cell">
                          {views.toLocaleString()}
                        </td>
                        <td className="p-3 font-semibold text-emerald-800">
                          {calls}
                        </td>
                        <td className="p-3 font-semibold text-emerald-600 hidden sm:table-cell">
                          {wa}
                        </td>
                        <td className="p-3 hidden lg:table-cell">
                          <span className="px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-800 text-[10px] font-bold border border-emerald-200">
                            {convRate}%
                          </span>
                        </td>
                        <td className="p-3 text-right">
                          <button
                            onClick={() => onPromoteListing(item)}
                            className="px-2.5 py-1 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white text-[11px] font-bold transition cursor-pointer"
                          >
                            Boost
                          </button>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* TAB 3: LEAD PIPELINE CRM (PRD Section 41) */}
      {activeTab === 'leads' && (
        <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-xs space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-base font-bold text-slate-900 font-display">
                Lead Pipeline & CRM (PRD Section 41)
              </h2>
              <p className="text-xs text-slate-500">
                Track serious buyers from initial WhatsApp/Chat contact to contract negotiation and closing.
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-5 gap-3">
            {(['New', 'Contacted', 'In Negotiation', 'Closed Won', 'Closed Lost'] as const).map((stage) => {
              const stageLeads = leads.filter((l) => l.status === stage);
              return (
                <div key={stage} className="bg-slate-50 rounded-xl p-3 border border-slate-200 space-y-2.5 flex flex-col">
                  <div className="flex items-center justify-between border-b border-slate-200 pb-2">
                    <span className="font-bold text-xs text-slate-900">{stage}</span>
                    <span className="text-[10px] px-1.5 py-0.2 rounded-full bg-slate-200 font-bold text-slate-700">
                      {stageLeads.length}
                    </span>
                  </div>

                  <div className="space-y-2 flex-1">
                    {stageLeads.map((lead) => (
                      <div key={lead.id} className="bg-white p-3 rounded-lg border border-slate-200 shadow-2xs space-y-2 text-xs">
                        <span className="font-bold text-slate-900 block truncate">{lead.clientName}</span>
                        <p className="text-[11px] text-slate-500 line-clamp-1">{lead.listingTitle}</p>
                        <p className="text-[11px] text-slate-600 bg-slate-50 p-1.5 rounded line-clamp-2">
                          "{lead.clientMessage}"
                        </p>

                        <div className="flex items-center justify-between pt-1 border-t border-slate-100">
                          <a
                            href={`https://wa.me/${lead.clientPhone.replace(/[^0-9]/g, '')}`}
                            target="_blank"
                            rel="noreferrer"
                            className="text-emerald-700 font-bold text-[10px] flex items-center gap-1"
                          >
                            <MessageSquare className="w-3 h-3" />
                            <span>WhatsApp</span>
                          </a>

                          {stage === 'New' && (
                            <button
                              onClick={() => onUpdateLeadStatus(lead.id, 'Contacted')}
                              className="text-[10px] font-bold text-blue-700 hover:text-blue-800"
                            >
                              Contacted →
                            </button>
                          )}
                          {stage === 'Contacted' && (
                            <button
                              onClick={() => onUpdateLeadStatus(lead.id, 'In Negotiation')}
                              className="text-[10px] font-bold text-amber-700 hover:text-amber-800"
                            >
                              Negotiate →
                            </button>
                          )}
                          {stage === 'In Negotiation' && (
                            <button
                              onClick={() => onUpdateLeadStatus(lead.id, 'Closed Won')}
                              className="text-[10px] font-bold text-emerald-700 hover:text-emerald-800"
                            >
                              Win Deal ✓
                            </button>
                          )}
                        </div>
                      </div>
                    ))}

                    {stageLeads.length === 0 && (
                      <div className="p-4 text-center text-[11px] text-slate-400">
                        Empty stage
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* TAB 4: VIEWING REQUESTS */}
      {activeTab === 'viewings' && (
        <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-xs space-y-4">
          <div>
            <h2 className="text-base font-bold text-slate-900 font-display">
              Physical Property Viewing Inspections
            </h2>
            <p className="text-xs text-slate-500">
              PRD Section 13: Coordinate on-site property walkthroughs with prospective buyers.
            </p>
          </div>

          <div className="space-y-3">
            {viewingRequests.map((req) => (
              <div key={req.id} className="p-4 rounded-xl border border-slate-200 bg-slate-50/50 flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-sm text-slate-900">{req.seekerName}</span>
                    <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase ${
                      req.status === 'Pending' ? 'bg-amber-100 text-amber-800' : 'bg-emerald-100 text-emerald-800'
                    }`}>
                      {req.status}
                    </span>
                  </div>
                  <p className="text-xs font-semibold text-emerald-800">{req.propertyTitle}</p>
                  <p className="text-xs text-slate-500 flex items-center gap-2">
                    <span>{req.preferredDate} at {req.preferredTime}</span>
                    <span>•</span>
                    <span>{req.seekerPhone}</span>
                  </p>
                  <p className="text-xs text-slate-600 italic">"{req.message}"</p>
                </div>

                <div className="flex flex-wrap items-center gap-2 shrink-0">
                  {req.status === 'Pending' && (
                    <>
                      <button
                        onClick={() => onUpdateViewingStatus(req.id, 'Confirmed')}
                        className="py-1.5 px-3 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold transition cursor-pointer flex items-center gap-1"
                      >
                        <CheckCircle className="w-3.5 h-3.5" />
                        <span>Confirm Inspection</span>
                      </button>
                      <button
                        onClick={() => onUpdateViewingStatus(req.id, 'Cancelled')}
                        className="py-1.5 px-3 rounded-lg bg-slate-200 hover:bg-slate-300 text-slate-700 text-xs font-bold transition cursor-pointer flex items-center gap-1"
                      >
                        <XCircle className="w-3.5 h-3.5" />
                        <span>Decline</span>
                      </button>
                    </>
                  )}
                  {req.status === 'Confirmed' && (
                    <button
                      onClick={() => onUpdateViewingStatus(req.id, 'Completed')}
                      className="py-1.5 px-3 rounded-lg bg-slate-900 text-white text-xs font-bold transition cursor-pointer"
                    >
                      Mark Completed
                    </button>
                  )}
                  <a
                    href={`https://wa.me/${req.seekerPhone.replace(/[^0-9]/g, '')}?text=Hello%20${encodeURIComponent(req.seekerName)},%20confirming%20our%20inspection%20for%20${encodeURIComponent(req.propertyTitle)}.`}
                    target="_blank"
                    rel="noreferrer"
                    className="py-1.5 px-3 rounded-lg bg-emerald-600 text-white text-xs font-bold transition flex items-center gap-1"
                  >
                    <MessageSquare className="w-3.5 h-3.5" />
                    <span>WhatsApp Seeker</span>
                  </a>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* TAB 5: EQUIPMENT RENTALS */}
      {activeTab === 'rentals' && (
        <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-xs space-y-4">
          <div>
            <h2 className="text-base font-bold text-slate-900 font-display">
              Heavy Machinery Hire & Mobilization Orders
            </h2>
            <p className="text-xs text-slate-500">
              PRD Section 18–19: Review mobilization dates, operator mandating, and rental rate calculations.
            </p>
          </div>

          <div className="space-y-3">
            {rentalRequests.map((req) => (
              <div key={req.id} className="p-4 rounded-xl border border-slate-200 bg-slate-50/50 flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-sm text-slate-900">{req.clientName}</span>
                    {req.companyName && (
                      <span className="text-xs text-slate-500">({req.companyName})</span>
                    )}
                    <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-amber-100 text-amber-800">
                      {req.status}
                    </span>
                  </div>
                  <p className="text-xs font-semibold text-slate-800">{req.equipmentTitle}</p>
                  <p className="text-xs text-slate-500">
                    Duration: {req.startDate} to {req.endDate} • Site: {req.deliveryAddress}
                  </p>
                  <p className="text-xs text-emerald-800 font-extrabold font-display">
                    Est. Hire Total: {formatFullNaira(req.estimatedTotal)}
                  </p>
                </div>

                <div className="flex flex-wrap items-center gap-2 shrink-0">
                  {req.status === 'Pending Review' && (
                    <>
                      <button
                        onClick={() => onUpdateRentalStatus(req.id, 'Approved')}
                        className="py-1.5 px-3 rounded-lg bg-amber-600 hover:bg-amber-700 text-white text-xs font-bold transition cursor-pointer flex items-center gap-1"
                      >
                        <CheckCircle className="w-3.5 h-3.5" />
                        <span>Accept & Mobilize</span>
                      </button>
                      <button
                        onClick={() => onUpdateRentalStatus(req.id, 'Declined')}
                        className="py-1.5 px-3 rounded-lg bg-slate-200 hover:bg-slate-300 text-slate-700 text-xs font-bold transition cursor-pointer flex items-center gap-1"
                      >
                        <XCircle className="w-3.5 h-3.5" />
                        <span>Decline</span>
                      </button>
                    </>
                  )}
                  <a
                    href={`https://wa.me/${req.clientPhone.replace(/[^0-9]/g, '')}?text=Hello%20${encodeURIComponent(req.clientName)},%20reviewing%20rental%20order%20for%20${encodeURIComponent(req.equipmentTitle)}.`}
                    target="_blank"
                    rel="noreferrer"
                    className="py-1.5 px-3 rounded-lg bg-emerald-600 text-white text-xs font-bold transition flex items-center gap-1"
                  >
                    <MessageSquare className="w-3.5 h-3.5" />
                    <span>WhatsApp</span>
                  </a>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* TAB 6: TRADE MESSAGES */}
      {activeTab === 'messages' && (
        <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-xs space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-base font-bold text-slate-900 font-display">
                Trade Chat Conversations (PRD Section 28)
              </h2>
              <p className="text-xs text-slate-500">
                Direct in-app buyer & seller messaging threads tied to active marketplace listings.
              </p>
            </div>
            <button
              onClick={() => onOpenChat()}
              className="py-2 px-3.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold transition flex items-center gap-1.5 cursor-pointer"
            >
              <MessageSquare className="w-3.5 h-3.5 text-emerald-400" />
              <span>Open Chat Window</span>
            </button>
          </div>

          <div className="divide-y divide-slate-100">
            {conversations.map((conv) => (
              <div
                key={conv.id}
                onClick={() => onOpenChat(conv.id)}
                className="p-3.5 hover:bg-slate-50 transition cursor-pointer flex items-center justify-between gap-3 rounded-xl"
              >
                <div className="flex items-center gap-3">
                  <img
                    src={conv.listingImage}
                    alt={conv.listingTitle}
                    className="w-12 h-12 rounded-lg object-cover bg-slate-200 shrink-0"
                  />
                  <div>
                    <span className="font-bold text-xs text-slate-900 block">{conv.sellerName}</span>
                    <p className="text-[11px] font-semibold text-emerald-800">{conv.listingTitle}</p>
                    <p className="text-xs text-slate-500 truncate max-w-md">{conv.lastMessage}</p>
                  </div>
                </div>
                <div className="text-right shrink-0">
                  <span className="text-[10px] text-slate-400 block">{conv.lastMessageTimestamp}</span>
                  {conv.unreadCount > 0 && (
                    <span className="px-2 py-0.5 rounded-full bg-emerald-600 text-white text-[10px] font-bold mt-1 inline-block">
                      {conv.unreadCount} New
                    </span>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* TAB 7: FAVORITES */}
      {activeTab === 'favorites' && (
        <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-xs space-y-4">
          <div>
            <h2 className="text-base font-bold text-slate-900 font-display">
              Saved Assets & Watchlist (PRD Section 29)
            </h2>
            <p className="text-xs text-slate-500">
              Listings you've pinned for price tracking and commercial review.
            </p>
          </div>

          {favorites.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {favorites.map((item) => (
                <div key={item.id} className="border border-slate-200 rounded-xl overflow-hidden bg-white shadow-2xs flex flex-col justify-between">
                  <div>
                    <div className="h-32 bg-slate-100 overflow-hidden relative">
                      <img src={item.images[0]} alt={item.title} className="w-full h-full object-cover" />
                      <button
                        onClick={() => onRemoveFavorite(item.id)}
                        className="absolute top-2 right-2 p-1.5 bg-black/60 hover:bg-rose-600 text-white rounded-full transition cursor-pointer"
                        title="Remove from saved"
                      >
                        <Heart className="w-3.5 h-3.5 fill-white" />
                      </button>
                    </div>
                    <div className="p-3">
                      <h4
                        onClick={() => onOpenListingDetail(item)}
                        className="font-bold text-slate-900 text-xs line-clamp-1 hover:text-emerald-700 cursor-pointer"
                      >
                        {item.title}
                      </h4>
                      <p className="text-sm font-extrabold text-slate-900 font-display">
                        {formatFullNaira(item.price)}
                      </p>
                      <p className="text-[11px] text-slate-500">{item.location.area}, {item.location.state}</p>
                    </div>
                  </div>
                  <div className="p-3 pt-0 flex items-center justify-between text-xs">
                    <button
                      onClick={() => onOpenListingDetail(item)}
                      className="text-emerald-700 font-bold hover:underline"
                    >
                      View Details →
                    </button>
                    <a
                      href={`https://wa.me/${item.seller.whatsapp.replace(/[^0-9]/g, '')}`}
                      target="_blank"
                      rel="noreferrer"
                      className="text-slate-700 font-semibold"
                    >
                      WhatsApp Seller
                    </a>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="p-10 text-center text-xs text-slate-400">
              No saved items in your watchlist yet. Click the heart icon on any listing card to pin it here.
            </div>
          )}
        </div>
      )}

      {/* TAB 8: PLANS & TRANSACTIONS */}
      {activeTab === 'plans' && (
        <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-xs space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div>
              <h2 className="text-base font-bold text-slate-900 font-display">
                Subscription & Paid Listing Promotions (PRD Sections 43–46)
              </h2>
              <p className="text-xs text-slate-500">
                Paystack verified transactions, tier limits, and invoice settlements.
              </p>
            </div>
            <button
              onClick={onUpgradePlan}
              className="py-2.5 px-4 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold transition flex items-center gap-1.5 cursor-pointer shadow-md shadow-emerald-900/20"
            >
              <CreditCard className="w-4 h-4" />
              <span>Change Subscription Plan</span>
            </button>
          </div>

          {/* Current Tier Summary Card */}
          <div className="p-5 rounded-2xl bg-slate-900 text-white flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
              <span className="text-[10px] uppercase font-bold text-emerald-400 tracking-wider">
                Current Active Subscription
              </span>
              <h3 className="text-2xl font-extrabold font-display">
                {currentUser.plan} Merchant Tier
              </h3>
              <p className="text-xs text-slate-300 mt-1">
                Allows up to <span className="font-bold text-white">{currentUser.maxListings} listings</span> with full CRM lead pipeline and rental requisitions.
              </p>
            </div>
            <div className="bg-slate-800 px-4 py-3 rounded-xl border border-slate-700 text-right">
              <span className="text-[10px] text-slate-400 uppercase tracking-wider block">Inventory Usage</span>
              <span className="text-lg font-extrabold text-emerald-400 font-display">
                {myListings.length} / {currentUser.maxListings}
              </span>
            </div>
          </div>

          {/* Payment Transactions History Table */}
          <div className="space-y-3 pt-2">
            <h4 className="font-bold text-xs text-slate-900 uppercase tracking-wider">
              Settlement & Paystack Invoice History
            </h4>
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-slate-50 border-b border-slate-200 text-slate-500 text-[10px] uppercase font-bold tracking-wider">
                  <tr>
                    <th className="p-3">Reference</th>
                    <th className="p-3">Service / Plan</th>
                    <th className="p-3">Amount</th>
                    <th className="p-3">Method</th>
                    <th className="p-3">Date</th>
                    <th className="p-3">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {transactions.map((tx) => (
                    <tr key={tx.id} className="hover:bg-slate-50/50">
                      <td className="p-3 font-mono font-bold text-slate-800">{tx.reference}</td>
                      <td className="p-3 text-slate-900 font-semibold">{tx.planOrPackageName}</td>
                      <td className="p-3 font-bold text-emerald-800">{formatFullNaira(tx.amount)}</td>
                      <td className="p-3 text-slate-600">{tx.paymentMethod}</td>
                      <td className="p-3 text-slate-500">{tx.date}</td>
                      <td className="p-3">
                        <span className="px-2 py-0.5 rounded bg-emerald-100 text-emerald-800 text-[10px] font-bold">
                          {tx.status}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
