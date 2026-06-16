import { Link } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { FiHome, FiShield, FiZap, FiMonitor, FiLayers, FiWifi, FiSun, FiArrowRight } from 'react-icons/fi';

const solutions = [
  {
    icon: FiMonitor,
    title: 'Home Theatre & AV',
    desc: 'Premium home cinema systems with immersive audio-visual experiences. Dolby Atmos, 4K projection, custom screen installations.',
    tags: ['Dolby Atmos', '4K Projectors', 'Acoustic Panels', 'Screen Installation'],
    color: 'from-red-500/20 to-orange-500/20',
    border: 'border-red-500/30',
    link: '/products?category=home-theatre',
    img: 'https://images.unsplash.com/photo-1536440136628-849c177e76a1?w=500&auto=format&fit=crop&q=60',
  },
  {
    icon: FiLayers,
    title: 'Decoratives & Stretch Ceiling',
    desc: 'Transform your spaces with our luxury stretch ceiling systems, star ceilings, and premium decorative solutions.',
    tags: ['Stretch Ceiling', 'Star Ceiling', 'LED Panels', 'Custom Designs'],
    color: 'from-purple-500/20 to-pink-500/20',
    border: 'border-purple-500/30',
    link: '/products?category=decoratives',
    img: 'https://images.unsplash.com/photo-1618221195710-dd6b41faaea6?w=500&auto=format&fit=crop&q=60',
  },
  {
    icon: FiLayers,
    title: 'Epoxy Flooring',
    desc: 'High-durability epoxy flooring solutions for residential and commercial spaces with aesthetic finishes.',
    tags: ['3D Epoxy', 'Metallic Epoxy', 'Commercial Grade', 'Self-Leveling'],
    color: 'from-yellow-500/20 to-green-500/20',
    border: 'border-yellow-500/30',
    link: '/products?category=epoxy',
    img: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=500&auto=format&fit=crop&q=60',
  },
  {
    icon: FiHome,
    title: 'Home Automation',
    desc: 'Intelligent smart home solutions control lighting, climate, security, and entertainment from one interface.',
    tags: ['Smart Lighting', 'Climate Control', 'Voice Control', 'App Integration'],
    color: 'from-blue-500/20 to-cyan-500/20',
    border: 'border-blue-500/30',
    link: '/products?category=home-automation',
    img: 'https://images.unsplash.com/photo-1558618047-3c8c76ca7d13?w=500&auto=format&fit=crop&q=60',
  },
  {
    icon: FiZap,
    title: 'Smart Home Solutions',
    desc: 'End-to-end smart home ecosystem design, installation, and integration for modern living.',
    tags: ['IoT Devices', 'Smart Switches', 'Automation Panels', 'Integration'],
    color: 'from-emerald-500/20 to-teal-500/20',
    border: 'border-emerald-500/30',
    link: '/products?category=smart-home',
    img: 'https://images.unsplash.com/photo-1593642632559-0c6d3fc62b89?w=500&auto=format&fit=crop&q=60',
  },
  {
    icon: FiShield,
    title: 'Security Systems',
    desc: 'Comprehensive security solutions including CCTV surveillance, access control, and alarm systems.',
    tags: ['CCTV', 'Access Control', 'Alarm Systems', 'Video Analytics'],
    color: 'from-red-500/20 to-yellow-500/20',
    border: 'border-red-400/30',
    link: '/products?category=security',
    img: 'https://images.unsplash.com/photo-1557597774-9d273605dfa9?w=500&auto=format&fit=crop&q=60',
  },
  {
    icon: FiWifi,
    title: 'Networking Solutions',
    desc: 'Enterprise-grade structured networking, Wi-Fi solutions, and data cabling for homes and businesses.',
    tags: ['Structured Cabling', 'Wi-Fi 6', 'Network Switches', 'Fiber Optics'],
    color: 'from-indigo-500/20 to-blue-500/20',
    border: 'border-indigo-500/30',
    link: '/products?category=networking',
    img: 'https://images.unsplash.com/photo-1558494949-ef010cbdcc31?w=500&auto=format&fit=crop&q=60',
  },
  {
    icon: FiSun,
    title: 'Lighting Solutions',
    desc: 'Architectural and decorative LED lighting systems for ambiance, energy efficiency, and smart control.',
    tags: ['LED Lighting', 'RGBW Control', 'Ambient Lighting', 'Outdoor Lighting'],
    color: 'from-amber-500/20 to-yellow-400/20',
    border: 'border-amber-500/30',
    link: '/products?category=lighting',
    img: 'https://images.unsplash.com/photo-1565814329452-e1efa11c5b89?w=500&auto=format&fit=crop&q=60',
  },
];

const SolutionsPage = () => (
  <div className="min-h-screen bg-black text-white">
    <Helmet>
      <title>Solutions | Pravara World Tech</title>
    </Helmet>

    {/* Hero */}
    <section className="relative min-h-[360px] flex items-center border-b border-yellow-500/20 overflow-hidden">
      <img
        src="https://images.unsplash.com/photo-1558618047-3c8c76ca7d13?w=1400&auto=format&fit=crop&q=60"
        alt="Our Solutions"
        className="absolute inset-0 w-full h-full object-cover"
      />
      <div className="absolute inset-0 bg-black/78" />
      <div className="relative max-w-7xl mx-auto px-6 py-20 w-full">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 items-center">
          <div className="text-center lg:text-left">
            <span className="text-xs font-semibold text-yellow-400 tracking-widest uppercase mb-4 block">Complete Ecosystem</span>
            <h1 className="text-4xl md:text-5xl font-bold mb-4">
              Our <span className="text-yellow-400">Solutions</span>
            </h1>
            <p className="text-gray-300 text-lg max-w-xl">
              Where Vision Meets Innovation premium lifestyle & smart technology solutions for modern homes and businesses.
            </p>
          </div>
          <div className="grid grid-cols-2 gap-3">
            {[
              { icon: '🎬', label: 'Home Theatre' },
              { icon: '🏠', label: 'Smart Home' },
              { icon: '🔐', label: 'Security' },
              { icon: '✨', label: 'Decoratives' },
              { icon: '💡', label: 'Lighting' },
              { icon: '⛺', label: 'Structural' },
            ].map((item) => (
              <div key={item.label} className="bg-black/50 backdrop-blur border border-yellow-500/20 rounded-xl px-3 py-3 flex items-center gap-2">
                <span className="text-xl">{item.icon}</span>
                <p className="text-sm font-bold text-white">{item.label}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>

    {/* Solutions Grid */}
    <section className="py-16 px-6">
      <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {solutions.map((sol) => (
          <Link
            key={sol.title}
            to={sol.link}
            className={`group relative bg-gradient-to-br ${sol.color} border ${sol.border} rounded-2xl overflow-hidden hover:scale-[1.02] hover:shadow-xl transition-all duration-300 cursor-pointer flex flex-col`}
          >
            <div className="relative h-36 overflow-hidden flex-shrink-0">
              <img src={sol.img} alt={sol.title} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" />
              <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent" />
              <div className="absolute bottom-3 left-3 w-9 h-9 rounded-lg bg-black/40 backdrop-blur-sm flex items-center justify-center border border-white/10">
                <sol.icon className="w-4 h-4 text-yellow-400" />
              </div>
            </div>
            <div className="p-5 flex flex-col flex-1">
              <h3 className="text-base font-bold mb-2 text-white">{sol.title}</h3>
              <p className="text-xs text-gray-400 mb-3 leading-relaxed flex-1">{sol.desc}</p>
              <div className="flex flex-wrap gap-1.5 mb-3">
                {sol.tags.map((tag) => (
                  <span key={tag} className="text-[10px] px-2 py-0.5 bg-white/5 rounded-full text-gray-400 border border-white/10">
                    {tag}
                  </span>
                ))}
              </div>
              <span className="text-xs text-yellow-400 font-semibold flex items-center gap-1 group-hover:gap-2 transition-all">
                Explore <FiArrowRight className="w-3 h-3" />
              </span>
            </div>
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
