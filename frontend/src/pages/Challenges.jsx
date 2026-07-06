import React, { useState, useEffect, useContext } from 'react';
import axios from 'axios';
import { motion, AnimatePresence } from 'framer-motion';
import { Trophy, Calendar, Leaf, Star, Upload, FileCheck, AlertCircle } from 'lucide-react';
import { AuthContext } from '../context/AuthContext';

export default function Challenges() {
  const { refreshUserData } = useContext(AuthContext);

  const [activeChallenges, setActiveChallenges] = useState(() => {
    const saved = localStorage.getItem('ecoverse_active_challenges');
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        // Migrate/update target for tree plantation if it is 1
        return parsed.map(c => {
          if (c.id === 3 && c.target === 1) {
            return {
              ...c,
              target: 5,
              desc: "Plant a native tree sapling daily and upload a photo to log your progress."
            };
          }
          return c;
        });
      } catch (e) {
        console.error("Error reading challenges state", e);
      }
    }
    return [
      {
        id: 1,
        title: "Plastic-Free Week",
        desc: "Avoid single-use plastic bags, cups, and straws for 7 days. Log your daily success.",
        progress: 3,
        target: 7,
        rewardXp: 300,
        rewardCoins: 100,
        joined: true,
        category: "Waste",
        lastUpdated: null
      },
      {
        id: 2,
        title: "Water Conservation Sprint",
        desc: "Keep your daily water usage under 50 liters. Track bucket showers and tap aerator usage.",
        progress: 2,
        target: 5,
        rewardXp: 250,
        rewardCoins: 80,
        joined: true,
        category: "Water",
        lastUpdated: null
      },
      {
        id: 3,
        title: "Tree Plantation Drive",
        desc: "Plant a native tree sapling daily and upload a photo to log your progress.",
        progress: 0,
        target: 5,
        rewardXp: 500,
        rewardCoins: 200,
        joined: false,
        category: "Planting",
        lastUpdated: null
      }
    ];
  });

  const [toastMessage, setToastMessage] = useState("");
  const [selectedFile, setSelectedFile] = useState(null);
  const [fileError, setFileError] = useState("");
  const [fileFeedback, setFileFeedback] = useState("");
  const [submittingProof, setSubmittingProof] = useState(false);
  const [currentTime, setCurrentTime] = useState(Date.now());

  // Force re-renders every second to drive the cooldown countdown ticker
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(Date.now());
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    localStorage.setItem('ecoverse_active_challenges', JSON.stringify(activeChallenges));
  }, [activeChallenges]);

  const getCooldownString = (lastUpdated) => {
    if (!lastUpdated) return null;
    const msPassed = currentTime - new Date(lastUpdated).getTime();
    const msRemaining = 24 * 60 * 60 * 1000 - msPassed;
    if (msRemaining <= 0) return null;

    const hrs = Math.floor(msRemaining / (1000 * 60 * 60));
    const mins = Math.floor((msRemaining % (1000 * 60 * 60)) / (1000 * 60));
    const secs = Math.floor((msRemaining % (1000 * 60)) / 1000);

    return `${hrs}h ${mins}m ${secs}s`;
  };

  const getDynamicEventDate = (baseMonth, baseDay, hourStr, recurrenceDays = 14) => {
    const currentYear = new Date().getFullYear();
    const monthNames = ["January", "February", "March", "April", "May", "June", 
                        "July", "August", "September", "October", "November", "December"];
    const monthIdx = monthNames.indexOf(baseMonth);
    
    let eventDate = new Date(currentYear, monthIdx, baseDay);
    const now = new Date();
    
    const eventEndOfDay = new Date(eventDate);
    eventEndOfDay.setHours(23, 59, 59, 999);
    
    while (now > eventEndOfDay) {
      eventDate.setDate(eventDate.getDate() + recurrenceDays);
      eventEndOfDay.setDate(eventEndOfDay.getDate() + recurrenceDays);
    }
    
    const updatedMonth = monthNames[eventDate.getMonth()];
    const updatedDay = eventDate.getDate();
    
    return `${updatedMonth} ${updatedDay} • ${hourStr}`;
  };

  const handleJoin = (id) => {
    setActiveChallenges(prev =>
      prev.map(c => c.id === id ? { ...c, joined: true, progress: 0, lastUpdated: null } : c)
    );
    const challenge = activeChallenges.find(c => c.id === id);
    showToast(`Joined challenge: ${challenge.title}! 🎉`);
  };

  const handleProgress = async (id) => {
    const challenge = activeChallenges.find(c => c.id === id);
    if (!challenge) return;

    // Double check cooldown in handler
    const cooldownStr = getCooldownString(challenge.lastUpdated);
    if (cooldownStr) {
      alert(`This challenge is on cooldown. Please wait ${cooldownStr} before logging progress again.`);
      return;
    }

    try {
      let isCompleted = false;
      const nextProgress = challenge.progress + 1;
      
      setActiveChallenges(prev =>
        prev.map(c => {
          if (c.id === id) {
            isCompleted = nextProgress >= c.target;
            return {
              ...c,
              progress: nextProgress >= c.target ? c.target : nextProgress,
              lastUpdated: new Date().toISOString()
            };
          }
          return c;
        })
      );

      if (nextProgress >= challenge.target) {
        await axios.post('/api/challenges/complete', {
          rewardXp: challenge.rewardXp,
          rewardCoins: challenge.rewardCoins
        });
        showToast(`Completed Challenge: ${challenge.title}! ⭐ +${challenge.rewardXp} XP & 🪙 +${challenge.rewardCoins} Coins added! 🎉`);
        await refreshUserData();
      } else {
        showToast(`Progress logged: ${nextProgress}/${challenge.target} days completed! Keep it up! 🌿`);
      }
    } catch (err) {
      console.error("Failed to submit challenge completion", err);
      alert("Progress logged locally, but failed to sync points with backend.");
    }
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    // Allowed file formats: png, jpeg, jpg, pdf
    const allowedTypes = ['application/pdf', 'image/png', 'image/jpeg', 'image/jpg'];
    const maxSize = 5 * 1024 * 1024; // 5MB

    if (!allowedTypes.includes(file.type)) {
      setFileError("Invalid format! Only PDF, PNG, and JPEG files are allowed.");
      setSelectedFile(null);
      setFileFeedback("");
      return;
    }

    if (file.size > maxSize) {
      setFileError("File too large! Maximum allowed size is 5MB.");
      setSelectedFile(null);
      setFileFeedback("");
      return;
    }

    setFileError("");
    setSelectedFile(file);
    setFileFeedback(`Loaded: ${file.name} (${(file.size / 1024).toFixed(1)} KB)`);
  };

  const handleSubmitProof = async (id) => {
    if (!selectedFile) {
      setFileError("Please select a file to upload as proof before submitting.");
      return;
    }

    const challenge = activeChallenges.find(c => c.id === id);
    if (!challenge) return;

    // Double check cooldown in handler
    const cooldownStr = getCooldownString(challenge.lastUpdated);
    if (cooldownStr) {
      alert(`This challenge is on cooldown. Please wait ${cooldownStr} before logging progress again.`);
      return;
    }

    setSubmittingProof(true);
    const formData = new FormData();
    formData.append('file', selectedFile);

    try {
      // 1. Upload proof file to backend
      const uploadRes = await axios.post('/api/upload', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      const uploadedUrl = uploadRes.data.url;

      // 2. Increment progress and check completion
      const nextProgress = challenge.progress + 1;
      let isCompleted = false;

      setActiveChallenges(prev =>
        prev.map(c => {
          if (c.id === id) {
            isCompleted = nextProgress >= c.target;
            return {
              ...c,
              progress: nextProgress >= c.target ? c.target : nextProgress,
              lastUpdated: new Date().toISOString(),
              proofUrl: uploadedUrl
            };
          }
          return c;
        })
      );

      // If completing, call completion API
      if (nextProgress >= challenge.target) {
        await axios.post('/api/challenges/complete', {
          rewardXp: challenge.rewardXp,
          rewardCoins: challenge.rewardCoins
        });
        showToast(`Proof verified! Challenge completed: ${challenge.title}! ⭐ +${challenge.rewardXp} XP & 🪙 +${challenge.rewardCoins} Coins! 🎉`);
        await refreshUserData();
      } else {
        showToast(`Day ${nextProgress}/${challenge.target} logged! Photo proof uploaded successfully! 🌱`);
      }

      setSelectedFile(null);
      setFileFeedback("");
    } catch (err) {
      console.error("Failed to upload proof or complete challenge", err);
      alert("Error submitting proof. Please check your network and try again.");
    } finally {
      setSubmittingProof(false);
    }
  };

  const showToast = (msg) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(""), 5000);
  };

  return (
    <div style={styles.container}>

      {/* Toast Notification */}
      <AnimatePresence>
        {toastMessage && (
          <motion.div
            initial={{ opacity: 0, y: -50, x: '-50%' }}
            animate={{ opacity: 1, y: 0, x: '-50%' }}
            exit={{ opacity: 0, y: -50, x: '-50%' }}
            style={styles.toast}
          >
            {toastMessage}
          </motion.div>
        )}
      </AnimatePresence>

      <div style={styles.header}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <Trophy size={28} color="#2e7d32" />
          <h1 style={styles.title}>Environmental Challenges</h1>
        </div>
        <p style={styles.subtitle}>Join global and community environmental challenges to earn XP, badges, and plant real trees!</p>
      </div>

      <div style={styles.contentGrid}>
        {/* Left Side: Challenges List */}
        <div style={styles.leftCol}>
          <h2 style={styles.sectionTitle}>Active Challenges</h2>
          <div style={styles.challengesList}>
            {activeChallenges.map((c) => {
              const progressPercent = Math.min((c.progress * 100) / c.target, 100);
              const isCompleted = c.progress >= c.target;
              const cooldownStr = getCooldownString(c.lastUpdated);

              return (
                <motion.div
                  key={c.id}
                  style={styles.challengeCard}
                  whileHover={{ y: -2, boxShadow: '0 4px 20px rgba(0, 0, 0, 0.03)' }}
                >
                  <div style={styles.cardHeader}>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                      <span style={{ ...styles.categoryBadge, backgroundColor: getCategoryBg(c.category), color: getCategoryColor(c.category) }}>
                        {c.category}
                      </span>
                      <h3 style={styles.challengeTitle}>{c.title}</h3>
                    </div>
                    <div style={styles.rewardsRow}>
                      <span style={styles.rewardXp}>⭐ {c.rewardXp} XP</span>
                      <span style={styles.rewardCoins}>🪙 {c.rewardCoins}</span>
                    </div>
                  </div>

                  <p style={styles.challengeDesc}>{c.desc}</p>

                  {c.joined ? (
                    <div style={styles.progressContainer}>
                      <div style={styles.progressHeader}>
                        <span style={styles.progressLabel}>
                          {isCompleted ? 'Completed!' : `Progress: ${c.progress} / ${c.target} completed`}
                        </span>
                        <span style={styles.progressPercent}>{Math.round(progressPercent)}%</span>
                      </div>
                      <div style={styles.progressBarOuter}>
                        <div style={{ ...styles.progressBarInner, width: `${progressPercent}%`, backgroundColor: isCompleted ? '#2e7d32' : '#7fb77e' }} />
                      </div>

                      {/* Render File Upload Area specifically for Tree Plantation Drive (id = 3) when joined but not completed */}
                      {!isCompleted && c.id === 3 ? (
                        cooldownStr ? (
                          <button style={{ ...styles.actionBtn, ...styles.disabledBtn }} disabled>
                            Next Upload: {cooldownStr}
                          </button>
                        ) : (
                          <div style={styles.uploadArea}>
                            <span style={styles.uploadLabel}>Upload Tree Planting Proof:</span>
                            
                            <div style={styles.uploadBox}>
                              <Upload size={22} color="#7fb77e" />
                              <input
                                type="file"
                                accept=".pdf,.png,.jpeg,.jpg"
                                onChange={handleFileChange}
                                style={styles.fileInput}
                                id="tree-proof-upload"
                                disabled={submittingProof}
                              />
                              <label htmlFor="tree-proof-upload" style={styles.fileLabel}>
                                {selectedFile ? 'Change File' : 'Choose Image / PDF'}
                              </label>
                              <span style={styles.uploadHelp}>PDF, PNG, JPEG less than 5MB</span>
                            </div>

                            {/* Success/Error Feedback */}
                            <AnimatePresence mode="wait">
                              {fileError && (
                                <motion.div 
                                  style={styles.errorText}
                                  initial={{ opacity: 0, y: -5 }}
                                  animate={{ opacity: 1, y: 0 }}
                                  exit={{ opacity: 0 }}
                                >
                                  <AlertCircle size={14} />
                                  <span>{fileError}</span>
                                </motion.div>
                              )}

                              {fileFeedback && (
                                <motion.div 
                                  style={styles.successText}
                                  initial={{ opacity: 0, y: -5 }}
                                  animate={{ opacity: 1, y: 0 }}
                                  exit={{ opacity: 0 }}
                                >
                                  <FileCheck size={14} />
                                  <span>{fileFeedback}</span>
                                </motion.div>
                              )}
                            </AnimatePresence>

                            <button 
                              style={{
                                ...styles.submitProofBtn,
                                backgroundColor: selectedFile && !submittingProof ? '#2e7d32' : '#a0aec0',
                                cursor: selectedFile && !submittingProof ? 'pointer' : 'not-allowed'
                              }} 
                              onClick={() => handleSubmitProof(c.id)}
                              disabled={!selectedFile || submittingProof}
                            >
                              {submittingProof ? 'Uploading Proof...' : 'Submit Proof & Log Day'}
                            </button>
                          </div>
                        )
                      ) : (
                        !isCompleted && (
                          cooldownStr ? (
                            <button style={{ ...styles.actionBtn, ...styles.disabledBtn }} disabled>
                              Logged Today • {cooldownStr}
                            </button>
                          ) : (
                            <button style={styles.actionBtn} onClick={() => handleProgress(c.id)}>
                              Log Today's Effort
                            </button>
                          )
                        )
                      )}
                    </div>
                  ) : (
                    <button style={styles.joinBtn} onClick={() => handleJoin(c.id)}>
                      Join Challenge
                    </button>
                  )}
                </motion.div>
              );
            })}
          </div>
        </div>

        {/* Right Side: Sidebar Info */}
        <div style={styles.rightCol}>
          <div style={styles.infoCard}>
            <h3 style={styles.infoTitle}>Leaderboard Standing</h3>
            <div style={styles.standingRow}>
              <div style={styles.avatarCircle}>A</div>
              <div>
                <div style={{ fontWeight: '700', color: '#2d3748' }}>Arjun</div>
                <div style={{ fontSize: '0.8rem', color: '#718096' }}>Rank #4 • Eco Warrior</div>
              </div>
            </div>
            <div style={styles.divider} />
            <h4 style={styles.upcomingTitle}>Upcoming Community Events</h4>
            <div style={styles.eventItem}>
              <Calendar size={18} color="#2e7d32" />
              <div>
                <div style={{ fontWeight: '600', fontSize: '0.85rem' }}>E-Waste Collection Drive</div>
                <div style={{ fontSize: '0.75rem', color: '#718096' }}>{getDynamicEventDate("July", 12, "09:00 AM", 14)}</div>
              </div>
            </div>
            <div style={styles.eventItem}>
              <Calendar size={18} color="#2e7d32" />
              <div>
                <div style={{ fontWeight: '600', fontSize: '0.85rem' }}>Bayside Cleanup Marathon</div>
                <div style={{ fontSize: '0.75rem', color: '#718096' }}>{getDynamicEventDate("July", 18, "07:00 AM", 14)}</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

const getCategoryBg = (cat) => {
  if (cat === "Waste") return '#e6f4ea';
  if (cat === "Water") return '#e0f2fe';
  return '#fef3c7';
};

const getCategoryColor = (cat) => {
  if (cat === "Waste") return '#2e7d32';
  if (cat === "Water") return '#0284c7';
  return '#d97706';
};

const styles = {
  container: {
    paddingBottom: '40px',
  },
  header: {
    marginBottom: '28px',
  },
  title: {
    fontSize: '2rem',
    fontWeight: '800',
    color: '#0F3A20',
  },
  subtitle: {
    fontSize: '1rem',
    color: '#718096',
    marginTop: '6px',
  },
  contentGrid: {
    display: 'grid',
    gridTemplateColumns: '2fr 1fr',
    gap: '24px',
  },
  leftCol: {
    display: 'flex',
    flexDirection: 'column',
    gap: '16px',
  },
  sectionTitle: {
    fontSize: '1.25rem',
    fontWeight: '700',
    color: '#1a202c',
    marginBottom: '8px',
  },
  challengesList: {
    display: 'flex',
    flexDirection: 'column',
    gap: '20px',
  },
  challengeCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: '16px',
    padding: '24px',
    boxShadow: '0 4px 20px rgba(0,0,0,0.01)',
    border: '1px solid rgba(0,0,0,0.02)',
    display: 'flex',
    flexDirection: 'column',
    gap: '16px',
  },
  cardHeader: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
  },
  categoryBadge: {
    alignSelf: 'flex-start',
    padding: '4px 10px',
    borderRadius: '20px',
    fontSize: '0.75rem',
    fontWeight: '700',
    textTransform: 'uppercase',
  },
  challengeTitle: {
    fontSize: '1.2rem',
    fontWeight: '800',
    color: '#1a202c',
    marginTop: '4px',
  },
  rewardsRow: {
    display: 'flex',
    gap: '10px',
    fontWeight: '700',
    fontSize: '0.9rem',
  },
  rewardXp: {
    color: '#2e7d32',
  },
  rewardCoins: {
    color: '#d97706',
  },
  challengeDesc: {
    fontSize: '0.9rem',
    color: '#4a5568',
    lineHeight: '1.5',
  },
  progressContainer: {
    display: 'flex',
    flexDirection: 'column',
    gap: '10px',
    marginTop: '4px',
  },
  progressHeader: {
    display: 'flex',
    justifyContent: 'space-between',
    fontSize: '0.85rem',
    fontWeight: '600',
    color: '#4a5568',
  },
  progressBarOuter: {
    height: '10px',
    backgroundColor: '#edf2f7',
    borderRadius: '5px',
    overflow: 'hidden',
  },
  progressBarInner: {
    height: '100%',
    borderRadius: '5px',
    transition: 'width 0.3s ease',
  },
  actionBtn: {
    alignSelf: 'flex-end',
    backgroundColor: '#2e7d32',
    color: '#FFFFFF',
    border: 'none',
    borderRadius: '8px',
    padding: '10px 18px',
    fontSize: '0.85rem',
    fontWeight: '700',
    cursor: 'pointer',
    marginTop: '6px',
    transition: 'all 0.2s ease',
  },
  disabledBtn: {
    backgroundColor: '#cbd5e0',
    color: '#4a5568',
    cursor: 'not-allowed',
    border: '1px solid #a0aec0',
  },
  uploadArea: {
    display: 'flex',
    flexDirection: 'column',
    gap: '10px',
    marginTop: '12px',
    padding: '16px',
    backgroundColor: '#f8faf8',
    borderRadius: '12px',
    border: '1px solid #e2ebd9',
  },
  uploadLabel: {
    fontSize: '0.88rem',
    fontWeight: '700',
    color: '#2d3748',
  },
  uploadBox: {
    border: '2px dashed #7fb77e',
    borderRadius: '12px',
    padding: '20px',
    textAlign: 'center',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    gap: '8px',
    backgroundColor: '#ffffff',
    position: 'relative',
  },
  fileInput: {
    display: 'none',
  },
  fileLabel: {
    backgroundColor: '#e6f4ea',
    color: '#2e7d32',
    padding: '8px 16px',
    borderRadius: '6px',
    fontWeight: '700',
    fontSize: '0.85rem',
    cursor: 'pointer',
    border: '1px solid #7fb77e',
    transition: 'all 0.2s ease',
  },
  uploadHelp: {
    fontSize: '0.75rem',
    color: '#718096',
  },
  errorText: {
    display: 'flex',
    alignItems: 'center',
    gap: '6px',
    color: '#dc2626',
    fontSize: '0.82rem',
    fontWeight: '600',
  },
  successText: {
    display: 'flex',
    alignItems: 'center',
    gap: '6px',
    color: '#2e7d32',
    fontSize: '0.82rem',
    fontWeight: '600',
  },
  submitProofBtn: {
    width: '100%',
    color: '#FFFFFF',
    border: 'none',
    borderRadius: '8px',
    padding: '10px',
    fontWeight: '700',
    fontSize: '0.9rem',
    marginTop: '6px',
    transition: 'all 0.2s ease',
  },
  joinBtn: {
    alignSelf: 'flex-start',
    backgroundColor: '#2e7d32',
    color: '#FFFFFF',
    border: 'none',
    borderRadius: '8px',
    padding: '10px 20px',
    fontSize: '0.9rem',
    fontWeight: '700',
    cursor: 'pointer',
  },
  rightCol: {
    display: 'flex',
    flexDirection: 'column',
  },
  infoCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: '16px',
    padding: '24px',
    boxShadow: '0 4px 20px rgba(0,0,0,0.01)',
    border: '1px solid rgba(0,0,0,0.02)',
    display: 'flex',
    flexDirection: 'column',
    gap: '16px',
  },
  infoTitle: {
    fontSize: '1.1rem',
    fontWeight: '700',
    color: '#1a202c',
  },
  standingRow: {
    display: 'flex',
    alignItems: 'center',
    gap: '12px',
  },
  avatarCircle: {
    width: '40px',
    height: '40px',
    borderRadius: '50%',
    backgroundColor: '#C8E6C9',
    color: '#2e7d32',
    fontSize: '1.2rem',
    fontWeight: '800',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
  divider: {
    height: '1px',
    backgroundColor: '#edf2f7',
  },
  upcomingTitle: {
    fontSize: '0.95rem',
    fontWeight: '700',
    color: '#1a202c',
    marginBottom: '4px',
  },
  eventItem: {
    display: 'flex',
    gap: '12px',
    alignItems: 'center',
  },
  toast: {
    position: 'fixed',
    top: '30px',
    left: '55%',
    backgroundColor: '#1b4d2c',
    color: '#FFFFFF',
    padding: '14px 28px',
    borderRadius: '30px',
    boxShadow: '0 10px 25px rgba(0,0,0,0.2)',
    fontWeight: '700',
    fontSize: '0.95rem',
    zIndex: 10000,
    maxWidth: '400px',
    textAlign: 'center',
  }
};
