import React from 'react';
import { motion } from 'framer-motion';
import { Heart, Activity, Phone, ShieldCheck } from 'lucide-react';

interface FooterProps {
  onNavigateToAbout?: () => void;
}

const Footer: React.FC<FooterProps> = ({ onNavigateToAbout }) => {
  return (
    <footer className="bg-white border-t border-slate-200 mt-20">
      <div className="container mx-auto px-4 sm:px-6 py-8">
        <div className="flex flex-col md:flex-row items-center justify-between gap-4 text-xs text-slate-500 text-center md:text-left">
          <div className="flex items-center space-x-2">
            <Activity className="w-4 h-4 text-teal-600" />
            <span className="font-bold text-slate-800">TB Care AI Diagnostic System</span>
            <span>· Dedicated to Eliminating Tuberculosis</span>
          </div>

          <div className="flex items-center space-x-4">
            <span className="flex items-center gap-1 text-slate-600">
              <Phone className="w-3.5 h-3.5 text-teal-600" /> National TB Helpline: <strong>1800-11-6666</strong>
            </span>
            <span className="hidden sm:inline text-slate-300">|</span>
            {onNavigateToAbout && (
              <>
                <button
                  onClick={onNavigateToAbout}
                  className="text-teal-700 hover:text-teal-900 font-semibold underline"
                >
                  About Us & Developer
                </button>
                <span className="hidden sm:inline text-slate-300">|</span>
              </>
            )}
            <span className="flex items-center gap-1 text-teal-700 font-medium">
              <ShieldCheck className="w-3.5 h-3.5" /> WHO DOTS Compliant
            </span>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
