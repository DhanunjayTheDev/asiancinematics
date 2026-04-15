import { useEffect, useState, useRef } from 'react';
import { Link } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import api from '../lib/api';
import type { Order } from '../types';
import Loading from '../components/Loading';
import EmptyState from '../components/EmptyState';
import CustomSelect from '../components/CustomSelect';

gsap.registerPlugin(ScrollTrigger);

const statusColors: Record<string, string> = {
  pending: 'bg-yellow-500/20 text-yellow-300',
  confirmed: 'bg-blue-500/20 text-blue-300',
  processing: 'bg-indigo-500/20 text-indigo-300',
  shipped: 'bg-purple-500/20 text-purple-300',
  delivered: 'bg-green-500/20 text-green-300',
  cancelled: 'bg-red-500/20 text-red-300',
};

const OrdersPage = () => {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState('');
  const headerRef = useRef<HTMLDivElement>(null);
  const ordersListRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const params = statusFilter ? `?status=${statusFilter}` : '';
        const { data } = await api.get(`/orders${params}`);
        setOrders(data.data || []);
      } catch {
        setOrders([]);
      } finally {
        setLoading(false);
      }
    };
    fetchOrders();
  }, [statusFilter]);

  // GSAP scroll animations
  useEffect(() => {
    const ctx = gsap.context(() => {
      if (headerRef.current) {
        gsap.from(headerRef.current, {
          opacity: 0,
          y: 20,
          duration: 0.6,
          ease: 'power3.out',
        });
      }

      gsap.utils.toArray('.order-card-animate').forEach((card: any, idx: number) => {
        gsap.from(card, {
          opacity: 0,
          y: 20,
          duration: 0.5,
          delay: idx * 0.05,
          scrollTrigger: {
            trigger: card,
            start: 'top 80%',
            scrub: false,
          },
          ease: 'power3.out',
        });
      });
    });

    return () => ctx.revert();
  }, [orders]);

  return (
    <>
      <Helmet><title>My Orders | Pravara World Tech</title></Helmet>

      <div className="min-h-screen bg-gradient-to-br from-black to-blue-950/30">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div ref={headerRef} className="flex items-center justify-between mb-8">
            <h1 className="text-2xl font-bold text-white">My Orders</h1>
            <div className="w-56">
              <CustomSelect
                value={statusFilter}
                onChange={(value) => setStatusFilter(String(value))}
                options={[
                  { value: '', label: 'All Orders' },
                  { value: 'pending', label: 'Pending' },
                  { value: 'confirmed', label: 'Confirmed' },
                  { value: 'processing', label: 'Processing' },
                  { value: 'shipped', label: 'Shipped' },
                  { value: 'delivered', label: 'Delivered' },
                  { value: 'cancelled', label: 'Cancelled' },
                ]}
              />
            </div>
          </div>

          {loading ? (
            <Loading />
          ) : orders.length === 0 ? (
            <EmptyState
              title="No orders yet"
              description="Start shopping to see your orders here."
              action={<Link to="/products" className="inline-block bg-blue-600 hover:bg-blue-700 text-white font-semibold px-6 py-2 rounded-lg transition mt-2">Browse Products</Link>}
            />
          ) : (
            <div className="space-y-4">
              {orders.map((order) => (
                <Link key={order._id} to={`/orders/${order._id}`} className="order-card-animate bg-gradient-to-br from-blue-900/20 to-blue-800/10 border border-blue-500/20 rounded-lg p-6 hover:border-blue-500/40 transition-all block">
                  <div className="flex items-start justify-between">
                    <div>
                      <p className="font-semibold text-white">{order.orderNumber}</p>
                      <p className="text-sm text-gray-400 mt-1">
                        {new Date(order.createdAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}
                      </p>
                      <p className="text-sm text-gray-400 mt-2">
                        {order.items.length} item{order.items.length > 1 ? 's' : ''} · {order.paymentMethod}
                      </p>
                    </div>
                    <div className="text-right">
                      <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-semibold ${statusColors[order.status]}`}>{order.status}</span>
                      <p className="font-bold text-yellow-400 mt-2">₹{order.totalAmount.toLocaleString()}</p>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          )}
        </div>
      </div>
    </>
  );
};

export default OrdersPage;
