import React, { useState } from 'react';
import { X, CheckCircle, ShieldCheck, CreditCard, Building, Lock, ArrowRight, Loader2, Sparkles } from 'lucide-react';
import { MarketplaceItem, PaymentTransaction, PromotionPackage, SubscriptionPlan } from '../types';
import { formatFullNaira } from '../lib/formatters';
import { SUBSCRIPTION_PLANS, PROMOTION_PACKAGES } from '../data/platformData';

interface PaymentModalProps {
  isOpen: boolean;
  onClose: () => void;
  targetListing?: MarketplaceItem | null;
  mode: 'subscription' | 'promotion';
  onPaymentSuccess: (transaction: PaymentTransaction, targetListingId?: string, promoType?: 'featured' | 'top_search' | 'homepage', newPlan?: 'Free' | 'Professional' | 'Business' | 'Enterprise') => void;
}

export const PaymentModal: React.FC<PaymentModalProps> = ({
  isOpen,
  onClose,
  targetListing,
  mode,
  onPaymentSuccess,
}) => {
  const [selectedPlanId, setSelectedPlanId] = useState<string>('professional');
  const [selectedPromoId, setSelectedPromoId] = useState<string>('featured');
  const [gateway, setGateway] = useState<'Paystack' | 'Flutterwave'>('Paystack');
  const [paymentMethod, setPaymentMethod] = useState<'card' | 'transfer' | 'ussd'>('card');
  const [isProcessing, setIsProcessing] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [recentTx, setRecentTx] = useState<PaymentTransaction | null>(null);

  if (!isOpen) return null;

  const currentPlan = SUBSCRIPTION_PLANS.find((p) => p.id === selectedPlanId) || SUBSCRIPTION_PLANS[1];
  const currentPromo = PROMOTION_PACKAGES.find((p) => p.id === selectedPromoId) || PROMOTION_PACKAGES[0];

  const isFreePlanSelected = mode === 'subscription' && currentPlan.pricePerMonth === 0;
  const totalAmount = mode === 'subscription' ? currentPlan.pricePerMonth : currentPromo.price;
  const itemName = mode === 'subscription' ? `${currentPlan.name} Subscription` : `${currentPromo.name} (${targetListing?.title || 'Listing'})`;

  const handleExecutePayment = () => {
    setIsProcessing(true);

    setTimeout(() => {
      const prefix = gateway === 'Paystack' ? 'STR-PSTK' : 'STR-FLW';
      const reference = `${prefix}-${Math.floor(100000 + Math.random() * 900000)}`;
      
      let methodLabel: PaymentTransaction['paymentMethod'] = 'Paystack Debit Card';
      if (gateway === 'Flutterwave') {
        methodLabel = paymentMethod === 'card' ? 'Flutterwave Card' : 'Flutterwave Bank Transfer';
      } else {
        if (paymentMethod === 'transfer') methodLabel = 'Direct Bank Transfer';
        else if (paymentMethod === 'ussd') methodLabel = 'USSD *737#';
        else methodLabel = 'Paystack Debit Card';
      }

      const newTx: PaymentTransaction = {
        id: `tx-${Date.now()}`,
        reference,
        type: mode,
        planOrPackageName: itemName,
        amount: totalAmount,
        status: 'Successful',
        date: new Date().toISOString().replace('T', ' ').slice(0, 16),
        customerEmail: 'billing@structrade.ng',
        paymentMethod: methodLabel,
        gateway: gateway,
      };

      setRecentTx(newTx);
      setIsProcessing(false);
      setIsSuccess(true);

      const promoType = mode === 'promotion' ? (currentPromo.id as 'featured' | 'top_search' | 'homepage') : undefined;
      const planName = mode === 'subscription' ? (currentPlan.name.split(' ')[0] as 'Free' | 'Professional' | 'Business' | 'Enterprise') : undefined;

      onPaymentSuccess(newTx, targetListing?.id, promoType, planName);
    }, isFreePlanSelected ? 400 : 1200);
  };

  const handleResetAndClose = () => {
    setIsSuccess(false);
    setIsProcessing(false);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-slate-950/80 backdrop-blur-xs overflow-y-auto">
      <div className="relative w-full max-w-xl bg-white rounded-2xl shadow-2xl border border-slate-200 overflow-hidden my-auto">
        {/* Header */}
        <div className="p-4 sm:p-5 border-b border-slate-200 bg-slate-900 text-white flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-emerald-500/20 text-emerald-400 flex items-center justify-center border border-emerald-500/30">
              <Sparkles className="w-4 h-4" />
            </div>
            <div>
              <h3 className="font-bold text-base font-display">
                {mode === 'subscription' ? 'Upgrade Seller Tier' : 'Promote & Boost Listing'}
              </h3>
              <p className="text-[11px] text-slate-400">
                Secured by Paystack • Instant Automated Activation
              </p>
            </div>
          </div>
          <button
            onClick={handleResetAndClose}
            className="p-1.5 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800 transition cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        {!isSuccess ? (
          <div className="p-4 sm:p-6 space-y-5 overflow-y-auto flex-1">
            {/* Target Item Reference (if promotion) */}
            {mode === 'promotion' && targetListing && (
              <div className="p-3 rounded-xl bg-slate-50 border border-slate-200 flex items-center gap-3">
                <img
                  src={targetListing.images[0]}
                  alt={targetListing.title}
                  className="w-12 h-12 rounded-lg object-cover bg-slate-200 shrink-0"
                />
                <div className="min-w-0">
                  <span className="text-[10px] font-bold text-emerald-700 uppercase tracking-wider block">
                    Target Listing
                  </span>
                  <p className="font-bold text-xs text-slate-900 truncate">
                    {targetListing.title}
                  </p>
                  <p className="text-[11px] text-slate-500">
                    {formatFullNaira(targetListing.price)} • {targetListing.location.area}, {targetListing.location.state}
                  </p>
                </div>
              </div>
            )}

            {/* Selection Options */}
            {mode === 'subscription' ? (
              <div className="space-y-2.5">
                <label className="text-xs font-bold text-slate-700 uppercase tracking-wider block">
                  Select Subscription Plan
                </label>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                  {SUBSCRIPTION_PLANS.map((plan) => (
                    <button
                      key={plan.id}
                      type="button"
                      onClick={() => setSelectedPlanId(plan.id)}
                      className={`p-3 rounded-xl border text-left transition cursor-pointer flex flex-col justify-between ${
                        selectedPlanId === plan.id
                          ? 'border-emerald-600 bg-emerald-50/50 ring-2 ring-emerald-500/20'
                          : 'border-slate-200 hover:border-slate-300'
                      }`}
                    >
                      <div>
                        <div className="flex items-center justify-between">
                          <span className="font-bold text-xs text-slate-900 block truncate">{plan.name}</span>
                          {plan.pricePerMonth === 0 && (
                            <span className="text-[9px] px-1 rounded bg-slate-200 text-slate-700 font-bold">FREE</span>
                          )}
                        </div>
                        <span className="text-[10px] text-slate-500 block mt-0.5">{plan.listingLimit} Listings</span>
                      </div>
                      <p className="font-extrabold text-xs sm:text-sm text-emerald-800 font-display mt-2">
                        {plan.pricePerMonth === 0 ? '₦0 / Forever' : `${formatFullNaira(plan.pricePerMonth)}/mo`}
                      </p>
                    </button>
                  ))}
                </div>
              </div>
            ) : (
              <div className="space-y-2.5">
                <label className="text-xs font-bold text-slate-700 uppercase tracking-wider block">
                  Select Boost Package
                </label>
                <div className="space-y-2">
                  {PROMOTION_PACKAGES.map((promo) => (
                    <button
                      key={promo.id}
                      type="button"
                      onClick={() => setSelectedPromoId(promo.id)}
                      className={`w-full p-3.5 rounded-xl border text-left transition cursor-pointer flex items-center justify-between gap-3 ${
                        selectedPromoId === promo.id
                          ? 'border-emerald-600 bg-emerald-50/50 ring-2 ring-emerald-500/20'
                          : 'border-slate-200 hover:border-slate-300'
                      }`}
                    >
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="font-bold text-xs text-slate-900">{promo.name}</span>
                          <span className="px-1.5 py-0.5 rounded bg-amber-100 text-amber-800 text-[10px] font-bold">
                            {promo.badgeText}
                          </span>
                        </div>
                        <p className="text-[11px] text-slate-500 mt-0.5">{promo.description}</p>
                      </div>
                      <div className="text-right shrink-0">
                        <span className="font-extrabold text-sm text-emerald-800 font-display block">
                          {formatFullNaira(promo.price)}
                        </span>
                        <span className="text-[10px] text-slate-500">7 Days</span>
                      </div>
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Gateway Selector: Paystack vs Flutterwave */}
            {!isFreePlanSelected && (
              <div className="space-y-2">
                <label className="text-xs font-bold text-slate-700 uppercase tracking-wider block">
                  Licensed Nigerian Payment Gateway
                </label>
                <div className="grid grid-cols-2 gap-2">
                  <button
                    type="button"
                    onClick={() => setGateway('Paystack')}
                    className={`p-2.5 rounded-xl border text-center transition flex items-center justify-center gap-2 text-xs font-bold cursor-pointer ${
                      gateway === 'Paystack'
                        ? 'border-blue-600 bg-blue-50 text-blue-900 ring-1 ring-blue-500'
                        : 'border-slate-200 text-slate-600 hover:bg-slate-50'
                    }`}
                  >
                    <span className="w-2.5 h-2.5 rounded-full bg-blue-600" />
                    <span>Paystack (Stripe/Titan)</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => setGateway('Flutterwave')}
                    className={`p-2.5 rounded-xl border text-center transition flex items-center justify-center gap-2 text-xs font-bold cursor-pointer ${
                      gateway === 'Flutterwave'
                        ? 'border-amber-600 bg-amber-50 text-amber-900 ring-1 ring-amber-500'
                        : 'border-slate-200 text-slate-600 hover:bg-slate-50'
                    }`}
                  >
                    <span className="w-2.5 h-2.5 rounded-full bg-amber-500" />
                    <span>Flutterwave (Barter/Rave)</span>
                  </button>
                </div>
              </div>
            )}

            {/* Payment Channel Selector */}
            {!isFreePlanSelected && (
              <div className="space-y-2">
                <label className="text-xs font-bold text-slate-700 uppercase tracking-wider block">
                  Payment Channel
                </label>
                <div className="grid grid-cols-3 gap-2">
                  <button
                    type="button"
                    onClick={() => setPaymentMethod('card')}
                    className={`p-2.5 rounded-xl border text-center transition flex flex-col sm:flex-row items-center justify-center gap-1.5 text-xs font-semibold cursor-pointer ${
                      paymentMethod === 'card'
                        ? 'border-emerald-600 bg-emerald-50 text-emerald-900 font-bold'
                        : 'border-slate-200 text-slate-600 hover:bg-slate-50'
                    }`}
                  >
                    <CreditCard className="w-4 h-4 text-emerald-600" />
                    <span>Debit Card</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => setPaymentMethod('transfer')}
                    className={`p-2.5 rounded-xl border text-center transition flex flex-col sm:flex-row items-center justify-center gap-1.5 text-xs font-semibold cursor-pointer ${
                      paymentMethod === 'transfer'
                        ? 'border-emerald-600 bg-emerald-50 text-emerald-900 font-bold'
                        : 'border-slate-200 text-slate-600 hover:bg-slate-50'
                    }`}
                  >
                    <Building className="w-4 h-4 text-emerald-600" />
                    <span>Bank Transfer</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => setPaymentMethod('ussd')}
                    className={`p-2.5 rounded-xl border text-center transition flex flex-col sm:flex-row items-center justify-center gap-1.5 text-xs font-semibold cursor-pointer ${
                      paymentMethod === 'ussd'
                        ? 'border-emerald-600 bg-emerald-50 text-emerald-900 font-bold'
                        : 'border-slate-200 text-slate-600 hover:bg-slate-50'
                    }`}
                  >
                    <span className="font-mono text-xs font-bold text-emerald-600">*737#</span>
                    <span>USSD Code</span>
                  </button>
                </div>
              </div>
            )}

            {/* Simulated Card / Account / USSD UI */}
            {!isFreePlanSelected && (
              <>
                {paymentMethod === 'card' && (
                  <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200 space-y-2">
                    <div className="flex items-center justify-between text-xs font-semibold text-slate-700">
                      <span className="flex items-center gap-1">
                        <Lock className="w-3.5 h-3.5 text-emerald-600" />
                        256-Bit Encrypted {gateway} Channel
                      </span>
                      <span className="text-[10px] text-slate-500">Mastercard, Visa & Verve</span>
                    </div>
                    <input
                      type="text"
                      readOnly
                      value="5399 •••• •••• 9921 (Access Bank Verve / Mastercard)"
                      className="w-full px-3 py-2 rounded-lg bg-white border border-slate-200 text-xs text-slate-700 font-mono"
                    />
                  </div>
                )}

                {paymentMethod === 'transfer' && (
                  <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200 space-y-1 text-xs">
                    <p className="font-bold text-slate-900">Virtual Dedicated Bank Account</p>
                    <p className="text-slate-600">
                      Bank: <span className="font-semibold text-slate-800">{gateway === 'Paystack' ? 'Wema Bank / Paystack Titan' : 'Providus Bank / Flutterwave'}</span>
                    </p>
                    <p className="text-slate-600 font-mono">
                      Account Number: <span className="font-bold text-emerald-800">0299104821</span>
                    </p>
                    <p className="text-[10px] text-slate-500 pt-1">Automated webhook detects credit within 10 seconds.</p>
                  </div>
                )}

                {paymentMethod === 'ussd' && (
                  <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200 space-y-1 text-xs">
                    <p className="font-bold text-slate-900">Dial USSD String from Registered SIM</p>
                    <p className="text-slate-700 font-mono font-bold bg-white p-2 rounded border border-slate-200 text-center text-sm text-emerald-800">
                      *737*50*{totalAmount}*9921#
                    </p>
                    <p className="text-[10px] text-slate-500 text-center">Supports GTBank, UBA (*919#), Zenith (*966#), First Bank (*894#)</p>
                  </div>
                )}
              </>
            )}

            {/* Total Summary & Pay CTA */}
            <div className="pt-2 border-t border-slate-200 flex items-center justify-between">
              <div>
                <span className="text-[10px] text-slate-500 uppercase tracking-wider block">Total Due</span>
                <span className="text-xl font-extrabold text-slate-900 font-display">
                  {formatFullNaira(totalAmount)}
                </span>
              </div>

              <button
                type="button"
                onClick={handleExecutePayment}
                disabled={isProcessing}
                className="py-3 px-6 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs shadow-lg shadow-emerald-900/20 transition flex items-center gap-2 cursor-pointer disabled:opacity-50"
              >
                {isProcessing ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    <span>Authorizing with {gateway}...</span>
                  </>
                ) : (
                  <>
                    <span>{isFreePlanSelected ? 'Activate Free Plan' : `Pay ${formatFullNaira(totalAmount)}`}</span>
                    <ArrowRight className="w-4 h-4" />
                  </>
                )}
              </button>
            </div>
          </div>
        ) : (
          /* Payment Success View */
          <div className="p-6 sm:p-8 text-center space-y-4">
            <div className="w-16 h-16 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto">
              <CheckCircle className="w-9 h-9" />
            </div>

            <div className="space-y-1">
              <h3 className="text-xl font-bold font-display text-slate-900">
                Payment Authorized & Verified!
              </h3>
              <p className="text-xs text-slate-600 max-w-sm mx-auto">
                Your transaction has been confirmed by the payment gateway. Your {mode === 'subscription' ? 'plan limits' : 'listing boost'} are active immediately.
              </p>
            </div>

            {recentTx && (
              <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 text-left text-xs space-y-1.5 max-w-sm mx-auto">
                <div className="flex justify-between">
                  <span className="text-slate-500">Reference:</span>
                  <span className="font-mono font-bold text-slate-900">{recentTx.reference}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">Service:</span>
                  <span className="font-semibold text-slate-800">{recentTx.planOrPackageName}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">Amount Paid:</span>
                  <span className="font-bold text-emerald-800">{formatFullNaira(recentTx.amount)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">Timestamp:</span>
                  <span className="text-slate-600">{recentTx.date}</span>
                </div>
              </div>
            )}

            <div className="pt-3">
              <button
                onClick={handleResetAndClose}
                className="py-2.5 px-6 rounded-xl bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold transition cursor-pointer"
              >
                Return to Dashboard
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
