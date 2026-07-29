type ClarityRequest = {
  question?: unknown
  context?: unknown
}

export async function POST(request: Request) {
  const key = process.env.OPENAI_API_KEY ?? process.env.ILP_OPENAI_API_KEY
  if (!key) {
    return Response.json(
      { error: 'The Clarity tutor is not configured for this deployment yet.' },
      { status: 503 },
    )
  }

  let body: ClarityRequest
  try {
    body = (await request.json()) as ClarityRequest
  } catch {
    return Response.json({ error: 'Request body must be valid JSON.' }, { status: 400 })
  }

  const question = typeof body.question === 'string' ? body.question.trim() : ''
  const context = typeof body.context === 'string' ? body.context.slice(0, 8000) : ''

  if (!question || question.length > 4000) {
    return Response.json({ error: 'Missing or invalid question (max 4000 chars).' }, { status: 400 })
  }

  try {
    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${key}`,
      },
      body: JSON.stringify({
        model: process.env.ILP_OPENAI_MODEL ?? 'gpt-4o-mini',
        messages: [
          {
            role: 'system',
            content: `You are a patient tutor for OKP Lab, a browser curriculum that teaches computing from bits on a wire through networks to LLM intuition. Be accurate, concise, and friendly. Avoid unexplained jargon. If unsure, say what is uncertain.

Lesson / screen context:
${context}`,
          },
          { role: 'user', content: question },
        ],
        max_tokens: 900,
      }),
    })

    const data = (await response.json()) as {
      choices?: Array<{ message?: { content?: string } }>
      error?: { message?: string }
    }

    if (!response.ok) {
      return Response.json(
        { error: data.error?.message ?? `OpenAI request failed (${response.status})` },
        { status: 502 },
      )
    }

    const answer = data.choices?.[0]?.message?.content?.trim()
    return Response.json({ answer: answer || 'No text in model response.' })
  } catch (error) {
    return Response.json(
      { error: error instanceof Error ? error.message : 'Server error' },
      { status: 500 },
    )
  }
}
