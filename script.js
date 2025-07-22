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

        // Tab switching functionality
        function switchTab(tabName) {
            // Hide all tab contents
            document.querySelectorAll('.tab-content').forEach(tab => {
                tab.classList.remove('active');
            });
            
            // Show selected tab content
            document.getElementById(tabName).classList.add('active');
            
            // Update active tab button
            document.querySelectorAll('.tab').forEach(tab => {
                tab.classList.remove('active');
            });
            
            event.target.classList.add('active');
        }

        // Itinerary functionality
        let activities = [];
        let totalBudget = 0;
        
        function addItineraryItem() {
            const name = document.getElementById('activityName').value;
            const time = document.getElementById('activityTime').value;
            const location = document.getElementById('activityLocation').value;
            const cost = parseFloat(document.getElementById('activityCost').value) || 0;
            
            if (!name || !time || !location) {
                showNotification('Please fill all activity fields');
                return;
            }
            
            const activity = {
                name,
                time,
                location,
                cost
            };
            
            activities.push(activity);
            totalBudget += cost;
            
            // Update stats
            document.getElementById('tripActivities').textContent = activities.length;
            document.getElementById('tripBudget').textContent = `₹${totalBudget.toFixed(2)}`;
            
            // Add to itinerary list
            const itineraryList = document.getElementById('itineraryList');
            const activityElement = document.createElement('div');
            activityElement.className = 'itinerary-item';
            activityElement.innerHTML = `
                <div class="activity-time">${time}</div>
                <div class="activity-name">${name}</div>
                <div class="activity-location"><i class="fas fa-map-marker-alt"></i> ${location}</div>
                <div class="activity-cost">₹${cost.toFixed(2)}</div>
                <button class="delete-activity" onclick="deleteActivity(${activities.length - 1})"><i class="fas fa-trash"></i></button>
            `;
            itineraryList.appendChild(activityElement);
            
            // Clear inputs
            document.getElementById('activityName').value = '';
            document.getElementById('activityTime').value = '';
            document.getElementById('activityLocation').value = '';
            document.getElementById('activityCost').value = '';
            
            showNotification('Activity added successfully!');
        }
        
        function deleteActivity(index) {
            const deletedCost = activities[index].cost;
            activities.splice(index, 1);
            totalBudget -= deletedCost;
            
            // Update stats
            document.getElementById('tripActivities').textContent = activities.length;
            document.getElementById('tripBudget').textContent = `₹${totalBudget.toFixed(2)}`;
            
            // Re-render itinerary list
            renderItineraryList();
            showNotification('Activity removed');
        }
        
        function renderItineraryList() {
            const itineraryList = document.getElementById('itineraryList');
            itineraryList.innerHTML = '';
            
            activities.forEach((activity, index) => {
                const activityElement = document.createElement('div');
                activityElement.className = 'itinerary-item';
                activityElement.innerHTML = `
                    <div class="activity-time">${activity.time}</div>
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
            const from = document.getElementById('fromLocation').value;
            const to = document.getElementById('toLocation').value;
            
            if (!from || !to) {
                showNotification('Please enter both locations');
                return;
            }
            
            // Simulate finding a route
            document.getElementById('routeStart').textContent = from;
            document.getElementById('routeEnd').textContent = to;
            
            // Generate random transport method
            const transports = ['Metro', 'Bus', 'Taxi', 'Walk', 'Bike', 'Ride Share'];
            const transport = transports[Math.floor(Math.random() * transports.length)];
            document.getElementById('routeTransport').textContent = transport;
            
            // Generate random duration (15-120 minutes)
            const duration = Math.floor(Math.random() * 105) + 15;
            document.getElementById('routeDuration').textContent = `${duration} minutes`;
            
            // Generate random cost (50-500 rupees)
            const cost = Math.floor(Math.random() * 451) + 50;
            document.getElementById('routeCost').textContent = `₹${cost}`;
            
            // Show results
            document.getElementById('routeResults').style.display = 'block';
            showNotification('Route found!');
        }

        // Checklist functionality
        function setupChecklist() {
            const checkboxes = document.querySelectorAll('.checklist input[type="checkbox"]');
            
            checkboxes.forEach(checkbox => {
                checkbox.addEventListener('change', updateProgress);
            });
            
            updateProgress();
        }
        
        function updateProgress() {
            const checkboxes = document.querySelectorAll('.checklist input[type="checkbox"]');
            const checkedCount = Array.from(checkboxes).filter(cb => cb.checked).length;
            const totalCount = checkboxes.length;
            const percentage = Math.round((checkedCount / totalCount) * 100);
            
            document.getElementById('progressFill').style.width = `${percentage}%`;
            document.getElementById('progressText').textContent = `${percentage}% Complete`;
        }

        // Packing list functionality
        function generatePackingList() {
            const tripType = document.getElementById('tripType').value;
            const duration = parseInt(document.getElementById('tripDuration').value) || 3;
            const weather = document.getElementById('weather').value;
            
            if (!tripType || !weather) {
                document.getElementById('packingList').innerHTML = '<p>Select trip type and weather to generate packing list</p>';
                return;
            }
            
            let packingListHTML = '';
            
            // Clothing category
            packingListHTML += `
                <div class="packing-category">
                    <h4><i class="fas fa-tshirt"></i> Clothing</h4>
                    <div class="packing-items">
                        <div class="packing-item"><i class="fas fa-check"></i> ${Math.ceil(duration/2)} T-shirts</div>
                        <div class="packing-item"><i class="fas fa-check"></i> ${Math.ceil(duration/3)} Pants/Shorts</div>
            `;
            
            if (tripType === 'business') {
                packingListHTML += `
                    <div class="packing-item"><i class="fas fa-check"></i> Business Attire</div>
                    <div class="packing-item"><i class="fas fa-check"></i> Dress Shoes</div>
                `;
            }
            
            if (weather === 'cold') {
                packingListHTML += `
                    <div class="packing-item"><i class="fas fa-check"></i> Warm Jacket</div>
                    <div class="packing-item"><i class="fas fa-check"></i> Thermal Wear</div>
                `;
            } else if (weather === 'hot') {
                packingListHTML += `
                    <div class="packing-item"><i class="fas fa-check"></i> Sun Hat</div>
                    <div class="packing-item"><i class="fas fa-check"></i> Sunglasses</div>
                `;
            }
            
            if (tripType === 'beach') {
                packingListHTML += `
                    <div class="packing-item"><i class="fas fa-check"></i> Swimwear</div>
                    <div class="packing-item"><i class="fas fa-check"></i> Flip Flops</div>
                `;
            }
            
            packingListHTML += `
                    </div>
                </div>
            `;
            
            // Essentials category
            packingListHTML += `
                <div class="packing-category">
                    <h4><i class="fas fa-star"></i> Essentials</h4>
                    <div class="packing-items">
                        <div class="packing-item"><i class="fas fa-check"></i> Passport</div>
                        <div class="packing-item"><i class="fas fa-check"></i> Wallet</div>
                        <div class="packing-item"><i class="fas fa-check"></i> Phone & Charger</div>
            `;
            
            if (tripType === 'adventure' || tripType === 'backpacking') {
                packingListHTML += `
                    <div class="packing-item"><i class="fas fa-check"></i> First Aid Kit</div>
                    <div class="packing-item"><i class="fas fa-check"></i> Water Bottle</div>
                `;
            }
            
            if (tripType === 'business') {
                packingListHTML += `
                    <div class="packing-item"><i class="fas fa-check"></i> Laptop</div>
                    <div class="packing-item"><i class="fas fa-check"></i> Business Cards</div>
                `;
            }
            
            packingListHTML += `
                    </div>
                </div>
            `;
            
            // Toiletries category
            packingListHTML += `
                <div class="packing-category">
                    <h4><i class="fas fa-pump-soap"></i> Toiletries</h4>
                    <div class="packing-items">
                        <div class="packing-item"><i class="fas fa-check"></i> Toothbrush & Toothpaste</div>
                        <div class="packing-item"><i class="fas fa-check"></i> Shampoo & Conditioner</div>
            `;
            
            if (weather === 'hot' || tripType === 'beach') {
                packingListHTML += `
                    <div class="packing-item"><i class="fas fa-check"></i> Sunscreen (SPF 50+)</div>
                `;
            }
            
            if (weather === 'cold') {
                packingListHTML += `
                    <div class="packing-item"><i class="fas fa-check"></i> Lip Balm</div>
                    <div class="packing-item"><i class="fas fa-check"></i> Moisturizer</div>
                `;
            }
            
            packingListHTML += `
                    </div>
                </div>
            `;
            
            document.getElementById('packingList').innerHTML = packingListHTML;
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
            
            const document = {
                type,
                number,
                expiry
            };
            
            documents.push(document);
            
            // Add to document list
            const documentList = document.getElementById('documentList');
            const documentElement = document.createElement('div');
            documentElement.className = 'document-card';
            
            let iconClass;
            switch(type) {
                case 'passport': iconClass = 'fa-passport'; break;
                case 'visa': iconClass = 'fa-file-contract'; break;
                case 'license': iconClass = 'fa-id-card'; break;
                case 'insurance': iconClass = 'fa-file-medical'; break;
                case 'vaccination': iconClass = 'fa-syringe'; break;
                default: iconClass = 'fa-file-alt';
            }
            
            // Check if expiry is within 3 months
            const today = new Date();
            const expiryDate = new Date(expiry);
            const timeDiff = expiryDate - today;
            const daysDiff = Math.ceil(timeDiff / (1000 * 60 * 60 * 24));
            
            const expiryClass = daysDiff < 90 ? 'expiry-warning' : '';
            
            documentElement.innerHTML = `
                <div class="doc-type"><i class="fas ${iconClass}"></i> ${type.charAt(0).toUpperCase() + type.slice(1)}</div>
                <div class="doc-info">Number: ${number}</div>
                <div class="doc-expiry"><i class="fas fa-calendar"></i> Expiry: <span class="${expiryClass}">${expiry}</span></div>
                <button class="delete-doc" onclick="deleteDocument(${documents.length - 1})"><i class="fas fa-trash"></i></button>
            `;
            documentList.appendChild(documentElement);
            
            // Clear inputs
            document.getElementById('docNumber').value = '';
            document.getElementById('docExpiry').value = '';
            
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
                const documentElement = document.createElement('div');
                documentElement.className = 'document-card';
                
                let iconClass;
                switch(doc.type) {
                    case 'passport': iconClass = 'fa-passport'; break;
                    case 'visa': iconClass = 'fa-file-contract'; break;
                    case 'license': iconClass = 'fa-id-card'; break;
                    case 'insurance': iconClass = 'fa-file-medical'; break;
                    case 'vaccination': iconClass = 'fa-syringe'; break;
                    default: iconClass = 'fa-file-alt';
                }
                
                // Check if expiry is within 3 months
                const today = new Date();
                const expiryDate = new Date(doc.expiry);
                const timeDiff = expiryDate - today;
                const daysDiff = Math.ceil(timeDiff / (1000 * 60 * 60 * 24));
                
                const expiryClass = daysDiff < 90 ? 'expiry-warning' : '';
                
                documentElement.innerHTML = `
                    <div class="doc-type"><i class="fas ${iconClass}"></i> ${doc.type.charAt(0).toUpperCase() + doc.type.slice(1)}</div>
                    <div class="doc-info">Number: ${doc.number}</div>
                    <div class="doc-expiry"><i class="fas fa-calendar"></i> Expiry: <span class="${expiryClass}">${doc.expiry}</span></div>
                    <button class="delete-doc" onclick="deleteDocument(${index})"><i class="fas fa-trash"></i></button>
                `;
                documentList.appendChild(documentElement);
            });
        }

        // Currency converter functionality
        const exchangeRates = {
            USD: 0.012,
            EUR: 0.011,
            GBP: 0.0095,
            JPY: 1.70,
            AUD: 0.018,
            CAD: 0.016
        };
        
        function convertCurrency() {
            const amount = parseFloat(document.getElementById('currencyAmount').value) || 0;
            const toCurrency = document.getElementById('toCurrency').value;
            
            if (amount <= 0) {
                document.getElementById('conversionResult').textContent = 'Please enter a valid amount';
                return;
            }
            
            const rate = exchangeRates[toCurrency];
            const converted = (amount * rate).toFixed(2);
            
            document.getElementById('conversionResult').textContent = `${amount} INR = ${converted} ${toCurrency}`;
        }

        // Export functionality
        function exportItinerary() {
            if (activities.length === 0) {
                showNotification('Add activities to export itinerary');
                return;
            }
            
            showNotification('Itinerary exported successfully!');
        }

        // Notification system
        function showNotification(message) {
            const notification = document.getElementById('notification');
            const text = document.getElementById('notificationText');
            
            text.textContent = message;
            notification.classList.add('show');
            
            setTimeout(() => {
                notification.classList.remove('show');
            }, 3000);
        }

        // Initialize date inputs with current date
        document.addEventListener('DOMContentLoaded', function() {
            const today = new Date().toISOString().split('T')[0];
            const nextWeek = new Date();
            nextWeek.setDate(nextWeek.getDate() + 7);
            const nextWeekFormatted = nextWeek.toISOString().split('T')[0];
            
            document.getElementById('startDate').value = today;
            document.getElementById('endDate').value = nextWeekFormatted;
            document.getElementById('docExpiry').min = today;
            
            // Initialize checklist
            setupChecklist();
            
            // Generate initial packing list
            generatePackingList();
        });
        const checklistData = {
    preTrip: [
        "Book flights and accommodation",
        "Check passport validity",
        "Apply for visa (if needed)",
        "Buy travel insurance",
        "Arrange pet/house care",
        "Notify bank of travel"
    ],
    oneWeek: [
        "Print tickets and confirmations",
        "Check weather forecast",
        "Buy local currency",
        "Pack essentials",
        "Download offline maps"
    ],
    dayBefore: [
        "Charge devices",
        "Set out travel clothes",
        "Prepare snacks",
        "Confirm transport to airport/station",
        "Check-in online"
    ]
};

// Render checklist
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

// Handle checklist toggle
function toggleChecklist(id) {
    const checkbox = document.getElementById(id);
    localStorage.setItem(id, checkbox.checked);
    updateChecklistProgress();
}

// Update progress bar
function updateChecklistProgress() {
    const allIds = [];
    Object.keys(checklistData).forEach(section => {
        checklistData[section].forEach((_, idx) => {
            allIds.push(`${section}-item-${idx}`);
        });
    });
    const checked = allIds.filter(id => localStorage.getItem(id) === 'true').length;
    const percent = Math.round((checked / allIds.length) * 100);
    document.getElementById('progressFill').style.width = percent + '%';
    document.getElementById('progressText').textContent = `${percent}% Complete`;
}

// Initialize on page load
window.addEventListener('DOMContentLoaded', renderChecklist);
window.findRoute = function() {
    const from = document.getElementById('fromLocation').value.trim();
    const to = document.getElementById('toLocation').value.trim();
    const resultDiv = document.getElementById('routeResults');
    if (!from || !to) {
        resultDiv.innerHTML = '<div class="alert">Please enter both locations.</div>';
        return;
    }
    // Dummy route logic for demo
    resultDiv.innerHTML = `
        <div class="route-card">
            <h4><i class="fas fa-map-signs"></i> Best Route</h4>
            <div><b>From:</b> ${from}</div>
             <div><b>To:</b> ${to}</div>
            <div><b>Recommended:</b> Take a taxi or use public transport for fastest route.</div>
        </div>
    `;
};
