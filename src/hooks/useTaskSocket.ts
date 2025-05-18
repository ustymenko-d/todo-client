import { useEffect } from 'react'
import { getSocket } from '@/lib/socket'
import { TTask } from '@/types/tasks'
import useUpdateFolderTasks from './useUpdateFolderTasks'

export const useTaskSocket = () => {
	const { handleUpdateFolderTasks } = useUpdateFolderTasks()

	useEffect(() => {
		const socket = getSocket()

		const handlers = {
			'task:created': (data: TTask) => {
				console.log('Task created:', data)
				handleUpdateFolderTasks('create', data)
			},
			'task:updated': (data: TTask) => {
				console.log('Task updated:', data)
				handleUpdateFolderTasks('edit', data)
			},
			'task:toggleStatus': (data: TTask) => {
				console.log('Task status change:', data)
				handleUpdateFolderTasks('changeStatus', data)
			},
			'task:deleted': (data: TTask) => {
				console.log('Task deleted:', data)
				handleUpdateFolderTasks('delete', data)
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
	}, [handleUpdateFolderTasks])
}
