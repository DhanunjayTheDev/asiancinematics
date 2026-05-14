import { Link } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { FiArrowRight, FiCheckCircle, FiPhone } from 'react-icons/fi';

const works = [
  {
    title: 'Tensile Structures',
    desc: 'High-quality tensile fabric structures for carports, walkways, amphitheatres, and outdoor shading.',
    image: null,
    features: ['Custom Fabric Selection', 'Steel Framework', 'Weather Resistant', 'UV Protected'],
    badge: 'Most Popular',
  },
  {
    title: 'Parking Shades',
    desc: 'Durable and aesthetic tensile parking shades for residential complexes, malls, and corporate offices.',
    image: null,
    features: ['PVDF Fabric', 'Hot-dip Galvanized Steel', 'Wind Load Design', 'Multiple Colors'],
    badge: null,
  },
  {
    title: 'Architectural Facades',
    desc: 'Innovative tensile facade systems that redefine building aesthetics with structural functionality.',
    image: null,
    features: ['Landmark Designs', 'Structural Engineering', 'Facade Integration', 'Low Maintenance'],
    badge: null,
  },
  {
    title: 'Amphitheatre & Event Shades',
    desc: 'Large-span tensile canopy systems for outdoor events, amphitheatres, and community spaces.',
    image: null,
    features: ['Large Span', 'Modular Design', 'Rapid Installation', 'Event Grade'],
    badge: 'New',
  },
  {
    title: 'Pool & Courtyard Covers',
    desc: 'Elegant tensile covers for swimming pools, courtyards, and garden spaces functional and beautiful.',
    image: null,
    features: ['Water Drainage Design', 'HDPE or PVDF', 'Custom Shape', 'Aesthetic Finish'],
    badge: null,
  },
  {
    title: 'Commercial Canopies',
    desc: 'Eye-catching branding canopies for entry areas, food courts, and commercial establishments.',
    image: null,
    features: ['Brand Colors', 'Backlit Options', 'Structural Safety', 'PAN India Installation'],
    badge: null,
  },
];

const process = [
  { step: '01', title: 'Site Survey', desc: 'Our team visits your site to assess requirements and take measurements.' },
  { step: '02', title: 'Design & Quotation', desc: 'Custom structural designs with transparent, detailed quotation.' },
  { step: '03', title: 'Material Selection', desc: 'Choose from our range of quality fabrics, frames, and finishes.' },
  { step: '04', title: 'Fabrication', desc: 'Precision fabrication at our facility with strict quality controls.' },
  { step: '05', title: 'Installation', desc: 'Expert installation team with safety compliance and supervision.' },
  { step: '06', title: 'Handover & Warranty', desc: 'Detailed handover, documentation, and warranty support.' },
];

const StructuralWorksPage = () => (
  <div className="min-h-screen bg-black text-white">
    <Helmet>
      <title>Structural Works | Pravara World Tech</title>
    </Helmet>

    {/* Hero */}
    <section className="py-20 px-6 border-b border-yellow-500/20 relative overflow-hidden">
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-yellow-500/10 via-transparent to-transparent pointer-events-none" />
      <div className="relative max-w-5xl mx-auto text-center">
        <span className="text-xs font-semibold text-yellow-400 tracking-widest uppercase mb-4 block">Engineering Excellence</span>
        <h1 className="text-4xl md:text-6xl font-bold mb-6">
          Tensile & <span className="text-yellow-400">Structural Works</span>
        </h1>
        <p className="text-gray-400 text-lg max-w-2xl mx-auto mb-8">
          From carports to amphitheatres we design and install premium tensile structures across India with precision engineering and quality materials.
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link to="/inquiry" className="px-8 py-3 bg-yellow-400 text-black font-bold rounded-full hover:bg-yellow-300 transition-colors">
            Get a Quote
          </Link>
          <a href="tel:+919849697886" className="px-8 py-3 border border-yellow-400/50 text-yellow-400 font-bold rounded-full hover:border-yellow-400 transition-colors flex items-center justify-center gap-2">
            <FiPhone className="w-4 h-4" /> Call Now
          </a>
        </div>
      </div>
    </section>

    {/* Works Grid */}
    <section className="py-16 px-6">
      <div className="max-w-7xl mx-auto">
        <h2 className="text-3xl font-bold text-center mb-12">Our <span className="text-yellow-400">Structural Solutions</span></h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {works.map((work) => (
            <div key={work.title} className="bg-gray-900/50 border border-gray-700/50 rounded-2xl p-6 hover:border-yellow-500/50 transition-colors group">
              <div className="flex items-start justify-between mb-4">
                <h3 className="text-xl font-bold text-white group-hover:text-yellow-400 transition-colors">{work.title}</h3>
                {work.badge && (
                  <span className="text-[10px] font-bold px-2 py-0.5 bg-yellow-400 text-black rounded-full">{work.badge}</span>
                )}
              </div>
              <p className="text-gray-400 text-sm mb-5 leading-relaxed">{work.desc}</p>
              <ul className="space-y-2">
                {work.features.map((f) => (
                  <li key={f} className="flex items-center gap-2 text-xs text-gray-400">
                    <FiCheckCircle className="w-3.5 h-3.5 text-yellow-400 flex-shrink-0" />
                    {f}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>
    </section>

    {/* Process */}
    <section className="py-16 px-6 border-t border-yellow-500/20">
      <div className="max-w-5xl mx-auto">
        <h2 className="text-3xl font-bold text-center mb-12">Our <span className="text-yellow-400">Process</span></h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {process.map((p) => (
            <div key={p.step} className="relative bg-gray-900/30 border border-gray-800 rounded-xl p-6">
              <div className="text-5xl font-extrabold text-yellow-400/10 mb-3">{p.step}</div>
              <h3 className="text-lg font-bold text-white mb-2">{p.title}</h3>
              <p className="text-sm text-gray-400">{p.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>

    {/* CTA */}
    <section className="py-16 px-6 text-center border-t border-yellow-500/20">
      <div className="max-w-2xl mx-auto">
        <h2 className="text-3xl font-bold mb-4">Start Your Structural Project</h2>
        <p className="text-gray-400 mb-8">Share your requirements and we'll provide a custom engineering solution with competitive pricing.</p>
        <Link to="/contact" className="inline-flex items-center gap-2 px-8 py-3 bg-yellow-400 text-black font-bold rounded-full hover:bg-yellow-300 transition-colors">
          Contact Our Engineers <FiArrowRight className="w-4 h-4" />
        </Link>
      </div>
    </section>
  </div>
);

export default StructuralWorksPage;
