import { AnimatePresence, motion } from 'motion/react'
import { useState } from 'react'
import { ConnectionCard } from '../ConnectionCard'

type Method = 'GET' | 'POST' | 'PUT' | 'DELETE'

interface ResponseData {
  status: number
  statusText: string
  headers: string
  body: string
}

function getStatusColor(status: number): string {
  if (status >= 200 && status < 300) return 'var(--success, #3ecf8e)'
  if (status === 401) return 'var(--warn, #f59e0b)'
  return 'var(--danger, #ef4444)'
}

function buildResponse(method: Method, path: string): ResponseData {
  if (path.startsWith('/error')) {
    return {
      status: 404,
      statusText: 'Not Found',
      headers: 'Content-Type: application/json\nX-Request-ID: abc-123',
      body: JSON.stringify({ error: 'Resource not found', path }, null, 2),
    }
  }
  if (path.startsWith('/secret')) {
    return {
      status: 401,
      statusText: 'Unauthorized',
      headers: 'Content-Type: application/json\nWWW-Authenticate: Bearer',
      body: JSON.stringify({ error: 'Authentication required' }, null, 2),
    }
  }
  if (method === 'DELETE') {
    return {
      status: 204,
      statusText: 'No Content',
      headers: 'X-Request-ID: def-456',
      body: '',
    }
  }
  if (method === 'POST' || method === 'PUT') {
    return {
      status: 201,
      statusText: 'Created',
      headers: 'Content-Type: application/json\nLocation: /api/users/42',
      body: JSON.stringify({ id: 42, created: true }, null, 2),
    }
  }
  return {
    status: 200,
    statusText: 'OK',
    headers: 'Content-Type: application/json\nCache-Control: max-age=60',
    body: JSON.stringify({ users: [{ id: 1, name: 'Alice' }, { id: 2, name: 'Bob' }] }, null, 2),
  }
}

export function WebHTTP({ onComplete }: { onComplete: () => void }) {
  const [method, setMethod] = useState<Method>('GET')
  const [path, setPath] = useState('/api/users')
  const [header, setHeader] = useState('Accept: application/json')
  const [body, setBody] = useState('{"name": "Charlie"}')
  const [response, setResponse] = useState<ResponseData | null>(null)
  const [requestCount, setRequestCount] = useState(0)

  const showBody = method === 'POST' || method === 'PUT'

  const rawRequest = [
    `${method} ${path} HTTP/1.1`,
    `Host: api.example.com`,
    header,
    ...(showBody ? ['Content-Type: application/json', '', body] : ['']),
  ].join('\n')

  const sendRequest = () => {
    const resp = buildResponse(method, path)
    setResponse(resp)
    setRequestCount((c) => c + 1)
  }

  const isDone = requestCount >= 2

  return (
    <div className="lesson-panel">
      <p className="lede">
        HTTP is a <strong>conversation</strong>. The client speaks first — stating a verb, a path, and some headers.
        The server replies with a status code and a body. Build and send requests below.
      </p>

      <div className="web-http-builder">
        <h3 className="micro">Request builder</h3>
        <div className="web-http-fields">
          <label className="web-http-field">
            <span className="web-http-field-label">Method</span>
            <select
              className="web-http-select"
              value={method}
              onChange={(e) => setMethod(e.target.value as Method)}
            >
              <option value="GET">GET</option>
              <option value="POST">POST</option>
              <option value="PUT">PUT</option>
              <option value="DELETE">DELETE</option>
            </select>
          </label>
          <label className="web-http-field">
            <span className="web-http-field-label">Path</span>
            <input
              type="text"
              className="web-http-input"
              value={path}
              onChange={(e) => setPath(e.target.value)}
            />
          </label>
          <label className="web-http-field">
            <span className="web-http-field-label">Header</span>
            <input
              type="text"
              className="web-http-input"
              value={header}
              onChange={(e) => setHeader(e.target.value)}
            />
          </label>
          {showBody && (
            <label className="web-http-field web-http-field--full">
              <span className="web-http-field-label">Body (JSON)</span>
              <textarea
                className="web-http-textarea"
                value={body}
                onChange={(e) => setBody(e.target.value)}
                rows={3}
              />
            </label>
          )}
        </div>

        <div className="web-http-raw">
          <span className="micro">Raw HTTP message being built:</span>
          <pre className="web-http-raw-text">{rawRequest}</pre>
        </div>

        <button type="button" className="btn primary" onClick={sendRequest}>
          Send →
        </button>
        <span className="hint">Try paths like /error or /secret for different status codes.</span>
      </div>

      <AnimatePresence mode="wait">
        {response && (
          <motion.div
            key={requestCount}
            className="web-http-response"
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ type: 'spring', stiffness: 320, damping: 22 }}
          >
            <h3 className="micro">Response</h3>
            <div className="web-http-status-line">
              <span
                className="web-http-status-code"
                style={{ color: getStatusColor(response.status) }}
              >
                {response.status}
              </span>
              <span className="web-http-status-text">{response.statusText}</span>
            </div>
            <pre className="web-http-response-headers">{response.headers}</pre>
            {response.body && (
              <pre className="web-http-response-body">{response.body}</pre>
            )}
          </motion.div>
        )}
      </AnimatePresence>

      <ConnectionCard
        title="Every button click sends an HTTP request like this"
        body={
          <>
            The verb tells the server what to do: <em>GET</em> fetches data, <em>POST</em> creates it, <em>PUT</em>{' '}
            replaces it, <em>DELETE</em> removes it. Status codes are the server's reply code — 2xx means success,
            4xx means your mistake, 5xx means theirs.
          </>
        }
        appearsIn={['REST APIs', 'browser dev tools Network tab', 'TLS which wraps this conversation']}
        hook="HTTP sends data in plaintext. TLS adds the envelope — next."
      />

      <div className="lesson-actions">
        <button type="button" className="btn primary" onClick={onComplete} disabled={!isDone}>
          Continue to TLS
        </button>
        {!isDone && (
          <span className="hint">
            Send {2 - requestCount} more request{2 - requestCount !== 1 ? 's' : ''} (try different methods or paths).
          </span>
        )}
      </div>
    </div>
  )
}
