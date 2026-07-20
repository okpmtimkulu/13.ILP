import type { ProgressState } from '../lib/progress'
import { ALL_CHAPTER_IDS } from './tracks'
import { pathForChapter } from '../lib/chapterPaths'

/** Full vertical model: hardware at the bottom, ethics at the top. */
export const DEPTH_SEGMENTS = [
  { id: 'bits', label: 'BITS', short: 'Signals and storage' },
  { id: 'logic', label: 'LOGIC', short: 'Gates combine bits' },
  { id: 'cpu', label: 'CPU', short: 'Fetch and execute' },
  { id: 'memory', label: 'MEMORY', short: 'Caches and hierarchy' },
  { id: 'os', label: 'OS', short: 'Processes and kernels' },
  { id: 'network', label: 'NETWORK', short: 'Packets and distance' },
  { id: 'web', label: 'WEB', short: 'DNS, HTTP, and rendering' },
  { id: 'compilers', label: 'COMPILERS', short: 'Source to machine code' },
  { id: 'math', label: 'MATH', short: 'Logic and proof' },
  { id: 'dsa', label: 'DSA', short: 'Structures and algorithms' },
  { id: 'databases', label: 'DATABASES', short: 'Storage and queries' },
  { id: 'security', label: 'SECURITY', short: 'Crypto and trust' },
  { id: 'paradigms', label: 'PARADIGMS', short: 'How languages think' },
  { id: 'swe', label: 'SWE', short: 'Craft and process' },
  { id: 'distributed', label: 'DISTRIBUTED', short: 'Many machines' },
  { id: 'ethics', label: 'ETHICS', short: 'Responsibility at scale' },
] as const

export type DepthSegmentId = (typeof DEPTH_SEGMENTS)[number]['id']

/** Chapters on the home stack, in track order. */
export const HOME_STACK_ORDER = ALL_CHAPTER_IDS

/** Map chapter id → its primary lesson id */
const CHAPTER_LESSON: Record<string, string> = {
  fundamentals: 'fundamentals-start',
  foundations: 'foundations-golden-path',
  memory: 'memory-hierarchy',
  os: 'os-core',
  compilers: 'compilers-core',
  paradigms: 'paradigms-core',
  networks: 'network-fundamentals',
  iprouting: 'ip-routing-core',
  netservices: 'net-services-core',
  web: 'web-stack',
  distributed: 'distributed-core',
  'cloud-foundations': 'cloud-foundations-core',
  'cloud-identity': 'cloud-identity-core',
  'cloud-networking': 'cloud-networking-core',
  'cloud-production': 'cloud-production-core',
  mathcs: 'math-foundations',
  dsa: 'dsa-core',
  databases: 'db-core',
  swe: 'swe-core',
  security: 'security-core',
  ai: 'llm-intuition',
  ethics: 'ethics-core',
}

export function segmentDone(index: number, p: ProgressState): boolean {
  const id = DEPTH_SEGMENTS[index]?.id
  if (!id) return false
  switch (id) {
    case 'bits':
      return p.completedLessonIds.includes('fundamentals-start')
    case 'logic':
      return p.foundationsStepIndex >= 1 || p.completedLessonIds.includes('foundations-golden-path')
    case 'cpu':
      return p.completedLessonIds.includes('foundations-golden-path')
    case 'memory':
      return p.completedLessonIds.includes('memory-hierarchy')
    case 'os':
      return p.completedLessonIds.includes('os-core')
    case 'network':
      return p.completedLessonIds.includes('network-fundamentals')
    case 'web':
      return p.completedLessonIds.includes('web-stack')
    case 'compilers':
      return p.completedLessonIds.includes('compilers-core')
    case 'math':
      return p.completedLessonIds.includes('math-foundations')
    case 'dsa':
      return p.completedLessonIds.includes('dsa-core')
    case 'databases':
      return p.completedLessonIds.includes('db-core')
    case 'security':
      return p.completedLessonIds.includes('security-core')
    case 'paradigms':
      return p.completedLessonIds.includes('paradigms-core')
    case 'swe':
      return p.completedLessonIds.includes('swe-core')
    case 'distributed':
      return p.completedLessonIds.includes('distributed-core')
    case 'ethics':
      return p.completedLessonIds.includes('ethics-core')
    default:
      return false
  }
}

/** Which segment is "lit" for the current route (0–15). */
export function getActiveDepthIndex(pathname: string, p: ProgressState): number {
  if (pathname.startsWith('/learn/fundamentals')) return 0
  if (pathname.startsWith('/learn/foundations')) {
    if (p.foundationsStepIndex >= 2) return 2
    if (p.foundationsStepIndex >= 1) return 2
    return 1
  }
  if (pathname.startsWith('/learn/network')) return 5
  if (pathname.startsWith('/learn/iprouting')) return 5
  if (pathname.startsWith('/learn/netservices')) return 5
  if (pathname.startsWith('/learn/llm')) return 9
  if (pathname.startsWith('/learn/memory')) return 3
  if (pathname.startsWith('/learn/os')) return 4
  if (pathname.startsWith('/learn/web')) return 6
  if (pathname.startsWith('/learn/compilers')) return 7
  if (pathname.startsWith('/learn/math')) return 8
  if (pathname.startsWith('/learn/dsa')) return 9
  if (pathname.startsWith('/learn/databases')) return 10
  if (pathname.startsWith('/learn/security')) return 11
  if (pathname.startsWith('/learn/paradigms')) return 12
  if (pathname.startsWith('/learn/swe')) return 13
  if (pathname.startsWith('/learn/distributed')) return 14
  if (pathname.startsWith('/learn/cloud-')) return 14
  if (pathname.startsWith('/learn/ethics')) return 15
  if (pathname === '/devices') return 2
  return 0
}

export function isAiChapterLocked(p: ProgressState): boolean {
  return !p.completedLessonIds.includes('dsa-core')
}

/** Returns the route for the next incomplete chapter (track order). */
export function getContinuePath(p: ProgressState): string {
  for (const chId of ALL_CHAPTER_IDS) {
    const lessonId = CHAPTER_LESSON[chId]
    if (lessonId && !p.completedLessonIds.includes(lessonId)) {
      return pathForChapter(chId)
    }
  }
  return '/learn/fundamentals'
}
