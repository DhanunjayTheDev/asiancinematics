import { useEffect, useState } from 'react';
import { Helmet } from 'react-helmet-async';
import { HiOutlineShoppingCart, HiOutlineCurrencyRupee, HiOutlineUsers, HiOutlineClipboardList } from 'react-icons/hi';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import api from '../lib/api';
import Loading from '../components/Loading';

const COLORS = ['#2563eb', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6', '#ec4899'];

const DashboardPage = () => {
  const [stats, setStats] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get('/admin/dashboard').then((r) => setStats(r.data.data)).catch(() => {}).finally(() => setLoading(false));
  }, []);

  if (loading) return <Loading text="Loading dashboard..." />;
  if (!stats) return <p className="text-gray-500 text-center py-12">Failed to load dashboard data.</p>;

  const statCards = [
    { label: 'Total Orders', value: stats.totalOrders || 0, icon: HiOutlineShoppingCart, color: 'bg-blue-50 text-blue-600' },
    { label: 'Revenue', value: `₹${(stats.totalRevenue || 0).toLocaleString()}`, icon: HiOutlineCurrencyRupee, color: 'bg-green-50 text-green-600' },
    { label: 'Customers', value: stats.totalCustomers || 0, icon: HiOutlineUsers, color: 'bg-purple-50 text-purple-600' },
    { label: 'Open Tickets', value: stats.openTickets || 0, icon: HiOutlineClipboardList, color: 'bg-orange-50 text-orange-600' },
  ];

  const orderStatusData = stats.ordersByStatus?.map((s: any) => ({ name: s._id, value: s.count })) || [];
  const monthlyData = stats.monthlyRevenue || [];

  return (
    <>
      <Helmet><title>Dashboard | Admin</title></Helmet>

      <div className="space-y-6">
        <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {statCards.map((s) => (
            <div key={s.label} className="stat-card flex items-center gap-4">
              <div className={`w-12 h-12 rounded-lg flex items-center justify-center ${s.color}`}>
                <s.icon className="w-6 h-6" />
              </div>
              <div>
                <p className="text-sm text-gray-500">{s.label}</p>
                <p className="text-xl font-bold text-gray-900">{s.value}</p>
              </div>
            </div>
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="card p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">Monthly Revenue</h2>
            {monthlyData.length > 0 ? (
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={monthlyData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                  <XAxis dataKey="month" tick={{ fontSize: 12 }} />
                  <YAxis tick={{ fontSize: 12 }} />
                  <Tooltip formatter={(v: number) => [`₹${v.toLocaleString()}`, 'Revenue']} />
                  <Bar dataKey="revenue" fill="#2563eb" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            ) : (
              <p className="text-gray-400 text-center py-12">No data yet</p>
            )}
          </div>

          <div className="card p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">Orders by Status</h2>
            {orderStatusData.length > 0 ? (
              <ResponsiveContainer width="100%" height={300}>
                <PieChart>
                  <Pie data={orderStatusData} cx="50%" cy="50%" innerRadius={60} outerRadius={100} paddingAngle={4} dataKey="value" label={({ name, value }) => `${name}: ${value}`}>
                    {orderStatusData.map((_: any, i: number) => (
                      <Cell key={i} fill={COLORS[i % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            ) : (
              <p className="text-gray-400 text-center py-12">No data yet</p>
            )}
          </div>
        </div>

        {stats.recentOrders?.length > 0 && (
          <div className="card overflow-hidden">
            <div className="p-5 border-b border-gray-200">
              <h2 className="text-lg font-semibold text-gray-900">Recent Orders</h2>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead className="bg-gray-50 text-gray-500 text-left">
                  <tr>
                    <th className="px-5 py-3 font-medium">Order #</th>
                    <th className="px-5 py-3 font-medium">Customer</th>
                    <th className="px-5 py-3 font-medium">Total</th>
                    <th className="px-5 py-3 font-medium">Status</th>
                    <th className="px-5 py-3 font-medium">Date</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {stats.recentOrders.map((o: any) => (
                    <tr key={o._id} className="hover:bg-gray-50">
                      <td className="px-5 py-3 font-medium text-gray-900">{o.orderNumber}</td>
                      <td className="px-5 py-3 text-gray-600">{o.user?.name || 'N/A'}</td>
                      <td className="px-5 py-3 text-gray-900">₹{o.totalAmount?.toLocaleString()}</td>
                      <td className="px-5 py-3">
                        <span className={`badge ${
                          o.status === 'delivered' ? 'bg-green-100 text-green-700' :
                          o.status === 'cancelled' ? 'bg-red-100 text-red-700' :
                          o.status === 'processing' ? 'bg-blue-100 text-blue-700' :
                          'bg-yellow-100 text-yellow-700'
                        }`}>{o.status}</span>
                      </td>
                      <td className="px-5 py-3 text-gray-500">{new Date(o.createdAt).toLocaleDateString('en-IN')}</td>
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
