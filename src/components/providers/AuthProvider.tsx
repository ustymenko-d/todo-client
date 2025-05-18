import { useEffect, useState } from 'react'
import { usePathname } from 'next/navigation'
import useAppStore from '@/store/store'
import AuthService from '@/services/auth.service'
import FoldersService from '@/services/folders.service'

const AuthProvider = ({ children }: { children: React.ReactNode }) => {
	const pathname = usePathname()

	const authHydrated = useAppStore((state) => state.authHydrated)
	const setAuthHydrated = useAppStore((state) => state.setAuthHydrated)
	const setAccountInfo = useAppStore((state) => state.setAccountInfo)
	const setFoldersWithTasks = useAppStore((state) => state.setFoldersWithTasks)

	const [storeHydrated, setStoreHydrated] = useState(false)

	const isStartRoute = pathname === '/' || pathname.startsWith('/auth')

	useEffect(() => {
		const unsub = useAppStore.persist.onFinishHydration(() => {
			setStoreHydrated(true)
		})

		if (useAppStore.persist.hasHydrated()) {
			setStoreHydrated(true)
		}

		return unsub
	}, [])

	useEffect(() => {
		if (!isStartRoute) return

		setAccountInfo(null)
		setFoldersWithTasks([])
		setAuthHydrated(false)
	}, [isStartRoute, setAccountInfo, setAuthHydrated, setFoldersWithTasks])

	useEffect(() => {
		if (!storeHydrated || authHydrated || isStartRoute) return

		const hydrateAccount = async () => {
			try {
				const { data: account } = await AuthService.getAccountInfo()
				setAccountInfo(account)

				const { data: foldersData } = await FoldersService.getFolders({
					page: 1,
					limit: 25,
				})
				setFoldersWithTasks(foldersData.folders)
			} catch {
				setAccountInfo(null)
				setFoldersWithTasks([])
				await AuthService.clearAuthCookies()
			} finally {
				setAuthHydrated(true)
			}
		}

		hydrateAccount()
	}, [
		storeHydrated,
		authHydrated,
		isStartRoute,
		setAccountInfo,
		setFoldersWithTasks,
		setAuthHydrated,
	])

	return <>{children}</>
}

export default AuthProvider
