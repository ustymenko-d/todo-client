import { z } from 'zod'
import TasksValidation from '@/schemas/tasks.schema'
import { IPagination } from './common'

export type TGetTasksRequest = z.infer<typeof TasksValidation.getTasksRequest>
export type TTaskBase = z.infer<typeof TasksValidation.taskBase>
export type TTaskPayload = z.infer<typeof TasksValidation.task>
export type TTask = TTaskPayload & {
	lastEdited: string
	subtasks: TTask[]
}

export interface ITaskResponse {
	success: boolean
	task: TTask
	message?: string
}

export interface IGetTasksResponse extends IPagination {
	pages: number
	total: number
	tasks: TTask[]
}

export type TTaskAction = 'create' | 'edit' | 'changeStatus' | 'delete'
