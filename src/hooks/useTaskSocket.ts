import { useEffect } from 'react'
import { getSocket } from '@/lib/socket'
import { TTask } from '@/types/tasks'
import useUpdateFolderTasks from './useUpdateFolderTasks'

export const useTaskSocket = () => {
	const { handleUpdateFolderTasks: handleCreate } =
		useUpdateFolderTasks('create')
	const { handleUpdateFolderTasks: handleEdit } = useUpdateFolderTasks('edit')
	const { handleUpdateFolderTasks: handleToggleStatus } =
		useUpdateFolderTasks('changeStatus')
	const { handleUpdateFolderTasks: handleDelete } =
		useUpdateFolderTasks('delete')

	useEffect(() => {
		const socket = getSocket()

		const handlers = {
			'task:created': (data: TTask) => {
				console.log('Task created:', data)
				handleCreate(data)
			},
			'task:updated': (data: TTask) => {
				console.log('Task updated:', data)
				handleEdit(data)
			},
			'task:toggleStatus': (data: TTask) => {
				console.log('Task status change:', data)
				handleToggleStatus(data)
			},
			'task:deleted': (data: TTask) => {
				console.log('Task deleted:', data)
				handleDelete(data)
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
	}, [handleCreate, handleDelete, handleEdit, handleToggleStatus])
}
