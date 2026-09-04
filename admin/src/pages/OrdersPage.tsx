import { useEffect, useState } from 'react';
import { Helmet } from 'react-helmet-async';
import { toast } from 'react-hot-toast';
import api from '../lib/api';
import Loading from '../components/Loading';
import Pagination from '../components/Pagination';
import CustomSelect from '../components/CustomSelect';
import Button from '../components/Button';

const statusOptions = ['pending', 'payment_pending', 'confirmed', 'processing', 'shipped', 'delivered', 'cancelled'];

const statusColors: Record<string, string> = {
  pending: 'bg-yellow-600/20 text-yellow-300 border-yellow-600/30',
  payment_pending: 'bg-orange-600/20 text-orange-300 border-orange-600/30',
  confirmed: 'bg-blue-600/20 text-blue-300 border-blue-600/30',
  processing: 'bg-cyan-600/20 text-cyan-300 border-cyan-600/30',
  shipped: 'bg-purple-600/20 text-purple-300 border-purple-600/30',
  delivered: 'bg-green-600/20 text-green-300 border-green-600/30',
  cancelled: 'bg-red-600/20 text-red-300 border-red-600/30',
};

const paymentStatusColors: Record<string, string> = {
  pending: 'bg-yellow-600/20 text-yellow-300',
  paid: 'bg-green-600/20 text-green-300',
  failed: 'bg-red-600/20 text-red-300',
  refunded: 'bg-gray-600/20 text-gray-300',
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
  const [actionLoading, setActionLoading] = useState(false);

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
    setActionLoading(true);
    try {
      await api.put(`/orders/${selected._id}/status`, { status: newStatus });
      toast.success('Status updated');
      setSelected(null);
      fetchOrders();
    } catch (err: any) {
      toast.error(err.response?.data?.message || 'Failed to update');
    } finally {
      setActionLoading(false);
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
              onChange={value => { setStatusFilter(String(value)); setPage(1); }}
              options={[{ value: '', label: 'All Status' }, ...statusOptions.map(s => ({ value: s, label: s.replace('_', ' ') }))]}
              className="w-full sm:w-48"
            />
            <input type="text" value={search} onChange={e => setSearch(e.target.value)}
              placeholder="Search order #"
              className="flex-1 sm:w-40 px-4 py-2 bg-black border border-blue-500/20 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-blue-500 transition" />
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
                    <th className="px-5 py-3 font-medium">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-blue-500/10">
                  {orders.map(o => (
                    <tr key={o._id} className="hover:bg-blue-500/5 transition-colors">
                      <td className="px-5 py-3">
                        <p className="font-medium text-white">{o.orderNumber}</p>
                      </td>
                      <td className="px-5 py-3 text-gray-300">{o.user?.name || 'N/A'}</td>
                      <td className="px-5 py-3 text-gray-300">{o.items?.length || 0}</td>
                      <td className="px-5 py-3 text-white font-medium">₹{o.totalAmount?.toLocaleString()}</td>
                      <td className="px-5 py-3">
                        <div className="space-y-1">
                          <span className={`inline-block text-[11px] font-semibold px-2 py-0.5 rounded-full ${paymentStatusColors[o.paymentStatus] || 'bg-gray-700 text-gray-300'}`}>
                            {o.paymentStatus}
                          </span>
                          <p className="text-[11px] text-gray-500 capitalize">{o.paymentMethod}</p>
                        </div>
                      </td>
                      <td className="px-5 py-3">
                        <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-[11px] font-semibold border ${statusColors[o.status] || 'bg-gray-800 text-gray-300 border-gray-700'}`}>
                          {o.status.replace('_', ' ')}
                        </span>
                      </td>
                      <td className="px-5 py-3 text-gray-400 text-xs">{new Date(o.createdAt).toLocaleDateString('en-IN')}</td>
                      <td className="px-5 py-3">
                        <button
                          onClick={() => { setSelected(o); setNewStatus(o.status); }}
                          className="text-sm font-medium text-blue-400 hover:text-blue-300 transition"
                        >
                          Manage
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

      {/* Order Detail Modal */}
      {selected && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="fixed inset-0 bg-black/60 backdrop-blur-sm" onClick={() => setSelected(null)} />
          <div className="relative bg-gray-900 rounded-2xl shadow-2xl max-w-lg w-full z-10 border border-blue-500/20 overflow-hidden max-h-[90vh] flex flex-col">

            {/* Header */}
            <div className="p-6 border-b border-gray-800 flex-shrink-0">
              <div className="flex items-start justify-between">
                <div>
                  <h3 className="text-lg font-bold text-white">{selected.orderNumber}</h3>
                  <div className="flex items-center gap-2 mt-1 flex-wrap">
                    <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-[11px] font-semibold border ${statusColors[selected.status] || 'bg-gray-800 text-gray-300 border-gray-700'}`}>
                      {selected.status.replace('_', ' ')}
                    </span>
                    <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-[11px] font-semibold ${paymentStatusColors[selected.paymentStatus] || 'bg-gray-700 text-gray-300'}`}>
                      {selected.paymentStatus}
                    </span>
                    <span className="text-xs text-gray-500 capitalize">{selected.paymentMethod}</span>
                  </div>
                </div>
                <button onClick={() => setSelected(null)} className="p-1.5 text-gray-400 hover:text-white rounded-lg hover:bg-gray-800 transition-colors">✕</button>
              </div>
            </div>

            {/* Body */}
            <div className="overflow-y-auto flex-1 p-6 space-y-5">
              {/* Customer */}
              <div className="bg-gray-800/50 rounded-xl p-4">
                <p className="text-xs text-gray-500 font-semibold uppercase tracking-wider mb-2">Customer</p>
                <p className="text-white font-medium">{selected.user?.name || 'N/A'}</p>
                <p className="text-gray-400 text-sm">{selected.user?.email}</p>
                <p className="text-gray-400 text-sm">{selected.user?.phone}</p>
              </div>

              {/* Shipping Address */}
              {selected.shippingAddress && (
                <div className="bg-gray-800/50 rounded-xl p-4">
                  <p className="text-xs text-gray-500 font-semibold uppercase tracking-wider mb-2">Shipping Address</p>
                  <p className="text-white font-medium">{selected.shippingAddress.fullName} · {selected.shippingAddress.phone}</p>
                  <p className="text-gray-400 text-sm">{selected.shippingAddress.addressLine1}</p>
                  <p className="text-gray-400 text-sm">{selected.shippingAddress.city}, {selected.shippingAddress.state} {selected.shippingAddress.pincode}</p>
                </div>
              )}

              {/* Items */}
              <div>
                <p className="text-xs text-gray-500 font-semibold uppercase tracking-wider mb-2">Items</p>
                <div className="space-y-2">
                  {selected.items?.map((item: any, idx: number) => (
                    <div key={idx} className="flex items-center justify-between bg-gray-800/30 rounded-lg px-3 py-2">
                      <span className="text-sm text-gray-300">{item.name} × {item.quantity}</span>
                      <span className="text-sm text-white font-medium">₹{(item.price * item.quantity).toLocaleString()}</span>
                    </div>
                  ))}
                </div>
                <div className="mt-3 space-y-1 text-sm">
                  <div className="flex justify-between text-gray-400"><span>Subtotal</span><span>₹{selected.subtotal?.toLocaleString()}</span></div>
                  <div className="flex justify-between text-gray-400"><span>Shipping</span><span>{selected.shippingCost === 0 ? 'Free' : `₹${selected.shippingCost}`}</span></div>
                  <div className="flex justify-between text-gray-400"><span>Tax</span><span>₹{selected.tax?.toLocaleString()}</span></div>
                  <div className="flex justify-between font-bold text-white pt-1 border-t border-gray-700">
                    <span>Total</span><span className="text-yellow-400">₹{selected.totalAmount?.toLocaleString()}</span>
                  </div>
                </div>
              </div>

              {selected.paymentMethod === 'online' && selected.paymentId && (
                <div className="bg-green-500/10 border border-green-500/30 rounded-xl p-4">
                  <p className="text-xs text-green-400 font-semibold uppercase tracking-wider mb-1">Razorpay Payment ID</p>
                  <p className="font-mono text-white font-semibold text-sm bg-black/40 px-3 py-2 rounded-lg">{selected.paymentId}</p>
                </div>
              )}
            </div>

            {/* Footer */}
            <div className="p-6 border-t border-gray-800 bg-gray-900 flex-shrink-0 space-y-4">
              {/* Standard Status Update */}
              <div>
                <label className="block text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2">Update Status</label>
                <div className="flex gap-3">
                  <div className="flex-1">
                    <CustomSelect
                      value={newStatus}
                      onChange={value => setNewStatus(String(value))}
                      options={statusOptions.map(s => ({ value: s, label: s.replace('_', ' ') }))}
                    />
                  </div>
                  <Button onClick={handleStatusUpdate} disabled={actionLoading}>Update</Button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default OrdersPage;
