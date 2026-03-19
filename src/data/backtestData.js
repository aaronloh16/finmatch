// Weekly multipliers per category over 12 weeks (Jan 6 - Mar 18, 2026)
// Each value is a cumulative multiplier from that category's start point
// e.g., 1.012 means +1.2% total return since week 0
export const weeklyMultipliers = {
  savings:       [1.0, 1.001, 1.002, 1.003, 1.004, 1.005, 1.006, 1.007, 1.008, 1.009, 1.010, 1.011, 1.012],
  bonds:         [1.0, 1.001, 1.003, 1.004, 1.006, 1.007, 1.008, 1.010, 1.011, 1.012, 1.013, 1.014, 1.015],
  funds:         [1.0, 1.003, 1.008, 1.005, 1.012, 1.018, 1.015, 1.022, 1.019, 1.025, 1.032, 1.029, 1.038],
  stocks:        [1.0, 1.006, 1.018, 1.010, 1.025, 1.035, 1.028, 1.042, 1.035, 1.052, 1.062, 1.055, 1.068],
  'real-estate': [1.0, 1.002, 1.007, 1.012, 1.009, 1.015, 1.020, 1.018, 1.024, 1.028, 1.022, 1.030, 1.035],
  yolo:          [1.0, 1.18, 0.75, 1.45, 0.50, 1.15, 0.30, 0.85, 1.70, 0.40, 0.65, 0.28, 0.19],
}

export const weekLabels = [
  'Jan 6', 'Jan 13', 'Jan 20', 'Jan 27',
  'Feb 3', 'Feb 10', 'Feb 17', 'Feb 24',
  'Mar 3', 'Mar 10', 'Mar 17', 'Today'
]

// DCA contribution schedule: Linda gets paid biweekly (~$1,250 per paycheck from $2,500/mo)
// She invests a chunk each payday. This models contributions at weeks 0, 2, 4, 6, 8, 10
export const DCA_CONTRIBUTION = 625 // per week she contributes (~$2,500/mo / 4 weeks)
export const MONTHLY_INCOME = 2500
export const CONTRIBUTION_WEEKS = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11] // weekly contributions

// Milestones for fun comparisons
export const funComparisons = [
  { threshold: 50, emoji: '☕', text: 'enough for 10 fancy lattes' },
  { threshold: 100, emoji: '🎧', text: 'a pair of AirPods' },
  { threshold: 200, emoji: '✈️', text: 'a domestic flight' },
  { threshold: 500, emoji: '🛍️', text: 'a solid shopping spree' },
  { threshold: 1000, emoji: '📱', text: 'a new iPhone' },
  { threshold: 2000, emoji: '🏖️', text: 'a vacation' },
  { threshold: 5000, emoji: '🚗', text: 'a down payment on a car' },
]

// What Linda's money would have earned sitting in a checking account (0.01% APY)
export const checkingMultipliers = [1.0, 1.0, 1.0, 1.0, 1.0, 1.0, 1.0, 1.0, 1.0, 1.0, 1.0, 1.0, 1.0]
