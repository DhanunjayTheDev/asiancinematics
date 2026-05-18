import { useState } from 'react';
import { Helmet } from 'react-helmet-async';
import { toast } from 'react-hot-toast';
import api from '../lib/api';

const InquiryPage = () => {
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [form, setForm] = useState({
    name: '',
    email: '',
    phone: '',
    subject: '',
    requirements: '',
    budget: '',
    source: 'website',
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setForm((p) => ({ ...p, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      await api.post('/inquiries', { ...form, budget: form.budget ? Number(form.budget) : undefined });
      setSubmitted(true);
    } catch (err: any) {
      toast.error(err.response?.data?.message || 'Failed to submit inquiry');
    } finally {
      setLoading(false);
    }
  };

  if (submitted) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center bg-black">
        <div className="text-center max-w-md">
          <div className="w-16 h-16 bg-green-500/20 text-green-400 rounded-full flex items-center justify-center mx-auto mb-4 text-2xl">✓</div>
          <h2 className="text-2xl font-bold text-white mb-2">Inquiry Submitted!</h2>
          <p className="text-gray-400">Thank you for reaching out. Our team will review your inquiry and get back to you within 24 hours.</p>
        </div>
      </div>
    );
  }

  return (
    <>
      <Helmet>
        <title>Submit an Inquiry | Pravara World Tech</title>
      </Helmet>

      <div className="min-h-screen bg-black">
        {/* Hero */}
        <section className="relative min-h-[320px] flex items-center border-b border-yellow-500/20 overflow-hidden">
          <img
            src="https://images.unsplash.com/photo-1521737711867-e3b97375f902?w=1400&auto=format&fit=crop&q=60"
            alt="Submit Inquiry"
            className="absolute inset-0 w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-black/78" />
          <div className="relative max-w-7xl mx-auto px-6 py-16 w-full">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 items-center">
              <div>
                <span className="text-xs font-semibold text-yellow-400 tracking-widest uppercase mb-4 block">Free Consultation</span>
                <h1 className="text-4xl md:text-5xl font-bold mb-4">Submit an <span className="text-yellow-400">Inquiry</span></h1>
                <p className="text-gray-300 text-lg max-w-xl">
                  Tell us about your project and we'll get back to you with a custom solution within 24 hours.
                </p>
              </div>
              <div className="grid grid-cols-3 gap-3">
                {[
                  { value: '24h', label: 'Response Time' },
                  { value: 'Free', label: 'Consultation' },
                  { value: '100%', label: 'Confidential' },
                ].map((s) => (
                  <div key={s.label} className="bg-black/50 backdrop-blur border border-yellow-500/20 rounded-xl p-4 text-center">
                    <p className="text-xl font-bold text-yellow-400">{s.value}</p>
                    <p className="text-[11px] text-gray-400 mt-1">{s.label}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 py-12">

          <form onSubmit={handleSubmit} className="bg-gradient-to-br from-blue-900/20 to-purple-900/20 border border-blue-500/30 rounded-lg p-8 space-y-6">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">Full Name</label>
                <input 
                  type="text" 
                  name="name" 
                  value={form.name} 
                  onChange={handleChange} 
                  required 
                  className="w-full px-4 py-3 bg-blue-900/30 border border-blue-500/30 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-yellow-400 transition-colors" 
                  placeholder="Your full name"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">Email</label>
                <input 
                  type="email" 
                  name="email" 
                  value={form.email} 
                  onChange={handleChange} 
                  required 
                  className="w-full px-4 py-3 bg-blue-900/30 border border-blue-500/30 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-yellow-400 transition-colors" 
                  placeholder="your@email.com"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">Phone Number</label>
                <input 
                  type="tel" 
                  name="phone" 
                  value={form.phone} 
                  onChange={handleChange} 
                  required 
                  className="w-full px-4 py-3 bg-blue-900/30 border border-blue-500/30 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-yellow-400 transition-colors" 
                  placeholder="10-digit number"
                  pattern="[0-9]{10}" 
                  title="Enter a valid 10-digit phone number" 
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">Budget (₹, optional)</label>
                <input 
                  type="number" 
                  name="budget" 
                  value={form.budget} 
                  onChange={handleChange} 
                  className="w-full px-4 py-3 bg-blue-900/30 border border-blue-500/30 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-yellow-400 transition-colors" 
                  min="0" 
                  placeholder="Estimated budget"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">Subject</label>
              <input 
                type="text" 
                name="subject" 
                value={form.subject} 
                onChange={handleChange} 
                required 
                className="w-full px-4 py-3 bg-blue-900/30 border border-blue-500/30 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-yellow-400 transition-colors" 
                placeholder="Brief summary of your requirement"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">Requirements</label>
              <textarea 
                name="requirements" 
                value={form.requirements} 
                onChange={handleChange} 
                required 
                rows={5} 
                className="w-full px-4 py-3 bg-blue-900/30 border border-blue-500/30 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-yellow-400 transition-colors resize-none" 
                placeholder="Describe your project requirements in detail..."
              />
            </div>

            <button 
              type="submit" 
              disabled={loading} 
              className="w-full px-6 py-3 bg-blue-600 hover:bg-blue-700 disabled:bg-blue-600/50 text-white font-semibold rounded-lg transition-colors"
            >
              {loading ? 'Submitting...' : 'Submit Inquiry It\'s Free'}
            </button>
          </form>
        </div>
      </div>
    </>
  );

};

export default InquiryPage;
