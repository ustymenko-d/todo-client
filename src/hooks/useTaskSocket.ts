import { useEffect } from 'react'
import { getSocket } from '@/lib/socket'
import { TTask } from '@/types/tasks'
import useUpdateTasks from './useUpdateTasks'

export const useTaskSocket = () => {
	const { handleUpdateTasks } = useUpdateTasks()

	useEffect(() => {
		const socket = getSocket()

		const handlers = {
			'task:created': (data: TTask) => {
				console.log('Task created:', data)
				handleUpdateTasks('create', data)
			},
			'task:updated': (data: TTask) => {
				console.log('Task updated:', data)
				handleUpdateTasks('edit', data)
			},
			'task:toggleStatus': (data: TTask) => {
				console.log('Task status change:', data)
				handleUpdateTasks('changeStatus', data)
			},
			'task:deleted': (data: TTask) => {
				console.log('Task deleted:', data)
				handleUpdateTasks('delete', data)
			},
		}

		for (const [event, handler] of Object.entries(handlers)) {
			socket.on(event, handler)
		}

		return () => {
			for (const [event, handler] of Object.entries(handlers)) {
				socket.off(event, handler)
			}
		}
	}, [handleUpdateTasks])
}
