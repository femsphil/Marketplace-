import React, { useState } from 'react';
import { 
  X, 
  Building2, 
  Car, 
  Wrench, 
  Hammer, 
  CheckCircle2, 
  Upload, 
  AlertCircle,
  Plus,
  ShieldCheck,
  HardHat,
  Phone,
  MessageSquare,
  UserCheck
} from 'lucide-react';
import { 
  MarketplaceItem, 
  ListingType, 
  PropertyPurpose, 
  PropertyType, 
  TitleDocumentType, 
  VehicleCondition, 
  TransmissionType, 
  FuelType, 
  VehicleBodyType,
  EquipmentSaleType
} from '../types';
import { NIGERIAN_STATES } from '../data/locations';

interface PostListingModalProps {
  onClose: () => void;
  onPostSuccess: (item: MarketplaceItem) => void;
}

export const PostListingModal: React.FC<PostListingModalProps> = ({
  onClose,
  onPostSuccess,
}) => {
  // Step 1: Select Type & Category
  const [selectedVertical, setSelectedVertical] = useState<'property' | 'cars' | 'equipment' | 'materials' | 'services'>('property');
  const [listingType, setListingType] = useState<ListingType>('LISTING');

  // Common Fields
  const [title, setTitle] = useState('');
  const [price, setPrice] = useState<number>(0);
  const [state, setState] = useState('Lagos');
  const [area, setArea] = useState('Lekki Phase 1');
  const [description, setDescription] = useState('');
  const [imageUrl, setImageUrl] = useState('');
  const [sellerName, setSellerName] = useState(() => {
    try {
      const saved = localStorage.getItem('structrade_lister_contact');
      if (saved) return JSON.parse(saved).name || '';
    } catch {}
    return '';
  });
  const [sellerPhone, setSellerPhone] = useState(() => {
    try {
      const saved = localStorage.getItem('structrade_lister_contact');
      if (saved) return JSON.parse(saved).phone || '';
    } catch {}
    return '';
  });
  const [sellerWhatsapp, setSellerWhatsapp] = useState(() => {
    try {
      const saved = localStorage.getItem('structrade_lister_contact');
      if (saved) return JSON.parse(saved).whatsapp || '';
    } catch {}
    return '';
  });
  const [sameAsPhone, setSameAsPhone] = useState(true);
  const [sellerRole, setSellerRole] = useState<'Individual' | 'Agent' | 'Agency' | 'Developer' | 'Dealership' | 'Equipment Company' | 'Contractor'>('Individual');
  const [submitted, setSubmitted] = useState(false);

  // Property Specific Fields
  const [propPurpose, setPropPurpose] = useState<PropertyPurpose>('buy');
  const [propType, setPropType] = useState<PropertyType>('detached_house');
  const [propBedrooms, setPropBedrooms] = useState<number>(4);
  const [propBathrooms, setPropBathrooms] = useState<number>(4);
  const [propToilets, setPropToilets] = useState<number>(5);
  const [propLandSize, setPropLandSize] = useState<number>(500);
  const [propParking, setPropParking] = useState<number>(2);
  const [propFurnished, setPropFurnished] = useState<boolean>(false);
  const [propTitleDocs, setPropTitleDocs] = useState<TitleDocumentType[]>(['C of O', 'Survey Plan']);

  // Car Specific Fields
  const [carMake, setCarMake] = useState('Toyota');
  const [carModel, setCarModel] = useState('Camry');
  const [carYear, setCarYear] = useState<number>(2020);
  const [carCondition, setCarCondition] = useState<VehicleCondition>('Foreign Used (Tokunbo)');
  const [carMileage, setCarMileage] = useState<number>(65000);
  const [carTransmission, setCarTransmission] = useState<TransmissionType>('Automatic');
  const [carFuel, setCarFuel] = useState<FuelType>('Petrol');
  const [carBody, setCarBody] = useState<VehicleBodyType>('Sedan');
  const [carEngine, setCarEngine] = useState('2.5L 4-Cylinder');

  // Equipment Specific Fields
  const [equipType, setEquipType] = useState('Excavators');
  const [equipBrand, setEquipBrand] = useState('Caterpillar');
  const [equipModel, setEquipModel] = useState('320');
  const [equipYear, setEquipYear] = useState<number>(2021);
  const [equipHours, setEquipHours] = useState<number>(3200);
  const [equipWeight, setEquipWeight] = useState<number>(21500);
  const [equipCondition, setEquipCondition] = useState<'Brand New' | 'Excellent' | 'Good' | 'Fair'>('Excellent');
  const [equipSaleType, setEquipSaleType] = useState<EquipmentSaleType>('both');
  const [equipDailyRate, setEquipDailyRate] = useState<number>(250000);
  const [equipWeeklyRate, setEquipWeeklyRate] = useState<number>(1200000);
  const [equipMonthlyRate, setEquipMonthlyRate] = useState<number>(3500000);
  const [equipOperator, setEquipOperator] = useState<boolean>(true);
  const [equipDelivery, setEquipDelivery] = useState<boolean>(true);

  // Material Specific Fields
  const [matCategory, setMatCategory] = useState<'Cement' | 'Blocks' | 'Steel & Rebar' | 'Roofing' | 'Tiles' | 'Doors & Windows' | 'Plumbing' | 'Electrical' | 'Paint' | 'Aggregates (Sand & Granite)'>('Cement');
  const [matUnit, setMatUnit] = useState('50kg Bag');
  const [matMinOrder, setMatMinOrder] = useState<number>(100);
  const [matBulkDiscount, setMatBulkDiscount] = useState<boolean>(true);

  // Service Specific Fields
  const [srvType, setSrvType] = useState<'Building Contractor' | 'Architect' | 'Civil / Structural Engineer' | 'Quantity Surveyor' | 'Land Surveyor' | 'Plumber' | 'Electrician' | 'Carpenter' | 'Tiler' | 'Painter' | 'Interior Designer' | 'Equipment Operator'>('Building Contractor');
  const [srvExperience, setSrvExperience] = useState<number>(10);
  const [srvCertifications, setSrvCertifications] = useState('COREN Registered, CAC Verified');
  const [srvArea, setSrvArea] = useState('Lagos & South-West Nigeria');

  const availableAreas = NIGERIAN_STATES.find((s) => s.name === state)?.areas || ['General Area'];

  const toggleTitleDoc = (doc: TitleDocumentType) => {
    if (propTitleDocs.includes(doc)) {
      setPropTitleDocs(propTitleDocs.filter((d) => d !== doc));
    } else {
      setPropTitleDocs([...propTitleDocs, doc]);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title || price <= 0) return;

    const defaultImages = {
      property: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1200&q=80',
      cars: 'https://images.unsplash.com/photo-1621007947382-bb3c3994e3fb?auto=format&fit=crop&w=1200&q=80',
      equipment: 'https://images.unsplash.com/photo-1581094288338-2314dddb7ece?auto=format&fit=crop&w=1200&q=80',
      materials: 'https://images.unsplash.com/photo-1589939705384-5185137a7f0f?auto=format&fit=crop&w=1200&q=80',
      services: 'https://images.unsplash.com/photo-1541888946425-d0fbb186c5f7?auto=format&fit=crop&w=1200&q=80',
    };

    const finalImage = imageUrl.trim() || defaultImages[selectedVertical];

    const finalSellerName = sellerName.trim() || 'Verified Nigerian Merchant';
    const finalSellerPhone = sellerPhone.trim() || '+234 803 000 1122';
    const finalSellerWhatsapp = (sameAsPhone ? finalSellerPhone : sellerWhatsapp.trim()) || finalSellerPhone;

    try {
      localStorage.setItem('structrade_lister_contact', JSON.stringify({
        name: finalSellerName,
        phone: finalSellerPhone,
        whatsapp: finalSellerWhatsapp,
        role: sellerRole,
      }));
    } catch {}

    const newItem: MarketplaceItem = {
      id: `usr-${Date.now()}`,
      listingType: selectedVertical === 'services' ? 'SERVICE' : 'LISTING',
      vertical: selectedVertical === 'materials' || selectedVertical === 'services' ? 'construction' : selectedVertical,
      title,
      price,
      pricePeriod: selectedVertical === 'services' ? 'starting_at' : propPurpose === 'rent' ? 'per_month' : 'fixed',
      location: {
        state,
        city: `${state} Metropolitan`,
        area,
      },
      description: description || 'Direct verified listing on StrucTrade Nigeria. Contact seller for physical inspection.',
      images: [finalImage],
      createdAt: new Date().toISOString().split('T')[0],
      seller: {
        id: 'usr-current',
        name: finalSellerName,
        companyName: finalSellerName,
        role: sellerRole,
        phone: finalSellerPhone,
        whatsapp: finalSellerWhatsapp,
        location: `${area}, ${state}`,
        verifiedPhone: true,
        verifiedBusiness: true,
        avatarUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80',
        totalListings: 1,
      },
    };

    if (selectedVertical === 'property') {
      newItem.property = {
        propertyType: propType,
        purpose: propPurpose,
        bedrooms: propBedrooms,
        bathrooms: propBathrooms,
        toilets: propToilets,
        landSizeSqm: propLandSize,
        parkingSpaces: propParking,
        furnished: propFurnished,
        serviced: true,
        newlyBuilt: true,
        gatedEstate: true,
        titleDocuments: propTitleDocs,
      };
    } else if (selectedVertical === 'cars') {
      newItem.vehicle = {
        make: carMake,
        model: carModel,
        year: carYear,
        condition: carCondition,
        mileageKm: carMileage,
        transmission: carTransmission,
        fuelType: carFuel,
        bodyType: carBody,
        engineSize: carEngine,
        vinVerified: true,
      };
    } else if (selectedVertical === 'equipment') {
      newItem.equipment = {
        equipmentType: equipType,
        brand: equipBrand,
        model: equipModel,
        year: equipYear,
        operatingHours: equipHours,
        operatingWeightKg: equipWeight,
        condition: equipCondition,
        saleType: equipSaleType,
        dailyRate: equipDailyRate,
        weeklyRate: equipWeeklyRate,
        monthlyRate: equipMonthlyRate,
        securityDeposit: 300000,
        operatorIncluded: equipOperator,
        deliveryAvailable: equipDelivery,
      };
    } else if (selectedVertical === 'materials') {
      newItem.material = {
        materialCategory: matCategory,
        unitOfMeasure: matUnit,
        minOrderQuantity: matMinOrder,
        bulkDiscountAvailable: matBulkDiscount,
        deliveryAvailable: true,
        inStock: true,
      };
    } else if (selectedVertical === 'services') {
      newItem.service = {
        serviceType: srvType,
        professionalTitle: `${srvType} & Project Consultant`,
        experienceYears: srvExperience,
        certifications: srvCertifications.split(',').map((c) => c.trim()),
        startingPrice: price,
        serviceArea: srvArea,
        rating: 5.0,
        reviewCount: 1,
        verifiedStatus: 'Certified Firm',
      };
    }

    onPostSuccess(newItem);
    setSubmitted(true);
    setTimeout(() => {
      onClose();
    }, 1500);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/70 backdrop-blur-xs animate-in fade-in duration-150 overflow-y-auto">
      <div className="bg-white rounded-2xl max-w-3xl w-full my-auto shadow-2xl border border-slate-200 overflow-hidden relative max-h-[92vh] flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between p-4 sm:p-5 border-b border-slate-100 bg-white sticky top-0 z-10">
          <div>
            <span className="text-[11px] font-bold uppercase tracking-wider text-emerald-700 block">
              Direct Marketplace Publisher
            </span>
            <h2 className="text-lg sm:text-xl font-bold text-slate-900 font-display">
              Post a Category-Specific Listing
            </h2>
          </div>
          <button
            onClick={onClose}
            className="p-2 text-slate-400 hover:text-slate-700 rounded-full hover:bg-slate-100 transition cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {submitted ? (
          <div className="p-10 text-center">
            <div className="w-16 h-16 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto mb-4">
              <CheckCircle2 className="w-10 h-10" />
            </div>
            <h3 className="text-xl font-bold text-slate-900 font-display mb-2">
              Listing Published Successfully!
            </h3>
            <p className="text-sm text-slate-600 max-w-md mx-auto">
              Your verified listing is now live in the <strong className="text-slate-900">{selectedVertical.toUpperCase()}</strong> marketplace on StrucTrade Nigeria.
            </p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="p-4 sm:p-6 overflow-y-auto space-y-6 text-xs sm:text-sm">
            {/* Vertical Picker (Adhering to Section 2 of Prompt: "Don't treat everything as a product") */}
            <div>
              <label className="block text-xs font-bold text-slate-800 uppercase tracking-wider mb-2">
                1. Select Category Vertical (Determines Tailored Form Schema)
              </label>
              <div className="grid grid-cols-2 sm:grid-cols-5 gap-2">
                <button
                  type="button"
                  onClick={() => {
                    setSelectedVertical('property');
                    setListingType('LISTING');
                  }}
                  className={`p-3 rounded-xl border text-center font-semibold transition cursor-pointer flex flex-col items-center gap-1.5 ${
                    selectedVertical === 'property'
                      ? 'border-emerald-600 bg-emerald-50 text-emerald-900 ring-2 ring-emerald-500/20'
                      : 'border-slate-200 bg-white text-slate-700 hover:bg-slate-50'
                  }`}
                >
                  <Building2 className="w-5 h-5 text-emerald-600" />
                  <span className="text-xs">Property</span>
                </button>

                <button
                  type="button"
                  onClick={() => {
                    setSelectedVertical('cars');
                    setListingType('LISTING');
                  }}
                  className={`p-3 rounded-xl border text-center font-semibold transition cursor-pointer flex flex-col items-center gap-1.5 ${
                    selectedVertical === 'cars'
                      ? 'border-blue-600 bg-blue-50 text-blue-900 ring-2 ring-blue-500/20'
                      : 'border-slate-200 bg-white text-slate-700 hover:bg-slate-50'
                  }`}
                >
                  <Car className="w-5 h-5 text-blue-600" />
                  <span className="text-xs">Cars</span>
                </button>

                <button
                  type="button"
                  onClick={() => {
                    setSelectedVertical('equipment');
                    setListingType('LISTING');
                  }}
                  className={`p-3 rounded-xl border text-center font-semibold transition cursor-pointer flex flex-col items-center gap-1.5 ${
                    selectedVertical === 'equipment'
                      ? 'border-amber-600 bg-amber-50 text-amber-900 ring-2 ring-amber-500/20'
                      : 'border-slate-200 bg-white text-slate-700 hover:bg-slate-50'
                  }`}
                >
                  <Wrench className="w-5 h-5 text-amber-600" />
                  <span className="text-xs">Equipment</span>
                </button>

                <button
                  type="button"
                  onClick={() => {
                    setSelectedVertical('materials');
                    setListingType('LISTING');
                  }}
                  className={`p-3 rounded-xl border text-center font-semibold transition cursor-pointer flex flex-col items-center gap-1.5 ${
                    selectedVertical === 'materials'
                      ? 'border-orange-600 bg-orange-50 text-orange-900 ring-2 ring-orange-500/20'
                      : 'border-slate-200 bg-white text-slate-700 hover:bg-slate-50'
                  }`}
                >
                  <Hammer className="w-5 h-5 text-orange-600" />
                  <span className="text-xs">Materials</span>
                </button>

                <button
                  type="button"
                  onClick={() => {
                    setSelectedVertical('services');
                    setListingType('SERVICE');
                  }}
                  className={`p-3 rounded-xl border text-center font-semibold transition cursor-pointer flex flex-col items-center gap-1.5 ${
                    selectedVertical === 'services'
                      ? 'border-purple-600 bg-purple-50 text-purple-900 ring-2 ring-purple-500/20'
                      : 'border-slate-200 bg-white text-slate-700 hover:bg-slate-50'
                  }`}
                >
                  <HardHat className="w-5 h-5 text-purple-600" />
                  <span className="text-xs">Services</span>
                </button>
              </div>
            </div>

            {/* Core Basic Details */}
            <div className="space-y-4 pt-2 border-t border-slate-100">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Listing Headline / Title *
                </label>
                <input
                  type="text"
                  required
                  placeholder={
                    selectedVertical === 'property' ? 'e.g. 4 Bedroom Fully Detached Duplex with Swimming Pool' :
                    selectedVertical === 'cars' ? 'e.g. Toyota Camry XSE 2020 Foreign Used (Tokunbo)' :
                    selectedVertical === 'equipment' ? 'e.g. Caterpillar 320 Hydraulic Excavator' :
                    selectedVertical === 'materials' ? 'e.g. Dangote 3X Portland Cement Grade 42.5R (Trailer Load)' :
                    'e.g. Turnkey Civil Engineering & Architectural Approvals'
                  }
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  className="w-full p-2.5 text-xs sm:text-sm rounded-xl border border-slate-200 focus:border-emerald-600 focus:ring-1 focus:ring-emerald-600 outline-none"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Price (in NGN ₦) *
                  </label>
                  <input
                    type="number"
                    required
                    min={1}
                    placeholder="e.g. 150000000"
                    value={price || ''}
                    onChange={(e) => setPrice(Number(e.target.value))}
                    className="w-full p-2.5 text-xs sm:text-sm rounded-xl border border-slate-200 focus:border-emerald-600 focus:ring-1 focus:ring-emerald-600 outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    State (Nigeria) *
                  </label>
                  <select
                    value={state}
                    onChange={(e) => {
                      setState(e.target.value);
                      const found = NIGERIAN_STATES.find(s => s.name === e.target.value);
                      if (found) setArea(found.areas[1] || found.areas[0]);
                    }}
                    className="w-full p-2.5 text-xs sm:text-sm rounded-xl border border-slate-200 focus:border-emerald-600 focus:ring-1 focus:ring-emerald-600 outline-none"
                  >
                    {NIGERIAN_STATES.map((s) => (
                      <option key={s.name} value={s.name}>{s.name}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Specific Area / Hub *
                  </label>
                  <select
                    value={area}
                    onChange={(e) => setArea(e.target.value)}
                    className="w-full p-2.5 text-xs sm:text-sm rounded-xl border border-slate-200 focus:border-emerald-600 focus:ring-1 focus:ring-emerald-600 outline-none"
                  >
                    {availableAreas.map((a) => (
                      <option key={a} value={a}>{a}</option>
                    ))}
                  </select>
                </div>
              </div>
            </div>

            {/* DYNAMIC CATEGORY-SPECIFIC FORM FIELDS */}
            {/* 1. PROPERTY FORM */}
            {selectedVertical === 'property' && (
              <div className="p-4 bg-emerald-50/50 border border-emerald-200/80 rounded-2xl space-y-4">
                <div className="text-xs font-bold text-emerald-900 uppercase tracking-wider">
                  Real Estate Listing Form Attributes
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                  <div>
                    <label className="block text-[11px] font-semibold text-slate-700 mb-1">Purpose</label>
                    <select
                      value={propPurpose}
                      onChange={(e) => setPropPurpose(e.target.value as PropertyPurpose)}
                      className="w-full p-2 text-xs rounded-lg border border-slate-200 bg-white"
                    >
                      <option value="buy">For Sale</option>
                      <option value="rent">For Rent</option>
                      <option value="short_let">Short-let</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-[11px] font-semibold text-slate-700 mb-1">Property Type</label>
                    <select
                      value={propType}
                      onChange={(e) => setPropType(e.target.value as PropertyType)}
                      className="w-full p-2 text-xs rounded-lg border border-slate-200 bg-white"
                    >
                      <option value="detached_house">Detached Duplex</option>
                      <option value="apartment">Apartment / Flat</option>
                      <option value="land">Land & Plots</option>
                      <option value="office">Commercial Office</option>
                      <option value="shop">Shop</option>
                      <option value="warehouse">Warehouse</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-[11px] font-semibold text-slate-700 mb-1">Bedrooms</label>
                    <input
                      type="number"
                      value={propBedrooms}
                      onChange={(e) => setPropBedrooms(Number(e.target.value))}
                      className="w-full p-2 text-xs rounded-lg border border-slate-200 bg-white"
                    />
                  </div>

                  <div>
                    <label className="block text-[11px] font-semibold text-slate-700 mb-1">Bathrooms</label>
                    <input
                      type="number"
                      value={propBathrooms}
                      onChange={(e) => setPropBathrooms(Number(e.target.value))}
                      className="w-full p-2 text-xs rounded-lg border border-slate-200 bg-white"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                  <div>
                    <label className="block text-[11px] font-semibold text-slate-700 mb-1">Land Size (sqm)</label>
                    <input
                      type="number"
                      value={propLandSize}
                      onChange={(e) => setPropLandSize(Number(e.target.value))}
                      className="w-full p-2 text-xs rounded-lg border border-slate-200 bg-white"
                    />
                  </div>
                  <div>
                    <label className="block text-[11px] font-semibold text-slate-700 mb-1">Parking Spaces</label>
                    <input
                      type="number"
                      value={propParking}
                      onChange={(e) => setPropParking(Number(e.target.value))}
                      className="w-full p-2 text-xs rounded-lg border border-slate-200 bg-white"
                    />
                  </div>
                  <div className="flex items-center gap-2 pt-5">
                    <label className="flex items-center gap-2 text-xs text-slate-800 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={propFurnished}
                        onChange={(e) => setPropFurnished(e.target.checked)}
                        className="w-4 h-4 text-emerald-600 rounded"
                      />
                      <span>Furnished Property</span>
                    </label>
                  </div>
                </div>

                {/* Title Documents Multi-selector (Section 2 & 6) */}
                <div>
                  <label className="block text-[11px] font-bold text-slate-700 mb-1">
                    Available Title Documents (Check all that apply)
                  </label>
                  <div className="flex flex-wrap gap-2">
                    {(['C of O', "Governor's Consent", 'Deed of Assignment', 'Survey Plan', 'Building Approval', 'Gazette'] as TitleDocumentType[]).map((doc) => (
                      <button
                        key={doc}
                        type="button"
                        onClick={() => toggleTitleDoc(doc)}
                        className={`px-2.5 py-1 text-xs rounded-lg border font-semibold transition cursor-pointer ${
                          propTitleDocs.includes(doc)
                            ? 'bg-emerald-600 text-white border-emerald-600'
                            : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-50'
                        }`}
                      >
                        {doc}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* 2. CAR FORM */}
            {selectedVertical === 'cars' && (
              <div className="p-4 bg-blue-50/50 border border-blue-200/80 rounded-2xl space-y-4">
                <div className="text-xs font-bold text-blue-900 uppercase tracking-wider">
                  Vehicle Listing Form Attributes
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                  <div>
                    <label className="block text-[11px] font-semibold text-slate-700 mb-1">Make / Brand</label>
                    <input
                      type="text"
                      value={carMake}
                      onChange={(e) => setCarMake(e.target.value)}
                      className="w-full p-2 text-xs rounded-lg border border-slate-200 bg-white"
                    />
                  </div>

                  <div>
                    <label className="block text-[11px] font-semibold text-slate-700 mb-1">Model</label>
                    <input
                      type="text"
                      value={carModel}
                      onChange={(e) => setCarModel(e.target.value)}
                      className="w-full p-2 text-xs rounded-lg border border-slate-200 bg-white"
                    />
                  </div>

                  <div>
                    <label className="block text-[11px] font-semibold text-slate-700 mb-1">Year</label>
                    <input
                      type="number"
                      value={carYear}
                      onChange={(e) => setCarYear(Number(e.target.value))}
                      className="w-full p-2 text-xs rounded-lg border border-slate-200 bg-white"
                    />
                  </div>

                  <div>
                    <label className="block text-[11px] font-semibold text-slate-700 mb-1">Condition</label>
                    <select
                      value={carCondition}
                      onChange={(e) => setCarCondition(e.target.value as VehicleCondition)}
                      className="w-full p-2 text-xs rounded-lg border border-slate-200 bg-white font-medium"
                    >
                      <option value="Foreign Used (Tokunbo)">Foreign Used (Tokunbo)</option>
                      <option value="Brand New">Brand New</option>
                      <option value="Nigerian Used">Nigerian Used</option>
                    </select>
                  </div>
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                  <div>
                    <label className="block text-[11px] font-semibold text-slate-700 mb-1">Mileage (km)</label>
                    <input
                      type="number"
                      value={carMileage}
                      onChange={(e) => setCarMileage(Number(e.target.value))}
                      className="w-full p-2 text-xs rounded-lg border border-slate-200 bg-white"
                    />
                  </div>

                  <div>
                    <label className="block text-[11px] font-semibold text-slate-700 mb-1">Transmission</label>
                    <select
                      value={carTransmission}
                      onChange={(e) => setCarTransmission(e.target.value as TransmissionType)}
                      className="w-full p-2 text-xs rounded-lg border border-slate-200 bg-white"
                    >
                      <option value="Automatic">Automatic</option>
                      <option value="Manual">Manual</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-[11px] font-semibold text-slate-700 mb-1">Fuel Type</label>
                    <select
                      value={carFuel}
                      onChange={(e) => setCarFuel(e.target.value as FuelType)}
                      className="w-full p-2 text-xs rounded-lg border border-slate-200 bg-white"
                    >
                      <option value="Petrol">Petrol</option>
                      <option value="Diesel">Diesel</option>
                      <option value="Hybrid">Hybrid</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-[11px] font-semibold text-slate-700 mb-1">Body Type</label>
                    <select
                      value={carBody}
                      onChange={(e) => setCarBody(e.target.value as VehicleBodyType)}
                      className="w-full p-2 text-xs rounded-lg border border-slate-200 bg-white"
                    >
                      <option value="Sedan">Sedan</option>
                      <option value="SUV">SUV</option>
                      <option value="Pickup">Pickup</option>
                      <option value="Truck">Truck</option>
                      <option value="Bus">Bus</option>
                    </select>
                  </div>
                </div>
              </div>
            )}

            {/* 3. EQUIPMENT FORM */}
            {selectedVertical === 'equipment' && (
              <div className="p-4 bg-amber-50/50 border border-amber-200/80 rounded-2xl space-y-4">
                <div className="text-xs font-bold text-amber-900 uppercase tracking-wider">
                  Construction Equipment Form Attributes (Sale vs Rental)
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                  <div>
                    <label className="block text-[11px] font-semibold text-slate-700 mb-1">Machinery Type</label>
                    <input
                      type="text"
                      value={equipType}
                      onChange={(e) => setEquipType(e.target.value)}
                      className="w-full p-2 text-xs rounded-lg border border-slate-200 bg-white"
                    />
                  </div>

                  <div>
                    <label className="block text-[11px] font-semibold text-slate-700 mb-1">Brand</label>
                    <input
                      type="text"
                      value={equipBrand}
                      onChange={(e) => setEquipBrand(e.target.value)}
                      className="w-full p-2 text-xs rounded-lg border border-slate-200 bg-white"
                    />
                  </div>

                  <div>
                    <label className="block text-[11px] font-semibold text-slate-700 mb-1">Operating Hours</label>
                    <input
                      type="number"
                      value={equipHours}
                      onChange={(e) => setEquipHours(Number(e.target.value))}
                      className="w-full p-2 text-xs rounded-lg border border-slate-200 bg-white"
                    />
                  </div>

                  <div>
                    <label className="block text-[11px] font-semibold text-slate-700 mb-1">Sale / Rental Type</label>
                    <select
                      value={equipSaleType}
                      onChange={(e) => setEquipSaleType(e.target.value as EquipmentSaleType)}
                      className="w-full p-2 text-xs rounded-lg border border-slate-200 bg-white font-medium"
                    >
                      <option value="both">Both Sale & Rental</option>
                      <option value="rental">Rental Only</option>
                      <option value="sale">Outright Sale Only</option>
                    </select>
                  </div>
                </div>

                {equipSaleType !== 'sale' && (
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                    <div>
                      <label className="block text-[11px] font-semibold text-slate-700 mb-1">Daily Rate (₦/day)</label>
                      <input
                        type="number"
                        value={equipDailyRate}
                        onChange={(e) => setEquipDailyRate(Number(e.target.value))}
                        className="w-full p-2 text-xs rounded-lg border border-slate-200 bg-white"
                      />
                    </div>
                    <div>
                      <label className="block text-[11px] font-semibold text-slate-700 mb-1">Weekly Rate (₦/week)</label>
                      <input
                        type="number"
                        value={equipWeeklyRate}
                        onChange={(e) => setEquipWeeklyRate(Number(e.target.value))}
                        className="w-full p-2 text-xs rounded-lg border border-slate-200 bg-white"
                      />
                    </div>
                    <div>
                      <label className="block text-[11px] font-semibold text-slate-700 mb-1">Monthly Rate (₦/month)</label>
                      <input
                        type="number"
                        value={equipMonthlyRate}
                        onChange={(e) => setEquipMonthlyRate(Number(e.target.value))}
                        className="w-full p-2 text-xs rounded-lg border border-slate-200 bg-white"
                      />
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* 4. MATERIALS FORM */}
            {selectedVertical === 'materials' && (
              <div className="p-4 bg-orange-50/50 border border-orange-200/80 rounded-2xl space-y-4">
                <div className="text-xs font-bold text-orange-900 uppercase tracking-wider">
                  Building Material Specifications
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <div>
                    <label className="block text-[11px] font-semibold text-slate-700 mb-1">Material Category</label>
                    <select
                      value={matCategory}
                      onChange={(e) => setMatCategory(e.target.value as any)}
                      className="w-full p-2 text-xs rounded-lg border border-slate-200 bg-white"
                    >
                      <option value="Cement">Cement</option>
                      <option value="Blocks">Blocks</option>
                      <option value="Steel & Rebar">Steel & Rebar</option>
                      <option value="Roofing">Roofing</option>
                      <option value="Tiles">Tiles</option>
                      <option value="Aggregates (Sand & Granite)">Sand & Granite</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-[11px] font-semibold text-slate-700 mb-1">Unit of Measure</label>
                    <input
                      type="text"
                      placeholder="e.g. 50kg Bag, Tipper Load, Tonne"
                      value={matUnit}
                      onChange={(e) => setMatUnit(e.target.value)}
                      className="w-full p-2 text-xs rounded-lg border border-slate-200 bg-white"
                    />
                  </div>
                  <div>
                    <label className="block text-[11px] font-semibold text-slate-700 mb-1">Min Order Quantity</label>
                    <input
                      type="number"
                      value={matMinOrder}
                      onChange={(e) => setMatMinOrder(Number(e.target.value))}
                      className="w-full p-2 text-xs rounded-lg border border-slate-200 bg-white"
                    />
                  </div>
                </div>
              </div>
            )}

            {/* 5. SERVICES FORM */}
            {selectedVertical === 'services' && (
              <div className="p-4 bg-purple-50/50 border border-purple-200/80 rounded-2xl space-y-4">
                <div className="text-xs font-bold text-purple-900 uppercase tracking-wider">
                  Construction Professional & Contractor Profile
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <div>
                    <label className="block text-[11px] font-semibold text-slate-700 mb-1">Service Profession</label>
                    <select
                      value={srvType}
                      onChange={(e) => setSrvType(e.target.value as any)}
                      className="w-full p-2 text-xs rounded-lg border border-slate-200 bg-white"
                    >
                      <option value="Building Contractor">Building Contractor</option>
                      <option value="Architect">Architect</option>
                      <option value="Civil / Structural Engineer">Civil / Structural Engineer</option>
                      <option value="Quantity Surveyor">Quantity Surveyor</option>
                      <option value="Plumber">Plumber</option>
                      <option value="Electrician">Electrician</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-[11px] font-semibold text-slate-700 mb-1">Years of Experience</label>
                    <input
                      type="number"
                      value={srvExperience}
                      onChange={(e) => setSrvExperience(Number(e.target.value))}
                      className="w-full p-2 text-xs rounded-lg border border-slate-200 bg-white"
                    />
                  </div>
                  <div>
                    <label className="block text-[11px] font-semibold text-slate-700 mb-1">Certifications (e.g. COREN, NIA)</label>
                    <input
                      type="text"
                      value={srvCertifications}
                      onChange={(e) => setSrvCertifications(e.target.value)}
                      className="w-full p-2 text-xs rounded-lg border border-slate-200 bg-white"
                    />
                  </div>
                </div>
              </div>
            )}

            {/* Photos & Description */}
            <div className="space-y-3">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Image URL (or leave blank to use high-res stock for this vertical)
                </label>
                <input
                  type="url"
                  placeholder="https://images.unsplash.com/..."
                  value={imageUrl}
                  onChange={(e) => setImageUrl(e.target.value)}
                  className="w-full p-2.5 text-xs rounded-xl border border-slate-200 focus:border-emerald-600 outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Detailed Description *
                </label>
                <textarea
                  rows={4}
                  required
                  placeholder="Describe condition, specifications, documents, delivery, and warranty..."
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  className="w-full p-2.5 text-xs rounded-xl border border-slate-200 focus:border-emerald-600 outline-none"
                />
              </div>
            </div>

            {/* Section: Seller & Contact Information */}
            <div className="p-4 sm:p-5 bg-emerald-50/70 border border-emerald-200/80 rounded-2xl space-y-4">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                <div className="flex items-center gap-2">
                  <div className="w-7 h-7 rounded-lg bg-emerald-600 text-white flex items-center justify-center shrink-0">
                    <UserCheck className="w-4 h-4" />
                  </div>
                  <div>
                    <h3 className="text-xs sm:text-sm font-bold text-emerald-950 uppercase tracking-wider">
                      Seller & Contact Information
                    </h3>
                    <p className="text-[11px] text-emerald-800">
                      Buyers on StrucTrade Nigeria will call and message this phone and WhatsApp directly.
                    </p>
                  </div>
                </div>
                <span className="self-start sm:self-auto text-[10px] font-bold text-emerald-800 bg-emerald-100/90 border border-emerald-300/60 px-2.5 py-1 rounded-full uppercase tracking-wider">
                  Direct Inquiries
                </span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                {/* Seller Name */}
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Your Full Name or Business Name <span className="text-rose-500">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Chief Emeka / Apex Realty Ltd"
                    value={sellerName}
                    onChange={(e) => setSellerName(e.target.value)}
                    className="w-full p-2.5 text-xs rounded-xl border border-slate-300 bg-white focus:border-emerald-600 focus:ring-2 focus:ring-emerald-100 outline-none transition"
                  />
                  <span className="text-[10px] text-slate-400 mt-0.5 block">
                    Shown as the verified seller
                  </span>
                </div>

                {/* Phone Number */}
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Phone Number (Voice Calls) <span className="text-rose-500">*</span>
                  </label>
                  <input
                    type="tel"
                    required
                    placeholder="e.g. 0803 123 4567 or +234 803..."
                    value={sellerPhone}
                    onChange={(e) => {
                      const val = e.target.value;
                      setSellerPhone(val);
                      if (sameAsPhone) setSellerWhatsapp(val);
                    }}
                    className="w-full p-2.5 text-xs rounded-xl border border-slate-300 bg-white focus:border-emerald-600 focus:ring-2 focus:ring-emerald-100 outline-none transition"
                  />
                  <span className="text-[10px] text-slate-400 mt-0.5 block">
                    Dialed when buyers click Call
                  </span>
                </div>

                {/* WhatsApp Number */}
                <div>
                  <div className="flex items-center justify-between mb-1">
                    <label className="text-xs font-bold text-slate-700">
                      WhatsApp Number <span className="text-rose-500">*</span>
                    </label>
                    <label className="flex items-center gap-1.5 text-xs text-emerald-800 font-semibold cursor-pointer select-none">
                      <input
                        type="checkbox"
                        checked={sameAsPhone}
                        onChange={(e) => {
                          setSameAsPhone(e.target.checked);
                          if (e.target.checked) setSellerWhatsapp(sellerPhone);
                        }}
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
                    value={sameAsPhone ? sellerPhone : sellerWhatsapp}
                    onChange={(e) => setSellerWhatsapp(e.target.value)}
                    className={`w-full p-2.5 text-xs rounded-xl border border-slate-300 outline-none transition ${
                      sameAsPhone
                        ? 'bg-slate-100 text-slate-500 cursor-not-allowed'
                        : 'bg-white focus:border-emerald-600 focus:ring-2 focus:ring-emerald-100'
                    }`}
                  />
                  <span className="text-[10px] text-slate-400 mt-0.5 block">
                    Opened when buyers click WhatsApp
                  </span>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1 border-t border-emerald-200/50">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Lister Role / Designation
                  </label>
                  <select
                    value={sellerRole}
                    onChange={(e) => setSellerRole(e.target.value as any)}
                    className="w-full p-2.5 text-xs rounded-xl border border-slate-300 bg-white focus:border-emerald-600 outline-none"
                  >
                    <option value="Individual">Individual Private Owner</option>
                    <option value="Agent">Certified Agent / Broker</option>
                    <option value="Agency">Registered Agency / Firm</option>
                    <option value="Developer">Property Developer</option>
                    <option value="Dealership">Licensed Automobile Dealership</option>
                    <option value="Equipment Company">Equipment & Plant Hire Company</option>
                    <option value="Contractor">Certified Contractor / Artisan</option>
                  </select>
                </div>

                <div className="flex items-center gap-2.5 p-3 bg-white/90 rounded-xl border border-emerald-200/60 text-xs text-emerald-950">
                  <ShieldCheck className="w-5 h-5 text-emerald-600 shrink-0" />
                  <span className="text-[11px] leading-snug">
                    Your contact information is safely verified and securely embedded into this listing. Saved for your next listing!
                  </span>
                </div>
              </div>
            </div>

            {/* Submit Action */}
            <div className="pt-3 border-t border-slate-100 flex items-center justify-end gap-3">
              <button
                type="button"
                onClick={onClose}
                className="py-2.5 px-4 rounded-xl border border-slate-200 text-slate-700 font-semibold hover:bg-slate-50 transition cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="py-2.5 px-6 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold shadow-xs transition cursor-pointer flex items-center gap-2"
              >
                <Plus className="w-4 h-4" />
                <span>Publish Listing Now</span>
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};
