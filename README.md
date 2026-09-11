# 🍳 FridgeChef — AI-Powered Recipe Generator

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![Node.js](https://img.shields.io/badge/Node.js-18%2B-green.svg)](https://nodejs.org/)
[![Google Gemini](https://img.shields.io/badge/Google_Gemini-Vision_AI-blue.svg)](https://aistudio.google.com/)
[![Vercel](https://img.shields.io/badge/Backend-Vercel_Serverless-black.svg)](https://vercel.com/)
[![Firebase](https://img.shields.io/badge/Frontend-Firebase_Hosting-orange.svg)](https://firebase.google.com/)

> **Turn your leftover fridge ingredients into delicious, chef-curated meals in seconds using Google Gemini Vision AI.**

---

## 📖 Overview

**FridgeChef** is an intelligent full-stack web application that takes the guesswork out of home cooking. Simply snap or upload a photo of your refrigerator, pantry, or grocery haul, select your dietary preferences (Vegetarian, Vegan, Keto, or Any), and let Gemini's multimodal vision model analyze your ingredients to craft 3 personalized, step-by-step recipes complete with nutritional estimates.

Built with performance, privacy, and aesthetic excellence in mind, FridgeChef features a sleek glassmorphism UI, seamless dark/light mode toggle, bookmarking system, and a secure serverless backend proxy to protect API keys.

---

## ✨ Features

- 📸 **Visual Ingredient Detection**: Drag & drop or upload any fridge/pantry photo. Gemini Multimodal Vision AI scans and identifies items automatically.
- 🥦 **Dietary Filtering**: Tailor recipe suggestions to your diet with one tap:
  - Any (Balanced / No restrictions)
  - 🥦 Vegetarian
  - 🌱 Vegan
  - 🥩 Keto
- 🍽️ **Gourmet Recipe Cards**: Each recipe includes:
  - Prep & cooking time badges
  - Difficulty ratings (*Easy, Medium, Hard*)
  - Exact ingredients checklist
  - Step-by-step cooking instructions
  - Estimated macronutrient breakdown (*Calories, Protein, Carbs*)
- ❤️ **Saved Recipes (Favorites)**: Save your favorite dishes locally with `localStorage` persistence, accessible anytime via the Saved Recipes modal.
- 🌓 **Dark & Light Mode**: Curated color palettes with smooth transitions and persistent theme state.
- 📱 **Mobile-First & Responsive**: Includes custom mobile drawer navigation, responsive grid layouts, and micro-animations.
- 🔒 **Secure Serverless Architecture**:
  - Backend proxy hides `GEMINI_API_KEY` from the browser.
  - Vercel Serverless Function deployed and ready out of the box.
  - Optional custom API key override directly in the UI for personal AI Studio keys.

---

## 🛠️ Tech Stack

### **Frontend**
- **HTML5 & CSS3**: Custom CSS variables, responsive grid & flexbox, glassmorphism design tokens.
- **Typography**: Google Fonts ([Playfair Display](https://fonts.google.com/specimen/Playfair+Display) & [Inter](https://fonts.google.com/specimen/Inter)).
- **JavaScript (ES6+)**: Vanilla asynchronous JS, FileReader API, Canvas & Drag-and-Drop APIs.
- **Hosting**: Firebase Hosting (`fridgechef-f9f87`).

### **Backend & AI**
- **Runtime**: Node.js, Express.js (local development).
- **Serverless**: Vercel Serverless Functions (`/api/generate`, `/api/health`).
- **AI Engine**: [Google Gemini 3.6 Flash / 2.5 Flash](https://aistudio.google.com/) via Google Generative Language API (`gemini-3.6-flash:generateContent`).
- **Middleware**: CORS, Body Parser (50MB base64 image payload support), Dotenv.

---

## 📁 Repository Structure

```plaintext
Recipe-Gen/
├── api/                        # Root Vercel Serverless entry points
│   ├── generate.js             # Proxies /api/generate
│   └── health.js               # Proxies /api/health
├── backend/                    # Backend server and Vercel functions
│   ├── api/
│   │   ├── generate.js         # Gemini Vision wrapper handler
│   │   └── health.js           # API health status check
│   ├── .env.example            # Backend environment variables template
│   ├── package.json            # Backend dependencies & scripts
│   ├── server.js               # Express development server
│   ├── vercel.json             # Vercel serverless configuration
│   └── README.md               # Backend-specific documentation
├── index.html                  # Main application frontend
├── style.css                   # Custom modern styles & design tokens
├── script.js                   # Application state, UI handlers, API client
├── firebase.json               # Firebase Hosting configuration
├── .firebaserc                 # Firebase project target
├── package.json                # Root package configuration
├── vercel.json                 # Root deployment routing & CORS headers
└── README.md                   # Project documentation
```

---

## 🚀 Quick Start (Local Setup)

### Prerequisites
- [Node.js](https://nodejs.org/) (v18 or higher recommended)
- [Google Gemini API Key](https://aistudio.google.com/) (Free tier available)

---

### 1. Clone the Repository
```bash
git clone https://github.com/krishnakant09/Recipe-Gen.git
cd Recipe-Gen
```

### 2. Configure Environment Variables
Create a `.env` file in the root directory or in `backend/`:

```bash
# In project root or backend folder
cp backend/.env.example backend/.env
```

Add your Gemini API Key:
```env
GEMINI_API_KEY=your_gemini_api_key_here
PORT=5000
GEMINI_MODEL=gemini-3.6-flash
```

### 3. Install Dependencies
```bash
# Install root dependencies
npm install

# Install backend dependencies
cd backend && npm install && cd ..
```

### 4. Run Locally

You can run the backend and frontend simultaneously:

#### Terminal 1 — Start the Backend Server:
```bash
npm run server
# Server runs at http://localhost:5000
```

#### Terminal 2 — Serve the Frontend:
```bash
npm run dev
# Frontend runs at http://localhost:3000
```

Open your browser and navigate to `http://localhost:3000`.

---

## 📡 API Reference

The backend exposes two primary endpoints:

### `GET /api/health`
Checks whether the serverless API is online and whether `GEMINI_API_KEY` is configured.

**Response:**
```json
{
  "status": "ok",
  "hasApiKeyConfigured": true,
  "model": "gemini-3.6-flash",
  "timestamp": "2026-09-11T16:52:00.000Z"
}
```

---

### `POST /api/generate`
Generates ingredient analysis and structured recipe recommendations from an image.

#### Headers
| Header | Value | Description |
|---|---|---|
| `Content-Type` | `application/json` | Required |
| `x-api-key` | `string` | *(Optional)* Override backend API key with custom key |

#### Request Body (Standard Gemini Format)
```json
{
  "contents": [
    {
      "parts": [
        {
          "inline_data": {
            "mime_type": "image/jpeg",
            "data": "<BASE64_IMAGE_DATA>"
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

#### Request Body (Simplified Format)
```json
{
  "prompt": "Analyze this fridge photo and generate 3 recipes...",
  "imageBase64": "<BASE64_OR_DATA_URL>",
  "mimeType": "image/jpeg"
}
```

---

## 🌐 Deployment Guide

### Deploy Backend to Vercel

1. Push your code to GitHub.
2. Link your repository in [Vercel](https://vercel.com).
3. In your project settings, add the Environment Variable:
   - **Name**: `GEMINI_API_KEY`
   - **Value**: Your Google Gemini API Key
4. Deploy! Your backend API will be available at `https://<your-project>.vercel.app/api/generate`.

### Deploy Frontend to Firebase Hosting

1. Ensure Firebase CLI is installed and authenticated:
   ```bash
   npx firebase-tools login
   ```
2. Deploy the static frontend:
   ```bash
   npm run deploy
   ```

---

## ⚙️ Environment Variables

| Variable | Description | Default |
|---|---|---|
| `GEMINI_API_KEY` | Your Google Gemini API key from AI Studio | *Required* |
| `PORT` | Local development port for Express server | `5000` |
| `GEMINI_MODEL` | Gemini AI model version used for generation | `gemini-3.6-flash` |

---

## 🤝 Contributing

Contributions, issues, and feature requests are welcome!
Feel free to check the [issues page](https://github.com/krishnakant09/Recipe-Gen/issues).

1. Fork the Project
2. Create your Feature Branch (`git checkout -b feature/AmazingFeature`)
3. Commit your Changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the Branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

---

## 📄 License

This project is licensed under the MIT License — see the [LICENSE](LICENSE) file for details.

---

## 👨‍💻 Author

**Krishnakant (KK)**
- GitHub: [@krishnakant09](https://github.com/krishnakant09)
- Repository: [Recipe-Gen](https://github.com/krishnakant09/Recipe-Gen)

---

<p align="center">Made with ❤️ and Gemini AI</p>
