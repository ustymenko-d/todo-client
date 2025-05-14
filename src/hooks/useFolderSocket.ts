import { useEffect, useCallback } from 'react'
import { getSocket } from '@/lib/socket'
import { IFolder } from '@/types/folders'
import useAppStore from '@/store/store'

export const useFolderSocket = () => {
	const setFoldersWithTasks = useAppStore((state) => state.setFoldersWithTasks)

	const addFolder = useCallback(
		(folder: IFolder) => {
			setFoldersWithTasks((prev) => [folder, ...prev])
		},
		[setFoldersWithTasks]
	)

	const renameFolder = useCallback(
		(folder: IFolder) => {
			setFoldersWithTasks((prev) =>
				prev.map((f) => (f.id === folder.id ? { ...f, name: folder.name } : f))
			)
		},
		[setFoldersWithTasks]
	)

	const deleteFolder = useCallback(
		(folder: IFolder) => {
			setFoldersWithTasks((prev) => prev.filter((f) => f.id !== folder.id))
		},
		[setFoldersWithTasks]
	)

	useEffect(() => {
		const socket = getSocket()

		const socketEvents: Record<string, (data: IFolder) => void> = {
			'folder:created': addFolder,
			'folder:renamed': renameFolder,
			'folder:deleted': deleteFolder,
		}

		for (const [event, handler] of Object.entries(socketEvents)) {
			socket.on(event, handler)
		}

		return () => {
			for (const [event, handler] of Object.entries(socketEvents)) {
				socket.off(event, handler)
			}
		}
	}, [addFolder, renameFolder, deleteFolder])
}
