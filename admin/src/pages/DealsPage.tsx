import { useEffect, useState } from 'react';
import { Helmet } from 'react-helmet-async';
import { toast } from 'react-hot-toast';
import { HiOutlineGift, HiOutlinePlus, HiOutlinePencil, HiOutlineTrash, HiOutlineX, HiOutlineCheck } from 'react-icons/hi';
import api from '../lib/api';
import Loading from '../components/Loading';
import Modal from '../components/Modal';
import Button from '../components/Button';

type DealType = 'special_offer' | 'today_deal' | 'clearance_sale' | 'festival_offer' | 'combo_package' | 'refurbished';

const DEAL_TYPE_LABELS: Record<DealType, string> = {
  special_offer: '⭐ Special Offers',
  today_deal: '🔥 Today\'s Deals',
  clearance_sale: '🏷️ Clearance Sale',
  festival_offer: '🎉 Festival Offers',
  combo_package: '📦 Combo Packages',
  refurbished: '♻️ Refurbished',
};

const DEAL_TYPE_COLORS: Record<DealType, string> = {
  special_offer: 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30',
  today_deal: 'bg-red-500/20 text-red-400 border-red-500/30',
  clearance_sale: 'bg-orange-500/20 text-orange-400 border-orange-500/30',
  festival_offer: 'bg-purple-500/20 text-purple-400 border-purple-500/30',
  combo_package: 'bg-blue-500/20 text-blue-400 border-blue-500/30',
  refurbished: 'bg-green-500/20 text-green-400 border-green-500/30',
};

const defaultForm = {
  type: 'special_offer' as DealType,
  name: '',
  description: '',
  isActive: true,
  startDate: '',
  endDate: '',
  selectedProducts: [] as string[],
};

const DealsPage = () => {
  const [deals, setDeals] = useState<any[]>([]);
  const [products, setProducts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [editing, setEditing] = useState<any>(null);
  const [saving, setSaving] = useState(false);
  const [form, setForm] = useState(defaultForm);
  const [productSearch, setProductSearch] = useState('');

  const fetchDeals = () => {
    setLoading(true);
    api.get('/deals')
      .then(({ data }) => setDeals(data.data || []))
      .catch(() => toast.error('Failed to load deals'))
      .finally(() => setLoading(false));
  };

  const fetchProducts = () => {
    api.get('/products?limit=200')
      .then(({ data }) => setProducts(data.data || []))
      .catch(() => {});
  };

  useEffect(() => {
    fetchDeals();
    fetchProducts();
  }, []);

  const openCreate = () => {
    setEditing(null);
    setForm(defaultForm);
    setProductSearch('');
    setModalOpen(true);
  };

  const openEdit = (deal: any) => {
    setEditing(deal);
    setForm({
      type: deal.type,
      name: deal.name,
      description: deal.description || '',
      isActive: deal.isActive !== false,
      startDate: deal.startDate ? deal.startDate.slice(0, 10) : '',
      endDate: deal.endDate ? deal.endDate.slice(0, 10) : '',
      selectedProducts: (deal.products || []).map((p: any) => typeof p === 'string' ? p : p._id),
    });
    setProductSearch('');
    setModalOpen(true);
  };

  const toggleProduct = (id: string) => {
    setForm(f => ({
      ...f,
      selectedProducts: f.selectedProducts.includes(id)
        ? f.selectedProducts.filter(p => p !== id)
        : [...f.selectedProducts, id],
    }));
  };

  const handleSave = async () => {
    if (!form.name || !form.type) {
      toast.error('Type and name are required');
      return;
    }
    setSaving(true);
    try {
      const body: any = {
        type: form.type,
        name: form.name,
        description: form.description,
        isActive: form.isActive,
        products: form.selectedProducts,
      };
      if (form.startDate) body.startDate = form.startDate;
      if (form.endDate) body.endDate = form.endDate;

      if (editing) {
        await api.put(`/deals/${editing._id}`, body);
        toast.success('Deal updated');
      } else {
        await api.post('/deals', body);
        toast.success('Deal created');
      }
      setModalOpen(false);
      fetchDeals();
    } catch (err: any) {
      toast.error(err.response?.data?.message || 'Failed to save');
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Delete this deal?')) return;
    try {
      await api.delete(`/deals/${id}`);
      toast.success('Deal deleted');
      fetchDeals();
    } catch {
      toast.error('Failed to delete');
    }
  };

  const toggleActive = async (deal: any) => {
    try {
      await api.put(`/deals/${deal._id}`, { isActive: !deal.isActive });
      toast.success(deal.isActive ? 'Deal deactivated' : 'Deal activated');
      fetchDeals();
    } catch {
      toast.error('Failed to update');
    }
  };

  const filteredProducts = products.filter(p =>
    p.name.toLowerCase().includes(productSearch.toLowerCase())
  );

  return (
    <>
      <Helmet><title>Deals & Offers | Admin</title></Helmet>

      <div className="space-y-5">
        <div className="flex items-center justify-between flex-wrap gap-3">
          <div>
            <h1 className="text-2xl font-bold text-white">Deals & Offers</h1>
            <p className="text-sm text-gray-400 mt-0.5">Manage special deals shown in shop sidebar</p>
          </div>
          <Button onClick={openCreate}>
            <HiOutlinePlus className="w-4 h-4 mr-1.5 inline" /> Add Deal
          </Button>
        </div>

        {/* Deal type summary */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
          {(Object.keys(DEAL_TYPE_LABELS) as DealType[]).map((type) => {
            const count = deals.filter(d => d.type === type).length;
            return (
              <div key={type} className={`rounded-xl border px-3 py-3 text-center ${DEAL_TYPE_COLORS[type]}`}>
                <p className="text-lg font-bold">{count}</p>
                <p className="text-[10px] font-semibold mt-0.5 leading-tight">{DEAL_TYPE_LABELS[type]}</p>
              </div>
            );
          })}
        </div>

        {loading ? <Loading /> : deals.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20 text-center">
            <HiOutlineGift className="w-12 h-12 text-gray-700 mb-3" />
            <p className="text-gray-400 font-medium">No deals yet</p>
            <p className="text-gray-600 text-sm mt-1">Click "+ Add Deal" to create one</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {deals.map((deal) => (
              <div key={deal._id} className={`bg-gray-900 border rounded-2xl p-5 ${deal.isActive ? 'border-gray-800' : 'border-gray-800 opacity-60'}`}>
                <div className="flex items-start justify-between mb-3">
                  <span className={`text-[10px] font-bold px-2 py-1 rounded-full border ${DEAL_TYPE_COLORS[deal.type as DealType]}`}>
                    {DEAL_TYPE_LABELS[deal.type as DealType]}
                  </span>
                  <button
                    onClick={() => toggleActive(deal)}
                    className={`w-8 h-8 rounded-lg flex items-center justify-center transition-colors ${deal.isActive ? 'bg-green-500/20 text-green-400 hover:bg-green-500/30' : 'bg-gray-700 text-gray-500 hover:bg-gray-600'}`}
                    title={deal.isActive ? 'Deactivate' : 'Activate'}
                  >
                    <HiOutlineCheck className="w-4 h-4" />
                  </button>
                </div>
                <h3 className="text-sm font-bold text-white mb-1">{deal.name}</h3>
                {deal.description && <p className="text-[11px] text-gray-500 mb-2 line-clamp-2">{deal.description}</p>}
                <p className="text-[11px] text-blue-400 mb-1">{(deal.products || []).length} product{(deal.products || []).length !== 1 ? 's' : ''} in this deal</p>
                {deal.startDate && (
                  <p className="text-[10px] text-gray-600">
                    {new Date(deal.startDate).toLocaleDateString('en-IN')}
                    {deal.endDate && ` → ${new Date(deal.endDate).toLocaleDateString('en-IN')}`}
                  </p>
                )}
                <div className="flex gap-2 pt-3 mt-2 border-t border-gray-800">
                  <Button onClick={() => openEdit(deal)} variant="secondary" size="sm" className="flex-1">
                    <HiOutlinePencil className="w-3.5 h-3.5 mr-1 inline" /> Edit
                  </Button>
                  <Button onClick={() => handleDelete(deal._id)} variant="danger" size="sm" className="flex-1">
                    <HiOutlineTrash className="w-3.5 h-3.5 mr-1 inline" /> Delete
                  </Button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      <Modal open={modalOpen} onClose={() => setModalOpen(false)} title={editing ? 'Edit Deal' : 'Add Deal'}>
        <div className="space-y-4 max-h-[75vh] overflow-y-auto pr-1">
          {/* Deal Type */}
          <div>
            <label className="block text-xs font-semibold text-gray-400 mb-2">Deal Type *</label>
            <div className="grid grid-cols-2 gap-2">
              {(Object.keys(DEAL_TYPE_LABELS) as DealType[]).map((type) => (
                <button
                  key={type}
                  type="button"
                  onClick={() => setForm(f => ({ ...f, type }))}
                  className={`text-xs font-semibold px-3 py-2 rounded-xl border transition-all text-left ${
                    form.type === type
                      ? `${DEAL_TYPE_COLORS[type]} border-2`
                      : 'bg-gray-800 border-gray-700 text-gray-400 hover:border-gray-600'
                  }`}
                >
                  {DEAL_TYPE_LABELS[type]}
                </button>
              ))}
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-gray-400 mb-1.5">Deal Name *</label>
            <input type="text" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })}
              placeholder="e.g. Diwali Special Offer 2025"
              className="w-full bg-gray-800 border border-gray-700 rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:border-blue-500" />
          </div>

          <div>
            <label className="block text-xs font-semibold text-gray-400 mb-1.5">Description</label>
            <textarea value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} rows={2}
              className="w-full bg-gray-800 border border-gray-700 rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:border-blue-500 resize-none" />
          </div>

          {/* Date range */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-gray-400 mb-1.5">Start Date</label>
              <input type="date" value={form.startDate} onChange={(e) => setForm({ ...form, startDate: e.target.value })}
                className="w-full bg-gray-800 border border-gray-700 rounded-xl px-3 py-2.5 text-sm text-white focus:outline-none focus:border-blue-500" />
            </div>
            <div>
              <label className="block text-xs font-semibold text-gray-400 mb-1.5">End Date</label>
              <input type="date" value={form.endDate} onChange={(e) => setForm({ ...form, endDate: e.target.value })}
                className="w-full bg-gray-800 border border-gray-700 rounded-xl px-3 py-2.5 text-sm text-white focus:outline-none focus:border-blue-500" />
            </div>
          </div>

          <label className="flex items-center gap-2 cursor-pointer">
            <input type="checkbox" checked={form.isActive} onChange={(e) => setForm({ ...form, isActive: e.target.checked })} className="w-4 h-4 accent-blue-500" />
            <span className="text-sm text-gray-300">Active (visible in shop sidebar)</span>
          </label>

          {/* Product multi-select */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <label className="text-xs font-semibold text-gray-400">
                Select Products ({form.selectedProducts.length} selected)
              </label>
              {form.selectedProducts.length > 0 && (
                <button type="button" onClick={() => setForm(f => ({ ...f, selectedProducts: [] }))}
                  className="text-[10px] text-red-400 hover:text-red-300 flex items-center gap-0.5">
                  <HiOutlineX className="w-3 h-3" /> Clear all
                </button>
              )}
            </div>
            <input
              type="text"
              placeholder="Search products..."
              value={productSearch}
              onChange={(e) => setProductSearch(e.target.value)}
              className="w-full mb-2 bg-gray-800 border border-gray-700 rounded-xl px-3 py-2 text-sm text-white focus:outline-none focus:border-blue-500"
            />
            <div className="max-h-48 overflow-y-auto border border-gray-800 rounded-xl divide-y divide-gray-800/60">
              {filteredProducts.length === 0 ? (
                <p className="text-[11px] text-gray-600 text-center py-4">No products found</p>
              ) : filteredProducts.map((p) => {
                const selected = form.selectedProducts.includes(p._id);
                return (
                  <button
                    key={p._id}
                    type="button"
                    onClick={() => toggleProduct(p._id)}
                    className={`w-full flex items-center gap-3 px-3 py-2.5 text-left transition-colors hover:bg-gray-800 ${selected ? 'bg-blue-600/10' : ''}`}
                  >
                    <div className={`w-4 h-4 rounded flex items-center justify-center flex-shrink-0 border ${selected ? 'bg-blue-500 border-blue-500' : 'border-gray-600'}`}>
                      {selected && <HiOutlineCheck className="w-3 h-3 text-white" />}
                    </div>
                    {p.images?.[0] && <img src={p.images[0]} alt={p.name} className="w-8 h-8 rounded-lg object-cover flex-shrink-0" />}
                    <div className="min-w-0 flex-1">
                      <p className="text-xs font-medium text-white truncate">{p.name}</p>
                      <p className="text-[10px] text-gray-500">₹{p.price?.toLocaleString() || 'N/A'}</p>
                    </div>
                  </button>
                );
              })}
            </div>
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

export default DealsPage;
