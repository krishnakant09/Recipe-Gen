// =====================
// STATE
// =====================
let uploadedImageBase64 = null;
let selectedDiet = "any";
let savedRecipes = JSON.parse(localStorage.getItem("fridgechef_saved") || "[]");
let apiKey = localStorage.getItem("fridgechef_apikey") || "";
let pantryStaples = JSON.parse(
  localStorage.getItem("fridgechef_pantry") ||
  '["Salt", "Black Pepper", "Olive Oil", "Garlic", "Butter", "Soy Sauce"]'
);
let shoppingList = JSON.parse(
  localStorage.getItem("fridgechef_shopping") || "[]"
);
let currentRecipes = [];
let cookModeState = {
  recipe: null,
  stepIndex: 0,
  timerSeconds: 0,
  initialSeconds: 0,
  timerInterval: null,
  isRunning: false,
};
let tweakTargetIndex = -1;

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
const shoppingListBtn = document.getElementById("shoppingListBtn");
const shoppingCountBadge = document.getElementById("shoppingCountBadge");
const mobileShoppingListBtn = document.getElementById("mobileShoppingListBtn");
const mobileShoppingBadge = document.getElementById("mobileShoppingBadge");
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

// Pantry Staples UI
const pantryStaplesToggle = document.getElementById("pantryStaplesToggle");
const pantryContent = document.getElementById("pantryContent");
const pantryArrow = document.getElementById("pantryArrow");
const pantryChipsGrid = document.getElementById("pantryChipsGrid");
const pantryCountBadge = document.getElementById("pantryCountBadge");

// Cook Mode UI
const cookModeOverlay = document.getElementById("cookModeOverlay");
const cookRecipeEmoji = document.getElementById("cookRecipeEmoji");
const cookRecipeName = document.getElementById("cookRecipeName");
const cookStepBadge = document.getElementById("cookStepBadge");
const cookTotalTime = document.getElementById("cookTotalTime");
const cookTtsBtn = document.getElementById("cookTtsBtn");
const cookTtsIcon = document.getElementById("cookTtsIcon");
const cookExitBtn = document.getElementById("cookExitBtn");
const cookProgressBar = document.getElementById("cookProgressBar");
const cookStepNumber = document.getElementById("cookStepNumber");
const cookStepText = document.getElementById("cookStepText");
const cookTimerBox = document.getElementById("cookTimerBox");
const timerDigits = document.getElementById("timerDigits");
const timerLabel = document.getElementById("timerLabel");
const timerStartBtn = document.getElementById("timerStartBtn");
const timerResetBtn = document.getElementById("timerResetBtn");
const timerPlus1m = document.getElementById("timerPlus1m");
const cookPrevBtn = document.getElementById("cookPrevBtn");
const cookNextBtn = document.getElementById("cookNextBtn");
const cookNextBtnText = document.getElementById("cookNextBtnText");

// Shopping List UI
const shoppingListOverlay = document.getElementById("shoppingListOverlay");
const shoppingListClose = document.getElementById("shoppingListClose");
const shoppingInput = document.getElementById("shoppingInput");
const shoppingAddBtn = document.getElementById("shoppingAddBtn");
const shoppingListItems = document.getElementById("shoppingListItems");
const shoppingItemCount = document.getElementById("shoppingItemCount");
const copyShoppingListBtn = document.getElementById("copyShoppingListBtn");
const shareWhatsappBtn = document.getElementById("shareWhatsappBtn");
const amazonFreshBtn = document.getElementById("amazonFreshBtn");
const clearShoppingListBtn = document.getElementById("clearShoppingListBtn");

// Tweak Recipe UI
const tweakModalOverlay = document.getElementById("tweakModalOverlay");
const tweakModalClose = document.getElementById("tweakModalClose");
const tweakTargetEmoji = document.getElementById("tweakTargetEmoji");
const tweakTargetName = document.getElementById("tweakTargetName");
const tweakCustomInput = document.getElementById("tweakCustomInput");
const applyTweakBtn = document.getElementById("applyTweakBtn");
const applyTweakBtnText = document.getElementById("applyTweakBtnText");

// Substitutions UI
const subsModalOverlay = document.getElementById("subsModalOverlay");
const subsModalClose = document.getElementById("subsModalClose");
const subsSearchInput = document.getElementById("subsSearchInput");
const subsCardsContainer = document.getElementById("subsCardsContainer");

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
// DIET & PANTRY STAPLES SETUP
// =====================
const DEFAULT_PANTRY_STAPLES = [
  "Salt",
  "Black Pepper",
  "Olive Oil",
  "Garlic",
  "Butter",
  "Soy Sauce",
  "Sugar",
  "Flour",
  "Lemon",
  "Eggs",
  "Milk",
  "Onion"
];

function initPantryStaples() {
  if (!pantryChipsGrid) return;
  pantryChipsGrid.innerHTML = "";
  DEFAULT_PANTRY_STAPLES.forEach((staple) => {
    const isSelected = pantryStaples.includes(staple);
    const chip = document.createElement("button");
    chip.type = "button";
    chip.className = `pantry-chip ${isSelected ? "active" : ""}`;
    chip.innerHTML = `<span>${isSelected ? "✓" : "+"}</span> <span>${staple}</span>`;
    chip.addEventListener("click", () => {
      const idx = pantryStaples.indexOf(staple);
      if (idx === -1) {
        pantryStaples.push(staple);
        chip.classList.add("active");
        chip.querySelector("span").textContent = "✓";
      } else {
        pantryStaples.splice(idx, 1);
        chip.classList.remove("active");
        chip.querySelector("span").textContent = "+";
      }
      localStorage.setItem("fridgechef_pantry", JSON.stringify(pantryStaples));
      updatePantryBadge();
    });
    pantryChipsGrid.appendChild(chip);
  });
  updatePantryBadge();
}

function updatePantryBadge() {
  if (pantryCountBadge) {
    pantryCountBadge.textContent = `Selected (${pantryStaples.length})`;
  }
}

if (pantryStaplesToggle) {
  pantryStaplesToggle.addEventListener("click", () => {
    const isHidden = pantryContent.style.display === "none";
    pantryContent.style.display = isHidden ? "block" : "none";
    if (pantryArrow) {
      pantryArrow.classList.toggle("open", isHidden);
    }
  });
}

initPantryStaples();

// Diet filter click listeners
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
// SHOPPING LIST MANAGER
// =====================
function updateShoppingBadge(animate = false) {
  const count = shoppingList.length;
  if (shoppingCountBadge) {
    shoppingCountBadge.textContent = count;
    if (animate) {
      shoppingCountBadge.classList.remove("bump");
      void shoppingCountBadge.offsetWidth;
      shoppingCountBadge.classList.add("bump");
    }
  }
  if (mobileShoppingBadge) {
    mobileShoppingBadge.textContent = count;
    if (animate) {
      mobileShoppingBadge.classList.remove("bump");
      void mobileShoppingBadge.offsetWidth;
      mobileShoppingBadge.classList.add("bump");
    }
  }
}

function saveShoppingList() {
  localStorage.setItem("fridgechef_shopping", JSON.stringify(shoppingList));
  updateShoppingBadge(true);
}

function openShoppingListModal() {
  renderShoppingList();
  shoppingListOverlay.style.display = "flex";
  closeMobileMenu();
}

function renderShoppingList() {
  if (!shoppingListItems) return;
  shoppingListItems.innerHTML = "";
  if (shoppingItemCount) {
    shoppingItemCount.textContent = `${shoppingList.length} ${shoppingList.length === 1 ? "item" : "items"}`;
  }

  if (shoppingList.length === 0) {
    shoppingListItems.innerHTML = `
      <div style="text-align:center; padding: 30px 10px; color: var(--text-muted); font-size: 0.9rem;">
        🛒 Your grocery list is empty.<br /><br />Add items above or click <b>Add to List</b> on any recipe!
      </div>
    `;
    return;
  }

  shoppingList.forEach((item, index) => {
    const row = document.createElement("div");
    row.className = `shopping-item ${item.checked ? "checked" : ""}`;
    row.innerHTML = `
      <label class="shopping-item-left">
        <input type="checkbox" class="shopping-checkbox" ${item.checked ? "checked" : ""} data-index="${index}" />
        <span class="shopping-item-text">${item.text}</span>
      </label>
      <button class="shopping-item-del" data-index="${index}" title="Remove item">✕</button>
    `;

    row.querySelector(".shopping-checkbox").addEventListener("change", function () {
      item.checked = this.checked;
      row.classList.toggle("checked", item.checked);
      saveShoppingList();
    });

    row.querySelector(".shopping-item-del").addEventListener("click", () => {
      shoppingList.splice(index, 1);
      saveShoppingList();
      renderShoppingList();
    });

    shoppingListItems.appendChild(row);
  });
}

function addShoppingItem(text) {
  const trimmed = text.trim();
  if (!trimmed) return;
  // Prevent exact duplicates
  if (!shoppingList.some((item) => item.text.toLowerCase() === trimmed.toLowerCase())) {
    shoppingList.push({ id: Date.now(), text: trimmed, checked: false });
    saveShoppingList();
  }
}

if (shoppingListBtn) shoppingListBtn.addEventListener("click", openShoppingListModal);
if (mobileShoppingListBtn) mobileShoppingListBtn.addEventListener("click", openShoppingListModal);
if (shoppingListClose) {
  shoppingListClose.addEventListener("click", () => {
    shoppingListOverlay.style.display = "none";
  });
}
shoppingListOverlay.addEventListener("click", (e) => {
  if (e.target === shoppingListOverlay) shoppingListOverlay.style.display = "none";
});

if (shoppingAddBtn) {
  shoppingAddBtn.addEventListener("click", () => {
    if (shoppingInput && shoppingInput.value) {
      addShoppingItem(shoppingInput.value);
      shoppingInput.value = "";
      renderShoppingList();
    }
  });
}

if (shoppingInput) {
  shoppingInput.addEventListener("keydown", (e) => {
    if (e.key === "Enter") {
      addShoppingItem(shoppingInput.value);
      shoppingInput.value = "";
      renderShoppingList();
    }
  });
}

if (copyShoppingListBtn) {
  copyShoppingListBtn.addEventListener("click", async () => {
    if (shoppingList.length === 0) return;
    const text = "🛒 FridgeChef Grocery List:\n" +
      shoppingList.map((i) => `${i.checked ? "✓ [x]" : "• [ ]"} ${i.text}`).join("\n");
    try {
      await navigator.clipboard.writeText(text);
      const orig = copyShoppingListBtn.textContent;
      copyShoppingListBtn.textContent = "Copied! ✓";
      setTimeout(() => (copyShoppingListBtn.textContent = orig), 2000);
    } catch (_) {
      alert("Shopping list:\n\n" + text);
    }
  });
}

if (shareWhatsappBtn) {
  shareWhatsappBtn.addEventListener("click", () => {
    if (shoppingList.length === 0) return;
    const unchecked = shoppingList.filter((i) => !i.checked);
    const itemsToShare = unchecked.length ? unchecked : shoppingList;
    const msg = `🍳 *FridgeChef Grocery Shopping List*:\n` +
      itemsToShare.map((i) => `• ${i.text}`).join("\n") +
      `\n\nGenerated with FridgeChef AI`;
    const url = `https://api.whatsapp.com/send?text=${encodeURIComponent(msg)}`;
    window.open(url, "_blank");
  });
}

if (amazonFreshBtn) {
  amazonFreshBtn.addEventListener("click", () => {
    if (shoppingList.length === 0) return;
    const unchecked = shoppingList.filter((i) => !i.checked);
    const query = (unchecked[0] || shoppingList[0]).text;
    window.open(`https://blinkit.com/s/?q=${encodeURIComponent(query)}`, "_blank");
  });
}

if (clearShoppingListBtn) {
  clearShoppingListBtn.addEventListener("click", () => {
    if (shoppingList.length === 0) return;
    if (confirm("Clear all items from your shopping list?")) {
      shoppingList = [];
      saveShoppingList();
      renderShoppingList();
    }
  });
}

updateShoppingBadge(false);

// =====================
// SMART CULINARY SUBSTITUTIONS
// =====================
const CULINARY_SUBSTITUTIONS = [
  {
    name: "Heavy Cream",
    ratio: "3/4 cup milk + 1/4 cup melted unsalted butter",
    note: "Works in soups, pan sauces, and baking (cannot whip)."
  },
  {
    name: "Buttermilk",
    ratio: "1 cup milk + 1 tbsp lemon juice or white vinegar",
    note: "Let stand for 5 minutes until lightly curdled."
  },
  {
    name: "Egg (in Baking)",
    ratio: "1/4 cup unsweetened applesauce OR 1 tbsp ground flaxseed + 3 tbsp water",
    note: "Provides identical moisture and binding power."
  },
  {
    name: "Butter",
    ratio: "Equal parts olive oil, coconut oil, or plain Greek yogurt",
    note: "Olive oil is ideal for savory cooking; Greek yogurt cuts fat."
  },
  {
    name: "Soy Sauce",
    ratio: "Equal parts coconut aminos OR gluten-free tamari",
    note: "Coconut aminos is slightly sweeter and 70% lower sodium."
  },
  {
    name: "Sour Cream",
    ratio: "Equal parts plain Greek yogurt",
    note: "Delivers the same pleasant acidity with 3x higher protein."
  },
  {
    name: "Cornstarch (Thickener)",
    ratio: "2 tbsp all-purpose flour per 1 tbsp cornstarch",
    note: "Slurry with cold liquid before whisking into simmering liquid."
  },
  {
    name: "Brown Sugar",
    ratio: "1 cup white granulated sugar + 1 tbsp molasses or maple syrup",
    note: "Preserves natural moisture and deep caramel undertones."
  },
  {
    name: "Fresh Garlic Cloves",
    ratio: "1/8 tsp garlic powder per 1 clove fresh garlic",
    note: "Avoid burning dry garlic powder in hot oil."
  },
  {
    name: "All-Purpose Flour",
    ratio: "1:1 Gluten-free 1-to-1 baking blend OR oat flour",
    note: "Oat flour gives pleasant earthy warmth to baked goods."
  },
  {
    name: "Lemon Juice (Acidity)",
    ratio: "Equal parts lime juice OR half amount white vinegar",
    note: "Provides clean acid balance to brighten rich flavors."
  },
  {
    name: "Mayonnaise",
    ratio: "Equal parts plain Greek yogurt or mashed ripe avocado",
    note: "Creates creamy dressings with heart-healthy fats."
  },
  {
    name: "Breadcrumbs",
    ratio: "Crushed crackers, rolled oats, crushed cornflakes, or almond flour",
    note: "Provides crisp crusting for air-frying or sautéing."
  },
  {
    name: "Parmesan Cheese",
    ratio: "Nutritional yeast (vegan) OR Pecorino Romano",
    note: "Nutritional yeast adds sharp savory umami without dairy."
  },
  {
    name: "Tomato Sauce",
    ratio: "Tomato paste mixed with equal parts warm water + Italian herbs",
    note: "Great quick fix for pizza, pasta, or marinara."
  },
  {
    name: "Cooking Wine",
    ratio: "Chicken or vegetable stock + 1 tsp lemon juice or apple cider vinegar",
    note: "Delivers brightness and deglazing power without alcohol."
  },
  {
    name: "Honey / Maple Syrup",
    ratio: "Equal parts agave nectar OR simple sugar syrup (1.25 : 1)",
    note: "Agave dissolves instantly in hot or cold dishes."
  },
  {
    name: "Olive Oil",
    ratio: "Avocado oil, melted ghee, or vegetable oil",
    note: "Avocado oil withstands very high heat up to 500°F."
  }
];

function initSubstitutions(filterQuery = "") {
  if (!subsCardsContainer) return;
  subsCardsContainer.innerHTML = "";
  const query = filterQuery.toLowerCase().trim();
  const filtered = CULINARY_SUBSTITUTIONS.filter(
    (s) =>
      s.name.toLowerCase().includes(query) ||
      s.ratio.toLowerCase().includes(query) ||
      s.note.toLowerCase().includes(query)
  );

  if (filtered.length === 0) {
    subsCardsContainer.innerHTML = `
      <div style="grid-column: 1 / -1; text-align:center; padding: 24px; color: var(--text-muted);">
        No substitutions found for "${filterQuery}". Try searching "butter", "milk", or "flour".
      </div>
    `;
    return;
  }

  filtered.forEach((sub) => {
    const card = document.createElement("div");
    card.className = "sub-card";
    card.innerHTML = `
      <div class="sub-card-title">🔄 ${sub.name}</div>
      <div class="sub-card-ratio"><b>Substitute with:</b> ${sub.ratio}</div>
      <div class="sub-card-note">${sub.note}</div>
    `;
    subsCardsContainer.appendChild(card);
  });
}

function openSubstitutionsModal(ingredientSeed = "") {
  if (subsSearchInput) {
    subsSearchInput.value = ingredientSeed;
  }
  initSubstitutions(ingredientSeed);
  subsModalOverlay.style.display = "flex";
  closeMobileMenu();
}

if (subsModalClose) {
  subsModalClose.addEventListener("click", () => {
    subsModalOverlay.style.display = "none";
  });
}
subsModalOverlay.addEventListener("click", (e) => {
  if (e.target === subsModalOverlay) subsModalOverlay.style.display = "none";
});

if (subsSearchInput) {
  subsSearchInput.addEventListener("input", (e) => {
    initSubstitutions(e.target.value);
  });
}

// =====================
// FULLSCREEN COOK MODE ENGINE
// =====================
let ttsSpeaking = false;

function openCookMode(recipeIndex) {
  const recipe = currentRecipes[recipeIndex];
  if (!recipe || !recipe.steps || !recipe.steps.length) return;

  cookModeState.recipe = recipe;
  cookModeState.stepIndex = 0;
  clearInterval(cookModeState.timerInterval);
  cookModeState.isRunning = false;

  cookRecipeEmoji.textContent = recipe.emoji || "🍳";
  cookRecipeName.textContent = recipe.name;
  cookTotalTime.textContent = `⏱ ${recipe.time}`;

  cookModeOverlay.style.display = "flex";
  renderCookStep();
}

function renderCookStep() {
  const recipe = cookModeState.recipe;
  const stepIdx = cookModeState.stepIndex;
  const total = recipe.steps.length;

  cookStepBadge.textContent = `Step ${stepIdx + 1} of ${total}`;
  cookStepNumber.textContent = `STEP ${stepIdx + 1}`;
  cookStepText.textContent = recipe.steps[stepIdx];

  const pct = Math.round(((stepIdx + 1) / total) * 100);
  cookProgressBar.style.width = `${pct}%`;

  cookPrevBtn.disabled = stepIdx === 0;
  if (stepIdx === total - 1) {
    cookNextBtnText.textContent = "🎉 Finish Cooking!";
    cookNextBtn.classList.add("finish");
  } else {
    cookNextBtnText.textContent = "Next Step →";
    cookNextBtn.classList.remove("finish");
  }

  // Cancel any ongoing TTS when step changes
  if (ttsSpeaking && "speechSynthesis" in window) {
    window.speechSynthesis.cancel();
    ttsSpeaking = false;
    cookTtsBtn.classList.remove("speaking");
    cookTtsIcon.textContent = "🔊";
  }

  // Check if current step mentions a cooking time
  setupStepTimer(recipe.steps[stepIdx]);
}

function setupStepTimer(stepText) {
  clearInterval(cookModeState.timerInterval);
  cookModeState.isRunning = false;
  timerStartBtn.textContent = "▶ Start";
  timerDigits.classList.remove("finished");

  const match = stepText.match(
    /(\d+(?:\.\d+)?)(?:\s*(?:-|to)\s*(\d+(?:\.\d+)?))?\s*(minutes?|mins?|seconds?|secs?|hours?|hrs?)/i
  );

  if (match) {
    const val = match[2] ? parseFloat(match[2]) : parseFloat(match[1]);
    const unit = match[3].toLowerCase();
    let seconds = 0;
    if (unit.startsWith("sec")) {
      seconds = Math.round(val);
    } else if (unit.startsWith("hour") || unit.startsWith("hr")) {
      seconds = Math.round(val * 3600);
    } else {
      seconds = Math.round(val * 60);
    }
    cookModeState.timerSeconds = seconds;
    cookModeState.initialSeconds = seconds;
    timerLabel.textContent = `Detected: ${match[0]}`;
    updateTimerDisplay();
    cookTimerBox.style.display = "flex";
  } else {
    // Hide timer if no time detected
    cookTimerBox.style.display = "none";
  }
}

function updateTimerDisplay() {
  const s = Math.max(0, cookModeState.timerSeconds);
  const mins = Math.floor(s / 60);
  const secs = s % 60;
  timerDigits.textContent = `${String(mins).padStart(2, "0")}:${String(secs).padStart(2, "0")}`;
}

function toggleTimer() {
  if (cookTimerBox.style.display === "none") return;
  if (cookModeState.isRunning) {
    clearInterval(cookModeState.timerInterval);
    cookModeState.isRunning = false;
    timerStartBtn.textContent = "▶ Resume";
  } else {
    if (cookModeState.timerSeconds <= 0) {
      cookModeState.timerSeconds = cookModeState.initialSeconds || 300;
    }
    cookModeState.isRunning = true;
    timerStartBtn.textContent = "⏸ Pause";
    timerDigits.classList.remove("finished");

    cookModeState.timerInterval = setInterval(() => {
      cookModeState.timerSeconds--;
      updateTimerDisplay();
      if (cookModeState.timerSeconds <= 0) {
        clearInterval(cookModeState.timerInterval);
        cookModeState.isRunning = false;
        timerStartBtn.textContent = "▶ Restart";
        timerDigits.classList.add("finished");
        playAudioChime();
      }
    }, 1000);
  }
}

function resetTimer() {
  clearInterval(cookModeState.timerInterval);
  cookModeState.isRunning = false;
  cookModeState.timerSeconds = cookModeState.initialSeconds || 300;
  timerStartBtn.textContent = "▶ Start";
  timerDigits.classList.remove("finished");
  updateTimerDisplay();
}

function addTimerMinute() {
  cookModeState.timerSeconds += 60;
  updateTimerDisplay();
}

function playAudioChime() {
  try {
    const AudioContext = window.AudioContext || window.webkitAudioContext;
    if (!AudioContext) return;
    const ctx = new AudioContext();
    [523.25, 659.25, 783.99, 1046.5].forEach((freq, idx) => {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = "triangle";
      osc.frequency.setValueAtTime(freq, ctx.currentTime + idx * 0.16);
      gain.gain.setValueAtTime(0.3, ctx.currentTime + idx * 0.16);
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + idx * 0.16 + 0.4);
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start(ctx.currentTime + idx * 0.16);
      osc.stop(ctx.currentTime + idx * 0.16 + 0.4);
    });
  } catch (_) { }
}

function toggleVoiceRead() {
  if (!("speechSynthesis" in window)) {
    alert("Speech Synthesis (text-to-speech) is not available in your browser.");
    return;
  }
  if (ttsSpeaking) {
    window.speechSynthesis.cancel();
    ttsSpeaking = false;
    cookTtsBtn.classList.remove("speaking");
    cookTtsIcon.textContent = "🔊";
    return;
  }

  window.speechSynthesis.cancel();
  const textToRead = `${cookStepNumber.textContent}. ${cookStepText.textContent}`;
  const utterance = new SpeechSynthesisUtterance(textToRead);
  utterance.rate = 0.95;
  utterance.pitch = 1.0;

  utterance.onstart = () => {
    ttsSpeaking = true;
    cookTtsBtn.classList.add("speaking");
    cookTtsIcon.textContent = "⏹";
  };
  utterance.onend = () => {
    ttsSpeaking = false;
    cookTtsBtn.classList.remove("speaking");
    cookTtsIcon.textContent = "🔊";
  };
  utterance.onerror = () => {
    ttsSpeaking = false;
    cookTtsBtn.classList.remove("speaking");
    cookTtsIcon.textContent = "🔊";
  };

  window.speechSynthesis.speak(utterance);
}

function closeCookMode() {
  cookModeOverlay.style.display = "none";
  clearInterval(cookModeState.timerInterval);
  cookModeState.isRunning = false;
  if (ttsSpeaking && "speechSynthesis" in window) {
    window.speechSynthesis.cancel();
    ttsSpeaking = false;
  }
}

if (cookExitBtn) cookExitBtn.addEventListener("click", closeCookMode);
if (cookTtsBtn) cookTtsBtn.addEventListener("click", toggleVoiceRead);
if (timerStartBtn) timerStartBtn.addEventListener("click", toggleTimer);
if (timerResetBtn) timerResetBtn.addEventListener("click", resetTimer);
if (timerPlus1m) timerPlus1m.addEventListener("click", addTimerMinute);

if (cookPrevBtn) {
  cookPrevBtn.addEventListener("click", () => {
    if (cookModeState.stepIndex > 0) {
      cookModeState.stepIndex--;
      renderCookStep();
    }
  });
}

if (cookNextBtn) {
  cookNextBtn.addEventListener("click", () => {
    const total = cookModeState.recipe.steps.length;
    if (cookModeState.stepIndex < total - 1) {
      cookModeState.stepIndex++;
      renderCookStep();
    } else {
      // Last step completed
      alert("🎉 Congratulations, Chef! Dish completed. Enjoy your meal!");
      closeCookMode();
    }
  });
}

// Cook Mode Keyboard Navigation
window.addEventListener("keydown", (e) => {
  if (cookModeOverlay.style.display === "flex") {
    if (e.key === "ArrowRight") {
      e.preventDefault();
      cookNextBtn.click();
    } else if (e.key === "ArrowLeft") {
      e.preventDefault();
      cookPrevBtn.click();
    } else if (e.key === " " && e.target.tagName !== "INPUT" && e.target.tagName !== "TEXTAREA") {
      e.preventDefault();
      toggleTimer();
    }
  }
});

// =====================
// TWEAK RECIPE AI ENGINE
// =====================
function openTweakModal(index) {
  tweakTargetIndex = index;
  const recipe = currentRecipes[index];
  if (!recipe) return;

  tweakTargetEmoji.textContent = recipe.emoji || "🍜";
  tweakTargetName.textContent = recipe.name;
  tweakCustomInput.value = "";

  document.querySelectorAll(".tweak-preset-chip").forEach((c) => c.classList.remove("selected"));
  tweakModalOverlay.style.display = "flex";
  closeMobileMenu();
}

if (tweakModalClose) {
  tweakModalClose.addEventListener("click", () => {
    tweakModalOverlay.style.display = "none";
  });
}
tweakModalOverlay.addEventListener("click", (e) => {
  if (e.target === tweakModalOverlay) tweakModalOverlay.style.display = "none";
});

document.querySelectorAll(".tweak-preset-chip").forEach((chip) => {
  chip.addEventListener("click", () => {
    chip.classList.toggle("selected");
    const tweak = chip.dataset.tweak;
    if (chip.classList.contains("selected")) {
      if (tweakCustomInput.value) {
        tweakCustomInput.value += ` & ${tweak}`;
      } else {
        tweakCustomInput.value = tweak;
      }
    }
  });
});

if (applyTweakBtn) {
  applyTweakBtn.addEventListener("click", async () => {
    const tweakText = tweakCustomInput.value.trim();
    if (!tweakText) {
      alert("Please select a preset or type your custom recipe tweak instructions.");
      return;
    }
    const targetRecipe = currentRecipes[tweakTargetIndex];
    if (!targetRecipe) return;

    applyTweakBtn.disabled = true;
    applyTweakBtnText.textContent = "Chef AI is tweaking...";

    const tweakPrompt = `You are a world-class professional chef AI. Modify this recipe based precisely on the user's tweak request.

User Request: "${tweakText}"

Original Recipe:
${JSON.stringify(targetRecipe)}

Available Pantry Staples:
${pantryStaples.join(", ")}

Respond ONLY with a valid JSON object, no markdown, no backticks, no explanation, matching this exact structure:
{
  "emoji": "🍜",
  "name": "Modified Recipe Name",
  "time": "20 mins",
  "difficulty": "Easy",
  "ingredients": ["1 cup item1", "2 tbsp item2"],
  "steps": ["Step 1", "Step 2", "Step 3"],
  "nutrition": { "calories": "350", "protein": "25g", "carbs": "30g" }
}`;

    try {
      const headers = { "Content-Type": "application/json" };
      if (apiKey) headers["x-api-key"] = apiKey;

      const response = await fetch(getApiEndpoint(), {
        method: "POST",
        headers,
        body: JSON.stringify({
          contents: [{ parts: [{ text: tweakPrompt }] }],
          generationConfig: { temperature: 0.7, maxOutputTokens: 2048 },
        }),
      });

      const data = await response.json();
      if (!response.ok || data.error) {
        throw new Error(data.error?.message || `API Error (${response.status})`);
      }

      const raw = data.candidates?.[0]?.content?.parts?.[0]?.text || "";
      const clean = raw.replace(/```json|```/g, "").trim();
      const updatedRecipe = JSON.parse(clean);

      // Preserve baseline original data for servings scaler
      currentRecipes[tweakTargetIndex] = updatedRecipe;
      renderRecipes(currentRecipes);

      tweakModalOverlay.style.display = "none";
      applyTweakBtn.disabled = false;
      applyTweakBtnText.textContent = "✨ Regenerate with AI Twist";

      // Highlight the modified card
      const cards = recipesGrid.querySelectorAll(".recipe-card");
      if (cards[tweakTargetIndex]) {
        cards[tweakTargetIndex].scrollIntoView({ behavior: "smooth", block: "center" });
      }
    } catch (err) {
      applyTweakBtn.disabled = false;
      applyTweakBtnText.textContent = "✨ Regenerate with AI Twist";
      alert("Tweak failed: " + err.message);
    }
  });
}

// =====================
// DYNAMIC SERVINGS SCALER
// =====================
function formatFraction(val) {
  if (Math.abs(val - Math.round(val)) < 0.05) {
    return Math.round(val).toString();
  }
  const whole = Math.floor(val);
  const remainder = val - whole;
  const fractions = [
    { dec: 0.25, frac: "1/4" },
    { dec: 0.33, frac: "1/3" },
    { dec: 0.5, frac: "1/2" },
    { dec: 0.67, frac: "2/3" },
    { dec: 0.75, frac: "3/4" },
  ];
  for (const f of fractions) {
    if (Math.abs(remainder - f.dec) < 0.08) {
      return whole > 0 ? `${whole} ${f.frac}` : f.frac;
    }
  }
  return val.toFixed(1).replace(/\.0$/, "");
}

function scaleIngredientText(text, multiplier) {
  // Matches "1 1/2", "1/2", "2.5", "2"
  return text.replace(/\b(\d+\s+\d+\/\d+|\d+\/\d+|\d+(?:\.\d+)?)\b/, (match) => {
    let num = 0;
    if (match.includes(" ")) {
      const parts = match.split(" ");
      const fracParts = parts[1].split("/");
      num = parseFloat(parts[0]) + parseFloat(fracParts[0]) / parseFloat(fracParts[1]);
    } else if (match.includes("/")) {
      const parts = match.split("/");
      num = parseFloat(parts[0]) / parseFloat(parts[1]);
    } else {
      num = parseFloat(match);
    }
    if (isNaN(num)) return match;
    return formatFraction(num * multiplier);
  });
}

function scaleNutritionValue(valStr, multiplier) {
  if (!valStr) return "";
  const match = valStr.toString().match(/(\d+(?:\.\d+)?)/);
  if (!match) return valStr;
  const num = Math.round(parseFloat(match[1]) * multiplier);
  return valStr.toString().replace(match[1], num);
}

function updateRecipeCardScale(card, recipe, scaleFactor) {
  // Baseline is 2 servings, so multiplier is scaleFactor / 2
  const multiplier = scaleFactor / 2;

  // Scale Ingredients
  const ingContainer = card.querySelector(".recipe-ingredients");
  if (ingContainer && recipe.ingredients) {
    ingContainer.innerHTML = recipe.ingredients
      .map((ing) => `<span class="ing-chip">${scaleIngredientText(ing, multiplier)}</span>`)
      .join("");
  }

  // Scale Nutrition
  if (recipe.nutrition) {
    const calEl = card.querySelector(".nutrition-item:nth-child(1) .nutrition-value");
    const proEl = card.querySelector(".nutrition-item:nth-child(2) .nutrition-value");
    const carbEl = card.querySelector(".nutrition-item:nth-child(3) .nutrition-value");

    if (calEl) calEl.textContent = scaleNutritionValue(recipe.nutrition.calories, multiplier);
    if (proEl) proEl.textContent = scaleNutritionValue(recipe.nutrition.protein, multiplier);
    if (carbEl) carbEl.textContent = scaleNutritionValue(recipe.nutrition.carbs, multiplier);
  }
}

// =====================
// PRINT & WEB SHARE
// =====================
function printRecipe(recipe) {
  window.print();
}

async function shareRecipe(recipe) {
  const shareText = `🍳 ${recipe.emoji || "🍽️"} ${recipe.name}\n⏱ Time: ${recipe.time} | Difficulty: ${recipe.difficulty}\n\n🛒 Ingredients:\n${recipe.ingredients.map((i) => `• ${i}`).join("\n")}\n\n👩‍🍳 Steps:\n${recipe.steps.map((s, idx) => `${idx + 1}. ${s}`).join("\n")}\n\nGenerated with FridgeChef AI`;

  if (navigator.share) {
    try {
      await navigator.share({
        title: `FridgeChef: ${recipe.name}`,
        text: shareText,
        url: window.location.href,
      });
      return;
    } catch (_) { }
  }

  try {
    await navigator.clipboard.writeText(shareText);
    alert(`"${recipe.name}" details copied to clipboard! Share it anywhere.`);
  } catch (_) {
    alert(shareText);
  }
}

// =====================
// GENERATE RECIPES
// =====================
const loadingMessages = [
  "Scanning your ingredients...",
  "Checking pantry staples...",
  "Thinking like a master chef...",
  "Crafting gourmet recipes...",
  "Almost ready to cook! 🍳",
];

generateBtn.addEventListener("click", async () => {
  if (!uploadedImageBase64) return;

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

  let dietNote = "";
  if (selectedDiet === "vegetarian") {
    dietNote = "All recipes MUST be 100% vegetarian (no meat, poultry, or seafood).";
  } else if (selectedDiet === "vegan") {
    dietNote = "All recipes MUST be 100% vegan (plant-based, no meat, dairy, eggs, or animal products).";
  } else if (selectedDiet === "keto") {
    dietNote = "All recipes MUST be ketogenic (high healthy fats, moderate protein, very low carbs < 10g net carbs).";
  } else if (selectedDiet === "gluten-free") {
    dietNote = "All recipes MUST be strictly gluten-free (no wheat, barley, rye, or gluten-containing sauces).";
  } else if (selectedDiet === "dairy-free") {
    dietNote = "All recipes MUST be strictly dairy-free (no milk, cream, cheese, or butter).";
  } else if (selectedDiet === "high-protein") {
    dietNote = "All recipes MUST be high in protein (aim for at least 30g+ protein per serving).";
  } else if (selectedDiet === "low-carb") {
    dietNote = "All recipes MUST be low in carbohydrates (under 20g net carbs per serving).";
  }

  const pantryNote = pantryStaples.length
    ? `The user also already has these common pantry staples available: ${pantryStaples.join(", ")}. Use them naturally where helpful.`
    : "";

  const prompt = `You are a professional chef AI. Analyze this fridge/ingredients photo and respond ONLY with a valid JSON object, no markdown, no backticks, no explanation.

${dietNote}
${pantryNote}

Return this exact structure:
{
  "ingredients": ["ingredient1", "ingredient2", ...],
  "recipes": [
    {
      "emoji": "🍜",
      "name": "Recipe Name",
      "time": "20 mins",
      "difficulty": "Easy",
      "ingredients": ["1 cup item1", "2 tbsp item2"],
      "steps": ["Step 1 description with times where applicable", "Step 2 description", "Step 3 description"],
      "nutrition": { "calories": "320", "protein": "18g", "carbs": "42g" }
    }
  ]
}

Generate exactly 3 recipes. Steps should be clear, actionable instructions with durations specified where cooking/simmering/baking. Ingredients list should include quantities. Emojis should match the dish.`;

  try {
    const headers = { "Content-Type": "application/json" };
    if (apiKey) headers["x-api-key"] = apiKey;

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
    currentRecipes = parsed.recipes || [];
    renderRecipes(currentRecipes);
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

      <!-- Servings Scaler -->
      <div class="recipe-card-controls">
        <div class="servings-control">
          <span class="servings-label">Servings:</span>
          <div class="servings-btn-group" data-recipe-index="${index}">
            <button class="servings-btn" data-scale="1">1x</button>
            <button class="servings-btn active" data-scale="2">2x</button>
            <button class="servings-btn" data-scale="4">4x</button>
            <button class="servings-btn" data-scale="6">6x</button>
          </div>
        </div>
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
          `
        )
        .join("")}
        </ol>
        ${recipe.nutrition
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

        <!-- Action Toolbar -->
        <div class="recipe-actions-bar">
          <button class="card-action-btn cook-mode-btn" data-action="cook" data-index="${index}" title="Open Step-by-Step Kitchen Mode">
            🧑‍🍳 Start Cooking Mode
          </button>
          <button class="card-action-btn" data-action="tweak" data-index="${index}" title="Modify this dish with AI">
            ✨ Tweak
          </button>
          <button class="card-action-btn" data-action="subs" data-index="${index}" title="Ingredient Substitutes">
            🔄 Substitutes
          </button>
          <button class="card-action-btn" data-action="shop" data-index="${index}" title="Add ingredients to Grocery List">
            🛒 Add to List
          </button>
          <button class="card-action-btn" data-action="print" data-index="${index}" title="Print or Save PDF">
            🖨️ Print
          </button>
          <button class="card-action-btn" data-action="share" data-index="${index}" title="Share recipe">
            ↗️ Share
          </button>
        </div>
      </div>
    `;

    recipesGrid.appendChild(card);

    // Save button
    card.querySelector(".save-btn").addEventListener("click", function () {
      toggleSave(recipe, this);
    });

    // Servings Scaler buttons
    card.querySelectorAll(".servings-btn").forEach((sBtn) => {
      sBtn.addEventListener("click", () => {
        card.querySelectorAll(".servings-btn").forEach((b) => b.classList.remove("active"));
        sBtn.classList.add("active");
        const scale = parseInt(sBtn.dataset.scale, 10);
        updateRecipeCardScale(card, recipe, scale);
      });
    });

    // Card Actions
    card.querySelectorAll(".card-action-btn").forEach((actBtn) => {
      actBtn.addEventListener("click", () => {
        const action = actBtn.dataset.action;
        const idx = parseInt(actBtn.dataset.index, 10);
        const r = currentRecipes[idx];

        if (action === "cook") {
          openCookMode(idx);
        } else if (action === "tweak") {
          openTweakModal(idx);
        } else if (action === "subs") {
          const firstIng = r.ingredients[0] ? r.ingredients[0].replace(/^[\d\s\/]+(cup|tbsp|tsp|g|ml|oz)?\s*/i, "") : "";
          openSubstitutionsModal(firstIng);
        } else if (action === "shop") {
          r.ingredients.forEach((ing) => addShoppingItem(ing));
          renderShoppingList();
          openShoppingListModal();
        } else if (action === "print") {
          printRecipe(r);
        } else if (action === "share") {
          shareRecipe(r);
        }
      });
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

// Dismiss any modal on Escape
window.addEventListener("keydown", (e) => {
  if (e.key === "Escape") {
    if (apiKeyOverlay) apiKeyOverlay.style.display = "none";
    if (modalOverlay) modalOverlay.style.display = "none";
    if (howItWorksOverlay) howItWorksOverlay.style.display = "none";
    if (shoppingListOverlay) shoppingListOverlay.style.display = "none";
    if (tweakModalOverlay) tweakModalOverlay.style.display = "none";
    if (subsModalOverlay) subsModalOverlay.style.display = "none";
    if (cookModeOverlay && cookModeOverlay.style.display === "flex") {
      closeCookMode();
    }
  }
});

function renderSavedModal() {
  if (savedRecipes.length === 0) {
    modalBody.innerHTML = `<div class="empty-saved">❤️<br /><br />No saved recipes yet.<br />Generate some and tap 🤍 to save!</div>`;
    return;
  }
  modalBody.innerHTML = savedRecipes
    .map(
      (r, idx) => `
    <div class="saved-item" style="display:flex; justify-content:space-between; align-items:center;">
      <div style="display:flex; align-items:center; gap:12px;">
        <div class="saved-item-emoji">${r.emoji || "🍽️"}</div>
        <div>
          <div class="saved-item-name">${r.name}</div>
          <div class="saved-item-sub">⏱ ${r.time} &nbsp;|&nbsp; ${r.difficulty}</div>
        </div>
      </div>
      <button class="card-action-btn cook-mode-btn" style="flex:none; padding:6px 12px; font-size:0.75rem;" onclick="savedCookHelper(${idx})">
        Cook 🧑‍🍳
      </button>
    </div>
  `
    )
    .join("");
}

// Global helper for opening cook mode directly from saved modal
window.savedCookHelper = function (savedIndex) {
  const r = savedRecipes[savedIndex];
  if (!r) return;
  modalOverlay.style.display = "none";
  currentRecipes = [r];
  openCookMode(0);
};


