import React, { useState, useEffect, useContext } from 'react';
import axios from 'axios';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import { Settings as SettingsIcon, Save, HeartHandshake, Smile, CheckCircle2, AlertCircle, LogOut, Trash2 } from 'lucide-react';

export default function Settings() {
  const { user, logout, refreshUserData } = useContext(AuthContext);
  const navigate = useNavigate();

  const [fullName, setFullName] = useState('');
  const [institutionName, setInstitutionName] = useState('');
  const [grade, setGrade] = useState('');
  const [department, setDepartment] = useState('');
  const [avatarSeed, setAvatarSeed] = useState('');
  
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [loading, setLoading] = useState(false);

  // Support Form state
  const [supportMsg, setSupportMsg] = useState('');
  const [supportSuccess, setSupportSuccess] = useState('');

  const [localAvatar, setLocalAvatar] = useState(localStorage.getItem('ecoverse_custom_avatar') || '');

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onloadend = () => {
      const base64String = reader.result;
      setLocalAvatar(base64String);
      localStorage.setItem('ecoverse_custom_avatar', base64String);
      window.dispatchEvent(new Event('storage_avatar_updated'));
    };
    reader.readAsDataURL(file);
  };

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const res = await axios.get('/api/profile');
        const p = res.data;
        setFullName(p.fullName);
        setInstitutionName(p.institutionName);
        setGrade(p.grade.toString());
        setDepartment(p.department || '');
        
        // Extract seed from dicebear URL if possible
        if (p.profilePicture?.includes('seed=')) {
          setAvatarSeed(p.profilePicture.split('seed=')[1]);
        } else {
          setAvatarSeed(p.fullName);
        }
      } catch (err) {
        console.error("Failed to load settings details", err);
      }
    };
    fetchProfile();
  }, []);

  const handleProfileSave = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    setLoading(true);

    const profilePic = `https://api.dicebear.com/7.x/fun-emoji/svg?seed=${avatarSeed || fullName}`;

    try {
      await axios.put('/api/profile', {
        fullName,
        institutionName,
        grade: parseInt(grade, 10),
        department: department || null,
        profilePicture: profilePic,
      });

      setSuccess('Profile updated successfully!');
      await refreshUserData();
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to update profile.');
    } finally {
      setLoading(false);
    }
  };

  const handleSupportSubmit = (e) => {
    e.preventDefault();
    setSupportSuccess('');
    if (!supportMsg.trim()) return;

    // Simulate sending support request
    setTimeout(() => {
      setSupportSuccess('Support query sent! The Greenizo board will reply within 24 hours.');
      setSupportMsg('');
    }, 800);
  };

  const handleSettingsLogout = () => {
    logout();
    navigate('/login');
  };

  const handleCloseAccount = async () => {
    const confirmClose = window.confirm("Are you sure you want to close this account permanently? This action cannot be undone.");
    if (!confirmClose) return;

    try {
      setLoading(true);
      await axios.delete('/api/profile');
      alert("Account closed successfully.");
      logout();
      navigate('/login');
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to close account.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={styles.container}>

      <div style={styles.header}>
        <h1 style={styles.title}>Settings & Support</h1>
        <p style={styles.subtitle}>Customize your user profile details, edit your avatar seed, or reach out for support.</p>
      </div>

      <div style={styles.layout}>
        {/* Left: Edit Profile Form */}
        <motion.div
          style={styles.card}
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <div style={styles.cardHeader}>
            <SettingsIcon size={20} color="#8B6B4A" />
            <h3 style={styles.cardTitle}>Edit Profile Settings</h3>
          </div>

          <AnimatePresence>
            {error && (
              <motion.div style={styles.errorAlert} initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
                <AlertCircle size={18} />
                <span>{error}</span>
              </motion.div>
            )}
            {success && (
              <motion.div style={styles.successAlert} initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
                <CheckCircle2 size={18} />
                <span>{success}</span>
              </motion.div>
            )}
          </AnimatePresence>

          <form onSubmit={handleProfileSave} style={styles.form}>
            <div className="form-group">
              <label className="form-label">Full Name</label>
              <input
                type="text"
                className="form-input"
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                required
                disabled={loading}
              />
            </div>

            <div className="form-group">
              <label className="form-label">Institution / College Name</label>
              <input
                type="text"
                className="form-input"
                value={institutionName}
                onChange={(e) => setInstitutionName(e.target.value)}
                required
                disabled={loading}
              />
            </div>

            <div style={styles.row}>
              <div className="form-group" style={{ flex: 1, marginRight: '10px' }}>
                <label className="form-label">Grade</label>
                <input
                  type="number"
                  className="form-input"
                  value={grade}
                  onChange={(e) => setGrade(e.target.value)}
                  required
                  disabled={loading}
                />
              </div>

              <div className="form-group" style={{ flex: 1 }}>
                <label className="form-label">Department</label>
                <input
                  type="text"
                  className="form-input"
                  value={department}
                  onChange={(e) => setDepartment(e.target.value)}
                  disabled={loading}
                />
              </div>
            </div>

            <div className="form-group">
              <label className="form-label">Upload Custom Profile Picture (Saved locally)</label>
              <div style={styles.avatarRow}>
                <input
                  type="file"
                  accept="image/*"
                  className="form-input"
                  style={{ flex: 1 }}
                  onChange={handleImageUpload}
                  disabled={loading}
                />
                <div style={styles.avatarPreview}>
                  <img
                    src={localAvatar || `https://api.dicebear.com/7.x/fun-emoji/svg?seed=${avatarSeed || fullName}`}
                    alt="Preview"
                    style={styles.avatarImg}
                  />
                </div>
              </div>
              {localAvatar && (
                <button
                  type="button"
                  onClick={() => {
                    setLocalAvatar('');
                    localStorage.removeItem('ecoverse_custom_avatar');
                    window.dispatchEvent(new Event('storage_avatar_updated'));
                  }}
                  className="btn btn-ghost"
                  style={{ alignSelf: 'flex-start', padding: '6px 0', fontSize: '0.8rem', color: '#9B1C1C', border: 'none', background: 'none', cursor: 'pointer' }}
                >
                  Remove Custom Picture
                </button>
              )}
            </div>

            <div className="form-group">
              <label className="form-label">Or Customize Avatar Seed (Dicebear Fun-Emoji)</label>
              <div style={styles.avatarRow}>
                <input
                  type="text"
                  className="form-input"
                  style={{ flex: 1 }}
                  placeholder="e.g. happy, leaf"
                  value={avatarSeed}
                  onChange={(e) => setAvatarSeed(e.target.value)}
                  disabled={loading}
                />
                <div style={styles.avatarPreview}>
                  <img
                    src={`https://api.dicebear.com/7.x/fun-emoji/svg?seed=${avatarSeed || fullName}`}
                    alt="Preview"
                    style={styles.avatarImg}
                  />
                </div>
              </div>
            </div>

            <motion.button
              type="submit"
              className="btn btn-primary"
              style={styles.saveBtn}
              whileHover={{ scale: 1.02 }}
              disabled={loading}
            >
              <Save size={16} />
              <span>{loading ? 'Saving...' : 'Save Settings'}</span>
            </motion.button>
          </form>
        </motion.div>

        {/* Right: Support Contact Form */}
        <motion.div
          style={styles.card}
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
        >
          <div style={styles.cardHeader}>
            <HeartHandshake size={20} color="#8B6B4A" />
            <h3 style={styles.cardTitle}>Support & Feedback</h3>
          </div>

          <AnimatePresence>
            {supportSuccess && (
              <motion.div style={styles.successAlert} initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
                <CheckCircle2 size={18} />
                <span>{supportSuccess}</span>
              </motion.div>
            )}
          </AnimatePresence>

          <p style={styles.supportDesc}>
            Encountered any technical issues? Have ideas to improve gamification? Send a message to the Greenizo administrators!
          </p>

          <form onSubmit={handleSupportSubmit} style={styles.form}>
            <div className="form-group">
              <label className="form-label">Message Details</label>
              <textarea
                className="form-input"
                style={styles.textarea}
                placeholder="Type your query or suggestion here..."
                value={supportMsg}
                onChange={(e) => setSupportMsg(e.target.value)}
                required
              />
            </div>

            <motion.button
              type="submit"
              className="btn btn-secondary"
              style={styles.saveBtn}
              whileHover={{ scale: 1.02 }}
            >
              <span>Submit Message</span>
            </motion.button>
          </form>
        </motion.div>
      </div>

      {/* Danger Zone / Account Management */}
      <motion.div
        style={styles.dangerZoneCard}
        initial={{ opacity: 0, y: 15 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.2 }}
      >
        <div style={styles.cardHeaderDanger}>
          <Trash2 size={20} color="#9B1C1C" />
          <h3 style={styles.cardTitleDanger}>Account Management</h3>
        </div>
        <p style={styles.dangerDesc}>
          Perform actions like logging out of your session or closing your account permanently.
        </p>
        
        <div style={styles.dangerActions}>
          <button onClick={handleSettingsLogout} style={styles.dangerLogoutBtn}>
            <LogOut size={16} />
            <span>Log Out</span>
          </button>
          
          <button onClick={handleCloseAccount} style={styles.dangerDeleteBtn}>
            <Trash2 size={16} />
            <span>Close Account</span>
          </button>
        </div>

        {/* Creator Info */}
        <div style={styles.creatorInfo}>
          Website builded by Kabilesh - 2026
        </div>
      </motion.div>
    </div>
  );
}

const styles = {
  container: {
    paddingBottom: '40px',
  },
  header: {
    marginBottom: '32px',
  },
  title: {
    fontSize: '2rem',
    fontWeight: '800',
    color: '#8B6B4A',
  },
  subtitle: {
    fontSize: '1rem',
    color: '#6E5C50',
    marginTop: '4px',
  },
  layout: {
    display: 'flex',
    gap: '24px',
    flexWrap: 'wrap',
  },
  card: {
    flex: 1,
    minWidth: '320px',
    backgroundColor: '#FFFFFF',
    border: '1px solid #EADBCE',
    borderRadius: '20px',
    padding: '24px',
    boxShadow: '0 4px 12px rgba(139, 107, 74, 0.03)',
  },
  cardHeader: {
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
    marginBottom: '20px',
    borderBottom: '1px solid #F8F5F1',
    paddingBottom: '12px',
  },
  cardTitle: {
    fontSize: '1.15rem',
    fontWeight: '700',
    color: '#8B6B4A',
  },
  errorAlert: {
    backgroundColor: '#FDE8E8',
    border: '1px solid #F8B4B4',
    color: '#9B1C1C',
    borderRadius: '12px',
    padding: '12px 16px',
    fontSize: '0.85rem',
    fontWeight: '500',
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
    marginBottom: '20px',
  },
  successAlert: {
    backgroundColor: '#EBF5FF',
    border: '1px solid #C3DDFD',
    color: '#1E429F',
    borderRadius: '12px',
    padding: '12px 16px',
    fontSize: '0.85rem',
    fontWeight: '500',
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
    marginBottom: '20px',
  },
  form: {
    display: 'flex',
    flexDirection: 'column',
  },
  row: {
    display: 'flex',
    justifyContent: 'space-between',
  },
  avatarRow: {
    display: 'flex',
    alignItems: 'center',
    gap: '16px',
  },
  avatarPreview: {
    width: '56px',
    height: '56px',
    borderRadius: '50%',
    backgroundColor: '#C3AED6',
    border: '2px solid #7FB77E',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    overflow: 'hidden',
  },
  avatarImg: {
    width: '100%',
    height: '100%',
  },
  saveBtn: {
    width: '100%',
    padding: '12px',
  },
  supportDesc: {
    fontSize: '0.88rem',
    color: '#6E5C50',
    lineHeight: '1.5',
    marginBottom: '20px',
  },
  textarea: {
    minHeight: '120px',
    resize: 'none',
  },
  dangerZoneCard: {
    marginTop: '32px',
    backgroundColor: '#FFF5F5',
    border: '1px solid #FEB2B2',
    borderRadius: '20px',
    padding: '24px',
    boxShadow: '0 4px 12px rgba(155, 28, 28, 0.03)',
  },
  cardHeaderDanger: {
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
    marginBottom: '16px',
    borderBottom: '1px solid #FEE2E2',
    paddingBottom: '12px',
  },
  cardTitleDanger: {
    fontSize: '1.15rem',
    fontWeight: '700',
    color: '#9B1C1C',
  },
  dangerDesc: {
    fontSize: '0.88rem',
    color: '#7B341E',
    lineHeight: '1.5',
    marginBottom: '20px',
  },
  dangerActions: {
    display: 'flex',
    gap: '16px',
    flexWrap: 'wrap',
    marginBottom: '8px',
  },
  dangerLogoutBtn: {
    backgroundColor: 'transparent',
    border: '2px solid #E53E3E',
    color: '#E53E3E',
    borderRadius: '12px',
    padding: '12px 24px',
    fontSize: '0.95rem',
    fontWeight: '600',
    cursor: 'pointer',
    display: 'inline-flex',
    alignItems: 'center',
    gap: '8px',
    transition: 'all 0.2s ease',
  },
  dangerDeleteBtn: {
    backgroundColor: '#E53E3E',
    border: '2px solid #E53E3E',
    color: '#FFFFFF',
    borderRadius: '12px',
    padding: '12px 24px',
    fontSize: '0.95rem',
    fontWeight: '600',
    cursor: 'pointer',
    display: 'inline-flex',
    alignItems: 'center',
    gap: '8px',
    transition: 'all 0.2s ease',
  },
  creatorInfo: {
    textAlign: 'center',
    fontSize: '0.85rem',
    color: '#718096',
    borderTop: '1px solid #FEE2E2',
    paddingTop: '16px',
    marginTop: '20px',
    fontWeight: '600',
    letterSpacing: '0.5px',
  },
};
