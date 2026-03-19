'use client'

import { motion, AnimatePresence } from 'framer-motion'

export default function AdvisorQuip({ quip, visible }) {
  return (
    <AnimatePresence>
      {visible && quip && (
        <motion.div
          className="fixed top-5 left-1/2 -translate-x-1/2 z-[100] w-[calc(100%-2.5rem)] max-w-sm"
          initial={{ y: -60, opacity: 0, scale: 0.95 }}
          animate={{ y: 0, opacity: 1, scale: 1 }}
          exit={{ y: -30, opacity: 0, scale: 0.97 }}
          transition={{ type: 'spring', stiffness: 350, damping: 28 }}
        >
          <div className="glass rounded-3xl px-6 py-5 shadow-card-hover">
            <div className="flex items-start gap-3.5">
              <span className="text-4xl flex-shrink-0">{quip.emoji}</span>
              <div className="flex-1 min-w-0">
                <p className="font-body text-[12px] font-bold text-warm-400 uppercase tracking-[0.08em] mb-1.5">
                  {quip.advisor}
                </p>
                <p className="font-body text-[17px] text-sage-800 leading-relaxed font-medium">
                  {quip.text}
                </p>
              </div>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
