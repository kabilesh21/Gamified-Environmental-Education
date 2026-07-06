import React, { useState, useEffect, useContext } from 'react';
import axios from 'axios';
import { motion } from 'framer-motion';
import { AuthContext } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import { Lock, HelpCircle, Save, ShoppingBag, ArrowUp, ArrowDown, ArrowLeft, ArrowRight, CheckCircle2 } from 'lucide-react';

export default function EcoGarden() {
  const { user } = useContext(AuthContext);
  const navigate = useNavigate();
  
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedItem, setSelectedItem] = useState(null);
  const [saving, setSaving] = useState(false);
  const [successMsg, setSuccessMsg] = useState('');
  const [activeTheme, setActiveTheme] = useState('woodland');
  const [isNightMode, setIsNightMode] = useState(false);
  const [particles, setParticles] = useState([]);

  const handleGardenItemClick = (e, item) => {
    if (!item.unlocked) return;
    
    // Select the item
    handleItemSelect(item);

    // Create floating particle
    const canvas = e.currentTarget.parentElement;
    const canvasRect = canvas.getBoundingClientRect();
    const x = e.clientX - canvasRect.left;
    const y = e.clientY - canvasRect.top;

    const emojis = ['✨', '🍃', '🌸', '🌟', '💖', '🌱', '🫧', '🦋', '🎈'];
    const randomEmoji = emojis[Math.floor(Math.random() * emojis.length)];

    const newParticle = {
      id: Date.now() + Math.random(),
      x,
      y,
      emoji: randomEmoji
    };

    setParticles(prev => [...prev, newParticle]);

    // Clear particle after 1 second
    setTimeout(() => {
      setParticles(prev => prev.filter(p => p.id !== newParticle.id));
    }, 1000);
  };

  const fetchGarden = async () => {
    try {
      const res = await axios.get(`/api/garden?theme=${activeTheme}`);
      setItems(res.data);
    } catch (err) {
      console.error("Failed to load garden items", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchGarden();
  }, [activeTheme]);

  const handleItemSelect = (item) => {
    if (!item.unlocked) {
      // Prompt to buy in shop
      return;
    }
    setSelectedItem(item);
    setSuccessMsg('');
  };

  const moveSelectedItem = (dir) => {
    if (!selectedItem) return;
    
    let step = 5; // move by 5%
    let newX = selectedItem.x;
    let newY = selectedItem.y;

    if (dir === 'up') newY = Math.max(10, newY - step);
    if (dir === 'down') newY = Math.min(85, newY + step);
    if (dir === 'left') newX = Math.max(5, newX - step);
    if (dir === 'right') newX = Math.min(90, newX + step);

    // Update locally
    const updated = items.map(item => {
      if (item.itemKey === selectedItem.itemKey) {
        const u = { ...item, x: newX, y: newY };
        setSelectedItem(u);
        return u;
      }
      return item;
    });
    setItems(updated);
  };

  const saveLayout = async () => {
    if (!selectedItem) return;
    setSaving(true);
    try {
      await axios.post('/api/garden/update-position', {
        itemKey: selectedItem.itemKey,
        x: selectedItem.x,
        y: selectedItem.y,
        theme: activeTheme
      });
      setSuccessMsg(`Saved position of ${getItemName(selectedItem.itemKey)}!`);
      setTimeout(() => setSuccessMsg(''), 3000);
    } catch (err) {
      console.error("Failed to save item position", err);
    } finally {
      setSaving(false);
    }
  };

function AnimatedEmoji({ itemKey, emoji, size = '2.2rem', active = true }) {
  const isToy = itemKey.startsWith('toy_') || itemKey.startsWith('animal_');
  
  if (!isToy || !active) {
    return <span style={{ fontSize: size }}>{emoji}</span>;
  }
  
  let animateProps = {};
  if (itemKey === 'toy_windmill') {
    animateProps = {
      animate: { rotate: 360 },
      transition: { duration: 3, repeat: Infinity, ease: 'linear' }
    };
  } else if (itemKey === 'toy_solar_train') {
    animateProps = {
      animate: { x: [-10, 10, -10] },
      transition: { duration: 2.5, repeat: Infinity, ease: 'easeInOut' }
    };
  } else if (itemKey === 'toy_solar_robot') {
    animateProps = {
      animate: { rotate: [-12, 12, -12], scaleY: [1, 1.06, 1] },
      transition: { duration: 1.6, repeat: Infinity, ease: 'easeInOut' }
    };
  } else if (itemKey === 'toy_drinking_bird') {
    animateProps = {
      animate: { rotate: [0, 25, 0], y: [0, 4, 0] },
      transition: { duration: 2, repeat: Infinity, ease: 'easeInOut' }
    };
  } else if (itemKey === 'toy_fountain') {
    animateProps = {
      animate: { y: [0, -3, 0], scale: [1, 1.06, 1] },
      transition: { duration: 1.2, repeat: Infinity, ease: 'easeInOut' }
    };
  } else if (itemKey === 'toy_bubble_machine') {
    animateProps = {
      animate: { scale: [1, 1.1, 0.9, 1.1, 1], rotate: [0, 6, -6, 0] },
      transition: { duration: 2.2, repeat: Infinity, ease: 'easeInOut' }
    };
  } else if (itemKey === 'toy_kite') {
    animateProps = {
      animate: { y: [0, -12, 0], x: [0, 8, 0], rotate: [-6, 15, -6] },
      transition: { duration: 3.5, repeat: Infinity, ease: 'easeInOut' }
    };
  } else if (itemKey === 'animal_butterfly') {
    animateProps = {
      animate: { y: [0, -6, 0], x: [0, 4, 0], scale: [1, 1.1, 1] },
      transition: { duration: 1.8, repeat: Infinity, ease: 'easeInOut' }
    };
  } else if (itemKey === 'animal_bird') {
    animateProps = {
      animate: { y: [0, -4, 0], scaleX: [1, -1, 1] },
      transition: { duration: 2.2, repeat: Infinity, ease: 'easeInOut' }
    };
  } else {
    animateProps = {
      animate: { y: [0, -5, 0] },
      transition: { duration: 1.2, repeat: Infinity, ease: 'easeInOut' }
    };
  }

  return (
    <motion.span
      style={{ display: 'inline-block', fontSize: size }}
      {...animateProps}
    >
      {emoji}
    </motion.span>
  );
}

  const getItemEmoji = (key) => {
    switch (key) {
      case "tree_oak": return "🌳";
      case "tree_bamboo": return "🎋";
      case "tree_cherry": return "🌸";
      case "flower_sunflower": return "🌻";
      case "flower_rose": return "🌹";
      case "flower_tulip": return "🌷";
      case "animal_butterfly": return "🦋";
      case "animal_bird": return "🐦";
      case "dec_bench": return "🪑";
      case "dec_rainbow": return "🌈";
      case "garden_windmill": return "⚙️";
      case "garden_solar": return "☀️";
      case "garden_pond": return "⛲";
      case "garden_hive": return "🐝";
      case "toy_windmill": return "🎡";
      case "toy_solar_train": return "🚂";
      case "toy_solar_robot": return "🤖";
      case "toy_drinking_bird": return "🐤";
      case "toy_fountain": return "⛲";
      case "toy_bubble_machine": return "🫧";
      case "toy_kite": return "🪁";
      default: return "🌿";
    }
  };

  const getItemName = (key) => {
    return key.replace(/_/g, ' ').replace(/\b\w/g, c => c.toUpperCase());
  };

  const unlockedCount = items.filter(i => i.unlocked).length;
  const totalCount = items.length || 1;
  const completionPercent = Math.round((unlockedCount * 100) / totalCount);
  
  const isAlpineUnlocked = unlockedCount >= 9;
  const isCoastalUnlocked = unlockedCount >= 18;

  if (loading) {
    return (
      <div style={styles.loading}>
        <div className="btn btn-ghost">Loading Eco Garden...</div>
      </div>
    );
  }

  return (
    <div style={styles.container}>
      <div style={styles.header}>
        <div>
          <h1 style={styles.title}>Your Personal Eco Garden</h1>
          <p style={styles.subtitle}>Unlock decorations, flowers, trees, and animals in the Reward Shop to customize your nature reserve.</p>
        </div>
        <div style={styles.completionCard}>
          <span style={styles.completionLabel}>Garden Completion</span>
          <span style={styles.completionVal}>{completionPercent}%</span>
          <div style={styles.progressBarBg}>
            <div style={{ ...styles.progressBarFill, width: `${completionPercent}%` }} />
          </div>
        </div>
      </div>

      {/* Theme selection bar */}
      <div style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        backgroundColor: '#FFFFFF',
        border: '1px solid #EADBCE',
        borderRadius: '16px',
        padding: '12px 24px',
        marginBottom: '20px',
        flexWrap: 'wrap',
        gap: '15px',
        boxShadow: '0 4px 12px rgba(139, 107, 74, 0.02)'
      }}>
        <div style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
          <span style={{ fontSize: '0.88rem', fontWeight: '800', color: '#8B6B4A', textTransform: 'uppercase' }}>Select Garden:</span>
          <div style={{ display: 'flex', gap: '8px' }}>
            <button
              onClick={() => setActiveTheme('woodland')}
              style={{
                padding: '8px 16px',
                borderRadius: '10px',
                border: '1px solid #EADBCE',
                fontSize: '0.85rem',
                fontWeight: '700',
                cursor: 'pointer',
                backgroundColor: activeTheme === 'woodland' ? '#7FB77E' : '#FFFFFF',
                color: activeTheme === 'woodland' ? '#FFFFFF' : '#8B6B4A',
                transition: 'all 0.2s'
              }}
            >
              🌳 Woodland Reserve
            </button>
            <button
              onClick={() => isAlpineUnlocked && setActiveTheme('alpine')}
              disabled={!isAlpineUnlocked}
              style={{
                padding: '8px 16px',
                borderRadius: '10px',
                border: '1px solid #EADBCE',
                fontSize: '0.85rem',
                fontWeight: '700',
                cursor: isAlpineUnlocked ? 'pointer' : 'not-allowed',
                backgroundColor: activeTheme === 'alpine' ? '#5DADE2' : '#FFFFFF',
                color: activeTheme === 'alpine' ? '#FFFFFF' : '#8B6B4A',
                opacity: isAlpineUnlocked ? 1 : 0.65,
                display: 'flex',
                alignItems: 'center',
                gap: '6px',
                transition: 'all 0.2s'
              }}
            >
              {!isAlpineUnlocked && <Lock size={12} />}
              🏔️ Alpine Peaks
            </button>
            <button
              onClick={() => isCoastalUnlocked && setActiveTheme('coastal')}
              disabled={!isCoastalUnlocked}
              style={{
                padding: '8px 16px',
                borderRadius: '10px',
                border: '1px solid #EADBCE',
                fontSize: '0.85rem',
                fontWeight: '700',
                cursor: isCoastalUnlocked ? 'pointer' : 'not-allowed',
                backgroundColor: activeTheme === 'coastal' ? '#F4D03F' : '#FFFFFF',
                color: activeTheme === 'coastal' ? '#FFFFFF' : '#8B6B4A',
                opacity: isCoastalUnlocked ? 1 : 0.65,
                display: 'flex',
                alignItems: 'center',
                gap: '6px',
                transition: 'all 0.2s'
              }}
            >
              {!isCoastalUnlocked && <Lock size={12} />}
              🏝️ Coastal Oasis
            </button>
          </div>
        </div>

        <div style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
          <button
            onClick={() => setIsNightMode(!isNightMode)}
            style={{
              padding: '8px 16px',
              borderRadius: '10px',
              border: '1px solid #EADBCE',
              fontSize: '0.85rem',
              fontWeight: '700',
              cursor: 'pointer',
              backgroundColor: isNightMode ? '#2E4053' : '#F8F9F9',
              color: isNightMode ? '#FFFFFF' : '#2C3E50',
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
              transition: 'all 0.2s'
            }}
          >
            {isNightMode ? "☀️ Switch to Day" : "🌙 Switch to Night"}
          </button>
        </div>
      </div>

      <div style={styles.layout}>
        {/* Visual Garden Canvas */}
        <div style={styles.canvasContainer}>
          <div style={{
            ...styles.gardenCanvas,
            background: activeTheme === 'woodland' 
              ? (isNightMode ? 'linear-gradient(180deg, #112233 0%, #224466 100%)' : 'linear-gradient(180deg, #D0E8C4 0%, #A3C9A8 100%)')
              : activeTheme === 'alpine'
              ? (isNightMode ? 'linear-gradient(180deg, #0f171e 0%, #1c2e3d 100%)' : 'linear-gradient(180deg, #E6EFF6 0%, #A9C2D6 100%)')
              : (isNightMode ? 'linear-gradient(180deg, #0a1128 0%, #001f54 100%)' : 'linear-gradient(180deg, #DCEFFA 0%, #8ec5fc 100%)'),
            borderColor: isNightMode ? '#2D241E' : '#F8F5F1',
            boxShadow: isNightMode ? '0 8px 30px rgba(0, 0, 0, 0.4)' : '0 8px 30px rgba(139, 107, 74, 0.08)'
          }}>
            {/* Theme-specific decorators */}
            {activeTheme === 'woodland' && (
              <>
                <div style={{ ...styles.pondDecorator, backgroundColor: isNightMode ? '#2B4A6F' : '#A0C4DF', borderColor: isNightMode ? '#3C648F' : '#BBD9EE' }} />
                <div style={styles.pathDecorator} />
              </>
            )}
            
            {activeTheme === 'alpine' && (
              <>
                {/* Winding mountain river path */}
                <div style={{
                  position: 'absolute',
                  width: '30px',
                  height: '400px',
                  backgroundColor: isNightMode ? '#1C3D5A' : '#7EC8E3',
                  borderRadius: '15px',
                  transform: 'rotate(45deg)',
                  top: '50px',
                  left: '100px',
                  opacity: 0.7,
                  border: isNightMode ? '2px solid #2B4A6F' : '2px solid #BFE7F7'
                }} />
                {/* Mountain snow peak decorators */}
                <div style={{
                  position: 'absolute',
                  bottom: '0',
                  right: '20px',
                  width: '150px',
                  height: '100px',
                  backgroundColor: isNightMode ? '#334E68' : '#D0E1FD',
                  clipPath: 'polygon(50% 0%, 0% 100%, 100% 100%)',
                  opacity: 0.5
                }} />
              </>
            )}

            {activeTheme === 'coastal' && (
              <>
                {/* Sandy Beach Decorator */}
                <div style={{
                  position: 'absolute',
                  width: '100%',
                  height: '150px',
                  backgroundColor: isNightMode ? '#5C5446' : '#F5E6C8',
                  bottom: '0',
                  left: '0',
                  borderTop: isNightMode ? '3px solid #7D6C58' : '3px solid #EADBCE',
                  opacity: 0.8
                }} />
                {/* Sea waves decorators */}
                <div style={{
                  position: 'absolute',
                  width: '200px',
                  height: '80px',
                  borderRadius: '50%',
                  border: isNightMode ? '4px solid rgba(255,255,255,0.05)' : '4px solid rgba(255,255,255,0.2)',
                  top: '100px',
                  left: '150px'
                }} />
              </>
            )}

            {/* Sun/Moon Decorator */}
            <div style={{
              ...styles.sunDecorator,
              backgroundColor: isNightMode ? '#F4F6F7' : '#FCF3CF',
              boxShadow: isNightMode ? '0 0 30px rgba(255, 255, 255, 0.4)' : '0 0 25px rgba(252, 243, 207, 0.3)',
              fontSize: '2.5rem',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              cursor: 'pointer',
              zIndex: 2
            }}
            onClick={() => setIsNightMode(!isNightMode)}
            title={isNightMode ? "Switch to Day" : "Switch to Night"}
            >
              {isNightMode ? "🌕" : "☀️"}
            </div>

            {/* Render Garden Items */}
            {items.map((item) => {
              const isSelected = selectedItem && selectedItem.itemKey === item.itemKey;
              return (
                <motion.div
                  key={item.itemKey}
                  style={{
                    ...styles.gardenItem,
                    left: `${item.x}%`,
                    top: `${item.y}%`,
                    filter: item.unlocked ? 'none' : 'grayscale(100%) opacity(0.35)',
                    cursor: item.unlocked ? 'pointer' : 'help',
                    border: isSelected ? '2px dashed #7FB77E' : 'none',
                    backgroundColor: isSelected ? 'rgba(127,183,126,0.25)' : 'transparent',
                    boxShadow: isSelected ? '0 0 15px rgba(127,183,126,0.7)' : 'none',
                    zIndex: isSelected ? 10 : 3
                  }}
                  whileHover={{ scale: item.unlocked ? 1.25 : 1 }}
                  whileTap={{ scale: item.unlocked ? 0.85 : 1, rotate: item.unlocked ? [0, -5, 5, 0] : 0 }}
                  onClick={(e) => handleGardenItemClick(e, item)}
                  title={item.unlocked ? `Click to position ${getItemName(item.itemKey)}` : `${getItemName(item.itemKey)} (Locked)`}
                >
                  <AnimatedEmoji itemKey={item.itemKey} emoji={getItemEmoji(item.itemKey)} size="2.5rem" active={item.unlocked} />
                  {!item.unlocked && (
                    <div style={styles.lockBadge}>
                      <Lock size={10} color="#FFFFFF" />
                    </div>
                  )}
                </motion.div>
              );
            })}

            {/* Render Floating Particles */}
            {particles.map(p => (
              <motion.div
                key={p.id}
                initial={{ opacity: 1, y: p.y - 10, x: p.x - 10, scale: 0.8 }}
                animate={{ opacity: 0, y: p.y - 80, scale: 1.6, rotate: 45 }}
                transition={{ duration: 0.9, ease: "easeOut" }}
                style={{
                  position: 'absolute',
                  pointerEvents: 'none',
                  fontSize: '1.6rem',
                  zIndex: 100,
                }}
              >
                {p.emoji}
              </motion.div>
            ))}
          </div>
        </div>

        {/* Sidebar Controls */}
        <div style={styles.controlsCard}>
          <h3 style={styles.controlsTitle}>Garden Inventory</h3>
          
          <div style={styles.itemList}>
            {items.map(item => (
              <div 
                key={item.itemKey} 
                style={{
                  ...styles.inventoryRow,
                  borderColor: selectedItem?.itemKey === item.itemKey ? '#7FB77E' : '#EADBCE',
                  backgroundColor: selectedItem?.itemKey === item.itemKey ? '#F4F9F4' : '#FFFFFF'
                }}
                onClick={() => handleItemSelect(item)}
              >
                <AnimatedEmoji itemKey={item.itemKey} emoji={getItemEmoji(item.itemKey)} size="1.6rem" active={item.unlocked} />
                <div style={styles.rowDetails}>
                  <span style={styles.rowName}>{getItemName(item.itemKey)}</span>
                  <span style={{ 
                    ...styles.rowStatus, 
                    color: item.unlocked ? '#7FB77E' : '#A39387' 
                  }}>
                    {item.unlocked ? 'Unlocked' : 'Locked'}
                  </span>
                </div>
                {!item.unlocked && (
                  <button 
                    onClick={(e) => {
                      e.stopPropagation();
                      navigate('/shop');
                    }}
                    style={styles.shopBtn}
                    title="Unlock in shop"
                  >
                    <ShoppingBag size={14} />
                  </button>
                )}
              </div>
            ))}
          </div>

          {selectedItem && (
            <motion.div 
              style={styles.positioningWidget}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
            >
              <h4 style={styles.widgetTitle}>Position {getItemName(selectedItem.itemKey)}</h4>
              <p style={styles.widgetSub}>Use controls to move item around your garden reserve.</p>
              
              <div style={styles.directionPad}>
                <div />
                <button onClick={() => moveSelectedItem('up')} style={styles.padBtn}><ArrowUp size={16} /></button>
                <div />
                <button onClick={() => moveSelectedItem('left')} style={styles.padBtn}><ArrowLeft size={16} /></button>
                <div style={styles.padCenter}>
                  <AnimatedEmoji itemKey={selectedItem.itemKey} emoji={getItemEmoji(selectedItem.itemKey)} size="1.2rem" active={selectedItem.unlocked} />
                </div>
                <button onClick={() => moveSelectedItem('right')} style={styles.padBtn}><ArrowRight size={16} /></button>
                <div />
                <button onClick={() => moveSelectedItem('down')} style={styles.padBtn}><ArrowDown size={16} /></button>
                <div />
              </div>

              <button 
                onClick={saveLayout}
                disabled={saving}
                style={styles.saveBtn}
              >
                <Save size={16} />
                <span>{saving ? 'Saving...' : 'Save Position'}</span>
              </button>
            </motion.div>
          )}

          {successMsg && (
            <motion.div 
              style={styles.successAlert}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
            >
              <CheckCircle2 size={16} />
              <span>{successMsg}</span>
            </motion.div>
          )}
        </div>
      </div>
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
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    flexWrap: 'wrap',
    gap: '20px',
    marginBottom: '30px',
  },
  title: {
    fontSize: '2rem',
    fontWeight: '800',
    color: '#1b4d2c',
  },
  subtitle: {
    fontSize: '1rem',
    color: '#6E5C50',
    marginTop: '4px',
  },
  completionCard: {
    backgroundColor: '#FFFFFF',
    border: '1px solid #EADBCE',
    borderRadius: '16px',
    padding: '16px 20px',
    minWidth: '220px',
    boxShadow: '0 4px 12px rgba(139, 107, 74, 0.03)',
  },
  completionLabel: {
    fontSize: '0.8rem',
    fontWeight: '700',
    color: '#A39387',
    textTransform: 'uppercase',
  },
  completionVal: {
    fontSize: '1.8rem',
    fontWeight: '800',
    color: '#1b4d2c',
    display: 'block',
    margin: '4px 0',
  },
  progressBarBg: {
    height: '8px',
    backgroundColor: '#F8F5F1',
    borderRadius: '4px',
    overflow: 'hidden',
  },
  progressBarFill: {
    height: '100%',
    backgroundColor: '#7FB77E',
    borderRadius: '4px',
    transition: 'width 0.4s ease',
  },
  layout: {
    display: 'flex',
    gap: '24px',
    flexWrap: 'wrap',
  },
  canvasContainer: {
    flex: 2,
    minWidth: '320px',
  },
  gardenCanvas: {
    width: '100%',
    height: '500px',
    backgroundColor: '#D0E8C4',
    border: '8px solid #F8F5F1',
    borderRadius: '24px',
    boxShadow: '0 8px 30px rgba(139, 107, 74, 0.08)',
    position: 'relative',
    overflow: 'hidden',
  },
  pondDecorator: {
    position: 'absolute',
    width: '120px',
    height: '90px',
    backgroundColor: '#A0C4DF',
    borderRadius: '50%',
    bottom: '40px',
    left: '30px',
    border: '4px solid #BBD9EE',
    opacity: 0.6,
  },
  pathDecorator: {
    position: 'absolute',
    width: '200px',
    height: '40px',
    backgroundColor: '#E6DCC3',
    transform: 'rotate(-25deg)',
    top: '150px',
    right: '-50px',
    opacity: 0.5,
  },
  sunDecorator: {
    position: 'absolute',
    width: '180px',
    height: '180px',
    borderRadius: '50%',
    backgroundColor: '#FCF3CF',
    top: '-80px',
    left: '-80px',
    opacity: 0.4,
  },
  gardenItem: {
    position: 'absolute',
    width: '45px',
    height: '45px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: '50%',
    transition: 'transform 0.2s',
  },
  itemEmoji: {
    fontSize: '2.2rem',
  },
  lockBadge: {
    position: 'absolute',
    right: '-2px',
    bottom: '-2px',
    backgroundColor: '#7B726C',
    borderRadius: '50%',
    width: '16px',
    height: '16px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    boxShadow: '0 2px 4px rgba(0,0,0,0.2)',
  },
  controlsCard: {
    flex: 1,
    minWidth: '280px',
    backgroundColor: '#FFFFFF',
    border: '1px solid #EADBCE',
    borderRadius: '20px',
    padding: '24px',
    boxShadow: '0 4px 12px rgba(139, 107, 74, 0.03)',
    display: 'flex',
    flexDirection: 'column',
    gap: '20px',
    maxHeight: '700px',
  },
  controlsTitle: {
    fontSize: '1.2rem',
    fontWeight: '700',
    color: '#8B6B4A',
    borderBottom: '1px solid #F8F5F1',
    paddingBottom: '12px',
  },
  itemList: {
    display: 'flex',
    flexDirection: 'column',
    gap: '10px',
    overflowY: 'auto',
    flex: 1,
    paddingRight: '6px',
  },
  inventoryRow: {
    display: 'flex',
    alignItems: 'center',
    gap: '12px',
    padding: '10px 14px',
    border: '1px solid #EADBCE',
    borderRadius: '12px',
    cursor: 'pointer',
    transition: 'all 0.2s',
  },
  rowEmoji: {
    fontSize: '1.6rem',
  },
  rowDetails: {
    display: 'flex',
    flexDirection: 'column',
    flex: 1,
  },
  rowName: {
    fontSize: '0.9rem',
    fontWeight: '600',
    color: '#2D241E',
  },
  rowStatus: {
    fontSize: '0.75rem',
    fontWeight: '500',
  },
  shopBtn: {
    border: 'none',
    backgroundColor: '#7FB77E',
    color: '#FFFFFF',
    width: '28px',
    height: '28px',
    borderRadius: '50%',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    cursor: 'pointer',
  },
  positioningWidget: {
    backgroundColor: '#F8F5F1',
    borderRadius: '16px',
    padding: '16px',
    display: 'flex',
    flexDirection: 'column',
    gap: '12px',
  },
  widgetTitle: {
    fontSize: '0.95rem',
    fontWeight: '700',
    color: '#1b4d2c',
  },
  widgetSub: {
    fontSize: '0.75rem',
    color: '#A39387',
    marginTop: '-4px',
  },
  directionPad: {
    display: 'grid',
    gridTemplateColumns: 'repeat(3, 1fr)',
    gap: '6px',
    width: '120px',
    margin: '0 auto',
  },
  padBtn: {
    border: '1px solid #EADBCE',
    backgroundColor: '#FFFFFF',
    borderRadius: '8px',
    width: '36px',
    height: '36px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    cursor: 'pointer',
    color: '#8B6B4A',
  },
  padCenter: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    width: '36px',
    height: '36px',
  },
  saveBtn: {
    backgroundColor: '#1b4d2c',
    color: '#FFFFFF',
    border: 'none',
    borderRadius: '12px',
    padding: '10px 16px',
    fontWeight: '700',
    fontSize: '0.85rem',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: '8px',
    cursor: 'pointer',
    width: '100%',
  },
  successAlert: {
    backgroundColor: 'rgba(127,183,126,0.15)',
    color: '#1b4d2c',
    border: '1px solid #7FB77E',
    borderRadius: '12px',
    padding: '10px 14px',
    fontSize: '0.8rem',
    fontWeight: '600',
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
  },
};
