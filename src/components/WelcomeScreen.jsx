'use client'

import { motion } from 'framer-motion'

const ease = [0.22, 1, 0.36, 1]

export default function WelcomeScreen({ onStart }) {
  return (
    <motion.div
      className="min-h-[100dvh] flex flex-col items-center justify-center px-6 bg-mesh grain relative overflow-hidden"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0, y: -20, transition: { duration: 0.3, ease } }}
      transition={{ duration: 0.6, ease }}
    >
      {/* Ambient orbs */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <motion.div
          className="absolute -top-32 -left-32 w-96 h-96 rounded-full"
          style={{ background: 'radial-gradient(circle, rgba(79,122,79,0.08) 0%, transparent 70%)' }}
          animate={{ y: [0, -20, 0], x: [0, 10, 0] }}
          transition={{ duration: 8, repeat: Infinity, ease: 'easeInOut' }}
        />
        <motion.div
          className="absolute -bottom-48 -right-32 w-[500px] h-[500px] rounded-full"
          style={{ background: 'radial-gradient(circle, rgba(200,149,108,0.06) 0%, transparent 70%)' }}
          animate={{ y: [0, 15, 0], x: [0, -12, 0] }}
          transition={{ duration: 10, repeat: Infinity, ease: 'easeInOut' }}
        />
      </div>

      <div className="relative z-10 text-center max-w-[380px]">
        {/* Logo mark */}
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.8, ease, delay: 0.1 }}
          className="mb-10"
        >
          <div className="inline-flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-sage-500 flex items-center justify-center shadow-glow">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/>
              </svg>
            </div>
            <span className="font-display text-3xl text-sage-800 italic">FinMatch</span>
          </div>
        </motion.div>

        {/* Headline */}
        <motion.h1
          className="font-display text-[44px] leading-[1.05] text-sage-900 mb-4"
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, ease, delay: 0.3 }}
        >
          Find investments you{' '}
          <span className="italic text-sage-500">feel good</span> about
        </motion.h1>

        <motion.p
          className="font-body text-base text-warm-500 mb-10 leading-relaxed"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease, delay: 0.45 }}
        >
          Hey Linda. No pressure, no jargon — just swipe through 8 options and we'll build your perfect starting portfolio.
        </motion.p>

        {/* CTA */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease, delay: 0.6 }}
        >
          <motion.button
            onClick={onStart}
            className="w-full py-4 px-8 bg-sage-800 text-cream font-body font-bold text-base rounded-2xl transition-all duration-300"
            whileHover={{ scale: 1.01, boxShadow: '0 12px 40px rgba(33, 52, 33, 0.2)' }}
            whileTap={{ scale: 0.98 }}
            style={{ boxShadow: '0 4px 20px rgba(33, 52, 33, 0.12)' }}
          >
            Let's Go
          </motion.button>
        </motion.div>

        {/* How it works */}
        <motion.div
          className="mt-8 flex items-center justify-center gap-5 text-sm text-warm-400 font-body"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.85 }}
        >
          <div className="flex items-center gap-2">
            <span className="w-7 h-7 rounded-lg bg-coral-50 flex items-center justify-center text-coral-400 text-xs font-bold">
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round"><path d="M18 6L6 18M6 6l12 12" /></svg>
            </span>
            <span>Skip</span>
          </div>
          <div className="w-px h-4 bg-warm-200" />
          <div className="flex items-center gap-2">
            <span>Match</span>
            <span className="w-7 h-7 rounded-lg bg-sage-50 flex items-center justify-center text-sage-500 text-xs font-bold">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor"><path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" /></svg>
            </span>
          </div>
        </motion.div>

        <motion.p
          className="mt-4 text-xs text-warm-300 font-body"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1 }}
        >
          Takes about 60 seconds
        </motion.p>
      </div>
    </motion.div>
  )
}
