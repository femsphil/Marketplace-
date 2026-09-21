import React, { useState, useRef, useEffect } from 'react';
import { 
  Bot, 
  X, 
  Send, 
  Minimize2, 
  RotateCcw, 
  ArrowUpRight,
  HelpCircle,
  ArrowLeft
} from 'lucide-react';
import { MarketplaceVertical, SubscriptionPlan } from '../types';
import { BotActionLink, getLocalAssistantResponse } from '../lib/assistantKnowledge';

interface Message {
  id: string;
  sender: 'user' | 'bot';
  text: string;
  timestamp: string;
  source?: string;
  actionLinks?: BotActionLink[];
}

interface SiteChatBotProps {
  onNavigateVertical: (vertical: MarketplaceVertical | 'dashboard' | 'admin' | 'prd') => void;
  onOpenPostModal: () => void;
  onOpenPricingModal: (plan?: SubscriptionPlan) => void;
}

export const SiteChatBot: React.FC<SiteChatBotProps> = ({
  onNavigateVertical,
  onOpenPostModal,
  onOpenPricingModal,
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [isMinimized, setIsMinimized] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputValue, setInputValue] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  // Prevent background body scroll when full-screen on mobile
  useEffect(() => {
    if (isOpen && !isMinimized) {
      if (window.innerWidth < 640) {
        const originalOverflow = document.body.style.overflow;
        document.body.style.overflow = 'hidden';
        return () => {
          document.body.style.overflow = originalOverflow;
        };
      }
    }
  }, [isOpen, isMinimized]);

  useEffect(() => {
    if (isOpen && !isMinimized) {
      scrollToBottom();
      // On mobile, delay focus to prevent jumpy viewport opening
      const timer = setTimeout(() => {
        if (window.innerWidth >= 640) {
          inputRef.current?.focus();
        }
      }, 150);
      return () => clearTimeout(timer);
    }
  }, [isOpen, isMinimized, messages]);

  const handleSendMessage = async (textToSend?: string) => {
    const query = (textToSend || inputValue).trim();
    if (!query || isLoading) return;

    setInputValue('');

    const userMsg: Message = {
      id: `user-${Date.now()}`,
      sender: 'user',
      text: query,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };

    setMessages((prev) => [...prev, userMsg]);
    setIsLoading(true);

    try {
      // Build small history context
      const historyPayload = messages.slice(-6).map((m) => ({
        role: m.sender === 'user' ? 'user' : 'model',
        content: m.text,
      }));

      // Call full-stack server endpoint
      const response = await fetch('/api/assistant/chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          message: query,
          history: historyPayload,
        }),
      });

      if (response.ok) {
        const data = await response.json();
        const botMsg: Message = {
          id: `bot-${Date.now()}`,
          sender: 'bot',
          text: data.reply || "I'm sorry, I couldn't generate a response. Please try again.",
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
          source: data.source || 'gemini-3.8-flash',
          actionLinks: data.actionLinks,
        };
        setMessages((prev) => [...prev, botMsg]);
      } else {
        // Fallback to local expert engine if endpoint responded with non-200
        const localData = getLocalAssistantResponse(query);
        const botMsg: Message = {
          id: `bot-${Date.now()}`,
          sender: 'bot',
          text: localData.reply,
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
          source: 'knowledge-engine',
          actionLinks: localData.actionLinks,
        };
        setMessages((prev) => [...prev, botMsg]);
      }
    } catch (err) {
      console.warn('Network error reaching assistant endpoint, using local knowledge engine:', err);
      const localData = getLocalAssistantResponse(query);
      const botMsg: Message = {
        id: `bot-${Date.now()}`,
        sender: 'bot',
        text: localData.reply,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        source: 'knowledge-engine',
        actionLinks: localData.actionLinks,
      };
      setMessages((prev) => [...prev, botMsg]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleActionClick = (link: BotActionLink) => {
    if (link.action === 'vertical' && link.target) {
      onNavigateVertical(link.target as any);
      setIsOpen(false);
    } else if (link.action === 'post_listing') {
      onOpenPostModal();
      setIsOpen(false);
    } else if (link.action === 'pricing') {
      onOpenPricingModal();
      setIsOpen(false);
    } else if (link.action === 'dashboard') {
      onNavigateVertical('dashboard');
      setIsOpen(false);
    } else if (link.action === 'business_directory') {
      onNavigateVertical('businesses');
      setIsOpen(false);
    } else if (link.action === 'prd') {
      onNavigateVertical('prd');
      setIsOpen(false);
    }
  };

  const handleResetChat = () => {
    setMessages([]);
  };

  // Render markdown bold and bullet formatting cleanly
  const renderFormattedText = (text: string) => {
    const lines = text.split('\n');
    return (
      <div className="space-y-1.5 text-xs sm:text-[13px] leading-relaxed">
        {lines.map((line, idx) => {
          if (!line.trim()) {
            return <div key={idx} className="h-1" />;
          }

          // Format bold markers **text**
          const parts = line.split(/(\*\*.*?\*\*)/g);
          const renderedLine = parts.map((part, pIdx) => {
            if (part.startsWith('**') && part.endsWith('**')) {
              return (
                <strong key={pIdx} className="font-bold text-slate-900">
                  {part.slice(2, -2)}
                </strong>
              );
            }
            return part;
          });

          if (line.trim().startsWith('• ') || line.trim().startsWith('- ')) {
            return (
              <div key={idx} className="flex items-start gap-1.5 pl-1 text-slate-700">
                <span className="text-amber-600 font-bold leading-none mt-1">•</span>
                <span className="flex-1">{renderedLine}</span>
              </div>
            );
          }

          return (
            <p key={idx} className="text-slate-700">
              {renderedLine}
            </p>
          );
        })}
      </div>
    );
  };

  return (
    <>
      {/* 1. Mobile-Optimized Floating Golden Launcher Button */}
      {!isOpen && (
        <div className="fixed bottom-[4.5rem] sm:bottom-6 right-3 sm:right-6 z-40 sm:z-50 flex items-center">
          <button
            onClick={() => {
              setIsOpen(true);
              setIsMinimized(false);
            }}
            className="flex items-center justify-center gap-2 p-3 sm:px-4 sm:py-3 rounded-full bg-amber-500 hover:bg-amber-400 active:bg-amber-600 text-slate-950 font-bold shadow-xl shadow-amber-950/25 border-2 border-amber-300 transition-all duration-200 active:scale-95 cursor-pointer hover:shadow-2xl hover:shadow-amber-500/30 touch-manipulation min-w-[48px] min-h-[48px]"
            title="Ask a question about the business or site"
            aria-label="Open StrucTrade Assistant"
          >
            <div className="relative flex items-center justify-center">
              <Bot className="w-5 h-5 sm:w-5 sm:h-5 text-slate-950" />
              <span className="absolute -top-1 -right-1 w-2.5 h-2.5 rounded-full bg-amber-200 border-2 border-slate-950" />
            </div>
            <span className="hidden sm:inline font-bold text-xs sm:text-sm font-display tracking-tight text-slate-950">
              Ask Assistant
            </span>
          </button>
        </div>
      )}

      {/* 2. Responsive Golden-Accented Chat Window (Full-screen on Mobile, Floating card on Desktop) */}
      {isOpen && (
        <div
          className={`fixed z-50 flex flex-col bg-white transition-all duration-200 animate-in fade-in zoom-in-95 ${
            isMinimized
              ? 'hidden sm:flex sm:bottom-6 sm:right-6 sm:w-[440px] sm:h-14 sm:rounded-2xl sm:shadow-2xl sm:border-2 sm:border-amber-400/40'
              : 'inset-0 h-[100dvh] w-full sm:inset-auto sm:bottom-6 sm:right-6 sm:w-[440px] sm:h-[560px] sm:max-h-[82vh] sm:rounded-2xl sm:shadow-2xl sm:border-2 sm:border-amber-400/40 overflow-hidden'
          }`}
        >
          {/* Header with Golden Accents & Mobile Touch Targets */}
          <div className="bg-slate-900 text-white px-3.5 sm:px-4 py-3 flex items-center justify-between shrink-0 border-b border-amber-500/30">
            <div className="flex items-center gap-2 sm:gap-2.5 min-w-0">
              {/* Back button on mobile to quickly close */}
              <button
                onClick={() => setIsOpen(false)}
                className="sm:hidden -ml-1 p-2 text-slate-400 hover:text-white active:bg-slate-800 rounded-lg touch-manipulation"
                title="Back to site"
                aria-label="Back"
              >
                <ArrowLeft className="w-5 h-5" />
              </button>

              <div className="w-8 h-8 rounded-xl bg-amber-500/20 text-amber-400 border border-amber-400/40 flex items-center justify-center shrink-0">
                <Bot className="w-4 h-4 text-amber-400" />
              </div>
              <div className="min-w-0">
                <div className="flex items-center gap-1.5">
                  <h3 className="font-bold text-xs sm:text-sm font-display text-white truncate">
                    StrucTrade Assistant
                  </h3>
                  <span className="px-1.5 py-0.5 rounded text-[9px] font-extrabold bg-amber-400/20 text-amber-300 border border-amber-400/30 shrink-0 uppercase tracking-wider">
                    Advisor
                  </span>
                </div>
                <div className="flex items-center gap-1 text-[10px] text-slate-400 truncate">
                  <span className="w-1.5 h-1.5 rounded-full bg-amber-400 inline-block" />
                  <span>Ready to answer your questions</span>
                </div>
              </div>
            </div>

            <div className="flex items-center gap-0.5 sm:gap-1 shrink-0 text-slate-400">
              {messages.length > 0 && (
                <button
                  onClick={handleResetChat}
                  className="p-2 sm:p-1.5 hover:text-amber-300 hover:bg-slate-800 rounded-lg transition touch-manipulation min-w-[36px] min-h-[36px] flex items-center justify-center"
                  title="Clear questions"
                  aria-label="Clear chat"
                >
                  <RotateCcw className="w-4 h-4 sm:w-3.5 sm:h-3.5" />
                </button>
              )}
              <button
                onClick={() => setIsMinimized(!isMinimized)}
                className="hidden sm:flex p-1.5 hover:text-amber-300 hover:bg-slate-800 rounded-lg transition"
                title={isMinimized ? 'Expand' : 'Minimize'}
                aria-label="Minimize chat"
              >
                <Minimize2 className="w-3.5 h-3.5" />
              </button>
              <button
                onClick={() => setIsOpen(false)}
                className="p-2 sm:p-1.5 hover:text-amber-300 hover:bg-slate-800 rounded-lg transition touch-manipulation min-w-[36px] min-h-[36px] flex items-center justify-center"
                title="Close"
                aria-label="Close chat"
              >
                <X className="w-5 h-5 sm:w-4 sm:h-4" />
              </button>
            </div>
          </div>

          {!isMinimized && (
            <>
              {/* Chat Messages Area with Mobile Scrolling */}
              <div 
                className="flex-1 overflow-y-auto p-3.5 sm:p-4 space-y-3.5 bg-slate-50/50 overscroll-contain"
                style={{ WebkitOverflowScrolling: 'touch' }}
              >
                {messages.length === 0 ? (
                  <div className="h-full min-h-[220px] flex flex-col items-center justify-center text-center p-6 text-slate-500">
                    <div className="w-12 h-12 rounded-2xl bg-amber-50 text-amber-600 flex items-center justify-center mb-3 border border-amber-200 shadow-xs">
                      <HelpCircle className="w-6 h-6 text-amber-600" />
                    </div>
                    <h4 className="font-bold text-sm text-slate-800 mb-1 font-display">
                      Ask Any Question
                    </h4>
                    <p className="text-xs sm:text-xs text-slate-500 max-w-xs leading-relaxed">
                      Type your question below about our properties, heavy equipment rentals, vehicles, materials, seller pricing, or verification.
                    </p>
                  </div>
                ) : (
                  messages.map((msg) => (
                    <div
                      key={msg.id}
                      className={`flex flex-col ${
                        msg.sender === 'user' ? 'items-end' : 'items-start'
                      }`}
                    >
                      <div
                        className={`max-w-[92%] sm:max-w-[85%] rounded-2xl p-3 sm:p-3.5 shadow-xs ${
                          msg.sender === 'user'
                            ? 'bg-amber-500 text-slate-950 font-medium rounded-tr-xs border border-amber-400'
                            : 'bg-white text-slate-800 border border-slate-200 rounded-tl-xs'
                        }`}
                      >
                        {msg.sender === 'bot' ? (
                          <div>
                            {renderFormattedText(msg.text)}

                            {/* Optional Action Links with Touch-Friendly Golden Badges */}
                            {msg.actionLinks && msg.actionLinks.length > 0 && (
                              <div className="mt-3 pt-2.5 border-t border-slate-100 flex flex-wrap gap-2">
                                {msg.actionLinks.map((link, lIdx) => (
                                  <button
                                    key={lIdx}
                                    onClick={() => handleActionClick(link)}
                                    className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-amber-50 hover:bg-amber-100 active:bg-amber-200 text-amber-900 border border-amber-300 text-xs font-bold transition cursor-pointer active:scale-95 touch-manipulation min-h-[38px]"
                                  >
                                    <span>{link.label}</span>
                                    <ArrowUpRight className="w-3.5 h-3.5 text-amber-700" />
                                  </button>
                                ))}
                              </div>
                            )}
                          </div>
                        ) : (
                          <p className="text-xs sm:text-[13px] leading-relaxed whitespace-pre-wrap font-medium text-slate-950">
                            {msg.text}
                          </p>
                        )}
                      </div>

                      <div className="flex items-center gap-2 mt-1 px-1 text-[10px] text-slate-400">
                        <span>{msg.timestamp}</span>
                      </div>
                    </div>
                  ))
                )}

                {/* Loading indicator */}
                {isLoading && (
                  <div className="flex items-start gap-2">
                    <div className="bg-white border border-slate-200 rounded-2xl rounded-tl-xs p-3 shadow-xs">
                      <div className="flex items-center gap-1.5 text-xs text-slate-500">
                        <span className="w-2 h-2 rounded-full bg-amber-500 animate-bounce" />
                        <span className="w-2 h-2 rounded-full bg-amber-500 animate-bounce [animation-delay:0.2s]" />
                        <span className="w-2 h-2 rounded-full bg-amber-500 animate-bounce [animation-delay:0.4s]" />
                        <span className="text-[11px] text-slate-400 ml-1">Answering your question...</span>
                      </div>
                    </div>
                  </div>
                )}

                <div ref={messagesEndRef} />
              </div>

              {/* Input Footer with Mobile Keyboard & Safe-Area Padding */}
              <div className="p-3 sm:p-3 bg-white border-t border-slate-200 shrink-0 pb-[max(0.75rem,env(safe-area-inset-bottom))]">
                <form
                  onSubmit={(e) => {
                    e.preventDefault();
                    handleSendMessage();
                  }}
                  className="flex items-center gap-2"
                >
                  <input
                    ref={inputRef}
                    type="text"
                    value={inputValue}
                    onChange={(e) => setInputValue(e.target.value)}
                    placeholder="Type your question here..."
                    className="flex-1 px-3.5 py-2.5 sm:py-2 rounded-xl bg-slate-50 border border-slate-200 focus:bg-white focus:border-amber-500 focus:ring-1 focus:ring-amber-400/50 focus:outline-hidden text-base sm:text-xs text-slate-900 placeholder:text-slate-400 transition min-h-[44px] sm:min-h-[38px]"
                    disabled={isLoading}
                  />
                  <button
                    type="submit"
                    disabled={!inputValue.trim() || isLoading}
                    className="p-3 sm:p-2.5 rounded-xl bg-amber-500 hover:bg-amber-400 active:bg-amber-600 disabled:bg-slate-200 text-slate-950 disabled:text-slate-400 transition cursor-pointer disabled:cursor-not-allowed shrink-0 active:scale-95 shadow-xs font-bold touch-manipulation min-w-[44px] min-h-[44px] flex items-center justify-center"
                    title="Send"
                    aria-label="Send message"
                  >
                    <Send className="w-4 h-4 text-slate-950" />
                  </button>
                </form>
                <div className="flex items-center justify-between mt-2 px-1 text-[10px] text-slate-400">
                  <span>Answers questions about the business & site</span>
                  <span>Press Enter to send</span>
                </div>
              </div>
            </>
          )}
        </div>
      )}
    </>
  );
};
