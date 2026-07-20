import { AnimatePresence, motion } from 'motion/react'
import { useState } from 'react'
import { ConnectionCard } from '../ConnectionCard'

type TokenKind = 'IDENT' | 'ASSIGN' | 'INT' | 'PLUS' | 'UNKNOWN'

interface Token {
  kind: TokenKind
  value: string
}

function tokenize(input: string): Token[] {
  const tokens: Token[] = []
  let i = 0
  while (i < input.length) {
    if (input[i] === ' ' || input[i] === '\t') {
      i++
      continue
    }
    if (/[a-zA-Z_]/.test(input[i])) {
      let j = i
      while (j < input.length && /[a-zA-Z0-9_]/.test(input[j])) j++
      tokens.push({ kind: 'IDENT', value: input.slice(i, j) })
      i = j
      continue
    }
    if (/[0-9]/.test(input[i])) {
      let j = i
      while (j < input.length && /[0-9]/.test(input[j])) j++
      tokens.push({ kind: 'INT', value: input.slice(i, j) })
      i = j
      continue
    }
    if (input[i] === '=') {
      tokens.push({ kind: 'ASSIGN', value: '=' })
      i++
      continue
    }
    if (input[i] === '+') {
      tokens.push({ kind: 'PLUS', value: '+' })
      i++
      continue
    }
    tokens.push({ kind: 'UNKNOWN', value: input[i] })
    i++
  }
  return tokens
}

const KIND_COLOR: Record<TokenKind, string> = {
  IDENT: 'var(--comp-ident, #6366f1)',
  ASSIGN: 'var(--comp-assign, #f59e0b)',
  INT: 'var(--comp-int, #3ecf8e)',
  PLUS: 'var(--comp-plus, #f59e0b)',
  UNKNOWN: 'var(--danger, #ef4444)',
}

export function CompLex({ onComplete }: { onComplete: () => void }) {
  const [input, setInput] = useState('x = 3 + y')
  const [tokens, setTokens] = useState<Token[]>([])
  const [tokenized, setTokenized] = useState(false)
  const [tokenizeCount, setTokenizeCount] = useState(0)

  const doTokenize = () => {
    const result = tokenize(input)
    setTokens(result)
    setTokenized(true)
    setTokenizeCount((c) => c + 1)
  }

  const clear = () => {
    setInput('')
    setTokens([])
    setTokenized(false)
  }

  const hasValidTokens = tokenized && tokens.some((t) => t.kind !== 'UNKNOWN')
  const hasError = tokens.some((t) => t.kind === 'UNKNOWN')

  return (
    <div className="lesson-panel">
      <p className="lede">
        The first thing a compiler does is <strong>break the source into tokens</strong> — typed chunks the parser
        can understand. Type an expression below and tokenize it.
      </p>

      <div className="comp-lex-input-row">
        <label htmlFor="lex-input" className="micro">Expression</label>
        <input
          id="lex-input"
          type="text"
          className="comp-lex-input"
          value={input}
          onChange={(e) => {
            setInput(e.target.value)
            setTokenized(false)
            setTokens([])
          }}
          placeholder="e.g. x = 3 + y"
        />
      </div>

      <div className="lesson-actions" style={{ marginBottom: '1rem' }}>
        <button type="button" className="btn primary" onClick={doTokenize} disabled={!input.trim()}>
          Tokenize
        </button>
        <button type="button" className="btn" onClick={clear}>
          Clear
        </button>
      </div>

      <div className="comp-lex-stream" aria-live="polite" aria-label="Token stream">
        <span className="micro">Token stream:</span>
        <div className="comp-lex-tokens">
          <AnimatePresence>
            {tokens.map((t, i) => (
              <motion.div
                key={`${tokenizeCount}-${i}`}
                className="comp-lex-token"
                style={{ borderColor: KIND_COLOR[t.kind], color: KIND_COLOR[t.kind] }}
                initial={{ opacity: 0, scale: 0.7, y: -10 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                transition={{
                  type: 'spring',
                  stiffness: 320,
                  damping: 22,
                  delay: i * 0.07,
                }}
              >
                <span className="comp-lex-token-kind">{t.kind}</span>
                <span className="comp-lex-token-value">({t.value})</span>
              </motion.div>
            ))}
          </AnimatePresence>
          {tokens.length === 0 && tokenized && (
            <span className="micro">No tokens — try typing something.</span>
          )}
        </div>
      </div>

      {hasError && (
        <motion.div
          className="comp-lex-error"
          initial={{ opacity: 0, y: 6 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ type: 'spring', stiffness: 320, damping: 22 }}
        >
          UNKNOWN token found — this character is not part of the language.
        </motion.div>
      )}

      <div className="comp-lex-legend">
        {(Object.keys(KIND_COLOR) as TokenKind[]).map((k) => (
          <span key={k} className="comp-lex-legend-item" style={{ color: KIND_COLOR[k] }}>
            ■ {k}
          </span>
        ))}
      </div>

      <ConnectionCard
        title="Every programming language starts with a lexer"
        body={
          <>
            HTML parsers, JSON parsers, CSS parsers, config file readers — they all begin by breaking the input
            into tokens. You just built one mentally. The next step is the parser, which checks that the{' '}
            <em>order</em> of those tokens makes grammatical sense.
          </>
        }
        appearsIn={['CompParse step', 'TypeScript compiler', 'every language runtime ever written']}
        hook="You have a token stream. Now the parser needs to check it follows grammar rules. Next: the parser."
      />

      <div className="lesson-actions">
        <button type="button" className="btn primary" onClick={onComplete} disabled={!hasValidTokens}>
          Continue to parser
        </button>
        {!hasValidTokens && (
          <span className="hint">Tokenize a valid expression first (e.g. x = 3 + y).</span>
        )}
      </div>
    </div>
  )
}
