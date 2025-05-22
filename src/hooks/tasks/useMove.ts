import useActions from './useActions'
import { toast } from 'sonner'
import { TTask, TTaskPayload } from '@/types/tasks'
import useUpdate from './useUpdate'

const useMove = (setLoading: (loading: boolean) => void) => {
	const { handleUpdateTasks } = useUpdate()
	const { handleTaskAction } = useActions('edit')

	const moveTask = async (task: TTask, newFolderId: string) => {
		try {
			handleUpdateTasks('edit', { ...task, folderId: newFolderId })
			await handleTaskAction(setLoading, createPayload(task, newFolderId), true)
		} catch (error) {
			toast.error('Failed to move the task.')
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

export default useMove
