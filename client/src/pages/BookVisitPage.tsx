import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { toast } from 'react-hot-toast';
import api from '../lib/api';
import CustomSelect from '../components/CustomSelect';

const BookVisitPage = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({
    date: '',
    timeSlot: '',
    location: { address: '', city: '', state: '', pincode: '' },
    notes: '',
  });

  const timeSlots = [
    '09:00 AM - 11:00 AM',
    '11:00 AM - 01:00 PM',
    '02:00 PM - 04:00 PM',
    '04:00 PM - 06:00 PM',
  ];

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    if (name.startsWith('location.')) {
      const key = name.split('.')[1];
      setForm((p) => ({ ...p, location: { ...p.location, [key]: value } }));
    } else {
      setForm((p) => ({ ...p, [name]: value }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      await api.post('/site-visits', form);
      toast.success('Site visit booked successfully!');
      navigate('/profile');
    } catch (err: any) {
      toast.error(err.response?.data?.message || 'Failed to book visit');
    } finally {
      setLoading(false);
    }
  };

  const tomorrow = new Date();
  tomorrow.setDate(tomorrow.getDate() + 1);
  const minDate = tomorrow.toISOString().split('T')[0];

  return (
    <>
      <Helmet>
        <title>Book a Site Visit | Pravara World Tech</title>
      </Helmet>

      <div className="min-h-screen bg-gradient-to-br from-black to-blue-950/30">
        <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <h1 className="text-3xl font-semibold tracking-tight text-white mb-2">Book a Site Visit</h1>
          <p className="text-gray-400 mb-8">Schedule a visit from our team to assess your requirements on-site.</p>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">Preferred Date</label>
                <input type="date" name="date" min={minDate} value={form.date} onChange={handleChange} required className="w-full bg-black/40 border border-blue-500/30 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-yellow-400 transition" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">Time Slot</label>
                <CustomSelect
                  value={form.timeSlot}
                  onChange={(value) => setForm({ ...form, timeSlot: String(value) })}
                  options={timeSlots.map((s) => ({ value: s, label: s }))}
                  placeholder="Select a slot"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">Address</label>
              <input type="text" name="location.address" value={form.location.address} onChange={handleChange} required className="w-full bg-black/40 border border-blue-500/30 rounded-lg px-4 py-2 text-white placeholder-gray-500 focus:outline-none focus:border-yellow-400 transition" placeholder="Street address" />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">City</label>
                <input type="text" name="location.city" value={form.location.city} onChange={handleChange} required className="w-full bg-black/40 border border-blue-500/30 rounded-lg px-4 py-2 text-white placeholder-gray-500 focus:outline-none focus:border-yellow-400 transition" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">State</label>
                <input type="text" name="location.state" value={form.location.state} onChange={handleChange} required className="w-full bg-black/40 border border-blue-500/30 rounded-lg px-4 py-2 text-white placeholder-gray-500 focus:outline-none focus:border-yellow-400 transition" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">Pincode</label>
                <input type="text" name="location.pincode" value={form.location.pincode} onChange={handleChange} required className="w-full bg-black/40 border border-blue-500/30 rounded-lg px-4 py-2 text-white placeholder-gray-500 focus:outline-none focus:border-yellow-400 transition" pattern="[0-9]{6}" title="Enter a valid 6-digit pincode" />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">Notes (optional)</label>
              <textarea name="notes" value={form.notes} onChange={handleChange} rows={3} className="w-full bg-black/40 border border-blue-500/30 rounded-lg px-4 py-2 text-white placeholder-gray-500 focus:outline-none focus:border-yellow-400 transition resize-none" placeholder="Any specific requirements or instructions..." />
            </div>

            <button type="submit" disabled={loading} className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 rounded-lg transition disabled:opacity-50">
              {loading ? 'Booking...' : 'Book Site Visit'}
            </button>
          </form>
        </div>
      </div>
    </>
  );
};

export default BookVisitPage;
