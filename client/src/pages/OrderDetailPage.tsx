import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import api from '../lib/api';
import type { Order } from '../types';
import Loading from '../components/Loading';
import toast from 'react-hot-toast';

const steps = ['pending', 'processing', 'completed'];

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
      <Helmet><title>Order {order.orderNumber} | Asian Cinematics</title></Helmet>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex items-start justify-between mb-8">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">{order.orderNumber}</h1>
            <p className="text-gray-500 mt-1">
              Placed on {new Date(order.createdAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'long', year: 'numeric' })}
            </p>
          </div>
          {order.status === 'pending' && (
            <button onClick={handleCancel} className="btn-danger text-sm py-2">Cancel Order</button>
          )}
        </div>

        {/* Progress */}
        {order.status !== 'cancelled' && (
          <div className="card mb-8">
            <div className="flex items-center justify-between">
              {steps.map((step, i) => (
                <div key={step} className="flex items-center flex-1">
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium ${i <= currentStep ? 'bg-primary-600 text-white' : 'bg-gray-200 text-gray-500'}`}>
                    {i + 1}
                  </div>
                  <span className={`ml-2 text-sm font-medium capitalize ${i <= currentStep ? 'text-primary-600' : 'text-gray-400'}`}>
                    {step}
                  </span>
                  {i < steps.length - 1 && (
                    <div className={`flex-1 h-0.5 mx-4 ${i < currentStep ? 'bg-primary-600' : 'bg-gray-200'}`} />
                  )}
                </div>
              ))}
            </div>
          </div>
        )}

        {order.status === 'cancelled' && (
          <div className="card mb-8 bg-red-50 border-red-100">
            <p className="text-red-700 font-medium">Order Cancelled</p>
            {order.cancelReason && <p className="text-red-600 text-sm mt-1">{order.cancelReason}</p>}
          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Items */}
          <div className="card">
            <h3 className="font-semibold text-gray-900 mb-4">Items</h3>
            <div className="space-y-3">
              {order.items.map((item, i) => (
                <div key={i} className="flex items-center space-x-3">
                  <div className="w-12 h-12 bg-gray-100 rounded-lg overflow-hidden">
                    {item.image && <img src={`/uploads/${item.image}`} alt={item.name} className="w-full h-full object-cover" />}
                  </div>
                  <div className="flex-1">
                    <p className="text-sm font-medium">{item.name}</p>
                    <p className="text-xs text-gray-500">Qty: {item.quantity} × ₹{item.price.toLocaleString()}</p>
                  </div>
                  <p className="font-medium text-sm">₹{(item.price * item.quantity).toLocaleString()}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Summary & Address */}
          <div className="space-y-6">
            <div className="card">
              <h3 className="font-semibold text-gray-900 mb-3">Payment</h3>
              <dl className="text-sm space-y-2">
                <div className="flex justify-between"><dt className="text-gray-500">Method</dt><dd>{order.paymentMethod}</dd></div>
                <div className="flex justify-between"><dt className="text-gray-500">Status</dt><dd className="capitalize">{order.paymentStatus}</dd></div>
                <div className="flex justify-between"><dt className="text-gray-500">Subtotal</dt><dd>₹{order.subtotal.toLocaleString()}</dd></div>
                <div className="flex justify-between"><dt className="text-gray-500">Shipping</dt><dd>{order.shippingCost === 0 ? 'Free' : `₹${order.shippingCost}`}</dd></div>
                <div className="flex justify-between"><dt className="text-gray-500">Tax</dt><dd>₹{order.tax.toLocaleString()}</dd></div>
                <div className="flex justify-between border-t pt-2 font-semibold"><dt>Total</dt><dd>₹{order.totalAmount.toLocaleString()}</dd></div>
              </dl>
            </div>

            <div className="card">
              <h3 className="font-semibold text-gray-900 mb-3">Shipping Address</h3>
              <div className="text-sm text-gray-600 space-y-1">
                <p className="font-medium text-gray-900">{order.shippingAddress.fullName}</p>
                <p>{order.shippingAddress.addressLine1}</p>
                {order.shippingAddress.addressLine2 && <p>{order.shippingAddress.addressLine2}</p>}
                <p>{order.shippingAddress.city}, {order.shippingAddress.state} - {order.shippingAddress.pincode}</p>
                <p>{order.shippingAddress.phone}</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default OrderDetailPage;
