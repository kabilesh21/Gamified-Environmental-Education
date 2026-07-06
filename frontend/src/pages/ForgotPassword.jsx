import React, { useState, useContext } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Link, useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import EcoBackground from '../components/EcoBackground';
import { Mail, ArrowLeft, AlertCircle, CheckCircle2 } from 'lucide-react';

export default function ForgotPassword() {
  const { forgotPassword } = useContext(AuthContext);
  const navigate = useNavigate();

  const [email, setEmail] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [loading, setLoading] = useState(false);
  const [shakeTrigger, setShakeTrigger] = useState(0);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    setLoading(true);

    try {
      await forgotPassword(email);
      setSuccess('Password recovery OTP has been sent. Redirecting to reset page...');
      setTimeout(() => {
        navigate('/reset-password', { state: { email } });
      }, 2000);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to send recovery OTP. Please verify your email.');
      setShakeTrigger(prev => prev + 1);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={styles.pageWrapper}>
      <EcoBackground />

      <motion.div
        style={styles.cardWrapper}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <div style={styles.backBtnWrapper}>
          <Link to="/login" style={styles.backLink}>
            <ArrowLeft size={16} />
            <span>Back to Login</span>
          </Link>
        </div>

        <div style={styles.cardHeader}>
          <h2>Forgot Password?</h2>
          <p>Enter your email address and we'll send you an OTP to reset your password.</p>
        </div>

        <AnimatePresence>
          {error && (
            <motion.div
              key={shakeTrigger}
              style={styles.errorAlert}
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1, x: [0, -10, 10, -10, 10, 0] }}
              exit={{ opacity: 0 }}
            >
              <AlertCircle size={18} />
              <span>{error}</span>
            </motion.div>
          )}

          {success && (
            <motion.div
              style={styles.successAlert}
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ opacity: 0 }}
            >
              <CheckCircle2 size={18} />
              <span>{success}</span>
            </motion.div>
          )}
        </AnimatePresence>

        <form onSubmit={handleSubmit} style={styles.form}>
          <div className="form-group">
            <label className="form-label">Email Address</label>
            <div style={styles.inputWrapper}>
              <Mail size={18} style={styles.inputIcon} />
              <input
                type="email"
                className="form-input"
                style={styles.inputPadding}
                placeholder="Enter your email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                disabled={loading}
              />
            </div>
          </div>

          <motion.button
            type="submit"
            className="btn btn-primary"
            style={styles.submitBtn}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            disabled={loading}
            style={{ marginTop: '12px' }}
          >
            {loading ? 'Sending...' : 'Send Recovery OTP'}
          </motion.button>
        </form>
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
  },
  cardWrapper: {
    backgroundColor: '#FFFFFF',
    borderRadius: '24px',
    border: '1px solid #EADBCE',
    padding: '40px',
    width: '100%',
    maxWidth: '420px',
    boxShadow: '0 16px 40px rgba(139, 107, 74, 0.12)',
  },
  backBtnWrapper: {
    marginBottom: '20px',
  },
  backLink: {
    display: 'inline-flex',
    alignItems: 'center',
    gap: '6px',
    fontSize: '0.85rem',
    fontWeight: '600',
    color: '#A67C52',
  },
  cardHeader: {
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
  inputWrapper: {
    position: 'relative',
    display: 'flex',
    alignItems: 'center',
  },
  inputIcon: {
    position: 'absolute',
    left: '16px',
    color: '#A39387',
  },
  inputPadding: {
    paddingLeft: '46px',
  },
  submitBtn: {
    width: '100%',
    padding: '14px',
    fontSize: '1rem',
  },
};
