interface ITaskBase {
	id: string
	title: string
	description: string | null
	completed: boolean
	createdAt: Date
	expiresAt: Date | null
	folderId: string | null
	subtasks: ITask[] | []
}

export interface ITask extends ITaskBase {
	parentTaskId: string | null
}

export interface ITaskResponse {
	success: boolean
	task: ITask
}

export interface IGetTasksResponse {
	success: boolean
	data: {
		pages: number
		total: number
		tasks: ITask[]
	}
}
