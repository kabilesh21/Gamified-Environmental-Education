import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Bot, X, Send, Sparkles, User, ShieldCheck } from 'lucide-react';

export default function AiAssistant() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([
    {
      id: 1,
      sender: 'bot',
      text: "Hello! I am EcoBot, your Ecoversee AI learning assistant. Ask me anything about environmental preservation, carbon footprints, or how to navigate our platform!",
    },
  ]);
  const [inputValue, setInputValue] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef(null);

  // Auto scroll to bottom
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isTyping]);

  const quickDoubts = [
    { label: "How to earn XP?", query: "how do I earn XP and level up?" },
    { label: "What is Carbon Footprint?", query: "what is carbon footprint?" },
    { label: "Water Saving Tips", query: "water saving tips" },
    { label: "Plastic Recycling Rules", query: "plastic recycling rules" },
  ];

  const getBotResponse = (query) => {
    const q = query.toLowerCase();
    
    if (q.includes('hi') || q.includes('hello') || q.includes('hey') || q.includes('greetings') || q.includes('morning')) {
      return "HELLO! EcoBot here, and I am absolutely BUBBLING with eco-energy today! 🌟 how can I help you save the planet and climb the leaderboard today? Let's grow green! 🌿🚀";
    }
    if (q.includes('compost') || q.includes('biodegradable') || q.includes('organic waste')) {
      return "Composting is pure environmental magic! 🍂 You take kitchen scraps, fruit peels, and dry leaves, and let microscopic superstars break them down into rich, black gold! It saves waste from landfills (stopping toxic methane emissions) and feeds your garden naturally! 🌿💚";
    }
    if (q.includes('solar') || q.includes('sunlight') || q.includes('photovoltaic')) {
      return "Aha! Solar energy is the ultimate power move! ☀️ Photovoltaic cells capture photons from sunlight and knock electrons loose to create direct current electricity! Installing solar panels can slash your carbon footprint by tons of CO2 over their lifetime. Let's make the sun work for us! ⚡💡";
    }
    if (q.includes('wind') || q.includes('turbine')) {
      return "Wind power is spectacular! 💨 Modern wind turbines capture the kinetic energy of moving air to spin generators, producing massive amounts of clean, green electricity! In fact, a single wind farm can power thousands of homes carbon-free! Let's harness the breeze! 🎡🌍";
    }
    if (q.includes('water') || q.includes('conserve') || q.includes('saving') || q.includes('rain')) {
      return "Saving water is a top-tier eco action! 💧 Freshwater is incredibly precious. You can be a hydro hero by taking shorter showers, using drip irrigation for plants, fixing leaky faucets instantly, and capturing rainwater in barrels. Every single drop counts! 🚿💚";
    }
    if (q.includes('plastic') || q.includes('recycle') || q.includes('landfill') || q.includes('waste') || q.includes('trash')) {
      return "Recycling is a total eco superpower! ♻️ Sorting your paper, metals, glass, and plastics (especially codes 1 and 2) keeps them out of landfills and gives them a second life. Tip: always wash/rinse food containers first to avoid contaminating other recyclables! Let's close the loop! 📦✨";
    }
    if (q.includes('soil') || q.includes('agriculture') || q.includes('farming') || q.includes('regenerative') || q.includes('erosion')) {
      return "Regenerative agriculture is the absolute savior of our soils! 🌾 Unlike industrial farming, it focuses on building soil organic matter, cover cropping, and zero-tillage to restore biodiversity and capture carbon directly from the atmosphere! Healthy soil means a healthy planet! 🚜💚";
    }
    if (q.includes('ocean') || q.includes('marine') || q.includes('sea') || q.includes('acidification')) {
      return "The oceans cover 70% of our blue planet and are the lungs of the Earth! 🌊 We must protect marine life from plastic pollution, coral bleaching, and ocean acidification caused by high CO2. We can help by using zero-waste products and reducing carbon emissions! 🐬🐙";
    }
    if (q.includes('biodiversity') || q.includes('ecosystem') || q.includes('species') || q.includes('extinction')) {
      return "Biodiversity is the rich, complex tapestry of life! 🐝 Every creature, from bees to blue whales, has a vital role in our ecosystems. Losing even one keystone species can trigger a collapse! We must preserve habitats and plant native species. Let's safeguard our wild spaces! 🦊🌳";
    }
    if (q.includes('fashion') || q.includes('clothes') || q.includes('textile')) {
      return "Fast fashion has a massive carbon and water footprint! 👕 Buying high-quality second-hand clothing, choosing organic/biodegradable materials (like hemp and linen), and recycling old textiles can save thousands of liters of water and reduce massive landfill waste! Wear your green pride! 👗✨";
    }
    if (q.includes('transit') || q.includes('car') || q.includes('commute') || q.includes('electric')) {
      return "How we move matters! 🚲 Electric vehicles, public transit, and active commuting (walking, cycling) are the future of low-emission travel. Ditching personal fossil-fuel cars cleans our air and slashes greenhouse gases! Let's ride towards a greener horizon! 🚄🛴";
    }
    if (q.includes('forest') || q.includes('tree') || q.includes('planting')) {
      return "Trees are the lungs of the Earth and natural carbon vacuums! 🌳 A single mature tree can absorb around 22kg of CO2 per year. Planting trees, supporting reforestation, and halting deforestation are critical steps to cooling down our planet. Let's grow a greener future! 🌲💚";
    }
    if (q.includes('air') || q.includes('pollution') || q.includes('smog')) {
      return "Clean air is a fundamental right! 🍃 Smog and fine particles (PM2.5) are major public health threats. We can improve urban air quality by planting city trees, moving to clean electric heating, and driving zero-emission vehicles. Breathe easy! 🌬️🌍";
    }
    if (q.includes('geothermal') || q.includes('heat')) {
      return "Geothermal energy is super cool—or rather, super hot! 🌋 It taps into the natural heat of Earth's molten core to produce constant, weather-proof, 24/7 green electricity and heating. It's a key player in the clean energy revolution! ⚡🔥";
    }
    if (q.includes('biomass') || q.includes('biofuel')) {
      return "Biomass and biofuels use organic matter (like agricultural waste and algae) to generate clean electricity or liquid fuels. Since plants absorb CO2 as they grow, biomass can be part of a carbon-neutral circular economy! 🌾🔋";
    }
    if (q.includes('carbon') || q.includes('footprint') || q.includes('emissions') || q.includes('co2')) {
      return "Your carbon footprint is the total amount of greenhouse gases you emit from daily activities. Use the Dashboard Estimator in Ecoversee to count yours, and try to lower it by eating plant-rich foods, switching off standby power, and choosing sustainable transit! 📊🌍";
    }
    if (q.includes('garden') || q.includes('flower') || q.includes('animal') || q.includes('windmill') || q.includes('pond')) {
      return "Our Eco Garden is a direct reflection of your environmental achievements! 🌸 As you complete lessons and quizzes, you earn coins to purchase trees, flowers, decorations, and wind/solar gadgets. Place them on your canvas to design a beautiful, sustainable dream reserve! 🌳✨";
    }
    if (q.includes('xp') || q.includes('level') || q.includes('point') || q.includes('badge') || q.includes('certificate')) {
      return "You earn XP by completing lessons (+10 XP) and scoring 60%+ on course quizzes (+50 XP). Levels scale linearly at every 100 XP increment. Completing a quiz also unlocks a certified course badge and generates your completion certificate! Let's reach Level 10! 🏆🌟";
    }
    if (q.includes('shop') || q.includes('coin') || q.includes('buy') || q.includes('price')) {
      return "Diligence pays off! 🪙 Use your Eco Coins earned from completing lessons (+15 Coins) and quizzes (+50 Coins) to buy items in the Reward Shop like Windmills, Sunflowers, and Solar Trains! Decorate your garden now! 🛍️🌳";
    }
    if (q.includes('event') || q.includes('earth day') || q.includes('july')) {
      return "Woohoo! Seasonal events like Earth Day and Plastic Free July are fantastic opportunities to earn massive XP (+500 XP) and exclusive Badges! Read the banner details and tackle those modules today! 📅🎉";
    }
    if (q.includes('challenge') || q.includes('mission') || q.includes('weekly')) {
      return "Weekly missions reset regularly and keep you on your toes! 🎯 Tasks like completing 5 quizzes or reading 3 modules award bonus XP and Eco Coins. Always check your dashboard to track your progress! Let's smash them! 💪💚";
    }

    // Dynamic NLP fallback responder
    const cleanQuery = query.replace(/[?.,!]/g, "").trim();
    const words = cleanQuery.split(/\s+/);
    const stopWords = new Set(['what', 'is', 'why', 'how', 'do', 'you', 'the', 'a', 'an', 'to', 'for', 'in', 'on', 'with', 'about', 'can', 'are', 'your', 'my', 'me', 'i']);
    const keywords = words.filter(w => w.length > 3 && !stopWords.has(w.toLowerCase()));
    const subject = keywords.length > 0 ? keywords.join(" ") : "this sustainability topic";

    return `WHOA! That is an absolutely brilliant and fascinating question about "${subject}"! 🌍✨ As your Ecoversee AI assistant, I am positively bubbling with excitement to discuss this!

While I'm constantly loading new scientific databases, here is an awesome eco-friendly perspective: when it comes to "${subject}", the golden rule is always to look for ways to reduce waste, respect natural ecosystems, and promote renewable options! 🌿💚

Every action we take—from learning about environmental preservation to planting digital trees in our Eco Garden—helps build a cleaner, greener tomorrow! What other cool eco-questions do you have? Let's save the planet together! 🚀🚀`;
  };

  const handleSend = (textToSend) => {
    if (!textToSend.trim()) return;

    // Append user message
    const userMsg = {
      id: Date.now(),
      sender: 'user',
      text: textToSend,
    };
    setMessages((prev) => [...prev, userMsg]);
    setInputValue('');
    setIsTyping(true);

    // Simulate AI response delay
    setTimeout(() => {
      const botResponseText = getBotResponse(textToSend);
      const botMsg = {
        id: Date.now() + 1,
        sender: 'bot',
        text: botResponseText,
      };
      setMessages((prev) => [...prev, botMsg]);
      setIsTyping(false);
    }, 1000);
  };

  return (
    <div style={styles.assistantContainer}>
      {/* Floating Button */}
      <motion.button
        onClick={() => setIsOpen(!isOpen)}
        style={styles.floatingBtn}
        whileHover={{ scale: 1.08 }}
        whileTap={{ scale: 0.95 }}
      >
        <Bot size={24} />
        <span style={styles.pulseDot} />
      </motion.button>

      {/* Chat Window Panel */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            style={styles.chatWindow}
            initial={{ opacity: 0, y: 50, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 50, scale: 0.9 }}
            transition={{ type: 'spring', damping: 20 }}
          >
            {/* Header */}
            <div style={styles.header}>
              <div style={styles.botProfile}>
                <div style={styles.botIcon}>
                  <Bot size={16} color="#7FB77E" />
                </div>
                <div>
                  <h4 style={styles.botName}>EcoBot Assistant</h4>
                  <span style={styles.botStatus}>Online</span>
                </div>
              </div>
              <button onClick={() => setIsOpen(false)} style={styles.closeBtn}>
                <X size={18} />
              </button>
            </div>

            {/* Chat History Panel */}
            <div style={styles.chatHistory}>
              {messages.map((msg) => (
                <div
                  key={msg.id}
                  style={{
                    ...styles.messageRow,
                    justifyContent: msg.sender === 'user' ? 'flex-end' : 'flex-start',
                  }}
                >
                  {msg.sender === 'bot' && (
                    <div style={styles.msgAvatarBot}>
                      <Bot size={12} color="#FFFFFF" />
                    </div>
                  )}
                  
                  <div
                    style={{
                      ...styles.messageBubble,
                      backgroundColor: msg.sender === 'user' ? '#8B6B4A' : '#FFFFFF',
                      color: msg.sender === 'user' ? '#FFFFFF' : '#2D241E',
                      borderRadius: msg.sender === 'user' ? '16px 16px 4px 16px' : '16px 16px 16px 4px',
                      border: msg.sender === 'user' ? 'none' : '1px solid #EADBCE',
                    }}
                  >
                    {msg.text}
                  </div>

                  {msg.sender === 'user' && (
                    <div style={styles.msgAvatarUser}>
                      <User size={12} color="#FFFFFF" />
                    </div>
                  )}
                </div>
              ))}

              {isTyping && (
                <div style={styles.messageRow}>
                  <div style={styles.msgAvatarBot}>
                    <Bot size={12} color="#FFFFFF" />
                  </div>
                  <div style={styles.typingIndicator}>
                    <span></span>
                    <span></span>
                    <span></span>
                  </div>
                </div>
              )}
              <div ref={messagesEndRef} />
            </div>

            {/* Quick doubts block */}
            <div style={styles.quickDoubtsBox}>
              <span style={styles.quickTitle}>Frequently Asked Questions:</span>
              <div style={styles.quickGrid}>
                {quickDoubts.map((doubt, idx) => (
                  <button
                    key={idx}
                    onClick={() => handleSend(doubt.query)}
                    style={styles.quickBtn}
                    disabled={isTyping}
                  >
                    {doubt.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Input Bar */}
            <form
              onSubmit={(e) => {
                e.preventDefault();
                handleSend(inputValue);
              }}
              style={styles.inputForm}
            >
              <input
                type="text"
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                placeholder="Ask your query here..."
                style={styles.chatInput}
                disabled={isTyping}
              />
              <button type="submit" style={styles.sendBtn} disabled={isTyping || !inputValue.trim()}>
                <Send size={16} />
              </button>
            </form>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

const styles = {
  assistantContainer: {
    position: 'fixed',
    bottom: '24px',
    right: '24px',
    zIndex: 9999,
  },
  floatingBtn: {
    width: '56px',
    height: '56px',
    borderRadius: '50%',
    backgroundColor: '#7FB77E',
    border: 'none',
    color: '#FFFFFF',
    cursor: 'pointer',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    boxShadow: '0 8px 24px rgba(127, 183, 126, 0.4)',
    position: 'relative',
  },
  pulseDot: {
    width: '10px',
    height: '10px',
    borderRadius: '50%',
    backgroundColor: '#E74C3C',
    position: 'absolute',
    top: '2px',
    right: '2px',
    border: '2px solid #FFFFFF',
  },
  chatWindow: {
    position: 'absolute',
    bottom: '72px',
    right: '0',
    width: '350px',
    height: '500px',
    backgroundColor: '#FFFFFF',
    border: '1px solid #EADBCE',
    borderRadius: '24px',
    boxShadow: '0 12px 36px rgba(45, 36, 30, 0.15)',
    display: 'flex',
    flexDirection: 'column',
    overflow: 'hidden',
  },
  header: {
    backgroundColor: '#F8F5F1',
    borderBottom: '1px solid #EADBCE',
    padding: '16px',
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  botProfile: {
    display: 'flex',
    alignItems: 'center',
    gap: '10px',
  },
  botIcon: {
    width: '28px',
    height: '28px',
    borderRadius: '50%',
    backgroundColor: 'rgba(127, 183, 126, 0.15)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    border: '1px solid #7FB77E',
  },
  botName: {
    fontSize: '0.9rem',
    fontWeight: '700',
    color: '#2D241E',
    margin: 0,
  },
  botStatus: {
    fontSize: '0.7rem',
    color: '#7FB77E',
    fontWeight: '600',
  },
  closeBtn: {
    background: 'none',
    border: 'none',
    color: '#A39387',
    cursor: 'pointer',
  },
  chatHistory: {
    flex: 1,
    padding: '16px',
    overflowY: 'auto',
    display: 'flex',
    flexDirection: 'column',
    gap: '12px',
    backgroundColor: '#FCFBF9',
  },
  messageRow: {
    display: 'flex',
    alignItems: 'flex-end',
    gap: '8px',
    maxWidth: '85%',
  },
  msgAvatarBot: {
    width: '22px',
    height: '22px',
    borderRadius: '50%',
    backgroundColor: '#7FB77E',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    flexShrink: 0,
  },
  msgAvatarUser: {
    width: '22px',
    height: '22px',
    borderRadius: '50%',
    backgroundColor: '#8B6B4A',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    flexShrink: 0,
  },
  messageBubble: {
    padding: '10px 14px',
    fontSize: '0.85rem',
    lineHeight: '1.4',
    boxShadow: '0 2px 6px rgba(0, 0, 0, 0.02)',
  },
  typingIndicator: {
    display: 'flex',
    alignItems: 'center',
    gap: '4px',
    padding: '10px 14px',
    backgroundColor: '#FFFFFF',
    border: '1px solid #EADBCE',
    borderRadius: '16px 16px 16px 4px',
    width: '50px',
    justifyContent: 'center',
    span: {
      width: '6px',
      height: '6px',
      borderRadius: '50%',
      backgroundColor: '#A39387',
      animation: 'blink 1.4s infinite both',
    }
  },
  quickDoubtsBox: {
    padding: '12px 16px',
    borderTop: '1px solid #F8F5F1',
    backgroundColor: '#FFFFFF',
  },
  quickTitle: {
    fontSize: '0.72rem',
    fontWeight: '700',
    color: '#A39387',
    textTransform: 'uppercase',
    letterSpacing: '0.5px',
    display: 'block',
    marginBottom: '8px',
  },
  quickGrid: {
    display: 'flex',
    flexWrap: 'wrap',
    gap: '8px',
  },
  quickBtn: {
    backgroundColor: '#F8F5F1',
    border: '1px solid #EADBCE',
    borderRadius: '8px',
    padding: '6px 10px',
    fontSize: '0.75rem',
    color: '#8B6B4A',
    cursor: 'pointer',
    fontWeight: '600',
    transition: 'all 0.2s ease',
    ':hover': {
      backgroundColor: '#EADBCE',
      color: '#2D241E',
    }
  },
  inputForm: {
    borderTop: '1px solid #EADBCE',
    padding: '12px 16px',
    display: 'flex',
    gap: '8px',
    backgroundColor: '#FFFFFF',
  },
  chatInput: {
    flex: 1,
    border: '1px solid #EADBCE',
    borderRadius: '12px',
    padding: '8px 12px',
    fontSize: '0.85rem',
    outline: 'none',
  },
  sendBtn: {
    width: '36px',
    height: '36px',
    borderRadius: '10px',
    backgroundColor: '#7FB77E',
    border: 'none',
    color: '#FFFFFF',
    cursor: 'pointer',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    transition: 'all 0.2s ease',
    ':disabled': {
      backgroundColor: '#A39387',
      cursor: 'not-allowed',
    }
  },
};
