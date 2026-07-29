import react from '@vitejs/plugin-react'
import type { IncomingMessage, ServerResponse } from 'node:http'
import type { Plugin } from 'vite'
import { defineConfig } from 'vite'

async function readJsonBody(req: IncomingMessage): Promise<unknown> {
  const chunks: Buffer[] = []
  for await (const chunk of req) {
    chunks.push(chunk as Buffer)
  }
  const raw = Buffer.concat(chunks).toString('utf8')
  if (!raw) return null
  try {
    return JSON.parse(raw) as unknown
  } catch {
    return null
  }
}

function sendJson(res: ServerResponse, status: number, body: object) {
  res.statusCode = status
  res.setHeader('Content-Type', 'application/json; charset=utf-8')
  res.end(JSON.stringify(body))
}

/** Local Vite development only: forwards to OpenAI using a server-side API key. */
function clarityApiPlugin(): Plugin {
  return {
    name: 'ilp-clarity-api',
    configureServer(server) {
      server.middlewares.use(async (req, res, next) => {
        const url = req.url ?? ''
        if (!url.startsWith('/api/clarity') || req.method !== 'POST') {
          next()
          return
        }
        const key = process.env.OPENAI_API_KEY ?? process.env.ILP_OPENAI_API_KEY
        if (!key) {
          sendJson(res as ServerResponse, 503, {
            error:
              'No OPENAI_API_KEY in the environment. For local dev, create a .env file with OPENAI_API_KEY=sk-... and restart npm run dev. For production, set VITE_CLARITY_API_URL to your own HTTPS endpoint that accepts POST { question, context } and returns { answer }.',
          })
          return
        }

        const raw = await readJsonBody(req as IncomingMessage)
        const body = raw as { question?: string; context?: string } | null
        const question = typeof body?.question === 'string' ? body.question.trim() : ''
        const context = typeof body?.context === 'string' ? body.context.slice(0, 8000) : ''

        if (!question || question.length > 4000) {
          sendJson(res as ServerResponse, 400, { error: 'Missing or invalid question (max 4000 chars).' })
          return
        }

        const model = process.env.ILP_OPENAI_MODEL ?? 'gpt-4o-mini'

        try {
          const r = await fetch('https://api.openai.com/v1/chat/completions', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              Authorization: `Bearer ${key}`,
            },
            body: JSON.stringify({
              model,
              messages: [
                {
                  role: 'system',
                  content: `You are a patient tutor for ILP Lab, a browser curriculum that teaches computing from bits on a wire through networks to LLM intuition. Be accurate, concise, and friendly. Avoid unexplained jargon. If unsure, say what is uncertain.

Lesson / screen context:
${context}`,
                },
                { role: 'user', content: question },
              ],
              max_tokens: 900,
            }),
          })

          const data = (await r.json()) as {
            choices?: { message?: { content?: string } }[]
            error?: { message?: string }
          }

          if (!r.ok) {
            sendJson(res as ServerResponse, 502, {
              error: data.error?.message ?? `OpenAI request failed (${r.status})`,
            })
            return
          }

          const text = (data.choices?.[0]?.message?.content ?? '').trim()
          sendJson(res as ServerResponse, 200, { answer: text || 'No text in model response.' })
        } catch (e) {
          sendJson(res as ServerResponse, 500, { error: e instanceof Error ? e.message : 'Server error' })
        }
      })
    },
  }
}

export default defineConfig({
  plugins: [react(), clarityApiPlugin()],
})
