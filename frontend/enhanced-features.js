// =========================
// ENHANCED FEATURES FOR WANDERWISE
// =========================

// 1. AI SMART ITINERARY OPTIMIZATION
class SmartOptimizer {
  static async optimizeRoute(activities) {
    const optimized = [...activities].sort((a, b) => {
      const timeA = new Date(`2024-01-01 ${a.time}`);
      const timeB = new Date(`2024-01-01 ${b.time}`);
      return timeA - timeB;
    });
    
    // Simulate AI optimization with weather and traffic
    const weatherFactor = await this.getWeatherOptimization();
    const trafficFactor = await this.getTrafficOptimization();
    
    return {
      optimizedActivities: optimized,
      timeSaved: Math.floor(Math.random() * 60) + 30,
      moneySaved: Math.floor(Math.random() * 500) + 200,
      weatherScore: weatherFactor,
      trafficScore: trafficFactor
    };
  }
  
  static async getWeatherOptimization() {
    return Math.floor(Math.random() * 40) + 60; // 60-100% weather compatibility
  }
  
  static async getTrafficOptimization() {
    return Math.floor(Math.random() * 30) + 70; // 70-100% traffic efficiency
  }
}

// 2. HIDDEN GEMS DISCOVERY
const hiddenGems = [
  {
    name: "Secret Rooftop Garden",
    location: "Mumbai",
    type: "nature",
    rating: 4.8,
    description: "Hidden garden with city views, known only to locals",
    coordinates: { lat: 19.0760, lng: 72.8777 },
    tips: "Best visited during sunset, entry through building lobby"
  },
  {
    name: "Underground Jazz Club",
    location: "Delhi",
    type: "nightlife",
    rating: 4.9,
    description: "Speakeasy-style jazz club in basement of old building",
    coordinates: { lat: 28.6139, lng: 77.2090 },
    tips: "Password changes weekly, ask locals for current one"
  },
  {
    name: "Fisherman's Secret Beach",
    location: "Goa",
    type: "beach",
    rating: 4.7,
    description: "Pristine beach accessible only through fishing village",
    coordinates: { lat: 15.2993, lng: 74.1240 },
    tips: "Bring water and snacks, no facilities available"
  }
];

class HiddenGemsDiscovery {
  static getLocalGems(location, type = 'all') {
    return hiddenGems.filter(gem => 
      gem.location.toLowerCase().includes(location.toLowerCase()) &&
      (type === 'all' || gem.type === type)
    );
  }
  
  static addUserGem(gemData) {
    hiddenGems.push({
      ...gemData,
      rating: 0,
      userSubmitted: true,
      id: Date.now()
    });
  }
}

// 4. PREDICTIVE TRAVEL ANALYTICS
class TravelAnalytics {
  static getBestTimeToVisit(destination) {
    const analytics = {
      'Paris': { bestMonths: ['Apr', 'May', 'Sep', 'Oct'], crowdLevel: 'Medium', priceLevel: 'High' },
      'Tokyo': { bestMonths: ['Mar', 'Apr', 'Oct', 'Nov'], crowdLevel: 'High', priceLevel: 'Very High' },
      'Bali': { bestMonths: ['Apr', 'May', 'Jun', 'Sep'], crowdLevel: 'Medium', priceLevel: 'Medium' },
      'Mumbai': { bestMonths: ['Nov', 'Dec', 'Jan', 'Feb'], crowdLevel: 'High', priceLevel: 'Low' }
    };
    
    return analytics[destination] || {
      bestMonths: ['Year Round'],
      crowdLevel: 'Unknown',
      priceLevel: 'Medium'
    };
  }
  
  static getPriceTrends(destination) {
    return {
      currentTrend: Math.random() > 0.5 ? 'increasing' : 'decreasing',
      percentChange: Math.floor(Math.random() * 20) - 10,
      bestBookingTime: Math.floor(Math.random() * 60) + 30,
      prediction: 'Prices expected to ' + (Math.random() > 0.5 ? 'rise' : 'fall') + ' next month'
    };
  }
}

// 5. OFFLINE FUNCTIONALITY
class OfflineManager {
  static async downloadCityGuide(city) {
    const guide = {
      city,
      attractions: hiddenGems.filter(g => g.location === city),
      emergencyContacts: this.getEmergencyContacts(city),
      offlineMaps: `offline-map-${city.toLowerCase()}.json`,
      lastUpdated: new Date().toISOString()
    };
    
    localStorage.setItem(`offline-guide-${city}`, JSON.stringify(guide));
    return guide;
  }
  
  static getOfflineGuide(city) {
    const stored = localStorage.getItem(`offline-guide-${city}`);
    return stored ? JSON.parse(stored) : null;
  }
  
  static getEmergencyContacts(city) {
    const contacts = {
      'Mumbai': { police: '100', ambulance: '108', fire: '101' },
      'Delhi': { police: '100', ambulance: '108', fire: '101' },
      'Paris': { police: '17', ambulance: '15', fire: '18' }
    };
    return contacts[city] || { police: '112', ambulance: '112', fire: '112' };
  }
}

// 6. SMART NOTIFICATIONS
class SmartNotifications {
  static async checkWeatherAlerts(destination) {
    const weather = await this.getWeatherData(destination);
    const alerts = [];
    
    if (weather.temperature < 10) {
      alerts.push({
        type: 'weather',
        message: 'Pack warm clothes! Temperature dropping to ' + weather.temperature + '°C',
        priority: 'high'
      });
    }
    
    if (weather.rain > 70) {
      alerts.push({
        type: 'weather',
        message: 'High chance of rain (' + weather.rain + '%). Pack umbrella!',
        priority: 'medium'
      });
    }
    
    return alerts;
  }
  
  static async getWeatherData(destination) {
    // Simulate weather API
    return {
      temperature: Math.floor(Math.random() * 35) + 5,
      rain: Math.floor(Math.random() * 100),
      wind: Math.floor(Math.random() * 20) + 5
    };
  }
  
  static checkFlightAlerts(flightNumber) {
    const delays = ['On Time', 'Delayed 15 min', 'Delayed 30 min', 'Cancelled'];
    const status = delays[Math.floor(Math.random() * delays.length)];
    
    return {
      flightNumber,
      status,
      gate: 'A' + Math.floor(Math.random() * 20 + 1),
      boarding: new Date(Date.now() + 2 * 60 * 60 * 1000).toLocaleTimeString()
    };
  }
}

// 7. MULTI-MODAL TRIP PLANNING
class MultiModalPlanner {
  static async planJourney(from, to) {
    const options = [
      {
        mode: 'flight',
        duration: '2h 30m',
        cost: 8500,
        co2: 150,
        comfort: 'high',
        provider: 'IndiGo'
      },
      {
        mode: 'train',
        duration: '12h 45m',
        cost: 1200,
        co2: 45,
        comfort: 'medium',
        provider: 'Indian Railways'
      },
      {
        mode: 'bus',
        duration: '14h 20m',
        cost: 800,
        co2: 35,
        comfort: 'low',
        provider: 'RedBus'
      },
      {
        mode: 'car',
        duration: '10h 15m',
        cost: 3500,
        co2: 120,
        comfort: 'high',
        provider: 'Self Drive'
      }
    ];
    
    return {
      from,
      to,
      options: options.sort((a, b) => a.cost - b.cost),
      recommended: options[1], // Train as eco-friendly option
      carbonSavings: options[2].co2 - options[0].co2
    };
  }
}

// 8. AI TRAVEL PERSONALITY ENGINE
class AIPersonality {
  static userPreferences = {
    budget: 'medium',
    travelStyle: 'explorer',
    interests: ['culture', 'food'],
    previousTrips: []
  };
  
  static learnFromActivity(activity) {
    this.userPreferences.previousTrips.push({
      activity: activity.name,
      type: activity.type || 'general',
      rating: activity.rating || 5,
      timestamp: new Date()
    });
    
    // Update interests based on activity patterns
    this.updateInterests(activity);
  }
  
  static updateInterests(activity) {
    const activityTypes = {
      'museum': 'culture',
      'restaurant': 'food',
      'hiking': 'adventure',
      'beach': 'relaxation'
    };
    
    const interest = activityTypes[activity.type];
    if (interest && !this.userPreferences.interests.includes(interest)) {
      this.userPreferences.interests.push(interest);
    }
  }
  
  static getPersonalizedRecommendations(destination) {
    const recommendations = [];
    
    if (this.userPreferences.interests.includes('culture')) {
      recommendations.push('Visit local museums and historical sites');
    }
    
    if (this.userPreferences.interests.includes('food')) {
      recommendations.push('Try street food tours and cooking classes');
    }
    
    if (this.userPreferences.budget === 'low') {
      recommendations.push('Look for free walking tours and public parks');
    }
    
    return recommendations;
  }
}

// Export all classes for use in main script
window.SmartOptimizer = SmartOptimizer;
window.HiddenGemsDiscovery = HiddenGemsDiscovery;
window.TravelAnalytics = TravelAnalytics;
window.OfflineManager = OfflineManager;
window.SmartNotifications = SmartNotifications;
window.MultiModalPlanner = MultiModalPlanner;
window.AIPersonality = AIPersonality;