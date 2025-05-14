import useAppStore from '@/store/store'
import { TTask, TTaskAction } from '@/types/tasks'
import { IFolderWithTasks } from '@/types/folders'

type THandlerProps = (
	folders: IFolderWithTasks[],
	task: TTask
) => IFolderWithTasks[]

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

const handleCreate: THandlerProps = (folders, task) => {
	if (!task.folderId) return folders

	return folders.map((folder) =>
		folder.id === task.folderId
			? {
					...folder,
					tasks: [task, ...(folder.tasks ?? [])],
					total: folder.total ? folder.total + 1 : 1,
			  }
			: folder
	)
}

const handleEdit: THandlerProps = (folders, updatedTask) => {
	const fromFolder = folders.find((folder) =>
		folder?.tasks?.some((t) => t.id === updatedTask.id)
	)

	if (!fromFolder) return folders

	const fromId = fromFolder.id
	const toId = updatedTask.folderId

	const foldersWithoutTask = folders.map((folder) =>
		folder.id === fromId
			? {
					...folder,
					tasks: (folder.tasks ?? []).filter(
						(task) => task.id !== updatedTask.id
					),
					total: folder.total ? folder.total - 1 : 0,
			  }
			: folder
	)

	if (fromId === toId) {
		return folders.map((folder) =>
			folder.id === fromId
				? {
						...folder,
						tasks: (folder.tasks ?? []).map((t) =>
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
						tasks: [updatedTask, ...(folder.tasks ?? [])],
						total: folder.total ? folder.total + 1 : 1,
				  }
				: folder
		)
	}

	return foldersWithoutTask
}

const handleChangeStatus: THandlerProps = (folders, updatedTask) =>
	folders.map((folder) =>
		folder.id === updatedTask.folderId
			? {
					...folder,
					tasks: folder?.tasks?.map((task) =>
						task.id === updatedTask.id
							? { ...task, completed: !task.completed }
							: task
					),
			  }
			: folder
	)

const handleDelete: THandlerProps = (folders, updatedTask) => {
	const allTasks = folders.flatMap((folder) => folder.tasks)

	const collectAllTaskIds = (taskId: string): string[] => {
		const directChildren = allTasks.filter(
			(task) => task?.parentTaskId === taskId
		)

		return [
			taskId,
			...directChildren
				.filter((child): child is TTask => child !== undefined)
				.flatMap((child) => collectAllTaskIds(child.id)),
		]
	}

	const idsToDelete = new Set(collectAllTaskIds(updatedTask.id))

	return folders.map((folder) => {
		const remainingTasks = folder?.tasks?.filter((t) => !idsToDelete.has(t.id))

		return {
			...folder,
			tasks: remainingTasks,
			total: remainingTasks?.length,
		}
	})
}

export default useUpdateFolderTasks
