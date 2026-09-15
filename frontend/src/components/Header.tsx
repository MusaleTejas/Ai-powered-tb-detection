import React from 'react';
import { motion } from 'framer-motion';
import { Activity, Stethoscope, Building2, ScanLine, Sparkles } from 'lucide-react';

interface HeaderProps {
  onLogoClick?: () => void;
  onNavigateToScan?: () => void;
  onNavigateToHospitals?: () => void;
  onNavigateToAbout?: () => void;
  activeView?: 'landing' | 'prediction' | 'hospitals' | 'about';
}

const Header: React.FC<HeaderProps> = ({ 
  onLogoClick, 
  onNavigateToScan, 
  onNavigateToHospitals,
  onNavigateToAbout,
  activeView = 'landing'
}) => {
  return (
    <motion.header
      initial={{ y: -80, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.6, ease: 'easeOut' }}
      className="sticky top-0 z-50 bg-white/90 backdrop-blur-md border-b border-teal-100 shadow-sm"
    >
      <div className="container mx-auto px-4 sm:px-6 py-3.5">
        <div className="flex items-center justify-between">
          {/* Logo & Brand */}
          <motion.div
            whileHover={{ scale: 1.02 }}
            onClick={onLogoClick}
            className="flex items-center space-x-3 cursor-pointer select-none"
          >
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-teal-600 to-cyan-500 flex items-center justify-center text-white shadow-medical">
              <Activity className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-xl font-extrabold text-slate-900 tracking-tight leading-tight">
                  TB Care <span className="text-teal-600">AI</span>
                </h1>
                <span className="hidden sm:inline-block text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded-full bg-teal-50 text-teal-700 border border-teal-200">
                  Medical AI 2.0
                </span>
              </div>
              <p className="text-slate-500 text-xs font-medium">
                Pulmonary TB Detection & Care
              </p>
            </div>
          </motion.div>

          {/* Navigation Items */}
          <div className="flex items-center space-x-2 sm:space-x-3">
            {onNavigateToScan && (
              <button
                onClick={onNavigateToScan}
                className={`px-3.5 py-2 rounded-xl text-xs sm:text-sm font-semibold transition-all flex items-center gap-1.5 ${
                  activeView === 'prediction'
                    ? 'bg-teal-600 text-white shadow-medical'
                    : 'text-slate-600 hover:text-teal-700 hover:bg-teal-50'
                }`}
              >
                <ScanLine className="w-4 h-4" />
                <span>Scan X-Ray</span>
              </button>
            )}

            {onNavigateToHospitals && (
              <button
                onClick={onNavigateToHospitals}
                className={`px-3.5 py-2 rounded-xl text-xs sm:text-sm font-semibold transition-all flex items-center gap-1.5 ${
                  activeView === 'hospitals'
                    ? 'bg-teal-600 text-white shadow-medical'
                    : 'text-slate-600 hover:text-teal-700 hover:bg-teal-50'
                }`}
              >
                <Building2 className="w-4 h-4" />
                <span>Nearby Hospitals</span>
              </button>
            )}

            {onNavigateToAbout && (
              <button
                onClick={onNavigateToAbout}
                className={`px-3.5 py-2 rounded-xl text-xs sm:text-sm font-semibold transition-all flex items-center gap-1.5 ${
                  activeView === 'about'
                    ? 'bg-teal-600 text-white shadow-medical'
                    : 'text-slate-600 hover:text-teal-700 hover:bg-teal-50'
                }`}
              >
                <Sparkles className="w-4 h-4" />
                <span>About</span>
              </button>
            )}

            <div className="hidden md:flex items-center pl-3 border-l border-slate-200">
              <span className="flex items-center gap-1.5 text-xs text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded-full border border-emerald-200 font-medium">
                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
                Groq AI Active
              </span>
            </div>
          </div>
        </div>
      </div>
    </motion.header>
  );
};

export default Header;
