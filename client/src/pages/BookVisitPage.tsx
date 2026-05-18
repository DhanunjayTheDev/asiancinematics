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

      <div className="min-h-screen bg-black">
        {/* Hero */}
        <section className="relative min-h-[300px] flex items-center border-b border-yellow-500/20 overflow-hidden">
          <img
            src="https://images.unsplash.com/photo-1504307651254-35680f356dfd?w=1400&auto=format&fit=crop&q=60"
            alt="Book a Site Visit"
            className="absolute inset-0 w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-black/78" />
          <div className="relative max-w-7xl mx-auto px-6 py-14 w-full">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 items-center">
              <div>
                <span className="text-xs font-semibold text-yellow-400 tracking-widest uppercase mb-4 block">On-Site Assessment</span>
                <h1 className="text-4xl md:text-5xl font-bold mb-4">Book a <span className="text-yellow-400">Site Visit</span></h1>
                <p className="text-gray-300 text-lg max-w-xl">
                  Schedule a visit from our expert team to assess your requirements and provide accurate recommendations on-site.
                </p>
              </div>
              <div className="grid grid-cols-2 gap-3">
                {[
                  { icon: '📍', label: 'Pan India', sub: 'Service Available' },
                  { icon: '⚡', label: 'Quick Visit', sub: 'Next Day Slots' },
                  { icon: '🔍', label: 'Free Survey', sub: 'No Hidden Charges' },
                  { icon: '📋', label: 'Detailed Report', sub: 'Post Assessment' },
                ].map((item) => (
                  <div key={item.label} className="bg-black/50 backdrop-blur border border-yellow-500/20 rounded-xl p-4 flex items-center gap-3">
                    <span className="text-2xl">{item.icon}</span>
                    <div>
                      <p className="text-sm font-bold text-white">{item.label}</p>
                      <p className="text-[10px] text-gray-400">{item.sub}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 py-10">

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
