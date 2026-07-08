import React, { useState, useContext } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Link, useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import EcoBackground from '../components/EcoBackground';
import { User, Mail, Lock, School, GraduationCap, FileText, AlertCircle } from 'lucide-react';

export default function Signup() {
  const { register } = useContext(AuthContext);
  const navigate = useNavigate();

  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [institutionName, setInstitutionName] = useState('');
  const [grade, setGrade] = useState('');
  const [department, setDepartment] = useState('');
  const [institutionType, setInstitutionType] = useState('school'); // 'school' or 'college'
  
  const [error, setError] = useState('');
  const [shakeTrigger, setShakeTrigger] = useState(0);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    // Client-side validations
    if (password !== confirmPassword) {
      setError('Passwords do not match!');
      setShakeTrigger(prev => prev + 1);
      return;
    }

    if (password.length < 6) {
      setError('Password must be at least 6 characters!');
      setShakeTrigger(prev => prev + 1);
      return;
    }

    if (institutionType === 'school' && !grade) {
      setError('Please enter your grade/class!');
      setShakeTrigger(prev => prev + 1);
      return;
    }

    if (institutionType === 'college' && !department) {
      setError('Please enter your department!');
      setShakeTrigger(prev => prev + 1);
      return;
    }

    try {
      await register({
        fullName,
        email,
        password,
        institutionName,
        grade: institutionType === 'school' ? parseInt(grade, 10) : 0,
        department: institutionType === 'college' ? department : null
      });

      // Redirect to OTP verification page, passing email as state
      navigate('/verify-otp', { state: { email } });
    } catch (err) {
      setError(err.response?.data?.message || 'Registration failed. Please try again.');
      setShakeTrigger(prev => prev + 1);
    }
  };

  return (
    <div style={styles.pageWrapper}>
      <EcoBackground />

      <motion.div
        style={styles.cardWrapper}
        initial={{ opacity: 0, x: 100 }} // Slide in from right
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.6, ease: "easeOut" }}
      >
        <div style={styles.cardHeader}>
          <h2>Join Greenizo</h2>
          <p>Start learning, playing, and protecting our environment</p>
        </div>

        <AnimatePresence>
          {error && (
            <motion.div
              key={shakeTrigger}
              style={styles.errorAlert}
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{
                scale: 1,
                opacity: 1,
                x: [0, -10, 10, -10, 10, 0],
              }}
              exit={{ opacity: 0, scale: 0.9 }}
              transition={{ duration: 0.4 }}
            >
              <AlertCircle size={18} />
              <span>{error}</span>
            </motion.div>
          )}
        </AnimatePresence>

        <form onSubmit={handleSubmit} style={styles.form}>
          <div className="form-group">
            <label className="form-label">Full Name</label>
            <div style={styles.inputWrapper}>
              <User size={18} style={styles.inputIcon} />
              <input
                type="text"
                className="form-input"
                style={styles.inputPadding}
                placeholder="Enter full name"
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                required
              />
            </div>
          </div>

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
              />
            </div>
          </div>

          <div style={styles.row}>
            <div className="form-group" style={{ flex: 1, marginRight: '10px' }}>
              <label className="form-label">Password</label>
              <div style={styles.inputWrapper}>
                <Lock size={18} style={styles.inputIcon} />
                <input
                  type="password"
                  className="form-input"
                  style={styles.inputPadding}
                  placeholder="Min 6 chars"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
              </div>
            </div>

            <div className="form-group" style={{ flex: 1 }}>
              <label className="form-label">Confirm Password</label>
              <div style={styles.inputWrapper}>
                <Lock size={18} style={styles.inputIcon} />
                <input
                  type="password"
                  className="form-input"
                  style={styles.inputPadding}
                  placeholder="Repeat password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  required
                />
              </div>
            </div>
          </div>

          <div className="form-group" style={{ marginBottom: '16px' }}>
            <label className="form-label">Are you studying in School or College?</label>
            <div style={{ display: 'flex', gap: '20px', marginTop: '6px' }}>
              <label style={{ display: 'flex', alignItems: 'center', gap: '6px', cursor: 'pointer', fontWeight: '600', color: '#4a5568' }}>
                <input
                  type="radio"
                  name="institutionType"
                  value="school"
                  checked={institutionType === 'school'}
                  onChange={() => {
                    setInstitutionType('school');
                    setDepartment(''); // Clear college specific input
                  }}
                  style={{ accentColor: '#2e7d32', width: '16px', height: '16px' }}
                />
                <span>School</span>
              </label>
              <label style={{ display: 'flex', alignItems: 'center', gap: '6px', cursor: 'pointer', fontWeight: '600', color: '#4a5568' }}>
                <input
                  type="radio"
                  name="institutionType"
                  value="college"
                  checked={institutionType === 'college'}
                  onChange={() => {
                    setInstitutionType('college');
                    setGrade(''); // Clear school specific input
                  }}
                  style={{ accentColor: '#2e7d32', width: '16px', height: '16px' }}
                />
                <span>College</span>
              </label>
            </div>
          </div>

          <div className="form-group">
            <label className="form-label">{institutionType === 'school' ? 'School Name' : 'College Name'}</label>
            <div style={styles.inputWrapper}>
              <School size={18} style={styles.inputIcon} />
              <input
                type="text"
                className="form-input"
                style={styles.inputPadding}
                placeholder={institutionType === 'school' ? 'Enter school name' : 'Enter college name'}
                value={institutionName}
                onChange={(e) => setInstitutionName(e.target.value)}
                required
              />
            </div>
          </div>

          {institutionType === 'school' ? (
            <div className="form-group">
              <label className="form-label">Grade / Class</label>
              <div style={styles.inputWrapper}>
                <GraduationCap size={18} style={styles.inputIcon} />
                <input
                  type="number"
                  className="form-input"
                  style={styles.inputPadding}
                  placeholder="e.g. 10, 12"
                  value={grade}
                  onChange={(e) => setGrade(e.target.value)}
                  required
                />
              </div>
            </div>
          ) : (
            <div className="form-group">
              <label className="form-label">Department</label>
              <div style={styles.inputWrapper}>
                <FileText size={18} style={styles.inputIcon} />
                <input
                  type="text"
                  className="form-input"
                  style={styles.inputPadding}
                  placeholder="e.g. Computer Science"
                  value={department}
                  onChange={(e) => setDepartment(e.target.value)}
                  required
                />
              </div>
            </div>
          )}

          <motion.button
            type="submit"
            className="btn btn-primary"
            style={styles.submitBtn}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            style={{ marginTop: '12px' }}
          >
            Sign Up
          </motion.button>
        </form>

        <div style={styles.footer}>
          <span>Already have an account? </span>
          <Link to="/login" style={styles.loginLink}>Log In</Link>
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
    maxWidth: '480px',
    boxShadow: '0 16px 40px rgba(139, 107, 74, 0.12)',
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
    color: '#A39387',
  },
  inputPadding: {
    paddingLeft: '46px',
  },
  row: {
    display: 'flex',
    justifyContent: 'space-between',
    width: '100%',
  },
  submitBtn: {
    width: '100%',
    padding: '14px',
    fontSize: '1rem',
  },
  footer: {
    textAlign: 'center',
    marginTop: '24px',
    fontSize: '0.9rem',
    color: '#6E5C50',
  },
  loginLink: {
    fontWeight: '700',
    color: '#8B6B4A',
  },
};
