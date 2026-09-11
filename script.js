// =====================
// STATE
// =====================
let uploadedImageBase64 = null;
let selectedDiet = "any";
let savedRecipes = JSON.parse(localStorage.getItem("fridgechef_saved") || "[]");
let apiKey = localStorage.getItem("fridgechef_apikey") || "";

// =====================
// ELEMENTS
// =====================
const navbar = document.getElementById("navbar");
const brandLogo = document.getElementById("brandLogo");
const uploadArea = document.getElementById("uploadArea");
const uploadCard = document.getElementById("uploadCard");
const uploadSection = document.getElementById("uploadSection");
const dietFilters = document.getElementById("dietFilters");
const fileInput = document.getElementById("fileInput");
const uploadBtn = document.getElementById("uploadBtn");
const previewArea = document.getElementById("previewArea");
const previewImg = document.getElementById("previewImg");
const removeBtn = document.getElementById("removeBtn");
const generateBtn = document.getElementById("generateBtn");
const btnText = document.getElementById("btnText");
const loading = document.getElementById("loading");
const loadingText = document.getElementById("loadingText");
const ingredientsSec = document.getElementById("ingredientsSection");
const ingredientTags = document.getElementById("ingredientTags");
const recipesSec = document.getElementById("recipesSection");
const recipesGrid = document.getElementById("recipesGrid");

// Navbar actions & modals
const savedBtn = document.getElementById("savedBtn");
const savedCountBadge = document.getElementById("savedCountBadge");
const mobileSavedBtn = document.getElementById("mobileSavedBtn");
const mobileSavedBadge = document.getElementById("mobileSavedBadge");
const modalOverlay = document.getElementById("modalOverlay");
const modalClose = document.getElementById("modalClose");
const modalBody = document.getElementById("modalBody");
const themeToggle = document.getElementById("themeToggle");
const themeIcon = document.getElementById("themeIcon");

// API Key UI
const apiKeyOverlay = document.getElementById("apiKeyOverlay");
const apiKeyInput = document.getElementById("apiKeyInput");
const saveApiKey = document.getElementById("saveApiKey");
const apiKeyBtn = document.getElementById("apiKeyBtn");
const mobileApiKeyBtn = document.getElementById("mobileApiKeyBtn");
const keyStatusDot = document.getElementById("keyStatusDot");
const mobileKeyStatus = document.getElementById("mobileKeyStatus");
const apiKeyClose = document.getElementById("apiKeyClose");
const dismissApiKeyBtn = document.getElementById("dismissApiKeyBtn");
const backendKeyNotice = document.getElementById("backendKeyNotice");

// How It Works Guide
const howItWorksBtn = document.getElementById("howItWorksBtn");
const mobileHowItWorksBtn = document.getElementById("mobileHowItWorksBtn");
const howItWorksOverlay = document.getElementById("howItWorksOverlay");
const howItWorksClose = document.getElementById("howItWorksClose");
const startCookingBtn = document.getElementById("startCookingBtn");

// Mobile Drawer
const mobileMenuToggle = document.getElementById("mobileMenuToggle");
const mobileDrawer = document.getElementById("mobileDrawer");
const mobileNavGenerate = document.getElementById("mobileNavGenerate");
const mobileNavDiets = document.getElementById("mobileNavDiets");

// =====================
// API CONFIGURATION
// =====================
const BACKEND_API_BASE = "https://recipe-gen-gules.vercel.app";

function getApiBase() {
  const customUrl = localStorage.getItem("fridgechef_backend_url");
  if (customUrl) return customUrl.replace(/\/+$/, "");
  const isLocalDev =
    window.location.hostname === "localhost" ||
    window.location.hostname === "127.0.0.1";
  if (isLocalDev && window.location.port === "5000") {
    return "http://localhost:5000";
  }
  return BACKEND_API_BASE;
}

function getApiEndpoint() {
  return `${getApiBase()}/api/generate`;
}

function getHealthEndpoint() {
  return `${getApiBase()}/api/health`;
}

let backendHasKey = false;

async function checkBackendHealth() {
  try {
    const res = await fetch(getHealthEndpoint());
    if (res.ok) {
      const data = await res.json();
      if (data.hasApiKeyConfigured) {
        backendHasKey = true;
        updateKeyStatus();
        apiKeyOverlay.style.display = "none";
        if (apiKeyClose) apiKeyClose.style.display = "flex";
        if (backendKeyNotice) backendKeyNotice.style.display = "block";
      }
    }
  } catch (err) {
    // Backend health check quiet fallback
  }
}

// =====================
// INIT
// =====================
updateKeyStatus();
updateSavedBadge(false);
checkBackendHealth();

apiKeyOverlay.style.display = "none";
if (apiKeyClose) apiKeyClose.style.display = "flex";

// Navbar scroll shadow
window.addEventListener("scroll", () => {
  if (window.scrollY > 20) {
    navbar.classList.add("scrolled");
  } else {
    navbar.classList.remove("scrolled");
  }
});

// =====================
// API KEY STATUS & SETUP
// =====================
function updateKeyStatus() {
  const hasKey = Boolean((apiKey && apiKey.trim().length > 5) || backendHasKey);
  if (keyStatusDot) {
    if (hasKey) {
      keyStatusDot.classList.add("active");
    } else {
      keyStatusDot.classList.remove("active");
    }
  }

  if (mobileKeyStatus) {
    if (hasKey) {
      mobileKeyStatus.textContent = backendHasKey && !apiKey ? "Backend Ready" : "Connected";
      mobileKeyStatus.classList.remove("needs-key");
    } else {
      mobileKeyStatus.textContent = "Needs Key";
      mobileKeyStatus.classList.add("needs-key");
    }
  }
}

function openApiKeyModal() {
  apiKeyInput.value = apiKey || "";
  apiKeyInput.style.borderColor = "";
  if (apiKeyClose) apiKeyClose.style.display = "flex";
  apiKeyOverlay.style.display = "flex";
  closeMobileMenu();
}

apiKeyBtn.addEventListener("click", openApiKeyModal);
mobileApiKeyBtn.addEventListener("click", openApiKeyModal);

if (apiKeyClose) {
  apiKeyClose.addEventListener("click", () => {
    apiKeyOverlay.style.display = "none";
  });
}

if (dismissApiKeyBtn) {
  dismissApiKeyBtn.addEventListener("click", () => {
    apiKeyOverlay.style.display = "none";
  });
}

apiKeyOverlay.addEventListener("click", (e) => {
  if (e.target === apiKeyOverlay) {
    apiKeyOverlay.style.display = "none";
  }
});

// Allow Escape key to dismiss any open modal
window.addEventListener("keydown", (e) => {
  if (e.key === "Escape") {
    if (apiKeyOverlay) apiKeyOverlay.style.display = "none";
    if (modalOverlay) modalOverlay.style.display = "none";
    if (howItWorksOverlay) howItWorksOverlay.style.display = "none";
  }
});

saveApiKey.addEventListener("click", () => {
  const key = apiKeyInput.value.trim();
  if (!key) {
    apiKeyInput.style.borderColor = "#eb5757";
    return;
  }
  localStorage.setItem("fridgechef_apikey", key);
  apiKey = key;
  updateKeyStatus();
  apiKeyOverlay.style.display = "none";
});

apiKeyInput.addEventListener("keydown", (e) => {
  if (e.key === "Enter") saveApiKey.click();
});

// =====================
// SAVED RECIPES BADGE
// =====================
function updateSavedBadge(animate = false) {
  const count = savedRecipes.length;
  if (savedCountBadge) {
    savedCountBadge.textContent = count;
    if (animate) {
      savedCountBadge.classList.remove("bump");
      void savedCountBadge.offsetWidth; // Trigger reflow
      savedCountBadge.classList.add("bump");
    }
  }
  if (mobileSavedBadge) {
    mobileSavedBadge.textContent = count;
    if (animate) {
      mobileSavedBadge.classList.remove("bump");
      void mobileSavedBadge.offsetWidth;
      mobileSavedBadge.classList.add("bump");
    }
  }
}

// =====================
// THEME TOGGLE
// =====================
themeToggle.addEventListener("click", () => {
  const isLight = document.documentElement.getAttribute("data-theme") === "light";
  document.documentElement.setAttribute("data-theme", isLight ? "" : "light");
  if (themeIcon) {
    themeIcon.textContent = isLight ? "🌙" : "☀️";
  } else {
    themeToggle.textContent = isLight ? "🌙" : "☀️";
  }
});

// =====================
// MOBILE MENU TOGGLE
// =====================
function toggleMobileMenu() {
  const isOpen = mobileDrawer.classList.contains("open");
  if (isOpen) {
    closeMobileMenu();
  } else {
    mobileDrawer.classList.add("open");
    mobileMenuToggle.classList.add("open");
    mobileMenuToggle.setAttribute("aria-expanded", "true");
  }
}

function closeMobileMenu() {
  mobileDrawer.classList.remove("open");
  mobileMenuToggle.classList.remove("open");
  mobileMenuToggle.setAttribute("aria-expanded", "false");
}

mobileMenuToggle.addEventListener("click", toggleMobileMenu);

// Close mobile drawer on outside click
document.addEventListener("click", (e) => {
  if (
    mobileDrawer.classList.contains("open") &&
    !navbar.contains(e.target)
  ) {
    closeMobileMenu();
  }
});

// Smooth scroll links in mobile menu
mobileNavGenerate.addEventListener("click", (e) => {
  e.preventDefault();
  closeMobileMenu();
  uploadSection.scrollIntoView({ behavior: "smooth" });
});

mobileNavDiets.addEventListener("click", (e) => {
  e.preventDefault();
  closeMobileMenu();
  dietFilters.scrollIntoView({ behavior: "smooth" });
});

// Smooth scroll for desktop links
const navGenerateLink = document.getElementById("navGenerateLink");
const navDietsLink = document.getElementById("navDietsLink");

if (navGenerateLink) {
  navGenerateLink.addEventListener("click", (e) => {
    e.preventDefault();
    uploadSection.scrollIntoView({ behavior: "smooth" });
  });
}

if (navDietsLink) {
  navDietsLink.addEventListener("click", (e) => {
    e.preventDefault();
    dietFilters.scrollIntoView({ behavior: "smooth" });
  });
}

if (brandLogo) {
  brandLogo.addEventListener("click", (e) => {
    e.preventDefault();
    window.scrollTo({ top: 0, behavior: "smooth" });
  });
}

// =====================
// HOW IT WORKS GUIDE MODAL
// =====================
function openHowItWorks() {
  howItWorksOverlay.style.display = "flex";
  closeMobileMenu();
}

howItWorksBtn.addEventListener("click", openHowItWorks);
mobileHowItWorksBtn.addEventListener("click", openHowItWorks);

howItWorksClose.addEventListener("click", () => {
  howItWorksOverlay.style.display = "none";
});

howItWorksOverlay.addEventListener("click", (e) => {
  if (e.target === howItWorksOverlay) {
    howItWorksOverlay.style.display = "none";
  }
});

startCookingBtn.addEventListener("click", () => {
  howItWorksOverlay.style.display = "none";
  uploadSection.scrollIntoView({ behavior: "smooth" });
});

// =====================
// FILE UPLOAD
// =====================
uploadBtn.addEventListener("click", () => fileInput.click());
uploadArea.addEventListener("click", () => fileInput.click());

fileInput.addEventListener("change", (e) => {
  if (e.target.files[0]) handleFile(e.target.files[0]);
});

// Drag & Drop
uploadCard.addEventListener("dragover", (e) => {
  e.preventDefault();
  uploadCard.classList.add("drag-over");
});

uploadCard.addEventListener("dragleave", () => {
  uploadCard.classList.remove("drag-over");
});

uploadCard.addEventListener("drop", (e) => {
  e.preventDefault();
  uploadCard.classList.remove("drag-over");
  const file = e.dataTransfer.files[0];
  if (file && file.type.startsWith("image/")) handleFile(file);
});

function handleFile(file) {
  const reader = new FileReader();
  reader.onload = (e) => {
    uploadedImageBase64 = e.target.result.split(",")[1];
    previewImg.src = e.target.result;
    uploadArea.style.display = "none";
    previewArea.style.display = "block";
    generateBtn.disabled = false;
  };
  reader.readAsDataURL(file);
}

removeBtn.addEventListener("click", () => {
  uploadedImageBase64 = null;
  fileInput.value = "";
  previewArea.style.display = "none";
  uploadArea.style.display = "block";
  generateBtn.disabled = true;
  ingredientsSec.style.display = "none";
  recipesSec.style.display = "none";
});

// =====================
// DIET FILTERS
// =====================
document.querySelectorAll(".filter-btn").forEach((btn) => {
  btn.addEventListener("click", () => {
    document
      .querySelectorAll(".filter-btn")
      .forEach((b) => b.classList.remove("active"));
    btn.classList.add("active");
    selectedDiet = btn.dataset.diet;
  });
});

// =====================
// GENERATE RECIPES
// =====================
const loadingMessages = [
  "Scanning your ingredients...",
  "Thinking like a chef...",
  "Crafting your recipes...",
  "Almost ready to cook! 🍳",
];

generateBtn.addEventListener("click", async () => {
  if (!uploadedImageBase64) return;

  // Show loading
  generateBtn.disabled = true;
  loading.style.display = "block";
  ingredientsSec.style.display = "none";
  recipesSec.style.display = "none";

  let msgIndex = 0;
  loadingText.textContent = loadingMessages[0];
  const msgInterval = setInterval(() => {
    msgIndex = (msgIndex + 1) % loadingMessages.length;
    loadingText.textContent = loadingMessages[msgIndex];
  }, 1800);

  const dietNote =
    selectedDiet !== "any" ? `All recipes MUST be ${selectedDiet}.` : "";

  const prompt = `You are a professional chef AI. Analyze this fridge/ingredients photo and respond ONLY with a valid JSON object, no markdown, no backticks, no explanation.

${dietNote}

Return this exact structure:
{
  "ingredients": ["ingredient1", "ingredient2", ...],
  "recipes": [
    {
      "emoji": "🍜",
      "name": "Recipe Name",
      "time": "20 mins",
      "difficulty": "Easy",
      "ingredients": ["item1", "item2"],
      "steps": ["Step 1 description", "Step 2 description", "Step 3 description"],
      "nutrition": { "calories": "320", "protein": "18g", "carbs": "42g" }
    }
  ]
}

Generate exactly 3 recipes. Steps should be clear and concise (1 sentence each). Ingredients list should be specific. Emojis should match the dish.`;

  try {
    const headers = { "Content-Type": "application/json" };
    if (apiKey) {
      headers["x-api-key"] = apiKey;
    }

    const response = await fetch(getApiEndpoint(), {
      method: "POST",
      headers,
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

    const data = await response.json();

    if (!response.ok || data.error) {
      if (response.status === 401) {
        clearInterval(msgInterval);
        loading.style.display = "none";
        generateBtn.disabled = false;
        openApiKeyModal();
        alert(
          data.error?.message ||
            "Gemini API key missing. Please enter your API key or configure GEMINI_API_KEY in your backend."
        );
        return;
      }
      throw new Error(data.error?.message || `API error (${response.status})`);
    }

    const raw = data.candidates?.[0]?.content?.parts?.[0]?.text || "";
    const clean = raw.replace(/```json|```/g, "").trim();
    const parsed = JSON.parse(clean);

    clearInterval(msgInterval);
    loading.style.display = "none";

    renderIngredients(parsed.ingredients || []);
    renderRecipes(parsed.recipes || []);
    generateBtn.disabled = false;
  } catch (err) {
    clearInterval(msgInterval);
    loading.style.display = "none";
    generateBtn.disabled = false;
    alert(
      "Something went wrong: " +
        err.message +
        "\n\nMake sure the backend is running or check your API key."
    );
  }
});

// =====================
// RENDER INGREDIENTS
// =====================
function renderIngredients(ingredients) {
  ingredientTags.innerHTML = "";
  ingredients.forEach((ing) => {
    const tag = document.createElement("div");
    tag.className = "ingredient-tag";
    tag.textContent = ing;
    ingredientTags.appendChild(tag);
  });
  ingredientsSec.style.display = "block";
  ingredientsSec.scrollIntoView({ behavior: "smooth", block: "start" });
}

// =====================
// RENDER RECIPES
// =====================
function renderRecipes(recipes) {
  recipesGrid.innerHTML = "";
  recipes.forEach((recipe, index) => {
    const isSaved = savedRecipes.some((r) => r.name === recipe.name);
    const card = document.createElement("div");
    card.className = "recipe-card";
    card.style.animationDelay = `${index * 0.1}s`;
    card.innerHTML = `
      <div class="recipe-header">
        <div class="recipe-emoji">${recipe.emoji || "🍽️"}</div>
        <div class="recipe-meta">
          <div class="recipe-name">${recipe.name}</div>
          <div class="recipe-badges">
            <span class="badge badge-time">⏱ ${recipe.time}</span>
            <span class="badge badge-diff">${recipe.difficulty}</span>
          </div>
        </div>
        <button class="save-btn" data-index="${index}" title="Save recipe">
          ${isSaved ? "❤️" : "🤍"}
        </button>
      </div>
      <div class="recipe-body">
        <div class="recipe-section-title">Ingredients</div>
        <div class="recipe-ingredients">
          ${recipe.ingredients.map((i) => `<span class="ing-chip">${i}</span>`).join("")}
        </div>
        <div class="recipe-section-title">Steps</div>
        <ol class="recipe-steps">
          ${recipe.steps
            .map(
              (step, i) => `
            <li>
              <span class="step-num">${i + 1}</span>
              <span>${step}</span>
            </li>
          `,
            )
            .join("")}
        </ol>
        ${
          recipe.nutrition
            ? `
        <div class="nutrition-row">
          <div class="nutrition-item">
            <span class="nutrition-value">${recipe.nutrition.calories}</span>
            <span class="nutrition-label">Calories</span>
          </div>
          <div class="nutrition-item">
            <span class="nutrition-value">${recipe.nutrition.protein}</span>
            <span class="nutrition-label">Protein</span>
          </div>
          <div class="nutrition-item">
            <span class="nutrition-value">${recipe.nutrition.carbs}</span>
            <span class="nutrition-label">Carbs</span>
          </div>
        </div>`
            : ""
        }
      </div>
    `;
    recipesGrid.appendChild(card);

    // Save button
    card.querySelector(".save-btn").addEventListener("click", function () {
      toggleSave(recipe, this);
    });
  });

  recipesSec.style.display = "block";
}

// =====================
// SAVE / UNSAVE
// =====================
function toggleSave(recipe, btn) {
  const existingIndex = savedRecipes.findIndex((r) => r.name === recipe.name);
  if (existingIndex === -1) {
    savedRecipes.push(recipe);
    btn.textContent = "❤️";
  } else {
    savedRecipes.splice(existingIndex, 1);
    btn.textContent = "🤍";
  }
  localStorage.setItem("fridgechef_saved", JSON.stringify(savedRecipes));
  updateSavedBadge(true);
}

// =====================
// SAVED RECIPES MODAL
// =====================
function openSavedModal() {
  renderSavedModal();
  modalOverlay.style.display = "flex";
  closeMobileMenu();
}

savedBtn.addEventListener("click", openSavedModal);
mobileSavedBtn.addEventListener("click", openSavedModal);

modalClose.addEventListener("click", () => {
  modalOverlay.style.display = "none";
});

modalOverlay.addEventListener("click", (e) => {
  if (e.target === modalOverlay) modalOverlay.style.display = "none";
});

function renderSavedModal() {
  if (savedRecipes.length === 0) {
    modalBody.innerHTML = `<div class="empty-saved">❤️<br /><br />No saved recipes yet.<br />Generate some and tap 🤍 to save!</div>`;
    return;
  }
  modalBody.innerHTML = savedRecipes
    .map(
      (r) => `
    <div class="saved-item">
      <div class="saved-item-emoji">${r.emoji || "🍽️"}</div>
      <div>
        <div class="saved-item-name">${r.name}</div>
        <div class="saved-item-sub">⏱ ${r.time} &nbsp;|&nbsp; ${r.difficulty}</div>
      </div>
    </div>
  `,
    )
    .join("");
}

