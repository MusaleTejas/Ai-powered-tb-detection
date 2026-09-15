export interface PredictionItem {
  class: string;
  confidence: number;
  tumor_type?: string;
  pathologies?: string[];
}

export interface PredictionResult {
  // Core response fields
  xray_confirmed: boolean;
  message: string;
  
  // Multitask model outputs
  multiclass?: string;
  pathology?: string[];
  pathology_scores?: { name: string; prob: number }[];
  tumor_subtype?: string;
  tumor_subtype_confidence?: number;
  segmentation_mask?: string; // Base64 image
  segmentation_overlay?: string; // Base64 image
  gradcam_overlay?: string; // Base64 image
  uploaded_filename?: string; // Name of the uploaded file
  
  // Legacy compatibility
  predictions?: PredictionItem[];
  heatmap_url?: string;
  warning?: string;
  error?: string;

  // Legacy fields kept for compatibility with old UI
  prediction?: string;
  confidence?: number;
  explanation?: string;
  heatmap_data?: string; // Base64 encoded heatmap for Vercel
  model_used?: string;

  // AI report integration
  ai_report?: string;
  ai_checks?: { key_findings?: boolean; patient_expl?: boolean; treatment_plan?: boolean };
}

export interface Doctor {
  id: string;
  name: string;
  specialty: string;
  experienceYears: number;
  rating: number;
  availableDays: string[];
  slots: string[];
  fee: string;
}

export interface Hospital {
  id: string;
  name: string;
  category: 'Government DOTS Center' | 'Pulmonology Specialty' | 'Multi-Specialty Hospital' | 'Diagnostic & Chest Clinic';
  address: string;
  city: string;
  distanceKm: number;
  phone: string;
  emergency: string;
  rating: number;
  isGovernmentDOTS: boolean;
  hasSputumTesting: boolean;
  hasGeneXpert: boolean;
  hasChestXray: boolean;
  openHours: string;
  googleMapsUrl: string;
  doctors: Doctor[];
}

export interface AppointmentBooking {
  id: string;
  patientName: string;
  patientAge: string;
  patientGender: string;
  patientPhone: string;
  patientEmail?: string;
  hospital: Hospital;
  doctor: Doctor;
  appointmentDate: string;
  appointmentSlot: string;
  consultationType: 'in-person' | 'video';
  symptoms: string;
  reportContext?: {
    condition: string;
    confidence: string;
  };
  bookingDate: string;
  status: 'Confirmed' | 'Pending';
}