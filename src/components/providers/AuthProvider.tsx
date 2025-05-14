import { useEffect, useState } from 'react'
import { usePathname } from 'next/navigation'
import useAppStore from '@/store/store'
import AuthService from '@/services/auth.service'
import FoldersService from '@/services/folders.service'

const AuthProvider = ({ children }: { children: React.ReactNode }) => {
	const pathname = usePathname()
	const needResetAuth = pathname === '/' || pathname.startsWith('/auth')

	const authHydrated = useAppStore((state) => state.authHydrated)
	const setAuthHydrated = useAppStore((state) => state.setAuthHydrated)
	const accountInfo = useAppStore((state) => state.accountInfo)
	const setAccountInfo = useAppStore((state) => state.setAccountInfo)
	const setFoldersWithTasks = useAppStore((state) => state.setFoldersWithTasks)

	const [storeReady, setStoreReady] = useState(false)

	useEffect(() => {
		const unsub = useAppStore.persist.onFinishHydration(() => {
			setStoreReady(true)
		})

		if (useAppStore.persist.hasHydrated()) {
			setStoreReady(true)
		}

		return unsub
	}, [])

	useEffect(() => {
		if (needResetAuth) {
			setAccountInfo(null)
			setFoldersWithTasks([])
			setAuthHydrated(false)
		}
	}, [needResetAuth, setAccountInfo, setAuthHydrated, setFoldersWithTasks])

	useEffect(() => {
		if (!storeReady || authHydrated || needResetAuth) return

		const fetchAccountData = async () => {
			try {
				if (!accountInfo) {
					const { data } = await AuthService.getAccountInfo()
					setAccountInfo(data)
				}

				const { data: foldersData } = await FoldersService.getFolders({
					page: 1,
					limit: 25,
				})

				setFoldersWithTasks(foldersData.folders)
			} catch {
				setAccountInfo(null)
				await AuthService.clearAuthCookies()
			} finally {
				setAuthHydrated(true)
			}
		}

		fetchAccountData()
	}, [
		accountInfo,
		authHydrated,
		needResetAuth,
		setAccountInfo,
		setAuthHydrated,
		setFoldersWithTasks,
		storeReady,
	])

	return <>{children}</>
}

export default AuthProvider
