import React, { useContext } from 'react';
import { NavLink } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import { Home, BookOpen, ClipboardCheck, ShieldCheck, Users, MessageSquare, User, Settings, Leaf, Menu, Flower, ShoppingBag } from 'lucide-react';

export default function Sidebar({ isOpen, onClose }) {
  const { user } = useContext(AuthContext);

  if (!user) return null;

  return (
    <aside style={{
      ...styles.sidebar,
      transform: isOpen ? 'translateX(0)' : 'translateX(-100%)',
    }}>
      {/* Brand logo header */}
      <div style={styles.brand}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <div style={styles.logoCircle}>
            <Leaf size={16} color="#FFFFFF" fill="#FFFFFF" />
          </div>
          <span style={styles.brandName}>ECOVERSE</span>
        </div>
        <button onClick={onClose} style={styles.toggleBtn} title="Close Sidebar">
          <Menu size={20} color="#1b4d2c" />
        </button>
      </div>

      {/* Navigation list */}
      <nav style={styles.nav}>
        <NavLink
          to="/"
          style={({ isActive }) => (isActive ? { ...styles.link, ...styles.linkActive } : styles.link)}
        >
          <Home size={18} />
          <span>Dashboard</span>
        </NavLink>

        <NavLink
          to="/courses"
          style={({ isActive }) => (isActive ? { ...styles.link, ...styles.linkActive } : styles.link)}
        >
          <BookOpen size={18} />
          <span>Learn</span>
        </NavLink>

        <NavLink
          to="/certificates"
          style={({ isActive }) => (isActive ? { ...styles.link, ...styles.linkActive } : styles.link)}
        >
          <ClipboardCheck size={18} />
          <span>Quests</span>
        </NavLink>

        <NavLink
          to="/garden"
          style={({ isActive }) => (isActive ? { ...styles.link, ...styles.linkActive } : styles.link)}
        >
          <Flower size={18} />
          <span>Garden</span>
        </NavLink>

        <NavLink
          to="/shop"
          style={({ isActive }) => (isActive ? { ...styles.link, ...styles.linkActive } : styles.link)}
        >
          <ShoppingBag size={18} />
          <span>Shop</span>
        </NavLink>

        <NavLink
          to="/challenges"
          style={({ isActive }) => (isActive ? { ...styles.link, ...styles.linkActive } : styles.link)}
        >
          <ShieldCheck size={18} />
          <span>Challenges</span>
        </NavLink>

        <NavLink
          to="/leaderboard"
          style={({ isActive }) => (isActive ? { ...styles.link, ...styles.linkActive } : styles.link)}
        >
          <Users size={18} />
          <span>Leaderboard</span>
        </NavLink>

        <NavLink
          to="/community"
          style={({ isActive }) => (isActive ? { ...styles.link, ...styles.linkActive } : styles.link)}
        >
          <MessageSquare size={18} />
          <span>Community</span>
        </NavLink>

        <NavLink
          to="/profile"
          style={({ isActive }) => (isActive ? { ...styles.link, ...styles.linkActive } : styles.link)}
        >
          <User size={18} />
          <span>Profile</span>
        </NavLink>

        <NavLink
          to="/settings"
          style={({ isActive }) => (isActive ? { ...styles.link, ...styles.linkActive } : styles.link)}
        >
          <Settings size={18} />
          <span>Settings</span>
        </NavLink>
      </nav>

      {/* Bottom Hills & Trees Illustration */}
      <div style={styles.footerGraphicContainer}>
        <svg viewBox="0 0 240 180" style={styles.footerSvg} xmlns="http://www.w3.org/2000/svg">
          {/* Back light hill */}
          <path d="M0 110 C 80 80, 160 130, 240 90 L 240 180 L 0 180 Z" fill="#82CFA0" opacity="0.3" />
          
          {/* Mid green hill */}
          <path d="M0 130 C 60 110, 160 150, 240 120 L 240 180 L 0 180 Z" fill="#5EBE87" opacity="0.5" />
          
          {/* Front green hill */}
          <path d="M0 150 C 90 130, 150 160, 240 140 L 240 180 L 0 180 Z" fill="#2d7d46" />

          {/* Trees on back hill */}
          <g fill="#82CFA0" opacity="0.4">
            <polygon points="50,95 45,110 55,110" />
            <rect x="49" y="110" width="2" height="4" fill="#1b4d2c" />
            <circle cx="180" cy="95" r="7" />
            <rect x="179" y="102" width="2" height="5" fill="#1b4d2c" />
          </g>

          {/* Trees on mid hill */}
          <g fill="#5EBE87" opacity="0.6">
            <polygon points="110,115 103,135 117,135" />
            <rect x="109" y="135" width="2" height="5" fill="#1b4d2c" />
            <circle cx="70" cy="118" r="8" />
            <rect x="69" y="126" width="2" height="6" fill="#1b4d2c" />
          </g>

          {/* Trees on front hill */}
          <g fill="#1b4d2c">
            <polygon points="35,130 26,155 44,155" />
            <polygon points="35,115 29,135 41,135" />
            <rect x="34" y="155" width="2" height="7" fill="#081a0e" />

            <circle cx="140" cy="135" r="11" fill="#2e7d32" />
            <rect x="139" y="146" width="2" height="9" fill="#081a0e" />

            <polygon points="200,135 193,155 207,155" />
            <rect x="199" y="155" width="2" height="6" fill="#081a0e" />
          </g>
        </svg>
      </div>
    </aside>
  );
}

const styles = {
  sidebar: {
    width: '240px',
    height: '100vh',
    backgroundColor: '#EAF2E8', // Light Green theme
    position: 'fixed',
    top: 0,
    left: 0,
    display: 'flex',
    flexDirection: 'column',
    zIndex: 999,
    overflow: 'hidden',
    borderRight: '1px solid rgba(0,0,0,0.05)',
    transition: 'transform 0.3s ease',
  },
  brand: {
    height: '80px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: '0 20px',
    borderBottom: '1px solid rgba(0,0,0,0.03)',
  },
  logoCircle: {
    width: '32px',
    height: '32px',
    borderRadius: '50%',
    backgroundColor: '#1b4d2c',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
  brandName: {
    fontSize: '1.35rem',
    fontWeight: '800',
    color: '#1b4d2c',
    letterSpacing: '0.2px',
  },
  toggleBtn: {
    background: 'none',
    border: 'none',
    cursor: 'pointer',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    padding: '6px',
    borderRadius: '8px',
    backgroundColor: 'rgba(0,0,0,0.02)',
  },
  nav: {
    padding: '16px 12px',
    display: 'flex',
    flexDirection: 'column',
    gap: '4px',
    flex: 1,
  },
  link: {
    display: 'flex',
    alignItems: 'center',
    gap: '12px',
    padding: '10px 14px',
    borderRadius: '10px',
    fontSize: '0.95rem',
    fontWeight: '700', // bold font weight
    color: '#0F3A20', // Very dark forest green
    textDecoration: 'none',
    transition: 'all 0.2s ease',
  },
  linkActive: {
    backgroundColor: '#C8E6C9', // Soft light green active background
    color: '#061D0F', // extremely dark green text
  },
  footerGraphicContainer: {
    marginTop: 'auto',
    width: '100%',
    position: 'relative',
    height: '160px',
  },
  footerSvg: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    width: '100%',
    height: '100%',
    display: 'block',
  }
};
