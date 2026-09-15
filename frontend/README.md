# 🎨 TB Care AI — Frontend Client

The frontend interface for **TB Care AI**, an AI-powered Tuberculosis detection, Grad-CAM attention visualizer, clinical report generator, and nearby DOTS hospital booking dashboard.

---

## 🚀 Features

- **X-Ray Radiograph Ingestion**: Drag-and-drop chest radiographs with validation safeguards.
- **Explainable Multi-Spectral View**: Side-by-side display of original radiographs, deep learning segmentation overlays, and Grad-CAM attention heatmaps.
- **Groq LLaMA-3 Medical Reports**: Real-time rendering of structured clinical summaries with Markdown tables for the 5-step Government DOTS workflow.
- **One-Click PDF Report Download**: Printable diagnosis slips formatted for physicians and DOTS centers using `react-to-print`.
- **Interactive Nearby Care Directory**: Geolocation-assisted hospital finder and multi-step doctor appointment booking modal with printable tokens.
- **Conversational Medical Assistant**: Context-aware chatbot with quick FAQ pills.
- **Developer & Project Showcase (About Us)**: Information and direct contact links for lead developer **Tejas Musale**.

---

## 🛠️ Technology Stack

- **Framework**: React 18 with TypeScript
- **Bundler & Build Tool**: Vite
- **Styling**: Tailwind CSS (Medical Cyan, Deep Teal, Slate Navy)
- **Animations**: Framer Motion
- **Markdown & Tables**: `react-markdown`, `remark-gfm`
- **Icons**: Lucide React
- **HTTP Client**: Axios

---

## 📁 Directory Structure

```
frontend/
├── src/
│   ├── components/
│   │   ├── Header.tsx              # Navigation bar & status indicator
│   │   ├── LandingPage.tsx         # Modern hero, workflow timeline & stats
│   │   ├── UploadSection.tsx       # Drag-and-drop radiograph scanner
│   │   ├── ProcessingAnimation.tsx # Sub-second radar scanning effect
│   │   ├── ResultsSection.tsx      # Comprehensive diagnosis & visualizer
│   │   ├── HospitalLocator.tsx     # Geo-enabled TB & DOTS hospital finder
│   │   ├── AppointmentModal.tsx    # Doctor consultation booking flow
│   │   ├── ChatBot.tsx             # Conversational AI assistant
│   │   ├── AboutUs.tsx             # Developer profile & project details
│   │   └── Footer.tsx              # Helplines, WHO attribution & links
│   ├── types/
│   │   └── index.ts                # TypeScript interfaces & data models
│   ├── App.tsx                     # Main view router
│   ├── main.tsx                    # React DOM entrypoint
│   ├── index.css                   # Tailwind styles & glassmorphism
│   └── tejas_profile.jpg           # Bundled developer portrait
├── tailwind.config.js              # Theme configuration
├── package.json
└── vite.config.ts
```

---

## 💻 Development & Build Scripts

```bash
# Install dependencies
npm install

# Start development server
npm run dev

# Build production bundle
npm run build

# Preview production build locally
npm run preview
```

---

## 👨‍💻 Developer

**Tejas Musale**  
- 🐙 **GitHub**: [@MusaleTejas](https://github.com/MusaleTejas)  
- 💼 **LinkedIn**: [in/tejas-musale](https://www.linkedin.com/in/tejas-musale)  
- ✉️ **Email**: [tejasmusale830@gmail.com](mailto:tejasmusale830@gmail.com)
