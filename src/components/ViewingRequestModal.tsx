import React, { useState } from 'react';
import { X, Calendar, Clock, MapPin, CheckCircle2, User, Phone, Mail, FileText } from 'lucide-react';
import { MarketplaceItem, ViewingRequest } from '../types';

interface ViewingRequestModalProps {
  item: MarketplaceItem | null;
  onClose: () => void;
  onSubmit: (request: Omit<ViewingRequest, 'id' | 'createdAt' | 'status'>) => void;
}

export const ViewingRequestModal: React.FC<ViewingRequestModalProps> = ({
  item,
  onClose,
  onSubmit,
}) => {
  if (!item) return null;

  const [seekerName, setSeekerName] = useState('');
  const [seekerPhone, setSeekerPhone] = useState('');
  const [seekerEmail, setSeekerEmail] = useState('');
  const [preferredDate, setPreferredDate] = useState('');
  const [preferredTime, setPreferredTime] = useState('10:00 AM - 12:00 PM');
  const [message, setMessage] = useState('I would like to schedule an on-site property inspection and review original title documents.');
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!seekerName || !seekerPhone || !preferredDate) return;

    onSubmit({
      propertyId: item.id,
      propertyTitle: item.title,
      seekerName,
      seekerPhone,
      seekerEmail,
      preferredDate,
      preferredTime,
      message,
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
            <div className="w-16 h-16 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto mb-4">
              <CheckCircle2 className="w-10 h-10" />
            </div>
            <h3 className="text-xl font-extrabold text-slate-900 font-display mb-2">
              Viewing Request Sent!
            </h3>
            <p className="text-sm text-slate-600 max-w-md mx-auto">
              Your inspection request for <strong className="text-slate-800">{item.title}</strong> has been forwarded directly to <strong>{item.seller.name}</strong>. They will confirm your time slot shortly.
            </p>
          </div>
        ) : (
          <div className="overflow-y-auto pr-1">
            <div className="flex items-center gap-2 text-xs font-bold text-emerald-700 uppercase tracking-wider mb-2">
              <Calendar className="w-4 h-4" />
              <span>Request Property Viewing</span>
            </div>

            <h3 className="text-lg font-extrabold text-slate-900 font-display mb-1">
              Book Physical Inspection
            </h3>
            <p className="text-xs text-slate-500 mb-4 line-clamp-1">
              {item.title} • {item.location.area}, {item.location.state}
            </p>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Your Full Name *
                  </label>
                  <div className="relative flex items-center">
                    <User className="w-4 h-4 text-slate-400 absolute left-3" />
                    <input
                      type="text"
                      required
                      placeholder="e.g. Dr. Babatunde Ade"
                      value={seekerName}
                      onChange={(e) => setSeekerName(e.target.value)}
                      className="w-full pl-9 pr-3 py-2 text-xs rounded-lg border border-slate-200 focus:border-emerald-600 focus:ring-1 focus:ring-emerald-600 outline-none"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Phone / WhatsApp *
                  </label>
                  <div className="relative flex items-center">
                    <Phone className="w-4 h-4 text-slate-400 absolute left-3" />
                    <input
                      type="tel"
                      required
                      placeholder="+234 803 000 0000"
                      value={seekerPhone}
                      onChange={(e) => setSeekerPhone(e.target.value)}
                      className="w-full pl-9 pr-3 py-2 text-xs rounded-lg border border-slate-200 focus:border-emerald-600 focus:ring-1 focus:ring-emerald-600 outline-none"
                    />
                  </div>
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Email Address (for calendar invite)
                </label>
                <div className="relative flex items-center">
                  <Mail className="w-4 h-4 text-slate-400 absolute left-3" />
                  <input
                    type="email"
                    placeholder="name@company.ng"
                    value={seekerEmail}
                    onChange={(e) => setSeekerEmail(e.target.value)}
                    className="w-full pl-9 pr-3 py-2 text-xs rounded-lg border border-slate-200 focus:border-emerald-600 focus:ring-1 focus:ring-emerald-600 outline-none"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Preferred Date *
                  </label>
                  <input
                    type="date"
                    required
                    value={preferredDate}
                    onChange={(e) => setPreferredDate(e.target.value)}
                    className="w-full p-2 text-xs rounded-lg border border-slate-200 focus:border-emerald-600 focus:ring-1 focus:ring-emerald-600 outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Preferred Time Slot *
                  </label>
                  <select
                    value={preferredTime}
                    onChange={(e) => setPreferredTime(e.target.value)}
                    className="w-full p-2 text-xs rounded-lg border border-slate-200 focus:border-emerald-600 focus:ring-1 focus:ring-emerald-600 outline-none"
                  >
                    <option value="09:00 AM - 11:00 AM">Morning (09:00 AM - 11:00 AM)</option>
                    <option value="11:00 AM - 01:00 PM">Midday (11:00 AM - 01:00 PM)</option>
                    <option value="02:00 PM - 04:00 PM">Afternoon (02:00 PM - 04:00 PM)</option>
                    <option value="04:00 PM - 06:00 PM">Late Afternoon (04:00 PM - 06:00 PM)</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Message or Specific Inquiries
                </label>
                <textarea
                  rows={3}
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  className="w-full p-2.5 text-xs rounded-lg border border-slate-200 focus:border-emerald-600 focus:ring-1 focus:ring-emerald-600 outline-none"
                />
              </div>

              <div className="pt-2">
                <button
                  type="submit"
                  className="w-full py-2.5 px-4 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs rounded-xl shadow-xs transition flex items-center justify-center gap-2 cursor-pointer"
                >
                  <Calendar className="w-4 h-4" />
                  <span>Send Viewing Request</span>
                </button>
                <p className="text-[11px] text-slate-400 text-center mt-2">
                  The listing agent will receive an SMS & dashboard notification.
                </p>
              </div>
            </form>
          </div>
        )}
      </div>
    </div>
  );
};
