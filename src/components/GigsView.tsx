import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { Gig, GigCategory } from '../types';
import { 
  Briefcase, 
  Plus, 
  MapPin, 
  Clock, 
  Star, 
  MessageSquare, 
  Bookmark, 
  Search, 
  CheckCircle,
  Users,
  DollarSign
} from 'lucide-react';

export const GigsView: React.FC = () => {
  const { 
    gigs, 
    applyToGig, 
    toggleBookmarkGig, 
    selectedUniversityId, 
    universities,
    setIsCreateModalOpen,
    setCreateModalInitialTab
  } = useApp();

  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [rateFilter, setRateFilter] = useState<'all' | 'hourly' | 'fixed'>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedGigForApply, setSelectedGigForApply] = useState<Gig | null>(null);
  const [applyMessage, setApplyMessage] = useState('');

  const categories = [
    'All',
    'Tutoring & STEM',
    'Dorm Help & Moving',
    'Tech & Coding',
    'Photo & Media',
    'Essay & Proofreading',
    'Errands & Campus Tasks',
  ];

  const filteredGigs = gigs.filter(item => {
    const matchesUni = selectedUniversityId === 'all' || item.universityId === selectedUniversityId;
    if (!matchesUni) return false;

    if (selectedCategory !== 'All' && item.category !== selectedCategory) return false;
    if (rateFilter !== 'all' && item.rateType !== rateFilter) return false;

    if (!searchQuery.trim()) return true;
    const q = searchQuery.toLowerCase();
    return item.title.toLowerCase().includes(q) || 
           item.description.toLowerCase().includes(q) ||
           item.tags.some(t => t.toLowerCase().includes(q));
  });

  const handleOpenApplyModal = (gig: Gig) => {
    setSelectedGigForApply(gig);
    setApplyMessage(`Hi ${gig.posterName}! I'm interested in helping with "${gig.title}". I have relevant experience and am available before ${gig.deadline}.`);
  };

  const handleConfirmApply = () => {
    if (!selectedGigForApply) return;
    applyToGig(selectedGigForApply.id, applyMessage);
    setSelectedGigForApply(null);
  };

  const openPostGig = () => {
    setCreateModalInitialTab('gig');
    setIsCreateModalOpen(true);
  };

  const currentUniName = universities.find(u => u.id === selectedUniversityId)?.name || 'All Campuses';

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-6 pb-24 md:pb-12">
      
      {/* Top Gigs Callout Banner */}
      <div className="bg-gradient-to-r from-emerald-900 to-teal-950 rounded-2xl p-6 sm:p-8 text-white shadow-sm mb-6 flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div className="max-w-xl">
          <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-emerald-300 mb-2">
            <Briefcase className="w-3.5 h-3.5" />
            <span>Campus Bounties · Student Freelance</span>
            <span aria-hidden="true">·</span>
            <span>{currentUniName}</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-white mb-2">
            Earn cash helping peers or hire student talent.
          </h1>
          <p className="text-sm text-emerald-100/90 leading-relaxed">
            Need a tutor before midterms, muscle for moving a sofa, or a coder to fix a bug? Find fellow students with verified skills.
          </p>
        </div>

        <div>
          <button
            onClick={openPostGig}
            className="px-5 py-2.5 bg-emerald-500 hover:bg-emerald-400 active:scale-95 text-slate-950 font-bold text-sm rounded-xl transition-all shadow-sm flex items-center gap-2 cursor-pointer whitespace-nowrap"
          >
            <Plus className="w-4 h-4 text-slate-950" />
            <span>Post a Campus Gig</span>
          </button>
        </div>
      </div>

      {/* Search and Filters */}
      <div className="space-y-4 mb-6">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-3">
          {/* Search bar */}
          <div className="relative w-full sm:max-w-md">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
            <input
              type="text"
              placeholder="Search gigs (e.g. calculus tutor, moving, python, photography)..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 text-xs sm:text-sm bg-white border border-slate-200/80 rounded-xl text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition-all shadow-xs"
            />
          </div>

          {/* Rate type toggle buttons */}
          <div className="flex items-center gap-1 p-1 bg-white border border-slate-200/80 rounded-xl shadow-xs">
            <button
              onClick={() => setRateFilter('all')}
              className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-colors ${
                rateFilter === 'all' ? 'bg-slate-900 text-white' : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              All Rates
            </button>
            <button
              onClick={() => setRateFilter('hourly')}
              className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-colors ${
                rateFilter === 'hourly' ? 'bg-slate-900 text-white' : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Hourly Rate
            </button>
            <button
              onClick={() => setRateFilter('fixed')}
              className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-colors ${
                rateFilter === 'fixed' ? 'bg-slate-900 text-white' : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Fixed Bounty
            </button>
          </div>
        </div>

        {/* Categories Bar */}
        <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none">
          {categories.map(cat => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-3.5 py-1.5 text-xs font-semibold rounded-lg whitespace-nowrap transition-colors cursor-pointer ${
                selectedCategory === cat
                  ? 'bg-emerald-700 text-white shadow-xs'
                  : 'bg-white text-slate-600 hover:text-slate-900 hover:bg-slate-100 border border-slate-200/80'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* Gigs List */}
      {filteredGigs.length === 0 ? (
        <div className="bg-white rounded-2xl border border-slate-200/80 p-12 text-center max-w-lg mx-auto">
          <Briefcase className="w-10 h-10 text-slate-300 mx-auto mb-3" />
          <h3 className="text-base font-semibold text-slate-800 mb-1">No student gigs found</h3>
          <p className="text-xs text-slate-500 mb-5">
            No active student gigs in this category. Be the first to post a task or offer assistance!
          </p>
          <button
            onClick={openPostGig}
            className="px-4 py-2 bg-emerald-600 text-white text-xs font-semibold rounded-xl hover:bg-emerald-700 transition-colors"
          >
            Post a Gig
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {filteredGigs.map((gig) => {
            const uni = universities.find(u => u.id === gig.universityId);

            return (
              <div
                key={gig.id}
                className="bg-white rounded-2xl border border-slate-200/80 p-5 hover:shadow-md hover:border-slate-300 transition-all flex flex-col justify-between"
              >
                <div>
                  {/* Top unboxed metadata */}
                  <div className="flex items-center justify-between gap-2 mb-2">
                    <div className="flex items-center gap-1.5 text-[11px] text-slate-500 truncate">
                      <span className="font-semibold text-emerald-700">{gig.category}</span>
                      <span aria-hidden="true">·</span>
                      <span>{uni?.shortName || 'Campus'}</span>
                      <span aria-hidden="true">·</span>
                      <span>{gig.createdAt}</span>
                    </div>

                    {/* Bookmark */}
                    <button
                      onClick={() => toggleBookmarkGig(gig.id)}
                      className="p-1 rounded-lg hover:bg-slate-100 text-slate-400 hover:text-amber-500 transition-colors"
                    >
                      <Bookmark className={`w-4 h-4 ${gig.isBookmarked ? 'fill-amber-500 text-amber-500' : ''}`} />
                    </button>
                  </div>

                  {/* Title and Rate Header */}
                  <div className="flex items-start justify-between gap-3 mb-2.5">
                    <h3 className="text-base font-bold text-slate-900 leading-snug">
                      {gig.title}
                    </h3>
                    <div className="shrink-0 bg-emerald-50 text-emerald-800 border border-emerald-200/60 font-black text-sm px-2.5 py-1 rounded-lg tabular-nums">
                      {gig.rateType === 'hourly' ? `$${gig.rate}/hr` : `$${gig.rate}`}
                    </div>
                  </div>

                  {/* Description */}
                  <p className="text-xs sm:text-sm text-slate-600 leading-relaxed mb-4 line-clamp-3">
                    {gig.description}
                  </p>

                  {/* Meta items: Location, Deadline, Applicants */}
                  <div className="grid grid-cols-2 gap-2 text-xs text-slate-500 mb-4 bg-slate-50 p-2.5 rounded-xl">
                    <div className="flex items-center gap-1.5 truncate">
                      <MapPin className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                      <span className="truncate">{gig.location}</span>
                    </div>
                    <div className="flex items-center gap-1.5 truncate">
                      <Clock className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                      <span className="truncate">Due: {gig.deadline}</span>
                    </div>
                  </div>

                  {/* Tags */}
                  <div className="flex flex-wrap gap-1.5 mb-4">
                    {gig.tags.map((tag, idx) => (
                      <span key={idx} className="text-[11px] font-medium text-slate-600 bg-slate-100 px-2 py-0.5 rounded-md">
                        #{tag}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Footer: Poster Info & Apply CTA */}
                <div className="pt-3 border-t border-slate-100 flex items-center justify-between gap-3">
                  <div className="flex items-center gap-2 min-w-0">
                    <img
                      src={gig.posterAvatar}
                      alt={gig.posterName}
                      referrerPolicy="no-referrer"
                      className="w-7 h-7 rounded-full object-cover shrink-0 border border-slate-200"
                    />
                    <div className="min-w-0 truncate">
                      <p className="text-xs font-bold text-slate-800 truncate">{gig.posterName}</p>
                      <div className="flex items-center gap-1 text-[10px] text-slate-500">
                        <Users className="w-2.5 h-2.5 text-slate-400" />
                        <span>{gig.applicantsCount} student applicants</span>
                      </div>
                    </div>
                  </div>

                  <button
                    onClick={() => handleOpenApplyModal(gig)}
                    className={`px-3.5 py-1.5 text-xs font-bold rounded-lg transition-colors flex items-center gap-1.5 cursor-pointer whitespace-nowrap ${
                      gig.isApplied
                        ? 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                        : 'bg-emerald-600 hover:bg-emerald-700 text-white shadow-xs'
                    }`}
                  >
                    {gig.isApplied ? (
                      <>
                        <CheckCircle className="w-3.5 h-3.5 text-emerald-600" />
                        <span>Applied</span>
                      </>
                    ) : (
                      <>
                        <MessageSquare className="w-3.5 h-3.5" />
                        <span>Apply / Chat</span>
                      </>
                    )}
                  </button>
                </div>

              </div>
            );
          })}
        </div>
      )}

      {/* Apply to Gig Modal */}
      {selectedGigForApply && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-lg w-full p-6 shadow-2xl relative">
            <button
              onClick={() => setSelectedGigForApply(null)}
              className="absolute top-4 right-4 text-slate-400 hover:text-slate-700 font-bold p-2"
            >
              ✕
            </button>

            <div className="mb-4">
              <span className="text-[11px] font-bold uppercase tracking-wider text-emerald-700">Apply for Student Gig</span>
              <h2 className="text-lg font-bold text-slate-900 mt-1">{selectedGigForApply.title}</h2>
              <p className="text-xs text-slate-500 mt-1">
                Offered by {selectedGigForApply.posterName} · Rate: <strong>{selectedGigForApply.rateType === 'hourly' ? `$${selectedGigForApply.rate}/hr` : `$${selectedGigForApply.rate} fixed`}</strong>
              </p>
            </div>

            <div className="mb-4">
              <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                Your Note / Pitch to {selectedGigForApply.posterName}:
              </label>
              <textarea
                rows={4}
                value={applyMessage}
                onChange={(e) => setApplyMessage(e.target.value)}
                placeholder="Describe your availability, qualifications, or how quickly you can complete this..."
                className="w-full text-xs sm:text-sm bg-slate-50 border border-slate-200 rounded-xl p-3 text-slate-800 focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 focus:outline-none"
              />
            </div>

            <div className="flex items-center justify-end gap-3 pt-3 border-t border-slate-100">
              <button
                onClick={() => setSelectedGigForApply(null)}
                className="px-4 py-2 text-xs font-semibold text-slate-600 hover:bg-slate-100 rounded-xl"
              >
                Cancel
              </button>
              <button
                onClick={handleConfirmApply}
                disabled={!applyMessage.trim()}
                className="px-5 py-2.5 bg-emerald-600 hover:bg-emerald-700 disabled:bg-slate-300 text-white font-semibold text-xs rounded-xl flex items-center gap-1.5 shadow-sm"
              >
                <MessageSquare className="w-3.5 h-3.5" />
                <span>Submit Application & Open Chat</span>
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};
