# 💬 AI-Powered TB Assistant & Report Generation Service

A lightweight, high-performance Node.js microservice bridging the clinical diagnostic pipeline with **Groq Cloud's Ultra-Fast LPU Inference Engine**.

---

## 🩺 Overview

This service powers two essential clinical communication channels:
1. **Interactive Pulmonary AI Consultation (/chat)**: Provides patient and clinician chat support grounded in **CDC Tuberculosis Guidelines**, **WHO Stop TB Strategy**, and standard DOTS protocols.
2. **Structured Clinical Report Generation (/report)**: Transforms raw multitask deep learning outputs (classification probability, Grad-CAM attention regions, and UNet segmented lesion percentages) into structured medical reports featuring clinical observations, radiographic findings, diagnostic interpretations, and a **5-step Government DOTS Action Table**.

---

## ⚡ Key Features

- **Blazing Fast Groq LPU Inference**: Near-instantaneous response synthesis with dynamic model failover.
- **CDC & Radiology Assistant Knowledge Base**: System instructions configured with clinical best practices for pulmonary radiograph interpretation.
- **Directly Observed Treatment, Short-course (DOTS) Table**: Generates structured markdown tables covering:
  - Step 1: Screening & Diagnosis (Sputum smear, CB-NAAT / GeneXpert, Chest X-ray)
  - Step 2: Free, Standardized Treatment (6-month standard regimen)
  - Step 3: Directly Observed Intake (Treatment supporter monitoring)
  - Step 4: Regular Monitoring & Sputum Follow-ups
  - Step 5: Contact Tracing & Household Screening
- **CORS-Enabled & Resilient**: Handles conversational memory and structured inputs with graceful fallbacks.

---

## 🚀 Quick Start

### 1. Prerequisites
- Node.js (v18.0.0 or higher)
- npm or yarn
- Groq API Key

### 2. Environment Configuration
Create a .env file in the chat-backend/ directory:

`env
PORT=5001
GROQ_API_KEY=your_groq_api_key_here
`

### 3. Install Dependencies
`ash
npm install
`

### 4. Run Service
`ash
# Start server
npm start

# Or with live reload using nodemon
npm run dev
`
The server will start listening at http://127.0.0.1:5001.

---

## 📡 API Endpoints

### 1. POST /chat
Conduct conversational Q&A with the pulmonary assistant.

**Request Body:**
`json
{
  "message": "What should a patient do if they miss a DOTS dose?",
  "history": [
    { "role": "user", "content": "Tell me about DOTS." },
    { "role": "assistant", "content": "DOTS stands for Directly Observed Treatment, Short-course..." }
  ]
}
`

**Response:**
`json
{
  "reply": "If a patient misses a DOTS dose, they should contact their DOTS provider immediately..."
}
`

---

### 2. POST /report
Generate a structured medical diagnostic report from deep learning model predictions.

**Request Body:**
`json
{
  "prediction": "Tuberculosis Detected",
  "confidence": 98.4,
  "affectedPercentage": 14.2,
  "patientAge": "42",
  "patientSex": "Male",
  "symptoms": ["Chronic cough > 2 weeks", "Night sweats", "Weight loss"]
}
`

**Response:**
`json
{
  "report": "### PULMONARY RADIOGRAPHIC & CLINICAL REPORT\n\n**Patient Profile**\n..."
}
`

---

## 👨‍💻 Maintainer
- **Tejas Musale** — [GitHub](https://github.com/MusaleTejas) • [LinkedIn](https://www.linkedin.com/in/tejas-musale)
