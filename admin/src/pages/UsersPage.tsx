import { useEffect, useState } from 'react';
import { Helmet } from 'react-helmet-async';
import { toast } from 'react-hot-toast';
import api from '../lib/api';
import { cacheManager } from '../lib/cache';
import Loading from '../components/Loading';
import Pagination from '../components/Pagination';
import CustomSelect from '../components/CustomSelect';
import Button from '../components/Button';

const roleColors: Record<string, string> = {
  customer: 'bg-gray-600/20 text-gray-300',
  super_admin: 'bg-red-600/20 text-red-300',
  support: 'bg-blue-600/20 text-blue-300',
  freelancer: 'bg-purple-600/20 text-purple-300',
  employee: 'bg-green-600/20 text-green-300',
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
    api.get('/auth/users', { params }).then(({ data }) => {
      setUsers(data.data);
      setTotalPages(data.meta?.totalPages || 1);
    }).catch(() => toast.error('Failed to load users')).finally(() => setLoading(false));
  };

  useEffect(() => { fetchUsers(); }, [page, search]);

  const handleToggleActive = async (id: string) => {
    try {
      await api.put(`/auth/users/${id}/toggle-active`);
      toast.success('User status updated');
      fetchUsers();
    } catch {
      toast.error('Failed to update');
    }
  };

  const handleRoleChange = async (id: string, role: string) => {
    try {
      await api.put(`/auth/users/${id}/role`, { role });
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
          <h1 className="text-2xl font-bold text-white">Users</h1>
          <form onSubmit={(e) => { e.preventDefault(); setPage(1); }} className="flex gap-2">
            <input type="text" value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Search name/email..." className="w-full px-4 py-2 bg-black border border-blue-500/20 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-blue-500 transition w-48" />
            <Button type="submit" variant="secondary" size="sm">Search</Button>
          </form>
        </div>

        {loading ? <Loading /> : users.length === 0 ? (
          <p className="text-gray-400 text-center py-12">No users found.</p>
        ) : (
          <div className="bg-gray-900 rounded-2xl border border-blue-500/20 shadow-sm overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead className="bg-black text-gray-400 text-left">
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
                <tbody className="divide-y divide-blue-500/10">
                  {users.map((u) => (
                    <tr key={u._id} className="hover:bg-blue-500/10">
                      <td className="px-5 py-3 font-medium text-white">{u.name}</td>
                      <td className="px-5 py-3 text-gray-300">{u.email}</td>
                      <td className="px-5 py-3 text-gray-300">{u.phone}</td>
                      <td className="px-5 py-3">
                        <div className="w-40">
                          <CustomSelect
                            value={u.role}
                            onChange={(value) => handleRoleChange(u._id, String(value))}
                            options={[
                              { value: 'customer', label: 'Customer' },
                              { value: 'super_admin', label: 'Super Admin' },
                              { value: 'support', label: 'Support' },
                              { value: 'freelancer', label: 'Freelancer' },
                              { value: 'employee', label: 'Employee' },
                            ]}
                          />
                        </div>
                      </td>
                      <td className="px-5 py-3">
                        <span className={`badge ${u.isActive ? 'bg-green-600/20 text-green-300' : 'bg-red-600/20 text-red-300'}`}>
                          {u.isActive ? 'Active' : 'Inactive'}
                        </span>
                      </td>
                      <td className="px-5 py-3 text-gray-400">{new Date(u.createdAt).toLocaleDateString('en-IN')}</td>
                      <td className="px-5 py-3">
                        <Button
                          onClick={() => handleToggleActive(u._id)}
                          variant={u.isActive ? 'danger' : 'success'}
                          size="sm"
                        >
                          {u.isActive ? 'Deactivate' : 'Activate'}
                        </Button>
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
