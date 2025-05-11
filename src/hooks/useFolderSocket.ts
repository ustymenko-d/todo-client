import { useEffect, useCallback } from 'react'
import { getSocket } from '@/lib/socket'
import { IFolder } from '@/types/folders'
import useAppStore from '@/store/store'

export const useFolderSocket = () => {
	const setFoldersWithTasks = useAppStore((state) => state.setFoldersWithTasks)
	const setAccountInfo = useAppStore((state) => state.setAccountInfo)

	const addFolder = useCallback(
		(folder: IFolder) => {
			setAccountInfo((prev) =>
				prev ? { ...prev, folders: [folder, ...(prev.folders || [])] } : prev
			)
		},
		[setAccountInfo]
	)

	const renameFolder = useCallback(
		(folder: IFolder) => {
			setAccountInfo((prev) =>
				prev
					? {
							...prev,
							folders: (prev.folders || []).map((f) =>
								f.id === folder.id ? { ...f, name: folder.name } : f
							),
					  }
					: prev
			)

			setFoldersWithTasks((prev) =>
				prev.map((f) => (f.id === folder.id ? { ...f, name: folder.name } : f))
			)
		},
		[setAccountInfo, setFoldersWithTasks]
	)

	const deleteFolder = useCallback(
		(folder: IFolder) => {
			setAccountInfo((prev) =>
				prev
					? {
							...prev,
							folders: (prev.folders || []).filter((f) => f.id !== folder.id),
					  }
					: prev
			)

			setFoldersWithTasks((prev) => prev.filter((f) => f.id !== folder.id))
		},
		[setAccountInfo, setFoldersWithTasks]
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
