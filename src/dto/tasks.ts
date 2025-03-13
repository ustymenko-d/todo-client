import { z } from 'zod'
import TasksValidation from '@/schemas/tasksSchema'

export type GetTasksRequestDto = z.infer<
	typeof TasksValidation.getTasksRequestSchema
>

export type TaskBaseDto = Omit<
	z.infer<typeof TasksValidation.taskBaseSchema>,
	'expiresAt'
> & {
	expiresAt: string | null | undefined
}

export type TaskDto = z.infer<typeof TasksValidation.taskDtoSchema>
