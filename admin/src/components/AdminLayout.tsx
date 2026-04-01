import { useState } from 'react';
import { NavLink, Outlet, useNavigate } from 'react-router-dom';
import { useAuthStore } from '../store/authStore';
import {
  HiOutlineViewGrid,
  HiOutlineShoppingCart,
  HiOutlineCube,
  HiOutlineTag,
  HiOutlineCog,
  HiOutlineUsers,
  HiOutlineClipboardList,
  HiOutlineCalendar,
  HiOutlineMail,
  HiOutlineChartBar,
  HiOutlineLogout,
  HiOutlineMenu,
  HiOutlineX,
} from 'react-icons/hi';

const navItems = [
  { to: '/dashboard', label: 'Dashboard', icon: HiOutlineViewGrid, roles: ['super_admin', 'support', 'employee'] },
  { to: '/orders', label: 'Orders', icon: HiOutlineShoppingCart, roles: ['super_admin', 'support', 'employee', 'freelancer'] },
  { to: '/products', label: 'Products', icon: HiOutlineCube, roles: ['super_admin', 'employee'] },
  { to: '/categories', label: 'Categories', icon: HiOutlineTag, roles: ['super_admin', 'employee'] },
  { to: '/services', label: 'Services', icon: HiOutlineCog, roles: ['super_admin', 'employee'] },
  { to: '/tickets', label: 'Tickets', icon: HiOutlineClipboardList, roles: ['super_admin', 'support', 'freelancer'] },
  { to: '/site-visits', label: 'Site Visits', icon: HiOutlineCalendar, roles: ['super_admin', 'support', 'employee'] },
  { to: '/inquiries', label: 'Inquiries', icon: HiOutlineMail, roles: ['super_admin', 'support'] },
  { to: '/users', label: 'Users', icon: HiOutlineUsers, roles: ['super_admin'] },
  { to: '/reports', label: 'Reports', icon: HiOutlineChartBar, roles: ['super_admin'] },
];

const AdminLayout = () => {
  const { user, logout } = useAuthStore();
  const navigate = useNavigate();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const filteredNav = navItems.filter((item) => user && item.roles.includes(user.role));

  const SidebarContent = () => (
    <div className="flex flex-col h-full">
      <div className="p-5 border-b border-gray-200">
        <h1 className="text-lg font-bold text-primary-600">Asian Cinematics</h1>
        <p className="text-xs text-gray-500 mt-0.5">Admin Panel</p>
      </div>

      <nav className="flex-1 p-3 space-y-1 overflow-y-auto">
        {filteredNav.map((item) => (
          <NavLink
            key={item.to}
            to={item.to}
            onClick={() => setSidebarOpen(false)}
            className={({ isActive }) =>
              `flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition ${
                isActive
                  ? 'bg-primary-50 text-primary-700'
                  : 'text-gray-600 hover:bg-gray-100 hover:text-gray-900'
              }`
            }
          >
            <item.icon className="w-5 h-5 flex-shrink-0" />
            {item.label}
          </NavLink>
        ))}
      </nav>

      <div className="p-3 border-t border-gray-200">
        <div className="px-3 py-2 mb-2">
          <p className="text-sm font-medium text-gray-900 truncate">{user?.name}</p>
          <p className="text-xs text-gray-500 truncate">{user?.role.replace('_', ' ')}</p>
        </div>
        <button
          onClick={handleLogout}
          className="flex items-center gap-3 w-full px-3 py-2.5 rounded-lg text-sm font-medium text-red-600 hover:bg-red-50 transition"
        >
          <HiOutlineLogout className="w-5 h-5" />
          Sign Out
        </button>
      </div>
    </div>
  );

  return (
    <div className="flex h-screen bg-gray-50">
      {/* Desktop sidebar */}
      <aside className="hidden lg:flex lg:w-64 lg:flex-col bg-white border-r border-gray-200">
        <SidebarContent />
      </aside>

      {/* Mobile sidebar overlay */}
      {sidebarOpen && (
        <div className="fixed inset-0 z-40 lg:hidden">
          <div className="fixed inset-0 bg-black/30" onClick={() => setSidebarOpen(false)} />
          <aside className="fixed inset-y-0 left-0 w-64 bg-white z-50 shadow-xl">
            <SidebarContent />
          </aside>
        </div>
      )}

      {/* Main content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        <header className="bg-white border-b border-gray-200 px-4 lg:px-6 h-16 flex items-center justify-between lg:justify-end">
          <button onClick={() => setSidebarOpen(true)} className="lg:hidden p-2 -ml-2 text-gray-500 hover:text-gray-700">
            <HiOutlineMenu className="w-6 h-6" />
          </button>
          <div className="text-sm text-gray-500">
            {new Date().toLocaleDateString('en-IN', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
          </div>
        </header>

        <main className="flex-1 overflow-y-auto p-4 lg:p-6">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default AdminLayout;
