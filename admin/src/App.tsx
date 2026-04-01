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
import TicketsPage from './pages/TicketsPage';
import SiteVisitsPage from './pages/SiteVisitsPage';
import InquiriesPage from './pages/InquiriesPage';
import UsersPage from './pages/UsersPage';
import ReportsPage from './pages/ReportsPage';

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
          <Route path="/tickets" element={<TicketsPage />} />
          <Route path="/site-visits" element={<SiteVisitsPage />} />
          <Route path="/inquiries" element={<InquiriesPage />} />
          <Route path="/users" element={<UsersPage />} />
          <Route path="/reports" element={<ReportsPage />} />
        </Route>
      </Route>

      <Route path="*" element={<Navigate to={isAuthenticated ? '/dashboard' : '/login'} replace />} />
    </Routes>
  );
};

export default App;
