import { Link } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { useEffect, useState } from 'react';
import { FiArrowRight, FiCamera, FiFilm, FiMonitor, FiTool } from 'react-icons/fi';
import api from '../lib/api';
import type { Product, Service } from '../types';
import ProductCard from '../components/ProductCard';
import Loading from '../components/Loading';

const LandingPage = () => {
  const [featuredProducts, setFeaturedProducts] = useState<Product[]>([]);
  const [services, setServices] = useState<Service[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [productsRes, servicesRes] = await Promise.all([
          api.get('/products?featured=true&limit=4'),
          api.get('/services'),
        ]);
        setFeaturedProducts(productsRes.data.data || []);
        setServices(servicesRes.data.data || []);
      } catch {
        // allow page to render
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const highlights = [
    { icon: <FiCamera className="w-6 h-6" />, title: 'Professional Equipment', desc: 'Top-tier cinematography gear for every project.' },
    { icon: <FiFilm className="w-6 h-6" />, title: 'Expert Services', desc: 'End-to-end production and post-production services.' },
    { icon: <FiMonitor className="w-6 h-6" />, title: 'Latest Technology', desc: 'Cutting-edge tech for stunning visual storytelling.' },
    { icon: <FiTool className="w-6 h-6" />, title: 'Custom Solutions', desc: 'Tailored solutions for your unique requirements.' },
  ];

  return (
    <>
      <Helmet>
        <title>Asian Cinematics | Professional Cinematography Services & Equipment</title>
        <meta name="description" content="Premium cinematography services and professional equipment for filmmakers." />
      </Helmet>

      {/* Hero */}
      <section className="bg-gradient-to-br from-primary-600 to-primary-800 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 lg:py-28">
          <div className="max-w-3xl">
            <h1 className="text-4xl lg:text-6xl font-bold leading-tight mb-6">
              Bring Your Vision
              <span className="block text-primary-200">To Life</span>
            </h1>
            <p className="text-lg text-primary-100 mb-8 max-w-xl">
              Professional cinematography equipment and expert services for filmmakers,
              content creators, and production houses.
            </p>
            <div className="flex flex-wrap gap-4">
              <Link to="/products" className="bg-white text-primary-700 px-8 py-3 rounded-lg font-semibold hover:bg-gray-100 transition-colors inline-flex items-center space-x-2">
                <span>Browse Products</span>
                <FiArrowRight />
              </Link>
              <Link to="/services" className="border-2 border-white/30 text-white px-8 py-3 rounded-lg font-semibold hover:bg-white/10 transition-colors">
                Our Services
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Highlights */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {highlights.map((h, i) => (
              <div key={i} className="card flex flex-col items-start">
                <div className="w-12 h-12 rounded-xl bg-primary-50 text-primary-600 flex items-center justify-center mb-4">
                  {h.icon}
                </div>
                <h3 className="font-semibold text-gray-900 mb-1">{h.title}</h3>
                <p className="text-sm text-gray-500">{h.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Products */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between mb-8">
            <div>
              <h2 className="text-2xl font-bold text-gray-900">Featured Products</h2>
              <p className="text-gray-500 mt-1">Handpicked equipment for professionals</p>
            </div>
            <Link to="/products" className="text-primary-600 hover:text-primary-700 font-medium text-sm inline-flex items-center space-x-1">
              <span>View All</span>
              <FiArrowRight className="w-4 h-4" />
            </Link>
          </div>
          {loading ? (
            <Loading />
          ) : featuredProducts.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {featuredProducts.map((p) => (
                <ProductCard key={p._id} product={p} />
              ))}
            </div>
          ) : (
            <p className="text-gray-500 text-center py-8">No featured products yet.</p>
          )}
        </div>
      </section>

      {/* Services Overview */}
      {services.length > 0 && (
        <section className="py-16 bg-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-12">
              <h2 className="text-2xl font-bold text-gray-900">Our Services</h2>
              <p className="text-gray-500 mt-2">Comprehensive solutions for all your needs</p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {services.slice(0, 6).map((s) => (
                <Link key={s._id} to={`/services/${s.slug}`} className="card hover:shadow-md transition-shadow group">
                  <h3 className="font-semibold text-gray-900 mb-2 group-hover:text-primary-600 transition-colors">{s.name}</h3>
                  <p className="text-sm text-gray-500 line-clamp-3">{s.shortDescription || s.description}</p>
                  <span className="text-primary-600 text-sm font-medium mt-3 inline-flex items-center space-x-1">
                    <span>Learn More</span>
                    <FiArrowRight className="w-3 h-3" />
                  </span>
                </Link>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* CTA */}
      <section className="py-16 bg-primary-600 text-white">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold mb-4">Ready to Get Started?</h2>
          <p className="text-primary-100 mb-8">Contact us today to discuss your project requirements.</p>
          <div className="flex flex-wrap justify-center gap-4">
            <Link to="/contact" className="bg-white text-primary-700 px-8 py-3 rounded-lg font-semibold hover:bg-gray-100 transition-colors">
              Get in Touch
            </Link>
            <Link to="/inquiry" className="border-2 border-white/30 px-8 py-3 rounded-lg font-semibold hover:bg-white/10 transition-colors">
              Submit Inquiry
            </Link>
          </div>
        </div>
      </section>
    </>
  );
};

export default LandingPage;
