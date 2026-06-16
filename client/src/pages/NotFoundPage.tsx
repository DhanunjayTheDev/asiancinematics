import { Link, useNavigate } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { FiHome, FiArrowLeft, FiSearch } from 'react-icons/fi';

const quickLinks = [
  { to: '/solutions', label: 'Solutions' },
  { to: '/products', label: 'Shop' },
  { to: '/projects', label: 'Projects' },
  { to: '/services', label: 'Services' },
  { to: '/contact', label: 'Contact' },
];

const NotFoundPage = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-black text-white flex items-center justify-center px-6 relative overflow-hidden">
      <Helmet><title>404 – Page Not Found | Pravara World Tech</title></Helmet>

      {/* Background decorative elements */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-yellow-400/3 rounded-full blur-3xl" />
        <div className="absolute bottom-1/4 right-1/4 w-64 h-64 bg-blue-500/5 rounded-full blur-3xl" />
      </div>

      <div className="relative text-center max-w-2xl mx-auto">
        {/* 404 display */}
        <div className="relative mb-6">
          <p className="text-[160px] md:text-[220px] font-black leading-none text-transparent bg-clip-text bg-gradient-to-b from-gray-700 to-gray-900 select-none">
            404
          </p>
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="text-center">
              <div className="w-16 h-16 rounded-2xl bg-yellow-400/10 border border-yellow-400/30 flex items-center justify-center mx-auto mb-2">
                <FiSearch className="w-7 h-7 text-yellow-400" />
              </div>
            </div>
          </div>
        </div>

        <h1 className="text-3xl md:text-4xl font-bold mb-3">Page Not Found</h1>
        <p className="text-gray-400 text-lg mb-10 max-w-md mx-auto">
          The page you're looking for doesn't exist or has been moved.
        </p>

        {/* Actions */}
        <div className="flex flex-col sm:flex-row gap-3 justify-center mb-12">
          <button
            onClick={() => navigate(-1)}
            className="flex items-center justify-center gap-2 px-6 py-3 bg-gray-800 hover:bg-gray-700 text-white font-semibold rounded-xl transition-colors"
          >
            <FiArrowLeft className="w-4 h-4" /> Go Back
          </button>
          <Link
            to="/"
            className="flex items-center justify-center gap-2 px-6 py-3 bg-yellow-400 hover:bg-yellow-300 text-black font-bold rounded-xl transition-colors"
          >
            <FiHome className="w-4 h-4" /> Back to Home
          </Link>
        </div>

        {/* Quick nav */}
        <div>
          <p className="text-xs text-gray-600 uppercase tracking-widest font-semibold mb-4">Or explore</p>
          <div className="flex flex-wrap gap-2 justify-center">
            {quickLinks.map(l => (
              <Link
                key={l.to}
                to={l.to}
                className="px-4 py-2 bg-gray-900 border border-gray-800 hover:border-yellow-500/40 hover:text-yellow-400 text-gray-400 rounded-full text-sm transition-colors"
              >
                {l.label}
              </Link>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default NotFoundPage;
