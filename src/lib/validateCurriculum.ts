import { curriculum } from '../content/curriculum'
import { curriculumSchema } from '../content/schema'

/** Call in development to ensure bundled curriculum matches the Zod schema */
export function validateBundledCurriculum() {
  return curriculumSchema.safeParse(curriculum)
}
