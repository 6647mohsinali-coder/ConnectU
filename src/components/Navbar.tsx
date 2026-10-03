import React from 'react';
import { useApp } from '../context/AppContext';
import { 
  MessageSquare, 
  ShoppingBag, 
  Briefcase, 
  Flame, 
  Plus, 
  GraduationCap
} from 'lucide-react';

export const Navbar: React.FC = () => {
  const { 
    activeTab, 
    setActiveTab, 
    conversations, 
    setIsCreateModalOpen,
    setIsProfileDrawerOpen,
    currentUser,
    selectedUniversityId,
    setSelectedUniversityId,
    universities
  } = useApp();

  const totalUnread = conversations.reduce((acc, c) => acc + (c.unreadCount || 0), 0);

  const currentUni = universities.find(u => u.id === selectedUniversityId) || universities[0];

  return (
    <header className="sticky top-0 z-40 w-full bg-white/95 backdrop-blur-md border-b border-slate-200/80 transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-4">
        
        {/* Zone 1: Single text element wordmark */}
        <button 
          onClick={() => setActiveTab('confessions')}
          className="text-left group cursor-pointer focus:outline-none"
        >
          <span className="text-xl sm:text-2xl font-black tracking-tight text-slate-900 group-hover:text-blue-600 transition-colors">
            Connect<span className="text-blue-600">U</span>
          </span>
        </button>

        {/* Zone 2: 4 clean text navigation links */}
        <nav className="hidden md:flex items-center gap-1 lg:gap-2">
          <button
            onClick={() => setActiveTab('confessions')}
            className={`flex items-center gap-2 px-3 py-2 text-sm font-semibold rounded-lg transition-colors whitespace-nowrap ${
              activeTab === 'confessions'
                ? 'text-blue-600 bg-blue-50/70'
                : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100/60'
            }`}
          >
            <Flame className="w-4 h-4" />
            <span>Confessions</span>
          </button>

          <button
            onClick={() => setActiveTab('chat')}
            className={`relative flex items-center gap-2 px-3 py-2 text-sm font-semibold rounded-lg transition-colors whitespace-nowrap ${
              activeTab === 'chat'
                ? 'text-blue-600 bg-blue-50/70'
                : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100/60'
            }`}
          >
            <MessageSquare className="w-4 h-4" />
            <span>Campus Chat</span>
            {totalUnread > 0 && (
              <span className="inline-flex items-center justify-center px-1.5 py-0.5 text-xs font-bold text-white bg-blue-600 rounded-full">
                {totalUnread}
              </span>
            )}
          </button>

          <button
            onClick={() => setActiveTab('marketplace')}
            className={`flex items-center gap-2 px-3 py-2 text-sm font-semibold rounded-lg transition-colors whitespace-nowrap ${
              activeTab === 'marketplace'
                ? 'text-blue-600 bg-blue-50/70'
                : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100/60'
            }`}
          >
            <ShoppingBag className="w-4 h-4" />
            <span>Marketplace</span>
          </button>

          <button
            onClick={() => setActiveTab('gigs')}
            className={`flex items-center gap-2 px-3 py-2 text-sm font-semibold rounded-lg transition-colors whitespace-nowrap ${
              activeTab === 'gigs'
                ? 'text-blue-600 bg-blue-50/70'
                : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100/60'
            }`}
          >
            <Briefcase className="w-4 h-4" />
            <span>Student Gigs</span>
          </button>
        </nav>

        {/* Zone 3: Primary actions & Campus Selector */}
        <div className="flex items-center gap-2 sm:gap-3">
          {/* University selector dropdown */}
          <div className="relative">
            <select
              value={selectedUniversityId}
              onChange={(e) => setSelectedUniversityId(e.target.value)}
              aria-label="Select Campus Hub"
              className="text-xs font-medium bg-slate-100 hover:bg-slate-200/80 text-slate-700 py-1.5 px-2.5 rounded-lg border-none focus:ring-2 focus:ring-blue-500 cursor-pointer transition-colors max-w-[130px] sm:max-w-[170px] truncate"
            >
              {universities.map(u => (
                <option key={u.id} value={u.id}>
                  {u.shortName}
                </option>
              ))}
            </select>
          </div>

          {/* "+ Post / List" Button */}
          <button
            onClick={() => setIsCreateModalOpen(true)}
            className="flex items-center gap-1.5 px-3 py-1.5 text-xs sm:text-sm font-semibold text-white bg-slate-900 hover:bg-slate-800 active:scale-95 rounded-lg transition-all shadow-sm whitespace-nowrap"
          >
            <Plus className="w-4 h-4" />
            <span className="hidden sm:inline">Post / List</span>
            <span className="sm:hidden">Post</span>
          </button>

          {/* Student Profile trigger */}
          <button
            onClick={() => setIsProfileDrawerOpen(true)}
            className="flex items-center gap-2 p-1 rounded-full hover:ring-2 hover:ring-blue-500/40 transition-all focus:outline-none"
            title="Student Profile & Settings"
          >
            <img
              src={currentUser.avatar}
              alt={currentUser.name}
              referrerPolicy="no-referrer"
              className="w-8 h-8 rounded-full object-cover border border-slate-200"
            />
          </button>
        </div>

      </div>

      {/* Mobile Bottom Bar for touch devices */}
      <div className="md:hidden fixed bottom-0 left-0 right-0 z-40 bg-white/95 backdrop-blur-md border-t border-slate-200 grid grid-cols-4 items-center h-16 px-1">
        <button
          onClick={() => setActiveTab('confessions')}
          className={`flex flex-col items-center justify-center h-full transition-colors ${
            activeTab === 'confessions' ? 'text-blue-600' : 'text-slate-500'
          }`}
        >
          <Flame className="w-5 h-5" />
          <span className="text-[11px] font-medium mt-1">Confess</span>
        </button>

        <button
          onClick={() => setActiveTab('chat')}
          className={`relative flex flex-col items-center justify-center h-full transition-colors ${
            activeTab === 'chat' ? 'text-blue-600' : 'text-slate-500'
          }`}
        >
          <MessageSquare className="w-5 h-5" />
          <span className="text-[11px] font-medium mt-1">Chat</span>
          {totalUnread > 0 && (
            <span className="absolute top-2 right-6 w-2 h-2 bg-blue-600 rounded-full" />
          )}
        </button>

        <button
          onClick={() => setActiveTab('marketplace')}
          className={`flex flex-col items-center justify-center h-full transition-colors ${
            activeTab === 'marketplace' ? 'text-blue-600' : 'text-slate-500'
          }`}
        >
          <ShoppingBag className="w-5 h-5" />
          <span className="text-[11px] font-medium mt-1">Shop</span>
        </button>

        <button
          onClick={() => setActiveTab('gigs')}
          className={`flex flex-col items-center justify-center h-full transition-colors ${
            activeTab === 'gigs' ? 'text-blue-600' : 'text-slate-500'
          }`}
        >
          <Briefcase className="w-5 h-5" />
          <span className="text-[11px] font-medium mt-1">Gigs</span>
        </button>
      </div>
    </header>
  );
};
