import useAppStore from '@/store/store'
import { TTask, TTaskAction } from '@/types/tasks'
import { IFolderWithTasks } from '@/types/folders'
import { TASK_FETCH_LIMIT } from '@/const'
import isEqual from 'lodash.isequal'

type THandlerProps = (
	folders: IFolderWithTasks[],
	task: TTask
) => IFolderWithTasks[]

const useUpdate = () => {
	const foldersWithTasks = useAppStore((state) => state.foldersWithTasks)
	const setFoldersWithTasks = useAppStore((state) => state.setFoldersWithTasks)

	const handlers: Record<TTaskAction, THandlerProps> = {
		create: handleCreate,
		edit: handleEdit,
		changeStatus: handleChangeStatus,
		delete: handleDelete,
	}

	const handleUpdateTasks = (action: TTaskAction, updatedTask: TTask) => {
		const handler = handlers[action]

		if (isHydrated(action, foldersWithTasks, updatedTask)) return

		setFoldersWithTasks((prev) => handler(prev, updatedTask))
	}

	return { handleUpdateTasks }
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

const handleCreate: THandlerProps = (folders, task) =>
	task.folderId && !findTaskById(folders, task.id)
		? folders.map((folder) =>
				folder.id === task.folderId
					? {
							...folder,
							tasks: [task, ...(folder.tasks ?? [])],
							total: Math.max((folder.total ?? 0) + 1, 0),
							pages: Math.ceil(
								Math.max((folder.total ?? 0) + 1, 0) / TASK_FETCH_LIMIT
							),
					  }
					: folder
		  )
		: folders

const handleEdit: THandlerProps = (folders, updatedTask) => {
	const existingTask = findTaskById(folders, updatedTask.id)
	if (!existingTask) return folders

	const folderIdChanged = existingTask.folderId !== updatedTask.folderId

	let updatedFolders = folders

	if (folderIdChanged) {
		// Видалити з усіх папок (переміщення)
		updatedFolders = folders.map((folder) => ({
			...folder,
			tasks: folder.tasks?.filter((t) => t.id !== updatedTask.id),
			total: Math.max(
				folder.tasks?.filter((t) => t.id !== updatedTask.id).length ?? 0,
				0
			),
			pages: Math.ceil(
				(folder.tasks?.filter((t) => t.id !== updatedTask.id).length ?? 0) /
					TASK_FETCH_LIMIT
			),
		}))

		// Додати в нову папку
		updatedFolders = updatedFolders.map((folder) =>
			folder.id === updatedTask.folderId
				? {
						...folder,
						tasks: [updatedTask, ...(folder.tasks ?? [])],
						total: Math.max((folder.total ?? 0) + 1, 0),
						pages: Math.ceil(
							Math.max((folder.total ?? 0) + 1, 0) / TASK_FETCH_LIMIT
						),
				  }
				: folder
		)
	} else {
		// Просто оновити в тій самій папці
		updatedFolders = folders.map((folder) =>
			folder.id === updatedTask.folderId
				? {
						...folder,
						tasks: folder.tasks?.map((t) =>
							t.id === updatedTask.id ? { ...t, ...updatedTask } : t
						),
				  }
				: folder
		)
	}

	return updatedFolders
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

export default useUpdate
