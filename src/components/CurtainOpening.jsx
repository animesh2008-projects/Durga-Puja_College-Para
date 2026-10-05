import React, { useState, useEffect, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { pujaAudio } from '../utils/pujaAudio'

export default function CurtainOpening({ onComplete, isReplay = false }) {
  const [progress, setProgress] = useState(0)
  const [stage, setStage] = useState('initial') // 'initial' | 'opening' | 'revealed' | 'complete'
  const [audioAllowed, setAudioAllowed] = useState(false)
  const [showInteractionPrompt, setShowInteractionPrompt] = useState(false)
  const [showFinalGreeting, setShowFinalGreeting] = useState(false)

  const curtainOpeningTriggered = useRef(false)
  const rafRef = useRef(null)

  // 1. Initial Loading Progress (smooth 0 to 100% over ~2.4s)
  useEffect(() => {
    let startTimestamp = null
    const duration = isReplay ? 1200 : 2200

    const step = (timestamp) => {
      if (!startTimestamp) startTimestamp = timestamp
      const elapsed = timestamp - startTimestamp
      const raw = Math.min(elapsed / duration, 1)

      // Smooth ease out curve
      const p = Math.round((1 - Math.pow(1 - raw, 3)) * 100)
      setProgress(p)

      if (raw < 1) {
        rafRef.current = requestAnimationFrame(step)
      } else {
        // Check if autoplay works or if user interaction is needed
        handleLoadingComplete()
      }
    }

    rafRef.current = requestAnimationFrame(step)
    return () => cancelAnimationFrame(rafRef.current)
  }, [isReplay])

  // Try autoplay or show fallback button
  const handleLoadingComplete = () => {
    // Attempt gentle autoplay test
    try {
      const audio = pujaAudio.initAudioElement()
      if (audio) {
        const p = audio.play()
        if (p !== undefined) {
          p.then(() => {
            // Autoplay succeeded!
            setAudioAllowed(true)
            startOpeningSequence()
          }).catch(() => {
            // Browser restricted autoplay until user gesture
            setShowInteractionPrompt(true)
          })
          return
        }
      }
    } catch {
      // Fallback to gesture prompt
    }
    setShowInteractionPrompt(true)
  }

  // Trigger opening animation with sound
  const startOpeningSequence = () => {
    if (curtainOpeningTriggered.current) return
    curtainOpeningTriggered.current = true

    setShowInteractionPrompt(false)
    setStage('opening')

    // Start audio immediately during the user gesture / approved context
    try {
      pujaAudio.startOpeningSequence()
      setAudioAllowed(true)
    } catch (e) {
      console.warn('Audio start failed', e)
    }

    // Sequence timing
    // 1.6s: Curtains are wide open, reveal "এসো মা..."
    setTimeout(() => {
      setShowFinalGreeting(true)
    }, 1600)

    // 2.7s: Transition into regular website
    setTimeout(() => {
      setStage('revealed')
    }, 2700)

    // 3.5s: Unmount curtain overlay completely
    setTimeout(() => {
      setStage('complete')
      onComplete?.()
    }, 3500)
  }

  const handleManualEnter = () => {
    startOpeningSequence()
  }

  if (stage === 'complete') return null

  return (
    <div className={`curtain-container stage-${stage}`}>
      {/* 3D Deep Stage Backdrop Glow */}
      <div className="curtain-stage-glow" aria-hidden="true" />

      {/* Floating Golden Particles behind and around curtains */}
      <div className="curtain-particles" aria-hidden="true">
        {Array.from({ length: 24 }).map((_, i) => (
          <span
            key={i}
            className="curtain-particle"
            style={{
              left: `${(i * 19) % 100}%`,
              top: `${(i * 23) % 100}%`,
              animationDelay: `${(i * 0.25) % 3}s`,
              animationDuration: `${3.5 + ((i % 4) * 0.8)}s`,
            }}
          />
        ))}
      </div>

      {/* Light Bloom burst as curtains separate */}
      <div className={`curtain-light-bloom ${stage === 'opening' ? 'active' : ''}`} aria-hidden="true" />

      {/* Subtle Dhunuchi Smoke layer emerging from bottom */}
      <div className={`curtain-dhunuchi-smoke ${stage === 'opening' ? 'active' : ''}`} aria-hidden="true" />

      {/* ================= LEFT LUXURIOUS CURTAIN ================= */}
      <div className={`curtain-side curtain-left ${stage === 'opening' ? 'open-left' : ''}`}>
        <div className="curtain-fabric">
          <div className="curtain-fold-shadows" />
          <div className="curtain-alpona-border" />
          <div className="curtain-valance-fringe" />
          <div className="curtain-golden-motif left" />
        </div>
      </div>

      {/* ================= RIGHT LUXURIOUS CURTAIN ================= */}
      <div className={`curtain-side curtain-right ${stage === 'opening' ? 'open-right' : ''}`}>
        <div className="curtain-fabric">
          <div className="curtain-fold-shadows" />
          <div className="curtain-alpona-border" />
          <div className="curtain-valance-fringe" />
          <div className="curtain-golden-motif right" />
        </div>
      </div>

      {/* ================= CENTER EMBLEM & DETAILS ================= */}
      <div className={`curtain-center-overlay ${stage === 'opening' ? 'fade-out' : ''}`}>
        {/* Ceremonial Durga Emblem (Favicon icon replica) */}
        <div className="curtain-emblem-wrap">
          <div className="curtain-emblem-glow" />
          <div className="curtain-emblem-disc">
            <span className="curtain-emblem-char">শ্রী</span>
          </div>
        </div>

        {/* Headings */}
        <div className="curtain-title-group">
          <div className="curtain-subhead">শ্রী শ্রী</div>
          <h1 className="curtain-mainhead">শারদীয়া দুর্গাপূজা</h1>
          <div className="curtain-orghead">
            কলেজ পাড়া সার্বজনীন • বর্ষ ২৬তম
          </div>
          <div className="curtain-ornament" aria-hidden="true">✦ ❀ ✦ ❀ ✦</div>
        </div>

        {/* Loading Progress or Fallback Enter CTA */}
        {!showInteractionPrompt ? (
          <div className="curtain-loader-box">
            <div className="curtain-loader-text">
              মায়ের আগমনের প্রস্তুতি চলছে...
            </div>
            <div className="curtain-progress-bar-wrap">
              <div
                className="curtain-progress-bar-fill"
                style={{ width: `${progress}%` }}
              />
            </div>
            <div className="curtain-progress-num">
              {progress}%
            </div>
          </div>
        ) : (
          <motion.div
            className="curtain-enter-box"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5 }}
          >
            <button
              className="curtain-enter-btn"
              onClick={handleManualEnter}
              aria-label="পূজা মণ্ডপের পর্দা খুলুন"
            >
              <span className="btn-icon">🪔</span>
              <span className="btn-text">পর্দা খুলুন • প্রবেশ করুন</span>
              <span className="btn-icon">✨</span>
            </button>
            <div className="curtain-enter-subtext">
              স্পর্শ করলেই ঢাকের বাদ্য ও শঙ্খধ্বনিতে পর্দা উন্মোচিত হবে
            </div>
          </motion.div>
        )}
      </div>

      {/* Emotional Sacred Greeting ("এসো মা...") right after curtain parting */}
      <AnimatePresence>
        {showFinalGreeting && stage === 'opening' && (
          <motion.div
            className="curtain-greeting-overlay"
            initial={{ opacity: 0, scale: 0.85, y: 15 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 1.1 }}
            transition={{ duration: 0.7, ease: 'easeOut' }}
          >
            <div className="greeting-text">এসো মা...</div>
            <div className="greeting-sub">আনন্দময়ীর শুভ আবির্ভাব</div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
