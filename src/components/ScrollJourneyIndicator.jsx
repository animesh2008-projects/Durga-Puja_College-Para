import React, { useState, useEffect } from 'react'

/**
 * ScrollJourneyIndicator.jsx
 * ------------------------------------------------------------------
 * Virtual Diya Journey Progress Indicator:
 * Shows the visitor's progress through the sacred Puja Pandal:
 * 🪔 → প্রবেশ → দেবীদর্শন → উদ্বোধন → নির্ঘণ্ট → অনুষ্ঠান → গ্যালারি → নিরঞ্জন
 * A golden diya glides along the track as the visitor walks through.
 * ------------------------------------------------------------------
 */
export default function ScrollJourneyIndicator() {
  const [scrollProgress, setScrollProgress] = useState(0)
  const [activeStageIndex, setActiveStageIndex] = useState(0)

  const stages = [
    { id: 'home', label: 'প্রবেশ', threshold: 0.08 },
    { id: 'durga-reveal', label: 'দেবীদর্শন', threshold: 0.22 },
    { id: 'inauguration', label: 'উদ্বোধন', threshold: 0.38 },
    { id: 'schedule', label: 'নির্ঘণ্ট', threshold: 0.55 },
    { id: 'cultural', label: 'অনুষ্ঠান', threshold: 0.72 },
    { id: 'gallery', label: 'গ্যালারি', threshold: 0.85 },
    { id: 'bijaya', label: 'নিরঞ্জন', threshold: 0.96 },
  ]

  useEffect(() => {
    const handleScroll = () => {
      const docHeight = document.documentElement.scrollHeight - window.innerHeight
      if (docHeight <= 0) return
      const currentScroll = window.scrollY
      const progress = Math.min(Math.max(currentScroll / docHeight, 0), 1)
      setScrollProgress(progress)

      // Determine active stage
      let idx = 0
      for (let i = stages.length - 1; i >= 0; i--) {
        if (progress >= stages[i].threshold - 0.08) {
          idx = i
          break
        }
      }
      setActiveStageIndex(idx)
    }

    window.addEventListener('scroll', handleScroll, { passive: true })
    handleScroll()
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  return (
    <div className="journey-indicator-wrap" role="region" aria-label="পূজা পরিক্রমা অগ্রগতি">
      <div className="journey-track-container">
        {/* Progress Bar Fill */}
        <div
          className="journey-progress-bar"
          style={{ width: `${Math.round(scrollProgress * 100)}%` }}
        />

        {/* Floating Diya Indicator along the track */}
        <div
          className="journey-diya-cursor"
          style={{ left: `${Math.min(Math.max(scrollProgress * 100, 2), 98)}%` }}
          aria-hidden="true"
        >
          <span className="diya-flame-icon">🪔</span>
        </div>

        {/* Sacred Milestone Nodes */}
        <div className="journey-milestones">
          {stages.map((stage, idx) => (
            <a
              key={stage.id}
              href={`#${stage.id}`}
              className={`journey-milestone-node ${idx <= activeStageIndex ? 'reached' : ''} ${idx === activeStageIndex ? 'active' : ''}`}
              title={stage.label}
              aria-label={`${stage.label} বিভাগে যান`}
            >
              <span className="milestone-dot" />
              <span className="milestone-label">{stage.label}</span>
            </a>
          ))}
        </div>
      </div>
    </div>
  )
}
