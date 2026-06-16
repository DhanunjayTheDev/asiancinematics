import { useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { FiCheckCircle, FiUser, FiBriefcase, FiSend } from 'react-icons/fi';
import api from '../lib/api';
import CustomSelect from '../components/CustomSelect';

type Role = 'partner' | 'freelancer' | 'employee';

const roleConfig: Record<Role, {
  title: string; subtitle: string; accent: string; img: string; desc: string;
}> = {
  partner: {
    title: 'Partner Registration',
    subtitle: 'Dealer / Distributor / Channel Partner',
    accent: 'yellow',
    img: 'https://images.unsplash.com/photo-1542744173-8e7e53415bb0?w=1400&auto=format&fit=crop&q=60',
    desc: 'Join our authorized partner network and get access to our brand portfolio with competitive dealer pricing.',
  },
  freelancer: {
    title: 'Freelancer Registration',
    subtitle: 'Independent Technician / Installer',
    accent: 'cyan',
    img: 'https://images.unsplash.com/photo-1581092918056-0c4c3acd3789?w=1400&auto=format&fit=crop&q=60',
    desc: 'Join our freelancer pool to work on exciting projects across smart home, security, AV, and structural works.',
  },
  employee: {
    title: 'Employee Registration',
    subtitle: 'Full-Time / Part-Time Position',
    accent: 'green',
    img: 'https://images.unsplash.com/photo-1521737852567-6949f3f9f2b5?w=1400&auto=format&fit=crop&q=60',
    desc: 'Become part of the Pravara World Tech family and grow your career in cutting-edge technology solutions.',
  },
};

const accentClasses: Record<string, { badge: string; btn: string; border: string; text: string }> = {
  yellow: { badge: 'bg-yellow-400/10 border-yellow-400/30 text-yellow-400', btn: 'bg-yellow-400 hover:bg-yellow-300 text-black', border: 'focus:border-yellow-400', text: 'text-yellow-400' },
  cyan:   { badge: 'bg-cyan-400/10 border-cyan-400/30 text-cyan-400',       btn: 'bg-cyan-500 hover:bg-cyan-400 text-black',    border: 'focus:border-cyan-400',   text: 'text-cyan-400' },
  green:  { badge: 'bg-green-400/10 border-green-400/30 text-green-400',    btn: 'bg-green-500 hover:bg-green-400 text-black',  border: 'focus:border-green-400',  text: 'text-green-400' },
};

const SKILLS = ['Home Theatre / AV', 'Smart Home / Automation', 'CCTV / Security', 'Networking', 'Electrical', 'Epoxy Flooring', 'Stretch Ceiling', 'Tensile / Structural', 'Lighting', 'Carpentry'];
const POSITIONS = ['Sales Executive', 'Service Technician', 'Project Manager', 'Installation Engineer', 'Customer Support', 'Marketing Executive', 'IT / Admin', 'Site Supervisor'];
const PARTNER_TYPES = ['Dealer / Distributor', 'Channel Partner', 'Business Associate', 'Architect / Interior Designer', 'Contractor', 'Other'];

const JoinWithUsPage = () => {
  const { role } = useParams<{ role: string }>();
  const type = (role && roleConfig[role as Role]) ? role as Role : 'partner';
  const cfg = roleConfig[type];
  const ac = accentClasses[cfg.accent];

  const [form, setForm] = useState({
    name: '', email: '', phone: '', city: '',
    company: '', partnerType: '',
    skills: [] as string[], portfolio: '', availability: '',
    position: '', qualification: '', resumeLink: '',
    experience: '', message: '',
  });
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState('');

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setForm(f => ({ ...f, [e.target.name]: e.target.value }));
  };

  const toggleSkill = (skill: string) => {
    setForm(f => ({
      ...f,
      skills: f.skills.includes(skill) ? f.skills.filter(s => s !== skill) : [...f.skills, skill],
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      await api.post('/registrations', { type, ...form });
      setSubmitted(true);
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to submit. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const inputCls = `w-full bg-gray-800 border border-gray-700 rounded-xl px-4 py-3 text-sm text-white placeholder-gray-600 focus:outline-none ${ac.border} transition-colors`;

  if (submitted) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center px-4">
        <div className="text-center max-w-md">
          <FiCheckCircle className={`w-20 h-20 mx-auto mb-6 ${ac.text}`} />
          <h2 className="text-3xl font-bold text-white mb-3">Application Submitted!</h2>
          <p className="text-gray-400 mb-8">Thank you for your interest. Our team will review your application and reach out within 48 hours.</p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <Link to="/" className={`px-6 py-3 rounded-full font-bold ${ac.btn} transition-colors`}>Go Home</Link>
            <Link to="/contact" className="px-6 py-3 rounded-full font-bold bg-gray-800 text-white hover:bg-gray-700 transition-colors">Contact Us</Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black text-white">
      <Helmet><title>{cfg.title} | Pravara World Tech</title></Helmet>

      {/* Hero */}
      <section className="relative min-h-[320px] flex items-center border-b border-yellow-500/20 overflow-hidden">
        <img src={cfg.img} alt={cfg.title} className="absolute inset-0 w-full h-full object-cover" />
        <div className="absolute inset-0 bg-black/80" />
        <div className="relative max-w-7xl mx-auto px-6 py-16 w-full">
          <div className="max-w-xl">
            <span className={`text-xs font-semibold tracking-widest uppercase mb-4 block ${ac.text}`}>Join With Us</span>
            <h1 className="text-4xl md:text-5xl font-bold mb-4">{cfg.title.split(' ').slice(0, -1).join(' ')} <span className={ac.text}>{cfg.title.split(' ').slice(-1)}</span></h1>
            <p className="text-gray-300 text-lg">{cfg.desc}</p>
          </div>
        </div>
      </section>

      {/* Role Switcher */}
      <section className="py-6 px-6 border-b border-gray-800">
        <div className="max-w-3xl mx-auto flex gap-3 flex-wrap justify-center">
          {(Object.keys(roleConfig) as Role[]).map(r => (
            <Link
              key={r}
              to={`/join/${r}`}
              className={`px-5 py-2 rounded-full text-sm font-semibold transition-colors ${r === type ? `${accentClasses[roleConfig[r].accent].btn}` : 'bg-gray-800 text-gray-400 hover:bg-gray-700 hover:text-white'}`}
            >
              {r === 'partner' ? '🤝 Partner' : r === 'freelancer' ? '💼 Freelancer' : '👤 Employee'}
            </Link>
          ))}
        </div>
      </section>

      {/* Form */}
      <section className="py-12 px-6">
        <div className="max-w-2xl mx-auto">
          <form onSubmit={handleSubmit} className="bg-gray-900/50 border border-gray-700/50 rounded-2xl p-8 space-y-5">
            <p className={`text-xs font-semibold tracking-widest uppercase ${ac.text}`}>{cfg.subtitle}</p>

            {/* Common fields */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
              <div>
                <label className="block text-xs font-semibold text-gray-400 mb-1.5">Full Name *</label>
                <input name="name" value={form.name} onChange={handleChange} required placeholder="Your full name" className={inputCls} />
              </div>
              <div>
                <label className="block text-xs font-semibold text-gray-400 mb-1.5">Phone *</label>
                <input name="phone" value={form.phone} onChange={handleChange} required type="tel" placeholder="+91 98496 97886" className={inputCls} />
              </div>
              <div>
                <label className="block text-xs font-semibold text-gray-400 mb-1.5">Email *</label>
                <input name="email" value={form.email} onChange={handleChange} required type="email" placeholder="you@email.com" className={inputCls} />
              </div>
              <div>
                <label className="block text-xs font-semibold text-gray-400 mb-1.5">City / Location</label>
                <input name="city" value={form.city} onChange={handleChange} placeholder="Hyderabad" className={inputCls} />
              </div>
            </div>

            {/* Partner fields */}
            {type === 'partner' && (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                <div>
                  <label className="block text-xs font-semibold text-gray-400 mb-1.5">Company Name</label>
                  <input name="company" value={form.company} onChange={handleChange} placeholder="Your Company Pvt. Ltd." className={inputCls} />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-gray-400 mb-1.5">Partnership Type *</label>
                  <CustomSelect
                    value={form.partnerType}
                    onChange={v => setForm(f => ({ ...f, partnerType: String(v) }))}
                    placeholder="Select type..."
                    options={PARTNER_TYPES.map(p => ({ value: p, label: p }))}
                  />
                </div>
              </div>
            )}

            {/* Freelancer fields */}
            {type === 'freelancer' && (
              <>
                <div>
                  <label className="block text-xs font-semibold text-gray-400 mb-2">Skills (select all that apply) *</label>
                  <div className="flex flex-wrap gap-2">
                    {SKILLS.map(skill => (
                      <button key={skill} type="button" onClick={() => toggleSkill(skill)}
                        className={`px-3 py-1.5 text-xs rounded-full border transition-colors ${form.skills.includes(skill) ? `${accentClasses[cfg.accent].badge} font-semibold` : 'border-gray-700 text-gray-400 hover:border-gray-500'}`}>
                        {skill}
                      </button>
                    ))}
                  </div>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                  <div>
                    <label className="block text-xs font-semibold text-gray-400 mb-1.5">Portfolio / LinkedIn URL</label>
                    <input name="portfolio" value={form.portfolio} onChange={handleChange} placeholder="https://..." className={inputCls} />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-gray-400 mb-1.5">Availability</label>
                    <CustomSelect
                      value={form.availability}
                      onChange={v => setForm(f => ({ ...f, availability: String(v) }))}
                      placeholder="Select..."
                      options={['Full-time', 'Part-time', 'Weekend only', 'Project basis'].map(v => ({ value: v, label: v }))}
                    />
                  </div>
                </div>
              </>
            )}

            {/* Employee fields */}
            {type === 'employee' && (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                <div>
                  <label className="block text-xs font-semibold text-gray-400 mb-1.5">Position Applied For *</label>
                  <CustomSelect
                    value={form.position}
                    onChange={v => setForm(f => ({ ...f, position: String(v) }))}
                    placeholder="Select position..."
                    options={[...POSITIONS, 'Other'].map(p => ({ value: p, label: p }))}
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-gray-400 mb-1.5">Highest Qualification</label>
                  <input name="qualification" value={form.qualification} onChange={handleChange} placeholder="e.g. B.Tech Electronics" className={inputCls} />
                </div>
                <div className="sm:col-span-2">
                  <label className="block text-xs font-semibold text-gray-400 mb-1.5">Resume / Portfolio Link</label>
                  <input name="resumeLink" value={form.resumeLink} onChange={handleChange} placeholder="Google Drive / LinkedIn / Portfolio URL" className={inputCls} />
                </div>
              </div>
            )}

            {/* Common bottom fields */}
            <div>
              <label className="block text-xs font-semibold text-gray-400 mb-1.5">Years of Experience</label>
              <input name="experience" value={form.experience} onChange={handleChange} placeholder="e.g. 5 years in AV integration" className={inputCls} />
            </div>
            <div>
              <label className="block text-xs font-semibold text-gray-400 mb-1.5">Message / Additional Info</label>
              <textarea name="message" value={form.message} onChange={handleChange} rows={3}
                className={`${inputCls} resize-none`}
                placeholder="Tell us more about yourself and what you're looking for..." />
            </div>

            {error && <p className="text-red-400 text-sm">{error}</p>}

            <button type="submit" disabled={loading}
              className={`w-full py-3 font-bold rounded-xl transition-colors disabled:opacity-50 flex items-center justify-center gap-2 ${ac.btn}`}>
              {loading ? 'Submitting...' : <><FiSend className="w-4 h-4" /> Submit Application</>}
            </button>
          </form>

          <p className="text-center text-xs text-gray-500 mt-4">
            Already have an account? <Link to="/login" className={`${ac.text} hover:underline`}>Login here</Link>
          </p>
        </div>
      </section>
    </div>
  );
};

export default JoinWithUsPage;
