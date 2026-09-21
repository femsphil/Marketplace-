import React, { useState } from 'react';
import { X, AlertTriangle, ShieldAlert, CheckCircle } from 'lucide-react';
import { ListingReport, MarketplaceItem } from '../types';

interface ReportModalProps {
  isOpen: boolean;
  onClose: () => void;
  targetListing: MarketplaceItem | null;
  onSubmitReport: (report: ListingReport) => void;
}

export const ReportModal: React.FC<ReportModalProps> = ({
  isOpen,
  onClose,
  targetListing,
  onSubmitReport,
}) => {
  const [reason, setReason] = useState<ListingReport['reason']>('Scam');
  const [details, setDetails] = useState('');
  const [reporterName, setReporterName] = useState('');
  const [reporterContact, setReporterContact] = useState('');
  const [isSubmitted, setIsSubmitted] = useState(false);

  if (!isOpen || !targetListing) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!details.trim()) return;

    const newReport: ListingReport = {
      id: `rep-${Date.now()}`,
      listingId: targetListing.id,
      listingTitle: targetListing.title,
      sellerName: targetListing.seller.name,
      reason,
      details,
      reporterName: reporterName.trim() || 'Anonymous User',
      reporterContact: reporterContact.trim() || 'Not provided',
      createdAt: new Date().toISOString().replace('T', ' ').slice(0, 16),
      status: 'New',
    };

    onSubmitReport(newReport);
    setIsSubmitted(true);
  };

  const handleClose = () => {
    setIsSubmitted(false);
    setDetails('');
    setReporterName('');
    setReporterContact('');
    onClose();
  };

  const reportReasons: ListingReport['reason'][] = [
    'Scam',
    'Fake listing',
    'Wrong price',
    'Wrong category',
    'Duplicate',
    'Prohibited item',
    'Misleading information',
    'Other',
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-slate-950/80 backdrop-blur-xs">
      <div className="relative w-full max-w-lg bg-white rounded-2xl shadow-2xl border border-slate-200 overflow-hidden my-auto">
        {/* Header */}
        <div className="p-4 sm:p-5 border-b border-slate-200 bg-rose-950 text-white flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-rose-500/20 text-rose-400 flex items-center justify-center border border-rose-500/30">
              <ShieldAlert className="w-4 h-4" />
            </div>
            <div>
              <h3 className="font-bold text-base font-display text-white">
                Report Listing to Moderation
              </h3>
              <p className="text-[11px] text-rose-200">
                StrucTrade Trust & Safety Enforcement
              </p>
            </div>
          </div>
          <button
            onClick={handleClose}
            className="p-1.5 text-rose-300 hover:text-white rounded-lg hover:bg-rose-900 transition cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {!isSubmitted ? (
          <form onSubmit={handleSubmit} className="p-5 sm:p-6 space-y-4">
            <div className="p-3 rounded-xl bg-slate-50 border border-slate-200 text-xs">
              <p className="text-slate-500">Target Listing:</p>
              <p className="font-bold text-slate-900 truncate">{targetListing.title}</p>
              <p className="text-slate-500 text-[11px]">Seller: {targetListing.seller.name}</p>
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-700 uppercase tracking-wider block">
                Primary Reason for Report *
              </label>
              <div className="grid grid-cols-2 gap-2">
                {reportReasons.map((r) => (
                  <button
                    key={r}
                    type="button"
                    onClick={() => setReason(r)}
                    className={`py-2 px-3 rounded-lg border text-left text-xs transition cursor-pointer font-medium ${
                      reason === r
                        ? 'border-rose-600 bg-rose-50 text-rose-900 font-bold'
                        : 'border-slate-200 text-slate-700 hover:bg-slate-50'
                    }`}
                  >
                    {r}
                  </button>
                ))}
              </div>
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-700 uppercase tracking-wider block">
                Evidence or Specific Details *
              </label>
              <textarea
                required
                rows={3}
                value={details}
                onChange={(e) => setDetails(e.target.value)}
                placeholder="Explain what is misleading, fraudulent, or inaccurate about this listing..."
                className="w-full p-3 rounded-xl border border-slate-200 text-xs focus:outline-none focus:ring-2 focus:ring-rose-500"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div className="space-y-1">
                <label className="text-[11px] font-semibold text-slate-600 block">
                  Your Name (Optional)
                </label>
                <input
                  type="text"
                  value={reporterName}
                  onChange={(e) => setReporterName(e.target.value)}
                  placeholder="e.g. Engr. David"
                  className="w-full px-3 py-2 rounded-lg border border-slate-200 text-xs"
                />
              </div>
              <div className="space-y-1">
                <label className="text-[11px] font-semibold text-slate-600 block">
                  Contact Phone / Email (Optional)
                </label>
                <input
                  type="text"
                  value={reporterContact}
                  onChange={(e) => setReporterContact(e.target.value)}
                  placeholder="080... or email"
                  className="w-full px-3 py-2 rounded-lg border border-slate-200 text-xs"
                />
              </div>
            </div>

            <div className="pt-2 flex items-center justify-end gap-3">
              <button
                type="button"
                onClick={handleClose}
                className="py-2 px-4 rounded-xl border border-slate-200 text-slate-700 text-xs font-bold hover:bg-slate-50 cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="py-2 px-5 rounded-xl bg-rose-600 hover:bg-rose-700 text-white text-xs font-bold transition flex items-center gap-1.5 cursor-pointer shadow-md shadow-rose-900/20"
              >
                <AlertTriangle className="w-3.5 h-3.5" />
                <span>Submit to Trust & Safety</span>
              </button>
            </div>
          </form>
        ) : (
          <div className="p-6 text-center space-y-4">
            <div className="w-14 h-14 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto">
              <CheckCircle className="w-8 h-8" />
            </div>
            <div className="space-y-1">
              <h4 className="font-bold text-slate-900 text-base">
                Report Logged Successfully
              </h4>
              <p className="text-xs text-slate-600 max-w-sm mx-auto">
                Our Nigerian marketplace operations team reviews reported listings within 2 hours. If confirmed fraudulent, the listing will be suspended immediately.
              </p>
            </div>
            <button
              onClick={handleClose}
              className="py-2 px-5 rounded-xl bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold cursor-pointer"
            >
              Done
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
