const KEY = 'ilp-last-visit'

export type LastVisit = {
  at: number
  path: string
  label: string
}

const PATH_LABELS: Record<string, string> = {
  '/': 'Home',
  '/learn/fundamentals': 'Fundamentals',
  '/learn/foundations': 'Foundations',
  '/world': 'World map',
  '/learn/llm': 'LLM intuition',
  '/devices': 'Devices',
}

export function recordVisit(pathname: string): void {
  if (pathname === '/') return
  const label = PATH_LABELS[pathname] ?? pathname
  try {
    localStorage.setItem(KEY, JSON.stringify({ at: Date.now(), path: pathname, label } satisfies LastVisit))
  } catch {
    /* ignore */
  }
}

/** Text for Home when the last session was long enough ago to feel like a return. */
export function getReturnVisitLine(minGapMs = 1000 * 60 * 5): string | null {
  try {
    const raw = localStorage.getItem(KEY)
    if (!raw) return null
    const v = JSON.parse(raw) as LastVisit
    if (Date.now() - v.at < minGapMs) return null
    return `Last time you were in ${v.label}. Pick up where the stack left you.`
  } catch {
    return null
  }
}

export function clearLastVisit(): void {
  try {
    localStorage.removeItem(KEY)
  } catch {
    /* ignore */
  }
}
