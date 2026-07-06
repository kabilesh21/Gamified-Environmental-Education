import React, { useState, useEffect, useContext } from 'react';
import axios from 'axios';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import { Award, Trophy, User as UserIcon, Calendar, School, ShieldCheck, Mail, Bookmark, Star, Lock, Edit } from 'lucide-react';

export default function Profile() {
  const { user } = useContext(AuthContext);
  const navigate = useNavigate();
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  
  const [avatarUrl, setAvatarUrl] = useState(
    localStorage.getItem('ecoverse_custom_avatar') || ''
  );

  useEffect(() => {
    const handleAvatarUpdate = () => {
      setAvatarUrl(localStorage.getItem('ecoverse_custom_avatar') || (profile ? profile.profilePicture : ''));
    };
    window.addEventListener('storage_avatar_updated', handleAvatarUpdate);
    return () => window.removeEventListener('storage_avatar_updated', handleAvatarUpdate);
  }, [profile]);

  // List of all default badges so we can show locked ones as grayed out
  const defaultBadges = [
    { name: "Eco Beginner", description: "Completed your first eco course", icon: "award" },
    { name: "Green Learner", description: "Reaching high levels of green knowledge", icon: "leaf" },
    { name: "Water Saver", description: "Mastered water conservation principles", icon: "droplet" },
    { name: "Climate Hero", description: "Unlocked for advanced climate change knowledge", icon: "shield" },
    { name: "Quiz Master", description: "Earned a perfect 100% score on any quiz", icon: "star" },
  ];

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const res = await axios.get('/api/profile');
        setProfile(res.data);
      } catch (err) {
        console.error("Failed to load user profile", err);
      } finally {
        setLoading(false);
      }
    };
    fetchProfile();
  }, []);

  if (loading || !profile) {
    return (
      <div style={styles.loading}>
        <div className="btn btn-ghost">Loading Profile Cabinet...</div>
      </div>
    );
  }

  // Check if user has unlocked a badge by name
  const isBadgeUnlocked = (badgeName) => {
    return profile.unlockedBadges?.some(b => b.name === badgeName);
  };

  return (
    <div style={styles.container}>

      {/* Profile Info Header */}
      <motion.div
        style={styles.profileHeaderCard}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <div style={styles.headerDetails}>
          <img src={avatarUrl || profile.profilePicture} alt="Profile Avatar" style={styles.avatar} />
          <div style={styles.infoMeta}>
            <div style={styles.roleTag}>{profile.role === 'ROLE_ADMIN' ? 'Administrator' : 'Eco Citizen'}</div>
            <h2 style={styles.name}>{profile.fullName}</h2>
            <div style={styles.metaGrid}>
              <div style={styles.metaItem}>
                <Mail size={16} color="#A39387" />
                <span>{profile.email}</span>
              </div>
              <div style={styles.metaItem}>
                <School size={16} color="#A39387" />
                <span>{profile.institutionName} (Grade {profile.grade})</span>
              </div>
              {profile.department && (
                <div style={styles.metaItem}>
                  <Bookmark size={16} color="#A39387" />
                  <span>{profile.department}</span>
                </div>
              )}
            </div>
            <button 
              onClick={() => navigate('/settings')}
              style={styles.editBtn}
            >
              <Edit size={14} />
              <span>Edit Profile</span>
            </button>
          </div>
        </div>

        {/* Global Level Details */}
        <motion.div
          style={styles.levelCard}
          whileHover={{
            rotateY: -15,
            rotateX: 10,
            perspective: 800,
            scale: 1.05,
            boxShadow: "0 14px 28px rgba(139, 107, 74, 0.12)"
          }}
        >
          <span style={styles.levelLabel}>Current Level</span>
          <span style={styles.levelVal}>{profile.level}</span>
          <span style={styles.xpLabel}>{profile.xp} Total XP</span>
        </motion.div>
      </motion.div>

      {/* Grid: Badges & Achievements split */}
      <div style={styles.cabinetLayout}>
        
        {/* Left: Badge Cabinet */}
        <motion.div
          style={styles.cabinetSection}
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.2 }}
        >
          <div style={styles.sectionHeader}>
            <Award size={20} color="#8B6B4A" />
            <h3 style={styles.sectionTitle}>Badge Cabinet</h3>
          </div>
          
          <div style={styles.badgeGrid}>
            {defaultBadges.map((badge, idx) => {
              const unlocked = isBadgeUnlocked(badge.name);
              return (
                <div
                  key={idx}
                  style={{
                    ...styles.badgeRow,
                    opacity: unlocked ? 1 : 0.6,
                  }}
                >
                  <div style={{
                    ...styles.badgeIconBg,
                    backgroundColor: unlocked ? '#F8F5F1' : '#EADBCE',
                    borderColor: unlocked ? '#7FB77E' : '#A39387',
                    filter: unlocked ? 'none' : 'grayscale(100%)',
                  }}>
                    {unlocked ? (
                      <Star size={24} color="#7FB77E" fill="#7FB77E" />
                    ) : (
                      <Lock size={20} color="#A39387" />
                    )}
                  </div>
                  <div style={styles.badgeText}>
                    <h4 style={{
                      ...styles.badgeName,
                      color: unlocked ? '#2D241E' : '#A39387',
                    }}>{badge.name}</h4>
                    <p style={styles.badgeDesc}>{badge.description}</p>
                  </div>
                </div>
              );
            })}
          </div>
        </motion.div>

        {/* Right: Milestone Achievements Log */}
        <motion.div
          style={styles.cabinetSection}
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.2 }}
        >
          <div style={styles.sectionHeader}>
            <ShieldCheck size={20} color="#8B6B4A" />
            <h3 style={styles.sectionTitle}>Milestone Achievements</h3>
          </div>

          <div style={styles.achievementList}>
            {profile.unlockedAchievements?.length > 0 ? (
              profile.unlockedAchievements.map((ach) => (
                <div key={ach.id} style={styles.achievementRow}>
                  <div style={styles.achHeader}>
                    <span style={styles.achName}>{ach.name}</span>
                    <span style={styles.achXp}>+{ach.xpReward} XP</span>
                  </div>
                  <p style={styles.achDesc}>{ach.description}</p>
                  <span style={styles.achDate}>Unlocked: {ach.unlockedAt}</span>
                </div>
              ))
            ) : (
              <div style={styles.emptyCabinet}>
                <p>No achievements unlocked yet. Continue learning to complete milestones!</p>
              </div>
            )}
          </div>
        </motion.div>
      </div>
    </div>
  );
}

const styles = {
  container: {
    display: 'flex',
    flexDirection: 'column',
    gap: '24px',
  },
  editBtn: {
    marginTop: '16px',
    alignSelf: 'flex-start',
    backgroundColor: '#8B6B4A',
    color: '#FFFFFF',
    border: 'none',
    borderRadius: '8px',
    padding: '8px 16px',
    fontSize: '0.85rem',
    fontWeight: '600',
    cursor: 'pointer',
    display: 'inline-flex',
    alignItems: 'center',
    gap: '8px',
    transition: 'all 0.2s ease',
  },
  loading: {
    minHeight: '80vh',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
  profileHeaderCard: {
    backgroundColor: '#FFFFFF',
    border: '1px solid #EADBCE',
    borderRadius: '20px',
    padding: '30px',
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    flexWrap: 'wrap',
    gap: '24px',
    boxShadow: '0 4px 12px rgba(139, 107, 74, 0.03)',
  },
  headerDetails: {
    display: 'flex',
    alignItems: 'center',
    gap: '24px',
    flexWrap: 'wrap',
  },
  avatar: {
    width: '100px',
    height: '100px',
    borderRadius: '50%',
    backgroundColor: '#C3AED6',
    border: '3px solid #7FB77E',
  },
  infoMeta: {
    display: 'flex',
    flexDirection: 'column',
  },
  roleTag: {
    fontSize: '0.75rem',
    fontWeight: '700',
    color: '#A39387',
    textTransform: 'uppercase',
    letterSpacing: '1px',
    marginBottom: '6px',
  },
  name: {
    fontSize: '1.8rem',
    fontWeight: '800',
    color: '#8B6B4A',
    marginBottom: '12px',
  },
  metaGrid: {
    display: 'flex',
    flexDirection: 'column',
    gap: '8px',
  },
  metaItem: {
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
    fontSize: '0.9rem',
    color: '#6E5C50',
  },
  levelCard: {
    backgroundColor: '#F8F5F1',
    border: '1px solid #EADBCE',
    borderRadius: '16px',
    padding: '20px 30px',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    minWidth: '160px',
  },
  levelLabel: {
    fontSize: '0.75rem',
    fontWeight: '700',
    color: '#A39387',
    textTransform: 'uppercase',
  },
  levelVal: {
    fontSize: '2.5rem',
    fontWeight: '800',
    color: '#8B6B4A',
    lineHeight: '1',
    margin: '6px 0',
  },
  xpLabel: {
    fontSize: '0.8rem',
    fontWeight: '700',
    color: '#7FB77E',
  },
  cabinetLayout: {
    display: 'flex',
    gap: '24px',
    flexWrap: 'wrap',
  },
  cabinetSection: {
    flex: 1,
    minWidth: '320px',
    backgroundColor: '#FFFFFF',
    border: '1px solid #EADBCE',
    borderRadius: '20px',
    padding: '24px',
    boxShadow: '0 4px 12px rgba(139, 107, 74, 0.03)',
  },
  sectionHeader: {
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
    marginBottom: '20px',
    borderBottom: '1px solid #F8F5F1',
    paddingBottom: '14px',
  },
  sectionTitle: {
    fontSize: '1.15rem',
    fontWeight: '700',
    color: '#8B6B4A',
  },
  badgeGrid: {
    display: 'flex',
    flexDirection: 'column',
    gap: '16px',
  },
  badgeRow: {
    display: 'flex',
    alignItems: 'center',
    gap: '16px',
  },
  badgeIconBg: {
    width: '56px',
    height: '56px',
    borderRadius: '16px',
    border: '2px solid',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    flexShrink: 0,
  },
  badgeText: {
    display: 'flex',
    flexDirection: 'column',
  },
  badgeName: {
    fontSize: '0.95rem',
    fontWeight: '700',
  },
  badgeDesc: {
    fontSize: '0.8rem',
    color: '#6E5C50',
    marginTop: '2px',
  },
  achievementList: {
    display: 'flex',
    flexDirection: 'column',
    gap: '16px',
  },
  achievementRow: {
    backgroundColor: '#F8F5F1',
    border: '1px solid #EADBCE',
    borderRadius: '14px',
    padding: '16px',
  },
  achHeader: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: '6px',
  },
  achName: {
    fontWeight: '700',
    color: '#2D241E',
    fontSize: '0.95rem',
  },
  achXp: {
    fontSize: '0.8rem',
    fontWeight: '700',
    color: '#7FB77E',
    backgroundColor: 'rgba(127, 183, 126, 0.15)',
    padding: '4px 8px',
    borderRadius: '8px',
  },
  achDesc: {
    fontSize: '0.82rem',
    color: '#6E5C50',
    marginBottom: '8px',
    lineHeight: '1.4',
  },
  achDate: {
    fontSize: '0.72rem',
    color: '#A39387',
    fontWeight: '500',
  },
  emptyCabinet: {
    textAlign: 'center',
    padding: '40px 20px',
    color: '#A39387',
  },
};
