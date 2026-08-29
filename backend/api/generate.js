/**
 * Vercel Serverless Function: /api/generate
 * Wrapper API for Google Gemini 2.5 Flash generateContent endpoint
 */

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

// Helper to set CORS headers
function setCorsHeaders(res) {
  res.setHeader("Access-Control-Allow-Credentials", "true");
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader(
    "Access-Control-Allow-Methods",
    "GET,OPTIONS,PATCH,DELETE,POST,PUT"
  );
  res.setHeader(
    "Access-Control-Allow-Headers",
    "X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version, Authorization, x-api-key"
  );
}

module.exports = async function handler(req, res) {
  setCorsHeaders(res);

  // Handle preflight OPTIONS request
  if (req.method === "OPTIONS") {
    return res.status(200).end();
  }

  // Health / info check on GET
  if (req.method === "GET") {
    return res.status(200).json({
      status: "active",
      model: process.env.GEMINI_MODEL || "gemini-3.6-flash",
      endpoint: "/api/generate",
      message: "Send a POST request with your prompt/contents to generate content."
    });
  }

  if (req.method !== "POST") {
    return res.status(405).json({
      error: {
        message: `Method ${req.method} Not Allowed. Use POST.`
      }
    });
  }

  try {
    // 1. Resolve API Key: Environment variable takes priority, then headers, then body/query
    const apiKey =
      process.env.GEMINI_API_KEY ||
      req.headers["x-api-key"] ||
      (req.body && req.body.apiKey) ||
      (req.query && req.query.key);

    if (!apiKey) {
      return res.status(401).json({
        error: {
          message:
            "Missing Gemini API Key. Please configure GEMINI_API_KEY in your Vercel Project Settings (Environment Variables) or your local .env file."
        }
      });
    }

    // 2. Prepare payload for Gemini 2.5 Flash
    let requestBody = req.body;

    // If body is passed as string in some environments, parse it
    if (typeof requestBody === "string") {
      try {
        requestBody = JSON.parse(requestBody);
      } catch (parseErr) {
        return res.status(400).json({
          error: {
            message: "Invalid JSON payload in request body."
          }
        });
      }
    }

    // Support both direct Gemini format ({ contents, generationConfig }) and simplified format ({ prompt, imageBase64 })
    let geminiPayload;

    if (requestBody && requestBody.contents) {
      // Standard Gemini format
      geminiPayload = {
        contents: requestBody.contents,
        generationConfig: requestBody.generationConfig || {
          temperature: 0.7,
          maxOutputTokens: 2048
        },
        safetySettings: requestBody.safetySettings
      };
    } else if (requestBody && (requestBody.prompt || requestBody.imageBase64)) {
      // Simplified custom payload format
      const parts = [];

      if (requestBody.imageBase64) {
        // Strip data:image/...;base64, prefix if user sent full data URI
        const cleanBase64 = requestBody.imageBase64.replace(
          /^data:image\/[a-zA-Z0-9.+]+;base64,/,
          ""
        );
        parts.push({
          inline_data: {
            mime_type: requestBody.mimeType || "image/jpeg",
            data: cleanBase64
          }
        });
      }

      if (requestBody.prompt) {
        parts.push({ text: requestBody.prompt });
      }

      geminiPayload = {
        contents: [{ parts }],
        generationConfig: requestBody.generationConfig || {
          temperature: 0.7,
          maxOutputTokens: 2048
        }
      };
    } else {
      return res.status(400).json({
        error: {
          message:
            "Invalid request body. Expected either { contents: [...] } or { prompt: '...', imageBase64: '...' }."
        }
      });
    }

    // 3. Call Google Gemini API (defaults to gemini-3.6-flash)
    let selectedModel =
      process.env.GEMINI_MODEL ||
      (requestBody && requestBody.model) ||
      "gemini-3.6-flash";

    // If requested model was the deprecated 2.5-flash, automatically upgrade to 3.6-flash
    if (selectedModel === "gemini-2.5-flash") {
      selectedModel = "gemini-3.6-flash";
    }

    let geminiUrl = `https://generativelanguage.googleapis.com/v1beta/models/${selectedModel}:generateContent?key=${encodeURIComponent(
      apiKey
    )}`;

    let geminiResponse = await fetch(geminiUrl, {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify(geminiPayload)
    });

    let data = await geminiResponse.json();

    // Fallback: If 404 model not found occurs, retry with gemini-3.6-flash or gemini-flash-latest
    if (geminiResponse.status === 404 && selectedModel !== "gemini-3.6-flash") {
      const fallbackUrl = `https://generativelanguage.googleapis.com/v1beta/models/gemini-3.6-flash:generateContent?key=${encodeURIComponent(
        apiKey
      )}`;
      const fallbackResponse = await fetch(fallbackUrl, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(geminiPayload)
      });
      if (fallbackResponse.ok) {
        geminiResponse = fallbackResponse;
        data = await fallbackResponse.json();
      }
    }

    // 4. Return response with original status code from Gemini
    return res.status(geminiResponse.status).json(data);
  } catch (error) {
    console.error("Gemini API Wrapper Error:", error);
    return res.status(500).json({
      error: {
        message: error.message || "Internal server error occurred while processing Gemini API request."
      }
    });
  }
};
