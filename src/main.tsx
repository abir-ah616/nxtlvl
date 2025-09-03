import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import App from './App.tsx';
import './index.css';
import { initializeScrollAnimations } from './utils/scrollAnimations';
import { CurrencyRateProvider } from './contexts/CurrencyRateContext';

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <CurrencyRateProvider>
      <App />
    </CurrencyRateProvider>
  </StrictMode>
);

// Initialize scroll animations after DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
  setTimeout(() => {
    initializeScrollAnimations();
  }, 100);
});
