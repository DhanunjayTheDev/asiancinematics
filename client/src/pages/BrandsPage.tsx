import { Link } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { FiExternalLink, FiArrowRight } from 'react-icons/fi';

const brandCategories = [
  {
    cat: 'Home Theatre & AV',
    brands: [
      { name: 'Yamaha', desc: 'Premium AV receivers & amplifiers', country: 'Japan', tier: 'Premium' },
      { name: 'Denon', desc: 'High-fidelity AV receivers', country: 'Japan', tier: 'Premium' },
      { name: 'Klipsch', desc: 'Heritage loudspeaker systems', country: 'USA', tier: 'Premium' },
      { name: 'SVS', desc: 'Reference home theatre subwoofers', country: 'USA', tier: 'Premium' },
      { name: 'JBL Professional', desc: 'Studio monitors & cinema speakers', country: 'USA', tier: 'Professional' },
      { name: 'Epson', desc: '4K laser projectors', country: 'Japan', tier: 'Premium' },
    ],
  },
  {
    cat: 'Smart Home & Automation',
    brands: [
      { name: 'Lutron', desc: 'Smart lighting & shading systems', country: 'USA', tier: 'Premium' },
      { name: 'Control4', desc: 'Smart home automation platform', country: 'USA', tier: 'Enterprise' },
      { name: 'Schneider Electric', desc: 'Smart electrical systems', country: 'France', tier: 'Professional' },
      { name: 'Legrand', desc: 'Connected home solutions', country: 'France', tier: 'Professional' },
      { name: 'Philips Hue', desc: 'Smart LED lighting ecosystem', country: 'Netherlands', tier: 'Consumer' },
    ],
  },
  {
    cat: 'Security & Surveillance',
    brands: [
      { name: 'Hikvision', desc: 'IP cameras & NVR systems', country: 'China', tier: 'Professional' },
      { name: 'Dahua', desc: 'Video surveillance solutions', country: 'China', tier: 'Professional' },
      { name: 'Axis', desc: 'Network cameras & analytics', country: 'Sweden', tier: 'Enterprise' },
      { name: 'Bosch Security', desc: 'Integrated security systems', country: 'Germany', tier: 'Enterprise' },
      { name: 'HikVision', desc: 'AI-powered surveillance', country: 'China', tier: 'Professional' },
    ],
  },
  {
    cat: 'Acoustic & Decoratives',
    brands: [
      { name: 'Barrisol', desc: 'Stretch ceiling systems', country: 'France', tier: 'Premium' },
      { name: 'Acousticpearls', desc: 'Premium acoustic panels', country: 'Germany', tier: 'Premium' },
      { name: 'RPG Diffusor', desc: 'Room acoustics solutions', country: 'USA', tier: 'Professional' },
      { name: 'Knauf', desc: 'Interior design materials', country: 'Germany', tier: 'Professional' },
    ],
  },
  {
    cat: 'Networking',
    brands: [
      { name: 'Ubiquiti', desc: 'Enterprise Wi-Fi & networking', country: 'USA', tier: 'Professional' },
      { name: 'Cisco', desc: 'Enterprise networking solutions', country: 'USA', tier: 'Enterprise' },
      { name: 'TP-Link Omada', desc: 'Business Wi-Fi solutions', country: 'China', tier: 'Professional' },
      { name: 'D-Link', desc: 'Network switches & routers', country: 'Taiwan', tier: 'Consumer' },
    ],
  },
];

const tierColors: Record<string, string> = {
  Premium: 'text-yellow-400 bg-yellow-400/10 border-yellow-400/30',
  Enterprise: 'text-blue-400 bg-blue-400/10 border-blue-400/30',
  Professional: 'text-green-400 bg-green-400/10 border-green-400/30',
  Consumer: 'text-gray-400 bg-gray-400/10 border-gray-400/30',
};

const BrandsPage = () => (
  <div className="min-h-screen bg-black text-white">
    <Helmet>
      <title>Brands | Pravara World Tech</title>
    </Helmet>

    {/* Hero */}
    <section className="relative min-h-[360px] flex items-center border-b border-yellow-500/20 overflow-hidden">
      <img
        src="https://images.unsplash.com/photo-1560179707-f14e90ef3623?w=1400&auto=format&fit=crop&q=60"
        alt="Our Brands"
        className="absolute inset-0 w-full h-full object-cover"
      />
      <div className="absolute inset-0 bg-black/78" />
      <div className="relative max-w-7xl mx-auto px-6 py-20 w-full">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 items-center">
          <div className="text-center lg:text-left">
            <span className="text-xs font-semibold text-yellow-400 tracking-widest uppercase mb-4 block">Authorized Partner</span>
            <h1 className="text-4xl md:text-5xl font-bold mb-4">Our <span className="text-yellow-400">Brands</span></h1>
            <p className="text-gray-300 text-lg max-w-xl">
              We partner with the world's leading technology brands to bring you the best in quality, performance, and reliability.
            </p>
          </div>
          <div className="grid grid-cols-3 gap-3">
            {['Yamaha', 'Hikvision', 'Barrisol', 'Klipsch', 'Lutron', 'Epson'].map((b) => (
              <div key={b} className="bg-black/50 backdrop-blur border border-yellow-500/20 rounded-xl px-3 py-4 text-center">
                <p className="text-white text-sm font-bold">{b}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>

    {/* Brands by Category */}
    <section className="py-16 px-6">
      <div className="max-w-7xl mx-auto space-y-16">
        {brandCategories.map((cat) => (
          <div key={cat.cat}>
            <h2 className="text-2xl font-bold mb-8 flex items-center gap-3">
              <span className="w-8 h-0.5 bg-yellow-400" />
              {cat.cat}
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
              {cat.brands.map((brand) => (
                <div key={brand.name} className="bg-gray-900/50 border border-gray-700/50 rounded-xl p-5 hover:border-yellow-500/40 transition-colors group">
                  <div className="flex items-center justify-between mb-3">
                    <h3 className="text-lg font-bold text-white group-hover:text-yellow-400 transition-colors">{brand.name}</h3>
                    <span className={`text-[10px] font-semibold px-2 py-0.5 rounded-full border ${tierColors[brand.tier]}`}>
                      {brand.tier}
                    </span>
                  </div>
                  <p className="text-xs text-gray-400 mb-2">{brand.desc}</p>
                  <p className="text-[11px] text-gray-600">{brand.country}</p>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </section>

    {/* Become a Dealer CTA */}
    <section className="py-16 px-6 text-center border-t border-yellow-500/20">
      <div className="max-w-2xl mx-auto">
        <h2 className="text-3xl font-bold mb-4">Want to Become an <span className="text-yellow-400">Authorized Dealer</span>?</h2>
        <p className="text-gray-400 mb-8">Join our partner network and get access to our brand portfolio with competitive dealer pricing.</p>
        <Link to="/partner-network" className="inline-flex items-center gap-2 px-8 py-3 bg-yellow-400 text-black font-bold rounded-full hover:bg-yellow-300 transition-colors">
          Join Partner Network <FiArrowRight className="w-4 h-4" />
        </Link>
      </div>
    </section>
  </div>
);

export default BrandsPage;
