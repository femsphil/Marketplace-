import React, { useState, useMemo } from 'react';
import { X, CalendarClock, Truck, UserCheck, MapPin, Calculator, CheckCircle2 } from 'lucide-react';
import { MarketplaceItem, RentalRequest } from '../types';
import { formatFullNaira } from '../lib/formatters';

interface RentalRequestModalProps {
  item: MarketplaceItem | null;
  onClose: () => void;
  onSubmit: (request: Omit<RentalRequest, 'id' | 'createdAt' | 'status'>) => void;
}

export const RentalRequestModal: React.FC<RentalRequestModalProps> = ({
  item,
  onClose,
  onSubmit,
}) => {
  if (!item || !item.equipment) return null;
  const eq = item.equipment;

  const [clientName, setClientName] = useState('');
  const [clientPhone, setClientPhone] = useState('');
  const [companyName, setCompanyName] = useState('');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [deliveryAddress, setDeliveryAddress] = useState('');
  const [operatorRequired, setOperatorRequired] = useState(eq.operatorIncluded);
  const [deliveryRequired, setDeliveryRequired] = useState(eq.deliveryAvailable);
  const [submitted, setSubmitted] = useState(false);

  // Live estimated rental total calculation
  const calculatedEstimate = useMemo(() => {
    if (!startDate || !endDate) return eq.dailyRate || 0;
    const start = new Date(startDate);
    const end = new Date(endDate);
    const diffTime = Math.max(1, Math.ceil((end.getTime() - start.getTime()) / (1000 * 60 * 60 * 24)));

    let total = 0;
    if (diffTime >= 30 && eq.monthlyRate) {
      const months = Math.floor(diffTime / 30);
      const remainingDays = diffTime % 30;
      total = months * eq.monthlyRate + remainingDays * (eq.dailyRate || 0);
    } else if (diffTime >= 7 && eq.weeklyRate) {
      const weeks = Math.floor(diffTime / 7);
      const remainingDays = diffTime % 7;
      total = weeks * eq.weeklyRate + remainingDays * (eq.dailyRate || 0);
    } else {
      total = diffTime * (eq.dailyRate || 0);
    }

    if (deliveryRequired) {
      total += 150000; // Flat estimated low-bed mobilization fee in Lagos/Ogun
    }

    return total;
  }, [startDate, endDate, eq, deliveryRequired]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!clientName || !clientPhone || !startDate || !endDate || !deliveryAddress) return;

    onSubmit({
      equipmentId: item.id,
      equipmentTitle: item.title,
      clientName,
      clientPhone,
      companyName,
      startDate,
      endDate,
      deliveryAddress,
      operatorRequired,
      deliveryRequired,
      estimatedTotal: calculatedEstimate,
    });

    setSubmitted(true);
    setTimeout(() => {
      onClose();
    }, 1800);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/60 backdrop-blur-xs animate-in fade-in duration-150 overflow-y-auto">
      <div className="bg-white rounded-2xl max-w-lg w-full p-5 sm:p-6 shadow-2xl border border-slate-200 relative overflow-hidden my-auto max-h-[92vh] flex flex-col">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 text-slate-400 hover:text-slate-600 rounded-full hover:bg-slate-100 transition"
        >
          <X className="w-5 h-5" />
        </button>

        {submitted ? (
          <div className="text-center py-8">
            <div className="w-16 h-16 rounded-full bg-amber-100 text-amber-600 flex items-center justify-center mx-auto mb-4">
              <CheckCircle2 className="w-10 h-10" />
            </div>
            <h3 className="text-xl font-extrabold text-slate-900 font-display mb-2">
              Rental Request Dispatched!
            </h3>
            <p className="text-sm text-slate-600 max-w-md mx-auto">
              Your equipment hire requisition for <strong className="text-slate-800">{item.title}</strong> has been sent to <strong>{item.seller.name}</strong>. Their logistics desk will confirm site mobilization details with you shortly.
            </p>
          </div>
        ) : (
          <div className="overflow-y-auto pr-1">
            <div className="flex items-center gap-2 text-xs font-bold text-amber-600 uppercase tracking-wider mb-2">
              <CalendarClock className="w-4 h-4" />
              <span>Heavy Equipment Rental Requisition</span>
            </div>

            <h3 className="text-lg font-extrabold text-slate-900 font-display mb-1">
              Hire Machinery & Request Mobilization
            </h3>
            <p className="text-xs text-slate-500 mb-4 line-clamp-1">
              {item.title} • {eq.brand} ({eq.condition})
            </p>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Contact Name *
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="Engr. Tunde Bakare"
                    value={clientName}
                    onChange={(e) => setClientName(e.target.value)}
                    className="w-full p-2 text-xs rounded-lg border border-slate-200 focus:border-amber-600 focus:ring-1 focus:ring-amber-600 outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Phone / WhatsApp *
                  </label>
                  <input
                    type="tel"
                    required
                    placeholder="+234 803 000 0000"
                    value={clientPhone}
                    onChange={(e) => setClientPhone(e.target.value)}
                    className="w-full p-2 text-xs rounded-lg border border-slate-200 focus:border-amber-600 focus:ring-1 focus:ring-amber-600 outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Company / Project Contractor Name
                </label>
                <input
                  type="text"
                  placeholder="e.g. Apex Civil Roadworks Ltd"
                  value={companyName}
                  onChange={(e) => setCompanyName(e.target.value)}
                  className="w-full p-2 text-xs rounded-lg border border-slate-200 focus:border-amber-600 focus:ring-1 focus:ring-amber-600 outline-none"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Rental Start Date *
                  </label>
                  <input
                    type="date"
                    required
                    value={startDate}
                    onChange={(e) => setStartDate(e.target.value)}
                    className="w-full p-2 text-xs rounded-lg border border-slate-200 focus:border-amber-600 focus:ring-1 focus:ring-amber-600 outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Rental End Date *
                  </label>
                  <input
                    type="date"
                    required
                    value={endDate}
                    onChange={(e) => setEndDate(e.target.value)}
                    className="w-full p-2 text-xs rounded-lg border border-slate-200 focus:border-amber-600 focus:ring-1 focus:ring-amber-600 outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Project Site Delivery Address *
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Plot 5 Lekki-Epe Expressway, Ibeju Lekki, Lagos"
                  value={deliveryAddress}
                  onChange={(e) => setDeliveryAddress(e.target.value)}
                  className="w-full p-2 text-xs rounded-lg border border-slate-200 focus:border-amber-600 focus:ring-1 focus:ring-amber-600 outline-none"
                />
              </div>

              {/* Service Options */}
              <div className="p-3 bg-amber-50/60 border border-amber-200 rounded-xl space-y-2">
                <label className="flex items-center justify-between text-xs font-medium text-slate-800 cursor-pointer">
                  <span className="flex items-center gap-2">
                    <UserCheck className="w-4 h-4 text-amber-700" />
                    <span>Include Certified Heavy Machine Operator</span>
                  </span>
                  <input
                    type="checkbox"
                    checked={operatorRequired}
                    onChange={(e) => setOperatorRequired(e.target.checked)}
                    className="w-4 h-4 text-amber-600 rounded"
                  />
                </label>

                <label className="flex items-center justify-between text-xs font-medium text-slate-800 cursor-pointer">
                  <span className="flex items-center gap-2">
                    <Truck className="w-4 h-4 text-amber-700" />
                    <span>Low-Bed Trailer Mobilization & Site Delivery</span>
                  </span>
                  <input
                    type="checkbox"
                    checked={deliveryRequired}
                    onChange={(e) => setDeliveryRequired(e.target.checked)}
                    className="w-4 h-4 text-amber-600 rounded"
                  />
                </label>
              </div>

              {/* Live Price Estimation Box */}
              <div className="p-3 bg-slate-900 text-white rounded-xl flex items-center justify-between">
                <div>
                  <span className="block text-[10px] text-amber-400 font-semibold uppercase flex items-center gap-1">
                    <Calculator className="w-3 h-3" />
                    <span>Estimated Rental Cost</span>
                  </span>
                  <span className="text-xl font-extrabold font-display">
                    {formatFullNaira(calculatedEstimate)}
                  </span>
                </div>
                <span className="text-[11px] text-slate-400 text-right">
                  Excluding security deposit <br />
                  ({formatFullNaira(eq.securityDeposit || 0)})
                </span>
              </div>

              <div className="pt-2">
                <button
                  type="submit"
                  className="w-full py-2.5 px-4 bg-amber-600 hover:bg-amber-700 text-white font-bold text-xs rounded-xl shadow-xs transition flex items-center justify-center gap-2 cursor-pointer"
                >
                  <CalendarClock className="w-4 h-4" />
                  <span>Submit Rental Requisition</span>
                </button>
              </div>
            </form>
          </div>
        )}
      </div>
    </div>
  );
};
