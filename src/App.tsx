import React, { useState } from 'react';
import { Navigation } from './components/Navigation';
import { HomePage } from './components/HomePage';
import { PriceCalculator } from './components/PriceCalculator';
import { DataTable } from './components/DataTable';
import { ContactPage } from './components/ContactPage';
import { Background } from './components/Background';
import { Footer } from './components/Footer';

function App() {
  const [activeTab, setActiveTab] = useState<'home' | 'calculator' | 'pricelist' | 'contact'>('home');

  const handleTabChange = (tab: 'home' | 'calculator' | 'pricelist' | 'contact') => {
    setActiveTab(tab);
    // Scroll to top when changing tabs
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="min-h-screen text-white relative">
      <Background />
      <Navigation activeTab={activeTab} onTabChange={handleTabChange} />
      
      <main className="relative z-10">
        {activeTab === 'home' && <HomePage onContactClick={() => handleTabChange('contact')} />}
        {activeTab === 'calculator' && <PriceCalculator />}
        {activeTab === 'pricelist' && <DataTable />}
        {activeTab === 'contact' && <ContactPage />}
      </main>
      
      <Footer />
    </div>
  );
}

export default App;