import React, { useState, useContext } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useLocation, useNavigate, Link } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import EcoBackground from '../components/EcoBackground';
import { ShieldAlert, KeyRound, Lock, AlertCircle, CheckCircle2 } from 'lucide-react';

export default function ResetPassword() {
  const { resetPassword } = useContext(AuthContext);
  const location = useLocation();
  const navigate = useNavigate();

  const emailFromState = location.state?.email || '';

  const [email, setEmail] = useState(emailFromState);
  const [otp, setOtp] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [loading, setLoading] = useState(false);
  const [shakeTrigger, setShakeTrigger] = useState(0);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    if (newPassword !== confirmPassword) {
      setError('Passwords do not match!');
      setShakeTrigger(prev => prev + 1);
      return;
    }

    if (newPassword.length < 6) {
      setError('Password must be at least 6 characters.');
      setShakeTrigger(prev => prev + 1);
      return;
    }

    setLoading(true);

    try {
      await resetPassword(email, otp, newPassword);
      setSuccess('Your password has been reset successfully! Redirecting to login...');
      setTimeout(() => {
        navigate('/login');
      }, 2500);
    } catch (err) {
      setError(err.response?.data?.message || 'Password reset failed. Please check the OTP and try again.');
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
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5 }}
      >
        <div style={styles.cardHeader}>
          <h2>Reset Password</h2>
          <p>Please enter the OTP sent to your email along with your new password.</p>
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
            <input
              type="email"
              className="form-input"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              disabled={!!emailFromState || loading}
            />
          </div>

          <div className="form-group">
            <label className="form-label">Verification OTP (6-digits)</label>
            <div style={styles.inputWrapper}>
              <KeyRound size={18} style={styles.inputIcon} />
              <input
                type="text"
                className="form-input"
                style={styles.inputPadding}
                placeholder="Enter 6-digit code"
                value={otp}
                onChange={(e) => setOtp(e.target.value)}
                required
                disabled={loading}
              />
            </div>
          </div>

          <div className="form-group">
            <label className="form-label">New Password</label>
            <div style={styles.inputWrapper}>
              <Lock size={18} style={styles.inputIcon} />
              <input
                type="password"
                className="form-input"
                style={styles.inputPadding}
                placeholder="Enter new password"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                required
                disabled={loading}
              />
            </div>
          </div>

          <div className="form-group">
            <label className="form-label">Confirm New Password</label>
            <div style={styles.inputWrapper}>
              <Lock size={18} style={styles.inputIcon} />
              <input
                type="password"
                className="form-input"
                style={styles.inputPadding}
                placeholder="Repeat new password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
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
            {loading ? 'Resetting...' : 'Reset Password'}
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
  cardHeader: {
    marginBottom: '24px',
    textAlign: 'center',
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
