import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  Github, Linkedin, Mail, ArrowLeft, Heart, Activity, 
  Brain, ShieldCheck, Sparkles, Stethoscope, Code2, Scan, 
  ExternalLink, Building2, Award, Cpu, BookOpen, CheckCircle2, User,
  Send, Phone, MessageSquare, AlertCircle, RefreshCw
} from 'lucide-react';
import axios from 'axios';
import Header from './Header';
import Footer from './Footer';
import tejasProfilePic from '../tejas_profile.jpg';

interface AboutUsProps {
  onBackToHome: () => void;
  onNavigateToScan: () => void;
  onNavigateToHospitals: () => void;
}

export const AboutUs: React.FC<AboutUsProps> = ({
  onBackToHome,
  onNavigateToScan,
  onNavigateToHospitals
}) => {
  // Contact Form State
  const [contactName, setContactName] = useState('');
  const [contactEmail, setContactEmail] = useState('');
  const [contactPhone, setContactPhone] = useState('');
  const [contactSubject, setContactSubject] = useState('General Inquiry');
  const [contactMessage, setContactMessage] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState<'idle' | 'success' | 'error'>('idle');
  const [errorMessage, setErrorMessage] = useState('');

  const devLinks = [
    {
      name: 'GitHub Profile',
      url: 'https://github.com/MusaleTejas',
      icon: Github,
      color: 'hover:bg-slate-900 hover:text-white',
      badge: '@MusaleTejas'
    },
    {
      name: 'LinkedIn Profile',
      url: 'https://www.linkedin.com/in/tejas-musale',
      icon: Linkedin,
      color: 'hover:bg-blue-600 hover:text-white',
      badge: 'in/tejas-musale'
    },
    {
      name: 'Email Contact',
      url: 'mailto:tejasmusale830@gmail.com',
      icon: Mail,
      color: 'hover:bg-teal-600 hover:text-white',
      badge: 'tejasmusale830@gmail.com'
    }
  ];

  const projectMilestones = [
    {
      icon: Brain,
      title: 'Deep Learning Radiograph Analysis',
      desc: 'Trained on chest X-ray datasets using EfficientNet architecture for automated pulmonary opacity and infiltration detection.'
    },
    {
      icon: Scan,
      title: 'Explainable AI & Grad-CAM',
      desc: 'Generates gradient-weighted class activation heatmaps so clinicians can inspect the exact focal regions driving model decisions.'
    },
    {
      icon: Sparkles,
      title: 'Groq-Accelerated Clinical Reports',
      desc: 'Synthesizes structured medical reports, symptoms, precautions, and DOTS treatment schedules aligned with CDC guidelines.'
    },
    {
      icon: Building2,
      title: 'Geo-Enabled Care & Hospital Locator',
      desc: 'Bridges screening with actionable care, guiding patients to nearby government DOTS centers and facilitating doctor bookings.'
    }
  ];

  const medicalReferences = [
    {
      title: 'The Radiology Assistant',
      desc: 'Imaging findings in Tuberculosis (Cavitation, consolidation, tree-in-bud, lymphadenopathy)',
      url: 'https://radiologyassistant.nl/chest/tb/tuberculosis'
    },
    {
      title: 'CDC TB Guidelines',
      desc: 'Diagnosing Tuberculosis: Sputum smear microscopy, GeneXpert molecular testing, & standard regimens',
      url: 'https://www.cdc.gov/tb/testing/diagnosing-tuberculosis.html'
    },
    {
      title: 'WHO End TB Strategy',
      desc: 'Global initiative aimed at ending the global tuberculosis epidemic through early diagnosis and universal access',
      url: 'https://www.who.int/teams/global-tuberculosis-programme/the-end-tb-strategy'
    }
  ];

  const handleContactSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!contactName.trim() || !contactEmail.trim() || !contactMessage.trim()) {
      setErrorMessage('Please fill in all required fields (Name, Email, Message).');
      setSubmitStatus('error');
      return;
    }

    setIsSubmitting(true);
    setSubmitStatus('idle');
    setErrorMessage('');

    try {
      // Direct email submission using FormSubmit endpoint targeting tejasmusale830@gmail.com
      const payload = {
        name: contactName,
        email: contactEmail,
        phone: contactPhone || 'Not provided',
        subject: `[TB Care AI] ${contactSubject} - from ${contactName}`,
        message: contactMessage,
        _subject: `[TB Care AI] ${contactSubject} - from ${contactName}`,
        _template: 'table',
        _captcha: 'false'
      };

      const response = await axios.post('https://formsubmit.co/ajax/tejasmusale830@gmail.com', payload, {
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        },
        timeout: 20000
      });

      if (response.status === 200 || response.data?.success) {
        setSubmitStatus('success');
        setContactName('');
        setContactEmail('');
        setContactPhone('');
        setContactMessage('');
      } else {
        throw new Error('Could not submit form. Please use the direct email link.');
      }
    } catch (err: any) {
      console.error('Contact form submission error:', err);
      // Even if AJAX is restricted, allow quick fallback
      setSubmitStatus('error');
      setErrorMessage(
        'Unable to send message via automated service right now. You can click below to send directly using your email app.'
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 font-classic flex flex-col justify-between">
      <div>
        <Header
          onLogoClick={onBackToHome}
          onNavigateToScan={onNavigateToScan}
          onNavigateToHospitals={onNavigateToHospitals}
          onNavigateToAbout={() => {}}
          activeView="about"
        />

        {/* Breadcrumb / Back button */}
        <div className="container mx-auto px-4 sm:px-6 pt-6">
          <button
            onClick={onBackToHome}
            className="inline-flex items-center space-x-1.5 text-xs font-semibold text-slate-500 hover:text-teal-700 bg-white px-3 py-1.5 rounded-lg border border-slate-200 transition-all shadow-2xs mb-6"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Back to Home</span>
          </button>
        </div>

        <main className="container mx-auto px-4 sm:px-6 pb-16">
          <div className="max-w-5xl mx-auto space-y-12">
            {/* Hero Section */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="text-center max-w-3xl mx-auto"
            >
              <span className="text-xs font-bold uppercase tracking-wider text-teal-700 bg-teal-50 px-3.5 py-1 rounded-full border border-teal-200">
                About the Developer & Mission
              </span>
              <h1 className="text-4xl sm:text-5xl font-extrabold text-slate-900 mt-3 tracking-tight">
                Bringing Compassionate AI to{' '}
                <span className="text-gradient-medical">Tuberculosis Screening</span>
              </h1>
              <p className="text-slate-600 text-base sm:text-lg mt-4 leading-relaxed">
                Tuberculosis remains one of the world’s deadliest infectious diseases, yet it is completely curable when detected early. This project was built to democratize chest X-ray screening and directly connect patients with free, lifesaving care.
              </p>
            </motion.div>

            {/* Developer Spotlight Card */}
            <motion.div
              initial={{ opacity: 0, y: 25 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1, duration: 0.6 }}
              className="bg-gradient-to-br from-slate-900 via-teal-950 to-slate-900 text-white rounded-3xl p-8 sm:p-12 shadow-2xl border border-teal-800/40 relative overflow-hidden"
            >
              {/* Decorative background circle */}
              <div className="absolute -right-20 -bottom-20 w-80 h-80 bg-teal-500/10 rounded-full blur-3xl pointer-events-none"></div>

              <div className="flex flex-col md:flex-row items-center md:items-start gap-8 relative z-10">
                {/* Profile Photo */}
                <div className="w-28 h-28 sm:w-32 sm:h-32 rounded-3xl bg-gradient-to-tr from-teal-400 via-cyan-400 to-teal-600 p-1 shadow-xl flex-shrink-0 relative group">
                  <img
                    src={tejasProfilePic}
                    alt="Tejas Musale - Developer & AI Engineer"
                    className="w-full h-full object-cover rounded-[22px] shadow-inner"
                    onError={(e) => {
                      (e.target as HTMLImageElement).src = 'https://drive.google.com/uc?export=view&id=1MuCgLoJcQ2UiD1OiYYtRKdEWlbVR3w17';
                    }}
                  />
                  <div className="absolute -bottom-1.5 -right-1.5 w-7 h-7 bg-teal-500 rounded-full border-2 border-slate-900 flex items-center justify-center text-white shadow-md">
                    <Code2 className="w-4 h-4" />
                  </div>
                </div>

                <div className="flex-1 text-center md:text-left space-y-4">
                  <div>
                    <div className="flex flex-wrap items-center justify-center md:justify-start gap-3">
                      <h2 className="text-3xl font-extrabold tracking-tight text-white">
                        Tejas Musale
                      </h2>
                      <span className="text-xs px-2.5 py-1 rounded-full bg-teal-500/20 text-teal-300 border border-teal-400/30 font-semibold">
                        Creator & AI Engineer
                      </span>
                    </div>
                    <p className="text-sm text-teal-200/90 mt-1 font-medium">
                      Machine Learning & Healthcare AI Developer
                    </p>
                  </div>

                  <p className="text-slate-300 text-sm leading-relaxed max-w-2xl">
                    "I created this project with a simple goal: ensure no patient is left waiting in uncertainty. By pairing deep learning vision models with transparent Grad-CAM heatmaps and direct access to free government DOTS centers, we can help bridge the gap between rapid screening and immediate treatment."
                  </p>

                  {/* Contact / Social Links */}
                  <div className="flex flex-wrap items-center justify-center md:justify-start gap-3 pt-2">
                    {devLinks.map((link, idx) => (
                      <a
                        key={idx}
                        href={link.url}
                        target="_blank"
                        rel="noreferrer"
                        className={`px-4 py-2.5 rounded-2xl bg-white/10 hover:bg-white/20 text-slate-200 border border-white/10 transition-all text-xs font-semibold flex items-center gap-2 shadow-xs ${link.color}`}
                      >
                        <link.icon className="w-4 h-4" />
                        <span>{link.name}</span>
                        <ExternalLink className="w-3 h-3 opacity-60" />
                      </a>
                    ))}
                  </div>
                </div>
              </div>
            </motion.div>

            {/* Project Architecture & Capabilities */}
            <div className="space-y-6">
              <div className="text-center max-w-2xl mx-auto">
                <h2 className="text-2xl sm:text-3xl font-bold text-slate-900">
                  Core Project Architecture
                </h2>
                <p className="text-slate-500 text-sm mt-1">
                  How the system integrates deep learning, explainability, and clinical workflows
                </p>
              </div>

              <div className="grid md:grid-cols-2 gap-6">
                {projectMilestones.map((item, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.1, duration: 0.5 }}
                    viewport={{ once: true }}
                    className="bg-white rounded-3xl p-6 border border-slate-200/90 shadow-sm hover:shadow-md transition-all space-y-3"
                  >
                    <div className="w-12 h-12 rounded-2xl bg-teal-50 text-teal-700 flex items-center justify-center border border-teal-100">
                      <item.icon className="w-6 h-6" />
                    </div>
                    <h3 className="text-lg font-bold text-slate-900">
                      {item.title}
                    </h3>
                    <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                      {item.desc}
                    </p>
                  </motion.div>
                ))}
              </div>
            </div>

            {/* Medical References & Standards */}
            <div className="bg-white rounded-3xl p-8 border border-slate-200 shadow-sm space-y-6">
              <div className="flex items-center space-x-3 pb-4 border-b border-slate-100">
                <div className="w-10 h-10 rounded-xl bg-teal-100 text-teal-700 flex items-center justify-center">
                  <BookOpen className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-xl font-bold text-slate-900">
                    Clinical Knowledge & Guidelines References
                  </h3>
                  <p className="text-xs text-slate-500">
                    Built following international radiological and disease control benchmarks
                  </p>
                </div>
              </div>

              <div className="grid md:grid-cols-3 gap-4">
                {medicalReferences.map((ref, i) => (
                  <a
                    key={i}
                    href={ref.url}
                    target="_blank"
                    rel="noreferrer"
                    className="p-5 rounded-2xl bg-slate-50 border border-slate-200/80 hover:border-teal-400 hover:bg-teal-50/40 transition-all flex flex-col justify-between group"
                  >
                    <div>
                      <div className="flex items-center justify-between mb-2">
                        <h4 className="font-bold text-slate-800 text-sm group-hover:text-teal-700 transition-colors">
                          {ref.title}
                        </h4>
                        <ExternalLink className="w-3.5 h-3.5 text-slate-400 group-hover:text-teal-600" />
                      </div>
                      <p className="text-xs text-slate-600 leading-relaxed">
                        {ref.desc}
                      </p>
                    </div>
                    <span className="text-[11px] font-bold text-teal-600 mt-4 flex items-center gap-1">
                      Read Guidelines →
                    </span>
                  </a>
                ))}
              </div>
            </div>

            {/* Direct Contact Us Form (Delivers to tejasmusale830@gmail.com) */}
            <motion.div
              initial={{ opacity: 0, y: 25 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              className="bg-white rounded-3xl p-8 sm:p-12 border border-slate-200 shadow-xl relative overflow-hidden"
            >
              <div className="max-w-2xl mx-auto space-y-6">
                <div className="text-center space-y-2">
                  <span className="text-xs font-bold uppercase tracking-wider text-teal-700 bg-teal-50 px-3.5 py-1 rounded-full border border-teal-200">
                    Get in Touch
                  </span>
                  <h2 className="text-3xl font-extrabold text-slate-900">
                    Contact Tejas Musale
                  </h2>
                  <p className="text-sm text-slate-500 max-w-lg mx-auto leading-relaxed">
                    Have feedback, clinical collaboration ideas, hospital partnership requests, or questions? Send a direct message below.
                  </p>
                </div>

                {submitStatus === 'success' ? (
                  <motion.div
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="p-8 bg-emerald-50 border border-emerald-200 rounded-2xl text-center space-y-3"
                  >
                    <div className="w-14 h-14 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto shadow-xs">
                      <CheckCircle2 className="w-8 h-8" />
                    </div>
                    <h3 className="text-xl font-bold text-emerald-900">Message Sent Successfully!</h3>
                    <p className="text-sm text-emerald-700 max-w-md mx-auto">
                      Thank you for reaching out! Your message was delivered directly to <strong>tejasmusale830@gmail.com</strong>. I will get back to you shortly.
                    </p>
                    <button
                      onClick={() => setSubmitStatus('idle')}
                      className="mt-4 px-6 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold rounded-xl transition-all shadow-xs"
                    >
                      Send Another Message
                    </button>
                  </motion.div>
                ) : (
                  <form onSubmit={handleContactSubmit} className="space-y-4 pt-2">
                    <div className="grid sm:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1">
                          Your Name *
                        </label>
                        <input
                          type="text"
                          required
                          placeholder="e.g. Dr. Jane Doe / Alex Smith"
                          value={contactName}
                          onChange={(e) => setContactName(e.target.value)}
                          className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:bg-white focus:ring-2 focus:ring-teal-500 focus:outline-none text-slate-800 transition-all"
                        />
                      </div>

                      <div>
                        <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1">
                          Your Email *
                        </label>
                        <input
                          type="email"
                          required
                          placeholder="name@example.com"
                          value={contactEmail}
                          onChange={(e) => setContactEmail(e.target.value)}
                          className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:bg-white focus:ring-2 focus:ring-teal-500 focus:outline-none text-slate-800 transition-all"
                        />
                      </div>
                    </div>

                    <div className="grid sm:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1">
                          Phone Number (Optional)
                        </label>
                        <input
                          type="tel"
                          placeholder="+91 98765 43210"
                          value={contactPhone}
                          onChange={(e) => setContactPhone(e.target.value)}
                          className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:bg-white focus:ring-2 focus:ring-teal-500 focus:outline-none text-slate-800 transition-all"
                        />
                      </div>

                      <div>
                        <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1">
                          Topic / Subject
                        </label>
                        <select
                          value={contactSubject}
                          onChange={(e) => setContactSubject(e.target.value)}
                          className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm font-medium text-slate-700 focus:bg-white focus:ring-2 focus:ring-teal-500 focus:outline-none"
                        >
                          <option value="General Inquiry">General Inquiry</option>
                          <option value="Research & Collaboration">Research & AI Collaboration</option>
                          <option value="Hospital & Clinic Partnership">Hospital / DOTS Center Partnership</option>
                          <option value="Clinical Feedback">Clinical Accuracy Feedback</option>
                          <option value="Bug / Technical Report">Technical / Bug Report</option>
                        </select>
                      </div>
                    </div>

                    <div>
                      <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1">
                        Your Message *
                      </label>
                      <textarea
                        required
                        rows={4}
                        placeholder="Write your message or inquiry here..."
                        value={contactMessage}
                        onChange={(e) => setContactMessage(e.target.value)}
                        className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:bg-white focus:ring-2 focus:ring-teal-500 focus:outline-none text-slate-800 transition-all"
                      />
                    </div>

                    {submitStatus === 'error' && (
                      <div className="p-4 bg-amber-50 border border-amber-200 rounded-xl text-xs text-amber-900 space-y-2">
                        <div className="flex items-start gap-2">
                          <AlertCircle className="w-4 h-4 text-amber-600 flex-shrink-0 mt-0.5" />
                          <p>{errorMessage}</p>
                        </div>
                        <a
                          href={`mailto:tejasmusale830@gmail.com?subject=${encodeURIComponent(`[TB Care AI] ${contactSubject}`)}&body=${encodeURIComponent(`From: ${contactName}\nEmail: ${contactEmail}\nPhone: ${contactPhone}\n\n${contactMessage}`)}`}
                          className="inline-flex items-center gap-1.5 font-bold text-teal-800 hover:text-teal-950 underline"
                        >
                          <Mail className="w-3.5 h-3.5" /> Open in Email App (tejasmusale830@gmail.com) →
                        </a>
                      </div>
                    )}

                    <button
                      type="submit"
                      disabled={isSubmitting}
                      className="w-full py-4 bg-gradient-to-r from-teal-600 to-cyan-600 hover:from-teal-700 hover:to-cyan-700 text-white font-bold rounded-2xl shadow-medical transition-all flex items-center justify-center gap-2 text-sm disabled:opacity-60"
                    >
                      {isSubmitting ? (
                        <>
                          <RefreshCw className="w-4 h-4 animate-spin" />
                          <span>Sending Directly to Tejas...</span>
                        </>
                      ) : (
                        <>
                          <Send className="w-4 h-4" />
                          <span>Send Message to Tejas Musale</span>
                        </>
                      )}
                    </button>
                  </form>
                )}
              </div>
            </motion.div>

            {/* CTA Section */}
            <div className="bg-gradient-to-r from-teal-700 via-teal-600 to-cyan-700 rounded-3xl p-8 sm:p-10 text-white text-center space-y-6 shadow-medical">
              <h2 className="text-2xl sm:text-3xl font-extrabold">
                Experience the TB Care AI Platform
              </h2>
              <p className="text-teal-100 max-w-xl mx-auto text-xs sm:text-sm">
                Test the deep learning screening pipeline with a chest radiograph or browse nearby specialized TB hospitals.
              </p>
              <div className="flex flex-wrap gap-4 justify-center">
                <button
                  onClick={onNavigateToScan}
                  className="px-6 py-3 bg-white text-teal-900 font-bold rounded-2xl text-sm shadow-md hover:bg-teal-50 transition-all flex items-center gap-2"
                >
                  <Scan className="w-4 h-4 text-teal-600" />
                  <span>Start AI X-Ray Scan</span>
                </button>
                <button
                  onClick={onNavigateToHospitals}
                  className="px-6 py-3 bg-teal-900/40 hover:bg-teal-900/60 text-white font-bold rounded-2xl text-sm border border-white/20 transition-all flex items-center gap-2"
                >
                  <Building2 className="w-4 h-4 text-cyan-300" />
                  <span>Find Nearby Hospitals</span>
                </button>
              </div>
            </div>
          </div>
        </main>
      </div>

      <Footer onNavigateToAbout={() => {}} />
    </div>
  );
};

export default AboutUs;
