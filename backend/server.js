const path = require("path");
const fs = require("fs");
const dotenv = require("dotenv");

// Auto-load .env from either backend directory or root workspace
const envPaths = [
  path.resolve(__dirname, ".env"),
  path.resolve(process.cwd(), ".env"),
  path.resolve(process.cwd(), "backend", ".env")
];

for (const envFile of envPaths) {
  if (fs.existsSync(envFile)) {
    dotenv.config({ path: envFile });
  }
}

const express = require("express");
const cors = require("cors");
const generateHandler = require("./api/generate");
const healthHandler = require("./api/health");

const app = express();
const PORT = process.env.PORT || 5000;

// Enable CORS and JSON parsing
app.use(cors());
app.use(express.json({ limit: "50mb" }));
app.use(express.urlencoded({ extended: true, limit: "50mb" }));

// Root welcome & API info
app.get("/", (req, res) => {
  res.json({
    message: "FridgeChef Gemini 2.5 Flash Wrapper API is running locally.",
    endpoints: {
      health: "/api/health",
      generate: "/api/generate (POST)"
    },
    hasApiKey: Boolean(process.env.GEMINI_API_KEY)
  });
});

// Health check endpoint
app.get("/api/health", (req, res) => {
  healthHandler(req, res);
});

// Gemini generateContent wrapper endpoint
app.all("/api/generate", (req, res) => {
  generateHandler(req, res);
});

// Fallback error handler
app.use((err, req, res, next) => {
  console.error("Server Error:", err);
  res.status(500).json({ error: { message: err.message || "Internal Server Error" } });
});

app.listen(PORT, () => {
  console.log(`🚀 Gemini Wrapper API server running at http://localhost:${PORT}`);
  console.log(`📡 Endpoint ready at http://localhost:${PORT}/api/generate`);
  if (!process.env.GEMINI_API_KEY) {
    console.warn("⚠️  WARNING: GEMINI_API_KEY is not set in your .env file!");
  } else {
    console.log("✅ GEMINI_API_KEY detected in environment.");
  }
});
