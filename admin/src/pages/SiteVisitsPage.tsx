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
  scheduled: 'bg-blue-600/20 text-blue-300',
  confirmed: 'bg-blue-600/20 text-blue-300',
  in_progress: 'bg-yellow-600/20 text-yellow-300',
  completed: 'bg-green-600/20 text-green-300',
  cancelled: 'bg-red-600/20 text-red-300',
};

const SiteVisitsPage = () => {
  const [visits, setVisits] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [selected, setSelected] = useState<any>(null);
  const [newStatus, setNewStatus] = useState('');
  const [assignTo, setAssignTo] = useState('');
  const [staffList, setStaffList] = useState<any[]>([]);

  const fetchVisits = () => {
    setLoading(true);
    api.get('/site-visits/all', { params: { page, limit: 20 } }).then(({ data }) => {
      setVisits(data.data);
      setTotalPages(data.meta?.totalPages || 1);
    }).catch(() => toast.error('Failed to load visits')).finally(() => setLoading(false));
  };

  const fetchStaff = () => {
    api.get('/auth/users', { params: { role: 'employee,freelancer', limit: 100 } }).then(({ data }) => {
      setStaffList(data.data || []);
    }).catch(() => {});
  };

  useEffect(() => { fetchVisits(); fetchStaff(); }, [page]);

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

  const handleAssign = async () => {
    if (!selected || !assignTo) return;
    try {
      await api.put(`/site-visits/${selected._id}/assign`, { assignedTo: assignTo });
      toast.success('Visit assigned successfully');
      setSelected(null);
      fetchVisits();
    } catch (err: any) {
      toast.error(err.response?.data?.message || 'Failed to assign');
    }
  };

  return (
    <>
      <Helmet><title>Site Visits | Admin</title></Helmet>

      <div className="space-y-4">
        <h1 className="text-2xl font-bold text-white">Site Visits</h1>

        {loading ? <Loading /> : visits.length === 0 ? (
          <p className="text-gray-400 text-center py-12">No site visits.</p>
        ) : (
          <div className="bg-gray-900 rounded-2xl border border-blue-500/20 shadow-sm overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead className="bg-black text-gray-400 text-left">
                  <tr>
                    <th className="px-5 py-3 font-medium">Customer</th>
                    <th className="px-5 py-3 font-medium">Date</th>
                    <th className="px-5 py-3 font-medium">Time Slot</th>
                    <th className="px-5 py-3 font-medium">Location</th>
                    <th className="px-5 py-3 font-medium">Status</th>
                    <th className="px-5 py-3 font-medium">Assigned To</th>
                    <th className="px-5 py-3 font-medium">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-blue-500/10">
                  {visits.map((v) => (
                    <tr key={v._id} className="hover:bg-blue-500/10">
                      <td className="px-5 py-3 font-medium text-white">{v.user?.name || 'N/A'}</td>
                      <td className="px-5 py-3 text-gray-300">{new Date(v.date).toLocaleDateString('en-IN')}</td>
                      <td className="px-5 py-3 text-gray-300">{v.timeSlot}</td>
                      <td className="px-5 py-3 text-gray-300">{v.location?.city}, {v.location?.state}</td>
                      <td className="px-5 py-3">
                        <span className={`badge ${statusColors[v.status] || 'bg-gray-800 text-gray-300'}`}>{v.status.replaceAll('_', ' ')}</span>
                      </td>
                      <td className="px-5 py-3 text-gray-300">
                        {v.assignedTo?.name || <span className="text-gray-500 italic">Unassigned</span>}
                      </td>
                      <td className="px-5 py-3">
                        <button onClick={() => { setSelected(v); setNewStatus(v.status); setAssignTo(v.assignedTo?._id || ''); }} className="text-blue-400 hover:text-blue-300">
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
          <div className="fixed inset-0 bg-black/60" onClick={() => setSelected(null)} />
          <div className="relative bg-gray-900 border border-blue-500/20 rounded-xl shadow-2xl max-w-md w-full z-10 p-6">
            <h3 className="text-xl font-semibold text-white mb-4">Manage Visit</h3>
            <div className="space-y-2 mb-4 pb-4 border-b border-blue-500/10">
              <p className="text-sm text-gray-300"><span className="text-gray-400">Customer:</span> {selected.user?.name}</p>
              <p className="text-sm text-gray-300"><span className="text-gray-400">Date:</span> {new Date(selected.date).toLocaleDateString('en-IN')}</p>
              <p className="text-sm text-gray-300"><span className="text-gray-400">Phone:</span> {selected.user?.phone || 'N/A'}</p>
              <p className="text-sm text-gray-300"><span className="text-gray-400">Location:</span> {selected.location?.address}, {selected.location?.city}</p>
              {selected.notes && <p className="text-sm text-gray-400 italic">Notes: {selected.notes}</p>}
            </div>

            <label className="block text-sm font-medium text-gray-200 mb-2">Status</label>
            <CustomSelect
              value={newStatus}
              onChange={(value) => setNewStatus(String(value))}
              options={[
                { value: 'scheduled', label: 'Scheduled' },
                { value: 'confirmed', label: 'Confirmed' },
                { value: 'in_progress', label: 'In Progress' },
                { value: 'completed', label: 'Completed' },
                { value: 'cancelled', label: 'Cancelled' },
              ]}
            />
            <Button onClick={handleStatusUpdate} className="w-full">Update Status</Button>

            <div className="border-t border-blue-500/10 mt-5 pt-5">
              <label className="block text-sm font-medium text-gray-200 mb-2">Assign to Employee / Freelancer</label>
              <CustomSelect
                value={assignTo}
                onChange={(value) => setAssignTo(String(value))}
                options={[
                  { value: '', label: '-- Select Staff --' },
                  ...staffList.map((s) => ({
                    value: s._id,
                    label: `${s.name} (${s.role})`,
                  })),
                ]}
              />
              <div className="flex gap-3 mt-4">
                <Button onClick={handleAssign} disabled={!assignTo}>Assign</Button>
                <Button onClick={() => setSelected(null)} variant="secondary">Close</Button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default SiteVisitsPage;
