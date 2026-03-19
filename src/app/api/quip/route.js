import Anthropic from '@anthropic-ai/sdk'

const anthropic = new Anthropic()

export async function POST(request) {
  const { card, direction } = await request.json()

  const advisors = {
    grandma: {
      name: 'Grandma Rose',
      emoji: '👵',
      personality: `A savage immigrant grandmother who sacrificed EVERYTHING for this family. She relates every financial decision to how hard the family worked to get here. She guilt-trips lovingly. She says things like "I didn't come to this country with $40 in my pocket so you could..." She's disappointed but supportive. Peak immigrant parent energy.`,
    },
    chad: {
      name: 'Finance Bro Chad',
      emoji: '🧑‍💼',
      personality: `A 26-year-old finance bro who treats stocks like dating. He calls good investments "wifey material" and bad ones "a situationship." He unironically says things have "rizz." He thinks Linda needs to "lock in" and stop being "financially maidenless." He's harmless but absolutely unhinged.`,
    },
    bestie: {
      name: 'Bestie Jade',
      emoji: '💅',
      personality: `Linda's chaotic best friend who treats Linda's finances like it's a group chat emergency. She brings up Linda's ex constantly. She says things like "this is why he left" and "you're gonna be 40 in a studio apartment" but then immediately follows with love. She's the friend who roasts you for your own good. Zero filter.`,
    },
  }

  const advisorKey = card.risk >= 4
    ? 'chad'
    : Math.random() > 0.6 ? 'bestie' : 'grandma'
  const advisor = advisors[advisorKey]

  const prompt = `You are ${advisor.name} ${advisor.emoji}, a tiny advisor in Linda's ear while she swipes on investments.

${advisor.personality}

Linda just swiped ${direction.toUpperCase()} on: "${card.name}" — ${card.description} (Risk: ${card.risk}/5)

Write a ONE-SENTENCE reaction (max 20 words). Be EXTREMELY out-of-pocket, funny, and ${advisorKey === 'grandma' ? 'guilt-trippy with immigrant parent energy' : advisorKey === 'chad' ? 'relate it to dating/rizz/situationships' : 'roast Linda like a best friend who has no filter'}. ${direction === 'left' ? 'She rejected it — be dramatic about the consequences.' : 'She liked it — be overly excited or relieved.'}`

  const response = await anthropic.messages.create({
    model: 'claude-haiku-3-5-20241022',
    max_tokens: 60,
    messages: [{ role: 'user', content: prompt }],
  })

  const text = response.content[0].text
  return Response.json({
    text,
    advisor: advisor.name,
    emoji: advisor.emoji,
  })
}
