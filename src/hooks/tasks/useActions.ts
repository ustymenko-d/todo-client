'use client'

import { useQueryClient } from '@tanstack/react-query'
import { usePathname, useRouter } from 'next/navigation'
import { toast } from 'sonner'

import TasksAPI from '@/api/tasks.api'
import useAppStore from '@/store/store'
import { TResponseState } from '@/types/common'
import { TTask, TTaskAction, TTaskBase, TTaskPayload } from '@/types/tasks'

import { useWithRecaptcha } from '../useWithRecaptcha'

const useActions = (action: TTaskAction, task?: TTask) => {
	const router = useRouter()
	const pathname = usePathname()
	const queryClient = useQueryClient()
	const { withRecaptcha } = useWithRecaptcha('task_action')

	const openTask = useAppStore(s => s.taskDialogSettings.task)
	const closeTaskEditor = useAppStore(s => s.closeTaskEditor)
	const closeTaskDialog = useAppStore(s => s.closeTaskDialog)
	const updateDialogTask = useAppStore(s => s.updateDialogTask)

	const performAction = async (payload?: TTaskBase | TTask) => {
		switch (action) {
			case 'create':
				return TasksAPI.createTask(await withRecaptcha<TTaskBase>(payload as TTaskBase))
			case 'edit':
				return TasksAPI.editTask(payload as TTaskPayload)
			case 'changeStatus':
				return TasksAPI.toggleStatus(task?.id ?? '')
			case 'delete':
				return TasksAPI.deleteTask(task?.id ?? '')
			default:
				throw new Error('Unknown action')
		}
	}

	const handleTaskAction = async (
		setLoadingState: (state: TResponseState) => void,
		payload?: TTaskBase | TTaskPayload
	) => {
		try {
			setLoadingState('pending')

			const { success, message, task: updatedTask } = await performAction(payload)

			if (!success) {
				setLoadingState('error')
				toast.error(message ?? 'Something went wrong')
				throw new Error(`[useTasksActions] ${action} failed`)
			}

			setLoadingState('success')
			toast.success(message || 'Successfuly completed')
			queryClient.invalidateQueries({ queryKey: ['tasks'] })

			if (action === 'delete') closeTaskDialog()

			if (['create', 'edit'].includes(action)) closeTaskEditor()

			if (['edit'].includes(action)) updateDialogTask(updatedTask)

			if (['changeStatus'].includes(action)) {
				if (updatedTask.id === openTask?.id) updateDialogTask({ ...openTask, ...updatedTask })

				if (updatedTask.parentTaskId) {
					queryClient.removeQueries({
						predicate: query => {
							const queryKey = query.queryKey
							return Array.isArray(queryKey) && queryKey[0] === 'tasks'
						},
					})
				}
			}

			if (pathname === '/table') router.refresh()
		} catch (error) {
			console.error(`[useTasksActions] ${action} task error:`, error)
			throw error
		}
	}

	return { handleTaskAction }
}

export default useActions
