document.addEventListener('DOMContentLoaded', () => {
    // Theme toggle functionality
    const themeToggle = document.getElementById('themeToggle');
    const icon = themeToggle.querySelector('i');

    themeToggle.addEventListener('click', () => {
        document.body.classList.toggle('dark-mode');
        if (document.body.classList.contains('dark-mode')) {
            icon.classList.remove('fa-moon');
            icon.classList.add('fa-sun');
        } else {
            icon.classList.remove('fa-sun');
            icon.classList.add('fa-moon');
        }
    });

    // Initialize date inputs
    const today = new Date().toISOString().split('T')[0];
    document.getElementById('startDate').value = today;
    const nextWeek = new Date();
    nextWeek.setDate(nextWeek.getDate() + 7);
    document.getElementById('endDate').value = nextWeek.toISOString().split('T')[0];
    if (document.getElementById('docExpiry')) {
        document.getElementById('docExpiry').min = today;
    }

    // Hamburger menu logic
    const hamburgerBtn = document.getElementById('hamburgerBtn');
    const mainTabs = document.getElementById('mainTabs');
    if (hamburgerBtn && mainTabs) {
        hamburgerBtn.addEventListener('click', function() {
            mainTabs.classList.toggle('open');
            this.classList.toggle('active');
        });

        mainTabs.querySelectorAll('.tab').forEach(tab => {
            tab.addEventListener('click', () => {
                if (window.innerWidth <= 800) {
                    mainTabs.classList.remove('open');
                    hamburgerBtn.classList.remove('active');
                }
            });
        });
    }

    // Back to Top button logic
    const backToTopBtn = document.getElementById('backToTop');
    if(backToTopBtn) {
        window.addEventListener('scroll', () => {
            if (window.scrollY > 300) {
                backToTopBtn.style.display = 'flex';
            } else {
                backToTopBtn.style.display = 'none';
            }
        });
        backToTopBtn.addEventListener('click', () => {
            window.scrollTo({ top: 0, behavior: 'smooth' });
        });
    }
    
    // Initialize app content
    renderChecklist();
    generatePackingList();
    generateGalleryCards();

    // Gallery filter button event listeners
    document.querySelectorAll('.filter-btn').forEach(button => {
        button.addEventListener('click', function() {
            document.querySelectorAll('.filter-btn').forEach(btn => btn.classList.remove('active'));
            this.classList.add('active');
            filterGallery(this.dataset.filter);
        });
    });

    // Gallery search input event listener
    const searchInput = document.getElementById('searchGallery');
    if (searchInput) {
        searchInput.addEventListener('input', function() {
            searchGallery(this.value);
        });
    }
});

// Tab switching functionality
function switchTab(tabName) {
    document.querySelectorAll('.tab-content').forEach(tab => tab.classList.remove('active'));
    document.getElementById(tabName).classList.add('active');
    document.querySelectorAll('.tab').forEach(tab => tab.classList.remove('active'));
    document.querySelector(`button[onclick="switchTab('${tabName}')"]`).classList.add('active');
}

// Itinerary functionality
let activities = [];
let totalBudget = 0;

function addItineraryItem() {
    const name = document.getElementById('activityName').value;
    const startTime = document.getElementById('activityStartTime').value;
    const endTime = document.getElementById('activityEndTime').value;
    const location = document.getElementById('activityLocation').value;
    const cost = parseFloat(document.getElementById('activityCost').value) || 0;

    if (!name || !startTime || !location) {
        showNotification('Please fill in activity name, start time, and location');
        return;
    }

    const activity = { name, startTime, endTime, location, cost };
    activities.push(activity);
    totalBudget += cost;

    document.getElementById('tripActivities').textContent = activities.length;
    document.getElementById('tripBudget').textContent = `₹${totalBudget.toFixed(2)}`;

    renderItineraryList();

    document.getElementById('activityName').value = '';
    document.getElementById('activityStartTime').value = '';
    document.getElementById('activityEndTime').value = '';
    document.getElementById('activityLocation').value = '';
    document.getElementById('activityCost').value = '';

    showNotification('Activity added successfully!');
}

function deleteActivity(index) {
    totalBudget -= activities[index].cost;
    activities.splice(index, 1);
    document.getElementById('tripActivities').textContent = activities.length;
    document.getElementById('tripBudget').textContent = `₹${totalBudget.toFixed(2)}`;
    renderItineraryList();
    showNotification('Activity removed');
}

function renderItineraryList() {
    const itineraryList = document.getElementById('itineraryList');
    itineraryList.innerHTML = '';
    activities.forEach((activity, index) => {
        const activityElement = document.createElement('div');
        activityElement.className = 'itinerary-item';
        const timeDisplay = activity.endTime ? `${activity.startTime} - ${activity.endTime}` : activity.startTime;
        activityElement.innerHTML = `
            <div class="activity-time">${timeDisplay}</div>
            <div class="activity-name">${activity.name}</div>
            <div class="activity-location"><i class="fas fa-map-marker-alt"></i> ${activity.location}</div>
            <div class="activity-cost">₹${activity.cost.toFixed(2)}</div>
            <button class="delete-activity" onclick="deleteActivity(${index})"><i class="fas fa-trash"></i></button>
        `;
        itineraryList.appendChild(activityElement);
    });
}

// Smart routes functionality
function findRoute() {
    const from = document.getElementById('fromLocation').value.trim();
    const to = document.getElementById('toLocation').value.trim();
    const resultDiv = document.getElementById('routeResults');

    if (!from || !to) {
        resultDiv.innerHTML = '<div class="alert">Please enter both locations.</div>';
        return;
    }
    resultDiv.innerHTML = `
        <div class="route-card">
            <h4><i class="fas fa-map-signs"></i> Best Route</h4>
            <div><b>From:</b> ${from}</div>
            <div><b>To:</b> ${to}</div>
            <div><b>Recommended:</b> Take a taxi or use public transport.</div>
        </div>
    `;
}

// Checklist Data and Functions
const checklistData = {
    preTrip: ["Book flights & accommodation", "Check passport validity", "Apply for visa (if needed)", "Buy travel insurance"],
    oneWeek: ["Print tickets", "Check weather forecast", "Buy local currency", "Pack essentials"],
    dayBefore: ["Charge devices", "Set out travel clothes", "Prepare snacks", "Check-in online"]
};

function renderChecklist() {
    Object.keys(checklistData).forEach(section => {
        const container = document.getElementById(section);
        if (!container) return;
        container.innerHTML = '';
        checklistData[section].forEach((item, idx) => {
            const id = `${section}-item-${idx}`;
            container.innerHTML += `<label class="checklist-item"><input type="checkbox" id="${id}" onchange="toggleChecklist('${id}')"> ${item}</label>`;
        });
    });
}

function toggleChecklist(id) {
    updateChecklistProgress();
}

function updateChecklistProgress() {
    const checkboxes = document.querySelectorAll('.checklist input[type="checkbox"]');
    const checked = Array.from(checkboxes).filter(cb => cb.checked).length;
    const total = checkboxes.length;
    const percent = total > 0 ? Math.round((checked / total) * 100) : 0;
    document.getElementById('progressFill').style.width = percent + '%';
    document.getElementById('progressText').textContent = `${percent}% Complete`;
}

// Packing list functionality
function generatePackingList() { /* This function remains as you wrote it */ }

// Documents functionality
let documents = [];
function showAddDocumentModal() { /* This function remains as you wrote it */ }
function closeModal() { /* This function remains as you wrote it */ }
function addDocument() { /* This function remains as you wrote it */ }
function deleteDocument(index) { /* This function remains as you wrote it */ }
function renderDocumentList() { /* This function remains as you wrote it */ }

// Currency converter functionality
function convertCurrency() {
    const exchangeRates = {
        USD: 0.012, EUR: 0.011, GBP: 0.0095, JPY: 1.70, AUD: 0.018, CAD: 0.016,
        CNY: 12.09, SGD: 67.54, ZAR: 4.87, BRL: 15.64, RUB: 1.09, KRW: 0.063
    };
    const amount = parseFloat(document.getElementById('currencyAmount').value) || 0;
    const toCurrency = document.getElementById('toCurrency').value;
    const resultDiv = document.getElementById('conversionResult');
    if (amount <= 0) {
        resultDiv.textContent = 'Please enter a valid amount';
        return;
    }
    const converted = (amount * exchangeRates[toCurrency]).toFixed(2);
    resultDiv.textContent = `${amount} INR = ${converted} ${toCurrency}`;
}

// Export functionality
function exportItinerary() { /* This function remains as you wrote it */ }

// Notification system
function showNotification(message) {
    const notification = document.querySelector('.notification');
    const text = document.getElementById('notificationText');
    if (!notification || !text) return;
    text.textContent = message;
    notification.classList.add('show');
    setTimeout(() => notification.classList.remove('show'), 3000);
}

// Gallery data and functions
const galleryData = [
    { title: "Santorini, Greece", location: "Greece, Europe", image: "https://images.unsplash.com/photo-1537996194471-e657df975ab4?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80", description: "Famous for its whitewashed houses with blue domes, breathtaking sunsets, and crystal-clear waters.", region: "europe", bestTime: "Apr-Oct", rating: 4.9 },
    { title: "Machu Picchu, Peru", location: "Peru, South America", image: "https://images.unsplash.com/photo-1526392060635-9d6019884377?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80", description: "This 15th-century Inca citadel is located high in the Andes Mountains, an iconic archaeological site.", region: "americas", bestTime: "May-Sep", rating: 4.8 },
    { title: "Kyoto, Japan", location: "Japan, Asia", image: "https://images.unsplash.com/photo-1493976040374-85c8e12f0c0e?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80", description: "Known for its classical Buddhist temples, gardens, imperial palaces, and traditional wooden houses.", region: "asia", bestTime: "Mar-May, Oct-Nov", rating: 4.9 },
    { title: "Serengeti National Park", location: "Tanzania, Africa", image: "https://picsum.photos/id/169/800/600", description: "Famous for its annual migration of over 1.5 million wildebeest and 250,000 zebras.", region: "africa", bestTime: "Jun-Oct", rating: 4.8 },
    { title: "Great Barrier Reef", location: "Australia, Oceania", image: "https://images.unsplash.com/photo-1544551763-46a013bb70d5?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80", description: "The world's largest coral reef system, a paradise for divers and marine life enthusiasts.", region: "oceania", bestTime: "Jun-Oct", rating: 4.7 }
];

function generateGalleryCards() {
    const galleryContainer = document.getElementById('gallery-container');
    if (!galleryContainer) return;
    galleryContainer.innerHTML = '';
    galleryData.forEach(place => {
        const card = document.createElement('div');
        card.className = 'gallery-card';
        card.dataset.region = place.region;
        card.innerHTML = `
            <img src="${place.image}" alt="${place.title}" class="card-image">
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
    const observer = new IntersectionObserver(entries => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                card.classList.add('visible');
                observer.unobserve(card);
            }
        });
    }, { threshold: 0.1 });
    observer.observe(card);
}

function filterGallery(region) {
    document.querySelectorAll('.gallery-card').forEach(card => {
        card.style.display = (region === 'all' || card.dataset.region === region) ? 'block' : 'none';
    });
}

function searchGallery(query) {
    const searchTerm = query.toLowerCase();
    document.querySelectorAll('.gallery-card').forEach(card => {
        const title = card.querySelector('.card-title').textContent.toLowerCase();
        const location = card.querySelector('.card-location span').textContent.toLowerCase();
        card.style.display = (title.includes(searchTerm) || location.includes(searchTerm)) ? 'block' : 'none';
    });
}