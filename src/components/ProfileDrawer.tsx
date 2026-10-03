import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { 
  GraduationCap, 
  ShieldCheck, 
  Star, 
  Bookmark, 
  Package, 
  Briefcase, 
  Flame, 
  Edit3, 
  Check, 
  MapPin,
  ExternalLink
} from 'lucide-react';

export const ProfileDrawer: React.FC = () => {
  const { 
    isProfileDrawerOpen, 
    setIsProfileDrawerOpen, 
    currentUser, 
    setCurrentUser,
    products,
    gigs,
    confessions,
    selectedUniversityId,
    setSelectedUniversityId,
    universities,
    setActiveTab
  } = useApp();

  const [isEditing, setIsEditing] = useState(false);
  const [name, setName] = useState(currentUser.name);
  const [major, setMajor] = useState(currentUser.major);
  const [gradYear, setGradYear] = useState(currentUser.gradYear);
  const [bio, setBio] = useState(currentUser.bio);
  const [activeSubTab, setActiveSubTab] = useState<'listings' | 'bookmarks' | 'safety'>('listings');

  if (!isProfileDrawerOpen) return null;

  const handleSaveProfile = () => {
    setCurrentUser(prev => ({
      ...prev,
      name,
      major,
      gradYear,
      bio,
    }));
    setIsEditing(false);
  };

  const currentUni = universities.find(u => u.id === currentUser.universityId) || universities[1];

  const myListings = products.filter(p => p.sellerId === currentUser.id);
  const myGigs = gigs.filter(g => g.posterId === currentUser.id);
  const mySavedProducts = products.filter(p => p.isSaved);
  const mySavedConfessions = confessions.filter(c => c.isBookmarked);
  const mySavedGigs = gigs.filter(g => g.isBookmarked);

  return (
    <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex justify-end">
      <div className="bg-white w-full max-w-md h-full flex flex-col shadow-2xl overflow-y-auto">
        
        {/* Drawer Header */}
        <div className="p-5 border-b border-slate-200/80 flex items-center justify-between">
          <h2 className="text-base font-bold text-slate-900">Student Profile & Hub</h2>
          <button
            onClick={() => setIsProfileDrawerOpen(false)}
            className="text-slate-400 hover:text-slate-700 font-bold p-1 cursor-pointer"
          >
            ✕
          </button>
        </div>

        {/* Profile Card */}
        <div className="p-6 bg-slate-50 border-b border-slate-200/80">
          <div className="flex items-start gap-4 mb-4">
            <img
              src={currentUser.avatar}
              alt={currentUser.name}
              referrerPolicy="no-referrer"
              className="w-16 h-16 rounded-full object-cover border-2 border-white shadow-xs"
            />
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-1.5 mb-0.5">
                <h3 className="font-bold text-slate-900 text-base truncate">{currentUser.name}</h3>
                {currentUser.verifiedStudent && (
                  <span title="Verified Campus Student">
                    <ShieldCheck className="w-4 h-4 text-blue-600 shrink-0" />
                  </span>
                )}
              </div>
              <p className="text-xs text-slate-500 truncate">{currentUser.handle}</p>
              <div className="flex items-center gap-2 mt-1.5 text-xs text-slate-600">
                <span className="font-semibold text-blue-700">{currentUni.name}</span>
                <span aria-hidden="true">·</span>
                <div className="flex items-center gap-0.5 text-amber-600 font-bold">
                  <Star className="w-3 h-3 fill-amber-500" />
                  <span className="tabular-nums">{currentUser.rating}</span>
                </div>
              </div>
            </div>

            <button
              onClick={() => setIsEditing(!isEditing)}
              className="p-1.5 text-slate-400 hover:text-slate-700 rounded-lg hover:bg-slate-200/60 transition-colors"
              title="Edit Profile"
            >
              <Edit3 className="w-4 h-4" />
            </button>
          </div>

          {/* Edit mode or Bio display */}
          {isEditing ? (
            <div className="space-y-3 pt-2">
              <div>
                <label className="text-[11px] font-bold text-slate-600">Full Name</label>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full text-xs bg-white border border-slate-200 rounded-lg p-2"
                />
              </div>
              <div>
                <label className="text-[11px] font-bold text-slate-600">Major / Field</label>
                <input
                  type="text"
                  value={major}
                  onChange={(e) => setMajor(e.target.value)}
                  className="w-full text-xs bg-white border border-slate-200 rounded-lg p-2"
                />
              </div>
              <div>
                <label className="text-[11px] font-bold text-slate-600">Bio</label>
                <textarea
                  rows={2}
                  value={bio}
                  onChange={(e) => setBio(e.target.value)}
                  className="w-full text-xs bg-white border border-slate-200 rounded-lg p-2"
                />
              </div>
              <button
                onClick={handleSaveProfile}
                className="w-full py-1.5 bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs rounded-lg transition-colors"
              >
                Save Profile
              </button>
            </div>
          ) : (
            <div>
              <p className="text-xs text-slate-600 leading-relaxed mb-3">
                {currentUser.bio}
              </p>
              <div className="flex items-center gap-2 text-[11px] text-slate-500">
                <GraduationCap className="w-3.5 h-3.5 text-slate-400" />
                <span>{currentUser.major}</span>
                <span aria-hidden="true">·</span>
                <span>{currentUser.gradYear}</span>
              </div>
            </div>
          )}
        </div>

        {/* Campus Switcher Section */}
        <div className="p-4 border-b border-slate-200/80">
          <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-2">
            Active Campus Feed
          </label>
          <div className="grid grid-cols-2 gap-2">
            {universities.map(u => (
              <button
                key={u.id}
                onClick={() => setSelectedUniversityId(u.id)}
                className={`p-2.5 rounded-xl text-left border transition-all cursor-pointer ${
                  selectedUniversityId === u.id
                    ? 'border-blue-600 bg-blue-50/60 font-bold text-blue-900'
                    : 'border-slate-200 hover:bg-slate-50 text-slate-700 text-xs'
                }`}
              >
                <p className="font-semibold text-xs truncate">{u.shortName}</p>
                <p className="text-[10px] text-slate-400 truncate">{u.studentCount}</p>
              </button>
            ))}
          </div>
        </div>

        {/* Sub Navigation */}
        <div className="flex border-b border-slate-200">
          <button
            onClick={() => setActiveSubTab('listings')}
            className={`flex-1 py-3 text-xs font-bold text-center border-b-2 transition-colors ${
              activeSubTab === 'listings'
                ? 'border-blue-600 text-blue-600'
                : 'border-transparent text-slate-500 hover:text-slate-800'
            }`}
          >
            My Activity ({myListings.length + myGigs.length})
          </button>
          <button
            onClick={() => setActiveSubTab('bookmarks')}
            className={`flex-1 py-3 text-xs font-bold text-center border-b-2 transition-colors ${
              activeSubTab === 'bookmarks'
                ? 'border-blue-600 text-blue-600'
                : 'border-transparent text-slate-500 hover:text-slate-800'
            }`}
          >
            Saved Items
          </button>
          <button
            onClick={() => setActiveSubTab('safety')}
            className={`flex-1 py-3 text-xs font-bold text-center border-b-2 transition-colors ${
              activeSubTab === 'safety'
                ? 'border-blue-600 text-blue-600'
                : 'border-transparent text-slate-500 hover:text-slate-800'
            }`}
          >
            Campus Trust
          </button>
        </div>

        {/* Sub Tab Content */}
        <div className="flex-1 p-5 overflow-y-auto">
          {activeSubTab === 'listings' && (
            <div className="space-y-4">
              <div>
                <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500 mb-2">My Marketplace Items</h4>
                {myListings.length === 0 ? (
                  <p className="text-xs text-slate-400 italic">No products listed by you yet.</p>
                ) : (
                  <div className="space-y-2">
                    {myListings.map(prod => (
                      <div key={prod.id} className="p-2.5 bg-slate-50 rounded-xl flex items-center justify-between gap-2">
                        <div className="min-w-0">
                          <p className="text-xs font-bold text-slate-900 truncate">{prod.title}</p>
                          <p className="text-[11px] text-blue-600 font-semibold">${prod.price} · {prod.condition}</p>
                        </div>
                        <button
                          onClick={() => {
                            setIsProfileDrawerOpen(false);
                            setActiveTab('marketplace');
                          }}
                          className="text-xs text-slate-500 hover:text-blue-600 font-semibold"
                        >
                          View
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              <div className="pt-3 border-t border-slate-100">
                <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500 mb-2">My Posted Gigs</h4>
                {myGigs.length === 0 ? (
                  <p className="text-xs text-slate-400 italic">No campus gigs posted by you yet.</p>
                ) : (
                  <div className="space-y-2">
                    {myGigs.map(gig => (
                      <div key={gig.id} className="p-2.5 bg-slate-50 rounded-xl flex items-center justify-between gap-2">
                        <div className="min-w-0">
                          <p className="text-xs font-bold text-slate-900 truncate">{gig.title}</p>
                          <p className="text-[11px] text-emerald-700 font-semibold">
                            {gig.rateType === 'hourly' ? `$${gig.rate}/hr` : `$${gig.rate}`} · {gig.applicantsCount} applicants
                          </p>
                        </div>
                        <button
                          onClick={() => {
                            setIsProfileDrawerOpen(false);
                            setActiveTab('gigs');
                          }}
                          className="text-xs text-slate-500 hover:text-emerald-600 font-semibold"
                        >
                          View
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          )}

          {activeSubTab === 'bookmarks' && (
            <div className="space-y-4">
              <div>
                <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500 mb-2">Saved Products</h4>
                {mySavedProducts.length === 0 ? (
                  <p className="text-xs text-slate-400 italic">No saved products.</p>
                ) : (
                  <div className="space-y-2">
                    {mySavedProducts.map(p => (
                      <div key={p.id} className="p-2.5 bg-slate-50 rounded-xl flex items-center justify-between gap-2">
                        <p className="text-xs font-bold text-slate-900 truncate">{p.title}</p>
                        <span className="text-xs font-black text-blue-600 tabular-nums">${p.price}</span>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              <div className="pt-3 border-t border-slate-100">
                <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500 mb-2">Saved Confessions</h4>
                {mySavedConfessions.length === 0 ? (
                  <p className="text-xs text-slate-400 italic">No saved confessions.</p>
                ) : (
                  <div className="space-y-2">
                    {mySavedConfessions.map(c => (
                      <div key={c.id} className="p-2.5 bg-slate-50 rounded-xl">
                        <p className="text-xs text-slate-700 line-clamp-2 leading-relaxed">"{c.content}"</p>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          )}

          {activeSubTab === 'safety' && (
            <div className="space-y-3 text-xs text-slate-600 leading-relaxed">
              <div className="bg-blue-50 border border-blue-200/60 rounded-xl p-3 text-blue-900">
                <p className="font-bold mb-1">Campus Safety & Honor Code</p>
                <p className="text-[11px] leading-normal">
                  ConnectU is built exclusively for university students. Always prioritize physical safety during marketplace handoffs.
                </p>
              </div>

              <ul className="space-y-2 list-disc pl-4 text-[11px]">
                <li>Always meet for product trades in daylight at public campus hubs (e.g. Student Union, Library Lobby, Dining Commons).</li>
                <li>Confessions are anonymous; harassment, hate speech, or sharing private personal identifiers is strictly prohibited.</li>
                <li>For gigs involving heavy lifting or late-night tasks, confirm details in the campus chat prior to meeting.</li>
              </ul>
            </div>
          )}
        </div>

      </div>
    </div>
  );
};
