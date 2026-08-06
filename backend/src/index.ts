import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import profileRoutes from "./routes/profileRoutes.js";

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
    message: "IdentityGraph API is operational"
  });
});

// Register API Routes
app.use("/api", profileRoutes);

app.listen(PORT, () => {
  console.log(`Backend server is running on http://localhost:${PORT}`);
});
export default app;
