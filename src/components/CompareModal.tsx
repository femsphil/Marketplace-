import React from 'react';
import { X, Check, Minus, ArrowRight, Trash2 } from 'lucide-react';
import { MarketplaceItem } from '../types';
import { formatFullNaira } from '../lib/formatters';

interface CompareModalProps {
  isOpen: boolean;
  onClose: () => void;
  items: MarketplaceItem[];
  onRemoveItem: (id: string) => void;
  onSelectItem: (item: MarketplaceItem) => void;
}

export const CompareModal: React.FC<CompareModalProps> = ({
  isOpen,
  onClose,
  items,
  onRemoveItem,
  onSelectItem,
}) => {
  if (!isOpen || items.length === 0) return null;

  const vertical = items[0]?.vertical || 'property';

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-slate-950/80 backdrop-blur-xs overflow-y-auto">
      <div className="relative w-full max-w-5xl bg-white rounded-2xl shadow-2xl border border-slate-200 overflow-hidden my-auto flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="p-4 sm:p-6 border-b border-slate-200 flex items-center justify-between bg-slate-900 text-white shrink-0">
          <div>
            <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-400">
              Side-by-Side Comparison Matrix
            </span>
            <h2 className="text-xl sm:text-2xl font-bold font-display">
              Comparing {items.length} {items.length === 1 ? 'Item' : 'Items'} ({vertical.toUpperCase()})
            </h2>
          </div>
          <button
            onClick={onClose}
            className="p-2 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800 transition cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Scrollable Matrix */}
        <div className="overflow-x-auto p-4 sm:p-6 flex-1">
          <table className="w-full text-left text-sm border-collapse min-w-[600px]">
            <thead>
              <tr className="border-b border-slate-200">
                <th className="p-3 w-44 font-semibold text-slate-500 bg-slate-50 text-xs uppercase tracking-wider">
                  Attribute
                </th>
                {items.map((item) => (
                  <th key={item.id} className="p-3 w-64 align-top">
                    <div className="space-y-2">
                      <div className="relative h-32 rounded-xl overflow-hidden bg-slate-100 border border-slate-200">
                        <img
                          src={item.images[0]}
                          alt={item.title}
                          className="w-full h-full object-cover"
                        />
                        <button
                          onClick={() => onRemoveItem(item.id)}
                          className="absolute top-2 right-2 p-1.5 bg-black/60 hover:bg-rose-600 text-white rounded-full transition cursor-pointer"
                          title="Remove from comparison"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                      <h4 className="font-bold text-slate-900 line-clamp-2 text-sm">
                        {item.title}
                      </h4>
                      <p className="text-base font-extrabold text-emerald-800 font-display">
                        {formatFullNaira(item.price)}
                        {item.pricePeriod && item.pricePeriod !== 'fixed' && (
                          <span className="text-xs font-normal text-slate-500"> / {item.pricePeriod.replace('per_', '')}</span>
                        )}
                      </p>
                      <button
                        onClick={() => {
                          onSelectItem(item);
                          onClose();
                        }}
                        className="w-full py-1.5 px-3 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold transition flex items-center justify-center gap-1 cursor-pointer"
                      >
                        <span>View Details</span>
                        <ArrowRight className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-xs">
              {/* Common Attributes */}
              <tr>
                <td className="p-3 font-semibold text-slate-500 bg-slate-50">Location</td>
                {items.map((item) => (
                  <td key={item.id} className="p-3 font-medium text-slate-800">
                    {item.location.area}, {item.location.state}
                  </td>
                ))}
              </tr>
              <tr>
                <td className="p-3 font-semibold text-slate-500 bg-slate-50">Seller</td>
                {items.map((item) => (
                  <td key={item.id} className="p-3 text-slate-800">
                    <span className="font-bold block">{item.seller.name}</span>
                    <span className="text-[11px] text-slate-500">{item.seller.role}</span>
                  </td>
                ))}
              </tr>
              <tr>
                <td className="p-3 font-semibold text-slate-500 bg-slate-50">Verification</td>
                {items.map((item) => (
                  <td key={item.id} className="p-3">
                    {item.seller.verifiedBusiness ? (
                      <span className="inline-flex items-center gap-1 text-emerald-700 font-semibold">
                        <Check className="w-3.5 h-3.5" /> CAC Verified
                      </span>
                    ) : item.seller.verifiedPhone ? (
                      <span className="inline-flex items-center gap-1 text-blue-700 font-semibold">
                        <Check className="w-3.5 h-3.5" /> Phone Verified
                      </span>
                    ) : (
                      <span className="text-slate-400">Standard Seller</span>
                    )}
                  </td>
                ))}
              </tr>

              {/* Property Attributes */}
              {vertical === 'property' && (
                <>
                  <tr>
                    <td className="p-3 font-semibold text-slate-500 bg-slate-50">Property Type</td>
                    {items.map((item) => (
                      <td key={item.id} className="p-3 capitalize font-medium text-slate-800">
                        {item.property?.propertyType?.replace('_', ' ') || '-'}
                      </td>
                    ))}
                  </tr>
                  <tr>
                    <td className="p-3 font-semibold text-slate-500 bg-slate-50">Purpose</td>
                    {items.map((item) => (
                      <td key={item.id} className="p-3 font-semibold uppercase text-emerald-700">
                        {item.property?.purpose || 'For Sale'}
                      </td>
                    ))}
                  </tr>
                  <tr>
                    <td className="p-3 font-semibold text-slate-500 bg-slate-50">Bedrooms / Baths</td>
                    {items.map((item) => (
                      <td key={item.id} className="p-3 text-slate-800">
                        {item.property?.bedrooms ? `${item.property.bedrooms} Beds • ${item.property.bathrooms || 0} Baths` : 'N/A (Land/Commercial)'}
                      </td>
                    ))}
                  </tr>
                  <tr>
                    <td className="p-3 font-semibold text-slate-500 bg-slate-50">Land / Building Size</td>
                    {items.map((item) => (
                      <td key={item.id} className="p-3 text-slate-800">
                        {item.property?.landSizeSqm ? `${item.property.landSizeSqm} SQM` : '-'}
                      </td>
                    ))}
                  </tr>
                  <tr>
                    <td className="p-3 font-semibold text-slate-500 bg-slate-50">Title Documents</td>
                    {items.map((item) => (
                      <td key={item.id} className="p-3">
                        <div className="flex flex-wrap gap-1">
                          {item.property?.titleDocuments && item.property.titleDocuments.length > 0 ? (
                            item.property.titleDocuments.map((doc, idx) => (
                              <span key={idx} className="px-1.5 py-0.5 rounded bg-amber-50 text-amber-800 border border-amber-200 text-[10px] font-bold">
                                {doc}
                              </span>
                            ))
                          ) : (
                            <span className="text-slate-400">Not specified</span>
                          )}
                        </div>
                      </td>
                    ))}
                  </tr>
                  <tr>
                    <td className="p-3 font-semibold text-slate-500 bg-slate-50">Furnished / Serviced</td>
                    {items.map((item) => (
                      <td key={item.id} className="p-3">
                        {item.property?.furnished ? (
                          <span className="text-emerald-700 font-bold">Furnished</span>
                        ) : (
                          <span className="text-slate-500">Unfurnished</span>
                        )}
                        {' • '}
                        {item.property?.serviced ? 'Serviced' : 'Self-serviced'}
                      </td>
                    ))}
                  </tr>
                </>
              )}

              {/* Vehicle Attributes */}
              {vertical === 'cars' && (
                <>
                  <tr>
                    <td className="p-3 font-semibold text-slate-500 bg-slate-50">Make & Model</td>
                    {items.map((item) => (
                      <td key={item.id} className="p-3 font-bold text-slate-900">
                        {item.vehicle?.make} {item.vehicle?.model}
                      </td>
                    ))}
                  </tr>
                  <tr>
                    <td className="p-3 font-semibold text-slate-500 bg-slate-50">Year & Condition</td>
                    {items.map((item) => (
                      <td key={item.id} className="p-3 text-slate-800">
                        {item.vehicle?.year} • <span className="font-semibold text-blue-700">{item.vehicle?.condition}</span>
                      </td>
                    ))}
                  </tr>
                  <tr>
                    <td className="p-3 font-semibold text-slate-500 bg-slate-50">Mileage</td>
                    {items.map((item) => (
                      <td key={item.id} className="p-3 text-slate-800 font-medium">
                        {item.vehicle?.mileageKm ? `${item.vehicle.mileageKm.toLocaleString()} km` : '-'}
                      </td>
                    ))}
                  </tr>
                  <tr>
                    <td className="p-3 font-semibold text-slate-500 bg-slate-50">Transmission & Fuel</td>
                    {items.map((item) => (
                      <td key={item.id} className="p-3 text-slate-800">
                        {item.vehicle?.transmission} • {item.vehicle?.fuelType}
                      </td>
                    ))}
                  </tr>
                  <tr>
                    <td className="p-3 font-semibold text-slate-500 bg-slate-50">Body Type</td>
                    {items.map((item) => (
                      <td key={item.id} className="p-3 text-slate-800">
                        {item.vehicle?.bodyType}
                      </td>
                    ))}
                  </tr>
                </>
              )}

              {/* Equipment Attributes */}
              {vertical === 'equipment' && (
                <>
                  <tr>
                    <td className="p-3 font-semibold text-slate-500 bg-slate-50">Brand & Model</td>
                    {items.map((item) => (
                      <td key={item.id} className="p-3 font-bold text-slate-900">
                        {item.equipment?.brand} {item.equipment?.model}
                      </td>
                    ))}
                  </tr>
                  <tr>
                    <td className="p-3 font-semibold text-slate-500 bg-slate-50">Equipment Type</td>
                    {items.map((item) => (
                      <td key={item.id} className="p-3 font-medium text-slate-800">
                        {item.equipment?.equipmentType}
                      </td>
                    ))}
                  </tr>
                  <tr>
                    <td className="p-3 font-semibold text-slate-500 bg-slate-50">Daily Rental Rate</td>
                    {items.map((item) => (
                      <td key={item.id} className="p-3 text-amber-800 font-bold">
                        {item.equipment?.dailyRate ? formatFullNaira(item.equipment.dailyRate) : 'For Sale Only'}
                      </td>
                    ))}
                  </tr>
                  <tr>
                    <td className="p-3 font-semibold text-slate-500 bg-slate-50">Operator & Delivery</td>
                    {items.map((item) => (
                      <td key={item.id} className="p-3 text-slate-800">
                        {item.equipment?.operatorIncluded ? 'Operator Included' : 'No Operator'}
                        {' • '}
                        {item.equipment?.deliveryAvailable ? 'Site Delivery Available' : 'Yard Pickup'}
                      </td>
                    ))}
                  </tr>
                </>
              )}
            </tbody>
          </table>
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-slate-200 bg-slate-50 flex items-center justify-between shrink-0">
          <p className="text-xs text-slate-500">
            Compare up to 3 listings to evaluate prices, locations, and Nigerian verification records.
          </p>
          <button
            onClick={onClose}
            className="py-1.5 px-4 rounded-lg bg-slate-800 hover:bg-slate-900 text-white text-xs font-bold cursor-pointer"
          >
            Close Comparison
          </button>
        </div>
      </div>
    </div>
  );
};
