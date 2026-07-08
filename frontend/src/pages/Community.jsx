import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { MessageSquare, ThumbsUp, Send, Share2, Award, User } from 'lucide-react';
import axios from 'axios';

export default function Community() {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [newPostContent, setNewPostContent] = useState("");
  const [commentInputs, setCommentInputs] = useState({});

  const fetchPosts = async () => {
    try {
      const res = await axios.get('/api/community/posts');
      setPosts(res.data);
    } catch (err) {
      console.error("Failed to load community posts", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPosts();
  }, []);

  const handleCreatePost = async (e) => {
    e.preventDefault();
    if (!newPostContent.trim()) return;

    try {
      await axios.post('/api/community/posts', { content: newPostContent });
      setNewPostContent("");
      fetchPosts();
    } catch (err) {
      console.error("Failed to create post", err);
    }
  };

  const handleLike = async (id) => {
    try {
      await axios.post(`/api/community/posts/${id}/like`);
      setPosts(prev =>
        prev.map(p => {
          if (p.id === id) {
            const newLiked = !p.liked;
            return {
              ...p,
              liked: newLiked,
              likes: newLiked ? p.likes + 1 : p.likes - 1
            };
          }
          return p;
        })
      );
    } catch (err) {
      console.error("Failed to toggle like", err);
    }
  };

  const handleCommentSubmit = async (postId, e) => {
    e.preventDefault();
    const commentText = commentInputs[postId];
    if (!commentText || !commentText.trim()) return;

    try {
      await axios.post(`/api/community/posts/${postId}/comments`, { text: commentText });
      setCommentInputs(prev => ({ ...prev, [postId]: "" }));
      fetchPosts();
    } catch (err) {
      console.error("Failed to add comment", err);
    }
  };

  return (
    <div style={styles.container}>

      <div style={styles.header}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <MessageSquare size={28} color="#2e7d32" />
          <h1 style={styles.title}>GREENIZO Community</h1>
        </div>
        <p style={styles.subtitle}>Connect with fellow environmentalists, discuss eco-tips, and share your sustainability updates.</p>
      </div>

      <div style={styles.contentGrid}>
        {/* Main Feed */}
        <div style={styles.feedCol}>
          {/* Post Creator */}
          <form style={styles.creatorCard} onSubmit={handleCreatePost}>
            <textarea
              style={styles.textarea}
              placeholder="Share your eco-friendly updates, tips, or questions..."
              value={newPostContent}
              onChange={(e) => setNewPostContent(e.target.value)}
              rows={3}
            />
            <div style={styles.creatorFooter}>
              <span style={{ fontSize: '0.8rem', color: '#718096' }}>Always be respectful & positive! 💚</span>
              <button style={styles.postBtn} type="submit">
                <Send size={14} />
                <span>Post Feed</span>
              </button>
            </div>
          </form>

          {/* Posts list */}
          {loading ? (
            <div style={{ textAlign: 'center', padding: '40px', color: '#718096', fontWeight: 'bold' }}>
              Loading community feed...
            </div>
          ) : (
            <div style={styles.postsList}>
              {posts.map((p) => (
                <motion.div
                  key={p.id}
                  style={styles.postCard}
                  initial={{ opacity: 0, y: 15 }}
                  animate={{ opacity: 1, y: 0 }}
                >
                  {/* Author Info */}
                  <div style={styles.authorRow}>
                    <div style={styles.avatarCircle}>{p.avatar}</div>
                    <div style={styles.authorDetails}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                        <span style={styles.authorName}>{p.author}</span>
                        <span style={styles.roleTag}>{p.role}</span>
                      </div>
                      <span style={styles.postTime}>{p.time}</span>
                    </div>
                  </div>

                  {/* Content */}
                  <p style={styles.postContent}>{p.content}</p>

                  {/* Actions */}
                  <div style={styles.actionsRow}>
                    <button 
                      style={{ ...styles.actionBtn, color: p.liked ? '#2e7d32' : '#718096' }}
                      onClick={() => handleLike(p.id)}
                    >
                      <ThumbsUp size={16} fill={p.liked ? '#2e7d32' : 'none'} />
                      <span>{p.likes} Likes</span>
                    </button>
                    <div style={styles.actionBtn}>
                      <MessageSquare size={16} />
                      <span>{p.comments.length} Comments</span>
                    </div>
                  </div>

                  {/* Comments Section */}
                  <div style={styles.commentsSection}>
                    {p.comments.map((c, idx) => (
                      <div key={idx} style={styles.commentItem}>
                        <span style={styles.commentAuthor}>{c.author}:</span>
                        <span style={styles.commentText}>{c.text}</span>
                      </div>
                    ))}
                    
                    {/* Add Comment Form */}
                    <form 
                      style={styles.commentForm}
                      onSubmit={(e) => handleCommentSubmit(p.id, e)}
                    >
                      <input
                        type="text"
                        placeholder="Write a comment..."
                        value={commentInputs[p.id] || ""}
                        onChange={(e) => setCommentInputs({ ...commentInputs, [p.id]: e.target.value })}
                        style={styles.commentInput}
                      />
                      <button type="submit" style={styles.commentSendBtn}>
                        <Send size={12} />
                      </button>
                    </form>
                  </div>
                </motion.div>
              ))}
            </div>
          )}
        </div>

        {/* Right Sidebar Info */}
        <div style={styles.sidebarCol}>
          <div style={styles.infoCard}>
            <h3 style={styles.infoTitle}>Top Contributors</h3>
            <div style={styles.contributorList}>
              <ContributorRow rank="1" name="Priya S." points="1,450 XP" />
              <ContributorRow rank="2" name="Rohan K." points="1,280 XP" />
              <ContributorRow rank="3" name="Sonia G." points="980 XP" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function ContributorRow({ rank, name, points }) {
  return (
    <div style={styles.contributorRow}>
      <span style={styles.rankNum}>{rank}</span>
      <div style={styles.contributorDetails}>
        <span style={styles.contributorName}>{name}</span>
        <span style={styles.contributorPoints}>{points}</span>
      </div>
      <Award size={16} color="#d97706" />
    </div>
  );
}

const styles = {
  container: {
    paddingBottom: '40px',
  },
  header: {
    marginBottom: '28px',
  },
  title: {
    fontSize: '2rem',
    fontWeight: '800',
    color: '#0F3A20',
  },
  subtitle: {
    fontSize: '1rem',
    color: '#718096',
    marginTop: '6px',
  },
  contentGrid: {
    display: 'grid',
    gridTemplateColumns: '2fr 1fr',
    gap: '24px',
  },
  feedCol: {
    display: 'flex',
    flexDirection: 'column',
    gap: '20px',
  },
  creatorCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: '16px',
    padding: '20px',
    boxShadow: '0 4px 20px rgba(0,0,0,0.01)',
    border: '1px solid rgba(0,0,0,0.02)',
    display: 'flex',
    flexDirection: 'column',
    gap: '12px',
  },
  textarea: {
    width: '100%',
    border: '1px solid #edf2f7',
    borderRadius: '12px',
    padding: '12px',
    fontSize: '0.95rem',
    fontFamily: 'inherit',
    resize: 'none',
    outline: 'none',
    ':focus': {
      borderColor: '#7fb77e'
    }
  },
  creatorFooter: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  postBtn: {
    backgroundColor: '#2e7d32',
    color: '#FFFFFF',
    border: 'none',
    borderRadius: '8px',
    padding: '8px 16px',
    fontSize: '0.85rem',
    fontWeight: '700',
    cursor: 'pointer',
    display: 'flex',
    alignItems: 'center',
    gap: '6px',
  },
  postsList: {
    display: 'flex',
    flexDirection: 'column',
    gap: '20px',
  },
  postCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: '16px',
    padding: '24px',
    boxShadow: '0 4px 20px rgba(0,0,0,0.01)',
    border: '1px solid rgba(0,0,0,0.02)',
    display: 'flex',
    flexDirection: 'column',
    gap: '14px',
  },
  authorRow: {
    display: 'flex',
    alignItems: 'center',
    gap: '12px',
  },
  avatarCircle: {
    width: '40px',
    height: '40px',
    borderRadius: '50%',
    backgroundColor: '#e6f4ea',
    color: '#2e7d32',
    fontSize: '1.2rem',
    fontWeight: '800',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
  authorDetails: {
    display: 'flex',
    flexDirection: 'column',
  },
  authorName: {
    fontSize: '0.95rem',
    fontWeight: '700',
    color: '#1a202c',
  },
  roleTag: {
    fontSize: '0.7rem',
    fontWeight: '700',
    backgroundColor: '#f1f5f9',
    color: '#475569',
    padding: '2px 6px',
    borderRadius: '4px',
    textTransform: 'uppercase',
  },
  postTime: {
    fontSize: '0.75rem',
    color: '#a0aec0',
  },
  postContent: {
    fontSize: '0.95rem',
    color: '#2d3748',
    lineHeight: '1.6',
  },
  actionsRow: {
    display: 'flex',
    gap: '20px',
    borderTop: '1px solid #f7fafc',
    borderBottom: '1px solid #f7fafc',
    padding: '8px 0',
  },
  actionBtn: {
    background: 'none',
    border: 'none',
    fontSize: '0.85rem',
    fontWeight: '600',
    color: '#718096',
    cursor: 'pointer',
    display: 'flex',
    alignItems: 'center',
    gap: '6px',
  },
  commentsSection: {
    backgroundColor: '#f8fafc',
    borderRadius: '12px',
    padding: '16px',
    display: 'flex',
    flexDirection: 'column',
    gap: '10px',
  },
  commentItem: {
    fontSize: '0.85rem',
    lineHeight: '1.4',
  },
  commentAuthor: {
    fontWeight: '700',
    color: '#2d3748',
    marginRight: '6px',
  },
  commentText: {
    color: '#4a5568',
  },
  commentForm: {
    display: 'flex',
    gap: '8px',
    marginTop: '6px',
  },
  commentInput: {
    flex: 1,
    border: '1px solid #e2e8f0',
    borderRadius: '8px',
    padding: '6px 12px',
    fontSize: '0.85rem',
    outline: 'none',
  },
  commentSendBtn: {
    backgroundColor: '#e2e8f0',
    border: 'none',
    borderRadius: '8px',
    width: '32px',
    height: '32px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    cursor: 'pointer',
    color: '#4a5568',
    ':hover': {
      backgroundColor: '#cbd5e1'
    }
  },
  sidebarCol: {
    display: 'flex',
    flexDirection: 'column',
  },
  infoCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: '16px',
    padding: '24px',
    boxShadow: '0 4px 20px rgba(0,0,0,0.01)',
    border: '1px solid rgba(0,0,0,0.02)',
    display: 'flex',
    flexDirection: 'column',
    gap: '16px',
  },
  infoTitle: {
    fontSize: '1.1rem',
    fontWeight: '700',
    color: '#1a202c',
  },
  contributorList: {
    display: 'flex',
    flexDirection: 'column',
    gap: '14px',
  },
  contributorRow: {
    display: 'flex',
    alignItems: 'center',
    gap: '12px',
  },
  rankNum: {
    fontWeight: '800',
    color: '#2e7d32',
    fontSize: '1.1rem',
    width: '18px',
  },
  contributorDetails: {
    flex: 1,
    display: 'flex',
    flexDirection: 'column',
  },
  contributorName: {
    fontWeight: '700',
    fontSize: '0.9rem',
    color: '#2d3748',
  },
  contributorPoints: {
    fontSize: '0.75rem',
    color: '#718096',
  }
};
