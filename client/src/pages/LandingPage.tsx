import { Link } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { useEffect, useRef, useState } from 'react';
import { FiArrowRight, FiMonitor, FiShield, FiHeadphones, FiPhone, FiHome, FiLock, FiZap, FiLayers, FiVolume2, FiGrid, FiEye, FiMusic, FiVideo, FiFilm, FiGlobe, FiPenTool, FiTool, FiSun, FiTruck } from 'react-icons/fi';
import { FaWhatsapp } from 'react-icons/fa';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import api from '../lib/api';
import { cacheManager } from '../lib/cache';
import type { Product, Service } from '../types';
import CustomSelect from '../components/CustomSelect';

gsap.registerPlugin(ScrollTrigger);

const LandingPage = () => {
  const [featuredProducts, setFeaturedProducts] = useState<Product[]>([]);
  const [services, setServices] = useState<Service[]>([]);
  const [loading, setLoading] = useState(true);
  const [consultationForm, setConsultationForm] = useState({
    name: '',
    phone: '',
    email: '',
    projectType: '',
    description: '',
  });

  const heroRef = useRef<HTMLDivElement>(null);
  const highlightsRef = useRef<HTMLDivElement>(null);
  const productsRef = useRef<HTMLDivElement>(null);
  const servicesRef = useRef<HTMLDivElement>(null);
  const statsRef = useRef<HTMLDivElement>(null);
  const ctaRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Try to get from cache first
        const productsKey = 'landing_featured_products';
        const servicesKey = 'landing_services';
        const cacheTTL = 10 * 60 * 1000; // 10 minutes
        
        let cachedProducts = cacheManager.get<Product[]>(productsKey);
        let cachedServices = cacheManager.get<Service[]>(servicesKey);
        
        // If already cached, use cached data
        if (cachedProducts && cachedServices) {
          setFeaturedProducts(cachedProducts);
          setServices(cachedServices);
          setLoading(false);
          return;
        }
        
        // Check for pending requests to avoid duplicate API calls
        let productPromise = cacheManager.getPendingRequest<any>(productsKey);
        let servicePromise = cacheManager.getPendingRequest<any>(servicesKey);
        
        if (!productPromise) {
          productPromise = api.get('/products?featured=true&limit=4');
          cacheManager.setPendingRequest(productsKey, productPromise);
        }
        
        if (!servicePromise) {
          servicePromise = api.get('/services');
          cacheManager.setPendingRequest(servicesKey, servicePromise);
        }
        
        const [productsRes, servicesRes] = await Promise.all([productPromise, servicePromise]);
        
        const products = productsRes.data.data || [];
        const services = servicesRes.data.data || [];
        
        // Store in cache
        cacheManager.set(productsKey, products, cacheTTL);
        cacheManager.set(servicesKey, services, cacheTTL);
        
        setFeaturedProducts(products);
        setServices(services);
        
        // Clear pending requests
        cacheManager.clearPendingRequest(productsKey);
        cacheManager.clearPendingRequest(servicesKey);
      } catch {
        // allow page to render
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  useEffect(() => {
    const ctx = gsap.context(() => {
      if (heroRef.current) {
        const tl = gsap.timeline();
        tl.from('.hero-overline', { opacity: 0, y: 20, duration: 0.5, ease: 'power3.out' })
          .from('.hero-title', { opacity: 0, y: 40, duration: 0.8, ease: 'power3.out' }, '-=0.2')
          .from('.hero-subtitle', { opacity: 0, y: 30, duration: 0.6, ease: 'power3.out' }, '-=0.4')
          .from('.hero-buttons', { opacity: 0, y: 20, duration: 0.5, ease: 'power3.out' }, '-=0.3');
      }

      if (highlightsRef.current) {
        // Keep cards visible
        gsap.set(highlightsRef.current.querySelectorAll('.highlight-card'), {
          opacity: 1,
          y: 0,
        });
      }

      if (productsRef.current) {
        gsap.from(productsRef.current.querySelectorAll('.section-header, .product-grid'), {
          scrollTrigger: { trigger: productsRef.current, start: 'top 80%' },
          opacity: 0, y: 30, stagger: 0.15, duration: 0.6, ease: 'power3.out',
        });
      }

      if (statsRef.current) {
        gsap.from(statsRef.current.querySelectorAll('.stat-item'), {
          scrollTrigger: { trigger: statsRef.current, start: 'top 85%' },
          opacity: 0, y: 30, stagger: 0.08, duration: 0.5, ease: 'power3.out',
        });
      }

      if (servicesRef.current) {
        gsap.from(servicesRef.current.querySelectorAll('.service-card'), {
          scrollTrigger: { trigger: servicesRef.current, start: 'top 80%' },
          opacity: 0, y: 40, stagger: 0.12, duration: 0.6, ease: 'power3.out',
        });
      }

      if (ctaRef.current) {
        gsap.from(ctaRef.current, {
          scrollTrigger: { trigger: ctaRef.current, start: 'top 85%' },
          opacity: 0, y: 40, duration: 0.7, ease: 'power3.out',
        });
      }
    });

    return () => ctx.revert();
  }, [loading]);

  const serviceHighlights = [
    { icon: <FiHome className="w-6 h-6" />, title: 'Smart Security', desc: 'Advanced CCTV and security systems for complete protection and peace of mind.' },
    { icon: <FiVolume2 className="w-6 h-6" />, title: 'Smart Entertainment', desc: 'Premium home theatre and AV systems for immersive entertainment experiences.' },
    { icon: <FiLayers className="w-6 h-6" />, title: 'Smart Living', desc: 'Home automation and smart systems that integrate all your devices seamlessly.' },
    { icon: <FiGrid className="w-6 h-6" />, title: 'Decorative & Lighting', desc: 'Premium decorative solutions and smart lighting for stunning interior aesthetics.' },
  ];

  const stats = [
    { value: '1200+', label: 'Installations' },
    { value: '15+', label: 'Years Experience' },
    { value: '24/7', label: 'Support' },
    { value: '4.9⭐', label: 'Customer Rating' },
  ];

  const projectCategories = [
    { icon: <FiFilm className="w-6 h-6" />, title: 'Home Theatre Design', desc: 'Cinema-quality entertainment systems' },
    { icon: <FiVolume2 className="w-6 h-6" />, title: 'AV Systems', desc: 'Professional audio-visual solutions' },
    { icon: <FiSun className="w-6 h-6" />, title: 'Smart Lighting', desc: 'Intelligent lighting automation' },
    { icon: <FiShield className="w-6 h-6" />, title: 'CCTV Security', desc: 'Advanced surveillance systems' },
    { icon: <FiZap className="w-6 h-6" />, title: 'Automation', desc: 'Smart home integration' },
    { icon: <FiPenTool className="w-6 h-6" />, title: 'Interior Design', desc: 'Acoustic & decorative enhancements' },
  ];

  const features = [
    { title: 'Free Site Assessment', desc: 'Complete evaluation of your space' },
    { title: 'Custom Solution Design', desc: 'Tailored to your needs and budget' },
    { title: 'Professional Installation', desc: 'Expert team with years of experience' },
    { title: 'Dedicated After-Sales', desc: '24/7 support and maintenance' },
  ];

  return (
    <>
      <Helmet>
        <title>Pravara World Tech | Smart Security, Entertainment & Living Solutions</title>
        <meta name="description" content="Complete smart home solutions including cinema AV, acoustics, security systems, decoratives and smart home automation." />
      </Helmet>

      {/* Hero Section */}
      <section ref={heroRef} className="relative bg-black overflow-hidden min-h-screen flex items-center">
        <div className="absolute inset-0 z-0" style={{
          backgroundImage: 'url("data:image/svg+xml,%3Csvg width="100" height="100" xmlns="http://www.w3.org/2000/svg"%3E%3Cdefs%3E%3ClinearGradient id="grad"%3E%3Cstop offset="0%25" style="stop-color:rgba(59,130,246,0.03)" /%3E%3C/linearGradient%3E%3C/defs%3E%3Crect width="100" height="100" fill="url(%23grad)"%3E%3C/rect%3E%3C/svg%3E")',
        }} />
        
        <div className="max-w-7xl mx-auto px-6 py-20 relative z-10 w-full">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div>
              <div className="hero-overline inline-block bg-blue-500/20 border border-blue-500/40 px-4 py-2 rounded-full mb-6">
                <p className="text-sm font-medium text-blue-400">✨ WHAT YOU EXPECT HERE SOLUTIONS MATTER</p>
              </div>
              
              <h1 className="hero-title text-5xl lg:text-6xl font-bold text-white mb-6 leading-tight">
                Smart Security &
                <br />
                <span className="text-yellow-400">Entertainment</span>
                <br />
                <span className="text-yellow-400">·</span> Smart Living
              </h1>
              
              <p className="hero-subtitle text-lg text-gray-300 mb-8 max-w-xl leading-relaxed">
                Pravara World Tech delivers comprehensive smart home solutions including cinema AV, acoustics, decoratives, intelligent lighting, and advanced security - all under one roof.
              </p>
              
              <div className="hero-buttons flex flex-nowrap gap-3 mb-8 items-center">
                <Link to="/products" className="inline-flex items-center gap-2 px-8 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-full font-semibold transition-colors whitespace-nowrap">
                  <span>Explore Products</span>
                  <FiArrowRight className="w-4 h-4" />
                </Link>
                <Link to="/book-visit" className="inline-flex items-center gap-2 px-8 py-3 bg-white/10 hover:bg-white/20 text-white border border-white/30 rounded-full font-semibold transition-colors whitespace-nowrap">
                  <span>Book Demo</span>
                </Link>
                <a href="https://wa.me/919849697886" target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-2 px-8 py-3 bg-green-500 hover:bg-green-600 text-white rounded-full font-semibold transition-colors whitespace-nowrap">
                  <FaWhatsapp className="w-4 h-4" />
                  <span>WhatsApp Us</span>
                </a>
              </div>

              <div className="flex gap-8 text-sm">
                <div className="flex items-center gap-2 text-gray-300">
                  <FiShield className="w-5 h-5 text-yellow-400" />
                  <span>Warranty Assured</span>
                </div>
                <div className="flex items-center gap-2 text-gray-300">
                  <FiHeadphones className="w-5 h-5 text-yellow-400" />
                  <span>Expert Support</span>
                </div>
              </div>
            </div>

            <div className="relative hidden lg:block h-96 bg-gradient-to-br from-blue-900/30 to-yellow-900/20 rounded-2xl border border-blue-500/20 overflow-hidden">
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="w-3/4 h-3/4 bg-gradient-conic from-blue-500 via-purple-500 to-yellow-400 rounded-xl opacity-20 blur-3xl" />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Trust Badges */}
      <section className="bg-gradient-to-r from-black via-blue-950 to-black border-y border-blue-500/20 py-8">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            <div className="text-center">
              <p className="text-3xl font-bold text-yellow-400">1200+</p>
              <p className="text-sm text-gray-400 mt-2">Installations Done</p>
            </div>
            <div className="text-center">
              <p className="text-3xl font-bold text-yellow-400">4.8⭐</p>
              <p className="text-sm text-gray-400 mt-2">Customer Rating</p>
            </div>
            <div className="text-center">
              <p className="text-3xl font-bold text-yellow-400">15+</p>
              <p className="text-sm text-gray-400 mt-2">Years Experience</p>
            </div>
            <div className="text-center">
              <p className="text-3xl font-bold text-yellow-400">Pan India</p>
              <p className="text-sm text-gray-400 mt-2">Presence</p>
            </div>
          </div>
        </div>
      </section>

      {/* Infinite Scroll Brands & Services */}
      <section className="bg-black py-6 mt-8 border-t border-b border-blue-500/30 overflow-hidden">
        <div className="scroll-container w-full">
          <div className="scroll-content">
            {[
              { icon: FiMusic, label: 'PA & Music Systems' },
              { icon: FiVideo, label: 'Video Door Phone' },
              { icon: FiZap, label: 'Solar Fence' },
              { icon: FiFilm, label: 'Pravara World Tech' },
              { icon: FiGlobe, label: 'Pravara World Tech' },
              { icon: FiLock, label: 'Smart Security Systems' },
              { icon: FiFilm, label: 'Home Theater Design' },
              { icon: FiZap, label: 'Fiber Optic Lighting' },
              { icon: FiHome, label: 'Home Automation' },
              { icon: FiEye, label: 'CCTV & Surveillance' },
              { icon: FaWhatsapp, label: 'Contact on WhatsApp' },
            ].map((item, i) => {
              const IconComponent = item.icon;
              return (
                <div key={i} className="flex-shrink-0 whitespace-nowrap">
                  <div className="inline-flex items-center gap-2 px-5 py-3 bg-gray-900/60 border border-gray-700/40 rounded-full hover:border-gray-600/60 transition-all">
                    <IconComponent className="w-4 h-4 text-gray-400" />
                    <span className="text-sm lg:text-base font-semibold text-gray-300">
                      {item.label}
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
          <div className="scroll-content" aria-hidden="true">
            {[
              { icon: FiMusic, label: 'PA & Music Systems' },
              { icon: FiVideo, label: 'Video Door Phone' },
              { icon: FiZap, label: 'Solar Fence' },
              { icon: FiFilm, label: 'Pravara World Tech' },
              { icon: FiGlobe, label: 'Pravara World Tech' },
              { icon: FiLock, label: 'Smart Security Systems' },
              { icon: FiFilm, label: 'Home Theater Design' },
              { icon: FiZap, label: 'Fiber Optic Lighting' },
              { icon: FiHome, label: 'Home Automation' },
              { icon: FiEye, label: 'CCTV & Surveillance' },
              { icon: FaWhatsapp, label: 'Contact on WhatsApp' },
            ].map((item, i) => {
              const IconComponent = item.icon;
              return (
                <div key={`duplicate-${i}`} className="flex-shrink-0 whitespace-nowrap">
                  <div className="inline-flex items-center gap-2 px-5 py-3 bg-gray-900/60 border border-gray-700/40 rounded-full hover:border-gray-600/60 transition-all">
                    <IconComponent className="w-4 h-4 text-gray-400" />
                    <span className="text-sm lg:text-base font-semibold text-gray-300">
                      {item.label}
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Complete Ecosystem Section */}
      <section ref={highlightsRef} className="bg-black py-24 lg:py-32">
        <div className="w-full max-w-full mx-auto px-6">
          <div className="text-center mb-16">
            <p className="text-blue-400 text-sm font-semibold mb-3">OUR EXPERTISE</p>
            <h2 className="text-4xl lg:text-5xl font-bold text-white max-w-3xl mx-auto leading-tight">
              Complete Smart Home &
              <br />
              Security Ecosystem
            </h2>
            <p className="text-gray-400 mt-6 max-w-2xl mx-auto">From professional cinema setups to intelligent security systems, we deliver integrated solutions that elevate your lifestyle.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
            {serviceHighlights.map((h, i) => (
              <div key={i} className="highlight-card opacity-100 bg-gradient-to-br from-blue-900/30 to-purple-900/30 border border-blue-500/20 rounded-lg p-6 hover:border-blue-500/50 transition-all">
                <div className="w-10 h-10 rounded-lg bg-yellow-400/10 flex items-center justify-center text-yellow-400 mb-4">
                  {h.icon}
                </div>
                <h3 className="font-semibold text-white mb-2 text-base">{h.title}</h3>
                <p className="text-xs text-gray-400 leading-relaxed">{h.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Product Categories */}
      <section className="bg-gradient-to-b from-black to-blue-950 py-24 lg:py-32 border-t border-blue-500/20">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-16">
            <p className="text-blue-400 text-sm font-semibold mb-3">WHAT WE OFFER</p>
            <h2 className="text-4xl lg:text-5xl font-bold text-white">Explore Our Product Categories</h2>
            <p className="text-gray-400 mt-6">Premium quality, professionally installed end-to-end services</p>
          </div>

          <div className="grid grid-cols-2 lg:grid-cols-3 gap-6">
            {projectCategories.map((cat, i) => (
              <div key={i} className="group bg-black/50 border border-blue-500/20 rounded-xl p-6 hover:border-yellow-400/50 hover:bg-black/60 transition-all cursor-pointer">
                <div className="text-blue-400 mb-3">{cat.icon}</div>
                <h3 className="font-semibold text-white mb-2">{cat.title}</h3>
                <p className="text-sm text-gray-400">{cat.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section ref={statsRef} className="bg-black py-20 border-t border-blue-500/20">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-8">
            {stats.map((s, i) => (
              <div key={i} className="stat-item text-center">
                <p className="text-5xl lg:text-6xl font-bold text-yellow-400">{s.value}</p>
                <p className="text-sm text-gray-400 mt-3 font-medium">{s.label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Projects */}
      {featuredProducts.length > 0 && (
        <section ref={productsRef} className="bg-gradient-to-b from-blue-950 to-black py-24 lg:py-32 border-t border-blue-500/20">
          <div className="max-w-7xl mx-auto px-6">
            <div className="flex items-end justify-between mb-16">
              <div>
                <p className="text-blue-400 text-sm font-semibold mb-3">SUCCESS STORIES</p>
                <h2 className="text-4xl lg:text-5xl font-bold text-white">Featured Projects</h2>
              </div>
              <Link to="/products" className="hidden sm:inline-flex items-center gap-2 px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-full text-sm font-semibold transition-colors">
                <span>View All Projects</span>
                <FiArrowRight className="w-4 h-4" />
              </Link>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {featuredProducts.map((p) => (
                <Link key={p._id} to={`/products/${p.slug}`} className="group relative bg-gradient-to-br from-blue-900/20 to-blue-800/10 border border-blue-500/20 rounded-xl overflow-hidden hover:border-yellow-400/50 transition-all">
                  {/* Product Image */}
                  <div className="relative h-48 bg-black overflow-hidden">
                    {p.images && p.images[0] ? (
                      <img 
                        src={p.images[0]} 
                        alt={p.name}
                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                      />
                    ) : (
                      <div className="w-full h-full bg-gradient-to-br from-blue-900 to-purple-900 flex items-center justify-center">
                        <FiGrid className="w-12 h-12 text-gray-600" />
                      </div>
                    )}
                  </div>
                  
                  {/* Product Info */}
                  <div className="p-4 relative z-10">
                    <h3 className="font-bold text-base text-white mb-2 line-clamp-2 group-hover:text-yellow-400 transition-colors">{p.name}</h3>
                    <p className="text-sm text-gray-400 line-clamp-2 mb-3">{p.shortDescription || p.description}</p>
                    
                    {/* Category Badge */}
                    {p.category && (
                      <div className="inline-block px-2 py-1 bg-blue-500/20 border border-blue-500/40 rounded-md mb-3">
                        <p className="text-xs font-semibold text-blue-400">{p.category.name}</p>
                      </div>
                    )}
                    
                    {/* Price Section */}
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <span className="text-lg font-bold text-yellow-400">₹{p.price}</span>
                        {p.comparePrice && p.comparePrice > p.price && (
                          <span className="text-sm text-gray-500 line-through">₹{p.comparePrice}</span>
                        )}
                      </div>
                      <span className={`text-xs font-semibold px-2 py-1 rounded ${p.stock > 0 ? 'bg-green-500/20 text-green-400' : 'bg-red-500/20 text-red-400'}`}>
                        {p.stock > 0 ? 'In Stock' : 'Out of Stock'}
                      </span>
                    </div>
                  </div>
                  
                  <div className="absolute inset-0 bg-gradient-to-r from-blue-500/5 to-yellow-400/5 opacity-0 group-hover:opacity-100 transition-opacity" />
                </Link>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Consultation Section */}
      <section className="bg-gradient-to-b from-black to-blue-950 py-24 lg:py-32 border-t border-blue-500/20">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            {/* Left Content */}
            <div ref={ctaRef}>
              <div className="inline-block px-4 py-2 bg-blue-500/20 border border-blue-500/40 rounded-full mb-6">
                <p className="text-sm font-semibold text-blue-400">FREE CONSULTATION</p>
              </div>
              
              <h2 className="text-4xl lg:text-5xl font-bold text-white mb-2 leading-tight">
                Let's Build Your
                <br />
                Smart Space Together
              </h2>
              
              <div className="w-16 h-1 bg-gradient-to-r from-blue-500 to-transparent mb-6" />
              
              <p className="text-lg text-gray-400 mb-10 leading-relaxed">
                Tell us about your project our experts will design a custom solution and get back to you within 24 hours.
              </p>

              {/* Features */}
              <div className="space-y-6 mb-12">
                {[
                  { icon: <FiZap className="w-6 h-6" />, title: 'Free Site Assessment', desc: 'We visit, evaluate and propose the best solution' },
                  { icon: <FiHome className="w-6 h-6" />, title: 'Custom System Design', desc: '3D layouts and product recommendations tailored to you' },
                  { icon: <FiTool className="w-6 h-6" />, title: 'Professional Installation', desc: 'Certified engineers with AMC support available' },
                  { icon: <FiPhone className="w-6 h-6" />, title: 'Dedicated After-Sales', desc: 'Priority helpline & maintenance team at your service' }
                ].map((feature, i) => (
                  <div key={i} className="flex gap-4">
                    <div className="text-blue-400 flex-shrink-0">{feature.icon}</div>
                    <div>
                      <h3 className="font-semibold text-white mb-1">{feature.title}</h3>
                      <p className="text-sm text-gray-400">{feature.desc}</p>
                    </div>
                  </div>
                ))}
              </div>

              {/* Contact Buttons */}
              <div className="flex flex-wrap gap-4">
                <a 
                  href="tel:+919849697886" 
                  className="inline-flex items-center gap-2 px-6 py-3 border border-blue-500/40 hover:border-blue-500/60 text-gray-300 hover:text-white rounded-full font-semibold transition-colors"
                >
                  <FiPhone className="w-5 h-5" />
                  9849697886
                </a>
                <a 
                  href="https://wa.me/919849697886" 
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 px-6 py-3 bg-green-500 hover:bg-green-600 text-white rounded-full font-semibold transition-colors"
                >
                  <FaWhatsapp className="w-5 h-5" />
                  WhatsApp Us
                </a>
              </div>
            </div>

            {/* Right Form */}
            <div className="bg-gradient-to-br from-blue-900/20 to-purple-900/20 border border-blue-500/30 rounded-xl p-8">
              <div className="border-b-2 border-blue-500 pb-4 mb-6">
                <h3 className="text-2xl font-bold text-white mb-2">Request a Free Consultation</h3>
                <p className="text-sm text-gray-400">We'll respond within 2 hours ⚡</p>
              </div>

              <form className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <input
                    type="text"
                    placeholder="Your Name *"
                    value={consultationForm.name}
                    onChange={(e) => setConsultationForm({ ...consultationForm, name: e.target.value })}
                    className="px-4 py-3 bg-blue-900/30 border border-blue-500/30 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-yellow-400"
                  />
                  <input
                    type="tel"
                    placeholder="Phone Number *"
                    value={consultationForm.phone}
                    onChange={(e) => setConsultationForm({ ...consultationForm, phone: e.target.value })}
                    className="px-4 py-3 bg-blue-900/30 border border-blue-500/30 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-yellow-400"
                  />
                </div>

                <input
                  type="email"
                  placeholder="Email Address"
                  value={consultationForm.email}
                  onChange={(e) => setConsultationForm({ ...consultationForm, email: e.target.value })}
                  className="w-full px-4 py-3 bg-blue-900/30 border border-blue-500/30 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-yellow-400"
                />

                <CustomSelect
                  value={consultationForm.projectType}
                  onChange={(value) => setConsultationForm({ ...consultationForm, projectType: String(value) })}
                  options={[
                    { value: '', label: 'Select Project Type' },
                    { value: 'home-theatre', label: 'Home Theatre' },
                    { value: 'av-acoustics', label: 'AV & Acoustics' },
                    { value: 'smart-home', label: 'Smart Home' },
                    { value: 'security', label: 'Security System' },
                    { value: 'decoratives', label: 'Decorative Solutions' },
                    { value: 'other', label: 'Other' },
                  ]}
                  placeholder="Select Project Type"
                />

                <textarea
                  placeholder="Brief Project Description..."
                  rows={4}
                  value={consultationForm.description}
                  onChange={(e) => setConsultationForm({ ...consultationForm, description: e.target.value })}
                  className="w-full px-4 py-3 bg-blue-900/30 border border-blue-500/30 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-yellow-400 resize-none"
                />

                <Link
                  to="/inquiry"
                  className="w-full flex items-center justify-center gap-2 px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-semibold transition-colors"
                >
                  <FiArrowRight className="w-5 h-5" />
                  Submit Inquiry — It's Free
                </Link>
              </form>
            </div>
          </div>
        </div>
      </section>
    </>
  );
};

export default LandingPage;
