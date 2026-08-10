import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import profileRoutes from "./routes/profileRoutes.js";
import mcpRoutes from "./routes/mcpRoutes.js";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3001;

app.use(cors());
app.use(express.json());

// Base health check route
app.get("/health", (req, res) => {
  res.json({
    status: "OK",
    timestamp: new Date().toISOString(),
    message: "IdentityGraph API & Open MCP Server are operational"
  });
});

// Register API Routes & Open MCP Endpoints
app.use("/api", profileRoutes);
app.use("/api", mcpRoutes);

app.listen(PORT, () => {
  console.log(`Backend server & Open MCP Server running on http://localhost:${PORT}`);
  console.log(`  - Open SSE Endpoint: http://localhost:${PORT}/api/mcp/sse`);
  console.log(`  - Open REST JSON-RPC Endpoint: http://localhost:${PORT}/api/mcp`);
});

export default app;
