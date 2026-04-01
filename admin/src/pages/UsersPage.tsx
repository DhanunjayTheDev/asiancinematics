import { useEffect, useState } from 'react';
import { Helmet } from 'react-helmet-async';
import { toast } from 'react-hot-toast';
import api from '../lib/api';
import Loading from '../components/Loading';
import Pagination from '../components/Pagination';

const roleColors: Record<string, string> = {
  customer: 'bg-gray-100 text-gray-700',
  super_admin: 'bg-red-100 text-red-700',
  support: 'bg-blue-100 text-blue-700',
  freelancer: 'bg-purple-100 text-purple-700',
  employee: 'bg-green-100 text-green-700',
};

const UsersPage = () => {
  const [users, setUsers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [search, setSearch] = useState('');

  const fetchUsers = () => {
    setLoading(true);
    const params: any = { page, limit: 20 };
    if (search) params.search = search;
    api.get('/auth/admin/users', { params }).then(({ data }) => {
      setUsers(data.data);
      setTotalPages(data.meta?.totalPages || 1);
    }).catch(() => toast.error('Failed to load users')).finally(() => setLoading(false));
  };

  useEffect(() => { fetchUsers(); }, [page, search]);

  const handleToggleActive = async (id: string) => {
    try {
      await api.put(`/auth/admin/users/${id}/toggle-active`);
      toast.success('User status updated');
      fetchUsers();
    } catch {
      toast.error('Failed to update');
    }
  };

  const handleRoleChange = async (id: string, role: string) => {
    try {
      await api.put(`/auth/admin/users/${id}/role`, { role });
      toast.success('Role updated');
      fetchUsers();
    } catch (err: any) {
      toast.error(err.response?.data?.message || 'Failed to update role');
    }
  };

  return (
    <>
      <Helmet><title>Users | Admin</title></Helmet>

      <div className="space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <h1 className="text-2xl font-bold text-gray-900">Users</h1>
          <form onSubmit={(e) => { e.preventDefault(); setPage(1); }} className="flex gap-2">
            <input type="text" value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Search name/email..." className="input-field w-48" />
            <button type="submit" className="btn-secondary btn-sm">Search</button>
          </form>
        </div>

        {loading ? <Loading /> : users.length === 0 ? (
          <p className="text-gray-500 text-center py-12">No users found.</p>
        ) : (
          <div className="card overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead className="bg-gray-50 text-gray-500 text-left">
                  <tr>
                    <th className="px-5 py-3 font-medium">Name</th>
                    <th className="px-5 py-3 font-medium">Email</th>
                    <th className="px-5 py-3 font-medium">Phone</th>
                    <th className="px-5 py-3 font-medium">Role</th>
                    <th className="px-5 py-3 font-medium">Status</th>
                    <th className="px-5 py-3 font-medium">Joined</th>
                    <th className="px-5 py-3 font-medium">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {users.map((u) => (
                    <tr key={u._id} className="hover:bg-gray-50">
                      <td className="px-5 py-3 font-medium text-gray-900">{u.name}</td>
                      <td className="px-5 py-3 text-gray-600">{u.email}</td>
                      <td className="px-5 py-3 text-gray-600">{u.phone}</td>
                      <td className="px-5 py-3">
                        <select
                          value={u.role}
                          onChange={(e) => handleRoleChange(u._id, e.target.value)}
                          className="text-xs border rounded px-2 py-1"
                        >
                          <option value="customer">Customer</option>
                          <option value="super_admin">Super Admin</option>
                          <option value="support">Support</option>
                          <option value="freelancer">Freelancer</option>
                          <option value="employee">Employee</option>
                        </select>
                      </td>
                      <td className="px-5 py-3">
                        <span className={`badge ${u.isActive ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                          {u.isActive ? 'Active' : 'Inactive'}
                        </span>
                      </td>
                      <td className="px-5 py-3 text-gray-500">{new Date(u.createdAt).toLocaleDateString('en-IN')}</td>
                      <td className="px-5 py-3">
                        <button onClick={() => handleToggleActive(u._id)} className={`text-sm hover:underline ${u.isActive ? 'text-red-600' : 'text-green-600'}`}>
                          {u.isActive ? 'Deactivate' : 'Activate'}
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
    </>
  );
};

export default UsersPage;
