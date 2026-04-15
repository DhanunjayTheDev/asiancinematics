import { useEffect, useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import api from '../lib/api';
import { cacheManager } from '../lib/cache';
import type { Service } from '../types';
import Loading from '../components/Loading';
import { useAuthStore } from '../store/authStore';

const ServiceDetailPage = () => {
  const { slug } = useParams<{ slug: string }>();
  const navigate = useNavigate();
  const { isAuthenticated } = useAuthStore();
  const [service, setService] = useState<Service | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchService = async () => {
      try {
        const cacheKey = `service_${slug}`;
        const cacheTTL = 15 * 60 * 1000; // 15 minutes
        
        // Try to get from cache first
        let cachedService = cacheManager.get<Service>(cacheKey);
        if (cachedService) {
          setService(cachedService);
          setLoading(false);
          return;
        }
        
        // Check for pending request
        let servicePromise = cacheManager.getPendingRequest<any>(cacheKey);
        if (!servicePromise) {
          servicePromise = api.get(`/services/${slug}`);
          cacheManager.setPendingRequest(cacheKey, servicePromise);
        }
        
        const response = await servicePromise;
        
        // Store in cache
        cacheManager.set(cacheKey, response.data.data, cacheTTL);
        setService(response.data.data);
        
        // Clear pending request
        cacheManager.clearPendingRequest(cacheKey);
      } catch {
        setService(null);
      } finally {
        setLoading(false);
      }
    };
    
    fetchService();
  }, [slug]);

  if (loading) return <Loading />;
  if (!service) return <div className="min-h-screen bg-black flex items-center justify-center text-center text-gray-400">Service not found</div>;

  return (
    <>
      <Helmet>
        <title>{service.name} | Pravara World Tech</title>
        <meta name="description" content={service.shortDescription || service.description.slice(0, 160)} />
      </Helmet>

      <div className="min-h-screen bg-black py-12">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          {service.image && (
            <div className="aspect-video bg-gray-800 rounded-xl overflow-hidden mb-8 border border-blue-500/20">
              <img src={`/uploads/${service.image}`} alt={service.name} className="w-full h-full object-cover" />
            </div>
          )}

          <h1 className="text-4xl lg:text-5xl font-bold text-white mb-4">{service.name}</h1>
          {service.price && (
            <p className="text-2xl text-yellow-400 font-bold mb-8">Starting at ₹{service.price.toLocaleString()}</p>
          )}

          <div className="prose prose-invert max-w-none text-gray-300 whitespace-pre-line mb-10 leading-relaxed">
            {service.description}
          </div>

          <div className="flex flex-wrap gap-4">
            <button
              onClick={() => isAuthenticated ? navigate('/service-request') : navigate('/login?redirect=/service-request')}
              className="px-8 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-semibold transition-colors"
            >
              Request This Service
            </button>
            <Link to="/contact" className="px-8 py-3 border border-blue-500/40 hover:border-blue-500/60 text-gray-300 hover:text-white rounded-lg font-semibold transition-colors">
              Contact Us
            </Link>
          </div>
        </div>
      </div>
    </>
  );
};

export default ServiceDetailPage;
