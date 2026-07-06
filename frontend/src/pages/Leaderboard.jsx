import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { motion } from 'framer-motion';
import { Trophy, Star, Award, Shield, User } from 'lucide-react';

export default function Leaderboard() {
  const [ranks, setRanks] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchLeaderboard = async () => {
      try {
        const res = await axios.get('/api/leaderboard');
        setRanks(res.data);
      } catch (err) {
        console.error("Failed to load leaderboard details", err);
      } finally {
        setLoading(false);
      }
    };
    fetchLeaderboard();
  }, []);

  if (loading) {
    return (
      <div style={styles.loading}>
        <div className="btn btn-ghost">Loading Leaderboard...</div>
      </div>
    );
  }

  // Extract top 3 and list entries (rank 4+)
  const top1 = ranks.find(r => r.rank === 1);
  const top2 = ranks.find(r => r.rank === 2);
  const top3 = ranks.find(r => r.rank === 3);
  const remaining = ranks.filter(r => r.rank > 3);

  return (
    <div style={styles.container}>

      <motion.div
        initial={{ rotateX: 10, rotateY: 5, perspective: 1200, opacity: 0, y: 30 }}
        animate={{ rotateX: 0, rotateY: 0, perspective: 1200, opacity: 1, y: 0 }}
        transition={{ duration: 0.8, ease: "easeOut" }}
      >
        <div style={styles.header}>
          <h1 style={styles.title}>Global Leaderboard</h1>
          <p style={styles.subtitle}>Compete with other Eco Citizens. Unlocking courses, lessons, and perfect quizzes awards XP!</p>
        </div>

      {/* Podium Showcase for Top 3 */}
      {ranks.length > 0 && (
        <div style={styles.podiumContainer}>
          {/* Rank 2 (Left) */}
          <div style={styles.podiumCol}>
            {top2 ? (
              <motion.div
                style={styles.podiumUserCard}
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.2 }}
              >
                <div style={styles.badgeSecond}>2</div>
                <img src={top2.profilePicture} alt="2nd" style={styles.podiumAvatar} />
                <span style={styles.podiumName}>{top2.fullName}</span>
                <span style={styles.podiumXp}>{top2.xp} XP</span>
              </motion.div>
            ) : <div style={{ height: '140px' }} />}
            <div style={{ ...styles.podiumBlock, height: '80px', backgroundColor: '#E5E8EB' }}>
              <span style={styles.podiumNum}>2nd</span>
            </div>
          </div>

          {/* Rank 1 (Center - Tallest) */}
          <div style={styles.podiumCol}>
            {top1 ? (
              <motion.div
                style={styles.podiumUserCard}
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
              >
                <div style={styles.crown}>👑</div>
                <div style={styles.badgeFirst}>1</div>
                <img src={top1.profilePicture} alt="1st" style={{ ...styles.podiumAvatar, width: '76px', height: '76px', borderColor: '#F5D061' }} />
                <span style={{ ...styles.podiumName, fontWeight: '800' }}>{top1.fullName}</span>
                <span style={styles.podiumXp}>{top1.xp} XP</span>
              </motion.div>
            ) : <div style={{ height: '160px' }} />}
            <div style={{ ...styles.podiumBlock, height: '120px', backgroundColor: '#F3E5AB', border: '1.5px solid #F5D061' }}>
              <span style={styles.podiumNum}>1st</span>
            </div>
          </div>

          {/* Rank 3 (Right) */}
          <div style={styles.podiumCol}>
            {top3 ? (
              <motion.div
                style={styles.podiumUserCard}
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.3 }}
              >
                <div style={styles.badgeThird}>3</div>
                <img src={top3.profilePicture} alt="3rd" style={styles.podiumAvatar} />
                <span style={styles.podiumName}>{top3.fullName}</span>
                <span style={styles.podiumXp}>{top3.xp} XP</span>
              </motion.div>
            ) : <div style={{ height: '140px' }} />}
            <div style={{ ...styles.podiumBlock, height: '60px', backgroundColor: '#EADBC8' }}>
              <span style={styles.podiumNum}>3rd</span>
            </div>
          </div>
        </div>
      )}

      {/* Ranks 4+ Table List */}
      <div style={styles.tableCard}>
        <h3 style={styles.tableTitle}>Rankings</h3>
        <div style={styles.tableWrapper}>
          <table style={styles.table}>
            <thead>
              <tr style={styles.thRow}>
                <th style={{ ...styles.th, width: '80px', textAlign: 'center' }}>Rank</th>
                <th style={styles.th}>User</th>
                <th style={styles.th}>Level</th>
                <th style={{ ...styles.th, textAlign: 'right' }}>Total XP</th>
              </tr>
            </thead>
            <tbody>
              {remaining.length > 0 ? (
                remaining.map((user, idx) => (
                  <motion.tr
                    key={user.id}
                    style={styles.tr}
                    initial={{ opacity: 0, rotateX: 15, perspective: 1000 }}
                    animate={{ opacity: 1, rotateX: 0, perspective: 1000 }}
                    transition={{ delay: idx * 0.05, duration: 0.4 }}
                    whileHover={{
                      scale: 1.015,
                      backgroundColor: '#F8F5F1',
                      boxShadow: '0 4px 12px rgba(139,107,74,0.06)'
                    }}
                  >
                    <td style={styles.tdRank}>{user.rank}</td>
                    <td style={styles.tdUser}>
                      <img src={user.profilePicture} alt="User" style={styles.tableAvatar} />
                      <span style={styles.tableName}>{user.fullName}</span>
                    </td>
                    <td style={styles.tdLevel}>
                      <span style={styles.levelBadge}>Lvl {user.level}</span>
                    </td>
                    <td style={styles.tdXp}>{user.xp} XP</td>
                  </motion.tr>
                ))
              ) : (
                ranks.length <= 3 && (
                  <tr>
                    <td colSpan={4} style={styles.emptyTable}>No other rankings recorded. Keep leveling up!</td>
                  </tr>
                )
              )}
            </tbody>
          </table>
        </div>
      </div>
      </motion.div>
    </div>
  );
}

const styles = {
  container: {
    paddingBottom: '40px',
  },
  loading: {
    minHeight: '80vh',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
  header: {
    marginBottom: '32px',
  },
  title: {
    fontSize: '2rem',
    fontWeight: '800',
    color: '#8B6B4A',
    marginBottom: '8px',
  },
  subtitle: {
    fontSize: '1rem',
    color: '#6E5C50',
  },
  podiumContainer: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'flex-end',
    gap: '16px',
    margin: '40px 0',
    minHeight: '280px',
  },
  podiumCol: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    width: '140px',
  },
  podiumUserCard: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    marginBottom: '12px',
    position: 'relative',
    textAlign: 'center',
  },
  crown: {
    fontSize: '1.4rem',
    position: 'absolute',
    top: '-24px',
    left: '50%',
    transform: 'translateX(-50%)',
  },
  badgeFirst: {
    position: 'absolute',
    bottom: '48px',
    right: '2px',
    backgroundColor: '#F5D061',
    color: '#FFFFFF',
    fontWeight: '800',
    borderRadius: '50%',
    width: '20px',
    height: '20px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontSize: '0.75rem',
  },
  badgeSecond: {
    position: 'absolute',
    bottom: '40px',
    right: '4px',
    backgroundColor: '#A39387',
    color: '#FFFFFF',
    fontWeight: '800',
    borderRadius: '50%',
    width: '20px',
    height: '20px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontSize: '0.75rem',
  },
  badgeThird: {
    position: 'absolute',
    bottom: '40px',
    right: '4px',
    backgroundColor: '#A67C52',
    color: '#FFFFFF',
    fontWeight: '800',
    borderRadius: '50%',
    width: '20px',
    height: '20px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontSize: '0.75rem',
  },
  podiumAvatar: {
    width: '64px',
    height: '64px',
    borderRadius: '50%',
    border: '2px solid #EADBCE',
    backgroundColor: '#FFFFFF',
    marginBottom: '8px',
  },
  podiumName: {
    fontSize: '0.85rem',
    fontWeight: '700',
    color: '#2D241E',
    whiteSpace: 'nowrap',
    overflow: 'hidden',
    textOverflow: 'ellipsis',
    maxWidth: '120px',
  },
  podiumXp: {
    fontSize: '0.8rem',
    fontWeight: '700',
    color: '#7FB77E',
  },
  podiumBlock: {
    width: '100%',
    borderRadius: '12px 12px 0 0',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    boxShadow: '0 4px 12px rgba(139, 107, 74, 0.04)',
  },
  podiumNum: {
    fontSize: '1.2rem',
    fontWeight: '800',
    color: '#8B6B4A',
  },
  tableCard: {
    backgroundColor: '#FFFFFF',
    border: '1px solid #EADBCE',
    borderRadius: '20px',
    padding: '24px',
    boxShadow: '0 4px 12px rgba(139, 107, 74, 0.03)',
  },
  tableTitle: {
    fontSize: '1.15rem',
    fontWeight: '700',
    color: '#8B6B4A',
    marginBottom: '16px',
    borderBottom: '1px solid #F8F5F1',
    paddingBottom: '12px',
  },
  tableWrapper: {
    overflowX: 'auto',
  },
  table: {
    width: '100%',
    borderCollapse: 'collapse',
  },
  thRow: {
    borderBottom: '2px solid #F8F5F1',
  },
  th: {
    padding: '12px 16px',
    textAlign: 'left',
    fontSize: '0.82rem',
    fontWeight: '700',
    color: '#A39387',
    textTransform: 'uppercase',
  },
  tr: {
    borderBottom: '1px solid #F8F5F1',
    transition: 'background-color 0.2s ease',
    ':hover': {
      backgroundColor: '#F8F5F1',
    }
  },
  tdRank: {
    padding: '16px',
    textAlign: 'center',
    fontWeight: '700',
    color: '#6E5C50',
  },
  tdUser: {
    padding: '16px',
    display: 'flex',
    alignItems: 'center',
    gap: '12px',
  },
  tableAvatar: {
    width: '32px',
    height: '32px',
    borderRadius: '50%',
    backgroundColor: '#C3AED6',
  },
  tableName: {
    fontWeight: '600',
    color: '#2D241E',
  },
  tdLevel: {
    padding: '16px',
  },
  levelBadge: {
    backgroundColor: '#F8F5F1',
    border: '1px solid #EADBCE',
    borderRadius: '8px',
    padding: '4px 8px',
    fontSize: '0.78rem',
    fontWeight: '700',
    color: '#8B6B4A',
  },
  tdXp: {
    padding: '16px',
    textAlign: 'right',
    fontWeight: '700',
    color: '#7FB77E',
  },
  emptyTable: {
    padding: '24px',
    textAlign: 'center',
    color: '#A39387',
  },
};
