import { useEffect, useState } from 'react';
import { Helmet } from 'react-helmet-async';
import { toast } from 'react-hot-toast';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import api from '../lib/api';
import { cacheManager } from '../lib/cache';
import Loading from '../components/Loading';
import Pagination from '../components/Pagination';
import Button from '../components/Button';

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
          <h1 className="text-2xl font-bold text-white">Reports</h1>
          {tab === 'revenue' && (
            <Button onClick={handleExportCSV} variant="secondary" size="sm">Export CSV</Button>
          )}
        </div>

        <div className="flex gap-2 border-b border-blue-500/20">
          {(['revenue', 'audit'] as const).map((t) => (
            <Button
              key={t}
              onClick={() => { setTab(t); setPage(1); }}
              variant={tab === t ? 'primary' : 'secondary'}
              className={`px-4 py-2 text-sm font-medium border-b-2 -mb-px transition ${
                tab === t ? 'border-blue-400 text-blue-400' : 'border-transparent text-gray-400 hover:text-gray-300'
              }`}
            >
              {t === 'revenue' ? 'Revenue Report' : 'Audit Logs'}
            </Button>
          ))}
        </div>

        {loading ? <Loading /> : tab === 'revenue' ? (
          <div className="space-y-6">
            {reportData && (
              <>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <div className="bg-gray-900 rounded-2xl border border-blue-500/20 shadow-sm p-6">
                    <p className="text-sm text-gray-400">Total Revenue</p>
                    <p className="text-2xl font-bold text-white">₹{(reportData.totalRevenue || 0).toLocaleString()}</p>
                  </div>
                  <div className="bg-gray-900 rounded-2xl border border-blue-500/20 shadow-sm p-6">
                    <p className="text-sm text-gray-400">Total Orders</p>
                    <p className="text-2xl font-bold text-white">{reportData.totalOrders || 0}</p>
                  </div>
                  <div className="bg-gray-900 rounded-2xl border border-blue-500/20 shadow-sm p-6">
                    <p className="text-sm text-gray-400">Avg Order Value</p>
                    <p className="text-2xl font-bold text-white">₹{(reportData.avgOrderValue || 0).toLocaleString()}</p>
                  </div>
                </div>

                {reportData.monthlyData?.length > 0 && (
                  <div className="bg-gray-900 rounded-2xl border border-blue-500/20 shadow-sm p-6">
                    <h2 className="text-lg font-semibold text-white mb-4">Monthly Revenue</h2>
                    <ResponsiveContainer width="100%" height={300}>
                      <BarChart data={reportData.monthlyData}>
                        <CartesianGrid strokeDasharray="3 3" stroke="#1f2937" />
                        <XAxis dataKey="month" tick={{ fontSize: 12, fill: '#9ca3af' }} />
                        <YAxis tick={{ fontSize: 12, fill: '#9ca3af' }} />
                        <Tooltip formatter={(v: number) => [`₹${v.toLocaleString()}`, 'Revenue']} />
                        <Bar dataKey="revenue" fill="#3b82f6" radius={[4, 4, 0, 0]} />
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
              <p className="text-gray-400 text-center py-12">No audit logs.</p>
            ) : (
              <div className="bg-gray-900 rounded-2xl border border-blue-500/20 shadow-sm overflow-hidden">
                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead className="bg-black text-gray-400 text-left">
                      <tr>
                        <th className="px-5 py-3 font-medium">User</th>
                        <th className="px-5 py-3 font-medium">Action</th>
                        <th className="px-5 py-3 font-medium">Resource</th>
                        <th className="px-5 py-3 font-medium">Details</th>
                        <th className="px-5 py-3 font-medium">IP</th>
                        <th className="px-5 py-3 font-medium">Date</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-blue-500/10">
                      {auditLogs.map((log) => (
                        <tr key={log._id} className="hover:bg-blue-500/10">
                          <td className="px-5 py-3 text-white">{log.user?.name || 'System'}</td>
                          <td className="px-5 py-3">
                            <span className="badge bg-blue-600/20 text-blue-300">{log.action}</span>
                          </td>
                          <td className="px-5 py-3 text-gray-300">{log.resource}</td>
                          <td className="px-5 py-3 text-gray-400 max-w-xs truncate">{typeof log.details === 'string' ? log.details : (log.details ? JSON.stringify(log.details) : '—')}</td>
                          <td className="px-5 py-3 text-gray-400">{log.ipAddress || '—'}</td>
                          <td className="px-5 py-3 text-gray-400">{new Date(log.createdAt).toLocaleString('en-IN')}</td>
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
