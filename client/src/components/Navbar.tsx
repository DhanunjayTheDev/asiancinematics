import { Link, NavLink } from 'react-router-dom';
import { FiMenu, FiX, FiShoppingCart, FiUser, FiChevronDown } from 'react-icons/fi';
import { useState, useRef, useEffect } from 'react';
import { useAuthStore } from '../store/authStore';
import { useCartStore } from '../store/cartStore';
import logo from '../assets/pravaratechlogo.jpeg';

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [solutionsOpen, setSolutionsOpen] = useState(false);
  const solutionsRef = useRef<HTMLDivElement>(null);
  const { isAuthenticated, user } = useAuthStore();
  const items = useCartStore((s) => s.items);
  const cartCount = items.length;

  useEffect(() => {
    const handleOutsideClick = (e: MouseEvent) => {
      if (solutionsRef.current && !solutionsRef.current.contains(e.target as Node)) {
        setSolutionsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleOutsideClick);
    return () => document.removeEventListener('mousedown', handleOutsideClick);
  }, []);

  const navLinks = [
    { to: '/', label: 'HOME' },
    { to: '/products', label: 'SHOP' },
    { to: '/solutions', label: 'SOLUTIONS' },
    { to: '/structural-works', label: 'STRUCTURAL WORKS' },
    { to: '/projects', label: 'PROJECTS' },
    { to: '/services', label: 'SERVICES' },
    { to: '/brands', label: 'BRANDS' },
    { to: '/partner-network', label: 'PARTNER NETWORK' },
    { to: '/forums', label: 'FORUMS' },
    { to: '/about', label: 'ABOUT US' },
    { to: '/contact', label: 'CONTACT' },
  ];

  return (
    <header className="sticky top-0 z-50 bg-black border-b border-yellow-500/20">
      {/* Top bar */}
      <div className="max-w-7xl mx-auto px-4 py-3">
        <div className="flex items-center justify-between">
          {/* Logo + Branding */}
          <Link to="/" className="flex items-center gap-3 shrink-0">
            <img
              src={logo}
              alt="Pravara World Tech"
              className="w-12 h-12 rounded-full border-2 border-yellow-400 object-cover"
            />
            <div className="hidden sm:block">
              <h1 className="text-base font-bold leading-tight">
                <span className="text-red-500">P</span>
                <span className="text-white">ravara</span>
                <span className="text-yellow-400"> World</span>
                <span className="text-white"> Tech</span>
              </h1>
              <p className="text-[10px] text-gray-400 leading-tight">SMART HOME · SECURITY · DECORATIVES</p>
            </div>
          </Link>

          {/* Right Side */}
          <div className="flex items-center space-x-3">
            {/* Cart Icon */}
            <Link to="/cart" className="relative flex items-center justify-center w-9 h-9 text-gray-300 hover:text-yellow-400 transition-colors">
              <FiShoppingCart className="w-5 h-5" />
              {cartCount > 0 && (
                <span className="absolute -top-1 -right-1 bg-yellow-400 text-black text-[10px] font-bold w-4 h-4 rounded-full flex items-center justify-center">
                  {cartCount}
                </span>
              )}
            </Link>

            {isAuthenticated && user ? (
              <Link
                to="/profile"
                className="hidden md:flex items-center gap-2 px-4 py-1.5 bg-blue-600/20 border border-blue-500/40 text-white rounded-full text-xs font-semibold hover:bg-blue-600/40 transition-colors"
              >
                <FiUser className="w-3.5 h-3.5" />
                <span>{user.name?.split(' ')[0] || 'Profile'}</span>
              </Link>
            ) : (
              <Link
                to="/login"
                className="hidden md:inline-flex items-center gap-1.5 px-4 py-1.5 bg-yellow-400 text-black rounded-full text-xs font-bold hover:bg-yellow-300 transition-colors"
              >
                LOGIN / REGISTER
              </Link>
            )}

            <button
              className="lg:hidden text-yellow-400 hover:text-yellow-300 transition-colors"
              onClick={() => setIsOpen(!isOpen)}
              aria-label="Toggle menu"
            >
              {isOpen ? <FiX className="w-6 h-6" /> : <FiMenu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Navigation Bar */}
      <div className="hidden lg:block border-t border-yellow-500/10 bg-black/80 backdrop-blur-sm">
        <nav className="max-w-7xl mx-auto px-4">
          <ul className="flex items-center gap-0">
            {navLinks.map((link) => (
              <li key={link.to}>
                <NavLink
                  to={link.to}
                  end={link.to === '/'}
                  className={({ isActive }) =>
                    `block px-3 py-3 text-[11px] font-semibold tracking-wider whitespace-nowrap transition-colors duration-200 border-b-2 ${
                      isActive
                        ? 'text-yellow-400 border-yellow-400'
                        : 'text-gray-300 border-transparent hover:text-yellow-400 hover:border-yellow-400/50'
                    }`
                  }
                >
                  {link.label}
                </NavLink>
              </li>
            ))}
          </ul>
        </nav>
      </div>

      {/* Mobile Menu */}
      <div className={`lg:hidden overflow-hidden transition-all duration-300 ${isOpen ? 'max-h-screen opacity-100' : 'max-h-0 opacity-0'}`}>
        <div className="bg-black/95 border-t border-yellow-500/20 py-4 px-5">
          <nav className="flex flex-col">
            {navLinks.map((link) => (
              <NavLink
                key={link.to}
                to={link.to}
                end={link.to === '/'}
                className={({ isActive }) =>
                  `py-2.5 text-xs font-semibold tracking-wider transition-colors border-b border-gray-800 ${
                    isActive ? 'text-yellow-400' : 'text-gray-300 hover:text-yellow-400'
                  }`
                }
                onClick={() => setIsOpen(false)}
              >
                {link.label}
              </NavLink>
            ))}
            <div className="mt-4 pt-3 border-t border-yellow-500/20">
              {isAuthenticated && user ? (
                <Link
                  to="/profile"
                  className="block w-full text-center px-4 py-2.5 bg-blue-600/20 border border-blue-500/40 text-white rounded-full text-xs font-semibold hover:bg-blue-600/40 transition-colors"
                  onClick={() => setIsOpen(false)}
                >
                  <span className="flex items-center justify-center gap-2">
                    <FiUser className="w-4 h-4" />
                    {user.name || 'Profile'}
                  </span>
                </Link>
              ) : (
                <Link
                  to="/login"
                  className="block w-full text-center px-4 py-2.5 bg-yellow-400 text-black rounded-full text-xs font-bold hover:bg-yellow-300 transition-colors"
                  onClick={() => setIsOpen(false)}
                >
                  LOGIN / REGISTER
                </Link>
              )}
            </div>
          </nav>
        </div>
      </div>
    </header>
  );
};

export default Navbar;
