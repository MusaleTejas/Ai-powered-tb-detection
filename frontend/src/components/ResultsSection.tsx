import React, { useEffect, useState, useRef } from 'react';
import { motion } from 'framer-motion';
import { RefreshCw, AlertTriangle, Info, Download } from 'lucide-react';
import { PredictionResult } from '../types';
import axios from 'axios';
import ChatBot from './ChatBot';
import { useReactToPrint } from 'react-to-print';

interface ResultsSectionProps {
  results: PredictionResult;
  originalImage: string | null;
  onNewAnalysis: () => void;
}

const ResultsSection: React.FC<ResultsSectionProps> = ({
  results,
  originalImage,
  onNewAnalysis
}) => {
  const [reportText, setReportText] = useState<string | null>(null);
  const [reportChecks, setReportChecks] = useState<{ [k: string]: boolean } | null>(null);
  const [reportLoading, setReportLoading] = useState<boolean>(false);

  // Use same API base logic as UploadSection

  // Declare API base URL once for all handlers
  const env = (import.meta as any).env;
  const API_BASE_URL = env?.VITE_API_BASE
    || (env?.MODE === 'production' ? 'https://your-vercel-domain.vercel.app/api' : 'http://127.0.0.1:5000');
  const CHAT_API_BASE_URL = env?.VITE_CHAT_API_BASE
    || (env?.MODE === 'production' ? 'https://your-vercel-domain.vercel.app/api' : 'http://127.0.0.1:5001');
  const reportControllerRef = React.useRef<AbortController | null>(null);
  
  const printRef = useRef<HTMLDivElement>(null);
  const handlePrint = useReactToPrint({
    contentRef: printRef,
    documentTitle: 'Diagnosis_Report',
  });

  // Cleanup files on backend when starting new analysis
  const handleNewAnalysisWithCleanup = () => {
    // Abort any pending report generation
    if (reportControllerRef.current) {
      reportControllerRef.current.abort();
      reportControllerRef.current = null;
    }

    // Fire-and-forget cleanup (don't await)
    axios.post(`${API_BASE_URL}/cleanup_files`).catch(err => {
      console.error('Cleanup failed:', err);
    });

    onNewAnalysis();
  };


  // Use same API base logic as UploadSection
  // Use API_BASE_URL from top-level scope

  const hasStructured = Array.isArray(results.predictions) && results.predictions.length > 0;

  const handleDownloadReport = async (isAutoTriggered = false) => {
    try {
      // Cancel previous request if exists
      if (reportControllerRef.current) {
        reportControllerRef.current.abort();
      }
      const controller = new AbortController();
      reportControllerRef.current = controller;

      setReportLoading(true);
      const instruction = 'Generate a detailed medical analysis report for a Tuberculosis detection case.';
      const inputStruct = {
        multiclass_label: results.multiclass || results.prediction,
        top_pathology_labels: (results.pathology_scores?.map(p => p.name) || results.pathology || []).slice(0, 5),
        predicted_tumor_type: results.tumor_subtype || '',
        confidence: typeof results.confidence === 'number' ? results.confidence : 0,
      };
      const payload: any = { instruction, input: inputStruct };
      console.log('Sending payload to /report:', payload);
      // Increase timeout to 2 minutes (120000 ms)
      const resp = await axios.post(`${CHAT_API_BASE_URL}/report`, payload, {
        timeout: 1200000,
        signal: controller.signal
      });
      console.log('Report API response:', resp.data);
      const data = resp.data;
      console.log('Parsing response data:', data);

      // Check if data is raw text
      if (typeof data === 'string') {
        setReportText(data);
        setReportChecks(null);
        return;
      }

      // Parse as JSON response
      if (data?.report) {
        // Clean any instruction/json artifacts from report
        let cleanReport = data.report;
        cleanReport = cleanReport.replace(/\{[^}]*\}/g, ''); // Remove JSON objects
        cleanReport = cleanReport.replace(/\[[^\]]*\]/g, ''); // Remove arrays
        cleanReport = cleanReport.replace(/(instruction:|input:).*/gi, ''); // Remove instruction lines
        cleanReport = cleanReport.trim();

        setReportText(cleanReport);
        setReportChecks(data.checks || null);
      } else if (data?.status === 'error' || data?.error) {
        console.error('Report error:', data.error || 'Unknown error');
        // Only throw error if manually triggered
        if (!isAutoTriggered) {
          throw new Error(data.error || 'Report generation failed');
        }
      } else {
        console.warn('Report API returned success but no report content:', data);
        // Only throw error if manually triggered
        if (!isAutoTriggered) {
          throw new Error('Report generated but no content returned');
        }
      }
      setReportLoading(false);
    } catch (error) {
      if (axios.isCancel(error)) {
        console.log('Report generation canceled');
        return;
      }
      console.error('Report download failed:', error);
      // Only alert if not canceled AND not auto-triggered
      if (!axios.isCancel(error) && !isAutoTriggered) {
        alert('Report generation failed. Please try again.');
      }
      setReportLoading(false);
    } finally {
      reportControllerRef.current = null;
    }
  };

  // Auto-trigger report generation once multitask results arrive, if not already generated
  useEffect(() => {
    const hasMT = !!(results.multiclass || results.prediction);
    if (hasMT && !reportText && !reportLoading) {
      // Start background generation, UI will show loader under results
      // Pass true to indicate this is auto-triggered (don't show alert on failure)
      handleDownloadReport(true);
    }

    // Cleanup on unmount or dependency change
    return () => {
      if (reportControllerRef.current) {
        reportControllerRef.current.abort();
      }
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [results.multiclass, results.prediction, results.tumor_subtype]);

  return (
    <>
      <div style={{ display: 'none' }}>
        <div ref={printRef} style={{ color: '#1a1a2e', fontFamily: "'Segoe UI', 'Helvetica Neue', Arial, sans-serif", padding: '40px', background: '#fff' }}>
          {/* Header Banner */}
          <div style={{ background: 'linear-gradient(135deg, #7c3aed, #6d28d9)', borderRadius: '12px', padding: '24px 32px', marginBottom: '28px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <div>
              <h1 style={{ fontSize: '26px', fontWeight: 800, color: '#fff', margin: 0, letterSpacing: '-0.5px' }}>TB Care — Diagnosis Report</h1>
              <p style={{ color: 'rgba(255,255,255,0.8)', margin: '4px 0 0', fontSize: '13px' }}>AI-Powered Tuberculosis Detection System</p>
            </div>
            <div style={{ textAlign: 'right' }}>
              <p style={{ color: '#fff', fontWeight: 600, margin: 0, fontSize: '14px' }}>Date: {new Date().toLocaleDateString('en-IN', { year: 'numeric', month: 'long', day: 'numeric' })}</p>
              <p style={{ color: 'rgba(255,255,255,0.7)', margin: '2px 0 0', fontSize: '12px' }}>Report ID: {Math.random().toString(36).substr(2, 9).toUpperCase()}</p>
            </div>
          </div>

          {/* Classification Card */}
          <div style={{ border: '2px solid #e5e7eb', borderRadius: '10px', padding: '20px', marginBottom: '24px', background: '#fafafa' }}>
            <h2 style={{ fontSize: '18px', fontWeight: 700, margin: '0 0 12px', color: '#374151', borderBottom: '2px solid #7c3aed', paddingBottom: '8px', display: 'inline-block' }}>Classification Result</h2>
            {hasStructured ? (
              <ul style={{ margin: '8px 0', paddingLeft: '20px', listStyle: 'disc' }}>
                {results.predictions!.map((p, idx) => (
                  <li key={idx} style={{ marginBottom: '4px', fontSize: '15px' }}>
                    <strong style={{ color: '#7c3aed' }}>{p.class.toUpperCase()}</strong> — {(p.confidence * 100).toFixed(1)}% confidence
                  </li>
                ))}
              </ul>
            ) : (
              <div style={{ display: 'flex', alignItems: 'baseline', gap: '12px', marginTop: '8px' }}>
                <span style={{ fontSize: '22px', fontWeight: 700, color: '#7c3aed' }}>{results.prediction || results.multiclass || 'N/A'}</span>
                <span style={{ fontSize: '14px', color: '#6b7280' }}>Confidence: {results.confidence ? (Number(results.confidence) * 100).toFixed(1) + '%' : 'N/A'}</span>
              </div>
            )}
            {results.tumor_subtype && (
              <p style={{ margin: '8px 0 0', fontSize: '14px', color: '#4b5563' }}>Subtype: <strong>{results.tumor_subtype}</strong></p>
            )}
          </div>

          {/* Images Row */}
          <div style={{ display: 'flex', gap: '16px', marginBottom: '28px' }}>
            <div style={{ flex: 1, border: '1px solid #e5e7eb', borderRadius: '10px', overflow: 'hidden' }}>
              <div style={{ background: '#f3f4f6', padding: '8px 12px', fontWeight: 600, fontSize: '13px', color: '#374151' }}>📷 Original X-ray</div>
              {originalImage && <img src={originalImage} style={{ width: '100%', height: 'auto', display: 'block' }} />}
            </div>
            <div style={{ flex: 1, border: '1px solid #e5e7eb', borderRadius: '10px', overflow: 'hidden' }}>
              <div style={{ background: '#f3f4f6', padding: '8px 12px', fontWeight: 600, fontSize: '13px', color: '#374151' }}>🔬 Segmentation</div>
              {results.segmentation_overlay ? (
                <img src={results.segmentation_overlay} style={{ width: '100%', height: 'auto', display: 'block' }} />
              ) : (
                <div style={{ height: '180px', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#9ca3af', fontSize: '13px' }}>Not available</div>
              )}
            </div>
            <div style={{ flex: 1, border: '1px solid #e5e7eb', borderRadius: '10px', overflow: 'hidden' }}>
              <div style={{ background: '#f3f4f6', padding: '8px 12px', fontWeight: 600, fontSize: '13px', color: '#374151' }}>🌡️ Grad-CAM Heatmap</div>
              {(results.gradcam_overlay || results.heatmap_data || results.heatmap_url) ? (
                <img src={results.gradcam_overlay || results.heatmap_data || `${API_BASE_URL}${results.heatmap_url}`} style={{ width: '100%', height: 'auto', display: 'block' }} />
              ) : (
                <div style={{ height: '180px', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#9ca3af', fontSize: '13px' }}>Not available</div>
              )}
            </div>
          </div>

          {/* AI Report Sections */}
          <div style={{ marginBottom: '28px' }}>
            <h2 style={{ fontSize: '20px', fontWeight: 700, marginBottom: '16px', color: '#1a1a2e', borderBottom: '2px solid #7c3aed', paddingBottom: '8px' }}>Detailed AI Analysis</h2>
            {(() => {
              const cleanText = reportText?.split('[/INST]').pop()?.trim() || reportText || 'No detailed report generated.';
              
              // Try to split into sections
              const sectionRegex = /^(\d+\.\s*.+)/gm;
              const parts = cleanText.split(sectionRegex).filter(s => s.trim());
              
              const sectionColors: Record<number, { bg: string; border: string; icon: string }> = {
                0: { bg: '#f5f3ff', border: '#c4b5fd', icon: '🔬' },
                1: { bg: '#f5f3ff', border: '#c4b5fd', icon: '🔬' },
                2: { bg: '#eff6ff', border: '#93c5fd', icon: '💬' },
                3: { bg: '#f0fdf4', border: '#86efac', icon: '💊' },
              };

              if (parts.length <= 1) {
                // Plain text fallback
                return cleanText.split('\n').map((line, i) => {
                  if (!line.trim()) return null;
                  if (line.match(/^\d\./)) return <h3 key={i} style={{ marginTop: '16px', fontWeight: 600, fontSize: '16px', color: '#374151' }}>{line}</h3>;
                  return <p key={i} style={{ margin: '4px 0', fontSize: '14px', color: '#4b5563', lineHeight: '1.6' }}>{line}</p>;
                });
              }

              let sectionIdx = 0;
              return parts.map((part, i) => {
                const isTitle = part.match(/^\d+\.\s/);
                if (isTitle) {
                  sectionIdx++;
                  const colors = sectionColors[sectionIdx] || sectionColors[3];
                  return (
                    <div key={i} style={{ background: colors.bg, border: `1px solid ${colors.border}`, borderRadius: '10px', padding: '16px 20px', marginBottom: '12px' }}>
                      <h3 style={{ fontSize: '15px', fontWeight: 700, margin: '0 0 8px', color: '#1e293b' }}>
                        {colors.icon} {part.replace(/^\d+\.\s*/, '')}
                      </h3>
                    </div>
                  );
                }
                return (
                  <div key={i} style={{ paddingLeft: '20px', marginBottom: '12px', marginTop: '-8px' }}>
                    {part.split('\n').map((line, j) => {
                      if (!line.trim()) return null;
                      const kvMatch = line.match(/^([A-Za-z\s]+):\s*(.+)/);
                      if (kvMatch) {
                        return (
                          <p key={j} style={{ margin: '3px 0', fontSize: '14px', lineHeight: '1.5' }}>
                            <strong style={{ color: '#374151' }}>{kvMatch[1]}:</strong>{' '}
                            <span style={{ color: '#4b5563' }}>{kvMatch[2]}</span>
                          </p>
                        );
                      }
                      return <p key={j} style={{ margin: '3px 0', fontSize: '14px', color: '#4b5563', lineHeight: '1.6' }}>{line}</p>;
                    })}
                  </div>
                );
              });
            })()}
          </div>

          {/* Footer */}
          <div style={{ borderTop: '2px solid #e5e7eb', paddingTop: '16px', marginTop: '32px', textAlign: 'center' }}>
            <p style={{ fontSize: '11px', color: '#9ca3af', lineHeight: '1.5', margin: '0 0 8px' }}>
              ⚠️ This report is generated by an Artificial Intelligence system and is intended for informational purposes only. It should not replace professional medical advice, diagnosis, or treatment. Always consult a qualified healthcare provider.
            </p>
            <p style={{ fontSize: '11px', color: '#b0b0b0', margin: 0 }}>
              TB Care — AI-Powered Tuberculosis Detection System · Report generated on {new Date().toLocaleString('en-IN')}
            </p>
          </div>
        </div>
      </div>

    <motion.div
      initial={{ opacity: 0, y: 50 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.8 }}
      className="space-y-8"
    >
      {/* Results Header */}
      <div className="bg-white  shadow-2xl p-8 border border-purple-200">
        <div className="text-center mb-8">
          <h2 className="text-3xl font-bold text-classic-text mb-2">
            Analysis Results
          </h2>
          <p className="text-classic-text-light">
            AI-powered Tuberculosis Detection Completed
          </p>
        </div>
        {/* PDF Download Button */}

        {results.warning && (
          <div className="mb-6 p-4 bg-yellow-50 border border-yellow-200  flex items-center space-x-2">
            <AlertTriangle className="w-5 h-5 text-yellow-600" />
            <span className="text-yellow-800">{results.warning}</span>
          </div>
        )}

        {hasStructured ? (
          <div className="mb-6">
            <h3 className="text-xl font-semibold mb-3 text-classic-text">Detected Tuberculosis Class:</h3>
            <ul className="space-y-2">
              {results.predictions!.map((p, idx) => (
                <li key={idx} className="flex justify-between bg-purple-50 border border-purple-200  px-3 py-2">
                  <span className="font-medium capitalize text-classic-text">{p.class}</span>
                  <span className="text-classic-text-light">{(p.confidence * 100).toFixed(1)}%</span>
                </li>
              ))}
            </ul>
            {results.xray_confirmed && (
              <p className="mt-3 text-sm text-green-700">X-ray confirmed ✅</p>
            )}
          </div>
        ) : (
          <div className="flex items-center justify-center space-x-4 mb-8">
            <Info className="w-8 h-8 text-medical-text" />
            <div>
              <h3 className="text-2xl font-bold mb-2">Classification</h3>
              {results.prediction && (
                <p className="text-classic-text">{results.prediction}</p>
              )}
              {typeof results.confidence === 'number' && (
                <p className="text-medical-text-light">Confidence: {(results.confidence * 100).toFixed(1)}%</p>
              )}
            </div>
          </div>
        )}

        {/* Keep a brief analysis note here (full report shown below the images) */}
        {!results.ai_report && (
          <div className="bg-purple-50  p-6 mb-8">
            <h4 className="font-semibold text-classic-text mb-3">Medical Analysis:</h4>
            <p className="text-classic-text-light leading-relaxed">
              {results.explanation || 'AI analysis completed successfully. Please consult with healthcare professionals for medical interpretation.'}
            </p>
          </div>
        )}

        <div className="flex justify-center gap-4 flex-wrap">
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={handlePrint}
            className="bg-green-600 hover:bg-green-700 text-white font-medium py-3 px-8 transition-colors duration-300 flex items-center space-x-2 shadow-lg"
          >
            <Download className="w-5 h-5" />
            <span>Download Diagnosis Report</span>
          </motion.button>
          
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={handleNewAnalysisWithCleanup}
            className="bg-purple-600 hover:bg-purple-700 text-white font-medium py-3 px-8  transition-colors duration-300 flex items-center space-x-2 shadow-lg"
          >
            <RefreshCw className="w-5 h-5" />
            <span>New Scan</span>
          </motion.button>
        </div>
      </div>


      {/* Image Comparison */}
      <div className="bg-white  shadow-2xl p-8 border border-purple-200">
        <h3 className="text-2xl font-bold text-classic-text mb-6 text-center">
          Comprehensive Analysis
        </h3>

        {/* Multitask Results */}
        {(results.multiclass || results.pathology || results.tumor_subtype) && (
          <div className="mb-8 grid md:grid-cols-3 gap-6">
            {results.multiclass && (
              <div className="bg-blue-50  p-4">
                <h4 className="font-semibold text-blue-900 mb-2">Tuberculosis Multiclass Classification</h4>
                <p className="text-red-600 capitalize text-2xl font-medium">{results.multiclass}</p>
              </div>
            )}

            {/* Tumor Subtype - only shown when available */}
            {results.tumor_subtype && (
              <div className="bg-purple-50  p-4">
                <h4 className="font-semibold text-purple-900 mb-2">Probable Tumor Type Identified</h4>
                <p className="text-purple-800 text-lg font-medium capitalize">
                  {results.tumor_subtype.replace('_', ' ')}
                </p>
              </div>
            )}

            {results.pathology && results.pathology.length > 0 && (
              <div className="bg-green-50  p-4">
                <h4 className="font-semibold text-green-900 mb-2">Probable Identified Locations</h4>
                {results.pathology_scores && results.pathology_scores.length > 0 ? (
                  <ul className="text-green-800 space-y-1">
                    {results.pathology_scores.map((p, idx) => (
                      <li key={idx} className="capitalize flex justify-between">
                        <span>• {p.name.replace('_', ' ')}</span>
                      </li>
                    ))}
                  </ul>
                ) : (
                  <ul className="text-green-800 space-y-1">
                    {results.pathology.map((path, idx) => (
                      <li key={idx} className="capitalize">• {path.replace('_', ' ')}</li>
                    ))}
                  </ul>
                )}
              </div>
            )}
          </div>
        )}

        <div className="grid lg:grid-cols-3 md:grid-cols-2 gap-6">
          {/* Original Image */}
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2, duration: 0.6 }}
            className="space-y-4"
          >
            <h4 className="text-lg font-semibold text-classic-text text-center">
              Original X-ray
            </h4>
            {originalImage && (
              <div className="bg-purple-50  p-4">
                <img
                  src={originalImage}
                  alt="Original medical scan"
                  className="w-full h-64 object-contain  shadow-lg"
                />
              </div>
            )}
          </motion.div>

          {/* Segmentation Overlay */}
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3, duration: 0.6 }}
            className="space-y-4"
          >
            <h4 className="text-lg font-semibold text-classic-text text-center">
              Tumor Segmentation
            </h4>
            <div className="bg-purple-50  p-4">
              {results.segmentation_overlay ? (
                <img
                  src={results.segmentation_overlay}
                  alt="Tumor segmentation overlay"
                  className="w-full h-64 object-contain  shadow-lg"
                />
              ) : (
                <div className="w-full h-64 bg-gray-200  flex items-center justify-center">
                  <p className="text-gray-500">Segmentation not available</p>
                </div>
              )}
            </div>
            <p className="text-sm text-classic-text-light text-center">
              Highlighted regions show detected tumor areas
            </p>
          </motion.div>

          {/* Grad-CAM Visualization */}
          <motion.div
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.4, duration: 0.6 }}
            className="space-y-4"
          >
            <h4 className="text-lg font-semibold text-classic-text text-center">
              Grad-CAM Highlights
            </h4>
            <div className="bg-purple-50  p-4">
              {results.gradcam_overlay ? (
                <img
                  src={results.gradcam_overlay}
                  alt="Grad-CAM attention heatmap"
                  className="w-full h-64 object-contain  shadow-lg"
                />
              ) : results.heatmap_data ? (
                <img
                  src={results.heatmap_data}
                  alt="Grad-CAM heatmap"
                  className="w-full h-64 object-contain  shadow-lg"
                />
              ) : results.heatmap_url ? (
                <img
                  src={`${API_BASE_URL}${results.heatmap_url}`}
                  alt="Grad-CAM heatmap"
                  className="w-full h-64 object-contain  shadow-lg"
                />
              ) : (
                <div className="w-full h-64 bg-gray-200  flex items-center justify-center">
                  <p className="text-gray-500">Heatmap not available</p>
                </div>
              )}
            </div>
            <p className="text-sm text-classic-text-light text-center">
              Areas AI focused on for decision making
            </p>
          </motion.div>
        </div>
      </div>
      {/* AI Report Section — placed below the multitask/image sections */}
      {reportLoading && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white shadow-2xl p-8 border border-purple-200 rounded-lg"
        >
          <div className="flex items-center justify-center space-x-3 mb-6">
            <div className="w-10 h-10 rounded-full bg-gradient-to-r from-purple-500 to-violet-600 flex items-center justify-center">
              <RefreshCw className="w-5 h-5 text-white animate-spin" />
            </div>
            <h3 className="text-2xl font-bold text-classic-text">Generating AI Report</h3>
          </div>
          <p className="text-center text-classic-text-light mb-6">Our AI is analyzing your results and preparing a detailed medical report...</p>
          {/* Skeleton loader */}
          <div className="space-y-4 animate-pulse">
            <div className="bg-purple-100 rounded-lg p-4">
              <div className="h-4 bg-purple-200 rounded w-1/3 mb-3"></div>
              <div className="h-3 bg-purple-200 rounded w-full mb-2"></div>
              <div className="h-3 bg-purple-200 rounded w-5/6 mb-2"></div>
              <div className="h-3 bg-purple-200 rounded w-4/6"></div>
            </div>
            <div className="bg-blue-50 rounded-lg p-4">
              <div className="h-4 bg-blue-200 rounded w-1/2 mb-3"></div>
              <div className="h-3 bg-blue-200 rounded w-full mb-2"></div>
              <div className="h-3 bg-blue-200 rounded w-3/4"></div>
            </div>
            <div className="bg-green-50 rounded-lg p-4">
              <div className="h-4 bg-green-200 rounded w-2/5 mb-3"></div>
              <div className="h-3 bg-green-200 rounded w-full mb-2"></div>
              <div className="h-3 bg-green-200 rounded w-5/6"></div>
            </div>
          </div>
        </motion.div>
      )}
      {reportText && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="bg-white shadow-2xl p-8 border border-purple-200 rounded-lg"
        >
          {/* Header */}
          <div className="flex items-center justify-center space-x-3 mb-2">
            <div className="w-10 h-10 rounded-full bg-gradient-to-r from-purple-500 to-violet-600 flex items-center justify-center">
              <Info className="w-5 h-5 text-white" />
            </div>
            <h3 className="text-2xl font-bold text-classic-text">
              AI-Generated Medical Report
            </h3>
          </div>
          <p className="text-center text-classic-text-light text-sm mb-6">
            Powered by Groq AI · For informational purposes only
          </p>

          {reportChecks && (
            <div className="flex flex-wrap gap-3 justify-center mb-6">
              <span className={`px-4 py-1.5 rounded-full text-sm font-medium transition-all ${reportChecks.key_findings ? 'bg-green-100 text-green-800 border border-green-300' : 'bg-gray-100 text-gray-500 border border-gray-200'}`}>
                {reportChecks.key_findings ? '✓' : '○'} Key Findings
              </span>
              <span className={`px-4 py-1.5 rounded-full text-sm font-medium transition-all ${reportChecks.patient_expl ? 'bg-green-100 text-green-800 border border-green-300' : 'bg-gray-100 text-gray-500 border border-gray-200'}`}>
                {reportChecks.patient_expl ? '✓' : '○'} Patient Explanation
              </span>
              <span className={`px-4 py-1.5 rounded-full text-sm font-medium transition-all ${reportChecks.treatment_plan ? 'bg-green-100 text-green-800 border border-green-300' : 'bg-gray-100 text-gray-500 border border-gray-200'}`}>
                {reportChecks.treatment_plan ? '✓' : '○'} Treatment Plan
              </span>
            </div>
          )}

          {/* Report Content — parsed into styled sections */}
          <div className="space-y-4">
            {(() => {
              const cleanText = reportText?.split('[/INST]').pop()?.trim() || reportText || '';
              const sections: { title: string; content: string; type: 'findings' | 'explanation' | 'treatment' | 'other' }[] = [];
              let currentSection: { title: string; lines: string[]; type: 'findings' | 'explanation' | 'treatment' | 'other' } | null = null;

              cleanText.split('\n').forEach((line) => {
                const trimmed = line.trim();
                if (!trimmed) return;

                if (trimmed.match(/^1\.\s/i) || trimmed.toLowerCase().includes('key findings')) {
                  if (currentSection) sections.push({ title: currentSection.title, content: currentSection.lines.join('\n'), type: currentSection.type });
                  currentSection = { title: trimmed, lines: [], type: 'findings' };
                } else if (trimmed.match(/^2\.\s/i) || trimmed.toLowerCase().includes('patient-friendly') || trimmed.toLowerCase().includes('patient explanation')) {
                  if (currentSection) sections.push({ title: currentSection.title, content: currentSection.lines.join('\n'), type: currentSection.type });
                  currentSection = { title: trimmed, lines: [], type: 'explanation' };
                } else if (trimmed.match(/^3\.\s/i) || trimmed.toLowerCase().includes('treatment plan') || trimmed.toLowerCase().includes('recommended')) {
                  if (currentSection) sections.push({ title: currentSection.title, content: currentSection.lines.join('\n'), type: currentSection.type });
                  currentSection = { title: trimmed, lines: [], type: 'treatment' };
                } else if (trimmed.match(/^\d+\.\s/) && !currentSection) {
                  currentSection = { title: trimmed, lines: [], type: 'other' };
                } else if (currentSection) {
                  currentSection.lines.push(trimmed);
                } else {
                  // Lines before any section
                  if (!sections.length && !currentSection) {
                    currentSection = { title: '', lines: [trimmed], type: 'other' };
                  }
                }
              });
              const lastSection = currentSection as { title: string; lines: string[]; type: 'findings' | 'explanation' | 'treatment' | 'other' } | null;
              if (lastSection) sections.push({ title: lastSection.title, content: lastSection.lines.join('\n'), type: lastSection.type });

              const sectionStyles = {
                findings: { bg: 'bg-purple-50', border: 'border-purple-200', icon: '🔬', iconBg: 'bg-purple-500', titleColor: 'text-purple-800' },
                explanation: { bg: 'bg-blue-50', border: 'border-blue-200', icon: '💬', iconBg: 'bg-blue-500', titleColor: 'text-blue-800' },
                treatment: { bg: 'bg-green-50', border: 'border-green-200', icon: '💊', iconBg: 'bg-green-500', titleColor: 'text-green-800' },
                other: { bg: 'bg-gray-50', border: 'border-gray-200', icon: '📋', iconBg: 'bg-gray-500', titleColor: 'text-gray-800' },
              };

              if (sections.length === 0) {
                // Fallback: render as plain text
                return (
                  <div className="bg-purple-50 rounded-lg p-6 border border-purple-200">
                    {cleanText.split('\n').map((line, i) => {
                      if (!line.trim()) return null;
                      if (line.match(/^\d\./)) return <h3 key={i} className="mt-4 font-semibold text-classic-text">{line}</h3>;
                      return <p key={i} className="text-classic-text-light leading-relaxed">{line}</p>;
                    })}
                  </div>
                );
              }

              return sections.map((section, idx) => {
                const style = sectionStyles[section.type];
                return (
                  <motion.div
                    key={idx}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: idx * 0.15, duration: 0.4 }}
                    className={`${style.bg} rounded-lg p-5 border ${style.border}`}
                  >
                    {section.title && (
                      <div className="flex items-center space-x-3 mb-3">
                        <span className="text-xl">{style.icon}</span>
                        <h4 className={`text-lg font-bold ${style.titleColor}`}>
                          {section.title.replace(/^\d+\.\s*/, '')}
                        </h4>
                      </div>
                    )}
                    <div className="pl-9 space-y-1.5">
                      {section.content.split('\n').map((line, i) => {
                        if (!line.trim()) return null;
                        // Render numbered steps as a styled list
                        const stepMatch = line.match(/^(\d+)\.\s*(.+)/);
                        if (stepMatch && section.type === 'treatment') {
                          return (
                            <div key={i} className="flex items-start space-x-3 py-1">
                              <span className={`flex-shrink-0 w-6 h-6 rounded-full ${style.iconBg} text-white text-xs flex items-center justify-center font-bold mt-0.5`}>
                                {stepMatch[1]}
                              </span>
                              <p className="text-classic-text leading-relaxed">{stepMatch[2]}</p>
                            </div>
                          );
                        }
                        // Render key-value pairs (like "Condition: ...")
                        const kvMatch = line.match(/^([A-Za-z\s]+):\s*(.+)/);
                        if (kvMatch && section.type === 'findings') {
                          return (
                            <div key={i} className="flex flex-col sm:flex-row sm:items-baseline py-0.5">
                              <span className="font-semibold text-classic-text min-w-[160px]">{kvMatch[1]}:</span>
                              <span className="text-classic-text-light">{kvMatch[2]}</span>
                            </div>
                          );
                        }
                        return <p key={i} className="text-classic-text-light leading-relaxed">{line}</p>;
                      })}
                    </div>
                  </motion.div>
                );
              });
            })()}
          </div>

          {/* Disclaimer */}
          <div className="mt-6 p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
            <p className="text-xs text-yellow-700 text-center">
              ⚠️ This report is AI-generated and for informational purposes only. It should not replace professional medical advice, diagnosis, or treatment. Please consult a qualified healthcare provider.
            </p>
          </div>
        </motion.div>
      )}

      {/* Embedded ChatBot Section */}
      <ChatBot predictionContext={results} />
    </motion.div>
    </>
  );
};

export default ResultsSection;
