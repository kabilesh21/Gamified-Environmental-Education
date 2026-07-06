import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  ShieldAlert, Users, BookOpen, GraduationCap, BarChart2, Calendar, FileText, 
  Trash2, Edit, Plus, X, Coins, CheckSquare, Settings, ArrowRight, ShieldCheck, CheckCircle2 
} from 'lucide-react';

export default function AdminPanel() {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('analytics');

  // CRUD states
  const [events, setEvents] = useState([]);
  const [shopItems, setShopItems] = useState([]);
  const [treeLevels, setTreeLevels] = useState([]);
  const [missions, setMissions] = useState([]);

  // Modal State
  const [modalType, setModalType] = useState(null); // 'event', 'shop', 'tree', 'mission'
  const [editItem, setEditItem] = useState(null); // null if creating
  const [formData, setFormData] = useState({});

  // Success alert
  const [successMsg, setSuccessMsg] = useState('');

  const fetchAdminStats = async () => {
    try {
      const res = await axios.get('/api/admin/stats');
      setStats(res.data);
    } catch (err) {
      console.error("Failed to load admin stats", err);
    } finally {
      setLoading(false);
    }
  };

  const loadTabData = async (tab) => {
    try {
      if (tab === 'events') {
        const res = await axios.get('/api/admin/events');
        setEvents(res.data);
      } else if (tab === 'shop') {
        const res = await axios.get('/api/admin/shop-items');
        setShopItems(res.data);
      } else if (tab === 'tree') {
        const res = await axios.get('/api/admin/tree-levels');
        setTreeLevels(res.data);
      } else if (tab === 'missions') {
        const res = await axios.get('/api/admin/missions');
        setMissions(res.data);
      }
    } catch (err) {
      console.error(`Failed to load ${tab} data`, err);
    }
  };

  useEffect(() => {
    fetchAdminStats();
  }, []);

  useEffect(() => {
    if (activeTab !== 'analytics') {
      loadTabData(activeTab);
    }
  }, [activeTab]);

  const showToast = (msg) => {
    setSuccessMsg(msg);
    setTimeout(() => setSuccessMsg(''), 3000);
  };

  // ===========================================
  // CRUD Actions
  // ===========================================
  const handleOpenCreateModal = (type) => {
    setModalType(type);
    setEditItem(null);
    if (type === 'event') {
      setFormData({ title: '', description: '', bannerUrl: '', startDate: '', endDate: '', rewardXp: 100, rewardCoins: 50, badgeReward: '', active: true });
    } else if (type === 'shop') {
      setFormData({ name: '', itemKey: '', description: '', price: 100, category: 'Trees', imageUrl: '🌳' });
    } else if (type === 'tree') {
      setFormData({ level: 1, stageName: '', xpRequired: 100, imageUrl: '🌱' });
    } else if (type === 'mission') {
      setFormData({ title: '', type: 'QUIZ', target: 5, rewardXp: 100, rewardCoins: 50, rewardItemKey: '' });
    }
  };

  const handleOpenEditModal = (type, item) => {
    setModalType(type);
    setEditItem(item);
    setFormData({ ...item });
  };

  const handleDeleteItem = async (type, id) => {
    if (!window.confirm("Are you sure you want to delete this item?")) return;
    try {
      await axios.delete(`/api/admin/${type === 'shop' ? 'shop-items' : type === 'tree' ? 'tree-levels' : type + 's'}/${id}`);
      showToast("Deleted item successfully!");
      loadTabData(activeTab);
    } catch (err) {
      console.error("Delete failed", err);
    }
  };

  const handleFormSubmit = async (e) => {
    e.preventDefault();
    const isEdit = !!editItem;
    const url = `/api/admin/${modalType === 'shop' ? 'shop-items' : modalType === 'tree' ? 'tree-levels' : modalType + 's'}` + (isEdit ? `/${editItem.id}` : '');
    
    try {
      if (isEdit) {
        await axios.put(url, formData);
        showToast("Updated item successfully!");
      } else {
        await axios.post(url, formData);
        showToast("Created item successfully!");
      }
      setModalType(null);
      loadTabData(activeTab);
    } catch (err) {
      console.error("Form submit failed", err);
    }
  };

  if (loading || !stats) {
    return (
      <div style={styles.loading}>
        <div className="btn btn-ghost">Loading Admin Analytics...</div>
      </div>
    );
  }

  const completionRate = stats.totalEnrollments > 0
    ? (stats.totalCompletions * 100) / stats.totalEnrollments
    : 0;

  return (
    <div style={styles.container}>
      {/* Header */}
      <div style={styles.header}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <ShieldAlert size={28} color="#9B1C1C" />
          <h1 style={styles.title}>Admin Panel</h1>
        </div>
        <p style={styles.subtitle}>Configure environmental events, shop items, missions, and tree stages dynamically.</p>
      </div>

      {/* Tab Navigation */}
      <div style={styles.tabContainer}>
        <button 
          onClick={() => setActiveTab('analytics')}
          style={{ ...styles.tabBtn, borderBottomColor: activeTab === 'analytics' ? '#9B1C1C' : 'transparent', color: activeTab === 'analytics' ? '#2D241E' : '#A39387' }}
        >
          <BarChart2 size={16} />
          <span>Analytics</span>
        </button>
        <button 
          onClick={() => setActiveTab('events')}
          style={{ ...styles.tabBtn, borderBottomColor: activeTab === 'events' ? '#9B1C1C' : 'transparent', color: activeTab === 'events' ? '#2D241E' : '#A39387' }}
        >
          <Calendar size={16} />
          <span>Events</span>
        </button>
        <button 
          onClick={() => setActiveTab('shop')}
          style={{ ...styles.tabBtn, borderBottomColor: activeTab === 'shop' ? '#9B1C1C' : 'transparent', color: activeTab === 'shop' ? '#2D241E' : '#A39387' }}
        >
          <Coins size={16} />
          <span>Reward Shop</span>
        </button>
        <button 
          onClick={() => setActiveTab('tree')}
          style={{ ...styles.tabBtn, borderBottomColor: activeTab === 'tree' ? '#9B1C1C' : 'transparent', color: activeTab === 'tree' ? '#2D241E' : '#A39387' }}
        >
          <Settings size={16} />
          <span>Tree Levels</span>
        </button>
        <button 
          onClick={() => setActiveTab('missions')}
          style={{ ...styles.tabBtn, borderBottomColor: activeTab === 'missions' ? '#9B1C1C' : 'transparent', color: activeTab === 'missions' ? '#2D241E' : '#A39387' }}
        >
          <CheckSquare size={16} />
          <span>Missions</span>
        </button>
      </div>

      {successMsg && (
        <div style={styles.toast}>
          <CheckCircle2 size={16} />
          <span>{successMsg}</span>
        </div>
      )}

      {/* Tab Content Panels */}
      <AnimatePresence mode="wait">
        {activeTab === 'analytics' && (
          <motion.div 
            key="analytics"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}
          >
            {/* Aggregate Stats Cards */}
            <div style={styles.statsRow}>
              <div style={styles.statsCard}>
                <div style={{ ...styles.iconBg, backgroundColor: 'rgba(139,107,74,0.1)' }}>
                  <Users size={24} color="#8B6B4A" />
                </div>
                <div style={styles.cardDetails}>
                  <span style={styles.cardVal}>{stats.totalUsers}</span>
                  <span style={styles.cardLabel}>Registered Users</span>
                </div>
              </div>

              <div style={styles.statsCard}>
                <div style={{ ...styles.iconBg, backgroundColor: 'rgba(166,124,82,0.1)' }}>
                  <BookOpen size={24} color="#A67C52" />
                </div>
                <div style={styles.cardDetails}>
                  <span style={styles.cardVal}>{stats.totalEnrollments}</span>
                  <span style={styles.cardLabel}>Course Enrollments</span>
                </div>
              </div>

              <div style={styles.statsCard}>
                <div style={{ ...styles.iconBg, backgroundColor: 'rgba(127,183,126,0.1)' }}>
                  <GraduationCap size={24} color="#7FB77E" />
                </div>
                <div style={styles.cardDetails}>
                  <span style={styles.cardVal}>{stats.totalCompletions}</span>
                  <span style={styles.cardLabel}>Total Completions</span>
                </div>
              </div>

              <div style={styles.statsCard}>
                <div style={{ ...styles.iconBg, backgroundColor: 'rgba(195,174,214,0.2)' }}>
                  <BarChart2 size={24} color="#7b5999" />
                </div>
                <div style={styles.cardDetails}>
                  <span style={styles.cardVal}>{completionRate.toFixed(1)}%</span>
                  <span style={styles.cardLabel}>Completion Rate</span>
                </div>
              </div>
            </div>

            {/* Course Stats Table */}
            <div style={styles.tableCard}>
              <h3 style={styles.tableTitle}>Course-by-Course Analytics</h3>
              <div style={styles.tableWrapper}>
                <table style={styles.table}>
                  <thead>
                    <tr style={styles.thRow}>
                      <th style={styles.th}>Course Module Name</th>
                      <th style={{ ...styles.th, textAlign: 'center' }}>Total Enrolled</th>
                      <th style={{ ...styles.th, textAlign: 'center' }}>Total Completed</th>
                      <th style={{ ...styles.th, textAlign: 'right' }}>Completion Ratio</th>
                    </tr>
                  </thead>
                  <tbody>
                    {stats.courseStats?.map((course) => {
                      const ratio = course.enrollmentCount > 0
                        ? (course.completionCount * 100) / course.enrollmentCount
                        : 0;

                      return (
                        <tr key={course.courseId} style={styles.tr}>
                          <td style={styles.tdTitle}>{course.title}</td>
                          <td style={styles.tdCount}>{course.enrollmentCount}</td>
                          <td style={styles.tdCount}>{course.completionCount}</td>
                          <td style={styles.tdRatio}>
                            <span style={{
                              ...styles.ratioBadge,
                              backgroundColor: ratio >= 75 ? 'rgba(127,183,126,0.15)' : ratio >= 40 ? 'rgba(166,124,82,0.15)' : '#F8F5F1',
                              color: ratio >= 75 ? '#5c995b' : ratio >= 40 ? '#A67C52' : '#6E5C50',
                            }}>{ratio.toFixed(0)}%</span>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </div>
          </motion.div>
        )}

        {/* EVENTS TAB */}
        {activeTab === 'events' && (
          <motion.div key="events" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
            <div style={styles.tabHeaderRow}>
              <h3 style={styles.tableTitle}>Seasonal Events Configuration</h3>
              <button onClick={() => handleOpenCreateModal('event')} style={styles.createBtn}>
                <Plus size={16} />
                <span>Add Event</span>
              </button>
            </div>

            <div style={styles.tableCard}>
              <div style={styles.tableWrapper}>
                <table style={styles.table}>
                  <thead>
                    <tr style={styles.thRow}>
                      <th style={styles.th}>Event Banner & Title</th>
                      <th style={styles.th}>Rewards</th>
                      <th style={styles.th}>Timeline</th>
                      <th style={styles.th}>Status</th>
                      <th style={{ ...styles.th, textAlign: 'right' }}>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {events.map((e) => (
                      <tr key={e.id} style={styles.tr}>
                        <td style={styles.tdTitle}>
                          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                            <img src={e.bannerUrl} alt={e.title} style={styles.miniBanner} />
                            <div>
                              <div style={{ fontWeight: '700' }}>{e.title}</div>
                              <div style={{ fontSize: '0.75rem', color: '#A39387' }}>Badge: {e.badgeReward}</div>
                            </div>
                          </div>
                        </td>
                        <td style={styles.tdText}>
                          <div>⭐ {e.rewardXp} XP</div>
                          <div>🪙 {e.rewardCoins} Coins</div>
                        </td>
                        <td style={styles.tdText}>
                          <div>Start: {e.startDate}</div>
                          <div>End: {e.endDate}</div>
                        </td>
                        <td style={styles.tdText}>
                          <span style={{
                            color: e.active ? '#5c995b' : '#c0392b',
                            fontWeight: '700'
                          }}>{e.active ? 'Active' : 'Inactive'}</span>
                        </td>
                        <td style={styles.tdActions}>
                          <button onClick={() => handleOpenEditModal('event', e)} style={styles.actionIconBtn}><Edit size={14} /></button>
                          <button onClick={() => handleDeleteItem('event', e.id)} style={{ ...styles.actionIconBtn, color: '#c0392b' }}><Trash2 size={14} /></button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </motion.div>
        )}

        {/* SHOP TAB */}
        {activeTab === 'shop' && (
          <motion.div key="shop" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
            <div style={styles.tabHeaderRow}>
              <h3 style={styles.tableTitle}>Reward Shop Items</h3>
              <button onClick={() => handleOpenCreateModal('shop')} style={styles.createBtn}>
                <Plus size={16} />
                <span>Add Shop Item</span>
              </button>
            </div>

            <div style={styles.tableCard}>
              <div style={styles.tableWrapper}>
                <table style={styles.table}>
                  <thead>
                    <tr style={styles.thRow}>
                      <th style={styles.th}>Emoji & Name</th>
                      <th style={styles.th}>Category</th>
                      <th style={styles.th}>Key</th>
                      <th style={styles.th}>Price</th>
                      <th style={styles.th}>Description</th>
                      <th style={{ ...styles.th, textAlign: 'right' }}>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {shopItems.map((item) => (
                      <tr key={item.id} style={styles.tr}>
                        <td style={styles.tdTitle}>
                          <span style={{ fontSize: '1.8rem', marginRight: '8px' }}>{item.imageUrl}</span>
                          <strong>{item.name}</strong>
                        </td>
                        <td style={styles.tdText}>{item.category}</td>
                        <td style={styles.tdText}><code>{item.itemKey}</code></td>
                        <td style={styles.tdText}>🪙 {item.price} Coins</td>
                        <td style={{ ...styles.tdText, maxWidth: '200px' }}>{item.description}</td>
                        <td style={styles.tdActions}>
                          <button onClick={() => handleOpenEditModal('shop', item)} style={styles.actionIconBtn}><Edit size={14} /></button>
                          <button onClick={() => handleDeleteItem('shop', item.id)} style={{ ...styles.actionIconBtn, color: '#c0392b' }}><Trash2 size={14} /></button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </motion.div>
        )}

        {/* TREE LEVELS TAB */}
        {activeTab === 'tree' && (
          <motion.div key="tree" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
            <div style={styles.tabHeaderRow}>
              <h3 style={styles.tableTitle}>Tree Growth Levels</h3>
              <button onClick={() => handleOpenCreateModal('tree')} style={styles.createBtn}>
                <Plus size={16} />
                <span>Add Level</span>
              </button>
            </div>

            <div style={styles.tableCard}>
              <div style={styles.tableWrapper}>
                <table style={styles.table}>
                  <thead>
                    <tr style={styles.thRow}>
                      <th style={styles.th}>Level</th>
                      <th style={styles.th}>Stage Title</th>
                      <th style={styles.th}>Visual Emoji</th>
                      <th style={styles.th}>XP Required</th>
                      <th style={{ ...styles.th, textAlign: 'right' }}>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {treeLevels.sort((a,b)=>a.level - b.level).map((t) => (
                      <tr key={t.id} style={styles.tr}>
                        <td style={styles.tdTitle}>Level {t.level}</td>
                        <td style={styles.tdText}><strong>{t.stageName}</strong></td>
                        <td style={{ ...styles.tdText, fontSize: '1.6rem' }}>{t.imageUrl}</td>
                        <td style={styles.tdText}>⭐ {t.xpRequired} XP</td>
                        <td style={styles.tdActions}>
                          <button onClick={() => handleOpenEditModal('tree', t)} style={styles.actionIconBtn}><Edit size={14} /></button>
                          <button onClick={() => handleDeleteItem('tree', t.id)} style={{ ...styles.actionIconBtn, color: '#c0392b' }}><Trash2 size={14} /></button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </motion.div>
        )}

        {/* MISSIONS TAB */}
        {activeTab === 'missions' && (
          <motion.div key="missions" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
            <div style={styles.tabHeaderRow}>
              <h3 style={styles.tableTitle}>Weekly Missions</h3>
              <button onClick={() => handleOpenCreateModal('mission')} style={styles.createBtn}>
                <Plus size={16} />
                <span>Add Mission</span>
              </button>
            </div>

            <div style={styles.tableCard}>
              <div style={styles.tableWrapper}>
                <table style={styles.table}>
                  <thead>
                    <tr style={styles.thRow}>
                      <th style={styles.th}>Mission Goal</th>
                      <th style={styles.th}>Type Key</th>
                      <th style={styles.th}>Target</th>
                      <th style={styles.th}>Rewards</th>
                      <th style={{ ...styles.th, textAlign: 'right' }}>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {missions.map((m) => (
                      <tr key={m.id} style={styles.tr}>
                        <td style={styles.tdTitle}>{m.title}</td>
                        <td style={styles.tdText}><code>{m.type}</code></td>
                        <td style={styles.tdText}>{m.target} units</td>
                        <td style={styles.tdText}>
                          <div>⭐ {m.rewardXp} XP</div>
                          <div>🪙 {m.rewardCoins} Coins</div>
                        </td>
                        <td style={styles.tdActions}>
                          <button onClick={() => handleOpenEditModal('mission', m)} style={styles.actionIconBtn}><Edit size={14} /></button>
                          <button onClick={() => handleDeleteItem('mission', m.id)} style={{ ...styles.actionIconBtn, color: '#c0392b' }}><Trash2 size={14} /></button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* CRUD MODAL */}
      <AnimatePresence>
        {modalType && (
          <div style={styles.modalOverlay}>
            <motion.div 
              style={styles.modalContent}
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
            >
              <div style={styles.modalHeader}>
                <h3 style={styles.modalTitle}>{editItem ? 'Edit' : 'Create'} {modalType.toUpperCase()}</h3>
                <button onClick={() => setModalType(null)} style={styles.closeBtn}><X size={20} /></button>
              </div>

              <form onSubmit={handleFormSubmit} style={styles.modalForm}>
                {modalType === 'event' && (
                  <>
                    <div style={styles.formGroup}>
                      <label style={styles.label}>Title</label>
                      <input type="text" value={formData.title || ''} onChange={e => setFormData({ ...formData, title: e.target.value })} required style={styles.input} />
                    </div>
                    <div style={styles.formGroup}>
                      <label style={styles.label}>Description</label>
                      <textarea value={formData.description || ''} onChange={e => setFormData({ ...formData, description: e.target.value })} required style={styles.textarea} />
                    </div>
                    <div style={styles.formGroup}>
                      <label style={styles.label}>Banner Image URL</label>
                      <input type="text" value={formData.bannerUrl || ''} onChange={e => setFormData({ ...formData, bannerUrl: e.target.value })} required style={styles.input} />
                    </div>
                    <div style={{ display: 'flex', gap: '12px' }}>
                      <div style={{ ...styles.formGroup, flex: 1 }}>
                        <label style={styles.label}>Start Date</label>
                        <input type="date" value={formData.startDate || ''} onChange={e => setFormData({ ...formData, startDate: e.target.value })} required style={styles.input} />
                      </div>
                      <div style={{ ...styles.formGroup, flex: 1 }}>
                        <label style={styles.label}>End Date</label>
                        <input type="date" value={formData.endDate || ''} onChange={e => setFormData({ ...formData, endDate: e.target.value })} required style={styles.input} />
                      </div>
                    </div>
                    <div style={{ display: 'flex', gap: '12px' }}>
                      <div style={{ ...styles.formGroup, flex: 1 }}>
                        <label style={styles.label}>XP Reward</label>
                        <input type="number" value={formData.rewardXp || 0} onChange={e => setFormData({ ...formData, rewardXp: parseInt(e.target.value) })} required style={styles.input} />
                      </div>
                      <div style={{ ...styles.formGroup, flex: 1 }}>
                        <label style={styles.label}>Coins Reward</label>
                        <input type="number" value={formData.rewardCoins || 0} onChange={e => setFormData({ ...formData, rewardCoins: parseInt(e.target.value) })} required style={styles.input} />
                      </div>
                    </div>
                    <div style={styles.formGroup}>
                      <label style={styles.label}>Badge Reward Title</label>
                      <input type="text" value={formData.badgeReward || ''} onChange={e => setFormData({ ...formData, badgeReward: e.target.value })} required style={styles.input} />
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginTop: '10px' }}>
                      <input type="checkbox" checked={formData.active || false} onChange={e => setFormData({ ...formData, active: e.target.checked })} id="active-chk" />
                      <label htmlFor="active-chk" style={{ ...styles.label, marginBottom: 0 }}>Active Event Status</label>
                    </div>
                  </>
                )}

                {modalType === 'shop' && (
                  <>
                    <div style={{ display: 'flex', gap: '12px' }}>
                      <div style={{ ...styles.formGroup, flex: 1 }}>
                        <label style={styles.label}>Item Name</label>
                        <input type="text" value={formData.name || ''} onChange={e => setFormData({ ...formData, name: e.target.value })} required style={styles.input} />
                      </div>
                      <div style={{ ...styles.formGroup, flex: 1 }}>
                        <label style={styles.label}>Item Key</label>
                        <input type="text" value={formData.itemKey || ''} onChange={e => setFormData({ ...formData, itemKey: e.target.value })} required style={styles.input} />
                      </div>
                    </div>
                    <div style={styles.formGroup}>
                      <label style={styles.label}>Description</label>
                      <textarea value={formData.description || ''} onChange={e => setFormData({ ...formData, description: e.target.value })} required style={styles.textarea} />
                    </div>
                    <div style={{ display: 'flex', gap: '12px' }}>
                      <div style={{ ...styles.formGroup, flex: 1 }}>
                        <label style={styles.label}>Coin Price</label>
                        <input type="number" value={formData.price || 0} onChange={e => setFormData({ ...formData, price: parseInt(e.target.value) })} required style={styles.input} />
                      </div>
                      <div style={{ ...styles.formGroup, flex: 1 }}>
                        <label style={styles.label}>Visual Emoji</label>
                        <input type="text" value={formData.imageUrl || '🌳'} onChange={e => setFormData({ ...formData, imageUrl: e.target.value })} required style={styles.input} />
                      </div>
                    </div>
                    <div style={styles.formGroup}>
                      <label style={styles.label}>Category</label>
                      <select value={formData.category || 'Trees'} onChange={e => setFormData({ ...formData, category: e.target.value })} style={styles.select}>
                        <option value="Trees">Trees</option>
                        <option value="Flowers">Flowers</option>
                        <option value="Animals">Animals</option>
                        <option value="Decorations">Decorations</option>
                        <option value="Garden Items">Garden Items</option>
                      </select>
                    </div>
                  </>
                )}

                {modalType === 'tree' && (
                  <>
                    <div style={{ display: 'flex', gap: '12px' }}>
                      <div style={{ ...styles.formGroup, flex: 1 }}>
                        <label style={styles.label}>Level Rank</label>
                        <input type="number" value={formData.level || 1} onChange={e => setFormData({ ...formData, level: parseInt(e.target.value) })} required style={styles.input} />
                      </div>
                      <div style={{ ...styles.formGroup, flex: 1 }}>
                        <label style={styles.label}>Stage Label</label>
                        <input type="text" value={formData.stageName || ''} onChange={e => setFormData({ ...formData, stageName: e.target.value })} required style={styles.input} />
                      </div>
                    </div>
                    <div style={{ display: 'flex', gap: '12px' }}>
                      <div style={{ ...styles.formGroup, flex: 1 }}>
                        <label style={styles.label}>XP Required</label>
                        <input type="number" value={formData.xpRequired || 0} onChange={e => setFormData({ ...formData, xpRequired: parseInt(e.target.value) })} required style={styles.input} />
                      </div>
                      <div style={{ ...styles.formGroup, flex: 1 }}>
                        <label style={styles.label}>Visual Emoji</label>
                        <input type="text" value={formData.imageUrl || '🌱'} onChange={e => setFormData({ ...formData, imageUrl: e.target.value })} required style={styles.input} />
                      </div>
                    </div>
                  </>
                )}

                {modalType === 'mission' && (
                  <>
                    <div style={styles.formGroup}>
                      <label style={styles.label}>Mission Goal Title</label>
                      <input type="text" value={formData.title || ''} onChange={e => setFormData({ ...formData, title: e.target.value })} required style={styles.input} />
                    </div>
                    <div style={{ display: 'flex', gap: '12px' }}>
                      <div style={{ ...styles.formGroup, flex: 1 }}>
                        <label style={styles.label}>Target Value</label>
                        <input type="number" value={formData.target || 5} onChange={e => setFormData({ ...formData, target: parseInt(e.target.value) })} required style={styles.input} />
                      </div>
                      <div style={{ ...styles.formGroup, flex: 1 }}>
                        <label style={styles.label}>Type Identifier</label>
                        <select value={formData.type || 'QUIZ'} onChange={e => setFormData({ ...formData, type: e.target.value })} style={styles.select}>
                          <option value="QUIZ">QUIZ</option>
                          <option value="MODULE">MODULE</option>
                          <option value="XP">XP</option>
                          <option value="SHOP">SHOP</option>
                          <option value="CHALLENGE">CHALLENGE</option>
                        </select>
                      </div>
                    </div>
                    <div style={{ display: 'flex', gap: '12px' }}>
                      <div style={{ ...styles.formGroup, flex: 1 }}>
                        <label style={styles.label}>XP Reward</label>
                        <input type="number" value={formData.rewardXp || 0} onChange={e => setFormData({ ...formData, rewardXp: parseInt(e.target.value) })} required style={styles.input} />
                      </div>
                      <div style={{ ...styles.formGroup, flex: 1 }}>
                        <label style={styles.label}>Coins Reward</label>
                        <input type="number" value={formData.rewardCoins || 0} onChange={e => setFormData({ ...formData, rewardCoins: parseInt(e.target.value) })} required style={styles.input} />
                      </div>
                    </div>
                  </>
                )}

                <div style={styles.formActions}>
                  <button type="button" onClick={() => setModalType(null)} style={styles.formCancelBtn}>Cancel</button>
                  <button type="submit" style={styles.formSubmitBtn}>{editItem ? 'Save Updates' : 'Add Item'}</button>
                </div>
              </form>
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
    marginBottom: '24px',
  },
  title: {
    fontSize: '2rem',
    fontWeight: '800',
    color: '#9B1C1C',
  },
  subtitle: {
    fontSize: '1rem',
    color: '#6E5C50',
    marginTop: '4px',
  },
  tabContainer: {
    display: 'flex',
    gap: '20px',
    borderBottom: '2px solid #EADBCE',
    marginBottom: '24px',
    flexWrap: 'wrap',
  },
  tabBtn: {
    backgroundColor: 'transparent',
    border: 'none',
    borderBottom: '3px solid transparent',
    padding: '10px 14px',
    fontWeight: '700',
    fontSize: '0.9rem',
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
    cursor: 'pointer',
    transition: 'all 0.2s',
  },
  tabHeaderRow: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: '16px',
  },
  createBtn: {
    backgroundColor: '#9B1C1C',
    color: '#FFFFFF',
    border: 'none',
    borderRadius: '10px',
    padding: '8px 16px',
    fontWeight: '700',
    fontSize: '0.8rem',
    display: 'flex',
    alignItems: 'center',
    gap: '6px',
    cursor: 'pointer',
  },
  statsRow: {
    display: 'flex',
    gap: '24px',
    flexWrap: 'wrap',
    marginBottom: '8px',
  },
  statsCard: {
    flex: 1,
    minWidth: '220px',
    backgroundColor: '#FFFFFF',
    border: '1px solid #EADBCE',
    borderRadius: '16px',
    padding: '24px',
    display: 'flex',
    alignItems: 'center',
    gap: '20px',
    boxShadow: '0 4px 12px rgba(139, 107, 74, 0.03)',
  },
  iconBg: {
    width: '48px',
    height: '48px',
    borderRadius: '12px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
  cardDetails: {
    display: 'flex',
    flexDirection: 'column',
  },
  cardVal: {
    fontSize: '1.8rem',
    fontWeight: '800',
    color: '#2D241E',
  },
  cardLabel: {
    fontSize: '0.8rem',
    fontWeight: '600',
    color: '#A39387',
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
  },
  tdTitle: {
    padding: '16px',
    fontWeight: '600',
    color: '#2D241E',
  },
  tdCount: {
    padding: '16px',
    textAlign: 'center',
    fontWeight: '700',
    color: '#6E5C50',
  },
  tdRatio: {
    padding: '16px',
    textAlign: 'right',
  },
  ratioBadge: {
    borderRadius: '8px',
    padding: '4px 8px',
    fontSize: '0.8rem',
    fontWeight: '700',
  },
  tdText: {
    padding: '16px',
    fontSize: '0.85rem',
    color: '#6E5C50',
  },
  tdActions: {
    padding: '16px',
    textAlign: 'right',
    display: 'flex',
    justifyContent: 'flex-end',
    gap: '10px',
  },
  actionIconBtn: {
    backgroundColor: 'transparent',
    border: 'none',
    cursor: 'pointer',
    color: '#8B6B4A',
    width: '28px',
    height: '28px',
    borderRadius: '6px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    transition: 'background-color 0.2s',
    '&:hover': {
      backgroundColor: '#F8F5F1'
    }
  },
  miniBanner: {
    width: '60px',
    height: '40px',
    borderRadius: '6px',
    objectFit: 'cover',
  },
  toast: {
    backgroundColor: 'rgba(127,183,126,0.15)',
    color: '#1b4d2c',
    border: '1px solid #7FB77E',
    borderRadius: '12px',
    padding: '12px 16px',
    fontSize: '0.85rem',
    fontWeight: '700',
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
    marginBottom: '20px',
  },
  modalOverlay: {
    position: 'fixed',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(45,36,30,0.5)',
    backdropFilter: 'blur(4px)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 1000,
    padding: '20px',
  },
  modalContent: {
    backgroundColor: '#FFFFFF',
    border: '1px solid #EADBCE',
    borderRadius: '24px',
    padding: '28px',
    maxWidth: '500px',
    width: '100%',
    boxShadow: '0 8px 30px rgba(0,0,0,0.12)',
  },
  modalHeader: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderBottom: '1px solid #F8F5F1',
    paddingBottom: '12px',
    marginBottom: '20px',
  },
  modalTitle: {
    fontSize: '1.2rem',
    fontWeight: '800',
    color: '#9B1C1C',
  },
  closeBtn: {
    backgroundColor: 'transparent',
    border: 'none',
    cursor: 'pointer',
    color: '#A39387',
  },
  modalForm: {
    display: 'flex',
    flexDirection: 'column',
    gap: '16px',
  },
  formGroup: {
    display: 'flex',
    flexDirection: 'column',
    gap: '6px',
  },
  label: {
    fontSize: '0.8rem',
    fontWeight: '700',
    color: '#8B6B4A',
    textTransform: 'uppercase',
  },
  input: {
    border: '1px solid #EADBCE',
    borderRadius: '10px',
    padding: '10px 14px',
    fontSize: '0.9rem',
    color: '#2D241E',
    outline: 'none',
    '&:focus': {
      borderColor: '#9B1C1C'
    }
  },
  textarea: {
    border: '1px solid #EADBCE',
    borderRadius: '10px',
    padding: '10px 14px',
    fontSize: '0.9rem',
    color: '#2D241E',
    outline: 'none',
    height: '80px',
    resize: 'none',
  },
  select: {
    border: '1px solid #EADBCE',
    borderRadius: '10px',
    padding: '10px 14px',
    fontSize: '0.9rem',
    color: '#2D241E',
    outline: 'none',
    backgroundColor: '#FFFFFF',
  },
  formActions: {
    display: 'flex',
    justifyContent: 'flex-end',
    gap: '12px',
    marginTop: '12px',
    borderTop: '1px solid #F8F5F1',
    paddingTop: '16px',
  },
  formCancelBtn: {
    backgroundColor: '#FFFFFF',
    border: '1px solid #EADBCE',
    borderRadius: '10px',
    padding: '10px 18px',
    fontWeight: '700',
    cursor: 'pointer',
    color: '#8B6B4A',
  },
  formSubmitBtn: {
    backgroundColor: '#9B1C1C',
    color: '#FFFFFF',
    border: 'none',
    borderRadius: '10px',
    padding: '10px 18px',
    fontWeight: '700',
    cursor: 'pointer',
  },
};
