import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { Confession, ConfessionReaction } from '../types';
import { 
  Flame, 
  MessageCircle, 
  Bookmark, 
  Share2, 
  Send, 
  ShieldCheck, 
  Sparkles,
  Lock,
  ChevronDown,
  Check
} from 'lucide-react';

export const ConfessionsView: React.FC = () => {
  const { 
    confessions, 
    toggleConfessionReaction, 
    addConfessionComment, 
    toggleBookmarkConfession, 
    selectedUniversityId, 
    universities,
    setIsCreateModalOpen,
    setCreateModalInitialTab
  } = useApp();

  const [filterTag, setFilterTag] = useState<string>('All');
  const [expandedComments, setExpandedComments] = useState<Record<string, boolean>>({});
  const [commentInputs, setCommentInputs] = useState<Record<string, string>>({});
  const [copiedId, setCopiedId] = useState<string | null>(null);

  const tags = ['All', 'Hot 🔥', 'Crushes 💌', 'Dorm Tales 💀', 'Exams 📚', 'Professors ☕', 'Career 💼'];

  // Filter confessions by university & tag
  const filteredConfessions = confessions.filter(item => {
    const matchesUni = selectedUniversityId === 'all' || item.universityId === selectedUniversityId;
    if (!matchesUni) return false;

    if (filterTag === 'All') return true;
    if (filterTag === 'Hot 🔥') {
      const totalReactions = (item.reactions.fire || 0) + (item.reactions.skull || 0) + (item.reactions.heart || 0);
      return totalReactions > 50;
    }
    if (filterTag.startsWith(item.tag)) return true;
    return false;
  });

  const handleToggleComments = (id: string) => {
    setExpandedComments(prev => ({ ...prev, [id]: !prev[id] }));
  };

  const handleSendComment = (confessionId: string) => {
    const text = commentInputs[confessionId]?.trim();
    if (!text) return;
    
    // Generate fun anonymous persona
    const randomAliases = ['LibraryLurker', 'CaffeineStudent', 'Floor3Resident', 'StudyGhost', 'DormNeighbor'];
    const alias = randomAliases[Math.floor(Math.random() * randomAliases.length)] + ' #' + Math.floor(10 + Math.random() * 90);
    
    addConfessionComment(confessionId, text, alias);
    setCommentInputs(prev => ({ ...prev, [confessionId]: '' }));
  };

  const handleShare = (id: string) => {
    setCopiedId(id);
    navigator.clipboard?.writeText?.(window.location.href);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const openComposer = () => {
    setCreateModalInitialTab('confession');
    setIsCreateModalOpen(true);
  };

  const currentUniName = universities.find(u => u.id === selectedUniversityId)?.name || 'All Campuses';

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 py-6 pb-24 md:pb-12">
      
      {/* Top Banner / Callout for Campus Confessions */}
      <div className="bg-gradient-to-r from-blue-900 to-indigo-900 rounded-2xl p-6 sm:p-8 text-white shadow-sm mb-6 relative overflow-hidden">
        <div className="relative z-10 max-w-2xl">
          <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-blue-200 mb-2">
            <Lock className="w-3.5 h-3.5" />
            <span>100% Anonymous · Campus Whispers</span>
            <span aria-hidden="true">·</span>
            <span>{currentUniName}</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-white mb-2">
            Speak your mind without a name.
          </h1>
          <p className="text-sm sm:text-base text-blue-100/90 leading-relaxed mb-5">
            Share dorm stories, secret campus crushes, exam survival rants, and unspoken truths. No account reveals. No judgment.
          </p>
          <div className="flex flex-wrap items-center gap-3">
            <button
              onClick={openComposer}
              className="px-4 py-2.5 bg-white text-blue-900 hover:bg-blue-50 active:scale-95 font-semibold text-sm rounded-xl transition-all shadow-sm flex items-center gap-2 cursor-pointer"
            >
              <Sparkles className="w-4 h-4 text-blue-600" />
              <span>Drop a Confession</span>
            </button>
            <div className="flex items-center gap-2 text-xs text-blue-200">
              <ShieldCheck className="w-4 h-4 text-emerald-400" />
              <span>Zero-tracking student safe space</span>
            </div>
          </div>
        </div>
      </div>

      {/* Filter Tabs - Interactive filter controls with click handlers */}
      <div className="flex items-center gap-1.5 overflow-x-auto pb-3 mb-6 scrollbar-none">
        {tags.map(t => (
          <button
            key={t}
            onClick={() => setFilterTag(t)}
            className={`px-3.5 py-1.5 text-xs font-medium rounded-lg whitespace-nowrap transition-colors cursor-pointer ${
              filterTag === t
                ? 'bg-slate-900 text-white shadow-xs'
                : 'bg-white text-slate-600 hover:text-slate-900 hover:bg-slate-100 border border-slate-200/80'
            }`}
          >
            {t}
          </button>
        ))}
      </div>

      {/* Confessions Feed */}
      <div className="space-y-4">
        {filteredConfessions.length === 0 ? (
          <div className="bg-white rounded-2xl border border-slate-200/80 p-12 text-center">
            <Flame className="w-10 h-10 text-slate-300 mx-auto mb-3" />
            <h3 className="text-base font-semibold text-slate-800 mb-1">No confessions in this category yet</h3>
            <p className="text-sm text-slate-500 mb-4 max-w-sm mx-auto">
              Be the first bold student to break the silence on this campus topic.
            </p>
            <button
              onClick={openComposer}
              className="px-4 py-2 bg-slate-900 text-white text-sm font-medium rounded-xl hover:bg-slate-800 transition-colors"
            >
              Post First Confession
            </button>
          </div>
        ) : (
          filteredConfessions.map((conf) => {
            const uniName = universities.find(u => u.id === conf.universityId)?.shortName || 'Campus';
            const isCommentsOpen = !!expandedComments[conf.id];

            return (
              <article 
                key={conf.id}
                className="bg-white rounded-2xl border border-slate-200/80 p-5 sm:p-6 transition-all hover:border-slate-300 shadow-xs"
              >
                {/* Header: Clean unboxed metadata with typographic separators */}
                <div className="flex items-center justify-between gap-2 mb-3">
                  <div className="flex items-center gap-2 text-xs text-slate-500 truncate">
                    <span className="font-semibold text-slate-700">{conf.authorAlias}</span>
                    <span aria-hidden="true">·</span>
                    <span className="text-blue-600 font-medium">{uniName}</span>
                    <span aria-hidden="true">·</span>
                    <span>{conf.tag}</span>
                    <span aria-hidden="true">·</span>
                    <span>{conf.createdAt}</span>
                  </div>

                  <span className="text-lg select-none" title={conf.tag}>
                    {conf.moodEmoji}
                  </span>
                </div>

                {/* Confession Body */}
                <p className="text-slate-800 text-sm sm:text-base leading-relaxed mb-4 font-normal">
                  {conf.content}
                </p>

                {/* Actions & Reactions Row */}
                <div className="flex flex-wrap items-center justify-between gap-3 pt-3 border-t border-slate-100">
                  {/* Reaction Buttons */}
                  <div className="flex items-center gap-1 sm:gap-2">
                    <button
                      onClick={() => toggleConfessionReaction(conf.id, 'fire')}
                      className={`flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-xs font-medium transition-all ${
                        conf.userReactions?.fire
                          ? 'bg-amber-100/80 text-amber-800 border border-amber-300 font-semibold'
                          : 'bg-slate-50 hover:bg-slate-100 text-slate-600'
                      }`}
                      title="Fire / Lit"
                    >
                      <span>🔥</span>
                      <span className="tabular-nums font-mono">{conf.reactions.fire}</span>
                    </button>

                    <button
                      onClick={() => toggleConfessionReaction(conf.id, 'skull')}
                      className={`flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-xs font-medium transition-all ${
                        conf.userReactions?.skull
                          ? 'bg-slate-200 text-slate-900 border border-slate-300 font-semibold'
                          : 'bg-slate-50 hover:bg-slate-100 text-slate-600'
                      }`}
                      title="Relatable / I'm Dead"
                    >
                      <span>💀</span>
                      <span className="tabular-nums font-mono">{conf.reactions.skull}</span>
                    </button>

                    <button
                      onClick={() => toggleConfessionReaction(conf.id, 'heart')}
                      className={`flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-xs font-medium transition-all ${
                        conf.userReactions?.heart
                          ? 'bg-rose-100 text-rose-800 border border-rose-300 font-semibold'
                          : 'bg-slate-50 hover:bg-slate-100 text-slate-600'
                      }`}
                      title="Heart / Wholesome"
                    >
                      <span>❤️</span>
                      <span className="tabular-nums font-mono">{conf.reactions.heart}</span>
                    </button>

                    <button
                      onClick={() => toggleConfessionReaction(conf.id, 'tea')}
                      className={`flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-xs font-medium transition-all ${
                        conf.userReactions?.tea
                          ? 'bg-teal-100 text-teal-800 border border-teal-300 font-semibold'
                          : 'bg-slate-50 hover:bg-slate-100 text-slate-600'
                      }`}
                      title="Spill the Tea"
                    >
                      <span>☕</span>
                      <span className="tabular-nums font-mono">{conf.reactions.tea}</span>
                    </button>
                  </div>

                  {/* Comments toggle, Bookmark & Share */}
                  <div className="flex items-center gap-2 text-slate-500 text-xs">
                    <button
                      onClick={() => handleToggleComments(conf.id)}
                      className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg hover:bg-slate-100 text-slate-600 font-medium transition-colors"
                    >
                      <MessageCircle className="w-3.5 h-3.5" />
                      <span>{conf.commentsCount || 0} Replies</span>
                      <ChevronDown className={`w-3 h-3 transition-transform ${isCommentsOpen ? 'rotate-180' : ''}`} />
                    </button>

                    <button
                      onClick={() => toggleBookmarkConfession(conf.id)}
                      className={`p-1.5 rounded-lg hover:bg-slate-100 transition-colors ${
                        conf.isBookmarked ? 'text-amber-600' : 'text-slate-400 hover:text-slate-700'
                      }`}
                      title={conf.isBookmarked ? 'Saved to bookmarks' : 'Bookmark confession'}
                    >
                      <Bookmark className={`w-4 h-4 ${conf.isBookmarked ? 'fill-amber-500' : ''}`} />
                    </button>

                    <button
                      onClick={() => handleShare(conf.id)}
                      className="p-1.5 rounded-lg hover:bg-slate-100 text-slate-400 hover:text-slate-700 transition-colors"
                      title="Share confession link"
                    >
                      {copiedId === conf.id ? <Check className="w-4 h-4 text-emerald-600" /> : <Share2 className="w-4 h-4" />}
                    </button>
                  </div>
                </div>

                {/* Expandable Comments Drawer */}
                {isCommentsOpen && (
                  <div className="mt-4 pt-4 border-t border-slate-100 space-y-3">
                    {/* Existing Comments */}
                    {conf.comments && conf.comments.length > 0 ? (
                      <div className="space-y-2.5 mb-3">
                        {conf.comments.map((comment) => (
                          <div 
                            key={comment.id}
                            className="bg-slate-50 rounded-xl p-3 text-xs text-slate-700"
                          >
                            <div className="flex items-center justify-between mb-1 text-[11px] text-slate-500">
                              <div className="flex items-center gap-1.5">
                                <span className="font-semibold text-slate-800">{comment.authorHandle}</span>
                                {comment.authorBadge && (
                                  <span className="text-[10px] text-blue-600 font-medium bg-blue-50 px-1.5 py-0.2 rounded">
                                    {comment.authorBadge}
                                  </span>
                                )}
                              </div>
                              <span>{comment.createdAt}</span>
                            </div>
                            <p className="leading-relaxed">{comment.content}</p>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <p className="text-xs text-slate-400 py-1 italic">No replies yet. Join the conversation anonymously.</p>
                    )}

                    {/* Anonymous Comment Input */}
                    <div className="flex items-center gap-2">
                      <input
                        type="text"
                        placeholder="Reply anonymously as a campus peer..."
                        value={commentInputs[conf.id] || ''}
                        onChange={(e) => setCommentInputs(prev => ({ ...prev, [conf.id]: e.target.value }))}
                        onKeyDown={(e) => e.key === 'Enter' && handleSendComment(conf.id)}
                        className="flex-1 text-xs bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5 text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all"
                      />
                      <button
                        onClick={() => handleSendComment(conf.id)}
                        disabled={!commentInputs[conf.id]?.trim()}
                        className="p-2.5 bg-blue-600 disabled:bg-slate-200 text-white rounded-xl hover:bg-blue-700 disabled:text-slate-400 transition-colors shrink-0"
                        title="Send anonymous reply"
                      >
                        <Send className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                )}

              </article>
            );
          })
        )}
      </div>

    </div>
  );
};
