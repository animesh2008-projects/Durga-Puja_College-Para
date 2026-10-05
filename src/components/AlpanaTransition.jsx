import React from 'react'
import { motion } from 'framer-motion'

/**
 * AlpanaTransition.jsx
 * -------------------------------------------------------------
 * Bengali Traditional Alpana Section Divider with draw animation:
 * - Floral and paisley sacred geometry
 * - Golden glowing stroke draws itself on scroll into view
 * -------------------------------------------------------------
 */
export default function AlpanaTransition({ text = '✦ ❀ ✦', flip = false }) {
  return (
    <div className={`alpana-transition-divider ${flip ? 'flipped' : ''}`} aria-hidden="true">
      <svg viewBox="0 0 800 60" className="alpana-draw-svg">
        {/* Left flourish */}
        <motion.path
          d="M 50,30 Q 150,10 250,30 T 370,30"
          fill="none"
          stroke="var(--gold-bright)"
          strokeWidth="2"
          initial={{ pathLength: 0, opacity: 0 }}
          whileInView={{ pathLength: 1, opacity: 0.85 }}
          viewport={{ once: true, amount: 0.5 }}
          transition={{ duration: 1.4, ease: 'easeInOut' }}
        />
        {/* Left paisley leaf */}
        <motion.path
          d="M 230,28 C 250,15 280,20 270,35 C 260,35 240,32 230,28 Z"
          fill="none"
          stroke="var(--gold)"
          strokeWidth="1.5"
          initial={{ pathLength: 0 }}
          whileInView={{ pathLength: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 1.2, delay: 0.3 }}
        />

        {/* Center mandala emblem */}
        <motion.circle
          cx="400"
          cy="30"
          r="14"
          fill="none"
          stroke="var(--gold-bright)"
          strokeWidth="2"
          initial={{ scale: 0, opacity: 0 }}
          whileInView={{ scale: 1, opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, delay: 0.2 }}
        />
        <motion.circle
          cx="400"
          cy="30"
          r="5"
          fill="#C41E3A"
          stroke="#FFD700"
          strokeWidth="1"
          initial={{ scale: 0 }}
          whileInView={{ scale: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.4 }}
        />
        <motion.path
          d="M 400,10 L 400,14 M 400,46 L 400,50 M 380,30 L 384,30 M 416,30 L 420,30"
          stroke="var(--gold-bright)"
          strokeWidth="2"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, delay: 0.5 }}
        />

        {/* Right flourish */}
        <motion.path
          d="M 750,30 Q 650,10 550,30 T 430,30"
          fill="none"
          stroke="var(--gold-bright)"
          strokeWidth="2"
          initial={{ pathLength: 0, opacity: 0 }}
          whileInView={{ pathLength: 1, opacity: 0.85 }}
          viewport={{ once: true, amount: 0.5 }}
          transition={{ duration: 1.4, ease: 'easeInOut' }}
        />
        {/* Right paisley leaf */}
        <motion.path
          d="M 570,28 C 550,15 520,20 530,35 C 540,35 560,32 570,28 Z"
          fill="none"
          stroke="var(--gold)"
          strokeWidth="1.5"
          initial={{ pathLength: 0 }}
          whileInView={{ pathLength: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 1.2, delay: 0.3 }}
        />
      </svg>
    </div>
  )
}
