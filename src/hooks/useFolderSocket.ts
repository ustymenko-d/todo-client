import { useEffect } from 'react'
import { getSocket } from '@/lib/socket'
import { IFolder } from '@/types/folders'
import useUpdateFolders from './useUpdateFolders'

export const useFolderSocket = () => {
	const { handleUpdateFolders } = useUpdateFolders()

	useEffect(() => {
		const socket = getSocket()

		const socketEvents: Record<string, (data: IFolder) => void> = {
			'folder:created': (data) => handleUpdateFolders('create', data),
			'folder:renamed': (data) => handleUpdateFolders('rename', data),
			'folder:deleted': (data) => handleUpdateFolders('delete', data),
		}

		for (const [event, handler] of Object.entries(socketEvents)) {
			socket.on(event, handler)
		}

		return () => {
			for (const [event, handler] of Object.entries(socketEvents)) {
				socket.off(event, handler)
			}
		}
	}, [handleUpdateFolders])
}
