import { useEffect, useCallback } from 'react'
import { getSocket } from '@/lib/socket'
import { IFolder } from '@/types/folders'
import useAppStore from '@/store/store'

export const useFolderSocket = () => {
	const foldersWithTasks = useAppStore((state) => state.foldersWithTasks)
	const setFoldersWithTasks = useAppStore((state) => state.setFoldersWithTasks)

	const addFolder = useCallback(
		(folder: IFolder) => {
			if (!!foldersWithTasks?.find((f) => f.id === folder.id)) return
			setFoldersWithTasks((prev) => [folder, ...prev])
		},
		[foldersWithTasks, setFoldersWithTasks]
	)

	const renameFolder = useCallback(
		(folder: IFolder) => {
			const exists = foldersWithTasks?.find((f) => f.id === folder.id)
			if (exists?.name === folder.name) return
			setFoldersWithTasks((prev) =>
				prev.map((f) => (f.id === folder.id ? { ...f, name: folder.name } : f))
			)
		},
		[foldersWithTasks, setFoldersWithTasks]
	)

	const deleteFolder = useCallback(
		(folder: IFolder) => {
			const exists = foldersWithTasks?.some((f) => f.id === folder.id)
			if (!exists) return

			setFoldersWithTasks((prev) => prev.filter((f) => f.id !== folder.id))
		},
		[setFoldersWithTasks, foldersWithTasks]
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
