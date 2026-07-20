const STORAGE_KEY = 'ilp-progress-v1'

export type DeviceId =
  | 'pc-starter'
  | 'phone-slim'
  | 'server-home'
  | 'server-commercial'
  | 'robot-arm'
  | 'vacuum-tube'
  | 'ssd-board'
  | 'terminal-retro'
  | 'browser-engine'
  | 'compiler-chip'
  | 'math-engine'
  | 'algorithm-visualizer'
  | 'database-server'
  | 'hardware-key'
  | 'gpu-card'
  | 'workstation'
  | 'server-rack-cluster'

export interface ProgressState {
  completedLessonIds: string[]
  /** Devices the learner has "built" or unlocked */
  inventory: DeviceId[]
  /** Golden-path step index 0..2 inside foundations (persisted for resume) */
  foundationsStepIndex: number
  /** Zero-prerequisites fundamentals track: 0..2 in progress, 3 when lesson complete */
  fundamentalsStepIndex: number
  /** Memory & Storage layer: 0..5 in progress, 6 when lesson complete */
  memoryStepIndex: number
  /** Operating Systems layer: 0..6 in progress, 7 when lesson complete */
  osStepIndex: number
  /** Web Stack layer: 0..3 in progress, 4 when lesson complete */
  webStepIndex: number
  /** Compilers layer: 0..5 in progress, 6 when lesson complete */
  compilersStepIndex: number
  /** Math for CS layer: 0..6 in progress, 7 when lesson complete */
  mathStepIndex: number
  /** Data Structures & Algorithms layer: 0..15 in progress, 16 when lesson complete */
  dsaStepIndex: number
  /** Databases layer: 0..6 in progress, 7 when lesson complete */
  databasesStepIndex: number
  /** Security layer: 0..6 in progress, 7 when lesson complete */
  securityStepIndex: number
  /** Programming Paradigms layer: 0..5 in progress, 6 when lesson complete */
  paradigmsStepIndex: number
  /** Software Engineering layer: 0..6 in progress, 7 when lesson complete */
  sweStepIndex: number
  /** Distributed Systems layer: 0..7 in progress, 8 when lesson complete */
  distributedStepIndex: number
  /** Ethics layer: 0..6 in progress, 7 when lesson complete */
  ethicsStepIndex: number
  /** Network Fundamentals: 0..5 in progress, 6 when lesson complete */
  networksStepIndex: number
  /** IP Addressing and Routing: 0..5 in progress, 6 when lesson complete */
  iproutingStepIndex: number
  /** Transport, Services and Security: 0..7 in progress, 8 when lesson complete */
  netservicesStepIndex: number
  /** Cloud foundations: 0..4 in progress, 5 when lesson complete */
  cloudFoundationsStepIndex: number
  /** Cloud identity: 0..4 in progress, 5 when lesson complete */
  cloudIdentityStepIndex: number
  /** Cloud networking: 0..4 in progress, 5 when lesson complete */
  cloudNetworkingStepIndex: number
  /** Cloud production: 0..4 in progress, 5 when lesson complete */
  cloudProductionStepIndex: number
  worldMap: {
    /** Region id pairs that now have a cable */
    cables: [string, string][]
    dataCentersPlaced: number
  }
  llm: {
    attentionSeen: boolean
    trainInferSeen: boolean
  }
}

const defaultState = (): ProgressState => ({
  completedLessonIds: [],
  inventory: [],
  foundationsStepIndex: 0,
  fundamentalsStepIndex: 0,
  networksStepIndex: 0,
  iproutingStepIndex: 0,
  netservicesStepIndex: 0,
  cloudFoundationsStepIndex: 0,
  cloudIdentityStepIndex: 0,
  cloudNetworkingStepIndex: 0,
  cloudProductionStepIndex: 0,
  memoryStepIndex: 0,
  osStepIndex: 0,
  webStepIndex: 0,
  compilersStepIndex: 0,
  mathStepIndex: 0,
  dsaStepIndex: 0,
  databasesStepIndex: 0,
  securityStepIndex: 0,
  paradigmsStepIndex: 0,
  sweStepIndex: 0,
  distributedStepIndex: 0,
  ethicsStepIndex: 0,
  worldMap: { cables: [], dataCentersPlaced: 0 },
  llm: { attentionSeen: false, trainInferSeen: false },
})

export function loadProgress(): ProgressState {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    if (!raw) return defaultState()
    const parsed = JSON.parse(raw) as ProgressState
    return {
      ...defaultState(),
      ...parsed,
      fundamentalsStepIndex: parsed.fundamentalsStepIndex ?? 0,
      networksStepIndex: parsed.networksStepIndex ?? 0,
      iproutingStepIndex: parsed.iproutingStepIndex ?? 0,
      netservicesStepIndex: parsed.netservicesStepIndex ?? 0,
      cloudFoundationsStepIndex: parsed.cloudFoundationsStepIndex ?? 0,
      cloudIdentityStepIndex: parsed.cloudIdentityStepIndex ?? 0,
      cloudNetworkingStepIndex: parsed.cloudNetworkingStepIndex ?? 0,
      cloudProductionStepIndex: parsed.cloudProductionStepIndex ?? 0,
      memoryStepIndex: parsed.memoryStepIndex ?? 0,
      osStepIndex: parsed.osStepIndex ?? 0,
      webStepIndex: parsed.webStepIndex ?? 0,
      compilersStepIndex: parsed.compilersStepIndex ?? 0,
      mathStepIndex: parsed.mathStepIndex ?? 0,
      dsaStepIndex: parsed.dsaStepIndex ?? 0,
      databasesStepIndex: parsed.databasesStepIndex ?? 0,
      securityStepIndex: parsed.securityStepIndex ?? 0,
      paradigmsStepIndex: parsed.paradigmsStepIndex ?? 0,
      sweStepIndex: parsed.sweStepIndex ?? 0,
      distributedStepIndex: parsed.distributedStepIndex ?? 0,
      ethicsStepIndex: parsed.ethicsStepIndex ?? 0,
      worldMap: { ...defaultState().worldMap, ...parsed.worldMap },
      llm: { ...defaultState().llm, ...parsed.llm },
    }
  } catch {
    return defaultState()
  }
}

export function saveProgress(next: ProgressState): void {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(next))
}

export const RESTARTABLE_LESSON_IDS = [
  'fundamentals-start',
  'foundations-golden-path',
  'network-fundamentals',
  'ip-routing-core',
  'net-services-core',
  'llm-intuition',
  'memory-hierarchy',
  'os-core',
  'web-stack',
  'compilers-core',
  'math-foundations',
  'dsa-core',
  'db-core',
  'security-core',
  'paradigms-core',
  'swe-core',
  'distributed-core',
  'cloud-foundations-core',
  'cloud-identity-core',
  'cloud-networking-core',
  'cloud-production-core',
  'ethics-core',
] as const

export type RestartableLessonId = (typeof RESTARTABLE_LESSON_IDS)[number]

export function isRestartableLessonId(id: string): id is RestartableLessonId {
  return (RESTARTABLE_LESSON_IDS as readonly string[]).includes(id)
}

/**
 * Removes this lesson's completion, resets its saved step state, and adjusts
 * devices / robot unlock to match. Later chapters stay completed unless you
 * restart those too. Reload the page after calling so screens re-init.
 */
export function restartLesson(lessonId: RestartableLessonId): ProgressState {
  const cur = loadProgress()
  const completedLessonIds = cur.completedLessonIds.filter((id) => id !== lessonId)

  let fundamentalsStepIndex = cur.fundamentalsStepIndex
  let foundationsStepIndex = cur.foundationsStepIndex
  let networksStepIndex = cur.networksStepIndex
  let iproutingStepIndex = cur.iproutingStepIndex
  let netservicesStepIndex = cur.netservicesStepIndex
  let memoryStepIndex = cur.memoryStepIndex
  let osStepIndex = cur.osStepIndex
  let webStepIndex = cur.webStepIndex
  let compilersStepIndex = cur.compilersStepIndex
  let mathStepIndex = cur.mathStepIndex
  let dsaStepIndex = cur.dsaStepIndex
  let databasesStepIndex = cur.databasesStepIndex
  let securityStepIndex = cur.securityStepIndex
  let paradigmsStepIndex = cur.paradigmsStepIndex
  let sweStepIndex = cur.sweStepIndex
  let distributedStepIndex = cur.distributedStepIndex
  let cloudFoundationsStepIndex = cur.cloudFoundationsStepIndex
  let cloudIdentityStepIndex = cur.cloudIdentityStepIndex
  let cloudNetworkingStepIndex = cur.cloudNetworkingStepIndex
  let cloudProductionStepIndex = cur.cloudProductionStepIndex
  let ethicsStepIndex = cur.ethicsStepIndex
  let worldMap = { ...cur.worldMap }
  let llm = { ...cur.llm }
  let inventory = [...cur.inventory]

  switch (lessonId) {
    case 'fundamentals-start':
      fundamentalsStepIndex = 0
      break
    case 'foundations-golden-path':
      foundationsStepIndex = 0
      inventory = inventory.filter((id) => id !== 'pc-starter' && id !== 'vacuum-tube')
      break
    case 'network-fundamentals':
      networksStepIndex = 0
      worldMap = { cables: [], dataCentersPlaced: 0 }
      inventory = inventory.filter((id) => id !== 'server-home' && id !== 'server-commercial')
      break
    case 'ip-routing-core':
      iproutingStepIndex = 0
      break
    case 'net-services-core':
      netservicesStepIndex = 0
      break
    case 'llm-intuition':
      llm = { attentionSeen: false, trainInferSeen: false }
      inventory = inventory.filter((id) => id !== 'phone-slim' && id !== 'gpu-card')
      break
    case 'memory-hierarchy':
      memoryStepIndex = 0
      inventory = inventory.filter((id) => id !== 'ssd-board')
      break
    case 'os-core':
      osStepIndex = 0
      inventory = inventory.filter((id) => id !== 'terminal-retro')
      break
    case 'web-stack':
      webStepIndex = 0
      inventory = inventory.filter((id) => id !== 'browser-engine')
      break
    case 'compilers-core':
      compilersStepIndex = 0
      inventory = inventory.filter((id) => id !== 'compiler-chip')
      break
    case 'math-foundations':
      mathStepIndex = 0
      inventory = inventory.filter((id) => id !== 'math-engine')
      break
    case 'dsa-core':
      dsaStepIndex = 0
      inventory = inventory.filter((id) => id !== 'algorithm-visualizer')
      break
    case 'db-core':
      databasesStepIndex = 0
      inventory = inventory.filter((id) => id !== 'database-server')
      break
    case 'security-core':
      securityStepIndex = 0
      inventory = inventory.filter((id) => id !== 'hardware-key')
      break
    case 'paradigms-core':
      paradigmsStepIndex = 0
      break
    case 'swe-core':
      sweStepIndex = 0
      inventory = inventory.filter((id) => id !== 'workstation')
      break
    case 'distributed-core':
      distributedStepIndex = 0
      inventory = inventory.filter((id) => id !== 'server-rack-cluster')
      break
    case 'cloud-foundations-core':
      cloudFoundationsStepIndex = 0
      break
    case 'cloud-identity-core':
      cloudIdentityStepIndex = 0
      break
    case 'cloud-networking-core':
      cloudNetworkingStepIndex = 0
      break
    case 'cloud-production-core':
      cloudProductionStepIndex = 0
      break
    case 'ethics-core':
      ethicsStepIndex = 0
      break
  }

  inventory = inventory.filter((id) => id !== 'robot-arm')
  const allLessonsDone = [
    'fundamentals-start',
    'foundations-golden-path',
    'network-fundamentals',
    'ip-routing-core',
    'net-services-core',
    'llm-intuition',
    'memory-hierarchy',
    'os-core',
    'web-stack',
    'compilers-core',
    'math-foundations',
    'dsa-core',
    'db-core',
    'security-core',
    'paradigms-core',
    'swe-core',
    'distributed-core',
    'cloud-foundations-core',
    'cloud-identity-core',
    'cloud-networking-core',
    'cloud-production-core',
    'ethics-core',
  ].every((id) => completedLessonIds.includes(id))
  if (allLessonsDone) {
    inventory = uniqPush(inventory, 'robot-arm')
  }

  const next: ProgressState = {
    ...cur,
    completedLessonIds,
    inventory,
    fundamentalsStepIndex,
    foundationsStepIndex,
    networksStepIndex,
    iproutingStepIndex,
    netservicesStepIndex,
    memoryStepIndex,
    osStepIndex,
    webStepIndex,
    compilersStepIndex,
    mathStepIndex,
    dsaStepIndex,
    databasesStepIndex,
    securityStepIndex,
    paradigmsStepIndex,
    sweStepIndex,
    distributedStepIndex,
    cloudFoundationsStepIndex,
    cloudIdentityStepIndex,
    cloudNetworkingStepIndex,
    cloudProductionStepIndex,
    ethicsStepIndex,
    worldMap,
    llm,
  }
  saveProgress(next)
  return next
}

/** Clears lessons, devices, map, and LLM flags for this browser. Reload the page after calling so open screens refresh. */
export function resetProgress(): void {
  saveProgress(defaultState())
  try {
    sessionStorage.removeItem('ilp-stack-celebrate')
    localStorage.removeItem('ilp-last-visit')
    localStorage.removeItem('ilp-device-revealed')
  } catch {
    /* ignore */
  }
}

export function mergeProgress(partial: Partial<ProgressState>): ProgressState {
  const cur = loadProgress()
  const next: ProgressState = {
    ...cur,
    ...partial,
    inventory: partial.inventory ?? cur.inventory,
    worldMap: { ...cur.worldMap, ...partial.worldMap },
    llm: { ...cur.llm, ...partial.llm },
  }
  saveProgress(next)
  return next
}

function uniqPush(list: DeviceId[], id: DeviceId): DeviceId[] {
  return list.includes(id) ? list : [...list, id]
}

/**
 * Returns completion status for each step id across all lessons.
 * Step ids come from curriculum.ts (e.g. 'fund-io', 'step-gates', 'map-main', 'llm-attention').
 */
export function getStepCompletion(p: ProgressState): Record<string, boolean> {
  const lessonDone = (id: string) => p.completedLessonIds.includes(id)
  return {
    // Fundamentals
    'fund-io': p.fundamentalsStepIndex >= 1 || lessonDone('fundamentals-start'),
    'fund-binary': p.fundamentalsStepIndex >= 2 || lessonDone('fundamentals-start'),
    'fund-wire': p.fundamentalsStepIndex >= 3 || lessonDone('fundamentals-start'),
    // Foundations
    'step-gates': p.foundationsStepIndex >= 1 || lessonDone('foundations-golden-path'),
    'step-adder': p.foundationsStepIndex >= 2 || lessonDone('foundations-golden-path'),
    'step-fetch': p.foundationsStepIndex >= 3 || lessonDone('foundations-golden-path'),
    // Network Fundamentals
    'net-osi': p.networksStepIndex >= 1 || lessonDone('network-fundamentals'),
    'net-physical': p.networksStepIndex >= 2 || lessonDone('network-fundamentals'),
    'net-ethernet': p.networksStepIndex >= 3 || lessonDone('network-fundamentals'),
    'net-switching': p.networksStepIndex >= 4 || lessonDone('network-fundamentals'),
    'net-arp': p.networksStepIndex >= 5 || lessonDone('network-fundamentals'),
    'net-worldmap': p.networksStepIndex >= 6 || lessonDone('network-fundamentals'),
    // IP Addressing and Routing
    'ip-v4': p.iproutingStepIndex >= 1 || lessonDone('ip-routing-core'),
    'ip-subnet': p.iproutingStepIndex >= 2 || lessonDone('ip-routing-core'),
    'ip-v6': p.iproutingStepIndex >= 3 || lessonDone('ip-routing-core'),
    'ip-routing-table': p.iproutingStepIndex >= 4 || lessonDone('ip-routing-core'),
    'ip-static': p.iproutingStepIndex >= 5 || lessonDone('ip-routing-core'),
    'ip-ospf': p.iproutingStepIndex >= 6 || lessonDone('ip-routing-core'),
    // Transport, Services and Security
    'ns-tcp': p.netservicesStepIndex >= 1 || lessonDone('net-services-core'),
    'ns-udp': p.netservicesStepIndex >= 2 || lessonDone('net-services-core'),
    'ns-ports': p.netservicesStepIndex >= 3 || lessonDone('net-services-core'),
    'ns-dhcp': p.netservicesStepIndex >= 4 || lessonDone('net-services-core'),
    'ns-nat': p.netservicesStepIndex >= 5 || lessonDone('net-services-core'),
    'ns-wireless': p.netservicesStepIndex >= 6 || lessonDone('net-services-core'),
    'ns-acl': p.netservicesStepIndex >= 7 || lessonDone('net-services-core'),
    'ns-troubleshoot': p.netservicesStepIndex >= 8 || lessonDone('net-services-core'),
    // AI
    'llm-attention': p.llm.attentionSeen || lessonDone('llm-intuition'),
    'llm-train-inf': p.llm.trainInferSeen || lessonDone('llm-intuition'),
    // Memory
    'mem-register': p.memoryStepIndex >= 1 || lessonDone('memory-hierarchy'),
    'mem-cache': p.memoryStepIndex >= 2 || lessonDone('memory-hierarchy'),
    'mem-ram': p.memoryStepIndex >= 3 || lessonDone('memory-hierarchy'),
    'mem-eviction': p.memoryStepIndex >= 4 || lessonDone('memory-hierarchy'),
    'mem-virtual': p.memoryStepIndex >= 5 || lessonDone('memory-hierarchy'),
    'mem-paging': p.memoryStepIndex >= 6 || lessonDone('memory-hierarchy'),
    // OS
    'os-process': p.osStepIndex >= 1 || lessonDone('os-core'),
    'os-scheduler': p.osStepIndex >= 2 || lessonDone('os-core'),
    'os-filesystem': p.osStepIndex >= 3 || lessonDone('os-core'),
    'os-syscall': p.osStepIndex >= 4 || lessonDone('os-core'),
    'os-threads': p.osStepIndex >= 5 || lessonDone('os-core'),
    'os-mutex': p.osStepIndex >= 6 || lessonDone('os-core'),
    'os-deadlock': p.osStepIndex >= 7 || lessonDone('os-core'),
    // Web
    'web-dns': p.webStepIndex >= 1 || lessonDone('web-stack'),
    'web-http': p.webStepIndex >= 2 || lessonDone('web-stack'),
    'web-tls': p.webStepIndex >= 3 || lessonDone('web-stack'),
    'web-render': p.webStepIndex >= 4 || lessonDone('web-stack'),
    // Compilers
    'comp-source': p.compilersStepIndex >= 1 || lessonDone('compilers-core'),
    'comp-lex': p.compilersStepIndex >= 2 || lessonDone('compilers-core'),
    'comp-parse': p.compilersStepIndex >= 3 || lessonDone('compilers-core'),
    'comp-ast': p.compilersStepIndex >= 4 || lessonDone('compilers-core'),
    'comp-codegen': p.compilersStepIndex >= 5 || lessonDone('compilers-core'),
    'comp-optimize': p.compilersStepIndex >= 6 || lessonDone('compilers-core'),
    // Math
    'math-logic': p.mathStepIndex >= 1 || lessonDone('math-foundations'),
    'math-proof': p.mathStepIndex >= 2 || lessonDone('math-foundations'),
    'math-sets': p.mathStepIndex >= 3 || lessonDone('math-foundations'),
    'math-counting': p.mathStepIndex >= 4 || lessonDone('math-foundations'),
    'math-modular': p.mathStepIndex >= 5 || lessonDone('math-foundations'),
    'math-prob': p.mathStepIndex >= 6 || lessonDone('math-foundations'),
    'math-linalg': p.mathStepIndex >= 7 || lessonDone('math-foundations'),
    // DSA
    'dsa-array-list': p.dsaStepIndex >= 1 || lessonDone('dsa-core'),
    'dsa-tree': p.dsaStepIndex >= 2 || lessonDone('dsa-core'),
    'dsa-hash': p.dsaStepIndex >= 3 || lessonDone('dsa-core'),
    'dsa-sorting': p.dsaStepIndex >= 4 || lessonDone('dsa-core'),
    'dsa-graph': p.dsaStepIndex >= 5 || lessonDone('dsa-core'),
    'dsa-heap': p.dsaStepIndex >= 6 || lessonDone('dsa-core'),
    'dsa-avl': p.dsaStepIndex >= 7 || lessonDone('dsa-core'),
    'dsa-trie': p.dsaStepIndex >= 8 || lessonDone('dsa-core'),
    'dsa-union-find': p.dsaStepIndex >= 9 || lessonDone('dsa-core'),
    'dsa-greedy': p.dsaStepIndex >= 10 || lessonDone('dsa-core'),
    'dsa-dijkstra': p.dsaStepIndex >= 11 || lessonDone('dsa-core'),
    'dsa-dp-intro': p.dsaStepIndex >= 12 || lessonDone('dsa-core'),
    'dsa-dp-classic': p.dsaStepIndex >= 13 || lessonDone('dsa-core'),
    'dsa-bigo': p.dsaStepIndex >= 14 || lessonDone('dsa-core'),
    'dsa-complexity': p.dsaStepIndex >= 15 || lessonDone('dsa-core'),
    'dsa-halting': p.dsaStepIndex >= 16 || lessonDone('dsa-core'),
    // Databases
    'db-btree': p.databasesStepIndex >= 1 || lessonDone('db-core'),
    'db-query': p.databasesStepIndex >= 2 || lessonDone('db-core'),
    'db-transaction': p.databasesStepIndex >= 3 || lessonDone('db-core'),
    'db-acid': p.databasesStepIndex >= 4 || lessonDone('db-core'),
    'db-index': p.databasesStepIndex >= 5 || lessonDone('db-core'),
    'db-normalize': p.databasesStepIndex >= 6 || lessonDone('db-core'),
    'db-nosql': p.databasesStepIndex >= 7 || lessonDone('db-core'),
    // Security
    'sec-xor': p.securityStepIndex >= 1 || lessonDone('security-core'),
    'sec-hash': p.securityStepIndex >= 2 || lessonDone('security-core'),
    'sec-keypair': p.securityStepIndex >= 3 || lessonDone('security-core'),
    'sec-signature': p.securityStepIndex >= 4 || lessonDone('security-core'),
    'sec-pki': p.securityStepIndex >= 5 || lessonDone('security-core'),
    'sec-auth': p.securityStepIndex >= 6 || lessonDone('security-core'),
    'sec-owasp': p.securityStepIndex >= 7 || lessonDone('security-core'),
    // Paradigms
    'par-imperative': p.paradigmsStepIndex >= 1 || lessonDone('paradigms-core'),
    'par-oop': p.paradigmsStepIndex >= 2 || lessonDone('paradigms-core'),
    'par-encapsulation': p.paradigmsStepIndex >= 3 || lessonDone('paradigms-core'),
    'par-functional': p.paradigmsStepIndex >= 4 || lessonDone('paradigms-core'),
    'par-types': p.paradigmsStepIndex >= 5 || lessonDone('paradigms-core'),
    'par-memory': p.paradigmsStepIndex >= 6 || lessonDone('paradigms-core'),
    // SWE
    'swe-git': p.sweStepIndex >= 1 || lessonDone('swe-core'),
    'swe-test': p.sweStepIndex >= 2 || lessonDone('swe-core'),
    'swe-tdd': p.sweStepIndex >= 3 || lessonDone('swe-core'),
    'swe-solid': p.sweStepIndex >= 4 || lessonDone('swe-core'),
    'swe-patterns': p.sweStepIndex >= 5 || lessonDone('swe-core'),
    'swe-cicd': p.sweStepIndex >= 6 || lessonDone('swe-core'),
    'swe-debug': p.sweStepIndex >= 7 || lessonDone('swe-core'),
    // Distributed
    'dist-replication': p.distributedStepIndex >= 1 || lessonDone('distributed-core'),
    'dist-consensus': p.distributedStepIndex >= 2 || lessonDone('distributed-core'),
    'dist-cap': p.distributedStepIndex >= 3 || lessonDone('distributed-core'),
    'dist-loadbalance': p.distributedStepIndex >= 4 || lessonDone('distributed-core'),
    'dist-mapreduce': p.distributedStepIndex >= 5 || lessonDone('distributed-core'),
    'dist-sharding': p.distributedStepIndex >= 6 || lessonDone('distributed-core'),
    'dist-queue': p.distributedStepIndex >= 7 || lessonDone('distributed-core'),
    'dist-observe': p.distributedStepIndex >= 8 || lessonDone('distributed-core'),
    // Cloud (vendor-neutral)
    'cfound-shared': p.cloudFoundationsStepIndex >= 1 || lessonDone('cloud-foundations-core'),
    'cfound-regions': p.cloudFoundationsStepIndex >= 2 || lessonDone('cloud-foundations-core'),
    'cfound-models': p.cloudFoundationsStepIndex >= 3 || lessonDone('cloud-foundations-core'),
    'cfound-tenant': p.cloudFoundationsStepIndex >= 4 || lessonDone('cloud-foundations-core'),
    'cfound-elastic': p.cloudFoundationsStepIndex >= 5 || lessonDone('cloud-foundations-core'),
    'cident-subjects': p.cloudIdentityStepIndex >= 1 || lessonDone('cloud-identity-core'),
    'cident-roles': p.cloudIdentityStepIndex >= 2 || lessonDone('cloud-identity-core'),
    'cident-policies': p.cloudIdentityStepIndex >= 3 || lessonDone('cloud-identity-core'),
    'cident-federation': p.cloudIdentityStepIndex >= 4 || lessonDone('cloud-identity-core'),
    'cident-secrets': p.cloudIdentityStepIndex >= 5 || lessonDone('cloud-identity-core'),
    'cnet-vpc': p.cloudNetworkingStepIndex >= 1 || lessonDone('cloud-networking-core'),
    'cnet-subnets': p.cloudNetworkingStepIndex >= 2 || lessonDone('cloud-networking-core'),
    'cnet-lb': p.cloudNetworkingStepIndex >= 3 || lessonDone('cloud-networking-core'),
    'cnet-edge': p.cloudNetworkingStepIndex >= 4 || lessonDone('cloud-networking-core'),
    'cnet-segment': p.cloudNetworkingStepIndex >= 5 || lessonDone('cloud-networking-core'),
    'cprod-compute': p.cloudProductionStepIndex >= 1 || lessonDone('cloud-production-core'),
    'cprod-storage': p.cloudProductionStepIndex >= 2 || lessonDone('cloud-production-core'),
    'cprod-observe': p.cloudProductionStepIndex >= 3 || lessonDone('cloud-production-core'),
    'cprod-scale': p.cloudProductionStepIndex >= 4 || lessonDone('cloud-production-core'),
    'cprod-resilience': p.cloudProductionStepIndex >= 5 || lessonDone('cloud-production-core'),
    // Ethics
    'eth-scale': p.ethicsStepIndex >= 1 || lessonDone('ethics-core'),
    'eth-bias': p.ethicsStepIndex >= 2 || lessonDone('ethics-core'),
    'eth-privacy': p.ethicsStepIndex >= 3 || lessonDone('ethics-core'),
    'eth-ai-safety': p.ethicsStepIndex >= 4 || lessonDone('ethics-core'),
    'eth-accountability': p.ethicsStepIndex >= 5 || lessonDone('ethics-core'),
    'eth-open-source': p.ethicsStepIndex >= 6 || lessonDone('ethics-core'),
    'eth-acm': p.ethicsStepIndex >= 7 || lessonDone('ethics-core'),
  }
}

/**
 * Finds the next step the user should work on.
 * Returns { chapterId, stepId, stepTitle } or null if everything is done.
 */
export function getNextStep(p: ProgressState): { chapterId: string; stepId: string; stepTitle: string } | null {
  const done = getStepCompletion(p)

  // Ordered by track: The Machine → The System → The Network → The Data → The Craft
  const ordered: { chapterId: string; stepId: string; stepTitle: string }[] = [
    // Track 1: The Machine
    { chapterId: 'fundamentals', stepId: 'fund-io', stepTitle: 'What is a computer?' },
    { chapterId: 'fundamentals', stepId: 'fund-binary', stepTitle: 'On, off, counting' },
    { chapterId: 'fundamentals', stepId: 'fund-wire', stepTitle: 'Bits on a wire' },
    { chapterId: 'foundations', stepId: 'step-gates', stepTitle: 'Light the LED with AND' },
    { chapterId: 'foundations', stepId: 'step-adder', stepTitle: 'Build a one bit full adder' },
    { chapterId: 'foundations', stepId: 'step-fetch', stepTitle: 'Watch fetch and decode' },
    { chapterId: 'memory', stepId: 'mem-register', stepTitle: 'Registers and the ALU' },
    { chapterId: 'memory', stepId: 'mem-cache', stepTitle: 'Direct-mapped cache' },
    { chapterId: 'memory', stepId: 'mem-ram', stepTitle: 'The memory hierarchy' },
    { chapterId: 'memory', stepId: 'mem-eviction', stepTitle: 'LRU eviction policy' },
    { chapterId: 'memory', stepId: 'mem-virtual', stepTitle: 'Virtual memory and the MMU' },
    { chapterId: 'memory', stepId: 'mem-paging', stepTitle: 'Paging and the TLB' },
    // Track 2: The System
    { chapterId: 'os', stepId: 'os-process', stepTitle: 'Processes and state' },
    { chapterId: 'os', stepId: 'os-scheduler', stepTitle: 'CPU scheduling' },
    { chapterId: 'os', stepId: 'os-filesystem', stepTitle: 'Files and inodes' },
    { chapterId: 'os', stepId: 'os-syscall', stepTitle: 'System calls' },
    { chapterId: 'os', stepId: 'os-threads', stepTitle: 'Threads and race conditions' },
    { chapterId: 'os', stepId: 'os-mutex', stepTitle: 'Mutexes and locking' },
    { chapterId: 'os', stepId: 'os-deadlock', stepTitle: 'Deadlock conditions' },
    { chapterId: 'compilers', stepId: 'comp-source', stepTitle: 'Source code and characters' },
    { chapterId: 'compilers', stepId: 'comp-lex', stepTitle: 'Lexing into tokens' },
    { chapterId: 'compilers', stepId: 'comp-parse', stepTitle: 'Parsing grammar' },
    { chapterId: 'compilers', stepId: 'comp-ast', stepTitle: 'Abstract syntax tree' },
    { chapterId: 'compilers', stepId: 'comp-codegen', stepTitle: 'Code generation' },
    { chapterId: 'compilers', stepId: 'comp-optimize', stepTitle: 'Optimization passes' },
    { chapterId: 'paradigms', stepId: 'par-imperative', stepTitle: 'Imperative programming' },
    { chapterId: 'paradigms', stepId: 'par-oop', stepTitle: 'Object-oriented design' },
    { chapterId: 'paradigms', stepId: 'par-encapsulation', stepTitle: 'Encapsulation and interfaces' },
    { chapterId: 'paradigms', stepId: 'par-functional', stepTitle: 'Functional programming' },
    { chapterId: 'paradigms', stepId: 'par-types', stepTitle: 'Type systems' },
    { chapterId: 'paradigms', stepId: 'par-memory', stepTitle: 'Memory ownership models' },
    // Track 3: The Network
    { chapterId: 'networks', stepId: 'net-osi', stepTitle: 'The OSI model' },
    { chapterId: 'networks', stepId: 'net-physical', stepTitle: 'Physical layer and cabling' },
    { chapterId: 'networks', stepId: 'net-ethernet', stepTitle: 'Ethernet and MAC addresses' },
    { chapterId: 'networks', stepId: 'net-switching', stepTitle: 'Switching and VLANs' },
    { chapterId: 'networks', stepId: 'net-arp', stepTitle: 'ARP: finding MAC addresses' },
    { chapterId: 'networks', stepId: 'net-worldmap', stepTitle: 'World map lab' },
    { chapterId: 'iprouting', stepId: 'ip-v4', stepTitle: 'IPv4 addressing' },
    { chapterId: 'iprouting', stepId: 'ip-subnet', stepTitle: 'Subnetting and CIDR' },
    { chapterId: 'iprouting', stepId: 'ip-v6', stepTitle: 'IPv6 fundamentals' },
    { chapterId: 'iprouting', stepId: 'ip-routing-table', stepTitle: 'Routing tables and forwarding' },
    { chapterId: 'iprouting', stepId: 'ip-static', stepTitle: 'Static and default routes' },
    { chapterId: 'iprouting', stepId: 'ip-ospf', stepTitle: 'Dynamic routing with OSPF' },
    { chapterId: 'netservices', stepId: 'ns-tcp', stepTitle: 'TCP and the three-way handshake' },
    { chapterId: 'netservices', stepId: 'ns-udp', stepTitle: 'UDP and when to use it' },
    { chapterId: 'netservices', stepId: 'ns-ports', stepTitle: 'Ports and sockets' },
    { chapterId: 'netservices', stepId: 'ns-dhcp', stepTitle: 'DHCP address assignment' },
    { chapterId: 'netservices', stepId: 'ns-nat', stepTitle: 'NAT and PAT' },
    { chapterId: 'netservices', stepId: 'ns-wireless', stepTitle: 'Wireless networking' },
    { chapterId: 'netservices', stepId: 'ns-acl', stepTitle: 'ACLs and firewalls' },
    { chapterId: 'netservices', stepId: 'ns-troubleshoot', stepTitle: 'Network troubleshooting' },
    { chapterId: 'web', stepId: 'web-dns', stepTitle: 'DNS resolution' },
    { chapterId: 'web', stepId: 'web-http', stepTitle: 'HTTP request-response' },
    { chapterId: 'web', stepId: 'web-tls', stepTitle: 'TLS handshake' },
    { chapterId: 'web', stepId: 'web-render', stepTitle: 'Browser rendering pipeline' },
    { chapterId: 'distributed', stepId: 'dist-replication', stepTitle: 'Data replication' },
    { chapterId: 'distributed', stepId: 'dist-consensus', stepTitle: 'Consensus algorithms' },
    { chapterId: 'distributed', stepId: 'dist-cap', stepTitle: 'CAP theorem' },
    { chapterId: 'distributed', stepId: 'dist-loadbalance', stepTitle: 'Load balancing' },
    { chapterId: 'distributed', stepId: 'dist-mapreduce', stepTitle: 'MapReduce' },
    { chapterId: 'distributed', stepId: 'dist-sharding', stepTitle: 'Sharding' },
    { chapterId: 'distributed', stepId: 'dist-queue', stepTitle: 'Message queues' },
    { chapterId: 'distributed', stepId: 'dist-observe', stepTitle: 'Observability' },
    // Track: The Cloud
    { chapterId: 'cloud-foundations', stepId: 'cfound-shared', stepTitle: 'Shared responsibility' },
    { chapterId: 'cloud-foundations', stepId: 'cfound-regions', stepTitle: 'Regions and zones' },
    { chapterId: 'cloud-foundations', stepId: 'cfound-models', stepTitle: 'IaaS, PaaS, and SaaS' },
    { chapterId: 'cloud-foundations', stepId: 'cfound-tenant', stepTitle: 'Multi-tenancy and isolation' },
    { chapterId: 'cloud-foundations', stepId: 'cfound-elastic', stepTitle: 'Elasticity and operational shift' },
    { chapterId: 'cloud-identity', stepId: 'cident-subjects', stepTitle: 'Principals and resources' },
    { chapterId: 'cloud-identity', stepId: 'cident-roles', stepTitle: 'Roles and delegation' },
    { chapterId: 'cloud-identity', stepId: 'cident-policies', stepTitle: 'Policies as code' },
    { chapterId: 'cloud-identity', stepId: 'cident-federation', stepTitle: 'Federation and trust' },
    { chapterId: 'cloud-identity', stepId: 'cident-secrets', stepTitle: 'Secrets and rotation' },
    { chapterId: 'cloud-networking', stepId: 'cnet-vpc', stepTitle: 'Virtual private networks' },
    { chapterId: 'cloud-networking', stepId: 'cnet-subnets', stepTitle: 'Subnets and routing intent' },
    { chapterId: 'cloud-networking', stepId: 'cnet-lb', stepTitle: 'Load balancing and health' },
    { chapterId: 'cloud-networking', stepId: 'cnet-edge', stepTitle: 'Ingress and TLS termination' },
    { chapterId: 'cloud-networking', stepId: 'cnet-segment', stepTitle: 'Segmentation and policy' },
    { chapterId: 'cloud-production', stepId: 'cprod-compute', stepTitle: 'Compute models compared' },
    { chapterId: 'cloud-production', stepId: 'cprod-storage', stepTitle: 'Storage classes and services' },
    { chapterId: 'cloud-production', stepId: 'cprod-observe', stepTitle: 'Logs, metrics, traces' },
    { chapterId: 'cloud-production', stepId: 'cprod-scale', stepTitle: 'Scaling and quotas' },
    { chapterId: 'cloud-production', stepId: 'cprod-resilience', stepTitle: 'Failure domains and recovery' },
    // Track 4: The Data
    { chapterId: 'mathcs', stepId: 'math-logic', stepTitle: 'Propositional logic' },
    { chapterId: 'mathcs', stepId: 'math-proof', stepTitle: 'Proof techniques' },
    { chapterId: 'mathcs', stepId: 'math-sets', stepTitle: 'Sets and relations' },
    { chapterId: 'mathcs', stepId: 'math-counting', stepTitle: 'Counting and combinatorics' },
    { chapterId: 'mathcs', stepId: 'math-modular', stepTitle: 'Modular arithmetic' },
    { chapterId: 'mathcs', stepId: 'math-prob', stepTitle: 'Probability basics' },
    { chapterId: 'mathcs', stepId: 'math-linalg', stepTitle: 'Linear algebra intuition' },
    { chapterId: 'dsa', stepId: 'dsa-array-list', stepTitle: 'Arrays and linked lists' },
    { chapterId: 'dsa', stepId: 'dsa-tree', stepTitle: 'Binary search trees' },
    { chapterId: 'dsa', stepId: 'dsa-hash', stepTitle: 'Hash tables' },
    { chapterId: 'dsa', stepId: 'dsa-sorting', stepTitle: 'Sorting algorithms' },
    { chapterId: 'dsa', stepId: 'dsa-graph', stepTitle: 'Graphs and traversal' },
    { chapterId: 'dsa', stepId: 'dsa-heap', stepTitle: 'Heaps and priority queues' },
    { chapterId: 'dsa', stepId: 'dsa-avl', stepTitle: 'Balanced trees (AVL)' },
    { chapterId: 'dsa', stepId: 'dsa-trie', stepTitle: 'Tries and prefix search' },
    { chapterId: 'dsa', stepId: 'dsa-union-find', stepTitle: 'Union-Find' },
    { chapterId: 'dsa', stepId: 'dsa-greedy', stepTitle: 'Greedy algorithms' },
    { chapterId: 'dsa', stepId: 'dsa-dijkstra', stepTitle: "Dijkstra's shortest path" },
    { chapterId: 'dsa', stepId: 'dsa-dp-intro', stepTitle: 'Dynamic programming intro' },
    { chapterId: 'dsa', stepId: 'dsa-dp-classic', stepTitle: 'Classic DP problems' },
    { chapterId: 'dsa', stepId: 'dsa-bigo', stepTitle: 'Big-O notation' },
    { chapterId: 'dsa', stepId: 'dsa-complexity', stepTitle: 'P, NP, and complexity classes' },
    { chapterId: 'dsa', stepId: 'dsa-halting', stepTitle: 'The halting problem' },
    { chapterId: 'databases', stepId: 'db-btree', stepTitle: 'B-tree storage' },
    { chapterId: 'databases', stepId: 'db-query', stepTitle: 'Query execution' },
    { chapterId: 'databases', stepId: 'db-transaction', stepTitle: 'Transactions' },
    { chapterId: 'databases', stepId: 'db-acid', stepTitle: 'ACID properties' },
    { chapterId: 'databases', stepId: 'db-index', stepTitle: 'Indexes' },
    { chapterId: 'databases', stepId: 'db-normalize', stepTitle: 'Normalization' },
    { chapterId: 'databases', stepId: 'db-nosql', stepTitle: 'NoSQL tradeoffs' },
    // Track 5: The Craft
    { chapterId: 'swe', stepId: 'swe-git', stepTitle: 'Version control with Git' },
    { chapterId: 'swe', stepId: 'swe-test', stepTitle: 'Testing strategies' },
    { chapterId: 'swe', stepId: 'swe-tdd', stepTitle: 'Test-driven development' },
    { chapterId: 'swe', stepId: 'swe-solid', stepTitle: 'SOLID principles' },
    { chapterId: 'swe', stepId: 'swe-patterns', stepTitle: 'Design patterns' },
    { chapterId: 'swe', stepId: 'swe-cicd', stepTitle: 'CI/CD pipelines' },
    { chapterId: 'swe', stepId: 'swe-debug', stepTitle: 'Debugging methodology' },
    { chapterId: 'security', stepId: 'sec-xor', stepTitle: 'XOR and one-time pads' },
    { chapterId: 'security', stepId: 'sec-hash', stepTitle: 'Cryptographic hashing' },
    { chapterId: 'security', stepId: 'sec-keypair', stepTitle: 'Public-key cryptography' },
    { chapterId: 'security', stepId: 'sec-signature', stepTitle: 'Digital signatures' },
    { chapterId: 'security', stepId: 'sec-pki', stepTitle: 'PKI and certificates' },
    { chapterId: 'security', stepId: 'sec-auth', stepTitle: 'Authentication flows' },
    { chapterId: 'security', stepId: 'sec-owasp', stepTitle: 'OWASP top vulnerabilities' },
    { chapterId: 'ai', stepId: 'llm-attention', stepTitle: 'Attention' },
    { chapterId: 'ai', stepId: 'llm-train-inf', stepTitle: 'Train and infer' },
    { chapterId: 'ethics', stepId: 'eth-scale', stepTitle: 'Impact at scale' },
    { chapterId: 'ethics', stepId: 'eth-bias', stepTitle: 'Algorithmic bias' },
    { chapterId: 'ethics', stepId: 'eth-privacy', stepTitle: 'Privacy and data rights' },
    { chapterId: 'ethics', stepId: 'eth-ai-safety', stepTitle: 'AI safety' },
    { chapterId: 'ethics', stepId: 'eth-accountability', stepTitle: 'Accountability' },
    { chapterId: 'ethics', stepId: 'eth-open-source', stepTitle: 'Open-source stewardship' },
    { chapterId: 'ethics', stepId: 'eth-acm', stepTitle: 'ACM Code of Ethics' },
  ]

  return ordered.find((s) => !done[s.stepId]) ?? null
}

/** Marks a lesson complete and unlocks devices per curriculum rules */
export function completeLesson(lessonId: string): ProgressState {
  const cur = loadProgress()
  if (cur.completedLessonIds.includes(lessonId)) return cur
  let inventory = [...cur.inventory]

  if (lessonId === 'foundations-golden-path') {
    inventory = uniqPush(inventory, 'pc-starter')
    inventory = uniqPush(inventory, 'vacuum-tube')
  }
  if (lessonId === 'network-fundamentals') {
    inventory = uniqPush(inventory, 'server-home')
    inventory = uniqPush(inventory, 'server-commercial')
  }
  if (lessonId === 'llm-intuition') {
    inventory = uniqPush(inventory, 'phone-slim')
    inventory = uniqPush(inventory, 'gpu-card')
  }
  if (lessonId === 'memory-hierarchy') {
    inventory = uniqPush(inventory, 'ssd-board')
  }
  if (lessonId === 'os-core') {
    inventory = uniqPush(inventory, 'terminal-retro')
  }
  if (lessonId === 'web-stack') {
    inventory = uniqPush(inventory, 'browser-engine')
  }
  if (lessonId === 'compilers-core') {
    inventory = uniqPush(inventory, 'compiler-chip')
  }
  if (lessonId === 'math-foundations') {
    inventory = uniqPush(inventory, 'math-engine')
  }
  if (lessonId === 'dsa-core') {
    inventory = uniqPush(inventory, 'algorithm-visualizer')
  }
  if (lessonId === 'db-core') {
    inventory = uniqPush(inventory, 'database-server')
  }
  if (lessonId === 'security-core') {
    inventory = uniqPush(inventory, 'hardware-key')
  }
  if (lessonId === 'swe-core') {
    inventory = uniqPush(inventory, 'workstation')
  }
  if (lessonId === 'distributed-core') {
    inventory = uniqPush(inventory, 'server-rack-cluster')
  }

  const newCompleted = [...cur.completedLessonIds, lessonId]
  const allLessonsDone = [
    'fundamentals-start',
    'foundations-golden-path',
    'network-fundamentals',
    'ip-routing-core',
    'net-services-core',
    'llm-intuition',
    'memory-hierarchy',
    'os-core',
    'web-stack',
    'compilers-core',
    'math-foundations',
    'dsa-core',
    'db-core',
    'security-core',
    'paradigms-core',
    'swe-core',
    'distributed-core',
    'cloud-foundations-core',
    'cloud-identity-core',
    'cloud-networking-core',
    'cloud-production-core',
    'ethics-core',
  ].every((id) => newCompleted.includes(id))
  if (allLessonsDone) {
    inventory = uniqPush(inventory, 'robot-arm')
  }

  return mergeProgress({
    completedLessonIds: newCompleted,
    inventory,
  })
}
