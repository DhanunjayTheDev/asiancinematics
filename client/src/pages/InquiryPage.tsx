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
      <div className="min-h-[60vh] flex items-center justify-center">
        <div className="text-center max-w-md">
          <div className="w-16 h-16 bg-green-100 text-green-600 rounded-full flex items-center justify-center mx-auto mb-4 text-2xl">✓</div>
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Inquiry Submitted!</h2>
          <p className="text-gray-600">Thank you for reaching out. Our team will review your inquiry and get back to you within 24 hours.</p>
        </div>
      </div>
    );
  }

  return (
    <>
      <Helmet>
        <title>Submit an Inquiry | Asian Cinematics</title>
      </Helmet>

      <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Submit an Inquiry</h1>
        <p className="text-gray-600 mb-8">Tell us about your project and we&apos;ll get back to you with a custom solution.</p>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Full Name</label>
              <input type="text" name="name" value={form.name} onChange={handleChange} required className="input-field" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
              <input type="email" name="email" value={form.email} onChange={handleChange} required className="input-field" />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Phone</label>
              <input type="tel" name="phone" value={form.phone} onChange={handleChange} required className="input-field" pattern="[0-9]{10}" title="Enter a valid 10-digit phone number" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Budget (₹, optional)</label>
              <input type="number" name="budget" value={form.budget} onChange={handleChange} className="input-field" min="0" placeholder="Estimated budget" />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Subject</label>
            <input type="text" name="subject" value={form.subject} onChange={handleChange} required className="input-field" placeholder="Brief summary of your requirement" />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Requirements</label>
            <textarea name="requirements" value={form.requirements} onChange={handleChange} required rows={5} className="input-field" placeholder="Describe your project requirements in detail..." />
          </div>

          <button type="submit" disabled={loading} className="btn-primary w-full">
            {loading ? 'Submitting...' : 'Submit Inquiry'}
          </button>
        </form>
      </div>
    </>
  );
};

export default InquiryPage;
