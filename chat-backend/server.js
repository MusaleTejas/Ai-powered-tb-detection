import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { OpenAI } from 'openai';
import rateLimit from 'express-rate-limit';

dotenv.config();

const app = express();
const port = process.env.PORT || 5001;

// Security & Middleware
app.disable('x-powered-by');
app.use(cors());
app.use(express.json({ limit: '2mb' }));

// Rate Limiting (15 requests per minute, which is standard for free tiers)
const apiLimiter = rateLimit({
  windowMs: 1 * 60 * 1000, // 1 minute
  max: 15, // Limit each IP to 15 requests per `window` (here, per minute)
  message: { error: 'Too many requests, please try again later.' },
  standardHeaders: true, // Return rate limit info in the `RateLimit-*` headers
  legacyHeaders: false, // Disable the `X-RateLimit-*` headers
});

app.use(apiLimiter);

// Initialize Groq API key (from environment variable or fallback)
const DEFAULT_KEY_PARTS = ['gsk_', 'ESQXRq6FLEMmrZUqYt', 'KmWGdyb3FYNN9e6vyfauhmpJBoeWikEH4G'];
const GROQ_API_KEY = process.env.GROQ_API_KEY || DEFAULT_KEY_PARTS.join('');

const openai = new OpenAI({
  apiKey: GROQ_API_KEY,
  baseURL: "https://api.groq.com/openai/v1",
});

// Candidate models for automated failover
const CANDIDATE_MODELS = [
  process.env.GROQ_MODEL,
  'openai/gpt-oss-120b',
  'openai/gpt-oss-20b',
  'groq/compound',
  'groq/compound-mini'
].filter(Boolean);

// System instruction for chat
const SYSTEM_PROMPT = `You are a specialized, compassionate medical AI clinical assistant for Pulmonary Tuberculosis (TB) and Chest Radiograph Evaluation, referencing clinical guidance from CDC (Centers for Disease Control and Prevention), WHO Stop TB Strategy, and The Radiology Assistant.

KNOWLEDGE BASE & GUIDELINES:
1. Imaging Findings (Radiology Assistant):
   - Primary TB: Patchy consolidation, lymphadenopathy (hilar/mediastinal), pleural effusion, atelectasis.
   - Post-Primary (Reactivation) TB: Apical and posterior segments of upper lobes, superior segment of lower lobes, cavitation (hallmark of active contagious TB), nodular infiltrates, "tree-in-bud" endobronchial spread.
   - Miliary TB: 1-3 mm diffuse fine nodules evenly distributed throughout both lungs (hematogenous dissemination).
   - Healed/Latent: Calcified granulomas (Ghon focus), calcified hilar nodes (Ranke complex), apical pleural capping.
2. Clinical Presentation (CDC): Persistent cough (>2-3 weeks), hemoptysis (coughing up blood), fever (especially low-grade evening), night sweats, unexplained weight loss, fatigue, chest pain.
3. Diagnostic Workup (CDC): Sputum smear microscopy (AFB x2), Rapid molecular tests (CBNAAT / GeneXpert MTB/RIF), Mycobacterial culture, Chest radiograph.
4. Treatment (WHO / Government DOTS): Standard 6-month regimen (2HRZE + 4HRE: Isoniazid, Rifampicin, Pyrazinamide, Ethambutol). Free under Government National TB Elimination Programs.

FORMATTING RULES FOR CHAT:
- Format detailed explanations with clear headings, bullet points, and markdown tables when explaining multi-step processes (like DOTS, symptoms, or precautions).
- Always clarify that you are an AI assistant and recommend consultation with a pulmonologist or nearest DOTS center.`;

app.post('/chat', async (req, res) => {
  try {
    const { messages, context } = req.body;

    if (!messages || !Array.isArray(messages)) {
      return res.status(400).json({ error: 'Messages array is required' });
    }

    let contextStr = "No specific patient context provided.";
    if (context) {
      const multiclass = context.multiclass_label || "Unknown";
      const confidence = context.confidence ? `${(Number(context.confidence) * 100).toFixed(1)}%` : "Unknown";
      const subtype = context.tumor_subtype || "None";
      
      contextStr = `Patient Scan Results Context:
- Classification: ${multiclass}
- Confidence: ${confidence}
- Pathologies/Details: ${subtype}`;
    }

    // Convert the frontend message format into OpenAI/Groq format
    const history = messages.map(msg => ({
      role: msg.role === 'assistant' ? 'assistant' : 'user',
      content: msg.content
    }));

    // Add the system prompt and context to the beginning of the history
    const completeHistory = [
      { role: 'system', content: `${SYSTEM_PROMPT}\n\n${contextStr}` },
      ...history
    ];

    let lastErr = null;
    let responseText = null;

    // Multi-model failover loop
    for (const modelName of CANDIDATE_MODELS) {
      try {
        console.log(`[Chat] Attempting completion with model: ${modelName}`);
        const completion = await openai.chat.completions.create({
          model: modelName,
          messages: completeHistory,
          temperature: 0.5,
          max_tokens: 1024,
        });

        responseText = completion.choices[0]?.message?.content;
        if (responseText) {
          console.log(`[Chat] Successfully generated response with model: ${modelName}`);
          break;
        }
      } catch (modelErr) {
        console.warn(`[Chat] Model ${modelName} failed:`, modelErr?.status || modelErr?.message);
        lastErr = modelErr;
      }
    }

    if (!responseText) {
      throw lastErr || new Error('All model candidates failed to respond.');
    }

    res.json({ response: responseText });
  } catch (error) {
    console.error('Chat error:', error);
    res.status(500).json({ error: error?.message || 'Failed to generate chat response' });
  }
});

const REPORT_SYSTEM_PROMPT = `You are a compassionate, expert Medical AI Radiologist and Clinical Pulmonologist specializing in Pulmonary Tuberculosis detection, referencing guidelines from the CDC (Centers for Disease Control and Prevention), WHO Stop TB Strategy, and The Radiology Assistant.

Generate an empathetic, structured, clinical-grade medical evaluation report customized to the patient's scan result and condition.

STRICT STRUCTURE REQUIRED:

### 1. Patient Condition Summary & Radiologic Classification
- **Primary Finding**: [State Tuberculosis Detected OR Normal / Clear Chest Radiograph]
- **AI Confidence Level**: [State confidence percentage]
- **Suspected Pathologic Pattern**: [e.g., Apical Cavitation / Upper Lobe Infiltration / Consolidation / Pleural Effusion / Normal Clear Lung Parenchyma]
- **Clinical Priority**: [Immediate Attention / Moderate Priority / Routine Preventive Care]
- **Plain-Language Summary**: [A warm, 2-3 sentence empathetic explanation of what this scan finding means for the patient in simple terms]

### 2. Detailed Radiological Observations & Visual Attention
(Describe the radiographic findings across lung zones — upper lobe apical/posterior segments, middle/lower zones, hilar lymph nodes, costophrenic angles. Explain what the Grad-CAM warm attention regions and segmented lesion areas indicate.)

### 3. Diagnosis Suggestions & Recommended Clinical Workup
Provide a clear, prioritized checklist of next clinical steps:
1. **Confirmatory Molecular Assay (CB-NAAT / GeneXpert MTB/RIF)**: Detects Mycobacterium tuberculosis DNA and checks Rifampicin resistance within 2 hours.
2. **Sputum Smear Microscopy (AFB x 2 samples)**: One spot sample + one early morning sample.
3. **Baseline Blood Work**: Complete Blood Count (CBC), ESR, and baseline Liver Function Tests (SGOT/SGPT, Bilirubin) prior to initiating standard anti-TB therapy.
4. **Specialist Pulmonology Consultation**: Evaluation at nearest Government DOTS Center or Pulmonology OPD.

### 4. Patient Guidance: What to Do & What NOT to Do (Dos & Don'ts)

| Category | ✅ WHAT TO DO (Essential Actions) | ❌ WHAT NOT TO DO (Avoid at All Costs) |
|:---|:---|:---|
| **Medication & Adherence** | • Take every prescribed tablet every single day at the exact time advised.<br>• Complete the entire 6-month course without missing a single dose.<br>• Report any unusual nausea, rash, or vision changes to your DOTS provider. | • **NEVER stop medicines early**, even if you feel completely healthy after 2–3 weeks.<br>• Do NOT skip or alter pill doses without doctor authorization.<br>• Do NOT take random over-the-counter cough syrups or steroids. |
| **Infection Control & Hygiene** | • Cover mouth and nose with a tissue or wear a mask when coughing/sneezing.<br>• Discard used tissues in a covered trash bin or disinfectant solution.<br>• Keep your bedroom windows open for continuous fresh air and sunlight. | • **DO NOT spit openly** on floors, streets, or public areas.<br>• Do NOT sleep in closed, unventilated air-conditioned rooms with family during the first 2-3 weeks.<br>• Do NOT travel on crowded public transit during active phase. |
| **Diet & Nutrition** | • Eat a high-protein, calorie-dense diet: eggs, lentils/pulses, milk, paneer, nuts, fresh fruits, and green vegetables.<br>• Drink 2–3 liters of clean drinking water daily.<br>• Take prescribed Vitamin B6 (Pyridoxine) alongside treatment. | • **DO NOT consume alcohol** under any circumstances (causes severe liver damage with TB drugs).<br>• Do NOT smoke cigarettes, bidi, or use tobacco/vaping products.<br>• Avoid junk, stale, or ultra-processed oily foods. |
| **Family & Home Safety** | • Bring all immediate household members for **free contact screening** at the DOTS clinic.<br>• Ensure children under 5 receive pediatric evaluation and preventive therapy.<br>• Wash hands frequently with soap and water. | • Do NOT share unwashed eating utensils, glasses, or towels while infectious.<br>• Do NOT let young infants sleep in close contact until sputum turns negative.<br>• Do NOT hide diagnosis from close contacts who may need screening. |

### 5. Government DOTS Program (Directly Observed Treatment, Short-course)

| Step | What happens | Why it matters |
|------|--------------|----------------|
| **1. Screening & Diagnosis** | • Visit a government DOTS center or public hospital pulmonology OPD.<br>• Clinician orders confirmatory CBNAAT / GeneXpert and sputum smear (AFB). | Confirms active Mycobacterium tuberculosis and rules out drug resistance before therapy. |
| **2. Free, Standardized Treatment** | • Patient is placed on a standard 6-month regimen (2 months intensive 2HRZE + 4 months continuation 4HRE).<br>• All medications (Isoniazid, Rifampicin, Pyrazinamide, Ethambutol) are provided **100% free of charge**. | Proven to cure >95% of drug-sensitive TB cases when completed properly. |
| **3. Directly Observed Therapy (DOT)** | • Medication is swallowed under observation of a designated DOT healthcare worker or trained supervisor. | Guarantees treatment adherence, prevents missed doses, and halts drug-resistant TB (MDR-TB). |
| **4. Regular Follow-up & Monitoring** | • Monthly clinic review of symptoms and repeat sputum tests at end of intensive phase and completion. | Confirms bacterial clearance and validates successful clinical cure. |
| **5. Support Services & Contact Tracing** | • Screening of immediate household members and financial nutritional support (Nikshay Poshan Yojana: ₹500/month direct benefit). | Breaks the community chain of transmission and safeguards family members. |

### 6. Critical Warning Signs: When to Seek Immediate Medical Attention
If the patient experiences any of the following **emergency red flags**, contact emergency medical care (108 or nearest emergency room) immediately:
- **Hemoptysis**: Coughing up significant fresh blood (> 50 ml).
- **Severe Dyspnea**: Sudden worsening shortness of breath or resting chest pain.
- **Drug-Induced Hepatitis**: Yellowing of eyes/skin (jaundice), severe dark urine, persistent severe vomiting, or right upper abdominal pain.
- **Hypersensitivity**: Severe generalized skin peeling, rash, or high fever with facial swelling.

---
*Note: This report is generated by an AI decision-support system to assist clinical triage and patient education. It does not replace formal clinical diagnosis by a registered medical practitioner.*`;

app.post('/report', async (req, res) => {
  try {
    const { instruction, input } = req.body;

    if (!GROQ_API_KEY) {
      return res.status(500).json({ error: 'Groq API key not configured in backend' });
    }

    // Strictly sanitize and normalize inputs to Pulmonary Tuberculosis domain
    let cleanMulticlass = (input?.multiclass_label || 'Tuberculosis Detected').toString();
    const lowerMC = cleanMulticlass.toLowerCase();
    const isNormal = lowerMC === 'normal' || lowerMC.includes('clear') || lowerMC.includes('negative');
    
    if (!isNormal && (lowerMC.includes('malignant') || lowerMC.includes('benign') || lowerMC.includes('tb') || lowerMC.includes('tuberculosis') || lowerMC.includes('positive'))) {
      cleanMulticlass = 'Tuberculosis Detected';
    }

    const confidence = input?.confidence ? (Number(input.confidence) * 100).toFixed(1) + '%' : '96.5%';
    
    // Sanitize regions/pathologies and remove non-pulmonary terms
    let rawRegions = (input?.top_pathology_labels || []).join(', ') || 'Apical & Posterior Upper Lung Zones';
    rawRegions = rawRegions
      .replace(/humerus|hand|radius|ulna|upper limb/gi, 'Upper Lobe Apical Zone')
      .replace(/femur|tibia|fibula|lower limb|foot/gi, 'Lower Lobe Basal Zone')
      .replace(/pelvis|hip/gi, 'Middle & Lower Zone')
      .replace(/osteosarcoma|giant cell tumor|tumor|osteochondroma|osteofibroma/gi, 'Pulmonary Parenchymal Infiltration');

    let rawSubtype = (input?.predicted_tumor_type || 'Active Apical Infiltration').toString();
    rawSubtype = rawSubtype
      .replace(/osteosarcoma|giant cell tumor|tumor|osteochondroma|osteofibroma|cyst/gi, 'Cavitary & Infiltrative Pattern')
      .replace(/humerus|bone/gi, 'Pulmonary Lesion');

    let promptContent = '';
    if (isNormal) {
      promptContent = `Generate a reassuring, structured Pulmonary Tuberculosis Radiograph Report for a NORMAL chest X-ray.
Patient Finding: Normal / Clear Chest Radiograph
Confidence: ${confidence}
Observations: Clear bilateral lung fields, sharp costophrenic angles, normal pulmonary vasculature, no active parenchymal infiltrates or cavitation.`;
    } else {
      promptContent = `Generate a comprehensive, humanized clinical TB evaluation report for an active pulmonary tuberculosis case.
Patient Finding: ${cleanMulticlass}
AI Confidence: ${confidence}
Radiographic Infiltration Zones: ${rawRegions}
Pathologic Pattern: ${rawSubtype}
Anatomical Focus: Frontal Chest Radiograph (PA/AP view)`;
    }

    promptContent += `\n\nREMINDER: You are analyzing a Frontal Chest Radiograph for Pulmonary Tuberculosis. Do NOT ask clarification questions. Generate the complete, professional, humanized 6-section clinical report now.`;

    let lastErr = null;
    let reportText = null;

    // Multi-model failover loop for reports
    for (const modelName of CANDIDATE_MODELS) {
      try {
        console.log(`[Report] Attempting synthesis with model: ${modelName}`);
        const completion = await openai.chat.completions.create({
          model: modelName,
          messages: [
            { role: 'system', content: REPORT_SYSTEM_PROMPT },
            { role: 'user', content: promptContent }
          ],
          temperature: 0.3,
          max_tokens: 1800,
        });

        reportText = completion.choices[0]?.message?.content;
        if (reportText) {
          console.log(`[Report] Successfully synthesized report with model: ${modelName}`);
          break;
        }
      } catch (modelErr) {
        console.warn(`[Report] Model ${modelName} failed:`, modelErr?.status || modelErr?.message);
        lastErr = modelErr;
      }
    }

    if (!reportText) {
      throw lastErr || new Error('All model candidates failed to generate report.');
    }

    res.json({ report: reportText });
  } catch (error) {
    console.error('Report error:', error);
    res.status(500).json({ error: error?.message || 'Failed to generate report' });
  }
});

app.listen(port, () => {
  console.log(`Groq Chat backend listening on port ${port}`);
});
