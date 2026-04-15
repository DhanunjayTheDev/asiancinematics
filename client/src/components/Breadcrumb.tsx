import { Link, useLocation } from 'react-router-dom';
import { FiChevronRight, FiHome } from 'react-icons/fi';

const Breadcrumb = () => {
  const location = useLocation();
  const paths = location.pathname.split('/').filter(Boolean);

  if (paths.length === 0) return null;

  return (
    <nav aria-label="Breadcrumb" className="bg-black border-b border-blue-500/20">
      <div className="max-w-7xl mx-auto px-6 py-3">
        <ol className="flex items-center gap-2 text-sm">
          <li>
            <Link to="/" className="text-gray-400 hover:text-yellow-400 flex items-center">
              <FiHome className="w-4 h-4" />
            </Link>
          </li>
          {paths.map((path, index) => {
            const href = '/' + paths.slice(0, index + 1).join('/');
            const label = path.charAt(0).toUpperCase() + path.slice(1).replace(/-/g, ' ');
            const isLast = index === paths.length - 1;

            return (
              <li key={href} className="flex items-center gap-2">
                <FiChevronRight className="w-4 h-4 text-gray-600" />
                {isLast ? (
                  <span className="text-gray-300 font-semibold">{label}</span>
                ) : (
                  <Link to={href} className="text-gray-400 hover:text-yellow-400">
                    {label}
                  </Link>
                )}
              </li>
            );
          })}
        </ol>
      </div>
    </nav>
  );
};

export default Breadcrumb;
