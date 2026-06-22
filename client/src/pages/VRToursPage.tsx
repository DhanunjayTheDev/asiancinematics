import { Helmet } from 'react-helmet-async';
import { FiArrowRight, FiExternalLink } from 'react-icons/fi';
import { Link } from 'react-router-dom';

const tours = [
  { label: 'Home Theatre IN',  sub: 'Full Immersion',             url: 'https://virtualinterio.in/VR/hometheatre.html',                             icon: '🎭', category: 'Home Theatre' },
  { label: 'Akhilam Nestonix',   sub: 'Duplex G2 · Residential',   url: 'https://virtualinterio.in/VR/akhilam-nestonix-DuplexG2.html',               icon: '🏢', category: 'Residential' },
  { label: 'Home Theater 02 IN', sub: 'Dolby Experience',           url: 'https://virtualinterio.in/VR/Home-Theater02.html',                          icon: '📽️', category: 'Home Theatre' },
  { label: 'VR Task 2',          sub: 'Interior Walkthrough',       url: 'http://virtualinterio.com/VR/task2.html',                                   icon: '🏠', category: 'Interior' },
  { label: 'Test Project 3',     sub: 'VR Experience',              url: 'http://virtualinterio.com/VR/Test3.html',                                   icon: '🎬', category: 'Experience' },
  { label: 'Akhilam',            sub: 'Residential Project',        url: 'http://virtualinterio.com/VR/Akhilam.html',                                 icon: '🏡', category: 'Residential' },
  { label: 'VJ Professionals',   sub: 'Home Interiors · Kamareddy', url: 'http://virtualinterio.com/VR/VJPROFESSIONALSHOMEINTERIORSKAMAREDDY.html',   icon: '🛋️', category: 'Interior' },
  { label: 'Home Theater',       sub: 'Cinema Experience',          url: 'http://virtualinterio.com/VR/Home-Theater.html',                            icon: '🎥', category: 'Home Theatre' },
  { label: 'Home Theatre',       sub: 'Surround Sound Setup',       url: 'http://virtualinterio.com/VR/hometheatre.html',                             icon: '🔊', category: 'Home Theatre' },
  { label: 'Home Theater 02',    sub: 'Premium AV Room',            url: 'http://virtualinterio.com/VR/Home-Theater02.html',                          icon: '🎞️', category: 'Home Theatre' },
];

const VRToursPage = () => {
  return (
    <div className="min-h-screen bg-black text-white">
      <Helmet>
        <title>360° VR Tours | Pravara World Tech</title>
        <meta name="description" content="Explore our completed projects through immersive 360° Virtual Reality walkthroughs." />
      </Helmet>

      {/* Hero */}
      <section className="relative min-h-[420px] flex items-center border-b border-purple-500/20 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-purple-950 via-black to-black" />
        <div className="absolute inset-0 opacity-20"
          style={{ backgroundImage: 'radial-gradient(circle at 30% 50%, #7c3aed 0%, transparent 60%), radial-gradient(circle at 80% 20%, #4f46e5 0%, transparent 50%)' }}
        />

        {/* Grid pattern */}
        <div className="absolute inset-0 opacity-5"
          style={{ backgroundImage: 'linear-gradient(rgba(139,92,246,0.5) 1px, transparent 1px), linear-gradient(90deg, rgba(139,92,246,0.5) 1px, transparent 1px)', backgroundSize: '60px 60px' }}
        />

        <div className="relative max-w-7xl mx-auto px-6 py-20 text-center w-full">
          <span className="inline-flex items-center gap-2 text-xs font-bold text-purple-400 tracking-widest uppercase mb-5 bg-purple-400/10 border border-purple-400/20 px-4 py-2 rounded-full">
            🥽 Immersive Technology
          </span>
          <h1 className="text-5xl lg:text-7xl font-black text-white mb-6 leading-tight">
            360° Virtual
            <span className="block text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-indigo-400">
              Reality Tours
            </span>
          </h1>
          <p className="text-gray-300 text-lg max-w-2xl mx-auto mb-8 leading-relaxed">
            Step inside our completed projects before committing. Experience every detail lighting, acoustics, interiors in full immersive 360° VR.
          </p>
          <div className="flex flex-wrap items-center justify-center gap-4 text-sm text-gray-400">
            <span className="flex items-center gap-2"><span className="w-2 h-2 rounded-full bg-purple-400 inline-block" />{tours.length} Walkthroughs Available</span>
            <span className="flex items-center gap-2"><span className="w-2 h-2 rounded-full bg-indigo-400 inline-block" />No Headset Required</span>
            <span className="flex items-center gap-2"><span className="w-2 h-2 rounded-full bg-violet-400 inline-block" />Opens in Browser</span>
          </div>
        </div>
      </section>

      {/* How to use */}
      <section className="py-12 border-b border-purple-500/10 bg-gradient-to-b from-purple-950/5 to-black">
        <div className="max-w-5xl mx-auto px-6">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 text-center">
            {[
              { step: '01', icon: '👆', title: 'Click Any Tour', desc: 'Select any VR walkthrough card below' },
              { step: '02', icon: '🌐', title: 'Opens in New Tab', desc: 'Full 360° experience loads in your browser' },
              { step: '03', icon: '🖱️', title: 'Look Around', desc: 'Click & drag or use touch to explore the space' },
            ].map(s => (
              <div key={s.step} className="flex flex-col items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-purple-500/20 border border-purple-500/30 flex items-center justify-center text-purple-400 text-xs font-bold">{s.step}</div>
                <span className="text-3xl">{s.icon}</span>
                <h3 className="text-white font-bold text-sm">{s.title}</h3>
                <p className="text-gray-500 text-xs">{s.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Tour Cards */}
      <section className="py-20 px-6">
        <div className="max-w-7xl mx-auto">
          <div className="mb-12">
            <h2 className="text-3xl font-bold text-white mb-2">All Walkthroughs</h2>
            <p className="text-gray-500 text-sm">{tours.length} immersive VR experiences click to explore</p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
            {tours.map((item) => (
              <a
                key={item.url}
                href={item.url}
                target="_blank"
                rel="noopener noreferrer"
                className="group flex flex-col bg-gradient-to-br from-purple-900/20 to-black border border-purple-500/20 hover:border-purple-500/60 rounded-2xl p-5 transition-all duration-300 hover:shadow-2xl hover:shadow-purple-500/20 hover:-translate-y-1.5"
              >
                {/* Top row */}
                <div className="flex items-center justify-between mb-5">
                  <span className="text-4xl">{item.icon}</span>
                  <span className="text-[9px] font-bold text-purple-400 bg-purple-400/10 border border-purple-400/20 px-2 py-1 rounded-full uppercase tracking-widest">360° VR</span>
                </div>

                {/* Category */}
                <span className="text-[10px] font-semibold text-indigo-400 uppercase tracking-wider mb-1">{item.category}</span>

                {/* Title */}
                <h3 className="text-white font-bold text-sm mb-1 group-hover:text-purple-300 transition-colors leading-snug">{item.label}</h3>
                <p className="text-gray-500 text-xs mb-5 leading-relaxed">{item.sub}</p>

                {/* CTA */}
                <div className="mt-auto flex items-center justify-between">
                  <div className="flex items-center gap-1.5 text-purple-400 text-xs font-semibold group-hover:text-purple-300 transition-colors">
                    Launch Tour
                    <FiArrowRight className="w-3 h-3 group-hover:translate-x-1 transition-transform" />
                  </div>
                  <FiExternalLink className="w-3.5 h-3.5 text-gray-600 group-hover:text-purple-400 transition-colors" />
                </div>
              </a>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-16 px-6 text-center border-t border-purple-500/20 bg-gradient-to-t from-purple-950/10 to-black">
        <div className="max-w-2xl mx-auto">
          <span className="text-3xl mb-4 block">🏆</span>
          <h2 className="text-3xl font-bold text-white mb-3">Want a VR Preview of Your Project?</h2>
          <p className="text-gray-400 mb-8 text-sm">We create immersive 3D walkthroughs before execution so you can approve every detail.</p>
          <div className="flex flex-wrap gap-4 justify-center">
            <Link to="/inquiry" className="inline-flex items-center gap-2 px-7 py-3 bg-purple-600 hover:bg-purple-500 text-white font-bold rounded-full transition-colors text-sm">
              Request VR Walkthrough <FiArrowRight className="w-4 h-4" />
            </Link>
            <Link to="/projects" className="inline-flex items-center gap-2 px-7 py-3 border border-gray-700 hover:border-gray-500 text-gray-300 hover:text-white font-semibold rounded-full transition-colors text-sm">
              View All Projects
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
};

export default VRToursPage;
