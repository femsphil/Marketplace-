import React, { useState } from 'react';
import { X, Send, MessageSquare, Check, CheckCheck, Phone, ShieldCheck, Building2, ExternalLink, ArrowLeft } from 'lucide-react';
import { ChatConversation, ChatMessage, MarketplaceItem, UserAccount } from '../types';
import { formatFullNaira } from '../lib/formatters';

interface ChatModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentUser: UserAccount;
  targetItem?: MarketplaceItem | null;
  conversations: ChatConversation[];
  messages: Record<string, ChatMessage[]>;
  onSendMessage: (conversationId: string, text: string, targetListing?: MarketplaceItem) => void;
  onSelectListing?: (item: MarketplaceItem) => void;
}

export const ChatModal: React.FC<ChatModalProps> = ({
  isOpen,
  onClose,
  currentUser,
  targetItem,
  conversations,
  messages,
  onSendMessage,
}) => {
  const [activeConvId, setActiveConvId] = useState<string>(() => {
    if (targetItem) {
      const match = conversations.find((c) => c.listingId === targetItem.id);
      return match ? match.id : 'new';
    }
    return conversations[0]?.id || '';
  });

  const [mobileView, setMobileView] = useState<'threads' | 'messages'>(targetItem ? 'messages' : 'threads');
  const [inputText, setInputText] = useState('');

  if (!isOpen) return null;

  // Find active conversation
  const activeConv = conversations.find((c) => c.id === activeConvId);
  const activeMessages = activeConvId && messages[activeConvId] ? messages[activeConvId] : [];

  const handleSend = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputText.trim()) return;

    onSendMessage(activeConvId, inputText.trim(), targetItem || undefined);
    setInputText('');
  };

  const quickResponses = [
    'Is this property/asset still available for inspection?',
    'What is your bottom price for full upfront cash payment?',
    'Can I schedule a physical viewing this Saturday morning?',
    'Please confirm availability of Governor’s Consent / Customs duty papers.',
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-6 bg-slate-950/80 backdrop-blur-xs">
      <div className="relative w-full max-w-4xl h-[90vh] sm:h-[85vh] bg-white rounded-2xl shadow-2xl border border-slate-200 overflow-hidden flex flex-col md:flex-row">
        {/* Left Sidebar: Conversations list */}
        <div className={`w-full md:w-80 border-b md:border-b-0 md:border-r border-slate-200 bg-slate-50 flex flex-col shrink-0 ${
          mobileView === 'threads' ? 'flex-1 md:flex-initial flex' : 'hidden md:flex'
        }`}>
          <div className="p-3.5 sm:p-4 border-b border-slate-200 flex items-center justify-between bg-white shrink-0">
            <div className="flex items-center gap-2">
              <MessageSquare className="w-5 h-5 text-emerald-600" />
              <h3 className="font-bold text-slate-900 text-sm sm:text-base font-display">
                Trade Inquiries
              </h3>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-xs px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 font-bold">
                {conversations.length}
              </span>
              <button
                onClick={onClose}
                className="md:hidden p-1.5 text-slate-400 hover:text-slate-700 rounded-lg hover:bg-slate-100 transition"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
          </div>

          <div className="flex-1 overflow-y-auto divide-y divide-slate-100">
            {conversations.map((conv) => {
              const isSelected = conv.id === activeConvId;
              return (
                <button
                  key={conv.id}
                  onClick={() => {
                    setActiveConvId(conv.id);
                    setMobileView('messages');
                  }}
                  className={`w-full text-left p-3.5 flex items-start gap-3 transition cursor-pointer ${
                    isSelected ? 'bg-white border-l-4 border-emerald-600 shadow-xs' : 'hover:bg-slate-100/70'
                  }`}
                >
                  <img
                    src={conv.listingImage}
                    alt={conv.listingTitle}
                    className="w-12 h-12 rounded-lg object-cover bg-slate-200 shrink-0 border border-slate-200"
                  />
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between mb-1">
                      <span className="font-bold text-xs text-slate-900 truncate">
                        {conv.sellerName}
                      </span>
                      <span className="text-[10px] text-slate-600 shrink-0">
                        {conv.lastMessageTimestamp}
                      </span>
                    </div>
                    <p className="text-[11px] font-semibold text-emerald-800 truncate mb-0.5">
                      {conv.listingTitle}
                    </p>
                    <p className="text-[11px] text-slate-500 truncate">
                      {conv.lastMessage}
                    </p>
                  </div>
                </button>
              );
            })}

            {conversations.length === 0 && (
              <div className="p-8 text-center text-xs text-slate-600">
                No active messages yet. Contact any seller to start a conversation.
              </div>
            )}
          </div>
        </div>

        {/* Right Section: Active Chat Thread */}
        <div className={`flex-1 flex-col bg-white overflow-hidden ${
          mobileView === 'messages' ? 'flex' : 'hidden md:flex'
        }`}>
          {/* Header */}
          <div className="p-3 sm:p-4 border-b border-slate-200 flex items-center justify-between bg-white shrink-0">
            <div className="flex items-center gap-2 min-w-0">
              <button
                type="button"
                onClick={() => setMobileView('threads')}
                className="md:hidden p-1.5 -ml-1 text-slate-600 hover:text-slate-900 rounded-lg hover:bg-slate-100 transition shrink-0"
                title="Back to conversations"
              >
                <ArrowLeft className="w-5 h-5" />
              </button>
              {activeConv || targetItem ? (
                <div className="flex items-center gap-2.5 min-w-0">
                  <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-full bg-emerald-100 text-emerald-800 font-bold flex items-center justify-center shrink-0 text-xs sm:text-sm">
                    {(activeConv?.sellerName || targetItem?.seller.name || 'Seller')[0]}
                  </div>
                  <div className="min-w-0">
                    <div className="flex items-center gap-1.5">
                      <h4 className="font-bold text-xs sm:text-sm text-slate-900 truncate">
                        {activeConv?.sellerName || targetItem?.seller.name}
                      </h4>
                      <span className="inline-flex items-center gap-0.5 text-[10px] text-emerald-700 bg-emerald-50 px-1.5 py-0.5 rounded-full font-medium shrink-0">
                        <ShieldCheck className="w-3 h-3 text-emerald-600" />
                        Verified
                      </span>
                    </div>
                    <p className="text-[11px] sm:text-xs text-slate-500 truncate">
                      Re: {activeConv?.listingTitle || targetItem?.title} •{' '}
                      <span className="font-bold text-slate-700">
                        {formatFullNaira(activeConv?.listingPrice || targetItem?.price || 0)}
                      </span>
                    </p>
                  </div>
                </div>
              ) : (
                <h4 className="font-bold text-sm text-slate-800">Select an inquiry thread</h4>
              )}
            </div>

            <button
              onClick={onClose}
              className="p-1.5 sm:p-2 text-slate-400 hover:text-slate-700 rounded-lg hover:bg-slate-100 transition cursor-pointer shrink-0 ml-2"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Listing Reference Header Bar */}
          {(activeConv || targetItem) && (
            <div className="bg-slate-50 px-4 py-2 border-b border-slate-200 flex items-center justify-between text-xs text-slate-600 shrink-0">
              <span className="flex items-center gap-1.5 truncate">
                <Building2 className="w-3.5 h-3.5 text-slate-600 shrink-0" />
                <span className="truncate">{activeConv?.listingTitle || targetItem?.title}</span>
              </span>
              <span className="font-bold text-emerald-800 shrink-0">
                {formatFullNaira(activeConv?.listingPrice || targetItem?.price || 0)}
              </span>
            </div>
          )}

          {/* Messages Stream */}
          <div className="flex-1 p-4 overflow-y-auto space-y-3 bg-slate-50/50">
            {activeMessages.length > 0 ? (
              activeMessages.map((msg) => {
                const isMe = msg.senderId === currentUser.id || msg.senderId === 'user-buyer';
                return (
                  <div
                    key={msg.id}
                    className={`flex flex-col ${isMe ? 'items-end' : 'items-start'}`}
                  >
                    <div
                      className={`max-w-[80%] sm:max-w-[70%] p-3 rounded-2xl text-xs leading-relaxed ${
                        isMe
                          ? 'bg-emerald-600 text-white rounded-br-xs shadow-xs'
                          : 'bg-white border border-slate-200 text-slate-800 rounded-bl-xs shadow-xs'
                      }`}
                    >
                      <p>{msg.text}</p>
                    </div>
                    <div className="flex items-center gap-1 mt-1 text-[10px] text-slate-600 px-1">
                      <span>{msg.timestamp}</span>
                      {isMe && (
                        <span>
                          {msg.isRead ? (
                            <CheckCheck className="w-3 h-3 text-emerald-600 inline" />
                          ) : (
                            <Check className="w-3 h-3 text-slate-600 inline" />
                          )}
                        </span>
                      )}
                    </div>
                  </div>
                );
              })
            ) : (
              <div className="h-full flex flex-col items-center justify-center text-center p-6 text-slate-600">
                <MessageSquare className="w-10 h-10 text-slate-300 mb-2" />
                <p className="font-semibold text-slate-700 text-xs">Start a secure inquiry</p>
                <p className="text-[11px] text-slate-500 max-w-sm mt-1">
                  Connect with the verified owner or agent. Inquiries are monitored to protect buyers and sellers under Nigerian commercial guidelines.
                </p>
              </div>
            )}
          </div>

          {/* Quick Trade Templates */}
          <div className="px-3 py-2 bg-white border-t border-slate-100 overflow-x-auto flex items-center gap-1.5 shrink-0">
            <span className="text-[10px] font-semibold text-slate-600 uppercase tracking-wider shrink-0">
              Quick:
            </span>
            {quickResponses.map((qr, idx) => (
              <button
                key={idx}
                onClick={() => setInputText(qr)}
                className="text-[11px] px-2.5 py-1 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-700 transition whitespace-nowrap cursor-pointer"
              >
                {qr}
              </button>
            ))}
          </div>

          {/* Input Form */}
          <form
            onSubmit={handleSend}
            className="p-3 sm:p-4 bg-white border-t border-slate-200 flex items-center gap-2 shrink-0"
          >
            <input
              type="text"
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              placeholder="Type your message to the verified seller..."
              className="flex-1 px-4 py-2.5 rounded-xl border border-slate-200 text-xs focus:outline-none focus:ring-2 focus:ring-emerald-500"
            />
            <button
              type="submit"
              disabled={!inputText.trim()}
              className="py-2.5 px-4 rounded-xl bg-emerald-600 hover:bg-emerald-700 disabled:opacity-50 text-white text-xs font-bold transition flex items-center gap-1.5 cursor-pointer shrink-0"
            >
              <span>Send</span>
              <Send className="w-3.5 h-3.5" />
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};
