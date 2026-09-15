import React from 'react';
import { motion } from 'framer-motion';
import { Brain, Zap, Search, Activity, Scan, Sparkles } from 'lucide-react';

const ProcessingAnimation: React.FC = () => {
  const processingSteps = [
    { icon: Search, text: 'Checking scan quality & preparing image...', delay: 0 },
    { icon: Brain, text: 'Scanning lung fields with deep vision models...', delay: 0.5 },
    { icon: Scan, text: 'Highlighting focal areas on visual attention heatmap...', delay: 1.0 },
    { icon: Activity, text: 'Synthesizing your easy-to-read medical summary...', delay: 1.5 },
  ];

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
      className="bg-white rounded-3xl shadow-xl p-10 sm:p-14 text-center border border-slate-200/90 max-w-2xl mx-auto"
    >
      {/* Radar scanning spinner */}
      <div className="relative w-28 h-28 mx-auto mb-8 flex items-center justify-center">
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 2.5, repeat: Infinity, ease: 'linear' }}
          className="absolute inset-0 rounded-full border-4 border-teal-100 border-t-teal-600 border-r-cyan-500 shadow-medical"
        />
        <motion.div
          animate={{ scale: [0.85, 1.15, 0.85] }}
          transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
          className="w-16 h-16 rounded-full bg-gradient-to-tr from-teal-500 to-cyan-500 flex items-center justify-center text-white shadow-lg"
        >
          <Activity className="w-8 h-8 animate-pulse" />
        </motion.div>
      </div>

      <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 mb-2">
        Analyzing Your Chest X-Ray
      </h2>
      <p className="text-slate-500 text-sm mb-8">
        We are carefully examining your radiograph for patterns of infection...
      </p>

      <div className="space-y-4 max-w-md mx-auto text-left">
        {processingSteps.map((step, index) => (
          <motion.div
            key={index}
            initial={{ opacity: 0, x: -15 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: step.delay, duration: 0.4 }}
            className="flex items-center space-x-3 p-3 rounded-xl bg-slate-50 border border-slate-200/80"
          >
            <div className="w-8 h-8 rounded-lg bg-teal-100 text-teal-700 flex items-center justify-center flex-shrink-0">
              <step.icon className="w-4 h-4" />
            </div>
            <span className="text-xs sm:text-sm font-semibold text-slate-700">{step.text}</span>
          </motion.div>
        ))}
      </div>

      <p className="mt-8 text-xs text-slate-500 font-medium">
        ⚡ Analysis usually takes just a few seconds
      </p>
    </motion.div>
  );
};

export default ProcessingAnimation;
