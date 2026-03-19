import Anthropic from '@anthropic-ai/sdk'

const anthropic = new Anthropic()

export async function POST(request) {
  const { type, matches, rejected, message, history } = await request.json()

  if (type === 'future-letter') {
    const matchNames = matches.map(m => `${m.emoji} ${m.name} (risk ${m.risk}/5, returns ${m.returns})`).join(', ')
    const rejectedNames = (rejected || []).map(m => `${m.emoji} ${m.name}`).join(', ')
    const hasYolo = matches.some(m => m.risk >= 5)
    const allYolo = matches.every(m => m.risk >= 5)
    const avgRisk = matches.reduce((s, m) => s + m.risk, 0) / matches.length

    const prompt = `Write a short letter (150 words max) from "Future Linda, 5 years from now" to present-day Linda about the financial choices she just made.

She matched with: ${matchNames}
She rejected: ${rejectedNames || 'nothing — she liked everything'}

Context:
- Linda is 34, scared of the stock market, just used a Tinder-style app to find investments
- ${allYolo ? 'She ONLY picked the dangerous/meme investments. Future Linda should be writing from funny dire circumstances but still be encouraging.' : hasYolo ? 'She picked a mix of safe AND risky investments. Future Linda should be amused but optimistic.' : avgRisk <= 1.5 ? 'She played it very safe. Future Linda should be grateful but maybe gently nudge her to be slightly braver next time.' : 'She made solid, balanced choices. Future Linda should be proud and excited about how it turned out.'}

Rules:
- Write as Future Linda talking to Present Linda — warm, unhinged, personal
- Reference SPECIFIC investments she picked by name
- Include a concrete (fictional but realistic) dollar amount she has now
- Relate her financial journey to her love life / situationships / self-worth — like "I finally stopped going back to my 0.01% checking account the same way I stopped texting back my ex"
- Keep it conversational, chaotic bestie energy, like a voice note at 1am
- Be out-of-pocket but ultimately empowering and encouraging
- No bullet points. Just flowing text with unhinged personality.
- Start with "Dear Past Me," and sign off with "— Linda, 2031 ✨"
- Max 150 words. Every sentence should hit.`

    const stream = anthropic.messages.stream({
      model: 'claude-sonnet-4-5-20250514',
      max_tokens: 400,
      messages: [{ role: 'user', content: prompt }],
    })

    const encoder = new TextEncoder()
    const readable = new ReadableStream({
      async start(controller) {
        for await (const event of stream) {
          if (event.type === 'content_block_delta' && event.delta.type === 'text_delta') {
            controller.enqueue(encoder.encode(event.delta.text))
          }
        }
        controller.close()
      },
    })

    return new Response(readable, {
      headers: {
        'Content-Type': 'text/plain; charset=utf-8',
        'Transfer-Encoding': 'chunked',
      },
    })
  }

  if (type === 'chat') {
    const matchNames = matches.map(m => `${m.emoji} ${m.name} (risk ${m.risk}/5, returns ${m.returns}): ${m.description}`).join('\n')

    const systemPrompt = `You are Linda's "Financial Bestie" — an unhinged, supportive, chaotic-good AI friend who treats investing like dating advice.

Linda is 34, nervous about the stock market, and just picked these investments using a Tinder-style swiping app:

${matchNames}

Rules:
- Keep responses SHORT (2-3 sentences max)
- Zero jargon — explain everything through dating/relationship metaphors
- Be encouraging but out-of-pocket — "girl that ETF is giving green flags" energy
- Use chaotic bestie language — "bestie", "no because", "the way I...", "this is giving"
- Relate investments to situationships, exes, self-worth, and knowing your worth
- If she asks about something risky, be honest but frame it as relationship red flags
- Reference her specific picks when relevant
- You're sending a voice note at 1am, not writing an essay
- Be genuinely helpful with the financial info but wrap it in unhinged energy`

    const messages = (history || []).map(m => ({
      role: m.role,
      content: m.content,
    }))
    messages.push({ role: 'user', content: message })

    const stream = anthropic.messages.stream({
      model: 'claude-sonnet-4-5-20250514',
      max_tokens: 200,
      system: systemPrompt,
      messages,
    })

    const encoder = new TextEncoder()
    const readable = new ReadableStream({
      async start(controller) {
        for await (const event of stream) {
          if (event.type === 'content_block_delta' && event.delta.type === 'text_delta') {
            controller.enqueue(encoder.encode(event.delta.text))
          }
        }
        controller.close()
      },
    })

    return new Response(readable, {
      headers: {
        'Content-Type': 'text/plain; charset=utf-8',
        'Transfer-Encoding': 'chunked',
      },
    })
  }

  if (type === 'advisor-quip') {
    const { card, advisorType } = await request.json().catch(() => ({ card: null, advisorType: 'cautious' }))
    // Not used for streaming, quick response
    return Response.json({ error: 'Use specific types' }, { status: 400 })
  }

  return Response.json({ error: 'Unknown type' }, { status: 400 })
}
