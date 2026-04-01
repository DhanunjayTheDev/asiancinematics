import { useEffect, useState } from 'react';
import { Helmet } from 'react-helmet-async';
import { toast } from 'react-hot-toast';
import api from '../lib/api';
import Loading from '../components/Loading';
import Modal from '../components/Modal';

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

      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-bold text-gray-900">Services</h1>
          <button onClick={openCreate} className="btn-primary btn-sm">+ Add Service</button>
        </div>

        {loading ? <Loading /> : services.length === 0 ? (
          <p className="text-gray-500 text-center py-12">No services yet.</p>
        ) : (
          <div className="card overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead className="bg-gray-50 text-gray-500 text-left">
                  <tr>
                    <th className="px-5 py-3 font-medium">Name</th>
                    <th className="px-5 py-3 font-medium">Price</th>
                    <th className="px-5 py-3 font-medium">Status</th>
                    <th className="px-5 py-3 font-medium">Order</th>
                    <th className="px-5 py-3 font-medium">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {services.map((s) => (
                    <tr key={s._id} className="hover:bg-gray-50">
                      <td className="px-5 py-3 font-medium text-gray-900">{s.name}</td>
                      <td className="px-5 py-3 text-gray-600">{s.price ? `₹${s.price.toLocaleString()}` : '—'}</td>
                      <td className="px-5 py-3">
                        <span className={`badge ${s.isActive !== false ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-500'}`}>
                          {s.isActive !== false ? 'Active' : 'Inactive'}
                        </span>
                      </td>
                      <td className="px-5 py-3 text-gray-600">{s.sortOrder}</td>
                      <td className="px-5 py-3">
                        <div className="flex gap-2">
                          <button onClick={() => openEdit(s)} className="text-primary-600 hover:underline">Edit</button>
                          <button onClick={() => handleDelete(s._id)} className="text-red-600 hover:underline">Delete</button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>

      <Modal open={modalOpen} onClose={() => setModalOpen(false)} title={editing ? 'Edit Service' : 'Add Service'}>
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Name</label>
            <input type="text" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} required className="input-field" />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Short Description</label>
            <input type="text" value={form.shortDescription} onChange={(e) => setForm({ ...form, shortDescription: e.target.value })} className="input-field" />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
            <textarea value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} rows={3} required className="input-field" />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Price (₹)</label>
              <input type="number" value={form.price} onChange={(e) => setForm({ ...form, price: e.target.value })} className="input-field" min="0" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Sort Order</label>
              <input type="number" value={form.sortOrder} onChange={(e) => setForm({ ...form, sortOrder: e.target.value })} className="input-field" />
            </div>
          </div>
          <label className="flex items-center gap-2">
            <input type="checkbox" checked={form.isActive} onChange={(e) => setForm({ ...form, isActive: e.target.checked })} className="rounded border-gray-300" />
            <span className="text-sm text-gray-700">Active</span>
          </label>
          <div className="flex gap-3 pt-2">
            <button onClick={handleSave} disabled={saving} className="btn-primary flex-1">{saving ? 'Saving...' : editing ? 'Update' : 'Create'}</button>
            <button onClick={() => setModalOpen(false)} className="btn-secondary flex-1">Cancel</button>
          </div>
        </div>
      </Modal>
    </>
  );
};

export default ServicesPage;
