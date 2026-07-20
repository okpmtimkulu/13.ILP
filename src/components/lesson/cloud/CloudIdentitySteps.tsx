import { CloudLessonShell } from '../CloudLessonShell'

export function CidentSubjects({ onComplete }: { onComplete: () => void }) {
  return (
    <CloudLessonShell
      title="Principals and resources"
      lede={
        <p>
          Every API call has a <strong>principal</strong> (human, service, or machine identity) acting on a{' '}
          <strong>resource</strong> (bucket, queue, database, network object). Thinking in those two nouns keeps
          permissions legible — vendor-neutral.
        </p>
      }
      visual={
        <svg className="cloud-svg" viewBox="0 0 320 120" aria-hidden>
          <circle cx="64" cy="60" r="28" fill="var(--surface-2)" stroke="var(--bubble-teal)" />
          <text x="40" y="64" fill="currentColor" fontSize="11" fontWeight="600">
            Principal
          </text>
          <path d="M100 60 H220" stroke="var(--stroke)" strokeWidth="2" markerEnd="url(#arr)" />
          <defs>
            <marker id="arr" markerWidth="8" markerHeight="8" refX="6" refY="4" orient="auto">
              <path d="M0 0 L8 4 L0 8 Z" fill="var(--muted)" />
            </marker>
          </defs>
          <rect x="228" y="32" width="72" height="56" rx="6" fill="var(--surface-2)" stroke="var(--stroke)" />
          <text x="236" y="56" fill="var(--muted)" fontSize="10">
            Resource
          </text>
          <text x="120" y="48" fill="var(--muted)" fontSize="9">
            action:read / write
          </text>
        </svg>
      }
      card={{
        title: 'Identity is the perimeter',
        body: (
          <>
            Firewalls still matter, but in the cloud most breaches are valid credentials used wrong. Model who can
            touch what before you draw network diagrams.
          </>
        ),
        appearsIn: ['zero trust', 'least privilege', 'audit logs'],
        hook: 'If you cannot name the principal for a production job, you cannot secure it.',
      }}
      onComplete={onComplete}
    />
  )
}

export function CidentRoles({ onComplete }: { onComplete: () => void }) {
  return (
    <CloudLessonShell
      title="Roles and delegation"
      lede={
        <p>
          Long-lived keys embedded in code rot and leak. <strong>Roles</strong> (or workload identities) let a
          service assume permissions for a short time. Prefer temporary credentials over static secrets.
        </p>
      }
      visual={
        <div className="cloud-diagram">
          <div className="cloud-flow">
            <span className="cloud-flow-node">Workload</span>
            <span className="cloud-flow-arrow">→</span>
            <span className="cloud-flow-node">Assume role</span>
            <span className="cloud-flow-arrow">→</span>
            <span className="cloud-flow-node">Temporary creds</span>
            <span className="cloud-flow-arrow">→</span>
            <span className="cloud-flow-node">API</span>
          </div>
        </div>
      }
      card={{
        title: 'Delegation beats embedding',
        body: (
          <>
            Every major provider implements the same idea under different names. Learn the pattern once; the console
            names are secondary.
          </>
        ),
        appearsIn: ['CI/CD pipelines', 'Kubernetes service accounts', 'Lambda-style functions'],
        hook: 'Rotate by design: short-lived beats quarterly key rotation.',
      }}
      onComplete={onComplete}
    />
  )
}

export function CidentPolicies({ onComplete }: { onComplete: () => void }) {
  return (
    <CloudLessonShell
      title="Policies as code"
      lede={
        <p>
          A <strong>policy</strong> lists allowed actions on resources, often with conditions (time, IP, tags).
          Treat policies like code: review, version, and test — because a one-line wildcard can undo months of design.
        </p>
      }
      visual={
        <pre className="cloud-policy-snippet">
          {`effect: allow
principal: role/app-worker
actions: [storage:GetObject]
resources: [bucket/logs/*]
conditions:
  ip: corporate-range
  tag: env=production`}
        </pre>
      }
      card={{
        title: 'Deny by default',
        body: (
          <>
            Explicit allows with a final implicit deny is the usual safe default. Broad &quot;admin&quot; roles
            should be rare, monitored, and time-bound.
          </>
        ),
        appearsIn: ['SOC audits', 'blast-radius reduction', 'break-glass access'],
        hook: 'If a policy is hard to read in code review, it is probably too powerful.',
      }}
      onComplete={onComplete}
    />
  )
}

export function CidentFederation({ onComplete }: { onComplete: () => void }) {
  return (
    <CloudLessonShell
      title="Federation and trust"
      lede={
        <p>
          <strong>Federation</strong> lets users sign in with your existing identity provider (SAML, OIDC) and
          receive cloud tokens. Trust is established between IdP and cloud — map groups to roles instead of cloning
          users everywhere.
        </p>
      }
      visual={
        <svg className="cloud-svg" viewBox="0 0 320 100" aria-hidden>
          <rect x="16" y="28" width="88" height="44" rx="6" fill="var(--surface-2)" stroke="var(--stroke)" />
          <text x="28" y="54" fill="currentColor" fontSize="10">
            Corp IdP
          </text>
          <text x="120" y="56" fill="var(--muted)" fontSize="14">
            ⇄ trust
          </text>
          <rect x="200" y="28" width="104" height="44" rx="6" fill="var(--surface-2)" stroke="var(--bubble-teal)" />
          <text x="212" y="54" fill="currentColor" fontSize="10">
            Cloud IAM
          </text>
        </svg>
      }
      card={{
        title: 'One identity story',
        body: (
          <>
            Federation reduces duplicate passwords and offboarding risk. The tradeoff is careful mapping: a wrong
            group mapping can grant org-wide admin by accident.
          </>
        ),
        appearsIn: ['SSO rollout', 'SAML assertions', 'OIDC for apps'],
        hook: 'Offboarding in the IdP should revoke cloud access automatically — test that path.',
      }}
      onComplete={onComplete}
    />
  )
}

export function CidentSecrets({ onComplete }: { onComplete: () => void }) {
  return (
    <CloudLessonShell
      title="Secrets and rotation"
      lede={
        <p>
          Secrets are not configuration. Store them in a dedicated service with access logs, encryption, and{' '}
          <strong>rotation</strong>. Never bake them into images or commit them to Git — even &quot;private&quot;
          repos leak.
        </p>
      }
      visual={
        <div className="cloud-diagram cloud-diagram--secrets">
          <div className="cloud-secret-step">Build</div>
          <span>→</span>
          <div className="cloud-secret-step cloud-secret-step--vault">Secret store</div>
          <span>→</span>
          <div className="cloud-secret-step">Runtime fetch</div>
        </div>
      }
      card={{
        title: 'Rotation is hygiene',
        body: (
          <>
            Automated rotation limits blast radius when a credential leaks. Pair rotation with alerting on unusual
            secret access patterns.
          </>
        ),
        appearsIn: ['incident response', 'compliance controls', 'container image scanning'],
        hook: 'If you would not paste it in Slack, it should not live in an env var in a screenshot.',
      }}
      onComplete={onComplete}
    />
  )
}
