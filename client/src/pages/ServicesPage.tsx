import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { FiArrowRight } from 'react-icons/fi';
import api from '../lib/api';
import type { Service } from '../types';
import Loading from '../components/Loading';

const ServicesPage = () => {
  const [services, setServices] = useState<Service[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get('/services').then((r) => setServices(r.data.data || [])).catch(() => {}).finally(() => setLoading(false));
  }, []);

  if (loading) return <Loading />;

  return (
    <>
      <Helmet><title>Services | Asian Cinematics</title></Helmet>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="text-center mb-12">
          <h1 className="text-3xl font-bold text-gray-900">Our Services</h1>
          <p className="text-gray-500 mt-2 max-w-xl mx-auto">
            Professional cinematography and production services tailored to your needs.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {services.map((service) => (
            <Link key={service._id} to={`/services/${service.slug}`} className="card hover:shadow-md transition-shadow group">
              {service.image && (
                <div className="aspect-video bg-gray-100 rounded-lg overflow-hidden mb-4 -mt-6 -mx-6">
                  <img src={`/uploads/${service.image}`} alt={service.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" loading="lazy" />
                </div>
              )}
              <h3 className="text-lg font-semibold text-gray-900 group-hover:text-primary-600 transition-colors mb-2">
                {service.name}
              </h3>
              <p className="text-sm text-gray-500 line-clamp-3 mb-4">
                {service.shortDescription || service.description}
              </p>
              {service.price && (
                <p className="text-primary-600 font-semibold mb-3">Starting at ₹{service.price.toLocaleString()}</p>
              )}
              <span className="text-primary-600 text-sm font-medium inline-flex items-center space-x-1">
                <span>Learn More</span>
                <FiArrowRight className="w-3 h-3" />
              </span>
            </Link>
          ))}
        </div>
      </div>
    </>
  );
};

export default ServicesPage;
