const KEY = 'ilp-stack-celebrate'

export type StackCelebrate = {
  from: string
  to: string
  ts: number
}

export function setStackCelebrate(from: string, to: string): void {
  try {
    sessionStorage.setItem(KEY, JSON.stringify({ from, to, ts: Date.now() } satisfies StackCelebrate))
  } catch {
    /* ignore */
  }
}

/** Read and remove. Call when Home loads to show one-time spark animation. */
export function consumeStackCelebrate(): StackCelebrate | null {
  try {
    const raw = sessionStorage.getItem(KEY)
    if (!raw) return null
    sessionStorage.removeItem(KEY)
    return JSON.parse(raw) as StackCelebrate
  } catch {
    return null
  }
}

export function clearStackCelebrate(): void {
  try {
    sessionStorage.removeItem(KEY)
  } catch {
    /* ignore */
  }
}
