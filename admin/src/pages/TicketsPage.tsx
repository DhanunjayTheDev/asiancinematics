import { useEffect, useState } from 'react';
import { Helmet } from 'react-helmet-async';
import { toast } from 'react-hot-toast';
import api from '../lib/api';
import { cacheManager } from '../lib/cache';
import Loading from '../components/Loading';
import Pagination from '../components/Pagination';
import CustomSelect from '../components/CustomSelect';
import Button from '../components/Button';

const statusColors: Record<string, string> = {
  open: 'bg-blue-600/20 text-blue-300',
  in_progress: 'bg-yellow-600/20 text-yellow-300',
  resolved: 'bg-green-600/20 text-green-300',
  closed: 'bg-gray-600/20 text-gray-300',
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
    api.get('/services/tickets/all', { params }).then(({ data }) => {
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
      await api.post(`/services/tickets/${selected._id}/comments`, { message: comment });
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
          <h1 className="text-2xl font-bold text-white">Service Tickets</h1>
          <div className="w-40">
            <CustomSelect
              value={statusFilter}
              onChange={(value) => { setStatusFilter(String(value)); setPage(1); }}
              options={[
                { value: '', label: 'All Status' },
                { value: 'open', label: 'Open' },
                { value: 'in_progress', label: 'In Progress' },
                { value: 'resolved', label: 'Resolved' },
                { value: 'closed', label: 'Closed' },
              ]}
            />
          </div>
        </div>

        {loading ? <Loading /> : tickets.length === 0 ? (
          <p className="text-gray-400 text-center py-12">No tickets found.</p>
        ) : (
          <div className="bg-gray-900 rounded-2xl border border-blue-500/20 shadow-sm overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead className="bg-black text-gray-400 text-left">
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
                <tbody className="divide-y divide-blue-500/10">
                  {tickets.map((t) => (
                    <tr key={t._id} className="hover:bg-blue-500/10">
                      <td className="px-5 py-3 font-medium text-white">{t.ticketNumber}</td>
                      <td className="px-5 py-3 text-gray-400 max-w-xs truncate">{t.subject}</td>
                      <td className="px-5 py-3 text-gray-300">{t.user?.name || 'N/A'}</td>
                      <td className="px-5 py-3">
                        <span className={`badge ${t.priority === 'high' ? 'bg-red-600/20 text-red-300' : t.priority === 'medium' ? 'bg-yellow-600/20 text-yellow-300' : 'bg-green-600/20 text-green-300'}`}>
                          {t.priority}
                        </span>
                      </td>
                      <td className="px-5 py-3">
                        <span className={`badge ${statusColors[t.status] || 'bg-gray-800 text-gray-300'}`}>{t.status.replace('_', ' ')}</span>
                      </td>
                      <td className="px-5 py-3 text-gray-400">{new Date(t.createdAt).toLocaleDateString('en-IN')}</td>
                      <td className="px-5 py-3">
                        <button onClick={() => { setSelected(t); setNewStatus(t.status); }} className="text-blue-400 hover:text-blue-300">
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
          <div className="relative bg-gray-900 rounded-xl shadow-xl max-w-md w-full z-10 p-6 max-h-[80vh] overflow-y-auto border border-blue-500/20">
            <h3 className="text-lg font-semibold text-white mb-1">Ticket #{selected.ticketNumber}</h3>
            <p className="text-sm text-gray-400 mb-4">{selected.subject}</p>
            <p className="text-sm text-gray-300 mb-4 whitespace-pre-line">{selected.description}</p>

            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-300 mb-1">Update Status</label>
              <div className="flex gap-2">
                <div className="flex-1">
                  <CustomSelect
                    value={newStatus}
                    onChange={(value) => setNewStatus(String(value))}
                    options={[
                      { value: 'open', label: 'Open' },
                      { value: 'in_progress', label: 'In Progress' },
                      { value: 'resolved', label: 'Resolved' },
                      { value: 'closed', label: 'Closed' },
                    ]}
                  />
                </div>
                <Button onClick={handleStatusUpdate}>Update</Button>
              </div>
            </div>

            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-300 mb-1">Add Comment</label>
              <textarea value={comment} onChange={(e) => setComment(e.target.value)} rows={2} className="w-full px-4 py-2 bg-black border border-blue-500/20 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-blue-500 transition mb-2" placeholder="Write a comment..." />
              <Button onClick={handleAddComment} variant="secondary">Add Comment</Button>
            </div>

            {selected.comments?.length > 0 && (
              <div className="border-t border-blue-500/20 pt-4 space-y-3">
                <p className="text-sm font-medium text-gray-300">Comments</p>
                {selected.comments.map((c: any, i: number) => (
                  <div key={i} className="bg-black rounded-lg p-3 text-sm border border-blue-500/10">
                    <p className="font-medium text-white">{c.user?.name || 'System'}</p>
                    <p className="text-gray-300">{c.content}</p>
                  </div>
                ))}
              </div>
            )}

            <Button onClick={() => setSelected(null)} variant="secondary" className="w-full">Close</Button>
          </div>
        </div>
      )}
    </>
  );
};

export default TicketsPage;
