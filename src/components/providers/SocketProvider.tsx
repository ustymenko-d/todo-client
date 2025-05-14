import { useFolderSocket } from '@/hooks/useFolderSocket'
import { useTaskSocket } from '@/hooks/useTaskSocket'

const SocketProvider = ({ children }: { children: React.ReactNode }) => {
	useTaskSocket()
	useFolderSocket()

	return <>{children}</>
}

export default SocketProvider
