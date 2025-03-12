import { z } from 'zod'
import TasksValidation from '@/schemas/tasksSchema'

export type GetTasksRequestDto = z.infer<
	typeof TasksValidation.getTasksRequestSchema
>

export type TaskBaseDto = z.infer<typeof TasksValidation.taskBaseSchema>

export type TaskDto = z.infer<typeof TasksValidation.taskDtoSchema>
