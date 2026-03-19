'use client'

import { motion } from 'framer-motion'
import { categoryColors, categoryLabels } from '../data/cards'
import { useMemo, useState } from 'react'
import WhatIfChart from './WhatIfChart'
import FutureLetter from './FutureLetter'
import ChatBestie from './ChatBestie'
import Confetti from './Confetti'
import RageBaitModal from './RageBaitModal'

const ease = [0.22, 1, 0.36, 1]

function PieChart({ matches }) {
  const categories = useMemo(() => {
    const counts = {}
    matches.forEach((m) => {
      counts[m.category] = (counts[m.category] || 0) + 1
    })
    const total = matches.length
    let startAngle = 0
    return Object.entries(counts).map(([cat, count]) => {
      const percentage = count / total
      const angle = percentage * 360
      const segment = {
        category: cat,
        label: categoryLabels[cat] || cat,
        color: categoryColors[cat] || '#C1D6C1',
        percentage,
        startAngle,
        endAngle: startAngle + angle,
      }
      startAngle += angle
      return segment
    })
  }, [matches])

  const size = 160
  const center = size / 2
  const radius = 64
  const innerRadius = 40

  function polarToCartesian(cx, cy, r, angleDeg) {
    const rad = ((angleDeg - 90) * Math.PI) / 180
    return { x: cx + r * Math.cos(rad), y: cy + r * Math.sin(rad) }
  }

  function arcPath(cx, cy, r, innerR, startAngle, endAngle) {
    if (endAngle - startAngle >= 359.99) {
      const outerStart = polarToCartesian(cx, cy, r, 0)
      const outerMid = polarToCartesian(cx, cy, r, 180)
      const innerStart = polarToCartesian(cx, cy, innerR, 0)
      const innerMid = polarToCartesian(cx, cy, innerR, 180)
      return [
        `M ${outerStart.x} ${outerStart.y}`,
        `A ${r} ${r} 0 1 1 ${outerMid.x} ${outerMid.y}`,
        `A ${r} ${r} 0 1 1 ${outerStart.x} ${outerStart.y}`,
        `L ${innerStart.x} ${innerStart.y}`,
        `A ${innerR} ${innerR} 0 1 0 ${innerMid.x} ${innerMid.y}`,
        `A ${innerR} ${innerR} 0 1 0 ${innerStart.x} ${innerStart.y}`,
        'Z',
      ].join(' ')
    }
    const s1 = polarToCartesian(cx, cy, r, startAngle)
    const e1 = polarToCartesian(cx, cy, r, endAngle)
    const s2 = polarToCartesian(cx, cy, innerR, endAngle)
    const e2 = polarToCartesian(cx, cy, innerR, startAngle)
    const large = endAngle - startAngle > 180 ? 1 : 0
    return [
      `M ${s1.x} ${s1.y}`,
      `A ${r} ${r} 0 ${large} 1 ${e1.x} ${e1.y}`,
      `L ${s2.x} ${s2.y}`,
      `A ${innerR} ${innerR} 0 ${large} 0 ${e2.x} ${e2.y}`,
      'Z',
    ].join(' ')
  }

  return (
    <div className="flex items-center gap-6">
      <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`} className="flex-shrink-0">
        {categories.map((seg, i) => (
          <motion.path
            key={seg.category}
            d={arcPath(center, center, radius, innerRadius, seg.startAngle, seg.endAngle)}
            fill={seg.color}
            initial={{ opacity: 0, scale: 0.85 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.3 + i * 0.08, duration: 0.5, ease }}
            style={{ transformOrigin: `${center}px ${center}px` }}
          />
        ))}
        <text x={center} y={center - 4} textAnchor="middle" className="font-body text-xl font-bold" fill="#213421">
          {matches.length}
        </text>
        <text x={center} y={center + 12} textAnchor="middle" className="font-body text-[9px]" fill="#A68A5B">
          matches
        </text>
      </svg>
      <div className="flex flex-col gap-1.5">
        {categories.map((seg) => (
          <div key={seg.category} className="flex items-center gap-2">
            <div className="w-2 h-2 rounded-full flex-shrink-0" style={{ backgroundColor: seg.color }} />
            <span className="font-body text-[11px] text-sage-600">
              {seg.label}
            </span>
            <span className="font-mono text-[10px] text-warm-400 ml-auto">
              {Math.round(seg.percentage * 100)}%
            </span>
          </div>
        ))}
      </div>
    </div>
  )
}

function getRiskProfile(matches) {
  if (matches.length === 0) return null
  const hasYolo = matches.some(m => m.risk >= 5)
  const safeMatches = matches.filter(m => m.risk < 5)
  const avgRisk = matches.reduce((s, m) => s + m.risk, 0) / matches.length

  if (hasYolo && safeMatches.length === 0) return { label: 'Chaos Agent', emoji: '🔥', desc: 'Linda... you only picked the dangerous ones. This is the financial equivalent of only dating people with red flags. We need to talk.' }
  if (hasYolo) return { label: 'Spicy Balanced', emoji: '🌶️', desc: 'Safe picks AND wild cards? That\'s like having a stable job but also a secret TikTok account. We respect the range.' }
  if (avgRisk <= 1.3) return { label: 'Safe Queen', emoji: '👑', desc: 'You chose stability and that\'s a whole vibe. Your money is in a healthy, committed relationship. No situationships here.' }
  if (avgRisk <= 2) return { label: 'Thoughtful', emoji: '🧘', desc: 'Safety with a sprinkle of ambition. Like dating someone nice who also has a motorcycle.' }
  if (avgRisk <= 2.5) return { label: 'Balanced', emoji: '⚖️', desc: 'The goldilocks zone. Not too safe, not too wild. Your portfolio has its life together.' }
  return { label: 'Growth Mode', emoji: '🚀', desc: 'You\'re playing the long game and that takes guts. Time is literally on your side.' }
}

export default function ResultsScreen({ matches, rejected, aura, onRestart }) {
  const profile = getRiskProfile(matches)
  const hasMatches = matches.length > 0
  const hasYolo = matches.some(m => m.risk >= 5)
  const [showRageBait, setShowRageBait] = useState(false)
  const auraColor = aura > 500 ? 'text-red-400' : aura > 0 ? 'text-coral-400' : aura < -100 ? 'text-sage-500' : 'text-warm-400'
  const auraTitle = aura > 1000 ? 'Certified Degen' : aura > 500 ? 'Chaotic Energy' : aura > 200 ? 'Risk Taker' : aura > 0 ? 'Playing It Cool' : aura > -200 ? 'Responsible Adult' : 'Financially Boring (Compliment)'

  return (
    <motion.div
      className="min-h-[100dvh] bg-mesh grain"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5, ease }}
    >
      {hasMatches && <Confetti />}

      <div className="max-w-md mx-auto px-6 py-8 pb-24">
        {/* Header */}
        <motion.div
          className="text-center mb-8"
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, ease, delay: 0.1 }}
        >
          <motion.span
            className="inline-block text-4xl mb-3"
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ type: 'spring', stiffness: 250, damping: 18, delay: 0.2 }}
          >
            {hasMatches ? '💚' : '💛'}
          </motion.span>
          <h1 className="font-display text-4xl text-sage-900">
            {hasMatches ? (
              <>Your <span className="italic">Matches</span></>
            ) : 'No Matches Yet'}
          </h1>
        </motion.div>

        {hasMatches ? (
          <>
            {/* Pie chart */}
            <motion.div
              className="glass rounded-3xl p-6 shadow-card mb-5"
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, ease, delay: 0.25 }}
            >
              <PieChart matches={matches} />
            </motion.div>

            {/* Risk profile */}
            {profile && (
              <motion.div
                className="glass-dark rounded-2xl p-4 mb-5"
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, ease, delay: 0.35 }}
              >
                <div className="flex items-center gap-2 mb-1.5">
                  <span>{profile.emoji}</span>
                  <span className="font-body text-xs font-bold text-sage-700 uppercase tracking-[0.06em]">
                    {profile.label}
                  </span>
                </div>
                <p className="font-body text-[13px] text-sage-600/80 leading-relaxed">
                  {profile.desc}
                </p>
              </motion.div>
            )}

            {/* AURA Score Card */}
            <motion.div
              className="glass rounded-3xl p-6 shadow-card mb-5 text-center"
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, ease, delay: 0.42 }}
            >
              <div className="flex items-center justify-center gap-2 mb-2">
                <span className="text-base">✨</span>
                <h3 className="font-display text-lg text-sage-800 italic">Your Aura Score</h3>
              </div>
              <motion.p
                className={`font-mono text-5xl font-bold ${auraColor} mb-1`}
                initial={{ scale: 0.5, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ type: 'spring', stiffness: 200, damping: 12, delay: 0.5 }}
              >
                {aura > 0 ? '+' : ''}{aura}
              </motion.p>
              <p className={`font-mono text-xs ${auraColor} uppercase tracking-[0.15em] mb-3`}>
                {auraTitle}
              </p>
              <p className="font-body text-[13px] text-sage-600/70 leading-relaxed">
                {aura > 500
                  ? 'Linda. Your aura is radiating pure chaos. Your portfolio is giving "I make decisions based on TikTok." Your parents are worried.'
                  : aura > 0
                  ? 'A balanced aura. You took some risks but didn\'t go full degen. Your grandma would be confused but not disappointed.'
                  : 'Ultra-low aura. You picked the safest options possible. Your money is in a committed relationship. No drama, no excitement, no stories to tell at brunch.'}
              </p>

              {/* FOMO meme for high aura / YOLO picks */}
              {(hasYolo || aura > 300) && (
                <motion.div
                  className="mt-4 rounded-2xl overflow-hidden border border-warm-200/60"
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 0.7, duration: 0.4 }}
                >
                  <img
                    src="/-1x-1-1.webp"
                    alt="Sweating dude hitting the FOMO button"
                    className="w-full"
                  />
                  <div className="bg-sage-900 px-4 py-2.5">
                    <p className="font-mono text-[11px] text-cream/80 text-center">
                      {aura > 800
                        ? 'POV: Linda selecting meme coins and her friend\'s startup'
                        : aura > 400
                        ? 'POV: Linda hitting "match" on a YOLO investment'
                        : 'POV: Linda when the S&P dips 0.5% on a Tuesday'}
                    </p>
                  </div>
                </motion.div>
              )}
            </motion.div>

            {/* What If chart */}
            <motion.div
              className="glass rounded-3xl p-6 shadow-card mb-5"
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, ease, delay: 0.5 }}
            >
              <WhatIfChart matches={matches} />
            </motion.div>

            {/* Future Linda Letter */}
            <motion.div
              className="glass rounded-3xl p-6 shadow-card mb-5"
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, ease, delay: 0.55 }}
            >
              <FutureLetter matches={matches} rejected={rejected} />
            </motion.div>

            {/* Matched cards */}
            <motion.div
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, ease, delay: 0.65 }}
            >
              <h3 className="font-body text-[10px] font-bold text-warm-400 uppercase tracking-[0.1em] mb-3">
                Your picks
              </h3>
              <div className="space-y-2 mb-6">
                {matches.map((card, i) => (
                  <motion.div
                    key={card.id}
                    className="glass rounded-2xl p-3.5 shadow-float"
                    initial={{ opacity: 0, x: -12 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.7 + i * 0.06, duration: 0.4, ease }}
                  >
                    <div className="flex items-center gap-3">
                      <span className="text-2xl">{card.emoji}</span>
                      <div className="flex-1 min-w-0">
                        <h4 className="font-body font-bold text-sage-800 text-[13px]">
                          {card.name}
                        </h4>
                        <p className="font-body text-[11px] text-warm-400">
                          {card.returns} annual return
                        </p>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            </motion.div>

            {/* CTA */}
            <motion.div
              className="text-center"
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, ease, delay: 0.85 }}
            >
              <motion.button
                onClick={() => setShowRageBait(true)}
                className="w-full py-4 px-8 bg-sage-800 text-cream font-body font-bold text-base rounded-2xl shadow-card transition-all duration-300 mb-3"
                whileHover={{ scale: 1.01, boxShadow: '0 12px 40px rgba(33, 52, 33, 0.2)' }}
                whileTap={{ scale: 0.98 }}
              >
                Start investing &rarr;
              </motion.button>
              <button
                onClick={onRestart}
                className="font-body text-xs text-warm-400 hover:text-warm-500 transition-colors"
              >
                Start over
              </button>
            </motion.div>

            {/* Chat Bestie */}
            <ChatBestie matches={matches} />

            {/* Rage Bait Modal */}
            <RageBaitModal
              isOpen={showRageBait}
              onClose={() => setShowRageBait(false)}
              matches={matches}
            />
          </>
        ) : (
          <motion.div
            className="text-center"
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3, duration: 0.5, ease }}
          >
            <div className="glass rounded-3xl p-8 shadow-card mb-6">
              <p className="font-body text-[15px] leading-relaxed text-sage-700 mb-3">
                No matches yet — and that's totally okay! Not feeling ready is valid.
              </p>
              <p className="font-body text-[13px] text-sage-600/70 leading-relaxed mb-4">
                Like we always say: the best investment is the one that doesn't keep you up at night. Maybe start with a high-yield savings account — it's the "good morning" text of the financial world.
              </p>
              <div className="rounded-2xl overflow-hidden border border-warm-200/60">
                <img
                  src="/-1x-1-1.webp"
                  alt="Sweating dude hitting the FOMO button"
                  className="w-full"
                />
                <div className="bg-sage-900 px-4 py-2.5">
                  <p className="font-mono text-[11px] text-cream/80 text-center">
                    POV: Linda swiped left on everything and her money is still in a 0.01% checking account
                  </p>
                </div>
              </div>
            </div>
            <motion.button
              onClick={onRestart}
              className="w-full py-4 px-8 bg-sage-800 text-cream font-body font-bold text-base rounded-2xl shadow-card"
              whileHover={{ scale: 1.01 }}
              whileTap={{ scale: 0.98 }}
            >
              Try Again
            </motion.button>
          </motion.div>
        )}
      </div>
    </motion.div>
  )
}
