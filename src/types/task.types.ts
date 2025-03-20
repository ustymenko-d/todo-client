interface ITaskBase {
	completed: boolean
	createdAt: Date
	description: string | null
	expiresAt: Date | null
	folderId: string | null
	id: string
	subtasks: ISubtask[] | []
}

export interface ITask extends ITaskBase {
	parentTaskId: string | null
}

export interface ISubtask extends ITaskBase {
	parentTaskId: string
}
