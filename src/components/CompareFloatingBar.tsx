import React from 'react';
import { Scale, X, ArrowRight } from 'lucide-react';
import { MarketplaceItem } from '../types';

interface CompareFloatingBarProps {
  items: MarketplaceItem[];
  onOpenCompare: () => void;
  onClear: () => void;
  onRemoveItem: (id: string) => void;
}

export const CompareFloatingBar: React.FC<CompareFloatingBarProps> = ({
  items,
  onOpenCompare,
  onClear,
  onRemoveItem,
}) => {
  if (items.length === 0) return null;

  return (
    <div className="fixed bottom-16 sm:bottom-4 left-1/2 -translate-x-1/2 z-40 w-[95%] sm:w-full max-w-2xl px-1 sm:px-4 animate-in fade-in slide-in-from-bottom-5">
      <div className="bg-slate-900 text-white rounded-2xl shadow-2xl p-2.5 sm:p-4 border border-slate-700 flex items-center justify-between gap-2 sm:gap-3">
        <div className="flex items-center gap-2 sm:gap-3 overflow-x-auto min-w-0">
          <div className="w-8 h-8 sm:w-9 sm:h-9 rounded-xl bg-emerald-500/20 text-emerald-400 flex items-center justify-center shrink-0 border border-emerald-500/30">
            <Scale className="w-4 h-4 sm:w-5 sm:h-5" />
          </div>

          <div className="flex items-center gap-1.5 sm:gap-2">
            {items.map((item) => (
              <div
                key={item.id}
                className="relative group w-10 h-10 sm:w-12 sm:h-12 rounded-lg overflow-hidden bg-slate-800 border border-slate-700 shrink-0"
                title={item.title}
              >
                <img
                  src={item.images[0]}
                  alt={item.title}
                  className="w-full h-full object-cover"
                />
                <button
                  onClick={() => onRemoveItem(item.id)}
                  className="absolute inset-0 bg-rose-900/80 text-white opacity-0 group-hover:opacity-100 flex items-center justify-center transition cursor-pointer"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              </div>
            ))}
            {items.length < 3 && (
              <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-lg border border-dashed border-slate-700 text-slate-500 flex items-center justify-center text-[9px] sm:text-[10px] text-center p-0.5 sm:p-1 shrink-0 font-medium">
                + Add {3 - items.length}
              </div>
            )}
          </div>
        </div>

        <div className="flex items-center gap-1.5 sm:gap-2 shrink-0">
          <button
            onClick={onClear}
            className="text-xs text-slate-400 hover:text-white px-1.5 py-1 transition cursor-pointer"
          >
            Clear
          </button>
          <button
            onClick={onOpenCompare}
            className="py-1.5 sm:py-2 px-3 sm:px-4 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold transition flex items-center gap-1 sm:gap-1.5 shadow-md shadow-emerald-900/40 cursor-pointer"
          >
            <span>Compare ({items.length})</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>
    </div>
  );
};
