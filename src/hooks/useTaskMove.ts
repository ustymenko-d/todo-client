import useAppStore from '@/store/store'
import useTaskActions from './useTaskActions'
import { toast } from 'sonner'
import { TTask, TTaskPayload } from '@/types/tasks'

const useTaskMove = (setLoading: (loading: boolean) => void) => {
	const { handleTaskAction } = useTaskActions('edit')

	const moveTask = async (task: TTask, newFolderId: string) => {
		try {
			updateTaskInFolders(task, task.folderId!, newFolderId)
			await handleTaskAction(setLoading, createPayload(task, newFolderId), true)
		} catch (error) {
			updateTaskInFolders(task, newFolderId, task.folderId!)
			toast.error('Failed to move the task. Please try again.')
			console.error('Task move failed:', error)
		}
	}

	return { moveTask }
}

const updateTaskInFolders = (
	task: TTask,
	fromFolderId: string,
	toFolderId: string
) => {
	const movedTask = { ...task, folderId: toFolderId }

	useAppStore.getState().setFoldersWithTasks((prev) =>
		prev.map((folder) => {
			const { id, tasks, total } = folder

			if (id === fromFolderId) {
				return {
					...folder,
					tasks: tasks?.filter((t) => t.id !== task.id) || [],
					total: total ? total - 1 : 0,
				}
			}

			if (id === toFolderId) {
				return {
					...folder,
					tasks: tasks ? [...tasks, movedTask] : [movedTask],
					total: total ? total + 1 : 1,
				}
			}

			return folder
		})
	)
}

const createPayload = (task: TTask, newFolderId: string): TTaskPayload => {
	// eslint-disable-next-line @typescript-eslint/no-unused-vars
	const { subtasks, lastEdited, ...updatedTask } = {
		...task,
		folderId: newFolderId,
	}
	return updatedTask
}

export default useTaskMove
