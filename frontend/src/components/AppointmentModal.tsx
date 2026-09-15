import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  X, Calendar, Clock, User, Phone, Mail, Stethoscope, 
  MapPin, CheckCircle, Download, Printer, ShieldCheck, AlertCircle, Video, Building2
} from 'lucide-react';
import { Hospital, Doctor, PredictionResult, AppointmentBooking } from '../types';

interface AppointmentModalProps {
  hospital: Hospital | null;
  initialDoctor?: Doctor | null;
  predictionContext?: PredictionResult | null;
  isOpen: boolean;
  onClose: () => void;
}

export const AppointmentModal: React.FC<AppointmentModalProps> = ({
  hospital,
  initialDoctor,
  predictionContext,
  isOpen,
  onClose
}) => {
  const [step, setStep] = useState<'form' | 'confirmed'>('form');
  const [selectedDoctor, setSelectedDoctor] = useState<Doctor | null>(
    initialDoctor || (hospital?.doctors && hospital.doctors.length > 0 ? hospital.doctors[0] : null)
  );
  
  // Form fields
  const [patientName, setPatientName] = useState('');
  const [patientAge, setPatientAge] = useState('');
  const [patientGender, setPatientGender] = useState('Female');
  const [patientPhone, setPatientPhone] = useState('');
  const [patientEmail, setPatientEmail] = useState('');
  const [appointmentDate, setAppointmentDate] = useState(() => {
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    return tomorrow.toISOString().split('T')[0];
  });
  const [appointmentSlot, setAppointmentSlot] = useState(
    selectedDoctor?.slots?.[0] || '10:00 AM - 10:30 AM'
  );
  const [consultationType, setConsultationType] = useState<'in-person' | 'video'>('in-person');
  const [symptoms, setSymptoms] = useState(() => {
    if (predictionContext?.multiclass) {
      return `AI Scan Result: ${predictionContext.multiclass} (${(Number(predictionContext.confidence || 0) * 100).toFixed(0)}% confidence). Seeking specialist consultation.`;
    }
    return 'Routine TB / Chest X-ray evaluation consultation.';
  });
  const [errors, setErrors] = useState<{ [k: string]: string }>({});
  const [bookingResult, setBookingResult] = useState<AppointmentBooking | null>(null);

  // Sync selected doctor when hospital changes
  React.useEffect(() => {
    if (initialDoctor) {
      setSelectedDoctor(initialDoctor);
      setAppointmentSlot(initialDoctor.slots?.[0] || '10:00 AM - 10:30 AM');
    } else if (hospital && hospital.doctors.length > 0) {
      setSelectedDoctor(hospital.doctors[0]);
      setAppointmentSlot(hospital.doctors[0].slots?.[0] || '10:00 AM - 10:30 AM');
    }
  }, [hospital, initialDoctor]);

  if (!isOpen || !hospital) return null;

  const validate = () => {
    const errs: { [k: string]: string } = {};
    if (!patientName.trim()) errs.patientName = 'Please enter patient name';
    if (!patientAge.trim() || isNaN(Number(patientAge))) errs.patientAge = 'Please enter valid age';
    if (!patientPhone.trim() || patientPhone.replace(/\D/g, '').length < 10) {
      errs.patientPhone = 'Please enter valid 10-digit phone number';
    }
    if (!appointmentDate) errs.appointmentDate = 'Please select a date';
    if (!selectedDoctor) errs.doctor = 'Please select a doctor';
    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleBook = (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate() || !selectedDoctor) return;

    const booking: AppointmentBooking = {
      id: `TB-APT-${Math.floor(100000 + Math.random() * 900000)}`,
      patientName,
      patientAge,
      patientGender,
      patientPhone,
      patientEmail,
      hospital,
      doctor: selectedDoctor,
      appointmentDate,
      appointmentSlot,
      consultationType,
      symptoms,
      reportContext: predictionContext ? {
        condition: predictionContext.multiclass || predictionContext.prediction || 'TB Evaluation',
        confidence: typeof predictionContext.confidence === 'number' 
          ? `${(predictionContext.confidence * 100).toFixed(1)}%` 
          : 'N/A'
      } : undefined,
      bookingDate: new Date().toLocaleString('en-IN'),
      status: 'Confirmed'
    };

    setBookingResult(booking);
    setStep('confirmed');
  };

  const handlePrint = () => {
    window.print();
  };

  const handleResetAndClose = () => {
    setStep('form');
    onClose();
  };

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm overflow-y-auto">
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 20 }}
          transition={{ duration: 0.25 }}
          className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full overflow-hidden border border-teal-100 my-8"
        >
          {/* Header */}
          <div className="bg-gradient-to-r from-teal-700 via-teal-600 to-cyan-700 text-white p-6 relative">
            <button
              onClick={handleResetAndClose}
              className="absolute top-5 right-5 text-white/80 hover:text-white p-1 rounded-full hover:bg-white/10 transition-colors"
            >
              <X className="w-6 h-6" />
            </button>
            <div className="flex items-center space-x-3">
              <div className="w-12 h-12 rounded-xl bg-white/15 flex items-center justify-center backdrop-blur-sm border border-white/20">
                <Stethoscope className="w-6 h-6 text-cyan-200" />
              </div>
              <div>
                <span className="text-xs uppercase tracking-wider font-semibold text-cyan-200">
                  {hospital.category}
                </span>
                <h3 className="text-2xl font-bold">{hospital.name}</h3>
                <p className="text-sm text-teal-100 flex items-center gap-1 mt-0.5">
                  <MapPin className="w-3.5 h-3.5 flex-shrink-0" />
                  {hospital.address}, {hospital.city}
                </p>
              </div>
            </div>
          </div>

          {/* Body */}
          <div className="p-6">
            {step === 'form' ? (
              <form onSubmit={handleBook} className="space-y-5">
                {/* Doctor Selection */}
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-2">
                    Select Specialist / Doctor
                  </label>
                  <div className="grid sm:grid-cols-2 gap-3">
                    {hospital.doctors.map((doc) => {
                      const isSelected = selectedDoctor?.id === doc.id;
                      return (
                        <div
                          key={doc.id}
                          onClick={() => {
                            setSelectedDoctor(doc);
                            if (doc.slots?.length) setAppointmentSlot(doc.slots[0]);
                          }}
                          className={`p-3 rounded-xl border-2 cursor-pointer transition-all ${
                            isSelected
                              ? 'border-teal-600 bg-teal-50/70 shadow-sm'
                              : 'border-slate-200 hover:border-teal-300 bg-slate-50/50'
                          }`}
                        >
                          <div className="flex items-start justify-between">
                            <div>
                              <p className="font-bold text-slate-800 text-sm">{doc.name}</p>
                              <p className="text-xs text-teal-700 font-medium">{doc.specialty}</p>
                              <p className="text-xs text-slate-500 mt-1">{doc.experienceYears} yrs exp · ★ {doc.rating}</p>
                            </div>
                            <span className="text-xs font-semibold px-2 py-0.5 rounded bg-white text-slate-700 border border-slate-200">
                              {doc.fee}
                            </span>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                  {errors.doctor && <p className="text-red-600 text-xs mt-1">{errors.doctor}</p>}
                </div>

                {/* Date & Time Slot */}
                <div className="grid sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1 flex items-center gap-1">
                      <Calendar className="w-3.5 h-3.5 text-teal-600" /> Preferred Date
                    </label>
                    <input
                      type="date"
                      min={new Date().toISOString().split('T')[0]}
                      value={appointmentDate}
                      onChange={(e) => setAppointmentDate(e.target.value)}
                      className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:outline-none text-sm text-slate-800"
                    />
                    {errors.appointmentDate && <p className="text-red-600 text-xs mt-1">{errors.appointmentDate}</p>}
                  </div>

                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1 flex items-center gap-1">
                      <Clock className="w-3.5 h-3.5 text-teal-600" /> Available Slot
                    </label>
                    <select
                      value={appointmentSlot}
                      onChange={(e) => setAppointmentSlot(e.target.value)}
                      className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:outline-none text-sm text-slate-800 bg-white"
                    >
                      {selectedDoctor?.slots?.map((slot, i) => (
                        <option key={i} value={slot}>
                          {slot}
                        </option>
                      )) || <option>10:00 AM - 10:30 AM</option>}
                    </select>
                  </div>
                </div>

                {/* Consultation Type */}
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-2">
                    Consultation Mode
                  </label>
                  <div className="flex gap-4">
                    <label className={`flex-1 flex items-center justify-center gap-2 p-3 rounded-lg border-2 cursor-pointer transition-all ${consultationType === 'in-person' ? 'border-teal-600 bg-teal-50 font-bold text-teal-800' : 'border-slate-200 text-slate-600'}`}>
                      <input
                        type="radio"
                        name="type"
                        value="in-person"
                        checked={consultationType === 'in-person'}
                        onChange={() => setConsultationType('in-person')}
                        className="hidden"
                      />
                      <Building2 className="w-4 h-4 text-teal-600" />
                      <span className="text-sm">In-Person Visit</span>
                    </label>
                    <label className={`flex-1 flex items-center justify-center gap-2 p-3 rounded-lg border-2 cursor-pointer transition-all ${consultationType === 'video' ? 'border-teal-600 bg-teal-50 font-bold text-teal-800' : 'border-slate-200 text-slate-600'}`}>
                      <input
                        type="radio"
                        name="type"
                        value="video"
                        checked={consultationType === 'video'}
                        onChange={() => setConsultationType('video')}
                        className="hidden"
                      />
                      <Video className="w-4 h-4 text-cyan-600" />
                      <span className="text-sm">Video Consultation</span>
                    </label>
                  </div>
                </div>

                {/* Patient Information */}
                <div className="space-y-3 pt-2 border-t border-slate-100">
                  <h4 className="text-xs font-bold uppercase tracking-wider text-slate-700 flex items-center gap-1">
                    <User className="w-3.5 h-3.5 text-teal-600" /> Patient Details
                  </h4>
                  <div className="grid sm:grid-cols-3 gap-3">
                    <div className="sm:col-span-2">
                      <input
                        type="text"
                        placeholder="Full Patient Name *"
                        value={patientName}
                        onChange={(e) => setPatientName(e.target.value)}
                        className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm focus:ring-2 focus:ring-teal-500 focus:outline-none"
                      />
                      {errors.patientName && <p className="text-red-600 text-xs mt-1">{errors.patientName}</p>}
                    </div>
                    <div>
                      <input
                        type="number"
                        placeholder="Age *"
                        value={patientAge}
                        onChange={(e) => setPatientAge(e.target.value)}
                        className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm focus:ring-2 focus:ring-teal-500 focus:outline-none"
                      />
                      {errors.patientAge && <p className="text-red-600 text-xs mt-1">{errors.patientAge}</p>}
                    </div>
                  </div>

                  <div className="grid sm:grid-cols-2 gap-3">
                    <div>
                      <input
                        type="tel"
                        placeholder="Phone Number (10-digits) *"
                        value={patientPhone}
                        onChange={(e) => setPatientPhone(e.target.value)}
                        className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm focus:ring-2 focus:ring-teal-500 focus:outline-none"
                      />
                      {errors.patientPhone && <p className="text-red-600 text-xs mt-1">{errors.patientPhone}</p>}
                    </div>
                    <div>
                      <input
                        type="email"
                        placeholder="Email Address (optional)"
                        value={patientEmail}
                        onChange={(e) => setPatientEmail(e.target.value)}
                        className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm focus:ring-2 focus:ring-teal-500 focus:outline-none"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs text-slate-500 mb-1">
                      Symptoms / AI Report Context to share with Doctor
                    </label>
                    <textarea
                      rows={2}
                      value={symptoms}
                      onChange={(e) => setSymptoms(e.target.value)}
                      className="w-full px-3 py-2 border border-slate-300 rounded-lg text-xs focus:ring-2 focus:ring-teal-500 focus:outline-none text-slate-700 bg-slate-50"
                    />
                  </div>
                </div>

                {/* Submit button */}
                <div className="pt-3 flex gap-3">
                  <button
                    type="button"
                    onClick={handleResetAndClose}
                    className="flex-1 py-3 px-4 border border-slate-300 rounded-xl font-medium text-slate-600 hover:bg-slate-50 transition-colors text-sm"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="flex-2 py-3 px-6 bg-gradient-to-r from-teal-600 to-cyan-600 hover:from-teal-700 hover:to-cyan-700 text-white font-bold rounded-xl shadow-medical transition-all text-sm flex items-center justify-center gap-2"
                  >
                    <ShieldCheck className="w-4 h-4" />
                    Confirm Appointment & Get Ticket
                  </button>
                </div>
              </form>
            ) : (
              /* Confirmation Ticket View */
              <div className="space-y-6 text-center">
                <div className="w-16 h-16 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto shadow-inner">
                  <CheckCircle className="w-10 h-10" />
                </div>
                <div>
                  <span className="inline-block px-3 py-1 bg-emerald-50 text-emerald-700 text-xs font-bold rounded-full border border-emerald-200 mb-2">
                    Booking Confirmed • Free DOTS / Clinical Pass
                  </span>
                  <h3 className="text-2xl font-bold text-slate-900">
                    Appointment Successfully Scheduled!
                  </h3>
                  <p className="text-sm text-slate-600 max-w-md mx-auto mt-1">
                    An SMS confirmation has been generated with your appointment token. Please bring your X-ray scan report to the clinic.
                  </p>
                </div>

                {/* Printable Ticket Card */}
                {bookingResult && (
                  <div className="bg-slate-50 border-2 border-dashed border-teal-300 rounded-2xl p-6 text-left relative overflow-hidden">
                    <div className="flex justify-between items-start border-b border-slate-200 pb-4 mb-4">
                      <div>
                        <p className="text-xs font-bold uppercase tracking-wider text-teal-700">Token ID</p>
                        <p className="text-xl font-extrabold text-slate-900 tracking-wider font-mono">{bookingResult.id}</p>
                      </div>
                      <div className="text-right">
                        <span className="text-xs px-2.5 py-1 bg-teal-100 text-teal-800 rounded-md font-bold uppercase">
                          {bookingResult.consultationType === 'video' ? '📹 Video Call' : '🏥 In-Clinic'}
                        </span>
                      </div>
                    </div>

                    <div className="grid sm:grid-cols-2 gap-4 text-sm mb-4">
                      <div>
                        <p className="text-xs text-slate-500">Patient Name</p>
                        <p className="font-bold text-slate-800">{bookingResult.patientName} ({bookingResult.patientAge} yrs, {bookingResult.patientGender})</p>
                        <p className="text-xs text-slate-500 mt-1">Contact: {bookingResult.patientPhone}</p>
                      </div>
                      <div>
                        <p className="text-xs text-slate-500">Consulting Specialist</p>
                        <p className="font-bold text-slate-800">{bookingResult.doctor.name}</p>
                        <p className="text-xs text-teal-700">{bookingResult.doctor.specialty}</p>
                      </div>
                    </div>

                    <div className="grid sm:grid-cols-2 gap-4 text-sm pt-3 border-t border-slate-200">
                      <div>
                        <p className="text-xs text-slate-500">Hospital / Center</p>
                        <p className="font-semibold text-slate-800">{bookingResult.hospital.name}</p>
                        <p className="text-xs text-slate-500">{bookingResult.hospital.address}</p>
                      </div>
                      <div>
                        <p className="text-xs text-slate-500">Date & Time Slot</p>
                        <p className="font-bold text-slate-900">{bookingResult.appointmentDate}</p>
                        <p className="text-sm font-semibold text-teal-700">{bookingResult.appointmentSlot}</p>
                      </div>
                    </div>

                    {bookingResult.reportContext && (
                      <div className="mt-4 p-2.5 bg-teal-100/60 rounded-lg text-xs text-teal-900 flex items-center justify-between">
                        <span>Attached AI Findings: <strong>{bookingResult.reportContext.condition}</strong></span>
                        <span className="font-bold">Confidence: {bookingResult.reportContext.confidence}</span>
                      </div>
                    )}
                  </div>
                )}

                <div className="flex gap-3 justify-center">
                  <button
                    type="button"
                    onClick={handlePrint}
                    className="py-2.5 px-5 bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold rounded-xl text-sm flex items-center gap-2 transition-colors"
                  >
                    <Printer className="w-4 h-4" />
                    Print Ticket
                  </button>
                  <button
                    type="button"
                    onClick={handleResetAndClose}
                    className="py-2.5 px-6 bg-teal-600 hover:bg-teal-700 text-white font-bold rounded-xl text-sm flex items-center gap-2 shadow-sm transition-colors"
                  >
                    Done & Return
                  </button>
                </div>
              </div>
            )}
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};

export default AppointmentModal;
