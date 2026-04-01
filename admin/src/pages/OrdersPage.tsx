import { useEffect, useState } from 'react';
import { Helmet } from 'react-helmet-async';
import { toast } from 'react-hot-toast';
import api from '../lib/api';
import Loading from '../components/Loading';
import Pagination from '../components/Pagination';

const statusOptions = ['pending', 'confirmed', 'processing', 'shipped', 'delivered', 'cancelled'];
const statusColors: Record<string, string> = {
  pending: 'bg-yellow-100 text-yellow-700',
  confirmed: 'bg-blue-100 text-blue-700',
  processing: 'bg-indigo-100 text-indigo-700',
  shipped: 'bg-purple-100 text-purple-700',
  delivered: 'bg-green-100 text-green-700',
  cancelled: 'bg-red-100 text-red-700',
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
      const { data } = await api.get('/orders/admin/all', { params });
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
          <h1 className="text-2xl font-bold text-gray-900">Orders</h1>
          <div className="flex gap-2 flex-wrap">
            <select value={statusFilter} onChange={(e) => { setStatusFilter(e.target.value); setPage(1); }} className="input-field w-auto">
              <option value="">All Status</option>
              {statusOptions.map((s) => <option key={s} value={s}>{s}</option>)}
            </select>
            <form onSubmit={handleSearch} className="flex gap-2">
              <input type="text" value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Search order #" className="input-field w-40" />
              <button type="submit" className="btn-secondary btn-sm">Search</button>
            </form>
          </div>
        </div>

        {loading ? <Loading /> : orders.length === 0 ? (
          <p className="text-gray-500 text-center py-12">No orders found.</p>
        ) : (
          <div className="card overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead className="bg-gray-50 text-gray-500 text-left">
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
                <tbody className="divide-y divide-gray-100">
                  {orders.map((o) => (
                    <tr key={o._id} className="hover:bg-gray-50">
                      <td className="px-5 py-3 font-medium text-gray-900">{o.orderNumber}</td>
                      <td className="px-5 py-3 text-gray-600">{o.user?.name || 'N/A'}</td>
                      <td className="px-5 py-3 text-gray-600">{o.items?.length || 0}</td>
                      <td className="px-5 py-3 text-gray-900 font-medium">₹{o.totalAmount?.toLocaleString()}</td>
                      <td className="px-5 py-3">
                        <span className={`badge ${o.paymentStatus === 'paid' ? 'bg-green-100 text-green-700' : 'bg-yellow-100 text-yellow-700'}`}>
                          {o.paymentStatus}
                        </span>
                      </td>
                      <td className="px-5 py-3">
                        <span className={`badge ${statusColors[o.status] || 'bg-gray-100 text-gray-700'}`}>{o.status}</span>
                      </td>
                      <td className="px-5 py-3 text-gray-500">{new Date(o.createdAt).toLocaleDateString('en-IN')}</td>
                      <td className="px-5 py-3">
                        <button onClick={() => { setSelected(o); setNewStatus(o.status); }} className="text-primary-600 hover:underline text-sm">
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
          <div className="relative bg-white rounded-xl shadow-xl max-w-sm w-full z-10 p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Update Order #{selected.orderNumber}</h3>
            <select value={newStatus} onChange={(e) => setNewStatus(e.target.value)} className="input-field mb-4">
              {statusOptions.map((s) => <option key={s} value={s}>{s}</option>)}
            </select>
            <div className="flex gap-3">
              <button onClick={handleStatusUpdate} className="btn-primary flex-1">Update</button>
              <button onClick={() => setSelected(null)} className="btn-secondary flex-1">Cancel</button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default OrdersPage;
