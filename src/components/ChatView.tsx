import React, { useState, useRef, useEffect } from 'react';
import { useApp } from '../context/AppContext';
import { 
  Send, 
  Search, 
  Hash, 
  CheckCheck, 
  ArrowLeft, 
  Tag, 
  Clock, 
  Sparkles,
  Users,
  Info
} from 'lucide-react';

export const ChatView: React.FC = () => {
  const { 
    conversations, 
    activeConversationId, 
    setActiveConversationId, 
    sendMessage,
    currentUser,
    setActiveTab
  } = useApp();

  const [inputText, setInputText] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [filterType, setFilterType] = useState<'all' | 'direct' | 'channel'>('all');
  const [showMobileList, setShowMobileList] = useState(!activeConversationId);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const activeConv = conversations.find(c => c.id === activeConversationId) || conversations[0];

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [activeConv?.messages]);

  const handleSend = () => {
    if (!inputText.trim() || !activeConv) return;
    sendMessage(activeConv.id, inputText);
    setInputText('');
  };

  const handleQuickPrompt = (prompt: string) => {
    if (!activeConv) return;
    sendMessage(activeConv.id, prompt);
  };

  const filteredConversations = conversations.filter(c => {
    if (filterType === 'direct' && c.type !== 'direct') return false;
    if (filterType === 'channel' && c.type !== 'channel') return false;
    if (!searchQuery.trim()) return true;
    return c.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
           c.lastMessage.toLowerCase().includes(searchQuery.toLowerCase());
  });

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-4 pb-20 md:pb-6 h-[calc(100vh-5rem)]">
      <div className="bg-white rounded-2xl border border-slate-200/80 shadow-xs h-full flex overflow-hidden">
        
        {/* Left Sidebar: Conversations & Channels List */}
        <aside className={`w-full md:w-80 lg:w-96 border-r border-slate-200/80 flex flex-col shrink-0 bg-slate-50/50 ${
          !showMobileList && activeConversationId ? 'hidden md:flex' : 'flex'
        }`}>
          
          {/* Search & Channel Tabs */}
          <div className="p-4 border-b border-slate-200/80 bg-white">
            <h2 className="text-lg font-bold text-slate-900 mb-3">Campus Messages</h2>
            
            {/* Search Input */}
            <div className="relative mb-3">
              <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
              <input
                type="text"
                placeholder="Search chats, students, topics..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-9 pr-3 py-1.5 text-xs bg-slate-100 rounded-lg border-none text-slate-800 placeholder-slate-400 focus:ring-2 focus:ring-blue-500/20 focus:bg-white transition-all"
              />
            </div>

            {/* Filter segmented buttons */}
            <div className="flex items-center gap-1 p-1 bg-slate-100 rounded-lg">
              <button
                onClick={() => setFilterType('all')}
                className={`flex-1 py-1 text-xs font-semibold rounded-md transition-colors ${
                  filterType === 'all' ? 'bg-white text-slate-900 shadow-xs' : 'text-slate-500 hover:text-slate-800'
                }`}
              >
                All
              </button>
              <button
                onClick={() => setFilterType('direct')}
                className={`flex-1 py-1 text-xs font-semibold rounded-md transition-colors ${
                  filterType === 'direct' ? 'bg-white text-slate-900 shadow-xs' : 'text-slate-500 hover:text-slate-800'
                }`}
              >
                Direct DMs
              </button>
              <button
                onClick={() => setFilterType('channel')}
                className={`flex-1 py-1 text-xs font-semibold rounded-md transition-colors ${
                  filterType === 'channel' ? 'bg-white text-slate-900 shadow-xs' : 'text-slate-500 hover:text-slate-800'
                }`}
              >
                Lounges
              </button>
            </div>
          </div>

          {/* Conversations Scrollable List */}
          <div className="flex-1 overflow-y-auto divide-y divide-slate-100">
            {filteredConversations.length === 0 ? (
              <div className="p-8 text-center text-xs text-slate-400">
                No conversations match your search.
              </div>
            ) : (
              filteredConversations.map(conv => {
                const isSelected = activeConv?.id === conv.id;

                return (
                  <button
                    key={conv.id}
                    onClick={() => {
                      setActiveConversationId(conv.id);
                      setShowMobileList(false);
                    }}
                    className={`w-full text-left p-3.5 flex items-start gap-3 transition-colors ${
                      isSelected ? 'bg-blue-50/80 border-l-3 border-blue-600' : 'hover:bg-slate-100/60'
                    }`}
                  >
                    {/* Avatar or Channel Icon */}
                    <div className="relative shrink-0">
                      {conv.type === 'channel' ? (
                        <div className="w-10 h-10 rounded-xl bg-blue-100 text-blue-700 flex items-center justify-center font-bold text-sm">
                          <Hash className="w-5 h-5" />
                        </div>
                      ) : (
                        <div className="relative">
                          <img
                            src={conv.avatar}
                            alt={conv.title}
                            referrerPolicy="no-referrer"
                            className="w-10 h-10 rounded-full object-cover border border-slate-200"
                          />
                          {conv.online && (
                            <span className="absolute bottom-0 right-0 w-2.5 h-2.5 bg-emerald-500 border-2 border-white rounded-full" />
                          )}
                        </div>
                      )}
                    </div>

                    {/* Meta & Last Message */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between gap-1 mb-0.5">
                        <span className="font-semibold text-xs text-slate-900 truncate">
                          {conv.title}
                        </span>
                        <span className="text-[11px] text-slate-400 shrink-0 tabular-nums">
                          {conv.lastMessageTime}
                        </span>
                      </div>

                      <p className="text-xs text-slate-500 truncate leading-relaxed">
                        {conv.lastMessage}
                      </p>

                      {conv.subtitle && conv.type === 'direct' && (
                        <p className="text-[11px] text-blue-600 truncate mt-0.5 font-medium">
                          {conv.subtitle}
                        </p>
                      )}
                    </div>

                    {conv.unreadCount > 0 && (
                      <span className="inline-flex items-center justify-center w-4 h-4 text-[10px] font-bold text-white bg-blue-600 rounded-full shrink-0 mt-1">
                        {conv.unreadCount}
                      </span>
                    )}
                  </button>
                );
              })
            )}
          </div>

        </aside>

        {/* Right Active Chat Pane */}
        {activeConv ? (
          <main className={`flex-1 flex flex-col bg-white ${
            showMobileList ? 'hidden md:flex' : 'flex'
          }`}>
            
            {/* Chat Header */}
            <div className="px-4 sm:px-6 py-3 border-b border-slate-200/80 flex items-center justify-between gap-3 bg-white">
              <div className="flex items-center gap-3 min-w-0">
                <button
                  onClick={() => setShowMobileList(true)}
                  className="md:hidden p-1.5 rounded-lg hover:bg-slate-100 text-slate-600 -ml-1"
                  aria-label="Back to chat list"
                >
                  <ArrowLeft className="w-5 h-5" />
                </button>

                <div className="relative shrink-0">
                  {activeConv.type === 'channel' ? (
                    <div className="w-10 h-10 rounded-xl bg-blue-100 text-blue-700 flex items-center justify-center font-bold">
                      <Hash className="w-5 h-5" />
                    </div>
                  ) : (
                    <div className="relative">
                      <img
                        src={activeConv.avatar}
                        alt={activeConv.title}
                        referrerPolicy="no-referrer"
                        className="w-10 h-10 rounded-full object-cover border border-slate-200"
                      />
                      {activeConv.online && (
                        <span className="absolute bottom-0 right-0 w-2.5 h-2.5 bg-emerald-500 border-2 border-white rounded-full" />
                      )}
                    </div>
                  )}
                </div>

                <div className="min-w-0">
                  <div className="flex items-center gap-2">
                    <h3 className="text-sm font-bold text-slate-900 truncate">
                      {activeConv.title}
                    </h3>
                    {activeConv.type === 'direct' && activeConv.online && (
                      <span className="text-[11px] text-emerald-600 font-medium">· Active now</span>
                    )}
                  </div>
                  <p className="text-xs text-slate-500 truncate">
                    {activeConv.subtitle}
                  </p>
                </div>
              </div>

              {/* Chat action shortcuts */}
              <div className="flex items-center gap-2">
                {activeConv.type === 'channel' ? (
                  <div className="hidden sm:flex items-center gap-1.5 text-xs text-slate-500 bg-slate-50 px-2.5 py-1 rounded-lg border border-slate-200/60">
                    <Users className="w-3.5 h-3.5" />
                    <span>Campus Open Channel</span>
                  </div>
                ) : (
                  <div className="hidden sm:flex items-center gap-1.5 text-xs text-slate-600 bg-slate-50 px-2.5 py-1 rounded-lg border border-slate-200/60">
                    <span>Verified Student DM</span>
                  </div>
                )}
              </div>
            </div>

            {/* Context Header Card (if chatting about a product or gig) */}
            {activeConv.messages.some(m => m.contextItem) && (
              <div className="bg-blue-50/70 border-b border-blue-100 px-4 sm:px-6 py-2.5 flex items-center justify-between gap-3 text-xs">
                <div className="flex items-center gap-2 min-w-0">
                  <Tag className="w-3.5 h-3.5 text-blue-600 shrink-0" />
                  <span className="font-semibold text-blue-950 truncate">
                    {activeConv.messages.find(m => m.contextItem)?.contextItem?.title}
                  </span>
                  <span aria-hidden="true" className="text-blue-300">·</span>
                  <span className="text-blue-700 font-bold">
                    {activeConv.messages.find(m => m.contextItem)?.contextItem?.priceOrRate}
                  </span>
                </div>
                <button
                  onClick={() => setActiveTab(activeConv.messages.find(m => m.contextItem)?.contextItem?.type === 'product' ? 'marketplace' : 'gigs')}
                  className="text-blue-600 hover:text-blue-800 font-semibold whitespace-nowrap text-[11px]"
                >
                  View Details
                </button>
              </div>
            )}

            {/* Messages Scroll Area */}
            <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-4 bg-slate-50/30">
              {activeConv.messages.map((msg) => {
                return (
                  <div
                    key={msg.id}
                    className={`flex items-end gap-2.5 ${msg.isMe ? 'justify-end' : 'justify-start'}`}
                  >
                    {!msg.isMe && (
                      <img
                        src={msg.senderAvatar || activeConv.avatar}
                        alt={msg.senderName}
                        referrerPolicy="no-referrer"
                        className="w-7 h-7 rounded-full object-cover shrink-0 mb-1"
                      />
                    )}

                    <div className={`max-w-[85%] sm:max-w-[70%] space-y-1 ${msg.isMe ? 'items-end' : 'items-start'}`}>
                      {!msg.isMe && activeConv.type === 'channel' && (
                        <p className="text-[11px] font-semibold text-slate-600 px-1">
                          {msg.senderName}
                        </p>
                      )}

                      {/* Attached Product or Gig Reference */}
                      {msg.contextItem && (
                        <div className="bg-slate-100/90 border border-slate-200 rounded-xl p-2.5 mb-1.5 text-xs text-slate-800 shadow-2xs">
                          <span className="text-[10px] font-bold uppercase tracking-wider text-slate-500">
                            Referenced {msg.contextItem.type}
                          </span>
                          <p className="font-semibold text-slate-900">{msg.contextItem.title}</p>
                          <p className="text-blue-600 font-bold">{msg.contextItem.priceOrRate}</p>
                        </div>
                      )}

                      {/* Message Bubble */}
                      <div
                        className={`p-3.5 rounded-2xl text-xs sm:text-sm leading-relaxed ${
                          msg.isMe
                            ? 'bg-blue-600 text-white rounded-br-xs shadow-xs'
                            : 'bg-white border border-slate-200/80 text-slate-800 rounded-bl-xs shadow-xs'
                        }`}
                      >
                        {msg.content}
                      </div>

                      {/* Timestamp & Read indicator */}
                      <div className={`flex items-center gap-1 text-[10px] text-slate-400 px-1 ${msg.isMe ? 'justify-end' : 'justify-start'}`}>
                        <span>{msg.timestamp}</span>
                        {msg.isMe && <CheckCheck className="w-3 h-3 text-blue-500" />}
                      </div>
                    </div>
                  </div>
                );
              })}
              <div ref={messagesEndRef} />
            </div>

            {/* Quick Action Chips */}
            <div className="px-4 py-2 bg-white border-t border-slate-100 flex items-center gap-2 overflow-x-auto scrollbar-none">
              <span className="text-[11px] font-medium text-slate-400 shrink-0">Quick:</span>
              <button
                onClick={() => handleQuickPrompt("Is this still available to pick up today?")}
                className="text-xs px-2.5 py-1 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg whitespace-nowrap transition-colors"
              >
                Still available?
              </button>
              <button
                onClick={() => handleQuickPrompt("Can we meet outside the Student Union?")}
                className="text-xs px-2.5 py-1 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg whitespace-nowrap transition-colors"
              >
                Meet at Student Union?
              </button>
              <button
                onClick={() => handleQuickPrompt("I'm available to help with this gig!")}
                className="text-xs px-2.5 py-1 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg whitespace-nowrap transition-colors"
              >
                I can take this gig
              </button>
              <button
                onClick={() => handleQuickPrompt("Would you take $5 less for quick cash?")}
                className="text-xs px-2.5 py-1 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg whitespace-nowrap transition-colors"
              >
                Make lower offer
              </button>
            </div>

            {/* Message Input Bar */}
            <div className="p-3 sm:p-4 bg-white border-t border-slate-200/80">
              <div className="flex items-center gap-2">
                <input
                  type="text"
                  placeholder={`Message ${activeConv.title}...`}
                  value={inputText}
                  onChange={(e) => setInputText(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && handleSend()}
                  className="flex-1 bg-slate-100 border-none rounded-xl px-4 py-2.5 text-xs sm:text-sm text-slate-800 placeholder-slate-400 focus:ring-2 focus:ring-blue-500/20 focus:bg-white transition-all"
                />

                <button
                  onClick={handleSend}
                  disabled={!inputText.trim()}
                  className="p-2.5 sm:px-4 sm:py-2.5 bg-blue-600 disabled:bg-slate-200 text-white rounded-xl hover:bg-blue-700 disabled:text-slate-400 font-semibold text-xs sm:text-sm transition-colors flex items-center gap-1.5 cursor-pointer"
                >
                  <Send className="w-4 h-4" />
                  <span className="hidden sm:inline">Send</span>
                </button>
              </div>
            </div>

          </main>
        ) : (
          <div className="flex-1 flex flex-col items-center justify-center p-8 text-center text-slate-400">
            <Info className="w-10 h-10 mb-2 text-slate-300" />
            <p className="text-sm font-semibold text-slate-600">Select a conversation or campus lounge</p>
            <p className="text-xs">Chat with sellers, gig posters, or your campus community.</p>
          </div>
        )}

      </div>
    </div>
  );
};
