'use client'

import { useQueryClient } from '@tanstack/react-query'
import { usePathname,useRouter } from 'next/navigation'
import { toast } from 'sonner'

import TasksService from '@/services/tasks.service'
import useAppStore from '@/store/store'
import { TTask, TTaskAction, TTaskBase, TTaskPayload } from '@/types/tasks'

const useActions = (action: TTaskAction, task?: TTask) => {
	const router = useRouter()
	const pathname = usePathname()

	const closeTaskEditor = useAppStore((s) => s.closeTaskEditor)
	const closeTaskDialog = useAppStore((s) => s.closeTaskDialog)
	const updateDialogTask = useAppStore((s) => s.updateDialogTask)

	const queryClient = useQueryClient()

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
		payload?: TTaskBase | TTaskPayload
	) => {
		try {
			setLoadingState(true)

			const { data } = await performAction(payload)
			const { success, message, task: updatedTask } = data

			if (!success) {
				toast.error(message ?? 'Something went wrong')
				throw new Error('Task action failed: response was not successful')
			}

			toast.success('Successfuly completed')

			queryClient.invalidateQueries({ queryKey: ['tasks'] })

			if (action === 'delete') closeTaskDialog()
			if (['create', 'edit'].includes(action)) closeTaskEditor()
			if (['edit', 'changeStatus'].includes(action))
				updateDialogTask(updatedTask)

			if (pathname === '/table') router.refresh()
		} catch (error) {
			console.error(`[useActions] ${action} task error:`, error)
			throw error
		} finally {
			setLoadingState(false)
		}
	}

	return { handleTaskAction }
}

export default useActions
