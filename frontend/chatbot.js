// =========================
// WANDERWISE CHATBOT
// =========================

class WanderWiseChatbot {
  constructor() {
    this.isOpen = false;
    this.messages = [
      {
        type: 'bot',
        text: 'Hi! I\'m your WanderWise travel assistant. I can help you plan trips, find hidden gems, get travel advice, and answer questions about destinations. How can I help you today?',
        timestamp: new Date()
      }
    ];
    this.init();
  }

  init() {
    this.createChatbotUI();
    this.bindEvents();
  }

  createChatbotUI() {
    const chatbotHTML = `
      <div id="chatbot-container" class="chatbot-container">
        <div id="chatbot-header" class="chatbot-header">
          <div class="chatbot-title">
            <i class="fas fa-robot"></i>
            <span>WanderWise Assistant</span>
          </div>
          <button id="chatbot-close" class="chatbot-close">
            <i class="fas fa-times"></i>
          </button>
        </div>
        <div id="chatbot-messages" class="chatbot-messages"></div>
        <div class="chatbot-input-container">
          <input type="text" id="chatbot-input" placeholder="Ask me about travel, destinations, or planning..." />
          <button id="chatbot-send" class="chatbot-send">
            <i class="fas fa-paper-plane"></i>
          </button>
        </div>
      </div>
      
      <button id="chatbot-toggle" class="chatbot-toggle">
        <i class="fas fa-comments"></i>
      </button>
    `;

    document.body.insertAdjacentHTML('beforeend', chatbotHTML);
    this.renderMessages();
  }

  bindEvents() {
    const toggle = document.getElementById('chatbot-toggle');
    const close = document.getElementById('chatbot-close');
    const send = document.getElementById('chatbot-send');
    const input = document.getElementById('chatbot-input');

    toggle.addEventListener('click', () => this.toggleChatbot());
    close.addEventListener('click', () => this.closeChatbot());
    send.addEventListener('click', () => this.sendMessage());
    
    input.addEventListener('keypress', (e) => {
      if (e.key === 'Enter') this.sendMessage();
    });
  }

  toggleChatbot() {
    const container = document.getElementById('chatbot-container');
    const toggle = document.getElementById('chatbot-toggle');
    
    this.isOpen = !this.isOpen;
    
    if (this.isOpen) {
      container.classList.add('open');
      toggle.style.display = 'none';
      document.getElementById('chatbot-input').focus();
    } else {
      container.classList.remove('open');
      toggle.style.display = 'flex';
    }
  }

  closeChatbot() {
    this.isOpen = false;
    document.getElementById('chatbot-container').classList.remove('open');
    document.getElementById('chatbot-toggle').style.display = 'flex';
  }

  async sendMessage() {
    const input = document.getElementById('chatbot-input');
    const message = input.value.trim();
    
    if (!message) return;

    // Add user message
    this.addMessage('user', message);
    input.value = '';

    // Show typing indicator
    this.showTyping();

    try {
      // Send to your existing chatbot API
      const response = await fetch('https://wander-wise-smart-routes-hidden-gems-travel-smarter-b7vtijzkc.vercel.app/api/chatbot', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          messages: [
            {
              role: 'system',
              content: 'You are WanderWise, a helpful travel assistant. Provide concise, practical travel advice, destination information, and trip planning help. Be friendly and knowledgeable about travel, hidden gems, and local experiences.'
            },
            {
              role: 'user',
              content: message
            }
          ]
        })
      });

      const data = await response.json();
      
      if (data.reply) {
        this.hideTyping();
        this.addMessage('bot', data.reply);
      } else {
        throw new Error('No reply received');
      }
    } catch (error) {
      console.error('Chatbot error:', error);
      this.hideTyping();
      
      // Use enhanced fallback response
      const fallbackResponse = this.getFallbackResponse(message.toLowerCase());
      this.addMessage('bot', fallbackResponse);
    }
  }
  
  getFallbackResponse(message) {
    // Tamil Nadu specific queries
    if (message.includes('tamil nadu') || message.includes('tamilnadu')) {
      return `🏛️ **5-Day Tamil Nadu Itinerary:**\n\n**Day 1-2: Chennai**\n• Marina Beach, Kapaleeshwarar Temple\n• Fort St. George, Government Museum\n\n**Day 3: Mahabalipuram**\n• Shore Temple, Arjuna's Penance\n• Five Rathas, Lighthouse\n\n**Day 4: Pondicherry**\n• French Quarter, Auroville\n• Paradise Beach, Sri Aurobindo Ashram\n\n**Day 5: Thanjavur**\n• Brihadeeswarar Temple\n• Thanjavur Palace\n\n💡 **Hidden Gems:** Dhanushkodi Beach, Chettinad mansions, Yelagiri Hills`;
    }
    
    // City destinations
    if (message.includes('cities') || message.includes('city')) {
      return `🏙️ **Top City Destinations:**\n\n**India:**\n• Mumbai - Bollywood, street food\n• Delhi - History, culture, monuments\n• Bangalore - Gardens, nightlife\n• Jaipur - Pink city, palaces\n\n**International:**\n• Paris - Art, romance, cuisine\n• Tokyo - Technology, culture\n• New York - Skyline, Broadway\n• London - History, museums\n\nWhich type of city experience interests you most?`;
    }
    
    // Beach destinations
    if (message.includes('beach') || message.includes('coastal')) {
      return `🏖️ **Amazing Beach Destinations:**\n\n**India:**\n• Goa - Parties, Portuguese culture\n• Kerala - Backwaters, Ayurveda\n• Andaman - Crystal clear waters\n• Gokarna - Peaceful, spiritual\n\n**International:**\n• Bali - Temples, rice terraces\n• Maldives - Luxury, overwater villas\n• Thailand - Islands, street food\n• Greece - White buildings, blue seas`;
    }
    
    // Trip planning
    if (message.includes('plan') || message.includes('itinerary')) {
      return `📋 **Trip Planning Steps:**\n\n1. **Choose Duration & Budget**\n2. **Pick 2-3 Main Destinations**\n3. **Book Transport & Stay**\n4. **Plan Daily Activities**\n5. **Pack Smart & Light**\n\n💡 **Pro Tips:**\n• Book 6-8 weeks ahead\n• Keep 1 day flexible\n• Research local customs\n• Download offline maps\n\nWhat's your destination and duration?`;
    }
    
    // Budget travel
    if (message.includes('budget') || message.includes('cheap')) {
      return `💰 **Budget Travel Hacks:**\n\n**Accommodation:**\n• Hostels, guesthouses\n• Homestays, Airbnb\n\n**Transport:**\n• Public buses, trains\n• Book advance tickets\n\n**Food:**\n• Street food, local eateries\n• Cook if possible\n\n**Activities:**\n• Free walking tours\n• Public parks, beaches`;
    }
    
    // Packing advice
    if (message.includes('pack') || message.includes('luggage')) {
      return `🎒 **Smart Packing Guide:**\n\n**Essentials:**\n• Passport, tickets, insurance\n• Phone charger, power bank\n• Basic medicines\n\n**Clothing:**\n• Roll, don't fold\n• 1 week clothes max\n• Comfortable shoes\n\n**Tech:**\n• Universal adapter\n• Offline maps\n• Emergency contacts`;
    }
    
    // Hidden gems
    if (message.includes('gem') || message.includes('hidden')) {
      return `💎 **Finding Hidden Gems:**\n\n• Ask locals for recommendations\n• Check our Hidden Gems tab\n• Explore beyond main attractions\n• Visit early morning/late evening\n• Support local businesses\n\nExamples: Local markets, rooftop views, secret beaches, traditional workshops`;
    }
    
    // General greetings
    if (message.includes('hello') || message.includes('hi')) {
      return `Hello! 👋 I'm your WanderWise travel assistant!\n\nI can help you with:\n🗺️ Destination recommendations\n📋 Trip planning & itineraries\n💰 Budget travel tips\n🎒 Packing advice\n💎 Hidden gems & local spots\n\nWhat's your travel dream?`;
    }
    
    // Default response
    return `I'm here to help with travel! 🌍\n\nTry asking:\n• "5-day trip to Kerala"\n• "Budget travel tips"\n• "Best beaches in India"\n• "Hidden gems in Tokyo"\n• "Packing for winter trip"\n\nWhat would you like to explore?`;
  }

  addMessage(type, text) {
    this.messages.push({
      type,
      text,
      timestamp: new Date()
    });
    this.renderMessages();
  }

  renderMessages() {
    const messagesContainer = document.getElementById('chatbot-messages');
    if (!messagesContainer) return;

    messagesContainer.innerHTML = this.messages.map(msg => `
      <div class="message ${msg.type}">
        <div class="message-content">
          ${msg.text}
        </div>
        <div class="message-time">
          ${msg.timestamp.toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}
        </div>
      </div>
    `).join('');

    messagesContainer.scrollTop = messagesContainer.scrollHeight;
  }

  showTyping() {
    const messagesContainer = document.getElementById('chatbot-messages');
    const typingHTML = `
      <div id="typing-indicator" class="message bot typing">
        <div class="message-content">
          <div class="typing-dots">
            <span></span>
            <span></span>
            <span></span>
          </div>
        </div>
      </div>
    `;
    messagesContainer.insertAdjacentHTML('beforeend', typingHTML);
    messagesContainer.scrollTop = messagesContainer.scrollHeight;
  }

  hideTyping() {
    const typing = document.getElementById('typing-indicator');
    if (typing) typing.remove();
  }
}



// Initialize chatbot when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
  window.wanderWiseChatbot = new WanderWiseChatbot();
});