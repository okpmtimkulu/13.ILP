import type { RestartableLessonId } from '../lib/progress'
import { restartLesson } from '../lib/progress'

type Props = {
  lessonId: RestartableLessonId
  /** Short label for the lesson, shown in the confirm dialog */
  lessonTitle: string
}

export function LessonRestartControl({ lessonId, lessonTitle }: Props) {
  const onRestart = () => {
    if (
      !window.confirm(
        `Restart “${lessonTitle}”? Your completion for this chapter will be cleared, saved progress for this lab will reset to the start, and any devices this chapter unlocked will be removed until you finish again. Other finished chapters stay as they are.`,
      )
    ) {
      return
    }
    restartLesson(lessonId)
    window.location.reload()
  }

  return (
    <div className="lesson-restart-row">
      <button type="button" className="lesson-restart-btn" onClick={onRestart}>
        Restart this lesson
      </button>
    </div>
  )
}
