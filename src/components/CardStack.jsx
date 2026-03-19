'use client'

import { useState, useCallback, useRef } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import SwipeCard from './SwipeCard'
import FomoToast from './FomoToast'
import AdvisorQuip from './AdvisorQuip'

const ease = [0.22, 1, 0.36, 1]

export default function CardStack({ cards, onComplete, matches, setMatches, setRejected, aura, setAura }) {
  const [currentIndex, setCurrentIndex] = useState(0)
  const [fomoCard, setFomoCard] = useState(null)
  const [fomoVisible, setFomoVisible] = useState(false)
  const [quip, setQuip] = useState(null)
  const [quipVisible, setQuipVisible] = useState(false)
  const fomoTimeout = useRef(null)
  const quipTimeout = useRef(null)

  const showFomo = useCallback((card) => {
    if (fomoTimeout.current) clearTimeout(fomoTimeout.current)
    setFomoCard(card)
    setFomoVisible(true)
    fomoTimeout.current = setTimeout(() => setFomoVisible(false), 6000)
  }, [])

  const fetchQuip = useCallback(async (card, direction) => {
    try {
      const res = await fetch('/api/quip', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ card, direction }),
      })
      const data = await res.json()
      if (quipTimeout.current) clearTimeout(quipTimeout.current)
      // Slight delay so it appears after the card animates out
      setTimeout(() => {
        setQuip(data)
        setQuipVisible(true)
        quipTimeout.current = setTimeout(() => setQuipVisible(false), 6000)
      }, 300)
    } catch (e) {
      // Silently fail — quips are a nice-to-have
    }
  }, [])

  const handleSwipe = useCallback((direction) => {
    const card = cards[currentIndex]
    if (!card) return

    if (direction === 'right') {
      setMatches((prev) => [...prev, card])
      setFomoVisible(false)
      // AURA points: YOLO picks = massive aura, safe picks = negative aura (boring)
      if (card.risk >= 5) {
        setAura((prev) => prev + 500 + Math.floor(Math.random() * 500))
      } else if (card.risk >= 3) {
        setAura((prev) => prev + 100 + Math.floor(Math.random() * 100))
      } else {
        setAura((prev) => prev - 50 - Math.floor(Math.random() * 50))
      }
    } else {
      showFomo(card)
      setRejected((prev) => [...prev, card])
      // Rejecting YOLO = lose aura (boring), rejecting safe = gain aura (reckless)
      if (card.risk >= 5) {
        setAura((prev) => prev - 200)
      } else {
        setAura((prev) => prev + 50)
      }
    }

    // Fetch an AI advisor quip
    fetchQuip(card, direction)

    setCurrentIndex((prev) => {
      const next = prev + 1
      if (next >= cards.length) {
        setTimeout(() => onComplete(), 600)
      }
      return next
    })
  }, [currentIndex, cards, onComplete, setMatches, setRejected, showFomo, fetchQuip])

  const visibleCards = cards.slice(currentIndex, currentIndex + 3)
  const progress = currentIndex / cards.length

  return (
    <motion.div
      className="min-h-[100dvh] flex flex-col items-center bg-mesh grain relative"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.4, ease }}
    >
      {/* FOMO Toast */}
      <FomoToast card={fomoCard} visible={fomoVisible && !quipVisible} />

      {/* Advisor Quip */}
      <AdvisorQuip quip={quip} visible={quipVisible} />

      {/* Header */}
      <div className="w-full max-w-md px-6 pt-6 pb-3 flex items-center justify-between relative z-20">
        <div className="flex items-center gap-2">
          <div className="w-6 h-6 rounded-lg bg-sage-500 flex items-center justify-center">
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
              <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/>
            </svg>
          </div>
          <span className="font-display text-lg text-sage-800 italic">FinMatch</span>
        </div>
        <span className="font-mono text-xs text-warm-400">
          {Math.min(currentIndex + 1, cards.length)}/{cards.length}
        </span>
      </div>

      {/* Progress bar */}
      <div className="w-full max-w-md px-6 mb-5 relative z-20">
        <div className="w-full h-1 bg-sage-100 rounded-full overflow-hidden">
          <motion.div
            className="h-full bg-sage-400 rounded-full"
            animate={{ width: `${progress * 100}%` }}
            transition={{ duration: 0.4, ease }}
          />
        </div>
      </div>

      {/* Card stack */}
      <div className="relative w-full max-w-md px-6 flex-1 flex items-start justify-center">
        <div className="relative w-full" style={{ height: '510px' }}>
          <AnimatePresence mode="popLayout">
            {visibleCards.map((card, index) => (
              <SwipeCard
                key={card.id}
                card={card}
                isTop={index === 0}
                onSwipe={handleSwipe}
                style={{
                  scale: 1 - index * 0.035,
                  y: index * 6,
                  zIndex: visibleCards.length - index,
                  opacity: index > 1 ? 0.4 : 1,
                }}
              />
            ))}
          </AnimatePresence>

          {currentIndex >= cards.length && (
            <motion.div
              className="absolute inset-0 flex items-center justify-center"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.1 }}
            >
              <div className="text-center">
                <motion.div
                  className="w-12 h-12 rounded-2xl bg-sage-100 mx-auto mb-4 flex items-center justify-center"
                  animate={{ rotate: [0, 10, -10, 0] }}
                  transition={{ duration: 0.6, repeat: 2 }}
                >
                  <span className="text-xl">✨</span>
                </motion.div>
                <p className="font-body text-sm text-warm-400">Building your results...</p>
              </div>
            </motion.div>
          )}
        </div>
      </div>

      <div className="h-24" />
    </motion.div>
  )
}
