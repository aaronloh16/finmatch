'use client'

import { useMemo, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { categoryColors, categoryLabels } from '../data/cards'
import {
  weeklyMultipliers,
  weekLabels,
  DCA_CONTRIBUTION,
  MONTHLY_INCOME,
  funComparisons,
  checkingMultipliers,
} from '../data/backtestData'

function computeDCAPortfolio(matches) {
  const numWeeks = 12
  const weeklyAmount = DCA_CONTRIBUTION

  // Group matches by category and get allocation weight
  const categoryCounts = {}
  matches.forEach((m) => {
    categoryCounts[m.category] = (categoryCounts[m.category] || 0) + 1
  })
  const totalCards = matches.length
  const categoryWeights = {}
  Object.entries(categoryCounts).forEach(([cat, count]) => {
    categoryWeights[cat] = count / totalCards
  })

  // For each week, compute total portfolio value using DCA
  // Each weekly contribution buys at that week's price and grows from there
  const portfolioValues = []
  const categoryLines = {} // category -> array of values per week
  const checkingValues = []

  Object.keys(categoryWeights).forEach((cat) => {
    categoryLines[cat] = []
  })

  for (let week = 0; week < numWeeks; week++) {
    let totalValue = 0
    let checkingTotal = 0

    // Sum up all contributions made so far, each grown by the multiplier
    for (let contributionWeek = 0; contributionWeek <= week; contributionWeek++) {
      const weeksHeld = week - contributionWeek

      // For each category, compute growth of this contribution
      Object.entries(categoryWeights).forEach(([cat, weight]) => {
        const contributionToThisCat = weeklyAmount * weight
        const multipliers = weeklyMultipliers[cat]
        // Growth = multiplier at current week / multiplier at contribution week
        const growthFactor = multipliers[week] / multipliers[contributionWeek]
        totalValue += contributionToThisCat * growthFactor
      })

      // Checking account comparison
      checkingTotal += weeklyAmount
    }

    portfolioValues.push(totalValue)
    checkingValues.push(checkingTotal)

    // Per-category lines
    Object.entries(categoryWeights).forEach(([cat, weight]) => {
      let catValue = 0
      for (let cw = 0; cw <= week; cw++) {
        const contrib = weeklyAmount * weight
        const growthFactor = weeklyMultipliers[cat][week] / weeklyMultipliers[cat][cw]
        catValue += contrib * growthFactor
      }
      categoryLines[cat].push(catValue)
    })
  }

  const totalContributed = weeklyAmount * numWeeks
  const finalValue = portfolioValues[portfolioValues.length - 1]
  const gainLoss = finalValue - totalContributed
  const gainPercent = ((gainLoss / totalContributed) * 100)

  return {
    portfolioValues,
    checkingValues,
    categoryLines,
    categoryWeights,
    totalContributed,
    finalValue,
    gainLoss,
    gainPercent,
  }
}

function getGainMessage(gainLoss, gainPercent, hasYolo) {
  if (hasYolo && gainLoss < -1000) return "Linda, the meme coins... they didn't make it. But the rest of your portfolio? Still standing."
  if (gainLoss < -500) return "Rough patch. But remember — zoom out. Markets recover. Linda doesn't quit."
  if (gainLoss < 0) return "Slightly down, but you didn't lose it under a mattress. This is normal."
  if (gainLoss < 50) return "Slow and steady. Your money is working even when you're not."
  if (gainLoss < 200) return "Not bad for doing literally nothing, right?"
  if (gainLoss < 500) return "Your money is officially making money. You're an investor now, Linda."
  return "Look at that growth. Three months of consistency pays off."
}

function getFunComparison(gainLoss) {
  if (gainLoss <= 0) return null
  let best = null
  for (const comp of funComparisons) {
    if (gainLoss >= comp.threshold) best = comp
  }
  return best
}

export default function WhatIfChart({ matches }) {
  const [showBreakdown, setShowBreakdown] = useState(false)
  const hasYolo = matches.some((m) => m.risk >= 5)

  const data = useMemo(() => computeDCAPortfolio(matches), [matches])

  const {
    portfolioValues,
    checkingValues,
    categoryLines,
    categoryWeights,
    totalContributed,
    finalValue,
    gainLoss,
    gainPercent,
  } = data

  const funComp = getFunComparison(gainLoss)
  const message = getGainMessage(gainLoss, gainPercent, hasYolo)

  // SVG Chart dimensions
  const width = 380
  const height = 200
  const pad = { top: 15, right: 15, bottom: 28, left: 48 }
  const chartW = width - pad.left - pad.right
  const chartH = height - pad.top - pad.bottom

  // Compute scales
  const allValues = [
    ...portfolioValues,
    ...checkingValues,
    ...Object.values(categoryLines).flat(),
  ]
  const minVal = Math.min(...allValues) * 0.95
  const maxVal = Math.max(...allValues) * 1.05
  const range = maxVal - minVal || 1

  const scaleX = (i) => pad.left + (i / (portfolioValues.length - 1)) * chartW
  const scaleY = (v) => pad.top + chartH - ((v - minVal) / range) * chartH

  const toPolyline = (values) =>
    values.map((v, i) => `${scaleX(i)},${scaleY(v)}`).join(' ')

  // Grid lines (3-4 horizontal)
  const gridCount = 4
  const gridLines = Array.from({ length: gridCount + 1 }, (_, i) => {
    const val = minVal + (range * i) / gridCount
    return { y: scaleY(val), label: `$${Math.round(val).toLocaleString()}` }
  })

  // X-axis labels (show 4 evenly spaced)
  const xLabelIndices = [0, 3, 7, 11]

  const isPositive = gainLoss >= 0

  return (
    <div>
      {/* Header */}
      <div className="flex items-center gap-2 mb-1">
        <span className="text-base">📊</span>
        <h3 className="font-display text-lg text-sage-800 italic">
          What if you started 3 months ago?
        </h3>
      </div>
      <p className="font-body text-[11px] text-warm-400 mb-4">
        Investing ${DCA_CONTRIBUTION}/week from your ${MONTHLY_INCOME.toLocaleString()}/mo income
      </p>

      {/* Big number */}
      <div className="flex items-end gap-3 mb-1">
        <div>
          <p className="font-body text-xs text-warm-400 mb-0.5">You'd have</p>
          <motion.p
            className="font-display text-3xl font-bold text-sage-800 tracking-tight leading-none"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2, type: 'spring' }}
          >
            ${Math.round(finalValue).toLocaleString()}
          </motion.p>
        </div>
        <motion.div
          className={`px-2.5 py-1 rounded-full text-xs font-display font-semibold mb-0.5 ${
            isPositive ? 'bg-sage-100 text-sage-600' : 'bg-red-50 text-red-500'
          }`}
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.35, type: 'spring' }}
        >
          {isPositive ? '+' : ''}{gainPercent.toFixed(1)}% ({isPositive ? '+' : ''}${Math.round(gainLoss).toLocaleString()})
        </motion.div>
      </div>

      {/* vs just saving */}
      <p className="font-body text-xs text-warm-400 mb-4">
        vs <span className="font-semibold text-warm-500">${totalContributed.toLocaleString()}</span> sitting in checking
        {gainLoss > 0 && (
          <span className="text-sage-500 font-semibold"> — that's ${Math.round(gainLoss).toLocaleString()} of free money</span>
        )}
      </p>

      {/* SVG Chart */}
      <motion.div
        className="mb-4 -mx-1"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.4 }}
      >
        <svg viewBox={`0 0 ${width} ${height}`} className="w-full" preserveAspectRatio="xMidYMid meet">
          {/* Grid lines */}
          {gridLines.map((g, i) => (
            <g key={i}>
              <line
                x1={pad.left}
                y1={g.y}
                x2={width - pad.right}
                y2={g.y}
                stroke="#E5D4B8"
                strokeWidth="0.5"
                strokeDasharray="3,3"
              />
              <text
                x={pad.left - 6}
                y={g.y + 3}
                textAnchor="end"
                className="font-body"
                fill="#B8996B"
                fontSize="8"
              >
                {g.label}
              </text>
            </g>
          ))}

          {/* X-axis labels */}
          {xLabelIndices.map((idx) => (
            <text
              key={idx}
              x={scaleX(idx)}
              y={height - 4}
              textAnchor="middle"
              className="font-body"
              fill="#B8996B"
              fontSize="8"
            >
              {weekLabels[idx]}
            </text>
          ))}

          {/* Checking account line (dashed baseline) */}
          <motion.polyline
            points={toPolyline(checkingValues)}
            fill="none"
            stroke="#D4BC96"
            strokeWidth="1.5"
            strokeDasharray="4,4"
            initial={{ pathLength: 0, opacity: 0 }}
            animate={{ pathLength: 1, opacity: 0.6 }}
            transition={{ delay: 0.5, duration: 1, ease: 'easeOut' }}
          />

          {/* Per-category lines */}
          {showBreakdown && Object.entries(categoryLines).map(([cat, values]) => (
            <motion.polyline
              key={cat}
              points={toPolyline(values)}
              fill="none"
              stroke={categoryColors[cat] || '#B8D4B8'}
              strokeWidth="1.5"
              strokeLinecap="round"
              strokeLinejoin="round"
              initial={{ pathLength: 0, opacity: 0 }}
              animate={{ pathLength: 1, opacity: 0.4 }}
              transition={{ delay: 0.6, duration: 0.8, ease: 'easeOut' }}
            />
          ))}

          {/* Main portfolio line */}
          <motion.polyline
            points={toPolyline(portfolioValues)}
            fill="none"
            stroke={isPositive ? '#5B8C5A' : '#DC2626'}
            strokeWidth="2.5"
            strokeLinecap="round"
            strokeLinejoin="round"
            initial={{ pathLength: 0 }}
            animate={{ pathLength: 1 }}
            transition={{ delay: 0.55, duration: 1.2, ease: 'easeOut' }}
          />

          {/* End dot */}
          <motion.circle
            cx={scaleX(portfolioValues.length - 1)}
            cy={scaleY(portfolioValues[portfolioValues.length - 1])}
            r="4"
            fill={isPositive ? '#5B8C5A' : '#DC2626'}
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 1.6, type: 'spring', stiffness: 300 }}
          />

          {/* Labels */}
          <text
            x={width - pad.right}
            y={scaleY(checkingValues[checkingValues.length - 1]) - 6}
            textAnchor="end"
            fill="#B8996B"
            fontSize="7"
            className="font-body"
          >
            checking acct
          </text>
          <text
            x={width - pad.right}
            y={scaleY(portfolioValues[portfolioValues.length - 1]) - 8}
            textAnchor="end"
            fill={isPositive ? '#5B8C5A' : '#DC2626'}
            fontSize="8"
            fontWeight="600"
            className="font-display"
          >
            your portfolio
          </text>
        </svg>
      </motion.div>

      {/* Toggle category breakdown */}
      <button
        onClick={() => setShowBreakdown(!showBreakdown)}
        className="font-body text-xs text-sage-500 hover:text-sage-600 transition-colors mb-3"
      >
        {showBreakdown ? 'Hide' : 'Show'} category breakdown
      </button>

      {/* Category legend (when expanded) */}
      <AnimatePresence>
        {showBreakdown && (
          <motion.div
            className="flex flex-wrap gap-x-3 gap-y-1 mb-3"
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
          >
            {Object.entries(categoryLines).map(([cat]) => (
              <div key={cat} className="flex items-center gap-1">
                <div
                  className="w-3 h-0.5 rounded-full"
                  style={{ backgroundColor: categoryColors[cat] }}
                />
                <span className="font-body text-[10px] text-sage-500">
                  {categoryLabels[cat]} ({Math.round((categoryLines[cat][categoryLines[cat].length - 1] / finalValue) * 100)}%)
                </span>
              </div>
            ))}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Encouragement message */}
      <motion.div
        className={`rounded-xl p-3 ${isPositive ? 'bg-sage-50/80' : 'bg-coral-50/60'}`}
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.8 }}
      >
        <p className="font-body text-sm text-sage-700 leading-relaxed">
          {message}
        </p>
        {funComp && (
          <p className="font-body text-xs text-sage-500 mt-1">
            That extra ${Math.round(gainLoss).toLocaleString()} is {funComp.emoji} {funComp.text}.
          </p>
        )}
      </motion.div>

      {/* DCA explainer */}
      <motion.p
        className="font-body text-[10px] text-warm-400 mt-3 leading-relaxed"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1 }}
      >
        This models investing ${DCA_CONTRIBUTION}/week across your matched strategies, split equally.
        Dollar-cost averaging means you buy more when prices dip and less when they rise — smoothing out risk automatically.
      </motion.p>
    </div>
  )
}
