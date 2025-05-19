// import useUpdateTasks from './useUpdateTasks'
import useTaskActions from './useTaskActions'
import { toast } from 'sonner'
import { TTask, TTaskPayload } from '@/types/tasks'

const useTaskMove = (setLoading: (loading: boolean) => void) => {
	// const { handleUpdateTasks } = useUpdateTasks()
	const { handleTaskAction } = useTaskActions('edit')

	const moveTask = async (task: TTask, newFolderId: string) => {
		try {
			// handleUpdateTasks('edit', { ...task, folderId: newFolderId })
			await handleTaskAction(setLoading, createPayload(task, newFolderId))
		} catch (error) {
			toast.error('Failed to move the task. Please try again.')
			console.error('Task move failed:', error)
		}
	}

	return { moveTask }
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
