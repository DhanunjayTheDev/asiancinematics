import { useEffect, useState } from 'react';
import { Helmet } from 'react-helmet-async';
import { toast } from 'react-hot-toast';
import api from '../lib/api';
import Loading from '../components/Loading';
import Pagination from '../components/Pagination';

const statusColors: Record<string, string> = {
  open: 'bg-blue-100 text-blue-700',
  in_progress: 'bg-yellow-100 text-yellow-700',
  resolved: 'bg-green-100 text-green-700',
  closed: 'bg-gray-100 text-gray-700',
};

const TicketsPage = () => {
  const [tickets, setTickets] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [statusFilter, setStatusFilter] = useState('');
  const [selected, setSelected] = useState<any>(null);
  const [newStatus, setNewStatus] = useState('');
  const [comment, setComment] = useState('');

  const fetchTickets = () => {
    setLoading(true);
    const params: any = { page, limit: 20 };
    if (statusFilter) params.status = statusFilter;
    api.get('/services/tickets/admin/all', { params }).then(({ data }) => {
      setTickets(data.data);
      setTotalPages(data.meta?.totalPages || 1);
    }).catch(() => toast.error('Failed to load tickets')).finally(() => setLoading(false));
  };

  useEffect(() => { fetchTickets(); }, [page, statusFilter]);

  const handleStatusUpdate = async () => {
    if (!selected || !newStatus) return;
    try {
      await api.put(`/services/tickets/${selected._id}/status`, { status: newStatus });
      toast.success('Status updated');
      setSelected(null);
      fetchTickets();
    } catch (err: any) {
      toast.error(err.response?.data?.message || 'Failed to update');
    }
  };

  const handleAddComment = async () => {
    if (!selected || !comment.trim()) return;
    try {
      await api.post(`/services/tickets/${selected._id}/comments`, { content: comment });
      toast.success('Comment added');
      setComment('');
      fetchTickets();
    } catch {
      toast.error('Failed to add comment');
    }
  };

  return (
    <>
      <Helmet><title>Service Tickets | Admin</title></Helmet>

      <div className="space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <h1 className="text-2xl font-bold text-gray-900">Service Tickets</h1>
          <select value={statusFilter} onChange={(e) => { setStatusFilter(e.target.value); setPage(1); }} className="input-field w-auto">
            <option value="">All Status</option>
            <option value="open">Open</option>
            <option value="in_progress">In Progress</option>
            <option value="resolved">Resolved</option>
            <option value="closed">Closed</option>
          </select>
        </div>

        {loading ? <Loading /> : tickets.length === 0 ? (
          <p className="text-gray-500 text-center py-12">No tickets found.</p>
        ) : (
          <div className="card overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead className="bg-gray-50 text-gray-500 text-left">
                  <tr>
                    <th className="px-5 py-3 font-medium">Ticket #</th>
                    <th className="px-5 py-3 font-medium">Subject</th>
                    <th className="px-5 py-3 font-medium">Customer</th>
                    <th className="px-5 py-3 font-medium">Priority</th>
                    <th className="px-5 py-3 font-medium">Status</th>
                    <th className="px-5 py-3 font-medium">Date</th>
                    <th className="px-5 py-3 font-medium">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {tickets.map((t) => (
                    <tr key={t._id} className="hover:bg-gray-50">
                      <td className="px-5 py-3 font-medium text-gray-900">{t.ticketNumber}</td>
                      <td className="px-5 py-3 text-gray-700 max-w-xs truncate">{t.subject}</td>
                      <td className="px-5 py-3 text-gray-600">{t.user?.name || 'N/A'}</td>
                      <td className="px-5 py-3">
                        <span className={`badge ${t.priority === 'high' ? 'bg-red-100 text-red-700' : t.priority === 'medium' ? 'bg-yellow-100 text-yellow-700' : 'bg-green-100 text-green-700'}`}>
                          {t.priority}
                        </span>
                      </td>
                      <td className="px-5 py-3">
                        <span className={`badge ${statusColors[t.status] || 'bg-gray-100 text-gray-700'}`}>{t.status.replace('_', ' ')}</span>
                      </td>
                      <td className="px-5 py-3 text-gray-500">{new Date(t.createdAt).toLocaleDateString('en-IN')}</td>
                      <td className="px-5 py-3">
                        <button onClick={() => { setSelected(t); setNewStatus(t.status); }} className="text-primary-600 hover:underline">
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
          <div className="relative bg-white rounded-xl shadow-xl max-w-md w-full z-10 p-6 max-h-[80vh] overflow-y-auto">
            <h3 className="text-lg font-semibold text-gray-900 mb-1">Ticket #{selected.ticketNumber}</h3>
            <p className="text-sm text-gray-600 mb-4">{selected.subject}</p>
            <p className="text-sm text-gray-700 mb-4 whitespace-pre-line">{selected.description}</p>

            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-1">Update Status</label>
              <div className="flex gap-2">
                <select value={newStatus} onChange={(e) => setNewStatus(e.target.value)} className="input-field">
                  <option value="open">Open</option>
                  <option value="in_progress">In Progress</option>
                  <option value="resolved">Resolved</option>
                  <option value="closed">Closed</option>
                </select>
                <button onClick={handleStatusUpdate} className="btn-primary btn-sm">Update</button>
              </div>
            </div>

            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-1">Add Comment</label>
              <textarea value={comment} onChange={(e) => setComment(e.target.value)} rows={2} className="input-field mb-2" placeholder="Write a comment..." />
              <button onClick={handleAddComment} className="btn-secondary btn-sm">Add Comment</button>
            </div>

            {selected.comments?.length > 0 && (
              <div className="border-t pt-4 space-y-3">
                <p className="text-sm font-medium text-gray-700">Comments</p>
                {selected.comments.map((c: any, i: number) => (
                  <div key={i} className="bg-gray-50 rounded-lg p-3 text-sm">
                    <p className="font-medium text-gray-900">{c.user?.name || 'System'}</p>
                    <p className="text-gray-600">{c.content}</p>
                  </div>
                ))}
              </div>
            )}

            <button onClick={() => setSelected(null)} className="btn-secondary w-full mt-4">Close</button>
          </div>
        </div>
      )}
    </>
  );
};

export default TicketsPage;
