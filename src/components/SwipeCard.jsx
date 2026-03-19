'use client'

import { motion, useMotionValue, useTransform, animate } from 'framer-motion'
import { useState } from 'react'

const ease = [0.22, 1, 0.36, 1]

function RiskDots({ level }) {
  return (
    <div className="flex items-center gap-1.5">
      {[1, 2, 3, 4, 5].map((i) => (
        <div
          key={i}
          className={`w-1.5 h-1.5 rounded-full transition-all duration-300 ${
            i <= level
              ? level >= 5 ? 'bg-red-400 scale-125' : 'bg-coral-400'
              : 'bg-warm-200'
          }`}
        />
      ))}
      <span className={`ml-2 text-[11px] font-body font-medium tracking-wide uppercase ${
        level >= 5 ? 'text-red-400' : 'text-warm-400'
      }`}>
        {level <= 1 ? 'Very Low' : level <= 2 ? 'Low' : level <= 3 ? 'Moderate' : level <= 4 ? 'High' : 'YOLO'}
      </span>
    </div>
  )
}

export default function SwipeCard({ card, onSwipe, isTop, style }) {
  const x = useMotionValue(0)
  const rotate = useTransform(x, [-250, 250], [-12, 12])
  const likeOpacity = useTransform(x, [0, 100], [0, 1])
  const nopeOpacity = useTransform(x, [-100, 0], [1, 0])
  const [exitX, setExitX] = useState(0)

  const handleDragEnd = (_, info) => {
    const threshold = 80
    const velocity = info.velocity.x

    if (info.offset.x > threshold || velocity > 400) {
      setExitX(600)
      onSwipe('right')
    } else if (info.offset.x < -threshold || velocity < -400) {
      setExitX(-600)
      onSwipe('left')
    } else {
      animate(x, 0, { type: 'spring', stiffness: 400, damping: 28 })
    }
  }

  const handleButtonSwipe = (direction) => {
    const target = direction === 'right' ? 600 : -600
    setExitX(target)
    animate(x, target, { type: 'spring', stiffness: 250, damping: 28 })
    setTimeout(() => onSwipe(direction), 180)
  }

  if (!isTop) {
    return (
      <motion.div className="absolute inset-0" style={style}>
        <div className="w-full h-full rounded-[28px] glass shadow-card overflow-hidden">
          <CardContent card={card} />
        </div>
      </motion.div>
    )
  }

  return (
    <motion.div
      className="absolute inset-0 cursor-grab active:cursor-grabbing touch-none"
      style={{ x, rotate, ...style, zIndex: 10 }}
      drag="x"
      dragConstraints={{ left: 0, right: 0 }}
      dragElastic={0.85}
      onDragEnd={handleDragEnd}
      exit={{ x: exitX, opacity: 0, transition: { duration: 0.35, ease } }}
    >
      <div className="relative w-full h-full rounded-[28px] glass shadow-card-hover overflow-hidden">
        {/* Like overlay */}
        <motion.div
          className="absolute inset-0 z-20 rounded-[28px] flex items-center justify-center pointer-events-none"
          style={{ opacity: likeOpacity, background: 'rgba(79, 122, 79, 0.06)' }}
        >
          <div className="px-5 py-2.5 border-[3px] border-sage-500 rounded-xl rotate-[-12deg]">
            <span className="font-body text-2xl font-bold text-sage-500 tracking-wide">MATCH</span>
          </div>
        </motion.div>

        {/* Nope overlay */}
        <motion.div
          className="absolute inset-0 z-20 rounded-[28px] flex items-center justify-center pointer-events-none"
          style={{ opacity: nopeOpacity, background: 'rgba(212, 100, 77, 0.06)' }}
        >
          <div className="px-5 py-2.5 border-[3px] border-coral-500 rounded-xl rotate-[12deg]">
            <span className="font-body text-2xl font-bold text-coral-500 tracking-wide">NOPE</span>
          </div>
        </motion.div>

        <CardContent card={card} />
      </div>

      {/* Swipe buttons */}
      <div className="absolute -bottom-[76px] left-0 right-0 flex items-center justify-center gap-5">
        <motion.button
          onClick={() => handleButtonSwipe('left')}
          className="w-14 h-14 rounded-2xl glass flex items-center justify-center text-coral-400 shadow-float"
          whileHover={{ scale: 1.06 }}
          whileTap={{ scale: 0.92 }}
        >
          <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
            <path d="M18 6L6 18M6 6l12 12" />
          </svg>
        </motion.button>

        <motion.button
          onClick={() => handleButtonSwipe('right')}
          className="w-14 h-14 rounded-2xl glass flex items-center justify-center text-sage-500 shadow-float"
          whileHover={{ scale: 1.06 }}
          whileTap={{ scale: 0.92 }}
        >
          <svg width="22" height="22" viewBox="0 0 24 24" fill="currentColor">
            <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" />
          </svg>
        </motion.button>
      </div>
    </motion.div>
  )
}

function CardContent({ card }) {
  const isYolo = card.risk >= 5
  return (
    <div className="relative z-10 h-full flex flex-col p-6 pt-7">
      {/* Top row */}
      <div className="flex items-start justify-between mb-5">
        <span className="text-5xl leading-none">{card.emoji}</span>
        <div className="flex flex-col items-end gap-1.5">
          <span className="px-3 py-1 rounded-xl bg-sage-800/[0.06] text-[11px] font-body font-bold text-sage-700 tracking-wide">
            {card.returns}
          </span>
          <span className="px-3 py-1 rounded-xl bg-warm-100/80 text-[11px] font-body text-warm-500">
            from {card.minToStart}
          </span>
        </div>
      </div>

      {/* Name */}
      <h2 className="font-display text-[28px] leading-tight text-sage-900 mb-2">
        {card.name}
      </h2>

      {/* Risk */}
      <div className="mb-5">
        <RiskDots level={card.risk} />
      </div>

      {/* Description */}
      <p className="font-body text-[15px] leading-relaxed text-sage-700/80 mb-5">
        {card.description}
      </p>

      {/* Safety box */}
      <div className={`mt-auto rounded-2xl p-4 ${
        isYolo
          ? 'bg-red-50/50 border border-red-100/60'
          : 'glass-dark'
      }`}>
        <div className="flex items-center gap-2 mb-1.5">
          <span className="text-xs">{isYolo ? '⚠️' : '🛡️'}</span>
          <span className={`font-body text-[10px] font-bold uppercase tracking-[0.08em] ${
            isYolo ? 'text-red-400' : 'text-sage-500'
          }`}>
            {isYolo ? "Why it's NOT safe" : "Why it's safe"}
          </span>
        </div>
        <p className="font-body text-[13px] leading-relaxed text-sage-600/70">
          {card.safety}
        </p>
      </div>
    </div>
  )
}
