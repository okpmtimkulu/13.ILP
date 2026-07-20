import { CloudLessonShell } from '../CloudLessonShell'

export function CnetVpc({ onComplete }: { onComplete: () => void }) {
  return (
    <CloudLessonShell
      title="Virtual private networks"
      lede={
        <p>
          A <strong>virtual private cloud</strong> is an isolated software-defined network: your own address space,
          routing tables, and gateways — without buying routers. Every provider names it differently; the idea is
          identical.
        </p>
      }
      visual={
        <svg className="cloud-svg" viewBox="0 0 320 130" aria-hidden>
          <rect x="24" y="16" width="272" height="96" rx="10" fill="none" stroke="var(--bubble-teal)" strokeWidth="2" strokeDasharray="6 4" />
          <text x="32" y="36" fill="var(--muted)" fontSize="10">
            Isolated virtual network
          </text>
          <rect x="48" y="52" width="64" height="40" rx="4" fill="var(--surface-2)" stroke="var(--stroke)" />
          <rect x="128" y="52" width="64" height="40" rx="4" fill="var(--surface-2)" stroke="var(--stroke)" />
          <rect x="208" y="52" width="64" height="40" rx="4" fill="var(--surface-2)" stroke="var(--stroke)" />
        </svg>
      }
      card={{
        title: 'Same IP math, new control plane',
        body: (
          <>
            You already know subnets and routes from the networking chapters. In the cloud, those objects are API
            resources — automate them like any other code.
          </>
        ),
        appearsIn: ['landing zones', 'hub-and-spoke topologies', 'multi-account models'],
        hook: 'Start with one VPC and strict egress; expand when you have a reason, not by default.',
      }}
      onComplete={onComplete}
    />
  )
}

export function CnetSubnets({ onComplete }: { onComplete: () => void }) {
  return (
    <CloudLessonShell
      title="Subnets and routing intent"
      lede={
        <p>
          Subnets carve address space for <strong>blast radius</strong> and routing: public-facing load balancers in
          one tier, databases in another, with routes that only allow intended paths — same as on-prem, expressed as
          API objects.
        </p>
      }
      visual={
        <div className="cloud-subnet-grid">
          <div className="cloud-subnet cloud-subnet--public">
            <span>Public subnet</span>
            <small>ingress, NAT</small>
          </div>
          <div className="cloud-subnet cloud-subnet--private">
            <span>Private subnet</span>
            <small>app tier</small>
          </div>
          <div className="cloud-subnet cloud-subnet--data">
            <span>Data subnet</span>
            <small>no direct internet</small>
          </div>
        </div>
      }
      card={{
        title: 'Route tables encode intent',
        body: (
          <>
            Misrouted traffic is a common outage and security issue. Treat routing changes like production deploys:
            peer review and staged rollout.
          </>
        ),
        appearsIn: ['network ACLs', 'security groups', 'peering'],
        hook: 'If a subnet can reach the internet, assume it will — unless routing says otherwise.',
      }}
      onComplete={onComplete}
    />
  )
}

export function CnetLb({ onComplete }: { onComplete: () => void }) {
  return (
    <CloudLessonShell
      title="Load balancing and health"
      lede={
        <p>
          A <strong>load balancer</strong> spreads traffic across targets. <strong>Health checks</strong> remove
          failed instances automatically — bridging distributed systems ideas (redundancy, failover) to a managed
          endpoint.
        </p>
      }
      visual={
        <svg className="cloud-svg" viewBox="0 0 320 110" aria-hidden>
          <rect x="120" y="12" width="80" height="28" rx="4" fill="color-mix(in srgb, var(--bubble-teal) 20%, var(--surface))" stroke="var(--bubble-teal)" />
          <text x="128" y="30" fontSize="10" fill="currentColor">
            Load balancer
          </text>
          <path d="M160 40 v16" stroke="var(--stroke)" />
          <path d="M80 68 L160 56 L240 68" stroke="var(--stroke)" fill="none" />
          <rect x="56" y="72" width="48" height="28" rx="4" fill="var(--surface-2)" stroke="var(--stroke)" />
          <rect x="136" y="72" width="48" height="28" rx="4" fill="var(--surface-2)" stroke="var(--stroke)" />
          <rect x="216" y="72" width="48" height="28" rx="4" fill="var(--surface-2)" stroke="var(--stroke)" />
          <text x="56" y="108" fontSize="9" fill="var(--muted)">
            Unhealthy targets drain from rotation
          </text>
        </svg>
      }
      card={{
        title: 'Health checks define availability',
        body: (
          <>
            A load balancer is only as good as its probe. Too aggressive and you flap; too weak and you serve errors.
            Tune checks to your app&apos;s real readiness signal.
          </>
        ),
        appearsIn: ['rolling deploys', 'blue-green releases', 'autoscaling groups'],
        hook: 'Match health checks to the same condition your users need — not just TCP open.',
      }}
      onComplete={onComplete}
    />
  )
}

export function CnetEdge({ onComplete }: { onComplete: () => void }) {
  return (
    <CloudLessonShell
      title="Ingress and TLS termination"
      lede={
        <p>
          <strong>Ingress</strong> is how HTTP(S) enters your network. Often TLS terminates at the edge: clients see
          a managed certificate; internal hops may use private links — the same TLS story as the web stack chapter,
          now as infrastructure.
        </p>
      }
      visual={
        <div className="cloud-flow cloud-flow--tls">
          <span className="cloud-flow-node">Internet (TLS)</span>
          <span>→</span>
          <span className="cloud-flow-node">Edge / ingress</span>
          <span>→</span>
          <span className="cloud-flow-node">Private to app</span>
        </div>
      }
      card={{
        title: 'Certificates are ops, not trivia',
        body: (
          <>
            Automated certificate renewal is table stakes. Monitor expiry and chain trust — expired TLS is still a
            top outage cause.
          </>
        ),
        appearsIn: ['ACME-style automation', 'CDN fronts', 'mTLS for service mesh'],
        hook: 'Terminate TLS where you can enforce policy and observability.',
      }}
      onComplete={onComplete}
    />
  )
}

export function CnetSegment({ onComplete }: { onComplete: () => void }) {
  return (
    <CloudLessonShell
      title="Segmentation and policy"
      lede={
        <p>
          <strong>Segmentation</strong> limits how far an attacker or bug can move: layer subnets, identity, and
          network policies so east-west traffic is explicit — not &quot;everything can talk to everything.&quot;
        </p>
      }
      visual={
        <div className="cloud-segment-layers">
          <div className="cloud-seg-layer">Identity: who can call the API?</div>
          <div className="cloud-seg-layer">Network: which CIDRs and ports?</div>
          <div className="cloud-seg-layer">Application: authz inside the service</div>
        </div>
      }
      card={{
        title: 'Defense in depth, not one firewall rule',
        body: (
          <>
            Cloud networks are fast to change — which means mistakes propagate fast too. Policy-as-code and automated
            tests for network rules pay off quickly.
          </>
        ),
        appearsIn: ['micro-segmentation', 'service mesh', 'zero trust networking'],
        hook: 'If two services do not need to talk, default deny between them.',
      }}
      onComplete={onComplete}
    />
  )
}
