import React from 'react'
import { motion } from 'framer-motion'
import { ORG } from '../data/pujaData'
import TiltCard from './TiltCard'

/**
 * FinalImmersionSection.jsx
 * ------------------------------------------------------------------
 * Sacred Immersion (প্রতিমা নিরঞ্জন) & Farewell Scene:
 * - Environment darkens into peaceful sacred twilight by the river ghat
 * - Golden earthen lamps float across water ripples
 * - Durga idol becomes a distant, gentle silhouette
 * - Preserves complete Bijaya Dashami schedule & timings exactly
 * - Emotional sacred message: “আবার এসো মা...” → “শুভ বিজয়া”
 * ------------------------------------------------------------------
 */
export default function FinalImmersionSection({ onReplay }) {
  return (
    <section id="bijaya" className="immersion-section" aria-label="বিসর্জন ও শুভ বিজয়া">
      {/* Twilight Water Ripples & Floating River Diyas */}
      <div className="immersion-river-backdrop" aria-hidden="true">
        <div className="river-water-waves" />
        <div className="river-floating-diyas">
          {Array.from({ length: 8 }).map((_, i) => (
            <span
              key={i}
              className="river-diya"
              style={{
                left: `${10 + i * 11}%`,
                bottom: `${15 + (i % 3) * 12}%`,
                animationDelay: `${i * 1.1}s`,
                animationDuration: `${7 + (i % 4) * 2}s`,
              }}
            >
              🪔
            </span>
          ))}
        </div>
      </div>

      <div className="container immersion-container">
        {/* Section Header */}
        <div className="section-header">
          <div className="section-badge">বিদায় বেলা ও পুণ্য নিরঞ্জন</div>
          <h2 className="section-title" style={{ color: 'var(--gold-bright)' }}>
            বিজয়া দশমী ও প্রতিমা নিরঞ্জন
          </h2>
          <div className="ornament" aria-hidden="true">✦ ❀ ✦ ❀ ✦</div>
        </div>

        {/* Bijaya Dashami Schedule Details - Preserved Exactly */}
        <TiltCard className="bijaya-schedule" intensity={10}>
          <div className="bijaya-sched-title">
            ৩রা কার্তিক ১৪৩৩ সন (২১-১০-২৬, বুধবার) • মহাদশমী দিবা ১০.৪৭ মিঃ পর্যন্ত
          </div>
          <ul className="bijaya-list">
            <li className="bijaya-item">
              <span>🌅</span> সকাল ৬.০০টায় দশমী পূজা শুরু ও অঞ্জলি প্রদান
            </li>
            <li className="bijaya-item">
              <span>🌸</span> যাত্রাবন্ধন ও পুষ্পাঞ্জলি সমাপন
            </li>
            <li className="bijaya-item">
              <span>🍱</span> দেবীর ভোগ নিবেদন ও দোলা বিসর্জন
            </li>
            <li className="bijaya-item">
              <span>⛵</span> দেবীর নৌকায় গমন ও বিদায় লগ্ন
            </li>
            <li className="bijaya-item">
              <span>🌊</span> ত্রয়োদশী (২৪-১০-২০২৬, শনিবার) — শোভাযাত্রা সহকারে প্রতিমা নিরঞ্জন
            </li>
          </ul>
        </TiltCard>

        {/* Distant Holy Silhouette of Maa Durga */}
        <motion.div
          className="immersion-distant-idol"
          initial={{ opacity: 0, scale: 0.9 }}
          whileInView={{ opacity: 0.85, scale: 1 }}
          viewport={{ once: false, amount: 0.3 }}
          transition={{ duration: 1.6 }}
          aria-hidden="true"
        >
          <div className="distant-halo" />
          <div className="immersion-portrait-frame">
            <img
              src="/durga-pratima-main.jpg"
              alt="মা দুর্গার বিদায় লগ্ন"
              className="immersion-durga-portrait"
            />
          </div>
        </motion.div>

        {/* Sacred Bengali Words */}
        <motion.div
          className="immersion-content"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: false, amount: 0.4 }}
          transition={{ duration: 1.2, delay: 0.3 }}
        >
          <div className="immersion-ashirbad-badge">✦ বিজয়ার পুণ্য নিবেদন ✦</div>

          <h2 className="immersion-farewell-text">
            “আবার এসো মা...”
          </h2>

          <div className="immersion-bijaya-heading">
            শুভ বিজয়া
          </div>

          <p className="immersion-message">
            "মা আসেন, আনন্দে ভরিয়ে দেন, আবার ফিরে যান...<br />
            তবুও অন্তরে অনন্তকাল রয়ে যায় তাঁর স্নেহাশীর্বাদ।"<br /><br />
            আসছে বছর আবার হবে... মাকে বিদায় জানানোর এই পুণ্যলগ্নে সকলকে জানাই শারদ প্রীতি, শুভেচ্ছা ও আন্তরিক অভিনন্দন। গুরুজনদের প্রণাম এবং ছোটদের ভালোবাসা।
          </p>

          <div className="immersion-ornament" aria-hidden="true">
            ✦ ❀ ✦ ❀ ✦
          </div>

          <div className="immersion-org-sign">
            {ORG.name} • {ORG.location}
          </div>

          <div className="immersion-actions">
            <button
              className="btn-replay-journey"
              onClick={onReplay}
              aria-label="পূজা পরিক্রমা পুনরায় শুরু করুন"
            >
              <span>🪔</span>
              <span>পূজা পরিক্রমা পুনরায় শুরু করুন</span>
              <span>✨</span>
            </button>
            <a href="#home" className="btn-back-top">
              ↑ মণ্ডপ প্রাঙ্গণে ফিরুন
            </a>
          </div>
        </motion.div>
      </div>
    </section>
  )
}
