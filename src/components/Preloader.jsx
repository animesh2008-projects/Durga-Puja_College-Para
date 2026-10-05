/**
 * Preloader.jsx — Cinematic loading screen
 * Diya lights up → Bengali loading text → golden sweep reveal
 */
import { useEffect, useState, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'

export default function Preloader({ onComplete }) {
  const [progress, setProgress] = useState(0)
  const [phase, setPhase] = useState('loading') // loading | sweeping | done
  const rafRef = useRef(null)
  const startRef = useRef(null)

  useEffect(() => {
    // Simulate resource loading with an eased progress
    const duration = 2200
    const animate = (timestamp) => {
      if (!startRef.current) startRef.current = timestamp
      const elapsed = timestamp - startRef.current
      const raw = Math.min(elapsed / duration, 1)
      // Ease out quad
      const p = raw < 0.5 ? 2 * raw * raw : -1 + (4 - 2 * raw) * raw
      setProgress(Math.round(p * 100))

      if (raw < 1) {
        rafRef.current = requestAnimationFrame(animate)
      } else {
        // Trigger sweep transition
        setPhase('sweeping')
        setTimeout(() => {
          setPhase('done')
          onComplete?.()
        }, 900)
      }
    }
    rafRef.current = requestAnimationFrame(animate)
    return () => cancelAnimationFrame(rafRef.current)
  }, [onComplete])

  return (
    <AnimatePresence>
      {phase !== 'done' && (
        <motion.div
          className="preloader"
          initial={{ opacity: 1 }}
          exit={{
            opacity: 0,
            scale: 1.04,
            transition: { duration: 0.7, ease: 'easeInOut' },
          }}
          style={{ position: 'fixed', inset: 0, zIndex: 9999, background: '#1A0305' }}
        >
          {/* Golden sweep overlay during exit */}
          <AnimatePresence>
            {phase === 'sweeping' && (
              <motion.div
                initial={{ scaleX: 0, originX: 0 }}
                animate={{ scaleX: 1 }}
                exit={{ scaleX: 0, originX: 1 }}
                transition={{ duration: 0.7, ease: 'easeInOut' }}
                style={{
                  position: 'absolute', inset: 0,
                  background: 'linear-gradient(135deg, #C9941A, #FFD700, #C9941A)',
                  zIndex: 1,
                }}
              />
            )}
          </AnimatePresence>

          {/* Diya */}
          <motion.div
            className="preloader-diya"
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.6, ease: 'backOut' }}
          >
            🪔
          </motion.div>

          {/* Organisation name */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4, duration: 0.5 }}
            style={{
              fontFamily: 'Noto Serif Bengali, serif',
              fontSize: 'clamp(1.1rem,3vw,1.4rem)',
              fontWeight: 900, color: '#FFD700',
              textAlign: 'center', lineHeight: 1.4,
              textShadow: '0 0 20px rgba(255,215,0,0.4)',
            }}
          >
            কলেজ পাড়া সার্বজনীন দুর্গাপূজা
            <div style={{ fontSize: '0.8rem', color: '#E8B84B', fontWeight: 400, marginTop: '0.25rem' }}>
              বর্ষ ২৬তম | পান্ডবেশ্বর, পশ্চিম বর্ধমান
            </div>
          </motion.div>

          {/* Loading text */}
          <motion.div
            className="preloader-text"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.7, duration: 0.5 }}
          >
            মায়ের আগমনের প্রস্তুতি চলছে...
          </motion.div>

          {/* Progress bar */}
          <div className="preloader-bar">
            <motion.div
              className="preloader-bar-fill"
              style={{ width: `${progress}%` }}
            />
          </div>

          {/* Progress number */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 0.6 }}
            transition={{ delay: 0.5 }}
            style={{
              fontFamily: 'Noto Sans Bengali, sans-serif',
              fontSize: '0.78rem', color: '#E8B84B',
            }}
          >
            {progress}%
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
