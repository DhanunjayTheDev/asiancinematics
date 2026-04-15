import { useEffect, useState } from 'react';
import { Helmet } from 'react-helmet-async';
import { toast } from 'react-hot-toast';
import api from '../lib/api';
import { cacheManager } from '../lib/cache';
import Loading from '../components/Loading';
import Pagination from '../components/Pagination';
import CustomSelect from '../components/CustomSelect';
import Button from '../components/Button';

const statusOptions = ['pending', 'confirmed', 'processing', 'shipped', 'delivered', 'cancelled'];
const statusColors: Record<string, string> = {
  pending: 'bg-yellow-600/20 text-yellow-300',
  confirmed: 'bg-blue-600/20 text-blue-300',
  processing: 'bg-blue-600/20 text-blue-300',
  shipped: 'bg-purple-600/20 text-purple-300',
  delivered: 'bg-green-600/20 text-green-300',
  cancelled: 'bg-red-600/20 text-red-300',
};

const OrdersPage = () => {
  const [orders, setOrders] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [statusFilter, setStatusFilter] = useState('');
  const [search, setSearch] = useState('');
  const [selected, setSelected] = useState<any>(null);
  const [newStatus, setNewStatus] = useState('');

  const fetchOrders = async () => {
    setLoading(true);
    try {
      const params: any = { page, limit: 20 };
      if (statusFilter) params.status = statusFilter;
      if (search) params.search = search;
      const { data } = await api.get('/orders/all', { params });
      setOrders(data.data);
      setTotalPages(data.meta?.totalPages || 1);
    } catch {
      toast.error('Failed to load orders');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchOrders(); }, [page, statusFilter]);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    setPage(1);
    fetchOrders();
  };

  const handleStatusUpdate = async () => {
    if (!selected || !newStatus) return;
    try {
      await api.put(`/orders/${selected._id}/status`, { status: newStatus });
      toast.success('Order status updated');
      setSelected(null);
      fetchOrders();
    } catch (err: any) {
      toast.error(err.response?.data?.message || 'Failed to update');
    }
  };

  return (
    <>
      <Helmet><title>Orders | Admin</title></Helmet>

      <div className="space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <h1 className="text-2xl font-bold text-white">Orders</h1>
          <form onSubmit={handleSearch} className="flex flex-col sm:flex-row gap-2 w-full sm:w-auto">
            <CustomSelect
              value={statusFilter}
              onChange={(value) => { setStatusFilter(String(value)); setPage(1); }}
              options={[
                { value: '', label: 'All Status' },
                ...statusOptions.map((s) => ({ value: s, label: s }))
              ]}
              className="w-full sm:w-40"
            />
            <input type="text" value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Search order #" className="flex-1 sm:w-40 px-4 py-2 bg-black border border-blue-500/20 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-blue-500 transition" />
            <Button type="submit" variant="secondary" size="sm">Search</Button>
          </form>
        </div>

        {loading ? <Loading /> : orders.length === 0 ? (
          <p className="text-gray-400 text-center py-12">No orders found.</p>
        ) : (
          <div className="bg-gray-900 rounded-2xl border border-blue-500/20 shadow-sm overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead className="bg-black text-gray-400 text-left">
                  <tr>
                    <th className="px-5 py-3 font-medium">Order #</th>
                    <th className="px-5 py-3 font-medium">Customer</th>
                    <th className="px-5 py-3 font-medium">Items</th>
                    <th className="px-5 py-3 font-medium">Total</th>
                    <th className="px-5 py-3 font-medium">Payment</th>
                    <th className="px-5 py-3 font-medium">Status</th>
                    <th className="px-5 py-3 font-medium">Date</th>
                    <th className="px-5 py-3 font-medium">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-blue-500/10">
                  {orders.map((o) => (
                    <tr key={o._id} className="hover:bg-blue-500/10">
                      <td className="px-5 py-3 font-medium text-white">{o.orderNumber}</td>
                      <td className="px-5 py-3 text-gray-300">{o.user?.name || 'N/A'}</td>
                      <td className="px-5 py-3 text-gray-300">{o.items?.length || 0}</td>
                      <td className="px-5 py-3 text-white font-medium">₹{o.totalAmount?.toLocaleString()}</td>
                      <td className="px-5 py-3">
                        <span className={`badge ${o.paymentStatus === 'paid' ? 'bg-green-600/20 text-green-300' : 'bg-yellow-600/20 text-yellow-300'}`}>
                          {o.paymentStatus}
                        </span>
                      </td>
                      <td className="px-5 py-3">
                        <span className={`badge ${statusColors[o.status] || 'bg-gray-800 text-gray-300'}`}>{o.status}</span>
                      </td>
                      <td className="px-5 py-3 text-gray-400">{new Date(o.createdAt).toLocaleDateString('en-IN')}</td>
                      <td className="px-5 py-3">
                        <button onClick={() => { setSelected(o); setNewStatus(o.status); }} className="text-blue-400 hover:text-blue-300 text-sm">
                          Update
                        </button>
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

      {/* Status update modal */}
      {selected && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="fixed inset-0 bg-black/40" onClick={() => setSelected(null)} />
          <div className="relative bg-gray-900 rounded-xl shadow-xl max-w-sm w-full z-10 p-6 border border-blue-500/20">
            <h3 className="text-lg font-semibold text-white mb-4">Update Order #{selected.orderNumber}</h3>
            <CustomSelect
              value={newStatus}
              onChange={(value) => setNewStatus(String(value))}
              options={statusOptions.map((s) => ({
                value: s,
                label: s,
              }))}
            />
            <div className="flex gap-3 mt-4">
              <Button onClick={handleStatusUpdate}>Update</Button>
              <Button onClick={() => setSelected(null)} variant="secondary">Cancel</Button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default OrdersPage;
