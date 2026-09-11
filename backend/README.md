# 🍲 FridgeChef - Gemini 2.5 Flash Wrapper API (Vercel Ready)

A production-ready serverless backend wrapper for Google's **Gemini 2.5 Flash** (`gemini-2.5-flash:generateContent`) API. It securely hides your Google Gemini API key on the server side and is pre-configured for instant deployment to **Vercel Serverless Functions**.

---

## 🚀 Features

- **Secure API Key Handling**: Keeps `GEMINI_API_KEY` hidden from browser clients.
- **Vercel Serverless Ready**: Auto-configured routes via `api/generate.js` and `api/health.js` with `vercel.json`.
- **CORS Configured**: Pre-configured headers for easy consumption from any frontend origin (local or deployed).
- **Flexible Payload Support**:
  - Direct Gemini API format (`{ contents, generationConfig }`)
  - Simplified format (`{ prompt, imageBase64, mimeType }`)
- **Local Dev Server Included**: Run locally with Express and hot-reloading (`npm run dev`).

---

## 📁 Directory Structure

```
backend/
├── api/
│   ├── generate.js    # Vercel Serverless Function (/api/generate)
│   └── health.js      # Health check endpoint (/api/health)
├── .env.example       # Environment variables template
├── .gitignore         # Ignores node_modules, .env, .vercel
├── package.json       # Project dependencies & scripts
├── server.js          # Express local development server
├── vercel.json        # Vercel deployment configuration
└── README.md          # Documentation
```

---

## ⚙️ Local Setup & Testing

### 1. Install Dependencies
```bash
cd backend
npm install
```

### 2. Configure Environment Variables
Copy `.env.example` to `.env`:
```bash
cp .env.example .env
```
Open `.env` and set your API key:
```env
GEMINI_API_KEY=your_actual_gemini_api_key_here
PORT=5000
```

### 3. Start Local Server
```bash
npm run dev
```
The server will be running at `http://localhost:5000`.

---

## ☁️ How to Deploy to Vercel

### Option 1: Deploy using Vercel CLI (Fastest)

1. Open your terminal in the `backend` folder:
   ```bash
   cd backend
   ```
2. Run the Vercel deploy command:
   ```bash
   npx vercel
   ```
3. Follow the CLI prompts to link/create the project.
4. Set your environment variable in Vercel:
   ```bash
   npx vercel env add GEMINI_API_KEY
   ```
   *(Paste your Gemini API key when prompted, select Production, Preview, Development)*
5. Deploy to production:
   ```bash
   npx vercel --prod
   ```

### Option 2: Deploy via Vercel Web Dashboard (GitHub / GitLab)

1. Push your project to GitHub.
2. Go to [vercel.com](https://vercel.com) and click **"Add New..." > "Project"**.
3. Import your repository.
4. If `backend` is in a subfolder:
   - In **Root Directory**, click *Edit* and select **`backend`**.
5. Under **Environment Variables**, add:
   - **Key**: `GEMINI_API_KEY`
   - **Value**: `AIzaSy...` (your Gemini API key)
6. Click **Deploy**.

Your API is live at `https://recipe-gen-gules.vercel.app/api/generate`!

---

## 📡 API Endpoint Reference

### `POST /api/generate`

#### Option A: Direct Gemini Format (Matches `script.js`)
**Request Body:**
```json
{
  "contents": [
    {
      "parts": [
        {
          "inline_data": {
            "mime_type": "image/jpeg",
            "data": "<BASE64_IMAGE_STRING>"
          }
        },
        {
          "text": "Analyze this fridge photo and generate 3 recipes..."
        }
      ]
    }
  ],
  "generationConfig": {
    "temperature": 0.7,
    "maxOutputTokens": 2048
  }
}
```

#### Option B: Simplified Format
**Request Body:**
```json
{
  "prompt": "Analyze this fridge photo and generate 3 recipes...",
  "imageBase64": "<BASE64_STRING_OR_DATA_URL>",
  "mimeType": "image/jpeg"
}
```

---

## 🔌 Updating Frontend (`script.js`)

```javascript
const BACKEND_API_BASE = "https://recipe-gen-gules.vercel.app";
// (Or "http://localhost:5000" during local testing)

const response = await fetch(`${BACKEND_API_BASE}/api/generate`, {
  method: "POST",
  headers: { "Content-Type": "application/json" },
  body: JSON.stringify({
    contents: [
      {
        parts: [
          {
            inline_data: {
              mime_type: "image/jpeg",
              data: uploadedImageBase64,
            },
          },
          { text: prompt },
        ],
      },
    ],
    generationConfig: { temperature: 0.7, maxOutputTokens: 2048 },
  }),
});
```
