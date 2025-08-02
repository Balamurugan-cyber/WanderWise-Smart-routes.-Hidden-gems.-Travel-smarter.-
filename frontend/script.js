// =========================
//
//  WanderWise - script.js
//  Main frontend logic for the travel planner application.
//
// =========================

// =========================
// UI & CORE FUNCTIONALITY
// =========================

/**
 * Sets up the responsive navbar, including the hamburger menu toggle.
 */
function setupNavbar() {
  const hamburgerBtn = document.getElementById("navbarHamburger");
  const navLinks = document.getElementById("navLinks");

  if (hamburgerBtn && navLinks) {
    hamburgerBtn.addEventListener("click", () => {
      navLinks.classList.toggle("active");
    });

    // Close the mobile menu when a link is clicked
    navLinks.querySelectorAll(".nav-link").forEach((link) => {
      link.addEventListener("click", () => {
        if (navLinks.classList.contains("active")) {
          navLinks.classList.remove("active");
        }
      });
    });
  }
}

/**
 * Updates the live clock in the navbar every second.
 */
function updateClock() {
  const clockElement = document.getElementById("liveClock");
  if (!clockElement) return;

  const now = new Date();
  const options = {
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
    hour12: true,
  };
  try {
    clockElement.textContent = now.toLocaleTimeString("en-US", options);
  } catch (e) {
    // Fallback for older browsers
    const hours = now.getHours().toString().padStart(2, "0");
    const minutes = now.getMinutes().toString().padStart(2, "0");
    const seconds = now.getSeconds().toString().padStart(2, "0");
    clockElement.textContent = `${hours}:${minutes}:${seconds}`;
  }
}

/**
 * Sets up the light/dark mode theme toggle button and persists the choice in localStorage.
 */
function setupThemeToggle() {
  const themeToggle = document.getElementById("themeToggle");
  if (!themeToggle) return;
  const icon = themeToggle.querySelector("i");

  themeToggle.addEventListener("click", () => {
    document.body.classList.toggle("dark-mode");
    const isDarkMode = document.body.classList.contains("dark-mode");
    icon.className = isDarkMode ? "fas fa-sun" : "fas fa-moon";
    localStorage.setItem("theme", isDarkMode ? "dark" : "light");
  });

  // Apply saved theme on load
  if (localStorage.getItem("theme") === "dark") {
    document.body.classList.add("dark-mode");
    icon.className = "fas fa-sun";
  }
}

/**
 * Switches between the main content tabs (Itinerary, Routes, etc.).
 * @param {string} tabName - The ID of the tab content to show.
 * @param {HTMLElement} clickedElement - The navbar link that was clicked.
 */
function switchTab(tabName, clickedElement) {
  document
    .querySelectorAll(".tab-content")
    .forEach((tab) => tab.classList.remove("active"));
  document
    .querySelectorAll(".nav-link")
    .forEach((link) => link.classList.remove("active"));

  const tabToShow = document.getElementById(tabName);
  if (tabToShow) {
    tabToShow.classList.add("active");
  }
  if (clickedElement) {
    clickedElement.classList.add("active");
  }

  // If switching to the gallery, ensure its content is generated.
  if (tabName === "gallery") {
    generateGalleryCards();
  }
}

/**
 * Handles clicks on the footer links to switch tabs and scroll to the top.
 * @param {string} tabName - The ID of the tab to switch to.
 */
function handleFooterLinkClick(tabName) {
  const navLink = document.querySelector(`.nav-link[onclick*="'${tabName}'"]`);
  switchTab(tabName, navLink);
  window.scrollTo({ top: 0, behavior: "smooth" });
}

// =========================
// FEATURE-SPECIFIC FUNCTIONS
// =========================

// --- Itinerary ---
let activities = [];
let totalBudget = 0;

function addItineraryItem() {
  const name = document.getElementById("activityName").value;
  const time = document.getElementById("activityTime").value;
  const location = document.getElementById("activityLocation").value;
  const cost = parseFloat(document.getElementById("activityCost").value) || 0;

  if (!name || !time || !location) {
    showNotification("Please fill all activity fields");
    return;
  }

  activities.push({ name, time, location, cost });
  totalBudget += cost;
  renderItineraryList();
  updateTripStats();

  // Clear inputs
  document.getElementById("activityName").value = "";
  document.getElementById("activityTime").value = "";
  document.getElementById("activityLocation").value = "";
  document.getElementById("activityCost").value = "";
  showNotification("Activity added successfully!");
}

function deleteActivity(index) {
  const deletedCost = activities[index].cost;
  activities.splice(index, 1);
  totalBudget -= deletedCost;
  renderItineraryList();
  updateTripStats();
  showNotification("Activity removed");
}

function renderItineraryList() {
  const itineraryList = document.getElementById("itineraryList");
  itineraryList.innerHTML = "";
  activities.forEach((activity, index) => {
    const activityElement = document.createElement("div");
    activityElement.className = "itinerary-item";
    activityElement.innerHTML = `
        <div class="activity-time">${activity.time}</div>
        <div class="activity-name">${activity.name}</div>
        <div class="activity-location"><i class="fas fa-map-marker-alt"></i> ${
          activity.location
        }</div>
        <div class="activity-cost">₹${activity.cost.toFixed(2)}</div>
        <button class="delete-activity" onclick="deleteActivity(${index})"><i class="fas fa-trash"></i></button>
    `;
    itineraryList.appendChild(activityElement);
  });
}

function updateTripStats() {
  document.getElementById("tripActivities").textContent = activities.length;
  document.getElementById("tripBudget").textContent = `₹${totalBudget.toFixed(
    2
  )}`;
}

// --- Smart Routes ---
function findRoute() {
  const from = document.getElementById("fromLocation").value.trim();
  const to = document.getElementById("toLocation").value.trim();
  const resultDiv = document.getElementById("routeResults");
  if (!from || !to) {
    showNotification("Please enter both locations.");
    return;
  }
  // Dummy route logic for demonstration
  resultDiv.innerHTML = `
        <div class="itinerary-item">
            <h4><i class="fas fa-map-signs"></i> Best Route</h4>
            <div><b>From:</b> ${from}</div>
            <div><b>To:</b> ${to}</div>
            <div><b>Recommended:</b> Take a taxi or use public transport for the fastest route.</div>
        </div>`;
  showNotification("Route found!");
}

// --- Checklist ---
const checklistData = {
  preTrip: [
    "Book flights and accommodation",
    "Check passport validity",
    "Apply for visa (if needed)",
    "Buy travel insurance",
    "Arrange pet/house care",
    "Notify bank of travel",
  ],
  oneWeek: [
    "Print tickets and confirmations",
    "Check weather forecast",
    "Buy local currency",
    "Pack essentials",
    "Download offline maps",
  ],
  dayBefore: [
    "Charge devices",
    "Set out travel clothes",
    "Prepare snacks",
    "Confirm transport to airport/station",
    "Check-in online",
  ],
};

function renderChecklist() {
  Object.keys(checklistData).forEach((section) => {
    const container = document.getElementById(section);
    if (!container) return;
    container.innerHTML = "";
    checklistData[section].forEach((item, idx) => {
      const id = `${section}-item-${idx}`;
      const checked = localStorage.getItem(id) === "true";
      container.innerHTML += `
          <label class="checklist-item">
              <input type="checkbox" id="${id}" ${
        checked ? "checked" : ""
      } onchange="toggleChecklist('${id}')">
              <span>${item}</span>
          </label>`;
    });
  });
  updateChecklistProgress();
}

function toggleChecklist(id) {
  const checkbox = document.getElementById(id);
  localStorage.setItem(id, checkbox.checked);
  updateChecklistProgress();
}

function updateChecklistProgress() {
  const allIds = Object.keys(checklistData).flatMap((section) =>
    checklistData[section].map((_, idx) => `${section}-item-${idx}`)
  );
  const checkedCount = allIds.filter(
    (id) => localStorage.getItem(id) === "true"
  ).length;
  const percentage =
    allIds.length > 0 ? Math.round((checkedCount / allIds.length) * 100) : 0;

  const progressFill = document.getElementById("progressFill");
  const progressText = document.getElementById("progressText");
  if (progressFill) progressFill.style.width = `${percentage}%`;
  if (progressText) progressText.textContent = `${percentage}% Complete`;
}

// --- Packing ---
function generatePackingList() {
  const tripType = document.getElementById("tripType").value;
  const duration = parseInt(document.getElementById("tripDuration").value) || 3;
  const weather = document.getElementById("weather").value;
  const packingListDiv = document.getElementById("packingList");

  if (!tripType || !weather) {
    packingListDiv.innerHTML =
      "<p>Select trip type and weather to generate a packing list.</p>";
    return;
  }

  let html = "";
  const baseItems = {
    clothing: [
      `${Math.ceil(duration / 2)} T-shirts`,
      `${Math.ceil(duration / 3)} Pants/Shorts`,
    ],
    essentials: ["Passport/ID", "Wallet", "Phone & Charger"],
    toiletries: ["Toothbrush & Toothpaste", "Shampoo & Conditioner"],
  };

  if (tripType === "business") {
    baseItems.clothing.push("Business Attire", "Dress Shoes");
    baseItems.essentials.push("Laptop", "Business Cards");
  }
  if (tripType === "beach") {
    baseItems.clothing.push("Swimwear", "Flip Flops");
  }
  if (tripType === "adventure" || tripType === "backpacking") {
    baseItems.essentials.push("First Aid Kit", "Water Bottle");
  }
  if (weather === "cold") {
    baseItems.clothing.push("Warm Jacket", "Thermal Wear");
    baseItems.toiletries.push("Lip Balm", "Moisturizer");
  }
  if (weather === "hot") {
    baseItems.clothing.push("Sun Hat", "Sunglasses");
    baseItems.toiletries.push("Sunscreen (SPF 50+)");
  }

  html += `<div class="packing-category"><h4><i class="fas fa-tshirt"></i> Clothing</h4><div class="packing-items">${baseItems.clothing
    .map(
      (item) =>
        `<div class="packing-item"><i class="fas fa-check"></i> ${item}</div>`
    )
    .join("")}</div></div>`;
  html += `<div class="packing-category"><h4><i class="fas fa-star"></i> Essentials</h4><div class="packing-items">${baseItems.essentials
    .map(
      (item) =>
        `<div class="packing-item"><i class="fas fa-check"></i> ${item}</div>`
    )
    .join("")}</div></div>`;
  html += `<div class="packing-category"><h4><i class="fas fa-pump-soap"></i> Toiletries</h4><div class="packing-items">${baseItems.toiletries
    .map(
      (item) =>
        `<div class="packing-item"><i class="fas fa-check"></i> ${item}</div>`
    )
    .join("")}</div></div>`;

  packingListDiv.innerHTML = html;
}

// --- Documents ---
let documents = [];
function showAddDocumentModal() {
  document.getElementById("documentModal").style.display = "flex";
}
function closeModal(modalId) {
  const modal = document.getElementById(modalId);
  if (modal) modal.style.display = "none";
}

function addDocument() {
  const type = document.getElementById("docType").value;
  const number = document.getElementById("docNumber").value;
  const expiry = document.getElementById("docExpiry").value;

  if (!number || !expiry) {
    showNotification("Please fill all document fields");
    return;
  }

  documents.push({ type, number, expiry });
  renderDocumentList();
  closeModal("documentModal");
  showNotification("Document added successfully!");
}

function deleteDocument(index) {
  documents.splice(index, 1);
  renderDocumentList();
  showNotification("Document removed");
}

function renderDocumentList() {
  const documentList = document.getElementById("documentList");
  documentList.innerHTML = "";
  documents.forEach((doc, index) => {
    const docElement = document.createElement("div");
    docElement.className = "document-card";
    const iconClass =
      {
        passport: "fa-passport",
        visa: "fa-file-contract",
        license: "fa-id-card",
        insurance: "fa-file-medical",
        vaccination: "fa-syringe",
      }[doc.type] || "fa-file-alt";
    const expiryDate = new Date(doc.expiry);
    const daysDiff = (expiryDate - new Date()) / (1000 * 60 * 60 * 24);
    const expiryClass = daysDiff < 90 ? "expiry-warning" : "";

    docElement.innerHTML = `
        <div class="doc-type"><i class="fas ${iconClass}"></i> ${
      doc.type.charAt(0).toUpperCase() + doc.type.slice(1)
    }</div>
        <div class="doc-info">Number: ${doc.number}</div>
        <div class="doc-expiry"><i class="fas fa-calendar"></i> Expiry: <span class="${expiryClass}">${
      doc.expiry
    }</span></div>
        <button class="delete-doc" onclick="deleteDocument(${index})"><i class="fas fa-trash"></i></button>
    `;
    documentList.appendChild(docElement);
  });
}

// --- Currency ---
const exchangeRates = {
  USD: 0.012,
  EUR: 0.011,
  GBP: 0.0095,
  JPY: 1.7,
  AUD: 0.018,
  CAD: 0.016,
};

function convertCurrency() {
  const amount =
    parseFloat(document.getElementById("currencyAmount").value) || 0;
  const toCurrency = document.getElementById("toCurrency").value;
  const resultDiv = document.getElementById("conversionResult");

  if (amount <= 0) {
    resultDiv.textContent = "Please enter a valid amount";
    return;
  }
  const rate = exchangeRates[toCurrency];
  const converted = (amount * rate).toFixed(2);
  resultDiv.textContent = `${amount} INR = ${converted} ${toCurrency}`;
}

// --- Gallery ---
const galleryData = [
  {
    title: "Santorini, Greece",
    location: "Greece, Europe",
    image:
      "https://images.unsplash.com/photo-1537996194471-e657df975ab4?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80",
    description:
      "Famous for its whitewashed houses with blue domes, breathtaking sunsets, and crystal-clear waters.",
    region: "europe",
    bestTime: "Apr-Oct",
    rating: 4.9,
  },
  {
    title: "Machu Picchu, Peru",
    location: "Peru, South America",
    image:
      "https://images.unsplash.com/photo-1526392060635-9d6019884377?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80",
    description:
      "This 15th-century Inca citadel is located high in the Andes Mountains, an iconic archaeological site.",
    region: "americas",
    bestTime: "May-Sep",
    rating: 4.8,
  },
  {
    title: "Kyoto, Japan",
    location: "Japan, Asia",
    image:
      "https://images.unsplash.com/photo-1493976040374-85c8e12f0c0e?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80",
    description:
      "Known for its classical Buddhist temples, gardens, imperial palaces, and traditional wooden houses.",
    region: "asia",
    bestTime: "Mar-May, Oct-Nov",
    rating: 4.9,
  },
  {
    title: "Great Barrier Reef",
    location: "Australia, Oceania",
    image:
      "https://images.unsplash.com/photo-1544551763-46a013bb70d5?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80",
    description:
      "The world's largest coral reef system. A paradise for divers and marine life enthusiasts.",
    region: "oceania",
    bestTime: "Jun-Oct",
    rating: 4.7,
  },
  {
    title: "Serengeti National Park",
    location: "Tanzania, Africa",
    image:
      "https://dynamic-media-cdn.tripadvisor.com/media/photo-o/25/5c/41/ef/lion-sleeping-in-a-tree.jpg?w=1400&h=-1&s=1",
    description:
      "Famous for its annual migration of over 1.5 million wildebeest and 250,000 zebras.",
    region: "africa",
    bestTime: "Jun-Oct",
    rating: 4.8,
  },
];

function generateGalleryCards() {
  const galleryContainer = document.getElementById("gallery-container");
  if (!galleryContainer) return;
  galleryContainer.innerHTML = "";

  galleryData.forEach((place) => {
    const card = document.createElement("div");
    card.className = "gallery-card";
    card.dataset.region = place.region;
    card.innerHTML = `
        <img src="${place.image}" alt="${place.title}" class="card-image" loading="lazy">
        <div class="card-overlay">
            <h3 class="card-title">${place.title}</h3>
            <div class="card-location"><i class="fas fa-map-marker-alt"></i><span>${place.location}</span></div>
            <p class="card-description">${place.description}</p>
            <div class="card-stats">
                <div><i class="fas fa-calendar"></i> Best: ${place.bestTime}</div>
                <div><i class="fas fa-star"></i> Rating: ${place.rating}</div>
            </div>
        </div>`;
    galleryContainer.appendChild(card);
    observeCard(card);
  });
}

function observeCard(card) {
  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          card.classList.add("visible");
          observer.unobserve(card);
        }
      });
    },
    { threshold: 0.1 }
  );
  observer.observe(card);
}

function filterGallery(region) {
  document.querySelectorAll(".gallery-card").forEach((card) => {
    card.style.display =
      region === "all" || card.dataset.region === region ? "block" : "none";
  });
}

function searchGallery(query) {
  const searchTerm = query.toLowerCase();
  document.querySelectorAll(".gallery-card").forEach((card) => {
    const title = card.querySelector(".card-title").textContent.toLowerCase();
    const location = card
      .querySelector(".card-location span")
      .textContent.toLowerCase();
    card.style.display =
      title.includes(searchTerm) || location.includes(searchTerm)
        ? "block"
        : "none";
  });
}

// =========================
// UTILITY FUNCTIONS
// =========================

function showNotification(message) {
  const notification = document.getElementById("notification");
  const text = document.getElementById("notificationText");
  if (!notification || !text) return;

  text.textContent = message;
  notification.classList.add("show");
  setTimeout(() => {
    notification.classList.remove("show");
  }, 3000);
}

function exportItinerary() {
  if (activities.length === 0) {
    showNotification("Add activities to export itinerary");
    return;
  }
  // This is a dummy function for demonstration.
  // In a real app, you would generate a PDF or text file here.
  showNotification("Itinerary exported successfully!");
}

// =========================
// APP INITIALIZATION
// =========================
document.addEventListener("DOMContentLoaded", function () {
  // Core UI Setup
  setupNavbar();
  setupThemeToggle();
  updateClock();
  setInterval(updateClock, 1000);

  // Initialize Date Inputs
  const today = new Date().toISOString().split("T")[0];
  const nextWeek = new Date();
  nextWeek.setDate(nextWeek.getDate() + 7);
  const nextWeekFormatted = nextWeek.toISOString().split("T")[0];

  const startDateInput = document.getElementById("startDate");
  if (startDateInput) startDateInput.value = today;

  const endDateInput = document.getElementById("endDate");
  if (endDateInput) endDateInput.value = nextWeekFormatted;

  const docExpiryInput = document.getElementById("docExpiry");
  if (docExpiryInput) docExpiryInput.min = today;

  // Initial Content Generation
  renderChecklist();
  generatePackingList();
  generateGalleryCards();

  // Gallery Filter & Search Event Listeners
  document.querySelectorAll(".filter-btn").forEach((button) => {
    button.addEventListener("click", function () {
      document
        .querySelectorAll(".filter-btn")
        .forEach((btn) => btn.classList.remove("active"));
      this.classList.add("active");
      filterGallery(this.dataset.filter);
    });
  });

  const searchInput = document.getElementById("searchGalleryInput");
  if (searchInput) {
    searchInput.addEventListener("input", function () {
      searchGallery(this.value);
    });
  }
});
