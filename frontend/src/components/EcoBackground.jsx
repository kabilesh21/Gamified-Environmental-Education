import React, { useMemo } from 'react';
import { motion } from 'framer-motion';

export default function EcoBackground() {
  // Generate 20 floating particles with stable random offsets using useMemo
  const particles = useMemo(() => {
    const arr = [];
    for (let i = 0; i < 20; i++) {
      arr.push({
        id: i,
        x: Math.random() * 100, // percentage
        y: Math.random() * 100, // percentage
        size: Math.random() * 16 + 8, // size in px
        delay: Math.random() * 5, // animation delay
        duration: Math.random() * 15 + 10, // float speed
        rotate: Math.random() * 360,
      });
    }
    return arr;
  }, []);

  return (
    <div style={styles.container}>
      {/* Drifting nature gradient overlay */}
      <div style={styles.gradient} />

      {/* Floating leaves/particles */}
      {particles.map((p) => (
        <motion.div
          key={p.id}
          style={{
            ...styles.leaf,
            left: `${p.x}%`,
            top: `${p.y}%`,
            width: p.size,
            height: p.size * 1.4, // Leaf proportions
            rotate: p.rotate,
          }}
          animate={{
            y: [0, -100, 0],
            x: [0, Math.random() * 40 - 20, 0],
            rotate: [p.rotate, p.rotate + 360],
            opacity: [0.1, 0.4, 0.1],
          }}
          transition={{
            duration: p.duration,
            repeat: Infinity,
            delay: p.delay,
            ease: "easeInOut",
          }}
        >
          {/* Simple leaf SVG */}
          <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path
              d="M2 22C2 22 6 18 10 16C14 14 18 15 22 11C23.5 9.5 23 6 21 4C19 2 15.5 1.5 14 3C10 7 11 11 9 15C7 17 2 22 2 22Z"
              fill="#7FB77E"
            />
            <path
              d="M14 3C12.5 5 11 8.5 10 11C9 13.5 10 16 10 16"
              stroke="#5c995b"
              strokeWidth="1.5"
              strokeLinecap="round"
            />
          </svg>
        </motion.div>
      ))}
    </div>
  );
}

const styles = {
  container: {
    position: 'fixed',
    top: 0,
    left: 0,
    width: '100vw',
    height: '100vh',
    overflow: 'hidden',
    zIndex: -1,
    backgroundColor: '#EAF2E8', // Light Green
  },
  gradient: {
    position: 'absolute',
    top: 0,
    left: 0,
    width: '100%',
    height: '100%',
    background: 'radial-gradient(circle at 10% 20%, rgba(127, 183, 126, 0.12) 0%, rgba(200, 230, 201, 0.18) 90%)',
  },
  leaf: {
    position: 'absolute',
    opacity: 0,
    pointerEvents: 'none',
  },
};
