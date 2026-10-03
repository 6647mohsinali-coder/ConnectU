import React, { useState, useEffect } from 'react';
import { useApp } from '../context/AppContext';
import { ProductCategory, ProductCondition, GigCategory } from '../types';
import { 
  Flame, 
  ShoppingBag, 
  Briefcase, 
  ShieldCheck, 
  Sparkles, 
  Upload, 
  Check,
  AlertCircle
} from 'lucide-react';
import textbookImg from '../assets/images/marketplace_textbooks_1791048430981.jpg';
import techGadgetImg from '../assets/images/marketplace_tech_gadget_1791048444713.jpg';
import dormBikeImg from '../assets/images/marketplace_dorm_bike_1791048455768.jpg';
import dormDecorImg from '../assets/images/marketplace_dorm_decor_1791048468312.jpg';

export const NewItemModal: React.FC = () => {
  const { 
    isCreateModalOpen, 
    setIsCreateModalOpen, 
    createModalInitialTab, 
    addConfession, 
    addProduct, 
    addGig,
    selectedUniversityId,
    universities,
    setActiveTab
  } = useApp();

  const [activeFormTab, setActiveFormTab] = useState<'confession' | 'product' | 'gig'>('confession');

  // Confession form state
  const [confessionContent, setConfessionContent] = useState('');
  const [confessionAlias, setConfessionAlias] = useState('');
  const [confessionTag, setConfessionTag] = useState<'Campus Life' | 'Exams' | 'Dorm Tales' | 'Crushes' | 'Professors' | 'Career'>('Campus Life');
  const [confessionMood, setConfessionMood] = useState('✨');
  const [confessionUni, setConfessionUni] = useState(selectedUniversityId === 'all' ? 'ucb' : selectedUniversityId);

  // Product form state
  const [productTitle, setProductTitle] = useState('');
  const [productPrice, setProductPrice] = useState<number | ''>('');
  const [productCategory, setProductCategory] = useState<ProductCategory>('Textbooks & Academics');
  const [productCondition, setProductCondition] = useState<ProductCondition>('Like New');
  const [productMeetup, setProductMeetup] = useState('Student Union / Campus Library');
  const [productDescription, setProductDescription] = useState('');
  const [productImage, setProductImage] = useState<string>(textbookImg);
  const [productUni, setProductUni] = useState(selectedUniversityId === 'all' ? 'ucb' : selectedUniversityId);

  // Gig form state
  const [gigTitle, setGigTitle] = useState('');
  const [gigCategory, setGigCategory] = useState<GigCategory>('Tutoring & STEM');
  const [gigRateType, setGigRateType] = useState<'hourly' | 'fixed'>('fixed');
  const [gigRate, setGigRate] = useState<number | ''>(40);
  const [gigLocation, setGigLocation] = useState('Main Campus Library or Online');
  const [gigDeadline, setGigDeadline] = useState('This Weekend');
  const [gigDescription, setGigDescription] = useState('');
  const [gigTags, setGigTags] = useState('Campus, Urgent, Study');
  const [gigUni, setGigUni] = useState(selectedUniversityId === 'all' ? 'ucb' : selectedUniversityId);

  useEffect(() => {
    if (createModalInitialTab) {
      setActiveFormTab(createModalInitialTab);
    }
  }, [createModalInitialTab, isCreateModalOpen]);

  if (!isCreateModalOpen) return null;

  const handleGenerateAlias = () => {
    const prefixes = ['Anonymous', 'Secret', 'Midnight', 'Library', 'Coffee', 'Dorm', 'Study', 'Campus'];
    const titles = ['Goose', 'Bear', 'Freshman', 'Senior', 'Researcher', 'Ghost', 'Coder', 'Philosopher'];
    const num = Math.floor(10 + Math.random() * 90);
    const chosen = `${prefixes[Math.floor(Math.random() * prefixes.length)]}${titles[Math.floor(Math.random() * titles.length)]} #${num}`;
    setConfessionAlias(chosen);
  };

  const handleSubmitConfession = (e: React.FormEvent) => {
    e.preventDefault();
    if (!confessionContent.trim()) return;

    addConfession({
      authorAlias: confessionAlias.trim() || 'Anonymous Student',
      universityId: confessionUni,
      content: confessionContent.trim(),
      tag: confessionTag,
      moodEmoji: confessionMood,
    });

    setConfessionContent('');
    setConfessionAlias('');
    setIsCreateModalOpen(false);
    setActiveTab('confessions');
  };

  const handleSubmitProduct = (e: React.FormEvent) => {
    e.preventDefault();
    if (!productTitle.trim() || productPrice === '') return;

    addProduct({
      title: productTitle.trim(),
      price: Number(productPrice),
      category: productCategory,
      condition: productCondition,
      description: productDescription.trim() || 'No additional description provided.',
      imageUrl: productImage,
      universityId: productUni,
      meetupLocation: productMeetup.trim(),
    });

    setProductTitle('');
    setProductPrice('');
    setProductDescription('');
    setIsCreateModalOpen(false);
    setActiveTab('marketplace');
  };

  const handleSubmitGig = (e: React.FormEvent) => {
    e.preventDefault();
    if (!gigTitle.trim() || gigRate === '') return;

    const parsedTags = gigTags
      .split(',')
      .map(t => t.trim())
      .filter(Boolean);

    addGig({
      title: gigTitle.trim(),
      category: gigCategory,
      rateType: gigRateType,
      rate: Number(gigRate),
      universityId: gigUni,
      location: gigLocation.trim(),
      deadline: gigDeadline.trim(),
      description: gigDescription.trim() || 'Please reach out via chat for more details.',
      tags: parsedTags.length > 0 ? parsedTags : ['Student Gig'],
    });

    setGigTitle('');
    setGigDescription('');
    setIsCreateModalOpen(false);
    setActiveTab('gigs');
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-3 sm:p-4 overflow-y-auto">
      <div className="bg-white rounded-3xl max-w-xl w-full p-5 sm:p-7 shadow-2xl relative my-8">
        
        {/* Close Button */}
        <button
          onClick={() => setIsCreateModalOpen(false)}
          className="absolute top-5 right-5 text-slate-400 hover:text-slate-800 text-lg font-bold p-1 cursor-pointer"
        >
          ✕
        </button>

        {/* Modal Segmented Tabs */}
        <div className="mb-6">
          <h2 className="text-xl font-bold text-slate-900 mb-3">Create on ConnectU</h2>
          <div className="flex items-center gap-1 p-1 bg-slate-100 rounded-xl">
            <button
              onClick={() => setActiveFormTab('confession')}
              className={`flex-1 flex items-center justify-center gap-1.5 py-2 text-xs font-bold rounded-lg transition-colors cursor-pointer ${
                activeFormTab === 'confession'
                  ? 'bg-white text-blue-600 shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <Flame className="w-3.5 h-3.5" />
              <span>Confession</span>
            </button>

            <button
              onClick={() => setActiveFormTab('product')}
              className={`flex-1 flex items-center justify-center gap-1.5 py-2 text-xs font-bold rounded-lg transition-colors cursor-pointer ${
                activeFormTab === 'product'
                  ? 'bg-white text-blue-600 shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <ShoppingBag className="w-3.5 h-3.5" />
              <span>List Product</span>
            </button>

            <button
              onClick={() => setActiveFormTab('gig')}
              className={`flex-1 flex items-center justify-center gap-1.5 py-2 text-xs font-bold rounded-lg transition-colors cursor-pointer ${
                activeFormTab === 'gig'
                  ? 'bg-white text-blue-600 shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <Briefcase className="w-3.5 h-3.5" />
              <span>Post a Gig</span>
            </button>
          </div>
        </div>

        {/* TAB 1: CONFESSION FORM */}
        {activeFormTab === 'confession' && (
          <form onSubmit={handleSubmitConfession} className="space-y-4">
            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label className="text-xs font-bold text-slate-700">Anonymous Persona / Alias</label>
                <button
                  type="button"
                  onClick={handleGenerateAlias}
                  className="text-[11px] text-blue-600 hover:text-blue-800 font-semibold flex items-center gap-1"
                >
                  <Sparkles className="w-3 h-3" />
                  <span>Randomize Alias</span>
                </button>
              </div>
              <input
                type="text"
                placeholder="e.g. Midnight Moffitt Grinder #99"
                value={confessionAlias}
                onChange={(e) => setConfessionAlias(e.target.value)}
                className="w-full text-xs sm:text-sm bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2 text-slate-800 focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 focus:outline-none"
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1.5">Campus Topic</label>
                <select
                  value={confessionTag}
                  onChange={(e) => setConfessionTag(e.target.value as any)}
                  className="w-full text-xs bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-slate-800 focus:ring-2 focus:ring-blue-500/20 focus:outline-none"
                >
                  <option value="Campus Life">Campus Life</option>
                  <option value="Exams">Exams & Midterms</option>
                  <option value="Dorm Tales">Dorm Tales</option>
                  <option value="Crushes">Crushes & Dating</option>
                  <option value="Professors">Professors & TAs</option>
                  <option value="Career">Career & Internships</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1.5">Mood Emoji</label>
                <div className="flex items-center gap-1.5 pt-0.5">
                  {['🔥', '💀', '❤️', '☕', '✨', '💼'].map(emoji => (
                    <button
                      type="button"
                      key={emoji}
                      onClick={() => setConfessionMood(emoji)}
                      className={`text-lg p-1.5 rounded-lg transition-transform ${
                        confessionMood === emoji ? 'bg-blue-100 scale-110' : 'hover:bg-slate-100'
                      }`}
                    >
                      {emoji}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1.5">Campus Hub</label>
              <select
                value={confessionUni}
                onChange={(e) => setConfessionUni(e.target.value)}
                className="w-full text-xs bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-slate-800 focus:ring-2 focus:ring-blue-500/20 focus:outline-none"
              >
                {universities.filter(u => u.id !== 'all').map(u => (
                  <option key={u.id} value={u.id}>
                    {u.name}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1.5">
                Your Confession (No names or private info):
              </label>
              <textarea
                rows={4}
                required
                value={confessionContent}
                onChange={(e) => setConfessionContent(e.target.value)}
                placeholder="What's been on your mind that you can't say out loud on campus?..."
                className="w-full text-xs sm:text-sm bg-slate-50 border border-slate-200 rounded-xl p-3 text-slate-800 placeholder-slate-400 focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 focus:outline-none"
              />
            </div>

            <div className="bg-slate-50 p-3 rounded-xl flex items-start gap-2 text-[11px] text-slate-500">
              <ShieldCheck className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
              <span>
                Confessions are cryptographically unlinked from your account profile. Zero tracking.
              </span>
            </div>

            <div className="flex items-center justify-end gap-3 pt-3 border-t border-slate-100">
              <button
                type="button"
                onClick={() => setIsCreateModalOpen(false)}
                className="px-4 py-2 text-xs font-semibold text-slate-600 hover:bg-slate-100 rounded-xl"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={!confessionContent.trim()}
                className="px-5 py-2.5 bg-blue-600 hover:bg-blue-700 disabled:bg-slate-300 text-white font-semibold text-xs rounded-xl transition-colors shadow-sm"
              >
                Publish Confession
              </button>
            </div>
          </form>
        )}

        {/* TAB 2: PRODUCT LISTING FORM */}
        {activeFormTab === 'product' && (
          <form onSubmit={handleSubmitProduct} className="space-y-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1.5">Item Title</label>
              <input
                type="text"
                required
                placeholder="e.g. TI-84 Plus CE Color Graphing Calculator"
                value={productTitle}
                onChange={(e) => setProductTitle(e.target.value)}
                className="w-full text-xs sm:text-sm bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2 text-slate-800 focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 focus:outline-none"
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1.5">Price ($ USD)</label>
                <input
                  type="number"
                  min="0"
                  required
                  placeholder="e.g. 45 (0 for free)"
                  value={productPrice}
                  onChange={(e) => setProductPrice(e.target.value === '' ? '' : Number(e.target.value))}
                  className="w-full text-xs sm:text-sm bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2 text-slate-800 focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 focus:outline-none tabular-nums"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1.5">Condition</label>
                <select
                  value={productCondition}
                  onChange={(e) => setProductCondition(e.target.value as any)}
                  className="w-full text-xs bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-slate-800 focus:ring-2 focus:ring-blue-500/20 focus:outline-none"
                >
                  <option value="Brand New">Brand New (Unopened)</option>
                  <option value="Like New">Like New (Mint)</option>
                  <option value="Good">Good (Minor wear)</option>
                  <option value="Fair">Fair (Functional)</option>
                </select>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1.5">Category</label>
                <select
                  value={productCategory}
                  onChange={(e) => setProductCategory(e.target.value as any)}
                  className="w-full text-xs bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-slate-800 focus:ring-2 focus:ring-blue-500/20 focus:outline-none"
                >
                  <option value="Textbooks & Academics">Textbooks & Academics</option>
                  <option value="Tech & Gadgets">Tech & Gadgets</option>
                  <option value="Transport & Bikes">Transport & Bikes</option>
                  <option value="Dorm & Living">Dorm & Living</option>
                  <option value="Fashion & Apparel">Fashion & Apparel</option>
                  <option value="Free / Donated">Free / Donated</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1.5">Campus Meetup Spot</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Student Union / Library"
                  value={productMeetup}
                  onChange={(e) => setProductMeetup(e.target.value)}
                  className="w-full text-xs bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2 text-slate-800 focus:ring-2 focus:ring-blue-500/20 focus:outline-none"
                />
              </div>
            </div>

            {/* Photo Selection preset */}
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1.5">Select Item Photo</label>
              <div className="grid grid-cols-4 gap-2">
                {[
                  { label: 'Books', img: textbookImg },
                  { label: 'Gadget', img: techGadgetImg },
                  { label: 'Bike', img: dormBikeImg },
                  { label: 'Dorm', img: dormDecorImg },
                ].map(p => (
                  <button
                    key={p.label}
                    type="button"
                    onClick={() => setProductImage(p.img)}
                    className={`relative rounded-xl overflow-hidden aspect-[4/3] border-2 transition-all cursor-pointer ${
                      productImage === p.img ? 'border-blue-600 ring-2 ring-blue-500/30' : 'border-transparent opacity-70 hover:opacity-100'
                    }`}
                  >
                    <img src={p.img} alt={p.label} referrerPolicy="no-referrer" className="w-full h-full object-cover" />
                    <span className="absolute bottom-1 left-1 text-[10px] font-bold bg-slate-900/80 text-white px-1 rounded">
                      {p.label}
                    </span>
                    {productImage === p.img && (
                      <span className="absolute top-1 right-1 bg-blue-600 text-white rounded-full p-0.5">
                        <Check className="w-2.5 h-2.5" />
                      </span>
                    )}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1.5">Item Description</label>
              <textarea
                rows={3}
                value={productDescription}
                onChange={(e) => setProductDescription(e.target.value)}
                placeholder="Mention condition, accessories included, reason for selling..."
                className="w-full text-xs sm:text-sm bg-slate-50 border border-slate-200 rounded-xl p-3 text-slate-800 placeholder-slate-400 focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 focus:outline-none"
              />
            </div>

            <div className="flex items-center justify-end gap-3 pt-3 border-t border-slate-100">
              <button
                type="button"
                onClick={() => setIsCreateModalOpen(false)}
                className="px-4 py-2 text-xs font-semibold text-slate-600 hover:bg-slate-100 rounded-xl"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={!productTitle.trim() || productPrice === ''}
                className="px-5 py-2.5 bg-blue-600 hover:bg-blue-700 disabled:bg-slate-300 text-white font-semibold text-xs rounded-xl transition-colors shadow-sm"
              >
                List for Campus
              </button>
            </div>
          </form>
        )}

        {/* TAB 3: GIG / BOUNTY FORM */}
        {activeFormTab === 'gig' && (
          <form onSubmit={handleSubmitGig} className="space-y-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1.5">Gig Title</label>
              <input
                type="text"
                required
                placeholder="e.g. Need Tutor for Organic Chemistry Midterm / Move Bed Frame"
                value={gigTitle}
                onChange={(e) => setGigTitle(e.target.value)}
                className="w-full text-xs sm:text-sm bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2 text-slate-800 focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 focus:outline-none"
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1.5">Category</label>
                <select
                  value={gigCategory}
                  onChange={(e) => setGigCategory(e.target.value as any)}
                  className="w-full text-xs bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-slate-800 focus:ring-2 focus:ring-emerald-500/20 focus:outline-none"
                >
                  <option value="Tutoring & STEM">Tutoring & STEM</option>
                  <option value="Dorm Help & Moving">Dorm Help & Moving</option>
                  <option value="Tech & Coding">Tech & Coding</option>
                  <option value="Photo & Media">Photo & Media</option>
                  <option value="Essay & Proofreading">Essay & Proofreading</option>
                  <option value="Errands & Campus Tasks">Errands & Campus Tasks</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1.5">Rate Model</label>
                <div className="flex items-center gap-2">
                  <select
                    value={gigRateType}
                    onChange={(e) => setGigRateType(e.target.value as any)}
                    className="w-1/2 text-xs bg-slate-50 border border-slate-200 rounded-xl px-2 py-2 text-slate-800 focus:outline-none"
                  >
                    <option value="fixed">Fixed ($)</option>
                    <option value="hourly">Hourly ($/hr)</option>
                  </select>
                  <input
                    type="number"
                    min="1"
                    required
                    placeholder="Rate"
                    value={gigRate}
                    onChange={(e) => setGigRate(e.target.value === '' ? '' : Number(e.target.value))}
                    className="w-1/2 text-xs bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-slate-800 focus:outline-none tabular-nums"
                  />
                </div>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1.5">Location</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Unit 3 Dorm / Library / Remote"
                  value={gigLocation}
                  onChange={(e) => setGigLocation(e.target.value)}
                  className="w-full text-xs bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2 text-slate-800 focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1.5">Target Deadline</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Tomorrow 5pm / Friday"
                  value={gigDeadline}
                  onChange={(e) => setGigDeadline(e.target.value)}
                  className="w-full text-xs bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2 text-slate-800 focus:outline-none"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1.5">Tags (Comma-separated)</label>
              <input
                type="text"
                placeholder="e.g. Chemistry, Urgent, Lab Work"
                value={gigTags}
                onChange={(e) => setGigTags(e.target.value)}
                className="w-full text-xs bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2 text-slate-800 focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1.5">Task Description</label>
              <textarea
                rows={3}
                required
                value={gigDescription}
                onChange={(e) => setGigDescription(e.target.value)}
                placeholder="Describe exactly what you need help with and what you expect..."
                className="w-full text-xs sm:text-sm bg-slate-50 border border-slate-200 rounded-xl p-3 text-slate-800 placeholder-slate-400 focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 focus:outline-none"
              />
            </div>

            <div className="flex items-center justify-end gap-3 pt-3 border-t border-slate-100">
              <button
                type="button"
                onClick={() => setIsCreateModalOpen(false)}
                className="px-4 py-2 text-xs font-semibold text-slate-600 hover:bg-slate-100 rounded-xl"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={!gigTitle.trim() || gigRate === ''}
                className="px-5 py-2.5 bg-emerald-600 hover:bg-emerald-700 disabled:bg-slate-300 text-white font-semibold text-xs rounded-xl transition-colors shadow-sm"
              >
                Publish Campus Gig
              </button>
            </div>
          </form>
        )}

      </div>
    </div>
  );
};
