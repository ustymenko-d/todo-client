import useAppStore from '@/store/store'
import { TTask, TTaskAction } from '@/types/tasks'
import { IFolderWithTasks } from '@/types/folders'

type THandlerProps = (
	folders: IFolderWithTasks[],
	task: TTask
) => IFolderWithTasks[]

const handleCreate: THandlerProps = (folders, task) => {
	if (!task.folderId) return folders

	return folders.map((folder) =>
		folder.id === task.folderId
			? {
					...folder,
					tasks: [task, ...folder.tasks],
					total: folder.total + 1,
			  }
			: folder
	)
}

const handleEdit: THandlerProps = (folders, updatedTask) => {
	const fromFolder = folders.find((folder) =>
		folder.tasks.some((t) => t.id === updatedTask.id)
	)
	if (!fromFolder) return folders

	const fromId = fromFolder.id
	const toId = updatedTask.folderId

	const foldersWithoutTask = folders.map((folder) =>
		folder.id === fromId
			? {
					...folder,
					tasks: folder.tasks.filter((t) => t.id !== updatedTask.id),
					total: folder.total - 1,
			  }
			: folder
	)

	if (fromId === toId) {
		return folders.map((folder) =>
			folder.id === fromId
				? {
						...folder,
						tasks: folder.tasks.map((t) =>
							t.id === updatedTask.id ? updatedTask : t
						),
				  }
				: folder
		)
	}

	if (toId) {
		return foldersWithoutTask.map((folder) =>
			folder.id === toId
				? {
						...folder,
						tasks: [updatedTask, ...folder.tasks],
						total: folder.total + 1,
				  }
				: folder
		)
	}

	return foldersWithoutTask
}

const handleChangeStatus: THandlerProps = (folders, task) =>
	folders.map((folder) =>
		folder.id !== task.folderId
			? folder
			: {
					...folder,
					tasks: folder.tasks.map((t) =>
						t.id === task.id ? { ...t, completed: !t.completed } : t
					),
			  }
	)

const handleDelete: THandlerProps = (folders, task) => {
	const allTasks = folders.flatMap((folder) => folder.tasks)

	const collectAllTaskIds = (taskId: string): string[] => {
		const directChildren = allTasks.filter((t) => t.parentTaskId === taskId)
		return [
			taskId,
			...directChildren.flatMap((child) => collectAllTaskIds(child.id)),
		]
	}

	const idsToDelete = new Set(collectAllTaskIds(task.id))

	return folders.map((folder) => {
		const remainingTasks = folder.tasks.filter((t) => !idsToDelete.has(t.id))
		return {
			...folder,
			tasks: remainingTasks,
			total: remainingTasks.length,
		}
	})
}

const useUpdateFolderTasks = (action: TTaskAction) => {
	const foldersWithTasks = useAppStore((state) => state.foldersWithTasks)
	const setFoldersWithTasks = useAppStore((state) => state.setFoldersWithTasks)

	const handlers: Record<TTaskAction, THandlerProps> = {
		create: handleCreate,
		edit: handleEdit,
		changeStatus: handleChangeStatus,
		delete: handleDelete,
	}

	const handleUpdateFolderTasks = (updatedTask: TTask) => {
		if (!updatedTask || !Array.isArray(foldersWithTasks)) return

		const handler = handlers[action]
		if (!handler) return

		setFoldersWithTasks((prev) => handler(prev, updatedTask))
	}

	return { handleUpdateFolderTasks }
}

export default useUpdateFolderTasks
