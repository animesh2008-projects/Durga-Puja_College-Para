import React, { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'

export default function DeveloperCredit() {
  const [isExpanded, setIsExpanded] = useState(false)

  const developer = {
    name: 'Animesh Karmakar',
    title: 'Designed & Developed by',
    linkedin: 'https://www.linkedin.com/in/animesh-karmakar-91351536b',
    email: 'mailto:animeshkarmakar882@gmail.com',
    emailRaw: 'animeshkarmakar882@gmail.com',
  }

  return (
    <div className="dev-credit-wrapper">
      {/* Decorative Golden Line */}
      <motion.div
        className="dev-gold-divider"
        initial={{ scaleX: 0 }}
        whileInView={{ scaleX: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 0.8, ease: 'easeInOut' }}
        aria-hidden="true"
      />

      <motion.div
        className="dev-credit-container"
        initial={{ opacity: 0, y: 22 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.75, delay: 0.15 }}
      >
        {/* Subtle decorative emblem */}
        <div className="dev-emblem-badge" aria-hidden="true">
          <span>✨</span>
        </div>

        {/* Lead Text */}
        <p className="dev-credit-lead">
          {developer.title}
        </p>

        {/* Prominent Name with 3D Depth & Hover interaction */}
        <h3
          className="dev-name-title"
          onClick={() => setIsExpanded(!isExpanded)}
          role="button"
          tabIndex={0}
          onKeyDown={(e) => {
            if (e.key === 'Enter' || e.key === ' ') {
              e.preventDefault()
              setIsExpanded(!isExpanded)
            }
          }}
          title="ডেভেলপার বিবরণ দেখতে ক্লিক করুন"
          aria-expanded={isExpanded}
        >
          <span className="dev-name-text">{developer.name}</span>
          <span className="dev-expand-indicator" aria-hidden="true">
            {isExpanded ? '▴' : '▾'}
          </span>
        </h3>

        {/* Contact Links: LinkedIn & Email */}
        <div className="dev-links-group" role="list">
          {/* LinkedIn Button */}
          <a
            href={developer.linkedin}
            target="_blank"
            rel="noopener noreferrer"
            className="dev-link-chip"
            aria-label="Animesh Karmakar on LinkedIn"
            role="listitem"
          >
            <svg
              className="dev-icon"
              viewBox="0 0 24 24"
              fill="currentColor"
              aria-hidden="true"
            >
              <path d="M19 3a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h14m-.5 15.5v-5.3a3.26 3.26 0 0 0-3.26-3.26c-.85 0-1.84.52-2.28 1.3v-1.11h-2.79v8.37h2.79v-4.93c0-.77.62-1.4 1.39-1.4a1.4 1.4 0 0 1 1.4 1.4v4.93h2.75M6.46 10.9v8.37H9.2V10.9H6.46M7.83 6.64c-.93 0-1.68.75-1.68 1.68s.75 1.68 1.68 1.68 1.68-.75 1.68-1.68-.75-1.68-1.68-1.68z" />
            </svg>
            <span className="dev-link-label">LinkedIn</span>
          </a>

          {/* Email Button */}
          <a
            href={developer.email}
            className="dev-link-chip"
            aria-label="Email Animesh Karmakar"
            role="listitem"
          >
            <svg
              className="dev-icon"
              viewBox="0 0 24 24"
              fill="currentColor"
              aria-hidden="true"
            >
              <path d="M20 4H4c-1.1 0-1.99.9-1.99 2L2 18c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm0 4l-8 5-8-5V6l8 5 8-5v2z" />
            </svg>
            <span className="dev-link-label">Email</span>
          </a>
        </div>

        {/* Expandable Developer Info Card */}
        <AnimatePresence>
          {isExpanded && (
            <motion.div
              className="dev-expand-card"
              initial={{ opacity: 0, height: 0, y: -10 }}
              animate={{ opacity: 1, height: 'auto', y: 0 }}
              exit={{ opacity: 0, height: 0, y: -10 }}
              transition={{ duration: 0.35, ease: 'easeOut' }}
            >
              <div className="dev-expand-inner">
                <div className="dev-expand-badge">Developer Profile</div>
                <div className="dev-expand-name">{developer.name}</div>
                <div className="dev-expand-items">
                  <div className="dev-expand-item">
                    <span className="item-label">LinkedIn:</span>
                    <a
                      href={developer.linkedin}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="item-link"
                    >
                      linkedin.com/in/animesh-karmakar-91351536b
                    </a>
                  </div>
                  <div className="dev-expand-item">
                    <span className="item-label">Email:</span>
                    <a href={developer.email} className="item-link">
                      {developer.emailRaw}
                    </a>
                  </div>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
    </div>
  )
}
