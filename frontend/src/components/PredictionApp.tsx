import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { ArrowLeft, Scan, Building2 } from 'lucide-react';
import Header from './Header';
import UploadSection from './UploadSection';
import ProcessingAnimation from './ProcessingAnimation';
import ResultsSection from './ResultsSection';
import Footer from './Footer';
import { PredictionResult } from '../types';

interface PredictionAppProps {
  onBackToHome: () => void;
  onNavigateToHospitals?: () => void;
  onNavigateToAbout?: () => void;
}

const PredictionApp: React.FC<PredictionAppProps> = ({ 
  onBackToHome,
  onNavigateToHospitals,
  onNavigateToAbout 
}) => {
  const [isProcessing, setIsProcessing] = useState(false);
  const [results, setResults] = useState<PredictionResult | null>(null);
  const [uploadedImage, setUploadedImage] = useState<string | null>(null);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const handleImageUpload = (imageUrl: string) => {
    setUploadedImage(imageUrl);
    setResults(null);
    setErrorMsg(null);
  };

  const handlePredictionStart = () => {
    setIsProcessing(true);
    setErrorMsg(null);
  };

  const handlePredictionComplete = (result: PredictionResult) => {
    setIsProcessing(false);
    setResults(result);
    setErrorMsg(null);
  };

  const handlePredictionError = (message: string) => {
    setIsProcessing(false);
    setResults(null);
    setErrorMsg(message);
  };

  const handleNewAnalysis = () => {
    setResults(null);
    setUploadedImage(null);
    setIsProcessing(false);
  };

  return (
    <div className="min-h-screen bg-slate-50 font-classic flex flex-col justify-between">
      <div>
        <Header 
          onLogoClick={onBackToHome}
          onNavigateToScan={handleNewAnalysis}
          onNavigateToHospitals={onNavigateToHospitals}
          onNavigateToAbout={onNavigateToAbout}
          activeView="prediction"
        />

        {/* Back link */}
        <div className="container mx-auto px-4 sm:px-6 pt-6">
          <button
            onClick={onBackToHome}
            className="inline-flex items-center space-x-1.5 text-xs font-semibold text-slate-500 hover:text-teal-700 bg-white px-3 py-1.5 rounded-lg border border-slate-200 transition-all shadow-2xs"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Back to Home</span>
          </button>
        </div>
        
        <main className="container mx-auto px-4 sm:px-6 py-6">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5 }}
            className="max-w-5xl mx-auto"
          >
            {!results && !isProcessing && (
              <UploadSection
                onImageUpload={handleImageUpload}
                onPredictionStart={handlePredictionStart}
                uploadedImage={uploadedImage}
                onPredictionComplete={handlePredictionComplete}
                onPredictionError={handlePredictionError}
                errorMessage={errorMsg}
              />
            )}

            {isProcessing && (
              <ProcessingAnimation />
            )}

            {results && (
              <ResultsSection
                results={results}
                originalImage={uploadedImage}
                onNewAnalysis={handleNewAnalysis}
              />
            )}
          </motion.div>
        </main>
      </div>

      <Footer />
    </div>
  );
};

export default PredictionApp;
