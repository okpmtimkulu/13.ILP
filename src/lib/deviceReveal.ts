import type { DeviceId } from './progress'

const KEY = 'ilp-device-revealed'

export function getRevealedDevices(): DeviceId[] {
  try {
    const raw = localStorage.getItem(KEY)
    if (!raw) return []
    const parsed = JSON.parse(raw) as unknown
    if (!Array.isArray(parsed)) return []
    return parsed.filter((x): x is DeviceId => typeof x === 'string')
  } catch {
    return []
  }
}

export function markDeviceRevealed(id: DeviceId): void {
  const cur = new Set(getRevealedDevices())
  cur.add(id)
  try {
    localStorage.setItem(KEY, JSON.stringify([...cur]))
  } catch {
    /* ignore */
  }
}

export function clearDeviceReveals(): void {
  try {
    localStorage.removeItem(KEY)
  } catch {
    /* ignore */
  }
}
