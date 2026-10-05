import React, { useRef, useState } from 'react'

export default function TiltCard({
  children,
  className = '',
  intensity = 15,
  glare = true,
  onClick,
  ...props
}) {
  const cardRef = useRef(null)
  const [transform, setTransform] = useState('')
  const [glareStyle, setGlareStyle] = useState({ opacity: 0, x: '50%', y: '50%' })

  const handleMouseMove = (e) => {
    if (!cardRef.current) return
    const rect = cardRef.current.getBoundingClientRect()
    const x = e.clientX - rect.left
    const y = e.clientY - rect.top
    const centerX = rect.width / 2
    const centerY = rect.height / 2

    const rotateX = ((y - centerY) / centerY) * -intensity
    const rotateY = ((x - centerX) / centerX) * intensity

    setTransform(`perspective(1000px) rotateX(${rotateX.toFixed(2)}deg) rotateY(${rotateY.toFixed(2)}deg) translateY(-6px) scale3d(1.02, 1.02, 1.02)`)

    if (glare) {
      const glX = (x / rect.width) * 100
      const glY = (y / rect.height) * 100
      setGlareStyle({
        opacity: 0.35,
        x: `${glX}%`,
        y: `${glY}%`,
      })
    }
  }

  const handleMouseLeave = () => {
    setTransform('perspective(1000px) rotateX(0deg) rotateY(0deg) translateY(0px) scale3d(1, 1, 1)')
    setGlareStyle((prev) => ({ ...prev, opacity: 0 }))
  }

  return (
    <div
      ref={cardRef}
      className={`glass-card tilt-card ${className}`}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      onClick={onClick}
      style={{
        transform,
        transition: 'transform 0.15s ease-out, box-shadow 0.25s ease',
        position: 'relative',
        overflow: 'hidden',
        cursor: onClick ? 'pointer' : 'default',
      }}
      {...props}
    >
      <div className="tilt-card-inner">{children}</div>
      {glare && (
        <div
          style={{
            position: 'absolute',
            inset: 0,
            pointerEvents: 'none',
            background: `radial-gradient(circle 240px at ${glareStyle.x} ${glareStyle.y}, rgba(255, 215, 0, 0.28), transparent 70%)`,
            opacity: glareStyle.opacity,
            transition: 'opacity 0.25s ease',
            mixBlendMode: 'screen',
          }}
        />
      )}
    </div>
  )
}
