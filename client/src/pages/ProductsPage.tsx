import { useEffect, useState, useRef } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { FiSearch, FiFilter, FiArrowRight, FiPhone, FiCheck, FiTrendingUp, FiAward, FiStar } from 'react-icons/fi';
import { FaWhatsapp } from 'react-icons/fa';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import api from '../lib/api';
import { cacheManager } from '../lib/cache';
import type { Product, Category } from '../types';
import ProductCard from '../components/ProductCard';
import Loading from '../components/Loading';
import EmptyState from '../components/EmptyState';
import CustomSelect from '../components/CustomSelect';

type DealType = 'special_offer' | 'today_deal' | 'clearance_sale' | 'festival_offer' | 'combo_package' | 'refurbished';

const DEAL_TYPE_META: Record<DealType, { label: string; icon: string; color: string; activeColor: string }> = {
  special_offer: { label: 'Special Offers', icon: '⭐', color: 'text-yellow-400 hover:bg-yellow-400/10', activeColor: 'bg-yellow-400/20 text-yellow-300 border-yellow-400/40' },
  today_deal: { label: "Today's Deals", icon: '🔥', color: 'text-red-400 hover:bg-red-400/10', activeColor: 'bg-red-400/20 text-red-300 border-red-400/40' },
  clearance_sale: { label: 'Clearance Sale', icon: '🏷️', color: 'text-orange-400 hover:bg-orange-400/10', activeColor: 'bg-orange-400/20 text-orange-300 border-orange-400/40' },
  festival_offer: { label: 'Festival Offers', icon: '🎉', color: 'text-purple-400 hover:bg-purple-400/10', activeColor: 'bg-purple-400/20 text-purple-300 border-purple-400/40' },
  combo_package: { label: 'Combo Packages', icon: '📦', color: 'text-blue-400 hover:bg-blue-400/10', activeColor: 'bg-blue-400/20 text-blue-300 border-blue-400/40' },
  refurbished: { label: 'Refurbished', icon: '♻️', color: 'text-green-400 hover:bg-green-400/10', activeColor: 'bg-green-400/20 text-green-300 border-green-400/40' },
};

gsap.registerPlugin(ScrollTrigger);

const ProductsPage = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [deals, setDeals] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [total, setTotal] = useState(0);
  const [search, setSearch] = useState(searchParams.get('search') || '');
  const [showFilters, setShowFilters] = useState(false);
  const headerRef = useRef<HTMLDivElement>(null);

  const page = parseInt(searchParams.get('page') || '1');
  const category = searchParams.get('category') || '';
  const sort = searchParams.get('sort') || '';
  const dealType = searchParams.get('dealType') || '';
  const limit = 12;

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const cacheKey = 'products_categories';
        const cacheTTL = 30 * 60 * 1000;
        
        let cachedCategories = cacheManager.get<Category[]>(cacheKey);
        if (cachedCategories) {
          setCategories(cachedCategories);
          return;
        }
        
        let categoryPromise = cacheManager.getPendingRequest<any>(cacheKey);
        if (!categoryPromise) {
          categoryPromise = api.get('/categories');
          cacheManager.setPendingRequest(cacheKey, categoryPromise);
        }
        
        const response = await categoryPromise;
        const cats = response.data.data || [];
        
        cacheManager.set(cacheKey, cats, cacheTTL);
        setCategories(cats);
        cacheManager.clearPendingRequest(cacheKey);
      } catch {
        // allow page to render
      }
    };
    
    fetchCategories();
  }, []);

  useEffect(() => {
    api.get('/deals').then(({ data }) => setDeals(data.data || [])).catch(() => {});
  }, []);

  useEffect(() => {
    const fetchProducts = async () => {
      setLoading(true);
      try {
        const params = new URLSearchParams();
        params.set('page', String(page));
        params.set('limit', String(limit));
        if (category) params.set('category', category);
        if (search) params.set('search', search);
        if (sort) params.set('sort', sort);
        if (dealType) params.set('dealType', dealType);

        const cacheKey = `products_page_${params.toString()}`;
        const cacheTTL = 5 * 60 * 1000;
        
        let cachedProducts = cacheManager.get<Product[]>(cacheKey);
        if (cachedProducts) {
          setProducts(cachedProducts);
          setLoading(false);
          return;
        }
        
        let productPromise = cacheManager.getPendingRequest<any>(cacheKey);
        if (!productPromise) {
          productPromise = api.get(`/products?${params}`);
          cacheManager.setPendingRequest(cacheKey, productPromise);
        }
        
        const { data } = await productPromise;
        const products = data.data || [];
        
        cacheManager.set(cacheKey, products, cacheTTL);
        setProducts(products);
        setTotal(data.meta?.total || 0);
        cacheManager.clearPendingRequest(cacheKey);
      } catch {
        setProducts([]);
      } finally {
        setLoading(false);
      }
    };
    fetchProducts();
  }, [page, category, sort, search, dealType]);

  useEffect(() => {
    const ctx = gsap.context(() => {
      if (headerRef.current) {
        gsap.from(headerRef.current, {
          opacity: 0,
          y: 20,
          duration: 0.6,
          ease: 'power3.out',
        });
      }

      gsap.utils.toArray('.product-card-animate').forEach((card: any, idx: number) => {
        gsap.from(card, {
          opacity: 0,
          y: 30,
          duration: 0.6,
          delay: idx * 0.05,
          scrollTrigger: {
            trigger: card,
            start: 'top 80%',
          },
          ease: 'power3.out',
        });
      });
    });

    return () => ctx.revert();
  }, [products]);

  const updateFilter = (key: string, value: string) => {
    const params = new URLSearchParams(searchParams);
    if (value) params.set(key, value);
    else params.delete(key);
    params.set('page', '1');
    setSearchParams(params);
  };

  const totalPages = Math.ceil(total / limit);

  const whyBuyFromUs = [
    { icon: <FiCheck className="w-6 h-6" />, title: 'Genuine Products', desc: 'Authentic items from trusted manufacturers' },
    { icon: <FiTrendingUp className="w-6 h-6" />, title: 'Best Pricing', desc: 'Competitive rates without compromising quality' },
    { icon: <FiPhone className="w-6 h-6" />, title: '24/7 Support', desc: 'Expert customer support team always available' },
    { icon: <FiAward className="w-6 h-6" />, title: 'Warranty Assured', desc: 'Full manufacturer warranty on all products' },
  ];

  return (
    <>
      <Helmet><title>Products | Pravara World Tech</title></Helmet>

      <div className="min-h-screen bg-black">
        {/* Hero Section */}
        <section className="relative min-h-[380px] flex items-center border-b border-yellow-500/20 overflow-hidden">
          <img
            src="https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=1400&auto=format&fit=crop&q=60"
            alt="Premium Products"
            className="absolute inset-0 w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-black/78" />
          <div className="relative max-w-7xl mx-auto px-6 py-20 w-full">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
              <div>
                <span className="text-xs font-semibold text-yellow-400 tracking-widest uppercase mb-4 block">✨ Premium Products · Pravara World Tech</span>
                <h1 className="text-4xl md:text-6xl font-bold mb-4">Explore <span className="text-yellow-400">Premium Products</span></h1>
                <p className="text-gray-300 text-lg max-w-xl">
                  Discover our extensive range of cinema, smart home, and security products genuine, certified, and backed by full warranties.
                </p>
              </div>
              <div className="grid grid-cols-2 gap-4">
                {[
                  { icon: '🎬', label: 'Home Theatre', sub: 'Dolby Atmos Systems' },
                  { icon: '🏠', label: 'Smart Home', sub: 'Automation & IoT' },
                  { icon: '🔐', label: 'Security', sub: 'CCTV & Access Control' },
                  { icon: '💡', label: 'Lighting', sub: 'Architectural & LED' },
                ].map((item) => (
                  <div key={item.label} className="bg-black/50 backdrop-blur border border-yellow-500/20 rounded-xl p-4 flex items-center gap-3 hover:border-yellow-500/50 transition-colors">
                    <span className="text-2xl">{item.icon}</span>
                    <div>
                      <p className="text-sm font-bold text-white">{item.label}</p>
                      <p className="text-[10px] text-gray-400">{item.sub}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* Why Buy From Us */}
        <div className="py-20 border-b border-blue-500/20">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-16">
              <h2 className="text-4xl font-bold text-white mb-4 flex items-center justify-center gap-2">
                <FiStar className="w-8 h-8 text-yellow-400" />
                Why Shop With Us?
              </h2>
              <p className="text-lg text-gray-400">Trusted by 1200+ customers across India</p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
              {whyBuyFromUs.map((item, idx) => (
                <div key={idx} className="text-center">
                  <div className="inline-flex items-center justify-center w-16 h-16 bg-blue-500/20 border border-blue-500/40 rounded-full mb-4 text-blue-400">
                    {item.icon}
                  </div>
                  <h3 className="text-lg font-bold text-white mb-2">{item.title}</h3>
                  <p className="text-gray-400 text-sm">{item.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Products Section */}
        <div className="py-20">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div ref={headerRef} className="flex flex-col md:flex-row md:items-center md:justify-between mb-10">
              <div>
                <h2 className="text-4xl font-bold text-white">Browse Products</h2>
                <p className="text-gray-400 mt-2">{total} products available</p>
              </div>
              <div className="flex items-center gap-3 mt-6 md:mt-0">
                <div className="relative flex-1 md:w-72">
                  <FiSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500 w-4 h-4" />
                  <input
                    type="text"
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    onKeyDown={(e) => e.key === 'Enter' && updateFilter('search', search)}
                    placeholder="Search products..."
                    className="w-full pl-11 pr-4 py-2.5 bg-black border border-blue-500/20 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-yellow-400"
                  />
                </div>
                <button
                  onClick={() => setShowFilters(!showFilters)}
                  className="p-2.5 border border-blue-500/20 rounded-lg hover:bg-blue-500/10 md:hidden"
                >
                  <FiFilter className="w-4 h-4 text-blue-400" />
                </button>
              </div>
            </div>

            <div className="flex gap-8">
              <aside className={`${showFilters ? 'block' : 'hidden'} md:block w-full md:w-56 shrink-0`}>
                <div className="bg-black border border-blue-500/20 rounded-lg p-6 space-y-6">
                  {/* Special Deals */}
                  {deals.length > 0 && (() => {
                    const activeTypes = (Object.keys(DEAL_TYPE_META) as DealType[]).filter(t => deals.some(d => d.type === t));
                    return activeTypes.length > 0 ? (
                      <div>
                        <h3 className="font-semibold text-white text-sm mb-3">Special Deals</h3>
                        <ul className="space-y-1.5">
                          <li>
                            <button
                              onClick={() => updateFilter('dealType', '')}
                              className={`text-sm w-full text-left py-2 px-3 rounded-lg transition-colors ${!dealType ? 'bg-blue-600 text-white' : 'text-gray-400 hover:bg-blue-500/10'}`}
                            >
                              All Products
                            </button>
                          </li>
                          {activeTypes.map((type) => {
                            const meta = DEAL_TYPE_META[type];
                            const isActive = dealType === type;
                            return (
                              <li key={type}>
                                <button
                                  onClick={() => {
                                    const params = new URLSearchParams(searchParams);
                                    params.delete('category');
                                    if (dealType === type) {
                                      params.delete('dealType');
                                    } else {
                                      params.set('dealType', type);
                                    }
                                    params.set('page', '1');
                                    setSearchParams(params);
                                  }}
                                  className={`text-xs w-full text-left py-2 px-3 rounded-lg border transition-all font-medium ${isActive ? meta.activeColor : `border-transparent ${meta.color}`}`}
                                >
                                  {meta.icon} {meta.label}
                                </button>
                              </li>
                            );
                          })}
                        </ul>
                        <div className="border-t border-blue-500/10 mt-4" />
                      </div>
                    ) : null;
                  })()}

                  <div>
                    <h3 className="font-semibold text-white text-sm mb-4">Categories</h3>
                    <ul className="space-y-2">
                      <li>
                        <button
                          onClick={() => updateFilter('category', '')}
                          className={`text-sm w-full text-left py-2 px-3 rounded-lg transition-colors ${!category && !dealType ? 'bg-blue-600 text-white' : 'text-gray-400 hover:bg-blue-500/10'}`}
                        >
                          All
                        </button>
                      </li>
                      {categories.map((c) => (
                        <li key={c._id}>
                          <button
                            onClick={() => updateFilter('category', c._id)}
                            className={`text-sm w-full text-left py-2 px-3 rounded-lg transition-colors ${category === c._id ? 'bg-blue-600 text-white' : 'text-gray-400 hover:bg-blue-500/10'}`}
                          >
                            {c.name}
                          </button>
                        </li>
                      ))}
                    </ul>
                  </div>
                  <div>
                    <h3 className="font-semibold text-white text-sm mb-4">Sort By</h3>
                    <CustomSelect
                      value={sort}
                      onChange={(value) => updateFilter('sort', String(value))}
                      options={[
                        { value: '', label: 'Newest' },
                        { value: 'price_asc', label: 'Price: Low to High' },
                        { value: 'price_desc', label: 'Price: High to Low' },
                      ]}
                    />
                  </div>
                </div>
              </aside>

              <div className="flex-1">
                {loading ? (
                  <Loading />
                ) : products.length > 0 ? (
                  <>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                      {products.map((p) => (
                        <div key={p._id} className="product-card-animate">
                          <ProductCard product={p} />
                        </div>
                      ))}
                    </div>
                    {totalPages > 1 && (
                      <div className="flex justify-center mt-12 gap-2">
                        {Array.from({ length: totalPages }).map((_, i) => (
                          <button
                            key={i + 1}
                            onClick={() => updateFilter('page', String(i + 1))}
                            className={`w-10 h-10 rounded-lg text-sm font-semibold transition-all ${
                              page === i + 1 ? 'bg-blue-600 text-white' : 'bg-black border border-blue-500/20 text-gray-400 hover:border-blue-500/50'
                            }`}
                          >
                            {i + 1}
                          </button>
                        ))}
                      </div>
                    )}
                  </>
                ) : (
                  <EmptyState title="No products found" description="Try adjusting your search or filters." />
                )}
              </div>
            </div>
          </div>
        </div>

        {/* CTA Section */}
        <div className="bg-gradient-to-t from-blue-950/30 to-transparent py-16 border-t border-blue-500/20">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <h2 className="text-3xl font-bold text-white mb-4">Need Custom Quotes or Bulk Orders?</h2>
            <p className="text-gray-300 mb-8 max-w-2xl mx-auto">Contact our sales team for special pricing</p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link to="/contact" className="inline-flex items-center justify-center gap-2 px-8 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-semibold transition-colors">
                <span>Request Quote</span>
                <FiArrowRight className="w-4 h-4" />
              </Link>
              <a href="https://wa.me/919849697886" target="_blank" rel="noopener noreferrer" className="inline-flex items-center justify-center gap-2 px-8 py-3 bg-green-600 hover:bg-green-700 text-white rounded-lg font-semibold transition-colors">
                <FaWhatsapp className="w-4 h-4" />
                <span>WhatsApp Sales</span>
              </a>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default ProductsPage;
