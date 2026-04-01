import { useEffect, useState } from 'react';
import { Helmet } from 'react-helmet-async';
import { toast } from 'react-hot-toast';
import api from '../lib/api';
import Loading from '../components/Loading';
import Pagination from '../components/Pagination';
import Modal from '../components/Modal';

const ProductsPage = () => {
  const [products, setProducts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [search, setSearch] = useState('');
  const [modalOpen, setModalOpen] = useState(false);
  const [editing, setEditing] = useState<any>(null);
  const [saving, setSaving] = useState(false);
  const [categories, setCategories] = useState<any[]>([]);

  const [form, setForm] = useState({
    name: '', description: '', price: '', compareAtPrice: '', category: '', stock: '0',
    isFeatured: false, tags: '', specifications: '',
  });

  const fetchProducts = () => {
    setLoading(true);
    const params: any = { page, limit: 20 };
    if (search) params.search = search;
    api.get('/products', { params }).then(({ data }) => {
      setProducts(data.data);
      setTotalPages(data.meta?.totalPages || 1);
    }).catch(() => toast.error('Failed to load products')).finally(() => setLoading(false));
  };

  useEffect(() => { fetchProducts(); }, [page]);
  useEffect(() => { 
    api.get('/categories').then(({ data }) => setCategories(data.data)).catch((err) => {
      console.error('Failed to load categories:', err);
      toast.error('Failed to load categories');
    });
  }, []);

  const openCreate = () => {
    setEditing(null);
    setForm({ name: '', description: '', price: '', compareAtPrice: '', category: '', stock: '0', isFeatured: false, tags: '', specifications: '' });
    setModalOpen(true);
  };

  const openEdit = (p: any) => {
    setEditing(p);
    setForm({
      name: p.name, description: p.description, price: String(p.price),
      compareAtPrice: p.compareAtPrice ? String(p.compareAtPrice) : '',
      category: p.category?._id || p.category || '', stock: String(p.stock),
      isFeatured: p.isFeatured || false,
      tags: (p.tags || []).join(', '),
      specifications: p.specifications ? JSON.stringify(p.specifications) : '',
    });
    setModalOpen(true);
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      const body: any = {
        name: form.name, description: form.description, price: Number(form.price),
        stock: Number(form.stock), isFeatured: form.isFeatured,
      };
      if (form.compareAtPrice) body.compareAtPrice = Number(form.compareAtPrice);
      if (form.category) body.category = form.category;
      if (form.tags) body.tags = form.tags.split(',').map((t: string) => t.trim()).filter(Boolean);
      if (form.specifications) {
        try {
          body.specifications = JSON.parse(form.specifications);
        } catch {
          toast.error('Invalid JSON in specifications');
          setSaving(false);
          return;
        }
      }

      if (editing) {
        await api.put(`/products/${editing._id}`, body);
        toast.success('Product updated');
      } else {
        await api.post('/products', body);
        toast.success('Product created');
      }
      setModalOpen(false);
      fetchProducts();
    } catch (err: any) {
      toast.error(err.response?.data?.message || 'Failed to save');
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Delete this product?')) return;
    try {
      await api.delete(`/products/${id}`);
      toast.success('Product deleted');
      fetchProducts();
    } catch {
      toast.error('Failed to delete');
    }
  };

  return (
    <>
      <Helmet><title>Products | Admin</title></Helmet>

      <div className="space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <h1 className="text-2xl font-bold text-gray-900">Products</h1>
          <div className="flex gap-2">
            <form onSubmit={(e) => { e.preventDefault(); setPage(1); fetchProducts(); }} className="flex gap-2">
              <input type="text" value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Search..." className="input-field w-40" />
              <button type="submit" className="btn-secondary btn-sm">Search</button>
            </form>
            <button onClick={openCreate} className="btn-primary btn-sm">+ Add Product</button>
          </div>
        </div>

        {loading ? <Loading /> : products.length === 0 ? (
          <p className="text-gray-500 text-center py-12">No products found.</p>
        ) : (
          <div className="card overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead className="bg-gray-50 text-gray-500 text-left">
                  <tr>
                    <th className="px-5 py-3 font-medium">Product</th>
                    <th className="px-5 py-3 font-medium">Category</th>
                    <th className="px-5 py-3 font-medium">Price</th>
                    <th className="px-5 py-3 font-medium">Stock</th>
                    <th className="px-5 py-3 font-medium">Featured</th>
                    <th className="px-5 py-3 font-medium">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {products.map((p) => (
                    <tr key={p._id} className="hover:bg-gray-50">
                      <td className="px-5 py-3">
                        <div className="flex items-center gap-3">
                          {p.images?.[0] && <img src={`/uploads/${p.images[0]}`} alt="" className="w-10 h-10 rounded object-cover" />}
                          <span className="font-medium text-gray-900">{p.name}</span>
                        </div>
                      </td>
                      <td className="px-5 py-3 text-gray-600">{p.category?.name || 'N/A'}</td>
                      <td className="px-5 py-3 text-gray-900">₹{p.price?.toLocaleString()}</td>
                      <td className="px-5 py-3">
                        <span className={p.stock <= 0 ? 'text-red-600 font-medium' : 'text-gray-600'}>{p.stock}</span>
                      </td>
                      <td className="px-5 py-3">{p.isFeatured ? '⭐' : '—'}</td>
                      <td className="px-5 py-3">
                        <div className="flex gap-2">
                          <button onClick={() => openEdit(p)} className="text-primary-600 hover:underline">Edit</button>
                          <button onClick={() => handleDelete(p._id)} className="text-red-600 hover:underline">Delete</button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        <Pagination page={page} totalPages={totalPages} onPageChange={setPage} />
      </div>

      <Modal open={modalOpen} onClose={() => setModalOpen(false)} title={editing ? 'Edit Product' : 'Add Product'}>
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Name</label>
            <input type="text" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} required className="input-field" />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
            <textarea value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} rows={3} className="input-field" />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Price (₹)</label>
              <input type="number" value={form.price} onChange={(e) => setForm({ ...form, price: e.target.value })} required className="input-field" min="0" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Compare Price</label>
              <input type="number" value={form.compareAtPrice} onChange={(e) => setForm({ ...form, compareAtPrice: e.target.value })} className="input-field" min="0" />
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Category</label>
              <select value={form.category} onChange={(e) => setForm({ ...form, category: e.target.value })} className="input-field">
                <option value="">Select</option>
                {categories.map((c: any) => <option key={c._id} value={c._id}>{c.name}</option>)}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Stock</label>
              <input type="number" value={form.stock} onChange={(e) => setForm({ ...form, stock: e.target.value })} className="input-field" min="0" />
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Tags (comma-separated)</label>
            <input type="text" value={form.tags} onChange={(e) => setForm({ ...form, tags: e.target.value })} className="input-field" />
          </div>
          <label className="flex items-center gap-2">
            <input type="checkbox" checked={form.isFeatured} onChange={(e) => setForm({ ...form, isFeatured: e.target.checked })} className="rounded border-gray-300" />
            <span className="text-sm text-gray-700">Featured Product</span>
          </label>
          <div className="flex gap-3 pt-2">
            <button onClick={handleSave} disabled={saving} className="btn-primary flex-1">
              {saving ? 'Saving...' : editing ? 'Update' : 'Create'}
            </button>
            <button onClick={() => setModalOpen(false)} className="btn-secondary flex-1">Cancel</button>
          </div>
        </div>
      </Modal>
    </>
  );
};

export default ProductsPage;
