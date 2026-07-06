import React, { useState, useRef, useEffect, useContext } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useLocation, useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import EcoBackground from '../components/EcoBackground';
import { CheckCircle2, AlertCircle, ShieldAlert } from 'lucide-react';

export default function VerifyOtp() {
  const { verifyOtp, resendOtp } = useContext(AuthContext);
  const location = useLocation();
  const navigate = useNavigate();

  // Retrieve email passed in navigation state
  const email = location.state?.email || '';

  const [otp, setOtp] = useState(['', '', '', '', '', '']);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [shakeTrigger, setShakeTrigger] = useState(0);

  // Timer countdown: 5 minutes (300 seconds)
  const [timeLeft, setTimeLeft] = useState(300);
  const [canResend, setCanResend] = useState(false);

  const inputRefs = useRef([]);

  useEffect(() => {
    if (!email) {
      setError('Invalid email verification request. Redirecting...');
      setTimeout(() => navigate('/login'), 3000);
      return;
    }

    if (timeLeft <= 0) {
      setCanResend(true);
      return;
    }

    const timer = setInterval(() => {
      setTimeLeft(prev => prev - 1);
    }, 1000);

    return () => clearInterval(timer);
  }, [timeLeft, email, navigate]);

  const handleChange = (index, value) => {
    if (isNaN(value)) return; // Allow numbers only
    
    const newOtp = [...otp];
    // Take the last digit typed
    newOtp[index] = value.substring(value.length - 1);
    setOtp(newOtp);

    // Auto-focus next box
    if (value && index < 5) {
      inputRefs.current[index + 1].focus();
    }
  };

  const handleKeyDown = (index, e) => {
    // Focus previous box on Backspace
    if (e.key === 'Backspace' && !otp[index] && index > 0) {
      inputRefs.current[index - 1].focus();
    }
  };

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs < 10 ? '0' : ''}${secs}`;
  };

  const handleResend = async () => {
    if (!canResend) return;
    setError('');
    setSuccess('');

    try {
      await resendOtp(email);
      setSuccess('A new 6-digit OTP code has been sent to your email.');
      setOtp(['', '', '', '', '', '']);
      setTimeLeft(300); // Reset timer to 5 minutes
      setCanResend(false);
      inputRefs.current[0].focus();
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to resend OTP.');
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    const otpCode = otp.join('');
    if (otpCode.length < 6) {
      setError('Please enter the complete 6-digit OTP code.');
      setShakeTrigger(prev => prev + 1);
      return;
    }

    try {
      await verifyOtp(email, otpCode);
      setSuccess('Your account is verified and activated successfully! Redirecting...');
      setTimeout(() => {
        navigate('/login');
      }, 2500);
    } catch (err) {
      setError(err.response?.data?.message || 'OTP verification failed. Please try again.');
      setShakeTrigger(prev => prev + 1);
    }
  };

  return (
    <div style={styles.pageWrapper}>
      <EcoBackground />

      <motion.div
        style={styles.cardWrapper}
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5 }}
      >
        <div style={styles.cardHeader}>
          <ShieldAlert size={48} color="#8B6B4A" style={{ marginBottom: '12px' }} />
          <h2>Verify Account</h2>
          <p style={styles.desc}>We've sent a 6-digit OTP to your email: <br/><strong style={{color: '#2D241E'}}>{email}</strong></p>
        </div>

        <AnimatePresence>
          {error && (
            <motion.div
              key={`err-${shakeTrigger}`}
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
          <div style={styles.otpInputContainer}>
            {otp.map((digit, i) => (
              <motion.input
                key={i}
                ref={(el) => (inputRefs.current[i] = el)}
                type="text"
                maxLength={1}
                value={digit}
                onChange={(e) => handleChange(i, e.target.value)}
                onKeyDown={(e) => handleKeyDown(i, e)}
                style={styles.otpInput}
                whileFocus={{
                  borderColor: '#7FB77E',
                  boxShadow: '0 0 10px rgba(127, 183, 126, 0.4)',
                }}
              />
            ))}
          </div>

          <div style={styles.timerRow}>
            {timeLeft > 0 ? (
              <span>OTP Expiry in <strong style={{color: '#8B6B4A'}}>{formatTime(timeLeft)}</strong></span>
            ) : (
              <span style={{color: '#9B1C1C', fontWeight: 600}}>OTP expired</span>
            )}
          </div>

          <motion.button
            type="submit"
            className="btn btn-primary"
            style={styles.submitBtn}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            disabled={otp.join('').length < 6}
          >
            Verify & Activate
          </motion.button>
        </form>

        <div style={styles.footer}>
          <span>Didn't receive the code? </span>
          <button
            onClick={handleResend}
            style={{
              ...styles.resendBtn,
              opacity: canResend ? 1 : 0.5,
              cursor: canResend ? 'pointer' : 'not-allowed',
            }}
            disabled={!canResend}
          >
            Resend OTP
          </button>
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
  },
  cardWrapper: {
    backgroundColor: '#FFFFFF',
    borderRadius: '24px',
    border: '1px solid #EADBCE',
    padding: '40px',
    width: '100%',
    maxWidth: '440px',
    boxShadow: '0 16px 40px rgba(139, 107, 74, 0.12)',
    textAlign: 'center',
  },
  cardHeader: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    marginBottom: '24px',
  },
  desc: {
    fontSize: '0.9rem',
    color: '#6E5C50',
    marginTop: '6px',
    lineHeight: '1.4',
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
    marginBottom: '24px',
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
    marginBottom: '24px',
  },
  form: {
    display: 'flex',
    flexDirection: 'column',
  },
  otpInputContainer: {
    display: 'flex',
    justifyContent: 'space-between',
    gap: '10px',
    marginBottom: '20px',
  },
  otpInput: {
    width: '46px',
    height: '56px',
    fontSize: '1.4rem',
    fontWeight: '700',
    textAlign: 'center',
    border: '2px solid #EADBCE',
    borderRadius: '12px',
    outline: 'none',
    backgroundColor: '#FFFFFF',
    color: '#2D241E',
    transition: 'all 0.2s ease',
  },
  timerRow: {
    fontSize: '0.85rem',
    color: '#6E5C50',
    marginBottom: '24px',
  },
  submitBtn: {
    width: '100%',
    padding: '14px',
    fontSize: '1rem',
  },
  footer: {
    marginTop: '24px',
    fontSize: '0.9rem',
    color: '#6E5C50',
  },
  resendBtn: {
    background: 'none',
    border: 'none',
    fontWeight: '700',
    color: '#8B6B4A',
    padding: '0',
    fontSize: '0.9rem',
  },
};
