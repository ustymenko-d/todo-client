import { useRouter, usePathname } from 'next/navigation'
import useAppStore from '@/store/store'
import useUpdateFolderTasks from './useUpdateFolderTasks'
import { TTask, TTaskAction, TTaskBase } from '@/types/tasks'
import { toast } from 'sonner'
import TasksService from '@/services/tasks.service'

const useTaskActions = (action: TTaskAction, task?: TTask) => {
	const router = useRouter()
	const pathname = usePathname()

	const closeTaskEditor = useAppStore((state) => state.closeTaskEditor)
	const closeTaskDialog = useAppStore((state) => state.closeTaskDialog)
	const updateDialogTask = useAppStore((state) => state.updateDialogTask)

	const { handleUpdateFolderTasks } = useUpdateFolderTasks(action)
	// const previousFolderId = task?.folderId

	const performAction = async (payload?: TTaskBase | TTask) => {
		switch (action) {
			case 'create':
				return TasksService.createTask(payload as TTaskBase)
			case 'edit':
				return TasksService.editTask(payload as TTask)
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
		payload?: TTaskBase | TTask,
		previousFolderId?: string | null
	) => {
		try {
			setLoadingState(true)

			const { data } = await performAction(payload)
			const { success, task: updatedTask } = data

			if (!success) {
				toast.error('Something went wrong!')
				return
			}

			toast.success('Successfuly completed')

			if (action === 'delete') closeTaskDialog()
			if (['create', 'edit'].includes(action)) closeTaskEditor()
			if (['edit', 'changeStatus'].includes(action))
				updateDialogTask(updatedTask)

			handleUpdateFolderTasks(updatedTask, task?.folderId ?? previousFolderId)

			if (pathname === '/table') router.refresh()
		} catch (error) {
			console.error(`[useTaskActions] ${action} task error:`, error)
			toast.error('Something went wrong!')
		} finally {
			setLoadingState(false)
		}
	}

	return { handleTaskAction }
}

export default useTaskActions
