import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import App from './App.tsx';
import WorkPage from './pages/WorkPage.tsx';
import ServicesPage from './pages/ServicesPage.tsx';
import StudioPage from './pages/StudioPage.tsx';
import { ContactExperience } from './pages/ContactExperience.tsx';
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
          <Route path="/services" element={<ServicesPage />} />
          <Route path="/studio" element={<StudioPage />} />
          <Route path="/contact" element={<ContactExperience isOpen={true} onClose={() => window.history.back()} />} />
        </Routes>
      </TransitionProvider>
    </BrowserRouter>
  </StrictMode>,
);
