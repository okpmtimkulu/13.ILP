/** Route path for the primary lesson in a curriculum chapter */

const CHAPTER_ROUTES: Record<string, string> = {
  fundamentals: '/learn/fundamentals',
  foundations: '/learn/foundations',
  networks: '/learn/networks',
  iprouting: '/learn/iprouting',
  netservices: '/learn/netservices',
  ai: '/learn/llm',
  memory: '/learn/memory',
  os: '/learn/os',
  web: '/learn/web',
  compilers: '/learn/compilers',
  mathcs: '/learn/math',
  dsa: '/learn/dsa',
  databases: '/learn/databases',
  security: '/learn/security',
  paradigms: '/learn/paradigms',
  swe: '/learn/swe',
  distributed: '/learn/distributed',
  'cloud-foundations': '/learn/cloud-foundations',
  'cloud-identity': '/learn/cloud-identity',
  'cloud-networking': '/learn/cloud-networking',
  'cloud-production': '/learn/cloud-production',
  ethics: '/learn/ethics',
}

export function pathForChapter(chapterId: string): string {
  return CHAPTER_ROUTES[chapterId] ?? '/'
}

export function isChapterPathActive(pathname: string, chapterId: string): boolean {
  const p = pathForChapter(chapterId)
  return pathname === p || pathname.startsWith(`${p}/`)
}
