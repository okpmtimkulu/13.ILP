import { AnimatePresence, motion } from 'motion/react'
import { useState } from 'react'
import { ConnectionCard } from '../ConnectionCard'

interface ASTNodeData {
  id: string
  label: string
  sourceSnippet: string
  children?: string[]
}

const NODES: ASTNodeData[] = [
  { id: 'assign', label: 'Assign', sourceSnippet: 'x = 3 + y', children: ['ident-x', 'add'] },
  { id: 'ident-x', label: 'IDENT(x)', sourceSnippet: 'x' },
  { id: 'add', label: 'Add', sourceSnippet: '3 + y', children: ['int-3', 'ident-y'] },
  { id: 'int-3', label: 'INT(3)', sourceSnippet: '3' },
  { id: 'ident-y', label: 'IDENT(y)', sourceSnippet: 'y' },
]

const NODE_MAP = Object.fromEntries(NODES.map((n) => [n.id, n]))

type Transform = 'none' | 'minus' | 'ten'

function renderOutput(transform: Transform): string {
  if (transform === 'none') return 'mov rax, [y]\nmov rbx, 3\nadd rax, rbx\nmov [x], rax'
  if (transform === 'minus') return 'mov rax, [y]\nmov rbx, 3\nsub rax, rbx\nmov [x], rax'
  return 'mov rax, [y]\nmov rbx, 10\nadd rax, rbx\nmov [x], rax'
}

interface NodeButtonProps {
  node: ASTNodeData
  selected: string | null
  onSelect: (id: string) => void
  transform: Transform
}

function NodeButton({ node, selected, onSelect, transform }: NodeButtonProps) {
  const isSelected = selected === node.id
  const label =
    node.id === 'add' && transform === 'minus'
      ? 'Sub'
      : node.id === 'int-3' && transform === 'ten'
      ? 'INT(10)'
      : node.label

  return (
    <motion.button
      type="button"
      className={`comp-ast-node ${isSelected ? 'is-selected' : ''}`}
      onClick={() => onSelect(node.id)}
      animate={{
        scale: isSelected ? 1.06 : 1,
        borderColor: isSelected ? 'var(--signal)' : 'var(--border)',
      }}
      transition={{ type: 'spring', stiffness: 320, damping: 22 }}
    >
      {label}
    </motion.button>
  )
}

export function CompAST({ onComplete }: { onComplete: () => void }) {
  const [selected, setSelected] = useState<string | null>(null)
  const [transform, setTransform] = useState<Transform>('none')

  const selectedNode = selected ? NODE_MAP[selected] : null

  const applyMinus = () => setTransform('minus')
  const applyTen = () => setTransform('ten')

  return (
    <div className="lesson-panel">
      <p className="lede">
        The AST is the compiler's internal model of your program. Click any node to see which{' '}
        <strong>source snippet</strong> it represents. Then transform the tree and watch the output change.
      </p>

      <div className="comp-ast-layout">
        <div className="comp-ast-tree-col">
          <span className="micro">AST (click to inspect):</span>
          <div className="comp-ast-tree">
            <div className="comp-ast-level">
              <NodeButton node={NODE_MAP['assign']} selected={selected} onSelect={setSelected} transform={transform} />
            </div>
            <div className="comp-ast-level">
              <NodeButton node={NODE_MAP['ident-x']} selected={selected} onSelect={setSelected} transform={transform} />
              <NodeButton node={NODE_MAP['add']} selected={selected} onSelect={setSelected} transform={transform} />
            </div>
            <div className="comp-ast-level">
              <NodeButton node={NODE_MAP['int-3']} selected={selected} onSelect={setSelected} transform={transform} />
              <NodeButton node={NODE_MAP['ident-y']} selected={selected} onSelect={setSelected} transform={transform} />
            </div>
          </div>

          <AnimatePresence>
            {selectedNode && (
              <motion.div
                key={selected}
                className="comp-ast-inspect"
                initial={{ opacity: 0, y: 6 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0 }}
                transition={{ type: 'spring', stiffness: 320, damping: 22 }}
              >
                <span className="micro">Source for this node:</span>
                <code className="comp-ast-source-snippet">{selectedNode.sourceSnippet}</code>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        <div className="comp-ast-output-col">
          <span className="micro">Generated output:</span>
          <pre className="comp-ast-output">{renderOutput(transform)}</pre>
          <div className="comp-ast-transforms">
            <button
              type="button"
              className={`btn ${transform === 'minus' ? 'primary' : ''}`}
              onClick={applyMinus}
              disabled={transform === 'minus'}
            >
              Transform: + → -
            </button>
            <button
              type="button"
              className={`btn ${transform === 'ten' ? 'primary' : ''}`}
              onClick={applyTen}
              disabled={transform === 'ten'}
            >
              Transform: INT(3) → INT(10)
            </button>
          </div>
        </div>
      </div>

      <ConnectionCard
        title="ESLint, Prettier, TypeScript, and every IDE refactoring tool works on the AST"
        body={
          <>
            They never touch raw text. They parse the source into an AST, walk the tree, apply rules or
            transformations, and then pretty-print the result back to source. When you rename a variable in your
            IDE, the renaming happens on the AST — every reference node gets updated, not just text occurrences.
          </>
        }
        appearsIn={['CompCodegen step', 'TypeScript language server', 'Babel, ESLint, Prettier']}
        hook="You have an AST and you have seen how transforming it changes output. Next: code generation — the compiler walks the tree to emit instructions."
      />

      <div className="lesson-actions">
        <button type="button" className="btn primary" onClick={onComplete}>
          Continue to code generation
        </button>
      </div>
    </div>
  )
}
