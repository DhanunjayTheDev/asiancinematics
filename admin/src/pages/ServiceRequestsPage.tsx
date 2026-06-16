import { useEffect, useState } from 'react';
import { Helmet } from 'react-helmet-async';
import toast from 'react-hot-toast';
import { FiX, FiEye } from 'react-icons/fi';
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

const paymentStatusConfig: Record<string, { color: string; bg: string; label: string }> = {
  pending: { color: 'text-gray-400', bg: 'bg-gray-400/10 border-gray-400/30', label: 'Pending' },
  submitted: { color: 'text-yellow-400', bg: 'bg-yellow-400/10 border-yellow-400/30', label: 'Submitted' },
  verified: { color: 'text-green-400', bg: 'bg-green-400/10 border-green-400/30', label: 'Verified' },
  rejected: { color: 'text-red-400', bg: 'bg-red-400/10 border-red-400/30', label: 'Rejected' },
};

const ServiceRequestsPage = () => {
  const [requests, setRequests] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [selected, setSelected] = useState<any>(null);
  const [newStatus, setNewStatus] = useState('');
  const [newPaymentStatus, setNewPaymentStatus] = useState('');
  const [assignedTo, setAssignedTo] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');
  const [showModal, setShowModal] = useState(false);
  const [showScreenshot, setShowScreenshot] = useState(false);
  const [updating, setUpdating] = useState(false);
  const [staffList, setStaffList] = useState<any[]>([]);

  useEffect(() => {
    api.get('/registrations/staff')
      .then(({ data }) => setStaffList(data.data || []))
      .catch(() => {});
  }, []);

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

  useEffect(() => { setPage(1); }, [filterStatus]);
  useEffect(() => { fetchRequests(); }, [page, filterStatus]);

  const openModal = (req: any) => {
    setSelected(req);
    setNewStatus(req.status);
    setNewPaymentStatus(req.paymentStatus || 'pending');
    setAssignedTo(req.assignedTo?._id || req.assignedTo || '');
    setShowScreenshot(false);
    setShowModal(true);
  };

  const handleUpdate = async () => {
    if (!selected) return;
    setUpdating(true);
    try {
      await api.put(`/service-requests/${selected._id}/status`, {
        status: newStatus,
        paymentStatus: newPaymentStatus,
        ...(assignedTo ? { assignedTo } : {}),
      });
      toast.success('Updated successfully');
      setShowModal(false);
      fetchRequests();
    } catch {
      toast.error('Failed to update');
    } finally {
      setUpdating(false);
    }
  };

  if (loading && requests.length === 0) return <Loading />;

  return (
    <>
      <Helmet><title>Service Requests | Admin</title></Helmet>

      <div className="space-y-6">
        {/* Header */}
        <div>
          <h1 className="text-2xl font-bold text-white">Service Requests</h1>
          <p className="text-sm text-gray-400 mt-1">{requests.length} requests loaded</p>
        </div>

        {/* Filter buttons */}
        <div className="flex gap-2 flex-wrap">
          {['all', 'new', 'contacted', 'qualified', 'proposal_sent', 'converted', 'closed'].map(s => (
            <button
              key={s}
              onClick={() => setFilterStatus(s)}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition ${
                filterStatus === s ? 'bg-blue-600 text-white' : 'bg-gray-800 text-gray-300 hover:bg-gray-700'
              }`}
            >
              {s === 'all' ? 'All' : statusConfig[s]?.label || s}
            </button>
          ))}
        </div>

        {/* Table */}
        <div className="bg-gray-900 border border-gray-800 rounded-lg overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-gray-800 bg-gray-800/50">
                <th className="px-4 py-3 text-left font-semibold text-gray-300">#</th>
                <th className="px-4 py-3 text-left font-semibold text-gray-300">Name / Contact</th>
                <th className="px-4 py-3 text-left font-semibold text-gray-300">Form Type</th>
                <th className="px-4 py-3 text-left font-semibold text-gray-300">System</th>
                <th className="px-4 py-3 text-left font-semibold text-gray-300">Service Type</th>
                <th className="px-4 py-3 text-left font-semibold text-gray-300">Amount</th>
                <th className="px-4 py-3 text-left font-semibold text-gray-300">Payment</th>
                <th className="px-4 py-3 text-left font-semibold text-gray-300">Status</th>
                <th className="px-4 py-3 text-left font-semibold text-gray-300">Assigned</th>
                <th className="px-4 py-3 text-left font-semibold text-gray-300">Date</th>
                <th className="px-4 py-3 text-left font-semibold text-gray-300">Action</th>
              </tr>
            </thead>
            <tbody>
              {requests.length === 0 ? (
                <tr>
                  <td colSpan={10} className="px-6 py-10 text-center text-gray-400">No service requests found</td>
                </tr>
              ) : (
                requests.map((r, idx) => {
                  const ps = paymentStatusConfig[r.paymentStatus] || paymentStatusConfig.pending;
                  const ss = statusConfig[r.status] || statusConfig.new;
                  const needsVerify = r.paymentStatus === 'submitted';
                  return (
                    <tr key={r._id} className={`border-b border-gray-800 transition ${needsVerify ? 'bg-yellow-500/5' : 'hover:bg-gray-800/50'}`}>
                      <td className="px-4 py-3 text-gray-400 text-xs">{(page - 1) * 20 + idx + 1}</td>
                      <td className="px-4 py-3">
                        <div className="text-white font-medium">{r.name}</div>
                        <div className="text-xs text-gray-400">{r.contact}</div>
                      </td>
                      <td className="px-4 py-3">
                        <span className="px-2 py-1 bg-blue-500/10 border border-blue-500/30 rounded text-xs text-blue-400 capitalize">
                          {r.formType || 'legacy'}
                        </span>
                      </td>
                      <td className="px-4 py-3 text-gray-300 text-xs">{r.systemType || r.product || '—'}</td>
                      <td className="px-4 py-3 text-gray-300 text-xs">{r.serviceRequestType || '—'}</td>
                      <td className="px-4 py-3 text-yellow-400 font-medium text-xs">
                        {r.serviceAmount ? `₹${r.serviceAmount}` : '—'}
                      </td>
                      <td className="px-4 py-3">
                        <span className={`inline-block px-2 py-1 rounded-full text-xs font-medium border ${ps.bg} ${ps.color}`}>
                          {ps.label}
                        </span>
                        {needsVerify && <span className="ml-1 text-xs text-yellow-400">⚡</span>}
                      </td>
                      <td className="px-4 py-3">
                        <span className={`inline-block px-2 py-1 rounded-full text-xs font-medium border ${ss.bg} ${ss.color}`}>
                          {ss.label}
                        </span>
                      </td>
                      <td className="px-4 py-3 text-gray-300 text-xs">{r.assignedTo?.name || <span className="text-gray-600">—</span>}</td>
                      <td className="px-4 py-3 text-gray-400 text-xs">{new Date(r.createdAt).toLocaleDateString()}</td>
                      <td className="px-4 py-3">
                        <button onClick={() => openModal(r)} className="flex items-center gap-1 text-blue-400 hover:text-blue-300 text-sm font-medium">
                          <FiEye className="w-3.5 h-3.5" /> View
                        </button>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>

        <Pagination page={page} totalPages={totalPages} onPageChange={setPage} />
      </div>

      {/* Detail Modal rendered outside space-y-6 so fixed inset-0 covers full viewport */}
      {showModal && selected && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur z-50 flex items-center justify-center p-4">
            <div className="bg-gray-900 border border-gray-700 rounded-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
              <div className="flex justify-between items-center px-6 py-4 border-b border-gray-700 sticky top-0 bg-gray-900">
                <div>
                  <h2 className="text-lg font-bold text-white">{selected.name}</h2>
                  <p className="text-sm text-gray-400">{selected.contact} · {selected.formType || 'legacy'}</p>
                </div>
                <button onClick={() => setShowModal(false)} className="text-gray-400 hover:text-white">
                  <FiX className="w-5 h-5" />
                </button>
              </div>

              <div className="p-6 space-y-5">
                {/* Customer Info */}
                <div className="grid grid-cols-2 gap-4 text-sm">
                  {selected.state && <div><p className="text-gray-400 text-xs">State</p><p className="text-white">{selected.state}</p></div>}
                  {selected.district && <div><p className="text-gray-400 text-xs">District</p><p className="text-white">{selected.district}</p></div>}
                  {selected.address && <div className="col-span-2"><p className="text-gray-400 text-xs">Address</p><p className="text-white">{selected.address}</p></div>}
                  {selected.categories?.length > 0 && (
                    <div className="col-span-2">
                      <p className="text-gray-400 text-xs mb-1">Categories</p>
                      <div className="flex flex-wrap gap-1">
                        {selected.categories.map((c: string) => (
                          <span key={c} className="px-2 py-0.5 bg-blue-500/10 border border-blue-500/30 rounded text-xs text-blue-400">{c}</span>
                        ))}
                      </div>
                    </div>
                  )}
                  {selected.systemType && <div><p className="text-gray-400 text-xs">System Type</p><p className="text-white">{selected.systemType}</p></div>}
                  {selected.serviceRequestType && <div><p className="text-gray-400 text-xs">Service Type</p><p className="text-white">{selected.serviceRequestType} ₹{selected.serviceAmount}</p></div>}
                  {selected.startDate && <div><p className="text-gray-400 text-xs">Start Date</p><p className="text-white">{new Date(selected.startDate).toLocaleDateString()}</p></div>}
                  {selected.needsDiscussion && <div><p className="text-gray-400 text-xs">Discussion</p><p className="text-yellow-400 font-medium">Yes Team discussion needed</p></div>}
                  {selected.specs && <div className="col-span-2"><p className="text-gray-400 text-xs">Specifications</p><p className="text-white">{selected.specs}</p></div>}
                </div>

                {/* Payment Info */}
                {(selected.utrNumber || selected.paymentScreenshot) && (
                  <div className="bg-yellow-500/10 border border-yellow-500/30 rounded-xl p-4 space-y-3">
                    <h3 className="text-yellow-400 font-semibold">💳 Payment Details</h3>
                    {selected.utrNumber && (
                      <div>
                        <p className="text-gray-400 text-xs">UTR / Transaction ID</p>
                        <p className="text-white font-mono">{selected.utrNumber}</p>
                      </div>
                    )}
                    {selected.paymentScreenshot && (
                      <div>
                        <button
                          onClick={() => setShowScreenshot(v => !v)}
                          className="text-sm text-blue-400 hover:text-blue-300 underline"
                        >
                          {showScreenshot ? 'Hide' : 'View'} Payment Screenshot
                        </button>
                        {showScreenshot && (
                          <img src={selected.paymentScreenshot} alt="Payment" className="mt-2 max-w-xs rounded-lg border border-gray-600" />
                        )}
                      </div>
                    )}
                  </div>
                )}

                {/* Update Status */}
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-1">Request Status</label>
                    <select
                      value={newStatus}
                      onChange={e => setNewStatus(e.target.value)}
                      className="w-full bg-gray-800 border border-gray-600 rounded-lg px-3 py-2 text-white focus:outline-none focus:border-blue-500"
                    >
                      {Object.entries(statusConfig).map(([key, val]) => (
                        <option key={key} value={key}>{val.label}</option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-1">Payment Status</label>
                    <select
                      value={newPaymentStatus}
                      onChange={e => setNewPaymentStatus(e.target.value)}
                      className="w-full bg-gray-800 border border-gray-600 rounded-lg px-3 py-2 text-white focus:outline-none focus:border-blue-500"
                    >
                      {Object.entries(paymentStatusConfig).map(([key, val]) => (
                        <option key={key} value={key}>{val.label}</option>
                      ))}
                    </select>
                  </div>
                </div>

                {/* Assign To */}
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-1">Assign To Staff</label>
                  <select
                    value={assignedTo}
                    onChange={e => setAssignedTo(e.target.value)}
                    className="w-full bg-gray-800 border border-gray-600 rounded-lg px-3 py-2 text-white focus:outline-none focus:border-blue-500"
                  >
                    <option value="">Unassigned —</option>
                    {staffList.map(s => (
                      <option key={s._id} value={s._id}>{s.name} ({s.role})</option>
                    ))}
                  </select>
                  {selected.assignedTo && (
                    <p className="text-xs text-gray-500 mt-1">
                      Currently: {selected.assignedTo?.name || 'Assigned'}
                    </p>
                  )}
                </div>

                <div className="flex gap-3">
                  <button onClick={() => setShowModal(false)} className="flex-1 bg-gray-700 hover:bg-gray-600 text-white font-medium py-2.5 rounded-lg transition">
                    Cancel
                  </button>
                  <button onClick={handleUpdate} disabled={updating} className="flex-1 bg-blue-600 hover:bg-blue-700 disabled:opacity-60 text-white font-medium py-2.5 rounded-lg transition">
                    {updating ? 'Saving...' : 'Save Changes'}
                  </button>
                </div>
              </div>
            </div>
          </div>
      )}
    </>
  );
};

export default ServiceRequestsPage;
