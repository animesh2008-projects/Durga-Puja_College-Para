import React, { useState } from 'react'
import TiltCard from './TiltCard'

const POSTERS = [
  {
    id: 'idol-portrait',
    title: 'শ্রী শ্রী মা দুর্গা প্রতিমা স্বরূপ',
    subtitle: 'ডাকের সাজে সপরিবারে আনন্দময়ীর রাজকীয় পুণ্য রূপ',
    src: '/durga-pratima-main.jpg',
  },
  {
    id: 'cover',
    title: 'কলেজ পাড়া সার্বজনীন দুর্গাপূজা',
    subtitle: '২৬তম বর্ষের মূল রঙিন পোস্টার ও দেবী প্রতিমা',
    src: '/poster-cover.jpg',
  },
  {
    id: 'schedule',
    title: 'শ্রী শ্রী শারদীয়া দুর্গাপূজার সময় নির্ঘণ্ট',
    subtitle: 'মহাষষ্ঠী হইতে ত্রয়োদশী ও শুভ উদ্বোধন বিজ্ঞপ্তি',
    src: '/poster-schedule.jpg',
  },
]

export default function PosterGallery3D() {
  const [activePoster, setActivePoster] = useState(null)

  return (
    <section id="gallery" className="gallery-section" aria-labelledby="gallery-title">
      <div className="container">
        <div className="section-header">
          <div className="section-badge">মূল বিজ্ঞপ্তি ও পোস্টার</div>
          <h2 id="gallery-title" className="section-title" style={{ color: 'var(--gold-bright)' }}>
            পূজার মূল বিজ্ঞপ্তি গ্যালারি
          </h2>
          <div className="ornament" aria-hidden="true">✦ ❀ ✦ ❀ ✦</div>
          <p className="section-subtitle">
            আসল মুদ্রিত বিজ্ঞপ্তি ও সময় নির্ঘণ্ট স্পর্শ বা ক্লিক করে বড় আকারে পরিদর্শন করুন
          </p>
        </div>

        <div className="gallery-grid" role="list">
          {POSTERS.map((poster) => (
            <TiltCard
              key={poster.id}
              className="gallery-card"
              intensity={20}
              onClick={() => setActivePoster(poster)}
              role="listitem"
              tabIndex={0}
              onKeyDown={(e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                  e.preventDefault()
                  setActivePoster(poster)
                }
              }}
              aria-label={`${poster.title} - বড় করে দেখার জন্য চাপুন`}
            >
              <div style={{ position: 'relative', overflow: 'hidden' }}>
                <img
                  src={poster.src}
                  alt={poster.title}
                  loading="lazy"
                  style={{
                    width: '100%',
                    height: '380px',
                    objectFit: 'cover',
                    objectPosition: 'top center',
                    display: 'block',
                    transition: 'transform 0.5s ease',
                  }}
                  onError={(e) => {
                    e.currentTarget.style.display = 'none'
                  }}
                />
                <div
                  style={{
                    position: 'absolute',
                    inset: 0,
                    background: 'linear-gradient(to top, rgba(26,3,5,0.95) 0%, transparent 60%)',
                    pointerEvents: 'none',
                  }}
                />
                <div
                  style={{
                    position: 'absolute',
                    top: '1rem',
                    right: '1rem',
                    background: 'rgba(26,3,5,0.7)',
                    backdropFilter: 'blur(6px)',
                    border: '1px solid var(--gold)',
                    borderRadius: '50px',
                    padding: '0.25rem 0.75rem',
                    fontSize: '0.75rem',
                    color: 'var(--gold-bright)',
                  }}
                >
                  🔍 জুম করুন
                </div>
              </div>
              <div className="gallery-label">
                <div style={{ fontSize: '1.05rem', fontWeight: 800 }}>{poster.title}</div>
                <div style={{ fontSize: '0.78rem', color: 'rgba(253,245,230,0.7)', marginTop: '0.25rem' }}>
                  {poster.subtitle}
                </div>
              </div>
            </TiltCard>
          ))}
        </div>

        {/* 3D Lightbox Modal */}
        {activePoster && (
          <div
            className="lightbox"
            onClick={() => setActivePoster(null)}
            role="dialog"
            aria-modal="true"
            aria-label={activePoster.title}
          >
            <div
              style={{ position: 'relative', maxWidth: '90vw', maxHeight: '90vh' }}
              onClick={(e) => e.stopPropagation()}
            >
              <img
                src={activePoster.src}
                alt={activePoster.title}
                style={{
                  maxWidth: '100%',
                  maxHeight: '85vh',
                  objectFit: 'contain',
                  borderRadius: '12px',
                  boxShadow: '0 25px 80px rgba(0,0,0,0.8), 0 0 0 2px var(--gold)',
                }}
              />
              <div
                style={{
                  textAlign: 'center',
                  marginTop: '0.75rem',
                  fontFamily: 'Noto Serif Bengali, serif',
                  color: 'var(--gold-bright)',
                  fontSize: '1.1rem',
                  fontWeight: 700,
                }}
              >
                {activePoster.title}
              </div>
            </div>
            <button
              className="lightbox-close"
              onClick={() => setActivePoster(null)}
              aria-label="বন্ধ করুন"
            >
              ✕
            </button>
          </div>
        )}
      </div>
    </section>
  )
}
