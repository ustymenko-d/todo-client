'use client'

import { useEffect } from 'react'

import { queryClient } from '@/components/providers/Query.provider'
import { getSocket } from '@/lib/socket'

const FOLDER_EVENTS = [
	'folder:created',
	'folder:renamed',
	'folder:deleted',
] as const

const useSocket = () => {
	useEffect(() => {
		const socket = getSocket()

		const invalidateFolders = () =>
			queryClient.invalidateQueries({ queryKey: ['folders'] })

		FOLDER_EVENTS.forEach((event) => {
			socket.on(event, invalidateFolders)
		})

		return () => {
			FOLDER_EVENTS.forEach((event) => {
				socket.off(event, invalidateFolders)
			})
		}
	}, [])
}

export default useSocket
