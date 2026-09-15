import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowLeft, Building2 } from 'lucide-react';
import LandingPage from './components/LandingPage';
import PredictionApp from './components/PredictionApp';
import HospitalLocator from './components/HospitalLocator';
import AboutUs from './components/AboutUs';
import Header from './components/Header';
import Footer from './components/Footer';

type ViewState = 'landing' | 'prediction' | 'hospitals' | 'about';

function App() {
  const [view, setView] = useState<ViewState>('landing');

  const renderView = () => {
    switch (view) {
      case 'prediction':
        return (
          <PredictionApp 
            onBackToHome={() => setView('landing')} 
            onNavigateToHospitals={() => setView('hospitals')}
            onNavigateToAbout={() => setView('about')}
          />
        );
      case 'hospitals':
        return (
          <div className="min-h-screen bg-slate-50 font-classic flex flex-col justify-between">
            <div>
              <Header 
                onLogoClick={() => setView('landing')}
                onNavigateToScan={() => setView('prediction')}
                onNavigateToHospitals={() => setView('hospitals')}
                onNavigateToAbout={() => setView('about')}
                activeView="hospitals"
              />
              <div className="container mx-auto px-4 sm:px-6 pt-6">
                <button
                  onClick={() => setView('landing')}
                  className="inline-flex items-center space-x-1.5 text-xs font-semibold text-slate-500 hover:text-teal-700 bg-white px-3 py-1.5 rounded-lg border border-slate-200 transition-all shadow-2xs mb-4"
                >
                  <ArrowLeft className="w-3.5 h-3.5" />
                  <span>Back to Home</span>
                </button>
                <HospitalLocator isEmbedded={false} />
              </div>
            </div>
            <Footer onNavigateToAbout={() => setView('about')} />
          </div>
        );
      case 'about':
        return (
          <AboutUs
            onBackToHome={() => setView('landing')}
            onNavigateToScan={() => setView('prediction')}
            onNavigateToHospitals={() => setView('hospitals')}
          />
        );
      case 'landing':
      default:
        return (
          <LandingPage 
            onStartPrediction={() => setView('prediction')}
            onExploreHospitals={() => setView('hospitals')}
            onNavigateToAbout={() => setView('about')}
          />
        );
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 font-classic">
      <AnimatePresence mode="wait">
        <motion.div
          key={view}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.25 }}
        >
          {renderView()}
        </motion.div>
      </AnimatePresence>
    </div>
  );
}

export default App;
