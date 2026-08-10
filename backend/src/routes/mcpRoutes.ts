import { Router, Request, Response } from "express";
import crypto from "crypto";
import { prisma } from "../db.js";

const router = Router();

// Active SSE connection sessions map
const sseSessions: Map<string, Response> = new Map();

// Helper to write JSON-RPC messages to an active SSE stream
function sendSseEvent(res: Response, payload: any) {
  res.write(`event: message\ndata: ${JSON.stringify(payload)}\n\n`);
}

// Handler for processing JSON-RPC MCP Requests
async function handleJsonRpcPayload(body: any): Promise<any> {
  const { jsonrpc, method, params, id } = body || {};

  if (method === "initialize") {
    return {
      jsonrpc: "2.0",
      id: id || 1,
      result: {
        protocolVersion: "2024-11-05",
        capabilities: { tools: {} },
        serverInfo: { name: "identity-graph-mcp", version: "1.0.0" }
      }
    };
  }

  if (method === "tools/list" || !method) {
    return {
      jsonrpc: "2.0",
      id: id || 1,
      result: {
        tools: [
          {
            name: "get_profile",
            description: "Retrieve a complete professional profile by username.",
            inputSchema: {
              type: "object",
              properties: { username: { type: "string" } },
              required: ["username"]
            }
          },
          {
            name: "search_experience",
            description: "Search and filter through a user's professional experiences, projects, and skills.",
            inputSchema: {
              type: "object",
              properties: { username: { type: "string" }, query: { type: "string" } },
              required: ["username", "query"]
            }
          },
          {
            name: "generate_formatted_resume",
            description: "Generate a clean, professional, and beautifully formatted Markdown resume.",
            inputSchema: {
              type: "object",
              properties: { username: { type: "string" } },
              required: ["username"]
            }
          }
        ]
      }
    };
  }

  if (method === "tools/call") {
    const name = params?.name || body.tool;
    const args = params?.arguments || body.args || {};

    if (name === "get_profile") {
      const username = args.username;
      const profile = await prisma.profile.findUnique({
        where: { username },
        include: { experiences: true, education: true, projects: true, skills: true }
      });
      return {
        jsonrpc: "2.0",
        id: id || 1,
        result: {
          content: [{ type: "text", text: profile ? JSON.stringify(profile, null, 2) : `Profile not found for username: ${username}` }]
        }
      };
    }

    if (name === "search_experience") {
      const { username, query } = args;
      const profile = await prisma.profile.findUnique({
        where: { username },
        include: { experiences: true, projects: true, skills: true }
      });
      if (!profile) {
        return {
          jsonrpc: "2.0",
          id: id || 1,
          result: { content: [{ type: "text", text: "Profile not found" }] }
        };
      }
      const lQuery = (query || "").toLowerCase();
      const results = {
        experiences: profile.experiences.filter((exp) => exp.role.toLowerCase().includes(lQuery) || exp.company.toLowerCase().includes(lQuery)),
        projects: profile.projects.filter((p) => p.title.toLowerCase().includes(lQuery) || p.technologies.toLowerCase().includes(lQuery)),
        skills: profile.skills.filter((s) => s.name.toLowerCase().includes(lQuery))
      };
      return {
        jsonrpc: "2.0",
        id: id || 1,
        result: { content: [{ type: "text", text: JSON.stringify(results, null, 2) }] }
      };
    }

    if (name === "generate_formatted_resume") {
      const username = args.username;
      const profile = await prisma.profile.findUnique({
        where: { username },
        include: { experiences: true, education: true, projects: true, skills: true }
      });
      if (!profile) {
        return {
          jsonrpc: "2.0",
          id: id || 1,
          result: { content: [{ type: "text", text: "Profile not found" }] }
        };
      }
      let md = `# ${profile.fullName}\n**${profile.title}**\n\n`;
      md += `Email: ${profile.email || "N/A"} | Phone: ${profile.phone || "N/A"}\n\n`;
      if (profile.bio) md += `## Summary\n${profile.bio}\n\n`;
      return {
        jsonrpc: "2.0",
        id: id || 1,
        result: { content: [{ type: "text", text: md }] }
      };
    }
  }

  return { jsonrpc: "2.0", id: id || 1, result: {} };
}

// 1. Open SSE Connection Endpoint: GET /api/mcp/sse
router.get("/mcp/sse", (req: Request, res: Response) => {
  const sessionId = crypto.randomUUID();

  res.setHeader("Content-Type", "text/event-stream");
  res.setHeader("Cache-Control", "no-cache");
  res.setHeader("Connection", "keep-alive");
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.flushHeaders();

  sseSessions.set(sessionId, res);

  const host = req.get("host") || "localhost:3001";
  const protocol = req.headers["x-forwarded-proto"] || req.protocol || "http";
  const endpointUrl = `${protocol}://${host}/api/mcp/messages?sessionId=${sessionId}`;

  // Emit standard MCP SSE endpoint handshake event
  res.write(`event: endpoint\ndata: ${endpointUrl}\n\n`);

  const keepAlive = setInterval(() => {
    res.write(`:\n\n`);
  }, 15000);

  req.on("close", () => {
    clearInterval(keepAlive);
    sseSessions.delete(sessionId);
  });
});

// 2. Open SSE POST Message Receiver Endpoint: POST /api/mcp/messages
router.post("/mcp/messages", async (req: Request, res: Response) => {
  const sessionId = req.query.sessionId as string;
  const sseRes = sseSessions.get(sessionId);

  res.status(202).send("Accepted");

  if (!sseRes) return;

  const result = await handleJsonRpcPayload(req.body);
  if (req.body?.method !== "notifications/initialized") {
    sendSseEvent(sseRes, result);
  }
});

// 3. Fallback POST handler for /api/mcp/sse (prevents 404 if client POSTs directly to /sse)
router.post("/mcp/sse", async (req: Request, res: Response) => {
  const sessionId = req.query.sessionId as string;
  const sseRes = sessionId ? sseSessions.get(sessionId) : null;

  if (sseRes) {
    res.status(202).send("Accepted");
    const result = await handleJsonRpcPayload(req.body);
    sendSseEvent(sseRes, result);
  } else {
    const result = await handleJsonRpcPayload(req.body);
    res.json(result);
  }
});

// 4. Fallback Direct REST POST endpoint: POST /api/mcp
router.post("/mcp", async (req: Request, res: Response) => {
  const result = await handleJsonRpcPayload(req.body);
  res.json(result);
});

export default router;
