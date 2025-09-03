import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { Navigation } from './components/Navigation';
import { HomePage } from './components/HomePage';
import { PriceCalculator } from './components/PriceCalculator';
import { DataTable } from './components/DataTable';
import { ContactPage } from './components/ContactPage';
import { AdminDashboard } from './components/AdminDashboard';
import { EnhancedBackground } from './components/EnhancedBackground';
import { FloatingChatButton } from './components/FloatingChatButton';
import { Footer } from './components/Footer';
import { CurrencyRateProvider } from './contexts/CurrencyRateContext';
import { AppDataProvider } from './contexts/AppDataContext';
import { useFontPreferences } from './hooks/useFontPreferences';

function App() {
  const [activeTab, setActiveTab] = useState<'home' | 'calculator' | 'pricelist' | 'contact'>('home');

  const handleTabChange = (tab: 'home' | 'calculator' | 'pricelist' | 'contact') => {
    setActiveTab(tab);
    // Scroll to top when changing tabs
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const MainApp = () => {
    // Initialize font preferences inside the provider
    useFontPreferences();
    
    return (
      <div className="min-h-screen text-white relative">
        <EnhancedBackground />
        <Navigation activeTab={activeTab} onTabChange={handleTabChange} />
        
        <main className="relative z-10">
          {activeTab === 'home' && <HomePage onContactClick={() => handleTabChange('contact')} onCalculatorClick={() => handleTabChange('calculator')} />}
          {activeTab === 'calculator' && <PriceCalculator />}
          {activeTab === 'pricelist' && <DataTable />}
          {activeTab === 'contact' && <ContactPage />}
        </main>
        
        <FloatingChatButton />
        <Footer />
      </div>
    );
  };

  return (
    <AppDataProvider>
      <CurrencyRateProvider>
        <Router>
          <Routes>
            <Route path="/" element={<MainApp />} />
            <Route path="/admin-dashboard" element={<AdminDashboard />} />
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </Router>
      </CurrencyRateProvider>
    </AppDataProvider>
  );
}

export default App;