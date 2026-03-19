'use client'

import { motion, AnimatePresence } from 'framer-motion'

export default function FomoToast({ card, visible }) {
  if (!card) return null
  const isYolo = card.risk >= 5

  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          className="fixed top-5 left-1/2 -translate-x-1/2 z-[90] w-[calc(100%-2.5rem)] max-w-sm"
          initial={{ y: -60, opacity: 0, scale: 0.95 }}
          animate={{ y: 0, opacity: 1, scale: 1 }}
          exit={{ y: -30, opacity: 0, scale: 0.97 }}
          transition={{ type: 'spring', stiffness: 350, damping: 28 }}
        >
          <div className="glass rounded-3xl px-6 py-5 shadow-card-hover">
            <div className="flex items-start gap-3.5">
              <span className="text-4xl flex-shrink-0">
                {isYolo ? '😮‍💨' : '💔'}
              </span>
              <div className="flex-1 min-w-0">
                <p className={`font-body text-[12px] font-bold uppercase tracking-[0.08em] mb-1.5 ${
                  isYolo ? 'text-sage-400' : 'text-coral-400'
                }`}>
                  {isYolo ? 'Dodged a bullet bestie' : 'The one that got away'}
                </p>
                <p className="font-body text-[17px] text-sage-800 leading-relaxed font-medium">
                  {card.missedOut}
                </p>
              </div>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
