import React, { useState, useContext } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Link, useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import EcoBackground from '../components/EcoBackground';
import { Mail, Lock, AlertCircle } from 'lucide-react';

export default function Login() {
  const { login } = useContext(AuthContext);
  const navigate = useNavigate();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [rememberMe, setRememberMe] = useState(false);
  const [error, setError] = useState('');
  const [shakeTrigger, setShakeTrigger] = useState(0);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      await login(email, password);
      if (rememberMe) {
        localStorage.setItem('ecoverse_remember_email', email);
      } else {
        localStorage.removeItem('ecoverse_remember_email');
      }
      navigate('/');
    } catch (err) {
      const msg = err.response?.data?.message || 'Login failed. Please try again.';
      setError(msg);
      setShakeTrigger((prev) => prev + 1);

      if (msg.includes('verify') || msg.includes('OTP')) {
        setTimeout(() => {
          navigate('/verify-otp', { state: { email } });
        }, 2000);
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={styles.pageWrapper}>
      <EcoBackground />

      {/* Large animated swaying tree emojis in the background */}
      <motion.div
        animate={{ rotate: [-3, 3, -3], y: [0, -6, 0] }}
        transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
        style={styles.bgTreeLeft}
      >
        🌳
      </motion.div>
      
      <motion.div
        animate={{ rotate: [3, -3, 3], y: [0, -5, 0] }}
        transition={{ duration: 7, repeat: Infinity, ease: "easeInOut" }}
        style={styles.bgTreeRight}
      >
        🌲
      </motion.div>

      <motion.div
        style={styles.cardWrapper}
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5, ease: "easeOut" }}
      >
        {/* Animated Sprout SVG and Logo */}
        <div style={styles.brandRow}>
          <style>{`
            @keyframes swayLogo {
              0% { transform: rotate(-6deg) scale(1); }
              100% { transform: rotate(6deg) scale(1.04); }
            }
            @keyframes spinEarth {
              from { transform: rotate(0deg); }
              to { transform: rotate(360deg); }
            }
          `}</style>
          <img 
            src="/logo_icon.png" 
            alt="Greenizo Logo" 
            style={{
              ...styles.sproutGif,
              width: '42px',
              height: '42px',
              animation: 'swayLogo 2.5s ease-in-out infinite alternate'
            }}
          />
          <h1 style={styles.brandTitle}>GREENIZO</h1>
        </div>

        <div style={styles.cardHeader}>
          <h2>Welcome Back</h2>
          <p>Sign in to continue your eco learning journey</p>
        </div>

        {/* Shake error alert */}
        {error && (
          <motion.div 
            style={styles.errorAlert}
            animate={{ x: [0, -10, 10, -10, 10, 0] }}
            transition={{ duration: 0.5 }}
          >
            <AlertCircle size={20} />
            <span>{error}</span>
          </motion.div>
        )}

        <form style={styles.form} onSubmit={handleSubmit}>
          <div className="form-group" style={{ marginBottom: '20px' }}>
            <label className="form-label">Email Address</label>
            <div style={styles.inputWrapper}>
              <Mail style={styles.inputIcon} size={18} />
              <input
                type="email"
                className="form-input"
                style={styles.inputPadding}
                placeholder="name@email.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                disabled={loading}
              />
            </div>
          </div>

          <div className="form-group" style={{ marginBottom: '20px' }}>
            <div style={styles.labelRow}>
              <label className="form-label">Password</label>
              <Link to="/forgot-password" style={styles.forgotLink}>Forgot Password?</Link>
            </div>
            <div style={styles.inputWrapper}>
              <Lock style={styles.inputIcon} size={18} />
              <input
                type="password"
                className="form-input"
                style={styles.inputPadding}
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                disabled={loading}
              />
            </div>
          </div>

          <div style={styles.row}>
            <label style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer' }}>
              <input
                type="checkbox"
                checked={rememberMe}
                onChange={(e) => setRememberMe(e.target.checked)}
                style={{ accentColor: '#2e7d32', width: '16px', height: '16px' }}
              />
              <span style={styles.rememberText}>Remember me</span>
            </label>
          </div>

          <motion.button
            type="submit"
            className="btn btn-primary"
            style={styles.submitBtn}
            whileHover={{ scale: loading ? 1 : 1.02 }}
            whileTap={{ scale: loading ? 1 : 0.98 }}
            disabled={loading}
          >
            {loading ? 'Signing in...' : 'Sign In'}
          </motion.button>
        </form>

        <div style={styles.footer}>
          <span>Don't have an account? </span>
          <Link to="/signup" style={styles.signupLink}>Sign Up</Link>
        </div>

        {/* Small spinning Earth SVG at the bottom */}
        <div style={styles.earthContainer}>
          <svg 
            viewBox="0 0 100 100" 
            style={{ 
              width: '40px', 
              height: '40px', 
              animation: 'spinEarth 12s linear infinite' 
            }}
          >
            <circle cx="50" cy="50" r="45" fill="none" stroke="#7FB77E" strokeWidth="2" strokeDasharray="6 4" />
            <circle cx="50" cy="50" r="38" fill="#E8F5E9" />
            <path d="M 30 40 Q 40 30, 50 40 T 70 40 T 60 60 T 30 40 Z" fill="#7FB77E" />
            <path d="M 40 65 Q 50 75, 60 65 T 50 55 Z" fill="#7FB77E" />
          </svg>
        </div>
      </motion.div>
    </div>
  );
}

const styles = {
  pageWrapper: {
    minHeight: '100vh',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    padding: '20px',
    position: 'relative',
    overflow: 'hidden',
  },
  bgTreeLeft: {
    position: 'absolute',
    left: '8%',
    top: '30%',
    fontSize: '130px',
    userSelect: 'none',
    opacity: 0.35,
    zIndex: 1,
    pointerEvents: 'none',
  },
  bgTreeRight: {
    position: 'absolute',
    right: '8%',
    bottom: '25%',
    fontSize: '150px',
    userSelect: 'none',
    opacity: 0.35,
    zIndex: 1,
    pointerEvents: 'none',
  },
  cardWrapper: {
    backgroundColor: '#FFFFFF',
    borderRadius: '24px',
    border: '1px solid rgba(0,0,0,0.05)',
    padding: '40px',
    width: '100%',
    maxWidth: '420px',
    boxShadow: '0 16px 40px rgba(46, 125, 50, 0.08)',
    display: 'flex',
    flexDirection: 'column',
    position: 'relative',
    zIndex: 2,
  },
  brandRow: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: '10px',
    marginBottom: '16px',
  },
  sproutGif: {
    width: '36px',
    height: '36px',
    objectFit: 'contain',
  },
  brandTitle: {
    fontSize: '2rem',
    fontWeight: '900',
    color: '#1b4d2c',
    margin: 0,
  },
  cardHeader: {
    textAlign: 'center',
    marginBottom: '24px',
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
  form: {
    display: 'flex',
    flexDirection: 'column',
  },
  inputWrapper: {
    position: 'relative',
    display: 'flex',
    alignItems: 'center',
  },
  inputIcon: {
    position: 'absolute',
    left: '16px',
    color: '#718096',
  },
  inputPadding: {
    paddingLeft: '46px',
  },
  labelRow: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  forgotLink: {
    fontSize: '0.85rem',
    fontWeight: '600',
    color: '#2e7d32',
  },
  row: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: '24px',
  },
  rememberText: {
    fontSize: '0.85rem',
    color: '#4a5568',
  },
  submitBtn: {
    width: '100%',
    padding: '14px',
    fontSize: '1.05rem',
    backgroundColor: '#2e7d32',
    color: '#FFFFFF',
    border: 'none',
    borderRadius: '12px',
    fontWeight: '700',
    cursor: 'pointer',
  },
  footer: {
    textAlign: 'center',
    marginTop: '24px',
    fontSize: '0.9rem',
    color: '#4a5568',
  },
  signupLink: {
    fontWeight: '700',
    color: '#2e7d32',
  },
  earthContainer: {
    display: 'flex',
    justifyContent: 'center',
    marginTop: '20px',
  },
  earthGif: {
    width: '40px',
    height: '40px',
    objectFit: 'contain',
    opacity: 0.8,
  }
};
