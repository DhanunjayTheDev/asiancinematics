import { useEffect, useState } from 'react';
import { Helmet } from 'react-helmet-async';
import { toast } from 'react-hot-toast';
import api from '../lib/api';
import { cacheManager } from '../lib/cache';
import Loading from '../components/Loading';
import Pagination from '../components/Pagination';
import Modal from '../components/Modal';
import CustomSelect from '../components/CustomSelect';
import Button from '../components/Button';

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
    const fetchCategories = async () => {
      try {
        const cacheKey = 'admin_categories';
        const cacheTTL = 30 * 60 * 1000; // 30 minutes
        
        const cached = cacheManager.get(cacheKey) as any[] | null;
        if (cached) {
          setCategories(cached);
          return;
        }
        
        const pending = cacheManager.getPendingRequest(cacheKey);
        const promise = pending || api.get('/categories');
        
        if (!pending) cacheManager.setPendingRequest(cacheKey, promise);
        
        const { data } = await promise as { data: { data: any[] } };
        cacheManager.set(cacheKey, data.data, cacheTTL);
        setCategories(data.data);
        cacheManager.clearPendingRequest(cacheKey);
      } catch (err) {
        console.error('Failed to load categories:', err);
        toast.error('Failed to load categories');
      }
    };
    fetchCategories();
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
          <h1 className="text-2xl font-bold text-white">Products</h1>
          <div className="flex gap-2">
            <form onSubmit={(e) => { e.preventDefault(); setPage(1); fetchProducts(); }} className="flex gap-2">
              <input type="text" value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Search..." className="input-field w-40" />
              <Button type="submit" size="sm">Search</Button>
            </form>
            <Button onClick={openCreate} size="sm">+ Add Product</Button>
          </div>
        </div>

        {loading ? <Loading /> : products.length === 0 ? (
          <p className="text-gray-400 text-center py-12">No products found.</p>
        ) : (
          <div className="bg-gray-900 rounded-2xl border border-blue-500/20 shadow-sm overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead className="bg-black text-gray-400 text-left">
                  <tr>
                    <th className="px-5 py-3 font-medium">Product</th>
                    <th className="px-5 py-3 font-medium">Category</th>
                    <th className="px-5 py-3 font-medium">Price</th>
                    <th className="px-5 py-3 font-medium">Stock</th>
                    <th className="px-5 py-3 font-medium">Featured</th>
                    <th className="px-5 py-3 font-medium">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-blue-500/10">
                  {products.map((p) => (
                    <tr key={p._id} className="hover:bg-blue-500/10">
                      <td className="px-5 py-3">
                        <div className="flex items-center gap-3">
                          {p.images?.[0] && <img src={`/uploads/${p.images[0]}`} alt="" className="w-10 h-10 rounded object-cover" />}
                          <span className="font-medium text-white">{p.name}</span>
                        </div>
                      </td>
                      <td className="px-5 py-3 text-gray-300">{p.category?.name || 'N/A'}</td>
                      <td className="px-5 py-3 text-white">₹{p.price?.toLocaleString()}</td>
                      <td className="px-5 py-3">
                        <span className={p.stock <= 0 ? 'text-red-400 font-medium' : 'text-gray-300'}>{p.stock}</span>
                      </td>
                      <td className="px-5 py-3">{p.isFeatured ? '⭐' : '—'}</td>
                      <td className="px-5 py-3">
                        <div className="flex gap-2">
                          <button onClick={() => openEdit(p)} className="text-blue-400 hover:text-blue-300">Edit</button>
                          <button onClick={() => handleDelete(p._id)} className="text-red-400 hover:text-red-300">Delete</button>
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
            <label className="block text-sm font-medium text-gray-300 mb-1">Name</label>
            <input type="text" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} required className="w-full px-4 py-2 bg-black border border-blue-500/20 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-blue-500 transition" />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-1">Description</label>
            <textarea value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} rows={3} className="w-full px-4 py-2 bg-black border border-blue-500/20 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-blue-500 transition" />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-1">Price (₹)</label>
              <input type="number" value={form.price} onChange={(e) => setForm({ ...form, price: e.target.value })} required className="w-full px-4 py-2 bg-black border border-blue-500/20 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-blue-500 transition" min="0" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-1">Compare Price</label>
              <input type="number" value={form.compareAtPrice} onChange={(e) => setForm({ ...form, compareAtPrice: e.target.value })} className="w-full px-4 py-2 bg-black border border-blue-500/20 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-blue-500 transition" min="0" />
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-1">Category</label>
              <CustomSelect
                value={form.category}
                onChange={(value) => setForm({ ...form, category: String(value) })}
                options={[
                  { value: '', label: 'Select' },
                  ...categories.map((c: any) => ({
                    value: c._id,
                    label: c.name,
                  })),
                ]}
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-1">Stock</label>
              <input type="number" value={form.stock} onChange={(e) => setForm({ ...form, stock: e.target.value })} className="w-full px-4 py-2 bg-black border border-blue-500/20 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-blue-500 transition" min="0" />
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-1">Tags (comma-separated)</label>
            <input type="text" value={form.tags} onChange={(e) => setForm({ ...form, tags: e.target.value })} className="w-full px-4 py-2 bg-black border border-blue-500/20 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-blue-500 transition" />
          </div>
          <label className="flex items-center gap-2">
            <input type="checkbox" checked={form.isFeatured} onChange={(e) => setForm({ ...form, isFeatured: e.target.checked })} className="rounded border-blue-500/20" />
            <span className="text-sm text-gray-300">Featured Product</span>
          </label>
          <div className="flex gap-3 pt-2">
            <Button onClick={handleSave} disabled={saving} loading={saving} className="flex-1">
              {editing ? 'Update Product' : 'Create Product'}
            </Button>
            <Button variant="secondary" onClick={() => setModalOpen(false)} className="flex-1">Cancel</Button>
          </div>
        </div>
      </Modal>
    </>
  );
};

export default ProductsPage;
