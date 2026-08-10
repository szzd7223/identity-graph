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
  const protocol = req.protocol || "http";
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

// 2. Open SSE POST Message Handler Endpoint: POST /api/mcp/messages
router.post("/mcp/messages", async (req: Request, res: Response) => {
  const sessionId = req.query.sessionId as string;
  const sseRes = sseSessions.get(sessionId);

  // Standard MCP 202 Accepted response for incoming message POSTs
  res.status(202).send("Accepted");

  if (!sseRes) return;

  const { jsonrpc, method, params, id } = req.body || {};

  // MCP Protocol Initialize
  if (method === "initialize") {
    sendSseEvent(sseRes, {
      jsonrpc: "2.0",
      id: id || 1,
      result: {
        protocolVersion: "2024-11-05",
        capabilities: { tools: {} },
        serverInfo: { name: "identity-graph-mcp", version: "1.0.0" }
      }
    });
    return;
  }

  if (method === "notifications/initialized") {
    return;
  }

  // MCP Protocol List Tools
  if (method === "tools/list") {
    sendSseEvent(sseRes, {
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
    });
    return;
  }

  // MCP Protocol Call Tool
  if (method === "tools/call") {
    const name = params?.name;
    const args = params?.arguments || {};

    try {
      if (name === "get_profile") {
        const username = args.username;
        const profile = await prisma.profile.findUnique({
          where: { username },
          include: { experiences: true, education: true, projects: true, skills: true }
        });

        sendSseEvent(sseRes, {
          jsonrpc: "2.0",
          id: id || 1,
          result: {
            content: [{ type: "text", text: profile ? JSON.stringify(profile, null, 2) : `Profile not found for username: ${username}` }]
          }
        });
        return;
      }

      if (name === "search_experience") {
        const { username, query } = args;
        const profile = await prisma.profile.findUnique({
          where: { username },
          include: { experiences: true, projects: true, skills: true }
        });

        if (!profile) {
          sendSseEvent(sseRes, {
            jsonrpc: "2.0",
            id: id || 1,
            result: { content: [{ type: "text", text: "Profile not found" }] }
          });
          return;
        }

        const lQuery = (query || "").toLowerCase();
        const results = {
          experiences: profile.experiences.filter((exp) => exp.role.toLowerCase().includes(lQuery) || exp.company.toLowerCase().includes(lQuery)),
          projects: profile.projects.filter((p) => p.title.toLowerCase().includes(lQuery) || p.technologies.toLowerCase().includes(lQuery)),
          skills: profile.skills.filter((s) => s.name.toLowerCase().includes(lQuery))
        };

        sendSseEvent(sseRes, {
          jsonrpc: "2.0",
          id: id || 1,
          result: { content: [{ type: "text", text: JSON.stringify(results, null, 2) }] }
        });
        return;
      }

      if (name === "generate_formatted_resume") {
        const username = args.username;
        const profile = await prisma.profile.findUnique({
          where: { username },
          include: { experiences: true, education: true, projects: true, skills: true }
        });

        if (!profile) {
          sendSseEvent(sseRes, {
            jsonrpc: "2.0",
            id: id || 1,
            result: { content: [{ type: "text", text: "Profile not found" }] }
          });
          return;
        }

        let md = `# ${profile.fullName}\n**${profile.title}**\n\n`;
        md += `Email: ${profile.email || "N/A"} | Phone: ${profile.phone || "N/A"}\n\n`;
        if (profile.bio) md += `## Summary\n${profile.bio}\n\n`;

        sendSseEvent(sseRes, {
          jsonrpc: "2.0",
          id: id || 1,
          result: { content: [{ type: "text", text: md }] }
        });
        return;
      }
    } catch (err: any) {
      sendSseEvent(sseRes, {
        jsonrpc: "2.0",
        id: id || 1,
        error: { code: -32603, message: err.message }
      });
      return;
    }
  }
});

// 3. Simple REST / JSON-RPC fallback endpoint: POST /api/mcp
router.post("/mcp", async (req: Request, res: Response) => {
  const { method, params, id } = req.body || {};

  if (method === "initialize") {
    res.json({
      jsonrpc: "2.0",
      id: id || 1,
      result: {
        protocolVersion: "2024-11-05",
        capabilities: { tools: {} },
        serverInfo: { name: "identity-graph-mcp", version: "1.0.0" }
      }
    });
    return;
  }

  if (method === "tools/list" || !method) {
    res.json({
      jsonrpc: "2.0",
      id: id || 1,
      result: {
        tools: [
          { name: "get_profile", description: "Retrieve a profile by username" },
          { name: "search_experience", description: "Search experiences" },
          { name: "generate_formatted_resume", description: "Generate Markdown resume" }
        ]
      }
    });
    return;
  }

  res.status(400).json({ jsonrpc: "2.0", error: { code: -32601, message: "Method not found" } });
});

export default router;
