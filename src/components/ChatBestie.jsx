'use client'

import { useState, useRef, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'

export default function ChatBestie({ matches }) {
  const [isOpen, setIsOpen] = useState(false)
  const [messages, setMessages] = useState([
    { role: 'assistant', content: 'Hey girl! I saw your picks — ask me anything about your new portfolio. No dumb questions, I promise. 💅' }
  ])
  const [input, setInput] = useState('')
  const [streaming, setStreaming] = useState(false)
  const scrollRef = useRef(null)

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight
    }
  }, [messages, streaming])

  const sendMessage = async () => {
    if (!input.trim() || streaming) return
    const userMsg = input.trim()
    setInput('')
    setMessages(prev => [...prev, { role: 'user', content: userMsg }])
    setStreaming(true)

    try {
      const res = await fetch('/api/advisor', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          type: 'chat',
          matches,
          message: userMsg,
          history: messages,
        }),
      })

      const reader = res.body.getReader()
      const decoder = new TextDecoder()
      let fullText = ''

      setMessages(prev => [...prev, { role: 'assistant', content: '' }])

      while (true) {
        const { done, value } = await reader.read()
        if (done) break
        const chunk = decoder.decode(value, { stream: true })
        fullText += chunk
        setMessages(prev => {
          const updated = [...prev]
          updated[updated.length - 1] = { role: 'assistant', content: fullText }
          return updated
        })
      }
    } catch (e) {
      setMessages(prev => [...prev, { role: 'assistant', content: 'Oops, my brain glitched. Try asking again!' }])
    }
    setStreaming(false)
  }

  return (
    <>
      {/* Toggle button */}
      <motion.button
        onClick={() => setIsOpen(!isOpen)}
        className="fixed bottom-5 right-5 z-[60] w-12 h-12 rounded-2xl bg-sage-800 text-cream flex items-center justify-center shadow-card-hover"
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
      >
        {isOpen ? (
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
            <path d="M18 6L6 18M6 6l12 12" />
          </svg>
        ) : (
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/>
          </svg>
        )}
      </motion.button>

      {/* Chat panel */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            className="fixed bottom-20 right-5 z-[60] w-[340px] max-h-[440px] flex flex-col rounded-3xl overflow-hidden shadow-card-hover"
            initial={{ opacity: 0, y: 20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.95 }}
            transition={{ type: 'spring', stiffness: 350, damping: 28 }}
          >
            {/* Header */}
            <div className="bg-sage-800 px-4 py-3 flex items-center gap-2.5">
              <span className="text-lg">💅</span>
              <div>
                <p className="font-body text-sm font-bold text-cream">Financial Bestie</p>
                <p className="font-body text-[10px] text-sage-300">AI-powered • Not financial advice</p>
              </div>
            </div>

            {/* Messages */}
            <div
              ref={scrollRef}
              className="flex-1 overflow-y-auto bg-cream p-3 space-y-2.5"
              style={{ maxHeight: '300px', minHeight: '200px' }}
            >
              {messages.map((msg, i) => (
                <div
                  key={i}
                  className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
                >
                  <div className={`max-w-[85%] rounded-2xl px-3.5 py-2.5 ${
                    msg.role === 'user'
                      ? 'bg-sage-800 text-cream rounded-br-md'
                      : 'glass rounded-bl-md'
                  }`}>
                    <p className={`font-body text-[13px] leading-relaxed ${
                      msg.role === 'user' ? 'text-cream' : 'text-sage-700'
                    }`}>
                      {msg.content}
                      {streaming && i === messages.length - 1 && msg.role === 'assistant' && (
                        <motion.span
                          className="inline-block w-0.5 h-3.5 bg-sage-400 ml-0.5 align-middle"
                          animate={{ opacity: [1, 0] }}
                          transition={{ duration: 0.5, repeat: Infinity }}
                        />
                      )}
                    </p>
                  </div>
                </div>
              ))}
            </div>

            {/* Input */}
            <div className="bg-cream border-t border-sage-100 p-2.5">
              <div className="flex gap-2">
                <input
                  value={input}
                  onChange={e => setInput(e.target.value)}
                  onKeyDown={e => e.key === 'Enter' && sendMessage()}
                  placeholder="Ask anything..."
                  className="flex-1 bg-white rounded-xl px-3.5 py-2.5 font-body text-[13px] text-sage-700 placeholder:text-warm-300 outline-none border border-sage-100 focus:border-sage-300 transition-colors"
                  disabled={streaming}
                />
                <button
                  onClick={sendMessage}
                  disabled={streaming || !input.trim()}
                  className="w-10 h-10 rounded-xl bg-sage-800 text-cream flex items-center justify-center disabled:opacity-40 transition-opacity"
                >
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M2.01 21L23 12 2.01 3 2 10l15 2-15 2z"/>
                  </svg>
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  )
}
