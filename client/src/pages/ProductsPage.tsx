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

gsap.registerPlugin(ScrollTrigger);

const ProductsPage = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [total, setTotal] = useState(0);
  const [search, setSearch] = useState(searchParams.get('search') || '');
  const [showFilters, setShowFilters] = useState(false);
  const headerRef = useRef<HTMLDivElement>(null);

  const page = parseInt(searchParams.get('page') || '1');
  const category = searchParams.get('category') || '';
  const sort = searchParams.get('sort') || '';
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
    const fetchProducts = async () => {
      setLoading(true);
      try {
        const params = new URLSearchParams();
        params.set('page', String(page));
        params.set('limit', String(limit));
        if (category) params.set('category', category);
        if (search) params.set('search', search);
        if (sort) params.set('sort', sort);

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
  }, [page, category, sort, search]);

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
        <div className="bg-gradient-to-b from-blue-950/30 to-black py-20 border-b border-blue-500/20">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center">
              <div className="inline-block bg-blue-500/20 border border-blue-500/40 px-4 py-2 rounded-full mb-6">
                <p className="text-sm font-semibold text-blue-400">✨ PREMIUM PRODUCTS | PRAVARA WORLD TECH ✨</p>
              </div>
              <h1 className="text-5xl lg:text-6xl font-bold text-white mb-4">Explore Premium Products</h1>
              <p className="text-xl text-gray-300 mt-4 max-w-3xl mx-auto">
                Discover our extensive range of cinema, smart home, and security products. All items are genuine, certified, and backed by full warranties.
              </p>
            </div>
          </div>
        </div>

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
                  <div>
                    <h3 className="font-semibold text-white text-sm mb-4">Categories</h3>
                    <ul className="space-y-2">
                      <li>
                        <button
                          onClick={() => updateFilter('category', '')}
                          className={`text-sm w-full text-left py-2 px-3 rounded-lg transition-colors ${!category ? 'bg-blue-600 text-white' : 'text-gray-400 hover:bg-blue-500/10'}`}
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
