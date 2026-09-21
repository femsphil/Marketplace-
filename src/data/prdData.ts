export interface PrdSection {
  id: string;
  title: string;
  badge?: string;
  content: string;
}

export const PRD_DATA: PrdSection[] = [
  {
    id: 'exec-summary',
    title: '1. Executive Summary & Product Architecture',
    badge: 'Core Vision',
    content: `### Product Vision & Strategic Positioning
**StrucTrade Nigeria** is a vertical B2B and consumer marketplace purpose-built for the Nigerian economy, exclusively uniting four interconnected high-capital industries:
1. **Real Estate** (Residential, Commercial, Land, Short-let)
2. **Vehicles** (Tokunbo/Foreign Used, Brand New, Trucks, Site Logistics)
3. **Construction Machinery & Heavy Equipment** (Buy & Equipment Rental Marketplace)
4. **Construction Ecosystem** (Materials Suppliers & Certified Engineering / Artisan Services)

### Why Narrowing from Generic Classifieds (Jiji) Wins
- **High-Trust, High-Ticket Transactions**: Buying a ₦150m Lekki duplex, renting a ₦250k/day excavator, or ordering 1,200 bags of cement requires specialized trust artifacts (C of O title documents, engine operating hours, COREN/NIA professional accreditation, and customs clearance papers).
- **Domain-Specific Attribute Schemas**: Eliminates "one-size-fits-all" product pages. Houses display bedroom/bathroom/title documents; excavators display operating weight, engine hours, and daily/monthly rental rates; cars display VIN, Tokunbo status, and transmission.
- **Integrated B2B Equipment Rental Engine**: Supports flexible commercial hiring with operator inclusion, mobilization logistics, and deposit management.
- **Dual Listing Architecture**: Distinct pipelines for physical assets (\`LISTING\`) vs human capital & firms (\`SERVICE\`).`,
  },
  {
    id: 'user-roles',
    title: '2. User Roles & Permissions Matrix',
    badge: 'RBAC',
    content: `### Five Primary User Roles

| Role | Target Audience | Core Capabilities | Verification Badges |
| :--- | :--- | :--- | :--- |
| **Buyer / Seeker / Contractor** | Property buyers, car shoppers, project engineers, site supervisors | Search, filter, save favorites, submit Property Viewing Requests, submit Equipment Rental Requests, chat via WhatsApp/in-app | Phone OTP verified |
| **Individual Asset Owner** | Private car sellers, direct property owners | Post up to 2 free listings, respond to buyer leads, manage viewing appointments | Phone & NIN verification |
| **Real Estate Agent / Broker** | Certified realtors, property brokers | Unlimited property listings, schedule viewing requests, lead scoring, agency affiliation | Phone & Estate Board (NIESV/REDAN) |
| **Corporate Dealership / Equipment Firm / Supplier** | Auto dealers, equipment rental fleets, cement/block manufacturers | Dedicated Business Storefront, team multi-seat logins, wholesale price tables, fleet rental calendar | CAC Registration Number & Bank Account |
| **Platform Administrator** | StrucTrade operations & compliance team | Content moderation, KYC/CAC verification approvals, dispute resolution, promotion billing, system audit logs | 2FA + Hardware Key |`,
  },
  {
    id: 'db-schema',
    title: '3. Complete Production Database Schema',
    badge: 'Database',
    content: `### 24 Core Relational Tables Schema

\`\`\`sql
-- 1. Users & Authentication
CREATE TABLE users (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  email VARCHAR(255) UNIQUE NOT NULL,
  phone VARCHAR(20) UNIQUE NOT NULL,
  password_hash VARCHAR(255) NOT NULL,
  role VARCHAR(30) NOT NULL CHECK (role IN ('individual', 'agent', 'agency', 'developer', 'dealership', 'equipment_co', 'contractor', 'admin')),
  full_name VARCHAR(120) NOT NULL,
  avatar_url TEXT,
  phone_verified BOOLEAN DEFAULT FALSE,
  nin_verified BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 2. Business Storefronts
CREATE TABLE businesses (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  business_name VARCHAR(200) NOT NULL,
  business_type VARCHAR(50) NOT NULL,
  cac_number VARCHAR(50),
  cac_verified BOOLEAN DEFAULT FALSE,
  address TEXT NOT NULL,
  state VARCHAR(50) NOT NULL,
  city VARCHAR(80) NOT NULL,
  area VARCHAR(80) NOT NULL,
  whatsapp_number VARCHAR(20) NOT NULL,
  rating NUMERIC(3,2) DEFAULT 5.00,
  reviews_count INT DEFAULT 0
);

-- 3. Core Listings (Polymorphic Base)
CREATE TABLE listings (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  business_id UUID REFERENCES businesses(id),
  user_id UUID REFERENCES users(id) NOT NULL,
  listing_type VARCHAR(20) NOT NULL CHECK (listing_type IN ('LISTING', 'SERVICE')),
  vertical VARCHAR(30) NOT NULL CHECK (vertical IN ('property', 'cars', 'equipment', 'construction')),
  title VARCHAR(255) NOT NULL,
  slug VARCHAR(255) UNIQUE NOT NULL,
  price NUMERIC(15, 2) NOT NULL,
  price_period VARCHAR(20) DEFAULT 'fixed',
  description TEXT NOT NULL,
  state VARCHAR(50) NOT NULL,
  city VARCHAR(80) NOT NULL,
  area VARCHAR(80) NOT NULL,
  featured BOOLEAN DEFAULT FALSE,
  status VARCHAR(20) DEFAULT 'active' CHECK (status IN ('draft', 'active', 'under_review', 'sold', 'rented', 'inactive')),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 4. Property Specifics
CREATE TABLE properties (
  listing_id UUID PRIMARY KEY REFERENCES listings(id) ON DELETE CASCADE,
  property_type VARCHAR(40) NOT NULL,
  purpose VARCHAR(20) NOT NULL CHECK (purpose IN ('buy', 'rent', 'short_let')),
  bedrooms INT,
  bathrooms INT,
  toilets INT,
  land_size_sqm NUMERIC(10, 2),
  building_size_sqm NUMERIC(10, 2),
  parking_spaces INT,
  is_furnished BOOLEAN DEFAULT FALSE,
  is_serviced BOOLEAN DEFAULT FALSE,
  is_newly_built BOOLEAN DEFAULT FALSE,
  is_gated_estate BOOLEAN DEFAULT FALSE,
  is_waterfront BOOLEAN DEFAULT FALSE,
  title_documents TEXT[] -- array e.g. ['C of O', 'Governor Consent', 'Survey Plan']
);

-- 5. Vehicle Specifics
CREATE TABLE vehicles (
  listing_id UUID PRIMARY KEY REFERENCES listings(id) ON DELETE CASCADE,
  make VARCHAR(60) NOT NULL,
  model VARCHAR(60) NOT NULL,
  year INT NOT NULL,
  condition VARCHAR(40) NOT NULL CHECK (condition IN ('Brand New', 'Foreign Used (Tokunbo)', 'Nigerian Used')),
  mileage_km INT NOT NULL,
  transmission VARCHAR(20) NOT NULL,
  fuel_type VARCHAR(20) NOT NULL,
  body_type VARCHAR(30) NOT NULL,
  engine_size VARCHAR(50),
  vin_number VARCHAR(30),
  vin_verified BOOLEAN DEFAULT FALSE
);

-- 6. Construction Equipment Specifics
CREATE TABLE equipment (
  listing_id UUID PRIMARY KEY REFERENCES listings(id) ON DELETE CASCADE,
  equipment_type VARCHAR(60) NOT NULL,
  brand VARCHAR(60) NOT NULL,
  model VARCHAR(60) NOT NULL,
  year INT NOT NULL,
  operating_hours INT,
  operating_weight_kg NUMERIC(10, 2),
  condition VARCHAR(30) NOT NULL,
  sale_type VARCHAR(20) NOT NULL CHECK (sale_type IN ('sale', 'rental', 'both')),
  daily_rate NUMERIC(12, 2),
  weekly_rate NUMERIC(12, 2),
  monthly_rate NUMERIC(12, 2),
  security_deposit NUMERIC(12, 2),
  operator_included BOOLEAN DEFAULT FALSE,
  delivery_available BOOLEAN DEFAULT FALSE
);

-- 7. Construction Materials Specifics
CREATE TABLE materials (
  listing_id UUID PRIMARY KEY REFERENCES listings(id) ON DELETE CASCADE,
  category VARCHAR(60) NOT NULL,
  unit_of_measure VARCHAR(30) NOT NULL,
  min_order_quantity INT DEFAULT 1,
  bulk_discount_available BOOLEAN DEFAULT FALSE,
  delivery_available BOOLEAN DEFAULT TRUE,
  in_stock BOOLEAN DEFAULT TRUE
);

-- 8. Construction Services & Certified Professionals
CREATE TABLE services (
  listing_id UUID PRIMARY KEY REFERENCES listings(id) ON DELETE CASCADE,
  service_type VARCHAR(60) NOT NULL,
  professional_title VARCHAR(120) NOT NULL,
  experience_years INT NOT NULL,
  certifications TEXT[], -- ['COREN', 'ARCON', 'NIA', 'QSRBN']
  service_area TEXT NOT NULL,
  verified_status VARCHAR(40) NOT NULL
);

-- 9. Property Viewing Requests
CREATE TABLE viewing_requests (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  property_id UUID REFERENCES listings(id),
  seeker_id UUID REFERENCES users(id),
  preferred_date DATE NOT NULL,
  preferred_time_slot VARCHAR(50) NOT NULL,
  message TEXT,
  status VARCHAR(20) DEFAULT 'Pending' CHECK (status IN ('Pending', 'Confirmed', 'Rescheduled', 'Completed', 'Cancelled')),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 10. Equipment Rental Requests
CREATE TABLE rental_requests (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  equipment_id UUID REFERENCES listings(id),
  contractor_id UUID REFERENCES users(id),
  project_address TEXT NOT NULL,
  start_date DATE NOT NULL,
  end_date DATE NOT NULL,
  operator_required BOOLEAN DEFAULT TRUE,
  delivery_required BOOLEAN DEFAULT TRUE,
  estimated_amount NUMERIC(15, 2) NOT NULL,
  status VARCHAR(20) DEFAULT 'Pending Review' CHECK (status IN ('Pending Review', 'Approved', 'Active', 'Returned', 'Declined')),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 11. Leads Management
CREATE TABLE leads (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  listing_id UUID REFERENCES listings(id),
  seller_id UUID REFERENCES users(id),
  client_id UUID REFERENCES users(id),
  lead_type VARCHAR(30) NOT NULL,
  status VARCHAR(30) DEFAULT 'New' CHECK (status IN ('New', 'Contacted', 'In Negotiation', 'Closed Won', 'Closed Lost')),
  notes TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
\`\`\``,
  },
  {
    id: 'api-endpoints',
    title: '4. RESTful API Endpoint Specifications',
    badge: 'API Specs',
    content: `### Marketplace Core API Routes

\`\`\`http
### 1. Listings & Search
GET /api/v1/listings?vertical=property&purpose=buy&state=Lagos&area=Lekki%20Phase%201&min_price=100000000&max_price=200000000&bedrooms=4&title_doc=C%20of%20O
GET /api/v1/listings?vertical=cars&make=Toyota&condition=Foreign%20Used&transmission=Automatic
GET /api/v1/listings?vertical=equipment&sale_type=rental&operator_included=true
GET /api/v1/listings/:id
POST /api/v1/listings (Auth: Bearer JWT) - Requires category-specific payload validated against schema

### 2. Specialized Workflows
POST /api/v1/listings/:id/request-viewing
Body: { preferred_date, preferred_time, message, seeker_phone }

POST /api/v1/listings/:id/request-rental
Body: { start_date, end_date, site_address, operator_required, delivery_required }

### 3. Dashboard & Leads
GET /api/v1/dashboard/metrics
GET /api/v1/dashboard/leads?status=Serious%20Lead
PATCH /api/v1/dashboard/leads/:id (Update lead status e.g. Closed Won)
GET /api/v1/dashboard/viewings
GET /api/v1/dashboard/rentals

### 4. Businesses & Storefronts
GET /api/v1/businesses
GET /api/v1/businesses/:id/inventory
POST /api/v1/businesses/verify-cac (Uploads CAC certificate & RC number for admin check)

### 5. Monetization & Subscriptions
GET /api/v1/subscriptions/plans
POST /api/v1/subscriptions/checkout (Integration with Paystack / Flutterwave)
POST /api/v1/listings/:id/promote (Boost to Featured)
\`\`\``,
  },
  {
    id: 'monetization',
    title: '5. Monetization Strategy & Subscription Tiers',
    badge: 'Revenue Model',
    content: `### Nigerian Market Monetization Structure (in NGN ₦)

#### 1. Seller Subscription Packages
- **FREE (Individual)**:
  - ₦0/month
  - Max 2 active listings
  - Standard listing visibility
  - Direct WhatsApp & Call lead redirection
- **PROFESSIONAL (Independent Agents & Artisans)**:
  - ₦15,000 / month (or ₦150,000 / year)
  - Up to 25 active listings
  - Verified Agent / Artisan badge
  - Lead Management CRM (Inquiries vs Serious Leads)
  - 2 Featured listing boosts / month
- **BUSINESS (Car Dealerships & Property Agencies)**:
  - ₦45,000 / month (or ₦450,000 / year)
  - Up to 150 active listings
  - Branded Company Storefront (\`structrade.ng/dealers/xyz-motors\`)
  - Multi-user staff lead routing
  - Equipment rental contract management tools
  - Priority search algorithm placement
- **ENTERPRISE (Major Developers & Heavy Equipment Fleets)**:
  - ₦120,000 / month (or ₦1,200,000 / year)
  - Unlimited listings & inventory API sync
  - Dedicated account manager
  - Custom lead SMS alerts & CRM export
  - Escrow transaction payment pipeline

#### 2. Pay-Per-Feature Services
- **Featured Boost**: ₦5,000 for 7 days / ₦15,000 for 30 days
- **Verified Title Inspection Badge**: ₦25,000 (Physical verification of C of O / Governor's Consent at Lands Bureau)
- **Equipment Mobilization Escrow**: 2.5% platform commission on equipment rental hire contracts.`,
  },
  {
    id: 'acceptance-criteria',
    title: '6. Quality Assurance & Acceptance Criteria',
    badge: 'QA Checklist',
    content: `### Rigorous Acceptance Criteria

1. **Category Specificity**:
   - MUST NOT render generic form fields. When posting a Car, engine size, mileage, and transmission are required; when posting Property, bedroom count, bathroom count, and title documents checklist are rendered.
2. **Nigerian Geographic Drill-Down**:
   - Header and filters must respect Nigerian administrative hierarchy: Country → State → City → Area (e.g. Lagos → Lekki Phase 1, Ikoyi, Ikeja GRA).
3. **Dual Equipment Operation**:
   - Equipment listings must visibly distinguish Buy Price vs Rental Rates (Daily/Weekly/Monthly) with clear badges indicating whether an operator is included.
4. **Lead Pipeline Differentiation**:
   - Dashboard must separate plain inquiries from high-intent **Serious Leads**, **Property Viewing Requests**, and **Equipment Rental Requests**.
5. **Trust Markers & Verification**:
   - Verified phone badges, CAC company registration numbers, and COREN/NIA professional accreditations must render distinctly with clear disclaimers regarding document verification.`,
  },
];
