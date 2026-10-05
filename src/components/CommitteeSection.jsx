import React from 'react'
import { motion } from 'framer-motion'
import { CORE_COMMITTEE } from '../data/pujaData'
import TiltCard from './TiltCard'

// Elegant ceremonial motifs for each member
const EMBLEMS = ['🌺', '🪔', '🔱', '🌸', '🌼', '🔔', '✨', '🙏', '🌿']

// Framer Motion staggered container animation
const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.12,
      delayChildren: 0.25,
    },
  },
}

const cardVariants = {
  hidden: {
    opacity: 0,
    y: 40,
    scale: 0.94,
  },
  visible: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: {
      duration: 0.7,
      ease: [0.25, 0.46, 0.45, 0.94],
    },
  },
}

export default function CommitteeSection() {
  return (
    <section id="committee" className="committee-section" aria-labelledby="committee-heading">
      {/* Subtle traditional Durga emblem background watermark */}
      <div className="committee-bg-emblem" aria-hidden="true">
        🔱
      </div>

      <div className="container">
        {/* Section Header with Reveal */}
        <motion.div
          className="section-header"
          initial={{ opacity: 0, y: 25 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-60px' }}
          transition={{ duration: 0.8, ease: 'easeOut' }}
        >
          <div className="section-badge">পূজা পরিচালনা ও সমন্বয়</div>
          <h2 id="committee-heading" className="section-title" style={{ color: 'var(--gold-bright)' }}>
            মূল কমিটি সদস্যবৃন্দ
          </h2>
          <div className="section-subtitle" style={{ color: 'var(--gold-light)', fontWeight: 600 }}>
            শ্রী শ্রী শারদীয়া দুর্গাপূজার মূল কমিটি
          </div>

          {/* Animated drawing golden line */}
          <motion.div
            className="ornament"
            aria-hidden="true"
            initial={{ scaleX: 0 }}
            whileInView={{ scaleX: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.9, delay: 0.2, ease: 'easeInOut' }}
            style={{ transformOrigin: 'center' }}
          >
            ✦ ❀ ✦ ❀ ✦
          </motion.div>
        </motion.div>

        {/* Committee Introduction */}
        <motion.p
          className="committee-intro-text"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.75, delay: 0.3 }}
        >
          "মায়ের পূজার আয়োজন, পরিচালনা ও উৎসবের সকল কর্মকাণ্ডে
          যাঁরা আন্তরিকভাবে যুক্ত রয়েছেন, তাঁদের প্রতি শ্রদ্ধা ও কৃতজ্ঞতা।"
        </motion.p>

        {/* 3x3 Staggered Animated Member Grid */}
        <motion.div
          className="committee-grid"
          role="list"
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: '-40px' }}
        >
          {CORE_COMMITTEE.map((member, index) => {
            const emblem = EMBLEMS[index % EMBLEMS.length]
            return (
              <motion.div key={member.id} variants={cardVariants} role="listitem">
                <TiltCard className="member-card-3d" intensity={15}>
                  {/* Decorative corner alpona elements */}
                  <span className="member-corner-alpona tl" aria-hidden="true">✦</span>
                  <span className="member-corner-alpona tr" aria-hidden="true">✦</span>

                  {/* Elegant Number badge */}
                  <div>
                    <span className="member-number-badge">
                      <span aria-hidden="true">✦</span>
                      <span>{member.id}</span>
                      <span style={{ opacity: 0.65, fontSize: '0.72rem' }}>({member.numBn})</span>
                    </span>
                  </div>

                  {/* Emblem / Devotional Icon */}
                  <div className="member-emblem-wrap" aria-hidden="true">
                    <span>{emblem}</span>
                  </div>

                  {/* Member Name formatted exactly as provided */}
                  <h3 className="member-name-heading">
                    {member.name}
                  </h3>

                  {/* Subtle accent line */}
                  <div className="member-accent-line" aria-hidden="true"></div>
                </TiltCard>
              </motion.div>
            )
          })}
        </motion.div>
      </div>
    </section>
  )
}
