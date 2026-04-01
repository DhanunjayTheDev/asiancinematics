import { useEffect, useState } from 'react';
import { Helmet } from 'react-helmet-async';
import { toast } from 'react-hot-toast';
import api from '../lib/api';
import Loading from '../components/Loading';
import Pagination from '../components/Pagination';

const statusColors: Record<string, string> = {
  scheduled: 'bg-blue-100 text-blue-700',
  confirmed: 'bg-indigo-100 text-indigo-700',
  in_progress: 'bg-yellow-100 text-yellow-700',
  completed: 'bg-green-100 text-green-700',
  cancelled: 'bg-red-100 text-red-700',
};

const SiteVisitsPage = () => {
  const [visits, setVisits] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [selected, setSelected] = useState<any>(null);
  const [newStatus, setNewStatus] = useState('');

  const fetchVisits = () => {
    setLoading(true);
    api.get('/site-visits/admin/all', { params: { page, limit: 20 } }).then(({ data }) => {
      setVisits(data.data);
      setTotalPages(data.meta?.totalPages || 1);
    }).catch(() => toast.error('Failed to load visits')).finally(() => setLoading(false));
  };

  useEffect(() => { fetchVisits(); }, [page]);

  const handleStatusUpdate = async () => {
    if (!selected || !newStatus) return;
    try {
      await api.put(`/site-visits/${selected._id}/status`, { status: newStatus });
      toast.success('Status updated');
      setSelected(null);
      fetchVisits();
    } catch (err: any) {
      toast.error(err.response?.data?.message || 'Failed to update');
    }
  };

  return (
    <>
      <Helmet><title>Site Visits | Admin</title></Helmet>

      <div className="space-y-4">
        <h1 className="text-2xl font-bold text-gray-900">Site Visits</h1>

        {loading ? <Loading /> : visits.length === 0 ? (
          <p className="text-gray-500 text-center py-12">No site visits.</p>
        ) : (
          <div className="card overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead className="bg-gray-50 text-gray-500 text-left">
                  <tr>
                    <th className="px-5 py-3 font-medium">Customer</th>
                    <th className="px-5 py-3 font-medium">Date</th>
                    <th className="px-5 py-3 font-medium">Time Slot</th>
                    <th className="px-5 py-3 font-medium">Location</th>
                    <th className="px-5 py-3 font-medium">Status</th>
                    <th className="px-5 py-3 font-medium">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {visits.map((v) => (
                    <tr key={v._id} className="hover:bg-gray-50">
                      <td className="px-5 py-3 font-medium text-gray-900">{v.user?.name || 'N/A'}</td>
                      <td className="px-5 py-3 text-gray-600">{new Date(v.date).toLocaleDateString('en-IN')}</td>
                      <td className="px-5 py-3 text-gray-600">{v.timeSlot}</td>
                      <td className="px-5 py-3 text-gray-600">{v.location?.city}, {v.location?.state}</td>
                      <td className="px-5 py-3">
                        <span className={`badge ${statusColors[v.status] || 'bg-gray-100 text-gray-700'}`}>{v.status.replaceAll('_', ' ')}</span>
                      </td>
                      <td className="px-5 py-3">
                        <button onClick={() => { setSelected(v); setNewStatus(v.status); }} className="text-primary-600 hover:underline">
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

      {selected && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="fixed inset-0 bg-black/40" onClick={() => setSelected(null)} />
          <div className="relative bg-white rounded-xl shadow-xl max-w-sm w-full z-10 p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Update Visit</h3>
            <p className="text-sm text-gray-600 mb-1">Customer: {selected.user?.name}</p>
            <p className="text-sm text-gray-600 mb-1">Date: {new Date(selected.date).toLocaleDateString('en-IN')}</p>
            <p className="text-sm text-gray-600 mb-4">Location: {selected.location?.address}, {selected.location?.city}</p>
            {selected.notes && <p className="text-sm text-gray-500 italic mb-4">Notes: {selected.notes}</p>}
            <select value={newStatus} onChange={(e) => setNewStatus(e.target.value)} className="input-field mb-4">
              <option value="scheduled">Scheduled</option>
              <option value="confirmed">Confirmed</option>
              <option value="in_progress">In Progress</option>
              <option value="completed">Completed</option>
              <option value="cancelled">Cancelled</option>
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

export default SiteVisitsPage;
