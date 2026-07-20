import { motion, AnimatePresence } from 'motion/react'
import { useState } from 'react'
import { ConnectionCard } from '../ConnectionCard'

type NfStep = '0NF' | '1NF' | '2NF' | '3NF' | 'JOIN'

const DENORM_ROWS = [
  { order_id: 1, customer_name: 'Alice', customer_email: 'alice@ex.com', product_name: 'Widget', product_price: 9.99 },
  { order_id: 2, customer_name: 'Alice', customer_email: 'alice@ex.com', product_name: 'Gadget', product_price: 24.99 },
  { order_id: 3, customer_name: 'Bob', customer_email: 'bob@ex.com', product_name: 'Widget', product_price: 9.99 },
  { order_id: 4, customer_name: 'Alice', customer_email: 'alice@ex.com', product_name: 'Gizmo', product_price: 14.99 },
  { order_id: 5, customer_name: 'Carol', customer_email: 'carol@ex.com', product_name: 'Gadget', product_price: 24.99 },
  { order_id: 6, customer_name: 'Bob', customer_email: 'bob@ex.com', product_name: 'Gizmo', product_price: 14.99 },
  { order_id: 7, customer_name: 'Carol', customer_email: 'carol@ex.com', product_name: 'Widget', product_price: 9.99 },
  { order_id: 8, customer_name: 'Alice', customer_email: 'alice@ex.com', product_name: 'Gadget', product_price: 24.99 },
]

export function DbNormalize({ onComplete }: { onComplete: () => void }) {
  const [step, setStep] = useState<NfStep>('0NF')
  const [updateEmail, setUpdateEmail] = useState(false)
  const [done, setDone] = useState(false)

  const aliceRows = DENORM_ROWS.filter((r) => r.customer_name === 'Alice').length

  return (
    <div className="lesson-panel">
      <p className="lede">
        A denormalized <em>orders</em> table repeats customer and product data on every row. Normalization splits it into
        smaller tables — eliminating update anomalies at the cost of JOINs to read.
      </p>

      <div className="db-norm-stage">
        <div className="db-norm-tabs">
          {(['0NF', '1NF', '2NF', '3NF', 'JOIN'] as NfStep[]).map((s) => (
            <button
              key={s}
              type="button"
              className={`db-norm-tab ${step === s ? 'db-norm-tab--active' : ''}`}
              onClick={() => setStep(s)}
            >
              {s}
            </button>
          ))}
        </div>

        <AnimatePresence mode="wait">
          {step === '0NF' && (
            <motion.div
              key="0NF"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ type: 'spring', stiffness: 320, damping: 22 }}
            >
              <p className="micro">Denormalized orders table — Alice appears {aliceRows} times</p>
              <div className="db-norm-table-wrap">
                <table className="db-norm-table">
                  <thead>
                    <tr>
                      <th>order_id</th>
                      <th>customer_name</th>
                      <th>customer_email</th>
                      <th>product_name</th>
                      <th>product_price</th>
                    </tr>
                  </thead>
                  <tbody>
                    {DENORM_ROWS.map((row) => (
                      <tr key={row.order_id} className={row.customer_name === 'Alice' ? 'db-norm-row--alice' : ''}>
                        <td>{row.order_id}</td>
                        <td>{row.customer_name}</td>
                        <td className={updateEmail && row.customer_name === 'Alice' ? 'db-norm-cell--updated' : ''}>
                          {updateEmail && row.customer_name === 'Alice' ? 'alice2@ex.com' : row.customer_email}
                        </td>
                        <td>{row.product_name}</td>
                        <td>${row.product_price}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              {!updateEmail ? (
                <div className="lesson-actions" style={{ marginTop: '1rem' }}>
                  <button type="button" className="btn primary" onClick={() => setUpdateEmail(true)}>
                    Update Alice's email
                  </button>
                  <span className="hint">{aliceRows} rows to update</span>
                </div>
              ) : (
                <p className="db-norm-anomaly">
                  {aliceRows} rows updated for a single email change. Miss one → data inconsistency.
                </p>
              )}
            </motion.div>
          )}

          {step === '1NF' && (
            <motion.div
              key="1NF"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ type: 'spring', stiffness: 320, damping: 22 }}
            >
              <p className="micro">1NF: Atomic values only. Each cell holds one value (no comma-separated lists).</p>
              <div className="db-norm-rule">
                <span className="db-norm-rule-ok">Each column holds exactly one value per row</span>
                <span className="micro">Our table already satisfies 1NF</span>
              </div>
            </motion.div>
          )}

          {step === '2NF' && (
            <motion.div
              key="2NF"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ type: 'spring', stiffness: 320, damping: 22 }}
            >
              <p className="micro">2NF: Split columns that depend only on part of the primary key into their own tables.</p>
              <div className="db-norm-split">
                <div className="db-norm-split-table">
                  <strong>customers</strong>
                  <table className="db-norm-table">
                    <thead>
                      <tr><th>id</th><th>name</th><th>email</th></tr>
                    </thead>
                    <tbody>
                      <tr><td>1</td><td>Alice</td><td>alice@ex.com</td></tr>
                      <tr><td>2</td><td>Bob</td><td>bob@ex.com</td></tr>
                      <tr><td>3</td><td>Carol</td><td>carol@ex.com</td></tr>
                    </tbody>
                  </table>
                </div>
                <div className="db-norm-split-table">
                  <strong>products</strong>
                  <table className="db-norm-table">
                    <thead>
                      <tr><th>id</th><th>name</th><th>price</th></tr>
                    </thead>
                    <tbody>
                      <tr><td>1</td><td>Widget</td><td>$9.99</td></tr>
                      <tr><td>2</td><td>Gadget</td><td>$24.99</td></tr>
                      <tr><td>3</td><td>Gizmo</td><td>$14.99</td></tr>
                    </tbody>
                  </table>
                </div>
              </div>
              <p className="micro" style={{ marginTop: '0.75rem' }}>Update Alice's email: 1 row.</p>
            </motion.div>
          )}

          {step === '3NF' && (
            <motion.div
              key="3NF"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ type: 'spring', stiffness: 320, damping: 22 }}
            >
              <p className="micro">3NF: No transitive dependencies — every non-key column depends on the primary key only.</p>
              <div className="db-norm-split">
                <div className="db-norm-split-table">
                  <strong>orders</strong>
                  <table className="db-norm-table">
                    <thead>
                      <tr><th>order_id</th><th>customer_id</th><th>product_id</th></tr>
                    </thead>
                    <tbody>
                      {DENORM_ROWS.slice(0, 4).map((row) => (
                        <tr key={row.order_id}>
                          <td>{row.order_id}</td>
                          <td>{row.customer_name === 'Alice' ? 1 : row.customer_name === 'Bob' ? 2 : 3}</td>
                          <td>{row.product_name === 'Widget' ? 1 : row.product_name === 'Gadget' ? 2 : 3}</td>
                        </tr>
                      ))}
                      <tr><td>...</td><td>...</td><td>...</td></tr>
                    </tbody>
                  </table>
                </div>
              </div>
              <div className="db-norm-benefit">
                <span className="db-norm-rule-ok">Update Alice's email: exactly 1 row in customers table</span>
                <span className="db-norm-rule-ok">Update Widget's price: exactly 1 row in products table</span>
              </div>
            </motion.div>
          )}

          {step === 'JOIN' && (
            <motion.div
              key="JOIN"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ type: 'spring', stiffness: 320, damping: 22 }}
            >
              <p className="micro">JOIN reconstructs the original view without storing redundant data.</p>
              <pre className="db-norm-sql">{`SELECT o.order_id, c.name, c.email, p.name, p.price
FROM orders o
JOIN customers c ON o.customer_id = c.id
JOIN products  p ON o.product_id  = p.id`}</pre>
              <div className="db-norm-table-wrap">
                <table className="db-norm-table">
                  <thead>
                    <tr><th>order_id</th><th>name</th><th>email</th><th>product</th><th>price</th></tr>
                  </thead>
                  <tbody>
                    {DENORM_ROWS.slice(0, 5).map((row) => (
                      <motion.tr
                        key={row.order_id}
                        initial={{ opacity: 0, x: -8 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: row.order_id * 0.07, type: 'spring', stiffness: 320, damping: 22 }}
                      >
                        <td>{row.order_id}</td>
                        <td>{row.customer_name}</td>
                        <td>{row.customer_email}</td>
                        <td>{row.product_name}</td>
                        <td>${row.product_price}</td>
                      </motion.tr>
                    ))}
                    <tr><td>...</td><td>...</td><td>...</td><td>...</td><td>...</td></tr>
                  </tbody>
                </table>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      <div className="lesson-actions">
        {step === 'JOIN' && !done && (
          <button
            type="button"
            className="btn primary"
            onClick={() => {
              setDone(true)
              onComplete()
            }}
          >
            Continue
          </button>
        )}
        {step !== 'JOIN' && (
          <span className="hint">Walk through all tabs — finish at JOIN to continue</span>
        )}
      </div>

      {step === 'JOIN' && (
        <ConnectionCard
          title="Normalization prevents update anomalies"
          body={
            <>
              Denormalization speeds reads (fewer JOINs) but risks update anomalies. Every database architect chooses a
              point on that spectrum. Analytics databases (OLAP) are often fully denormalized; transactional databases
              (OLTP) are usually in 3NF.
            </>
          }
          appearsIn={['relational database design', 'data warehouses', 'ORM schema design']}
          hook="Relational databases are not the only option. Sometimes the data does not fit a table at all."
        />
      )}
    </div>
  )
}
