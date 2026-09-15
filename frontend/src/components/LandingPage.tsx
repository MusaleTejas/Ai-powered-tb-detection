import React from 'react';
import { motion } from 'framer-motion';
import Header from './Header';
import {
  Shield,
  Brain,
  Zap,
  BrainCircuit,
  ChevronRight,
  Upload,
  FileText,
  CheckCircle2,
  ArrowRight,
  Activity,
  Heart,
  Loader,
  Building2,
  Sparkles,
  Stethoscope,
  Scan,
  Check
} from 'lucide-react';

interface LandingPageProps {
  onStartPrediction: () => void;
  onExploreHospitals?: () => void;
  onNavigateToAbout?: () => void;
}

const LandingPage: React.FC<LandingPageProps> = ({
  onStartPrediction,
  onExploreHospitals,
  onNavigateToAbout
}) => {
  const technologies = [
    { name: 'Deep Vision AI', icon: Brain, description: 'Trained on thousands of validated pulmonary radiographs' },
    { name: 'Explainable Heatmaps', icon: Scan, description: 'Visual Grad-CAM shows doctors exactly where changes appear' },
    { name: 'Fast AI Reports', icon: BrainCircuit, description: 'Instant, easy-to-read clinical findings powered by Groq' },
    { name: 'Lesion Segmentation', icon: Activity, description: 'Estimates lung area involvement to assess severity' },
    { name: 'National DOTS Care', icon: Building2, description: 'Direct links to free government treatment centers' },
  ];

  const steps = [
    {
      step: '01',
      icon: Upload,
      title: 'Upload Your Chest X-Ray',
      description: 'Simply drag and drop any standard frontal chest radiograph (PA or AP view). Scans remain private and secure.',
      badge: 'Private & Secure'
    },
    {
      step: '02',
      icon: Brain,
      title: 'Instant AI Screening',
      description: 'Our deep learning vision models analyze your scan in seconds, looking for subtle patterns of pulmonary infection.',
      badge: 'Results in Seconds'
    },
    {
      step: '03',
      icon: FileText,
      title: 'Understand Your Results',
      description: 'Get an easy-to-read clinical summary with visual heatmaps and a clear, step-by-step treatment guide.',
      badge: 'Clear & Doctor-Ready'
    },
    {
      step: '04',
      icon: Building2,
      title: 'Find Care & Treatment',
      description: 'Locate nearby certified DOTS centers offering free government medication, or book an appointment with a specialist.',
      badge: 'Free & Accessible Care'
    }
  ];

  return (
    <div className="min-h-screen bg-slate-50 relative overflow-hidden font-classic">
      <Header
        onLogoClick={() => {}}
        onNavigateToScan={onStartPrediction}
        onNavigateToHospitals={onExploreHospitals}
        onNavigateToAbout={onNavigateToAbout}
        activeView="landing"
      />

      {/* Hero Section */}
      <section className="relative pt-12 pb-24 lg:pt-20 lg:pb-32 overflow-hidden">
        {/* Subtle background glow */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-7xl h-96 bg-gradient-to-b from-teal-100/40 via-cyan-50/30 to-transparent blur-3xl pointer-events-none"></div>

        <div className="container mx-auto px-4 sm:px-6 relative z-10">
          <div className="max-w-4xl mx-auto text-center">
            {/* Top Pill */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-teal-50 border border-teal-200/80 text-teal-800 text-xs sm:text-sm font-semibold mb-8 shadow-xs"
            >
              <Sparkles className="w-4 h-4 text-teal-600" />
              <span>Fast, Compassionate & Accurate Pulmonary TB Screening</span>
            </motion.div>

            {/* Main Headline */}
            <motion.h1
              initial={{ opacity: 0, y: 25 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1, duration: 0.7 }}
              className="text-4xl sm:text-6xl lg:text-7xl font-extrabold text-slate-900 tracking-tight leading-[1.15] mb-6"
            >
              Early Tuberculosis Screening{' '}
              <span className="text-gradient-medical block mt-1">
                Made Simple & Accessible
              </span>
            </motion.h1>

            {/* Subheading */}
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2, duration: 0.7 }}
              className="text-lg sm:text-xl text-slate-600 mb-10 max-w-2xl mx-auto leading-relaxed"
            >
              Get a reliable second opinion on your chest X-ray in seconds. See visual attention heatmaps, receive a clear doctor-ready report, and connect directly with nearby free DOTS care centers.
            </motion.p>

            {/* CTA Buttons */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3, duration: 0.7 }}
              className="flex flex-col sm:flex-row gap-4 justify-center items-center"
            >
              <motion.button
                onClick={onStartPrediction}
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.97 }}
                className="w-full sm:w-auto px-8 py-4 bg-gradient-to-r from-teal-600 to-cyan-600 hover:from-teal-700 hover:to-cyan-700 text-white rounded-2xl font-bold text-base shadow-medical hover:shadow-medical-lg transition-all flex items-center justify-center gap-2.5"
              >
                <Scan className="w-5 h-5" />
                <span>Check Your Chest X-Ray</span>
                <ArrowRight className="w-4 h-4" />
              </motion.button>

              {onExploreHospitals && (
                <motion.button
                  onClick={onExploreHospitals}
                  whileHover={{ scale: 1.03 }}
                  whileTap={{ scale: 0.97 }}
                  className="w-full sm:w-auto px-8 py-4 bg-white hover:bg-slate-50 text-slate-700 border border-slate-300/80 rounded-2xl font-bold text-base shadow-sm transition-all flex items-center justify-center gap-2"
                >
                  <Building2 className="w-5 h-5 text-teal-600" />
                  <span>Find Free DOTS Centers & Doctors</span>
                </motion.button>
              )}
            </motion.div>

            {/* Quick Stats Grid */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4, duration: 0.7 }}
              className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-16 pt-12 border-t border-slate-200"
            >
              <div className="p-4 rounded-xl bg-white/70 border border-slate-100 shadow-xs">
                <p className="text-3xl font-black text-teal-700">98.4%</p>
                <p className="text-xs font-semibold text-slate-500 mt-1">Screening Accuracy</p>
              </div>
              <div className="p-4 rounded-xl bg-white/70 border border-slate-100 shadow-xs">
                <p className="text-3xl font-black text-cyan-700">&lt; 3 sec</p>
                <p className="text-xs font-semibold text-slate-500 mt-1">Instant Visual Heatmap</p>
              </div>
              <div className="p-4 rounded-xl bg-white/70 border border-slate-100 shadow-xs">
                <p className="text-3xl font-black text-emerald-700">100% Free</p>
                <p className="text-xs font-semibold text-slate-500 mt-1">Government DOTS Guidance</p>
              </div>
              <div className="p-4 rounded-xl bg-white/70 border border-slate-100 shadow-xs">
                <p className="text-3xl font-black text-blue-700">24 / 7</p>
                <p className="text-xs font-semibold text-slate-500 mt-1">AI Assistant & Support</p>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section className="py-20 bg-white border-y border-slate-200/80">
        <div className="container mx-auto px-4 sm:px-6">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <span className="text-xs uppercase tracking-wider font-bold text-teal-700 bg-teal-50 px-3 py-1 rounded-full border border-teal-200">
              Simple 4-Step Process
            </span>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 mt-3">
              How the Screening System Works
            </h2>
            <p className="text-slate-600 text-sm sm:text-base mt-2">
              Designed to be intuitive for patients and informative for healthcare providers
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {steps.map((item, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.15, duration: 0.5 }}
                viewport={{ once: true }}
                className="bg-slate-50/80 hover:bg-white rounded-2xl p-6 border border-slate-200 shadow-sm hover:shadow-md transition-all flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <span className="text-2xl font-black text-teal-300 font-mono">
                      {item.step}
                    </span>
                    <div className="w-12 h-12 rounded-xl bg-teal-100 text-teal-700 flex items-center justify-center">
                      <item.icon className="w-6 h-6" />
                    </div>
                  </div>
                  <h3 className="text-lg font-bold text-slate-900 mb-2">
                    {item.title}
                  </h3>
                  <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                    {item.description}
                  </p>
                </div>
                <div className="mt-4 pt-3 border-t border-slate-200/60">
                  <span className="text-[11px] font-semibold text-teal-700 flex items-center gap-1">
                    <CheckCircle2 className="w-3.5 h-3.5" /> {item.badge}
                  </span>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Technology Stack Section */}
      <section className="py-20 bg-slate-50">
        <div className="container mx-auto px-4 sm:px-6">
          <div className="text-center max-w-2xl mx-auto mb-14">
            <h2 className="text-3xl font-extrabold text-slate-900">
              Built on Modern Medical AI Standards
            </h2>
            <p className="text-slate-500 text-sm mt-1">
              Combining deep learning computer vision, explainable AI, and trusted clinical guidelines
            </p>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
            {technologies.map((tech, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, scale: 0.9 }}
                whileInView={{ opacity: 1, scale: 1 }}
                transition={{ delay: index * 0.1, duration: 0.4 }}
                viewport={{ once: true }}
                className="bg-white rounded-2xl p-5 border border-slate-200 shadow-xs hover:border-teal-300 hover:shadow-sm transition-all text-center"
              >
                <div className="w-12 h-12 rounded-xl bg-gradient-to-tr from-teal-500 to-cyan-500 text-white flex items-center justify-center mx-auto mb-3 shadow-xs">
                  <tech.icon className="w-6 h-6" />
                </div>
                <h3 className="text-sm font-bold text-slate-800">
                  {tech.name}
                </h3>
                <p className="text-xs text-slate-500 mt-1">
                  {tech.description}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Action Banner */}
      <section className="py-16 bg-gradient-to-r from-teal-800 via-teal-700 to-cyan-800 text-white relative overflow-hidden">
        <div className="container mx-auto px-4 sm:px-6 text-center relative z-10">
          <h2 className="text-3xl sm:text-4xl font-black mb-4">
            Take the First Step Toward Peace of Mind
          </h2>
          <p className="text-teal-100 max-w-xl mx-auto text-sm sm:text-base mb-8 leading-relaxed">
            Tuberculosis is 100% curable when caught early. Upload your chest X-ray to receive an instant analysis, clear guidance, and direct doctor appointment booking.
          </p>
          <motion.button
            onClick={onStartPrediction}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="px-8 py-4 bg-white text-teal-900 rounded-2xl font-extrabold text-base shadow-lg hover:bg-teal-50 transition-all inline-flex items-center gap-2"
          >
            <Scan className="w-5 h-5 text-teal-600" />
            <span>Upload Your X-Ray Now</span>
          </motion.button>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-slate-900 text-slate-400 py-12 border-t border-slate-800">
        <div className="container mx-auto px-4 sm:px-6">
          <div className="flex flex-col md:flex-row items-center justify-between gap-6 text-center md:text-left">
            <div className="flex items-center space-x-3">
              <div className="w-9 h-9 rounded-lg bg-teal-600 text-white flex items-center justify-center">
                <Activity className="w-5 h-5" />
              </div>
              <div>
                <p className="text-white font-bold text-base">TB Care AI Diagnostic System</p>
                <p className="text-xs text-slate-500">Supporting WHO End TB Strategy & Global Health</p>
              </div>
            </div>

            <div className="text-xs text-slate-500 space-y-2">
              <p>National TB Helpline: <span className="text-teal-400 font-bold">1800-11-6666</span> (24x7 Free Support)</p>
              <div className="flex items-center justify-center md:justify-start gap-4">
                <span>For clinical screening & education</span>
                {onNavigateToAbout && (
                  <button
                    onClick={onNavigateToAbout}
                    className="text-teal-400 hover:text-teal-300 font-semibold underline"
                  >
                    About Us & Developer →
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default LandingPage;
