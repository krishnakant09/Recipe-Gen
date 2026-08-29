// Ensure dotenv is loaded in local development environments
if (!process.env.GEMINI_API_KEY) {
  try {
    const path = require("path");
    const fs = require("fs");
    const dotenv = require("dotenv");
    const paths = [
      path.resolve(__dirname, "..", ".env"),
      path.resolve(__dirname, "..", "..", ".env"),
      path.resolve(process.cwd(), ".env"),
      path.resolve(process.cwd(), "backend", ".env")
    ];
    for (const p of paths) {
      if (fs.existsSync(p)) {
        dotenv.config({ path: p });
      }
    }
  } catch (_) {}
}

module.exports = function handler(req, res) {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "GET,OPTIONS");

  if (req.method === "OPTIONS") {
    return res.status(200).end();
  }

  return res.status(200).json({
    status: "ok",
    service: "Gemini 2.5 Flash Wrapper API",
    hasApiKeyConfigured: Boolean(process.env.GEMINI_API_KEY),
    timestamp: new Date().toISOString()
  });
};
