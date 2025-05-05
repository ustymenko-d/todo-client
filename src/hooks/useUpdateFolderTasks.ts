import useAppStore from '@/store/store'
import { TTask, TTaskAction } from '@/types/tasks'

const useUpdateFolderTasks = (action: TTaskAction) => {
	const foldersWithTasks = useAppStore((state) => state.foldersWithTasks)
	const setFoldersWithTasks = useAppStore((state) => state.setFoldersWithTasks)

	const handlers: Record<
		TTaskAction,
		(
			updated: typeof foldersWithTasks,
			task: TTask,
			prevId?: string | null
		) => typeof foldersWithTasks
	> = {
		create: (folders, task) => {
			if (!task.folderId) return folders
			return folders.map((folder) =>
				folder.id === task.folderId
					? { ...folder, tasks: [task, ...folder.tasks], total: ++folder.total }
					: folder
			)
		},

		edit: (folders, task, prevId) => {
			const fromId = prevId
			const toId = task.folderId

			let updated = [...folders]

			if (fromId) {
				updated = updated.map((f) =>
					f.id === fromId
						? {
								...f,
								tasks: f.tasks.filter((t) => t.id !== task.id),
								total: --f.total,
						  }
						: f
				)
			}

			if (toId) {
				updated = updated.map((f) =>
					f.id === toId
						? { ...f, tasks: [task, ...f.tasks], total: ++f.total }
						: f
				)
			}

			return updated
		},

		changeStatus: (folders, task) =>
			folders.map((folder) =>
				folder.id !== task.folderId
					? folder
					: {
							...folder,
							tasks: folder.tasks.map((t) =>
								t.id === task.id ? { ...t, completed: !t.completed } : t
							),
					  }
			),

		delete: (folders, task) => {
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
				const filteredTasks = folder.tasks.filter((t) => !idsToDelete.has(t.id))
				return {
					...folder,
					tasks: filteredTasks,
					total: filteredTasks.length,
				}
			})
		},
	}

	const handleUpdateFolderTasks = (
		updatedTask: TTask,
		previousFolderId?: string | null
	) => {
		if (!updatedTask || !Array.isArray(foldersWithTasks)) return

		const handler = handlers[action]
		if (!handler) return

		setFoldersWithTasks((prev) => handler(prev, updatedTask, previousFolderId))
	}

	return { handleUpdateFolderTasks }
}

export default useUpdateFolderTasks
