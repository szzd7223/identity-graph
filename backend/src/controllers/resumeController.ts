import { Request, Response } from "express";
import multer from "multer";
import { GoogleGenerativeAI } from "@google/generative-ai";
import mammoth from "mammoth";
import { getDocumentProxy, extractText } from "unpdf";

// ─── Multer: store in memory (no disk writes) ───────────────────────────────
export const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 10 * 1024 * 1024 }, // 10 MB max
  fileFilter: (_req, file, cb) => {
    const allowed = [
      "application/pdf",
      "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
      "application/msword",
      "text/plain",
      "text/markdown",
    ];
    if (allowed.includes(file.mimetype)) {
      cb(null, true);
    } else {
      cb(new Error("Unsupported file type. Please upload a PDF, DOCX, DOC, TXT, or MD file."));
    }
  },
});

// ─── Gemini Client ───────────────────────────────────────────────────────────
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || "");

// ─── Extract raw text from the uploaded buffer ───────────────────────────────
async function extractRawText(buffer: Buffer, mimetype: string): Promise<string> {
  if (mimetype === "application/pdf") {
    const pdf = await getDocumentProxy(new Uint8Array(buffer));
    const { text } = await extractText(pdf, { mergePages: true });
    return text;
  }

  if (
    mimetype === "application/vnd.openxmlformats-officedocument.wordprocessingml.document" ||
    mimetype === "application/msword"
  ) {
    const result = await mammoth.extractRawText({ buffer });
    return result.value;
  }

  // TXT / Markdown — read as UTF-8 string
  return buffer.toString("utf-8");
}

// ─── LLM Structured Extraction Prompt ────────────────────────────────────────
function buildPrompt(rawText: string): string {
  return `You are an expert resume parser. Parse this resume and extract ALL items found into structured JSON format.
Return ONLY valid raw JSON, with no markdown code blocks, formatting, or conversational text.

JSON Schema:
{
  "profile": {
    "fullName": "",
    "title": "",
    "bio": "2-3 sentence summary",
    "email": null,
    "phone": null,
    "website": null,
    "github": "username only",
    "linkedin": "username only"
  },
  "experiences": [
    { "company": "", "role": "", "startDate": "", "endDate": null, "description": "" }
  ],
  "education": [
    { "institution": "", "degree": "", "field": null, "startDate": null, "endDate": null }
  ],
  "projects": [
    { "title": "", "description": "", "url": null, "technologies": "comma-separated list" }
  ],
  "skills": [
    { "name": "" }
  ]
}

CRITICAL INSTRUCTIONS:
1. Extract ALL projects listed anywhere in the resume (Personal Projects, Side Pursuits, Academic Projects, Open Source, Portfolio Work). Do NOT stop after 1 project. Return EVERY single project as an entry in the "projects" array.
2. Extract ALL work experiences into the "experiences" array.
3. Extract ALL education entries into the "education" array.
4. Extract ALL technical & professional skills into the "skills" array.
5. Use null for missing fields. github/linkedin = username handle only, no URLs.

Resume Text:
${rawText.slice(0, 15000)}`;
}

// ─── Main Controller ──────────────────────────────────────────────────────────
export const parseResume = async (req: Request, res: Response): Promise<void> => {
  const file = req.file;
  if (!file) {
    res.status(400).json({ error: "No file uploaded." });
    return;
  }

  try {
    // 1. Extract raw text from the file
    const rawText = await extractRawText(file.buffer, file.mimetype);
    if (!rawText || rawText.trim().length < 50) {
      res.status(422).json({
        error: "Could not extract readable text from the file. Make sure the PDF is not a scanned image-only document.",
      });
      return;
    }

    // 2. Send extracted text to Gemini
    const model = genAI.getGenerativeModel({ model: "gemini-3.5-flash-lite" });
    const prompt = buildPrompt(rawText);
    const result = await model.generateContent(prompt);
    const responseText = result.response.text().trim();

    // 3. Strip any accidental markdown fences Gemini might add
    const cleaned = responseText
      .replace(/^```json\s*/i, "")
      .replace(/^```\s*/i, "")
      .replace(/\s*```$/i, "")
      .trim();

    // 4. Validate it's actually JSON
    let parsed: any;
    try {
      parsed = JSON.parse(cleaned);
    } catch {
      console.error("[Resume Parser] Gemini returned non-JSON:", responseText.slice(0, 500));
      res.status(500).json({ error: "AI returned an unexpected response format. Please try again." });
      return;
    }

    // Return structured data directly to frontend
    res.json({
      success: true,
      data: parsed,
    });
  } catch (error: any) {
    console.error("[Resume Parser Error]:", error);
    res.status(500).json({
      error: "Failed to parse resume file.",
      details: error.message || String(error),
    });
  }
};
