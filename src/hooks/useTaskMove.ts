import useAppStore from '@/store/store'
import useTaskActions from './useTaskActions'
import { toast } from 'sonner'
import { TTask } from '@/types/tasks'

const useTaskMove = (setLoading: (v: boolean) => void) => {
	const setFoldersWithTasks = useAppStore((s) => s.setFoldersWithTasks)
	const { handleTaskAction } = useTaskActions('edit')

	const moveTask = async (task: TTask, newFolderId: string) => {
		const prevFolderId = task.folderId
		const taskId = task.id

		setFoldersWithTasks((prev) =>
			prev.map((folder) => {
				if (folder.id === prevFolderId) {
					return {
						...folder,
						tasks: folder.tasks.filter((t) => t.id !== taskId),
						total: folder.total - 1,
					}
				}
				if (folder.id === newFolderId) {
					return {
						...folder,
						tasks: [...folder.tasks, { ...task, folderId: newFolderId }],
						total: folder.total + 1,
					}
				}
				return folder
			})
		)

		const updatedTask: Partial<TTask> = {
			...task,
			folderId: newFolderId,
		}

		delete updatedTask.subtasks
		delete updatedTask.lastEdited

		try {
			await handleTaskAction(setLoading, updatedTask as TTask, true)
		} catch (error) {
			setFoldersWithTasks((prev) =>
				prev.map((folder) => {
					if (folder.id === prevFolderId) {
						return {
							...folder,
							tasks: [...folder.tasks, task],
							total: folder.total + 1,
						}
					}
					if (folder.id === newFolderId) {
						return {
							...folder,
							tasks: folder.tasks.filter((t) => t.id !== taskId),
							total: folder.total - 1,
						}
					}
					return folder
				})
			)

			toast.error('Failed to move the task. Please try again.')
			console.error('Task move failed:', error)
		}
	}

	return { moveTask }
}

export default useTaskMove
