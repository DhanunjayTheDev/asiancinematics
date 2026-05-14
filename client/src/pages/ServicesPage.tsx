import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { FiArrowRight, FiPhone, FiMail, FiMapPin, FiCheck, FiAward, FiTrendingUp, FiUsers, FiTarget, FiGlobe, FiFilm, FiVolume2, FiHome, FiLock, FiLayers, FiHexagon, FiShoppingBag, FiSun, FiCreditCard, FiVideo, FiSettings, FiCalendar, FiLink, FiImage, FiZap } from 'react-icons/fi';
import { FaWhatsapp } from 'react-icons/fa';
import api from '../lib/api';
import { cacheManager } from '../lib/cache';
import type { Service } from '../types';
import Loading from '../components/Loading';
import SecurityServiceRequestModal from '../components/SecurityServiceRequestModal';
import LightingServiceRequestModal from '../components/LightingServiceRequestModal';
import InteriorServiceRequestModal from '../components/InteriorServiceRequestModal';
import SmartHomeServiceRequestModal from '../components/SmartHomeServiceRequestModal';
import HomeTheaterServiceRequestModal from '../components/HomeTheaterServiceRequestModal';
import StructuralServiceRequestModal from '../components/StructuralServiceRequestModal';

const ServicesPage = () => {
  const [services, setServices] = useState<Service[]>([]);
  const [loading, setLoading] = useState(true);
  const [showSecurityModal, setShowSecurityModal] = useState(false);
  const [showLightingModal, setShowLightingModal] = useState(false);
  const [showInteriorModal, setShowInteriorModal] = useState(false);
  const [showSmartHomeModal, setShowSmartHomeModal] = useState(false);
  const [showHomeTheaterModal, setShowHomeTheaterModal] = useState(false);
  const [showStructuralModal, setShowStructuralModal] = useState(false);

  useEffect(() => {
    const fetchServices = async () => {
      try {
        const cacheKey = 'services_list';
        const cacheTTL = 10 * 60 * 1000; // 10 minutes
        
        // Try to get from cache first
        let cachedServices = cacheManager.get<Service[]>(cacheKey);
        if (cachedServices) {
          setServices(cachedServices);
          setLoading(false);
          return;
        }
        
        // Check for pending request
        let servicePromise = cacheManager.getPendingRequest<any>(cacheKey);
        if (!servicePromise) {
          servicePromise = api.get('/services');
          cacheManager.setPendingRequest(cacheKey, servicePromise);
        }
        
        const response = await servicePromise;
        const svc = response.data.data || [];
        
        // Store in cache
        cacheManager.set(cacheKey, svc, cacheTTL);
        setServices(svc);
        
        // Clear pending request
        cacheManager.clearPendingRequest(cacheKey);
      } catch {
        // allow page to render
      } finally {
        setLoading(false);
      }
    };
    
    fetchServices();
  }, []);

  if (loading) return <Loading />;

  const specialties = [
    { icon: <FiFilm className="w-8 h-8" />, title: 'Home Theatre & AV', desc: 'Professional cinema grade audio-visual systems for immersive entertainment' },
    { icon: <FiVolume2 className="w-8 h-8" />, title: 'Acoustics & Sound', desc: 'Expert acoustic design and premium sound systems for perfect audio' },
    { icon: <FiHome className="w-8 h-8" />, title: 'Smart Home', desc: 'Complete home automation and smart living solutions' },
    { icon: <FiLock className="w-8 h-8" />, title: 'Security Systems', desc: 'Advanced CCTV, networking, and comprehensive security solutions' },
    { icon: <FiLayers className="w-8 h-8" />, title: 'Decorative Solutions', desc: 'Stretch ceilings, epoxy flooring, and premium interior design' },
    { icon: <FiHexagon className="w-8 h-8" />, title: 'Structural Works', desc: 'Tensile structures and custom construction solutions' },
  ];

  const whyChooseUs = [
    { icon: <FiCheck className="w-6 h-6" />, title: 'Genuine Materials', desc: 'Only authentic, verified products and materials' },
    { icon: <FiTrendingUp className="w-6 h-6" />, title: 'Best Pricing', desc: 'Competitive rates without compromising quality' },
    { icon: <FiGlobe className="w-6 h-6" />, title: 'PAN India Service', desc: 'Installation and support across entire India' },
    { icon: <FiAward className="w-6 h-6" />, title: 'Free Consultation', desc: 'Expert advice and project planning at no cost' },
  ];

  const inquiryRequirements = [
    { icon: FiUsers, text: 'Full Name' },
    { icon: FiMapPin, text: 'Location & City' },
    { icon: FiHome, text: 'Project Name/Type' },
    { icon: FiTarget, text: 'Measurements (Length × Width × Height)' },
    { icon: FiCalendar, text: 'Expected Start Date' },
    { icon: FiCreditCard, text: 'Budget (if available)' },
    { icon: FiLink, text: 'Reference Text (if any)' },
    { icon: FiImage, text: 'Reference Images (if available)' }
  ];

  return (
    <>
      <Helmet><title>Services | Pravara World Tech</title></Helmet>

      <div className="min-h-screen bg-black">
        {/* Hero Section */}
        <div className="bg-gradient-to-b from-blue-950/30 to-black py-20 border-b border-blue-500/20">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-8">
              <div className="inline-block bg-blue-500/20 border border-blue-500/40 px-4 py-2 rounded-full mb-6">
                <p className="text-sm font-semibold text-blue-400">✨ WELCOME TO PRAVARA WORLD TECH ✨</p>
              </div>
              <h1 className="text-5xl lg:text-6xl font-bold tracking-tight text-white mb-4">Where Vision Meets Innovation</h1>
              <p className="text-xl text-gray-300 mt-4 max-w-3xl mx-auto leading-relaxed">
                Premium lifestyle & smart technology solutions with 23+ years of expertise, serving 2500+ satisfied customers across India.
              </p>
            </div>

            {/* Founder Info */}
            <div className="text-center py-8 border-t border-blue-500/20 mt-12">
              <p className="text-gray-300 mb-2 flex items-center justify-center gap-2"><FiUsers className="w-5 h-5 text-yellow-400" /> <span className="font-semibold text-white">Founder & Visionary</span></p>
              <p className="text-lg text-blue-400 font-semibold">Praveen Kumar Yougi A</p>
              <p className="text-gray-400 text-sm mt-1">Asian Cinematics | Pravara World Tech | Ecop World International</p>
            </div>
          </div>
        </div>

        {/* What We Offer */}
        <div className="py-20 border-b border-blue-500/20">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-20">
              <p className="text-blue-400 text-sm font-semibold mb-3">🔷 WHAT WE OFFER</p>
              <h2 className="text-4xl lg:text-5xl font-bold text-white mb-6">Explore Our Product Categories</h2>
              <p className="text-gray-300 max-w-3xl mx-auto text-lg mb-4">Premium Quality. Complete Solutions. Professionally Delivered.</p>
              <p className="text-gray-400 max-w-3xl mx-auto">
                At Pravara World Tech, we don't just supply products we deliver complete, end-to-end solutions designed to transform your space into a smart, secure, and immersive environment.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-20">
              <div className="bg-gradient-to-br from-blue-900/20 to-black border border-blue-500/20 rounded-xl p-8 hover:border-blue-500/50 transition-all flex flex-col">
                <div className="text-3xl mb-4">🔐</div>
                <h3 className="text-xl font-bold text-white mb-2">Security Systems</h3>
                <p className="text-gray-400 mb-4">Advanced protection solutions built for total peace of mind.</p>
                <ul className="text-sm text-gray-300 space-y-2 mb-4">
                  <li>• CCTV Surveillance Systems</li>
                  <li>• Intrusion Alarm Systems</li>
                  <li>• Solar Fencing Solutions</li>
                  <li>• Remote Monitoring & Mobile Access</li>
                </ul>
                <p className="text-yellow-400 text-sm font-semibold mb-5">🛡️ Smart protection for homes, businesses, and large-scale properties.</p>
                <button
                  onClick={() => setShowSecurityModal(true)}
                  className="mt-auto flex items-center justify-center gap-2 w-full py-2.5 bg-blue-600 hover:bg-blue-700 text-white text-sm font-semibold rounded-lg transition"
                >
                  <FiZap className="w-4 h-4" /> Service Request
                </button>
              </div>

              <div className="bg-gradient-to-br from-blue-900/20 to-black border border-blue-500/20 rounded-xl p-8 hover:border-blue-500/50 transition-all flex flex-col">
                <div className="text-3xl mb-4">🏡</div>
                <h3 className="text-xl font-bold text-white mb-2">Smart Home Automation</h3>
                <p className="text-gray-400 mb-4">Control your space with intelligence and ease.</p>
                <ul className="text-sm text-gray-300 space-y-2 mb-4">
                  <li>• Smart Lighting & Scene Control</li>
                  <li>• Curtain & Blind Automation</li>
                  <li>• Smart Gate & Door Access</li>
                  <li>• Centralized App-Based Control</li>
                </ul>
                <p className="text-yellow-400 text-sm font-semibold mb-5">⚡ Convenience, efficiency, and futuristic living all in one system.</p>
                <button
                  onClick={() => setShowSmartHomeModal(true)}
                  className="mt-auto flex items-center justify-center gap-2 w-full py-2.5 bg-cyan-500 hover:bg-cyan-600 text-black text-sm font-semibold rounded-lg transition"
                >
                  <FiZap className="w-4 h-4" /> Service Request
                </button>
              </div>

              <div className="bg-gradient-to-br from-blue-900/20 to-black border border-blue-500/20 rounded-xl p-8 hover:border-blue-500/50 transition-all flex flex-col">
                <div className="text-3xl mb-4">🎬</div>
                <h3 className="text-xl font-bold text-white mb-2">Home Theater & Audio Solutions</h3>
                <p className="text-gray-400 mb-4">Bring cinematic excellence into your home.</p>
                <ul className="text-sm text-gray-300 space-y-2 mb-4">
                  <li>• Customized Home Theatre Rooms</li>
                  <li>• Living Room Cinema Setups</li>
                  <li>• Dolby Atmos & Surround Sound Systems</li>
                  <li>• Acoustic Treatment & Soundproofing</li>
                </ul>
                <p className="text-yellow-400 text-sm font-semibold mb-5">🎧 Engineered for immersive audio-visual experiences.</p>
                <button
                  onClick={() => setShowHomeTheaterModal(true)}
                  className="mt-auto flex items-center justify-center gap-2 w-full py-2.5 bg-orange-500 hover:bg-orange-600 text-black text-sm font-semibold rounded-lg transition"
                >
                  <FiZap className="w-4 h-4" /> Service Request
                </button>
              </div>

              <div className="bg-gradient-to-br from-blue-900/20 to-black border border-blue-500/20 rounded-xl p-8 hover:border-blue-500/50 transition-all flex flex-col">
                <div className="text-3xl mb-4">🎨</div>
                <h3 className="text-xl font-bold text-white mb-2">Interior & Decorative Designs</h3>
                <p className="text-gray-400 mb-4">Where aesthetics meet innovation.</p>
                <ul className="text-sm text-gray-300 space-y-2 mb-4">
                  <li>• Stretch Ceilings</li>
                  <li>• Galaxy Star Lighting Designs</li>
                  <li>• Premium Wall & Ceiling Finishes</li>
                  <li>• Customized Decorative Concepts</li>
                </ul>
                <p className="text-yellow-400 text-sm font-semibold mb-5">✨ Transform ordinary spaces into extraordinary environments.</p>
                <button
                  onClick={() => setShowInteriorModal(true)}
                  className="mt-auto flex items-center justify-center gap-2 w-full py-2.5 bg-purple-600 hover:bg-purple-700 text-white text-sm font-semibold rounded-lg transition"
                >
                  <FiZap className="w-4 h-4" /> Service Request
                </button>
              </div>

              <div className="bg-gradient-to-br from-blue-900/20 to-black border border-blue-500/20 rounded-xl p-8 hover:border-blue-500/50 transition-all flex flex-col">
                <div className="text-3xl mb-4">💡</div>
                <h3 className="text-xl font-bold text-white mb-2">Lighting Solutions</h3>
                <p className="text-gray-400 mb-4">Perfect lighting for every mood and purpose.</p>
                <ul className="text-sm text-gray-300 space-y-2 mb-4">
                  <li>• Smart Lighting Systems</li>
                  <li>• Architectural & Ambient Lighting</li>
                  <li>• Decorative Lighting Installations</li>
                  <li>• Energy-Efficient Solutions</li>
                </ul>
                <p className="text-yellow-400 text-sm font-semibold mb-5">💫 Enhancing atmosphere through intelligent illumination.</p>
                <button
                  onClick={() => setShowLightingModal(true)}
                  className="mt-auto flex items-center justify-center gap-2 w-full py-2.5 bg-yellow-500 hover:bg-yellow-600 text-black text-sm font-semibold rounded-lg transition"
                >
                  <FiZap className="w-4 h-4" /> Service Request
                </button>
              </div>

              <div className="bg-gradient-to-br from-blue-900/20 to-black border border-blue-500/20 rounded-xl p-8 hover:border-blue-500/50 transition-all flex flex-col">
                <div className="text-3xl mb-4">🏗</div>
                <h3 className="text-xl font-bold text-white mb-2">Structural Works</h3>
                <p className="text-gray-400 mb-4">Strong, stylish, and built to last.</p>
                <ul className="text-sm text-gray-300 space-y-2 mb-4">
                  <li>• Pergolas & Outdoor Structures</li>
                  <li>• Car Parking Sheds</li>
                  <li>• Tensile Fabric Canopies</li>
                  <li>• Custom Fabrication Works</li>
                </ul>
                <p className="text-yellow-400 text-sm font-semibold mb-5">🏗️ Durability meets modern architectural design.</p>
                <button
                  onClick={() => setShowStructuralModal(true)}
                  className="mt-auto flex items-center justify-center gap-2 w-full py-2.5 bg-amber-500 hover:bg-amber-600 text-black text-sm font-semibold rounded-lg transition"
                >
                  <FiZap className="w-4 h-4" /> Service Request
                </button>
              </div>
            </div>

            {/* Extended Expertise */}
            <div className="bg-gradient-to-b from-blue-900/10 to-black border border-blue-500/20 rounded-2xl p-12">
              <div className="text-center mb-12">
                <h3 className="text-3xl lg:text-4xl font-bold text-white mb-4">🎬 Our Extended Expertise</h3>
                <p className="text-gray-300">Design • Engineering • Digital Growth</p>
                <p className="text-gray-400 max-w-2xl mx-auto mt-4">We go beyond execution providing complete design, technical engineering, and digital growth solutions for both residential and commercial projects.</p>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className="bg-gradient-to-br from-purple-900/20 to-black border border-purple-500/20 rounded-xl p-8 hover:border-purple-500/50 transition-all">
                  <div className="text-3xl mb-4">🏗️</div>
                  <h4 className="text-lg font-semibold text-yellow-400 mb-3">📐 Design Drawings & Planning</h4>
                  <p className="text-gray-400 text-sm mb-4">Precision-driven planning for perfect execution.</p>
                  <ul className="text-sm text-gray-300 space-y-2 mb-4">
                    <li>• 2D Layout Drawings (Home Theatre, Security, Automation)</li>
                    <li>• Electrical & Wiring Schematics</li>
                    <li>• Structural & Installation Planning</li>
                    <li>• Custom Room Design Concepts</li>
                  </ul>
                  <p className="text-blue-400 text-sm font-semibold">📊 Plan smart. Execute perfectly.</p>
                </div>
                <div className="bg-gradient-to-br from-purple-900/20 to-black border border-purple-500/20 rounded-xl p-8 hover:border-purple-500/50 transition-all">
                  <div className="text-3xl mb-4">🖥️</div>
                  <h4 className="text-lg font-semibold text-yellow-400 mb-3">✨ 3D Rendering & Visualization</h4>
                  <p className="text-gray-400 text-sm mb-4">Experience your project before execution.</p>
                  <ul className="text-sm text-gray-300 space-y-2 mb-4">
                    <li>• Photorealistic 3D Interior Renders</li>
                    <li>• Home Theatre Visualization</li>
                    <li>• Lighting & Acoustic Simulation</li>
                    <li>• Client Presentation Designs</li>
                  </ul>
                  <p className="text-blue-400 text-sm font-semibold">✨ See it. Feel it. Approve it before execution.</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Specialties Section */}
        <div className="py-20 border-b border-blue-500/20">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-16">
              <h2 className="text-4xl font-bold text-white mb-4">Our Specialties</h2>
              <p className="text-lg text-gray-400">Comprehensive solutions for modern smart living</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {specialties.map((specialty, idx) => (
                <div key={idx} className="bg-gradient-to-br from-blue-900/20 to-purple-900/20 border border-blue-500/20 rounded-xl p-8 hover:shadow-2xl hover:shadow-blue-500/10 transition-all duration-300 hover:-translate-y-1">
                  <div className="text-blue-400 mb-4">{specialty.icon}</div>
                  <h3 className="text-xl font-bold text-white mb-2">{specialty.title}</h3>
                  <p className="text-gray-400">{specialty.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Why Choose Us */}
        <div className="py-20 border-b border-blue-500/20">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-16">
              <h2 className="text-4xl font-bold text-white mb-4 flex items-center justify-center gap-2">
                <FiTarget className="w-8 h-8 text-yellow-400" />
                Why Choose Us?
              </h2>
              <p className="text-lg text-gray-400">Industry-leading benefits and commitment to excellence</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
              {whyChooseUs.map((item, idx) => (
                <div key={idx} className="text-center">
                  <div className="inline-flex items-center justify-center w-16 h-16 bg-blue-500/20 border border-blue-500/40 rounded-full mb-4 text-blue-400">
                    {item.icon}
                  </div>
                  <h3 className="text-lg font-bold text-white mb-2">{item.title}</h3>
                  <p className="text-gray-400 text-sm">{item.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Project Inquiry Section */}
        <div className="py-20 border-b border-blue-500/20">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-16">
              <h2 className="text-4xl font-bold text-white mb-4 flex items-center justify-center gap-2">
                <FiShoppingBag className="w-8 h-8 text-yellow-400" />
                Ready for Your Project?
              </h2>
              <p className="text-lg text-gray-400">Share these details for a perfect quotation</p>
            </div>

            <div className="bg-gradient-to-br from-blue-900/20 to-purple-900/20 border border-blue-500/20 rounded-2xl p-12">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12">
                <div>
                  <h3 className="text-2xl font-bold text-white mb-6">What We Need From You</h3>
                  <ul className="space-y-4">
                    {inquiryRequirements.map((req, idx) => {
                      const IconComponent = req.icon;
                      return (
                        <li key={idx} className="flex items-start gap-3 text-gray-300">
                          <IconComponent className="w-4 h-4 text-blue-400 flex-shrink-0 mt-1" />
                          <span>{req.text}</span>
                        </li>
                      );
                    })}
                  </ul>
                </div>

                <div>
                  <h3 className="text-2xl font-bold text-white mb-6">What You'll Receive</h3>
                  <div className="space-y-4">
                    <div className="flex items-start gap-3 bg-blue-500/10 border border-blue-500/20 rounded-lg p-4">
                      <span className="text-yellow-400 text-xl">✔</span>
                      <div>
                        <p className="font-semibold text-white">Professional Quotation</p>
                        <p className="text-sm text-gray-400">Detailed breakdown with pricing</p>
                      </div>
                    </div>
                    <div className="flex items-start gap-3 bg-blue-500/10 border border-blue-500/20 rounded-lg p-4">
                      <span className="text-yellow-400 text-xl">✔</span>
                      <div>
                        <p className="font-semibold text-white">Expert Suggestions</p>
                        <p className="text-sm text-gray-400">Personalized recommendations</p>
                      </div>
                    </div>
                    <div className="flex items-start gap-3 bg-blue-500/10 border border-blue-500/20 rounded-lg p-4">
                      <span className="text-yellow-400 text-xl">✔</span>
                      <div>
                        <p className="font-semibold text-white">Project Plan</p>
                        <p className="text-sm text-gray-400">Timeline & implementation strategy</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <div className="bg-black/50 rounded-xl p-8 border border-blue-500/20">
                <p className="text-center text-gray-300 mb-6 flex items-center justify-center gap-2"><FiCheck className="w-5 h-5 text-blue-400" /> Once received, our expert team will review your details and get back with a comprehensive proposal</p>
                <div className="flex flex-col sm:flex-row gap-4 justify-center">
                  <Link to="/inquiry" className="inline-flex items-center justify-center gap-2 px-8 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-semibold transition-colors">
                    <span>Submit Project Inquiry</span>
                    <FiArrowRight className="w-4 h-4" />
                  </Link>
                  <a href="https://wa.me/919849697886" target="_blank" rel="noopener noreferrer" className="inline-flex items-center justify-center gap-2 px-8 py-3 bg-green-600 hover:bg-green-700 text-white rounded-lg font-semibold transition-colors">
                    <FaWhatsapp className="w-4 h-4" />
                    <span>WhatsApp Us Now</span>
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Quick Support Section */}
        <div className="py-20 border-b border-blue-500/20">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-16">
              <h2 className="text-4xl font-bold text-white mb-4 flex items-center justify-center gap-2">
                <FiPhone className="w-8 h-8 text-yellow-400" />
                Quick Support
              </h2>
              <p className="text-lg text-gray-400">Get in touch with our expert team</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <a href="tel:9849697886" className="bg-gradient-to-br from-blue-900/20 to-purple-900/20 border border-blue-500/20 rounded-xl p-8 text-center hover:shadow-2xl hover:shadow-blue-500/10 transition-all duration-300 hover:-translate-y-1">
                <FiPhone className="w-12 h-12 text-blue-400 mx-auto mb-4" />
                <h3 className="text-xl font-bold text-white mb-2">Primary Contact</h3>
                <p className="text-2xl font-semibold text-blue-400">9849697886</p>
              </a>

              <a href="tel:9966167886" className="bg-gradient-to-br from-blue-900/20 to-purple-900/20 border border-blue-500/20 rounded-xl p-8 text-center hover:shadow-2xl hover:shadow-blue-500/10 transition-all duration-300 hover:-translate-y-1">
                <FiPhone className="w-12 h-12 text-blue-400 mx-auto mb-4" />
                <h3 className="text-xl font-bold text-white mb-2">Alternate Numbers</h3>
                <p className="text-lg font-semibold text-blue-400">9966167886</p>
                <p className="text-sm text-gray-400 mt-2">9951114381 | 8143550515</p>
              </a>

              <a href="https://wa.me/919849697886" target="_blank" rel="noopener noreferrer" className="bg-gradient-to-br from-green-900/20 to-green-900/10 border border-green-500/20 rounded-xl p-8 text-center hover:shadow-2xl hover:shadow-green-500/10 transition-all duration-300 hover:-translate-y-1">
                <FaWhatsapp className="w-12 h-12 text-green-400 mx-auto mb-4" />
                <h3 className="text-xl font-bold text-white mb-2">WhatsApp Support</h3>
                <p className="text-2xl font-semibold text-green-400">Chat Now</p>
              </a>
            </div>
          </div>
        </div>

        {/* Service Categories */}
        <div className="py-20">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-16">
              <h2 className="text-4xl font-bold text-white mb-4">Service Categories We Handle</h2>
              <p className="text-lg text-gray-400">From concept to completion</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {[
                { title: 'Home Theatre', icon: <FiFilm className="w-6 h-6" /> },
                { title: 'Acoustics', icon: <FiVolume2 className="w-6 h-6" /> },
                { title: 'Stretch Ceilings', icon: <FiLayers className="w-6 h-6" /> },
                { title: 'Epoxy Flooring', icon: <FiTarget className="w-6 h-6" /> },
                { title: 'Smart Lighting', icon: <FiSun className="w-6 h-6" /> },
                { title: 'CCTV Systems', icon: <FiVideo className="w-6 h-6" /> },
                { title: 'Security Solutions', icon: <FiLock className="w-6 h-6" /> },
                { title: 'Custom Projects', icon: <FiSettings className="w-6 h-6" /> },
              ].map((cat, idx) => (
                <div key={idx} className="bg-gradient-to-br from-blue-900/20 to-purple-900/20 border border-blue-500/20 rounded-lg p-6 text-center hover:shadow-xl hover:shadow-blue-500/10 transition-all duration-300">
                  <div className="text-blue-400 mb-3 flex justify-center">{cat.icon}</div>
                  <p className="font-semibold text-white">{cat.title}</p>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* CTA Footer */}
        <div className="bg-gradient-to-t from-blue-950/30 to-transparent py-16 border-t border-blue-500/20">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <h2 className="text-3xl font-bold text-white mb-4">Ready to Transform Your Space?</h2>
            <p className="text-gray-300 mb-8 max-w-2xl mx-auto">
              Contact us today for a free consultation. Let our expert team help you create the perfect solution for your needs.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link to="/contact" className="inline-flex items-center justify-center gap-2 px-8 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-semibold transition-colors">
                <span>Get Started</span>
                <FiArrowRight className="w-4 h-4" />
              </Link>
              <a href="https://wa.me/919849697886" target="_blank" rel="noopener noreferrer" className="inline-flex items-center justify-center gap-2 px-8 py-3 bg-green-600 hover:bg-green-700 text-white rounded-lg font-semibold transition-colors">
                <FaWhatsapp className="w-4 h-4" />
                <span>Chat Now</span>
              </a>
            </div>
          </div>
        </div>
      </div>

      <SecurityServiceRequestModal isOpen={showSecurityModal} onClose={() => setShowSecurityModal(false)} />
      <LightingServiceRequestModal isOpen={showLightingModal} onClose={() => setShowLightingModal(false)} />
      <InteriorServiceRequestModal isOpen={showInteriorModal} onClose={() => setShowInteriorModal(false)} />
      <SmartHomeServiceRequestModal isOpen={showSmartHomeModal} onClose={() => setShowSmartHomeModal(false)} />
      <HomeTheaterServiceRequestModal isOpen={showHomeTheaterModal} onClose={() => setShowHomeTheaterModal(false)} />
      <StructuralServiceRequestModal isOpen={showStructuralModal} onClose={() => setShowStructuralModal(false)} />
    </>
  );
};

export default ServicesPage;
