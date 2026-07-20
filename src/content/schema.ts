import { z } from 'zod'

/** Validates lesson packs loaded from JSON or authored in CMS later */
export const lessonModeSchema = z.enum(['build', 'observe', 'mixed'])

export const lessonStepSchema = z.object({
  id: z.string(),
  title: z.string(),
  mode: lessonModeSchema,
  /** Optional hint for UI copy */
  shortHint: z.string().optional(),
})

export const lessonSchema = z.object({
  id: z.string(),
  title: z.string(),
  description: z.string(),
  /** Why this lesson exists and how it links to the rest of CS */
  connection: z.string().optional(),
  chapterId: z.string(),
  steps: z.array(lessonStepSchema),
})

export const chapterSchema = z.object({
  id: z.string(),
  title: z.string(),
  summary: z.string(),
  /** Bigger picture: how this track relates to a full CS roadmap */
  connection: z.string().optional(),
  lessonIds: z.array(z.string()),
})

export const curriculumSchema = z.object({
  version: z.number(),
  chapters: z.array(chapterSchema),
  lessons: z.array(lessonSchema),
})

export type LessonMode = z.infer<typeof lessonModeSchema>
export type LessonStep = z.infer<typeof lessonStepSchema>
export type Lesson = z.infer<typeof lessonSchema>
export type Chapter = z.infer<typeof chapterSchema>
export type Curriculum = z.infer<typeof curriculumSchema>
