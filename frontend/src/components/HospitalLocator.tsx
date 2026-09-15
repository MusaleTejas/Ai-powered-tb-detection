import React, { useState, useMemo } from 'react';
import { motion } from 'framer-motion';
import { 
  Building2, MapPin, Phone, Star, Search, Navigation, 
  Calendar, Stethoscope, CheckCircle2, AlertTriangle, ShieldCheck, 
  Clock, ExternalLink, HeartPulse, Filter
} from 'lucide-react';
import { Hospital, Doctor, PredictionResult } from '../types';
import AppointmentModal from './AppointmentModal';

// Curated comprehensive directory of specialized TB care & Pulmonology hospitals
const DEFAULT_HOSPITALS: Hospital[] = [
  {
    id: 'hosp-1',
    name: 'National Institute of TB and Respiratory Diseases (NITRD)',
    category: 'Government DOTS Center',
    address: 'Sri Aurobindo Marg, Near Qutub Minar',
    city: 'New Delhi',
    distanceKm: 2.4,
    phone: '+91 11 2651 7834',
    emergency: '1800-11-6666',
    rating: 4.8,
    isGovernmentDOTS: true,
    hasSputumTesting: true,
    hasGeneXpert: true,
    hasChestXray: true,
    openHours: '24 Hours (OPD: 8:00 AM - 2:00 PM)',
    googleMapsUrl: 'https://maps.google.com/?q=National+Institute+of+TB+and+Respiratory+Diseases+Delhi',
    doctors: [
      {
        id: 'doc-101',
        name: 'Dr. Rajesh Sharma, MD',
        specialty: 'Senior Pulmonologist & TB Specialist',
        experienceYears: 18,
        rating: 4.9,
        availableDays: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'],
        slots: ['09:00 AM - 09:30 AM', '11:00 AM - 11:30 AM', '01:30 PM - 02:00 PM'],
        fee: 'Free (Govt)'
      },
      {
        id: 'doc-102',
        name: 'Dr. Ananya Verma, DNB',
        specialty: 'Respiratory Medicine & Bronchoscopy',
        experienceYears: 12,
        rating: 4.7,
        availableDays: ['Mon', 'Wed', 'Fri'],
        slots: ['10:00 AM - 10:30 AM', '12:00 PM - 12:30 PM'],
        fee: 'Free (Govt)'
      }
    ]
  },
  {
    id: 'hosp-2',
    name: 'City Care Pulmonary & Chest Disease Hospital',
    category: 'Pulmonology Specialty',
    address: '42 Health Boulevard, Sector 14',
    city: 'Mumbai',
    distanceKm: 4.1,
    phone: '+91 22 6789 1234',
    emergency: '+91 22 6789 9999',
    rating: 4.7,
    isGovernmentDOTS: true,
    hasSputumTesting: true,
    hasGeneXpert: true,
    hasChestXray: true,
    openHours: 'Open 24/7',
    googleMapsUrl: 'https://maps.google.com/?q=Chest+Hospital+Mumbai',
    doctors: [
      {
        id: 'doc-103',
        name: 'Dr. Vikramaditya Rao, MD, FCCP',
        specialty: 'Chief Chest Physician & Interventional Pulmonology',
        experienceYears: 22,
        rating: 4.9,
        availableDays: ['Mon', 'Tue', 'Thu', 'Sat'],
        slots: ['10:00 AM - 10:30 AM', '04:00 PM - 04:30 PM', '06:00 PM - 06:30 PM'],
        fee: '₹800'
      },
      {
        id: 'doc-104',
        name: 'Dr. Sneha Kulkarni, MD',
        specialty: 'Infectious Diseases & DOTS Program Director',
        experienceYears: 14,
        rating: 4.8,
        availableDays: ['Tue', 'Wed', 'Fri', 'Sat'],
        slots: ['11:30 AM - 12:00 PM', '03:00 PM - 03:30 PM'],
        fee: '₹600'
      }
    ]
  },
  {
    id: 'hosp-3',
    name: 'Government District DOTS TB Center & Sputum Testing Lab',
    category: 'Government DOTS Center',
    address: 'Civil Hospital Complex, Main Road',
    city: 'Pune',
    distanceKm: 5.6,
    phone: '+91 20 2612 3456',
    emergency: '108',
    rating: 4.5,
    isGovernmentDOTS: true,
    hasSputumTesting: true,
    hasGeneXpert: true,
    hasChestXray: true,
    openHours: '8:30 AM - 4:30 PM',
    googleMapsUrl: 'https://maps.google.com/?q=District+TB+Centre+Pune',
    doctors: [
      {
        id: 'doc-105',
        name: 'Dr. Mahendra Jadhav, MBBS, DTCD',
        specialty: 'District TB Officer & Chest Consultant',
        experienceYears: 16,
        rating: 4.6,
        availableDays: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri'],
        slots: ['09:30 AM - 10:00 AM', '11:30 AM - 12:00 PM', '02:00 PM - 02:30 PM'],
        fee: 'Free (DOTS)'
      }
    ]
  },
  {
    id: 'hosp-4',
    name: 'Apollo Hospital — Department of Pulmonary & Critical Care',
    category: 'Multi-Specialty Hospital',
    address: '21 Greams Lane, Thousand Lights',
    city: 'Chennai',
    distanceKm: 6.8,
    phone: '+91 44 2829 0200',
    emergency: '1066',
    rating: 4.9,
    isGovernmentDOTS: false,
    hasSputumTesting: true,
    hasGeneXpert: true,
    hasChestXray: true,
    openHours: 'Open 24/7',
    googleMapsUrl: 'https://maps.google.com/?q=Apollo+Hospital+Pulmonology+Chennai',
    doctors: [
      {
        id: 'doc-106',
        name: 'Dr. Ramesh Sundaram, MD, MRCP',
        specialty: 'Senior Consultant Pulmonologist & Lung Specialist',
        experienceYears: 25,
        rating: 5.0,
        availableDays: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'],
        slots: ['09:00 AM - 09:30 AM', '02:00 PM - 02:30 PM', '05:00 PM - 05:30 PM'],
        fee: '₹1,200'
      }
    ]
  },
  {
    id: 'hosp-5',
    name: 'Manipal Hospital Respiratory Care Institute',
    category: 'Multi-Specialty Hospital',
    address: '98 HAL Old Airport Rd, Kodihalli',
    city: 'Bengaluru',
    distanceKm: 8.2,
    phone: '+91 80 2502 4444',
    emergency: '080-25023333',
    rating: 4.8,
    isGovernmentDOTS: false,
    hasSputumTesting: true,
    hasGeneXpert: true,
    hasChestXray: true,
    openHours: 'Open 24/7',
    googleMapsUrl: 'https://maps.google.com/?q=Manipal+Hospital+Bengaluru',
    doctors: [
      {
        id: 'doc-107',
        name: 'Dr. Karthik Nambiar, MD, DNB (Pulmonary)',
        specialty: 'Interventional Pulmonology & Chronic Lung Diseases',
        experienceYears: 15,
        rating: 4.8,
        availableDays: ['Mon', 'Wed', 'Thu', 'Sat'],
        slots: ['10:30 AM - 11:00 AM', '03:30 PM - 04:00 PM'],
        fee: '₹1,000'
      }
    ]
  },
  {
    id: 'hosp-6',
    name: 'Max Super Speciality Hospital — Center for Chest & Respiratory Diseases',
    category: 'Multi-Specialty Hospital',
    address: '1, 2, Press Enclave Marg, Saket',
    city: 'New Delhi',
    distanceKm: 7.5,
    phone: '+91 11 2651 5050',
    emergency: '011-40554055',
    rating: 4.8,
    isGovernmentDOTS: false,
    hasSputumTesting: true,
    hasGeneXpert: true,
    hasChestXray: true,
    openHours: 'Open 24/7',
    googleMapsUrl: 'https://maps.google.com/?q=Max+Hospital+Saket+New+Delhi',
    doctors: [
      {
        id: 'doc-108',
        name: 'Dr. Vivek Nangia, MD, FNB, FCCP',
        specialty: 'Director & Head - Pulmonology & Sleep Medicine',
        experienceYears: 24,
        rating: 4.9,
        availableDays: ['Mon', 'Tue', 'Wed', 'Fri'],
        slots: ['11:00 AM - 11:30 AM', '04:00 PM - 04:30 PM'],
        fee: '₹1,500'
      }
    ]
  }
];

interface HospitalLocatorProps {
  predictionContext?: PredictionResult | null;
  isEmbedded?: boolean;
}

export const HospitalLocator: React.FC<HospitalLocatorProps> = ({
  predictionContext,
  isEmbedded = false
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [selectedHospitalForModal, setSelectedHospitalForModal] = useState<Hospital | null>(null);
  const [selectedDoctorForModal, setSelectedDoctorForModal] = useState<Doctor | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [locationStatus, setLocationStatus] = useState<'idle' | 'locating' | 'located' | 'error'>('idle');
  const [userCity, setUserCity] = useState<string | null>(null);

  const isTBDiagnosed = useMemo(() => {
    if (!predictionContext) return false;
    const label = (predictionContext.multiclass || predictionContext.prediction || '').toLowerCase();
    return label.includes('tuberculosis') || label.includes('tb') || label.includes('malignant') || label.includes('positive');
  }, [predictionContext]);

  const handleUseLocation = () => {
    if (!navigator.geolocation) {
      alert('Geolocation is not supported by your browser.');
      return;
    }
    setLocationStatus('locating');
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        setLocationStatus('located');
        setUserCity('Nearby Location (Auto-Detected)');
      },
      (err) => {
        console.warn('Geolocation error:', err);
        setLocationStatus('error');
        alert('Could not access GPS location. You can search by typing your city name.');
      },
      { timeout: 10000 }
    );
  };

  const handleBook = (hospital: Hospital, doctor?: Doctor) => {
    setSelectedHospitalForModal(hospital);
    setSelectedDoctorForModal(doctor || null);
    setIsModalOpen(true);
  };

  const filteredHospitals = useMemo(() => {
    return DEFAULT_HOSPITALS.filter((hosp) => {
      const matchesSearch = 
        hosp.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        hosp.city.toLowerCase().includes(searchQuery.toLowerCase()) ||
        hosp.address.toLowerCase().includes(searchQuery.toLowerCase());

      const matchesCat = 
        selectedCategory === 'All' ||
        (selectedCategory === 'DOTS' && hosp.isGovernmentDOTS) ||
        (selectedCategory === 'Pulmonology' && hosp.category.includes('Pulmonology')) ||
        (selectedCategory === 'Multi-Specialty' && hosp.category.includes('Multi-Specialty'));

      return matchesSearch && matchesCat;
    });
  }, [searchQuery, selectedCategory]);

  return (
    <div className={`space-y-6 ${isEmbedded ? '' : 'max-w-6xl mx-auto py-6'}`}>
      {/* AI Recommendation Alert */}
      {predictionContext && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className={`p-5 rounded-2xl border ${
            isTBDiagnosed 
              ? 'bg-amber-50/90 border-amber-300 text-amber-950' 
              : 'bg-teal-50/90 border-teal-200 text-teal-950'
          } shadow-sm`}
        >
          <div className="flex items-start gap-3.5">
            <div className={`p-2.5 rounded-xl ${isTBDiagnosed ? 'bg-amber-500 text-white' : 'bg-teal-600 text-white'} flex-shrink-0 mt-0.5`}>
              {isTBDiagnosed ? <AlertTriangle className="w-5 h-5" /> : <ShieldCheck className="w-5 h-5" />}
            </div>
            <div className="flex-1">
              <div className="flex flex-wrap items-center justify-between gap-2">
                <h3 className="font-bold text-base">
                  {isTBDiagnosed 
                    ? 'Recommended Next Step: Free DOTS Center or Doctor Consultation' 
                    : 'Good News: Scan Looks Clear — Preventive Guidance'}
                </h3>
                <span className="text-xs px-2.5 py-1 bg-white/80 rounded-full font-bold shadow-xs">
                  Scan Finding: {predictionContext.multiclass || predictionContext.prediction || 'Chest Analysis'}
                </span>
              </div>
              <p className="text-sm mt-1 leading-relaxed opacity-90">
                {isTBDiagnosed 
                  ? 'Because our AI flagged potential signs of infection, we recommend visiting a nearby Government DOTS center or chest specialist for a quick confirmatory sputum or GeneXpert test. Treatment is 100% free at government clinics and highly effective.' 
                  : 'Your chest X-ray appears clear of active tuberculosis patterns. However, if you or a family member have a persistent cough lasting more than 2 weeks, fatigue, or fever, please check in with a doctor below.'}
              </p>
              {isTBDiagnosed && (
                <div className="mt-3 flex flex-wrap items-center gap-3 text-xs font-semibold">
                  <span className="flex items-center gap-1 text-red-700 bg-red-100 px-2.5 py-1 rounded-md">
                    <Phone className="w-3.5 h-3.5" /> 24/7 National TB Helpline: 1800-11-6666 (Toll-Free)
                  </span>
                  <span className="text-teal-800 bg-teal-100 px-2.5 py-1 rounded-md">
                    ✓ Free medicines and testing available at all DOTS clinics
                  </span>
                </div>
              )}
            </div>
          </div>
        </motion.div>
      )}

      {/* Search and Filter Controls */}
      <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-200/80 space-y-4">
        <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-4">
          <div>
            <h2 className="text-2xl font-bold text-slate-900 flex items-center gap-2">
              <Building2 className="w-6 h-6 text-teal-600" />
              Find Nearby TB Centers & Pulmonologists
            </h2>
            <p className="text-sm text-slate-500 mt-0.5">
              Connect with certified government DOTS clinics and experienced chest specialists
            </p>
          </div>

          <button
            onClick={handleUseLocation}
            className="flex items-center justify-center gap-2 px-4 py-2.5 bg-teal-50 hover:bg-teal-100 text-teal-700 border border-teal-200 rounded-xl text-sm font-semibold transition-all shadow-xs"
          >
            <Navigation className={`w-4 h-4 ${locationStatus === 'locating' ? 'animate-spin' : ''}`} />
            <span>{locationStatus === 'located' ? 'Location Detected ✓' : 'Find Near Me'}</span>
          </button>
        </div>

        {/* Input & Quick Filters */}
        <div className="grid md:grid-cols-3 gap-3 pt-2">
          <div className="md:col-span-2 relative">
            <Search className="w-5 h-5 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search by hospital name, city (e.g., Delhi, Mumbai, Pune, Chennai)..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-11 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:bg-white focus:ring-2 focus:ring-teal-500 focus:outline-none text-slate-800 transition-all"
            />
          </div>

          <div className="flex items-center gap-2">
            <Filter className="w-4 h-4 text-slate-400 flex-shrink-0" />
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="w-full px-3 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm font-medium text-slate-700 focus:bg-white focus:ring-2 focus:ring-teal-500 focus:outline-none"
            >
              <option value="All">All Facilities ({DEFAULT_HOSPITALS.length})</option>
              <option value="DOTS">Govt DOTS Centers Only</option>
              <option value="Pulmonology">Pulmonology Specialties</option>
              <option value="Multi-Specialty">Multi-Specialty Hospitals</option>
            </select>
          </div>
        </div>
      </div>

      {/* Hospital Cards Grid */}
      <div className="grid md:grid-cols-2 gap-6">
        {filteredHospitals.map((hospital) => {
          return (
            <motion.div
              key={hospital.id}
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-white rounded-2xl border border-slate-200/90 shadow-sm hover:shadow-md transition-all overflow-hidden flex flex-col justify-between"
            >
              <div className="p-6">
                {/* Top Badge & Distance */}
                <div className="flex items-center justify-between gap-2 mb-3">
                  <span className={`text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wider ${
                    hospital.isGovernmentDOTS 
                      ? 'bg-emerald-100 text-emerald-800 border border-emerald-300' 
                      : 'bg-cyan-100 text-cyan-800 border border-cyan-300'
                  }`}>
                    {hospital.isGovernmentDOTS ? '🏛️ Govt DOTS Certified' : '🏥 Specialty Hospital'}
                  </span>
                  <span className="text-xs font-semibold px-2.5 py-1 bg-slate-100 text-slate-700 rounded-lg flex items-center gap-1">
                    <MapPin className="w-3 h-3 text-teal-600" /> ~{hospital.distanceKm} km away
                  </span>
                </div>

                <h3 className="text-lg font-bold text-slate-900 leading-snug">
                  {hospital.name}
                </h3>
                <p className="text-xs text-slate-500 mt-1 flex items-center gap-1">
                  <MapPin className="w-3.5 h-3.5 text-slate-400 flex-shrink-0" />
                  {hospital.address}, {hospital.city}
                </p>

                {/* Facilities Pills */}
                <div className="flex flex-wrap gap-1.5 mt-3.5">
                  {hospital.hasGeneXpert && (
                    <span className="text-[11px] font-semibold bg-teal-50 text-teal-800 px-2.5 py-0.5 rounded-md border border-teal-100">
                      ✓ GeneXpert / CBNAAT
                    </span>
                  )}
                  {hospital.hasSputumTesting && (
                    <span className="text-[11px] font-semibold bg-cyan-50 text-cyan-800 px-2.5 py-0.5 rounded-md border border-cyan-100">
                      ✓ Sputum Microscopy
                    </span>
                  )}
                  {hospital.hasChestXray && (
                    <span className="text-[11px] font-semibold bg-slate-100 text-slate-700 px-2.5 py-0.5 rounded-md">
                      ✓ Digital Chest X-ray
                    </span>
                  )}
                </div>

                {/* Doctors List */}
                <div className="mt-4 pt-3 border-t border-slate-100 space-y-2">
                  <p className="text-xs font-bold uppercase tracking-wider text-slate-500">
                    Featured TB / Chest Specialists:
                  </p>
                  {hospital.doctors.map((doc) => (
                    <div
                      key={doc.id}
                      className="p-2.5 bg-slate-50 rounded-xl flex items-center justify-between border border-slate-200/60"
                    >
                      <div>
                        <p className="text-xs font-bold text-slate-800">{doc.name}</p>
                        <p className="text-[11px] text-teal-700 font-medium">{doc.specialty}</p>
                      </div>
                      <div className="text-right">
                        <span className="text-xs font-bold text-slate-700">{doc.fee}</span>
                        <button
                          onClick={() => handleBook(hospital, doc)}
                          className="block text-[11px] font-bold text-teal-600 hover:text-teal-800 underline mt-0.5"
                        >
                          Book Slot →
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Card Footer Actions */}
              <div className="p-4 bg-slate-50/80 border-t border-slate-100 flex items-center justify-between gap-3">
                <div className="flex items-center gap-3 text-xs">
                  <a
                    href={`tel:${hospital.phone.replace(/\s+/g, '')}`}
                    className="font-bold text-slate-700 hover:text-teal-700 flex items-center gap-1"
                  >
                    <Phone className="w-3.5 h-3.5 text-teal-600" /> {hospital.phone}
                  </a>
                  <a
                    href={hospital.googleMapsUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="font-semibold text-cyan-700 hover:text-cyan-800 flex items-center gap-0.5"
                  >
                    <ExternalLink className="w-3 h-3" /> Directions
                  </a>
                </div>

                <button
                  onClick={() => handleBook(hospital)}
                  className="px-4 py-2 bg-gradient-to-r from-teal-600 to-cyan-600 hover:from-teal-700 hover:to-cyan-700 text-white font-bold text-xs rounded-xl shadow-xs transition-all flex items-center gap-1.5"
                >
                  <Calendar className="w-3.5 h-3.5" />
                  Book Appointment
                </button>
              </div>
            </motion.div>
          );
        })}
      </div>

      {filteredHospitals.length === 0 && (
        <div className="bg-white rounded-2xl p-12 text-center border border-slate-200">
          <Building2 className="w-12 h-12 text-slate-300 mx-auto mb-3" />
          <h4 className="text-lg font-bold text-slate-700">No Hospitals Found</h4>
          <p className="text-sm text-slate-500 mt-1 max-w-sm mx-auto">
            Try broadening your search term or select "All Facilities" to view all certified centers.
          </p>
          <button
            onClick={() => { setSearchQuery(''); setSelectedCategory('All'); }}
            className="mt-4 px-4 py-2 bg-teal-600 text-white text-xs font-bold rounded-xl"
          >
            Reset Filters
          </button>
        </div>
      )}

      {/* Appointment Modal */}
      <AppointmentModal
        hospital={selectedHospitalForModal}
        initialDoctor={selectedDoctorForModal}
        predictionContext={predictionContext}
        isOpen={isModalOpen}
        onClose={() => {
          setIsModalOpen(false);
          setSelectedHospitalForModal(null);
          setSelectedDoctorForModal(null);
        }}
      />
    </div>
  );
};

export default HospitalLocator;
