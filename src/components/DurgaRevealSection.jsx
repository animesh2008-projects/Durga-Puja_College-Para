import React, { useRef, useState, useEffect } from 'react'
import { motion, useScroll, useTransform } from 'framer-motion'

/**
 * DurgaRevealSection.jsx
 * -------------------------------------------------------------
 * 3D Sacred Durga Idol Reveal Section:
 * - Starts as a dark mystical silhouette
 * - As the user scrolls:
 *   * Warm golden spotlights slowly reveal the holy Pratima
 *   * Jewellery & golden ornaments catch radiant light
 *   * Smoke & incense drift across the scene
 *   * Text shifts: "মা আসছেন" → "জয় মা দুর্গা"
 *   * Sacred Chandipath Shloka
 * -------------------------------------------------------------
 */
export default function DurgaRevealSection() {
  const containerRef = useRef(null)

  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ['start end', 'end start'],
  })

  // Smooth transforms linked to scroll position
  const lightIntensity = useTransform(scrollYProgress, [0.15, 0.5, 0.85], [0.15, 1, 0.4])
  const haloScale = useTransform(scrollYProgress, [0.15, 0.55], [0.85, 1.15])
  const textPhase = useTransform(scrollYProgress, [0.1, 0.45, 0.7], [0, 1, 2])
  const smokeOpacity = useTransform(scrollYProgress, [0.2, 0.5, 0.8], [0.2, 0.55, 0.25])

  const [currentPhase, setCurrentPhase] = useState(0)

  useEffect(() => {
    return textPhase.on('change', (latest) => {
      if (latest < 0.6) setCurrentPhase(0)
      else if (latest < 1.4) setCurrentPhase(1)
      else setCurrentPhase(2)
    })
  }, [textPhase])

  return (
    <section
      id="durga-reveal"
      ref={containerRef}
      className="durga-reveal-section"
      aria-label="শ্রী শ্রী দুর্গা প্রতিমা দর্শন"
    >
      {/* Background Sanctum Glow */}
      <motion.div
        className="sanctum-ambient-glow"
        style={{ opacity: lightIntensity }}
        aria-hidden="true"
      />

      {/* Drifting Incense Smoke */}
      <motion.div
        className="sanctum-smoke-layer"
        style={{ opacity: smokeOpacity }}
        aria-hidden="true"
      >
        <div className="sanctum-smoke-puff puff-left" />
        <div className="sanctum-smoke-puff puff-right" />
      </motion.div>

      <div className="container sanctum-container">
        {/* Section Decorative Banner */}
        <div className="section-header" style={{ marginBottom: '1.5rem' }}>
          <div className="section-badge">পুণ্য পুজো দর্শন</div>
          <h2 className="section-title" style={{ color: 'var(--gold-bright)' }}>
            আনন্দময়ীর শুভ আবির্ভাব
          </h2>
          <div className="ornament" aria-hidden="true">✦ ❀ ✦ ❀ ✦</div>
        </div>

        {/* 3D Sacred Idol Reveal Centerpiece */}
        <div className="sanctum-stage-wrap">
          {/* Radiating Golden Prabhavali / Halo */}
          <motion.div
            className="sanctum-prabhavali"
            style={{ scale: haloScale, opacity: lightIntensity }}
            aria-hidden="true"
          >
            <div className="prabhavali-rings" />
            <div className="prabhavali-rays" />
          </motion.div>

          {/* Divine Durga Silhouette & Illumination */}
          <motion.div
            className="sanctum-idol-frame"
            style={{
              filter: useTransform(
                lightIntensity,
                (val) => `drop-shadow(0 0 ${val * 35}px rgba(255, 215, 0, ${val * 0.7})) brightness(${0.5 + val * 0.7})`
              ),
            }}
          >
            {/* Sacred 2nd Given Durga Idol Portrait Reveal */}
            <div className="idol-artistic-composition">
              <div className="sanctum-portrait-frame">
                <img
                  src="/durga-pratima-main.jpg"
                  alt="শ্রী শ্রী দুর্গা প্রতিমা"
                  className="sanctum-durga-img"
                />
                <div className="sanctum-portrait-border" />
              </div>
            </div>
          </motion.div>
        </div>

        {/* Emotionally Resonant Text Reveal */}
        <div className="sanctum-text-reveal">
          {currentPhase <= 1 ? (
            <motion.div
              key="phase-1"
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
            >
              <div className="reveal-sacred-subtitle">অপেক্ষার অবসান</div>
              <h3 className="reveal-sacred-title">“মা আসছেন”</h3>
              <p className="reveal-sacred-verse">
                ঢাকের কাঠি পড়ল বলে, শিউলি ঝরে বনে বনে...
              </p>
            </motion.div>
          ) : (
            <motion.div
              key="phase-2"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.8 }}
            >
              <div className="reveal-sacred-subtitle">আনন্দময়ীর জয়গান</div>
              <h3 className="reveal-sacred-title gold-glow">“জয় মা দুর্গা”</h3>
              <p className="reveal-sacred-verse highlight">
                "যা দেবী সর্বভূতেষু শক্তিরূপেণ সংস্থিতা।<br />
                নমস্তস্যৈ নমস্তস্যৈ নমস্তস্যৈ নমো নমঃ॥"
              </p>
            </motion.div>
          )}

          <div className="sanctum-cta-row">
            <a href="#schedule" className="btn-primary">
              🗓 পূজার সম্পূর্ণ সময় নির্ঘণ্ট দেখুন
            </a>
          </div>
        </div>
      </div>
    </section>
  )
}
