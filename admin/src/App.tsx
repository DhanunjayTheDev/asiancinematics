import { useEffect, useCallback } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { useAuthStore } from './store/authStore';
import AdminLayout from './components/AdminLayout';
import ProtectedRoute from './components/ProtectedRoute';
import LoginPage from './pages/LoginPage';
import DashboardPage from './pages/DashboardPage';
import OrdersPage from './pages/OrdersPage';
import ProductsPage from './pages/ProductsPage';
import CategoriesPage from './pages/CategoriesPage';
import ServicesPage from './pages/ServicesPage';
import ProjectsPage from './pages/ProjectsPage';
import BrandsPage from './pages/BrandsPage';
import PartnersPage from './pages/PartnersPage';
import TicketsPage from './pages/TicketsPage';
import SiteVisitsPage from './pages/SiteVisitsPage';
import InquiriesPage from './pages/InquiriesPage';
import ServiceRequestsPage from './pages/ServiceRequestsPage';
import ForumsPage from './pages/ForumsPage';
import UsersPage from './pages/UsersPage';
import ReportsPage from './pages/ReportsPage';
import RegistrationsPage from './pages/RegistrationsPage';

const App = () => {
  const { isAuthenticated, fetchProfile } = useAuthStore();
  const memoFetchProfile = useCallback(() => fetchProfile(), [fetchProfile]);

  useEffect(() => {
    if (isAuthenticated) memoFetchProfile();
  }, [isAuthenticated, memoFetchProfile]);

  return (
    <Routes>
      <Route path="/login" element={isAuthenticated ? <Navigate to="/dashboard" replace /> : <LoginPage />} />

      <Route element={<ProtectedRoute />}>
        <Route element={<AdminLayout />}>
          <Route path="/dashboard" element={<DashboardPage />} />
          <Route path="/orders" element={<OrdersPage />} />
          <Route path="/products" element={<ProductsPage />} />
          <Route path="/categories" element={<CategoriesPage />} />
          <Route path="/services" element={<ServicesPage />} />
          <Route path="/projects" element={<ProjectsPage />} />
          <Route path="/brands" element={<BrandsPage />} />
          <Route path="/partners" element={<PartnersPage />} />
          <Route path="/tickets" element={<TicketsPage />} />
          <Route path="/site-visits" element={<SiteVisitsPage />} />
          <Route path="/inquiries" element={<InquiriesPage />} />
          <Route path="/service-requests" element={<ServiceRequestsPage />} />
          <Route path="/registrations" element={<RegistrationsPage />} />
          <Route path="/forums" element={<ForumsPage />} />
          <Route path="/users" element={<UsersPage />} />
          <Route path="/reports" element={<ReportsPage />} />
        </Route>
      </Route>

      <Route path="*" element={<Navigate to={isAuthenticated ? '/dashboard' : '/login'} replace />} />
    </Routes>
  );
};

export default App;
