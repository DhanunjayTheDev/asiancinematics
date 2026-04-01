import { useEffect, useState } from 'react';
import { Helmet } from 'react-helmet-async';
import { toast } from 'react-hot-toast';
import api from '../lib/api';
import Loading from '../components/Loading';
import Pagination from '../components/Pagination';

const statusColors: Record<string, string> = {
  new: 'bg-blue-100 text-blue-700',
  contacted: 'bg-yellow-100 text-yellow-700',
  qualified: 'bg-indigo-100 text-indigo-700',
  proposal_sent: 'bg-purple-100 text-purple-700',
  converted: 'bg-green-100 text-green-700',
  closed: 'bg-gray-100 text-gray-700',
};

const InquiriesPage = () => {
  const [inquiries, setInquiries] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [selected, setSelected] = useState<any>(null);
  const [newStatus, setNewStatus] = useState('');

  const fetchInquiries = () => {
    setLoading(true);
    api.get('/inquiries/admin', { params: { page, limit: 20 } }).then(({ data }) => {
      setInquiries(data.data);
      setTotalPages(data.meta?.totalPages || 1);
    }).catch(() => toast.error('Failed to load inquiries')).finally(() => setLoading(false));
  };

  useEffect(() => { fetchInquiries(); }, [page]);

  const handleStatusUpdate = async () => {
    if (!selected || !newStatus) return;
    try {
      await api.put(`/inquiries/${selected._id}`, { status: newStatus });
      toast.success('Status updated');
      setSelected(null);
      fetchInquiries();
    } catch (err: any) {
      toast.error(err.response?.data?.message || 'Failed to update');
    }
  };

  return (
    <>
      <Helmet><title>Inquiries | Admin</title></Helmet>

      <div className="space-y-4">
        <h1 className="text-2xl font-bold text-gray-900">Inquiries / Leads</h1>

        {loading ? <Loading /> : inquiries.length === 0 ? (
          <p className="text-gray-500 text-center py-12">No inquiries.</p>
        ) : (
          <div className="card overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead className="bg-gray-50 text-gray-500 text-left">
                  <tr>
                    <th className="px-5 py-3 font-medium">Name</th>
                    <th className="px-5 py-3 font-medium">Email</th>
                    <th className="px-5 py-3 font-medium">Phone</th>
                    <th className="px-5 py-3 font-medium">Subject</th>
                    <th className="px-5 py-3 font-medium">Budget</th>
                    <th className="px-5 py-3 font-medium">Status</th>
                    <th className="px-5 py-3 font-medium">Date</th>
                    <th className="px-5 py-3 font-medium">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {inquiries.map((inq) => (
                    <tr key={inq._id} className="hover:bg-gray-50">
                      <td className="px-5 py-3 font-medium text-gray-900">{inq.name}</td>
                      <td className="px-5 py-3 text-gray-600">{inq.email}</td>
                      <td className="px-5 py-3 text-gray-600">{inq.phone}</td>
                      <td className="px-5 py-3 text-gray-700 max-w-xs truncate">{inq.subject}</td>
                      <td className="px-5 py-3 text-gray-600">{inq.budget ? `₹${inq.budget.toLocaleString()}` : '—'}</td>
                      <td className="px-5 py-3">
                        <span className={`badge ${statusColors[inq.status] || 'bg-gray-100 text-gray-700'}`}>{inq.status.replace('_', ' ')}</span>
                      </td>
                      <td className="px-5 py-3 text-gray-500">{new Date(inq.createdAt).toLocaleDateString('en-IN')}</td>
                      <td className="px-5 py-3">
                        <button onClick={() => { setSelected(inq); setNewStatus(inq.status); }} className="text-primary-600 hover:underline">
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
            <h3 className="text-lg font-semibold text-gray-900 mb-3">Inquiry Details</h3>
            <div className="space-y-2 text-sm mb-4">
              <p><span className="font-medium text-gray-700">Name:</span> {selected.name}</p>
              <p><span className="font-medium text-gray-700">Email:</span> {selected.email}</p>
              <p><span className="font-medium text-gray-700">Phone:</span> {selected.phone}</p>
              <p><span className="font-medium text-gray-700">Subject:</span> {selected.subject}</p>
              {selected.budget && <p><span className="font-medium text-gray-700">Budget:</span> ₹{selected.budget.toLocaleString()}</p>}
              <p><span className="font-medium text-gray-700">Source:</span> {selected.source}</p>
              <p className="whitespace-pre-line"><span className="font-medium text-gray-700">Requirements:</span><br />{selected.requirements}</p>
            </div>

            <label className="block text-sm font-medium text-gray-700 mb-1">Update Status</label>
            <select value={newStatus} onChange={(e) => setNewStatus(e.target.value)} className="input-field mb-4">
              <option value="new">New</option>
              <option value="contacted">Contacted</option>
              <option value="qualified">Qualified</option>
              <option value="proposal_sent">Proposal Sent</option>
              <option value="converted">Converted</option>
              <option value="closed">Closed</option>
            </select>
            <div className="flex gap-3">
              <button onClick={handleStatusUpdate} className="btn-primary flex-1">Update</button>
              <button onClick={() => setSelected(null)} className="btn-secondary flex-1">Close</button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default InquiriesPage;
