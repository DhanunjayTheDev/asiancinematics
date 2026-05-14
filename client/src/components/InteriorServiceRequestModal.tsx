import { useState, useRef } from 'react';
import { FiX, FiUpload, FiCheckCircle } from 'react-icons/fi';
import { FaWhatsapp } from 'react-icons/fa';
import api from '../lib/api';
import qrImage from '../assets/qr.jpeg';

interface Props {
  isOpen: boolean;
  onClose: () => void;
}

const SERVICE_TYPES = [
  { label: 'Immediate Service', price: 1500 },
  { label: 'General Inquiry', price: 500 },
  { label: 'Quote Estimate', price: 150 },
  { label: 'Site Visit', price: 2500 },
];

const LOOKING_FOR = [
  'Epoxy Flooring', 'Wall Mural', 'Wall Cladding', 'Water Pool',
  'Water Fountain', 'Fish Aquarium', 'Bubble Wall',
  'Corian Top Backlight Design', 'Stretch Ceiling', 'Star Galaxy Ceiling',
  'Acoustic Design', 'Studio Room Design', 'Conference Room',
  'Meeting Hall', 'Others',
];

const CATEGORIES = ['Client', 'Architect', 'Interior', 'Referral', 'Builder/Contractor', 'Ceiling Contractor'];

const InteriorServiceRequestModal = ({ isOpen, onClose }: Props) => {
  const [step, setStep] = useState<'form' | 'payment' | 'success'>('form');
  const [submitting, setSubmitting] = useState(false);
  const [requestId, setRequestId] = useState('');

  const [form, setForm] = useState({
    name: '',
    contact: '',
    state: '',
    district: '',
    address: '',
    categories: [] as string[],
    systemType: '',
    otherType: '',
    serviceRequestType: '',
    serviceAmount: 0,
    startDate: '',
    specs: '',
    needsDiscussion: false,
  });

  const [utrNumber, setUtrNumber] = useState('');
  const [screenshot, setScreenshot] = useState<File | null>(null);
  const [screenshotPreview, setScreenshotPreview] = useState('');
  const [paymentSubmitting, setPaymentSubmitting] = useState(false);
  const fileRef = useRef<HTMLInputElement>(null);

  if (!isOpen) return null;

  const toggleCategory = (cat: string) => {
    setForm(f => ({
      ...f,
      categories: f.categories.includes(cat)
        ? f.categories.filter(c => c !== cat)
        : [...f.categories, cat],
    }));
  };

  const selectServiceType = (label: string, price: number) => {
    setForm(f => ({ ...f, serviceRequestType: label, serviceAmount: price }));
  };

  const handleScreenshot = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setScreenshot(file);
    setScreenshotPreview(URL.createObjectURL(file));
  };

  const resolvedSystemType = form.systemType === 'Others' ? form.otherType : form.systemType;

  const buildWhatsAppMessage = () => {
    return `🎨 Decorative Design Request:
Name: ${form.name}
Contact: ${form.contact}
State: ${form.state || 'N/A'}
District: ${form.district || 'N/A'}
Address: ${form.address || 'N/A'}
Category: ${form.categories.join(', ') || 'N/A'}
Requirement: ${resolvedSystemType || 'N/A'}
Service: ${form.serviceRequestType || 'N/A'}
Start Date: ${form.startDate || 'N/A'}
Specs: ${form.specs || 'N/A'}
Discussion: ${form.needsDiscussion ? 'Yes' : 'No'}`;
  };

  const handleFormSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.name || !form.contact) return;
    setSubmitting(true);
    try {
      const res = await api.post('/service-requests', {
        formType: 'interior',
        name: form.name,
        contact: form.contact,
        state: form.state,
        district: form.district,
        address: form.address,
        categories: form.categories,
        systemType: resolvedSystemType,
        serviceRequestType: form.serviceRequestType,
        serviceAmount: form.serviceAmount,
        startDate: form.startDate,
        specs: form.specs,
        needsDiscussion: form.needsDiscussion,
      });
      setRequestId(res.data.data._id);
      setStep('payment');
    } catch {
      alert('Failed to submit. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  const handlePaymentSubmit = async () => {
    if (!utrNumber && !screenshot) return;
    setPaymentSubmitting(true);
    try {
      const fd = new FormData();
      fd.append('utrNumber', utrNumber);
      if (screenshot) fd.append('paymentScreenshot', screenshot);
      await api.post(`/service-requests/${requestId}/payment`, fd, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      setStep('success');
    } catch {
      alert('Failed to submit payment. Please try again.');
    } finally {
      setPaymentSubmitting(false);
    }
  };

  const handleClose = () => {
    setStep('form');
    setForm({ name: '', contact: '', state: '', district: '', address: '', categories: [], systemType: '', otherType: '', serviceRequestType: '', serviceAmount: 0, startDate: '', specs: '', needsDiscussion: false });
    setUtrNumber('');
    setScreenshot(null);
    setScreenshotPreview('');
    setRequestId('');
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur p-4">
      <div className="bg-gray-900 border border-gray-700 rounded-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">

        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-700 sticky top-0 bg-gray-900 z-10">
          <div>
            <h2 className="text-xl font-bold text-white">🎨 Interior & Decorative Service Request</h2>
            <p className="text-sm text-gray-400 mt-0.5">
              {step === 'form' ? 'Fill in your details' : step === 'payment' ? 'Complete payment' : 'Request submitted'}
            </p>
          </div>
          <button onClick={handleClose} className="text-gray-400 hover:text-white">
            <FiX className="w-6 h-6" />
          </button>
        </div>

        <div className="px-6 py-5">

          {/* ── STEP 1: FORM ── */}
          {step === 'form' && (
            <form onSubmit={handleFormSubmit} className="space-y-5">

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-1">Name *</label>
                  <input
                    type="text" required
                    value={form.name}
                    onChange={e => setForm(f => ({ ...f, name: e.target.value }))}
                    className="w-full bg-gray-800 border border-gray-600 rounded-lg px-3 py-2 text-white focus:outline-none focus:border-purple-500"
                    placeholder="Your full name"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-1">Contact *</label>
                  <input
                    type="text" required
                    value={form.contact}
                    onChange={e => setForm(f => ({ ...f, contact: e.target.value }))}
                    className="w-full bg-gray-800 border border-gray-600 rounded-lg px-3 py-2 text-white focus:outline-none focus:border-purple-500"
                    placeholder="Phone number"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-1">State</label>
                  <input
                    type="text"
                    value={form.state}
                    onChange={e => setForm(f => ({ ...f, state: e.target.value }))}
                    className="w-full bg-gray-800 border border-gray-600 rounded-lg px-3 py-2 text-white focus:outline-none focus:border-purple-500"
                    placeholder="State"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-1">District</label>
                  <input
                    type="text"
                    value={form.district}
                    onChange={e => setForm(f => ({ ...f, district: e.target.value }))}
                    className="w-full bg-gray-800 border border-gray-600 rounded-lg px-3 py-2 text-white focus:outline-none focus:border-purple-500"
                    placeholder="District"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-1">Address</label>
                <textarea
                  rows={2}
                  value={form.address}
                  onChange={e => setForm(f => ({ ...f, address: e.target.value }))}
                  className="w-full bg-gray-800 border border-gray-600 rounded-lg px-3 py-2 text-white focus:outline-none focus:border-purple-500 resize-none"
                  placeholder="Full address"
                />
              </div>

              {/* Category */}
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">Category</label>
                <div className="flex flex-wrap gap-2">
                  {CATEGORIES.map(cat => (
                    <button
                      key={cat} type="button"
                      onClick={() => toggleCategory(cat)}
                      className={`px-3 py-1.5 rounded-full text-sm font-medium border transition-all ${
                        form.categories.includes(cat)
                          ? 'bg-purple-600 border-purple-600 text-white'
                          : 'bg-gray-800 border-gray-600 text-gray-300 hover:border-gray-400'
                      }`}
                    >
                      {cat}
                    </button>
                  ))}
                </div>
              </div>

              {/* Looking For */}
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-1">Looking For</label>
                <select
                  value={form.systemType}
                  onChange={e => setForm(f => ({ ...f, systemType: e.target.value, otherType: '' }))}
                  className="w-full bg-gray-800 border border-gray-600 rounded-lg px-3 py-2 text-white focus:outline-none focus:border-purple-500"
                >
                  <option value="">-- Select Requirement --</option>
                  {LOOKING_FOR.map(s => <option key={s} value={s}>{s}</option>)}
                </select>
              </div>

              {/* Other text field */}
              {form.systemType === 'Others' && (
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-1">Specify Other</label>
                  <input
                    type="text"
                    value={form.otherType}
                    onChange={e => setForm(f => ({ ...f, otherType: e.target.value }))}
                    className="w-full bg-gray-800 border border-gray-600 rounded-lg px-3 py-2 text-white focus:outline-none focus:border-purple-500"
                    placeholder="Describe your requirement"
                  />
                </div>
              )}

              {/* Service Type */}
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">Service Type</label>
                <div className="grid grid-cols-2 gap-3">
                  {SERVICE_TYPES.map(st => (
                    <button
                      key={st.label} type="button"
                      onClick={() => selectServiceType(st.label, st.price)}
                      className={`flex items-center justify-between px-4 py-3 rounded-xl border text-sm font-medium transition-all ${
                        form.serviceRequestType === st.label
                          ? 'bg-purple-500/20 border-purple-500 text-purple-400'
                          : 'bg-gray-800 border-gray-600 text-gray-300 hover:border-gray-400'
                      }`}
                    >
                      <span>{st.label}</span>
                      <span className="font-bold">₹{st.price}</span>
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-1">Project Start Date</label>
                <input
                  type="date"
                  value={form.startDate}
                  onChange={e => setForm(f => ({ ...f, startDate: e.target.value }))}
                  className="w-full bg-gray-800 border border-gray-600 rounded-lg px-3 py-2 text-white focus:outline-none focus:border-purple-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-1">Specifications / Design Requirements</label>
                <textarea
                  rows={3}
                  value={form.specs}
                  onChange={e => setForm(f => ({ ...f, specs: e.target.value }))}
                  className="w-full bg-gray-800 border border-gray-600 rounded-lg px-3 py-2 text-white focus:outline-none focus:border-purple-500 resize-none"
                  placeholder="Describe your design requirements..."
                />
              </div>

              <label className="flex items-center gap-3 cursor-pointer">
                <input
                  type="checkbox"
                  checked={form.needsDiscussion}
                  onChange={e => setForm(f => ({ ...f, needsDiscussion: e.target.checked }))}
                  className="w-4 h-4 accent-purple-600"
                />
                <span className="text-sm text-gray-300">Need More Discussion With Team</span>
              </label>

              {form.serviceRequestType && (
                <div className="bg-purple-500/10 border border-purple-500/30 rounded-xl p-4">
                  <p className="text-purple-400 font-semibold">Service Charge: ₹{form.serviceAmount}</p>
                  <p className="text-xs text-gray-400 mt-1">* Ticket charges will be adjusted in final project value. Cashback available.</p>
                </div>
              )}

              {/* WhatsApp Buttons */}
              <div className="grid grid-cols-2 gap-3">
                <button
                  type="button"
                  onClick={() => window.open(`https://wa.me/919966167886?text=${encodeURIComponent(buildWhatsAppMessage())}`, '_blank')}
                  className="flex items-center justify-center gap-2 py-2.5 bg-green-600 hover:bg-green-700 text-white text-sm font-semibold rounded-lg transition"
                >
                  <FaWhatsapp className="w-4 h-4" /> Send Details
                </button>
                <button
                  type="button"
                  onClick={() => window.open('https://wa.me/919849697886', '_blank')}
                  className="flex items-center justify-center gap-2 py-2.5 bg-green-500 hover:bg-green-600 text-white text-sm font-semibold rounded-lg transition"
                >
                  <FaWhatsapp className="w-4 h-4" /> Quick Chat
                </button>
              </div>

              <button
                type="submit"
                disabled={submitting}
                className="w-full bg-purple-600 hover:bg-purple-700 disabled:opacity-60 text-white font-bold py-3 rounded-xl transition"
              >
                {submitting ? 'Submitting...' : 'Proceed to Payment →'}
              </button>

              <p className="text-xs text-gray-500 text-center">
                * Our pricing is challenge-based and customized as per your requirement.
              </p>
            </form>
          )}

          {/* ── STEP 2: PAYMENT ── */}
          {step === 'payment' && (
            <div className="space-y-6">
              <div className="bg-green-500/10 border border-green-500/30 rounded-xl p-4">
                <p className="text-green-400 font-semibold">✅ Request submitted!</p>
                <p className="text-sm text-gray-400 mt-1">Complete payment to confirm your service request.</p>
              </div>

              {form.serviceAmount > 0 && (
                <div className="text-center">
                  <p className="text-gray-300 mb-2 font-medium">Scan & Pay ₹{form.serviceAmount}</p>
                  <img src={qrImage} alt="UPI QR Code" className="w-52 h-52 mx-auto rounded-xl border border-gray-700 object-cover" />
                  <p className="text-sm text-gray-400 mt-2">UPI ID: <span className="text-white font-mono">pravaraworldtech@upi</span></p>
                </div>
              )}

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-1">UTR Number / Transaction ID</label>
                <input
                  type="text"
                  value={utrNumber}
                  onChange={e => setUtrNumber(e.target.value)}
                  className="w-full bg-gray-800 border border-gray-600 rounded-lg px-3 py-2 text-white font-mono focus:outline-none focus:border-purple-500"
                  placeholder="Enter UTR / Transaction ID"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">Payment Screenshot</label>
                {screenshotPreview ? (
                  <div className="relative inline-block">
                    <img src={screenshotPreview} alt="Screenshot" className="w-40 h-40 object-cover rounded-lg border border-gray-600" />
                    <button
                      onClick={() => { setScreenshot(null); setScreenshotPreview(''); }}
                      className="absolute -top-2 -right-2 bg-red-500 rounded-full w-5 h-5 flex items-center justify-center text-white text-xs"
                    >✕</button>
                  </div>
                ) : (
                  <button
                    type="button"
                    onClick={() => fileRef.current?.click()}
                    className="flex items-center gap-2 px-4 py-3 border-2 border-dashed border-gray-600 rounded-xl text-gray-400 hover:border-purple-500 hover:text-purple-400 transition w-full justify-center"
                  >
                    <FiUpload className="w-5 h-5" />
                    Upload Payment Screenshot
                  </button>
                )}
                <input ref={fileRef} type="file" accept="image/*" onChange={handleScreenshot} className="hidden" />
              </div>

              <button
                onClick={handlePaymentSubmit}
                disabled={paymentSubmitting || (!utrNumber && !screenshot)}
                className="w-full bg-purple-600 hover:bg-purple-700 disabled:opacity-60 text-white font-bold py-3 rounded-xl transition"
              >
                {paymentSubmitting ? 'Submitting...' : 'Submit Payment Details'}
              </button>

              <p className="text-xs text-gray-500 text-center">
                * Ticket charges will be adjusted in final project value. Our pricing is customized as per your requirement.
              </p>
            </div>
          )}

          {/* ── STEP 3: SUCCESS ── */}
          {step === 'success' && (
            <div className="text-center py-8 space-y-4">
              <FiCheckCircle className="w-16 h-16 text-purple-400 mx-auto" />
              <h3 className="text-2xl font-bold text-white">Payment Submitted!</h3>
              <p className="text-gray-300 max-w-sm mx-auto">
                Our team will verify your payment and confirm your interior & decorative service request soon.
              </p>
              <p className="text-sm text-gray-400">We'll contact you at <span className="text-white font-medium">{form.contact}</span></p>
              <button
                onClick={handleClose}
                className="mt-4 px-8 py-3 bg-purple-600 hover:bg-purple-700 text-white font-bold rounded-xl transition"
              >
                Done
              </button>
            </div>
          )}

        </div>
      </div>
    </div>
  );
};

export default InteriorServiceRequestModal;
