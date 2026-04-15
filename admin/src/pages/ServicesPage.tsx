import { useEffect, useState } from 'react';
import { Helmet } from 'react-helmet-async';
import { toast } from 'react-hot-toast';
import { HiOutlineCog, HiOutlineCurrencyRupee } from 'react-icons/hi';
import api from '../lib/api';
import Loading from '../components/Loading';
import Modal from '../components/Modal';
import Button from '../components/Button';

const ServicesPage = () => {
  const [services, setServices] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [editing, setEditing] = useState<any>(null);
  const [saving, setSaving] = useState(false);
  const [form, setForm] = useState({ name: '', description: '', shortDescription: '', price: '', sortOrder: '0', isActive: true });

  const fetchServices = () => {
    setLoading(true);
    api.get('/services').then(({ data }) => setServices(data.data)).catch((err) => {
      console.error('Failed to load services:', err);
      toast.error('Failed to load services');
    }).finally(() => setLoading(false));
  };

  useEffect(() => { fetchServices(); }, []);

  const openCreate = () => {
    setEditing(null);
    setForm({ name: '', description: '', shortDescription: '', price: '', sortOrder: '0', isActive: true });
    setModalOpen(true);
  };

  const openEdit = (s: any) => {
    setEditing(s);
    setForm({
      name: s.name, description: s.description, shortDescription: s.shortDescription || '',
      price: s.price ? String(s.price) : '', sortOrder: String(s.sortOrder || 0), isActive: s.isActive !== false,
    });
    setModalOpen(true);
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      const body: any = { name: form.name, description: form.description, shortDescription: form.shortDescription, sortOrder: Number(form.sortOrder), isActive: form.isActive };
      if (form.price) body.price = Number(form.price);
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
      toast.error(err.response?.data?.message || 'Failed to save');
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
            <p className="text-gray-600 text-sm mt-1">Click "+ Add Service" to create one</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {services.map((s) => (
              <div key={s._id} className={`bg-gray-900 border rounded-2xl p-5 transition-colors hover:border-blue-500/40 ${s.isActive !== false ? 'border-gray-800' : 'border-gray-800 opacity-60'}`}>
                <div className="flex items-start justify-between mb-3">
                  <div className="w-10 h-10 rounded-xl bg-blue-500/10 flex items-center justify-center flex-shrink-0">
                    <HiOutlineCog className="w-5 h-5 text-blue-400" />
                  </div>
                  <span className={`text-[10px] font-semibold px-2 py-0.5 rounded-full ${
                    s.isActive !== false ? 'text-green-400 bg-green-400/10' : 'text-gray-500 bg-gray-800'
                  }`}>{s.isActive !== false ? 'Active' : 'Inactive'}</span>
                </div>
                <h3 className="text-sm font-bold text-white mb-1 leading-snug">{s.name}</h3>
                {s.shortDescription && <p className="text-[11px] text-gray-500 mb-2">{s.shortDescription}</p>}
                <div className="flex items-center gap-1.5 mb-4">
                  <HiOutlineCurrencyRupee className="w-3.5 h-3.5 text-blue-400" />
                  <span className="text-sm font-semibold text-white">{s.price ? `₹${s.price.toLocaleString()}` : 'On Request'}</span>
                </div>
                <div className="flex gap-2 pt-3 border-t border-gray-800">
                  <Button onClick={() => openEdit(s)} variant="secondary" size="sm" className="flex-1">Edit</Button>
                  <Button onClick={() => handleDelete(s._id)} variant="danger" size="sm" className="flex-1">Delete</Button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      <Modal open={modalOpen} onClose={() => setModalOpen(false)} title={editing ? 'Edit Service' : 'Add Service'}>
        <div className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-gray-400 mb-1.5">Name</label>
            <input type="text" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} required
              className="w-full bg-gray-800 border border-gray-700 rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:border-blue-500" />
          </div>
          <div>
            <label className="block text-xs font-semibold text-gray-400 mb-1.5">Short Description</label>
            <input type="text" value={form.shortDescription} onChange={(e) => setForm({ ...form, shortDescription: e.target.value })}
              className="w-full bg-gray-800 border border-gray-700 rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:border-blue-500" />
          </div>
          <div>
            <label className="block text-xs font-semibold text-gray-400 mb-1.5">Description</label>
            <textarea value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} rows={3} required
              className="w-full bg-gray-800 border border-gray-700 rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:border-blue-500 resize-none" />
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-gray-400 mb-1.5">Price (₹)</label>
              <input type="number" value={form.price} onChange={(e) => setForm({ ...form, price: e.target.value })}
                className="w-full bg-gray-800 border border-gray-700 rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:border-blue-500" min="0" />
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
