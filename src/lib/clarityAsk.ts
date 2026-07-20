import { buildClarityContext } from './clarityContext'

const remote = import.meta.env.VITE_CLARITY_API_URL as string | undefined

export type ClarityResult =
  | { ok: true; answer: string }
  | { ok: false; error: string }

/**
 * Asks for a short tutor-style answer. In local dev, POST /api/clarity is served by Vite
 * when OPENAI_API_KEY is set. For production, set VITE_CLARITY_API_URL to your HTTPS
 * endpoint that accepts { question, context } and returns { answer }.
 */
export async function askClarity(question: string, pathname: string): Promise<ClarityResult> {
  const q = question.trim()
  if (!q) return { ok: false, error: 'Type a question first.' }
  if (q.length > 4000) return { ok: false, error: 'Please shorten your question (max 4000 characters).' }

  const context = buildClarityContext(pathname)
  const url = remote?.trim() ? remote.trim() : '/api/clarity'

  try {
    const res = await fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ question: q, context }),
    })
    const data = (await res.json()) as { answer?: string; error?: string }
    if (!res.ok) {
      return { ok: false, error: data.error ?? `Request failed (${res.status})` }
    }
    const answer = (data.answer ?? '').trim()
    if (!answer) return { ok: false, error: 'Empty response. Try again or check your API setup.' }
    return { ok: true, answer }
  } catch (e) {
    return { ok: false, error: e instanceof Error ? e.message : 'Network error' }
  }
}
