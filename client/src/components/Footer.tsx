import { Link } from 'react-router-dom';
import { FiMail, FiPhone, FiMapPin } from 'react-icons/fi';

const Footer = () => (
  <footer className="bg-gray-900 text-gray-300">
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
        <div>
          <div className="flex items-center space-x-2 mb-4">
            <div className="w-8 h-8 bg-primary-600 rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-sm">AC</span>
            </div>
            <span className="font-semibold text-lg text-white">Asian Cinematics</span>
          </div>
          <p className="text-sm text-gray-400 leading-relaxed">
            Professional cinematography services and premium equipment for your creative projects.
          </p>
        </div>

        <div>
          <h4 className="font-semibold text-white mb-4">Quick Links</h4>
          <ul className="space-y-2 text-sm">
            <li><Link to="/products" className="hover:text-white transition-colors">Products</Link></li>
            <li><Link to="/services" className="hover:text-white transition-colors">Services</Link></li>
            <li><Link to="/contact" className="hover:text-white transition-colors">Contact Us</Link></li>
            <li><Link to="/book-visit" className="hover:text-white transition-colors">Book a Visit</Link></li>
          </ul>
        </div>

        <div>
          <h4 className="font-semibold text-white mb-4">Account</h4>
          <ul className="space-y-2 text-sm">
            <li><Link to="/profile" className="hover:text-white transition-colors">My Profile</Link></li>
            <li><Link to="/orders" className="hover:text-white transition-colors">My Orders</Link></li>
            <li><Link to="/privacy-policy" className="hover:text-white transition-colors">Privacy Policy</Link></li>
            <li><Link to="/terms" className="hover:text-white transition-colors">Terms & Conditions</Link></li>
          </ul>
        </div>

        <div>
          <h4 className="font-semibold text-white mb-4">Contact</h4>
          <ul className="space-y-3 text-sm">
            <li className="flex items-center space-x-2">
              <FiMail className="w-4 h-4 text-primary-400" />
              <span>info@asiancinematics.com</span>
            </li>
            <li className="flex items-center space-x-2">
              <FiPhone className="w-4 h-4 text-primary-400" />
              <span>+91 98765 43210</span>
            </li>
            <li className="flex items-start space-x-2">
              <FiMapPin className="w-4 h-4 text-primary-400 mt-0.5" />
              <span>123 Cinema Street, Film City, Mumbai - 400001</span>
            </li>
          </ul>
        </div>
      </div>

      <div className="border-t border-gray-800 mt-10 pt-6 text-center text-sm text-gray-500">
        &copy; {new Date().getFullYear()} Asian Cinematics. All rights reserved.
      </div>
    </div>
  </footer>
);

export default Footer;
