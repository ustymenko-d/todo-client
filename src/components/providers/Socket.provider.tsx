import useFolderSocket from '@/hooks/folders/useSocket'
import useTasksSocket from '@/hooks/tasks/useSocket'

const SocketProvider = ({ children }: { children: React.ReactNode }) => {
	useTasksSocket()
	useFolderSocket()

	return <>{children}</>
}

export default SocketProvider
