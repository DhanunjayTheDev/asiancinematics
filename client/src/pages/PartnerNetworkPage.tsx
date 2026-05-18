import { useState } from 'react';
import { Helmet } from 'react-helmet-async';
import { FiCheckCircle, FiUsers, FiTrendingUp, FiAward, FiPhone, FiMail, FiSend } from 'react-icons/fi';
import api from '../lib/api';

const partnerTypes = [
  {
    icon: FiUsers,
    title: 'Dealer / Distributor',
    desc: 'Authorized dealers for our product range with competitive pricing, margins, and marketing support.',
    perks: ['Competitive dealer pricing', 'Marketing collaterals', 'Technical training', 'Priority support'],
    img: 'https://images.unsplash.com/photo-1542744173-8e7e53415bb0?w=600&auto=format&fit=crop&q=60',
  },
  {
    icon: FiTrendingUp,
    title: 'Channel Partner',
    desc: 'Refer projects and earn commissions. Ideal for architects, interior designers, and contractors.',
    perks: ['Attractive commission structure', 'Lead management support', 'Co-branding opportunities', 'Dedicated partner manager'],
    img: 'https://images.unsplash.com/photo-1600880292089-90a7e086ee0c?w=600&auto=format&fit=crop&q=60',
  },
  {
    icon: FiAward,
    title: 'Business Associate',
    desc: 'Long-term strategic alliance for organizations looking to include our solutions in their offerings.',
    perks: ['Joint go-to-market strategy', 'Exclusive territory rights', 'Revenue sharing model', 'Brand co-ownership'],
    img: 'https://images.unsplash.com/photo-1521737852567-6949f3f9f2b5?w=600&auto=format&fit=crop&q=60',
  },
];

const PartnerNetworkPage = () => {
  const [form, setForm] = useState({
    name: '', company: '', phone: '', email: '', city: '', partnerType: '', experience: '', message: '',
  });
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState('');

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setForm((f) => ({ ...f, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      await api.post('/inquiries', {
        name: form.name,
        email: form.email,
        phone: form.phone,
        subject: `Partner Registration – ${form.partnerType}`,
        message: `Company: ${form.company}\nCity: ${form.city}\nPartner Type: ${form.partnerType}\nExperience: ${form.experience}\n\n${form.message}`,
        source: 'partner_registration',
      });
      setSubmitted(true);
    } catch {
      setError('Failed to submit. Please try again or call us directly.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-black text-white">
      <Helmet>
        <title>Partner Network | Pravara World Tech</title>
      </Helmet>

      {/* Hero */}
      <section className="relative min-h-[380px] flex items-center border-b border-yellow-500/20 overflow-hidden">
        <img
          src="https://images.unsplash.com/photo-1521737852567-6949f3f9f2b5?w=1400&auto=format&fit=crop&q=60"
          alt="Partner Network"
          className="absolute inset-0 w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-black/75" />
        <div className="relative max-w-7xl mx-auto px-6 py-20 w-full">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <span className="text-xs font-semibold text-yellow-400 tracking-widest uppercase mb-4 block">🤝 Grow Together</span>
              <h1 className="text-4xl md:text-5xl font-bold mb-4">Partner <span className="text-yellow-400">Network</span></h1>
              <p className="text-gray-300 text-lg max-w-xl">
                Join our growing network of dealers, channel partners, and business associates across India. Leverage our brand, products, and expertise to grow your business.
              </p>
            </div>
            <div className="grid grid-cols-3 gap-4 text-center">
              {[
                { value: '200+', label: 'Active Partners' },
                { value: '50+', label: 'Cities' },
                { value: '23+', label: 'Years' },
              ].map((stat) => (
                <div key={stat.label} className="bg-black/50 backdrop-blur-sm border border-yellow-500/20 rounded-xl p-5">
                  <p className="text-3xl font-bold text-yellow-400">{stat.value}</p>
                  <p className="text-gray-400 text-xs mt-1">{stat.label}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Partner Types */}
      <section className="py-16 px-6">
        <div className="max-w-5xl mx-auto">
          <h2 className="text-3xl font-bold text-center mb-12">Partnership <span className="text-yellow-400">Models</span></h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {partnerTypes.map((pt) => (
              <div key={pt.title} className="bg-gray-900/50 border border-gray-700/50 rounded-2xl overflow-hidden hover:border-yellow-500/50 transition-all group">
                <div className="relative h-40 overflow-hidden">
                  <img src={pt.img} alt={pt.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent" />
                  <div className="absolute bottom-3 left-4 flex items-center gap-2">
                    <div className="w-9 h-9 rounded-lg bg-yellow-400/20 backdrop-blur-sm border border-yellow-400/30 flex items-center justify-center">
                      <pt.icon className="w-5 h-5 text-yellow-400" />
                    </div>
                    <h3 className="text-lg font-bold text-white">{pt.title}</h3>
                  </div>
                </div>
                <div className="p-6">
                  <p className="text-sm text-gray-400 mb-5">{pt.desc}</p>
                  <ul className="space-y-2">
                    {pt.perks.map((perk) => (
                      <li key={perk} className="flex items-center gap-2 text-xs text-gray-400">
                        <FiCheckCircle className="w-3.5 h-3.5 text-green-400 flex-shrink-0" />
                        {perk}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Registration Form */}
      <section className="py-16 px-6 border-t border-yellow-500/20">
        <div className="max-w-2xl mx-auto">
          <h2 className="text-3xl font-bold text-center mb-3">Register as a <span className="text-yellow-400">Partner</span></h2>
          <p className="text-gray-400 text-center mb-10">Fill the form below and our team will contact you within 24 hours.</p>

          {submitted ? (
            <div className="bg-green-500/10 border border-green-500/30 rounded-2xl p-10 text-center">
              <FiCheckCircle className="w-16 h-16 text-green-400 mx-auto mb-4" />
              <h3 className="text-2xl font-bold text-white mb-2">Registration Submitted!</h3>
              <p className="text-gray-400">Thank you for your interest. Our team will reach out to you shortly.</p>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="bg-gray-900/50 border border-gray-700/50 rounded-2xl p-8 space-y-5">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                <div>
                  <label className="block text-xs font-semibold text-gray-400 mb-1.5">Full Name *</label>
                  <input name="name" value={form.name} onChange={handleChange} required
                    className="w-full bg-gray-800 border border-gray-700 rounded-xl px-4 py-3 text-sm text-white placeholder-gray-600 focus:outline-none focus:border-yellow-500"
                    placeholder="Praveen Kumar" />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-gray-400 mb-1.5">Company Name</label>
                  <input name="company" value={form.company} onChange={handleChange}
                    className="w-full bg-gray-800 border border-gray-700 rounded-xl px-4 py-3 text-sm text-white placeholder-gray-600 focus:outline-none focus:border-yellow-500"
                    placeholder="Your Company Pvt. Ltd." />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-gray-400 mb-1.5">Phone *</label>
                  <input name="phone" value={form.phone} onChange={handleChange} required type="tel"
                    className="w-full bg-gray-800 border border-gray-700 rounded-xl px-4 py-3 text-sm text-white placeholder-gray-600 focus:outline-none focus:border-yellow-500"
                    placeholder="+91 98496 97886" />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-gray-400 mb-1.5">Email *</label>
                  <input name="email" value={form.email} onChange={handleChange} required type="email"
                    className="w-full bg-gray-800 border border-gray-700 rounded-xl px-4 py-3 text-sm text-white placeholder-gray-600 focus:outline-none focus:border-yellow-500"
                    placeholder="partner@company.com" />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-gray-400 mb-1.5">City / Location *</label>
                  <input name="city" value={form.city} onChange={handleChange} required
                    className="w-full bg-gray-800 border border-gray-700 rounded-xl px-4 py-3 text-sm text-white placeholder-gray-600 focus:outline-none focus:border-yellow-500"
                    placeholder="Hyderabad" />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-gray-400 mb-1.5">Partnership Type *</label>
                  <select name="partnerType" value={form.partnerType} onChange={handleChange} required
                    className="w-full bg-gray-800 border border-gray-700 rounded-xl px-4 py-3 text-sm text-white focus:outline-none focus:border-yellow-500">
                    <option value="">Select type...</option>
                    <option>Dealer / Distributor</option>
                    <option>Channel Partner</option>
                    <option>Business Associate</option>
                    <option>Architect / Interior Designer</option>
                    <option>Contractor</option>
                    <option>Other</option>
                  </select>
                </div>
              </div>
              <div>
                <label className="block text-xs font-semibold text-gray-400 mb-1.5">Industry Experience</label>
                <input name="experience" value={form.experience} onChange={handleChange}
                  className="w-full bg-gray-800 border border-gray-700 rounded-xl px-4 py-3 text-sm text-white placeholder-gray-600 focus:outline-none focus:border-yellow-500"
                  placeholder="e.g. 5 years in AV integration" />
              </div>
              <div>
                <label className="block text-xs font-semibold text-gray-400 mb-1.5">Message / Requirements</label>
                <textarea name="message" value={form.message} onChange={handleChange} rows={4}
                  className="w-full bg-gray-800 border border-gray-700 rounded-xl px-4 py-3 text-sm text-white placeholder-gray-600 focus:outline-none focus:border-yellow-500 resize-none"
                  placeholder="Tell us about your business and what you're looking for..." />
              </div>
              {error && <p className="text-red-400 text-sm">{error}</p>}
              <button type="submit" disabled={loading}
                className="w-full py-3 bg-yellow-400 text-black font-bold rounded-xl hover:bg-yellow-300 transition-colors disabled:opacity-50 flex items-center justify-center gap-2">
                {loading ? 'Submitting...' : <><FiSend className="w-4 h-4" /> Submit Registration</>}
              </button>
            </form>
          )}

          {/* Direct Contact */}
          <div className="mt-8 flex flex-col sm:flex-row gap-4 justify-center">
            <a href="tel:+919849697886" className="flex items-center justify-center gap-2 px-6 py-3 bg-gray-900 border border-gray-700 rounded-xl text-sm text-gray-300 hover:border-yellow-500 hover:text-white transition-colors">
              <FiPhone className="w-4 h-4 text-yellow-400" /> +91 98496 97886
            </a>
            <a href="mailto:partners@pravaraworldtech.com" className="flex items-center justify-center gap-2 px-6 py-3 bg-gray-900 border border-gray-700 rounded-xl text-sm text-gray-300 hover:border-yellow-500 hover:text-white transition-colors">
              <FiMail className="w-4 h-4 text-yellow-400" /> partners@pravaraworldtech.com
            </a>
          </div>
        </div>
      </section>
    </div>
  );
};

export default PartnerNetworkPage;
