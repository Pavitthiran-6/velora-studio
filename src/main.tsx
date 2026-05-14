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
import AdminLogin from './pages/admin/AdminLogin.tsx';
import AdminDashboard from './pages/admin/AdminDashboard.tsx';
import AdminProjects from './pages/admin/AdminProjects.tsx';
import AdminCategories from './pages/admin/AdminCategories.tsx';
import AdminNotifications from './pages/admin/AdminNotifications.tsx';
import AdminHomeCards from './pages/admin/AdminHomeCards.tsx';
import AdminAnalytics from './pages/admin/AdminAnalytics.tsx';
import AdminReviews from './pages/admin/AdminReviews.tsx';
import AdminSettings from './pages/admin/AdminSettings.tsx';
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
          <Route path="/admin/dashboard" element={<AdminDashboard />} />
          <Route path="/admin/projects" element={<AdminProjects />} />
          <Route path="/admin/categories" element={<AdminCategories />} />
          <Route path="/admin/home-cards" element={<AdminHomeCards />} />
          <Route path="/admin/notifications" element={<AdminNotifications />} />
          <Route path="/admin/analytics" element={<AdminAnalytics />} />
          <Route path="/admin/reviews" element={<AdminReviews />} />
          <Route path="/admin/settings" element={<AdminSettings />} />
        </Routes>
      </TransitionProvider>
    </BrowserRouter>
  </StrictMode>,
);
