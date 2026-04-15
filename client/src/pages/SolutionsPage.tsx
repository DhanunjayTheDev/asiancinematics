import { Link } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { FiHome, FiShield, FiZap, FiMonitor, FiLayers, FiEye, FiWifi, FiSun, FiArrowRight } from 'react-icons/fi';

const solutions = [
  {
    icon: FiMonitor,
    title: 'Home Theatre & AV',
    desc: 'Premium home cinema systems with immersive audio-visual experiences. Dolby Atmos, 4K projection, custom screen installations.',
    tags: ['Dolby Atmos', '4K Projectors', 'Acoustic Panels', 'Screen Installation'],
    color: 'from-red-500/20 to-orange-500/20',
    border: 'border-red-500/30',
    link: '/products?category=home-theatre',
  },
  {
    icon: FiLayers,
    title: 'Decoratives & Stretch Ceiling',
    desc: 'Transform your spaces with our luxury stretch ceiling systems, star ceilings, and premium decorative solutions.',
    tags: ['Stretch Ceiling', 'Star Ceiling', 'LED Panels', 'Custom Designs'],
    color: 'from-purple-500/20 to-pink-500/20',
    border: 'border-purple-500/30',
    link: '/products?category=decoratives',
  },
  {
    icon: FiLayers,
    title: 'Epoxy Flooring',
    desc: 'High-durability epoxy flooring solutions for residential and commercial spaces with aesthetic finishes.',
    tags: ['3D Epoxy', 'Metallic Epoxy', 'Commercial Grade', 'Self-Leveling'],
    color: 'from-yellow-500/20 to-green-500/20',
    border: 'border-yellow-500/30',
    link: '/products?category=epoxy',
  },
  {
    icon: FiHome,
    title: 'Home Automation',
    desc: 'Intelligent smart home solutions — control lighting, climate, security, and entertainment from one interface.',
    tags: ['Smart Lighting', 'Climate Control', 'Voice Control', 'App Integration'],
    color: 'from-blue-500/20 to-cyan-500/20',
    border: 'border-blue-500/30',
    link: '/products?category=home-automation',
  },
  {
    icon: FiZap,
    title: 'Smart Home Solutions',
    desc: 'End-to-end smart home ecosystem design, installation, and integration for modern living.',
    tags: ['IoT Devices', 'Smart Switches', 'Automation Panels', 'Integration'],
    color: 'from-emerald-500/20 to-teal-500/20',
    border: 'border-emerald-500/30',
    link: '/products?category=smart-home',
  },
  {
    icon: FiShield,
    title: 'Security Systems',
    desc: 'Comprehensive security solutions including CCTV surveillance, access control, and alarm systems.',
    tags: ['CCTV', 'Access Control', 'Alarm Systems', 'Video Analytics'],
    color: 'from-red-500/20 to-yellow-500/20',
    border: 'border-red-400/30',
    link: '/products?category=security',
  },
  {
    icon: FiWifi,
    title: 'Networking Solutions',
    desc: 'Enterprise-grade structured networking, Wi-Fi solutions, and data cabling for homes and businesses.',
    tags: ['Structured Cabling', 'Wi-Fi 6', 'Network Switches', 'Fiber Optics'],
    color: 'from-indigo-500/20 to-blue-500/20',
    border: 'border-indigo-500/30',
    link: '/products?category=networking',
  },
  {
    icon: FiSun,
    title: 'Lighting Solutions',
    desc: 'Architectural and decorative LED lighting systems for ambiance, energy efficiency, and smart control.',
    tags: ['LED Lighting', 'RGBW Control', 'Ambient Lighting', 'Outdoor Lighting'],
    color: 'from-amber-500/20 to-yellow-400/20',
    border: 'border-amber-500/30',
    link: '/products?category=lighting',
  },
];

const SolutionsPage = () => (
  <div className="min-h-screen bg-black text-white">
    <Helmet>
      <title>Solutions | Pravara World Tech</title>
    </Helmet>

    {/* Hero */}
    <section className="py-20 px-6 text-center border-b border-yellow-500/20 relative overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-b from-yellow-500/5 to-transparent pointer-events-none" />
      <div className="relative max-w-3xl mx-auto">
        <span className="text-xs font-semibold text-yellow-400 tracking-widest uppercase mb-4 block">Complete Ecosystem</span>
        <h1 className="text-4xl md:text-5xl font-bold mb-4">
          Our <span className="text-yellow-400">Solutions</span>
        </h1>
        <p className="text-gray-400 text-lg">
          Where Vision Meets Innovation — Premium lifestyle & smart technology solutions for modern homes and businesses.
        </p>
      </div>
    </section>

    {/* Solutions Grid */}
    <section className="py-16 px-6">
      <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {solutions.map((sol) => (
          <Link
            key={sol.title}
            to={sol.link}
            className={`group relative bg-gradient-to-br ${sol.color} border ${sol.border} rounded-2xl p-6 hover:scale-[1.02] transition-transform duration-300 cursor-pointer`}
          >
            <div className="mb-4 w-12 h-12 rounded-xl bg-white/5 flex items-center justify-center">
              <sol.icon className="w-6 h-6 text-yellow-400" />
            </div>
            <h3 className="text-lg font-bold mb-2 text-white">{sol.title}</h3>
            <p className="text-sm text-gray-400 mb-4 leading-relaxed">{sol.desc}</p>
            <div className="flex flex-wrap gap-1.5 mb-4">
              {sol.tags.map((tag) => (
                <span key={tag} className="text-[10px] px-2 py-0.5 bg-white/5 rounded-full text-gray-400">
                  {tag}
                </span>
              ))}
            </div>
            <span className="text-xs text-yellow-400 font-semibold flex items-center gap-1 group-hover:gap-2 transition-all">
              Explore <FiArrowRight className="w-3 h-3" />
            </span>
          </Link>
        ))}
      </div>
    </section>

    {/* CTA */}
    <section className="py-16 px-6 text-center border-t border-yellow-500/20">
      <div className="max-w-2xl mx-auto">
        <h2 className="text-3xl font-bold mb-4">Ready to Transform Your Space?</h2>
        <p className="text-gray-400 mb-8">Get a free consultation and custom quotation from our expert team.</p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link to="/contact" className="px-8 py-3 bg-yellow-400 text-black font-bold rounded-full hover:bg-yellow-300 transition-colors">
            Free Consultation
          </Link>
          <Link to="/projects" className="px-8 py-3 border border-yellow-400/50 text-yellow-400 font-bold rounded-full hover:border-yellow-400 transition-colors">
            View Projects
          </Link>
        </div>
      </div>
    </section>
  </div>
);

export default SolutionsPage;
