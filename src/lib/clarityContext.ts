import { curriculum } from '../content/curriculum'

/** Stack narrative from CURRICULUM_PLAN: bottom (bits) → top (models). */
const STACK_REMINDER = `The course follows one vertical stack: bits → logic/CPU → memory → OS → networks → web/DSA → then AI/DB/security branches. Answer in plain language and tie ideas to this spine when helpful.`

export function buildClarityContext(pathname: string): string {
  const path = pathname.replace(/\/$/, '') || '/'

  if (path === '/devices') {
    return `${STACK_REMINDER}\n\nScreen: Devices — unlocked machines from completed labs. Inner layers explain parts (CPU, net, etc.).`
  }

  const lessonPath: [string, string][] = [
    ['/learn/fundamentals', 'fundamentals-start'],
    ['/learn/foundations', 'foundations-golden-path'],
    ['/world', 'world-cables'],
    ['/learn/llm', 'llm-intuition'],
  ]

  for (const [prefix, lid] of lessonPath) {
    if (path === prefix || path.startsWith(`${prefix}/`)) {
      const lesson = curriculum.lessons.find((l) => l.id === lid)
      const ch = lesson ? curriculum.chapters.find((c) => c.id === lesson.chapterId) : undefined
      if (lesson && ch) {
        return `${STACK_REMINDER}\n\nLesson: "${lesson.title}" (${ch.title}).\nSummary: ${lesson.description}\nBridge: ${lesson.connection}`
      }
    }
  }

  return `${STACK_REMINDER}\n\nScreen: ${path} (general ILP Lab navigation).`
}
