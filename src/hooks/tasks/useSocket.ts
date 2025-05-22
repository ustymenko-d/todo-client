import { useEffect } from 'react'
import { getSocket } from '@/lib/socket'
import { useQueryClient } from '@tanstack/react-query'
import useUpdate from './useUpdate'
import { TTask } from '@/types/tasks'

const useSocket = () => {
	const { handleUpdateTasks } = useUpdate()
	const queryClient = useQueryClient()

	useEffect(() => {
		const socket = getSocket()

		const handlers = {
			'task:created': (data: TTask) => {
				console.log('Task created:', data)
				handleUpdateTasks('create', data)
				queryClient.invalidateQueries({ queryKey: ['tasks'] })
			},
			'task:updated': (data: TTask) => {
				console.log('Task updated:', data)
				handleUpdateTasks('edit', data)
				queryClient.invalidateQueries({ queryKey: ['tasks'] })
			},
			'task:toggleStatus': (data: TTask) => {
				console.log('Task status change:', data)
				handleUpdateTasks('changeStatus', data)
				queryClient.invalidateQueries({ queryKey: ['tasks'] })
			},
			'task:deleted': (data: TTask) => {
				console.log('Task deleted:', data)
				handleUpdateTasks('delete', data)
				queryClient.invalidateQueries({ queryKey: ['tasks'] })
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
	}, [handleUpdateTasks, queryClient])
}

export default useSocket
