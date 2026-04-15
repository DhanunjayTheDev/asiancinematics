import { useEffect, useState } from 'react';
import { Helmet } from 'react-helmet-async';
import { Link } from 'react-router-dom';
import {
  HiOutlineShoppingCart,
  HiOutlineCurrencyRupee,
  HiOutlineUsers,
  HiOutlineClipboardList,
  HiOutlineCalendar,
  HiOutlineMail,
  HiOutlineTrendingUp,
} from 'react-icons/hi';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Legend,
  AreaChart,
  Area,
} from 'recharts';
import api from '../lib/api';
import { cacheManager } from '../lib/cache';
import Loading from '../components/Loading';

const COLORS = ['#3b82f6', '#fbbf24', '#10b981', '#ef4444', '#8b5cf6', '#ec4899', '#06b6d4'];

const DashboardPage = () => {
  const [stats, setStats] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDashboard = async () => {
      try {
        const cacheKey = 'admin_dashboard';
        const cacheTTL = 5 * 60 * 1000; // 5 minutes
        
        const cached = cacheManager.get(cacheKey);
        if (cached) {
          setStats(cached);
          setLoading(false);
          return;
        }
        
        const pending = cacheManager.getPendingRequest(cacheKey);
        if (pending) {
          const data = await pending;
          setStats(data);
          setLoading(false);
          return;
        }
        
        const promise = api.get('/admin/dashboard').then(r => r.data.data);
        cacheManager.setPendingRequest(cacheKey, promise);
        
        const data = await promise;
        cacheManager.set(cacheKey, data, cacheTTL);
        setStats(data);
        cacheManager.clearPendingRequest(cacheKey);
      } catch {
        // allow page to render
      } finally {
        setLoading(false);
      }
    };
    fetchDashboard();
  }, []);

  if (loading) return <Loading text="Loading dashboard..." />;
  if (!stats)
    return <p className="text-gray-400 text-center py-12">Failed to load dashboard data.</p>;

  const statCards = [
    { label: 'Total Orders', value: stats.totalOrders ?? 0, icon: HiOutlineShoppingCart, gradient: 'from-blue-500 to-blue-600', link: '/orders' },
    { label: 'Revenue', value: `₹${(stats.totalRevenue ?? 0).toLocaleString()}`, icon: HiOutlineCurrencyRupee, gradient: 'from-yellow-400 to-yellow-500', link: '/reports' },
    { label: 'Customers', value: stats.totalCustomers ?? 0, icon: HiOutlineUsers, gradient: 'from-green-500 to-green-600', link: '/users' },
    { label: 'Open Tickets', value: stats.openTickets ?? 0, icon: HiOutlineClipboardList, gradient: 'from-orange-500 to-orange-600', link: '/tickets' },
    { label: 'Pending Visits', value: stats.pendingVisits ?? 0, icon: HiOutlineCalendar, gradient: 'from-cyan-500 to-cyan-600', link: '/site-visits' },
    { label: 'New Inquiries', value: stats.newInquiries ?? 0, icon: HiOutlineMail, gradient: 'from-pink-500 to-pink-600', link: '/inquiries' },
  ];

  const orderStatusData = stats.ordersByStatus?.map((s: any) => ({
    name: s._id?.charAt(0).toUpperCase() + s._id?.slice(1),
    value: s.count,
  })) || [];

  const monthlyData = stats.monthlyRevenue || [];
  const completionRate = stats.totalOrders ? Math.round((stats.deliveredOrders / stats.totalOrders) * 100) : 0;

  const orderBreakdown = [
    { label: 'Pending', value: stats.pendingOrders ?? 0, color: 'bg-yellow-400' },
    { label: 'Confirmed', value: stats.confirmedOrders ?? 0, color: 'bg-blue-400' },
    { label: 'Processing', value: stats.processingOrders ?? 0, color: 'bg-purple-400' },
    { label: 'Shipped', value: stats.shippedOrders ?? 0, color: 'bg-cyan-400' },
    { label: 'Delivered', value: stats.deliveredOrders ?? 0, color: 'bg-green-400' },
    { label: 'Cancelled', value: stats.cancelledOrders ?? 0, color: 'bg-red-400' },
  ];

  return (
    <>
      <Helmet><title>Dashboard | Admin</title></Helmet>

      <div className="space-y-8">
        <div>
          <h1 className="text-3xl font-bold text-white tracking-tight">Dashboard</h1>
          <p className="text-gray-400 mt-1">Overview of your business performance</p>
        </div>

        {/* Stat Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4">
          {statCards.map((s) => (
            <Link
              key={s.label}
              to={s.link}
              className={`relative overflow-hidden rounded-2xl bg-gradient-to-br ${s.gradient} p-5 text-white shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-0.5 group`}
            >
              <div className="absolute top-0 right-0 -mt-4 -mr-4 w-24 h-24 rounded-full bg-white/10 group-hover:scale-110 transition-transform duration-500" />
              <s.icon className="w-7 h-7 mb-3 opacity-80" />
              <p className="text-xs font-medium opacity-80 uppercase tracking-wider">{s.label}</p>
              <p className="text-2xl font-bold mt-1">{s.value}</p>
            </Link>
          ))}
        </div>

        {/* Charts Row */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 bg-gray-900 rounded-2xl border border-blue-500/20 shadow-sm p-6">
            <div className="flex items-center justify-between mb-6">
              <div>
                <h2 className="text-lg font-semibold text-white">Revenue Overview</h2>
                <p className="text-sm text-gray-400">Monthly revenue trend</p>
              </div>
              <div className="flex items-center gap-2 text-sm">
                <HiOutlineTrendingUp className="w-5 h-5 text-green-400" />
                <span className="text-green-400 font-medium">₹{(stats.totalRevenue ?? 0).toLocaleString()}</span>
              </div>
            </div>
            {monthlyData.length > 0 ? (
              <ResponsiveContainer width="100%" height={320}>
                <AreaChart data={monthlyData}>
                  <defs>
                    <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.15} />
                      <stop offset="95%" stopColor="#3b82f6" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                  <XAxis dataKey="month" tick={{ fontSize: 12, fill: '#9ca3af' }} axisLine={{ stroke: '#4b5563' }} />
                  <YAxis tick={{ fontSize: 12, fill: '#9ca3af' }} axisLine={{ stroke: '#4b5563' }} tickFormatter={(v: number) => `₹${(v / 1000).toFixed(0)}k`} />
                  <Tooltip contentStyle={{ borderRadius: '12px', border: '1px solid #374151', backgroundColor: '#1f2937', color: '#f3f4f6' }} formatter={(v: number) => [`₹${v.toLocaleString()}`, 'Revenue']} />
                  <Area type="monotone" dataKey="revenue" stroke="#3b82f6" strokeWidth={2.5} fill="url(#colorRevenue)" />
                </AreaChart>
              </ResponsiveContainer>
            ) : (
              <div className="h-[320px] flex items-center justify-center text-gray-500">No revenue data yet</div>
            )}
          </div>

          <div className="bg-gray-900 rounded-2xl border border-blue-500/20 shadow-sm p-6">
            <h2 className="text-lg font-semibold text-white mb-2">Orders by Status</h2>
            <p className="text-sm text-gray-400 mb-4">Distribution of order statuses</p>
            {orderStatusData.length > 0 ? (
              <ResponsiveContainer width="100%" height={280}>
                <PieChart>
                  <Pie data={orderStatusData} cx="50%" cy="45%" innerRadius={55} outerRadius={90} paddingAngle={4} dataKey="value">
                    {orderStatusData.map((_: any, i: number) => (
                      <Cell key={i} fill={COLORS[i % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip contentStyle={{ borderRadius: '12px', border: '1px solid #374151', backgroundColor: '#1f2937', color: '#f3f4f6' }} />
                  <Legend verticalAlign="bottom" height={36} iconType="circle" iconSize={8} formatter={(value: string) => <span className="text-xs text-gray-400">{value}</span>} />
                </PieChart>
              </ResponsiveContainer>
            ) : (
              <div className="h-[280px] flex items-center justify-center text-gray-500">No order data yet</div>
            )}
          </div>
        </div>

        {/* Lower Row */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="bg-gray-900 rounded-2xl border border-blue-500/20 shadow-sm p-6">
            <h2 className="text-lg font-semibold text-white mb-1">Order Breakdown</h2>
            <p className="text-sm text-gray-400 mb-6">Completion rate overview</p>
            <div className="flex items-center justify-center mb-6">
              <div className="relative w-32 h-32">
                <svg className="w-32 h-32 -rotate-90" viewBox="0 0 120 120">
                  <circle cx="60" cy="60" r="50" fill="none" stroke="#374151" strokeWidth="10" />
                  <circle cx="60" cy="60" r="50" fill="none" stroke="#10b981" strokeWidth="10" strokeDasharray={`${completionRate * 3.14} ${(100 - completionRate) * 3.14}`} strokeLinecap="round" />
                </svg>
                <div className="absolute inset-0 flex flex-col items-center justify-center">
                  <span className="text-2xl font-bold text-white">{completionRate}%</span>
                  <span className="text-xs text-gray-400">Delivered</span>
                </div>
              </div>
            </div>
            <div className="space-y-3">
              {orderBreakdown.map((item) => (
                <div key={item.label} className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className={`w-2.5 h-2.5 rounded-full ${item.color}`} />
                    <span className="text-sm text-gray-300">{item.label}</span>
                  </div>
                  <span className="text-sm font-semibold text-white">{item.value}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="lg:col-span-2 bg-gray-900 rounded-2xl border border-blue-5 00/20 shadow-sm p-6">
            <h2 className="text-lg font-semibold text-white mb-1">Monthly Orders</h2>
            <p className="text-sm text-gray-400 mb-6">Number of orders per month</p>
            {monthlyData.length > 0 ? (
              <ResponsiveContainer width="100%" height={260}>
                <BarChart data={monthlyData} barSize={28}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                  <XAxis dataKey="month" tick={{ fontSize: 12, fill: '#9ca3af' }} axisLine={{ stroke: '#4b5563' }} />
                  <YAxis tick={{ fontSize: 12, fill: '#9ca3af' }} axisLine={{ stroke: '#4b5563' }} allowDecimals={false} />
                  <Tooltip contentStyle={{ borderRadius: '12px', border: '1px solid #374151', backgroundColor: '#1f2937', color: '#f3f4f6' }} />
                  <Bar dataKey="orders" fill="#8b5cf6" radius={[6, 6, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            ) : (
              <div className="h-[260px] flex items-center justify-center text-gray-500">No order data yet</div>
            )}
          </div>
        </div>

        {/* Recent Orders */}
        {stats.recentOrders?.length > 0 && (
          <div className="bg-gray-900 rounded-2xl border border-blue-500/20 shadow-sm overflow-hidden">
            <div className="p-6 flex items-center justify-between border-b border-blue-500/20">
              <div>
                <h2 className="text-lg font-semibold text-white">Recent Orders</h2>
                <p className="text-sm text-gray-400">Latest 10 orders</p>
              </div>
              <Link to="/orders" className="text-sm font-medium text-blue-400 hover:text-blue-300 transition-colors">View All →</Link>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-blue-500/20">
                    <th className="px-6 py-3.5 text-left text-xs font-semibold text-gray-400 uppercase tracking-wider">Order #</th>
                    <th className="px-6 py-3.5 text-left text-xs font-semibold text-gray-400 uppercase tracking-wider">Customer</th>
                    <th className="px-6 py-3.5 text-left text-xs font-semibold text-gray-400 uppercase tracking-wider">Total</th>
                    <th className="px-6 py-3.5 text-left text-xs font-semibold text-gray-400 uppercase tracking-wider">Status</th>
                    <th className="px-6 py-3.5 text-left text-xs font-semibold text-gray-400 uppercase tracking-wider">Date</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-blue-500/10">
                  {stats.recentOrders.map((o: any) => (
                    <tr key={o._id} className="hover:bg-blue-500/5 transition-colors">
                      <td className="px-6 py-4 font-medium text-white">{o.orderNumber}</td>
                      <td className="px-6 py-4 text-gray-300">{o.user?.name || 'N/A'}</td>
                      <td className="px-6 py-4 font-medium text-white">₹{o.totalAmount?.toLocaleString()}</td>
                      <td className="px-6 py-4">
                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                          o.status === 'delivered' || o.status === 'completed' ? 'bg-green-500/20 text-green-400 ring-1 ring-green-600/30' :
                          o.status === 'cancelled' ? 'bg-red-500/20 text-red-400 ring-1 ring-red-600/30' :
                          o.status === 'processing' ? 'bg-blue-500/20 text-blue-400 ring-1 ring-blue-600/30' :
                          'bg-yellow-500/20 text-yellow-400 ring-1 ring-yellow-600/30'
                        }`}>{o.status}</span>
                      </td>
                      <td className="px-6 py-4 text-gray-400">{new Date(o.createdAt).toLocaleDateString('en-IN')}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>
    </>
  );
};

export default DashboardPage;
