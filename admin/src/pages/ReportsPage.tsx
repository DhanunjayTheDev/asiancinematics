import { useEffect, useState } from 'react';
import { Helmet } from 'react-helmet-async';
import { toast } from 'react-hot-toast';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import api from '../lib/api';
import Loading from '../components/Loading';
import Pagination from '../components/Pagination';

const ReportsPage = () => {
  const [tab, setTab] = useState<'revenue' | 'audit'>('revenue');
  const [reportData, setReportData] = useState<any>(null);
  const [auditLogs, setAuditLogs] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  useEffect(() => {
    if (tab === 'revenue') {
      setLoading(true);
      api.get('/admin/reports/orders').then(({ data }) => setReportData(data.data)).catch(() => {}).finally(() => setLoading(false));
    } else {
      setLoading(true);
      api.get('/admin/audit-logs', { params: { page, limit: 20 } }).then(({ data }) => {
        setAuditLogs(data.data);
        setTotalPages(data.meta?.totalPages || 1);
      }).catch(() => toast.error('Failed to load audit logs')).finally(() => setLoading(false));
    }
  }, [tab, page]);

  const handleExportCSV = async () => {
    try {
      const { data } = await api.get('/admin/reports/orders/export', { responseType: 'blob' });
      const url = window.URL.createObjectURL(new Blob([data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', `orders-report-${Date.now()}.csv`);
      document.body.appendChild(link);
      link.click();
      link.remove();
      window.URL.revokeObjectURL(url);
    } catch {
      toast.error('Failed to export');
    }
  };

  return (
    <>
      <Helmet><title>Reports | Admin</title></Helmet>

      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-bold text-gray-900">Reports</h1>
          {tab === 'revenue' && (
            <button onClick={handleExportCSV} className="btn-secondary btn-sm">Export CSV</button>
          )}
        </div>

        <div className="flex gap-2 border-b border-gray-200">
          {(['revenue', 'audit'] as const).map((t) => (
            <button
              key={t}
              onClick={() => { setTab(t); setPage(1); }}
              className={`px-4 py-2 text-sm font-medium border-b-2 -mb-px transition ${
                tab === t ? 'border-primary-600 text-primary-600' : 'border-transparent text-gray-500 hover:text-gray-700'
              }`}
            >
              {t === 'revenue' ? 'Revenue Report' : 'Audit Logs'}
            </button>
          ))}
        </div>

        {loading ? <Loading /> : tab === 'revenue' ? (
          <div className="space-y-6">
            {reportData && (
              <>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <div className="stat-card">
                    <p className="text-sm text-gray-500">Total Revenue</p>
                    <p className="text-2xl font-bold text-gray-900">₹{(reportData.totalRevenue || 0).toLocaleString()}</p>
                  </div>
                  <div className="stat-card">
                    <p className="text-sm text-gray-500">Total Orders</p>
                    <p className="text-2xl font-bold text-gray-900">{reportData.totalOrders || 0}</p>
                  </div>
                  <div className="stat-card">
                    <p className="text-sm text-gray-500">Avg Order Value</p>
                    <p className="text-2xl font-bold text-gray-900">₹{(reportData.avgOrderValue || 0).toLocaleString()}</p>
                  </div>
                </div>

                {reportData.monthlyData?.length > 0 && (
                  <div className="card p-6">
                    <h2 className="text-lg font-semibold text-gray-900 mb-4">Monthly Revenue</h2>
                    <ResponsiveContainer width="100%" height={300}>
                      <BarChart data={reportData.monthlyData}>
                        <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                        <XAxis dataKey="month" tick={{ fontSize: 12 }} />
                        <YAxis tick={{ fontSize: 12 }} />
                        <Tooltip formatter={(v: number) => [`₹${v.toLocaleString()}`, 'Revenue']} />
                        <Bar dataKey="revenue" fill="#2563eb" radius={[4, 4, 0, 0]} />
                      </BarChart>
                    </ResponsiveContainer>
                  </div>
                )}
              </>
            )}
          </div>
        ) : (
          <>
            {auditLogs.length === 0 ? (
              <p className="text-gray-500 text-center py-12">No audit logs.</p>
            ) : (
              <div className="card overflow-hidden">
                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead className="bg-gray-50 text-gray-500 text-left">
                      <tr>
                        <th className="px-5 py-3 font-medium">User</th>
                        <th className="px-5 py-3 font-medium">Action</th>
                        <th className="px-5 py-3 font-medium">Resource</th>
                        <th className="px-5 py-3 font-medium">Details</th>
                        <th className="px-5 py-3 font-medium">IP</th>
                        <th className="px-5 py-3 font-medium">Date</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100">
                      {auditLogs.map((log) => (
                        <tr key={log._id} className="hover:bg-gray-50">
                          <td className="px-5 py-3 text-gray-900">{log.user?.name || 'System'}</td>
                          <td className="px-5 py-3">
                            <span className="badge bg-blue-100 text-blue-700">{log.action}</span>
                          </td>
                          <td className="px-5 py-3 text-gray-600">{log.resource}</td>
                          <td className="px-5 py-3 text-gray-500 max-w-xs truncate">{log.details || '—'}</td>
                          <td className="px-5 py-3 text-gray-500">{log.ipAddress || '—'}</td>
                          <td className="px-5 py-3 text-gray-500">{new Date(log.createdAt).toLocaleString('en-IN')}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}
            <Pagination page={page} totalPages={totalPages} onPageChange={setPage} />
          </>
        )}
      </div>
    </>
  );
};

export default ReportsPage;
