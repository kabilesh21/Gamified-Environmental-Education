import React, { useState, useEffect, useContext } from 'react';
import axios from 'axios';
import { motion, AnimatePresence } from 'framer-motion';
import { AuthContext } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import { ShoppingBag, Coins, HelpCircle, CheckCircle2, ChevronRight, AlertCircle, ShoppingCart } from 'lucide-react';

export default function RewardShop() {
  const { user, refreshUserData } = useContext(AuthContext);
  const navigate = useNavigate();

  const [shopItems, setShopItems] = useState([]);
  const [unlockedKeys, setUnlockedKeys] = useState(new Set());
  const [loading, setLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState('All');
  
  // Purchase State
  const [confirmItem, setConfirmItem] = useState(null);
  const [buying, setBuying] = useState(false);
  const [purchaseSuccess, setPurchaseSuccess] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  const categories = ['All', 'Trees', 'Flowers', 'Animals', 'Decorations', 'Garden Items'];

  const loadShopData = async () => {
    try {
      const shopRes = await axios.get('/api/shop/items');
      const gardenRes = await axios.get('/api/garden');
      
      setShopItems(shopRes.data);
      const unlocked = new Set(
        gardenRes.data.filter(item => item.unlocked).map(item => item.itemKey)
      );
      setUnlockedKeys(unlocked);
    } catch (err) {
      console.error("Failed to load shop items", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadShopData();
  }, []);

  const handlePurchaseClick = (item) => {
    if (unlockedKeys.has(item.itemKey)) return;
    setConfirmItem(item);
    setErrorMsg('');
  };

  const confirmPurchase = async () => {
    if (!confirmItem) return;
    if ((user?.coins || 0) < confirmItem.price) {
      setErrorMsg("You do not have enough Eco Coins to buy this item!");
      return;
    }

    setBuying(true);
    setErrorMsg('');
    try {
      const res = await axios.post(`/api/shop/buy/${confirmItem.itemKey}`);
      setPurchaseSuccess(true);
      
      // Update local state
      setUnlockedKeys(prev => {
        const next = new Set(prev);
        next.add(confirmItem.itemKey);
        return next;
      });
      
      // Sync global user coins
      await refreshUserData();

      setTimeout(() => {
        setPurchaseSuccess(false);
        setConfirmItem(null);
      }, 2000);
    } catch (err) {
      const msg = err.response?.data?.message || "Purchase failed. Please try again.";
      setErrorMsg(msg);
    } finally {
      setBuying(false);
    }
  };

function AnimatedEmoji({ itemKey, emoji, isCard = false }) {
  const isToy = itemKey.startsWith('toy_') || itemKey.startsWith('animal_');
  const size = isCard ? '4rem' : '2.2rem';
  
  if (!isToy) {
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
      default: return "🌿";
    }
  };

  const filteredItems = selectedCategory === 'All'
    ? shopItems
    : shopItems.filter(item => item.category.toLowerCase() === selectedCategory.toLowerCase());

  if (loading) {
    return (
      <div style={styles.loading}>
        <div className="btn btn-ghost">Loading Reward Shop catalog...</div>
      </div>
    );
  }

  return (
    <div style={styles.container}>
      {/* Shop Header */}
      <div style={styles.header}>
        <div>
          <h1 style={styles.title}>Eco Reward Shop</h1>
          <p style={styles.subtitle}>Spend your earned Eco Coins on trees, flowers, and decorations to upgrade your Eco Garden reserve.</p>
        </div>
        <div style={styles.coinBalanceCard}>
          <div style={styles.coinIconBg}>
            <Coins size={22} color="#D4AC0D" />
          </div>
          <div>
            <span style={styles.balanceLabel}>Your Balance</span>
            <span style={styles.balanceVal}>{user?.coins || 0} Coins</span>
          </div>
        </div>
      </div>

      {/* Category Navigation Tabs */}
      <div style={styles.tabBar}>
        {categories.map(cat => (
          <button
            key={cat}
            onClick={() => setSelectedCategory(cat)}
            style={{
              ...styles.tabBtn,
              borderColor: selectedCategory === cat ? '#7FB77E' : 'transparent',
              backgroundColor: selectedCategory === cat ? '#F4F9F4' : '#FFFFFF',
              color: selectedCategory === cat ? '#1b4d2c' : '#8B6B4A',
            }}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* Shop Grid */}
      <div style={styles.grid}>
        {filteredItems.map((item) => {
          const isPurchased = unlockedKeys.has(item.itemKey);
          return (
            <motion.div
              key={item.id}
              style={styles.card}
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              whileHover={{ y: -6, boxShadow: "0 12px 30px rgba(139, 107, 74, 0.1)" }}
            >
              <div style={styles.emojiContainer}>
                <AnimatedEmoji itemKey={item.itemKey} emoji={getItemEmoji(item.itemKey)} isCard={true} />
              </div>
              <div style={styles.cardBody}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
                  <h3 style={styles.itemName}>{item.name}</h3>
                  <span style={styles.categoryBadge}>{item.category}</span>
                </div>
                <p style={styles.itemDesc}>{item.description}</p>
                <div style={styles.priceRow}>
                  <div style={styles.priceTag}>
                    <Coins size={16} color="#D4AC0D" />
                    <span>{item.price} Eco Coins</span>
                  </div>
                  <button
                    onClick={() => handlePurchaseClick(item)}
                    disabled={isPurchased}
                    style={{
                      ...styles.buyBtn,
                      backgroundColor: isPurchased ? '#EADBCE' : '#1b4d2c',
                      color: isPurchased ? '#A39387' : '#FFFFFF',
                      cursor: isPurchased ? 'default' : 'pointer'
                    }}
                  >
                    {isPurchased ? 'Purchased' : 'Buy Item'}
                  </button>
                </div>
              </div>
            </motion.div>
          );
        })}
      </div>

      {/* Confirmation Modal */}
      <AnimatePresence>
        {confirmItem && (
          <div style={styles.modalOverlay}>
            <motion.div
              style={styles.modalContent}
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
            >
              {!purchaseSuccess ? (
                <>
                  <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '16px' }}>
                    <div style={styles.modalEmojiContainer}>
                      <AnimatedEmoji itemKey={confirmItem.itemKey} emoji={getItemEmoji(confirmItem.itemKey)} isCard={true} />
                    </div>
                  </div>
                  <h3 style={styles.modalTitle}>Confirm Purchase</h3>
                  <p style={styles.modalText}>
                    Are you sure you want to purchase <strong>{confirmItem.name}</strong> for <strong>{confirmItem.price} Eco Coins</strong>?
                  </p>
                  
                  {errorMsg && (
                    <div style={styles.errorAlert}>
                      <AlertCircle size={16} />
                      <span>{errorMsg}</span>
                    </div>
                  )}

                  <div style={styles.modalActions}>
                    <button
                      onClick={() => setConfirmItem(null)}
                      disabled={buying}
                      style={styles.cancelBtn}
                    >
                      Cancel
                    </button>
                    <button
                      onClick={confirmPurchase}
                      disabled={buying}
                      style={styles.confirmBtn}
                    >
                      {buying ? 'Processing...' : 'Confirm'}
                    </button>
                  </div>
                </>
              ) : (
                <div style={styles.successWrapper}>
                  <CheckCircle2 size={48} color="#7FB77E" />
                  <h3 style={styles.successTitle}>Purchase Successful!</h3>
                  <p style={styles.successSub}>
                    {confirmItem.name} has been added to your inventory. Go decorate your garden reserve!
                  </p>
                  <button 
                    onClick={() => {
                      setConfirmItem(null);
                      navigate('/garden');
                    }}
                    style={styles.viewGardenBtn}
                  >
                    <span>Go to Garden</span>
                    <ChevronRight size={16} />
                  </button>
                </div>
              )}
            </motion.div>
          </div>
        )}
      </AnimatePresence>
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
  coinBalanceCard: {
    backgroundColor: '#FFFFFF',
    border: '1px solid #EADBCE',
    borderRadius: '16px',
    padding: '12px 20px',
    display: 'flex',
    alignItems: 'center',
    gap: '12px',
    boxShadow: '0 4px 12px rgba(139, 107, 74, 0.03)',
  },
  coinIconBg: {
    width: '40px',
    height: '40px',
    borderRadius: '50%',
    backgroundColor: 'rgba(212,172,13,0.1)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
  balanceLabel: {
    fontSize: '0.75rem',
    fontWeight: '700',
    color: '#A39387',
    textTransform: 'uppercase',
    display: 'block',
  },
  balanceVal: {
    fontSize: '1.2rem',
    fontWeight: '800',
    color: '#2D241E',
  },
  tabBar: {
    display: 'flex',
    gap: '12px',
    flexWrap: 'wrap',
    marginBottom: '30px',
  },
  tabBtn: {
    border: '1px solid #EADBCE',
    borderRadius: '12px',
    padding: '8px 16px',
    fontWeight: '700',
    fontSize: '0.85rem',
    cursor: 'pointer',
    transition: 'all 0.2s',
  },
  grid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))',
    gap: '24px',
  },
  card: {
    backgroundColor: '#FFFFFF',
    border: '1px solid #EADBCE',
    borderRadius: '20px',
    overflow: 'hidden',
    display: 'flex',
    flexDirection: 'column',
    boxShadow: '0 4px 12px rgba(139, 107, 74, 0.02)',
  },
  emojiContainer: {
    height: '140px',
    backgroundColor: '#F8F5F1',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    borderBottom: '1px solid #F8F5F1',
  },
  cardEmoji: {
    fontSize: '4rem',
  },
  cardBody: {
    padding: '16px',
    display: 'flex',
    flexDirection: 'column',
    flex: 1,
  },
  itemName: {
    fontSize: '1.1rem',
    fontWeight: '700',
    color: '#2D241E',
  },
  categoryBadge: {
    fontSize: '0.75rem',
    backgroundColor: '#F4F9F4',
    color: '#1b4d2c',
    padding: '2px 8px',
    borderRadius: '6px',
    fontWeight: '600',
  },
  itemDesc: {
    fontSize: '0.8rem',
    color: '#6E5C50',
    lineHeight: '1.4',
    marginBottom: '16px',
    flex: 1,
  },
  priceRow: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  priceTag: {
    display: 'flex',
    alignItems: 'center',
    gap: '6px',
    fontSize: '0.85rem',
    fontWeight: '700',
    color: '#B7950B',
  },
  buyBtn: {
    border: 'none',
    borderRadius: '10px',
    padding: '8px 14px',
    fontSize: '0.8rem',
    fontWeight: '700',
    transition: 'all 0.2s',
  },
  modalOverlay: {
    position: 'fixed',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(45,36,30,0.6)',
    backdropFilter: 'blur(4px)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 999,
    padding: '20px',
  },
  modalContent: {
    backgroundColor: '#FFFFFF',
    border: '1px solid #EADBCE',
    borderRadius: '24px',
    padding: '30px',
    maxWidth: '400px',
    width: '100%',
    boxShadow: '0 10px 40px rgba(0,0,0,0.15)',
    textAlign: 'center',
  },
  modalEmojiContainer: {
    width: '80px',
    height: '80px',
    borderRadius: '50%',
    backgroundColor: '#F8F5F1',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
  modalTitle: {
    fontSize: '1.25rem',
    fontWeight: '800',
    color: '#2D241E',
    marginBottom: '10px',
  },
  modalText: {
    fontSize: '0.9rem',
    color: '#6E5C50',
    lineHeight: '1.5',
    marginBottom: '20px',
  },
  errorAlert: {
    backgroundColor: 'rgba(231,76,60,0.1)',
    color: '#c0392b',
    border: '1px solid #e74c3c',
    borderRadius: '12px',
    padding: '10px 14px',
    fontSize: '0.8rem',
    fontWeight: '600',
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
    marginBottom: '16px',
    textAlign: 'left',
  },
  modalActions: {
    display: 'flex',
    gap: '12px',
  },
  cancelBtn: {
    flex: 1,
    border: '1px solid #EADBCE',
    backgroundColor: '#FFFFFF',
    borderRadius: '12px',
    padding: '10px',
    fontWeight: '700',
    cursor: 'pointer',
    color: '#8B6B4A',
  },
  confirmBtn: {
    flex: 1,
    border: 'none',
    backgroundColor: '#1b4d2c',
    color: '#FFFFFF',
    borderRadius: '12px',
    padding: '10px',
    fontWeight: '700',
    cursor: 'pointer',
  },
  successWrapper: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    gap: '12px',
  },
  successTitle: {
    fontSize: '1.3rem',
    fontWeight: '800',
    color: '#1b4d2c',
  },
  successSub: {
    fontSize: '0.85rem',
    color: '#6E5C50',
    lineHeight: '1.4',
  },
  viewGardenBtn: {
    marginTop: '10px',
    backgroundColor: '#7FB77E',
    color: '#FFFFFF',
    border: 'none',
    borderRadius: '12px',
    padding: '10px 20px',
    fontWeight: '700',
    fontSize: '0.85rem',
    display: 'flex',
    alignItems: 'center',
    gap: '6px',
    cursor: 'pointer',
  },
};
