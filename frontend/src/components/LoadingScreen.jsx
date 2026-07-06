import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Globe, Leaf, RotateCw } from 'lucide-react';

export default function LoadingScreen({ onComplete }) {
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    // Simulate loading progress rapidly for high performance
    const interval = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          clearInterval(interval);
          if (onComplete) onComplete();
          return 100;
        }
        return prev + Math.floor(Math.random() * 20) + 15;
      });
    }, 45);

    return () => clearInterval(interval);
  }, [onComplete]);

  return (
    <motion.div
      style={styles.overlay}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.5 }}
    >
      <div style={styles.content}>
        {/* Animated Eco Logo Area */}
        <div style={styles.logoWrapper}>
          {/* Rotating recycle loop */}
          <motion.div
            style={styles.recycleRing}
            animate={{ rotate: 360 }}
            transition={{ duration: 6, repeat: Infinity, ease: "linear" }}
          >
            <RotateCw size={120} stroke="#C3AED6" strokeWidth={1} style={{ opacity: 0.3 }} />
          </motion.div>

          {/* Central bouncing globe */}
          <motion.div
            style={styles.globe}
            animate={{ y: [0, -12, 0] }}
            transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
          >
            <Globe size={64} color="#8B6B4A" strokeWidth={1.5} />
          </motion.div>

          {/* Drifting leaf */}
          <motion.div
            style={styles.leaf}
            animate={{
              x: [-15, 15, -15],
              y: [-10, 10, -10],
              rotate: [0, 45, 0],
            }}
            transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
          >
            <Leaf size={28} fill="#7FB77E" stroke="#7FB77E" />
          </motion.div>
        </div>

        {/* Project Name Fade-in */}
        <motion.h1
          style={styles.title}
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >
          Ecoversee
        </motion.h1>
        
        <motion.p
          style={styles.subtitle}
          initial={{ opacity: 0 }}
          animate={{ opacity: 0.7 }}
          transition={{ delay: 0.3, duration: 0.8 }}
        >
          Gamified Environmental Education
        </motion.p>

        {/* Progress Bar Animation */}
        <div style={styles.progressContainer}>
          <motion.div
            style={styles.progressBar}
            initial={{ width: 0 }}
            animate={{ width: `${Math.min(progress, 100)}%` }}
            transition={{ ease: "easeInOut" }}
          />
        </div>
        
        <span style={styles.progressText}>{Math.min(progress, 100)}%</span>
      </div>
    </motion.div>
  );
}

const styles = {
  overlay: {
    position: 'fixed',
    top: 0,
    left: 0,
    width: '100vw',
    height: '100vh',
    backgroundColor: '#F8F5F1',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 9999,
  },
  content: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    width: '80%',
    maxWidth: '360px',
  },
  logoWrapper: {
    position: 'relative',
    width: '140px',
    height: '140px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: '24px',
  },
  recycleRing: {
    position: 'absolute',
  },
  globe: {
    zIndex: 2,
  },
  leaf: {
    position: 'absolute',
    top: '15px',
    right: '15px',
    zIndex: 3,
  },
  title: {
    fontSize: '2.2rem',
    fontWeight: '800',
    color: '#8B6B4A',
    letterSpacing: '2px',
    marginBottom: '4px',
    textTransform: 'uppercase',
  },
  subtitle: {
    fontSize: '0.9rem',
    fontWeight: '500',
    color: '#6E5C50',
    marginBottom: '32px',
  },
  progressContainer: {
    width: '100%',
    height: '6px',
    backgroundColor: '#EADBCE',
    borderRadius: '10px',
    overflow: 'hidden',
    marginBottom: '8px',
  },
  progressBar: {
    height: '100%',
    backgroundColor: '#7FB77E',
    borderRadius: '10px',
  },
  progressText: {
    fontSize: '0.85rem',
    fontWeight: '600',
    color: '#8B6B4A',
  },
};
