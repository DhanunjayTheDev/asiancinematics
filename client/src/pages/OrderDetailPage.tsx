import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import api from '../lib/api';
import type { Order } from '../types';
import Loading from '../components/Loading';
import toast from 'react-hot-toast';

const steps = ['pending', 'confirmed', 'processing', 'shipped', 'delivered'];

const OrderDetailPage = () => {
  const { id } = useParams<{ id: string }>();
  const [order, setOrder] = useState<Order | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get(`/orders/${id}`).then((r) => setOrder(r.data.data)).catch(() => setOrder(null)).finally(() => setLoading(false));
  }, [id]);

  const handleCancel = async () => {
    try {
      const { data } = await api.put(`/orders/${id}/cancel`, { reason: 'Cancelled by customer' });
      setOrder(data.data);
      toast.success('Order cancelled');
    } catch (err: any) {
      toast.error(err.response?.data?.message || 'Failed to cancel');
    }
  };

  if (loading) return <Loading />;
  if (!order) return <div className="text-center py-20 text-gray-500">Order not found</div>;

  const currentStep = order.status === 'cancelled' ? -1 : steps.indexOf(order.status);

  return (
    <>
      <Helmet><title>Order {order.orderNumber} | Pravara World Tech</title></Helmet>

      <div className="min-h-screen bg-gradient-to-br from-black to-blue-950/30">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="flex items-start justify-between mb-8">
            <div>
              <h1 className="text-2xl font-bold text-white">{order.orderNumber}</h1>
              <p className="text-gray-400 mt-1">
                Placed on {new Date(order.createdAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'long', year: 'numeric' })}
              </p>
            </div>
            {['pending', 'confirmed'].includes(order.status) && (
              <button onClick={handleCancel} className="bg-red-600 hover:bg-red-700 text-white text-sm py-2 px-4 rounded-lg transition font-medium">Cancel Order</button>
            )}
          </div>

          {/* Progress */}
          {order.status !== 'cancelled' && (
            <div className="bg-gradient-to-br from-blue-900/20 to-blue-800/10 border border-blue-500/20 rounded-lg p-6 mb-8">
              <div className="flex items-center justify-between">
                {steps.map((step, i) => (
                  <div key={step} className="flex items-center flex-1">
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium transition ${i <= currentStep ? 'bg-blue-600 text-white' : 'bg-gray-700 text-gray-400'}`}>
                      {i + 1}
                    </div>
                    <span className={`ml-2 text-sm font-medium capitalize transition ${i <= currentStep ? 'text-blue-400' : 'text-gray-500'}`}>
                      {step}
                    </span>
                    {i < steps.length - 1 && (
                      <div className={`flex-1 h-0.5 mx-4 transition ${i < currentStep ? 'bg-blue-600' : 'bg-gray-700'}`} />
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}

          {order.status === 'cancelled' && (
            <div className="bg-red-500/20 border border-red-500/40 rounded-lg p-6 mb-8">
              <p className="text-red-300 font-medium">Order Cancelled</p>
              {order.cancelReason && <p className="text-red-300/80 text-sm mt-1">{order.cancelReason}</p>}
            </div>
          )}

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Items */}
          <div className="bg-gradient-to-br from-blue-900/20 to-blue-800/10 border border-blue-500/20 rounded-lg p-6">
            <h3 className="font-semibold text-white mb-4">Items</h3>
            <div className="space-y-3">
              {order.items.map((item, i) => (
                <div key={i} className="flex items-center space-x-3">
                  <div className="w-12 h-12 bg-black/40 rounded-lg overflow-hidden border border-blue-500/20">
                    {item.image && <img src={`/uploads/${item.image}`} alt={item.name} className="w-full h-full object-cover" />}
                  </div>
                  <div className="flex-1">
                    <p className="text-sm font-medium text-white">{item.name}</p>
                    <p className="text-xs text-gray-400">Qty: {item.quantity} × ₹{item.price.toLocaleString()}</p>
                  </div>
                  <p className="font-medium text-sm text-yellow-400">₹{(item.price * item.quantity).toLocaleString()}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Summary & Address */}
          <div className="space-y-6">
            <div className="bg-gradient-to-br from-blue-900/20 to-blue-800/10 border border-blue-500/20 rounded-lg p-6">
              <h3 className="font-semibold text-white mb-3">Payment</h3>
              <dl className="text-sm space-y-2">
                <div className="flex justify-between text-gray-400"><dt>Method</dt><dd className="text-gray-300">{order.paymentMethod}</dd></div>
                <div className="flex justify-between text-gray-400"><dt>Status</dt><dd className="capitalize text-gray-300">{order.paymentStatus}</dd></div>
                <div className="flex justify-between text-gray-400"><dt>Subtotal</dt><dd className="text-gray-300">₹{order.subtotal.toLocaleString()}</dd></div>
                <div className="flex justify-between text-gray-400"><dt>Shipping</dt><dd className="text-gray-300">{order.shippingCost === 0 ? 'Free' : `₹${order.shippingCost}`}</dd></div>
                <div className="flex justify-between text-gray-400"><dt>Tax</dt><dd className="text-gray-300">₹{order.tax.toLocaleString()}</dd></div>
                <div className="flex justify-between border-t border-blue-500/20 pt-2 font-semibold text-white"><dt>Total</dt><dd className="text-yellow-400">₹{order.totalAmount.toLocaleString()}</dd></div>
              </dl>
            </div>

            <div className="bg-gradient-to-br from-blue-900/20 to-blue-800/10 border border-blue-500/20 rounded-lg p-6">
              <h3 className="font-semibold text-white mb-3">Shipping Address</h3>
              <div className="text-sm text-gray-400 space-y-1">
                <p className="font-medium text-white">{order.shippingAddress.fullName}</p>
                <p>{order.shippingAddress.addressLine1}</p>
                {order.shippingAddress.addressLine2 && <p>{order.shippingAddress.addressLine2}</p>}
                <p>{order.shippingAddress.city}, {order.shippingAddress.state} - {order.shippingAddress.pincode}</p>
                <p>{order.shippingAddress.phone}</p>
              </div>
            </div>
          </div>
        </div>
        </div>
      </div>
    </>
  );
};

export default OrderDetailPage;
