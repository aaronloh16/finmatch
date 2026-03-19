'use client'

import { motion, AnimatePresence } from 'framer-motion'

export default function PortfolioBar({ matches, aura }) {
  if (matches.length === 0 && aura === 0) return null

  const auraColor = aura > 500 ? 'text-red-400' : aura > 0 ? 'text-coral-400' : aura < -100 ? 'text-sage-500' : 'text-warm-400'
  const auraLabel = aura > 1000 ? 'UNHINGED' : aura > 500 ? 'CHAOTIC' : aura > 200 ? 'BOLD' : aura > 0 ? 'MID' : aura > -100 ? 'SENSIBLE' : 'BORING'

  return (
    <AnimatePresence>
      <motion.div
        className="fixed bottom-5 left-1/2 -translate-x-1/2 z-50"
        initial={{ y: 60, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        exit={{ y: 60, opacity: 0 }}
        transition={{ type: 'spring', stiffness: 300, damping: 26 }}
      >
        <div className="glass rounded-2xl shadow-card px-4 py-2.5 flex items-center gap-3">
          {matches.length > 0 && (
            <>
              <div className="flex -space-x-0.5">
                {matches.slice(-4).map((m, i) => (
                  <motion.span
                    key={m.id}
                    className="inline-block text-base"
                    initial={{ scale: 0, x: -8 }}
                    animate={{ scale: 1, x: 0 }}
                    transition={{ type: 'spring', stiffness: 400, damping: 18, delay: i * 0.04 }}
                  >
                    {m.emoji}
                  </motion.span>
                ))}
              </div>
              <div className="h-4 w-px bg-sage-200/60" />
            </>
          )}
          <div className="flex items-center gap-2">
            <span className="text-xs">✨</span>
            <div>
              <motion.span
                key={aura}
                className={`font-mono text-sm font-bold ${auraColor} leading-tight block`}
                initial={{ scale: 1.4, opacity: 0.5 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ type: 'spring', stiffness: 300, damping: 15 }}
              >
                {aura > 0 ? '+' : ''}{aura}
              </motion.span>
              <span className={`font-mono text-[8px] ${auraColor} uppercase tracking-widest leading-tight block`}>
                {auraLabel} AURA
              </span>
            </div>
          </div>
        </div>
      </motion.div>
    </AnimatePresence>
  )
}
