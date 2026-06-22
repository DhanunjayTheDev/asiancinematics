import { useEffect, useState, useRef } from 'react';
import { Helmet } from 'react-helmet-async';
import { toast } from 'react-hot-toast';
import { HiOutlineCog, HiOutlineCurrencyRupee, HiOutlinePhotograph, HiOutlineX } from 'react-icons/hi';
import api from '../lib/api';
import { uploadToCloudinary } from '../lib/cloudinary';
import Loading from '../components/Loading';
import Modal from '../components/Modal';
import Button from '../components/Button';
import CustomSelect from '../components/CustomSelect';

const ACCENT_COLORS = ['blue', 'cyan', 'orange', 'purple', 'yellow', 'amber', 'green', 'red'] as const;
type AccentColor = typeof ACCENT_COLORS[number];

const accentBadge: Record<AccentColor, string> = {
  blue: 'bg-blue-600/80 text-white',
  cyan: 'bg-cyan-600/80 text-white',
  orange: 'bg-orange-600/80 text-white',
  purple: 'bg-purple-600/80 text-white',
  yellow: 'bg-yellow-500/80 text-black',
  amber: 'bg-amber-600/80 text-black',
  green: 'bg-green-600/80 text-white',
  red: 'bg-red-600/80 text-white',
};

const defaultForm = {
  name: '',
  description: '',
  shortDescription: '',
  price: '',
  sortOrder: '0',
  isActive: true,
  emoji: '🔧',
  badge: 'Service',
  accentColor: 'blue' as AccentColor,
  features: '',
};

const ServicesPage = () => {
  const [services, setServices] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [editing, setEditing] = useState<any>(null);
  const [saving, setSaving] = useState(false);
  const [form, setForm] = useState(defaultForm);
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string>('');
  const fileInputRef = useRef<HTMLInputElement>(null);

  const fetchServices = () => {
    setLoading(true);
    api.get('/services')
      .then(({ data }) => setServices(data.data))
      .catch(() => toast.error('Failed to load services'))
      .finally(() => setLoading(false));
  };

  useEffect(() => { fetchServices(); }, []);

  const openCreate = () => {
    setEditing(null);
    setForm(defaultForm);
    setImageFile(null);
    setImagePreview('');
    setModalOpen(true);
  };

  const openEdit = (s: any) => {
    setEditing(s);
    setForm({
      name: s.name,
      description: s.description,
      shortDescription: s.shortDescription || '',
      price: s.price ? String(s.price) : '',
      sortOrder: String(s.sortOrder || 0),
      isActive: s.isActive !== false,
      emoji: s.emoji || '🔧',
      badge: s.badge || 'Service',
      accentColor: (s.accentColor || 'blue') as AccentColor,
      features: (s.features || []).join('\n'),
    });
    setImageFile(null);
    setImagePreview(s.image || '');
    setModalOpen(true);
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setImageFile(file);
    setImagePreview(URL.createObjectURL(file));
  };

  const handleSave = async () => {
    if (!form.name || !form.description) {
      toast.error('Name and description are required');
      return;
    }
    setSaving(true);
    try {
      let imageUrl = imagePreview; // existing URL if no new file
      if (imageFile) {
        toast.loading('Uploading image...', { id: 'svc-img' });
        imageUrl = await uploadToCloudinary(imageFile);
        toast.dismiss('svc-img');
      }

      const featuresArr = form.features.split('\n').map(f => f.trim()).filter(Boolean);
      const body: any = {
        name: form.name,
        description: form.description,
        sortOrder: Number(form.sortOrder),
        isActive: form.isActive,
        emoji: form.emoji,
        badge: form.badge,
        accentColor: form.accentColor,
        features: featuresArr,
      };
      if (form.shortDescription) body.shortDescription = form.shortDescription;
      if (form.price) body.price = Number(form.price);
      if (imageUrl) body.image = imageUrl;

      if (editing) {
        await api.put(`/services/${editing._id}`, body);
        toast.success('Service updated');
      } else {
        await api.post('/services', body);
        toast.success('Service created');
      }
      setModalOpen(false);
      fetchServices();
    } catch (err: any) {
      toast.dismiss('svc-img');
      toast.error(err.response?.data?.message || err.message || 'Failed to save');
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Delete this service?')) return;
    try {
      await api.delete(`/services/${id}`);
      toast.success('Service deleted');
      fetchServices();
    } catch {
      toast.error('Failed to delete');
    }
  };

  return (
    <>
      <Helmet><title>Services | Admin</title></Helmet>

      <div className="space-y-5">
        <div className="flex items-center justify-between flex-wrap gap-3">
          <div>
            <h1 className="text-2xl font-bold text-white">Services</h1>
            <p className="text-sm text-gray-400 mt-0.5">Manage service offerings & pricing</p>
          </div>
          <Button onClick={openCreate}>+ Add Service</Button>
        </div>

        {loading ? <Loading /> : services.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20 text-center">
            <HiOutlineCog className="w-12 h-12 text-gray-700 mb-3" />
            <p className="text-gray-400 font-medium">No services yet</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {services.map((s) => (
              <div key={s._id} className={`bg-gray-900 border rounded-2xl overflow-hidden transition-colors hover:border-blue-500/40 ${s.isActive !== false ? 'border-gray-800' : 'border-gray-800 opacity-60'}`}>
                {s.image && (
                  <div className="relative h-36 overflow-hidden">
                    <img src={s.image} alt={s.name} className="w-full h-full object-cover" />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                    <span className="absolute bottom-2 left-3 text-xl">{s.emoji}</span>
                    {s.badge && (
                      <span className={`absolute top-2 right-2 text-[10px] font-bold px-2 py-0.5 rounded-full ${accentBadge[s.accentColor as AccentColor] || 'bg-gray-700 text-white'}`}>{s.badge}</span>
                    )}
                  </div>
                )}
                <div className="p-4">
                  {!s.image && (
                    <div className="flex items-start justify-between mb-2">
                      <span className="text-2xl">{s.emoji}</span>
                      <span className={`text-[10px] font-semibold px-2 py-0.5 rounded-full ${s.isActive !== false ? 'text-green-400 bg-green-400/10' : 'text-gray-500 bg-gray-800'}`}>{s.isActive !== false ? 'Active' : 'Inactive'}</span>
                    </div>
                  )}
                  <h3 className="text-sm font-bold text-white mb-1">{s.name}</h3>
                  {s.shortDescription && <p className="text-[11px] text-gray-500 mb-2">{s.shortDescription}</p>}
                  {s.features?.length > 0 && (
                    <ul className="text-[10px] text-gray-400 space-y-0.5 mb-2">
                      {s.features.slice(0, 3).map((f: string, i: number) => (
                        <li key={i} className="flex items-center gap-1"><span className="w-1 h-1 rounded-full bg-blue-400 flex-shrink-0" />{f}</li>
                      ))}
                      {s.features.length > 3 && <li className="text-gray-600">+{s.features.length - 3} more</li>}
                    </ul>
                  )}
                  <div className="flex items-center gap-1 mb-3">
                    <HiOutlineCurrencyRupee className="w-3.5 h-3.5 text-blue-400" />
                    <span className="text-sm font-semibold text-white">{s.price ? `₹${s.price.toLocaleString()}` : 'On Request'}</span>
                  </div>
                  <div className="flex gap-2 pt-2 border-t border-gray-800">
                    <Button onClick={() => openEdit(s)} variant="secondary" size="sm" className="flex-1">Edit</Button>
                    <Button onClick={() => handleDelete(s._id)} variant="danger" size="sm" className="flex-1">Delete</Button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      <Modal open={modalOpen} onClose={() => setModalOpen(false)} title={editing ? 'Edit Service' : 'Add Service'}>
        <div className="space-y-4 max-h-[70vh] overflow-y-auto pr-1">
          {/* Image upload */}
          <div>
            <label className="block text-xs font-semibold text-gray-400 mb-1.5">Service Image</label>
            <div
              onClick={() => fileInputRef.current?.click()}
              className="relative cursor-pointer border-2 border-dashed border-gray-700 rounded-xl overflow-hidden hover:border-blue-500 transition-colors"
              style={{ height: imagePreview ? 'auto' : 100 }}
            >
              {imagePreview ? (
                <div className="relative">
                  <img src={imagePreview} alt="preview" className="w-full h-40 object-cover rounded-xl" />
                  <button
                    type="button"
                    onClick={(e) => { e.stopPropagation(); setImageFile(null); setImagePreview(''); }}
                    className="absolute top-2 right-2 bg-black/70 rounded-full p-1 hover:bg-black"
                  >
                    <HiOutlineX className="w-4 h-4 text-white" />
                  </button>
                </div>
              ) : (
                <div className="flex flex-col items-center justify-center h-full py-6 gap-1">
                  <HiOutlinePhotograph className="w-8 h-8 text-gray-600" />
                  <p className="text-xs text-gray-500">Click to upload image</p>
                </div>
              )}
            </div>
            <input ref={fileInputRef} type="file" accept="image/*" className="hidden" onChange={handleImageChange} />
          </div>

          {/* Emoji + Badge + Accent */}
          <div className="grid grid-cols-3 gap-3">
            <div>
              <label className="block text-xs font-semibold text-gray-400 mb-1.5">Emoji</label>
              <input type="text" value={form.emoji} onChange={(e) => setForm({ ...form, emoji: e.target.value })}
                className="w-full bg-gray-800 border border-gray-700 rounded-xl px-3 py-2.5 text-sm text-white focus:outline-none focus:border-blue-500 text-center text-xl" />
            </div>
            <div>
              <label className="block text-xs font-semibold text-gray-400 mb-1.5">Badge</label>
              <input type="text" value={form.badge} onChange={(e) => setForm({ ...form, badge: e.target.value })}
                className="w-full bg-gray-800 border border-gray-700 rounded-xl px-3 py-2.5 text-sm text-white focus:outline-none focus:border-blue-500" />
            </div>
            <div>
              <label className="block text-xs font-semibold text-gray-400 mb-1.5">Accent Color</label>
              <CustomSelect
                value={form.accentColor}
                onChange={(v) => setForm({ ...form, accentColor: v as AccentColor })}
                options={ACCENT_COLORS.map(c => ({ value: c, label: c }))}
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-gray-400 mb-1.5">Name *</label>
            <input type="text" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} required
              className="w-full bg-gray-800 border border-gray-700 rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:border-blue-500" />
          </div>
          <div>
            <label className="block text-xs font-semibold text-gray-400 mb-1.5">Short Description</label>
            <input type="text" value={form.shortDescription} onChange={(e) => setForm({ ...form, shortDescription: e.target.value })}
              className="w-full bg-gray-800 border border-gray-700 rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:border-blue-500" />
          </div>
          <div>
            <label className="block text-xs font-semibold text-gray-400 mb-1.5">Description *</label>
            <textarea value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} rows={3} required
              className="w-full bg-gray-800 border border-gray-700 rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:border-blue-500 resize-none" />
          </div>
          <div>
            <label className="block text-xs font-semibold text-gray-400 mb-1.5">Features (one per line)</label>
            <textarea value={form.features} onChange={(e) => setForm({ ...form, features: e.target.value })} rows={4}
              placeholder="CCTV Surveillance Systems&#10;Intrusion Alarm Systems&#10;Solar Fencing"
              className="w-full bg-gray-800 border border-gray-700 rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:border-blue-500 resize-none" />
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-gray-400 mb-1.5">Price (₹)</label>
              <input type="number" value={form.price} onChange={(e) => setForm({ ...form, price: e.target.value })} min="0"
                className="w-full bg-gray-800 border border-gray-700 rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:border-blue-500" />
            </div>
            <div>
              <label className="block text-xs font-semibold text-gray-400 mb-1.5">Sort Order</label>
              <input type="number" value={form.sortOrder} onChange={(e) => setForm({ ...form, sortOrder: e.target.value })}
                className="w-full bg-gray-800 border border-gray-700 rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:border-blue-500" />
            </div>
          </div>
          <label className="flex items-center gap-2 cursor-pointer">
            <input type="checkbox" checked={form.isActive} onChange={(e) => setForm({ ...form, isActive: e.target.checked })} className="w-4 h-4 accent-blue-500" />
            <span className="text-sm text-gray-300">Active / Visible</span>
          </label>
          <div className="flex justify-end gap-3 pt-2">
            <Button onClick={() => setModalOpen(false)} variant="secondary">Cancel</Button>
            <Button onClick={handleSave} disabled={saving} loading={saving}>{editing ? 'Update' : 'Create'}</Button>
          </div>
        </div>
      </Modal>
    </>
  );
};

export default ServicesPage;
