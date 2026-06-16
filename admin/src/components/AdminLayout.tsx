import { useState, useRef } from 'react';
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
  HiOutlineOfficeBuilding,
  HiOutlinePhotograph,
  HiOutlineUserGroup,
  HiOutlineChatAlt2,
  HiOutlineSearch,
  HiOutlineTicket,
} from 'react-icons/hi';

const NAV_SECTIONS = [
  {
    label: 'Overview',
    items: [
      { to: '/dashboard', label: 'Dashboard', icon: HiOutlineViewGrid, roles: ['super_admin', 'support', 'employee'] },
      { to: '/reports', label: 'Reports', icon: HiOutlineChartBar, roles: ['super_admin'] },
    ],
  },
  {
    label: 'Commerce',
    items: [
      { to: '/orders', label: 'Orders', icon: HiOutlineShoppingCart, roles: ['super_admin', 'support', 'employee', 'freelancer'] },
      { to: '/products', label: 'Products', icon: HiOutlineCube, roles: ['super_admin', 'employee'] },
      { to: '/categories', label: 'Categories', icon: HiOutlineTag, roles: ['super_admin', 'employee'] },
    ],
  },
  {
    label: 'Catalog',
    items: [
      { to: '/services', label: 'Services', icon: HiOutlineCog, roles: ['super_admin', 'employee'] },
      { to: '/projects', label: 'Projects', icon: HiOutlinePhotograph, roles: ['super_admin', 'employee'] },
      { to: '/brands', label: 'Brands', icon: HiOutlineOfficeBuilding, roles: ['super_admin', 'employee'] },
      { to: '/partners', label: 'Partners', icon: HiOutlineUserGroup, roles: ['super_admin', 'support'] },
    ],
  },
  {
    label: 'Operations',
    items: [
      { to: '/tickets', label: 'Tickets', icon: HiOutlineClipboardList, roles: ['super_admin', 'support', 'freelancer'] },
      { to: '/site-visits', label: 'Site Visits', icon: HiOutlineCalendar, roles: ['super_admin', 'support', 'employee'] },
      { to: '/inquiries', label: 'Inquiries', icon: HiOutlineMail, roles: ['super_admin', 'support'] },
      { to: '/service-requests', label: 'Service Requests', icon: HiOutlineTicket, roles: ['super_admin', 'support'] },
      { to: '/registrations', label: 'Registrations', icon: HiOutlineUserGroup, roles: ['super_admin'] },
      { to: '/forums', label: 'Forums', icon: HiOutlineChatAlt2, roles: ['super_admin', 'support'] },
      { to: '/users', label: 'Users', icon: HiOutlineUsers, roles: ['super_admin'] },
    ],
  },
];

const AdminLayout = () => {
  const { user, logout } = useAuthStore();
  const navigate = useNavigate();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const searchRef = useRef<HTMLInputElement>(null);

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const visibleSections = NAV_SECTIONS.map((section) => ({
    ...section,
    items: section.items.filter(
      (item) =>
        user &&
        item.roles.includes(user.role) &&
        item.label.toLowerCase().includes(searchQuery.toLowerCase())
    ),
  })).filter((section) => section.items.length > 0);

  const sidebarJSX = (
    <div className="flex flex-col h-full">
      {/* Branding */}
      <div className="px-4 pt-5 pb-4 border-b border-white/5">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-blue-500 to-blue-700 flex items-center justify-center shadow-lg shadow-blue-600/40 flex-shrink-0">
            <span className="text-white font-black text-sm tracking-tight">PW</span>
          </div>
          <div className="min-w-0">
            <p className="text-[13px] font-bold text-white leading-tight truncate">Pravara World Tech</p>
            <p className="text-[10px] text-blue-400 font-semibold uppercase tracking-widest mt-0.5">Admin Console</p>
          </div>
        </div>

        {/* Search */}
        <div className="relative mt-4">
          <HiOutlineSearch className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-gray-500 pointer-events-none" />
          <input
            ref={searchRef}
            type="text"
            placeholder="Search..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-3 py-2 bg-white/5 border border-white/8 rounded-xl text-[12px] text-gray-300 placeholder-gray-600 focus:outline-none focus:border-blue-500 focus:bg-white/8 transition-all"
          />
        </div>
      </div>

      {/* Nav */}
      <nav className="flex-1 px-3 py-3 overflow-y-auto space-y-4 scrollbar-thin">
        {visibleSections.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-10 gap-2">
            <HiOutlineSearch className="w-6 h-6 text-gray-600" />
            <p className="text-[11px] text-gray-600 font-medium">No results for "{searchQuery}"</p>
          </div>
        ) : (
          visibleSections.map((section) => (
            <div key={section.label}>
              <p className="px-2 mb-1 text-[10px] font-bold text-gray-600 uppercase tracking-widest">{section.label}</p>
              <div className="space-y-0.5">
                {section.items.map((item) => (
                  <NavLink
                    key={item.to}
                    to={item.to}
                    onClick={() => setSidebarOpen(false)}
                    className={({ isActive }) =>
                      `group flex items-center gap-3 px-3 py-2.5 rounded-xl text-[13px] font-medium transition-all duration-150 ${
                        isActive
                          ? 'bg-blue-600 text-white shadow-md shadow-blue-600/30'
                          : 'text-gray-500 hover:text-gray-200 hover:bg-white/6'
                      }`
                    }
                  >
                    {({ isActive }) => (
                      <>
                        <item.icon className={`w-[17px] h-[17px] flex-shrink-0 transition-colors ${isActive ? 'text-white' : 'text-gray-500 group-hover:text-gray-300'}`} />
                        <span>{item.label}</span>
                        {isActive && <span className="ml-auto w-1.5 h-1.5 rounded-full bg-white/70" />}
                      </>
                    )}
                  </NavLink>
                ))}
              </div>
            </div>
          ))
        )}
      </nav>

      {/* User profile */}
      <div className="px-3 pb-4 pt-2 border-t border-white/5">
        <div className="flex items-center gap-3 px-3 py-3 rounded-2xl bg-white/4 border border-white/6 mb-2">
          <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-blue-500 to-blue-700 flex items-center justify-center text-white text-sm font-bold flex-shrink-0">
            {user?.name?.charAt(0)?.toUpperCase() || 'U'}
          </div>
          <div className="min-w-0 flex-1">
            <p className="text-[13px] font-semibold text-white leading-tight truncate">{user?.name}</p>
            <p className="text-[10px] text-gray-500 truncate capitalize mt-0.5">{user?.role?.replace(/_/g, ' ')}</p>
          </div>
        </div>
        <button
          onClick={handleLogout}
          className="flex items-center gap-2.5 w-full px-3 py-2.5 rounded-xl text-[12px] font-medium text-red-400 hover:bg-red-500/10 hover:text-red-300 transition-all duration-150"
        >
          <HiOutlineLogout className="w-4 h-4" />
          Sign Out
        </button>
      </div>
    </div>
  );

  return (
    <div className="flex h-screen bg-[#080810] overflow-hidden">
      {/* Desktop sidebar */}
      <aside className="hidden lg:flex lg:w-[248px] flex-col bg-[#0d0d18] border-r border-white/6 flex-shrink-0">
        {sidebarJSX}
      </aside>

      {/* Mobile sidebar overlay */}
      {sidebarOpen && (
        <div className="fixed inset-0 z-50 lg:hidden">
          <div
            className="absolute inset-0 bg-black/60 backdrop-blur-sm"
            onClick={() => setSidebarOpen(false)}
          />
          <aside className="absolute inset-y-0 left-0 w-[248px] bg-[#0d0d18] border-r border-white/6 shadow-2xl flex flex-col">
            {sidebarJSX}
          </aside>
        </div>
      )}

      {/* Main content */}
      <div className="flex-1 flex flex-col overflow-hidden min-w-0">
        {/* Top bar */}
        <header className="h-14 flex items-center justify-between px-4 lg:px-6 border-b border-white/6 bg-[#0d0d18]/80 backdrop-blur-md flex-shrink-0">
          <button
            onClick={() => setSidebarOpen(true)}
            className="lg:hidden p-2 -ml-1 text-gray-400 hover:text-white rounded-xl hover:bg-white/8 transition-colors"
          >
            {sidebarOpen ? <HiOutlineX className="w-5 h-5" /> : <HiOutlineMenu className="w-5 h-5" />}
          </button>

          <div className="flex items-center gap-3 ml-auto">
            <span className="hidden sm:block text-[12px] text-gray-600 font-medium">
              {new Date().toLocaleDateString('en-IN', { weekday: 'short', month: 'short', day: 'numeric', year: 'numeric' })}
            </span>
            <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-blue-500 to-blue-700 flex items-center justify-center text-white text-xs font-bold shadow-md shadow-blue-600/30">
              {user?.name?.charAt(0)?.toUpperCase() || 'U'}
            </div>
          </div>
        </header>

        <main className="flex-1 overflow-y-auto p-4 lg:p-7 bg-[#080810]">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default AdminLayout;
