import React, { useState, useMemo } from 'react';
import { 
  Building2, 
  Car, 
  Wrench, 
  Hammer, 
  Store, 
  LayoutDashboard, 
  FileText, 
  Plus, 
  ShieldCheck, 
  MapPin, 
  Phone, 
  MessageSquare,
  Sparkles,
  Search,
  CheckCircle,
  ExternalLink,
  Lock,
  Shield,
  Scale,
  Heart
} from 'lucide-react';
import { 
  MarketplaceVertical, 
  MarketplaceItem, 
  ViewingRequest, 
  RentalRequest, 
  BusinessStorefront,
  UserAccount,
  Lead,
  ListingReport,
  SellerReview,
  PaymentTransaction,
  ChatConversation,
  ChatMessage,
  SellerInfo,
  AppNotification
} from './types';
import { 
  INITIAL_MARKETPLACE_ITEMS, 
  MOCK_BUSINESS_STOREFRONTS, 
  INITIAL_VIEWING_REQUESTS, 
  INITIAL_RENTAL_REQUESTS,
  INITIAL_LEADS 
} from './data/mockData';
import { 
  DEFAULT_USERS, 
  INITIAL_CONVERSATIONS, 
  INITIAL_MESSAGES, 
  INITIAL_REPORTS, 
  INITIAL_REVIEWS, 
  INITIAL_TRANSACTIONS,
  SUBSCRIPTION_PLANS,
  PROMOTION_PACKAGES,
  INITIAL_NOTIFICATIONS
} from './data/platformData';
import { PRD_DATA } from './data/prdData';
import { Header } from './components/Header';
import { Hero } from './components/Hero';
import { VerticalNav } from './components/VerticalNav';
import { PropertyMarketplace } from './components/PropertyMarketplace';
import { CarsMarketplace } from './components/CarsMarketplace';
import { EquipmentMarketplace } from './components/EquipmentMarketplace';
import { ConstructionMarketplace } from './components/ConstructionMarketplace';
import { AllMarketplacesHub } from './components/AllMarketplacesHub';
import { BusinessDirectory } from './components/BusinessDirectory';
import { Dashboard } from './components/Dashboard';
import { ListingDetailModal } from './components/ListingDetailModal';
import { ViewingRequestModal } from './components/ViewingRequestModal';
import { RentalRequestModal } from './components/RentalRequestModal';
import { PostListingModal } from './components/PostListingModal';
import { AuthModal } from './components/AuthModal';
import { AdminPortal } from './components/AdminPortal';
import { ChatModal } from './components/ChatModal';
import { PaymentModal } from './components/PaymentModal';
import { ReportModal } from './components/ReportModal';
import { ReviewModal } from './components/ReviewModal';
import { CompareModal } from './components/CompareModal';
import { CompareFloatingBar } from './components/CompareFloatingBar';
import { NotificationCenter } from './components/NotificationCenter';
import { SellerProfileModal } from './components/SellerProfileModal';
import { UserProfileModal } from './components/UserProfileModal';
import { ContactActionModal } from './components/ContactActionModal';
import { SiteChatBot } from './components/SiteChatBot';
import { formatFullNaira } from './lib/formatters';

export default function App() {
  // Global Navigation & State
  const [currentVertical, setCurrentVertical] = useState<MarketplaceVertical | 'businesses' | 'dashboard' | 'admin' | 'prd'>('property');
  const [selectedState, setSelectedState] = useState<string>('Lagos');
  const [selectedArea, setSelectedArea] = useState<string>('All Areas');
  const [searchQuery, setSearchQuery] = useState<string>('');
  
  // User & Auth State (Section 25 & 26)
  const [users, setUsers] = useState<UserAccount[]>(DEFAULT_USERS);
  const [currentUser, setCurrentUser] = useState<UserAccount>(DEFAULT_USERS[0]); // Starts as Apex Realty
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);

  // Data Collections
  const [items, setItems] = useState<MarketplaceItem[]>(INITIAL_MARKETPLACE_ITEMS);
  const [viewingRequests, setViewingRequests] = useState<ViewingRequest[]>(INITIAL_VIEWING_REQUESTS);
  const [rentalRequests, setRentalRequests] = useState<RentalRequest[]>(INITIAL_RENTAL_REQUESTS);
  const [leads, setLeads] = useState<Lead[]>(INITIAL_LEADS);
  const [businesses, setBusinesses] = useState<BusinessStorefront[]>(MOCK_BUSINESS_STOREFRONTS);
  const [reports, setReports] = useState<ListingReport[]>(INITIAL_REPORTS);
  const [reviews, setReviews] = useState<SellerReview[]>(INITIAL_REVIEWS);
  const [transactions, setTransactions] = useState<PaymentTransaction[]>(INITIAL_TRANSACTIONS);

  // Messaging State (Section 28)
  const [conversations, setConversations] = useState<ChatConversation[]>(INITIAL_CONVERSATIONS);
  const [chatMessages, setChatMessages] = useState<Record<string, ChatMessage[]>>(INITIAL_MESSAGES);
  const [isChatModalOpen, setIsChatModalOpen] = useState(false);
  const [chatTargetItem, setChatTargetItem] = useState<MarketplaceItem | null>(null);

  // Comparison State (Section 21)
  const [comparedItems, setComparedItems] = useState<MarketplaceItem[]>([]);
  const [isCompareModalOpen, setIsCompareModalOpen] = useState(false);

  // Saved Favorites State (Section 29)
  const [favoriteIds, setFavoriteIds] = useState<string[]>(['prop-1', 'car-1']);

  // Payment & Boost Modal State (Sections 43-46)
  const [isPaymentModalOpen, setIsPaymentModalOpen] = useState(false);
  const [paymentMode, setPaymentMode] = useState<'subscription' | 'promotion'>('subscription');
  const [paymentTargetListing, setPaymentTargetListing] = useState<MarketplaceItem | null>(null);

  // Trust & Safety Modals (Sections 50 & 56)
  const [itemForReport, setItemForReport] = useState<MarketplaceItem | null>(null);
  const [sellerForReview, setSellerForReview] = useState<SellerInfo | null>(null);

  // Inspection & Creation Modals
  const [selectedItemForDetail, setSelectedItemForDetail] = useState<MarketplaceItem | null>(null);
  const [selectedItemForViewing, setSelectedItemForViewing] = useState<MarketplaceItem | null>(null);
  const [selectedItemForRental, setSelectedItemForRental] = useState<MarketplaceItem | null>(null);
  const [isPostModalOpen, setIsPostModalOpen] = useState<boolean>(false);

  // Notifications & User/Seller Profiles (PRD Sections 25-27, 30)
  const [notifications, setNotifications] = useState<AppNotification[]>(INITIAL_NOTIFICATIONS);
  const [isNotificationCenterOpen, setIsNotificationCenterOpen] = useState(false);
  const [selectedSellerForProfile, setSelectedSellerForProfile] = useState<SellerInfo | null>(null);
  const [isUserProfileModalOpen, setIsUserProfileModalOpen] = useState(false);

  // User Contact Prompt for WhatsApp & Call
  const [contactActionModalData, setContactActionModalData] = useState<{
    isOpen: boolean;
    targetItem: MarketplaceItem | null;
    targetSeller?: SellerInfo | null;
    actionType: 'whatsapp' | 'call';
  }>({
    isOpen: false,
    targetItem: null,
    targetSeller: null,
    actionType: 'whatsapp',
  });

  const handleInitiateContact = (
    item: MarketplaceItem | null,
    actionType: 'whatsapp' | 'call',
    seller?: SellerInfo | null
  ) => {
    setContactActionModalData({
      isOpen: true,
      targetItem: item,
      targetSeller: seller || item?.seller || null,
      actionType,
    });
  };

  const handleProceedContact = (contact: {
    name: string;
    phone: string;
    whatsapp: string;
    actionType: 'whatsapp' | 'call';
  }) => {
    const { targetItem, targetSeller, actionType } = contactActionModalData;
    const seller = targetSeller || targetItem?.seller;

    // Update currentUser if anonymous or guest
    if (contact.name && (currentUser.name === 'Guest User' || !currentUser.name)) {
      setCurrentUser((prev) => ({
        ...prev,
        name: contact.name,
        phone: contact.phone,
        whatsapp: contact.whatsapp,
      }));
    }

    // Add lead record into CRM pipeline with real user contact
    if (targetItem) {
      const newLead: Lead = {
        id: `lead-${Date.now()}`,
        listingId: targetItem.id,
        listingTitle: targetItem.title,
        category: targetItem.vertical,
        leadType: actionType === 'whatsapp' ? 'WhatsApp Click' : 'Phone Reveal',
        clientName: contact.name,
        clientPhone: contact.phone,
        clientWhatsapp: contact.whatsapp,
        clientMessage: `Direct ${actionType.toUpperCase()} lead from ${contact.name} (Phone: ${contact.phone}, WhatsApp: ${contact.whatsapp}) for "${targetItem.title}".`,
        status: 'New',
        date: 'Just now',
      };
      setLeads((prev) => [newLead, ...prev]);
    }

    setContactActionModalData((prev) => ({ ...prev, isOpen: false }));

    if (actionType === 'whatsapp') {
      const sellerWhatsapp = seller?.whatsapp || seller?.phone || '';
      let cleanNum = sellerWhatsapp.replace(/[^0-9]/g, '');
      if (cleanNum.startsWith('0') && cleanNum.length === 11) {
        cleanNum = '234' + cleanNum.slice(1);
      }
      const msg = targetItem
        ? `Hello ${seller?.name || 'Seller'}, my name is ${contact.name} (Phone: ${contact.phone}, WhatsApp: ${contact.whatsapp}). I am inquiring about "${targetItem.title}" (${formatFullNaira(targetItem.price)}) on StrucTrade Nigeria.`
        : `Hello ${seller?.name || 'Seller'}, my name is ${contact.name} (Phone: ${contact.phone}, WhatsApp: ${contact.whatsapp}). I am inquiring about your listings on StrucTrade Nigeria.`;

      showToast(`Connecting to WhatsApp with ${seller?.name || 'seller'}...`);
      window.open(`https://wa.me/${cleanNum}?text=${encodeURIComponent(msg)}`, '_blank', 'noopener,noreferrer');
    } else {
      const sellerPhone = seller?.phone || '';
      showToast(`Calling ${seller?.name || 'seller'} (${sellerPhone})...`);
      window.location.href = `tel:${sellerPhone}`;
    }
  };

  // Notification Toast
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3500);
  };

  // Filtered items based on state and search query
  const filteredItems = useMemo(() => {
    return items.filter((item) => {
      // If item is not active or approved in search, hide from non-admin / non-owner
      if (item.status === 'Paused' || item.status === 'Sold') {
        // Shown only if searched directly or in dashboard
      }
      if (!searchQuery.trim()) return true;
      const q = searchQuery.toLowerCase();
      return (
        item.title.toLowerCase().includes(q) ||
        item.description.toLowerCase().includes(q) ||
        item.location.area.toLowerCase().includes(q) ||
        item.location.state.toLowerCase().includes(q) ||
        item.seller.name.toLowerCase().includes(q) ||
        (item.vehicle && (item.vehicle.make.toLowerCase().includes(q) || item.vehicle.model.toLowerCase().includes(q))) ||
        (item.equipment && (item.equipment.brand.toLowerCase().includes(q) || item.equipment.equipmentType.toLowerCase().includes(q))) ||
        (item.material && item.material.materialCategory.toLowerCase().includes(q)) ||
        (item.service && item.service.serviceType.toLowerCase().includes(q))
      );
    });
  }, [items, searchQuery]);

  // Derived favorites list
  const favoriteItems = useMemo(() => {
    return items.filter((i) => favoriteIds.includes(i.id));
  }, [items, favoriteIds]);

  // Lead counter
  const unreadLeadsCount = useMemo(() => {
    return leads.filter((l) => l.status === 'New').length +
      viewingRequests.filter((r) => r.status === 'Pending').length +
      rentalRequests.filter((r) => r.status === 'Pending Review').length;
  }, [leads, viewingRequests, rentalRequests]);

  const unreadMessagesCount = useMemo(() => {
    return conversations.reduce((acc, c) => acc + (c.unreadCount || 0), 0);
  }, [conversations]);

  const unreadNotifsCount = useMemo(() => {
    return notifications.filter((n) => !n.isRead).length;
  }, [notifications]);

  const handleMarkNotifAsRead = (id: string) => {
    setNotifications((prev) =>
      prev.map((n) => (n.id === id ? { ...n, isRead: true } : n))
    );
  };

  const handleMarkAllNotifsAsRead = () => {
    setNotifications((prev) => prev.map((n) => ({ ...n, isRead: true })));
    showToast('All notifications marked as read.');
  };

  const handleNotificationClick = (notif: AppNotification) => {
    handleMarkNotifAsRead(notif.id);
    setIsNotificationCenterOpen(false);
    if (notif.actionType === 'viewing') {
      setCurrentVertical('dashboard');
    } else if (notif.actionType === 'rental') {
      setCurrentVertical('dashboard');
    } else if (notif.actionType === 'leads') {
      setCurrentVertical('dashboard');
    } else if (notif.actionType === 'chat') {
      setIsChatModalOpen(true);
    } else if (notif.actionType === 'dashboard') {
      setCurrentVertical('dashboard');
    }
  };

  const handleUpdateUserProfile = (updated: Partial<UserAccount>) => {
    setCurrentUser((prev) => ({ ...prev, ...updated }));
    setUsers((prev) =>
      prev.map((u) => (u.id === currentUser.id ? { ...u, ...updated } : u))
    );
    showToast('User profile updated successfully!');
  };

  // Handlers: Listings Lifecycle
  const handleAddNewItem = (newItem: MarketplaceItem) => {
    setItems((prev) => [newItem, ...prev]);
    showToast(`Listing "${newItem.title}" published successfully!`);
    if (newItem.vertical === 'property') setCurrentVertical('property');
    else if (newItem.vertical === 'cars') setCurrentVertical('cars');
    else if (newItem.vertical === 'equipment') setCurrentVertical('equipment');
    else setCurrentVertical('construction');
  };

  const handlePauseListing = (id: string) => {
    setItems((prev) =>
      prev.map((it) => {
        if (it.id === id) {
          const nextStatus = it.status === 'Paused' ? 'Active' : 'Paused';
          showToast(`Listing ${nextStatus === 'Paused' ? 'paused' : 'resumed and live'}.`);
          return { ...it, status: nextStatus };
        }
        return it;
      })
    );
  };

  const handleRenewListing = (id: string) => {
    setItems((prev) =>
      prev.map((it) => {
        if (it.id === id) {
          showToast(`Listing renewed for an additional 30 days.`);
          return { ...it, status: 'Active', createdAt: new Date().toISOString().split('T')[0] };
        }
        return it;
      })
    );
  };

  const handleMarkSold = (id: string) => {
    setItems((prev) =>
      prev.map((it) => {
        if (it.id === id) {
          showToast(`Listing marked as Sold / Transacted.`);
          return { ...it, status: 'Sold' };
        }
        return it;
      })
    );
  };

  const handleDeleteListing = (id: string) => {
    setItems((prev) => prev.filter((it) => it.id !== id));
    showToast(`Listing removed from inventory.`);
  };

  // Handlers: Lead Tracking (PRD Section 41 & 42)
  const handleTrackContact = (item: MarketplaceItem, type: 'call' | 'whatsapp') => {
    const newLead: Lead = {
      id: `lead-${Date.now()}`,
      listingId: item.id,
      listingTitle: item.title,
      category: item.vertical,
      leadType: type === 'whatsapp' ? 'WhatsApp Click' : 'Phone Reveal',
      clientName: currentUser.name || 'Anonymous Buyer',
      clientPhone: currentUser.phone || '+234 800 000 0000',
      clientMessage: `Inquired via ${type.toUpperCase()} from StrucTrade Marketplace listing page.`,
      status: 'New',
      date: 'Just now',
    };
    setLeads((prev) => [newLead, ...prev]);
    showToast(`Contact recorded in Lead CRM pipeline.`);
  };

  const handleUpdateLeadStatus = (id: string, status: Lead['status']) => {
    setLeads((prev) => prev.map((l) => (l.id === id ? { ...l, status } : l)));
    showToast(`Lead status updated to ${status}.`);
  };

  // Handlers: Requests
  const handleCreateViewingRequest = (req: Omit<ViewingRequest, 'id' | 'createdAt' | 'status'>) => {
    const newReq: ViewingRequest = {
      ...req,
      id: `vw-${Date.now()}`,
      createdAt: new Date().toISOString().split('T')[0],
      status: 'Pending',
    };
    setViewingRequests((prev) => [newReq, ...prev]);

    // Also add to lead pipeline
    const lead: Lead = {
      id: `lead-${Date.now()}`,
      listingId: req.propertyId,
      listingTitle: req.propertyTitle,
      category: 'property',
      leadType: 'Inspection Request',
      clientName: req.seekerName,
      clientPhone: req.seekerPhone,
      clientMessage: `Inspection requested for ${req.preferredDate} (${req.preferredTime}): ${req.message}`,
      status: 'New',
      date: 'Just now',
    };
    setLeads((prev) => [lead, ...prev]);
    showToast(`Viewing appointment submitted! The seller has been notified.`);
  };

  const handleCreateRentalRequest = (req: Omit<RentalRequest, 'id' | 'createdAt' | 'status'>) => {
    const newReq: RentalRequest = {
      ...req,
      id: `rq-${Date.now()}`,
      createdAt: new Date().toISOString().split('T')[0],
      status: 'Pending Review',
    };
    setRentalRequests((prev) => [newReq, ...prev]);

    // Also add to lead pipeline
    const lead: Lead = {
      id: `lead-${Date.now()}`,
      listingId: req.equipmentId,
      listingTitle: req.equipmentTitle,
      category: 'equipment',
      leadType: 'Rental Request',
      clientName: req.clientName,
      clientPhone: req.clientPhone,
      clientMessage: `Hire order for site at ${req.deliveryAddress}. Estimated: ₦${req.estimatedTotal.toLocaleString()}`,
      status: 'New',
      date: 'Just now',
    };
    setLeads((prev) => [lead, ...prev]);
    showToast(`Plant hire mobilization requisition sent!`);
  };

  const handleUpdateViewingStatus = (id: string, status: 'Confirmed' | 'Completed' | 'Cancelled') => {
    setViewingRequests((prev) =>
      prev.map((r) => (r.id === id ? { ...r, status } : r))
    );
    showToast(`Inspection request marked as ${status}.`);
  };

  const handleUpdateRentalStatus = (id: string, status: 'Approved' | 'Declined' | 'Returned') => {
    setRentalRequests((prev) =>
      prev.map((r) => (r.id === id ? { ...r, status } : r))
    );
    showToast(`Rental order updated to ${status}.`);
  };

  // Handlers: Favorites & Comparison
  const handleToggleFavorite = (id: string) => {
    setFavoriteIds((prev) => {
      if (prev.includes(id)) {
        showToast('Removed from saved favorites.');
        return prev.filter((i) => i !== id);
      } else {
        showToast('Saved to your favorites watchlist.');
        return [...prev, id];
      }
    });
  };

  const handleAddToCompare = (item: MarketplaceItem) => {
    setComparedItems((prev) => {
      if (prev.some((i) => i.id === item.id)) {
        showToast('Item is already in your comparison tray.');
        return prev;
      }
      if (prev.length >= 4) {
        showToast('Maximum 4 items can be compared side-by-side.');
        return prev;
      }
      showToast(`Added "${item.title}" to compare list.`);
      return [...prev, item];
    });
  };

  const handleRemoveFromCompare = (id: string) => {
    setComparedItems((prev) => prev.filter((i) => i.id !== id));
  };

  // Handlers: Trade Chat Messaging
  const handleOpenChat = (convId?: string, targetListing?: MarketplaceItem) => {
    if (targetListing) {
      setChatTargetItem(targetListing);
    }
    setIsChatModalOpen(true);
  };

  const handleSendMessage = (conversationId: string, text: string, targetListing?: MarketplaceItem) => {
    const newMessage: ChatMessage = {
      id: `msg-${Date.now()}`,
      conversationId,
      senderId: currentUser.id,
      senderName: currentUser.name,
      text,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      isRead: false,
    };

    setChatMessages((prev) => ({
      ...prev,
      [conversationId]: [...(prev[conversationId] || []), newMessage],
    }));

    // Update conversation preview
    setConversations((prev) => {
      const exists = prev.find((c) => c.id === conversationId);
      if (exists) {
        return prev.map((c) =>
          c.id === conversationId
            ? { ...c, lastMessage: text, lastMessageTimestamp: 'Just now' }
            : c
        );
      } else if (targetListing) {
        const newConv: ChatConversation = {
          id: conversationId,
          listingId: targetListing.id,
          listingTitle: targetListing.title,
          listingPrice: targetListing.price,
          listingImage: targetListing.images[0],
          buyerId: currentUser.id,
          buyerName: currentUser.name,
          sellerId: targetListing.seller.id,
          sellerName: targetListing.seller.name,
          lastMessage: text,
          lastMessageTimestamp: 'Just now',
          unreadCount: 0,
        };
        return [newConv, ...prev];
      }
      return prev;
    });

    // Auto-respond simulation after 1.5 seconds for realism
    setTimeout(() => {
      const replyMsg: ChatMessage = {
        id: `msg-reply-${Date.now()}`,
        conversationId,
        senderId: 'seller-rep',
        senderName: targetListing ? targetListing.seller.name : 'Trade Representative',
        text: `Hello ${currentUser.name}, thank you for reaching out on StrucTrade. Yes, this item is available for physical inspection and contract settlement. When would you like to schedule an inspection?`,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        isRead: true,
      };
      setChatMessages((prev) => ({
        ...prev,
        [conversationId]: [...(prev[conversationId] || []), replyMsg],
      }));
    }, 1500);
  };

  // Handlers: Payment & Boost Execution
  const handleOpenUpgradePlan = () => {
    setPaymentMode('subscription');
    setPaymentTargetListing(null);
    setIsPaymentModalOpen(true);
  };

  const handleOpenPromoteListing = (listing: MarketplaceItem) => {
    setPaymentMode('promotion');
    setPaymentTargetListing(listing);
    setIsPaymentModalOpen(true);
  };

  const handlePaymentSuccess = (
    transaction: PaymentTransaction,
    targetListingId?: string,
    promoType?: 'featured' | 'top_search' | 'homepage',
    newPlan?: 'Free' | 'Professional' | 'Business' | 'Enterprise'
  ) => {
    setTransactions((prev) => [transaction, ...prev]);

    if (newPlan) {
      setCurrentUser((prev) => ({
        ...prev,
        plan: newPlan,
        role: newPlan === 'Free' ? 'registered' : 'professional',
        maxListings: newPlan === 'Enterprise' ? 9999 : newPlan === 'Business' ? 200 : 50,
      }));
      showToast(`Subscription updated to ${newPlan} Tier! Verified perks enabled.`);
    }

    if (targetListingId && promoType) {
      setItems((prev) =>
        prev.map((it) => {
          if (it.id === targetListingId) {
            return { ...it, featured: true, promotionType: promoType };
          }
          return it;
        })
      );
      showToast(`Listing boost activated! Your asset is now priority ranked.`);
    }
  };

  // Handlers: Trust Reports & Reviews
  const handleSubmitReport = (report: ListingReport) => {
    setReports((prev) => [report, ...prev]);
    showToast('Report submitted. StrucTrade Trust & Safety team will audit this listing within 24 hours.');
  };

  const handleSubmitReview = (review: SellerReview) => {
    setReviews((prev) => [review, ...prev]);
    showToast('Review submitted successfully. Thank you for contributing to merchant transparency!');
  };

  // Handlers: Admin Moderation Operations
  const handleAdminApproveListing = (id: string) => {
    setItems((prev) => prev.map((it) => (it.id === id ? { ...it, status: 'Active' } : it)));
    showToast(`Listing ${id} approved for marketplace search.`);
  };

  const handleAdminRejectListing = (id: string) => {
    setItems((prev) => prev.map((it) => (it.id === id ? { ...it, status: 'Rejected' } : it)));
    showToast(`Listing ${id} rejected.`);
  };

  const handleAdminSuspendListing = (id: string) => {
    setItems((prev) => prev.map((it) => (it.id === id ? { ...it, status: 'Suspended' } : it)));
    showToast(`Listing ${id} suspended from public view.`);
  };

  const handleAdminFeatureListing = (id: string) => {
    setItems((prev) =>
      prev.map((it) => (it.id === id ? { ...it, featured: !it.featured } : it))
    );
    showToast(`Listing feature flag toggled.`);
  };

  const handleAdminResolveReport = (reportId: string) => {
    setReports((prev) =>
      prev.map((r) => (r.id === reportId ? { ...r, status: 'Resolved' } : r))
    );
    showToast(`Report ${reportId} marked as resolved.`);
  };

  const handleAdminDismissReport = (reportId: string) => {
    setReports((prev) =>
      prev.map((r) => (r.id === reportId ? { ...r, status: 'Dismissed' } : r))
    );
    showToast(`Report ${reportId} dismissed.`);
  };

  const handleAdminToggleUserVerification = (userId: string, type: 'phone' | 'nin' | 'cac') => {
    setUsers((prev) =>
      prev.map((u) => {
        if (u.id === userId) {
          if (type === 'phone') return { ...u, phoneVerified: !u.phoneVerified };
          if (type === 'nin') return { ...u, ninVerified: !u.ninVerified };
          if (type === 'cac') return { ...u, cacVerified: !u.cacVerified };
        }
        return u;
      })
    );
    showToast(`User verification updated.`);
  };

  const handleAdminToggleUserStatus = (userId: string) => {
    setUsers((prev) =>
      prev.map((u) => {
        if (u.id === userId) {
          return { ...u, status: u.status === 'active' ? 'suspended' : 'active' };
        }
        return u;
      })
    );
    showToast(`User account status toggled.`);
  };

  const activeMarketplaceVertical: MarketplaceVertical = 
    ['all', 'property', 'cars', 'equipment', 'construction'].includes(currentVertical)
      ? (currentVertical as MarketplaceVertical)
      : 'property';

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 flex flex-col font-sans selection:bg-emerald-500 selection:text-white relative pb-16 md:pb-0">
      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed top-4 right-4 z-50 bg-slate-900 text-white px-4 py-3 rounded-xl shadow-2xl border border-slate-700 flex items-center gap-2.5 text-xs font-semibold animate-in fade-in slide-in-from-top-3">
          <CheckCircle className="w-4 h-4 text-emerald-400 shrink-0" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* 1. Global Header with Location Picker and Navigation */}
      <Header
        currentUser={currentUser}
        currentVertical={activeMarketplaceVertical}
        onSelectVertical={(v) => setCurrentVertical(v)}
        selectedState={selectedState}
        onSelectState={setSelectedState}
        selectedArea={selectedArea}
        onSelectArea={setSelectedArea}
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
        onOpenPostModal={() => setIsPostModalOpen(true)}
        onOpenDashboard={() => setCurrentVertical('dashboard')}
        onOpenPrdModal={() => setCurrentVertical('prd')}
        onOpenAuthModal={() => setIsAuthModalOpen(true)}
        onOpenAdminPortal={() => setCurrentVertical('admin')}
        onOpenChat={() => handleOpenChat()}
        unreadLeadsCount={unreadLeadsCount}
        unreadMessagesCount={unreadMessagesCount}
        unreadNotifsCount={unreadNotifsCount}
        onToggleNotifications={() => setIsNotificationCenterOpen((prev) => !prev)}
        onOpenUserProfile={() => setIsUserProfileModalOpen(true)}
        favoritesCount={favoriteIds.length}
        comparedCount={comparedItems.length}
        onOpenCompare={() => setIsCompareModalOpen(true)}
      />

      {/* 2. Hero Component (Shown on main vertical views, hidden when in Dashboard, Admin, or PRD) */}
      {currentVertical !== 'dashboard' && currentVertical !== 'prd' && currentVertical !== 'admin' && currentVertical !== 'businesses' && (
        <Hero
          onSearch={(term, cat, loc) => {
            setSearchQuery(term);
            if (cat === 'all') {
              setCurrentVertical('all');
            } else {
              setCurrentVertical(cat as MarketplaceVertical);
            }
            if (loc && loc !== 'All Nigeria') setSelectedState(loc);
          }}
          selectedState={selectedState}
          onSelectState={setSelectedState}
          onSelectVertical={(v) => setCurrentVertical(v)}
        />
      )}

      {/* 3. Main Navigation Bar across the 4 Verticals + Businesses + Dashboard */}
      <div className="max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8 mt-6">
        <VerticalNav
          currentVertical={activeMarketplaceVertical}
          onSelectVertical={(v) => setCurrentVertical(v)}
        />
      </div>

      {/* 4. Main Body Container */}
      <main className="max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8 py-6 flex-1">
        {/* VIEW 0: ALL MARKETPLACES HUB */}
        {currentVertical === 'all' && (
          <AllMarketplacesHub
            items={filteredItems}
            onSelectItem={(item) => setSelectedItemForDetail(item)}
            onRequestViewing={(item) => setSelectedItemForViewing(item)}
            onRequestRental={(item) => setSelectedItemForRental(item)}
            onSelectVertical={(v) => setCurrentVertical(v)}
            selectedState={selectedState}
            searchQuery={searchQuery}
            onClearSearch={() => setSearchQuery('')}
          />
        )}

        {/* VIEW 1: PROPERTY VERTICAL */}
        {currentVertical === 'property' && (
          <PropertyMarketplace
            items={filteredItems}
            onSelectItem={(item) => setSelectedItemForDetail(item)}
            onRequestViewing={(item) => setSelectedItemForViewing(item)}
            selectedState={selectedState}
          />
        )}

        {/* VIEW 2: CARS VERTICAL */}
        {currentVertical === 'cars' && (
          <CarsMarketplace
            items={filteredItems}
            onSelectItem={(item) => setSelectedItemForDetail(item)}
            selectedState={selectedState}
          />
        )}

        {/* VIEW 3: HEAVY EQUIPMENT VERTICAL */}
        {currentVertical === 'equipment' && (
          <EquipmentMarketplace
            items={filteredItems}
            onSelectItem={(item) => setSelectedItemForDetail(item)}
            onRequestRental={(item) => setSelectedItemForRental(item)}
            selectedState={selectedState}
          />
        )}

        {/* VIEW 4: CONSTRUCTION (MATERIALS + PROFESSIONAL DIRECTORY) */}
        {currentVertical === 'construction' && (
          <ConstructionMarketplace
            items={filteredItems}
            onSelectItem={(item) => setSelectedItemForDetail(item)}
            selectedState={selectedState}
          />
        )}

        {/* VIEW 5: VERIFIED BUSINESS STOREFRONTS */}
        {currentVertical === 'businesses' && (
          <BusinessDirectory
            businesses={businesses}
            items={items}
            onSelectBusinessFilter={(bizName) => {
              setSearchQuery(bizName);
              setCurrentVertical('property');
            }}
          />
        )}

        {/* VIEW 6: SELLER DASHBOARD & LEADS MANAGEMENT (PRD Sections 31–46) */}
        {currentVertical === 'dashboard' && (
          <Dashboard
            currentUser={currentUser}
            myListings={items}
            viewingRequests={viewingRequests}
            rentalRequests={rentalRequests}
            leads={leads}
            conversations={conversations}
            favorites={favoriteItems}
            transactions={transactions}
            onOpenPostListing={() => setIsPostModalOpen(true)}
            onUpdateViewingStatus={handleUpdateViewingStatus}
            onUpdateRentalStatus={handleUpdateRentalStatus}
            onUpdateLeadStatus={handleUpdateLeadStatus}
            onOpenChat={(convId, targetListing) => handleOpenChat(convId, targetListing)}
            onRemoveFavorite={(id) => handleToggleFavorite(id)}
            onOpenListingDetail={(item) => setSelectedItemForDetail(item)}
            onUpgradePlan={handleOpenUpgradePlan}
            onPromoteListing={handleOpenPromoteListing}
            onPauseListing={handlePauseListing}
            onRenewListing={handleRenewListing}
            onMarkSold={handleMarkSold}
            onDeleteListing={handleDeleteListing}
          />
        )}

        {/* VIEW 7: ADMIN & MODERATION PORTAL (PRD Sections 48–52) */}
        {currentVertical === 'admin' && (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-xl font-bold font-display text-slate-900">
                  StrucTrade Nigeria — Admin Moderation Hub
                </h1>
                <p className="text-xs text-slate-500">
                  Section 48–52: Audit listings, manage user verification (CAC/NIN), review fraud tickets, and track platform revenue.
                </p>
              </div>
              <button
                onClick={() => setCurrentVertical('property')}
                className="py-1.5 px-3 rounded-lg bg-slate-200 hover:bg-slate-300 text-slate-800 text-xs font-bold transition cursor-pointer"
              >
                ← Back to Marketplace
              </button>
            </div>
            <AdminPortal
              listings={items}
              reports={reports}
              users={users}
              transactions={transactions}
              onApproveListing={handleAdminApproveListing}
              onRejectListing={handleAdminRejectListing}
              onSuspendListing={handleAdminSuspendListing}
              onFeatureListing={handleAdminFeatureListing}
              onResolveReport={handleAdminResolveReport}
              onDismissReport={handleAdminDismissReport}
              onToggleUserVerification={handleAdminToggleUserVerification}
              onToggleUserStatus={handleAdminToggleUserStatus}
              onViewListingDetail={(listing) => setSelectedItemForDetail(listing)}
            />
          </div>
        )}

        {/* VIEW 8: COMPLETE PRODUCTION PRD & SYSTEM ARCHITECTURE VIEWER */}
        {currentVertical === 'prd' && (
          <div className="bg-white rounded-2xl p-6 sm:p-8 border border-slate-200 shadow-sm space-y-6">
            <div className="border-b border-slate-200 pb-4">
              <span className="text-xs font-bold uppercase tracking-wider text-emerald-700 block mb-1">
                System Specification & Architecture Reference
              </span>
              <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 font-display">
                StrucTrade Nigeria — Product Requirements & Technical Architecture
              </h1>
              <p className="text-sm text-slate-600 mt-2">
                Specialized Nigerian marketplace connecting Property, Vehicles, Heavy Equipment, and Construction Materials & Services.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {PRD_DATA.map((section, idx) => (
                <div key={section.id} className="p-4 rounded-xl border border-slate-200 bg-slate-50/70 space-y-2">
                  <div className="flex items-center justify-between gap-2">
                    <h3 className="font-bold text-slate-900 text-sm font-display flex items-center gap-2">
                      <span className="w-5 h-5 rounded-full bg-emerald-600 text-white text-[10px] font-bold flex items-center justify-center shrink-0">
                        {idx + 1}
                      </span>
                      <span>{section.title}</span>
                    </h3>
                    {section.badge && (
                      <span className="text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded bg-emerald-100 text-emerald-800 shrink-0">
                        {section.badge}
                      </span>
                    )}
                  </div>
                  <p className="text-xs text-slate-600 whitespace-pre-line leading-relaxed">
                    {section.content}
                  </p>
                </div>
              ))}
            </div>
          </div>
        )}
      </main>

      {/* 5. Production Nigerian Marketplace Footer */}
      <footer className="bg-slate-950 text-white border-t border-slate-800 mt-16 pt-12 pb-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10">
          <div className="grid grid-cols-1 md:grid-cols-5 gap-8">
            <div className="md:col-span-2 space-y-3">
              <div className="flex items-center gap-2.5">
                <div className="w-9 h-9 rounded-xl bg-emerald-600 text-white flex items-center justify-center font-extrabold text-lg shadow-xs">
                  ST
                </div>
                <span className="text-xl font-extrabold tracking-tight font-display">
                  StrucTrade <span className="text-emerald-400">Nigeria</span>
                </span>
              </div>
              <p className="text-xs text-slate-400 leading-relaxed max-w-sm">
                Nigeria's premier specialized marketplace connecting real estate developers, car dealerships, plant hire fleets, and certified building professionals nationwide.
              </p>
              <div className="flex items-center gap-2 text-xs text-slate-400 pt-2">
                <ShieldCheck className="w-4 h-4 text-emerald-400" />
                <span>CAC Registered Companies • Certified Title Searches</span>
              </div>
            </div>

            <div>
              <h4 className="text-xs font-bold text-slate-200 uppercase tracking-wider mb-3">
                Key Verticals
              </h4>
              <ul className="text-xs text-slate-400 space-y-2">
                <li><button onClick={() => setCurrentVertical('property')} className="hover:text-emerald-400 transition cursor-pointer">Real Estate & Land</button></li>
                <li><button onClick={() => setCurrentVertical('cars')} className="hover:text-emerald-400 transition cursor-pointer">Cars & Tokunbo Vehicles</button></li>
                <li><button onClick={() => setCurrentVertical('equipment')} className="hover:text-emerald-400 transition cursor-pointer">Machinery & Plant Hire</button></li>
                <li><button onClick={() => setCurrentVertical('construction')} className="hover:text-emerald-400 transition cursor-pointer">Building Materials</button></li>
                <li><button onClick={() => setCurrentVertical('construction')} className="hover:text-emerald-400 transition cursor-pointer">Contractor Directory</button></li>
              </ul>
            </div>

            <div>
              <h4 className="text-xs font-bold text-slate-200 uppercase tracking-wider mb-3">
                Nigeria Trade Hubs
              </h4>
              <ul className="text-xs text-slate-400 space-y-2">
                <li><button onClick={() => { setSelectedState('Lagos'); }} className="hover:text-emerald-400 transition cursor-pointer">Lagos (Lekki, Ikeja, Ikoyi)</button></li>
                <li><button onClick={() => { setSelectedState('Abuja (FCT)'); }} className="hover:text-emerald-400 transition cursor-pointer">Abuja (Maitama, Guzape)</button></li>
                <li><button onClick={() => { setSelectedState('Rivers'); }} className="hover:text-emerald-400 transition cursor-pointer">Port Harcourt (GRA, Trans-Amadi)</button></li>
                <li><button onClick={() => { setSelectedState('Ogun'); }} className="hover:text-emerald-400 transition cursor-pointer">Ogun (Sagamu, Mowe-Ibafo)</button></li>
                <li><button onClick={() => { setSelectedState('Oyo'); }} className="hover:text-emerald-400 transition cursor-pointer">Ibadan (Bodija, Oluyole)</button></li>
              </ul>
            </div>

            <div>
              <h4 className="text-xs font-bold text-slate-200 uppercase tracking-wider mb-3">
                Trade Partners & Admin
              </h4>
              <ul className="text-xs text-slate-400 space-y-2">
                <li><button onClick={() => setCurrentVertical('businesses')} className="hover:text-emerald-400 transition cursor-pointer">Business Storefronts</button></li>
                <li><button onClick={() => setCurrentVertical('dashboard')} className="hover:text-emerald-400 transition cursor-pointer">Seller & Dealer Portal</button></li>
                <li><button onClick={() => setCurrentVertical('admin')} className="hover:text-emerald-400 transition cursor-pointer text-purple-400 font-semibold">Admin Moderation Hub</button></li>
                <li><button onClick={() => setCurrentVertical('prd')} className="hover:text-emerald-400 transition cursor-pointer">Production PRD Specs</button></li>
                <li><button onClick={() => setIsPostModalOpen(true)} className="hover:text-emerald-400 transition font-semibold text-emerald-400 cursor-pointer">+ Post an Asset</button></li>
              </ul>
            </div>
          </div>

          <div className="pt-8 border-t border-slate-800 text-slate-500 text-[11px] flex flex-col sm:flex-row items-center justify-between gap-3">
            <p>© {new Date().getFullYear()} StrucTrade Nigeria Ltd. All rights reserved. RC-1849202.</p>
            <p className="text-slate-400">
              Disclaimer: Declared title documents and vehicle specs are verified via independent Land Bureau and VIN checks prior to escrow closing.
            </p>
          </div>
        </div>
      </footer>

      {/* Mobile Bottom Navigation Bar for easy thumb access on smartphones */}
      <nav className="fixed bottom-0 left-0 right-0 z-40 bg-white/95 backdrop-blur-md border-t border-slate-200 px-2 py-1.5 flex items-center justify-around md:hidden shadow-lg">
        <button
          onClick={() => {
            if (['property', 'cars', 'equipment', 'construction'].includes(currentVertical)) {
              window.scrollTo({ top: 0, behavior: 'smooth' });
            } else {
              setCurrentVertical('property');
            }
          }}
          className={`flex flex-col items-center gap-0.5 px-3 py-1 rounded-xl transition cursor-pointer ${
            ['property', 'cars', 'equipment', 'construction'].includes(currentVertical)
              ? 'text-emerald-700 font-bold'
              : 'text-slate-500 hover:text-slate-800'
          }`}
        >
          <Building2 className="w-5 h-5" />
          <span className="text-[10px]">Market</span>
        </button>

        <button
          onClick={() => setCurrentVertical('businesses')}
          className={`flex flex-col items-center gap-0.5 px-3 py-1 rounded-xl transition cursor-pointer ${
            currentVertical === 'businesses'
              ? 'text-emerald-700 font-bold'
              : 'text-slate-500 hover:text-slate-800'
          }`}
        >
          <Store className="w-5 h-5" />
          <span className="text-[10px]">Stores</span>
        </button>

        {/* Central Post Action */}
        <button
          onClick={() => setIsPostModalOpen(true)}
          className="flex flex-col items-center justify-center -mt-4 bg-emerald-600 hover:bg-emerald-700 text-white w-12 h-12 rounded-full shadow-lg shadow-emerald-600/30 transition cursor-pointer border-2 border-white active:scale-95"
          title="Post Listing"
        >
          <Plus className="w-6 h-6 stroke-[2.5]" />
        </button>

        <button
          onClick={() => handleOpenChat()}
          className="relative flex flex-col items-center gap-0.5 px-3 py-1 rounded-xl transition cursor-pointer text-slate-500 hover:text-slate-800"
        >
          <MessageSquare className="w-5 h-5" />
          <span className="text-[10px]">Inquiries</span>
          {unreadMessagesCount > 0 && (
            <span className="absolute top-0.5 right-2 w-4 h-4 rounded-full bg-emerald-600 text-white text-[9px] font-extrabold flex items-center justify-center">
              {unreadMessagesCount}
            </span>
          )}
        </button>

        <button
          onClick={() => setCurrentVertical('dashboard')}
          className={`flex flex-col items-center gap-0.5 px-3 py-1 rounded-xl transition cursor-pointer ${
            currentVertical === 'dashboard'
              ? 'text-emerald-700 font-bold'
              : 'text-slate-500 hover:text-slate-800'
          }`}
        >
          <LayoutDashboard className="w-5 h-5" />
          <span className="text-[10px]">Portal</span>
          {unreadLeadsCount > 0 && (
            <span className="absolute top-0.5 right-2 w-2 h-2 rounded-full bg-amber-500"></span>
          )}
        </button>
      </nav>

      {/* 6. Modals & Overlay Components */}

      {/* Floating Compare Bar */}
      <CompareFloatingBar
        items={comparedItems}
        onOpenCompare={() => setIsCompareModalOpen(true)}
        onClear={() => setComparedItems([])}
        onRemoveItem={handleRemoveFromCompare}
      />

      {/* Side-by-Side Comparison Modal (PRD Section 21) */}
      <CompareModal
        isOpen={isCompareModalOpen}
        onClose={() => setIsCompareModalOpen(false)}
        items={comparedItems}
        onRemoveItem={handleRemoveFromCompare}
        onSelectItem={(item) => {
          setIsCompareModalOpen(false);
          setSelectedItemForDetail(item);
        }}
      />

      {/* Listing Detail Inspection Modal */}
      {selectedItemForDetail && (
        <ListingDetailModal
          item={selectedItemForDetail}
          onClose={() => setSelectedItemForDetail(null)}
          onRequestViewing={(item) => setSelectedItemForViewing(item)}
          onRequestRental={(item) => setSelectedItemForRental(item)}
          onOpenChat={(item) => handleOpenChat(undefined, item)}
          onAddToCompare={(item) => handleAddToCompare(item)}
          isCompared={comparedItems.some((i) => i.id === selectedItemForDetail.id)}
          onReportListing={(item) => setItemForReport(item)}
          onReviewSeller={(seller) => setSellerForReview(seller)}
          onTrackContact={(type) => handleTrackContact(selectedItemForDetail, type)}
          onViewSellerProfile={(seller) => setSelectedSellerForProfile(seller)}
          onInitiateContact={handleInitiateContact}
          currentUser={currentUser}
        />
      )}

      {/* Notification Center Dropdown Popover */}
      <NotificationCenter
        isOpen={isNotificationCenterOpen}
        onClose={() => setIsNotificationCenterOpen(false)}
        notifications={notifications}
        onMarkAsRead={handleMarkNotifAsRead}
        onMarkAllAsRead={handleMarkAllNotifsAsRead}
        onNotificationClick={handleNotificationClick}
      />

      {/* Seller Profile & Merchant Storefront Modal */}
      <SellerProfileModal
        isOpen={selectedSellerForProfile !== null}
        onClose={() => setSelectedSellerForProfile(null)}
        seller={selectedSellerForProfile}
        items={items}
        reviews={reviews}
        onSelectItem={(item) => {
          setSelectedSellerForProfile(null);
          setSelectedItemForDetail(item);
        }}
        onOpenChat={(targetItem) => {
          setSelectedSellerForProfile(null);
          handleOpenChat(undefined, targetItem);
        }}
        onWriteReview={(seller) => {
          setSelectedSellerForProfile(null);
          setSellerForReview(seller);
        }}
        onTrackContact={(type) => {
          showToast(`Contact recorded via ${type === 'call' ? 'phone' : 'WhatsApp'}.`);
        }}
        onInitiateContact={handleInitiateContact}
      />

      {/* Contact Prompt Modal (Name, Phone & WhatsApp on Call or WhatsApp) */}
      <ContactActionModal
        isOpen={contactActionModalData.isOpen}
        onClose={() => setContactActionModalData((prev) => ({ ...prev, isOpen: false }))}
        targetItem={contactActionModalData.targetItem}
        targetSeller={contactActionModalData.targetSeller}
        actionType={contactActionModalData.actionType}
        currentUser={currentUser}
        onProceed={handleProceedContact}
      />

      {/* User Account & Verification Profile Modal */}
      <UserProfileModal
        isOpen={isUserProfileModalOpen}
        onClose={() => setIsUserProfileModalOpen(false)}
        currentUser={currentUser}
        onUpdateProfile={handleUpdateUserProfile}
        onOpenUpgradePlan={() => {
          setIsUserProfileModalOpen(false);
          setPaymentMode('subscription');
          setIsPaymentModalOpen(true);
        }}
      />

      {/* Property Viewing Request Modal */}
      {selectedItemForViewing && (
        <ViewingRequestModal
          item={selectedItemForViewing}
          onClose={() => setSelectedItemForViewing(null)}
          onSubmit={handleCreateViewingRequest}
        />
      )}

      {/* Equipment Rental Requisition Modal */}
      {selectedItemForRental && (
        <RentalRequestModal
          item={selectedItemForRental}
          onClose={() => setSelectedItemForRental(null)}
          onSubmit={handleCreateRentalRequest}
        />
      )}

      {/* Post Listing / Service Modal */}
      {isPostModalOpen && (
        <PostListingModal
          onClose={() => setIsPostModalOpen(false)}
          onPostSuccess={handleAddNewItem}
        />
      )}

      {/* Auth & Persona Switcher Modal */}
      <AuthModal
        isOpen={isAuthModalOpen}
        onClose={() => setIsAuthModalOpen(false)}
        currentUser={currentUser}
        onSwitchUser={(user) => {
          setCurrentUser(user);
          showToast(`Switched active profile to ${user.name} (${user.role})`);
        }}
        onRegisterUser={(newUser) => {
          setUsers((prev) => [newUser, ...prev]);
          setCurrentUser(newUser);
          showToast(`Welcome, ${newUser.name}! Account registered.`);
        }}
      />

      {/* In-App Trade Chat Modal */}
      <ChatModal
        isOpen={isChatModalOpen}
        onClose={() => {
          setIsChatModalOpen(false);
          setChatTargetItem(null);
        }}
        currentUser={currentUser}
        targetItem={chatTargetItem}
        conversations={conversations}
        messages={chatMessages}
        onSendMessage={handleSendMessage}
        onSelectListing={(item) => {
          setIsChatModalOpen(false);
          setSelectedItemForDetail(item);
        }}
      />

      {/* Paystack / Bank Transfer Payment Modal */}
      <PaymentModal
        isOpen={isPaymentModalOpen}
        onClose={() => {
          setIsPaymentModalOpen(false);
          setPaymentTargetListing(null);
        }}
        mode={paymentMode}
        targetListing={paymentTargetListing}
        onPaymentSuccess={handlePaymentSuccess}
      />

      {/* Fraud & Trust Report Modal */}
      <ReportModal
        isOpen={itemForReport !== null}
        onClose={() => setItemForReport(null)}
        targetListing={itemForReport}
        onSubmitReport={handleSubmitReport}
      />

      {/* Seller Review & Rating Modal */}
      <ReviewModal
        isOpen={sellerForReview !== null}
        onClose={() => setSellerForReview(null)}
        seller={sellerForReview}
        onSubmitReview={handleSubmitReview}
      />

      {/* 7. Bottom-Right Intelligent AI Assistant Chat Bot */}
      <SiteChatBot
        onNavigateVertical={(vertical) => {
          setCurrentVertical(vertical);
          window.scrollTo({ top: 0, behavior: 'smooth' });
        }}
        onOpenPostModal={() => setIsPostModalOpen(true)}
        onOpenPricingModal={() => {
          setPaymentMode('subscription');
          setIsPaymentModalOpen(true);
        }}
      />
    </div>
  );
}
