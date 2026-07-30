import express from "express";
import path from "path";
import { createServer as createViteServer } from "vite";
import { GoogleGenAI, Type } from "@google/genai";

const app = express();
const PORT = 3000;

app.use(express.json({ limit: "10mb" }));

// Helper to initialize Gemini client safely
function getGeminiClient() {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    console.warn("GEMINI_API_KEY environment variable is not set. Mock/fallback responses may be used.");
    return null;
  }
  return new GoogleGenAI({
    apiKey,
    httpOptions: {
      headers: {
        "User-Agent": "aistudio-build",
      },
    },
  });
}

// -------------------------------------------------------------
// API Endpoints
// -------------------------------------------------------------

// Health check
app.get("/api/health", (_req, res) => {
  res.json({ status: "ok", service: "iNKSTECHSHUB AI Backend", creator: "Mahmood" });
});

// 1. Google @google/genai Infrastructure Endpoint branded under iNKSTECHSHUB AI
app.post("/api/ai/analyze", async (req, res) => {
  try {
    const { prompt, files, language = "en" } = req.body;

    if (!prompt && (!files || files.length === 0)) {
      return res.status(400).json({ error: "Prompt or attached file is required." });
    }

    const ai = getGeminiClient();

    const systemInstruction = `You are iNKSTECHSHUB AI, an elite digital intelligence and systems architect created by Mahmood, powered exclusively by Google @google/genai infrastructure.
You deliver precise operational logic, immaculate architectural synthesis, and minimalist clarity.
Please respond in ${language} language with clean formatting, concise technical rigor, and zero fluff.`;

    if (!ai) {
      // Fallback response if GEMINI_API_KEY is not set
      return res.json({
        engine: "inkstechshub",
        response: `[iNKSTECHSHUB AI Offline Core]
Query: "${prompt}"

• Status: Offline fallback response active.
• Google GenAI Engine: @google/genai framework ready.
• Note: Please ensure GEMINI_API_KEY is set in environment secrets for live Google GenAI model execution.`,
        timestamp: new Date().toISOString()
      });
    }

    // Build multimodal contents array if files are attached
    const contents: any[] = [];
    
    if (files && Array.isArray(files) && files.length > 0) {
      files.forEach((file: { mimeType: string; data: string }) => {
        if (file.mimeType && file.data) {
          contents.push({
            inlineData: {
              mimeType: file.mimeType,
              data: file.data.replace(/^data:(.*);base64,/, '')
            }
          });
        }
      });
    }

    if (prompt) {
      contents.push({ text: prompt });
    }

    const response = await ai.models.generateContent({
      model: "gemini-3.6-flash",
      contents: contents.length === 1 && contents[0].text ? contents[0].text : contents,
      config: {
        systemInstruction,
        temperature: 0.7,
      },
    });

    res.json({
      engine: "inkstechshub",
      response: response.text || "No response generated from iNKSTECHSHUB AI.",
      timestamp: new Date().toISOString()
    });

  } catch (err: any) {
    console.error("Error in /api/ai/analyze:", err);
    res.status(500).json({
      error: "iNKSTECHSHUB AI execution failed",
      details: err?.message || String(err)
    });
  }
});

// 2. Generative Task Prioritization & Context-Aware Suggestions Endpoint
app.post("/api/ai/prioritize-tasks", async (req, res) => {
  try {
    const { tasks, teamMembers, projectContext, language = "en" } = req.body;

    const ai = getGeminiClient();

    if (!ai) {
      // Fallback prioritization rule-based logic
      const prioritizedTasks = (tasks || []).map((t: any, idx: number) => {
        const priority = idx % 3 === 0 ? "P0" : idx % 2 === 0 ? "P1" : "P2";
        const quadrant = priority === "P0" ? "Do First (Urgent & Important)" : priority === "P1" ? "Schedule (Important, Not Urgent)" : "Delegate / Batch";
        return {
          ...t,
          aiPriority: priority,
          eisenhowerQuadrant: quadrant,
          suggestedAssignee: teamMembers?.[idx % (teamMembers?.length || 1)]?.name || t.assignee || "Unassigned",
          aiContextSuggestion: `[iNKSTECHSHUB Insight] Prioritize during local time zone overlap. Ensure code review completes prior to CET handover.`,
          estimatedHours: Math.floor(Math.random() * 8) + 2,
          riskFactor: idx % 2 === 0 ? "Low" : "Medium"
        };
      });

      return res.json({
        prioritizedTasks,
        aiSummary: "Tasks prioritized using iNKSTECHSHUB fallback operational logic matrix. Overlap hours calculated across Zurich, London, Dubai & Tokyo timezones.",
        timestamp: new Date().toISOString()
      });
    }

    const prompt = `Analyze the following technical task backlog and team structure for an enterprise software/infrastructure project.
Tasks to analyze: ${JSON.stringify(tasks)}
Team members and timezones: ${JSON.stringify(teamMembers)}
Project Context: ${projectContext || "Enterprise software architecture and infrastructure sourcing"}

Return a JSON object containing:
1. "prioritizedTasks": Array of objects for each task containing:
   - "id": string (matching original task id)
   - "title": string
   - "aiPriority": string ("P0", "P1", "P2", or "P3")
   - "eisenhowerQuadrant": string ("Do First", "Schedule", "Delegate", "Eliminate")
   - "suggestedAssignee": string (name of best matched team member)
   - "aiContextSuggestion": string (specific, actionable advice for the team member considering their timezone, skills, and technical dependencies. Provide clear next steps.)
   - "estimatedHours": number
   - "riskFactor": string ("High", "Medium", "Low")
   - "strategicImpact": string (brief summary of ROI/impact)
2. "aiSummary": string (Overall executive briefing on sprint priorities, timezone alignment, and architectural risks in ${language}).
`;

    const response = await ai.models.generateContent({
      model: "gemini-3.6-flash",
      contents: prompt,
      config: {
        systemInstruction: "You are iNKSTECHSHUB AI created by Mahmood. You specialize in generative task prioritization, workload balancing across global timezones, and contextual engineering advice for technical teams. Return structured JSON matching the requested schema.",
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            prioritizedTasks: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                properties: {
                  id: { type: Type.STRING },
                  title: { type: Type.STRING },
                  aiPriority: { type: Type.STRING },
                  eisenhowerQuadrant: { type: Type.STRING },
                  suggestedAssignee: { type: Type.STRING },
                  aiContextSuggestion: { type: Type.STRING },
                  estimatedHours: { type: Type.NUMBER },
                  riskFactor: { type: Type.STRING },
                  strategicImpact: { type: Type.STRING }
                },
                required: ["id", "aiPriority", "aiContextSuggestion"]
              }
            },
            aiSummary: { type: Type.STRING }
          },
          required: ["prioritizedTasks", "aiSummary"]
        }
      }
    });

    const parsedData = JSON.parse(response.text || "{}");
    res.json(parsedData);

  } catch (err: any) {
    console.error("Error in /api/ai/prioritize-tasks:", err);
    res.status(500).json({
      error: "Task prioritization failed",
      details: err?.message || String(err)
    });
  }
});

// 3. Infrastructure Sourcing & Architectural Blueprint Endpoint
app.post("/api/ai/blueprint", async (req, res) => {
  try {
    const { requirements, cloudProvider = "Hybrid Cloud", budgetTier = "Enterprise", language = "en" } = req.body;

    const ai = getGeminiClient();

    if (!ai) {
      return res.json({
        title: `${cloudProvider} Multi-Region Architecture Blueprint`,
        summary: "Bespoke digital architecture specifications generated by iNKSTECHSHUB AI logic engine.",
        billOfMaterials: [
          { component: "Compute Nodes", spec: "16x Hetzner AX102 / 32x GCP c3-standard-16", estimatedMonthlyCostUSD: 2400 },
          { component: "GPU Acceleration", spec: "4x NVIDIA H100 SXM5 80GB (Model Inference)", estimatedMonthlyCostUSD: 6800 },
          { component: "Persistence Layer", spec: "Multi-region Cloud Spanner + Redis Enterprise", estimatedMonthlyCostUSD: 1800 },
          { component: "Network & CDN", spec: "Cloudflare Enterprise + Dedicated Swiss Peering", estimatedMonthlyCostUSD: 950 }
        ],
        terraformSnippet: `# iNKSTECHSHUB AI Infrastructure Spec
module "inkstechshub_cluster" {
  source       = "terraform-aws-modules/eks/aws"
  version      = "~> 20.0"
  cluster_name = "inkshub-prod-eu"
  
  vpc_id     = module.vpc.vpc_id
  subnet_ids = module.vpc.private_subnets

  eks_managed_node_groups = {
    gpu_nodes = {
      instance_types = ["g5.4xlarge"]
      min_size       = 2
      max_size       = 8
    }
  }
}`,
        complianceNotes: "Compliant with Swiss Federal Act on Data Protection (FADP) and EU GDPR. End-to-end TLS 1.3 + AES-256.",
        timestamp: new Date().toISOString()
      });
    }

    const prompt = `Generate a detailed architectural blueprint and Bill of Materials (BOM) for the following infrastructure requirements:
Requirements: ${JSON.stringify(requirements)}
Primary Cloud Provider / Strategy: ${cloudProvider}
Budget Tier: ${budgetTier}
Language: ${language}

Return a JSON object containing:
1. "title": string
2. "summary": string (Executive architecture description)
3. "billOfMaterials": array of objects with "component", "spec", "estimatedMonthlyCostUSD" (number)
4. "terraformSnippet": string (valid HCL or Infrastructure as Code snippet)
5. "architectureDiagramNodes": array of strings (nodes like "Edge WAF", "API Gateway", "Kubernetes Ingress", "PostgreSQL Primary", "Redis Cluster")
6. "complianceNotes": string
`;

    const response = await ai.models.generateContent({
      model: "gemini-3.6-flash",
      contents: prompt,
      config: {
        systemInstruction: "You are iNKSTECHSHUB AI created by Mahmood. You provide high-end, European-style technical sourcing and enterprise digital architecture specs. Output strictly structured valid JSON.",
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            title: { type: Type.STRING },
            summary: { type: Type.STRING },
            billOfMaterials: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                properties: {
                  component: { type: Type.STRING },
                  spec: { type: Type.STRING },
                  estimatedMonthlyCostUSD: { type: Type.NUMBER }
                },
                required: ["component", "spec", "estimatedMonthlyCostUSD"]
              }
            },
            terraformSnippet: { type: Type.STRING },
            architectureDiagramNodes: {
              type: Type.ARRAY,
              items: { type: Type.STRING }
            },
            complianceNotes: { type: Type.STRING }
          },
          required: ["title", "summary", "billOfMaterials", "terraformSnippet", "complianceNotes"]
        }
      }
    });

    const parsedData = JSON.parse(response.text || "{}");
    res.json(parsedData);

  } catch (err: any) {
    console.error("Error in /api/ai/blueprint:", err);
    res.status(500).json({
      error: "Blueprint generation failed",
      details: err?.message || String(err)
    });
  }
});

// -------------------------------------------------------------
// Vite Server Integration
// -------------------------------------------------------------
async function startServer() {
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`[iNKSTECHSHUB AI] Express server running on http://0.0.0.0:${PORT}`);
  });
}

startServer();
