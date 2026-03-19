'use client'

import { useState, useCallback } from 'react'
import { AnimatePresence } from 'framer-motion'
import { cards } from '../data/cards'
import WelcomeScreen from '../components/WelcomeScreen'
import CardStack from '../components/CardStack'
import ResultsScreen from '../components/ResultsScreen'
import PortfolioBar from '../components/PortfolioBar'

export default function Home() {
  const [screen, setScreen] = useState('welcome')
  const [matches, setMatches] = useState([])
  const [rejected, setRejected] = useState([])
  const [aura, setAura] = useState(0)

  const handleStart = useCallback(() => setScreen('swiping'), [])
  const handleComplete = useCallback(() => setScreen('results'), [])
  const handleRestart = useCallback(() => {
    setMatches([])
    setRejected([])
    setAura(0)
    setScreen('welcome')
  }, [])

  return (
    <main className="relative">
      <AnimatePresence mode="wait">
        {screen === 'welcome' && (
          <WelcomeScreen key="welcome" onStart={handleStart} />
        )}
        {screen === 'swiping' && (
          <CardStack
            key="swiping"
            cards={cards}
            matches={matches}
            setMatches={setMatches}
            rejected={rejected}
            setRejected={setRejected}
            aura={aura}
            setAura={setAura}
            onComplete={handleComplete}
          />
        )}
        {screen === 'results' && (
          <ResultsScreen
            key="results"
            matches={matches}
            rejected={rejected}
            aura={aura}
            onRestart={handleRestart}
          />
        )}
      </AnimatePresence>

      {screen === 'swiping' && (
        <PortfolioBar matches={matches} total={cards.length} aura={aura} />
      )}
    </main>
  )
}
