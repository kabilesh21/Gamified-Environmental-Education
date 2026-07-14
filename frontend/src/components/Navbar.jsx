import React, { useContext, useState, useEffect, useRef } from 'react';
import { AuthContext } from '../context/AuthContext';
import { Bell, Search, ChevronDown, Menu, CheckSquare, Award, Flame } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

export default function Navbar({ sidebarOpen, setSidebarOpen }) {
  const { user } = useContext(AuthContext);
  const navigate = useNavigate();

  const [avatarUrl, setAvatarUrl] = useState(
    localStorage.getItem('ecoverse_custom_avatar') || (user ? user.profilePicture : '')
  );

  const [searchQuery, setSearchQuery] = useState('');
  const [courses, setCourses] = useState([]);
  const [showSearchDropdown, setShowSearchDropdown] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);
  const [notifications, setNotifications] = useState([]);

  const searchRef = useRef(null);
  const notificationRef = useRef(null);

  useEffect(() => {
    if (!user) return;
    const handleAvatarUpdate = () => {
      setAvatarUrl(localStorage.getItem('ecoverse_custom_avatar') || user.profilePicture);
    };
    window.addEventListener('storage_avatar_updated', handleAvatarUpdate);
    handleAvatarUpdate();
    return () => window.removeEventListener('storage_avatar_updated', handleAvatarUpdate);
  }, [user]);

  // Fetch courses for search index
  useEffect(() => {
    const fetchCourses = async () => {
      try {
        const res = await axios.get('/api/courses');
        if (res.data) {
          setCourses(res.data);
        }
      } catch (err) {
        console.warn("Failed to load courses for search", err);
      }
    };
    if (user) {
      fetchCourses();
    }
  }, [user]);

  // Load dynamic notifications based on user achievements and certificates
  useEffect(() => {
    const loadNotifications = async () => {
      try {
        const [certRes, profileRes] = await Promise.all([
          axios.get('/api/certificates').catch(err => { console.warn(err); return { data: [] }; }),
          axios.get('/api/profile').catch(err => { console.warn(err); return { data: { unlockedBadges: [] } }; })
        ]);

        const certs = certRes.data || [];
        const badges = profileRes.data?.unlockedBadges || [];

        const newList = [];

        // 1. Streak Reminder
        newList.push({
          id: 'streak',
          type: 'streak',
          title: 'Daily Streak Reminder',
          desc: `You are on a ${user.streak ?? 0}-day streak! Log in tomorrow to keep it going! 🔥`,
          path: '/challenges'
        });

        // 2. Badges Unlocked Notifications
        badges.forEach(badge => {
          newList.push({
            id: `badge-${badge.id}`,
            type: 'badge',
            title: 'Badge Unlocked!',
            desc: `You unlocked the '${badge.name}' badge. View in profile! 🏅`,
            path: '/profile'
          });
        });

        // 3. Completed Course Certificates
        certs.forEach(cert => {
          newList.push({
            id: `cert-${cert.certificateId}`,
            type: 'cert',
            title: 'Certificate Download Ready',
            desc: `Your certificate for '${cert.courseName}' is ready. Click to view! 📜`,
            path: '/certificates'
          });
        });

        setNotifications(newList);
      } catch (err) {
        console.warn("Failed to load notifications dynamically", err);
      }
    };

    if (user) {
      loadNotifications();
    }
  }, [user]);

  // Click outside handlers
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (searchRef.current && !searchRef.current.contains(e.target)) {
        setShowSearchDropdown(false);
      }
      if (notificationRef.current && !notificationRef.current.contains(e.target)) {
        setShowNotifications(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  if (!user) return null;

  const getUserTitle = (lvl) => {
    if (lvl < 5) return "Eco Learner";
    if (lvl < 10) return "Eco Helper";
    if (lvl < 15) return "Green Learner";
    return "Eco Warrior";
  };

  // Filter searchable items (courses + static pages)
  const getSearchResults = () => {
    if (!searchQuery.trim()) return [];
    
    const query = searchQuery.toLowerCase();
    const results = [];

    // Filter dynamic courses
    courses.forEach(c => {
      if (c.title.toLowerCase().includes(query) || c.description.toLowerCase().includes(query)) {
        results.push({
          id: `course-${c.id}`,
          title: c.title,
          category: 'Learning Module',
          path: `/courses/${c.id}`
        });
      }
    });

    // Add static platform pages if they match query
    const staticPages = [
      { title: 'Eco Garden', category: 'Platform Page', path: '/garden' },
      { title: 'Leaderboard', category: 'Platform Page', path: '/leaderboard' },
      { title: 'Reward Shop', category: 'Platform Page', path: '/shop' },
      { title: 'Quizzes & Quests', category: 'Platform Page', path: '/challenges' },
      { title: 'Certificates & Progress', category: 'Platform Page', path: '/certificates' },
      { title: 'User Profile & Badges', category: 'Platform Page', path: '/profile' }
    ];

    staticPages.forEach(p => {
      if (p.title.toLowerCase().includes(query)) {
        results.push(p);
      }
    });

    return results;
  };

  const searchResults = getSearchResults();

  const handleSearchResultClick = (path) => {
    setSearchQuery('');
    setShowSearchDropdown(false);
    navigate(path);
  };

  return (
    <header style={{
      ...styles.header,
      paddingLeft: sidebarOpen ? '284px' : '24px',
    }}>
      {/* Left side: Hamburger Toggle & Search Bar */}
      <div style={styles.left}>
        <button 
          onClick={() => setSidebarOpen(!sidebarOpen)} 
          style={styles.toggleBtn}
          title={sidebarOpen ? "Collapse Sidebar" : "Expand Sidebar"}
        >
          <Menu size={20} color="#555555" />
        </button>

        {/* Search Bar with dropdown */}
        <div ref={searchRef} style={styles.searchContainer}>
          <div style={styles.searchBar}>
            <Search size={18} color="#A0AEC0" style={styles.searchIcon} />
            <input 
              type="text" 
              placeholder="Search anything..." 
              style={styles.searchInput}
              value={searchQuery}
              onChange={(e) => {
                setSearchQuery(e.target.value);
                setShowSearchDropdown(true);
              }}
              onFocus={() => setShowSearchDropdown(true)}
            />
          </div>

          {/* Search Dropdown Overlay */}
          {showSearchDropdown && searchResults.length > 0 && (
            <div style={styles.dropdownMenu}>
              <div style={styles.dropdownHeader}>Search Results</div>
              {searchResults.map((item, idx) => (
                <div 
                  key={idx} 
                  onClick={() => handleSearchResultClick(item.path)} 
                  style={styles.dropdownItem}
                >
                  <span style={styles.itemTitle}>{item.title}</span>
                  <span style={styles.itemCategory}>{item.category}</span>
                </div>
              ))}
            </div>
          )}

          {showSearchDropdown && searchQuery.trim() && searchResults.length === 0 && (
            <div style={styles.dropdownMenu}>
              <div style={{ ...styles.dropdownItem, color: '#A0AEC0', textAlign: 'center', pointerEvents: 'none' }}>
                No results found
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Right side: Notifications & User Profile */}
      <div style={styles.right}>
        
        {/* Notifications Icon with Popover */}
        <div ref={notificationRef} style={styles.notificationWrapper}>
          <button 
            onClick={() => setShowNotifications(!showNotifications)} 
            style={styles.iconBtn} 
            title="Notifications"
          >
            <Bell size={20} color="#555555" />
            {notifications.length > 0 && (
              <span style={styles.badge}>{notifications.length}</span>
            )}
          </button>

          {/* Notifications Dropover */}
          {showNotifications && (
            <div style={styles.notificationDropdown}>
              <div style={styles.notifHeaderRow}>
                <span style={styles.notifHeaderTitle}>Notifications</span>
                <span style={styles.notifHeaderCount}>{notifications.length} Info</span>
              </div>
              <div style={styles.notifList}>
                {notifications.length > 0 ? (
                  notifications.map(notif => (
                    <div 
                      key={notif.id} 
                      onClick={() => {
                        setShowNotifications(false);
                        navigate(notif.path);
                      }}
                      style={styles.notifItem}
                    >
                      <div style={{ 
                        ...styles.notifIconCircle, 
                        backgroundColor: notif.type === 'streak' ? '#FFF5F5' : notif.type === 'badge' ? '#E6F4EA' : '#EBF8FF' 
                      }}>
                        {notif.type === 'streak' && <Flame size={15} color="#E53E3E" fill="#E53E3E" />}
                        {notif.type === 'badge' && <Award size={15} color="#2E7D32" />}
                        {notif.type === 'cert' && <CheckSquare size={15} color="#3182CE" />}
                      </div>
                      <div style={styles.notifBody}>
                        <span style={styles.notifItemTitle}>{notif.title}</span>
                        <span style={styles.notifItemDesc}>{notif.desc}</span>
                      </div>
                    </div>
                  ))
                ) : (
                  <div style={{ padding: '20px', color: '#718096', fontSize: '0.82rem', textAlign: 'center' }}>
                    No alerts at this time
                  </div>
                )}
              </div>
            </div>
          )}
        </div>

        {/* User profile details */}
        <div style={styles.profileSection} onClick={() => navigate('/profile')} title="View Profile">
          <img
            src={avatarUrl}
            alt={user.fullName}
            style={styles.avatar}
          />
          <div style={styles.profileText}>
            <span style={styles.userName}>{user.fullName ? user.fullName.toUpperCase() : 'USER'}</span>
            <span style={styles.userTitle}>{getUserTitle(user.level)}</span>
          </div>
          <ChevronDown size={16} color="#718096" style={styles.caret} />
        </div>
      </div>
    </header>
  );
}

const styles = {
  header: {
    height: '70px',
    backgroundColor: '#FFFFFF',
    borderBottom: '1px solid #EAECEF',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingRight: '24px',
    position: 'sticky',
    top: 0,
    zIndex: 100,
    width: '100%',
    transition: 'all 0.3s ease',
  },
  left: {
    display: 'flex',
    alignItems: 'center',
    gap: '16px',
    flex: 1,
    maxWidth: '500px',
  },
  toggleBtn: {
    background: 'none',
    border: 'none',
    cursor: 'pointer',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    padding: '8px',
    borderRadius: '10px',
    transition: 'background-color 0.2s',
  },
  searchContainer: {
    position: 'relative',
    width: '100%',
  },
  searchBar: {
    display: 'flex',
    alignItems: 'center',
    backgroundColor: '#F5F7F8',
    borderRadius: '24px',
    padding: '8px 16px',
    width: '100%',
    border: '1px solid transparent',
    transition: 'all 0.2s',
  },
  searchIcon: {
    marginRight: '10px',
    flexShrink: 0,
  },
  searchInput: {
    border: 'none',
    background: 'none',
    outline: 'none',
    fontSize: '0.88rem',
    color: '#2D3748',
    width: '100%',
    fontFamily: 'inherit',
    fontWeight: '500',
  },
  dropdownMenu: {
    position: 'absolute',
    top: '46px',
    left: 0,
    width: '100%',
    backgroundColor: '#FFFFFF',
    borderRadius: '12px',
    boxShadow: '0 8px 30px rgba(0, 0, 0, 0.08)',
    border: '1px solid #EAECEF',
    zIndex: 1000,
    padding: '8px 0',
    maxHeight: '260px',
    overflowY: 'auto',
  },
  dropdownHeader: {
    fontSize: '0.72rem',
    fontWeight: '700',
    color: '#A0AEC0',
    textTransform: 'uppercase',
    padding: '6px 16px',
    letterSpacing: '0.5px',
  },
  dropdownItem: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: '10px 16px',
    cursor: 'pointer',
    transition: 'background-color 0.2s',
    '&:hover': {
      backgroundColor: '#F7F9FA',
    }
  },
  itemTitle: {
    fontSize: '0.85rem',
    fontWeight: '600',
    color: '#2D3748',
  },
  itemCategory: {
    fontSize: '0.72rem',
    color: '#718096',
    backgroundColor: '#EDF2F7',
    padding: '2px 6px',
    borderRadius: '4px',
  },
  right: {
    display: 'flex',
    alignItems: 'center',
    gap: '20px',
  },
  notificationWrapper: {
    position: 'relative',
  },
  iconBtn: {
    background: 'none',
    border: 'none',
    cursor: 'pointer',
    padding: '6px',
    borderRadius: '50%',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative',
    transition: 'background-color 0.2s',
  },
  badge: {
    position: 'absolute',
    top: '2px',
    right: '2px',
    backgroundColor: '#3F83F8',
    color: '#FFFFFF',
    fontSize: '0.65rem',
    fontWeight: '700',
    borderRadius: '50%',
    width: '15px',
    height: '15px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    border: '1.5px solid #FFFFFF',
  },
  notificationDropdown: {
    position: 'absolute',
    top: '40px',
    right: '-10px',
    width: '320px',
    backgroundColor: '#FFFFFF',
    borderRadius: '16px',
    boxShadow: '0 10px 40px rgba(0, 0, 0, 0.1)',
    border: '1px solid #EAECEF',
    zIndex: 1000,
    overflow: 'hidden',
  },
  notifHeaderRow: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: '16px',
    borderBottom: '1px solid #F3F4F6',
  },
  notifHeaderTitle: {
    fontSize: '0.92rem',
    fontWeight: '800',
    color: '#2D3748',
  },
  notifHeaderCount: {
    fontSize: '0.75rem',
    fontWeight: '700',
    color: '#3F83F8',
    backgroundColor: '#EBF8FF',
    padding: '2px 8px',
    borderRadius: '10px',
  },
  notifList: {
    display: 'flex',
    flexDirection: 'column',
    maxHeight: '300px',
    overflowY: 'auto',
  },
  notifItem: {
    display: 'flex',
    gap: '12px',
    padding: '12px 16px',
    borderBottom: '1px solid #F9FAFB',
    cursor: 'pointer',
    transition: 'background-color 0.2s',
    '&:hover': {
      backgroundColor: '#F8FAFC',
    }
  },
  notifIconCircle: {
    width: '32px',
    height: '32px',
    borderRadius: '50%',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    flexShrink: 0,
  },
  notifBody: {
    display: 'flex',
    flexDirection: 'column',
  },
  notifItemTitle: {
    fontSize: '0.82rem',
    fontWeight: '700',
    color: '#2D3748',
  },
  notifItemDesc: {
    fontSize: '0.74rem',
    color: '#718096',
    marginTop: '2px',
    lineHeight: '1.3',
  },
  profileSection: {
    display: 'flex',
    alignItems: 'center',
    gap: '10px',
    cursor: 'pointer',
    padding: '6px 12px',
    borderRadius: '12px',
    transition: 'background-color 0.2s',
  },
  avatar: {
    width: '36px',
    height: '36px',
    borderRadius: '50%',
    backgroundColor: '#E2E8F0',
    objectFit: 'cover',
    border: '1.5px solid #E2E8F0',
  },
  profileText: {
    display: 'flex',
    flexDirection: 'column',
    textAlign: 'left',
  },
  userName: {
    fontSize: '0.85rem',
    fontWeight: '700',
    color: '#2D3748',
    lineHeight: '1.2',
  },
  userTitle: {
    fontSize: '0.72rem',
    fontWeight: '600',
    color: '#718096',
    marginTop: '1px',
  },
  caret: {
    flexShrink: 0,
  }
};
