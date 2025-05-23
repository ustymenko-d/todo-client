import { useCallback, useEffect } from 'react'
import { getSocket } from '@/lib/socket'
import { useQueryClient } from '@tanstack/react-query'
import useUpdate from './useUpdate'
import { TTask, TTaskAction } from '@/types/tasks'
import useAppStore from '@/store/store'

const useSocket = () => {
	const { handleUpdateTasks } = useUpdate()
	const queryClient = useQueryClient()
	const { open, task } = useAppStore((state) => state.taskDialogSettings)
	const updateDialogTask = useAppStore((state) => state.updateDialogTask)
	const closeTaskDialog = useAppStore((state) => state.closeTaskDialog)

	const handleTaskEvent = useCallback(
		(eventType: TTaskAction, data: TTask) => {
			console.log(`Task ${eventType}: `, data)
			handleUpdateTasks(eventType, data)
			queryClient.invalidateQueries({ queryKey: ['tasks'] })

			if (open && task?.id === data.id) {
				if (eventType === 'create') return
				if (eventType === 'delete') closeTaskDialog()
				else updateDialogTask(data)
			}
		},
		[
			handleUpdateTasks,
			queryClient,
			open,
			task,
			updateDialogTask,
			closeTaskDialog,
		]
	)

	useEffect(() => {
		const socket = getSocket()
		const events: Record<TTaskAction, string> = {
			create: 'task:created',
			edit: 'task:updated',
			changeStatus: 'task:toggleStatus',
			delete: 'task:deleted',
		}

		const listeners = Object.entries(events).map(([action, event]) => {
			const listener = (data: TTask) =>
				handleTaskEvent(action as TTaskAction, data)
			socket.on(event, listener)
			return { event, listener }
		})

		return () => {
			listeners.forEach(({ event, listener }) => {
				socket.off(event, listener)
			})
		}
	}, [handleTaskEvent])
}

export default useSocket
