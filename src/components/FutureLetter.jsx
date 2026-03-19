'use client'

import { useState, useEffect, useRef } from 'react'
import { motion } from 'framer-motion'

export default function FutureLetter({ matches, rejected }) {
  const [text, setText] = useState('')
  const [loading, setLoading] = useState(true)
  const [done, setDone] = useState(false)
  const scrollRef = useRef(null)
  const fetchedRef = useRef(false)

  useEffect(() => {
    if (fetchedRef.current) return
    fetchedRef.current = true

    async function fetchLetter() {
      try {
        const res = await fetch('/api/advisor', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ type: 'future-letter', matches, rejected }),
        })

        const reader = res.body.getReader()
        const decoder = new TextDecoder()
        setLoading(false)

        while (true) {
          const { done: streamDone, value } = await reader.read()
          if (streamDone) break
          const chunk = decoder.decode(value, { stream: true })
          setText(prev => prev + chunk)
        }
        setDone(true)
      } catch (e) {
        setLoading(false)
        setText('Dear Past Me,\n\nI tried to write you a letter but my AI had a moment. Just know — whatever you picked, you started. And starting is everything.\n\n— Linda, 2031')
        setDone(true)
      }
    }

    fetchLetter()
  }, [matches, rejected])

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight
    }
  }, [text])

  return (
    <div>
      <div className="flex items-center gap-2 mb-3">
        <span className="text-base">💌</span>
        <h3 className="font-display text-lg text-sage-800 italic">A letter from future you</h3>
      </div>

      <div
        ref={scrollRef}
        className="relative rounded-2xl overflow-hidden"
        style={{ maxHeight: '280px', overflowY: 'auto' }}
      >
        {/* Animated border glow */}
        <div className="absolute inset-0 rounded-2xl ai-glow pointer-events-none" />

        <div className="relative bg-cream-dark/40 rounded-2xl p-5">
          {loading ? (
            <div className="flex items-center gap-2 py-4">
              <motion.div
                className="w-2 h-2 rounded-full bg-sage-300"
                animate={{ opacity: [0.3, 1, 0.3] }}
                transition={{ duration: 1.2, repeat: Infinity }}
              />
              <motion.div
                className="w-2 h-2 rounded-full bg-sage-300"
                animate={{ opacity: [0.3, 1, 0.3] }}
                transition={{ duration: 1.2, repeat: Infinity, delay: 0.2 }}
              />
              <motion.div
                className="w-2 h-2 rounded-full bg-sage-300"
                animate={{ opacity: [0.3, 1, 0.3] }}
                transition={{ duration: 1.2, repeat: Infinity, delay: 0.4 }}
              />
              <span className="font-body text-xs text-warm-400 ml-1">Future Linda is writing...</span>
            </div>
          ) : (
            <p className="font-body text-[14px] leading-[1.7] text-sage-700 whitespace-pre-wrap">
              {text}
              {!done && (
                <motion.span
                  className="inline-block w-0.5 h-4 bg-sage-400 ml-0.5 align-middle"
                  animate={{ opacity: [1, 0] }}
                  transition={{ duration: 0.6, repeat: Infinity }}
                />
              )}
            </p>
          )}
        </div>
      </div>

      {done && (
        <motion.p
          className="mt-2 text-[10px] text-warm-300 font-body text-center"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
        >
          Powered by AI — for entertainment, not financial advice
        </motion.p>
      )}
    </div>
  )
}
