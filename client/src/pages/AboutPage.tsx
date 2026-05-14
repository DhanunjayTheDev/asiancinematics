import { Link } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { FiTarget, FiEye, FiAward, FiUsers, FiMapPin, FiPhone, FiMail, FiArrowRight } from 'react-icons/fi';

const team = [
  {
    name: 'Praveen Kumar Yougi A',
    role: 'Founder & CEO',
    bio: 'Visionary entrepreneur with 23+ years in smart technology integration, AV systems, and architectural solutions.',
    phones: ['9849697886', '9966167886'],
  },
];

const milestones = [
  { year: '2003', event: 'Founded Asian Cinematics in Hyderabad' },
  { year: '2014', event: 'Expanded to Structural & Tensile Works division' },
  { year: '2017', event: 'Launched Pravara World Tech brand' },
  { year: '2019', event: 'Reached 500+ successful project completions' },
  { year: '2021', event: 'Expanded partner network to 50+ cities across India' },
  { year: '2023', event: 'Launched Smart Home & IoT Automation division' },
  { year: '2024', event: 'Achieved PAN India service presence' },
];

const stats = [
  { value: '2500+', label: 'Projects Completed' },
  { value: '50+', label: 'Cities Covered' },
  { value: '23+', label: 'Years of Experience' },
  { value: '200+', label: 'Brand Partners With Us' },
];

const offerings = [
  { emoji: '🎬', name: 'Home Theatre & AV Acoustics' },
  { emoji: '🎨', name: 'Decoratives & Stretch Ceiling' },
  { emoji: '🏗', name: 'Epoxy Flooring' },
  { emoji: '🏠', name: 'Home Automation' },
  { emoji: '🤖', name: 'Smart Home Solutions' },
  { emoji: '🔐', name: 'Security & CCTV' },
  { emoji: '🌐', name: 'Networking Solutions' },
  { emoji: '⛺', name: 'Tensile & Structural Works' },
];

const AboutPage = () => (
  <div className="min-h-screen bg-black text-white">
    <Helmet>
      <title>About Us | Pravara World Tech</title>
    </Helmet>

    {/* Hero */}
    <section className="py-24 px-6 text-center border-b border-yellow-500/20 relative overflow-hidden">
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-yellow-500/10 via-transparent to-transparent pointer-events-none" />
      <div className="relative max-w-4xl mx-auto">
        <span className="text-xs font-semibold text-yellow-400 tracking-widest uppercase mb-4 block">Est. 2003 | Hyderabad, India</span>
        <h1 className="text-5xl md:text-6xl font-bold mb-6">
          About <span className="text-yellow-400">Pravara World Tech</span>
        </h1>
        <p className="text-gray-300 text-xl leading-relaxed mb-4">
          <span className="text-white font-semibold">Asian Cinematics | Pravara World Tech | Ecop World International</span>
        </p>
        <p className="text-gray-400 text-lg max-w-3xl mx-auto">
          Where Vision Meets Innovation We specialize in premium lifestyle & smart technology solutions for modern homes and businesses across India.
        </p>
      </div>
    </section>

    {/* Stats */}
    <section className="py-16 px-6 border-b border-gray-800">
      <div className="max-w-5xl mx-auto grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
        {stats.map((s) => (
          <div key={s.label}>
            <div className="text-4xl font-extrabold text-yellow-400 mb-1">{s.value}</div>
            <div className="text-sm text-gray-400">{s.label}</div>
          </div>
        ))}
      </div>
    </section>

    {/* What We Do */}
    <section className="py-16 px-6 border-b border-gray-800">
      <div className="max-w-5xl mx-auto">
        <h2 className="text-3xl font-bold text-center mb-12">What We <span className="text-yellow-400">Specialize In</span></h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {offerings.map((o) => (
            <div key={o.name} className="bg-gray-900/50 border border-gray-700/50 rounded-xl p-5 text-center hover:border-yellow-500/50 transition-colors">
              <div className="text-3xl mb-3">{o.emoji}</div>
              <p className="text-xs font-semibold text-gray-300">{o.name}</p>
            </div>
          ))}
        </div>
      </div>
    </section>

    {/* Mission & Vision */}
    <section className="py-16 px-6 border-b border-gray-800">
      <div className="max-w-5xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-gradient-to-br from-yellow-500/10 to-orange-500/10 border border-yellow-500/30 rounded-2xl p-8 text-center">
          <FiTarget className="w-10 h-10 text-yellow-400 mx-auto mb-4" />
          <h3 className="text-xl font-bold mb-3">Our Mission</h3>
          <p className="text-gray-400 text-sm leading-relaxed">
            To deliver premium quality smart technology and lifestyle solutions with genuine materials, best pricing, and unmatched service across India.
          </p>
        </div>
        <div className="bg-gradient-to-br from-blue-500/10 to-purple-500/10 border border-blue-500/30 rounded-2xl p-8 text-center">
          <FiEye className="w-10 h-10 text-blue-400 mx-auto mb-4" />
          <h3 className="text-xl font-bold mb-3">Our Vision</h3>
          <p className="text-gray-400 text-sm leading-relaxed">
            To be India's most trusted and comprehensive smart home & commercial technology solutions provider, transforming living and working spaces.
          </p>
        </div>
        <div className="bg-gradient-to-br from-green-500/10 to-emerald-500/10 border border-green-500/30 rounded-2xl p-8 text-center">
          <FiAward className="w-10 h-10 text-green-400 mx-auto mb-4" />
          <h3 className="text-xl font-bold mb-3">Our Promise</h3>
          <p className="text-gray-400 text-sm leading-relaxed">
            ✔ Genuine Materials &nbsp;✔ Best Pricing &nbsp;✔ PAN India Service &nbsp;✔ Free Consultation &nbsp;✔ Expert Installation
          </p>
        </div>
      </div>
    </section>

    {/* Team */}
    <section className="py-16 px-6 border-b border-gray-800">
      <div className="max-w-3xl mx-auto text-center">
        <h2 className="text-3xl font-bold mb-12">Our <span className="text-yellow-400">Founder</span></h2>
        {team.map((member) => (
          <div key={member.name} className="bg-gray-900/50 border border-gray-700/50 rounded-2xl p-8">
            <div className="w-24 h-24 rounded-full bg-gradient-to-br from-yellow-400 to-orange-500 mx-auto mb-5 flex items-center justify-center text-black text-2xl font-extrabold">
              PK
            </div>
            <h3 className="text-2xl font-bold text-white mb-1">{member.name}</h3>
            <p className="text-yellow-400 text-sm font-semibold mb-3">{member.role}</p>
            <p className="text-gray-400 text-sm leading-relaxed mb-5">{member.bio}</p>
            <div className="flex flex-wrap justify-center gap-3">
              {member.phones.map((p) => (
                <a key={p} href={`tel:+91${p}`} className="flex items-center gap-2 px-4 py-2 bg-gray-800 rounded-full text-xs text-gray-300 hover:text-yellow-400 transition-colors">
                  <FiPhone className="w-3.5 h-3.5 text-yellow-400" /> +91 {p}
                </a>
              ))}
            </div>
          </div>
        ))}
      </div>
    </section>

    {/* Timeline */}
    <section className="py-16 px-6 border-b border-gray-800">
      <div className="max-w-3xl mx-auto">
        <h2 className="text-3xl font-bold text-center mb-12">Our <span className="text-yellow-400">Journey</span></h2>
        <div className="relative">
          <div className="absolute left-4 top-0 bottom-0 w-0.5 bg-yellow-500/20" />
          <div className="space-y-6">
            {milestones.map((m) => (
              <div key={m.year} className="relative pl-12">
                <div className="absolute left-0 w-8 h-8 rounded-full bg-yellow-400 text-black flex items-center justify-center text-[10px] font-extrabold">
                  {m.year.slice(2)}
                </div>
                <div className="bg-gray-900/50 border border-gray-700/50 rounded-xl p-4">
                  <span className="text-yellow-400 text-sm font-bold">{m.year}</span>
                  <p className="text-gray-300 text-sm mt-1">{m.event}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>

    {/* Contact CTA */}
    <section className="py-16 px-6 text-center">
      <div className="max-w-2xl mx-auto">
        <h2 className="text-3xl font-bold mb-4">Let's Build Something <span className="text-yellow-400">Amazing</span></h2>
        <p className="text-gray-400 mb-8">Get in touch with our expert team for a free consultation on your project.</p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link to="/contact" className="inline-flex items-center gap-2 px-8 py-3 bg-yellow-400 text-black font-bold rounded-full hover:bg-yellow-300 transition-colors">
            Contact Us <FiArrowRight className="w-4 h-4" />
          </Link>
          <Link to="/partner-network" className="inline-flex items-center gap-2 px-8 py-3 border border-yellow-400/50 text-yellow-400 font-bold rounded-full hover:border-yellow-400 transition-colors">
            Partner With Us
          </Link>
        </div>
      </div>
    </section>
  </div>
);

export default AboutPage;
