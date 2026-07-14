import React, { useState, useEffect, useContext } from 'react';
import { motion } from 'framer-motion';
import axios from 'axios';
import { AuthContext } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import { 
  GraduationCap, Leaf, BookOpen, Trophy, 
  CheckCircle, ArrowRight, HelpCircle, Gift, Users, Award, Flame, Calendar
} from 'lucide-react';

export default function Dashboard() {
  const { user, refreshUserData } = useContext(AuthContext);
  const navigate = useNavigate();

  const [stats, setStats] = useState({
    level: 1,
    xp: 0,
    completedCoursesCount: 0,
    unlockedBadgesCount: 0,
    totalCoursesCount: 0,
    totalQuizzesCount: 0,
  });

  const [courses, setCourses] = useState([]);
  const [recentActivities, setRecentActivities] = useState([]);
  const [treeInfo, setTreeInfo] = useState(null);
  const [leaderboard, setLeaderboard] = useState([]);
  const [activeEvents, setActiveEvents] = useState([]);
  const [missions, setMissions] = useState([]);
  const [userBadges, setUserBadges] = useState([]);
  const [loading, setLoading] = useState(true);

  // Trivia Game States
  const [currentTrivia, setCurrentTrivia] = useState(null);
  const [triviaFeedback, setTriviaFeedback] = useState("");
  const [triviaSuccess, setTriviaSuccess] = useState(false);
  const [currentTime, setCurrentTime] = useState(Date.now());
  const [isRotatingAuto, setIsRotatingAuto] = useState(true);
  const [manualRotation, setManualRotation] = useState(0);

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

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(Date.now());
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        setLoading(true);
        await refreshUserData().catch(err => console.warn("Profile stats refresh failed:", err));
        
        // Fetch dashboard stats
        const statsRes = await axios.get('/api/dashboard/stats').catch(err => console.warn(err));
        if (statsRes && statsRes.data) {
          setStats({
            level: statsRes.data.level ?? 1,
            xp: statsRes.data.xp ?? 0,
            completedCoursesCount: statsRes.data.completedCoursesCount ?? 0,
            unlockedBadgesCount: statsRes.data.unlockedBadgesCount ?? 0,
            totalCoursesCount: statsRes.data.totalCoursesCount ?? 0,
            totalQuizzesCount: statsRes.data.totalQuizzesCount ?? 0,
          });
        }

        // Fetch courses for learning progress
        const coursesRes = await axios.get('/api/courses').catch(err => console.warn(err));
        if (coursesRes && coursesRes.data) {
          setCourses(coursesRes.data);
        }

        // Fetch recent activities
        const activitiesRes = await axios.get('/api/dashboard/activities').catch(err => console.warn(err));
        if (activitiesRes && activitiesRes.data) {
          setRecentActivities(activitiesRes.data);
        }

        // Fetch virtual tree info
        const treeRes = await axios.get('/api/tree').catch(err => console.warn(err));
        if (treeRes && treeRes.data) {
          setTreeInfo(treeRes.data);
        }

        // Fetch leaderboard
        const lbRes = await axios.get('/api/leaderboard').catch(err => console.warn(err));
        if (lbRes && lbRes.data) {
          setLeaderboard(lbRes.data.slice(0, 5));
        }

        // Fetch active events
        const eventsRes = await axios.get('/api/events/active').catch(err => console.warn(err));
        if (eventsRes && eventsRes.data) {
          setActiveEvents(eventsRes.data);
        }

        // Fetch missions
        const missionsRes = await axios.get('/api/missions').catch(err => console.warn(err));
        if (missionsRes && missionsRes.data) {
          setMissions(missionsRes.data);
        }

        // Fetch user badges
        const profileRes = await axios.get('/api/profile').catch(err => console.warn(err));
        if (profileRes && profileRes.data) {
          setUserBadges(profileRes.data.unlockedBadges || []);
        }

      } catch (err) {
        console.error("Dashboard general loading error", err);
      } finally {
        setLoading(false);
      }
    };
    fetchDashboardData();
  }, []);

  const displayName = user?.fullName || 'User';
  const displayXp = user?.xp ?? stats.xp ?? 0;
  const displayLevel = user?.level ?? stats.level ?? 1;

  const formatTimeAgo = (timestampStr) => {
    if (!timestampStr) return '';
    const now = new Date(currentTime);
    const time = new Date(timestampStr);
    const diffMs = now - time;
    const diffMins = Math.floor(diffMs / (1000 * 60));
    const diffHrs = Math.floor(diffMs / (1000 * 60 * 60));
    const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));

    if (diffMins < 1) return 'Just now';
    if (diffMins < 60) return `${diffMins} min${diffMins > 1 ? 's' : ''} ago`;
    if (diffHrs < 24) return `${diffHrs} hour${diffHrs > 1 ? 's' : ''} ago`;
    if (diffDays === 1) return 'Yesterday';
    return `${diffDays} days ago`;
  };

  const getActivityIcon = (type) => {
    const size = 16;
    switch (type?.toUpperCase()) {
      case 'MISSION':
        return { icon: <Trophy size={size} color="#ED8936" />, bg: '#FEF3C7' };
      case 'EVENT':
        return { icon: <Award size={size} color="#9F7AEA" />, bg: '#FAF5FF' };
      case 'QUIZ':
        return { icon: <Trophy size={size} color="#E53E3E" />, bg: '#FFF5F5' };
      case 'BADGE':
        return { icon: <Award size={size} color="#0284C7" />, bg: '#E0F2FE' };
      case 'LESSON':
        return { icon: <BookOpen size={size} color="#9F7AEA" />, bg: '#FAF5FF' };
      case 'TREE':
        return { icon: <Leaf size={size} color="#2E7D32" />, bg: '#E6F4EA' };
      case 'SHOP':
        return { icon: <Gift size={size} color="#3182CE" />, bg: '#EBF8FF' };
      case 'STREAK':
      case 'LOGIN':
        return { icon: <Flame size={size} color="#D97706" />, bg: '#FEF3C7' };
      default:
        return { icon: <CheckCircle size={size} color="#2E7D32" />, bg: '#EAF5EC' };
    }
  };

  const isEventCompleted = (event) => {
    return userBadges.some(b => b.name.toLowerCase() === event.badgeReward.toLowerCase());
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
    const daySeed = new Date().getDate() + new Date().getMonth() * 31;
    const dailyQ = triviaQuestions[daySeed % triviaQuestions.length];
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

  const handleWaterTree = async () => {
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
  };

  const handleFertilizeTree = async () => {
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
  };

  const getLeaderboardList = () => {
    if (leaderboard.length > 0) {
      return leaderboard;
    }
    return [
      { id: 101, fullName: "Priya S", xp: 2450, level: 8, profilePicture: "https://api.dicebear.com/7.x/fun-emoji/svg?seed=Priya" },
      { id: user?.id || 102, fullName: displayName, xp: displayXp, level: displayLevel, profilePicture: user?.profilePicture || "https://api.dicebear.com/7.x/fun-emoji/svg?seed=Kabilesh" },
      { id: 103, fullName: "Arjun R", xp: 980, level: 3, profilePicture: "https://api.dicebear.com/7.x/fun-emoji/svg?seed=Arjun" },
      { id: 104, fullName: "Sneha P", xp: 870, level: 3, profilePicture: "https://api.dicebear.com/7.x/fun-emoji/svg?seed=Sneha" },
      { id: 105, fullName: "Rahul K", xp: 760, level: 2, profilePicture: "https://api.dicebear.com/7.x/fun-emoji/svg?seed=Rahul" }
    ].sort((a, b) => b.xp - a.xp);
  };

  const currentLeaderboard = getLeaderboardList();

  const enrolledCourses = courses.filter(c => c.enrolled);
  const overallProgress = enrolledCourses.length > 0
    ? Math.round(enrolledCourses.reduce((sum, c) => sum + (c.progressPercentage || 0), 0) / enrolledCourses.length)
    : 0;

  const radius = 45;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (overallProgress / 100) * circumference;

  return (
    <div style={styles.dashboardContainer}>
      
      {/* 1. Welcome Banner Card (Lavender converted to Light Green with stats widgets in center empty space) */}
      <div style={styles.heroBanner}>
        <div style={styles.heroLeft}>
          <span style={styles.welcomeLabel}>Welcome back,</span>
          <h1 style={styles.heroTitle}>{displayName.toUpperCase()}! 👋</h1>
          <p style={styles.heroDesc}>
            Keep learning, keep earning and help save our planet.
          </p>
        </div>

        {/* Center column stats widget to fill space beautifully */}
        <div style={styles.heroCenter}>
          <div style={styles.miniStatBadge}>
            <span style={styles.miniStatLabel}>Daily Streak</span>
            <span style={styles.miniStatVal}>🔥 {user?.streak ?? 0} Days</span>
          </div>
          <div style={styles.miniStatBadge}>
            <span style={styles.miniStatLabel}>Eco Coins</span>
            <span style={styles.miniStatVal}>🪙 {user?.coins ?? 0}</span>
          </div>
          <div style={styles.miniStatBadge}>
            <span style={styles.miniStatLabel}>Current XP</span>
            <span style={styles.miniStatVal}>⭐ {displayXp.toLocaleString()}</span>
          </div>
        </div>

        <div style={styles.heroRight}>
          <img 
            src="/dashboard_welcome_earth.png" 
            alt="Greenizo Welcome Earth" 
            style={styles.heroImage}
          />
        </div>
      </div>

      {/* 2. Metrics Cards Row */}
      <div style={styles.metricsGrid}>
        
        {/* Metric 1: Level */}
        <div style={styles.metricCard}>
          <div style={{ ...styles.iconContainer, backgroundColor: '#FAF5FF' }}>
            <GraduationCap size={22} color="#9F7AEA" />
          </div>
          <div style={styles.metricDetails}>
            <span style={styles.metricLabel}>Current Level</span>
            <span style={styles.metricValue}>Level {displayLevel}</span>
            <span style={styles.metricSubtext}>Eco Learner</span>
          </div>
        </div>

        {/* Metric 2: Total Points */}
        <div style={styles.metricCard}>
          <div style={{ ...styles.iconContainer, backgroundColor: '#E6F4EA' }}>
            <Leaf size={22} color="#2E7D32" />
          </div>
          <div style={styles.metricDetails}>
            <span style={styles.metricLabel}>Total Points</span>
            <span style={styles.metricValue}>{displayXp.toLocaleString()}</span>
            <span style={styles.metricSubtext}>Keep Going! 🌱</span>
          </div>
        </div>

        {/* Metric 3: Modules Completed */}
        <div style={styles.metricCard}>
          <div style={{ ...styles.iconContainer, backgroundColor: '#EBF8FF' }}>
            <BookOpen size={22} color="#3182CE" />
          </div>
          <div style={{ ...styles.metricDetails, width: '100%' }}>
            <span style={styles.metricLabel}>Modules Completed</span>
            <span style={styles.metricValue}>{stats.completedCoursesCount} / {stats.totalCoursesCount || 20}</span>
            <div style={styles.progressTrack}>
              <div style={{ ...styles.progressBar, width: `${stats.totalCoursesCount > 0 ? (stats.completedCoursesCount / stats.totalCoursesCount) * 100 : 0}%`, backgroundColor: '#3182CE' }} />
            </div>
            <span style={styles.metricSubtext}>{stats.totalCoursesCount > 0 ? Math.round((stats.completedCoursesCount / stats.totalCoursesCount) * 100) : 0}% Completed</span>
          </div>
        </div>

        {/* Metric 4: Quizzes Completed */}
        <div style={styles.metricCard}>
          <div style={{ ...styles.iconContainer, backgroundColor: '#FFF5F5' }}>
            <Trophy size={22} color="#E53E3E" />
          </div>
          <div style={styles.metricDetails}>
            <span style={styles.metricLabel}>Quizzes Completed</span>
            <span style={styles.metricValue}>{stats.completedCoursesCount} / {stats.totalQuizzesCount || 15}</span>
            <span style={styles.metricSubtext}>{stats.completedCoursesCount > 0 ? "Great Job! 🎉" : "Not yet completed 🌱"}</span>
          </div>
        </div>

      </div>

      {/* 2.5. Seasonal Events & Weekly Missions Row */}
      <div style={styles.eventsMissionsRow}>
        
        {/* Left: Seasonal Events */}
        <div style={{ ...styles.gridCard, flex: 1.3 }}>
          <h3 style={styles.cardHeader}>🏅 Active Seasonal Events</h3>
          {activeEvents.length > 0 ? (
            <div style={styles.eventsList}>
              {activeEvents.map(event => {
                const completed = isEventCompleted(event);
                return (
                  <div key={event.id} style={styles.eventCard}>
                    <img src={event.bannerUrl} alt={event.title} style={styles.eventBanner} />
                    <div style={styles.eventInfo}>
                      <div style={styles.eventHeaderRow}>
                        <h4 style={styles.eventTitle}>{event.title}</h4>
                        {completed ? (
                          <span style={{ ...styles.eventBadgeReward, backgroundColor: '#E6F4EA', color: '#2E7D32' }}>Completed! 🎉</span>
                        ) : (
                          <span style={styles.eventBadgeReward}>🎖️ {event.badgeReward}</span>
                        )}
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
                );
              })}
            </div>
          ) : (
            <div style={styles.emptyState}>
              <Calendar size={36} color="#111827" />
              <p style={{ marginTop: '10px', fontSize: '0.85rem', color: '#111827', fontWeight: '700' }}>No active seasonal events at the moment.</p>
            </div>
          )}
        </div>

        {/* Right: Weekly Missions */}
        <div style={{ ...styles.gridCard, flex: 1 }}>
          <h3 style={styles.cardHeader}>🎯 Weekly Missions</h3>
          <div style={styles.missionsList}>
            {missions.map(m => {
              const pct = Math.round((m.progress * 100) / m.target);
              return (
                <div key={m.id} style={styles.missionCard}>
                  <div style={styles.missionHeader}>
                    <span style={{
                      ...styles.missionCheckbox,
                      backgroundColor: m.completed ? '#48BB78' : 'transparent',
                      borderColor: m.completed ? '#48BB78' : '#111827'
                    }}>
                      {m.completed && '✓'}
                    </span>
                    <span style={{
                      ...styles.missionTitle,
                      textDecoration: m.completed ? 'line-through' : 'none',
                      color: m.completed ? '#718096' : '#111827'
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

      {/* 3. Middle Cards Row */}
      <div style={styles.middleRow}>
        
        {/* Card A: Learning Progress */}
        <div style={styles.gridCard}>
          <h3 style={styles.cardHeader}>Learning Progress</h3>
          <div style={styles.progressContent}>
            {/* Circular Gauge */}
            <div style={styles.circularWrapper}>
              <svg width="110" height="110" viewBox="0 0 110 110">
                <circle cx="55" cy="55" r={radius} stroke="#EBF8FF" strokeWidth="10" fill="transparent" />
                <circle 
                  cx="55" 
                  cy="55" 
                  r={radius} 
                  stroke="#48BB78" 
                  strokeWidth="10" 
                  fill="transparent"
                  strokeDasharray={circumference}
                  strokeDashoffset={strokeDashoffset}
                  strokeLinecap="round"
                  transform="rotate(-90 55 55)"
                />
                <text x="50%" y="45%" textAnchor="middle" dominantBaseline="middle" style={styles.gaugeText}>
                  {overallProgress}%
                </text>
                <text x="50%" y="65%" textAnchor="middle" dominantBaseline="middle" style={styles.gaugeLabel}>
                  Overall
                </text>
                <text x="50%" y="76%" textAnchor="middle" dominantBaseline="middle" style={styles.gaugeLabel}>
                  Progress
                </text>
              </svg>
            </div>

            {/* List of Topic Metrics */}
            <div style={styles.topicsList}>
              {courses.slice(0, 4).map((c, idx) => {
                const colors = ['#48BB78', '#4299E1', '#ED8936', '#9F7AEA'];
                const progressPct = c.enrolled ? Math.round(c.progressPercentage) : 0;
                return (
                  <div key={c.id || idx} style={styles.topicItem}>
                    <div style={styles.topicHeader}>
                      <span style={styles.topicName}>{c.title}</span>
                      <span style={styles.topicPercent}>{c.enrolled ? `${progressPct}%` : 'Not Enrolled'}</span>
                    </div>
                    <div style={styles.topicTrack}>
                      <div style={{ ...styles.topicBar, width: `${progressPct}%`, backgroundColor: colors[idx % colors.length] }} />
                    </div>
                  </div>
                );
              })}
              {courses.length === 0 && (
                <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100%', width: '100%' }}>
                  <span style={{ fontSize: '14px', color: '#718096' }}>No courses loaded yet. 🌱</span>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Card B: Badges & Achievements */}
        <div style={styles.gridCard}>
          <div style={styles.headerWithAction}>
            <h3 style={styles.cardHeader}>Badges & Achievements</h3>
            <button onClick={() => navigate('/profile')} style={styles.viewAllBtn}>View All</button>
          </div>
          <div style={styles.badgesContainer}>
            <div style={styles.badgeCard}>
              <svg width="60" height="70" viewBox="0 0 60 70" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M5 10 L30 2 L55 10 L55 40 C55 55 30 68 30 68 C30 68 5 55 5 40 Z" fill="#E8F5E9" stroke="#4CAF50" strokeWidth="3" />
                <circle cx="30" cy="32" r="16" fill="#4CAF50" />
                <path d="M25 38 L30 25 L35 38 Z" fill="#FFFFFF" />
              </svg>
              <span style={styles.badgeTitle}>Eco Starter</span>
              <span style={styles.badgeStatus}>Earned</span>
            </div>

            <div style={styles.badgeCard}>
              <svg width="60" height="70" viewBox="0 0 60 70" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M5 10 L30 2 L55 10 L55 40 C55 55 30 68 30 68 C30 68 5 55 5 40 Z" fill="#E0F2FE" stroke="#0284C7" strokeWidth="3" />
                <circle cx="30" cy="32" r="16" fill="#0284C7" />
                <path d="M30 22 C34 26, 35 32, 30 38 C25 32, 26 26, 30 22 Z" fill="#FFFFFF" />
              </svg>
              <span style={styles.badgeTitle}>Water Saver</span>
              <span style={styles.badgeStatus}>Earned</span>
            </div>

            <div style={styles.badgeCard}>
              <svg width="60" height="70" viewBox="0 0 60 70" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M5 10 L30 2 L55 10 L55 40 C55 55 30 68 30 68 C30 68 5 55 5 40 Z" fill="#FFF7ED" stroke="#F97316" strokeWidth="3" />
                <circle cx="30" cy="32" r="16" fill="#F97316" />
                <polygon points="30,22 33,28 40,29 35,34 36,41 30,37 24,41 25,34 20,29 27,28" fill="#FFFFFF" />
              </svg>
              <span style={styles.badgeTitle}>Quiz Master</span>
              <span style={styles.badgeStatus}>Earned</span>
            </div>
          </div>
        </div>

        {/* Card C: Leaderboard */}
        <div style={styles.gridCard}>
          <div style={styles.headerWithAction}>
            <h3 style={styles.cardHeader}>Leaderboard (Top 5)</h3>
            <button onClick={() => navigate('/leaderboard')} style={styles.viewAllBtn}>View All</button>
          </div>
          <div style={styles.leaderboardList}>
            {currentLeaderboard.map((lbUser, idx) => {
              const isCurrentUser = lbUser.fullName.toLowerCase() === displayName.toLowerCase();
              const rank = idx + 1;
              return (
                <div 
                  key={lbUser.id} 
                  style={{
                    ...styles.leaderboardRow,
                    backgroundColor: isCurrentUser ? '#F4FBF5' : 'transparent',
                    border: isCurrentUser ? '1px solid #C8E6C9' : '1px solid transparent'
                  }}
                >
                  <div style={styles.leaderboardRank}>
                    {rank === 1 && <span style={{ ...styles.medal, backgroundColor: '#FEF3C7', color: '#D97706' }}>1</span>}
                    {rank === 2 && <span style={{ ...styles.medal, backgroundColor: '#E2E8F0', color: '#475569' }}>2</span>}
                    {rank === 3 && <span style={{ ...styles.medal, backgroundColor: '#FFEDD5', color: '#C2410C' }}>3</span>}
                    {rank > 3 && <span style={styles.rankNum}>{rank}</span>}
                  </div>
                  <img 
                    src={lbUser.profilePicture || `https://api.dicebear.com/7.x/fun-emoji/svg?seed=${lbUser.fullName}`} 
                    alt={lbUser.fullName} 
                    style={styles.lbAvatar}
                  />
                  <div style={styles.lbInfo}>
                    <span style={{ 
                      ...styles.lbName, 
                      fontWeight: '800',
                      color: isCurrentUser ? '#0F5132' : '#111827'
                    }}>
                      {lbUser.fullName} {isCurrentUser && <span style={styles.youTag}>(You)</span>}
                    </span>
                  </div>
                  <span style={{ 
                    ...styles.lbPoints,
                    fontWeight: '800',
                    color: isCurrentUser ? '#0F5132' : '#111827'
                  }}>
                    {lbUser.xp} pts
                  </span>
                </div>
              );
            })}
          </div>
        </div>

      </div>

      {/* 4. Bottom Cards Row: Recent Activities, Virtual Tree, Quick Access */}
      <div style={styles.bottomRow}>
        
        {/* Card D: Recent Activities */}
        <div style={{ ...styles.gridCard, flex: 1.2 }}>
          <div style={styles.headerWithAction}>
            <h3 style={styles.cardHeader}>Recent Activities</h3>
            <button onClick={() => navigate('/certificates')} style={styles.viewAllBtn}>View All</button>
          </div>
          <div style={styles.activitiesList}>
            {recentActivities.map((act) => {
              const { icon, bg } = getActivityIcon(act.type);
              const isNegative = act.xpChange?.startsWith('-');
              return (
                <div key={act.id} style={styles.activityRow}>
                  <div style={{ ...styles.activityIcon, backgroundColor: bg }}>
                    {icon}
                  </div>
                  <div style={styles.activityBody}>
                    <span style={styles.activityTitle}>{act.title}</span>
                    <span style={styles.activityTime}>{formatTimeAgo(act.timestamp)}</span>
                  </div>
                  <span style={{ 
                    ...styles.activityPoints, 
                    color: isNegative ? '#E53E3E' : '#2E7D32' 
                  }}>
                    {act.xpChange}
                  </span>
                </div>
              );
            })}
            {recentActivities.length === 0 && (
              <div style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', height: '100%', padding: '40px 10px', textAlign: 'center' }}>
                <span style={{ fontSize: '32px', marginBottom: '10px' }}>🌱</span>
                <span style={{ fontSize: '14px', color: '#718096', fontWeight: '500' }}>No recent activity yet!</span>
                <span style={{ fontSize: '12px', color: '#A0AEC0', marginTop: '4px' }}>Complete a lesson, pass a quiz, or nurture your tree to start your eco journey!</span>
              </div>
            )}
          </div>
        </div>

        {/* Card E: Virtual Tree Nurturing */}
        <div style={{ ...styles.gridCard, flex: 1.2 }}>
          <h3 style={styles.cardHeader}>🌳 Virtual Tree Growth</h3>
          
          <div style={styles.treeSectionContainer}>
            {/* Tree display animation */}
            <div style={styles.treeEmojiWrapper}>
              <motion.div
                animate={isRotatingAuto ? { 
                  rotateY: [manualRotation, manualRotation + 360], 
                  y: [0, -5, 0] 
                } : { 
                  rotateY: manualRotation,
                  y: [0, -5, 0] 
                }}
                transition={{ 
                  rotateY: { repeat: isRotatingAuto ? Infinity : 0, duration: 12, ease: "linear" },
                  y: { repeat: Infinity, duration: 3, ease: "easeInOut" }
                }}
                style={styles.tree3DBox}
              >
                <span style={styles.treeEmoji}>{treeInfo?.imageUrl || '🌳'}</span>
              </motion.div>
              
              {/* Rotation controls */}
              <div style={styles.rotRow}>
                <button onClick={() => { setIsRotatingAuto(false); setManualRotation(r => r - 45); }} style={styles.rotBtn}>↺</button>
                <button onClick={() => setIsRotatingAuto(!isRotatingAuto)} style={{ ...styles.rotBtn, fontSize: '0.65rem' }}>
                  {isRotatingAuto ? 'Stop' : 'Auto'}
                </button>
                <button onClick={() => { setIsRotatingAuto(false); setManualRotation(r => r + 45); }} style={styles.rotBtn}>↻</button>
              </div>
            </div>

            {/* Tree Info Details */}
            <div style={styles.treeDetails}>
              <span style={styles.stageTitle}>Stage: {treeInfo?.stageName || 'Seed'}</span>
              <span style={styles.stageLevel}>Growth level {treeInfo?.level || 1}</span>
              <div style={styles.treeProgressTrack}>
                <div style={{ ...styles.treeProgressBar, width: `${treeInfo?.progressPercent || 0}%` }} />
              </div>
              <span style={styles.xpLabel}>
                {treeInfo?.currentXp || displayXp} / {treeInfo?.nextStageXp || 200} XP to next stage ({Math.round(treeInfo?.progressPercent || 0)}%)
              </span>
            </div>
          </div>

          <div style={styles.dividerLine} />

          {/* Tree interactive controls or trivia */}
          {currentTrivia ? (
            <div style={styles.treeTriviaBox}>
              <div style={styles.triviaHeaderRow}>
                <span style={styles.triviaTitle}>☀️ Daily Sunlight Trivia</span>
                <button onClick={() => setCurrentTrivia(null)} style={styles.triviaCloseBtn}>✕</button>
              </div>
              <p style={styles.triviaText}>{currentTrivia.q}</p>
              <div style={styles.triviaOptsGrid}>
                {currentTrivia.options.map((opt, idx) => (
                  <button 
                    key={idx} 
                    onClick={() => handleTriviaAnswer(idx)} 
                    style={{
                      ...styles.triviaOptBtn,
                      borderColor: triviaFeedback && idx === currentTrivia.correctIdx ? '#48BB78' : '#C8E6C9',
                      backgroundColor: triviaFeedback && idx === currentTrivia.correctIdx ? '#E6F4EA' : '#FFFFFF'
                    }}
                    disabled={triviaSuccess}
                  >
                    {opt}
                  </button>
                ))}
              </div>
              {triviaFeedback && (
                <span style={{
                  ...styles.triviaFeedbackText,
                  color: triviaSuccess ? '#2E7D32' : '#E53E3E'
                }}>
                  {triviaFeedback}
                </span>
              )}
            </div>
          ) : (
            <div style={styles.nurtureControls}>
              <span style={styles.nurtureTitle}>Nurture & Play Actions</span>
              <div style={styles.nurtureButtonsRow}>
                <button onClick={handleWaterTree} style={styles.nurtureBtn}>
                  💧 Water (-5 🪙)
                </button>
                <button onClick={handleFertilizeTree} style={styles.nurtureBtn}>
                  🌿 Fertilize (-10 🪙)
                </button>
                {getSunlightCooldownString() ? (
                  <button style={{ ...styles.nurtureBtn, backgroundColor: '#EDF2F7', color: '#718096', border: '1px solid #CBD5E0', cursor: 'not-allowed' }} disabled>
                    ☀️ Cooldown: {getSunlightCooldownString()}
                  </button>
                ) : (
                  <button onClick={startTrivia} style={{ ...styles.nurtureBtn, backgroundColor: '#FEF3C7', color: '#D97706', borderColor: '#FCD34D' }}>
                    ☀️ Sunlight Trivia (+50 XP)
                  </button>
                )}
              </div>
            </div>
          )}
        </div>

        {/* Card F: Quick Access & Quote Banner */}
        <div style={{ ...styles.gridCard, flex: 1, padding: 0, border: 'none', backgroundColor: 'transparent', gap: '20px', display: 'flex', flexDirection: 'column' }}>
          
          {/* Quick Access Card */}
          <div style={styles.quickAccessCard}>
            <h3 style={{ ...styles.cardHeader, marginBottom: '16px' }}>Quick Access</h3>
            <div style={styles.quickAccessGrid}>
              <button onClick={() => navigate('/courses')} style={styles.quickActionBtn}>
                <div style={{ ...styles.quickIconCircle, backgroundColor: '#FAF5FF' }}>
                  <HelpCircle size={18} color="#9F7AEA" />
                </div>
                <span style={styles.quickActionLabel}>Take Quiz</span>
              </button>

              <button onClick={() => navigate('/courses')} style={styles.quickActionBtn}>
                <div style={{ ...styles.quickIconCircle, backgroundColor: '#EBF8FF' }}>
                  <BookOpen size={18} color="#3182CE" />
                </div>
                <span style={styles.quickActionLabel}>Learn More</span>
              </button>

              <button onClick={() => navigate('/shop')} style={styles.quickActionBtn}>
                <div style={{ ...styles.quickIconCircle, backgroundColor: '#FFF7ED' }}>
                  <Gift size={18} color="#EA580C" />
                </div>
                <span style={styles.quickActionLabel}>Earn Rewards</span>
              </button>

              <button onClick={() => navigate('/leaderboard')} style={styles.quickActionBtn}>
                <div style={{ ...styles.quickIconCircle, backgroundColor: '#EAF5EC' }}>
                  <Users size={18} color="#2E7D32" />
                </div>
                <span style={styles.quickActionLabel}>Leaderboard</span>
              </button>
            </div>
          </div>

          {/* Quote Green Banner */}
          <div style={styles.quoteBanner}>
            <div style={styles.quoteLeft}>
              <div style={styles.sproutGroup}>
                <span style={{ fontSize: '1.2rem' }}>🌱</span>
                <span style={{ fontSize: '1rem', marginLeft: '-4px' }}>🌱</span>
              </div>
              <p style={styles.quoteText}>
                Small steps today<br />
                <strong>Big change tomorrow 🌍</strong>
              </p>
            </div>
          </div>

        </div>

      </div>

    </div>
  );
}

const styles = {
  dashboardContainer: {
    display: 'flex',
    flexDirection: 'column',
    gap: '24px',
    backgroundColor: '#F7F9FA',
    minHeight: 'calc(100vh - 70px)',
    padding: '8px 4px 24px 4px',
    fontFamily: 'inherit',
  },
  heroBanner: {
    // Gradient changed from lavender/blue to matches light green theme
    background: 'linear-gradient(135deg, #F1FAF5 0%, #EAF5EC 100%)',
    borderRadius: '24px',
    padding: '32px 40px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    boxShadow: '0 8px 24px rgba(46, 125, 50, 0.04)',
    overflow: 'hidden',
    border: '1px solid #C8E6C9',
  },
  heroLeft: {
    display: 'flex',
    flexDirection: 'column',
    flex: 1.2,
  },
  welcomeLabel: {
    fontSize: '1rem',
    fontWeight: '800',
    color: '#111827',
  },
  heroTitle: {
    fontSize: '2.2rem',
    fontWeight: '950',
    color: '#111827',
    margin: '4px 0 10px 0',
  },
  heroDesc: {
    fontSize: '1rem',
    fontWeight: '800',
    color: '#111827',
  },
  heroCenter: {
    display: 'flex',
    gap: '16px',
    justifyContent: 'center',
    alignItems: 'center',
    flex: 1.5,
    padding: '0 20px',
  },
  miniStatBadge: {
    backgroundColor: 'rgba(255, 255, 255, 0.85)',
    border: '1px solid #C8E6C9',
    borderRadius: '16px',
    padding: '12px 16px',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    gap: '4px',
    minWidth: '110px',
    boxShadow: '0 4px 12px rgba(46, 125, 50, 0.05)',
  },
  miniStatLabel: {
    fontSize: '0.7rem',
    fontWeight: '850',
    color: '#0F5132',
    textTransform: 'uppercase',
    letterSpacing: '0.5px',
  },
  miniStatVal: {
    fontSize: '0.92rem',
    fontWeight: '900',
    color: '#111827',
  },
  heroRight: {
    width: '180px',
    height: '180px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    flexShrink: 0,
    flex: 0.8,
  },
  heroImage: {
    width: '100%',
    height: '100%',
    objectFit: 'contain',
  },
  metricsGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
    gap: '20px',
  },
  metricCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: '20px',
    padding: '24px',
    display: 'flex',
    alignItems: 'center',
    gap: '16px',
    boxShadow: '0 4px 18px rgba(0, 0, 0, 0.02)',
    border: '1px solid #C8E6C9',
  },
  iconContainer: {
    width: '48px',
    height: '48px',
    borderRadius: '14px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    flexShrink: 0,
  },
  metricDetails: {
    display: 'flex',
    flexDirection: 'column',
  },
  metricLabel: {
    fontSize: '0.82rem',
    fontWeight: '800',
    color: '#111827',
    textTransform: 'uppercase',
    letterSpacing: '0.5px',
  },
  metricValue: {
    fontSize: '1.35rem',
    fontWeight: '900',
    color: '#111827',
    margin: '3px 0',
  },
  metricSubtext: {
    fontSize: '0.78rem',
    fontWeight: '800',
    color: '#111827',
  },
  progressTrack: {
    width: '100%',
    height: '6px',
    backgroundColor: '#EDF2F7',
    borderRadius: '3px',
    overflow: 'hidden',
    margin: '6px 0',
  },
  progressBar: {
    height: '100%',
    borderRadius: '3px',
  },
  eventsMissionsRow: {
    display: 'flex',
    gap: '20px',
    flexWrap: 'wrap',
  },
  eventsList: {
    display: 'flex',
    flexDirection: 'column',
    gap: '12px',
  },
  eventCard: {
    display: 'flex',
    gap: '16px',
    border: '1px solid #C8E6C9',
    borderRadius: '16px',
    padding: '12px',
    backgroundColor: '#FFFFFF',
    alignItems: 'center',
  },
  eventBanner: {
    width: '100px',
    height: '80px',
    borderRadius: '10px',
    objectFit: 'cover',
    flexShrink: 0,
  },
  eventInfo: {
    flex: 1,
    display: 'flex',
    flexDirection: 'column',
  },
  eventHeaderRow: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    flexWrap: 'wrap',
    gap: '4px',
  },
  eventTitle: {
    fontSize: '0.9rem',
    fontWeight: '900',
    color: '#111827',
    margin: 0,
  },
  eventBadgeReward: {
    fontSize: '0.72rem',
    fontWeight: '800',
    color: '#3182CE',
    backgroundColor: '#EBF8FF',
    padding: '2px 8px',
    borderRadius: '10px',
  },
  eventDesc: {
    fontSize: '0.78rem',
    color: '#111827',
    margin: '4px 0 8px 0',
    lineHeight: '1.3',
    fontWeight: '700',
  },
  eventMetaRow: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    flexWrap: 'wrap',
    gap: '4px',
  },
  eventRewards: {
    display: 'flex',
    gap: '10px',
  },
  eventRewardItem: {
    fontSize: '0.72rem',
    fontWeight: '800',
    color: '#0F5132',
  },
  eventDate: {
    fontSize: '0.72rem',
    fontWeight: '800',
    color: '#111827',
  },
  emptyState: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    padding: '40px 20px',
    color: '#111827',
  },
  missionsList: {
    display: 'flex',
    flexDirection: 'column',
    gap: '12px',
  },
  missionCard: {
    border: '1px solid #C8E6C9',
    borderRadius: '16px',
    padding: '12px',
    backgroundColor: '#FFFFFF',
    display: 'flex',
    flexDirection: 'column',
    gap: '6px',
  },
  missionHeader: {
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
  },
  missionCheckbox: {
    width: '18px',
    height: '18px',
    borderRadius: '4px',
    border: '1.5px solid #111827',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    color: '#48BB78',
    fontSize: '0.7rem',
    fontWeight: 'bold',
    flexShrink: 0,
  },
  missionTitle: {
    fontSize: '0.82rem',
    fontWeight: '800',
  },
  missionProgressRow: {
    display: 'flex',
    alignItems: 'center',
    gap: '10px',
  },
  missionProgressOuter: {
    flex: 1,
    height: '6px',
    backgroundColor: '#EDF2F7',
    borderRadius: '3px',
    overflow: 'hidden',
  },
  missionProgressInner: {
    height: '100%',
    backgroundColor: '#48BB78',
    borderRadius: '3px',
  },
  missionProgressLabel: {
    fontSize: '0.74rem',
    fontWeight: '800',
    color: '#111827',
    flexShrink: 0,
  },
  missionRewards: {
    display: 'flex',
    gap: '10px',
  },
  missionRewardVal: {
    fontSize: '0.72rem',
    fontWeight: '800',
    color: '#0F5132',
  },
  middleRow: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
    gap: '20px',
  },
  gridCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: '20px',
    padding: '24px',
    boxShadow: '0 4px 18px rgba(0, 0, 0, 0.02)',
    border: '1px solid #C8E6C9',
  },
  cardHeader: {
    fontSize: '1.05rem',
    fontWeight: '900',
    color: '#111827',
    margin: '0 0 20px 0',
  },
  headerWithAction: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: '20px',
  },
  viewAllBtn: {
    fontSize: '0.82rem',
    fontWeight: '800',
    color: '#3182CE',
    background: 'none',
    border: 'none',
    cursor: 'pointer',
    padding: '4px 8px',
    borderRadius: '6px',
    transition: 'background-color 0.2s',
  },
  progressContent: {
    display: 'flex',
    alignItems: 'center',
    gap: '24px',
  },
  circularWrapper: {
    flexShrink: 0,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
  gaugeText: {
    fontSize: '1.45rem',
    fontWeight: '900',
    fill: '#0F5132',
  },
  gaugeLabel: {
    fontSize: '0.52rem',
    fontWeight: '900',
    fill: '#111827',
    textTransform: 'uppercase',
  },
  topicsList: {
    display: 'flex',
    flexDirection: 'column',
    gap: '12px',
    flex: 1,
  },
  topicItem: {
    display: 'flex',
    flexDirection: 'column',
    gap: '4px',
  },
  topicHeader: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    fontSize: '0.78rem',
    fontWeight: '800',
    color: '#111827',
  },
  topicName: {
    color: '#111827',
  },
  topicPercent: {
    color: '#111827',
  },
  topicTrack: {
    width: '100%',
    height: '6px',
    backgroundColor: '#EDF2F7',
    borderRadius: '3px',
    overflow: 'hidden',
  },
  topicBar: {
    height: '100%',
    borderRadius: '3px',
  },
  badgesContainer: {
    display: 'flex',
    justifyContent: 'space-around',
    alignItems: 'center',
    height: 'calc(100% - 40px)',
    padding: '10px 0',
  },
  badgeCard: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    textAlign: 'center',
    gap: '8px',
  },
  badgeTitle: {
    fontSize: '0.82rem',
    fontWeight: '800',
    color: '#111827',
  },
  badgeStatus: {
    fontSize: '0.72rem',
    fontWeight: '800',
    color: '#0F5132',
    backgroundColor: '#E6F4EA',
    padding: '2px 8px',
    borderRadius: '12px',
  },
  leaderboardList: {
    display: 'flex',
    flexDirection: 'column',
    gap: '8px',
  },
  leaderboardRow: {
    display: 'flex',
    alignItems: 'center',
    padding: '8px 12px',
    borderRadius: '12px',
    transition: 'all 0.2s',
  },
  leaderboardRank: {
    width: '28px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    flexShrink: 0,
  },
  medal: {
    width: '20px',
    height: '20px',
    borderRadius: '50%',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontSize: '0.75rem',
    fontWeight: '800',
  },
  rankNum: {
    fontSize: '0.8rem',
    fontWeight: '800',
    color: '#111827',
  },
  lbAvatar: {
    width: '32px',
    height: '32px',
    borderRadius: '50%',
    margin: '0 12px',
    backgroundColor: '#E2E8F0',
  },
  lbInfo: {
    flex: 1,
    display: 'flex',
    alignItems: 'center',
  },
  lbName: {
    fontSize: '0.85rem',
    color: '#111827',
  },
  youTag: {
    fontSize: '0.72rem',
    fontWeight: '800',
    color: '#48BB78',
    marginLeft: '4px',
  },
  lbPoints: {
    fontSize: '0.85rem',
  },
  bottomRow: {
    display: 'flex',
    gap: '20px',
    flexWrap: 'wrap',
  },
  activitiesList: {
    display: 'flex',
    flexDirection: 'column',
    gap: '14px',
  },
  activityRow: {
    display: 'flex',
    alignItems: 'center',
    gap: '14px',
  },
  activityIcon: {
    width: '36px',
    height: '36px',
    borderRadius: '10px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    flexShrink: 0,
  },
  activityBody: {
    display: 'flex',
    flexDirection: 'column',
    flex: 1,
  },
  activityTitle: {
    fontSize: '0.85rem',
    fontWeight: '700',
    color: '#111827',
  },
  activityTime: {
    fontSize: '0.75rem',
    fontWeight: '700',
    color: '#4A5568',
    marginTop: '2px',
  },
  activityPoints: {
    fontSize: '0.85rem',
    fontWeight: '800',
    color: '#2E7D32',
  },
  treeSectionContainer: {
    display: 'flex',
    alignItems: 'center',
    gap: '16px',
  },
  treeEmojiWrapper: {
    flexShrink: 0,
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    gap: '4px',
  },
  tree3DBox: {
    width: '60px',
    height: '60px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    perspective: '800px',
    transformStyle: 'preserve-3d',
  },
  treeEmoji: {
    fontSize: '3.2rem',
    display: 'inline-block',
  },
  rotRow: {
    display: 'flex',
    gap: '4px',
  },
  rotBtn: {
    border: '1px solid #C8E6C9',
    borderRadius: '6px',
    backgroundColor: '#FAFDFB',
    color: '#0F5132',
    fontSize: '0.75rem',
    padding: '2px 6px',
    cursor: 'pointer',
    fontWeight: '700',
  },
  treeDetails: {
    display: 'flex',
    flexDirection: 'column',
    flex: 1,
  },
  stageTitle: {
    fontSize: '0.88rem',
    fontWeight: '800',
    color: '#111827',
  },
  stageLevel: {
    fontSize: '0.74rem',
    fontWeight: '700',
    color: '#111827',
    marginTop: '1px',
  },
  treeProgressTrack: {
    width: '100%',
    height: '6px',
    backgroundColor: '#EDF2F7',
    borderRadius: '3px',
    overflow: 'hidden',
    margin: '6px 0',
  },
  treeProgressBar: {
    height: '100%',
    backgroundColor: '#48BB78',
    borderRadius: '3px',
  },
  xpLabel: {
    fontSize: '0.72rem',
    fontWeight: '700',
    color: '#111827',
  },
  dividerLine: {
    height: '1px',
    backgroundColor: '#EAECEF',
    margin: '16px 0',
  },
  nurtureControls: {
    display: 'flex',
    flexDirection: 'column',
    gap: '8px',
  },
  nurtureTitle: {
    fontSize: '0.76rem',
    fontWeight: '800',
    color: '#111827',
    textTransform: 'uppercase',
  },
  nurtureButtonsRow: {
    display: 'flex',
    gap: '8px',
    flexWrap: 'wrap',
  },
  nurtureBtn: {
    flex: 1,
    minWidth: '95px',
    padding: '8px 12px',
    borderRadius: '10px',
    border: '1px solid #C8E6C9',
    backgroundColor: '#F4FBF5',
    color: '#0F5132',
    fontSize: '0.75rem',
    fontWeight: '800',
    cursor: 'pointer',
    textAlign: 'center',
    transition: 'all 0.2s',
  },
  treeTriviaBox: {
    display: 'flex',
    flexDirection: 'column',
    gap: '8px',
    backgroundColor: '#F8FAFC',
    border: '1px solid #C8E6C9',
    borderRadius: '12px',
    padding: '12px',
  },
  triviaHeaderRow: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  triviaTitle: {
    fontSize: '0.78rem',
    fontWeight: '900',
    color: '#D97706',
    textTransform: 'uppercase',
  },
  triviaCloseBtn: {
    background: 'none',
    border: 'none',
    fontSize: '0.85rem',
    fontWeight: '700',
    color: '#111827',
    cursor: 'pointer',
  },
  triviaText: {
    fontSize: '0.8rem',
    fontWeight: '800',
    color: '#111827',
    margin: '4px 0',
  },
  triviaOptsGrid: {
    display: 'flex',
    flexDirection: 'column',
    gap: '6px',
  },
  triviaOptBtn: {
    width: '100%',
    padding: '8px 12px',
    borderRadius: '8px',
    border: '1px solid transparent',
    fontSize: '0.75rem',
    fontWeight: '700',
    color: '#111827',
    textAlign: 'left',
    cursor: 'pointer',
    transition: 'all 0.2s',
  },
  triviaFeedbackText: {
    fontSize: '0.74rem',
    fontWeight: '800',
    marginTop: '4px',
  },
  quickAccessCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: '20px',
    padding: '24px',
    boxShadow: '0 4px 18px rgba(0, 0, 0, 0.02)',
    border: '1px solid #C8E6C9',
    flex: 1,
  },
  quickAccessGrid: {
    display: 'grid',
    gridTemplateColumns: '1fr 1fr',
    gap: '12px',
  },
  quickActionBtn: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    gap: '8px',
    padding: '16px',
    borderRadius: '16px',
    border: '1px solid #C8E6C9',
    backgroundColor: '#FFFFFF',
    cursor: 'pointer',
    transition: 'all 0.2s',
    '&:hover': {
      transform: 'translateY(-2px)',
      boxShadow: '0 4px 12px rgba(46, 125, 50, 0.03)',
    }
  },
  quickIconCircle: {
    width: '40px',
    height: '40px',
    borderRadius: '50%',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
  quickActionLabel: {
    fontSize: '0.8rem',
    fontWeight: '800',
    color: '#111827',
  },
  quoteBanner: {
    backgroundColor: '#E8F5E9',
    borderRadius: '20px',
    padding: '20px 24px',
    boxShadow: '0 4px 18px rgba(46, 125, 50, 0.02)',
    border: '1px solid #C8E6C9',
  },
  quoteLeft: {
    display: 'flex',
    alignItems: 'center',
    gap: '16px',
  },
  sproutGroup: {
    display: 'flex',
    alignItems: 'flex-end',
    flexShrink: 0,
  },
  quoteText: {
    fontSize: '0.88rem',
    color: '#0F5132',
    lineHeight: '1.4',
    fontWeight: '700',
    margin: 0,
  }
};
