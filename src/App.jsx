import React, { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { ORG, INAUGURATION, CULTURAL_PROGRAMS } from './data/pujaData'
import AtmosphereCanvas, { scrollState } from './components/AtmosphereCanvas'
import PujaBootExperience from './components/PujaBootExperience'
import PujaAtmosphereOverlay from './components/PujaAtmosphereOverlay'
import ScrollJourneyIndicator from './components/ScrollJourneyIndicator'
import DurgaRevealSection from './components/DurgaRevealSection'
import AlpanaTransition from './components/AlpanaTransition'
import ScheduleSection from './components/ScheduleSection'
import FinalImmersionSection from './components/FinalImmersionSection'
import TiltCard from './components/TiltCard'
import Invitation3D from './components/Invitation3D'
import PosterGallery3D from './components/PosterGallery3D'
import CommitteeSection from './components/CommitteeSection'
import DeveloperCredit from './components/DeveloperCredit'
import { pujaAudio } from './utils/pujaAudio'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

gsap.registerPlugin(ScrollTrigger)

export default function App() {
  // Show cinematic Puja Boot Experience on every initial load
  const [showBootExperience, setShowBootExperience] = useState(true)
  const [isReplaying, setIsReplaying] = useState(false)
  const [scrolled, setScrolled] = useState(false)
  const [menuOpen, setMenuOpen] = useState(false)
  const [mouseOffset, setMouseOffset] = useState({ x: 0, y: 0 })

  // Sound preference state synced with localStorage (enabled by default unless explicitly muted)
  const [soundEnabled, setSoundEnabled] = useState(() => {
    return localStorage.getItem('durga_puja_sound_pref') !== 'muted'
  })

  // Sync with pujaAudio events and bind interaction unlock
  useEffect(() => {
    const unsubscribe = pujaAudio.subscribe((playing) => {
      setSoundEnabled(playing)
    })

    if (localStorage.getItem('durga_puja_sound_pref') !== 'muted') {
      pujaAudio.bindAutoUnlock()
    }

    return () => {
      unsubscribe()
    }
  }, [])

  // Countdown State
  const [countdown, setCountdown] = useState({ d: 0, h: 0, m: 0, s: 0, status: 'before' })

  // Mouse Parallax listener
  useEffect(() => {
    const handleMouseMove = (e) => {
      const x = (e.clientX / window.innerWidth) * 2 - 1
      const y = -(e.clientY / window.innerHeight) * 2 + 1
      scrollState.mouse.x = x
      scrollState.mouse.y = y
      setMouseOffset({ x, y })
    }

    window.addEventListener('mousemove', handleMouseMove)
    return () => window.removeEventListener('mousemove', handleMouseMove)
  }, [])

  // GSAP ScrollTrigger for persistent camera choreography
  useEffect(() => {
    const onScroll = () => {
      setScrolled(window.scrollY > 60)
    }
    window.addEventListener('scroll', onScroll)

    const st = ScrollTrigger.create({
      start: 0,
      end: 'max',
      onUpdate: (self) => {
        scrollState.progress = self.progress
      },
    })

    return () => {
      window.removeEventListener('scroll', onScroll)
      st.kill()
    }
  }, [])

  // Countdown timer calculation
  useEffect(() => {
    const calculateTime = () => {
      const now = new Date()
      const start = ORG.pujaStartDate
      const end = ORG.pujaEndDate

      if (now < start) {
        const diff = start - now
        setCountdown({
          d: Math.floor(diff / (1000 * 60 * 60 * 24)),
          h: Math.floor((diff / (1000 * 60 * 60)) % 24),
          m: Math.floor((diff / 1000 / 60) % 60),
          s: Math.floor((diff / 1000) % 60),
          status: 'before',
        })
      } else if (now >= start && now <= end) {
        setCountdown((prev) => ({ ...prev, status: 'ongoing' }))
      } else {
        setCountdown((prev) => ({ ...prev, status: 'ended' }))
      }
    }

    calculateTime()
    const timer = setInterval(calculateTime, 1000)
    return () => clearInterval(timer)
  }, [])

  // Ambient sound toggle with local storage persistence
  const toggleSound = () => {
    if (soundEnabled || pujaAudio.isPlaying) {
      pujaAudio.stop()
      setSoundEnabled(false)
      localStorage.setItem('durga_puja_sound_pref', 'muted')
    } else {
      localStorage.setItem('durga_puja_sound_pref', 'enabled')
      pujaAudio.play(false)
      setSoundEnabled(true)
    }
  }

  // Handle boot experience completion
  const handleBootComplete = () => {
    setShowBootExperience(false)
    setIsReplaying(false)
    setSoundEnabled(pujaAudio.isPlaying)
  }

  // Allow replaying opening boot experience from footer
  const handleReplayBootExperience = () => {
    setIsReplaying(true)
    setShowBootExperience(true)
  }

  // Navigation Items matching the exact requirement:
  // হোম | পূজা সূচি | উদ্বোধন | অনুষ্ঠান | গ্যালারি | আমাদের সম্পর্কে | যোগাযোগ
  const navLinks = [
    { href: '#home', label: 'হোম' },
    { href: '#schedule', label: 'পূজা সূচি' },
    { href: '#inauguration', label: 'উদ্বোধন' },
    { href: '#cultural', label: 'অনুষ্ঠান' },
    { href: '#gallery', label: 'গ্যালারি' },
    { href: '#committee', label: 'আমাদের সম্পর্কে' },
    { href: '#organizer', label: 'যোগাযোগ' },
  ]

  return (
    <>
      {/* 1. Cinematic Puja Boot Experience (11-step Pandal entry) */}
      {showBootExperience && (
        <PujaBootExperience
          onComplete={handleBootComplete}
          isReplay={isReplaying}
        />
      )}

      {/* 2. Persistent 3D WebGL Atmosphere */}
      <AtmosphereCanvas />

      {/* 3. Floating Shiuli Flower Petals & Golden Embers */}
      <PujaAtmosphereOverlay />

      {/* 4. Virtual Diya Scroll Journey Tracker */}
      <ScrollJourneyIndicator />

      {/* 5. Sticky Responsive Nav styled like a royal invitation */}
      <nav className={`navbar ${scrolled ? 'scrolled' : ''}`} role="navigation" aria-label="মূল নেভিগেশন">
        <a href="#home" className="navbar-brand" aria-label="হোম পেজে ফিরুন">
          <div className="navbar-logo" aria-hidden="true">
            <img
              src="/durga-pratima-main.jpg"
              alt="মা দুর্গা লোগো"
              className="navbar-durga-thumb"
            />
          </div>
          <div className="navbar-title">
            কলেজ পাড়া সার্বজনীন
            <small>দুর্গাপূজা • পান্ডবেশ্বর</small>
          </div>
        </a>

        <ul className="navbar-nav">
          {navLinks.map((link) => (
            <li key={link.href}>
              <a href={link.href}>{link.label}</a>
            </li>
          ))}
        </ul>

        {/* Prominent Sound Control Button with localStorage persistence */}
        <button
          className="nav-sound-btn"
          onClick={toggleSound}
          aria-label={soundEnabled ? 'পূজা আবহ সংগীত বন্ধ করুন' : 'পূজা আবহ সংগীত চালু করুন'}
          title={soundEnabled ? 'আবহ সংগীত বন্ধ করুন' : 'আবহ সংগীত চালু করুন'}
        >
          <span className="sound-icon">{soundEnabled ? '🔊' : '🔈'}</span>
          <span className="sound-text">Puja Sound</span>
          {soundEnabled && <span className="sound-wave-badge" aria-hidden="true">♪</span>}
        </button>

        <button
          className={`hamburger ${menuOpen ? 'open' : ''}`}
          onClick={() => setMenuOpen(!menuOpen)}
          aria-label={menuOpen ? 'মেনু বন্ধ করুন' : 'মেনু খুলুন'}
        >
          <span></span>
          <span></span>
          <span></span>
        </button>
      </nav>

      {/* Mobile Drawer */}
      <div className={`mobile-menu ${menuOpen ? 'open' : ''}`} role="dialog" aria-modal="true">
        {navLinks.map((link) => (
          <a
            key={link.href}
            href={link.href}
            onClick={() => setMenuOpen(false)}
          >
            {link.label}
          </a>
        ))}

        <div style={{ padding: '1rem 0' }}>
          <button
            className="nav-sound-btn"
            onClick={toggleSound}
            style={{ margin: '0 auto', fontSize: '0.9rem', padding: '0.5rem 1.2rem' }}
          >
            <span>{soundEnabled ? '🔊' : '🔈'}</span>
            <span>Puja Sound: {soundEnabled ? 'চালু' : 'বন্ধ'}</span>
          </button>
        </div>

        <div style={{ marginTop: '1.5rem', color: 'var(--gold-bright)', fontSize: '0.9rem' }}>
          {ORG.year} • {ORG.location}
        </div>
      </div>

      <div className="content-layer">
        {/* ===================== HERO SECTION (3D MULTI-PLANE) ===================== */}
        <section id="home" className="hero-section hero-3d-wrapper" aria-label="মায়ের আগমন">
          {/* Background Plane: Grand Illuminated Pandal with Vignette */}
          <div
            className="hero-bg-plane"
            style={{
              transform: `translate3d(${-mouseOffset.x * 14}px, ${-mouseOffset.y * 14}px, 0)`,
            }}
            aria-hidden="true"
          >
            <img
              src="/pandal-grand.jpg"
              alt="Illuminated Grand Durga Puja Pandal"
              className="hero-pandal-bg-img"
            />
            <div className="hero-bg-vignette" />
          </div>

          <div className="hero-pandal-arch" aria-hidden="true" />

          {/* Middle Plane: Hero Typography, Centerpiece, CTAs */}
          <motion.div
            className="hero-content hero-mid-plane"
            style={{
              transform: `translate3d(${mouseOffset.x * 8}px, ${mouseOffset.y * 8}px, 0)`,
            }}
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1.2, delay: 0.2 }}
          >
            <div className="hero-badges-row">
              <span className="festive-badge gold">✦ {ORG.year} ✦</span>
              <span className="festive-badge crimson">🌺 শুভ শারদীয়া 🌺</span>
              <span className="festive-badge gold">🔱 জয় মা দুর্গা 🔱</span>
            </div>

            <div className="hero-tagline">পান্ডবেশ্বর কলেজ পাড়া অধিবাসীবৃন্দ পরিচালিত</div>

            {/* Magnificent Maa Durga Centerpiece Portrait */}
            <div className="hero-durga-centerpiece" aria-hidden="true">
              <div className="durga-halo-glow" />
              <div className="durga-portrait-disc">
                <img
                  src="/durga-pratima-main.jpg"
                  alt="শ্রী শ্রী মা দুর্গা"
                  className="hero-durga-portrait-img"
                />
                <div className="durga-disc-border" />
              </div>
            </div>

            <h1 className="hero-title">শ্রী শ্রী শারদীয়া দুর্গাপূজা</h1>
            <div className="hero-subtitle">মা আসছেন... আবারও ভরে উঠুক চারদিক আনন্দ, ভক্তি ও উৎসবের আলোয়</div>
            <div className="hero-location">{ORG.location}</div>

            <div className="hero-divider" aria-hidden="true"></div>

            <div className="hero-shloka">
              "যা দেবী সর্বভূতেষু মাতৃরূপেণ সংস্থিতা।<br />
              নমস্তস্যৈ নমস্তস্যৈ নমস্তস্যৈ নমো নমঃ॥"
            </div>

            <div className="hero-verse">
              "ঢাকের রোলে বাঁশীর সুরে মোরা গীত গায় আজিকায়<br />
              বিশ্বজননী আসছে আঙিনায়—"
            </div>

            <div className="hero-cta-group">
              <a href="#durga-reveal" className="btn-primary">
                🪔 দেবীদর্শন ও পুজো দর্শন
              </a>
              <a href="#schedule" className="btn-secondary">
                🗓 পূজার সময়সূচি দেখুন
              </a>
              <a href="#inauguration" className="btn-tertiary">
                ✨ শুভ উদ্বোধন
              </a>
            </div>
          </motion.div>

          {/* Foreground Plane: Floating Diyas */}
          <div
            className="hero-fg-plane"
            style={{
              transform: `translate3d(${mouseOffset.x * 18}px, ${mouseOffset.y * 18}px, 0)`,
            }}
            aria-hidden="true"
          >
            <div className="fg-floating-diya fg-diya-left">🪔</div>
            <div className="fg-floating-diya fg-diya-right">🪔</div>
          </div>

          <div className="scroll-cue" aria-hidden="true">
            <span>নিচে স্ক্রল করে মণ্ডপে প্রবেশ করুন</span>
            <div className="scroll-chevron"></div>
          </div>
        </section>

        {/* ===================== COUNTDOWN SECTION ===================== */}
        <div className="countdown-wrap">
          <div className="container">
            {countdown.status === 'before' && (
              <>
                <div className="countdown-badge">✦ শুভ আগমনের পুণ্য লগ্ন ✦</div>
                <div className="countdown-label">মায়ের আগমনের অপেক্ষায়</div>
                <div className="countdown-grid">
                  <div className="countdown-unit">
                    <div className="countdown-num">{String(countdown.d).padStart(2, '0')}</div>
                    <div className="countdown-lbl">দিন</div>
                  </div>
                  <div className="countdown-unit">
                    <div className="countdown-num">{String(countdown.h).padStart(2, '0')}</div>
                    <div className="countdown-lbl">ঘণ্টা</div>
                  </div>
                  <div className="countdown-unit">
                    <div className="countdown-num">{String(countdown.m).padStart(2, '0')}</div>
                    <div className="countdown-lbl">মিনিট</div>
                  </div>
                  <div className="countdown-unit">
                    <div className="countdown-num">{String(countdown.s).padStart(2, '0')}</div>
                    <div className="countdown-lbl">সেকেন্ড</div>
                  </div>
                </div>
              </>
            )}
            {countdown.status === 'ongoing' && (
              <div className="countdown-done">
                🌺 আজকের শুভ পূজা অনুষ্ঠিত হচ্ছে — আনন্দ ও ভক্তিতে অংশ নিন 🌺
              </div>
            )}
            {countdown.status === 'ended' && (
              <div className="countdown-done">
                🙏 আবার আসবেন মা — শুভ বিজয়ার প্রীতি ও শুভেচ্ছা 🙏
              </div>
            )}
          </div>
        </div>

        {/* Traditional Bengali Alpana Transition */}
        <AlpanaTransition />

        {/* ===================== DEDICATED 3D DURGA IDOL REVEAL ===================== */}
        <DurgaRevealSection />

        {/* Traditional Bengali Alpana Transition */}
        <AlpanaTransition flip />

        {/* ===================== 3D INVITATION ===================== */}
        <Invitation3D />

        {/* ===================== INAUGURATION ===================== */}
        <section id="inauguration" className="inauguration-section" aria-labelledby="inaug-heading">
          <div className="container">
            <div className="section-header">
              <div className="section-badge">উদ্বোধন বিবরণ</div>
              <h2 id="inaug-heading" className="section-title" style={{ color: 'var(--gold-bright)' }}>
                {INAUGURATION.title}
              </h2>
              <div className="ornament" aria-hidden="true">✦ ❀ ✦ ❀ ✦</div>
            </div>

            <TiltCard className="inaug-card" intensity={10}>
              <div className="inaug-header">
                <h2>{INAUGURATION.title}</h2>
                <div className="sub" style={{ fontSize: '0.96rem', marginTop: '0.5rem', color: 'var(--gold-bright)', fontWeight: 600 }}>
                  {INAUGURATION.dateLine}
                </div>
              </div>

              <div className="inaug-body">
                <div style={{ textAlign: 'center', padding: '0.5rem 0 1.25rem', borderBottom: '1px solid rgba(255,255,255,0.08)' }}>
                  <p style={{ color: 'var(--cream)', fontSize: '1.05rem', lineHeight: '1.7', fontWeight: 600, margin: 0 }}>
                    {INAUGURATION.actionLine}
                  </p>
                </div>

                <div style={{ textAlign: 'center', padding: '1.4rem 0', borderBottom: '1px solid rgba(255,255,255,0.08)' }}>
                  <div style={{ fontFamily: 'Noto Serif Bengali, serif', fontSize: '1.3rem', fontWeight: 900, color: 'var(--gold-bright)' }}>
                    {INAUGURATION.inaugurator.name}
                  </div>
                  <div style={{ fontFamily: 'Noto Sans Bengali, sans-serif', fontSize: '0.95rem', color: 'var(--gold-light)', marginTop: '0.35rem' }}>
                    ({INAUGURATION.inaugurator.designation})
                  </div>
                </div>

                <div className="guest-box">
                  <div className="guest-type" style={{ fontSize: '0.85rem' }}>
                    {INAUGURATION.chiefGuest.label}
                  </div>
                  <div className="guest-name">
                    {INAUGURATION.chiefGuest.name}
                  </div>
                  <div className="guest-desig">
                    ({INAUGURATION.chiefGuest.designation})
                  </div>
                </div>
              </div>
            </TiltCard>
          </div>
        </section>

        {/* Traditional Bengali Alpana Transition */}
        <AlpanaTransition />

        {/* ===================== COMPREHENSIVE SCHEDULE & TIMETABLE (DUAL VIEWS) ===================== */}
        <ScheduleSection />

        {/* Traditional Bengali Alpana Transition */}
        <AlpanaTransition flip />

        {/* ===================== CULTURAL STAGE ===================== */}
        <section id="cultural" className="cultural-section" aria-labelledby="cultural-heading">
          <div className="container">
            <div className="section-header">
              <div className="section-badge">সন্ধ্যা সাংস্কৃতিক মঞ্চ</div>
              <h2 id="cultural-heading" className="section-title" style={{ color: 'var(--gold-bright)' }}>
                সাংস্কৃতিক অনুষ্ঠান ও যাত্রানুষ্ঠান
              </h2>
              <div className="ornament" aria-hidden="true">✦ ❀ ✦ ❀ ✦</div>
              <p className="section-subtitle">
                প্রতিদিন সন্ধায় ভক্তি, নৃত্য, সামাজিক যাত্রা ও আনন্দ পরিবেশনা
              </p>
            </div>

            <div className="cultural-grid" role="list">
              {CULTURAL_PROGRAMS.map((prog, idx) => (
                <TiltCard key={idx} className="cultural-card" intensity={16} role="listitem">
                  <div className="cult-day">{prog.day} • {prog.date}</div>
                  <div className="cult-icon" aria-hidden="true">{prog.icon}</div>
                  <div className="cult-title">{prog.title}</div>
                  {prog.detail && <div className="cult-detail">{prog.detail}</div>}
                  <div className="cult-time">
                    <span>🕒</span> {prog.time}
                  </div>
                </TiltCard>
              ))}
            </div>
          </div>
        </section>

        {/* ===================== HIGHLIGHTS ===================== */}
        <section className="highlights-section" aria-label="পূজার বিশেষ আকর্ষণ">
          <div className="container">
            <div className="section-header">
              <h2 className="section-title" style={{ color: 'var(--gold-bright)' }}>
                মণ্ডপের বিশেষ বৈশিষ্ট্য
              </h2>
              <div className="ornament" aria-hidden="true">✦ ❀ ✦ ❀ ✦</div>
            </div>

            <div className="highlights-grid">
              <TiltCard className="highlight-card" intensity={12}>
                <div className="hl-icon" aria-hidden="true">🌺</div>
                <div className="hl-title">ভক্তিপূর্ণ আরাধনা</div>
                <div className="hl-desc">পবিত্র মন্ত্রোচ্চারণ, চণ্ডীপাঠ ও হোম-যজ্ঞের মাধ্যমে বৈদিক প্রথায় মা দুর্গার বোধন ও অঞ্জলি।</div>
              </TiltCard>

              <TiltCard className="highlight-card" intensity={12}>
                <div className="hl-icon" aria-hidden="true">🪔</div>
                <div className="hl-title">সন্ধ্যা আরতি ও ধুনুচি</div>
                <div className="hl-desc">কাঁসর-ঘণ্টা, ঢাকের বাদ্য এবং ধুনুচির ধোঁয়ায় আলোকিত অপূর্ব সন্ধ্যারতি পরিবেশ।</div>
              </TiltCard>

              <TiltCard className="highlight-card" intensity={12}>
                <div className="hl-icon" aria-hidden="true">🎭</div>
                <div className="hl-title">ঐতিহ্যবাহী যাত্রাপালা</div>
                <div className="hl-desc">পুণ্য তিথিতে ঐতিহ্যবাহী সামাজিক যাত্রাপালা "চেনা পৃথিবীর অচেনা মানুষ"।</div>
              </TiltCard>

              <TiltCard className="highlight-card" intensity={12}>
                <div className="hl-icon" aria-hidden="true">🙏</div>
                <div className="hl-title">নরনারায়ণ সেবা</div>
                <div className="hl-desc">দ্বাদশীর পুণ্যলগ্নে সমবেত ভক্ত ও জনসাধারণের জন্য মহাপ্রসাদ ও নরনারায়ণ সেবা।</div>
              </TiltCard>
            </div>
          </div>
        </section>

        {/* Traditional Bengali Alpana Transition */}
        <AlpanaTransition />

        {/* ===================== POSTER GALLERY ===================== */}
        <PosterGallery3D />

        {/* ===================== CORE COMMITTEE MEMBERS ===================== */}
        <CommitteeSection />

        {/* ===================== ORGANIZER ===================== */}
        <section id="organizer" className="organizer-section" aria-labelledby="org-heading">
          <div className="container">
            <div className="section-header">
              <div className="section-badge">কমিটি ও পরিচালনা</div>
              <h2 id="org-heading" className="section-title" style={{ color: 'var(--gold-bright)' }}>
                পূজা কমিটি বিবরণ
              </h2>
              <div className="ornament" aria-hidden="true">✦ ❀ ✦ ❀ ✦</div>
            </div>

            <TiltCard className="org-card" intensity={14}>
              <div className="org-label">পরিচালনায়</div>
              <div className="org-name">{ORG.managedBy}</div>
              <div className="org-loc">{ORG.location}</div>
              <div className="org-year">{ORG.year} • শারদীয়া মহোৎসব</div>
              <div className="org-note">
                <strong>প্রধান পুরোহিত:</strong> মলয় ব্যানার্জী মহাশয়<br />
                সকলের আন্তরিক উপস্থিতি ও সহযোগিতায় উৎসবটি সাফল্যমণ্ডিত হয়ে উঠুক।
              </div>
            </TiltCard>
          </div>
        </section>

        {/* Traditional Bengali Alpana Transition */}
        <AlpanaTransition flip />

        {/* ===================== SACRED IMMERSION & BIJAYA FAREWELL ===================== */}
        <FinalImmersionSection onReplay={handleReplayBootExperience} />

        {/* ===================== FOOTER ===================== */}
        <footer className="footer" role="contentinfo">
          <div className="container">
            <div className="footer-greeting">🌺 শুভ শারদীয়া 🌺</div>
            <div className="footer-sub">
              মায়ের আশীর্বাদে সকলের জীবন ভরে উঠুক আনন্দ, শান্তি ও সৌভাগ্যের আলোয়।
            </div>

            <nav aria-label="ফুটার সাইটম্যাপ">
              <ul className="footer-nav">
                {navLinks.map((link) => (
                  <li key={link.href}>
                    <a href={link.href}>{link.label}</a>
                  </li>
                ))}
              </ul>
            </nav>

            {/* Dedicated Website Developer Credit */}
            <DeveloperCredit />

            <div className="footer-line" aria-hidden="true"></div>

            <div className="footer-copy">
              © ২০২৬ {ORG.name} • {ORG.location} • সর্বস্বত্ব সংরক্ষিত
            </div>

            {/* Replay Cinematic Puja Boot Experience button */}
            <div>
              <button
                className="curtain-replay-btn"
                onClick={handleReplayBootExperience}
                aria-label="পূজামণ্ডপে শুভাগমন অভিজ্ঞতা পুনরায় দেখুন"
              >
                <span>🪔</span>
                <span>পূজামণ্ডপে শুভাগমন অভিজ্ঞতা পুনরায় দেখুন</span>
              </button>
            </div>
          </div>
        </footer>
      </div>

      {/* Floating Sound Toggle Button */}
      <button
        className="ambient-btn"
        onClick={toggleSound}
        aria-label={soundEnabled ? 'পূজা আবহ সংগীত বন্ধ করুন' : 'পূজা আবহ সংগীত চালু করুন'}
        title={soundEnabled ? '🔊 Puja Sound: চালু (বন্ধ করতে চাপুন)' : '🔈 Puja Sound: বন্ধ (চালু করতে চাপুন)'}
      >
        {soundEnabled ? '🔊' : '🔈'}
      </button>
    </>
  )
}
