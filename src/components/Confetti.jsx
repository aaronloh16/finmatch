'use client'

import { useEffect, useState } from 'react'

const COLORS = ['#4F7A4F', '#C8956C', '#D4644D', '#6BA56B', '#E0CEB0', '#8C6E4A']

function randomBetween(min, max) {
  return Math.random() * (max - min) + min
}

export default function Confetti() {
  const [pieces, setPieces] = useState([])

  useEffect(() => {
    const newPieces = Array.from({ length: 40 }, (_, i) => ({
      id: i,
      left: randomBetween(0, 100),
      delay: randomBetween(0, 1.5),
      duration: randomBetween(2, 4),
      color: COLORS[Math.floor(Math.random() * COLORS.length)],
      size: randomBetween(4, 8),
      rotation: randomBetween(0, 360),
      shape: Math.random() > 0.5 ? 'circle' : 'rect',
    }))
    setPieces(newPieces)

    const timer = setTimeout(() => setPieces([]), 4500)
    return () => clearTimeout(timer)
  }, [])

  return (
    <div className="fixed inset-0 pointer-events-none z-[200] overflow-hidden">
      {pieces.map((p) => (
        <div
          key={p.id}
          className="absolute"
          style={{
            left: `${p.left}%`,
            top: '-10px',
            width: p.shape === 'circle' ? p.size : p.size * 0.6,
            height: p.size,
            backgroundColor: p.color,
            borderRadius: p.shape === 'circle' ? '50%' : '1px',
            animation: `confetti-fall ${p.duration}s ease-in ${p.delay}s forwards`,
            transform: `rotate(${p.rotation}deg)`,
            opacity: 0.8,
          }}
        />
      ))}
    </div>
  )
}
