export interface BotActionLink {
  label: string;
  action: 'vertical' | 'post_listing' | 'pricing' | 'dashboard' | 'business_directory' | 'prd';
  target?: string;
}

export interface BotResponsePayload {
  reply: string;
  actionLinks?: BotActionLink[];
}

export const STRUCTRADE_SYSTEM_INSTRUCTION = `You are "StrucTrade AI Advisor", the official assistant for StrucTrade Nigeria (structrade.ng).
StrucTrade Nigeria is Nigeria's specialized vertical marketplace designed for high-capital, high-trust assets: Real Estate, Heavy Construction Equipment & Machinery, Vehicles (Tokunbo/Foreign-Used & Brand New), and Construction Ecosystem (Building Materials & Certified Engineering Services).

CRITICAL DIRECTIVE:
- Answer ONLY the specific question asked by the user.
- Do NOT provide unsolicited background overviews, unrelated lists of verticals, promotional sales pitches, or unsolicited follow-up suggestions.
- Keep your answers direct, accurate, and concise.
- Use Nigerian commercial context where appropriate (e.g. C of O, Governor's Consent, Tokunbo, Naira ₦, CAC, COREN).

Key Platform Facts for answering user questions:
1. Verticals:
   - Real Estate: Houses, land, commercial properties, short-lets across Lagos, Abuja, Port Harcourt, etc. Title documents supported: C of O, Governor's Consent, Gazette, Survey Plan, Deed of Assignment.
   - Vehicles: Foreign Used (Tokunbo), Brand New, Nigerian Used. Attributes include VIN verification, mileage in km, transmission.
   - Construction Machinery & Heavy Equipment: Excavators, cranes, bulldozers, compactors (CAT, Komatsu, etc.). Outright sale or commercial hire (Daily, Weekly, Monthly) with operator inclusion flags and mobilization deposits.
   - Construction Ecosystem: Materials (Dangote/BUA cement, reinforcement steel, granite, blocks) and Services (COREN certified engineers, ARCON/NIA architects, quantity surveyors, vetted artisans).

2. Distinct Features vs Generic Classifieds (e.g. Jiji):
   - Vertical-specific attributes (engine hours, C of O, tonnage, VIN status).
   - Equipment rental requisition engine (project duration, operator, site mobilization).
   - Property inspection viewing scheduler.
   - Verified business storefronts with CAC registration.
   - Seller CRM with lead status tracking.

3. Seller Plans & Pricing:
   - Free (₦0/month): Up to 5 active listings, standard search ranking, direct WhatsApp & Phone leads.
   - Professional (₦25,000/month): Up to 50 active listings, Verified Agent badge, CRM lead management, 2 featured boosts.
   - Business (₦65,000/month): Up to 200 active listings, custom branded company storefront, team logins, equipment contracts.
   - Enterprise (₦180,000/month): Unlimited listings, dedicated account manager, API sync.
   - Boosts: 7-day boost (₦7,500), 30-day boost (₦22,500).

4. Trust & Safety:
   - Phone OTP, NIN, and CAC company verification.
   - Never transfer funds without physical inspection or verified legal contracts.
   - Report button on every listing for compliance review.

5. How to use:
   - Post listing: "+ Post Listing" button in header or mobile bottom bar.
   - Contact sellers: Direct Phone call or WhatsApp deep link.
   - Schedule viewing: "Schedule Inspection" on property listings.
   - Request rental: "Request Rental" on equipment listings.
   - Filter: Filter by State, City, Area, Price, and vertical-specific specs.`;

export function getLocalAssistantResponse(userPrompt: string): BotResponsePayload {
  const query = userPrompt.toLowerCase().trim();

  // Greetings
  if (
    query === 'hi' ||
    query === 'hello' ||
    query === 'hey' ||
    query === 'good morning' ||
    query === 'good afternoon' ||
    query === 'good evening'
  ) {
    return {
      reply: `Hello! I'm here to answer any questions you have about StrucTrade Nigeria. What would you like to know about our properties, equipment, vehicles, materials, or platform features?`,
    };
  }

  // 1. Difference between StrucTrade and Jiji / Competitors
  if (
    query.includes('jiji') ||
    query.includes('differ') ||
    query.includes('versus') ||
    query.includes('vs') ||
    query.includes('why structrade') ||
    query.includes('competitor')
  ) {
    return {
      reply: `**How StrucTrade Differs from Generic Classifieds like Jiji:**\n\nStrucTrade Nigeria is specifically engineered for high-capital, high-trust assets rather than general consumer goods:\n\n• **Domain-Specific Attribute Schemas**: Houses list C of O, Governor's Consent, and land sqm; excavators list engine operating hours, tonnage, and daily hire rates; vehicles list VIN and Tokunbo customs clearance.\n• **Equipment Rental Engine**: Hire heavy machinery by day, week, or month with certified operator inclusion and mobilization deposits.\n• **Property Viewing Scheduler**: Book physical site inspections with confirmed calendar slots.\n• **Trust & Verification**: CAC corporate number verification, NIN checks, and COREN/NIA professional accreditations.\n• **Seller CRM Pipeline**: Real estate brokers and equipment plants get lead scoring, separating casual inquiries from serious buyers.`,
      actionLinks: [
        { label: 'Explore Equipment Hire', action: 'vertical', target: 'equipment' },
        { label: 'View Verified Properties', action: 'vertical', target: 'property' },
      ],
    };
  }

  // 2. Equipment Rental & Machinery
  if (
    query.includes('equipment') ||
    query.includes('rent') ||
    query.includes('excavator') ||
    query.includes('crane') ||
    query.includes('bulldozer') ||
    query.includes('machinery') ||
    query.includes('hire') ||
    query.includes('caterpillar') ||
    query.includes('operating hour')
  ) {
    return {
      reply: `**Heavy Construction Equipment & Plant Hire on StrucTrade:**\n\n• **Dual Transaction Model**: Equipment can be bought outright or hired on **Daily, Weekly, or Monthly** commercial rates.\n• **Equipment Specifications**: Every listing details operating hours, machine weight (tonnage), year of manufacture, and engine condition.\n• **Operator & Mobilization**: Badges indicate whether a certified operator is provided and whether low-bed trailer delivery to your project site is included.\n• **How to Rent**: Click **"Request Rental"** on any machinery asset to specify your site address, project dates, and submit your requisition.`,
      actionLinks: [
        { label: 'Browse Equipment Marketplace', action: 'vertical', target: 'equipment' },
        { label: 'List Machinery for Rent/Sale', action: 'post_listing' },
      ],
    };
  }

  // 3. Real Estate & Property Titles
  if (
    query.includes('property') ||
    query.includes('house') ||
    query.includes('land') ||
    query.includes('rent') ||
    query.includes('duplex') ||
    query.includes('c of o') ||
    query.includes('title') ||
    query.includes('governor') ||
    query.includes('gazette') ||
    query.includes('shortlet') ||
    query.includes('lekki')
  ) {
    return {
      reply: `**Real Estate & Title Documents on StrucTrade:**\n\n• **Title Documentation**: Property listings display verified titles including **Certificate of Occupancy (C of O)**, **Governor's Consent**, **Gazette**, **Registered Survey Plan**, or **Deed of Assignment**.\n• **Inspection Bookings**: Click **"Schedule Inspection"** on any property listing to pick a physical viewing date and time slot.\n• **Agent Verification**: Professional realtors have verified phone numbers and corporate/professional credentials on file.\n• **Contacting Realtors**: Call or WhatsApp the assigned agent directly from the listing.`,
      actionLinks: [
        { label: 'Explore Properties for Sale & Rent', action: 'vertical', target: 'property' },
        { label: 'Post a Property Listing', action: 'post_listing' },
      ],
    };
  }

  // 4. Vehicles & Tokunbo Cars
  if (
    query.includes('car') ||
    query.includes('vehicle') ||
    query.includes('tokunbo') ||
    query.includes('foreign used') ||
    query.includes('truck') ||
    query.includes('toyota') ||
    query.includes('vin') ||
    query.includes('mileage')
  ) {
    return {
      reply: `**Vehicles & Logistics Fleet on StrucTrade:**\n\n• **Vehicle Conditions**: Categorized into **Foreign Used (Tokunbo)**, **Brand New**, and inspected **Nigerian Used**.\n• **Specifications**: Lists genuine mileage in km, transmission type, fuel system, engine capacity, and chassis/VIN confirmation.\n• **Commercial Logistics**: Includes heavy-duty tipper trucks, water tankers, and flatbed trailers for construction delivery alongside passenger vehicles.\n• **Dealerships**: Connect directly with verified car dealerships via direct call or WhatsApp.`,
      actionLinks: [
        { label: 'View Vehicles Marketplace', action: 'vertical', target: 'cars' },
        { label: 'Post a Vehicle for Sale', action: 'post_listing' },
      ],
    };
  }

  // 5. Construction Materials & Engineering Services
  if (
    query.includes('material') ||
    query.includes('cement') ||
    query.includes('steel') ||
    query.includes('granite') ||
    query.includes('engineer') ||
    query.includes('architect') ||
    query.includes('service') ||
    query.includes('coren') ||
    query.includes('artisan') ||
    query.includes('construction')
  ) {
    return {
      reply: `**Building Materials & Certified Engineering Services:**\n\n• **Building Materials**: Order cement (Dangote, BUA, Lafarge), TMT reinforcement steel, granite, sharp sand, and certified blocks with bulk pricing and site delivery.\n• **Certified Professionals**: Hire registered Civil/Structural Engineers (**COREN**), Architects (**ARCON/NIA**), and Quantity Surveyors (**QSRBN**).\n• **Vetted Artisans**: Skilled MEP electrical contractors, plumbing technicians, aluminum fabricators, and tiling specialists.`,
      actionLinks: [
        { label: 'Browse Materials & Services', action: 'vertical', target: 'construction' },
        { label: 'List Engineering Services or Supplies', action: 'post_listing' },
      ],
    };
  }

  // 6. Pricing, Subscription Plans, Monetization
  if (
    query.includes('price') ||
    query.includes('plan') ||
    query.includes('subscription') ||
    query.includes('cost') ||
    query.includes('pay') ||
    query.includes('boost') ||
    query.includes('tier') ||
    query.includes('fee') ||
    query.includes('free')
  ) {
    return {
      reply: `**StrucTrade Seller Subscriptions & Boost Pricing:**\n\n• **FREE Individual (₦0/month)**: Up to 5 active listings, standard search positioning, direct WhatsApp & Phone leads.\n• **PROFESSIONAL Agent / Dealer (₦25,000/month)**: Up to 50 active listings, Verified badge, CRM lead management, 2 featured boosts.\n• **BUSINESS Dealership / Fleet (₦65,000/month)**: Up to 200 active listings, custom branded Storefront URL, team logins, equipment rental contract tools.\n• **ENTERPRISE Developers & Fleets (₦180,000/month)**: Unlimited listings, automated inventory API sync, dedicated account manager.\n• **Featured Boosts**: 7-day boost (₦7,500) | 30-day boost (₦22,500).`,
      actionLinks: [
        { label: 'View Subscription Plans', action: 'pricing' },
      ],
    };
  }

  // 7. How to Post a Listing
  if (
    query.includes('post') ||
    query.includes('list') ||
    query.includes('sell') ||
    query.includes('publish') ||
    query.includes('create listing')
  ) {
    return {
      reply: `**How to Post a Listing on StrucTrade:**\n\n1. Click the green **"+ Post Listing"** button in the top navigation or mobile bottom bar.\n2. **Select Vertical**: Choose Property, Cars, Heavy Equipment, or Construction Materials/Services.\n3. **Enter Details**: Specify price in Naira (₦), location down to State and Area, and category-specific specs.\n4. **Seller Contact**: Enter your phone number and WhatsApp number.\n5. **Upload Photos & Publish**: Add asset photos and submit. Your listing goes live immediately.`,
      actionLinks: [
        { label: 'Open "+ Post Listing" Form', action: 'post_listing' },
      ],
    };
  }

  // 8. Contacting, Calling, WhatsApp, Viewing Requests
  if (
    query.includes('contact') ||
    query.includes('whatsapp') ||
    query.includes('call') ||
    query.includes('phone') ||
    query.includes('chat') ||
    query.includes('message') ||
    query.includes('viewing')
  ) {
    return {
      reply: `**Connecting with Sellers on StrucTrade:**\n\n• **WhatsApp**: Tap the green **WhatsApp** button on any listing to open a pre-filled inquiry in WhatsApp.\n• **Phone Call**: Tap the phone call button to dial the verified seller directly.\n• **Property Viewing**: Click **"Schedule Inspection"** on properties to book a physical inspection date and time.\n• **Equipment Rental**: Click **"Request Rental"** on machinery to submit your project dates and mobilization request.`,
    };
  }

  // 9. Trust, Safety, Verification, Fraud Prevention
  if (
    query.includes('safe') ||
    query.includes('scam') ||
    query.includes('fraud') ||
    query.includes('trust') ||
    query.includes('legit') ||
    query.includes('verify') ||
    query.includes('cac') ||
    query.includes('nin') ||
    query.includes('report')
  ) {
    return {
      reply: `**Trust & Safety Safeguards on StrucTrade:**\n\n• **Verified Merchant Badges**: Look for the green **Verified** badge indicating confirmed phone OTP, NIN, and Corporate Affairs Commission (CAC) business registration.\n• **Physical Inspection Rule**: Never transfer funds for uninspected property or vehicles. Always use **"Schedule Inspection"** to inspect the asset in person with the agent or yard manager.\n• **Title Checks**: Confirm C of O or Governor's Consent with the Lands Bureau before closing property transactions.\n• **Report Suspicious Listings**: Use the flag/report button on any listing to submit it for immediate compliance review.`,
    };
  }

  // 10. Geography, States, Locations
  if (
    query.includes('state') ||
    query.includes('location') ||
    query.includes('lagos') ||
    query.includes('abuja') ||
    query.includes('port harcourt') ||
    query.includes('kano') ||
    query.includes('ibadan') ||
    query.includes('where')
  ) {
    return {
      reply: `**Locations Supported:**\n\nStrucTrade supports all 36 States in Nigeria + FCT Abuja, with key hubs in:\n• **Lagos**: Lekki, Ikoyi, Victoria Island, Ikeja GRA, Magodo, Ajah, Surulere, Epe.\n• **Abuja**: Maitama, Wuse 2, Jabi, Guzape, Garki, Asokoro.\n• **Rivers**: Port Harcourt Old GRA, Peter Odili Road, Trans-Amadi.\n• Other active states include Oyo (Ibadan), Kano, Delta, Ogun, and Enugu.\n\nYou can filter by State and Area using the State dropdown in the navigation bar.`,
    };
  }

  // 11. Storefronts & Business Directory
  if (
    query.includes('store') ||
    query.includes('business') ||
    query.includes('dealer') ||
    query.includes('directory') ||
    query.includes('agency') ||
    query.includes('firm')
  ) {
    return {
      reply: `**Verified Corporate Storefronts:**\n\nDealerships, real estate agencies, and equipment hire fleets have dedicated storefronts displaying:\n• Verified CAC company registration.\n• Physical yard or office address.\n• Complete listing catalog of their available properties, machines, or vehicles.\n• Direct WhatsApp hotline and sales contact.\n\nYou can access these by navigating to the **Businesses** tab in the main navigation.`,
      actionLinks: [
        { label: 'Explore Verified Business Directory', action: 'business_directory' },
      ],
    };
  }

  // 12. Dealer Dashboard & CRM Leads
  if (
    query.includes('dashboard') ||
    query.includes('lead') ||
    query.includes('crm') ||
    query.includes('portal') ||
    query.includes('analytics') ||
    query.includes('stat')
  ) {
    return {
      reply: `**Dealer & Lister Portal (CRM Dashboard):**\n\nThe Dealer Portal provides:\n• **Analytics**: Real-time listing views, phone call clicks, and WhatsApp leads.\n• **Lead CRM**: Buyer inquiries organized into New, Contacted, In Negotiation, and Closed.\n• **Appointments**: Scheduled property inspections and equipment rental requests.\n• **Storefront Management**: Update business information, CAC documents, and inventory.`,
      actionLinks: [
        { label: 'Open Dealer Dashboard Portal', action: 'dashboard' },
      ],
    };
  }

  // Direct, concise fallback
  return {
    reply: `I can help you with questions about StrucTrade Nigeria. Please ask your specific question regarding properties, heavy machinery rentals, vehicles, building materials, seller subscription plans, or platform verification.`,
  };
}
