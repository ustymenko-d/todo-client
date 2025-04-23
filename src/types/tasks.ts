import { z } from 'zod'
import TasksValidation from '@/schemas/tasks.schema'

export type TGetTasksRequest = z.infer<typeof TasksValidation.getTasksRequest>
export type TTaskBase = z.infer<typeof TasksValidation.taskBase>
export type TTaskPayload = z.infer<typeof TasksValidation.taskPayload>
export type TTask = z.infer<typeof TasksValidation.task>

export interface ITaskResponse {
	success: boolean
	task: TTask
}

export interface IGetTasksResponse {
	success: boolean
	data: {
		pages: number
		total: number
		tasks: TTask[]
	}
}
