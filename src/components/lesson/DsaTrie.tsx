import { AnimatePresence, motion } from 'motion/react'
import { useState } from 'react'
import { ConnectionCard } from '../ConnectionCard'

const WORDS = ['apple', 'app', 'apt', 'bat', 'ball', 'band']

interface TrieNode {
  children: Record<string, TrieNode>
  isEnd: boolean
  word?: string
}

function buildTrie(words: string[]): TrieNode {
  const root: TrieNode = { children: {}, isEnd: false }
  for (const word of words) {
    let node = root
    for (const ch of word) {
      if (!node.children[ch]) node.children[ch] = { children: {}, isEnd: false }
      node = node.children[ch]
    }
    node.isEnd = true
    node.word = word
  }
  return root
}

function searchTrie(root: TrieNode, prefix: string): string[] {
  let node = root
  for (const ch of prefix) {
    if (!node.children[ch]) return []
    node = node.children[ch]
  }
  const results: string[] = []
  function collect(n: TrieNode) {
    if (n.isEnd && n.word) results.push(n.word)
    for (const child of Object.values(n.children)) collect(child)
  }
  collect(node)
  return results.sort()
}

function TrieNodeViz({ node, label, prefix, highlightPrefix }: {
  node: TrieNode
  label: string
  prefix: string
  highlightPrefix: string
}) {
  const isHighlighted = highlightPrefix.length > 0 && prefix.startsWith(highlightPrefix.slice(0, prefix.length))
  const isMatch = highlightPrefix.length > 0 && prefix === highlightPrefix

  return (
    <div className="dsa-trie-node-wrap">
      <motion.div
        className={`dsa-trie-node ${isMatch ? 'is-match' : isHighlighted ? 'is-highlighted' : ''} ${node.isEnd ? 'is-end' : ''}`}
        animate={{
          backgroundColor: isMatch
            ? 'var(--signal)'
            : isHighlighted
            ? 'var(--signal-dim, rgba(99,102,241,0.2))'
            : 'var(--surface-2)',
        }}
        transition={{ type: 'spring', stiffness: 320, damping: 22 }}
      >
        {label}
        {node.isEnd && <span className="dsa-trie-end-dot" title="word ends here">●</span>}
      </motion.div>
      {Object.keys(node.children).length > 0 && (
        <div className="dsa-trie-children">
          {Object.entries(node.children).map(([ch, child]) => (
            <TrieNodeViz
              key={ch}
              node={child}
              label={ch}
              prefix={prefix + ch}
              highlightPrefix={highlightPrefix}
            />
          ))}
        </div>
      )}
    </div>
  )
}

export function DsaTrie({ onComplete }: { onComplete: () => void }) {
  const [insertedCount, setInsertedCount] = useState(0)
  const [searchQuery, setSearchQuery] = useState('')
  const [searchResults, setSearchResults] = useState<string[]>([])
  const [searchCount, setSearchCount] = useState(0)
  const [highlightPrefix, setHighlightPrefix] = useState('')

  const insertedWords = WORDS.slice(0, insertedCount)
  const trie = buildTrie(insertedWords)

  const insertNext = () => {
    if (insertedCount < WORDS.length) setInsertedCount((c) => c + 1)
  }

  const insertAll = () => setInsertedCount(WORDS.length)

  const doSearch = () => {
    if (!searchQuery || insertedCount < WORDS.length) return
    const results = searchTrie(trie, searchQuery)
    setSearchResults(results)
    setHighlightPrefix(searchQuery)
    setSearchCount((c) => c + 1)
  }

  const isDone = insertedCount >= WORDS.length && searchCount >= 2

  return (
    <div className="lesson-panel">
      <p className="lede">
        A <strong>trie</strong> (prefix tree) shares prefixes between words. Insert all six words, then search by
        prefix to instantly find every word that starts with those characters.
      </p>

      <div className="dsa-trie-words">
        <span className="micro">Words to insert:</span>
        <div className="dsa-trie-word-list">
          {WORDS.map((w, i) => (
            <span
              key={w}
              className={`dsa-trie-word ${i < insertedCount ? 'is-inserted' : ''}`}
            >
              {w}
            </span>
          ))}
        </div>
        <div className="dsa-trie-insert-btns">
          <button type="button" className="btn primary" onClick={insertNext} disabled={insertedCount >= WORDS.length}>
            Insert "{WORDS[insertedCount] ?? '—'}"
          </button>
          <button type="button" className="btn" onClick={insertAll} disabled={insertedCount >= WORDS.length}>
            Insert all
          </button>
        </div>
      </div>

      <div className="dsa-trie-viz">
        <span className="micro">Trie structure:</span>
        <div className="dsa-trie-root-wrap">
          <div className="dsa-trie-root-label">root</div>
          <div className="dsa-trie-children">
            {Object.entries(trie.children).map(([ch, child]) => (
              <TrieNodeViz
                key={ch}
                node={child}
                label={ch}
                prefix={ch}
                highlightPrefix={highlightPrefix}
              />
            ))}
          </div>
        </div>
      </div>

      <div className="dsa-trie-search">
        <label className="micro">Search prefix:</label>
        <div className="dsa-trie-search-row">
          <input
            type="text"
            className="dsa-trie-input"
            value={searchQuery}
            onChange={(e) => { setSearchQuery(e.target.value); setHighlightPrefix('') }}
            onKeyDown={(e) => e.key === 'Enter' && doSearch()}
            placeholder="e.g. ap, ba, xyz"
            disabled={insertedCount < WORDS.length}
          />
          <button type="button" className="btn primary" onClick={doSearch} disabled={!searchQuery || insertedCount < WORDS.length}>
            Search
          </button>
        </div>

        <AnimatePresence>
          {searchCount > 0 && (
            <motion.div
              className="dsa-trie-results"
              initial={{ opacity: 0, y: 6 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              transition={{ type: 'spring', stiffness: 320, damping: 22 }}
            >
              {searchResults.length > 0 ? (
                <>
                  <span className="micro">Words with prefix "{highlightPrefix}":</span>
                  <strong>{searchResults.join(', ')}</strong>
                </>
              ) : (
                <span className="micro">No words with prefix "{highlightPrefix}"</span>
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      <p className="micro" role="status">
        Words inserted: {insertedCount}/{WORDS.length}. Searches: {searchCount}/2 needed.
      </p>

      <ConnectionCard
        title="Your phone's autocomplete, Google's search suggestions, and IP routing tables all use tries"
        body={
          <>
            IP routing uses a CIDR trie where each level represents one bit of the address. BGP routers find
            the longest matching prefix in microseconds across millions of routes. Your browser's URL bar
            autocomplete is a trie over your history. The phone keyboard suggestion is a trie over a dictionary.
          </>
        }
        appearsIn={['networking layer routing tables', 'search autocomplete in every app', 'DNS compression in packets']}
        hook="Tries unify strings by prefix. What about unifying sets of nodes by connectivity? Next: Union-Find."
      />

      <div className="lesson-actions">
        <button type="button" className="btn primary" onClick={onComplete} disabled={!isDone}>
          Continue to Union-Find
        </button>
        {!isDone && (
          <span className="hint">
            {insertedCount < WORDS.length ? 'Insert all words first. ' : ''}
            {searchCount < 2 ? `Search ${2 - searchCount} more time${2 - searchCount !== 1 ? 's' : ''}. ` : ''}
          </span>
        )}
      </div>
    </div>
  )
}
