import { Link } from 'react-router-dom';
import { FiMail, FiPhone, FiMapPin, FiFacebook, FiInstagram, FiLinkedin, FiTwitter } from 'react-icons/fi';
import footerLogo from '../assets/pravarafooterlogo.jpeg';

const Footer = () => (
  <footer className="bg-black border-t border-blue-500/20">
    <div className="max-w-7xl mx-auto px-6">
      {/* Main Footer */}
      <div className="py-16 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-8">
        {/* Brand */}
        <div className="lg:col-span-1">
          <img src={footerLogo} alt="Pravara World Tech" className="w-40 h-40 object-cover mb-4" />
          <h4 className="text-lg font-bold text-white mb-2">Pravara World Tech</h4>
          <p className="text-xs text-gray-400 leading-relaxed mb-4">
            Premier smart technology & lifestyle solutions — Home Theatre, Smart Home, Security, Decoratives, and Structural Works. PAN India service.
          </p>
          <div className="flex gap-4">
            <a href="#" className="w-8 h-8 rounded-full bg-blue-500/20 flex items-center justify-center text-blue-400 hover:bg-blue-500/30 transition-colors">
              <FiFacebook className="w-4 h-4" />
            </a>
            <a href="#" className="w-8 h-8 rounded-full bg-blue-500/20 flex items-center justify-center text-blue-400 hover:bg-blue-500/30 transition-colors">
              <FiInstagram className="w-4 h-4" />
            </a>
            <a href="#" className="w-8 h-8 rounded-full bg-blue-500/20 flex items-center justify-center text-blue-400 hover:bg-blue-500/30 transition-colors">
              <FiLinkedin className="w-4 h-4" />
            </a>
          </div>
        </div>

        {/* Quick Links */}
        <div>
          <h4 className="text-sm font-semibold text-white mb-4">Quick Links</h4>
          <ul className="space-y-3 text-xs text-gray-400">
            <li><Link to="/solutions" className="hover:text-yellow-400 transition-colors">Solutions</Link></li>
            <li><Link to="/structural-works" className="hover:text-yellow-400 transition-colors">Structural Works</Link></li>
            <li><Link to="/projects" className="hover:text-yellow-400 transition-colors">Projects</Link></li>
            <li><Link to="/brands" className="hover:text-yellow-400 transition-colors">Brands</Link></li>
            <li><Link to="/partner-network" className="hover:text-yellow-400 transition-colors">Partner Network</Link></li>
            <li><Link to="/forums" className="hover:text-yellow-400 transition-colors">Forums</Link></li>
          </ul>
        </div>

        {/* Services */}
        <div>
          <h4 className="text-sm font-semibold text-white mb-4">Services</h4>
          <ul className="space-y-3 text-xs text-gray-400">
            <li><Link to="/services" className="hover:text-yellow-400 transition-colors">Installation</Link></li>
            <li><Link to="/services" className="hover:text-yellow-400 transition-colors">Consultation</Link></li>
            <li><Link to="/book-visit" className="hover:text-yellow-400 transition-colors">Site Visit</Link></li>
            <li><Link to="/inquiry" className="hover:text-yellow-400 transition-colors">Project Inquiry</Link></li>
            <li><Link to="/contact" className="hover:text-yellow-400 transition-colors">Support</Link></li>
          </ul>
        </div>

        {/* Company */}
        <div>
          <h4 className="text-sm font-semibold text-white mb-4">Company</h4>
          <ul className="space-y-3 text-xs text-gray-400">
            <li><Link to="/about" className="hover:text-yellow-400 transition-colors">About Us</Link></li>
            <li><Link to="/projects" className="hover:text-yellow-400 transition-colors">Our Projects</Link></li>
            <li><Link to="/partner-network" className="hover:text-yellow-400 transition-colors">Careers / Partner</Link></li>
            <li><Link to="/forums" className="hover:text-yellow-400 transition-colors">Community Forum</Link></li>
            <li><Link to="/contact" className="hover:text-yellow-400 transition-colors">Contact</Link></li>
          </ul>
        </div>

        {/* Contact */}
        <div>
          <h4 className="text-sm font-semibold text-white mb-4">Get in Touch</h4>
          <ul className="space-y-3 text-xs text-gray-400">
            <li>
              <a href="tel:+919849697886" className="hover:text-yellow-400 transition-colors flex items-center gap-2">
                <FiPhone className="w-3.5 h-3.5 flex-shrink-0 text-yellow-400" />
                <span>+91 98496 97886</span>
              </a>
            </li>
            <li>
              <a href="tel:+919966167886" className="hover:text-yellow-400 transition-colors flex items-center gap-2">
                <FiPhone className="w-3.5 h-3.5 flex-shrink-0 text-yellow-400" />
                <span>+91 99661 67886</span>
              </a>
            </li>
            <li>
              <a href="mailto:info@pravaraworldtech.com" className="hover:text-yellow-400 transition-colors flex items-center gap-2">
                <FiMail className="w-3.5 h-3.5 flex-shrink-0 text-yellow-400" />
                <span>info@pravaraworldtech.com</span>
              </a>
            </li>
            <li className="flex items-center gap-2 text-gray-500">
              <FiMapPin className="w-3.5 h-3.5 flex-shrink-0 text-yellow-400" />
              <span>Hyderabad, India</span>
            </li>
          </ul>
        </div>
      </div>

      {/* Divider */}
      <div className="border-t border-blue-500/20"></div>

      {/* Bottom Footer */}
      <div className="py-6 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-gray-500">
        <p>&copy; {new Date().getFullYear()} Pravara World Tech. All rights reserved.</p>
        <div className="flex items-center gap-6">
          <Link to="/" className="hover:text-yellow-400 transition-colors">Privacy Policy</Link>
          <Link to="/" className="hover:text-yellow-400 transition-colors">Terms & Conditions</Link>
          <Link to="/" className="hover:text-yellow-400 transition-colors">Disclaimer</Link>
        </div>
      </div>
    </div>
  </footer>
);

export default Footer;
