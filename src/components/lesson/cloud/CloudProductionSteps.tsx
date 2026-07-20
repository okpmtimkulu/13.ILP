import { CloudLessonShell } from '../CloudLessonShell'

export function CprodCompute({ onComplete }: { onComplete: () => void }) {
  return (
    <CloudLessonShell
      title="Compute models compared"
      lede={
        <p>
          <strong>Virtual machines</strong> give full OS control. <strong>Containers</strong> package apps with
          lighter isolation. <strong>Serverless functions</strong> run code on demand without managing servers. Pick
          based on operational skill, cold-start tolerance, and state — not hype.
        </p>
      }
      visual={
        <table className="cloud-compare-table">
          <thead>
            <tr>
              <th>Model</th>
              <th>You manage</th>
              <th>Good for</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>VM</td>
              <td>OS patches, disk, agents</td>
              <td>Legacy, strong isolation needs</td>
            </tr>
            <tr>
              <td>Container</td>
              <td>Image, orchestration</td>
              <td>Portable services, microservices</td>
            </tr>
            <tr>
              <td>Function</td>
              <td>Code + deps</td>
              <td>Event spikes, glue logic</td>
            </tr>
          </tbody>
        </table>
      }
      card={{
        title: 'Operational surface area',
        body: (
          <>
            Less management usually means more platform constraints. The &quot;best&quot; compute is the one your
            team can run on-call without heroics.
          </>
        ),
        appearsIn: ['Kubernetes vs VMs', 'lift-and-shift', 'cost models'],
        hook: 'If you need a local file and long-lived TCP, serverless may fight you — that is a signal.',
      }}
      onComplete={onComplete}
    />
  )
}

export function CprodStorage({ onComplete }: { onComplete: () => void }) {
  return (
    <CloudLessonShell
      title="Storage classes and services"
      lede={
        <p>
          <strong>Object</strong> storage is huge, cheap, and eventually consistent. <strong>Block</strong> disks feel
          like local drives for databases. <strong>Managed databases</strong> trade control for patching and
          backups. Match durability and latency to the data — same tradeoffs as the databases chapter.
        </p>
      }
      visual={
        <div className="cloud-storage-trio">
          <div className="cloud-storage-card">
            <strong>Object</strong>
            <p>Logs, media, backups</p>
          </div>
          <div className="cloud-storage-card">
            <strong>Block</strong>
            <p>Stateful VMs, some DBs</p>
          </div>
          <div className="cloud-storage-card">
            <strong>Managed DB</strong>
            <p>Transactions, replicas</p>
          </div>
        </div>
      }
      card={{
        title: 'Durability is not free',
        body: (
          <>
            Cross-region replication and versioning protect against deletes and disasters — and show up on the bill.
            Tag data lifecycle policies early.
          </>
        ),
        appearsIn: ['S3-style buckets', 'EBS-style volumes', 'RDS-style services'],
        hook: 'Name your recovery point objective before you pay for eleven nines everywhere.',
      }}
      onComplete={onComplete}
    />
  )
}

export function CprodObserve({ onComplete }: { onComplete: () => void }) {
  return (
    <CloudLessonShell
      title="Logs, metrics, traces"
      lede={
        <p>
          The <strong>three pillars</strong> of observability: structured <strong>logs</strong> for events,
          <strong> metrics</strong> for aggregates and alerts, <strong>traces</strong> for request paths across
          services. Together they replace guesswork in production — the same observability idea as in distributed
          systems.
        </p>
      }
      visual={
        <div className="cloud-pillars">
          <div className="cloud-pillar">
            <span className="cloud-pillar-label">Logs</span>
            <span className="cloud-pillar-desc">What happened?</span>
          </div>
          <div className="cloud-pillar">
            <span className="cloud-pillar-label">Metrics</span>
            <span className="cloud-pillar-desc">How much / how bad?</span>
          </div>
          <div className="cloud-pillar">
            <span className="cloud-pillar-label">Traces</span>
            <span className="cloud-pillar-desc">Which path?</span>
          </div>
        </div>
      }
      card={{
        title: 'Correlation IDs tie it together',
        body: (
          <>
            Without a shared request ID, logs and traces from different services never line up. Instrument at the
            edge and propagate through queues.
          </>
        ),
        appearsIn: ['OpenTelemetry-style tracing', 'SLO dashboards', 'on-call'],
        hook: 'Alert on user-visible symptoms (latency, errors), not only CPU.',
      }}
      onComplete={onComplete}
    />
  )
}

export function CprodScale({ onComplete }: { onComplete: () => void }) {
  return (
    <CloudLessonShell
      title="Scaling and quotas"
      lede={
        <p>
          Autoscaling reacts to load; <strong>quotas</strong> cap risk and cost. Every account has service limits —
          hitting them during a launch is a classic outage. Request limit increases early for critical paths.
        </p>
      }
      visual={
        <svg className="cloud-svg" viewBox="0 0 300 80" aria-hidden>
          <text x="8" y="24" fill="var(--muted)" fontSize="10">
            Demand
          </text>
          <path d="M8 56 Q80 20 150 48 T292 32" fill="none" stroke="var(--bubble-teal)" strokeWidth="2" />
          <text x="8" y="72" fill="var(--muted)" fontSize="9">
            Scale out adds instances; quotas + budgets prevent runaway spend.
          </text>
        </svg>
      }
      card={{
        title: 'Scale the bottleneck',
        body: (
          <>
            Adding replicas does not fix a single-threaded database. Measure first — the cloud makes scaling easy, but
            it does not remove Amdahl&apos;s law.
          </>
        ),
        appearsIn: ['load tests', 'queue backpressure', 'database connection pools'],
        hook: 'Pair every autoscaling policy with a max instance count and a budget alert.',
      }}
      onComplete={onComplete}
    />
  )
}

export function CprodResilience({ onComplete }: { onComplete: () => void }) {
  return (
    <CloudLessonShell
      title="Failure domains and recovery"
      lede={
        <p>
          A <strong>failure domain</strong> is what fails together: a rack, a zone, a region. Design so no single
          domain can destroy availability: replicas, backups, and tested restore drills — the same resilience mindset
          as replication and consensus.
        </p>
      }
      visual={
        <div className="cloud-fd-layers">
          <div>Host</div>
          <div>Zone</div>
          <div>Region</div>
          <div>Provider</div>
        </div>
      }
      card={{
        title: 'Backups you have never restored are hope',
        body: (
          <>
            Automate backup is step one; game-day restores prove RTO/RPO. Multi-region is expensive — use it when the
            business truly requires it.
          </>
        ),
        appearsIn: ['disaster recovery', 'chaos engineering', 'runbooks'],
        hook: 'Document who declares an incident and who can failover — before the outage.',
      }}
      onComplete={onComplete}
    />
  )
}
