import React, { useState } from 'react'
import { motion } from 'framer-motion'

export default function Invitation3D() {
  const [isOpen, setIsOpen] = useState(false)

  return (
    <section id="invitation" className="invitation-section" aria-labelledby="invitation-title">
      <div className="container">
        <div className="section-header">
          <div className="section-badge">ডিজিটাল নিমন্ত্রণ পত্র</div>
          <h2 id="invitation-title" className="section-title" style={{ color: 'var(--gold-bright)' }}>
            শ্রী শ্রী শারদীয়া দুর্গাপূজার আমন্ত্রণ পত্র
          </h2>
          <div className="ornament" aria-hidden="true">✦ ❀ ✦ ❀ ✦</div>
          <p className="section-subtitle">
            পত্রটিতে ক্লিক অথবা স্পর্শ করে উল্টে দেখুন
          </p>
        </div>

        <div className="invite-wrapper">
          <div
            className={`invite-card-3d ${isOpen ? 'flipped' : ''}`}
            onClick={() => setIsOpen(!isOpen)}
            role="button"
            tabIndex={0}
            onKeyDown={(e) => {
              if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault()
                setIsOpen(!isOpen)
              }
            }}
            aria-label="আমন্ত্রণ পত্র উল্টাতে ক্লিক করুন"
          >
            {/* FRONT FACE: Physical Cream Paper Letter */}
            <div className="invite-face invite-front">
              <span className="invite-corner tl" aria-hidden="true">✦</span>
              <span className="invite-corner tr" aria-hidden="true">✦</span>
              <span className="invite-corner bl" aria-hidden="true">✦</span>
              <span className="invite-corner br" aria-hidden="true">✦</span>

              <div className="invite-title">
                🌺 শ্রী শ্রী শারদীয়া দুর্গাপূজার আমন্ত্রণ পত্র 🌺
              </div>
              <div className="invite-gold-line" aria-hidden="true"></div>

              <div className="invite-body">
                <p style={{ fontWeight: 700, marginBottom: '0.6rem', color: '#5C0E1A' }}>
                  হে সুধী,
                </p>
                <p>
                  রৌদ্র ও বর্ষণের ক্ষান্ত আলো আঁধারী আকাশে পাখির পালকের মত মেঘরাশির অলস মধুর সুভাসিত ছন্দে নিরুদ্দেশে ভেসে যাওয়া শারদের অম্বর ধূসর শুভ্র শুচিতা, শিউলী কুসুমের উম্মীলন, হৃদয়ে আকুল করা সুগন্ধ, তটিনী পাড়ের পুষ্পকাশের অপূর্ব মিলন স্নিগ্ধতা, এই অনুপম স্নিগ্ধ মোলায়েম রূপশ্রী নিয়ে দেবী মহামায়ার অনাবিল আনন্দময় আবির্ভাব। শশীর উৎসর্গিত রূপালী জোছনায় অপরূপ সাজে সজ্জিত মর্ত্যের বক্ষে দেবী দশভূজার মর্ত্যে আগমন।
                </p>

                <div className="invite-poem">
                  ঢাকের রোলে বাঁশীর সুরে মোরা গীত গায় আজিকায়<br />
                  বিশ্বজননী আসছে আঙিনায়—<br />
                  শুভ্র মেঘ করিছে খেলা শারদ আকাশ আজি উতলা<br />
                  শঙ্খ ঘণ্টা বাজিছে মাদল বরণ নৃত্য সায়রে<br />
                  আজি শঙ্খে শঙ্খে মঙ্গল গাও—
                </div>

                <p>
                  শিউলী ফোঁটা প্রাতে সবাইকে জানাই শারদীয়ার শুভেচ্ছা। আপনার সপরিবারে আগমনে মুখরিত হউক পান্ডবেশ্বর কলেজ পাড়ার দুর্গা মন্দির প্রাঙ্গন।
                </p>
              </div>

              <div className="invite-gold-line" aria-hidden="true"></div>

              <div className="invite-sign">
                <div className="kirti">বিনয়াবনত —</div>
                <div className="name">পান্ডবেশ্বর কলেজ পাড়া অধিবাসীবৃন্দ</div>
              </div>

              <div className="invite-hint">
                🔄 [ স্পর্শ করে সিলমোহর দেখুন ]
              </div>
            </div>

            {/* BACK FACE: Royal Crimson & Gold Ceremonial Seal */}
            <div className="invite-face invite-back">
              <div style={{ textAlign: 'center', padding: '2rem' }}>
                <div style={{ fontSize: '4.5rem', marginBottom: '1rem', filter: 'drop-shadow(0 0 20px #FFD700)' }}>
                  🔱
                </div>
                <div style={{ fontFamily: 'Noto Serif Bengali, serif', fontSize: '1.8rem', fontWeight: 900, color: '#FFD700', marginBottom: '0.5rem' }}>
                  শ্রী শ্রী দুর্গায় নমঃ
                </div>
                <div style={{ fontFamily: 'Noto Sans Bengali, sans-serif', fontSize: '1rem', color: 'var(--cream)', opacity: 0.85 }}>
                  কলেজ পাড়া সার্বজনীন দুর্গাপূজা
                </div>
                <div style={{ fontFamily: 'Noto Sans Bengali, sans-serif', fontSize: '0.85rem', color: 'var(--gold-light)', marginTop: '0.25rem' }}>
                  বর্ষ ২৬তম • পান্ডবেশ্বর
                </div>
                <div style={{ marginTop: '2rem', display: 'inline-block', padding: '0.4rem 1.2rem', borderRadius: '50px', background: 'rgba(255,215,0,0.15)', border: '1px solid var(--gold)', fontSize: '0.8rem', color: 'var(--gold-bright)' }}>
                  পুনরায় পত্র পড়তে ক্লিক করুন ↩
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
