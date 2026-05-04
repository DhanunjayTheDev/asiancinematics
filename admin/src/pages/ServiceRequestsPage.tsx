import { useEffect, useState } from 'react';
import { Helmet } from 'react-helmet-async';
import toast from 'react-hot-toast';
import { FiCheck, FiX, FiFilter, FiChevronDown, FiDownload } from 'react-icons/fi';
import api from '../lib/api';
import Loading from '../components/Loading';
import Pagination from '../components/Pagination';

const statusConfig: Record<string, { color: string; bg: string; label: string }> = {
  new: { color: 'text-blue-400', bg: 'bg-blue-400/10 border-blue-400/30', label: 'New' },
  contacted: { color: 'text-amber-400', bg: 'bg-amber-400/10 border-amber-400/30', label: 'Contacted' },
  qualified: { color: 'text-cyan-400', bg: 'bg-cyan-400/10 border-cyan-400/30', label: 'Qualified' },
  proposal_sent: { color: 'text-purple-400', bg: 'bg-purple-400/10 border-purple-400/30', label: 'Proposal Sent' },
  converted: { color: 'text-emerald-400', bg: 'bg-emerald-400/10 border-emerald-400/30', label: 'Converted' },
  closed: { color: 'text-gray-400', bg: 'bg-gray-400/10 border-gray-400/30', label: 'Closed' },
};

const ServiceRequestsPage = () => {
  const [requests, setRequests] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [selected, setSelected] = useState<any>(null);
  const [newStatus, setNewStatus] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');
  const [showModal, setShowModal] = useState(false);

  const fetchRequests = () => {
    setLoading(true);
    const params: any = { page, limit: 20 };
    if (filterStatus !== 'all') params.status = filterStatus;

    api.get('/service-requests/all', { params })
      .then(({ data }) => {
        setRequests(data.data);
        setTotalPages(data.meta?.totalPages || 1);
      })
      .catch(() => toast.error('Failed to load requests'))
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    setPage(1);
  }, [filterStatus]);

  useEffect(() => {
    fetchRequests();
  }, [page, filterStatus]);

  const handleStatusUpdate = async () => {
    if (!selected || !newStatus) return;
    try {
      await api.put(`/service-requests/${selected._id}/status`, { status: newStatus });
      toast.success('Status updated');
      setSelected(null);
      setShowModal(false);
      fetchRequests();
    } catch (err: any) {
      toast.error(err.response?.data?.message || 'Failed to update');
    }
  };

  const getStatusCounts = () => {
    const counts: Record<string, number> = { all: requests.length };
    requests.forEach((r) => {
      counts[r.status] = (counts[r.status] || 0) + 1;
    });
    return counts;
  };

  const counts = getStatusCounts();

  if (loading && requests.length === 0) return <Loading />;

  return (
    <>
      <Helmet><title>Service Requests | Admin</title></Helmet>

      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold text-white">Service Requests</h1>
            <p className="text-sm text-gray-400 mt-1">{requests.length} total requests</p>
          </div>
        </div>

        {/* Filters */}
        <div className="flex gap-2 flex-wrap">
          {Object.entries(counts).map(([status, count]) => (
            <button
              key={status}
              onClick={() => setFilterStatus(status)}
              className={`px-4 py-2 rounded-lg font-medium transition ${
                filterStatus === status
                  ? 'bg-blue-600 text-white'
                  : 'bg-gray-800 text-gray-300 hover:bg-gray-700'
              }`}
            >
              {status.toUpperCase()} ({count})
            </button>
          ))}
        </div>

        {/* Requests Table */}
        <div className="bg-gray-900 border border-gray-800 rounded-lg overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-gray-800 bg-gray-800/50">
                <th className="px-6 py-3 text-left font-semibold text-gray-300">Product</th>
                <th className="px-6 py-3 text-left font-semibold text-gray-300">Customer</th>
                <th className="px-6 py-3 text-left font-semibold text-gray-300">Location</th>
                <th className="px-6 py-3 text-left font-semibold text-gray-300">Budget</th>
                <th className="px-6 py-3 text-left font-semibold text-gray-300">Status</th>
                <th className="px-6 py-3 text-left font-semibold text-gray-300">Date</th>
                <th className="px-6 py-3 text-left font-semibold text-gray-300">Action</th>
              </tr>
            </thead>
            <tbody>
              {requests.length === 0 ? (
                <tr>
                  <td colSpan={7} className="px-6 py-8 text-center text-gray-400">
                    No service requests found
                  </td>
                </tr>
              ) : (
                requests.map((request) => (
                  <tr key={request._id} className="border-b border-gray-800 hover:bg-gray-800/50 transition">
                    <td className="px-6 py-3 text-white font-medium truncate max-w-xs">{request.product}</td>
                    <td className="px-6 py-3">
                      <div className="text-white">{request.name}</div>
                      <div className="text-xs text-gray-400">{request.phone}</div>
                    </td>
                    <td className="px-6 py-3 text-gray-300">{request.location}</td>
                    <td className="px-6 py-3 text-gray-300">{request.budget || 'N/A'}</td>
                    <td className="px-6 py-3">
                      <span className={`inline-block px-3 py-1 rounded-full text-xs font-medium border ${statusConfig[request.status]?.bg} ${statusConfig[request.status]?.color}`}>
                        {statusConfig[request.status]?.label || request.status}
                      </span>
                    </td>
                    <td className="px-6 py-3 text-gray-400 text-xs">
                      {new Date(request.createdAt).toLocaleDateString()}
                    </td>
                    <td className="px-6 py-3">
                      <button
                        onClick={() => {
                          setSelected(request);
                          setNewStatus(request.status);
                          setShowModal(true);
                        }}
                        className="text-blue-400 hover:text-blue-300 font-medium text-sm"
                      >
                        View & Update
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        <Pagination current={page} total={totalPages} onChange={setPage} />

        {/* Detail Modal */}
        {showModal && selected && (
          <div className="fixed inset-0 bg-black/50 backdrop-blur z-50 flex items-center justify-center p-4">
            <div className="bg-gray-900 border border-gray-800 rounded-lg max-w-2xl w-full max-h-96 overflow-y-auto p-6">
              <div className="flex justify-between items-start mb-4">
                <div>
                  <h2 className="text-xl font-bold text-white">{selected.product}</h2>
                  <p className="text-sm text-gray-400">{selected.name} | {selected.location}</p>
                </div>
                <button
                  onClick={() => setShowModal(false)}
                  className="text-gray-400 hover:text-white text-2xl"
                >
                  ×
                </button>
              </div>

              <div className="grid grid-cols-2 gap-4 mb-6 text-sm">
                <div>
                  <p className="text-gray-400">Contact</p>
                  <p className="text-white font-medium">{selected.phone}</p>
                </div>
                <div>
                  <p className="text-gray-400">Timeline</p>
                  <p className="text-white font-medium">{selected.timeline || 'N/A'}</p>
                </div>
                <div>
                  <p className="text-gray-400">Budget</p>
                  <p className="text-white font-medium">{selected.budget || 'N/A'}</p>
                </div>
                <div>
                  <p className="text-gray-400">Preferred Brand</p>
                  <p className="text-white font-medium">{selected.brand || 'N/A'}</p>
                </div>
                {selected.setupType && (
                  <div>
                    <p className="text-gray-400">Setup Type</p>
                    <p className="text-white font-medium">{selected.setupType}</p>
                  </div>
                )}
                {selected.roomSize && (
                  <div>
                    <p className="text-gray-400">Room Size</p>
                    <p className="text-white font-medium">{selected.roomSize} sq ft</p>
                  </div>
                )}
              </div>

              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-300 mb-2">Update Status</label>
                <select
                  value={newStatus}
                  onChange={(e) => setNewStatus(e.target.value)}
                  className="w-full bg-gray-800 border border-gray-700 rounded px-3 py-2 text-white focus:outline-none focus:border-blue-500"
                >
                  {Object.entries(statusConfig).map(([key, val]) => (
                    <option key={key} value={key}>{val.label}</option>
                  ))}
                </select>
              </div>

              <div className="flex gap-2">
                <button
                  onClick={() => setShowModal(false)}
                  className="flex-1 bg-gray-700 hover:bg-gray-600 text-white font-medium py-2 rounded transition"
                >
                  Cancel
                </button>
                <button
                  onClick={handleStatusUpdate}
                  className="flex-1 bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 rounded transition"
                >
                  Update Status
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </>
  );
};

export default ServiceRequestsPage;
