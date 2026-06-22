import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { toast } from 'react-hot-toast';
import { FiEdit2, FiTrash2, FiPlus } from 'react-icons/fi';
import api from '../lib/api';
import Loading from '../components/Loading';
import Pagination from '../components/Pagination';
import Button from '../components/Button';

const ProductsPage = () => {
  const navigate = useNavigate();
  const [products, setProducts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [search, setSearch] = useState('');

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
            <Button size="sm" onClick={() => navigate('/products/new')} className="flex items-center gap-1.5">
              <FiPlus className="w-4 h-4" /> Add Product
            </Button>
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
                          {p.images?.[0] && <img src={p.images[0]} alt="" className="w-10 h-10 rounded object-cover bg-gray-800" />}
                          <span className="font-medium text-white">{p.name}</span>
                        </div>
                      </td>
                      <td className="px-5 py-3 text-gray-300">{p.category?.name || 'N/A'}</td>
                      <td className="px-5 py-3 text-white">
                        ₹{p.price?.toLocaleString()}
                        {p.compareAtPrice && (
                          <span className="ml-2 text-xs text-gray-500 line-through">₹{p.compareAtPrice?.toLocaleString()}</span>
                        )}
                      </td>
                      <td className="px-5 py-3">
                        <span className={p.stock <= 0 ? 'text-red-400 font-medium' : 'text-gray-300'}>{p.stock}</span>
                      </td>
                      <td className="px-5 py-3">{p.isFeatured ? '⭐' : '—'}</td>
                      <td className="px-5 py-3">
                        <div className="flex gap-3">
                          <button
                            onClick={() => navigate(`/products/${p._id}/edit`, { state: { product: p } })}
                            className="flex items-center gap-1 text-blue-400 hover:text-blue-300 text-xs font-medium transition-colors"
                          >
                            <FiEdit2 className="w-3.5 h-3.5" /> Edit
                          </button>
                          <button
                            onClick={() => handleDelete(p._id)}
                            className="flex items-center gap-1 text-red-400 hover:text-red-300 text-xs font-medium transition-colors"
                          >
                            <FiTrash2 className="w-3.5 h-3.5" /> Delete
                          </button>
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
    </>
  );
};

export default ProductsPage;
