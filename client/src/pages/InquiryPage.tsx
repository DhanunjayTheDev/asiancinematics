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

      <div className="min-h-screen bg-black py-12">
        <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8">
          <h1 className="text-4xl font-bold text-white mb-2">Submit an Inquiry</h1>
          <p className="text-gray-400 mb-8">Tell us about your project and we&apos;ll get back to you with a custom solution within 24 hours.</p>

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
              {loading ? 'Submitting...' : 'Submit Inquiry — It\'s Free'}
            </button>
          </form>
        </div>
      </div>
    </>
  );
};

export default InquiryPage;
