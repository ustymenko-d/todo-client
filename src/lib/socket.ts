'use client'

import { io, Socket } from 'socket.io-client'

let socket: Socket | null = null

export const getSocket = (): Socket => {
	if (!socket) {
		socket = io(process.env.NEXT_PUBLIC_BACKEND_URL!, {
			transports: ['websocket'],
		})
	}

	return socket
}

export const getSocketId = (): string | null => socket?.id ?? null
