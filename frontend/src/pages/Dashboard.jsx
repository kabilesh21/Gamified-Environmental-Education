import React, { useState, useEffect, useContext } from 'react';
import { motion } from 'framer-motion';
import axios from 'axios';
import { AuthContext } from '../context/AuthContext';
import { 
  Flame, Leaf, Trophy, Globe, Play, FileText, ArrowRight, Award, HelpCircle, Menu, Coins, ShoppingBag, Gift, Calendar, CheckSquare, Hourglass, ChevronRight
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';

// Simple medal illustration helper component
function MedalSvg({ color, name, label }) {
  return (
    <div style={styles.badgeItem}>
      <div style={styles.medalIcon}>
        <svg width="50" height="50" viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg">
          {/* Ribbon */}
          <path d="M22 12 L32 32 L42 12 Z" fill="#d32f2f" />
          <path d="M27 12 L32 24 L37 12 Z" fill="#ffffff" />
          {/* Medal Circle */}
          <circle cx="32" cy="36" r="18" fill={color} stroke="#ffffff" strokeWidth="2" />
          <circle cx="32" cy="36" r="14" fill="none" stroke="#ffffff" strokeWidth="1" strokeDasharray="3 3" />
          {/* Leaf in Medal */}
          <path d="M32 26 C35 30, 35 38, 32 42 C29 38, 29 30, 32 26 Z" fill="#ffffff" opacity="0.9" />
          <path d="M29 36 H35" stroke="#ffffff" strokeWidth="1" />
        </svg>
      </div>
      <span style={styles.badgeName}>{name}</span>
      <span style={styles.badgeLabel}>{label}</span>
    </div>
  );
}

// Activity list item helper
function ActivityItem({ icon, iconBg, title, points, pointsColor }) {
  return (
    <div style={styles.activityItem}>
      <div style={{ ...styles.activityIconWrapper, backgroundColor: iconBg }}>
        {icon}
      </div>
      <div style={styles.activityText}>
        <span style={styles.activityTitle}>{title}</span>
        <span style={{ ...styles.activityPoints, color: pointsColor }}>{points}</span>
      </div>
    </div>
  );
}

// Quick action card helper
function QuickActionCard({ icon, iconBg, title, desc, onClick }) {
  return (
    <motion.div 
      style={styles.quickActionCard} 
      onClick={onClick}
      whileHover={{ y: -4, scale: 1.02, borderColor: '#2e7d32', boxShadow: '0 8px 30px rgba(0, 0, 0, 0.06)' }}
    >
      <div style={{ ...styles.quickActionIconWrapper, backgroundColor: iconBg }}>
        {icon}
      </div>
      <div style={styles.quickActionContent}>
        <span style={styles.quickActionTitle}>{title}</span>
        <span style={styles.quickActionDesc}>{desc}</span>
      </div>
      <div style={styles.quickActionArrow}>
        <ArrowRight size={16} color="#2e7d32" />
      </div>
    </motion.div>
  );
}

// Custom activity icons
const RecyclingIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#2e7d32" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
    <path d="M21.5 2v6h-6M21.34 15.57a10 10 0 1 1-.57-8.38l5.67-5.67" />
  </svg>
);

const WaterIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#0284c7" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" style={{ fill: '#e0f2fe' }}>
    <path d="M12 22a7 7 0 0 0 7-7c0-4.3-7-13-7-13S5 10.7 5 15a7 7 0 0 0 7 7z" />
  </svg>
);

const TreeIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#15803d" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" style={{ fill: '#e6f4ea' }}>
    <path d="M12 22v-5M17 17H7l5-7 5 7zM15 10H9l3-5 3 5z" />
  </svg>
);

export default function Dashboard({ sidebarOpen, setSidebarOpen }) {
  const { user, refreshUserData } = useContext(AuthContext);
  const navigate = useNavigate();

  const [treeInfo, setTreeInfo] = useState(null);
  const [activeEvents, setActiveEvents] = useState([]);
  const [missions, setMissions] = useState([]);
  const [gardenPercent, setGardenPercent] = useState(0);

  const [manualRotation, setManualRotation] = useState(0);
  const [isRotatingAuto, setIsRotatingAuto] = useState(true);
  const [currentTrivia, setCurrentTrivia] = useState(null);
  const [triviaFeedback, setTriviaFeedback] = useState("");
  const [triviaSuccess, setTriviaSuccess] = useState(false);
  const [currentTime, setCurrentTime] = useState(Date.now());

  // Force re-renders for live cooldown timer
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(Date.now());
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const triviaQuestions = [
    {
      q: "Which gas do trees absorb to clean our air?",
      options: ["Carbon Dioxide", "Oxygen", "Nitrogen", "Methane"],
      correctIdx: 0
    },
    {
      q: "Which forest type is known as the 'lungs of the Earth'?",
      options: ["Coniferous Forest", "Taiga", "Amazon Rainforest", "Deciduous Forest"],
      correctIdx: 2
    },
    {
      q: "What percentage of Earth's oxygen is produced by oceans and trees?",
      options: ["20%", "50%", "80%", "100%"],
      correctIdx: 2
    },
    {
      q: "Which of these is the most effective tree for city carbon absorption?",
      options: ["Oak Tree", "Pine Tree", "Palm Tree", "Willow Tree"],
      correctIdx: 0
    }
  ];

  const getDailyQuestionIndex = () => {
    const now = new Date();
    const daySeed = now.getDate() + now.getMonth() * 31 + now.getFullYear() * 372;
    return daySeed % triviaQuestions.length;
  };

  const getSunlightCooldownString = () => {
    const lastSunlight = localStorage.getItem('ecoverse_last_sunlight_time');
    if (!lastSunlight) return null;
    const msPassed = currentTime - new Date(lastSunlight).getTime();
    const msRemaining = 24 * 60 * 60 * 1000 - msPassed;
    if (msRemaining <= 0) return null;

    const hrs = Math.floor(msRemaining / (1000 * 60 * 60));
    const mins = Math.floor((msRemaining % (1000 * 60 * 60)) / (1000 * 60));
    const secs = Math.floor((msRemaining % (1000 * 60)) / 1000);

    return `${hrs}h ${mins}m ${secs}s`;
  };

  const startTrivia = () => {
    const qIdx = getDailyQuestionIndex();
    const dailyQ = triviaQuestions[qIdx];
    setCurrentTrivia(dailyQ);
    setTriviaFeedback("");
    setTriviaSuccess(false);
  };

  const handleTriviaAnswer = async (optIdx) => {
    if (!currentTrivia) return;
    if (optIdx === currentTrivia.correctIdx) {
      setTriviaFeedback("Correct! You unlocked a Sunlight Burst! ☀️ (+50 XP)");
      setTriviaSuccess(true);
      localStorage.setItem('ecoverse_last_sunlight_time', new Date().toISOString());
      try {
        const res = await axios.post('/api/tree/quiz');
        setTreeInfo(res.data);
        await refreshUserData();
      } catch (err) {
        console.error("Failed to save tree trivia progress", err);
      }
    } else {
      setTriviaFeedback("Oops! That's not correct. Try again!");
      setTriviaSuccess(false);
    }
  };

  const [stats, setStats] = useState({
    level: 12,
    xp: 1200,
    nextLevelXpThreshold: 2000,
    currentStreak: 7,
    completedQuests: 15,
    treesSaved: 0,
    waterSavedLiters: 0,
    co2ReducedKg: 0,
    completedCoursesCount: 0,
    unlockedBadgesCount: 0
  });

  const [isTreeChallengeCompleted, setIsTreeChallengeCompleted] = useState(false);

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        const [_, statsRes, treeRes, eventsRes, missionsRes, gardenRes] = await Promise.all([
          refreshUserData().catch(err => console.warn("Failed to refresh user profile:", err)),
          axios.get('/api/dashboard/stats').catch(err => console.error("Failed to load stats:", err)),
          axios.get('/api/tree').catch(err => console.error("Failed to load tree:", err)),
          axios.get('/api/events/active').catch(err => console.error("Failed to load events:", err)),
          axios.get('/api/missions').catch(err => console.error("Failed to load missions:", err)),
          axios.get('/api/garden').catch(err => console.error("Failed to load garden:", err)),
        ]);
        
        if (statsRes && statsRes.data) {
          setStats(prev => ({
            ...prev,
            ...statsRes.data,
            completedQuests: statsRes.data.completedQuests || statsRes.data.completedCoursesCount || 15
          }));
        }
        if (treeRes && treeRes.data) {
          setTreeInfo(treeRes.data);
        }
        if (eventsRes && eventsRes.data) {
          setActiveEvents(eventsRes.data);
        }
        if (missionsRes && missionsRes.data) {
          setMissions(missionsRes.data);
        }
        if (gardenRes && gardenRes.data) {
          const unlocked = gardenRes.data.filter(i => i.unlocked).length;
          const total = gardenRes.data.length || 1;
          setGardenPercent(Math.round((unlocked * 100) / total));
        }
      } catch (err) {
        console.error("Dashboard general loading error", err);
      }
    };
    fetchDashboardData();

    // Check tree plantation challenge completion state from localStorage
    const saved = localStorage.getItem('ecoverse_active_challenges');
    if (saved) {
      try {
        const challenges = JSON.parse(saved);
        const treeChallenge = challenges.find(c => c.id === 3);
        if (treeChallenge && treeChallenge.progress >= treeChallenge.target) {
          setIsTreeChallengeCompleted(true);
        }
      } catch (e) {
        console.error("Error reading challenge state in dashboard", e);
      }
    }
  }, []);

  const xp = user?.xp || stats.xp;
  const level = user?.level || stats.level;
  const streak = user?.streak || stats.currentStreak;
  const fullName = user?.fullName || 'Arjun';

  const xpProgressPercent = Math.min((xp * 100) / (stats.nextLevelXpThreshold || 2000), 100);

  const getLevelDescription = (lvl) => {
    if (lvl < 5) return "Eco Beginner";
    if (lvl < 10) return "Eco Helper";
    if (lvl < 15) return "Green Learner";
    return "Eco Warrior";
  };

  return (
    <div style={styles.dashboardPage}>
      


      {/* Title Header */}
      <div style={styles.headerContainer}>
        <Leaf size={28} color="#2e7d32" fill="#2e7d32" style={{ transform: 'rotate(-45deg)' }} />
        <h1 style={styles.mainTitle}>Gamified Environmental Education</h1>
        <Leaf size={28} color="#2e7d32" fill="#2e7d32" style={{ transform: 'rotate(45deg)' }} />
      </div>

      {/* Row 1: Top Cards */}
      <div style={styles.topCardsGrid}>
        {/* Level Card */}
        <motion.div 
          style={styles.statCard}
          whileHover={{ scale: 1.02, borderColor: '#2e7d32' }}
        >
          <div style={styles.statIconWrapper}>
            <Leaf size={22} color="#2e7d32" fill="#2e7d32" />
          </div>
          <div style={styles.statContent}>
            <span style={styles.statLabel}>Level</span>
            <span style={styles.statValue}>{level}</span>
            <span style={styles.statSubtext}>{getLevelDescription(level)}</span>
          </div>
        </motion.div>

        {/* Points Card */}
        <motion.div 
          style={styles.statCard}
          whileHover={{ scale: 1.02, borderColor: '#2e7d32' }}
        >
          <div style={{ ...styles.statIconWrapper, backgroundColor: '#fef3c7' }}>
            <Trophy size={22} color="#d97706" fill="#d97706" />
          </div>
          <div style={styles.statContent}>
            <span style={styles.statLabel}>Points</span>
            <span style={styles.statValue}>{xp.toLocaleString()}</span>
            <span style={styles.statSubtext}>Keep it up!</span>
          </div>
        </motion.div>

        {/* Streak Card */}
        <motion.div 
          style={styles.statCard}
          whileHover={{ scale: 1.02, borderColor: '#2e7d32' }}
        >
          <div style={{ ...styles.statIconWrapper, backgroundColor: '#fee2e2' }}>
            <Flame size={22} color="#dc2626" fill="#dc2626" />
          </div>
          <div style={styles.statContent}>
            <span style={styles.statLabel}>Streak</span>
            <span style={styles.statValue}>{streak}</span>
            <span style={styles.statSubtext}>days</span>
          </div>
        </motion.div>

        {/* Quests Card */}
        <motion.div 
          style={styles.statCard}
          whileHover={{ scale: 1.02, borderColor: '#2e7d32' }}
        >
          <div style={{ ...styles.statIconWrapper, backgroundColor: '#dbeafe' }}>
            <Globe size={22} color="#2563eb" fill="#2563eb" />
          </div>
          <div style={styles.statContent}>
            <span style={styles.statLabel}>Quests</span>
            <span style={styles.statValue}>{stats.completedQuests}</span>
            <span style={styles.statSubtext}>Completed</span>
          </div>
        </motion.div>

        {/* User Card (Centered Username Profile) */}
        <motion.div 
          style={styles.statCard}
          whileHover={{ scale: 1.02, borderColor: '#2e7d32' }}
        >
          <div style={{ ...styles.statIconWrapper, backgroundColor: 'transparent', padding: 0 }}>
            <img src="/arjun_avatar.png" alt="User Avatar" style={{ width: '44px', height: '44px', borderRadius: '50%', border: '2px solid #2e7d32', objectFit: 'cover' }} />
          </div>
          <div style={styles.statContent}>
            <span style={styles.statLabel}>User Profile</span>
            <span style={{ ...styles.statValue, fontSize: fullName.length > 10 ? '1.1rem' : '1.3rem', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{fullName}</span>
            <span style={styles.statSubtext}>{getLevelDescription(level)} ({xp} XP)</span>
          </div>
        </motion.div>

        {/* Coins Card */}
        <motion.div 
          style={styles.statCard}
          whileHover={{ scale: 1.02, borderColor: '#2e7d32' }}
        >
          <div style={{ ...styles.statIconWrapper, backgroundColor: '#fef9c3' }}>
            <Coins size={22} color="#ca8a04" fill="#ca8a04" />
          </div>
          <div style={styles.statContent}>
            <span style={styles.statLabel}>Eco Coins</span>
            <span style={styles.statValue}>{user?.coins ?? 0}</span>
            <span style={styles.statSubtext}>Spend in Shop!</span>
          </div>
        </motion.div>
      </div>

      {/* Row 2: Earth Progress & Daily Challenge */}
      <div style={styles.middleRowGrid}>
        {/* Save the Earth Progress */}
        <div style={styles.saveEarthCard}>
          <div style={styles.saveEarthLeft}>
            <h2 style={styles.cardTitle}>Save the Earth Progress</h2>
            <div style={styles.saveEarthProgressInfo}>
              <span style={styles.saveEarthLevel}>Level {level}</span>
            </div>
            <div style={styles.saveEarthProgressWrapper}>
              <div style={styles.saveEarthProgressBarOuter}>
                <div style={{ ...styles.saveEarthProgressBarInner, width: '75%' }}></div>
              </div>
              <span style={styles.saveEarthPercent}>75%</span>
            </div>
          </div>
          <div style={styles.saveEarthRight}>
            <img src="/save_earth_globe.png" alt="Earth Globe" style={styles.globeImage} />
          </div>
        </div>

        {/* Daily Challenge (Start Now redirects to /challenges, syncs state) */}
        <div style={styles.dailyChallengeCard}>
          <h2 style={styles.cardTitle}>Daily Challenge</h2>
          <div style={styles.challengeInfo}>
            <div style={styles.challengeIconWrapper}>
              <Leaf size={24} color="#ffffff" fill="#ffffff" />
            </div>
            <div style={styles.challengeText}>
              <span style={styles.challengeName}>Plant a Tree</span>
              <span style={styles.challengeDesc}>Plant a tree in your nearby area</span>
              <div style={styles.challengeReward}>
                <span style={styles.rewardLabel}>Reward:</span>
                <span style={styles.rewardItem}>⭐ 100</span>
                <span style={styles.rewardItem}>🪙 50</span>
              </div>
            </div>
          </div>
          <button 
            style={{
              ...styles.startBtn,
              backgroundColor: isTreeChallengeCompleted ? '#a0aec0' : '#2e7d32',
              cursor: isTreeChallengeCompleted ? 'not-allowed' : 'pointer'
            }} 
            onClick={() => {
              if (!isTreeChallengeCompleted) {
                navigate('/challenges');
              }
            }}
            disabled={isTreeChallengeCompleted}
          >
            {isTreeChallengeCompleted ? 'Completed! 🎉' : 'Start Now'}
          </button>
        </div>
      </div>

      {/* Eco Reserve Section: Virtual Tree & Garden Preview & Shop Shortcut */}
      <div style={styles.reserveSectionGrid}>
        {/* Virtual Tree Growth Card */}
        <div style={{ ...styles.reserveCard, minHeight: '340px' }}>
          <h2 style={styles.cardTitle}>🌳 Virtual Tree Growth</h2>
          <div style={styles.treeDisplayArea}>
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
              <motion.div 
                style={{
                  ...styles.treeEmojiWrapper,
                  perspective: '1000px',
                  transformStyle: 'preserve-3d',
                }}
                animate={isRotatingAuto ? { 
                  rotateY: [manualRotation, manualRotation + 360], 
                  y: [0, -6, 0] 
                } : { 
                  rotateY: manualRotation, 
                  y: [0, -6, 0] 
                }}
                transition={{ 
                  rotateY: { repeat: isRotatingAuto ? Infinity : 0, duration: 15, ease: "linear" },
                  y: { repeat: Infinity, duration: 3, ease: "easeInOut" }
                }}
              >
                <span style={{ fontSize: '3.8rem', display: 'inline-block', transform: 'translateZ(20px)' }}>
                  {treeInfo?.imageUrl || '🌱'}
                </span>
              </motion.div>
              
              {/* Rotation Controls */}
              <div style={{ display: 'flex', gap: '8px', marginTop: '10px' }}>
                <button 
                  onClick={() => {
                    setIsRotatingAuto(false);
                    setManualRotation(prev => prev - 30);
                  }} 
                  style={styles.rotateBtn}
                  title="Rotate Left"
                >
                  ↺
                </button>
                <button 
                  onClick={() => {
                    setIsRotatingAuto(true);
                  }} 
                  style={{
                    ...styles.rotateBtn,
                    backgroundColor: isRotatingAuto ? '#e6f4ea' : '#FAF8F5',
                    color: isRotatingAuto ? '#2e7d32' : '#2D241E',
                    fontSize: '0.7rem',
                    padding: '4px 8px'
                  }}
                  title="Auto Spin"
                >
                  Auto
                </button>
                <button 
                  onClick={() => {
                    setIsRotatingAuto(false);
                    setManualRotation(prev => prev + 30);
                  }} 
                  style={styles.rotateBtn}
                  title="Rotate Right"
                >
                  ↻
                </button>
              </div>
            </div>

            <div style={styles.treeDetails}>
              <span style={styles.treeStageTitle}>Stage: {treeInfo?.stageName || 'Seed'}</span>
              <span style={styles.treeStageSub}>Level {treeInfo?.level || 1} Growth</span>
              <div style={styles.treeProgressOuter}>
                <div style={{ ...styles.treeProgressInner, width: `${treeInfo?.progressPercent || 0}%` }} />
              </div>
              <span style={styles.treeXpLabel}>
                {treeInfo?.currentXp || xp} / {treeInfo?.nextStageXp || 200} XP to Next Stage
              </span>
            </div>
          </div>

          <div style={styles.gameDivider} />

          {/* Interactive nurture and trivia games panel */}
          {currentTrivia ? (
            <div style={styles.triviaContainer}>
              <span style={styles.triviaTitle}>☀️ Sunlight Trivia</span>
              <p style={styles.triviaQ}>{currentTrivia.q}</p>
              <div style={styles.triviaOptionsList}>
                {currentTrivia.options.map((opt, idx) => (
                  <button
                    key={idx}
                    onClick={() => handleTriviaAnswer(idx)}
                    style={{
                      ...styles.triviaOptBtn,
                      borderColor: triviaFeedback && idx === currentTrivia.correctIdx ? '#7FB77E' : '#EADBCE',
                      backgroundColor: triviaFeedback && idx === currentTrivia.correctIdx ? '#e6f4ea' : '#FFFFFF'
                    }}
                    disabled={triviaSuccess}
                  >
                    {opt}
                  </button>
                ))}
              </div>
              {triviaFeedback && (
                <p style={{ 
                  ...styles.triviaFeedback, 
                  color: triviaSuccess ? '#2e7d32' : '#dc2626' 
                }}>
                  {triviaFeedback}
                </p>
              )}
              <div style={{ display: 'flex', gap: '8px', marginTop: '12px' }}>
                {!triviaSuccess && (
                  <button onClick={startTrivia} style={styles.triviaActionBtn}>
                    New Question
                  </button>
                )}
                <button onClick={() => setCurrentTrivia(null)} style={{ ...styles.triviaActionBtn, backgroundColor: '#6E5C50' }}>
                  Close Game
                </button>
              </div>
            </div>
          ) : (
            <div style={styles.gameActionsArea}>
              <span style={styles.gameSectionLabel}>Nurture & Play Actions:</span>
              <div style={styles.gameButtonsRow}>
                <button 
                  onClick={async () => {
                    if ((user?.coins ?? 0) < 5) {
                      alert("Need at least 5 Eco Coins to water the tree!");
                      return;
                    }
                    try {
                      const res = await axios.post('/api/tree/water');
                      setTreeInfo(res.data);
                      await refreshUserData();
                    } catch (err) {
                      alert(err.response?.data?.message || "Failed to water the tree.");
                    }
                  }}
                  style={styles.gameBtn}
                >
                  💧 Water (-5 🪙)
                </button>

                <button 
                  onClick={async () => {
                    if ((user?.coins ?? 0) < 10) {
                      alert("Need at least 10 Eco Coins to fertilize the tree!");
                      return;
                    }
                    try {
                      const res = await axios.post('/api/tree/fertilize');
                      setTreeInfo(res.data);
                      await refreshUserData();
                    } catch (err) {
                      alert(err.response?.data?.message || "Failed to fertilize the tree.");
                    }
                  }}
                  style={styles.gameBtn}
                >
                  🌿 Fertilize (-10 🪙)
                </button>

                 {getSunlightCooldownString() ? (
                  <button 
                    style={{ 
                      ...styles.gameBtn, 
                      backgroundColor: '#cbd5e0', 
                      color: '#4a5568', 
                      borderColor: '#a0aec0',
                      cursor: 'not-allowed'
                    }}
                    disabled
                  >
                    ☀️ Sunlight: {getSunlightCooldownString()}
                  </button>
                ) : (
                  <button 
                    onClick={startTrivia}
                    style={{ ...styles.gameBtn, backgroundColor: '#fef3c7', color: '#b45309', border: '1px solid #fcd34d' }}
                  >
                    ☀️ Sunlight Trivia (+50 XP)
                  </button>
                )}
              </div>
            </div>
          )}
        </div>

        {/* Eco Garden Preview Card */}
        <div style={styles.reserveCard}>
          <h2 style={styles.cardTitle}>🪴 Eco Garden</h2>
          <div style={styles.gardenPreviewArea}>
            <div style={styles.miniGardenLandscape}>
              {/* Decorative mini pond & path */}
              <div style={styles.miniPond} />
              <span style={{ position: 'absolute', top: '10px', left: '15px', fontSize: '1rem' }}>🌻</span>
              <span style={{ position: 'absolute', top: '15px', right: '25px', fontSize: '1rem' }}>🦋</span>
              <span style={{ position: 'absolute', bottom: '10px', right: '35px', fontSize: '1.2rem' }}>🌳</span>
              <span style={{ position: 'absolute', bottom: '15px', left: '20px', fontSize: '1rem' }}>🪑</span>
            </div>
            <div style={styles.gardenPreviewDetails}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span style={styles.gardenCompletionLabel}>Completion Rate</span>
                <span style={styles.gardenCompletionVal}>{gardenPercent}%</span>
              </div>
              <button onClick={() => navigate('/garden')} style={styles.reserveCardBtn}>
                <span>Visit Garden Reserve</span>
                <ArrowRight size={14} />
              </button>
            </div>
          </div>
        </div>

        {/* Eco Reward Shop Shortcut Card */}
        <div style={styles.reserveCard}>
          <h2 style={styles.cardTitle}>🎁 Reward Shop</h2>
          <div style={styles.shopShortcutArea}>
            <div style={styles.shopIconCircle}>
              <ShoppingBag size={24} color="#1b4d2c" />
            </div>
            <p style={styles.shopShortcutDesc}>
              Spend Eco Coins to unlock trees, flowers, and animals for your garden!
            </p>
            <button onClick={() => navigate('/shop')} style={styles.shopBtnPrimary}>
              <span>Open Reward Shop</span>
              <ArrowRight size={14} />
            </button>
          </div>
        </div>
      </div>

      {/* Seasonal Events & Weekly Missions Section */}
      <div style={styles.eventsMissionsGrid}>
        {/* Active Seasonal Events Column */}
        <div style={styles.eventsColumn}>
          <h2 style={styles.cardTitle}>🏅 Active Seasonal Events</h2>
          {activeEvents.length > 0 ? (
            <div style={styles.eventsList}>
              {activeEvents.map(event => (
                <div key={event.id} style={styles.eventCard}>
                  <img src={event.bannerUrl} alt={event.title} style={styles.eventBanner} />
                  <div style={styles.eventInfo}>
                    <div style={styles.eventHeaderRow}>
                      <h3 style={styles.eventTitle}>{event.title}</h3>
                      <span style={styles.eventBadgeReward}>🎖️ {event.badgeReward}</span>
                    </div>
                    <p style={styles.eventDesc}>{event.description}</p>
                    <div style={styles.eventMetaRow}>
                      <div style={styles.eventRewards}>
                        <span style={styles.eventRewardItem}>⭐ +{event.rewardXp} XP</span>
                        <span style={styles.eventRewardItem}>🪙 +{event.rewardCoins} Coins</span>
                      </div>
                      <span style={styles.eventDate}>Ends: {event.endDate}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div style={styles.emptyState}>
              <Calendar size={36} color="#A39387" />
              <p>No active seasonal events at the moment. Check back soon!</p>
            </div>
          )}
        </div>

        {/* Weekly Missions Column */}
        <div style={styles.missionsColumn}>
          <h2 style={styles.cardTitle}>🎯 Weekly Missions</h2>
          <div style={styles.missionsList}>
            {missions.map(m => {
              const pct = Math.round((m.progress * 100) / m.target);
              return (
                <div key={m.id} style={styles.missionCard}>
                  <div style={styles.missionHeader}>
                    <span style={{
                      ...styles.missionCheckbox,
                      backgroundColor: m.completed ? '#7FB77E' : 'transparent',
                      borderColor: m.completed ? '#7FB77E' : '#A39387'
                    }}>
                      {m.completed && '✓'}
                    </span>
                    <span style={{
                      ...styles.missionTitle,
                      textDecoration: m.completed ? 'line-through' : 'none',
                      color: m.completed ? '#A39387' : '#2D241E'
                    }}>
                      {m.title}
                    </span>
                  </div>
                  <div style={styles.missionProgressRow}>
                    <div style={styles.missionProgressOuter}>
                      <div style={{ ...styles.missionProgressInner, width: `${pct}%` }} />
                    </div>
                    <span style={styles.missionProgressLabel}>{m.progress} / {m.target}</span>
                  </div>
                  <div style={styles.missionRewards}>
                    <span style={styles.missionRewardVal}>⭐ +{m.rewardXp} XP</span>
                    <span style={styles.missionRewardVal}>🪙 +{m.rewardCoins} Coins</span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Row 3: Continue Learning, Top Badges, Recent Activities */}
      <div style={styles.bottomRowGrid}>
        {/* Continue Learning */}
        <div style={styles.learningCard}>
          <h2 style={styles.cardTitle}>Continue Learning</h2>
          <div style={styles.learningContent}>
            <img src="/recycling_bins.png" alt="Recycling Bins" style={styles.recyclingImage} />
            <span style={styles.learningName}>Waste Management</span>
            <span style={styles.learningDesc}>Learn how to manage waste</span>
            <div style={styles.learningProgressWrapper}>
              <div style={styles.learningProgressBarOuter}>
                <div style={{ ...styles.learningProgressBarInner, width: '60%' }}></div>
              </div>
              <span style={styles.learningPercent}>60%</span>
            </div>
          </div>
        </div>

        {/* Top Badges */}
        <div style={styles.badgesCard}>
          <h2 style={styles.cardTitle}>Top Badges</h2>
          <div style={styles.badgesWrapper}>
            <MedalSvg color="#b07d62" name="Bronze" label="Eco Beginner" />
            <MedalSvg color="#b8c0c8" name="Silver" label="Eco Helper" />
            <MedalSvg color="#fcc82c" name="Gold" label="Eco Champion" />
          </div>
        </div>

        {/* Recent Activities */}
        <div style={styles.activitiesCard}>
          <div style={styles.activitiesHeader}>
            <h2 style={styles.cardTitle}>Recent Activities</h2>
            <button style={styles.viewAllLink} onClick={() => navigate('/certificates')}>View All</button>
          </div>
          <div style={styles.activitiesList}>
            <ActivityItem 
              icon={<RecyclingIcon />} 
              iconBg="#e6f4ea" 
              title="Completed: Recycling Basics" 
              points="+100 Points" 
              pointsColor="#2e7d32" 
            />
            <ActivityItem 
              icon={<Award size={20} color="#718096" fill="#718096" />} 
              iconBg="#f1f5f9" 
              title="Earned: Silver Badge" 
              points="+200 Points" 
              pointsColor="#2e7d32" 
            />
            <ActivityItem 
              icon={<WaterIcon />} 
              iconBg="#e0f2fe" 
              title="Completed: Water Quiz" 
              points="+50 Points" 
              pointsColor="#2e7d32" 
            />
            <ActivityItem 
              icon={<TreeIcon />} 
              iconBg="#e6f4ea" 
              title="Joined: Tree Plantation Drive" 
              points="+150 Points" 
              pointsColor="#2e7d32" 
            />
          </div>
        </div>
      </div>

      {/* Row 4: Quick Actions */}
      <div style={styles.quickActionsContainer}>
        <h2 style={styles.quickActionsTitle}>Quick Actions</h2>
        <div style={styles.quickActionsGrid}>
          <QuickActionCard 
            icon={<HelpCircle size={22} color="#ffffff" />} 
            iconBg="#3b82f6" 
            title="Take Quiz" 
            desc="Test your knowledge" 
            onClick={() => navigate('/courses')}
          />
          <QuickActionCard 
            icon={<Trophy size={22} color="#ffffff" />} 
            iconBg="#10b981" 
            title="Join Challenge" 
            desc="Compete & win" 
            onClick={() => navigate('/challenges')}
          />
          <QuickActionCard 
            icon={<FileText size={22} color="#ffffff" />} 
            iconBg="#b45309" 
            title="Read Articles" 
            desc="Learn more" 
            onClick={() => navigate('/courses')}
          />
          <QuickActionCard 
            icon={<Play size={22} color="#ffffff" fill="#ffffff" />} 
            iconBg="#eab308" 
            title="Watch Videos" 
            desc="Educational videos" 
            onClick={() => window.open('https://youtu.be/XGIQPyQe4T4?si=HT5Y3VBZ0sp78U37', '_blank')}
          />
        </div>
      </div>
    </div>
  );
}

const styles = {
  dashboardPage: {
    backgroundColor: '#FAFBFB',
    minHeight: '100vh',
    display: 'flex',
    flexDirection: 'column',
    gap: '24px',
  },
  floatingMenuBtn: {
    position: 'fixed',
    top: '20px',
    left: '20px',
    zIndex: 900,
    backgroundColor: '#FFFFFF',
    border: '1px solid rgba(0,0,0,0.06)',
    borderRadius: '8px',
    width: '40px',
    height: '40px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    cursor: 'pointer',
    boxShadow: '0 4px 12px rgba(0,0,0,0.04)',
  },
  headerContainer: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: '12px',
    margin: '10px 0 20px 0',
  },
  mainTitle: {
    fontSize: '2.5rem',
    fontWeight: '800',
    color: '#0F3A20',
    textAlign: 'center',
    letterSpacing: '-0.5px',
  },
  topCardsGrid: {
    display: 'grid',
    gridTemplateColumns: '1fr 1fr 1fr',
    gap: '20px',
    marginBottom: '28px',
  },
  statCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: '16px',
    padding: '20px',
    boxShadow: '0 4px 20px rgba(0, 0, 0, 0.02)',
    border: '2px solid #7FB77E',
    display: 'flex',
    alignItems: 'center',
    gap: '16px',
    transition: 'all 0.2s ease',
    cursor: 'pointer',
  },
  statIconWrapper: {
    width: '48px',
    height: '48px',
    borderRadius: '12px',
    backgroundColor: '#e6f4ea',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    flexShrink: 0,
  },
  statContent: {
    display: 'flex',
    flexDirection: 'column',
  },
  statLabel: {
    fontSize: '0.85rem',
    fontWeight: '500',
    color: '#718096',
  },
  statValue: {
    fontSize: '1.4rem',
    fontWeight: '800',
    color: '#1a202c',
    lineHeight: '1.2',
    margin: '2px 0',
  },
  statSubtext: {
    fontSize: '0.75rem',
    fontWeight: '500',
    color: '#718096',
  },
  userCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: '16px',
    padding: '20px',
    boxShadow: '0 4px 20px rgba(0, 0, 0, 0.02)',
    border: '2px solid #7FB77E',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    textAlign: 'center',
    gap: '12px',
    transition: 'all 0.2s ease',
    cursor: 'pointer',
  },
  userAvatar: {
    width: '56px',
    height: '56px',
    borderRadius: '50%',
    objectFit: 'cover',
    border: '2px solid #2e7d32',
  },
  userInfo: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    width: '100%',
  },
  userName: {
    fontSize: '1.1rem',
    fontWeight: '700',
    color: '#1a202c',
  },
  userTitle: {
    fontSize: '0.8rem',
    fontWeight: '500',
    color: '#718096',
    marginBottom: '6px',
  },
  userProgressContainer: {
    height: '6px',
    backgroundColor: '#edf2f7',
    borderRadius: '3px',
    overflow: 'hidden',
    marginBottom: '4px',
  },
  userProgressBar: {
    height: '100%',
    backgroundColor: '#2e7d32',
    borderRadius: '3px',
  },
  userProgressLabel: {
    fontSize: '0.75rem',
    fontWeight: '600',
    color: '#4a5568',
  },
  middleRowGrid: {
    display: 'grid',
    gridTemplateColumns: '2fr 1fr',
    gap: '20px',
  },
  saveEarthCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: '16px',
    padding: '24px',
    boxShadow: '0 4px 20px rgba(0, 0, 0, 0.02)',
    border: '2px solid #7FB77E',
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    overflow: 'hidden',
  },
  saveEarthLeft: {
    display: 'flex',
    flexDirection: 'column',
    flex: 1,
    gap: '16px',
  },
  cardTitle: {
    fontSize: '1.2rem',
    fontWeight: '700',
    color: '#1a202c',
  },
  saveEarthProgressInfo: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  saveEarthLevel: {
    fontSize: '0.9rem',
    fontWeight: '600',
    color: '#4a5568',
  },
  saveEarthProgressWrapper: {
    display: 'flex',
    alignItems: 'center',
    gap: '12px',
  },
  saveEarthProgressBarOuter: {
    flex: 1,
    height: '14px',
    backgroundColor: '#edf2f7',
    borderRadius: '7px',
    overflow: 'hidden',
  },
  saveEarthProgressBarInner: {
    height: '100%',
    backgroundColor: '#2e7d32',
    borderRadius: '7px',
  },
  saveEarthPercent: {
    fontSize: '0.95rem',
    fontWeight: '700',
    color: '#2e7d32',
  },
  saveEarthRight: {
    flexShrink: 0,
    width: '130px',
    height: '130px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
  globeImage: {
    width: '100%',
    height: '100%',
    objectFit: 'contain',
  },
  dailyChallengeCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: '16px',
    padding: '24px',
    boxShadow: '0 4px 20px rgba(0, 0, 0, 0.02)',
    border: '2px solid #7FB77E',
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'space-between',
    gap: '16px',
  },
  challengeInfo: {
    display: 'flex',
    gap: '16px',
    alignItems: 'center',
  },
  challengeIconWrapper: {
    width: '56px',
    height: '56px',
    borderRadius: '50%',
    backgroundColor: '#2e7d32',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    flexShrink: 0,
  },
  challengeText: {
    display: 'flex',
    flexDirection: 'column',
  },
  challengeName: {
    fontSize: '1.1rem',
    fontWeight: '700',
    color: '#1a202c',
  },
  challengeDesc: {
    fontSize: '0.85rem',
    color: '#718096',
    margin: '2px 0 6px 0',
  },
  challengeReward: {
    display: 'flex',
    alignItems: 'center',
    gap: '10px',
  },
  rewardLabel: {
    fontSize: '0.8rem',
    fontWeight: '600',
    color: '#4a5568',
  },
  rewardItem: {
    fontSize: '0.85rem',
    fontWeight: '700',
    color: '#1a202c',
  },
  startBtn: {
    backgroundColor: '#2e7d32',
    color: '#FFFFFF',
    border: 'none',
    borderRadius: '8px',
    padding: '10px 20px',
    fontWeight: '700',
    fontSize: '0.9rem',
    cursor: 'pointer',
    alignSelf: 'flex-end',
    transition: 'background-color 0.2s ease',
  },
  bottomRowGrid: {
    display: 'grid',
    gridTemplateColumns: '1fr 1fr 1fr',
    gap: '20px',
  },
  learningCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: '16px',
    padding: '24px',
    boxShadow: '0 4px 20px rgba(0, 0, 0, 0.02)',
    border: '2px solid #7FB77E',
    display: 'flex',
    flexDirection: 'column',
    gap: '14px',
  },
  learningContent: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    textAlign: 'center',
    gap: '8px',
  },
  recyclingImage: {
    width: '100%',
    height: '140px',
    objectFit: 'contain',
    borderRadius: '12px',
    marginBottom: '10px',
  },
  learningName: {
    fontSize: '1.1rem',
    fontWeight: '700',
    color: '#1a202c',
  },
  learningDesc: {
    fontSize: '0.85rem',
    color: '#718096',
  },
  learningProgressWrapper: {
    width: '100%',
    display: 'flex',
    alignItems: 'center',
    gap: '10px',
    marginTop: '6px',
  },
  learningProgressBarOuter: {
    flex: 1,
    height: '10px',
    backgroundColor: '#edf2f7',
    borderRadius: '5px',
    overflow: 'hidden',
  },
  learningProgressBarInner: {
    height: '100%',
    backgroundColor: '#2e7d32',
    borderRadius: '5px',
  },
  learningPercent: {
    fontSize: '0.85rem',
    fontWeight: '700',
    color: '#2e7d32',
  },
  badgesCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: '16px',
    padding: '24px',
    boxShadow: '0 4px 20px rgba(0, 0, 0, 0.02)',
    border: '2px solid #7FB77E',
    display: 'flex',
    flexDirection: 'column',
    gap: '16px',
  },
  badgesWrapper: {
    display: 'flex',
    justifyContent: 'space-around',
    alignItems: 'center',
    height: '100%',
    paddingBottom: '20px',
  },
  badgeItem: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    gap: '6px',
  },
  medalIcon: {
    width: '50px',
    height: '50px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
  badgeName: {
    fontSize: '0.9rem',
    fontWeight: '700',
    color: '#1a202c',
  },
  badgeLabel: {
    fontSize: '0.75rem',
    color: '#718096',
  },
  activitiesCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: '16px',
    padding: '24px',
    boxShadow: '0 4px 20px rgba(0, 0, 0, 0.02)',
    border: '2px solid #7FB77E',
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'space-between',
    gap: '16px',
  },
  activitiesHeader: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  viewAllLink: {
    background: 'none',
    border: 'none',
    fontSize: '0.85rem',
    fontWeight: '700',
    color: '#2e7d32',
    cursor: 'pointer',
  },
  activitiesList: {
    display: 'flex',
    flexDirection: 'column',
    gap: '12px',
  },
  activityItem: {
    display: 'flex',
    alignItems: 'center',
    gap: '14px',
    padding: '4px 0',
  },
  activityIconWrapper: {
    width: '40px',
    height: '40px',
    borderRadius: '8px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    flexShrink: 0,
  },
  activityText: {
    display: 'flex',
    flexDirection: 'column',
    flex: 1,
  },
  activityTitle: {
    fontSize: '0.85rem',
    fontWeight: '600',
    color: '#2d3748',
  },
  activityPoints: {
    fontSize: '0.8rem',
    fontWeight: '700',
    marginTop: '2px',
  },
  quickActionsContainer: {
    display: 'flex',
    flexDirection: 'column',
    gap: '16px',
    marginTop: '10px',
  },
  quickActionsTitle: {
    fontSize: '1.25rem',
    fontWeight: '700',
    color: '#1a202c',
  },
  quickActionsGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(4, 1fr)',
    gap: '20px',
  },
  quickActionCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: '16px',
    padding: '20px',
    boxShadow: '0 4px 20px rgba(0, 0, 0, 0.02)',
    border: '2px solid #7FB77E',
    display: 'flex',
    alignItems: 'center',
    gap: '16px',
    cursor: 'pointer',
    position: 'relative',
    transition: 'all 0.2s ease',
  },
  quickActionIconWrapper: {
    width: '44px',
    height: '44px',
    borderRadius: '12px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    flexShrink: 0,
  },
  quickActionContent: {
    display: 'flex',
    flexDirection: 'column',
    paddingRight: '24px',
  },
  quickActionTitle: {
    fontSize: '0.95rem',
    fontWeight: '700',
    color: '#1a202c',
  },
  quickActionDesc: {
    fontSize: '0.75rem',
    color: '#718096',
    marginTop: '2px',
  },
  quickActionArrow: {
    position: 'absolute',
    bottom: '16px',
    right: '16px',
  },
  reserveSectionGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
    gap: '20px',
    marginTop: '10px',
  },
  reserveCard: {
    backgroundColor: '#FFFFFF',
    border: '1px solid #EADBCE',
    borderRadius: '20px',
    padding: '24px',
    boxShadow: '0 4px 12px rgba(139, 107, 74, 0.03)',
    display: 'flex',
    flexDirection: 'column',
    gap: '16px',
    minHeight: '230px',
  },
  treeDisplayArea: {
    display: 'flex',
    alignItems: 'center',
    gap: '20px',
  },
  treeEmojiWrapper: {
    width: '80px',
    height: '80px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#F4F9F4',
    borderRadius: '50%',
    flexShrink: 0,
  },
  treeDetails: {
    display: 'flex',
    flexDirection: 'column',
    flex: 1,
  },
  treeStageTitle: {
    fontSize: '1.15rem',
    fontWeight: '800',
    color: '#1b4d2c',
  },
  treeStageSub: {
    fontSize: '0.8rem',
    color: '#A39387',
    fontWeight: '600',
    marginTop: '2px',
  },
  treeProgressOuter: {
    height: '10px',
    backgroundColor: '#F8F5F1',
    borderRadius: '5px',
    overflow: 'hidden',
    marginTop: '12px',
  },
  treeProgressInner: {
    height: '100%',
    backgroundColor: '#7FB77E',
    borderRadius: '5px',
    transition: 'width 0.4s ease',
  },
  treeXpLabel: {
    fontSize: '0.75rem',
    color: '#8B6B4A',
    fontWeight: '700',
    marginTop: '6px',
  },
  gardenPreviewArea: {
    display: 'flex',
    flexDirection: 'column',
    gap: '12px',
    flex: 1,
  },
  miniGardenLandscape: {
    height: '90px',
    backgroundColor: '#D0E8C4',
    borderRadius: '12px',
    position: 'relative',
    overflow: 'hidden',
    border: '1px solid #EADBCE',
  },
  miniPond: {
    position: 'absolute',
    width: '40px',
    height: '30px',
    backgroundColor: '#A0C4DF',
    borderRadius: '50%',
    bottom: '10px',
    left: '10px',
    opacity: 0.7,
  },
  gardenPreviewDetails: {
    display: 'flex',
    flexDirection: 'column',
    gap: '10px',
  },
  gardenCompletionLabel: {
    fontSize: '0.8rem',
    fontWeight: '700',
    color: '#A39387',
  },
  gardenCompletionVal: {
    fontSize: '1rem',
    fontWeight: '800',
    color: '#1b4d2c',
  },
  reserveCardBtn: {
    backgroundColor: '#F4F9F4',
    border: '1px solid #7FB77E',
    color: '#1b4d2c',
    borderRadius: '10px',
    padding: '8px 12px',
    fontWeight: '700',
    fontSize: '0.8rem',
    cursor: 'pointer',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: '8px',
    transition: 'all 0.2s',
  },
  shopShortcutArea: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    textAlign: 'center',
    gap: '10px',
    flex: 1,
    justifyContent: 'center',
  },
  shopIconCircle: {
    width: '50px',
    height: '50px',
    borderRadius: '50%',
    backgroundColor: 'rgba(127,183,126,0.15)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
  shopShortcutDesc: {
    fontSize: '0.75rem',
    color: '#6E5C50',
    lineHeight: '1.4',
  },
  shopBtnPrimary: {
    backgroundColor: '#1b4d2c',
    color: '#FFFFFF',
    border: 'none',
    borderRadius: '10px',
    padding: '8px 16px',
    fontWeight: '700',
    fontSize: '0.8rem',
    cursor: 'pointer',
    display: 'flex',
    alignItems: 'center',
    gap: '6px',
    transition: 'all 0.2s',
  },
  eventsMissionsGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 2fr 1fr))',
    gap: '20px',
    marginTop: '10px',
  },
  eventsColumn: {
    backgroundColor: '#FFFFFF',
    border: '1px solid #EADBCE',
    borderRadius: '20px',
    padding: '24px',
    boxShadow: '0 4px 12px rgba(139, 107, 74, 0.03)',
    display: 'flex',
    flexDirection: 'column',
    gap: '16px',
  },
  eventsList: {
    display: 'flex',
    flexDirection: 'column',
    gap: '16px',
  },
  eventCard: {
    display: 'flex',
    gap: '16px',
    border: '1px solid #EADBCE',
    borderRadius: '16px',
    overflow: 'hidden',
    backgroundColor: '#FAF8F5',
  },
  eventBanner: {
    width: '150px',
    height: '110px',
    objectFit: 'cover',
    flexShrink: 0,
  },
  eventInfo: {
    padding: '12px 16px 12px 0',
    display: 'flex',
    flexDirection: 'column',
    flex: 1,
    justifyContent: 'space-between',
  },
  eventHeaderRow: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    flexWrap: 'wrap',
    gap: '6px',
  },
  eventTitle: {
    fontSize: '1rem',
    fontWeight: '700',
    color: '#2D241E',
  },
  eventBadgeReward: {
    fontSize: '0.75rem',
    backgroundColor: 'rgba(217,119,6,0.1)',
    color: '#d97706',
    fontWeight: '700',
    padding: '2px 8px',
    borderRadius: '6px',
  },
  eventDesc: {
    fontSize: '0.75rem',
    color: '#6E5C50',
    lineHeight: '1.4',
  },
  eventMetaRow: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  eventRewards: {
    display: 'flex',
    gap: '10px',
  },
  eventRewardItem: {
    fontSize: '0.75rem',
    fontWeight: '700',
    color: '#7FB77E',
  },
  eventDate: {
    fontSize: '0.7rem',
    color: '#A39387',
    fontWeight: '600',
  },
  emptyState: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    padding: '40px 20px',
    textAlign: 'center',
    gap: '12px',
    color: '#A39387',
  },
  missionsColumn: {
    backgroundColor: '#FFFFFF',
    border: '1px solid #EADBCE',
    borderRadius: '20px',
    padding: '24px',
    boxShadow: '0 4px 12px rgba(139, 107, 74, 0.03)',
    display: 'flex',
    flexDirection: 'column',
    gap: '16px',
  },
  missionsList: {
    display: 'flex',
    flexDirection: 'column',
    gap: '16px',
  },
  missionCard: {
    border: '1px solid #EADBCE',
    borderRadius: '12px',
    padding: '12px 14px',
    display: 'flex',
    flexDirection: 'column',
    gap: '8px',
    backgroundColor: '#FFFFFF',
  },
  missionHeader: {
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
  },
  missionCheckbox: {
    width: '16px',
    height: '16px',
    border: '1.5px solid #A39387',
    borderRadius: '4px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontSize: '0.65rem',
    fontWeight: '800',
    color: '#FFFFFF',
  },
  missionTitle: {
    fontSize: '0.8rem',
    fontWeight: '700',
  },
  missionProgressRow: {
    display: 'flex',
    alignItems: 'center',
    gap: '10px',
  },
  missionProgressOuter: {
    flex: 1,
    height: '6px',
    backgroundColor: '#F8F5F1',
    borderRadius: '3px',
    overflow: 'hidden',
  },
  missionProgressInner: {
    height: '100%',
    backgroundColor: '#7FB77E',
    borderRadius: '3px',
    transition: 'width 0.4s ease',
  },
  missionProgressLabel: {
    fontSize: '0.7rem',
    color: '#8B6B4A',
    fontWeight: '700',
  },
  missionRewards: {
    display: 'flex',
    gap: '8px',
  },
  missionRewardVal: {
    fontSize: '0.7rem',
    fontWeight: '700',
    color: '#1b4d2c',
  },
  rotateBtn: {
    width: '30px',
    height: '30px',
    borderRadius: '50%',
    border: '1px solid #EADBCE',
    backgroundColor: '#FFFFFF',
    color: '#2D241E',
    fontSize: '0.85rem',
    cursor: 'pointer',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    boxShadow: '0 2px 4px rgba(0,0,0,0.03)',
    transition: 'all 0.2s',
  },
  gameDivider: {
    height: '1px',
    backgroundColor: '#EADBCE',
    margin: '12px 0 6px 0',
  },
  gameActionsArea: {
    display: 'flex',
    flexDirection: 'column',
    gap: '8px',
  },
  gameSectionLabel: {
    fontSize: '0.8rem',
    fontWeight: '700',
    color: '#8B6B4A',
    textTransform: 'uppercase',
  },
  gameButtonsRow: {
    display: 'flex',
    gap: '10px',
    flexWrap: 'wrap',
  },
  gameBtn: {
    flex: 1,
    minWidth: '95px',
    padding: '8px 12px',
    borderRadius: '10px',
    border: '1px solid #7FB77E',
    backgroundColor: '#F4F9F4',
    color: '#1b4d2c',
    fontSize: '0.75rem',
    fontWeight: '700',
    cursor: 'pointer',
    textAlign: 'center',
    transition: 'all 0.2s',
  },
  triviaContainer: {
    backgroundColor: '#FAF8F5',
    border: '1px solid #EADBCE',
    borderRadius: '12px',
    padding: '12px',
    display: 'flex',
    flexDirection: 'column',
    gap: '8px',
  },
  triviaTitle: {
    fontSize: '0.85rem',
    fontWeight: '800',
    color: '#b45309',
    textTransform: 'uppercase',
  },
  triviaQ: {
    fontSize: '0.8rem',
    fontWeight: '700',
    color: '#2D241E',
  },
  triviaOptionsList: {
    display: 'flex',
    flexDirection: 'column',
    gap: '6px',
  },
  triviaOptBtn: {
    width: '100%',
    padding: '8px 12px',
    borderRadius: '8px',
    border: '1px solid #EADBCE',
    fontSize: '0.75rem',
    fontWeight: '600',
    color: '#2D241E',
    textAlign: 'left',
    cursor: 'pointer',
    transition: 'all 0.2s',
  },
  triviaFeedback: {
    fontSize: '0.75rem',
    fontWeight: '700',
    marginTop: '4px',
  },
  triviaActionBtn: {
    padding: '6px 12px',
    borderRadius: '8px',
    border: 'none',
    backgroundColor: '#2e7d32',
    color: '#FFFFFF',
    fontSize: '0.75rem',
    fontWeight: '700',
    cursor: 'pointer',
  }
};
