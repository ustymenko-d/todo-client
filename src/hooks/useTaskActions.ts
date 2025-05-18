import { useRouter, usePathname } from 'next/navigation'
import useAppStore from '@/store/store'
import TasksService from '@/services/tasks.service'
import useUpdateFolderTasks from './useUpdateFolderTasks'
import { TTask, TTaskAction, TTaskBase, TTaskPayload } from '@/types/tasks'
import { toast } from 'sonner'

const useTaskActions = (action: TTaskAction, task?: TTask) => {
	const router = useRouter()
	const pathname = usePathname()

	const closeTaskEditor = useAppStore((state) => state.closeTaskEditor)
	const closeTaskDialog = useAppStore((state) => state.closeTaskDialog)
	const updateDialogTask = useAppStore((state) => state.updateDialogTask)

	const { handleUpdateFolderTasks } = useUpdateFolderTasks()

	const performAction = async (payload?: TTaskBase | TTask) => {
		switch (action) {
			case 'create':
				return TasksService.createTask(payload as TTaskBase)
			case 'edit':
				return TasksService.editTask(payload as TTaskPayload)
			case 'changeStatus':
				return TasksService.toggleStatus(task?.id ?? '')
			case 'delete':
				return TasksService.deleteTask(task?.id ?? '')
			default:
				throw new Error('Unknown action')
		}
	}

	const handleTaskAction = async (
		setLoadingState: (state: boolean) => void,
		payload?: TTaskBase | TTaskPayload,
		skipUpdate: boolean = false
	) => {
		try {
			setLoadingState(true)

			const { data } = await performAction(payload)
			const { success, task: updatedTask } = data

			if (!success)
				throw new Error('Task action failed: response was not successful')

			toast.success('Successfuly completed')

			if (action === 'delete') closeTaskDialog()
			if (['create', 'edit'].includes(action)) closeTaskEditor()
			if (['edit', 'changeStatus'].includes(action))
				updateDialogTask(updatedTask)

			if (!skipUpdate) handleUpdateFolderTasks(action, updatedTask)

			if (pathname === '/table') router.refresh()
		} catch (error) {
			console.error(`[useTaskActions] ${action} task error:`, error)
			throw error
		} finally {
			setLoadingState(false)
		}
	}

	return { handleTaskAction }
}

export default useTaskActions
