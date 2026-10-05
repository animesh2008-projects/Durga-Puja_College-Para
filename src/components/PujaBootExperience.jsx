import React, { useState, useEffect, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { pujaAudio } from '../utils/pujaAudio'

/**
 * PujaBootExperience.jsx
 * -------------------------------------------------------------
 * Cinematic Durga Puja Opening Experience:
 * 1. Deep dark screen
 * 2. Subtle shankhadhwani atmosphere begins
 * 3. Soft golden particles and incense smoke drift up
 * 4. A warm pradip flame gradually illuminates the center
 * 5. Traditional dhak rhythm begins softly
 * 6. Golden glow expands from the center
 * 7. Bengali alpana patterns appear around the edges
 * 8. Silhouette & third eye of Maa Durga becomes visible
 * 9. Typography: "শ্রী শ্রী শারদীয়া দুর্গাপূজা"
 * 10. Display: "শুভাগমন"
 * 11. Seamless transition into the main website (~5.2s)
 * -------------------------------------------------------------
 */
export default function PujaBootExperience({ onComplete, isReplay = false }) {
  // Steps: 0: dark, 1: smoke/particles, 2: pradip flame, 3: golden aura & dhak,
  // 4: alpana borders, 5: maa durga silhouette, 6: typography & shuvagaman, 7: reveal/exit
  const [step, setStep] = useState(0)
  const [isTransitioningOut, setIsTransitioningOut] = useState(false)
  const [soundEnabled, setSoundEnabled] = useState(false)
  const timeoutsRef = useRef([])

  // Subscribe to pujaAudio state
  useEffect(() => {
    const unsubscribe = pujaAudio.subscribe((playing) => {
      setSoundEnabled(playing)
    })
    return () => unsubscribe()
  }, [])

  useEffect(() => {
    const isMuted = localStorage.getItem('durga_puja_sound_pref') === 'muted'

    // Automatically trigger audio playback on initial boot
    if (!isMuted) {
      try {
        pujaAudio.play(true)
      } catch (e) {
        console.warn('Audio initial boot trigger', e)
      }
    }

    const t = (fn, delay) => {
      const id = setTimeout(fn, delay)
      timeoutsRef.current.push(id)
    }

    // Choreographed sequence (Total duration: ~5.2 seconds)
    // 0.4s: Smoke and particles start drifting
    t(() => setStep(1), 400)

    // 1.1s: Pradip flame lights up - reinforce audio playback
    t(() => {
      setStep(2)
      if (!isMuted && !pujaAudio.isPlaying) {
        try {
          pujaAudio.play(true)
        } catch {
          // Handled by auto-unlock
        }
      }
    }, 1100)

    // 1.9s: Dhak rhythm & expanding golden glow
    t(() => setStep(3), 1900)

    // 2.7s: Decorative Bengali Alpana draws along edges
    t(() => setStep(4), 2700)

    // 3.4s: Silhouette of Maa Durga emerges
    t(() => setStep(5), 3400)

    // 4.1s: Typography "শ্রী শ্রী শারদীয়া দুর্গাপূজা" & "শুভাগমন"
    t(() => setStep(6), 4100)

    // 5.6s: Automatic transition into main website with sound enabled
    t(() => handleEnter(true), 5600)

    return () => {
      timeoutsRef.current.forEach(clearTimeout)
    }
  }, [isReplay])

  const handleEnter = (withAudioTrigger = true) => {
    if (isTransitioningOut) return
    setIsTransitioningOut(true)

    // Ensure audio starts seamlessly unless user explicitly chose muted
    if (withAudioTrigger && localStorage.getItem('durga_puja_sound_pref') !== 'muted') {
      try {
        pujaAudio.play(true)
      } catch (e) {
        console.warn('Audio trigger error', e)
      }
    }

    setTimeout(() => {
      onComplete?.()
    }, 850)
  }

  const handleContainerInteraction = () => {
    if (!pujaAudio.isPlaying && localStorage.getItem('durga_puja_sound_pref') !== 'muted') {
      pujaAudio.play(true)
    }
  }

  return (
    <div
      className={`puja-boot-container ${isTransitioningOut ? 'boot-fade-out' : ''}`}
      role="dialog"
      aria-modal="true"
      aria-label="শ্রী শ্রী শারদীয়া দুর্গাপূজা শুভাগমন"
      onClick={handleContainerInteraction}
      onTouchStart={handleContainerInteraction}
    >
      {/* Background Deep Midnight Temple Atmosphere */}
      <div className="boot-backdrop" />

      {/* Distant Illuminated Durga Puja Pandal Silhouette */}
      <div className={`boot-pandal-silhouette ${step >= 2 ? 'visible' : ''}`} aria-hidden="true">
        <img
          src="/pandal-grand.jpg"
          alt=""
          className="boot-pandal-img"
        />
        <div className="boot-pandal-overlay" />
      </div>

      {/* Floating Incense Smoke (ধূপের ধোঁয়া) & Golden Embers */}
      <div className={`boot-smoke-layer ${step >= 1 ? 'visible' : ''}`} aria-hidden="true">
        <div className="boot-smoke-puff puff-1" />
        <div className="boot-smoke-puff puff-2" />
        <div className="boot-smoke-puff puff-3" />
      </div>

      <div className={`boot-particles-layer ${step >= 1 ? 'visible' : ''}`} aria-hidden="true">
        {Array.from({ length: 20 }).map((_, i) => (
          <span
            key={i}
            className="boot-particle"
            style={{
              left: `${(i * 17) % 100}%`,
              top: `${(i * 29) % 100}%`,
              animationDelay: `${(i * 0.2) % 3}s`,
              animationDuration: `${3.2 + (i % 3) * 0.8}s`,
            }}
          />
        ))}
      </div>

      {/* Golden Radial Expanding Glow */}
      <div className={`boot-golden-glow ${step >= 3 ? 'expanded' : ''}`} aria-hidden="true" />

      {/* Decorative Bengali Alpana Patterns on Edges */}
      <div className={`boot-alpana-frame ${step >= 4 ? 'drawn' : ''}`} aria-hidden="true">
        {/* Top left alpana corner */}
        <svg className="boot-alpana-corner tl" viewBox="0 0 100 100">
          <path
            d="M 10,10 Q 50,15 50,50 Q 15,50 10,10 Z M 25,25 Q 60,30 60,60 Q 30,60 25,25 Z M 0,0 L 90,0 Q 45,45 0,90 Z"
            fill="none"
            stroke="var(--gold-bright)"
            strokeWidth="2"
            opacity="0.8"
          />
          <circle cx="20" cy="20" r="3" fill="var(--gold-bright)" />
          <circle cx="35" cy="35" r="2.5" fill="var(--gold)" />
        </svg>

        {/* Top right alpana corner */}
        <svg className="boot-alpana-corner tr" viewBox="0 0 100 100">
          <path
            d="M 90,10 Q 50,15 50,50 Q 85,50 90,10 Z M 75,25 Q 40,30 40,60 Q 70,60 75,25 Z M 100,0 L 10,0 Q 55,45 100,90 Z"
            fill="none"
            stroke="var(--gold-bright)"
            strokeWidth="2"
            opacity="0.8"
          />
          <circle cx="80" cy="20" r="3" fill="var(--gold-bright)" />
          <circle cx="65" cy="35" r="2.5" fill="var(--gold)" />
        </svg>

        {/* Bottom left alpana corner */}
        <svg className="boot-alpana-corner bl" viewBox="0 0 100 100">
          <path
            d="M 10,90 Q 50,85 50,50 Q 15,50 10,90 Z M 25,75 Q 60,70 60,40 Q 30,40 25,75 Z M 0,100 L 90,100 Q 45,55 0,10 Z"
            fill="none"
            stroke="var(--gold-bright)"
            strokeWidth="2"
            opacity="0.8"
          />
          <circle cx="20" cy="80" r="3" fill="var(--gold-bright)" />
        </svg>

        {/* Bottom right alpana corner */}
        <svg className="boot-alpana-corner br" viewBox="0 0 100 100">
          <path
            d="M 90,90 Q 50,85 50,50 Q 85,50 90,90 Z M 75,75 Q 40,70 40,40 Q 70,40 75,75 Z M 100,100 L 10,100 Q 55,55 100,10 Z"
            fill="none"
            stroke="var(--gold-bright)"
            strokeWidth="2"
            opacity="0.8"
          />
          <circle cx="80" cy="80" r="3" fill="var(--gold-bright)" />
        </svg>

        {/* Top and Bottom Decorative Lines */}
        <div className="boot-alpana-line top" />
        <div className="boot-alpana-line bottom" />
      </div>

      {/* Centerpiece: Sacred Maa Durga Reveal with 2nd Given Logo */}
      <div className={`boot-durga-silhouette ${step >= 5 ? 'visible' : ''}`} aria-hidden="true">
        <div className="boot-durga-portrait-frame">
          <div className="boot-portrait-glow" />
          <img
            src="/durga-pratima-main.jpg"
            alt="শ্রী শ্রী মা দুর্গা"
            className="boot-durga-portrait-img"
          />
        </div>
      </div>

      {/* Living Pradip / Diya Flame */}
      <div className={`boot-pradip-wrap ${step >= 2 ? 'ignited' : ''}`}>
        <div className="boot-pradip-glow" />
        <div className="boot-pradip-flame">
          <div className="flame-core" />
          <div className="flame-outer" />
        </div>
        <div className="boot-pradip-bowl" />
      </div>

      {/* Sacred Bengali Typography */}
      <div className={`boot-content ${step >= 6 ? 'visible' : ''}`}>
        <div className="boot-shree">শ্রী শ্রী</div>
        <h1 className="boot-title">শারদীয়া দুর্গাপূজা</h1>
        <div className="boot-shuvagaman">শুভাগমন</div>
        <div className="boot-pandal-name">
          কলেজ পাড়া সার্বজনীন • বর্ষ ২৬তম
        </div>
        <div className="boot-ornament">✦ ❀ ✦ ❀ ✦</div>

        {/* Subtle "প্রবেশ করুন / Enter Puja" CTA Button */}
        <div className="boot-cta-box">
          <button
            className="boot-enter-btn"
            onClick={() => handleEnter(true)}
            aria-label="মণ্ডপে প্রবেশ করুন"
          >
            <span className="btn-icon">🪔</span>
            <span className="btn-text">মণ্ডপে প্রবেশ করুন • Enter Pandal</span>
            <span className="btn-icon">✨</span>
          </button>
          <div className="boot-auto-hint">
            শঙ্খ ও ঢাকের পবিত্র সুরে মণ্ডপ উন্মোচিত হচ্ছে...
          </div>
        </div>
      </div>
    </div>
  )
}
