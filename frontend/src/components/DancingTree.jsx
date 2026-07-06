import React from 'react';
import { motion } from 'framer-motion';

export default function DancingTree() {
  return (
    <div style={styles.container}>
      <svg
        width="200"
        height="220"
        viewBox="0 0 200 220"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        style={styles.svg}
      >
        {/* Shadow under the tree */}
        <ellipse cx="100" cy="205" rx="60" ry="10" fill="#6E5C50" opacity="0.2" />

        {/* Tree Trunk with Swaying/Dancing Animation */}
        <motion.g
          animate={{
            rotate: [-4, 4, -4],
            skewX: [-2, 2, -2],
          }}
          transition={{
            duration: 4,
            repeat: Infinity,
            ease: "easeInOut",
          }}
          style={{ transformOrigin: "100px 200px" }}
        >
          {/* Main Trunk */}
          <path
            d="M90 200 L93 140 Q100 120 107 140 L110 200 Z"
            fill="#8B6B4A"
            stroke="#6E5C50"
            strokeWidth="3"
          />

          {/* Left Branch */}
          <motion.path
            d="M92 160 Q70 150 65 135 Q68 130 75 142 Q85 152 92 155"
            fill="#8B6B4A"
            stroke="#6E5C50"
            strokeWidth="3"
            animate={{ rotate: [-6, 6, -6] }}
            transition={{ duration: 2.5, repeat: Infinity, ease: "easeInOut" }}
            style={{ transformOrigin: "92px 160px" }}
          />

          {/* Right Branch */}
          <motion.path
            d="M108 160 Q130 150 135 135 Q132 130 125 142 Q115 152 108 155"
            fill="#8B6B4A"
            stroke="#6E5C50"
            strokeWidth="3"
            animate={{ rotate: [6, -6, 6] }}
            transition={{ duration: 2.5, repeat: Infinity, ease: "easeInOut" }}
            style={{ transformOrigin: "108px 160px" }}
          />

          {/* Cute Foliage Leaves (Dancing Canopy) */}
          <motion.g
            animate={{
              scale: [0.98, 1.02, 0.98],
              y: [0, -3, 0],
            }}
            transition={{
              duration: 3,
              repeat: Infinity,
              ease: "easeInOut",
            }}
          >
            {/* Big green circle foliage */}
            <circle cx="100" cy="100" r="55" fill="#7FB77E" stroke="#5c995b" strokeWidth="4" />
            <circle cx="70" cy="85" r="35" fill="#7FB77E" stroke="#5c995b" strokeWidth="3" />
            <circle cx="130" cy="85" r="35" fill="#7FB77E" stroke="#5c995b" strokeWidth="3" />
            <circle cx="100" cy="60" r="30" fill="#9CD09C" stroke="#5c995b" strokeWidth="3" />
          </motion.g>

          {/* Face Elements (Blinking eyes & happy smile) */}
          <g>
            {/* Left Eye */}
            <motion.ellipse
              cx="85"
              cy="95"
              rx="4"
              ry="5"
              fill="#2D241E"
              animate={{ scaleY: [1, 0.1, 1, 1, 0.1, 1] }}
              transition={{ duration: 4, repeat: Infinity, ease: "easeInOut", repeatDelay: 1 }}
              style={{ transformOrigin: "85px 95px" }}
            />

            {/* Right Eye */}
            <motion.ellipse
              cx="115"
              cy="95"
              rx="4"
              ry="5"
              fill="#2D241E"
              animate={{ scaleY: [1, 0.1, 1, 1, 0.1, 1] }}
              transition={{ duration: 4, repeat: Infinity, ease: "easeInOut", repeatDelay: 1 }}
              style={{ transformOrigin: "115px 95px" }}
            />

            {/* Rosy Cheeks */}
            <circle cx="77" cy="103" r="4" fill="#E74C3C" opacity="0.6" />
            <circle cx="123" cy="103" r="4" fill="#E74C3C" opacity="0.6" />

            {/* Happy Smile */}
            <path
              d="M93 105 Q100 112 107 105"
              fill="none"
              stroke="#2D241E"
              strokeWidth="2.5"
              strokeLinecap="round"
            />
          </g>
        </motion.g>
      </svg>
      <span style={styles.caption}>Ecoversee Mascot</span>
    </div>
  );
}

const styles = {
  container: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    gap: '8px',
  },
  svg: {
    filter: 'drop-shadow(0 12px 24px rgba(127, 183, 126, 0.25))',
  },
  caption: {
    fontSize: '0.78rem',
    fontWeight: '700',
    color: '#AADBBD',
    textTransform: 'uppercase',
    letterSpacing: '2px',
  },
};
