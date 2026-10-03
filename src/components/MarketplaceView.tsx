import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { Product, ProductCategory } from '../types';
import { 
  Search, 
  Plus, 
  MapPin, 
  Star, 
  MessageSquare, 
  Bookmark, 
  Sparkles, 
  Filter,
  DollarSign,
  ShieldCheck,
  Package
} from 'lucide-react';

export const MarketplaceView: React.FC = () => {
  const { 
    products, 
    toggleBookmarkProduct, 
    startOrOpenChatWithUser,
    selectedUniversityId, 
    universities,
    setIsCreateModalOpen,
    setCreateModalInitialTab
  } = useApp();

  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState<'recent' | 'price-low' | 'price-high'>('recent');
  const [selectedProductForDetail, setSelectedProductForDetail] = useState<Product | null>(null);

  const categories = [
    'All',
    'Textbooks & Academics',
    'Tech & Gadgets',
    'Transport & Bikes',
    'Dorm & Living',
    'Fashion & Apparel',
    'Free / Donated'
  ];

  // Filtering
  const filteredProducts = products.filter(item => {
    const matchesUni = selectedUniversityId === 'all' || item.universityId === selectedUniversityId;
    if (!matchesUni) return false;

    if (selectedCategory !== 'All' && item.category !== selectedCategory) return false;

    if (!searchQuery.trim()) return true;
    const q = searchQuery.toLowerCase();
    return item.title.toLowerCase().includes(q) || 
           item.description.toLowerCase().includes(q) ||
           item.meetupLocation.toLowerCase().includes(q);
  }).sort((a, b) => {
    if (sortBy === 'price-low') return a.price - b.price;
    if (sortBy === 'price-high') return b.price - a.price;
    return 0; // Default recent
  });

  const handleContactSeller = (product: Product) => {
    startOrOpenChatWithUser(
      {
        id: product.sellerId,
        name: product.sellerName,
        major: product.sellerMajor,
        university: universities.find(u => u.id === product.universityId)?.name || 'Campus',
        avatar: product.sellerAvatar,
      },
      `Hi ${product.sellerName}! I saw your listing for "${product.title}" ($${product.price}). Is it still available to meet up at ${product.meetupLocation}?`,
      {
        type: 'product',
        title: product.title,
        priceOrRate: `$${product.price}`,
        imageUrl: product.imageUrl,
      }
    );
  };

  const openListProduct = () => {
    setCreateModalInitialTab('product');
    setIsCreateModalOpen(true);
  };

  const currentUniName = universities.find(u => u.id === selectedUniversityId)?.name || 'All Campuses';

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-6 pb-24 md:pb-12">
      
      {/* Top Marketplace Hero Banner */}
      <div className="bg-slate-900 rounded-2xl p-6 sm:p-8 text-white shadow-sm mb-6 flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div className="max-w-xl">
          <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-blue-400 mb-2">
            <Package className="w-3.5 h-3.5" />
            <span>Campus Bazaar · Peer-to-Peer</span>
            <span aria-hidden="true">·</span>
            <span>{currentUniName}</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-white mb-2">
            Buy & sell student essentials safely on campus.
          </h1>
          <p className="text-sm text-slate-300 leading-relaxed">
            No shipping fees. Meet fellow verified students at the library or dorm quad. Textbooks, electronics, bikes, and dorm setups.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          <button
            onClick={openListProduct}
            className="px-5 py-2.5 bg-blue-600 hover:bg-blue-500 active:scale-95 text-white font-semibold text-sm rounded-xl transition-all shadow-sm flex items-center gap-2 cursor-pointer whitespace-nowrap"
          >
            <Plus className="w-4 h-4" />
            <span>Sell an Item</span>
          </button>
        </div>
      </div>

      {/* Search, Filter & Categories */}
      <div className="space-y-4 mb-6">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-3">
          {/* Search bar */}
          <div className="relative w-full sm:max-w-md">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
            <input
              type="text"
              placeholder="Search textbooks, iPads, calculators, bikes..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 text-xs sm:text-sm bg-white border border-slate-200/80 rounded-xl text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all shadow-xs"
            />
          </div>

          {/* Sort dropdown */}
          <div className="flex items-center gap-2 w-full sm:w-auto justify-end">
            <span className="text-xs text-slate-500 hidden sm:inline">Sort:</span>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as any)}
              className="text-xs font-medium bg-white border border-slate-200/80 text-slate-700 py-2 px-3 rounded-xl focus:ring-2 focus:ring-blue-500/20 cursor-pointer shadow-xs"
            >
              <option value="recent">Newest Listed</option>
              <option value="price-low">Price: Low to High</option>
              <option value="price-high">Price: High to Low</option>
            </select>
          </div>
        </div>

        {/* Category Pills */}
        <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none">
          {categories.map(cat => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-3.5 py-1.5 text-xs font-semibold rounded-lg whitespace-nowrap transition-colors cursor-pointer ${
                selectedCategory === cat
                  ? 'bg-blue-600 text-white shadow-xs'
                  : 'bg-white text-slate-600 hover:text-slate-900 hover:bg-slate-100 border border-slate-200/80'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* Product Cards Grid */}
      {filteredProducts.length === 0 ? (
        <div className="bg-white rounded-2xl border border-slate-200/80 p-12 text-center max-w-lg mx-auto">
          <Package className="w-10 h-10 text-slate-300 mx-auto mb-3" />
          <h3 className="text-base font-semibold text-slate-800 mb-1">No products found</h3>
          <p className="text-xs text-slate-500 mb-5">
            No student listings match your current filters. Be the first to list an item for fellow students.
          </p>
          <button
            onClick={openListProduct}
            className="px-4 py-2 bg-blue-600 text-white text-xs font-semibold rounded-xl hover:bg-blue-700 transition-colors"
          >
            List an Item Now
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
          {filteredProducts.map((product) => {
            const uni = universities.find(u => u.id === product.universityId);

            return (
              <div
                key={product.id}
                className="bg-white rounded-2xl border border-slate-200/80 overflow-hidden hover:shadow-md hover:border-slate-300 transition-all flex flex-col group"
              >
                {/* Product Image Slot with Fallback Container */}
                <div className="relative aspect-[4/3] bg-slate-100 overflow-hidden">
                  <img
                    src={product.imageUrl}
                    alt={product.title}
                    referrerPolicy="no-referrer"
                    className="w-full h-full object-cover group-hover:scale-103 transition-transform duration-300"
                    onError={(e) => {
                      // Fallback container
                      (e.target as HTMLElement).style.display = 'none';
                    }}
                  />
                  
                  {/* Floating Price Tag */}
                  <div className="absolute bottom-2.5 left-2.5 bg-slate-900/90 backdrop-blur-md text-white font-extrabold text-sm px-2.5 py-1 rounded-lg tabular-nums shadow-sm">
                    {product.price === 0 ? 'FREE' : `$${product.price}`}
                  </div>

                  {/* Bookmark Button */}
                  <button
                    onClick={() => toggleBookmarkProduct(product.id)}
                    className="absolute top-2.5 right-2.5 p-1.5 rounded-full bg-white/90 backdrop-blur-md hover:bg-white text-slate-600 hover:text-amber-500 shadow-sm transition-colors"
                    title={product.isSaved ? 'Saved to watchlist' : 'Save to watchlist'}
                  >
                    <Bookmark className={`w-4 h-4 ${product.isSaved ? 'fill-amber-500 text-amber-500' : ''}`} />
                  </button>
                </div>

                {/* Card Content */}
                <div className="p-4 flex-1 flex flex-col justify-between">
                  <div>
                    {/* Unboxed Metadata with Typographic Separators */}
                    <div className="flex items-center gap-1.5 text-[11px] text-slate-500 mb-1.5 truncate">
                      <span className="font-semibold text-blue-700">{product.condition}</span>
                      <span aria-hidden="true">·</span>
                      <span>{product.category}</span>
                      <span aria-hidden="true">·</span>
                      <span>{product.createdAt}</span>
                    </div>

                    <h3 
                      onClick={() => setSelectedProductForDetail(product)}
                      className="font-bold text-slate-900 text-sm leading-snug line-clamp-2 hover:text-blue-600 transition-colors cursor-pointer mb-2"
                      title={product.title}
                    >
                      {product.title}
                    </h3>

                    {/* Meetup location */}
                    <div className="flex items-center gap-1 text-[11px] text-slate-500 mb-3 truncate">
                      <MapPin className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                      <span className="truncate">{product.meetupLocation}</span>
                    </div>
                  </div>

                  {/* Seller info & Action */}
                  <div className="pt-3 border-t border-slate-100 flex items-center justify-between gap-2">
                    <div className="flex items-center gap-2 min-w-0">
                      <img
                        src={product.sellerAvatar}
                        alt={product.sellerName}
                        referrerPolicy="no-referrer"
                        className="w-6 h-6 rounded-full object-cover shrink-0 border border-slate-200"
                      />
                      <div className="min-w-0 truncate">
                        <p className="text-xs font-semibold text-slate-800 truncate">{product.sellerName}</p>
                        <div className="flex items-center gap-1 text-[10px] text-slate-500">
                          <Star className="w-2.5 h-2.5 text-amber-500 fill-amber-500" />
                          <span className="font-mono tabular-nums">{product.sellerRating}</span>
                        </div>
                      </div>
                    </div>

                    {/* Chat with Seller Button */}
                    <button
                      onClick={() => handleContactSeller(product)}
                      className="flex items-center gap-1 px-3 py-1.5 bg-blue-50 hover:bg-blue-600 hover:text-white text-blue-700 font-semibold text-xs rounded-lg transition-colors cursor-pointer whitespace-nowrap"
                    >
                      <MessageSquare className="w-3.5 h-3.5" />
                      <span>Chat</span>
                    </button>
                  </div>
                </div>

              </div>
            );
          })}
        </div>
      )}

      {/* Product Detail Modal */}
      {selectedProductForDetail && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-2xl w-full max-h-[90vh] overflow-y-auto shadow-2xl p-6 relative">
            <button
              onClick={() => setSelectedProductForDetail(null)}
              className="absolute top-4 right-4 text-slate-400 hover:text-slate-700 text-lg font-bold p-2"
            >
              ✕
            </button>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mb-6">
              <div className="aspect-[4/3] rounded-2xl overflow-hidden bg-slate-100">
                <img
                  src={selectedProductForDetail.imageUrl}
                  alt={selectedProductForDetail.title}
                  referrerPolicy="no-referrer"
                  className="w-full h-full object-cover"
                />
              </div>

              <div className="flex flex-col justify-between">
                <div>
                  <div className="flex items-center gap-2 text-xs text-slate-500 mb-2">
                    <span className="font-bold text-blue-600">{selectedProductForDetail.condition}</span>
                    <span aria-hidden="true">·</span>
                    <span>{selectedProductForDetail.category}</span>
                  </div>

                  <h2 className="text-xl font-bold text-slate-900 mb-2 leading-tight">
                    {selectedProductForDetail.title}
                  </h2>

                  <p className="text-2xl font-black text-slate-900 mb-3 tabular-nums">
                    ${selectedProductForDetail.price}
                  </p>

                  <div className="flex items-center gap-1.5 text-xs text-slate-600 mb-3 bg-slate-50 p-2 rounded-xl">
                    <MapPin className="w-4 h-4 text-blue-600 shrink-0" />
                    <span>Meetup: <strong>{selectedProductForDetail.meetupLocation}</strong></span>
                  </div>
                </div>

                <div className="flex items-center gap-3 pt-3 border-t border-slate-100">
                  <img
                    src={selectedProductForDetail.sellerAvatar}
                    alt={selectedProductForDetail.sellerName}
                    referrerPolicy="no-referrer"
                    className="w-10 h-10 rounded-full object-cover border border-slate-200"
                  />
                  <div>
                    <p className="text-xs font-bold text-slate-800">{selectedProductForDetail.sellerName}</p>
                    <p className="text-[11px] text-slate-500">{selectedProductForDetail.sellerMajor}</p>
                  </div>
                </div>
              </div>
            </div>

            <div className="mb-6">
              <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500 mb-1.5">Description</h4>
              <p className="text-sm text-slate-700 leading-relaxed bg-slate-50 p-4 rounded-xl">
                {selectedProductForDetail.description}
              </p>
            </div>

            <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-100">
              <button
                onClick={() => setSelectedProductForDetail(null)}
                className="px-4 py-2.5 text-xs font-semibold text-slate-600 hover:bg-slate-100 rounded-xl"
              >
                Close
              </button>
              <button
                onClick={() => {
                  const p = selectedProductForDetail;
                  setSelectedProductForDetail(null);
                  handleContactSeller(p);
                }}
                className="px-5 py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-semibold text-xs rounded-xl flex items-center gap-2 shadow-sm"
              >
                <MessageSquare className="w-4 h-4" />
                <span>Message Seller to Buy</span>
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};
