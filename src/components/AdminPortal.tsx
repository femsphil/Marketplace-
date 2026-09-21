import React, { useState } from 'react';
import { 
  ShieldCheck, 
  Users, 
  FileText, 
  AlertTriangle, 
  DollarSign, 
  CheckCircle, 
  XCircle, 
  PauseCircle, 
  Search, 
  Filter, 
  Sparkles, 
  Building2, 
  Car, 
  Wrench, 
  Hammer,
  Eye,
  Check,
  Ban,
  RotateCcw,
  MapPin,
  Layers
} from 'lucide-react';
import { MarketplaceItem, ListingReport, UserAccount, PaymentTransaction } from '../types';
import { formatFullNaira } from '../lib/formatters';
import { NIGERIA_LOCATIONS } from '../data/locations';
import { SUBSCRIPTION_PLANS, PROMOTION_PACKAGES } from '../data/platformData';

interface AdminPortalProps {
  listings: MarketplaceItem[];
  reports: ListingReport[];
  users: UserAccount[];
  transactions: PaymentTransaction[];
  onApproveListing: (id: string) => void;
  onRejectListing: (id: string) => void;
  onSuspendListing: (id: string) => void;
  onFeatureListing: (id: string) => void;
  onResolveReport: (reportId: string) => void;
  onDismissReport: (reportId: string) => void;
  onToggleUserVerification: (userId: string, type: 'phone' | 'nin' | 'cac') => void;
  onToggleUserStatus: (userId: string) => void;
  onViewListingDetail: (listing: MarketplaceItem) => void;
}

export const AdminPortal: React.FC<AdminPortalProps> = ({
  listings,
  reports,
  users,
  transactions,
  onApproveListing,
  onRejectListing,
  onSuspendListing,
  onFeatureListing,
  onResolveReport,
  onDismissReport,
  onToggleUserVerification,
  onToggleUserStatus,
  onViewListingDetail,
}) => {
  const [activeTab, setActiveTab] = useState<'dashboard' | 'users' | 'listings' | 'categories' | 'reports' | 'payments' | 'subscriptions' | 'promotions'>('dashboard');
  const [listingFilter, setListingFilter] = useState<'all' | 'pending' | 'active' | 'suspended'>('all');
  const [searchQuery, setSearchQuery] = useState('');

  // Calculations
  const totalRevenue = transactions
    .filter((t) => t.status === 'Successful')
    .reduce((acc, curr) => acc + curr.amount, 0);

  const pendingReportsCount = reports.filter((r) => r.status === 'New' || r.status === 'Under Review').length;
  const pendingApprovalCount = listings.filter((l) => l.status === 'Pending Review').length;

  const filteredListings = listings.filter((item) => {
    if (listingFilter === 'pending' && item.status !== 'Pending Review') return false;
    if (listingFilter === 'active' && item.status !== 'Active') return false;
    if (listingFilter === 'suspended' && item.status !== 'Suspended') return false;

    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      return (
        item.title.toLowerCase().includes(q) ||
        item.seller.name.toLowerCase().includes(q) ||
        item.location.state.toLowerCase().includes(q)
      );
    }
    return true;
  });

  return (
    <div className="space-y-6">
      {/* Admin Title Banner */}
      <div className="bg-slate-900 text-white rounded-2xl p-6 sm:p-8 border border-slate-800 shadow-md flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-2">
            <span className="px-2 py-0.5 rounded bg-purple-500/20 text-purple-300 border border-purple-500/30 text-[10px] font-extrabold uppercase tracking-wider">
              PRD Section 66 Administration
            </span>
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
            <span className="text-xs text-slate-300">Live Trust & Safety System</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold font-display">
            Platform Operations & Moderation Portal
          </h1>
          <p className="text-xs sm:text-sm text-slate-300 mt-1 max-w-2xl">
            Audit newly posted listings, enforce verified Nigerian documentation (CAC, NIN, Governor’s Consent), review scam reports, and govern subscription revenue.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <div className="bg-slate-800/80 px-4 py-2.5 rounded-xl border border-slate-700 text-right">
            <span className="text-[10px] text-slate-300 uppercase tracking-wider block">Total Platform Revenue</span>
            <span className="text-lg font-bold font-display text-emerald-400">{formatFullNaira(totalRevenue)}</span>
          </div>
        </div>
      </div>

      {/* Admin Navigation Tabs */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1 border-b border-slate-200">
        {[
          { id: 'dashboard', label: 'Dashboard', count: null },
          { id: 'users', label: 'Users', count: users.length },
          { id: 'listings', label: 'Listings', count: pendingApprovalCount },
          { id: 'categories', label: 'Categories', count: null },
          { id: 'reports', label: 'Reports', count: pendingReportsCount },
          { id: 'payments', label: 'Payments', count: transactions.length },
          { id: 'subscriptions', label: 'Subscriptions', count: SUBSCRIPTION_PLANS.length },
          { id: 'promotions', label: 'Promotions', count: listings.filter((l) => l.featured).length },
        ].map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id as any)}
            className={`py-2.5 px-4 rounded-xl text-xs font-bold transition whitespace-nowrap flex items-center gap-1.5 cursor-pointer ${
              activeTab === tab.id
                ? 'bg-slate-900 text-white shadow-xs'
                : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
            }`}
          >
            <span>{tab.label}</span>
            {tab.count !== null && (
              <span
                className={`text-[10px] px-1.5 py-0.2 rounded-full font-extrabold ${
                  activeTab === tab.id
                    ? 'bg-purple-500 text-white'
                    : 'bg-slate-200 text-slate-700'
                }`}
              >
                {tab.count}
              </span>
            )}
          </button>
        ))}
      </div>

      {/* TAB 1: DASHBOARD KPIS */}
      {activeTab === 'dashboard' && (
        <div className="space-y-6">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs">
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs font-semibold text-slate-500">Active Listings</span>
                <div className="w-8 h-8 rounded-lg bg-emerald-50 text-emerald-600 flex items-center justify-center">
                  <FileText className="w-4 h-4" />
                </div>
              </div>
              <p className="text-2xl font-bold font-display text-slate-900">
                {listings.filter((l) => l.status === 'Active').length}
              </p>
              <p className="text-[11px] text-slate-600 mt-1">Across all 4 Nigerian verticals</p>
            </div>

            <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs">
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs font-semibold text-slate-500">Pending Moderation</span>
                <div className="w-8 h-8 rounded-lg bg-amber-50 text-amber-600 flex items-center justify-center">
                  <PauseCircle className="w-4 h-4" />
                </div>
              </div>
              <p className="text-2xl font-bold font-display text-amber-600">
                {pendingApprovalCount}
              </p>
              <p className="text-[11px] text-slate-600 mt-1">Require manual staff approval</p>
            </div>

            <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs">
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs font-semibold text-slate-500">Trust Reports</span>
                <div className="w-8 h-8 rounded-lg bg-rose-50 text-rose-600 flex items-center justify-center">
                  <AlertTriangle className="w-4 h-4" />
                </div>
              </div>
              <p className="text-2xl font-bold font-display text-rose-600">
                {pendingReportsCount}
              </p>
              <p className="text-[11px] text-slate-600 mt-1">Potential fraud or pricing flags</p>
            </div>

            <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs">
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs font-semibold text-slate-500">Verified Sellers</span>
                <div className="w-8 h-8 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center">
                  <ShieldCheck className="w-4 h-4" />
                </div>
              </div>
              <p className="text-2xl font-bold font-display text-blue-900">
                {users.filter((u) => u.cacVerified || u.ninVerified).length}
              </p>
              <p className="text-[11px] text-slate-600 mt-1">CAC & NIN verified merchants</p>
            </div>
          </div>

          {/* Breakdown by Vertical */}
          <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs space-y-4">
            <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider">
              Marketplace Inventory by Specialized Vertical
            </h3>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
              <div className="p-4 rounded-xl bg-emerald-50/50 border border-emerald-100 flex items-center gap-3">
                <div className="w-10 h-10 rounded-lg bg-emerald-600 text-white flex items-center justify-center">
                  <Building2 className="w-5 h-5" />
                </div>
                <div>
                  <span className="text-xs text-slate-500 block">Real Estate</span>
                  <span className="text-lg font-bold text-slate-900">
                    {listings.filter((l) => l.vertical === 'property').length}
                  </span>
                </div>
              </div>

              <div className="p-4 rounded-xl bg-blue-50/50 border border-blue-100 flex items-center gap-3">
                <div className="w-10 h-10 rounded-lg bg-blue-600 text-white flex items-center justify-center">
                  <Car className="w-5 h-5" />
                </div>
                <div>
                  <span className="text-xs text-slate-500 block">Cars & Vehicles</span>
                  <span className="text-lg font-bold text-slate-900">
                    {listings.filter((l) => l.vertical === 'cars').length}
                  </span>
                </div>
              </div>

              <div className="p-4 rounded-xl bg-amber-50/50 border border-amber-100 flex items-center gap-3">
                <div className="w-10 h-10 rounded-lg bg-amber-600 text-white flex items-center justify-center">
                  <Wrench className="w-5 h-5" />
                </div>
                <div>
                  <span className="text-xs text-slate-500 block">Heavy Equipment</span>
                  <span className="text-lg font-bold text-slate-900">
                    {listings.filter((l) => l.vertical === 'equipment').length}
                  </span>
                </div>
              </div>

              <div className="p-4 rounded-xl bg-orange-50/50 border border-orange-100 flex items-center gap-3">
                <div className="w-10 h-10 rounded-lg bg-orange-600 text-white flex items-center justify-center">
                  <Hammer className="w-5 h-5" />
                </div>
                <div>
                  <span className="text-xs text-slate-500 block">Materials & Services</span>
                  <span className="text-lg font-bold text-slate-900">
                    {listings.filter((l) => l.vertical === 'construction').length}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* TAB 2: LISTING MODERATION */}
      {activeTab === 'listings' && (
        <div className="bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden space-y-4 p-5">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div className="flex items-center gap-2">
              {(['all', 'pending', 'active', 'suspended'] as const).map((filter) => (
                <button
                  key={filter}
                  onClick={() => setListingFilter(filter)}
                  className={`py-1.5 px-3 rounded-lg text-xs font-bold capitalize transition cursor-pointer ${
                    listingFilter === filter
                      ? 'bg-slate-900 text-white'
                      : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                  }`}
                >
                  {filter}
                </button>
              ))}
            </div>

            <div className="relative">
              <Search className="w-4 h-4 absolute left-3 top-2.5 text-slate-400" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search listing, seller or location..."
                className="pl-9 pr-3 py-1.5 rounded-lg border border-slate-200 text-xs w-64 focus:outline-none focus:ring-2 focus:ring-slate-900"
              />
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 border-b border-slate-200 uppercase text-[10px] font-bold text-slate-500 tracking-wider">
                <tr>
                  <th className="p-3">Listing Asset</th>
                  <th className="p-3">Vertical</th>
                  <th className="p-3">Price</th>
                  <th className="p-3">Seller</th>
                  <th className="p-3">Status</th>
                  <th className="p-3 text-right">Moderation Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filteredListings.map((item) => (
                  <tr key={item.id} className="hover:bg-slate-50/50 transition">
                    <td className="p-3">
                      <div className="flex items-center gap-3">
                        <img
                          src={item.images[0]}
                          alt={item.title}
                          className="w-10 h-10 rounded-lg object-cover bg-slate-200 shrink-0"
                        />
                        <div className="min-w-0 max-w-xs">
                          <span
                            onClick={() => onViewListingDetail(item)}
                            className="font-bold text-slate-900 hover:text-emerald-700 cursor-pointer truncate block"
                          >
                            {item.title}
                          </span>
                          <span className="text-[11px] text-slate-500">
                            {item.location.area}, {item.location.state}
                          </span>
                        </div>
                      </div>
                    </td>
                    <td className="p-3 uppercase font-bold text-slate-600">
                      {item.vertical}
                    </td>
                    <td className="p-3 font-bold text-emerald-800">
                      {formatFullNaira(item.price)}
                    </td>
                    <td className="p-3 text-slate-700">
                      <span className="font-semibold block">{item.seller.name}</span>
                      <span className="text-[10px] text-slate-600">{item.seller.role}</span>
                    </td>
                    <td className="p-3">
                      <span
                        className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase ${
                          item.status === 'Active'
                            ? 'bg-emerald-100 text-emerald-800'
                            : item.status === 'Pending Review'
                            ? 'bg-amber-100 text-amber-800'
                            : 'bg-rose-100 text-rose-800'
                        }`}
                      >
                        {item.status || 'Active'}
                      </span>
                    </td>
                    <td className="p-3 text-right">
                      <div className="flex items-center justify-end gap-1.5">
                        <button
                          onClick={() => onViewListingDetail(item)}
                          className="p-1.5 text-slate-500 hover:text-slate-900 rounded hover:bg-slate-100 transition cursor-pointer"
                          title="View Details"
                        >
                          <Eye className="w-3.5 h-3.5" />
                        </button>
                        <button
                          onClick={() => onApproveListing(item.id)}
                          className="p-1.5 text-emerald-600 hover:text-emerald-800 rounded hover:bg-emerald-50 transition cursor-pointer"
                          title="Approve / Activate Listing"
                        >
                          <Check className="w-3.5 h-3.5" />
                        </button>
                        <button
                          onClick={() => onFeatureListing(item.id)}
                          className="p-1.5 text-amber-600 hover:text-amber-800 rounded hover:bg-amber-50 transition cursor-pointer"
                          title="Toggle Featured Boost"
                        >
                          <Sparkles className="w-3.5 h-3.5" />
                        </button>
                        <button
                          onClick={() => onSuspendListing(item.id)}
                          className="p-1.5 text-rose-600 hover:text-rose-800 rounded hover:bg-rose-50 transition cursor-pointer"
                          title="Suspend / Take Down"
                        >
                          <Ban className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* TAB 3: TRUST & FRAUD REPORTS */}
      {activeTab === 'reports' && (
        <div className="bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden p-5 space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="font-bold text-sm text-slate-900 font-display">
              Consumer Protection & Listing Reports Queue
            </h3>
            <span className="text-xs text-slate-500">
              PRD Section 35: Moderation & Trust Triage
            </span>
          </div>

          <div className="space-y-3">
            {reports.map((report) => (
              <div
                key={report.id}
                className="p-4 rounded-xl border border-slate-200 bg-slate-50/60 space-y-2.5"
              >
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                  <div className="flex items-center gap-2">
                    <span className="px-2 py-0.5 rounded bg-rose-100 text-rose-800 text-[10px] font-bold uppercase">
                      {report.reason}
                    </span>
                    <span className="font-bold text-xs text-slate-900">
                      Re: {report.listingTitle}
                    </span>
                  </div>
                  <span className="text-[11px] text-slate-500">{report.createdAt}</span>
                </div>

                <p className="text-xs text-slate-700 bg-white p-3 rounded-lg border border-slate-200 leading-relaxed">
                  "{report.details}"
                </p>

                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-xs pt-1">
                  <div className="text-slate-500">
                    Reported by: <span className="font-semibold text-slate-800">{report.reporterName}</span> ({report.reporterContact})
                  </div>
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => onDismissReport(report.id)}
                      className="py-1 px-3 rounded-lg border border-slate-300 text-slate-700 hover:bg-slate-100 text-xs font-semibold cursor-pointer"
                    >
                      Dismiss (Inaccurate)
                    </button>
                    <button
                      onClick={() => onResolveReport(report.id)}
                      className="py-1 px-3 rounded-lg bg-rose-600 hover:bg-rose-700 text-white text-xs font-bold cursor-pointer"
                    >
                      Take Down & Penalize
                    </button>
                  </div>
                </div>
              </div>
            ))}

            {reports.length === 0 && (
              <div className="p-8 text-center text-xs text-slate-600">
                No open reports. All listings pass trust & safety guidelines.
              </div>
            )}
          </div>
        </div>
      )}

      {/* TAB 4: USERS & VERIFICATION */}
      {activeTab === 'users' && (
        <div className="bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden p-5 space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="font-bold text-sm text-slate-900 font-display">
              Registered Merchants & KYC Verification Matrix
            </h3>
            <span className="text-xs text-slate-500">
              PRD Section 36: Phone, NIN & CAC Verification
            </span>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 border-b border-slate-200 uppercase text-[10px] font-bold text-slate-500 tracking-wider">
                <tr>
                  <th className="p-3">User / Company</th>
                  <th className="p-3">Role & Plan</th>
                  <th className="p-3">Phone Verification</th>
                  <th className="p-3">NIN Identity</th>
                  <th className="p-3">CAC Corporate</th>
                  <th className="p-3">Account Status</th>
                  <th className="p-3 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {users.map((u) => (
                  <tr key={u.id} className="hover:bg-slate-50/50 transition">
                    <td className="p-3">
                      <div className="flex items-center gap-2.5">
                        <img
                          src={u.avatarUrl}
                          alt={u.name}
                          className="w-8 h-8 rounded-full object-cover bg-slate-200 shrink-0"
                        />
                        <div>
                          <span className="font-bold text-slate-900 block">{u.name}</span>
                          <span className="text-[11px] text-slate-500">{u.email}</span>
                        </div>
                      </div>
                    </td>
                    <td className="p-3">
                      <span className="font-semibold block capitalize">{u.role}</span>
                      <span className="text-[10px] text-emerald-800 font-bold">{u.plan} Tier</span>
                    </td>
                    <td className="p-3">
                      <button
                        onClick={() => onToggleUserVerification(u.id, 'phone')}
                        className={`px-2 py-0.5 rounded text-[10px] font-bold cursor-pointer transition ${
                          u.phoneVerified
                            ? 'bg-emerald-100 text-emerald-800'
                            : 'bg-slate-100 text-slate-500 hover:bg-slate-200'
                        }`}
                      >
                        {u.phoneVerified ? 'Verified' : 'Unverified'}
                      </button>
                    </td>
                    <td className="p-3">
                      <button
                        onClick={() => onToggleUserVerification(u.id, 'nin')}
                        className={`px-2 py-0.5 rounded text-[10px] font-bold cursor-pointer transition ${
                          u.ninVerified
                            ? 'bg-blue-100 text-blue-800'
                            : 'bg-slate-100 text-slate-500 hover:bg-slate-200'
                        }`}
                      >
                        {u.ninVerified ? 'NIN Verified' : 'No NIN'}
                      </button>
                    </td>
                    <td className="p-3">
                      <button
                        onClick={() => onToggleUserVerification(u.id, 'cac')}
                        className={`px-2 py-0.5 rounded text-[10px] font-bold cursor-pointer transition ${
                          u.cacVerified
                            ? 'bg-purple-100 text-purple-800'
                            : 'bg-slate-100 text-slate-500 hover:bg-slate-200'
                        }`}
                      >
                        {u.cacVerified ? 'CAC RC Verified' : 'Pending CAC'}
                      </button>
                    </td>
                    <td className="p-3">
                      <span
                        className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase ${
                          u.status === 'active'
                            ? 'bg-emerald-100 text-emerald-800'
                            : 'bg-rose-100 text-rose-800'
                        }`}
                      >
                        {u.status}
                      </span>
                    </td>
                    <td className="p-3 text-right">
                      <button
                        onClick={() => onToggleUserStatus(u.id)}
                        className={`py-1 px-2.5 rounded text-xs font-semibold transition cursor-pointer ${
                          u.status === 'active'
                            ? 'border border-rose-200 text-rose-700 hover:bg-rose-50'
                            : 'bg-emerald-600 text-white hover:bg-emerald-700'
                        }`}
                      >
                        {u.status === 'active' ? 'Suspend' : 'Restore'}
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* TAB 5: PAYMENTS & TRANSACTIONS */}
      {activeTab === 'payments' && (
        <div className="bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden p-5 space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="font-bold text-sm text-slate-900 font-display">
                Payment Settlements & Gateway Logs
              </h3>
              <p className="text-xs text-slate-500">
                Live Paystack & Flutterwave multi-channel settlements (Card, Bank Transfer, USSD).
              </p>
            </div>
            <span className="text-xs font-bold text-emerald-800 bg-emerald-50 px-3 py-1.5 rounded-lg border border-emerald-200">
              {transactions.length} Total Settlements
            </span>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 border-b border-slate-200 uppercase text-[10px] font-bold text-slate-500 tracking-wider">
                <tr>
                  <th className="p-3">Gateway Reference</th>
                  <th className="p-3">Service / Plan</th>
                  <th className="p-3">Settlement Amount</th>
                  <th className="p-3">Payer Email</th>
                  <th className="p-3">Gateway</th>
                  <th className="p-3">Channel</th>
                  <th className="p-3">Date</th>
                  <th className="p-3">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {transactions.map((tx) => (
                  <tr key={tx.id} className="hover:bg-slate-50/50 transition">
                    <td className="p-3 font-mono font-bold text-slate-900">
                      {tx.reference}
                    </td>
                    <td className="p-3 font-medium text-slate-800">
                      {tx.planOrPackageName}
                    </td>
                    <td className="p-3 font-bold text-emerald-800">
                      {formatFullNaira(tx.amount)}
                    </td>
                    <td className="p-3 text-slate-600">{tx.customerEmail}</td>
                    <td className="p-3">
                      <span className="px-2 py-0.5 rounded font-mono font-bold text-[10px] bg-slate-100 text-slate-700">
                        {tx.gateway || 'Paystack'}
                      </span>
                    </td>
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
      )}

      {/* TAB: SUBSCRIPTIONS (PRD Section 43-44 & Section 66 MVP Scope) */}
      {activeTab === 'subscriptions' && (
        <div className="space-y-6">
          <div className="bg-white rounded-2xl border border-slate-200 shadow-xs p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <h3 className="font-bold text-sm text-slate-900 font-display">
                Merchant Subscription Tier Management
              </h3>
              <p className="text-xs text-slate-500 mt-0.5">
                Manage quotas, monetization pricing, and merchant limits across Nigeria.
              </p>
            </div>
            <div className="text-xs text-slate-600 font-medium">
              Active Subscribers: <span className="font-bold text-emerald-800">{users.filter((u) => u.plan !== 'Free').length} Merchants</span>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {SUBSCRIPTION_PLANS.map((plan) => {
              const countOnPlan = users.filter((u) => u.plan.toLowerCase() === plan.id).length;
              return (
                <div key={plan.id} className="bg-white rounded-2xl border border-slate-200 shadow-xs p-5 flex flex-col justify-between space-y-4">
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <span className="font-bold text-base text-slate-900 font-display">{plan.name}</span>
                      <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-50 text-emerald-800 border border-emerald-200">
                        {countOnPlan} users
                      </span>
                    </div>
                    <p className="text-xl font-extrabold text-slate-900 font-display">
                      {plan.pricePerMonth === 0 ? 'Free' : formatFullNaira(plan.pricePerMonth)}
                      {plan.pricePerMonth > 0 && <span className="text-xs text-slate-400 font-normal"> / month</span>}
                    </p>
                    {plan.badge && <p className="text-xs text-emerald-700 font-medium mt-1">{plan.badge}</p>}

                    <div className="mt-4 pt-4 border-t border-slate-100 space-y-2 text-xs">
                      <div className="flex justify-between text-slate-600">
                        <span>Listings Quota:</span>
                        <span className="font-bold text-slate-900">{plan.listingLimit >= 9999 ? 'Unlimited' : plan.listingLimit}</span>
                      </div>
                      <div className="flex justify-between text-slate-600">
                        <span>Features Included:</span>
                        <span className="font-bold text-slate-900">{plan.features.length} Perks</span>
                      </div>
                    </div>
                  </div>

                  <button
                    onClick={() => alert(`Plan parameters for ${plan.name} are active. Pricing synced with Paystack/Flutterwave subscriptions.`)}
                    className="w-full py-2 bg-slate-100 hover:bg-slate-200 text-slate-800 rounded-xl text-xs font-bold transition cursor-pointer"
                  >
                    Configure Plan
                  </button>
                </div>
              );
            })}
          </div>

          <div className="bg-white rounded-2xl border border-slate-200 shadow-xs p-5 space-y-4">
            <h4 className="font-bold text-xs text-slate-900 uppercase tracking-wider">
              Merchant Subscriptions Directory
            </h4>
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-slate-50 border-b border-slate-200 text-slate-500 text-[10px] uppercase font-bold tracking-wider">
                  <tr>
                    <th className="p-3">Merchant / Business</th>
                    <th className="p-3">Current Tier</th>
                    <th className="p-3">Listings Utilized</th>
                    <th className="p-3">Verification</th>
                    <th className="p-3">Account Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {users.map((u) => (
                    <tr key={u.id} className="hover:bg-slate-50/50">
                      <td className="p-3">
                        <p className="font-bold text-slate-900">{u.businessName || u.name}</p>
                        <p className="text-[11px] text-slate-500">{u.email} • {u.phone}</p>
                      </td>
                      <td className="p-3">
                        <span className={`px-2.5 py-1 rounded-full text-[10px] font-bold ${
                          u.plan === 'Enterprise' ? 'bg-purple-100 text-purple-800' :
                          u.plan === 'Business' ? 'bg-blue-100 text-blue-800' :
                          u.plan === 'Professional' ? 'bg-emerald-100 text-emerald-800' :
                          'bg-slate-100 text-slate-700'
                        }`}>
                          {u.plan} Tier
                        </span>
                      </td>
                      <td className="p-3 text-slate-700 font-medium">
                        {listings.filter((l) => l.seller.name === u.name || l.seller.name === u.businessName).length} / {u.maxListings}
                      </td>
                      <td className="p-3">
                        <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                          u.cacVerified ? 'bg-emerald-50 text-emerald-700' :
                          u.phoneVerified ? 'bg-blue-50 text-blue-700' :
                          'bg-slate-100 text-slate-500'
                        }`}>
                          {u.cacVerified ? 'CAC Verified' : u.phoneVerified ? 'Phone Verified' : 'Unverified'}
                        </span>
                      </td>
                      <td className="p-3">
                        <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                          u.status === 'active' ? 'bg-emerald-100 text-emerald-800' : 'bg-rose-100 text-rose-800'
                        }`}>
                          {u.status}
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

      {/* TAB: PROMOTIONS & BOOSTS (PRD Section 43-44 & Section 66 MVP Scope) */}
      {activeTab === 'promotions' && (
        <div className="space-y-6">
          <div className="bg-white rounded-2xl border border-slate-200 shadow-xs p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <h3 className="font-bold text-sm text-slate-900 font-display">
                Listing Promotions & Monetization Packages
              </h3>
              <p className="text-xs text-slate-500 mt-0.5">
                Featured listings, Top Search boosts, and Homepage Spotlight slots.
              </p>
            </div>
            <span className="text-xs font-bold text-purple-800 bg-purple-50 px-3 py-1.5 rounded-lg border border-purple-200">
              {listings.filter((l) => l.featured).length} Active Promoted Listings
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {PROMOTION_PACKAGES.map((pkg) => (
              <div key={pkg.id} className="bg-white rounded-2xl border border-slate-200 shadow-xs p-5 space-y-3">
                <div className="flex items-center justify-between">
                  <span className="font-bold text-sm text-slate-900 font-display">{pkg.name}</span>
                  <span className="px-2 py-0.5 rounded bg-emerald-50 text-emerald-800 font-bold text-[10px] border border-emerald-200">
                    {pkg.badgeText}
                  </span>
                </div>
                <p className="text-2xl font-extrabold text-slate-900 font-display">
                  {formatFullNaira(pkg.price)}
                </p>
                <p className="text-xs text-slate-500">{pkg.description}</p>
                <div className="pt-3 border-t border-slate-100 flex items-center justify-between text-xs text-slate-600">
                  <span>Duration:</span>
                  <span className="font-bold text-slate-800">{pkg.durationDays} Days</span>
                </div>
              </div>
            ))}
          </div>

          <div className="bg-white rounded-2xl border border-slate-200 shadow-xs p-5 space-y-4">
            <h4 className="font-bold text-xs text-slate-900 uppercase tracking-wider">
              Currently Promoted & Featured Listings
            </h4>
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-slate-50 border-b border-slate-200 text-slate-500 text-[10px] uppercase font-bold tracking-wider">
                  <tr>
                    <th className="p-3">Listing Asset</th>
                    <th className="p-3">Vertical</th>
                    <th className="p-3">Seller</th>
                    <th className="p-3">Promotion Status</th>
                    <th className="p-3 text-right">Admin Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {listings.map((item) => (
                    <tr key={item.id} className="hover:bg-slate-50/50">
                      <td className="p-3">
                        <div className="flex items-center gap-2.5">
                          <img src={item.images[0]} alt="" className="w-9 h-9 rounded-lg object-cover bg-slate-100 shrink-0" />
                          <span
                            onClick={() => onViewListingDetail(item)}
                            className="font-bold text-slate-900 hover:text-emerald-700 cursor-pointer truncate max-w-xs block"
                          >
                            {item.title}
                          </span>
                        </div>
                      </td>
                      <td className="p-3">
                        <span className="px-2 py-0.5 rounded bg-slate-100 text-slate-700 text-[10px] font-bold uppercase">
                          {item.vertical}
                        </span>
                      </td>
                      <td className="p-3 text-slate-700">{item.seller.name}</td>
                      <td className="p-3">
                        {item.featured ? (
                          <span className="px-2 py-0.5 rounded-full bg-purple-100 text-purple-800 text-[10px] font-bold inline-flex items-center gap-1">
                            <Sparkles className="w-3 h-3" /> Featured Active
                          </span>
                        ) : (
                          <span className="text-slate-400 text-[11px]">Standard</span>
                        )}
                      </td>
                      <td className="p-3 text-right">
                        <button
                          onClick={() => onFeatureListing(item.id)}
                          className={`px-3 py-1 rounded-lg text-xs font-bold transition cursor-pointer ${
                            item.featured
                              ? 'bg-slate-200 hover:bg-slate-300 text-slate-800'
                              : 'bg-purple-600 hover:bg-purple-700 text-white'
                          }`}
                        >
                          {item.featured ? 'Remove Boost' : 'Grant Featured'}
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* TAB 6: CATEGORIES & LOCATION REGISTRY */}
      {activeTab === 'categories' && (
        <div className="bg-white rounded-2xl border border-slate-200 shadow-xs p-6 space-y-6">
          <div>
            <h3 className="font-bold text-sm text-slate-900 font-display">
              Dynamic Category & Geographic Hub Architecture
            </h3>
            <p className="text-xs text-slate-500 mt-0.5">
              PRD Sections 51-52: Non-hardcoded category fields and Nigerian State/City/Area hierarchy.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Category Fields Schema */}
            <div className="p-4 rounded-xl border border-slate-200 bg-slate-50/50 space-y-3">
              <h4 className="font-bold text-xs text-slate-900 uppercase tracking-wider flex items-center gap-1.5">
                <Layers className="w-4 h-4 text-emerald-600" />
                Category Specific Fields (Section 51)
              </h4>
              <div className="space-y-2 text-xs">
                <div className="p-2.5 rounded-lg bg-white border border-slate-200">
                  <p className="font-bold text-slate-900">1. Real Estate (Property)</p>
                  <p className="text-slate-500 text-[11px] mt-0.5">
                    Bedrooms, Bathrooms, Toilets, Land Size (SQM), Title Documents (C of O, Gov Consent, Gazette), Furnished, Gated.
                  </p>
                </div>
                <div className="p-2.5 rounded-lg bg-white border border-slate-200">
                  <p className="font-bold text-slate-900">2. Cars & Commercial Vehicles</p>
                  <p className="text-slate-500 text-[11px] mt-0.5">
                    Make, Model, Year, Mileage (km), Condition (Tokunbo/Nigerian Used/Brand New), Transmission, Fuel, VIN.
                  </p>
                </div>
                <div className="p-2.5 rounded-lg bg-white border border-slate-200">
                  <p className="font-bold text-slate-900">3. Construction Heavy Equipment</p>
                  <p className="text-slate-500 text-[11px] mt-0.5">
                    Brand, Model, Operating Hours, Operating Weight (kg), Daily/Weekly/Monthly Rates, Certified Operator Included.
                  </p>
                </div>
                <div className="p-2.5 rounded-lg bg-white border border-slate-200">
                  <p className="font-bold text-slate-900">4. Materials & Construction Services</p>
                  <p className="text-slate-500 text-[11px] mt-0.5">
                    Material category, Unit of measure, Bulk discounts, Professional accreditation (COREN/NIA/QSRBN), Portfolio.
                  </p>
                </div>
              </div>
            </div>

            {/* Geographic Coverage */}
            <div className="p-4 rounded-xl border border-slate-200 bg-slate-50/50 space-y-3">
              <h4 className="font-bold text-xs text-slate-900 uppercase tracking-wider flex items-center gap-1.5">
                <MapPin className="w-4 h-4 text-emerald-600" />
                Active Nigerian Hubs (Section 52)
              </h4>
              <div className="space-y-2 text-xs max-h-72 overflow-y-auto">
                {NIGERIA_LOCATIONS.map((loc) => (
                  <div key={loc.state} className="p-2.5 rounded-lg bg-white border border-slate-200">
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-slate-900">{loc.state} State</span>
                      <span className="text-[10px] text-emerald-700 font-bold bg-emerald-50 px-2 py-0.5 rounded">
                        {loc.areas.length} Trade Areas
                      </span>
                    </div>
                    <p className="text-slate-500 text-[11px] mt-1 line-clamp-1">
                      {loc.areas.join(' • ')}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
