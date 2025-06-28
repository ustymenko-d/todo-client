'use client'

import { ReactNode } from 'react'

import useFolderSocket from '@/hooks/folders/useSocket'
import useTasksSocket from '@/hooks/tasks/useSocket'

const SocketProvider = ({ children }: { children: ReactNode }) => {
	useTasksSocket()
	useFolderSocket()

	return children
}

export default SocketProvider
