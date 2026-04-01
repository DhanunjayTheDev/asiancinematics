import { useEffect, useState } from 'react';
import { Helmet } from 'react-helmet-async';
import { toast } from 'react-hot-toast';
import api from '../lib/api';
import Loading from '../components/Loading';
import Modal from '../components/Modal';

const CategoriesPage = () => {
  const [categories, setCategories] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [editing, setEditing] = useState<any>(null);
  const [saving, setSaving] = useState(false);
  const [form, setForm] = useState({ name: '', description: '', parent: '', sortOrder: '0' });

  const fetchCategories = () => {
    setLoading(true);
    api.get('/categories').then(({ data }) => setCategories(data.data)).catch((err) => {
      console.error('Failed to load categories:', err);
      toast.error('Failed to load categories');
    }).finally(() => setLoading(false));
  };

  useEffect(() => { fetchCategories(); }, []);

  const openCreate = () => {
    setEditing(null);
    setForm({ name: '', description: '', parent: '', sortOrder: '0' });
    setModalOpen(true);
  };

  const openEdit = (c: any) => {
    setEditing(c);
    setForm({ name: c.name, description: c.description || '', parent: c.parent?._id || '', sortOrder: String(c.sortOrder || 0) });
    setModalOpen(true);
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      const body: any = { name: form.name, description: form.description, sortOrder: Number(form.sortOrder) };
      if (form.parent) body.parent = form.parent;

      if (editing) {
        await api.put(`/categories/${editing._id}`, body);
        toast.success('Category updated');
      } else {
        await api.post('/categories', body);
        toast.success('Category created');
      }
      setModalOpen(false);
      fetchCategories();
    } catch (err: any) {
      toast.error(err.response?.data?.message || 'Failed to save');
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Delete this category?')) return;
    try {
      await api.delete(`/categories/${id}`);
      toast.success('Category deleted');
      fetchCategories();
    } catch {
      toast.error('Failed to delete');
    }
  };

  return (
    <>
      <Helmet><title>Categories | Admin</title></Helmet>

      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-bold text-gray-900">Categories</h1>
          <button onClick={openCreate} className="btn-primary btn-sm">+ Add Category</button>
        </div>

        {loading ? <Loading /> : categories.length === 0 ? (
          <p className="text-gray-500 text-center py-12">No categories yet.</p>
        ) : (
          <div className="card overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead className="bg-gray-50 text-gray-500 text-left">
                  <tr>
                    <th className="px-5 py-3 font-medium">Name</th>
                    <th className="px-5 py-3 font-medium">Slug</th>
                    <th className="px-5 py-3 font-medium">Parent</th>
                    <th className="px-5 py-3 font-medium">Order</th>
                    <th className="px-5 py-3 font-medium">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {categories.map((c) => (
                    <tr key={c._id} className="hover:bg-gray-50">
                      <td className="px-5 py-3 font-medium text-gray-900">{c.name}</td>
                      <td className="px-5 py-3 text-gray-500">{c.slug}</td>
                      <td className="px-5 py-3 text-gray-600">{c.parent?.name || '—'}</td>
                      <td className="px-5 py-3 text-gray-600">{c.sortOrder}</td>
                      <td className="px-5 py-3">
                        <div className="flex gap-2">
                          <button onClick={() => openEdit(c)} className="text-primary-600 hover:underline">Edit</button>
                          <button onClick={() => handleDelete(c._id)} className="text-red-600 hover:underline">Delete</button>
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

      <Modal open={modalOpen} onClose={() => setModalOpen(false)} title={editing ? 'Edit Category' : 'Add Category'}>
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Name</label>
            <input type="text" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} required className="input-field" />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
            <textarea value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} rows={2} className="input-field" />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Parent Category</label>
              <select value={form.parent} onChange={(e) => setForm({ ...form, parent: e.target.value })} className="input-field">
                <option value="">None (Top-level)</option>
                {categories.filter((c) => c._id !== editing?._id).map((c) => <option key={c._id} value={c._id}>{c.name}</option>)}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Sort Order</label>
              <input type="number" value={form.sortOrder} onChange={(e) => setForm({ ...form, sortOrder: e.target.value })} className="input-field" />
            </div>
          </div>
          <div className="flex gap-3 pt-2">
            <button onClick={handleSave} disabled={saving} className="btn-primary flex-1">{saving ? 'Saving...' : editing ? 'Update' : 'Create'}</button>
            <button onClick={() => setModalOpen(false)} className="btn-secondary flex-1">Cancel</button>
          </div>
        </div>
      </Modal>
    </>
  );
};

export default CategoriesPage;
