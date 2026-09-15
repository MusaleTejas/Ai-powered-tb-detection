# 🩺 TB Care AI — AI-Powered Tuberculosis Detection & Clinical Care Platform

[![License: MIT](https://img.shields.io/badge/License-MIT-teal.svg)](https://opensource.org/licenses/MIT)
[![Python: 3.8+](https://img.shields.io/badge/Python-3.8%2B-blue.svg)](https://www.python.org/)
[![React: 18+](https://img.shields.io/badge/React-18%2B-61DAFB.svg)](https://react.dev/)
[![Tailwind CSS: 3.4](https://img.shields.io/badge/TailwindCSS-3.4-38B2AC.svg)](https://tailwindcss.com/)
[![Groq AI: LLaMA 3](https://img.shields.io/badge/Groq%20AI-LLaMA%203-orange.svg)](https://groq.com/)
[![Fast Inference: Sub-second](https://img.shields.io/badge/Inference-%3C%203s-emerald.svg)]()

> **An intelligent, explainable, and patient-centered diagnostic platform engineered to accelerate pulmonary Tuberculosis (TB) screening, generate structured clinical reports, and connect patients with certified Government DOTS centers.**

---

## 🌟 Overview & Mission

Tuberculosis remains one of the world's leading infectious disease killers. Early and accessible detection is crucial to breaking the chain of transmission. 

**TB Care AI** bridges the gap between deep learning radiograph screening and actionable patient care. Built with convolutional neural networks (EfficientNet), explainable AI (Grad-CAM), and high-throughput LLM synthesis (Groq LLaMA-3), the platform offers:
- **Instant Chest Radiograph Screening**: Automated detection of pulmonary opacities, infiltrates, and cavitations.
- **Visual Explainability**: Side-by-side comparison of raw X-rays, lesion segmentation overlays, and Grad-CAM attention heatmaps.
- **Doctor-Ready Clinical Summaries**: Narrative reports structured according to **CDC** and **The Radiology Assistant** radiological criteria.
- **Direct Care Connection**: Geolocation-enabled locator for **Government DOTS Centers** (providing 100% free treatment) and interactive doctor appointment scheduling.

---

## 🚀 Key Features

### 1. 🔬 Deep Learning Pulmonary Screening
- **Multi-Task Neural Network**: Classifies chest radiographs into Tuberculosis vs. Normal with high diagnostic confidence.
- **Image Preprocessing & Validation**: Automated validation filter ensuring uploaded images are genuine chest radiographs (PA/AP views).

### 2. 🌡️ Visual Explainability & Grad-CAM
- **Grad-CAM Activation Heatmaps**: Highlights the exact focal regions (upper lobe apical segments, nodular opacities) influencing neural network classification.
- **Segmentation Mask Overlay**: Visualizes suspected lesion boundaries directly on the radiograph.

### 3. 📝 Structured Clinical AI Reports (Groq LLaMA-3)
- **Clinical Breakdown**: Covers Patient Condition, Radiological Signatures, Red-Flag Symptoms, and Household Precautions.
- **Government DOTS Table**: Explains the 5-step National TB Elimination workflow (*Screening, Free Regimen 2HRZE+4HRE, Directly Observed Therapy, Monitoring, Contact Tracing*).
- **Downloadable PDF Pass**: Generate and print official diagnosis summaries with 1-click.

### 4. 🏥 Nearby Hospital & DOTS Center Locator
- **GPS-Assisted Matching**: Instant proximity calculation for certified TB treatment centers and pulmonology clinics.
- **Doctor Appointment Booking**: Select specialist physicians, pick preferred time slots (In-person or Video call), attach AI scan results, and receive an instant booking token.

### 5. 💬 Conversational Medical AI Assistant
- **24x7 Respiratory Guidance**: Ask natural-language questions regarding symptoms, medication compliance, transmission prevention, and diagnostic workups (CBNAAT / GeneXpert).

---

## 🏗️ System Architecture

```
                               ┌─────────────────────────┐
                               │  Frontend (React + Vite) │
                               │  Tailwind + Framer Motion│
                               └────────────┬────────────┘
                                            │
                    ┌───────────────────────┴───────────────────────┐
                    │                                               │
                    ▼                                               ▼
     ┌─────────────────────────────┐               ┌─────────────────────────────┐
     │   Flask AI Backend (:5000)  │               │ Node.js Chat Backend (:5001)│
     ├─────────────────────────────┤               ├─────────────────────────────┤
     │ • X-Ray Quality Gate        │               │ • Groq LLaMA-3 LLM Engine   │
     │ • EfficientNet / SavedModel │               │ • Structured Report Synth   │
     │ • Grad-CAM Heatmap Gen      │               │ • Conversational Chatbot    │
     │ • Segmentation Overlay      │               │ • Rate Limiting & Security  │
     └─────────────────────────────┘               └─────────────────────────────┘
```

---

## 📚 Clinical Guidelines & Medical References

This project is built and aligned with international radiological and infectious disease benchmarks:
- **[The Radiology Assistant: Imaging Findings in TB](https://radiologyassistant.nl/chest/tb/tuberculosis)** — Radiological presentation of primary vs. post-primary TB, apical cavitations, and miliary patterns.
- **[CDC Tuberculosis Diagnosis Protocols](https://www.cdc.gov/tb/testing/diagnosing-tuberculosis.html)** — Guidelines for molecular testing (GeneXpert / CBNAAT), sputum AFB smear microscopy, and 6-month therapy.
- **[WHO Global Tuberculosis Programme](https://www.who.int/teams/global-tuberculosis-programme/the-end-tb-strategy)** — The WHO End TB Strategy.

---

## 🛠️ Tech Stack

- **Frontend**: React 18, Vite, TypeScript, Tailwind CSS, Framer Motion, Lucide Icons, React-Markdown, React-to-Print.
- **AI / Deep Learning**: TensorFlow 2.x, Keras, OpenCV (cv2), NumPy, Pillow.
- **LLM Synthesis**: Groq SDK (`openai/gpt-oss-120b` / LLaMA 3), Node.js, Express, Rate-Limiting.
- **Backend API**: Python Flask, Flask-CORS.

---

## 📦 Local Installation & Setup

### Prerequisites
- **Node.js**: v18.0 or higher
- **Python**: v3.8 or higher
- **Git**: Installed on your system

---

### Step 1: Clone the Repository
```bash
git clone https://github.com/MusaleTejas/Ai-powered-tb-detection.git
cd Ai-powered-tb-detection
```

---

### Step 2: Set Up Flask AI Backend (Port 5000)

```bash
# Navigate to backend directory
cd backend

# Create and activate virtual environment
# Windows:
python -m venv venv
.\venv\Scripts\activate

# Linux / macOS:
# python3 -m venv venv
# source venv/bin/activate

# Install dependencies
pip install -r requirements.txt
pip install opencv-python

# Run the Flask Server
python app.py
```
> Server runs on `http://127.0.0.1:5000`

---

### Step 3: Set Up Groq Chat & Report Backend (Port 5001)

```bash
# Open a new terminal and navigate to chat-backend
cd chat-backend

# Install dependencies
npm install

# Configure environment variables (create .env)
# PORT=5001
# GROQ_API_KEY=your_groq_api_key_here

# Start the Node.js Server
npm start
```
> Server runs on `http://127.0.0.1:5001`

---

### Step 4: Set Up & Launch Frontend (Port 5173)

```bash
# Open a new terminal and navigate to frontend
cd frontend

# Install dependencies
npm install

# Start the Vite development server
npm run dev
```
> Open your browser at `http://localhost:5173`

---

## 📡 API Endpoints Reference

### AI Model Backend (`http://127.0.0.1:5000`)
| Method | Endpoint | Description |
|---|---|---|
| `GET` | `/health` | Healthcheck and model readiness status |
| `POST` | `/predict` | Ingests chest X-ray image (`multipart/form-data`) and returns classification, confidence, segmentation mask, and Grad-CAM heatmap data URLs |
| `POST` | `/cleanup_files` | Cleans up temporary image files from storage |

### Chat & Report Backend (`http://127.0.0.1:5001`)
| Method | Endpoint | Description |
|---|---|---|
| `POST` | `/report` | Synthesizes a full CDC-aligned clinical report with DOTS table |
| `POST` | `/chat` | Conversational medical AI assistant handling user queries |

---

## 👨‍💻 Author & Developer

**Tejas Musale**  
*Machine Learning & Full-Stack Developer*

- 🐙 **GitHub**: [@MusaleTejas](https://github.com/MusaleTejas)
- 💼 **LinkedIn**: [in/tejas-musale](https://www.linkedin.com/in/tejas-musale)
- ✉️ **Email**: [tejasmusale830@gmail.com](mailto:tejasmusale830@gmail.com)

---

## 🤝 Contributing

Contributions, issues, and feature requests are welcome!  
Please see [CONTRIBUTING.md](CONTRIBUTING.md) for contribution guidelines and development workflow.

---

## ⚠️ Medical Disclaimer

*This application is an artificial intelligence research and clinical screening assistance tool. It is designed to assist healthcare professionals and provide informational guidance. It does not replace professional medical diagnosis, clinical judgement, or laboratory sputum testing (GeneXpert/AFB). Always consult a licensed physician or visit a certified DOTS center for diagnostic confirmation and prescription.*

---

## 📄 License

This project is licensed under the **MIT License** - see the [LICENSE](LICENSE) file for details.
