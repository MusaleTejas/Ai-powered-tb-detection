import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { OpenAI } from 'openai';
import rateLimit from 'express-rate-limit';

dotenv.config();

const app = express();
const port = process.env.PORT || 5001;

// Middleware
app.use(cors());
app.use(express.json());

// Rate Limiting (15 requests per minute, which is standard for free tiers)
const apiLimiter = rateLimit({
  windowMs: 1 * 60 * 1000, // 1 minute
  max: 15, // Limit each IP to 15 requests per `window` (here, per minute)
  message: { error: 'Too many requests, please try again later.' },
  standardHeaders: true, // Return rate limit info in the `RateLimit-*` headers
  legacyHeaders: false, // Disable the `X-RateLimit-*` headers
});

app.use(apiLimiter);

// Initialize Groq using OpenAI SDK
const openai = new OpenAI({
  apiKey: process.env.GROQ_API_KEY,
  baseURL: "https://api.groq.com/openai/v1",
});

// System instruction for chat
const SYSTEM_PROMPT = `You are a helpful, empathetic, and knowledgeable medical AI assistant specializing in Tuberculosis (TB) education, general bone health, precautions, and guiding patients to seek professional medical care at nearby hospitals when needed.

RULES:
1. Always clarify that you are an AI and not a replacement for a doctor.
2. Provide clear, concise, and accurate information about TB, its symptoms, and precautions.
3. If asked about hospitals, advise the user to visit their nearest government or reputed private hospital for TB screening (like DOTS centers).
4. Be conversational and supportive.
5. Keep responses mostly under 3 paragraphs.
6. NEVER provide dangerous medical advice or prescribe medication.`;

app.post('/chat', async (req, res) => {
  try {
    const { messages, context } = req.body;

    if (!messages || !Array.isArray(messages)) {
      return res.status(400).json({ error: 'Messages array is required' });
    }

    if (!process.env.GROQ_API_KEY) {
      return res.status(500).json({ error: 'Groq API key not configured in backend' });
    }

    let contextStr = "No specific patient context provided.";
    if (context) {
      const multiclass = context.multiclass_label || "Unknown";
      const confidence = context.confidence || "Unknown";
      const subtype = context.tumor_subtype || "None";
      
      contextStr = `Patient Scan Results Context:
- Label/Prediction: ${multiclass}
- Confidence: ${confidence}
- Details/Subtype: ${subtype}`;
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

    const completion = await openai.chat.completions.create({
      model: 'llama-3.1-8b-instant',
      messages: completeHistory,
      temperature: 0.6,
      max_tokens: 512,
    });

    const responseText = completion.choices[0]?.message?.content || "I couldn't generate a response.";

    res.json({ response: responseText });
  } catch (error) {
    console.error('Chat error:', error);
    res.status(500).json({ error: 'Failed to generate chat response' });
  }
});

const REPORT_SYSTEM_PROMPT = `You are an AI medical report generator for Tuberculosis (TB) imaging analysis.
You must strictly follow the classifier output provided in the input and MUST NOT invent new diseases, symptoms, or treatments that contradict it.

STRICT RULES:
1. Only use information from the classifier output and general medical knowledge about TB.
2. The report MUST follow EXACTLY this 3-part structure and heading text:

1. Key Findings
Condition: (state the condition, e.g., Tuberculosis or Normal)
Confidence: (state confidence percentage)
Affected Regions: (list regions or 'None')
Risk Level: (High, Moderate, or Low based on severity and confidence)

2. Patient-Friendly Explanation
(Explain the findings in 2-4 simple sentences a patient can understand.)

3. Recommended Treatment Plan
(Provide 3-4 numbered steps, including specialist consultation, imaging or follow-up as appropriate.)

3. Do NOT use any placeholders. Write complete, final text.`;

app.post('/report', async (req, res) => {
  try {
    const { instruction, input } = req.body;

    if (!process.env.GROQ_API_KEY) {
      return res.status(500).json({ error: 'Groq API key not configured in backend' });
    }

    const multiclass = input?.multiclass_label || 'Unknown';
    const confidence = input?.confidence ? (Number(input.confidence) * 100).toFixed(1) + '%' : 'Unknown';
    const subtype = input?.predicted_tumor_type || 'None';
    const regions = (input?.top_pathology_labels || []).join(', ') || 'None';

    const isNormal = multiclass.toLowerCase() === 'normal';
    
    let promptContent = '';
    if (isNormal) {
      promptContent = `The scan is NORMAL. Generate a reassuring report indicating no Tuberculosis or abnormal growths were detected.
Confidence: ${confidence}`;
    } else {
      promptContent = `Generate a full report for this case.
Condition: ${subtype !== 'None' && subtype !== '' ? subtype : multiclass}
Confidence: ${confidence}
Affected Regions: ${regions}`;
    }

    if (instruction) {
      promptContent = `Instruction: ${instruction}\n\n${promptContent}`;
    }

    const completion = await openai.chat.completions.create({
      model: 'llama-3.1-8b-instant',
      messages: [
        { role: 'system', content: REPORT_SYSTEM_PROMPT },
        { role: 'user', content: promptContent }
      ],
      temperature: 0.4,
      max_tokens: 1024,
    });

    const reportText = completion.choices[0]?.message?.content || "Report generation failed.";

    res.json({ report: reportText });
  } catch (error) {
    console.error('Report error:', error);
    res.status(500).json({ error: 'Failed to generate report' });
  }
});

app.listen(port, () => {
  console.log(`Groq Chat backend listening on port ${port}`);
});
