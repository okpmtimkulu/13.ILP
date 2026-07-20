/**
 * Tracks group chapters into narrative arcs.
 * The sidebar renders these as section headings with chapters nested inside.
 */
export interface Track {
  id: string
  title: string
  chapterIds: string[]
}

export const TRACKS: Track[] = [
  {
    id: 'machine',
    title: 'The Machine',
    chapterIds: ['fundamentals', 'foundations', 'memory'],
  },
  {
    id: 'system',
    title: 'The System',
    chapterIds: ['os', 'compilers', 'paradigms'],
  },
  {
    id: 'network',
    title: 'The Network',
    chapterIds: ['networks', 'iprouting', 'netservices', 'web', 'distributed'],
  },
  {
    id: 'cloud',
    title: 'The Cloud',
    chapterIds: ['cloud-foundations', 'cloud-identity', 'cloud-networking', 'cloud-production'],
  },
  {
    id: 'data',
    title: 'The Data',
    chapterIds: ['mathcs', 'dsa', 'databases'],
  },
  {
    id: 'craft',
    title: 'The Craft',
    chapterIds: ['swe', 'security', 'ai', 'ethics'],
  },
]

/** Flat ordered list of all chapter ids across all tracks. */
export const ALL_CHAPTER_IDS = TRACKS.flatMap((t) => t.chapterIds)
