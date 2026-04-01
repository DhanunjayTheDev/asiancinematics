import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { toast } from 'react-hot-toast';
import api from '../lib/api';

const ServiceRequestPage = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({
    service: '',
    subject: '',
    description: '',
    priority: 'medium',
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setForm((p) => ({ ...p, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      await api.post('/services/tickets', form);
      toast.success('Service request submitted!');
      navigate('/profile');
    } catch (err: any) {
      toast.error(err.response?.data?.message || 'Failed to submit request');
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Helmet>
        <title>Request a Service | Asian Cinematics</title>
      </Helmet>

      <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Request a Service</h1>
        <p className="text-gray-600 mb-8">Fill out the form below and our team will get started on your request.</p>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Subject</label>
            <input type="text" name="subject" value={form.subject} onChange={handleChange} required className="input-field" placeholder="Brief description of what you need" />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Priority</label>
            <select name="priority" value={form.priority} onChange={handleChange} className="input-field">
              <option value="low">Low</option>
              <option value="medium">Medium</option>
              <option value="high">High</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
            <textarea name="description" value={form.description} onChange={handleChange} required rows={5} className="input-field" placeholder="Provide detailed information about your service request..." />
          </div>

          <button type="submit" disabled={loading} className="btn-primary w-full">
            {loading ? 'Submitting...' : 'Submit Request'}
          </button>
        </form>
      </div>
    </>
  );
};

export default ServiceRequestPage;
