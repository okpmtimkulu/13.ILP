import { CloudLessonShell } from '../CloudLessonShell'

export function CfoundShared({ onComplete }: { onComplete: () => void }) {
  return (
    <CloudLessonShell
      title="Shared responsibility"
      lede={
        <p>
          In every public cloud, <strong>you</strong> own some risks and the <strong>provider</strong> owns others.
          The exact split depends on the service model — but the rule of thumb is: the provider secures the building
          blocks; <em>you</em> secure how you configure and use them.
        </p>
      }
      visual={
        <div className="cloud-diagram cloud-diagram--split">
          <div className="cloud-split-col">
            <span className="cloud-split-label">You typically own</span>
            <ul className="cloud-split-list">
              <li>Data classification and access</li>
              <li>Identity and application security</li>
              <li>Network rules and segmentation</li>
              <li>Compliance and backups</li>
            </ul>
          </div>
          <div className="cloud-split-col cloud-split-col--provider">
            <span className="cloud-split-label">Provider typically owns</span>
            <ul className="cloud-split-list">
              <li>Physical data centers</li>
              <li>Hypervisor and low-level isolation</li>
              <li>Regional power and cooling</li>
              <li>Hardware lifecycle</li>
            </ul>
          </div>
        </div>
      }
      card={{
        title: 'Not a handoff — a contract',
        body: (
          <>
            Incident postmortems often show gaps between what teams assumed the provider did and what the contract
            actually said. Naming the split early prevents blame ping-pong later.
          </>
        ),
        appearsIn: ['SOC 2 reports', 'architecture reviews', 'vendor questionnaires'],
        hook: 'Before you deploy anything sensitive, ask: which side of the line is this control on?',
      }}
      onComplete={onComplete}
    />
  )
}

export function CfoundRegions({ onComplete }: { onComplete: () => void }) {
  return (
    <CloudLessonShell
      title="Regions and zones"
      lede={
        <p>
          A <strong>region</strong> is a geographic area with independent infrastructure. Inside it,
          <strong> availability zones</strong> are separate failure domains — different buildings, power, and network
          paths — so one zone can fail without taking the whole region down.
        </p>
      }
      visual={
        <svg className="cloud-svg" viewBox="0 0 320 140" aria-hidden>
          <rect x="8" y="8" width="304" height="124" rx="8" fill="var(--surface-2)" stroke="var(--stroke)" />
          <text x="24" y="32" className="cloud-svg-title" fill="currentColor" fontSize="12" fontWeight="600">
            Region (e.g. geography)
          </text>
          <rect x="24" y="44" width="80" height="72" rx="6" fill="var(--surface)" stroke="var(--bubble-teal)" />
          <text x="40" y="68" fill="var(--muted)" fontSize="10">
            Zone A
          </text>
          <rect x="120" y="44" width="80" height="72" rx="6" fill="var(--surface)" stroke="var(--bubble-teal)" />
          <text x="136" y="68" fill="var(--muted)" fontSize="10">
            Zone B
          </text>
          <rect x="216" y="44" width="80" height="72" rx="6" fill="var(--surface)" stroke="var(--bubble-teal)" />
          <text x="232" y="68" fill="var(--muted)" fontSize="10">
            Zone C
          </text>
          <text x="24" y="128" fill="var(--muted)" fontSize="10">
            Latency: same region, usually low. Cross-region: higher cost and ms.
          </text>
        </svg>
      }
      card={{
        title: 'Distance is still physics',
        body: (
          <>
            Multi-region replication buys disaster recovery; it also adds complexity and bill line items. Match the
            topology to your actual recovery time objective — not every app needs global redundancy.
          </>
        ),
        appearsIn: ['RTO/RPO planning', 'data residency', 'cost optimization'],
        hook: 'Pick regions for compliance and latency first; optimize for cost second.',
      }}
      onComplete={onComplete}
    />
  )
}

export function CfoundModels({ onComplete }: { onComplete: () => void }) {
  return (
    <CloudLessonShell
      title="IaaS, PaaS, and SaaS"
      lede={
        <p>
          The same three acronyms appear everywhere: <strong>Infrastructure</strong> gives you VMs and networks;
          <strong>Platform</strong> adds managed runtimes and databases; <strong>Software</strong> is a finished app
          you configure. You trade control for speed at each step.
        </p>
      }
      visual={
        <div className="cloud-stack-visual">
          <div className="cloud-stack-row">
            <span className="cloud-stack-name">SaaS</span>
            <span className="cloud-stack-desc">You configure; provider runs everything underneath</span>
          </div>
          <div className="cloud-stack-row">
            <span className="cloud-stack-name">PaaS</span>
            <span className="cloud-stack-desc">You ship code and data; runtime and patching are abstracted</span>
          </div>
          <div className="cloud-stack-row">
            <span className="cloud-stack-name">IaaS</span>
            <span className="cloud-stack-desc">You choose OS, patches, and network layout</span>
          </div>
        </div>
      }
      card={{
        title: 'The hidden cost of control',
        body: (
          <>
            IaaS feels flexible until you are responsible for every patch. PaaS feels magical until you hit a
            platform limit. The right model is the one your team can operate reliably.
          </>
        ),
        appearsIn: ['build vs buy', 'total cost of ownership', 'vendor lock-in'],
        hook: 'Name one thing you never want to patch yourself — that is a hint toward PaaS or SaaS.',
      }}
      onComplete={onComplete}
    />
  )
}

export function CfoundTenant({ onComplete }: { onComplete: () => void }) {
  return (
    <CloudLessonShell
      title="Multi-tenancy and isolation"
      lede={
        <p>
          Public clouds serve many customers on shared hardware. Strong isolation — hypervisors, networks, and
          encryption — is what makes that safe. Weak configuration is what makes it leak.
        </p>
      }
      visual={
        <svg className="cloud-svg" viewBox="0 0 320 100" aria-hidden>
          <rect x="16" y="20" width="288" height="60" rx="8" fill="var(--surface-2)" stroke="var(--stroke)" />
          <text x="24" y="42" fill="var(--muted)" fontSize="10">
            Shared physical host
          </text>
          <rect x="32" y="52" width="72" height="20" rx="4" fill="color-mix(in srgb, var(--bubble-teal) 25%, var(--surface))" />
          <rect x="120" y="52" width="72" height="20" rx="4" fill="color-mix(in srgb, var(--bubble-pink) 25%, var(--surface))" />
          <rect x="208" y="52" width="72" height="20" rx="4" fill="color-mix(in srgb, var(--bubble-teal) 25%, var(--surface))" />
          <text x="32" y="92" fill="var(--muted)" fontSize="9">
            Tenants are isolated by software; your job is to set boundaries and keys correctly.
          </text>
        </svg>
      }
      card={{
        title: 'Isolation is a policy problem too',
        body: (
          <>
            Side-channel issues and misconfigured networks are rare but real. Defense in depth means network rules,
            encryption, and least-privilege identity — not one magic barrier.
          </>
        ),
        appearsIn: ['compliance audits', 'penetration tests', 'shared responsibility reviews'],
        hook: 'Assume tenant isolation can fail; design so a breach in one account does not flatten the org.',
      }}
      onComplete={onComplete}
    />
  )
}

export function CfoundElastic({ onComplete }: { onComplete: () => void }) {
  return (
    <CloudLessonShell
      title="Elasticity and operational shift"
      lede={
        <p>
          Cloud capacity can grow and shrink with demand. That shifts operations from &quot;capacity planning&quot; to
          &quot;guardrails&quot;: autoscaling, quotas, budgets, and alerts — so elasticity never becomes an
          unbounded bill.
        </p>
      }
      visual={
        <div className="cloud-elastic-chart" aria-hidden>
          <div className="cloud-elastic-bar" style={{ height: '40%' }} />
          <div className="cloud-elastic-bar" style={{ height: '65%' }} />
          <div className="cloud-elastic-bar" style={{ height: '100%' }} />
          <div className="cloud-elastic-bar" style={{ height: '55%' }} />
          <div className="cloud-elastic-bar" style={{ height: '30%' }} />
        </div>
      }
      card={{
        title: 'Elasticity without discipline is noise',
        body: (
          <>
            Autoscaling is only useful if you know what &quot;healthy&quot; load looks like and what to do when
            limits hit. Pair every scale rule with a budget and an alert.
          </>
        ),
        appearsIn: ['FinOps', 'on-call playbooks', 'capacity dashboards'],
        hook: 'If you scale automatically, you must throttle or budget automatically too.',
      }}
      onComplete={onComplete}
    />
  )
}
