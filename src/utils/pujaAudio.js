// Robust Audio Controller for Durga Puja Website
// Supports real MP3 recording (/ambient.mp3) with seamless Web Audio synthesis fallback
// Built to strictly respect and overcome modern browser autoplay/gesture restrictions

class PujaAudioController {
  constructor() {
    this.audioElement = null
    this.ctx = null
    this.masterGain = null
    this.isPlaying = false
    this.dhakTimer = null
    this.mode = 'mp3' // 'mp3' or 'synth'
    this.volume = 0.6
    this.listeners = new Set()
    this.isAutoUnlockBound = false
  }

  // Subscribe to playback state changes
  subscribe(callback) {
    this.listeners.add(callback)
    return () => this.listeners.delete(callback)
  }

  notify() {
    this.listeners.forEach((fn) => {
      try {
        fn(this.isPlaying)
      } catch (e) {
        console.warn('Listener error', e)
      }
    })
  }

  isMuted() {
    return localStorage.getItem('durga_puja_sound_pref') === 'muted'
  }

  // Pre-load and initialize HTML5 Audio element
  initAudioElement() {
    if (this.audioElement) return this.audioElement
    try {
      const audio = new Audio()
      audio.src = '/ambient.mp3'
      audio.loop = true
      audio.preload = 'auto'
      audio.volume = 0.6
      this.audioElement = audio
      return audio
    } catch (e) {
      console.warn('Audio element creation failed, using Web Audio synth', e)
      return null
    }
  }

  // Pre-initialize Web Audio Context if needed
  initWebAudio() {
    if (this.ctx) {
      if (this.ctx.state === 'suspended') {
        this.ctx.resume().catch(() => {})
      }
      return
    }
    try {
      const AudioContext = window.AudioContext || window.webkitAudioContext
      if (AudioContext) {
        this.ctx = new AudioContext()
        this.masterGain = this.ctx.createGain()
        this.masterGain.gain.setValueAtTime(0.5, this.ctx.currentTime)
        this.masterGain.connect(this.ctx.destination)
      }
    } catch (e) {
      console.warn('Web Audio initialization error', e)
    }
  }

  // Bind one-time global interaction listeners to instantly unlock audio
  // if browser blocked unprompted autoplay
  bindAutoUnlock() {
    if (this.isAutoUnlockBound || this.isPlaying) return
    if (this.isMuted()) return

    this.isAutoUnlockBound = true
    const events = ['pointerdown', 'touchstart', 'click', 'keydown', 'wheel', 'scroll']

    const unlockHandler = () => {
      cleanup()
      if (!this.isPlaying && !this.isMuted()) {
        this.play(true)
      }
    }

    const cleanup = () => {
      events.forEach((evt) => {
        window.removeEventListener(evt, unlockHandler, { capture: true })
      })
      this.isAutoUnlockBound = false
    }

    events.forEach((evt) => {
      window.addEventListener(evt, unlockHandler, { capture: true, once: true, passive: true })
    })
  }

  // Central trigger to play audio
  play(fadeIn = true) {
    if (this.isMuted()) return

    this.initAudioElement()
    this.initWebAudio()

    // 1. Try HTML5 Audio (/ambient.mp3) first
    if (this.audioElement) {
      if (fadeIn) {
        this.audioElement.volume = 0.05
      } else {
        this.audioElement.volume = 0.6
      }

      const promise = this.audioElement.play()
      if (promise !== undefined) {
        promise
          .then(() => {
            this.isPlaying = true
            this.mode = 'mp3'
            this.notify()
            if (fadeIn) {
              this.fadeInHtmlAudio()
            }
          })
          .catch((err) => {
            console.warn('HTML5 Audio play unprompted was blocked by browser policy:', err)
            // Immediately register auto-unlock listener for first user touch/click/scroll
            this.bindAutoUnlock()
            // 2. Also try synthesized audio fallback
            this.playSynthFallback(fadeIn)
          })
        return
      }
    }

    this.playSynthFallback(fadeIn)
  }

  // Fade in HTML5 audio
  fadeInHtmlAudio() {
    if (!this.audioElement) return
    let vol = 0.05
    const target = 0.65
    const interval = setInterval(() => {
      if (!this.isPlaying || !this.audioElement) {
        clearInterval(interval)
        return
      }
      vol += 0.05
      if (vol >= target) {
        this.audioElement.volume = target
        clearInterval(interval)
      } else {
        this.audioElement.volume = vol
      }
    }, 100)
  }

  // Web Audio Synthesized Fallback (dhak beat loop + bell + shankh)
  playSynthFallback(fadeIn = true) {
    if (!this.ctx) return
    if (this.ctx.state === 'suspended') {
      this.ctx.resume().catch(() => {
        this.bindAutoUnlock()
      })
    }

    this.isPlaying = true
    this.mode = 'synth'
    this.notify()

    if (fadeIn && this.masterGain) {
      this.masterGain.gain.cancelScheduledValues(this.ctx.currentTime)
      this.masterGain.gain.setValueAtTime(0.01, this.ctx.currentTime)
      this.masterGain.gain.linearRampToValueAtTime(0.45, this.ctx.currentTime + 1.2)
    }

    // Play initial bell
    this.playBell(587.33, 2.5, 0.25)

    // Play sacred shankh
    this.playShankh(0.4, 2.4)

    // Start Dhak rhythms
    this.startDhakLoop()
  }

  // Realistic Dhak beat
  playDhakBeat(type = 'open') {
    if (!this.ctx || !this.isPlaying) return
    const now = this.ctx.currentTime

    const osc = this.ctx.createOscillator()
    const gain = this.ctx.createGain()
    osc.type = 'sine'

    const freq = type === 'open' ? 100 : 150
    osc.frequency.setValueAtTime(freq, now)
    osc.frequency.exponentialRampToValueAtTime(35, now + 0.18)

    gain.gain.setValueAtTime(type === 'open' ? 0.4 : 0.28, now)
    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.2)

    osc.connect(gain)
    gain.connect(this.masterGain)

    osc.start(now)
    osc.stop(now + 0.22)

    // Leather snare snap
    const bufferSize = this.ctx.sampleRate * 0.04
    const buffer = this.ctx.createBuffer(1, bufferSize, this.ctx.sampleRate)
    const data = buffer.getChannelData(0)
    for (let i = 0; i < bufferSize; i++) {
      data[i] = (Math.random() * 2 - 1) * Math.exp(-i / (bufferSize * 0.25))
    }

    const noise = this.ctx.createBufferSource()
    noise.buffer = buffer

    const filter = this.ctx.createBiquadFilter()
    filter.type = 'bandpass'
    filter.frequency.setValueAtTime(type === 'open' ? 1400 : 2400, now)
    filter.Q.setValueAtTime(3.5, now)

    const noiseGain = this.ctx.createGain()
    noiseGain.gain.setValueAtTime(type === 'open' ? 0.3 : 0.45, now)
    noiseGain.gain.exponentialRampToValueAtTime(0.001, now + 0.05)

    noise.connect(filter)
    filter.connect(noiseGain)
    noiseGain.connect(this.masterGain)

    noise.start(now)
    noise.stop(now + 0.06)
  }

  // Resonant Temple Bell
  playBell(freq = 880, duration = 2.4, volume = 0.25) {
    if (!this.ctx) return
    const now = this.ctx.currentTime
    const osc = this.ctx.createOscillator()
    const gain = this.ctx.createGain()

    osc.type = 'sine'
    osc.frequency.setValueAtTime(freq, now)

    gain.gain.setValueAtTime(volume, now)
    gain.gain.exponentialRampToValueAtTime(0.0001, now + duration)

    osc.connect(gain)
    gain.connect(this.masterGain)

    osc.start(now)
    osc.stop(now + duration + 0.1)
  }

  // Sacred Shankh
  playShankh(delay = 0, duration = 2.5) {
    if (!this.ctx) return
    const now = this.ctx.currentTime + delay

    const osc = this.ctx.createOscillator()
    const gain = this.ctx.createGain()

    osc.type = 'sawtooth'
    osc.frequency.setValueAtTime(320, now)
    osc.frequency.linearRampToValueAtTime(410, now + 0.6)
    osc.frequency.linearRampToValueAtTime(395, now + duration - 0.4)
    osc.frequency.linearRampToValueAtTime(340, now + duration)

    const filter = this.ctx.createBiquadFilter()
    filter.type = 'lowpass'
    filter.frequency.setValueAtTime(650, now)
    filter.frequency.linearRampToValueAtTime(850, now + 0.6)
    filter.frequency.linearRampToValueAtTime(500, now + duration)

    gain.gain.setValueAtTime(0.001, now)
    gain.gain.linearRampToValueAtTime(0.25, now + 0.5)
    gain.gain.linearRampToValueAtTime(0.2, now + duration - 0.5)
    gain.gain.exponentialRampToValueAtTime(0.0001, now + duration)

    osc.connect(filter)
    filter.connect(gain)
    gain.connect(this.masterGain)

    osc.start(now)
    osc.stop(now + duration + 0.1)
  }

  startDhakLoop() {
    if (this.dhakTimer) return
    const pattern = [
      { type: 'open', delay: 0 },
      { type: 'slap', delay: 220 },
      { type: 'slap', delay: 360 },
      { type: 'open', delay: 520 },
      { type: 'slap', delay: 720 },
      { type: 'slap', delay: 840 },
    ]
    const cycleTime = 1040

    let cycleCount = 0
    const loop = () => {
      if (!this.isPlaying) return
      pattern.forEach(({ type, delay }) => {
        setTimeout(() => {
          if (this.isPlaying) this.playDhakBeat(type)
        }, delay)
      })

      if (cycleCount % 4 === 0) {
        this.playBell(1046, 2.5, 0.12)
      }

      cycleCount++
      this.dhakTimer = setTimeout(loop, cycleTime)
    }

    loop()
  }

  // Curtain Opening sequence
  startOpeningSequence() {
    this.play(true)
  }

  // Stop / Pause all audio
  stop() {
    this.isPlaying = false
    this.notify()

    // Stop HTML5 audio
    if (this.audioElement) {
      try {
        this.audioElement.pause()
      } catch (e) {
        console.warn('Audio pause error', e)
      }
    }

    // Stop Web Audio loop
    if (this.dhakTimer) {
      clearTimeout(this.dhakTimer)
      this.dhakTimer = null
    }

    if (this.ctx && this.masterGain) {
      this.masterGain.gain.cancelScheduledValues(this.ctx.currentTime)
      this.masterGain.gain.linearRampToValueAtTime(0.0001, this.ctx.currentTime + 0.4)
    }
  }

  // Resume playing
  resume() {
    this.play(false)
  }
}

export const pujaAudio = new PujaAudioController()
