import { useState } from 'react';
import { FaWhatsapp } from 'react-icons/fa';
import { FiX, FiUser, FiPhone, FiMail, FiMessageSquare } from 'react-icons/fi';
import toast from 'react-hot-toast';
import api from '../lib/api';

interface Props {
  isOpen: boolean;
  onClose: () => void;
}

const INQUIRY_TYPES = [
  'Any Inquiries',
  'Product Information',
  'Site Visit',
  'Renovation',
  'Service Support',
  'General Inquiry',
  'Project Estimation',
  'Charges Information',
];

const PRIMARY_WA = '919849697886';
const SECONDARY_WA = '918143550515';

const QuickRequestModal = ({ isOpen, onClose }: Props) => {
  const [form, setForm] = useState({ name: '', phone: '', email: '', message: '' });
  const [selectedTypes, setSelectedTypes] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);
  const [sent, setSent] = useState(false);
  const [builtMessage, setBuiltMessage] = useState('');

  if (!isOpen) return null;

  const toggleType = (type: string) => {
    setSelectedTypes(prev =>
      prev.includes(type) ? prev.filter(t => t !== type) : [...prev, type]
    );
  };

  const buildWhatsAppMessage = () => {
    const types = selectedTypes.length
      ? selectedTypes.map(t => `- ${t}`).join('\n')
      : '- (no inquiry type selected)';

    return [
      '🙏 *For Better & Fast Feedback Services* 🙏',
      '',
      '*Inquiries:*',
      types,
      '',
      '*Details:*',
      form.message || '(no extra details)',
      '',
      '*Contact Info:*',
      `Name: ${form.name}`,
      `Phone: ${form.phone}`,
      form.email ? `Email: ${form.email}` : '',
      '',
      'Thanking You 🙏',
      'Praveen Kumar Yougi A',
      'Pravara World Tech | Asian Cinematics | Ecop World International',
    ]
      .filter(line => line !== undefined)
      .join('\n');
  };

  const openWhatsApp = (number: string, message: string) => {
    window.open(`https://wa.me/${number}?text=${encodeURIComponent(message)}`, '_blank');
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!form.name || !form.phone) return toast.error('Name and phone are required');
    if (selectedTypes.length === 0) return toast.error('Please select at least one inquiry type');

    setLoading(true);
    try {
      const subject = selectedTypes.join(', ');
      const payload: Record<string, string> = {
        name: form.name,
        phone: form.phone,
        subject,
        message: form.message || 'Quick WhatsApp request',
        source: 'whatsapp',
      };
      if (form.email) payload.email = form.email;

      await api.post('/inquiries', payload);

      const msg = buildWhatsAppMessage();
      setBuiltMessage(msg);
      openWhatsApp(PRIMARY_WA, msg);
      setSent(true);
    } catch {
      toast.error('Failed to save request. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleClose = () => {
    setForm({ name: '', phone: '', email: '', message: '' });
    setSelectedTypes([]);
    setSent(false);
    setBuiltMessage('');
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-4">
      <div className="fixed inset-0 bg-black/60 backdrop-blur-sm" onClick={handleClose} />

      <div className="relative bg-gray-900 border border-green-500/30 rounded-2xl shadow-2xl w-full max-w-lg z-10 max-h-[90vh] flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between p-5 border-b border-gray-800 flex-shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 bg-green-500 rounded-full flex items-center justify-center">
              <FaWhatsapp className="w-5 h-5 text-white" />
            </div>
            <div>
              <h2 className="text-white font-bold text-base">Quick Service</h2>
              <p className="text-gray-400 text-xs">We'll reply on WhatsApp</p>
            </div>
          </div>
          <button onClick={handleClose} className="p-1.5 text-gray-400 hover:text-white rounded-lg hover:bg-gray-800 transition-colors">
            <FiX className="w-5 h-5" />
          </button>
        </div>

        {/* Body */}
        <div className="overflow-y-auto flex-1 p-5">
          {sent ? (
            <div className="text-center py-6">
              <div className="w-16 h-16 bg-green-500/20 rounded-full flex items-center justify-center mx-auto mb-4">
                <FaWhatsapp className="w-8 h-8 text-green-400" />
              </div>
              <h3 className="text-white font-bold text-lg mb-2">Message Sent to WhatsApp!</h3>
              <p className="text-gray-400 text-sm mb-6">Opened WhatsApp with your request to 9849697886</p>
              <button
                onClick={() => openWhatsApp(SECONDARY_WA, builtMessage)}
                className="w-full flex items-center justify-center gap-2 bg-green-600 hover:bg-green-700 text-white font-semibold py-3 rounded-xl transition mb-3"
              >
                <FaWhatsapp className="w-5 h-5" />
                Also Send to 8143550515
              </button>
              <button
                onClick={handleClose}
                className="w-full py-3 rounded-xl border border-gray-700 text-gray-300 hover:text-white hover:border-gray-500 transition text-sm"
              >
                Close
              </button>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              {/* Name & Phone */}
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs text-gray-400 mb-1.5 font-medium">Your Name *</label>
                  <div className="relative">
                    <FiUser className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
                    <input
                      type="text"
                      placeholder="Full name"
                      value={form.name}
                      onChange={e => setForm(p => ({ ...p, name: e.target.value }))}
                      className="w-full bg-gray-800 border border-gray-700 rounded-xl pl-9 pr-3 py-2.5 text-white text-sm focus:outline-none focus:border-green-500/60 placeholder-gray-600"
                      required
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-xs text-gray-400 mb-1.5 font-medium">Phone *</label>
                  <div className="relative">
                    <FiPhone className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
                    <input
                      type="tel"
                      placeholder="+91 98xxxxxxx"
                      value={form.phone}
                      onChange={e => setForm(p => ({ ...p, phone: e.target.value }))}
                      className="w-full bg-gray-800 border border-gray-700 rounded-xl pl-9 pr-3 py-2.5 text-white text-sm focus:outline-none focus:border-green-500/60 placeholder-gray-600"
                      required
                    />
                  </div>
                </div>
              </div>

              {/* Email */}
              <div>
                <label className="block text-xs text-gray-400 mb-1.5 font-medium">Email (optional)</label>
                <div className="relative">
                  <FiMail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
                  <input
                    type="email"
                    placeholder="you@example.com"
                    value={form.email}
                    onChange={e => setForm(p => ({ ...p, email: e.target.value }))}
                    className="w-full bg-gray-800 border border-gray-700 rounded-xl pl-9 pr-3 py-2.5 text-white text-sm focus:outline-none focus:border-green-500/60 placeholder-gray-600"
                  />
                </div>
              </div>

              {/* Inquiry Types */}
              <div>
                <label className="block text-xs text-gray-400 mb-2 font-medium">Choose Inquiry Type(s) *</label>
                <div className="grid grid-cols-2 gap-2">
                  {INQUIRY_TYPES.map(type => (
                    <button
                      key={type}
                      type="button"
                      onClick={() => toggleType(type)}
                      className={`text-left px-3 py-2.5 rounded-xl text-xs font-medium border transition-all ${
                        selectedTypes.includes(type)
                          ? 'bg-green-600/20 border-green-500/60 text-green-400'
                          : 'bg-gray-800 border-gray-700 text-gray-400 hover:border-gray-500 hover:text-gray-300'
                      }`}
                    >
                      <span className="mr-1.5">{selectedTypes.includes(type) ? '✓' : '○'}</span>
                      {type}
                    </button>
                  ))}
                </div>
              </div>

              {/* Message */}
              <div>
                <label className="block text-xs text-gray-400 mb-1.5 font-medium">Message / Details</label>
                <div className="relative">
                  <FiMessageSquare className="absolute left-3 top-3 w-4 h-4 text-gray-500" />
                  <textarea
                    rows={3}
                    placeholder="Add details here..."
                    value={form.message}
                    onChange={e => setForm(p => ({ ...p, message: e.target.value }))}
                    className="w-full bg-gray-800 border border-gray-700 rounded-xl pl-9 pr-3 py-2.5 text-white text-sm focus:outline-none focus:border-green-500/60 placeholder-gray-600 resize-none"
                  />
                </div>
              </div>

              {/* WhatsApp Numbers note */}
              <div className="flex items-center gap-2 bg-green-500/5 border border-green-500/20 rounded-xl px-4 py-3 text-xs text-gray-400">
                <FaWhatsapp className="w-4 h-4 text-green-400 flex-shrink-0" />
                <span>DM us: <span className="text-green-400 font-semibold">9849697886</span> &nbsp;|&nbsp; <span className="text-green-400 font-semibold">8143550515</span></span>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full flex items-center justify-center gap-2 bg-green-600 hover:bg-green-700 disabled:opacity-50 text-white font-bold py-3 rounded-xl transition"
              >
                <FaWhatsapp className="w-5 h-5" />
                {loading ? 'Sending...' : 'Send to WhatsApp'}
              </button>
            </form>
          )}
        </div>

        {/* Footer */}
        {!sent && (
          <div className="p-4 border-t border-gray-800 text-center flex-shrink-0">
            <p className="text-xs text-gray-500">
              Thanking You 🙏 &nbsp;|&nbsp; <span className="text-gray-400">Praveen Kumar Yougi A</span>
            </p>
            <p className="text-xs text-gray-600 mt-0.5">Pravara World Tech | Asian Cinematics | Ecop World International</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default QuickRequestModal;
