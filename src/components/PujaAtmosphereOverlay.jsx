import React from 'react'

/**
 * PujaAtmosphereOverlay.jsx
 * ------------------------------------------------------------------
 * Lightweight, non-intrusive floating Puja festive atmosphere:
 * - Traditional Shiuli flower petals (শিউলি ফুল — white with orange stem)
 * - Hibiscus (রক্তজবা) & Lotus petals
 * - Golden glowing temple sparks & soft incense smoke
 * - Respects prefers-reduced-motion and strictly limits DOM nodes
 * ------------------------------------------------------------------
 */
export default function PujaAtmosphereOverlay() {
  // 12 subtle falling/floating petals distributed evenly across width
  const petals = [
    { type: 'shiuli', left: '8%', delay: '0s', duration: '14s', size: 18 },
    { type: 'lotus', left: '22%', delay: '4s', duration: '18s', size: 22 },
    { type: 'gold', left: '35%', delay: '2s', duration: '12s', size: 10 },
    { type: 'shiuli', left: '48%', delay: '7s', duration: '16s', size: 16 },
    { type: 'jaba', left: '62%', delay: '3s', duration: '15s', size: 20 },
    { type: 'gold', left: '74%', delay: '5s', duration: '11s', size: 12 },
    { type: 'shiuli', left: '86%', delay: '1s', duration: '17s', size: 17 },
    { type: 'lotus', left: '94%', delay: '8s', duration: '19s', size: 24 },
  ]

  return (
    <div className="puja-atmosphere-overlay" aria-hidden="true">
      {petals.map((p, idx) => (
        <span
          key={idx}
          className={`petal-item petal-${p.type}`}
          style={{
            left: p.left,
            animationDelay: p.delay,
            animationDuration: p.duration,
            width: `${p.size}px`,
            height: `${p.size}px`,
          }}
        >
          {p.type === 'shiuli' && (
            <svg viewBox="0 0 24 24" className="shiuli-svg">
              <path
                d="M 12,2 C 14,7 18,9 22,12 C 18,15 14,17 12,22 C 10,17 6,15 2,12 C 6,9 10,7 12,2 Z"
                fill="#FFF9E6"
                opacity="0.9"
              />
              <circle cx="12" cy="12" r="3" fill="#FF6B35" />
            </svg>
          )}

          {p.type === 'lotus' && (
            <svg viewBox="0 0 24 24" className="lotus-svg">
              <path
                d="M 12,2 C 17,8 20,14 18,20 C 14,22 10,22 6,20 C 4,14 7,8 12,2 Z"
                fill="#FFB6C1"
                opacity="0.75"
              />
            </svg>
          )}

          {p.type === 'jaba' && (
            <svg viewBox="0 0 24 24" className="jaba-svg">
              <path
                d="M 12,3 C 18,5 21,11 19,17 C 15,21 9,21 5,17 C 3,11 6,5 12,3 Z"
                fill="#C41E3A"
                opacity="0.8"
              />
            </svg>
          )}

          {p.type === 'gold' && (
            <span className="gold-sparkle-dot" />
          )}
        </span>
      ))}
    </div>
  )
}
