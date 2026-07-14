import React, { useContext } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import { 
  Home, BookOpen, ClipboardCheck, Award, Users, 
  TrendingUp, User, Settings, HelpCircle, LogOut, Flower 
} from 'lucide-react';

export default function Sidebar({ isOpen, onClose }) {
  const { user, logout } = useContext(AuthContext);
  const navigate = useNavigate();

  if (!user) return null;

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <aside style={{
      ...styles.sidebar,
      transform: isOpen ? 'translateX(0)' : 'translateX(-100%)',
    }}>
      {/* Brand logo header */}
      <div style={styles.brand}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <img src="/logo_icon.png" alt="Greenizo Logo" style={styles.logoImage} />
          <div style={{ display: 'flex', flexDirection: 'column' }}>
            <span style={styles.brandName}>Greenizo</span>
            <span style={styles.brandSubtitle}>Eco Learner Platform</span>
          </div>
        </div>
      </div>

      {/* Navigation list */}
      <nav style={styles.nav}>
        <NavLink
          to="/"
          style={({ isActive }) => (isActive ? { ...styles.link, ...styles.linkActive } : styles.link)}
        >
          <Home size={18} style={styles.icon} />
          <span style={styles.linkText}>Dashboard</span>
        </NavLink>

        <NavLink
          to="/courses"
          style={({ isActive }) => (isActive ? { ...styles.link, ...styles.linkActive } : styles.link)}
        >
          <BookOpen size={18} style={styles.icon} />
          <span style={styles.linkText}>Learning Modules</span>
        </NavLink>

        <NavLink
          to="/challenges"
          style={({ isActive }) => (isActive ? { ...styles.link, ...styles.linkActive } : styles.link)}
        >
          <ClipboardCheck size={18} style={styles.icon} />
          <span style={styles.linkText}>Activities</span>
        </NavLink>

        <NavLink
          to="/garden"
          style={({ isActive }) => (isActive ? { ...styles.link, ...styles.linkActive } : styles.link)}
        >
          <Flower size={18} style={styles.icon} />
          <span style={styles.linkText}>Eco Garden</span>
        </NavLink>

        <NavLink
          to="/shop"
          style={({ isActive }) => (isActive ? { ...styles.link, ...styles.linkActive } : styles.link)}
        >
          <Award size={18} style={styles.icon} />
          <span style={styles.linkText}>Rewards & Badges</span>
        </NavLink>

        <NavLink
          to="/leaderboard"
          style={({ isActive }) => (isActive ? { ...styles.link, ...styles.linkActive } : styles.link)}
        >
          <Users size={18} style={styles.icon} />
          <span style={styles.linkText}>Leaderboard</span>
        </NavLink>

        <NavLink
          to="/certificates"
          style={({ isActive }) => (isActive ? { ...styles.link, ...styles.linkActive } : styles.link)}
        >
          <TrendingUp size={18} style={styles.icon} />
          <span style={styles.linkText}>Certificates</span>
        </NavLink>

        <NavLink
          to="/profile"
          style={({ isActive }) => (isActive ? { ...styles.link, ...styles.linkActive } : styles.link)}
        >
          <User size={18} style={styles.icon} />
          <span style={styles.linkText}>Profile</span>
        </NavLink>

        <NavLink
          to="/settings"
          style={({ isActive }) => (isActive ? { ...styles.link, ...styles.linkActive } : styles.link)}
        >
          <Settings size={18} style={styles.icon} />
          <span style={styles.linkText}>Settings</span>
        </NavLink>

        <NavLink
          to="/community"
          style={({ isActive }) => (isActive ? { ...styles.link, ...styles.linkActive } : styles.link)}
        >
          <HelpCircle size={18} style={styles.icon} />
          <span style={styles.linkText}>Help & Support</span>
        </NavLink>

        <button onClick={handleLogout} style={styles.logoutBtn}>
          <LogOut size={18} style={styles.icon} />
          <span style={{ ...styles.linkText, fontWeight: '700' }}>Logout</span>
        </button>
      </nav>

      {/* Bottom Illustration & Slogan (Render 3D Generated illustration instead of flat SVG) */}
      <div style={styles.footerGraphicContainer}>
        <img src="/sidebar_eco_house.png" alt="Eco Sprout House" style={styles.footerImage} />
        <p style={styles.footerText}>
          Let's make our<br />
          planet better together! <span style={{ color: '#E91E63' }}>💜</span>
        </p>
      </div>
    </aside>
  );
}

const styles = {
  sidebar: {
    width: '260px',
    height: '100vh',
    backgroundColor: '#EAF5EC',
    position: 'fixed',
    top: 0,
    left: 0,
    display: 'flex',
    flexDirection: 'column',
    zIndex: 999,
    overflowY: 'auto',
    borderRight: '1px solid #C8E6C9',
    transition: 'transform 0.3s ease',
  },
  brand: {
    padding: '24px 20px',
    borderBottom: '1px solid #C8E6C9',
  },
  logoImage: {
    width: '36px',
    height: '36px',
    borderRadius: '10px',
    objectFit: 'cover',
    flexShrink: 0,
    boxShadow: '0 4px 10px rgba(46, 125, 50, 0.1)',
  },
  brandName: {
    fontSize: '1.25rem',
    fontWeight: '800',
    color: '#0F5132',
    letterSpacing: '0.5px',
    lineHeight: '1.1',
  },
  brandSubtitle: {
    fontSize: '0.7rem',
    fontWeight: '700',
    color: '#1E6B30',
    marginTop: '2px',
  },
  nav: {
    padding: '20px 14px',
    display: 'flex',
    flexDirection: 'column',
    gap: '4px',
    flex: 1,
  },
  link: {
    display: 'flex',
    alignItems: 'center',
    gap: '12px',
    padding: '10px 16px',
    borderRadius: '12px',
    fontSize: '0.9rem',
    fontWeight: '700',
    color: '#111827',
    textDecoration: 'none',
    transition: 'all 0.2s ease',
    border: '1px solid transparent',
  },
  linkActive: {
    backgroundColor: '#D2E7D6',
    color: '#0F5132',
    fontWeight: '800',
  },
  linkText: {
    color: 'inherit',
    fontWeight: 'inherit',
  },
  icon: {
    flexShrink: 0,
    color: 'inherit',
  },
  logoutBtn: {
    display: 'flex',
    alignItems: 'center',
    gap: '12px',
    padding: '10px 16px',
    borderRadius: '12px',
    fontSize: '0.9rem',
    fontWeight: '700',
    color: '#111827',
    background: 'none',
    border: 'none',
    width: '100%',
    textAlign: 'left',
    cursor: 'pointer',
    transition: 'all 0.2s ease',
    marginTop: 'auto',
  },
  footerGraphicContainer: {
    padding: '0 20px 24px 20px',
    textAlign: 'center',
    marginTop: 'auto',
  },
  footerImage: {
    width: '110px',
    height: '110px',
    objectFit: 'contain',
    margin: '0 auto 10px auto',
    display: 'block',
  },
  footerText: {
    fontSize: '0.78rem',
    fontWeight: '800',
    color: '#0F5132',
    lineHeight: '1.4',
  }
};
