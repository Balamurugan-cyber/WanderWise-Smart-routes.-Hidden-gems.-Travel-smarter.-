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
        document.addEventListener('DOMContentLoaded', function() {
            const hamburgerBtn = document.getElementById('hamburgerBtn');
            // Use the correct selector for your menu:
            // If your menu has id="mainTabs", use:
            const mainTabs = document.getElementById('mainTabs');
            // If your menu has class="tabs", use:
            // const mainTabs = document.querySelector('.tabs');
        
            if (hamburgerBtn && mainTabs) {
                hamburgerBtn.addEventListener('click', function() {
                    mainTabs.classList.toggle('open');
                    this.classList.toggle('active');
                });
        
                // Optional: close menu when a tab is clicked (on mobile)
                mainTabs.querySelectorAll('.tab').forEach(tab => {
                    tab.addEventListener('click', () => {
                        if (window.innerWidth <= 800) {
                            mainTabs.classList.remove('open');
                            hamburgerBtn.classList.remove('active');
                        }
                    });
                });
            }
        });
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
            CAD: 0.016,
            CNY: 12.09, 
            SGD: 67.54, 
            ZAR: 4.87, 
            BRL: 15.64, 
            RUB: 1.09, 
            KRW: 0.063
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

// Back to Top button logic
const backToTopBtn = document.getElementById('backToTop');
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

// Gallery data
        const galleryData = [
            {
                title: "Santorini, Greece",
                location: "Greece, Europe",
                image: "https://images.unsplash.com/photo-1537996194471-e657df975ab4?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80",
                description: "Famous for its whitewashed houses with blue domes, breathtaking sunsets, and crystal-clear waters. Santorini is a dream destination for romance and relaxation.",
                region: "europe",
                bestTime: "Apr-Oct",
                rating: 4.9
            },
            {
                title: "Machu Picchu, Peru",
                location: "Peru, South America",
                image: "https://images.unsplash.com/photo-1526392060635-9d6019884377?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80",
                description: "This 15th-century Inca citadel is located high in the Andes Mountains. Often referred to as the 'Lost City of the Incas', it's one of the most iconic archaeological sites in the world.",
                region: "americas",
                bestTime: "May-Sep",
                rating: 4.8
            },
            {
                title: "Kyoto, Japan",
                location: "Japan, Asia",
                image: "https://images.unsplash.com/photo-1493976040374-85c8e12f0c0e?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80",
                description: "Known for its classical Buddhist temples, gardens, imperial palaces, and traditional wooden houses. Kyoto is especially beautiful during cherry blossom season.",
                region: "asia",
                bestTime: "Mar-May, Oct-Nov",
                rating: 4.9
            },
            {
                title: "Serengeti National Park",
                location: "Tanzania, Africa",
                image: "https://picsum.photos/id/169/800/600",
                description: "Famous for its annual migration of over 1.5 million wildebeest and 250,000 zebras. The park offers one of the most spectacular wildlife experiences on the planet.",
                region: "africa",
                bestTime: "Jun-Oct",
                rating: 4.8
            },
            {
                title: "Great Barrier Reef",
                location: "Australia, Oceania",
                image: "https://images.unsplash.com/photo-1544551763-46a013bb70d5?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80",
                description: "The world's largest coral reef system composed of over 2,900 individual reefs and 900 islands. A paradise for divers and marine life enthusiasts.",
                region: "oceania",
                bestTime: "Jun-Oct",
                rating: 4.7
            },
            {
                title: "Venice, Italy",
                location: "Italy, Europe",
                image: "https://images.unsplash.com/photo-1514890547357-a9ee288728e0?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80",
                description: "Built on more than 100 small islands in a lagoon in the Adriatic Sea. Known for its canals, gondolas, and stunning Renaissance architecture.",
                region: "europe",
                bestTime: "Apr-Jun, Sep-Oct",
                rating: 4.7
            },
            {
                title: "Angkor Wat, Cambodia",
                location: "Cambodia, Asia",
                image: "https://images.unsplash.com/photo-1552465011-b4e21bf6e79a?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80",
                description: "The largest religious monument in the world, originally constructed as a Hindu temple. Its intricate carvings and majestic scale are breathtaking.",
                region: "asia",
                bestTime: "Nov-Feb",
                rating: 4.8
            },
            {
                title: "Banff National Park",
                location: "Canada, North America",
                image: "https://images.unsplash.com/photo-1500581276021-a4bbcd0050c5?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80",
                description: "Canada's oldest national park, known for its turquoise glacial lakes, majestic mountains, and abundant wildlife. A paradise for outdoor enthusiasts.",
                region: "americas",
                bestTime: "Jun-Aug, Dec-Mar",
                rating: 4.9
            },
            {
                title: "Bora Bora, French Polynesia",
                location: "French Polynesia, Oceania",
                image: "https://picsum.photos/id/104/800/600",
                description: "Famous for its turquoise lagoon protected by a coral reef and surrounded by sand-fringed motus (islets). The ultimate luxury island getaway.",
                region: "oceania",
                bestTime: "May-Oct",
                rating: 4.9
            },
            {
                title: "Victoria Falls",
                location: "Zambia/Zimbabwe, Africa",
                image: "https://picsum.photos/id/121/800/600",
                description: "One of the largest and most famous waterfalls in the world. Locally known as 'Mosi-oa-Tunya' or 'The Smoke that Thunders'.",
                region: "africa",
                bestTime: "Feb-May, Aug-Dec",
                rating: 4.7
            },
            {
                title: "Grand Canyon",
                location: "Arizona, USA",
                image: "https://picsum.photos/id/102/800/600",
                description: "A steep-sided canyon carved by the Colorado River, it's 277 miles long, up to 18 miles wide and over a mile deep. A geological wonder that leaves visitors in awe.",
                region: "americas",
                bestTime: "Mar-May, Sep-Nov",
                rating: 4.8
            },
            {
                title: "Northern Lights, Iceland",
                location: "Iceland, Europe",
                image: "https://images.unsplash.com/photo-1519817914152-22d216bb9170?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80",
                description: "The Aurora Borealis is a natural light display in the Earth's sky, predominantly seen in high-latitude regions. Iceland offers some of the best viewing opportunities.",
                region: "europe",
                bestTime: "Sep-Mar",
                rating: 4.9
            },
            {
                title: "Andaman Islands, India",
                location: "India, Asia",
                image: "https://images.unsplash.com/photo-1519817914152-22d216bb9170?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80",
                description: "Turquoise waters, bioluminescent beaches (Havelock Island), coral reefs, and historic Ross Island.",
                region: "asia",
                bestTime:"Nov-May",
                rating: 4.4
            },
            {
                title: "Whitsunday Islands, Australia",
                location: "India, Asia",
                image: "https://images.unsplash.com/photo-1519817914152-22d216bb9170?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80",
                description: "Whitehaven Beach’s silica sand, sailing tours, Heart Reef flyovers.Reef sharks, sea turtles.",
                region: "australia",
                bestTime: "May-Sep",
                rating: 4.1
            },
            {
                title: "Maldives",
                location: "Indian Ocean",
                image: "https://images.unsplash.com/photo-1590523278191-995cbcda646b?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1200&q=80",
                description: "Paradise of coral atolls with luxury resorts and vibrant marine life.",
                region: "asia",
                category: "islands",
                bestTime: "Nov-Apr",
                rating: 4.8
            },
             {
                title: "Phi Phi Islands",
                location: "Thailand",
                image: "https://images.unsplash.com/photo-1552465011-b4e21bf6e79a?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1200&q=80",
                description: "Dramatic limestone cliffs and crystal-clear waters in the Andaman Sea.",
                region: "asia",
                category: "islands",
                bestTime: "Nov-Apr",
                rating: 4.7
            },
            {
                title: "Aurora Australis",
                location: "Tasmania, Australia",
                image: "https://images.unsplash.com/photo-1508973379184-7517410fb0bc?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1200&q=80",
                description: "Southern Lights - nature's spectacular light show in the Tasmanian sky.",
                region: "australia",
                category: "nature",
                bestTime: "May-Aug",
                rating: 4.9
            },
        ];

        // Function to generate gallery cards
        function generateGalleryCards() {
            const galleryContainer = document.getElementById('gallery-container');
            galleryContainer.innerHTML = '';
            
            galleryData.forEach((place, index) => {
                const card = document.createElement('div');
                card.className = 'gallery-card';
                card.dataset.region = place.region;
                card.innerHTML = `
                    <img src="${place.image}" alt="${place.title}" class="card-image">
                    <div class="card-overlay">
                        <h3 class="card-title">${place.title}</h3>
                        <div class="card-location">
                            <i class="fas fa-map-marker-alt"></i>
                            <span>${place.location}</span>
                        </div>
                        <p class="card-description">${place.description}</p>
                        <div class="card-stats">
                            <div><i class="fas fa-calendar"></i> Best: ${place.bestTime}</div>
                            <div><i class="fas fa-star"></i> Rating: ${place.rating}</div>
                        </div>
                    </div>
                `;
                galleryContainer.appendChild(card);
                
                // Add scroll animation
                setTimeout(() => {
                    observeCard(card);
                }, 100);
            });
        }

        // Intersection Observer for scroll animations
        function observeCard(card) {
            const observer = new IntersectionObserver((entries) => {
                entries.forEach(entry => {
                    if (entry.isIntersecting) {
                        card.classList.add('visible');
                        observer.unobserve(card);
                    }
                });
            }, { threshold: 0.1 });

            observer.observe(card);
        }

        // Filter gallery by region
        function filterGallery(region) {
            const cards = document.querySelectorAll('.gallery-card');
            cards.forEach(card => {
                if (region === 'all' || card.dataset.region === region) {
                    card.style.display = 'block';
                } else {
                    card.style.display = 'none';
                }
            });
        }

        // Search functionality
        function searchGallery(query) {
            const cards = document.querySelectorAll('.gallery-card');
            const searchTerm = query.toLowerCase();
            
            cards.forEach(card => {
                const title = card.querySelector('.card-title').textContent.toLowerCase();
                const location = card.querySelector('.card-location span').textContent.toLowerCase();
                
                if (title.includes(searchTerm) || location.includes(searchTerm)) {
                    card.style.display = 'block';
                } else {
                    card.style.display = 'none';
                }
            });
        }

        // Tab switching function
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
            
            // If switching to gallery, initialize it
            if (tabName === 'gallery') {
                generateGalleryCards();
            }
        }

        // Initialize when DOM is loaded
        document.addEventListener('DOMContentLoaded', function() {
            // Generate gallery cards
            generateGalleryCards();
            
            // Filter button event listeners
            document.querySelectorAll('.filter-btn').forEach(button => {
                button.addEventListener('click', function() {
                    document.querySelectorAll('.filter-btn').forEach(btn => btn.classList.remove('active'));
                    this.classList.add('active');
                    filterGallery(this.dataset.filter);
                });
            });
            
            // Search input event listener
            document.getElementById('searchGallery').addEventListener('input', function() {
                searchGallery(this.value);
            });
            
            // Hamburger menu functionality
            const hamburgerBtn = document.getElementById('hamburgerBtn');
            const mainTabs = document.querySelector('.tabs');
            
            hamburgerBtn.addEventListener('click', function() {
                mainTabs.classList.toggle('open');
                this.classList.toggle('active');
            });
        });
        