import React, { useState, useMemo } from 'react'
import { SCHEDULE } from '../data/pujaData'
import TiltCard from './TiltCard'

/**
 * ScheduleSection.jsx
 * -------------------------------------------------------------------------
 * Comprehensive, High-Fidelity Durga Puja Timetable Section:
 * 1. Dual View Switcher:
 *    - 🗂️ সময়রেখা কার্ড ভিউ (Card / Timeline View)
 *    - 📋 সম্পূর্ণ পঞ্জিকা ছক ভিউ (Table Matrix View)
 * 2. Filter Tabs:
 *    - সকল তিথি (All 9 days)
 *    - মহাসপ্তমী (উভয় দিন - ১ম ও ২য় দিন)
 *    - মহাষ্টমী ও সন্ধিপূজা
 *    - মহানবমী ও বিজয়া দশমী
 *    - একাদশী হইতে নিরঞ্জন
 * 3. Search / Timing Finder:
 *    - Instant search for events (অঞ্জলি, আরতি, ভোগ, যাত্রাপালা, সন্ধিপূজা, etc.)
 * 4. Strict Content Authority:
 *    - Exactly TWO visible “মহাসপ্তমী” headings:
 *      * ENTRY 1: মহাসপ্তমী : ২৯শে আশ্বিন ১৪৩৩ সন (ইং১৭-১০-২৬) শনিবার
 *      * ENTRY 2: মহাসপ্তমী : ৩০শে আশ্বিন ১৪৩৩ সন (ইং১৮-১০-২৬) রবিবার
 *    - মহাষ্টমী : ১লা কার্ত্তিক ১৪৩৩ সন (ইং ১৯-১০-২৬)
 *    - All Bengali numerals, punctuation, dates, times, and names 100% preserved
 *    - পুরোহিত বিঃদ্রঃ notice preserved
 * -------------------------------------------------------------------------
 */
export default function ScheduleSection() {
  const [viewMode, setViewMode] = useState('timeline') // 'timeline' | 'table'
  const [filterPhase, setFilterPhase] = useState('all')
  const [searchQuery, setSearchQuery] = useState('')

  // Determine current day for live highlighting
  const now = new Date()
  const isPujaYear = now.getFullYear() === 2026 && now.getMonth() === 9

  // Filter items based on active phase tab and search query
  const filteredSchedule = useMemo(() => {
    return SCHEDULE.filter((item) => {
      // Phase Filter
      if (filterPhase === 'saptami') {
        if (item.id !== 'saptami1' && item.id !== 'saptami2') return false
      } else if (filterPhase === 'ashtami-navami') {
        if (item.id !== 'ashtami' && item.id !== 'navami') return false
      } else if (filterPhase === 'dashami-niranjan') {
        if (
          item.id !== 'dashami' &&
          item.id !== 'ekadashi' &&
          item.id !== 'dvadashi' &&
          item.id !== 'trayodashi'
        )
          return false
      }

      // Search Query
      if (searchQuery.trim() !== '') {
        const q = searchQuery.toLowerCase().trim()
        const matchName = item.name.toLowerCase().includes(q)
        const matchBengaliDate = item.bengaliDate.toLowerCase().includes(q)
        const matchEnglishDate = (item.englishNoticeDate || '').toLowerCase().includes(q)
        const matchWeekday = item.weekday.toLowerCase().includes(q)
        const matchDetails = (item.details || '').toLowerCase().includes(q)
        const matchCultural = (item.cultural || '').toLowerCase().includes(q)
        const matchEvents = item.events.some((ev) =>
          ev.text.toLowerCase().includes(q) || (ev.time && ev.time.toLowerCase().includes(q))
        )
        return (
          matchName ||
          matchBengaliDate ||
          matchEnglishDate ||
          matchWeekday ||
          matchDetails ||
          matchCultural ||
          matchEvents
        )
      }

      return true
    })
  }, [filterPhase, searchQuery])

  return (
    <section id="schedule" className="schedule-section" aria-labelledby="schedule-heading">
      <div className="container">
        {/* Section Header */}
        <div className="section-header">
          <div className="section-badge">শ্রী শ্রী শারদীয়া দুর্গাপূজার সময় নির্ঘণ্ট</div>
          <h1 id="schedule-heading" className="section-title" style={{ color: 'var(--gold-bright)' }}>
            শ্রী শ্রী শারদীয়া দুর্গাপূজার সময় নির্ঘণ্ট
          </h1>
          <div className="section-subtitle" style={{ color: 'var(--gold-light)', fontWeight: 600 }}>
            পূজার সময়সূচি ও বিশেষ অনুষ্ঠান
          </div>
          <div className="ornament" aria-hidden="true">✦ ❀ ✦ ❀ ✦</div>
          <p className="section-subtitle">
            মহাষষ্ঠী হইতে ত্রয়োদশী প্রতিমা নিরঞ্জন পর্যন্ত প্রতিটি তিথি, পূজা ও সাংস্কৃতিক অনুষ্ঠানের বিশুদ্ধ দিনপঞ্জী
          </p>
        </div>

        {/* Timetable Controls Bar */}
        <div className="timetable-controls-bar">
          {/* View Switcher: Card / Timeline vs Table Chart */}
          <div className="view-mode-toggle" role="tablist" aria-label="সময়সূচি প্রদর্শন ধরন">
            <button
              type="button"
              role="tab"
              aria-selected={viewMode === 'timeline'}
              className={`view-mode-btn ${viewMode === 'timeline' ? 'active' : ''}`}
              onClick={() => setViewMode('timeline')}
            >
              <span className="view-btn-icon">🗂️</span>
              <span className="view-btn-text">সময়রেখা কার্ড ভিউ</span>
            </button>
            <button
              type="button"
              role="tab"
              aria-selected={viewMode === 'table'}
              className={`view-mode-btn ${viewMode === 'table' ? 'active' : ''}`}
              onClick={() => setViewMode('table')}
            >
              <span className="view-btn-icon">📋</span>
              <span className="view-btn-text">সম্পূর্ণ নির্ঘণ্ট ছক</span>
            </button>
          </div>

          {/* Search Box */}
          <div className="timetable-search-wrap">
            <span className="search-icon" aria-hidden="true">🔍</span>
            <input
              type="text"
              className="timetable-search-input"
              placeholder="অনুষ্ঠান বা সময় খুঁজুন (যেমন: অঞ্জলি, ভোগ, সন্ধিপূজা, যাত্রা)..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              aria-label="পূজা নির্ঘণ্ট অনুসন্ধান"
            />
            {searchQuery && (
              <button
                type="button"
                className="clear-search-btn"
                onClick={() => setSearchQuery('')}
                aria-label="অনুসন্ধান মুছুন"
              >
                ✕
              </button>
            )}
          </div>
        </div>

        {/* Phase Filter Tabs */}
        <div className="schedule-filter-pills" role="navigation" aria-label="তিথি বাছাই">
          <button
            type="button"
            className={`filter-pill ${filterPhase === 'all' ? 'active' : ''}`}
            onClick={() => setFilterPhase('all')}
          >
            <span>সকল তিথি</span>
            <span className="filter-count">৯</span>
          </button>
          <button
            type="button"
            className={`filter-pill ${filterPhase === 'saptami' ? 'active' : ''}`}
            onClick={() => setFilterPhase('saptami')}
          >
            <span>মহাসপ্তমী (উভয় দিন)</span>
            <span className="filter-count">২</span>
          </button>
          <button
            type="button"
            className={`filter-pill ${filterPhase === 'ashtami-navami' ? 'active' : ''}`}
            onClick={() => setFilterPhase('ashtami-navami')}
          >
            <span>মহাষ্টমী ও মহানবমী</span>
            <span className="filter-count">২</span>
          </button>
          <button
            type="button"
            className={`filter-pill ${filterPhase === 'dashami-niranjan' ? 'active' : ''}`}
            onClick={() => setFilterPhase('dashami-niranjan')}
          >
            <span>দশমী হইতে নিরঞ্জন</span>
            <span className="filter-count">৪</span>
          </button>
        </div>

        {/* ==================== VIEW 1: TIMELINE CARDS ==================== */}
        {viewMode === 'timeline' && (
          <div className="schedule-timeline" role="list">
            <div className="timeline-line" aria-hidden="true"></div>

            {filteredSchedule.map((item) => {
              const isToday =
                isPujaYear &&
                parseInt(item.englishDateFormatted.split(' ')[0], 10) === now.getDate()

              return (
                <div
                  key={item.id}
                  className={`timeline-item ${item.id === 'saptami1' || item.id === 'saptami2' ? 'saptami-special-item' : ''}`}
                  role="listitem"
                >
                  <div className="timeline-dot" aria-hidden="true">
                    {item.emoji}
                  </div>

                  <TiltCard
                    className={`timeline-card ${isToday ? 'current-puja-day' : ''} ${item.id === 'saptami1' ? 'saptami-one-card' : ''} ${item.id === 'saptami2' ? 'saptami-two-card' : ''}`}
                    intensity={12}
                  >
                    {/* Subtle watermarked Bengali numeral */}
                    <span className="card-watermark" aria-hidden="true">
                      {item.numBn}
                    </span>

                    {/* Today badge if current date */}
                    {isToday && (
                      <div className="today-puja-badge">
                        <span>🌺</span> আজকের শুভ পূজা অনুষ্ঠিত হচ্ছে
                      </div>
                    )}

                    {/* Card Top: Heading and Dates */}
                    <div className="card-top">
                      <div className="card-top-left">
                        <div className="day-name-row">
                          <span className="day-num-chip">{item.numBn}</span>
                          <h2 className="day-name">{item.name}</h2>
                        </div>
                        <div className="day-tithi">{item.bengaliDate}</div>
                      </div>

                      <div className="day-dates">
                        <span className="date-chip-en">{item.englishDateFormatted}</span>
                        <span className="date-chip-bar">{item.weekday}</span>
                        {item.englishNoticeDate && (
                          <span className="date-chip-raw">{item.englishNoticeDate}</span>
                        )}
                      </div>
                    </div>

                    {/* Clear distinction banner for BOTH Saptami entries */}
                    {item.id === 'saptami1' && (
                      <div className="saptami-distinction-banner entry-one">
                        <span className="saptami-banner-icon">🌸</span>
                        <div className="saptami-banner-text">
                          <strong>মহাসপ্তমী : ১ম দিন</strong> (২৯শে আশ্বিন ১৪৩৩ সন • ইং ১৭-১০-২৬ শনিবার)
                          <small>নবপত্রিকা প্রবেশ স্থাপন, সপ্তমী বিহিত পূজা ও সান্ধ্য নৃত্যনুষ্ঠান</small>
                        </div>
                      </div>
                    )}
                    {item.id === 'saptami2' && (
                      <div className="saptami-distinction-banner entry-two">
                        <span className="saptami-banner-icon">🔱</span>
                        <div className="saptami-banner-text">
                          <strong>মহাসপ্তমী : ২য় দিন</strong> (৩০শে আশ্বিন ১৪৩৩ সন • ইং ১৮-১০-২৬ রবিবার)
                          <small>ভোর ৫টায় পূজারম্ভ, মায়ের অন্নভোগ ও ঐতিহ্যবাহী সামাজিক যাত্রাপালা</small>
                        </div>
                      </div>
                    )}

                    {/* Mahaashtami Highlight Banner */}
                    {item.id === 'ashtami' && (
                      <div className="ashtami-sandhi-banner">
                        <span className="ashtami-banner-icon">🕯️</span>
                        <div className="ashtami-banner-text">
                          <strong>মহাষ্টমী ও সন্ধিপূজা মহালগ্ন</strong>
                          <small>দিবা ৭.২৬ থেকে সন্ধিপূজারম্ভ • দিবা ৭.৫০ মিঃ গতে বলিদান • দিবা ৮.১৪ মিঃ মধ্যে সমাপন</small>
                        </div>
                      </div>
                    )}

                    {/* Main schedule description details */}
                    {item.details && (
                      <div className="card-details-box">
                        <span className="details-quot-icon" aria-hidden="true">“</span>
                        <span className="details-content">{item.details}</span>
                      </div>
                    )}

                    {/* Itemized sacred events */}
                    <div className="card-events-list">
                      {item.events.map((ev, eIdx) => (
                        <div
                          key={eIdx}
                          className={`event-row ${ev.highlight ? 'highlight-row' : ''}`}
                        >
                          <span className="event-icon" aria-hidden="true">
                            {ev.icon}
                          </span>
                          <span className="event-text">{ev.text}</span>
                        </div>
                      ))}
                    </div>

                    {/* Cultural event highlight footer */}
                    {item.cultural && (
                      <div className="card-cultural-highlight">
                        <span className="cult-badge-icon">🎭</span>
                        <div className="cult-badge-content">
                          <span className="cult-badge-lead">বিশেষ সান্ধ্য আয়োজন:</span>
                          <span className="cult-badge-title">{item.cultural}</span>
                        </div>
                      </div>
                    )}

                    <div className="card-footer-ornament" aria-hidden="true">
                      ✦ {item.name} • {item.bengaliDate} ({item.englishNoticeDate}) ✦
                    </div>
                  </TiltCard>
                </div>
              )
            })}
          </div>
        )}

        {/* ==================== VIEW 2: TABLE MATRIX ==================== */}
        {viewMode === 'table' && (
          <div className="schedule-table-wrap">
            <div className="table-scroll-hint" aria-hidden="true">
              ↔ ডানে ও বাঁয়ে স্ক্রল করে সম্পূর্ণ নির্ঘণ্ট ছকটি দেখুন
            </div>

            <div className="table-responsive-container">
              <table className="puja-matrix-table" aria-label="শ্রী শ্রী শারদীয়া দুর্গাপূজার সময় নির্ঘণ্ট ছক">
                <thead>
                  <tr>
                    <th scope="col" style={{ width: '18%' }}>তিথি ও দিন</th>
                    <th scope="col" style={{ width: '22%' }}>পঞ্জিকা তারিখ ও বার</th>
                    <th scope="col" style={{ width: '38%' }}>পূজা, অঞ্জলি, ভোগ ও নির্ঘণ্ট বিবরণ</th>
                    <th scope="col" style={{ width: '22%' }}>সান্ধ্য সাংস্কৃতিক অনুষ্ঠান</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredSchedule.map((item) => {
                    const isToday =
                      isPujaYear &&
                      parseInt(item.englishDateFormatted.split(' ')[0], 10) === now.getDate()

                    return (
                      <tr
                        key={item.id}
                        className={`table-row ${isToday ? 'row-today' : ''} ${item.id === 'saptami1' ? 'row-saptami-1' : ''} ${item.id === 'saptami2' ? 'row-saptami-2' : ''}`}
                      >
                        {/* 1. Tithi & Day */}
                        <td className="col-tithi">
                          <div className="table-tithi-badge">
                            <span className="table-tithi-emoji">{item.emoji}</span>
                            <div>
                              <strong className="table-tithi-name">{item.name}</strong>
                              {item.id === 'saptami1' && (
                                <span className="saptami-pill first">১ম দিন</span>
                              )}
                              {item.id === 'saptami2' && (
                                <span className="saptami-pill second">২য় দিন</span>
                              )}
                            </div>
                          </div>
                          <div className="table-num-tag">তিথি #{item.numBn}</div>
                        </td>

                        {/* 2. Dates */}
                        <td className="col-dates">
                          <div className="table-bengali-date">{item.bengaliDate}</div>
                          <div className="table-weekday-tag">{item.weekday}</div>
                          <div className="table-eng-date">
                            {item.englishDateFormatted}
                            {item.englishNoticeDate && (
                              <small> ({item.englishNoticeDate})</small>
                            )}
                          </div>
                        </td>

                        {/* 3. Rituals & Timings */}
                        <td className="col-rituals">
                          {item.details && (
                            <div className="table-details-highlight">
                              <strong>তিথি স্থিতি:</strong> {item.details}
                            </div>
                          )}

                          <ul className="table-events-list">
                            {item.events.map((ev, evIdx) => (
                              <li key={evIdx} className={ev.highlight ? 'table-highlight-item' : ''}>
                                <span className="table-ev-icon">{ev.icon}</span>
                                <span>{ev.text}</span>
                              </li>
                            ))}
                          </ul>
                        </td>

                        {/* 4. Cultural Program */}
                        <td className="col-cultural">
                          {item.cultural ? (
                            <div className="table-cultural-card">
                              <span className="table-cult-icon">🎭</span>
                              <div className="table-cult-title">{item.cultural}</div>
                              <span className="table-cult-time">🕒 রাত্রি ৭.৩০টায়</span>
                            </div>
                          ) : (
                            <span className="table-cult-none">—</span>
                          )}
                        </td>
                      </tr>
                    )
                  })}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Empty Search Result Fallback */}
        {filteredSchedule.length === 0 && (
          <div className="schedule-empty-state">
            <span className="empty-icon">🔍</span>
            <div className="empty-title">কোনো নির্ঘণ্ট মেলেনি</div>
            <p className="empty-desc">
              "{searchQuery}" অনুসন্ধানের জন্য কোনো ফলাফল পাওয়া যায়নি। অনুসন্ধান মুছুন বা অন্য শব্দ চেষ্টা করুন।
            </p>
            <button
              type="button"
              className="btn-primary"
              onClick={() => {
                setSearchQuery('')
                setFilterPhase('all')
              }}
            >
              সকল তিথি দেখুন
            </button>
          </div>
        )}

        {/* Head Priest Notice Bar - Preserved Exactly */}
        <div className="notice-bar" role="note">
          <strong className="notice-badge-label">বিঃদ্রঃ :</strong>{' '}
          পূজা কমিটির নিকট মলয় ব্যানার্জী (পুরোহিত)-র একান্ত অনুরোধ, কমিটি যেন দশমীর দিন ২টি স্বেচ্ছাসেবক দেয়। যাত্রাবন্ধন ও পুষ্পাঞ্জলির লাইন ঠিক করার জন্য।
        </div>
      </div>
    </section>
  )
}
