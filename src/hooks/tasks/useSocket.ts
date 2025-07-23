'use client'

import { useQueryClient } from '@tanstack/react-query'
import { useCallback, useEffect } from 'react'

import { getSocket } from '@/lib/socket'
import useAppStore from '@/store/store'
import { TTask, TTaskAction } from '@/types/tasks'

const useSocket = () => {
	const queryClient = useQueryClient()

	const { open, task } = useAppStore(s => s.taskDialogSettings)
	const updateDialogTask = useAppStore(s => s.updateDialogTask)
	const closeTaskDialog = useAppStore(s => s.closeTaskDialog)

	const handleTaskEvent = useCallback(
		(eventType: TTaskAction, data: TTask) => {
			queryClient.invalidateQueries({ queryKey: ['tasks'] })

			if (open && task?.id === data.id) {
				if (eventType === 'create') return
				if (eventType === 'delete') closeTaskDialog()
				else updateDialogTask(data)
			}
		},
		[closeTaskDialog, open, queryClient, task?.id, updateDialogTask]
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
			const listener = (data: TTask) => handleTaskEvent(action as TTaskAction, data)
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
