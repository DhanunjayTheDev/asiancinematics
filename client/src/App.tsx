import { Routes, Route, Link, useLocation } from 'react-router-dom';
import { useEffect, useState } from 'react';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import WhatsAppButton from './components/WhatsAppButton';
import AuthModal from './components/AuthModal';
import ProtectedRoute from './components/ProtectedRoute';
import { useAuthStore } from './store/authStore';

import LandingPage from './pages/LandingPage';
import ProductsPage from './pages/ProductsPage';
import ProductDetailPage from './pages/ProductDetailPage';
import CartPage from './pages/CartPage';
import CheckoutPage from './pages/CheckoutPage';
import OrdersPage from './pages/OrdersPage';
import OrderDetailPage from './pages/OrderDetailPage';
import ServicesPage from './pages/ServicesPage';
import ServiceDetailPage from './pages/ServiceDetailPage';
import ServiceRequestPage from './pages/ServiceRequestPage';
import BookVisitPage from './pages/BookVisitPage';
import InquiryPage from './pages/InquiryPage';
import ContactPage from './pages/ContactPage';
import ProfilePage from './pages/ProfilePage';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import SolutionsPage from './pages/SolutionsPage';
import StructuralWorksPage from './pages/StructuralWorksPage';
import ProjectsPage from './pages/ProjectsPage';
import BrandsPage from './pages/BrandsPage';
import PartnerNetworkPage from './pages/PartnerNetworkPage';
import ForumsPage from './pages/ForumsPage';
import AboutPage from './pages/AboutPage';
import JoinWithUsPage from './pages/JoinWithUsPage';
import NotFoundPage from './pages/NotFoundPage';
import PrivacyPolicyPage from './pages/PrivacyPolicyPage';
import TermsPage from './pages/TermsPage';
import DisclaimerPage from './pages/DisclaimerPage';

const AUTH_ROUTES = ['/login', '/register', '/join'];

const App = () => {
  const location = useLocation();
  const { isAuthenticated } = useAuthStore();
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [hasShownModal, setHasShownModal] = useState(false);

  const isAuthPage = AUTH_ROUTES.some(r => location.pathname === r || location.pathname.startsWith(r + '/'));

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [location.pathname]);

  // Show auth modal on first load if not authenticated
  useEffect(() => {
    const sessionKey = 'auth_modal_shown';
    const modalShown = sessionStorage.getItem(sessionKey);

    if (!isAuthenticated && !modalShown && !hasShownModal) {
      const timer = setTimeout(() => {
        setShowAuthModal(true);
        setHasShownModal(true);
        sessionStorage.setItem(sessionKey, 'true');
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [isAuthenticated, hasShownModal]);

  return (
    <div className="min-h-screen flex flex-col bg-black">
      {!isAuthPage && <Navbar />}
      <main className="flex-1">
        <Routes>
          {/* Public */}
          <Route path="/" element={<LandingPage />} />
          <Route path="/products" element={<ProductsPage />} />
          <Route path="/products/:slug" element={<ProductDetailPage />} />
          <Route path="/solutions" element={<SolutionsPage />} />
          <Route path="/structural-works" element={<StructuralWorksPage />} />
          <Route path="/projects" element={<ProjectsPage />} />
          <Route path="/services" element={<ServicesPage />} />
          <Route path="/services/:slug" element={<ServiceDetailPage />} />
          <Route path="/brands" element={<BrandsPage />} />
          <Route path="/partner-network" element={<PartnerNetworkPage />} />
          <Route path="/forums" element={<ForumsPage />} />
          <Route path="/about" element={<AboutPage />} />
          <Route path="/inquiry" element={<InquiryPage />} />
          <Route path="/contact" element={<ContactPage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />
          <Route path="/join/:role" element={<JoinWithUsPage />} />
          <Route path="/join" element={<JoinWithUsPage />} />
          <Route path="/privacy" element={<PrivacyPolicyPage />} />
          <Route path="/terms" element={<TermsPage />} />
          <Route path="/disclaimer" element={<DisclaimerPage />} />

          {/* Auth required */}
          <Route path="/cart" element={<ProtectedRoute><CartPage /></ProtectedRoute>} />
          <Route path="/checkout" element={<ProtectedRoute><CheckoutPage /></ProtectedRoute>} />
          <Route path="/orders" element={<ProtectedRoute><OrdersPage /></ProtectedRoute>} />
          <Route path="/orders/:id" element={<ProtectedRoute><OrderDetailPage /></ProtectedRoute>} />
          <Route path="/service-request" element={<ProtectedRoute><ServiceRequestPage /></ProtectedRoute>} />
          <Route path="/book-visit" element={<ProtectedRoute><BookVisitPage /></ProtectedRoute>} />
          <Route path="/profile" element={<ProtectedRoute><ProfilePage /></ProtectedRoute>} />

          {/* 404 */}
          <Route path="*" element={<NotFoundPage />} />
        </Routes>
      </main>
      {!isAuthPage && <Footer />}
      {!isAuthPage && <WhatsAppButton />}
      <AuthModal isOpen={showAuthModal} onClose={() => setShowAuthModal(false)} />
    </div>
  );
};

export default App;
