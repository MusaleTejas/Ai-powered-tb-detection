import React, { useCallback, useState } from 'react';
import { motion } from 'framer-motion';
import { useDropzone } from 'react-dropzone';
import { Upload, Image as ImageIcon, AlertCircle, CheckCircle2, Scan, ShieldCheck, Sparkles } from 'lucide-react';
import axios from 'axios';
import { PredictionResult } from '../types';

interface UploadSectionProps {
  onImageUpload: (imageUrl: string) => void;
  onPredictionStart: () => void;
  uploadedImage: string | null;
  onPredictionComplete?: (result: PredictionResult) => void;
  onPredictionError?: (message: string) => void;
  errorMessage?: string | null;
}

const UploadSection: React.FC<UploadSectionProps> = ({
  onImageUpload,
  onPredictionStart,
  uploadedImage,
  onPredictionComplete,
  onPredictionError,
  errorMessage
}) => {
  const [file, setFile] = useState<File | null>(null);
  const [error, setError] = useState<string>(errorMessage || '');
  const [xrayOk, setXrayOk] = useState<boolean>(false);

  const env = (import.meta as any).env;
  const API_BASE_URL = env?.VITE_API_BASE
    || (env?.MODE === 'production' ? 'https://your-vercel-domain.vercel.app/api' : 'http://127.0.0.1:5000');

  const onDrop = useCallback((acceptedFiles: File[]) => {
    const selectedFile = acceptedFiles[0];
    if (selectedFile) {
      if (selectedFile.size > 10 * 1024 * 1024) {
        setError('File size must be less than 10MB');
        return;
      }

      const imageUrl = URL.createObjectURL(selectedFile);
      setFile(selectedFile);
      onImageUpload(imageUrl);
      setError('');
      setXrayOk(false);
    }
  }, [onImageUpload]);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'image/*': ['.jpeg', '.jpg', '.png', '.bmp', '.tiff', '.dcm']
    },
    multiple: false
  });

  const handleAnalyze = async () => {
    if (!file) return;

    onPredictionStart();

    try {
      const predForm = new FormData();
      predForm.append('image', file);
      console.log('[UploadSection] Calling /predict...');

      const predResp = await axios.post(`${API_BASE_URL}/predict`, predForm, {
        timeout: 130000,
      });

      const predData = predResp.data as PredictionResult;

      if (typeof (predData as any).xray_confirmed === 'boolean' && !predData.xray_confirmed) {
        const msg = 'Image is not recognized as a chest X-ray. Please upload a standard chest radiograph.';
        setError(msg);
        setXrayOk(false);
        onPredictionError?.(msg);
        return;
      }

      setError('');
      setXrayOk(true);
      console.log('[UploadSection] /predict response:', predData);
      onPredictionComplete?.(predData);

    } catch (error: any) {
      console.error('[UploadSection] Analysis failed:', error);
      let msg = 'Analysis failed. Please verify that the backend server is running and try again.';
      if (error?.response?.data?.error) {
        msg = error.response.data.error as string;
      } else if (error?.message && typeof error.message === 'string') {
        msg = error.message;
      }
      setError(msg);
      setXrayOk(false);
      onPredictionError?.(msg);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
      className="bg-white rounded-3xl shadow-xl p-6 sm:p-10 border border-slate-200/90"
    >
      <div className="text-center max-w-2xl mx-auto mb-8">
        <span className="text-xs font-bold uppercase tracking-wider text-teal-700 bg-teal-50 px-3 py-1 rounded-full border border-teal-200">
          Smart Pulmonary Screening
        </span>
        <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 mt-2">
          Upload Your Chest X-Ray
        </h2>
        <p className="text-slate-500 text-sm mt-1 leading-relaxed">
          Upload a frontal chest radiograph (PA or AP view). Our AI will analyze the scan, highlight any areas of concern with visual heatmaps, and generate a clear report.
        </p>
      </div>

      {/* Drag & Drop Area */}
      <motion.div
        whileHover={{ scale: 1.01 }}
        className="mb-8"
      >
        <div
          {...getRootProps()}
          className={`border-2 border-dashed rounded-3xl p-10 sm:p-14 text-center cursor-pointer transition-all duration-300 relative overflow-hidden ${
            isDragActive
              ? 'border-teal-500 bg-teal-50/70 shadow-inner'
              : 'border-slate-300 hover:border-teal-500 bg-slate-50/50 hover:bg-teal-50/30'
          }`}
        >
          <input {...getInputProps()} />
          <div className="w-16 h-16 rounded-2xl bg-teal-100 text-teal-700 flex items-center justify-center mx-auto mb-4 shadow-sm">
            <Upload className="w-8 h-8" />
          </div>
          <p className="text-base sm:text-lg font-bold text-slate-800 mb-1">
            {isDragActive ? 'Drop your X-ray image here...' : 'Drag & drop your chest X-ray image here'}
          </p>
          <p className="text-xs sm:text-sm text-slate-500">
            or <span className="text-teal-600 font-bold underline">browse files from your device</span>
          </p>
          <div className="flex flex-wrap items-center justify-center gap-2 mt-4 text-[11px] text-slate-500">
            <span className="px-2 py-0.5 rounded bg-white border border-slate-200 font-medium">PNG</span>
            <span className="px-2 py-0.5 rounded bg-white border border-slate-200 font-medium">JPEG / JPG</span>
            <span className="px-2 py-0.5 rounded bg-white border border-slate-200 font-medium">DICOM</span>
            <span className="px-2 py-0.5 rounded bg-white border border-slate-200 font-medium">Up to 10 MB</span>
          </div>
        </div>
      </motion.div>

      {/* Error Message */}
      {error && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-6 p-4 bg-amber-50 border border-amber-200 rounded-2xl flex items-start gap-3 text-sm text-amber-800"
        >
          <AlertCircle className="w-5 h-5 flex-shrink-0 mt-0.5 text-amber-600" />
          <div>
            <p className="font-bold">Image Check Notice</p>
            <p className="text-xs mt-0.5 text-amber-700">{error}</p>
          </div>
        </motion.div>
      )}

      {/* Confirmation indicator */}
      {!error && xrayOk && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-6 p-3 bg-emerald-50 border border-emerald-200 rounded-xl text-emerald-800 text-xs font-semibold flex items-center gap-2"
        >
          <CheckCircle2 className="w-4 h-4 text-emerald-600" />
          <span>Chest radiograph successfully verified and ready for screening ✅</span>
        </motion.div>
      )}

      {/* Uploaded Preview & Analyze Button */}
      {uploadedImage && (
        <motion.div
          initial={{ opacity: 0, scale: 0.98 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.4 }}
          className="bg-slate-50 rounded-2xl p-6 border border-slate-200"
        >
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center space-x-2">
              <CheckCircle2 className="w-5 h-5 text-teal-600" />
              <span className="text-slate-800 font-bold text-sm">Your X-Ray is Ready to Analyze</span>
            </div>
            <span className="text-xs text-slate-500 font-medium">Ready for Scan</span>
          </div>

          <div className="flex justify-center mb-6">
            <div className="relative rounded-2xl overflow-hidden border-2 border-teal-200 shadow-md bg-black">
              <img
                src={uploadedImage}
                alt="Uploaded chest X-ray"
                className="max-w-xs sm:max-w-md max-h-72 object-contain"
              />
              <div className="absolute top-2.5 left-2.5 bg-slate-900/80 backdrop-blur-sm text-white px-2.5 py-1 rounded-lg text-xs font-medium flex items-center gap-1.5 border border-white/10">
                <ImageIcon className="w-3.5 h-3.5 text-cyan-400" />
                <span>Uploaded Radiograph</span>
              </div>
            </div>
          </div>

          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={handleAnalyze}
            className="w-full bg-gradient-to-r from-teal-600 to-cyan-600 hover:from-teal-700 hover:to-cyan-700 text-white font-bold py-4 px-6 rounded-2xl shadow-medical transition-all duration-300 flex items-center justify-center gap-2 text-base"
          >
            <Scan className="w-5 h-5" />
            <span>Analyze Scan with AI</span>
          </motion.button>
        </motion.div>
      )}
    </motion.div>
  );
};

export default UploadSection;
