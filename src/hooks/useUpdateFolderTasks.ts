import useAppStore from '@/store/store'
import { TTask, TTaskAction } from '@/types/tasks'
import { IFolderWithTasks } from '@/types/folders'
import { TASK_FETCH_LIMIT } from '@/const'
import isEqual from 'lodash.isequal'

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

		if (!handler || isHydrated(action, foldersWithTasks, updatedTask)) return

		setFoldersWithTasks((prev) => handler(prev, updatedTask))
	}

	return { handleUpdateFolderTasks }
}

const findTaskById = (folders: IFolderWithTasks[], taskId: string) =>
	folders
		.flatMap((folder) => folder.tasks ?? [])
		.find((task) => task.id === taskId)

const isHydrated = (
	action: TTaskAction,
	folders: IFolderWithTasks[],
	task: TTask
) => {
	const existingTask = findTaskById(folders, task.id)
	if (!existingTask) return false

	return (
		{
			create: true,
			changeStatus: existingTask.completed === task.completed,
			edit: isEqual(existingTask, task),
			delete: !existingTask,
		}[action] ?? false
	)
}

const updateFoldersWithTask = (
	folders: IFolderWithTasks[],
	updatedTask: TTask,
	remove = false
) =>
	folders.map((folder) =>
		folder.id === updatedTask.folderId
			? {
					...folder,
					tasks: remove
						? (folder.tasks ?? []).filter((t) => t.id !== updatedTask.id)
						: [updatedTask, ...(folder.tasks ?? [])],
					total: Math.max((folder.total ?? 0) + (remove ? -1 : 1), 0),
					pages: Math.ceil(
						Math.max((folder.total ?? 0) + (remove ? -1 : 1), 0) /
							TASK_FETCH_LIMIT
					),
			  }
			: folder
	)

const handleCreate: THandlerProps = (folders, task) =>
	task.folderId && !findTaskById(folders, task.id)
		? updateFoldersWithTask(folders, task)
		: folders

const handleEdit: THandlerProps = (folders, updatedTask) => {
	const fromFolderId = findTaskById(folders, updatedTask.id)?.folderId

	const withoutOldTask = fromFolderId
		? updateFoldersWithTask(folders, updatedTask, true)
		: folders

	return updatedTask.folderId
		? updateFoldersWithTask(withoutOldTask, updatedTask)
		: withoutOldTask
}

const handleChangeStatus: THandlerProps = (folders, updatedTask) =>
	folders.map((folder) =>
		folder.id === updatedTask.folderId
			? {
					...folder,
					tasks: folder.tasks?.map((task) =>
						task.id === updatedTask.id
							? { ...task, completed: updatedTask.completed }
							: task
					),
			  }
			: folder
	)

const handleDelete: THandlerProps = (folders, updatedTask) => {
	const allTasks = folders.flatMap((folder) => folder.tasks)

	const collectAllTaskIds = (taskId: string): string[] => {
		const directChildren = allTasks.filter(
			(task) => task?.parentTaskId === taskId && task !== undefined
		)

		return [
			taskId,
			...directChildren.flatMap((child) =>
				child ? collectAllTaskIds(child.id) : []
			),
		]
	}

	const idsToDelete = new Set(collectAllTaskIds(updatedTask.id))

	return folders.map((folder) => ({
		...folder,
		tasks: folder.tasks?.filter((t) => !idsToDelete.has(t.id)),
		total: Math.max(
			folder.tasks?.filter((t) => !idsToDelete.has(t.id)).length ?? 0,
			0
		),
		pages: Math.ceil(
			(folder.tasks?.filter((t) => !idsToDelete.has(t.id)).length ?? 0) /
				TASK_FETCH_LIMIT
		),
	}))
}

export default useUpdateFolderTasks
