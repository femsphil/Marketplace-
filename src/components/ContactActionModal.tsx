import React, { useState, useEffect } from 'react';
import { 
  X, 
  Phone, 
  MessageSquare, 
  ShieldCheck, 
  Check, 
  MapPin, 
  AlertCircle, 
  User, 
  Smartphone,
  Info
} from 'lucide-react';
import { MarketplaceItem, SellerInfo, UserAccount } from '../types';
import { formatFullNaira } from '../lib/formatters';

interface ContactActionModalProps {
  isOpen: boolean;
  onClose: () => void;
  targetItem: MarketplaceItem | null;
  targetSeller?: SellerInfo | null;
  actionType: 'whatsapp' | 'call';
  currentUser?: UserAccount;
  onProceed: (contact: { name: string; phone: string; whatsapp: string; actionType: 'whatsapp' | 'call' }) => void;
}

export const ContactActionModal: React.FC<ContactActionModalProps> = ({
  isOpen,
  onClose,
  targetItem,
  targetSeller,
  actionType: initialActionType,
  currentUser,
  onProceed,
}) => {
  if (!isOpen) return null;

  const seller = targetSeller || targetItem?.seller;
  const [currentMode, setCurrentMode] = useState<'whatsapp' | 'call'>(initialActionType);

  // Retrieve saved contact from localStorage or currentUser
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [whatsapp, setWhatsapp] = useState('');
  const [sameAsPhone, setSameAsPhone] = useState(true);
  const [rememberMe, setRememberMe] = useState(true);
  const [errorMsg, setErrorMsg] = useState('');

  useEffect(() => {
    setCurrentMode(initialActionType);
  }, [initialActionType]);

  useEffect(() => {
    try {
      const saved = localStorage.getItem('structrade_buyer_contact');
      if (saved) {
        const parsed = JSON.parse(saved);
        if (parsed.name) setName(parsed.name);
        if (parsed.phone) setPhone(parsed.phone);
        if (parsed.whatsapp) {
          setWhatsapp(parsed.whatsapp);
          setSameAsPhone(parsed.whatsapp === parsed.phone);
        }
        return;
      }
    } catch {}

    // Fallback to currentUser
    if (currentUser) {
      if (currentUser.name && currentUser.name !== 'Guest User') {
        setName(currentUser.name);
      }
      if (currentUser.phone) {
        setPhone(currentUser.phone);
        setWhatsapp(currentUser.whatsapp || currentUser.phone);
      }
    }
  }, [currentUser, isOpen]);

  const handlePhoneChange = (val: string) => {
    setPhone(val);
    if (sameAsPhone) {
      setWhatsapp(val);
    }
  };

  const handleToggleSameAsPhone = (checked: boolean) => {
    setSameAsPhone(checked);
    if (checked) {
      setWhatsapp(phone);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');

    const cleanName = name.trim();
    const cleanPhone = phone.trim();
    const cleanWhatsapp = (sameAsPhone ? cleanPhone : whatsapp).trim();

    if (!cleanName) {
      setErrorMsg('Please enter your Name so the seller knows who is contacting them.');
      return;
    }
    if (!cleanPhone) {
      setErrorMsg('Please enter your Phone number.');
      return;
    }
    if (currentMode === 'whatsapp' && !cleanWhatsapp) {
      setErrorMsg('Please enter your WhatsApp number.');
      return;
    }

    if (rememberMe) {
      try {
        localStorage.setItem(
          'structrade_buyer_contact',
          JSON.stringify({
            name: cleanName,
            phone: cleanPhone,
            whatsapp: cleanWhatsapp,
          })
        );
      } catch {}
    }

    onProceed({
      name: cleanName,
      phone: cleanPhone,
      whatsapp: cleanWhatsapp,
      actionType: currentMode,
    });
  };

  const targetSellerName = seller?.name || 'Verified Merchant';
  const targetSellerPhone = seller?.phone || '+234 800 000 0000';
  const targetSellerWhatsapp = seller?.whatsapp || seller?.phone || '+234 800 000 0000';

  // Preview message
  const previewMessage = targetItem
    ? `Hello ${targetSellerName}, my name is ${name || '[Your Name]'} (Phone: ${phone || '[Your Phone]'}). I am inquiring about "${targetItem.title}" (${formatFullNaira(targetItem.price)}) on StrucTrade Nigeria. Is it available for inspection?`
    : `Hello ${targetSellerName}, my name is ${name || '[Your Name]'} (Phone: ${phone || '[Your Phone]'}). I am inquiring about your listings on StrucTrade Nigeria.`;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/75 backdrop-blur-xs animate-in fade-in duration-150 overflow-y-auto">
      <div className="bg-white rounded-2xl max-w-lg w-full my-auto shadow-2xl border border-slate-200 overflow-hidden relative max-h-[94vh] flex flex-col">
        
        {/* Header */}
        <div className="p-4 sm:p-5 border-b border-slate-100 flex items-center justify-between bg-slate-50/80 sticky top-0 z-10">
          <div className="flex items-center gap-2.5">
            <div className={`w-9 h-9 rounded-xl flex items-center justify-center font-bold text-white shadow-xs ${
              currentMode === 'whatsapp' ? 'bg-emerald-600' : 'bg-slate-900'
            }`}>
              {currentMode === 'whatsapp' ? (
                <MessageSquare className="w-5 h-5 text-white" />
              ) : (
                <Phone className="w-5 h-5 text-emerald-400" />
              )}
            </div>
            <div>
              <h2 className="text-sm sm:text-base font-bold text-slate-900 leading-tight">
                {currentMode === 'whatsapp' ? 'WhatsApp Direct Chat' : 'Direct Phone Call'}
              </h2>
              <p className="text-[11px] text-slate-500">
                Connect with verified seller in Nigeria
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 text-slate-400 hover:text-slate-700 rounded-full hover:bg-slate-200/60 transition cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Scrollable Content */}
        <div className="p-4 sm:p-6 overflow-y-auto space-y-4">
          
          {/* Item or Seller preview snippet */}
          {targetItem ? (
            <div className="flex gap-3 p-3 bg-slate-50 rounded-xl border border-slate-200/80 items-center">
              <img
                src={targetItem.images[0]}
                alt={targetItem.title}
                className="w-14 h-14 rounded-lg object-cover shrink-0 border border-slate-200"
              />
              <div className="min-w-0 flex-1">
                <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-700 block">
                  {targetItem.vertical.toUpperCase()} • REF-{targetItem.id.slice(-6).toUpperCase()}
                </span>
                <h4 className="text-xs font-bold text-slate-900 truncate">
                  {targetItem.title}
                </h4>
                <div className="flex items-center justify-between gap-2 mt-0.5">
                  <span className="text-xs font-extrabold text-emerald-700">
                    {formatFullNaira(targetItem.price)}
                  </span>
                  <span className="text-[10px] text-slate-500 truncate flex items-center gap-1">
                    <MapPin className="w-3 h-3 text-slate-400 shrink-0" />
                    {targetItem.location.area}, {targetItem.location.state}
                  </span>
                </div>
              </div>
            </div>
          ) : seller ? (
            <div className="flex gap-3 p-3 bg-slate-50 rounded-xl border border-slate-200/80 items-center">
              <img
                src={seller.avatarUrl}
                alt={seller.name}
                className="w-12 h-12 rounded-full object-cover shrink-0 border border-slate-200"
              />
              <div className="min-w-0 flex-1">
                <div className="flex items-center gap-1.5">
                  <h4 className="text-xs font-bold text-slate-900 truncate">
                    {seller.companyName || seller.name}
                  </h4>
                  <ShieldCheck className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                </div>
                <p className="text-[11px] text-slate-500 truncate">{seller.role} • {seller.location}</p>
              </div>
            </div>
          ) : null}

          {/* Mode Switcher Toggle */}
          <div className="grid grid-cols-2 gap-2 p-1 bg-slate-100 rounded-xl">
            <button
              type="button"
              onClick={() => setCurrentMode('whatsapp')}
              className={`py-2 px-3 rounded-lg text-xs font-bold flex items-center justify-center gap-1.5 transition cursor-pointer ${
                currentMode === 'whatsapp'
                  ? 'bg-emerald-600 text-white shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <MessageSquare className="w-3.5 h-3.5" />
              <span>WhatsApp Chat</span>
            </button>
            <button
              type="button"
              onClick={() => setCurrentMode('call')}
              className={`py-2 px-3 rounded-lg text-xs font-bold flex items-center justify-center gap-1.5 transition cursor-pointer ${
                currentMode === 'call'
                  ? 'bg-slate-900 text-white shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <Phone className="w-3.5 h-3.5" />
              <span>Voice Phone Call</span>
            </button>
          </div>

          {/* FORM: User Name, Phone & WhatsApp */}
          <form id="contact-action-form" onSubmit={handleSubmit} className="space-y-3.5">
            <div className="p-3.5 bg-emerald-50/70 border border-emerald-200 rounded-xl space-y-1">
              <div className="flex items-center gap-1.5 text-emerald-950 font-bold text-xs">
                <User className="w-3.5 h-3.5 text-emerald-700" />
                <span>Your Contact Details</span>
              </div>
              <p className="text-[11px] text-emerald-900/80 leading-relaxed">
                Add your name, phone, and WhatsApp so the seller can identify your inquiry and respond immediately.
              </p>
            </div>

            {errorMsg && (
              <div className="p-2.5 bg-rose-50 border border-rose-200 rounded-lg text-rose-700 text-xs flex items-center gap-2">
                <AlertCircle className="w-4 h-4 shrink-0" />
                <span>{errorMsg}</span>
              </div>
            )}

            {/* Name input */}
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                Your Full Name <span className="text-rose-500">*</span>
              </label>
              <div className="relative">
                <input
                  type="text"
                  required
                  placeholder="e.g. Engr. David Okon / Hajia Fatima"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full pl-3 pr-3 py-2.5 text-xs rounded-xl border border-slate-300 bg-white focus:border-emerald-600 focus:ring-2 focus:ring-emerald-100 outline-none transition"
                />
              </div>
            </div>

            {/* Phone input */}
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                Your Phone Number <span className="text-rose-500">*</span>
              </label>
              <div className="relative">
                <input
                  type="tel"
                  required
                  placeholder="e.g. 0803 123 4567 or +234 803 123 4567"
                  value={phone}
                  onChange={(e) => handlePhoneChange(e.target.value)}
                  className="w-full pl-3 pr-3 py-2.5 text-xs rounded-xl border border-slate-300 bg-white focus:border-emerald-600 focus:ring-2 focus:ring-emerald-100 outline-none transition"
                />
              </div>
              <span className="text-[10px] text-slate-400 mt-0.5 block">
                Direct phone number for voice contact and inspection scheduling
              </span>
            </div>

            {/* WhatsApp input */}
            <div>
              <div className="flex items-center justify-between mb-1">
                <label className="text-xs font-bold text-slate-700">
                  Your WhatsApp Number <span className="text-rose-500">*</span>
                </label>
                <label className="flex items-center gap-1.5 text-xs text-emerald-700 font-semibold cursor-pointer select-none">
                  <input
                    type="checkbox"
                    checked={sameAsPhone}
                    onChange={(e) => handleToggleSameAsPhone(e.target.checked)}
                    className="rounded text-emerald-600 focus:ring-emerald-500 cursor-pointer"
                  />
                  <span>Same as Phone</span>
                </label>
              </div>
              <input
                type="tel"
                required
                disabled={sameAsPhone}
                placeholder="e.g. 0803 123 4567"
                value={sameAsPhone ? phone : whatsapp}
                onChange={(e) => setWhatsapp(e.target.value)}
                className={`w-full pl-3 pr-3 py-2.5 text-xs rounded-xl border border-slate-300 outline-none transition ${
                  sameAsPhone
                    ? 'bg-slate-100 text-slate-500 cursor-not-allowed'
                    : 'bg-white focus:border-emerald-600 focus:ring-2 focus:ring-emerald-100'
                }`}
              />
            </div>

            {/* Remember Me Checkbox */}
            <div className="flex items-center gap-2 pt-1">
              <input
                id="remember-contact"
                type="checkbox"
                checked={rememberMe}
                onChange={(e) => setRememberMe(e.target.checked)}
                className="rounded text-emerald-600 focus:ring-emerald-500 cursor-pointer"
              />
              <label htmlFor="remember-contact" className="text-xs text-slate-600 cursor-pointer select-none">
                Save my details on this device for future inquiries and listings
              </label>
            </div>

            {/* WhatsApp Message preview */}
            {currentMode === 'whatsapp' && (
              <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 text-xs space-y-1">
                <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block">
                  Pre-filled WhatsApp Message to Seller:
                </span>
                <p className="text-[11px] text-slate-700 italic bg-white p-2.5 rounded-lg border border-slate-100">
                  "{previewMessage}"
                </p>
              </div>
            )}

            {currentMode === 'call' && (
              <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 text-xs flex items-center justify-between">
                <div>
                  <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block">
                    Seller Calling Number:
                  </span>
                  <span className="text-sm font-bold text-slate-900 font-mono">
                    {targetSellerPhone}
                  </span>
                </div>
                <span className="px-2 py-1 bg-emerald-100 text-emerald-800 text-[10px] font-bold rounded-md">
                  Active Line
                </span>
              </div>
            )}
          </form>
        </div>

        {/* Sticky Action Footer */}
        <div className="p-4 border-t border-slate-100 bg-white flex flex-col sm:flex-row items-center justify-end gap-2.5 sticky bottom-0 z-10">
          <button
            type="button"
            onClick={onClose}
            className="w-full sm:w-auto py-2.5 px-4 rounded-xl border border-slate-200 text-slate-700 font-semibold text-xs hover:bg-slate-50 transition cursor-pointer"
          >
            Cancel
          </button>

          <button
            type="submit"
            form="contact-action-form"
            className={`w-full sm:w-auto py-2.5 px-6 rounded-xl font-bold text-xs text-white shadow-xs transition flex items-center justify-center gap-2 cursor-pointer ${
              currentMode === 'whatsapp'
                ? 'bg-emerald-600 hover:bg-emerald-700'
                : 'bg-slate-900 hover:bg-slate-800'
            }`}
          >
            {currentMode === 'whatsapp' ? (
              <>
                <MessageSquare className="w-4 h-4" />
                <span>Launch WhatsApp Chat</span>
              </>
            ) : (
              <>
                <Phone className="w-4 h-4 text-emerald-400" />
                <span>Call Seller ({targetSellerPhone})</span>
              </>
            )}
          </button>
        </div>

      </div>
    </div>
  );
};
