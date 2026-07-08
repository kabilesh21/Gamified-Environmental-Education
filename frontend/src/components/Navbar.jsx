import React, { useContext, useState, useEffect } from 'react';
import { AuthContext } from '../context/AuthContext';
import { LogOut, Award, User as UserIcon } from 'lucide-react';
import { useNavigate, useLocation } from 'react-router-dom';

export default function Navbar({ sidebarOpen }) {
  const { user, logout } = useContext(AuthContext);
  const navigate = useNavigate();
  const location = useLocation();

  const [avatarUrl, setAvatarUrl] = useState(
    localStorage.getItem('ecoverse_custom_avatar') || (user ? user.profilePicture : '')
  );

  useEffect(() => {
    if (!user) return;
    const handleAvatarUpdate = () => {
      setAvatarUrl(localStorage.getItem('ecoverse_custom_avatar') || user.profilePicture);
    };
    window.addEventListener('storage_avatar_updated', handleAvatarUpdate);
    // Initial sync
    handleAvatarUpdate();
    return () => window.removeEventListener('storage_avatar_updated', handleAvatarUpdate);
  }, [user]);

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  if (!user) return null;

  return (
    <header style={styles.header}>
      <div style={styles.left}>
        <h2 style={{
          ...styles.pageTitle,
          marginLeft: !sidebarOpen ? '45px' : '0px',
          transition: 'all 0.3s ease'
        }}>Greenizo</h2>
      </div>

      <div style={styles.right}>
        {/* Level Tag */}
        <div style={styles.statTag}>
          <Award size={18} color="#A67C52" />
          <span>Lvl {user.level}</span>
        </div>

        {/* XP Tag */}
        <div style={styles.statTag}>
          <span style={styles.xpNum}>{user.xp} XP</span>
        </div>

        {/* User profile avatar */}
        <div style={styles.profileBadge} onClick={() => navigate('/profile')}>
          <img
            src={avatarUrl}
            alt={user.fullName}
            style={styles.avatar}
          />
          <span style={styles.fullName}>{user.fullName}</span>
        </div>

        {/* Logout icon */}
        <button onClick={handleLogout} style={styles.logoutBtn} title="Log Out">
          <LogOut size={20} />
        </button>
      </div>
    </header>
  );
}

const styles = {
  header: {
    height: '70px',
    backgroundColor: '#FFFFFF',
    borderBottom: '1px solid #EADBCE',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: '0 30px',
    position: 'sticky',
    top: 0,
    zIndex: 100,
    width: '100%',
  },
  left: {
    display: 'flex',
    alignItems: 'center',
  },
  pageTitle: {
    fontSize: '1.4rem',
    fontWeight: '800',
    color: '#8B6B4A',
    letterSpacing: '1px',
    textTransform: 'uppercase',
  },
  right: {
    display: 'flex',
    alignItems: 'center',
    gap: '16px',
  },
  statTag: {
    backgroundColor: '#F8F5F1',
    border: '1px solid #EADBCE',
    borderRadius: '12px',
    padding: '8px 12px',
    display: 'flex',
    alignItems: 'center',
    gap: '6px',
    fontSize: '0.85rem',
    fontWeight: '700',
    color: '#8B6B4A',
  },
  xpNum: {
    color: '#7FB77E',
  },
  profileBadge: {
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
    cursor: 'pointer',
    padding: '4px 8px',
    borderRadius: '12px',
    transition: 'all 0.2s ease',
    ':hover': {
      backgroundColor: '#F8F5F1',
    }
  },
  avatar: {
    width: '32px',
    height: '32px',
    borderRadius: '50%',
    backgroundColor: '#C3AED6',
    border: '2px solid #7FB77E',
  },
  fullName: {
    fontSize: '0.9rem',
    fontWeight: '600',
    color: '#2D241E',
    display: 'none',
    // Responsive: show name on larger devices
  },
  logoutBtn: {
    background: 'none',
    border: 'none',
    color: '#A39387',
    cursor: 'pointer',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    padding: '8px',
    borderRadius: '12px',
    transition: 'all 0.2s ease',
    ':hover': {
      backgroundColor: '#FDE8E8',
      color: '#9B1C1C',
    }
  }
};
// Add responsive name display rule on media queries inside App or index
const mediaStyles = `@media (min-width: 768px) {
  .fullName { display: inline !important; }
}`;
