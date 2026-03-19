'use client'

import { useState, useEffect, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'

const STAGES = [
  {
    emoji: '🚨',
    title: 'WAIT.',
    body: 'Before you invest, we need to confirm something...',
    buttonText: 'Okay...?',
  },
  {
    emoji: '📞',
    title: 'Calling your mom...',
    body: 'We\'re legally required to inform your immigrant parents that their child is FINALLY investing instead of letting money rot in a checking account.',
    buttonText: 'DON\'T CALL MY MOM',
  },
  {
    emoji: '👵',
    title: 'Too late. She picked up.',
    body: '"Linda? Is it true? You\'re investing? I didn\'t carry three suitcases through JFK airport in 1987 for you to take THIS long. But I\'m proud of you, habibti."',
    buttonText: 'Mom please...',
  },
  {
    emoji: '😭',
    title: 'She\'s crying happy tears.',
    body: 'She\'s already calling your aunties. Tía Rosa knows. Uncle Raj knows. The family WhatsApp group knows. There is no going back.',
    buttonText: 'I need to lie down',
  },
  {
    emoji: '🎉',
    title: 'Welcome to Investing, Linda.',
    body: 'Your money is about to have a better relationship than any of your exes. Consistent. Reliable. Actually shows up. Let\'s do this.',
    buttonText: 'LET\'S GO 🚀',
    isFinal: true,
  },
]

export default function RageBaitModal({ isOpen, onClose, matches }) {
  const [stage, setStage] = useState(0)
  const [phoneRinging, setPhoneRinging] = useState(false)

  const currentStage = STAGES[stage]

  const handleNext = () => {
    if (currentStage.isFinal) {
      onClose()
      return
    }
    if (stage === 0) {
      setPhoneRinging(true)
      setTimeout(() => {
        setPhoneRinging(false)
        setStage(1)
      }, 1500)
      return
    }
    setStage(prev => prev + 1)
  }

  useEffect(() => {
    if (!isOpen) setStage(0)
  }, [isOpen])

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          className="fixed inset-0 z-[300] flex items-center justify-center px-6"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        >
          {/* Backdrop */}
          <motion.div
            className="absolute inset-0 bg-sage-900/40 backdrop-blur-sm"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
          />

          {/* Modal */}
          <motion.div
            className="relative w-full max-w-sm glass rounded-3xl p-8 shadow-card-hover text-center"
            initial={{ scale: 0.9, y: 20, opacity: 0 }}
            animate={{ scale: 1, y: 0, opacity: 1 }}
            exit={{ scale: 0.95, y: 10, opacity: 0 }}
            transition={{ type: 'spring', stiffness: 300, damping: 25 }}
            key={stage}
          >
            {/* Phone ringing animation */}
            {phoneRinging ? (
              <div className="py-8">
                <motion.span
                  className="inline-block text-6xl"
                  animate={{
                    rotate: [0, -15, 15, -15, 15, 0],
                  }}
                  transition={{ duration: 0.5, repeat: Infinity }}
                >
                  📱
                </motion.span>
                <p className="font-body text-lg font-bold text-sage-800 mt-4">
                  Ringing...
                </p>
                <p className="font-body text-sm text-warm-400 mt-1">
                  Dialing Mom (Mobile)
                </p>
                <div className="flex justify-center gap-1.5 mt-3">
                  <motion.div className="w-2 h-2 rounded-full bg-sage-300" animate={{ opacity: [0.3, 1, 0.3] }} transition={{ duration: 0.8, repeat: Infinity }} />
                  <motion.div className="w-2 h-2 rounded-full bg-sage-300" animate={{ opacity: [0.3, 1, 0.3] }} transition={{ duration: 0.8, repeat: Infinity, delay: 0.2 }} />
                  <motion.div className="w-2 h-2 rounded-full bg-sage-300" animate={{ opacity: [0.3, 1, 0.3] }} transition={{ duration: 0.8, repeat: Infinity, delay: 0.4 }} />
                </div>
              </div>
            ) : (
              <>
                <motion.span
                  className="inline-block text-5xl mb-4"
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ type: 'spring', stiffness: 400, damping: 15 }}
                >
                  {currentStage.emoji}
                </motion.span>

                <motion.h2
                  className="font-display text-2xl text-sage-900 mb-3"
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.1 }}
                >
                  {currentStage.title}
                </motion.h2>

                <motion.p
                  className="font-body text-[15px] text-sage-700 leading-relaxed mb-6"
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.2 }}
                >
                  {currentStage.body}
                </motion.p>

                <motion.button
                  onClick={handleNext}
                  className={`w-full py-3.5 px-6 font-body font-bold text-[15px] rounded-2xl transition-all duration-300 ${
                    currentStage.isFinal
                      ? 'bg-sage-800 text-cream shadow-glow'
                      : 'bg-coral-50 text-coral-600 hover:bg-coral-100'
                  }`}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.97 }}
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.3 }}
                >
                  {currentStage.buttonText}
                </motion.button>

                {!currentStage.isFinal && (
                  <motion.p
                    className="font-body text-[10px] text-warm-300 mt-3"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.5 }}
                  >
                    Stage {stage + 1} of {STAGES.length}
                  </motion.p>
                )}
              </>
            )}
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
