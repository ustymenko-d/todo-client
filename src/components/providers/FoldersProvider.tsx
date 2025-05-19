import FoldersService from '@/services/folders.service'
import useAppStore from '@/store/store'
import { usePathname } from 'next/navigation'
import { useEffect } from 'react'

const FoldersProvider = ({ children }: { children: React.ReactNode }) => {
	const pathname = usePathname()
	const foldersHydrated = useAppStore((state) => state.foldersHydrated)
	const setFoldersHydrated = useAppStore((state) => state.setFoldersHydrated)
	const setFoldersWithTasks = useAppStore((state) => state.setFoldersWithTasks)
	const isStartRoute = pathname === '/' || pathname.startsWith('/auth')

	useEffect(() => {
		if (!isStartRoute) return

		setFoldersWithTasks([])
		setFoldersHydrated(false)
	}, [isStartRoute, setFoldersWithTasks, setFoldersHydrated])

	useEffect(() => {
		if (foldersHydrated || isStartRoute) return

		const fetchFolders = async () => {
			try {
				const { data } = await FoldersService.getFolders({ page: 1, limit: 25 })
				setFoldersWithTasks(data.folders)
			} catch (err) {
				console.error('[FoldersProvider] Failed to fetch folders:', err)
			} finally {
				setFoldersHydrated(true)
			}
		}

		fetchFolders()
	}, [foldersHydrated, isStartRoute, setFoldersWithTasks, setFoldersHydrated])

	return <>{children}</>
}

export default FoldersProvider
