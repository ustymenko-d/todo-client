import { z } from 'zod'
import TasksValidation from '@/schemas/tasks.schema'
import { IPagination } from './common'

export type TGetTasksRequest = z.infer<typeof TasksValidation.getTasksRequest>
export type TTaskBase = z.infer<typeof TasksValidation.taskBase>
export type TTask = z.infer<typeof TasksValidation.task>

export interface ITaskResponse {
	success: boolean
	task: TTask
}

export interface IGetTasksResponse extends IPagination {
	pages: number
	total: number
	tasks: TTask[]
}
