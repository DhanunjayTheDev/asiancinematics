import { useEffect, useState } from 'react';
import { Helmet } from 'react-helmet-async';
import { toast } from 'react-hot-toast';
import { HiOutlineTag, HiOutlineHashtag } from 'react-icons/hi';
import api from '../lib/api';
import Loading from '../components/Loading';
import Modal from '../components/Modal';
import Button from '../components/Button';

const CategoriesPage = () => {
  const [categories, setCategories] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [editing, setEditing] = useState<any>(null);
  const [saving, setSaving] = useState(false);
  const [form, setForm] = useState({ name: '', description: '', sortOrder: '0' });

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
    setForm({ name: '', description: '', sortOrder: '0' });
    setModalOpen(true);
  };

  const openEdit = (c: any) => {
    setEditing(c);
    setForm({ name: c.name, description: c.description || '', sortOrder: String(c.sortOrder || 0) });
    setModalOpen(true);
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      const body = { name: form.name, description: form.description, sortOrder: Number(form.sortOrder) };
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

      <div className="space-y-5">
        <div className="flex items-center justify-between flex-wrap gap-3">
          <div>
            <h1 className="text-2xl font-bold text-white">Categories</h1>
            <p className="text-sm text-gray-400 mt-0.5">Manage product categories</p>
          </div>
          <Button onClick={openCreate}>+ Add Category</Button>
        </div>

        {loading ? <Loading /> : categories.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20 text-center">
            <HiOutlineTag className="w-12 h-12 text-gray-700 mb-3" />
            <p className="text-gray-400 font-medium">No categories yet</p>
            <p className="text-gray-600 text-sm mt-1">Click "+ Add Category" to create one</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            {categories.map((c) => (
              <div key={c._id} className="bg-gray-900 border border-gray-800 rounded-2xl p-5 hover:border-blue-500/40 transition-colors group">
                <div className="flex items-start justify-between mb-3">
                  <div className="w-10 h-10 rounded-xl bg-blue-500/10 flex items-center justify-center flex-shrink-0">
                    <HiOutlineTag className="w-5 h-5 text-blue-400" />
                  </div>
                  <span className="text-[10px] font-bold text-gray-600 bg-gray-800 px-2 py-0.5 rounded-full">#{c.sortOrder}</span>
                </div>
                <h3 className="text-sm font-bold text-white mb-1 leading-snug">{c.name}</h3>
                <div className="flex items-center gap-1 mb-3">
                  <HiOutlineHashtag className="w-3 h-3 text-gray-600" />
                  <p className="text-[11px] text-gray-500 font-mono">{c.slug}</p>
                </div>
                {c.description && <p className="text-[11px] text-gray-500 mb-4 line-clamp-2">{c.description}</p>}
                <div className="flex gap-2 mt-auto pt-3 border-t border-gray-800">
                  <Button onClick={() => openEdit(c)} variant="secondary" size="sm" className="flex-1">Edit</Button>
                  <Button onClick={() => handleDelete(c._id)} variant="danger" size="sm" className="flex-1">Delete</Button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      <Modal open={modalOpen} onClose={() => setModalOpen(false)} title={editing ? 'Edit Category' : 'Add Category'}>
        <div className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-gray-400 mb-1.5">Name</label>
            <input type="text" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} required
              className="w-full bg-gray-800 border border-gray-700 rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:border-blue-500" />
          </div>
          <div>
            <label className="block text-xs font-semibold text-gray-400 mb-1.5">Description</label>
            <textarea value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} rows={2}
              className="w-full bg-gray-800 border border-gray-700 rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:border-blue-500 resize-none" />
          </div>
          <div>
            <label className="block text-xs font-semibold text-gray-400 mb-1.5">Sort Order</label>
            <input type="number" value={form.sortOrder} onChange={(e) => setForm({ ...form, sortOrder: e.target.value })}
              className="w-full bg-gray-800 border border-gray-700 rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:border-blue-500" />
          </div>
          <div className="flex justify-end gap-3 pt-2">
            <Button onClick={() => setModalOpen(false)} variant="secondary">Cancel</Button>
            <Button onClick={handleSave} disabled={saving} loading={saving}>{editing ? 'Update' : 'Create'}</Button>
          </div>
        </div>
      </Modal>
    </>
  );
};

export default CategoriesPage;
