import { useEffect, useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import api from '../lib/api';
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
    api.get(`/services/${slug}`).then((r) => setService(r.data.data)).catch(() => setService(null)).finally(() => setLoading(false));
  }, [slug]);

  if (loading) return <Loading />;
  if (!service) return <div className="text-center py-20 text-gray-500">Service not found</div>;

  return (
    <>
      <Helmet>
        <title>{service.name} | Asian Cinematics</title>
        <meta name="description" content={service.shortDescription || service.description.slice(0, 160)} />
      </Helmet>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {service.image && (
          <div className="aspect-video bg-gray-100 rounded-xl overflow-hidden mb-8">
            <img src={`/uploads/${service.image}`} alt={service.name} className="w-full h-full object-cover" />
          </div>
        )}

        <h1 className="text-3xl font-bold text-gray-900 mb-4">{service.name}</h1>
        {service.price && (
          <p className="text-xl text-primary-600 font-semibold mb-6">Starting at ₹{service.price.toLocaleString()}</p>
        )}

        <div className="prose max-w-none text-gray-600 whitespace-pre-line mb-8">
          {service.description}
        </div>

        <div className="flex flex-wrap gap-4">
          <button
            onClick={() => isAuthenticated ? navigate('/service-request') : navigate('/login?redirect=/service-request')}
            className="btn-primary"
          >
            Request This Service
          </button>
          <Link to="/contact" className="btn-secondary">
            Contact Us
          </Link>
        </div>
      </div>
    </>
  );
};

export default ServiceDetailPage;
