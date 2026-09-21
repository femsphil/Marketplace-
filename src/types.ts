export type MarketplaceVertical = 'all' | 'property' | 'cars' | 'equipment' | 'construction' | 'services' | 'businesses';

export type ListingType = 'LISTING' | 'SERVICE';

export interface LocationInfo {
  state: string;
  city: string;
  area: string;
}

export type PropertyPurpose = 'buy' | 'rent' | 'short_let';

export type PropertyType = 
  | 'house' 
  | 'apartment' 
  | 'duplex' 
  | 'detached_house' 
  | 'land' 
  | 'commercial' 
  | 'office' 
  | 'shop' 
  | 'warehouse'
  | 'short_let';

export type TitleDocumentType = 
  | 'C of O' 
  | "Governor's Consent" 
  | 'Deed of Assignment' 
  | 'Survey Plan' 
  | 'Building Approval' 
  | 'Excision' 
  | 'Gazette';

export interface PropertyDetails {
  propertyType: PropertyType;
  purpose: PropertyPurpose;
  bedrooms?: number;
  bathrooms?: number;
  toilets?: number;
  landSizeSqm?: number;
  buildingSizeSqm?: number;
  parkingSpaces?: number;
  furnished: boolean;
  serviced: boolean;
  newlyBuilt: boolean;
  gatedEstate: boolean;
  waterfront?: boolean;
  offPlan?: boolean;
  titleDocuments: TitleDocumentType[];
}

export type VehicleCondition = 'Brand New' | 'Foreign Used (Tokunbo)' | 'Nigerian Used';
export type TransmissionType = 'Automatic' | 'Manual' | 'AMT';
export type FuelType = 'Petrol' | 'Diesel' | 'Hybrid' | 'Electric';
export type VehicleBodyType = 'Sedan' | 'SUV' | 'Truck' | 'Bus' | 'Van' | 'Pickup' | 'Coupe' | 'Motorcycle';

export interface VehicleDetails {
  make: string;
  model: string;
  year: number;
  condition: VehicleCondition;
  mileageKm: number;
  transmission: TransmissionType;
  fuelType: FuelType;
  bodyType: VehicleBodyType;
  engineSize?: string;
  vinVerified?: boolean;
}

export type EquipmentSaleType = 'sale' | 'rental' | 'both';

export interface EquipmentDetails {
  equipmentType: string;
  brand: string;
  model: string;
  year: number;
  operatingHours?: number;
  operatingWeightKg?: number;
  condition: 'Brand New' | 'Excellent' | 'Good' | 'Fair';
  saleType: EquipmentSaleType;
  dailyRate?: number;
  weeklyRate?: number;
  monthlyRate?: number;
  securityDeposit?: number;
  operatorIncluded: boolean;
  deliveryAvailable: boolean;
}

export interface MaterialDetails {
  materialCategory: 'Cement' | 'Blocks' | 'Steel & Rebar' | 'Roofing' | 'Tiles' | 'Doors & Windows' | 'Plumbing' | 'Electrical' | 'Paint' | 'Aggregates (Sand & Granite)';
  unitOfMeasure: string;
  minOrderQuantity: number;
  bulkDiscountAvailable: boolean;
  deliveryAvailable: boolean;
  inStock: boolean;
}

export interface ServiceDetails {
  serviceType: 
    | 'Building Contractor' 
    | 'Architect' 
    | 'Civil / Structural Engineer' 
    | 'Quantity Surveyor' 
    | 'Land Surveyor' 
    | 'Plumber' 
    | 'Electrician' 
    | 'Carpenter' 
    | 'Tiler' 
    | 'Painter' 
    | 'Interior Designer' 
    | 'Equipment Operator';
  professionalTitle: string;
  experienceYears: number;
  certifications: string[]; // e.g. COREN, NIA, QSRBN, CAC
  startingPrice: number;
  serviceArea: string;
  portfolioImages?: string[];
  rating: number;
  reviewCount: number;
  verifiedStatus: 'Verified Professional' | 'Certified Firm' | 'Independent Artisan';
}

export interface SellerInfo {
  id: string;
  name: string;
  role: 'Individual' | 'Agent' | 'Agency' | 'Developer' | 'Dealership' | 'Equipment Company' | 'Contractor';
  phone: string;
  whatsapp: string;
  location: string;
  verifiedPhone: boolean;
  verifiedBusiness: boolean;
  avatarUrl: string;
  totalListings: number;
  rating?: number;
  companyName?: string;
  memberSince?: string;
}

export interface MarketplaceItem {
  id: string;
  listingType: ListingType;
  vertical: 'property' | 'cars' | 'equipment' | 'construction';
  title: string;
  price: number;
  pricePeriod?: 'fixed' | 'per_day' | 'per_week' | 'per_month' | 'starting_at';
  location: LocationInfo;
  description: string;
  images: string[];
  featured?: boolean;
  createdAt: string;
  seller: SellerInfo;
  status?: 'Active' | 'Draft' | 'Pending Review' | 'Paused' | 'Expired' | 'Sold' | 'Rented' | 'Suspended' | 'Rejected';
  expiresAt?: string;
  viewsCount?: number;
  phoneReveals?: number;
  whatsappClicks?: number;
  promotionType?: 'featured' | 'top_search' | 'homepage' | 'none';
  
  // Vertical-specific attributes
  property?: PropertyDetails;
  vehicle?: VehicleDetails;
  equipment?: EquipmentDetails;
  material?: MaterialDetails;
  service?: ServiceDetails;
}

export interface ViewingRequest {
  id: string;
  propertyId: string;
  propertyTitle: string;
  seekerName: string;
  seekerPhone: string;
  seekerEmail: string;
  preferredDate: string;
  preferredTime: string;
  message: string;
  status: 'Pending' | 'Confirmed' | 'Completed' | 'Cancelled';
  createdAt: string;
  agentAssigned?: string;
  inspectionType?: 'In-Person Physical Viewing' | 'Virtual Video Walkthrough';
  notes?: string;
}

export interface RentalRequest {
  id: string;
  equipmentId: string;
  equipmentTitle: string;
  clientName: string;
  clientPhone: string;
  companyName?: string;
  startDate: string;
  endDate: string;
  deliveryAddress: string;
  operatorRequired: boolean;
  deliveryRequired: boolean;
  estimatedTotal: number;
  status: 'Pending Review' | 'Approved' | 'Active' | 'Returned' | 'Declined';
  createdAt: string;
  operatorAssigned?: string;
  securityDepositStatus?: 'Pending' | 'Held in Escrow' | 'Released' | 'Deducted';
  checkInCondition?: string;
  checkOutCondition?: string;
}

export interface Lead {
  id: string;
  listingId: string;
  listingTitle: string;
  category: 'property' | 'cars' | 'equipment' | 'construction';
  leadType: 'Inquiry' | 'Serious Lead' | 'Viewing Request' | 'Rental Request' | 'Inspection Request' | 'Phone Reveal' | 'WhatsApp Click';
  clientName: string;
  clientPhone: string;
  clientWhatsapp?: string;
  clientMessage: string;
  status: 'New' | 'Contacted' | 'In Negotiation' | 'Closed Won' | 'Closed Lost';
  date: string;
  dealValue?: number;
  priority?: 'Urgent' | 'High' | 'Medium' | 'Low';
  temperature?: 'Hot' | 'Warm' | 'Cold';
  followUpDate?: string;
  assignedStaffId?: string;
  notes?: string;
}

export interface BuyerContactProfile {
  name: string;
  phone: string;
  whatsapp: string;
}

export interface BusinessStorefront {
  id: string;
  name: string;
  type: 'Real Estate Agency' | 'Car Dealership' | 'Equipment Company' | 'Construction Firm';
  location: string;
  state: string;
  verified: boolean;
  cacNumber?: string;
  rating: number;
  reviewsCount: number;
  totalInventory: number;
  logo: string;
  coverImage: string;
  description: string;
  phone: string;
  whatsapp: string;
  email: string;
  address: string;
  verticals: ('property' | 'cars' | 'equipment' | 'construction')[];
}

export type UserRole = 'guest' | 'registered' | 'professional' | 'admin';

export interface UserAccount {
  id: string;
  name: string;
  email: string;
  phone: string;
  whatsapp?: string;
  role: UserRole;
  businessName?: string;
  avatarUrl?: string;
  location?: string;
  bio?: string;
  phoneVerified: boolean;
  emailVerified: boolean;
  ninVerified: boolean;
  cacVerified: boolean;
  plan: 'Free' | 'Professional' | 'Business' | 'Enterprise';
  activeListingsCount: number;
  maxListings: number;
  status: 'active' | 'suspended';
}

export interface ChatMessage {
  id: string;
  conversationId: string;
  senderId: string;
  senderName: string;
  text: string;
  timestamp: string;
  isRead: boolean;
  attachmentUrl?: string;
}

export interface ChatConversation {
  id: string;
  listingId: string;
  listingTitle: string;
  listingPrice: number;
  listingImage: string;
  buyerId: string;
  buyerName: string;
  sellerId: string;
  sellerName: string;
  lastMessage: string;
  lastMessageTimestamp: string;
  unreadCount: number;
}

export interface SubscriptionPlan {
  id: 'free' | 'professional' | 'business' | 'enterprise';
  name: string;
  pricePerMonth: number;
  listingLimit: number;
  features: string[];
  badge?: string;
}

export interface PromotionPackage {
  id: 'featured' | 'top_search' | 'homepage';
  name: string;
  price: number;
  durationDays: number;
  description: string;
  badgeText: string;
}

export interface PaymentTransaction {
  id: string;
  reference: string;
  type: 'subscription' | 'promotion';
  planOrPackageName: string;
  amount: number;
  status: 'Successful' | 'Pending' | 'Failed';
  date: string;
  customerEmail: string;
  paymentMethod: 'Paystack Debit Card' | 'Direct Bank Transfer' | 'Flutterwave Card' | 'Flutterwave Bank Transfer' | 'USSD *737#';
  gateway?: 'Paystack' | 'Flutterwave';
}

export interface AppNotification {
  id: string;
  title: string;
  message: string;
  type: 'lead' | 'viewing' | 'rental' | 'chat' | 'payment' | 'system';
  timestamp: string;
  isRead: boolean;
  actionType?: 'viewing' | 'rental' | 'leads' | 'chat' | 'listing' | 'dashboard' | 'admin';
  targetId?: string;
}

export interface ListingReport {
  id: string;
  listingId: string;
  listingTitle: string;
  sellerName: string;
  reason: 'Scam' | 'Fake listing' | 'Wrong price' | 'Wrong category' | 'Duplicate' | 'Prohibited item' | 'Misleading information' | 'Other';
  details: string;
  reporterName: string;
  reporterContact: string;
  createdAt: string;
  status: 'New' | 'Under Review' | 'Resolved' | 'Dismissed';
}

export interface SellerReview {
  id: string;
  sellerId: string;
  reviewerName: string;
  rating: number; // 1 to 5
  comment: string;
  date: string;
  verifiedTransaction: boolean;
}

// ==========================================
// PHASE 2 FEATURE INTERFACES
// ==========================================

export interface BusinessStaff {
  id: string;
  name: string;
  email: string;
  phone: string;
  role: 'Agency Director' | 'Sales Agent' | 'Inspection Officer' | 'Inventory Manager' | 'Accountant';
  avatar: string;
  assignedListingIds: string[];
  leadsHandled: number;
  active: boolean;
  joinedDate: string;
  lastActive: string;
  permissions: {
    canCreateListings: boolean;
    canEditPricing: boolean;
    canViewLeads: boolean;
    canManageStaff: boolean;
    canAccessFinancials: boolean;
  };
}

export interface SavedSearch {
  id: string;
  userId: string;
  name: string;
  vertical: MarketplaceVertical;
  state?: string;
  area?: string;
  query?: string;
  minPrice?: number;
  maxPrice?: number;
  filters?: Record<string, any>;
  alertFrequency: 'instant' | 'daily' | 'weekly';
  matchCount: number;
  createdAt: string;
  lastNotified?: string;
}

export interface PriceAlert {
  id: string;
  userId: string;
  listingId: string;
  listingTitle: string;
  listingImage: string;
  vertical: string;
  originalPrice: number;
  currentPrice: number;
  targetPrice: number;
  alertOnDropPercent: number;
  status: 'Active' | 'Triggered' | 'Paused';
  notifyVia: 'Email' | 'WhatsApp' | 'Push';
  createdAt: string;
  lastTriggered?: string;
  priceHistory?: { date: string; price: number }[];
}

export interface AdCampaign {
  id: string;
  advertiserId: string;
  advertiserName: string;
  title: string;
  campaignType: 'Featured Boost' | 'Homepage Hero Banner' | 'Category Top Sponsor' | 'Search Results Ad';
  targetVertical: MarketplaceVertical;
  targetState: string;
  dailyBudget: number;
  totalSpend: number;
  budgetLimit: number;
  startDate: string;
  endDate: string;
  status: 'Active' | 'Pending Review' | 'Paused' | 'Completed';
  impressions: number;
  clicks: number;
  ctr: number;
  cpc: number;
  bannerUrl?: string;
  ctaText?: string;
  destinationUrl?: string;
  linkedListingId?: string;
}

export interface VerificationApplication {
  id: string;
  userId: string;
  applicantName: string;
  businessName: string;
  tier: 'Tier 1' | 'Tier 2' | 'Tier 3';
  idType?: 'NIN' | 'Drivers License' | 'International Passport' | 'Voters Card';
  idNumber?: string;
  cacNumber?: string;
  tinNumber?: string;
  documentUrls: string[];
  physicalAddressVerified: boolean;
  verificationScore: number;
  status: 'Pending Review' | 'Approved' | 'Requires Documentation' | 'Rejected';
  submittedAt: string;
  reviewedAt?: string;
  notes?: string;
  verifiedBadges: string[];
}

export interface DealerStockItem {
  id: string;
  listingId: string;
  stockNumber: string;
  agingDays: number;
  vinChassisNumber?: string;
  customsDutyStatus: 'SGD Fully Cleared' | 'Port Verified' | 'Consignment Exempt' | 'Pending Clearance';
  floorplanFinanced: boolean;
  consignment: boolean;
  acquisitionCost: number;
  askingPrice: number;
  minSellingPrice: number;
  yardLocation: string;
  keysLocation: string;
  inspectionRating: number; // 1 to 10
  status: 'Active' | 'Reserved' | 'Sold' | 'In Transit' | 'In Inspection';
}

