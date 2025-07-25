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

    // Initialize date inputs with current date
    const today = new Date().toISOString().split('T')[0];
    const nextWeek = new Date();
    nextWeek.setDate(nextWeek.getDate() + 7);
    const nextWeekFormatted = nextWeek.toISOString().split('T')[0];

    document.getElementById('startDate').value = today;
    document.getElementById('endDate').value = nextWeekFormatted;
    if (document.getElementById('docExpiry')) {
        document.getElementById('docExpiry').min = today;
    }

    // Initialize other parts of the app
    renderChecklist();
    generatePackingList();

    // Hamburger menu logic
    const hamburgerBtn = document.getElementById('hamburgerBtn');
    const tabs = document.querySelector('.tabs');
    hamburgerBtn.addEventListener('click', () => {
        tabs.classList.toggle('open');
    });

    tabs.querySelectorAll('.tab').forEach(tab => {
        tab.addEventListener('click', () => {
            if (window.innerWidth <= 800) {
                tabs.classList.remove('open');
            }
        });
    });
});

// Tab switching functionality
function switchTab(tabName) {
    document.querySelectorAll('.tab-content').forEach(tab => {
        tab.classList.remove('active');
    });
    document.getElementById(tabName).classList.add('active');

    document.querySelectorAll('.tab').forEach(tab => {
        tab.classList.remove('active');
    });
    // Find button based on its onclick attribute
    document.querySelector(`button[onclick="switchTab('${tabName}')"]`).classList.add('active');
}

// Itinerary functionality
let activities = [];
let totalBudget = 0;

function addItineraryItem() {
    const name = document.getElementById('activityName').value;
    // ▼▼▼ MODIFIED: Get start and end times ▼▼▼
    const startTime = document.getElementById('activityStartTime').value;
    const endTime = document.getElementById('activityEndTime').value;
    const location = document.getElementById('activityLocation').value;
    const cost = parseFloat(document.getElementById('activityCost').value) || 0;

    // ▼▼▼ MODIFIED: Updated validation ▼▼▼
    if (!name || !startTime || !location) {
        showNotification('Please fill in activity name, start time, and location');
        return;
    }

    const activity = {
        name,
        startTime, // MODIFIED
        endTime,   // MODIFIED
        location,
        cost
    };

    activities.push(activity);
    totalBudget += cost;

    // Update stats
    document.getElementById('tripActivities').textContent = activities.length;
    document.getElementById('tripBudget').textContent = `₹${totalBudget.toFixed(2)}`;

    // Re-render the entire list to maintain order and correct indices
    renderItineraryList();

    // Clear inputs
    document.getElementById('activityName').value = '';
    // ▼▼▼ MODIFIED: Clear new time inputs ▼▼▼
    document.getElementById('activityStartTime').value = '';
    document.getElementById('activityEndTime').value = '';
    document.getElementById('activityLocation').value = '';
    document.getElementById('activityCost').value = '';

    showNotification('Activity added successfully!');
}

function deleteActivity(index) {
    const deletedCost = activities[index].cost;
    activities.splice(index, 1);
    totalBudget -= deletedCost;

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
        
        // ▼▼▼ MODIFIED: Display time range ▼▼▼
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
            <div><b>Recommended:</b> Take a taxi or use public transport for fastest route.</div>
        </div>
    `;
}

// Checklist Data and Functions
const checklistData = {
    preTrip: [
        "Book flights and accommodation", "Check passport validity", "Apply for visa (if needed)",
        "Buy travel insurance", "Arrange pet/house care", "Notify bank of travel"
    ],
    oneWeek: [
        "Print tickets and confirmations", "Check weather forecast", "Buy local currency",
        "Pack essentials", "Download offline maps"
    ],
    dayBefore: [
        "Charge devices", "Set out travel clothes", "Prepare snacks",
        "Confirm transport to airport/station", "Check-in online"
    ]
};

function renderChecklist() {
    Object.keys(checklistData).forEach(section => {
        const container = document.getElementById(section);
        if (!container) return;
        container.innerHTML = '';
        checklistData[section].forEach((item, idx) => {
            const id = `${section}-item-${idx}`;
            const checked = localStorage.getItem(id) === 'true';
            container.innerHTML += `
                <label class="checklist-item">
                    <input type="checkbox" id="${id}" ${checked ? 'checked' : ''} onchange="toggleChecklist('${id}')">
                    ${item}
                </label>
            `;
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
    const allIds = [];
    Object.keys(checklistData).forEach(section => {
        checklistData[section].forEach((_, idx) => {
            allIds.push(`${section}-item-${idx}`);
        });
    });
    const checked = allIds.filter(id => localStorage.getItem(id) === 'true').length;
    const totalCount = allIds.length;
    const percent = totalCount > 0 ? Math.round((checked / totalCount) * 100) : 0;
    
    document.getElementById('progressFill').style.width = percent + '%';
    document.getElementById('progressText').textContent = `${percent}% Complete`;
}

// Packing list functionality
function generatePackingList() {
    const tripType = document.getElementById('tripType').value;
    const duration = parseInt(document.getElementById('tripDuration').value) || 3;
    const weather = document.getElementById('weather').value;
    const packingListContainer = document.getElementById('packingList');

    if (!tripType || !weather) {
        packingListContainer.innerHTML = '<p>Select trip type and weather to generate packing list</p>';
        return;
    }

    let packingListHTML = '';
    const categories = {
        clothing: { icon: 'fa-tshirt', title: 'Clothing', items: [
            { text: `${Math.ceil(duration / 2)} T-shirts/Tops` },
            { text: `${Math.ceil(duration / 3)} Pants/Shorts` },
            { text: `Underwear & Socks for ${duration} days`},
            { text: 'Pajamas', condition: () => true },
            { text: 'Business Attire', condition: () => tripType === 'business' },
            { text: 'Warm Jacket', condition: () => weather === 'cold' },
            { text: 'Swimwear', condition: () => tripType === 'beach' }
        ]},
        essentials: { icon: 'fa-star', title: 'Essentials', items: [
            { text: 'Passport/ID' }, { text: 'Wallet & Currency' }, { text: 'Phone & Charger' },
            { text: 'First Aid Kit', condition: () => tripType === 'adventure' || tripType === 'backpacking' },
            { text: 'Laptop & Charger', condition: () => tripType === 'business' }
        ]},
        toiletries: { icon: 'fa-pump-soap', title: 'Toiletries', items: [
            { text: 'Toothbrush & Toothpaste' }, { text: 'Shampoo & Soap' },
            { text: 'Sunscreen', condition: () => weather === 'hot' || tripType === 'beach' },
            { text: 'Lip Balm & Moisturizer', condition: () => weather === 'cold' }
        ]}
    };

    for (const categoryKey in categories) {
        const category = categories[categoryKey];
        packingListHTML += `<div class="packing-category"><h4><i class="fas ${category.icon}"></i> ${category.title}</h4><div class="packing-items">`;
        category.items.forEach(item => {
            if (!item.condition || item.condition()) {
                packingListHTML += `<div class="packing-item"><i class="fas fa-check"></i> ${item.text}</div>`;
            }
        });
        packingListHTML += `</div></div>`;
    }
    packingListContainer.innerHTML = packingListHTML;
}

// Documents functionality
let documents = [];

function showAddDocumentModal() {
    document.getElementById('documentModal').style.display = 'flex';
}

function closeModal() {
    document.getElementById('documentModal').style.display = 'none';
}

function addDocument() {
    const type = document.getElementById('docType').value;
    const number = document.getElementById('docNumber').value;
    const expiry = document.getElementById('docExpiry').value;

    if (!number || !expiry) {
        showNotification('Please fill all document fields');
        return;
    }

    documents.push({ type, number, expiry });
    renderDocumentList();
    closeModal();
    showNotification('Document added successfully!');
}

function deleteDocument(index) {
    documents.splice(index, 1);
    renderDocumentList();
    showNotification('Document removed');
}

function renderDocumentList() {
    const documentList = document.getElementById('documentList');
    documentList.innerHTML = '';

    documents.forEach((doc, index) => {
        const docElement = document.createElement('div');
        docElement.className = 'document-card';
        
        const icons = { passport: 'fa-passport', visa: 'fa-file-contract', license: 'fa-id-card', insurance: 'fa-file-medical', vaccination: 'fa-syringe', other: 'fa-file-alt' };
        const expiryDate = new Date(doc.expiry);
        const daysDiff = (expiryDate - new Date()) / (1000 * 60 * 60 * 24);
        const expiryClass = daysDiff < 90 ? 'expiry-warning' : '';

        docElement.innerHTML = `
            <div class="doc-type"><i class="fas ${icons[doc.type]}"></i> ${doc.type.charAt(0).toUpperCase() + doc.type.slice(1)}</div>
            <div class="doc-info">Number: ${doc.number}</div>
            <div class="doc-expiry"><i class="fas fa-calendar"></i> Expiry: <span class="${expiryClass}">${doc.expiry}</span></div>
            <button class="delete-doc" onclick="deleteDocument(${index})"><i class="fas fa-trash"></i></button>
        `;
        documentList.appendChild(docElement);
    });
}

// Currency converter functionality
function convertCurrency() {
    const exchangeRates = { USD: 0.012, EUR: 0.011, GBP: 0.0095, JPY: 1.70, AUD: 0.018, CAD: 0.016 };
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
function exportItinerary() {
    if (activities.length === 0) {
        showNotification('Add activities to export itinerary');
        return;
    }
    // This is a placeholder for a real export feature
    showNotification('Itinerary exported successfully!');
}

// Notification system
function showNotification(message) {
    const notification = document.querySelector('.notification');
    const text = document.getElementById('notificationText');
    if (!notification || !text) return;
    
    text.textContent = message;
    notification.classList.add('show');
    setTimeout(() => {
        notification.classList.remove('show');
    }, 3000);
}