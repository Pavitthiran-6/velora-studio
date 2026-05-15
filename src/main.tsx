import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import App from './App.tsx';
import WorkPage from './pages/WorkPage.tsx';
import ServicesPage from './pages/ServicesPage.tsx';
import StudioPage from './pages/StudioPage.tsx';
import WebsiteDesignPage from './pages/WebsiteDesignPage.tsx';
import MotionDesignPage from './pages/MotionDesignPage.tsx';
import FrontEndDevPage from './pages/FrontEndDevPage.tsx';
import BackEndDevPage from './pages/BackEndDevPage.tsx';
import SEOPage from './pages/SEOPage.tsx';
import ShopifyDevelopmentPage from './pages/ShopifyDevelopmentPage.tsx';
import WebsiteSupportPage from './pages/WebsiteSupportPage.tsx';
import PaidSearchAdvertisingPage from './pages/PaidSearchAdvertisingPage.tsx';
import SocialMediaAdvertisingPage from './pages/SocialMediaAdvertisingPage.tsx';
import EmailMarketingPage from './pages/EmailMarketingPage.tsx';
import { ContactExperience } from './pages/ContactExperience.tsx';
import WorkDetailsPage from './pages/WorkDetailsPage.tsx';
import AdminLogin from './pages/admin/AdminLogin';
import AdminDashboard from './pages/admin/AdminDashboard';
import AdminProjects from './pages/admin/AdminProjects';
import AdminProjectEditor from './pages/admin/AdminProjectEditor';
import AdminCategories from './pages/admin/AdminCategories';
import AdminNotifications from './pages/admin/AdminNotifications';
import AdminHomeCards from './pages/admin/AdminHomeCards';
import AdminAnalytics from './pages/admin/AdminAnalytics';
import AdminReviews from './pages/admin/AdminReviews';
import AdminSettings from './pages/admin/AdminSettings';
import { ProtectedRoute } from './components/admin/ProtectedRoute.tsx';
import { TransitionProvider } from './components/TransitionProvider.tsx';
import { Preloader } from './components/Preloader.tsx';
import './index.css';

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <BrowserRouter>
      <TransitionProvider>
        <Preloader />
        <Routes>
          <Route path="/" element={<App />} />
          <Route path="/work" element={<WorkPage />} />
          <Route path="/work/:id" element={<WorkDetailsPage />} />
          <Route path="/services" element={<ServicesPage />} />
          <Route path="/website-design" element={<WebsiteDesignPage />} />
          <Route path="/motion-design" element={<MotionDesignPage />} />
          <Route path="/front-end-development" element={<FrontEndDevPage />} />
          <Route path="/back-end-development" element={<BackEndDevPage />} />
          <Route path="/seo" element={<SEOPage />} />
          <Route path="/shopify-development" element={<ShopifyDevelopmentPage />} />
          <Route path="/website-support" element={<WebsiteSupportPage />} />
          <Route path="/paid-search-advertising" element={<PaidSearchAdvertisingPage />} />
          <Route path="/social-media-advertising" element={<SocialMediaAdvertisingPage />} />
          <Route path="/email-marketing" element={<EmailMarketingPage />} />
          <Route path="/studio" element={<StudioPage />} />
          <Route path="/contact" element={<ContactExperience isOpen={true} onClose={() => window.history.back()} />} />
          
          {/* Admin Routes */}
          <Route path="/admin" element={<AdminLogin />} />
          <Route path="/admin/dashboard" element={<ProtectedRoute><AdminDashboard /></ProtectedRoute>} />
          <Route path="/admin/projects" element={<ProtectedRoute><AdminProjects /></ProtectedRoute>} />
          <Route path="/admin/projects/:id/edit" element={<ProtectedRoute><AdminProjectEditor /></ProtectedRoute>} />
          <Route path="/admin/categories" element={<ProtectedRoute><AdminCategories /></ProtectedRoute>} />
          <Route path="/admin/home-cards" element={<ProtectedRoute><AdminHomeCards /></ProtectedRoute>} />
          <Route path="/admin/notifications" element={<ProtectedRoute><AdminNotifications /></ProtectedRoute>} />
          <Route path="/admin/analytics" element={<ProtectedRoute><AdminAnalytics /></ProtectedRoute>} />
          <Route path="/admin/reviews" element={<ProtectedRoute><AdminReviews /></ProtectedRoute>} />
          <Route path="/admin/settings" element={<ProtectedRoute><AdminSettings /></ProtectedRoute>} />
        </Routes>
      </TransitionProvider>
    </BrowserRouter>
  </StrictMode>,
);
